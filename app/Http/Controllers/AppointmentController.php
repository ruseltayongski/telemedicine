<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Appointment;

class AppointmentController extends Controller
{
    // Index (with pagination)
    public function index(Request $request)
    {
        $query = Appointment::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', "%{$search}%");
        }

        $appointments = $query->paginate(20);
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
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
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
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
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