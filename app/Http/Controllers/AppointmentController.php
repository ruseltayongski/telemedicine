<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Appointment;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    // Index (with pagination)
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Appointment::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', "%{$search}%");
        }

        $appointments = $query->where('doctor_id',$user->id)->paginate(20);
        return Inertia::render('Appointments/Index', [
            'appointments' => $appointments,
            'search' => $request->input('search'),
        ]);
    }

    // Create
    public function create()
    {
        return Inertia::render('Appointments/Create');
    }

    // Store
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'date_start' => 'required|date',
            // 'date_end' => 'required|date|after:date_end',
        ]);

        Appointment::create($request->all());
        return redirect()->route('appointments.index')->with('success', 'Appointment created successfully.');
    }

    // Edit
    public function edit(Appointment $appointment)
    {
        return Inertia::render('Appointments/Edit', ['appointment' => $appointment]);
    }

    // Update
    public function update(Request $request, Appointment $appointment)
    {
        $request->validate([
            'title' => 'required',
            'date_start' => 'required|date',
            // 'date_end' => 'required|date|after:date_start',
        ]);

        $appointment->update($request->all());
        return redirect()->route('appointments.index')->with('success', 'Appointment updated successfully.');
    }

    // Delete
    public function destroy(Appointment $appointment)
    {
        $appointment->delete();
        return redirect()->route('appointments.index')->with('success', 'Appointment deleted successfully.');
    }
}