<?php

namespace App\Http\Controllers;

use App\Models\BookedAppointment;
use App\Models\Appointment;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Log;
use App\Mail\AppointmentConfirmed;
use App\Mail\AppointmentCancelled;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;

class BookedAppointmentController extends Controller
{
    public function bookedAppointments(Request $request): Response
    {
        $user = auth()->user();
        $bookedAppointments = BookedAppointment::with(['appointment.doctor', 'patient', 'prescription', 'lab_request'])
            ->where('patient_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);
        
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
        $type = $request->input('type', 'new'); // 'new' or 'follow_up'

        if (!$appointment) {
            return Redirect::back()->withErrors(['error' => 'Appointment slot not available']);
        }

        // Check for overlapping appointments within ±30 mins on the same date
        $selectedTime = Carbon::parse($request->selected_time);
        $conflictingBooking = BookedAppointment::
            where('appointment_id', $appointment->id)
            ->get()
            ->filter(function ($booking) use ($selectedTime) {
                $existingTime = Carbon::parse($booking->selected_time);
                return abs($existingTime->diffInMinutes($selectedTime)) < 30;
            })
            ->first();

        if ($conflictingBooking) {
            return Redirect::back()->withErrors(['error' => 'Theres another appointment within 30 minutes of the selected time. Please choose a different slot.', 'title' => 'Appointment Slot Conflict']);
        }

        $existingBooking = BookedAppointment::where('appointment_id', $appointment->id)
            ->where('patient_id', Auth::id())
            ->first();

        if ($existingBooking && $type !== 'follow_up') {
            return Redirect::back()->withErrors(['error' => 'You have already booked this appointment. Please check your schedule for details.', 'title' => 'Appointment Already Booked']);
        }
        
        $bookingCode = null;
        if ($type === 'follow_up') {
            if(!$existingBooking) {
                return Redirect::back()->withErrors(['error' => 'Error booking follow-up appointment']);
            }
            $bookingCode = $existingBooking->booking_code;
        } else {
            // Generate a unique booking_code for 'new'
            do {
                $bookingCode = 'BOOK-' . strtoupper(Str::random(7));
            } while (BookedAppointment::where('booking_code', $bookingCode)->exists());
        }

        // Create the booked appointment
        BookedAppointment::create([
            'appointment_id' => $appointment->id,
            'patient_id' => Auth::id(),
            'status' => 'pending',
            'type' => $type,
            'selected_time' => $request->selected_time,
            'remarks' => $request->remarks,
            'booking_code' => $bookingCode,
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

        // Send confirmation email to patient if status is set to confirmed
        if ($request->status === 'confirmed') {
            $patient = $booking->patient;
            
            // Send email to patient
            Mail::to($patient->email)->send(new AppointmentConfirmed($booking));
        }
        else if ($request->status === 'cancelled') {
            $patient = $booking->patient;
            
            // Send email to patient
            Mail::to($patient->email)->send(new AppointmentCancelled($booking));
        }

        if ($request->status === 'confirmed') {
            session()->flash('success', 'Booking status updated successfully! A confirmation email has been sent to the patient.');
        } else {
            session()->flash('success', 'Booking status updated to ' . ucfirst($request->status) . ' successfully!');
        }
        return redirect()->back();
    }

    public function createFollowUpAppointment(Request $request)
    {
        $appointment = Appointment::create([
            'title' => $request->title,
            'description' => $request->description,
            'date_start' => $request->date_start,
            'date_end' => $request->date_start,
            'slot' => $request->slot,
            'doctor_id' => $request->doctor_id,
        ]);

        $booked = BookedAppointment::create([
            'booking_code' =>  $request->booking_code,
            'appointment_id' => $appointment->id,
            'patient_id' => $request->patient_id,
            'status' => 'confirmed',
            'type' => 'follow_up',
            'selected_time' => $request->selected_time,
            'remarks' => $request->remarks,
        ]);

        $patient = User::find($request->patient_id);
        Mail::to($patient->email)->send(new AppointmentConfirmed($booked));

        return response()->json([
            'message' => 'Follow-up appointment successfully saved.',
            'appointment' => $appointment,
            'booking' => $booked,
        ], 201);
    }

}
