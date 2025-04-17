<?php

namespace App\Http\Controllers;

use App\Models\BookedAppointment;
use App\Models\Appointment;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Log;

class BookedAppointmentController extends Controller
{
    public function bookedAppointments(Request $request): Response
    {
        $user = auth()->user();
        $bookedAppointments = BookedAppointment::with(['appointment', 'patient', 'prescription'])
            ->where('patient_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        return Inertia::render('BookedAppointments/Index', [
            'bookedAppointments' => $bookedAppointments
        ]);
    }

    public function calendar(Request $request): Response
    //public function calendar(Request $request)
    {
        $query = Appointment::with(['user']);

        if ($request->filled('facility')) {
            $query = $query->whereHas('user', function ($q) use ($request) {
                $q->where('facility_id', $request->query('facility'));
            });
        }

        if ($request->filled('doctor')) {
            $query = $query->whereHas('user', function ($q) use ($request) {
                $q->where('id', $request->query('doctor'));
            });
        }

        $appointments = $query->get();
        return Inertia::render('Appointments/Calendar', [
            'appointments' => $appointments,
            'selected' => [
                'facility' => $request->query('facility'),
                'doctor' => $request->query('doctor'),
            ],
        ]);
    }

    public function book(Request $request)
    {
        $appointment = Appointment::find($request->id);

        if (!$appointment) {
            return Redirect::back()->withErrors(['error' => 'Appointment slot not available']);
        }

        $existingBooking = BookedAppointment::where('appointment_id', $appointment->id)
            ->where('patient_id', Auth::id())
            ->first();

        if ($existingBooking) {
            return Redirect::back()->withErrors(['error' => 'You have already booked this appointment']);
        }

        // Create a new booked appointment
        BookedAppointment::create([
            'appointment_id' => $appointment->id,
            'patient_id' => Auth::id(),
            'status' => 'pending',
            'selected_time' => $request->selected_time,
            'remarks' => $request->remarks,
        ]);

        return Redirect::back()->with('success', 'Appointment successfully booked!');
    }

    public function manageBooking()
    {
        // Get the authenticated doctor
        $doctor = Auth::user();

        // Make sure the user is a doctor (assuming role_id 2 is for doctors)
        if ($doctor->role_id !== 2) {
            return redirect()->route('dashboard')->with('error', 'Unauthorized access');
        }

        // Get all appointments that belong to the doctor
        $pendingBookings = BookedAppointment::with(['appointment', 'patient'])
            ->whereHas('appointment', function($query) use ($doctor) {
                $query->where('doctor_id', $doctor->id);
            })
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Get all confirmed appointments
        $confirmedBookings = BookedAppointment::with(['appointment', 'patient'])
            ->whereHas('appointment', function($query) use ($doctor) {
                $query->where('doctor_id', $doctor->id);
            })
            ->where('status', 'confirmed')
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Get all rejected appointments
        $cancelledBookings = BookedAppointment::with(['appointment', 'patient'])
            ->whereHas('appointment', function($query) use ($doctor) {
                $query->where('doctor_id', $doctor->id);
            })
            ->where('status', 'cancelled')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Doctor/ManageBookings', [
            'pendingBookings' => $pendingBookings,
            'confirmedBookings' => $confirmedBookings,
            'cancelledBookings' => $cancelledBookings,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Update the booking status (confirm or reject)
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:confirmed,cancelled'
        ]);

        // Get the booking
        $booking = BookedAppointment::findOrFail($id);
        
        // Check if the booking belongs to the doctor
        $doctor = Auth::user();
        $appointmentBelongsToDoctor = $booking->appointment->doctor_id === $doctor->id;
        
        if (!$appointmentBelongsToDoctor) {
            return back()->with('error', 'Unauthorized action');
        }

        // Update the status
        $booking->status = $request->status;
        $booking->save();

        session()->flash('success', 'Booking status updated successfully!');
    
        return redirect()->back();
    }

}
