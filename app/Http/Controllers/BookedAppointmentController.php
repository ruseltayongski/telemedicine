<?php

namespace App\Http\Controllers;

use App\Models\BookedAppointment;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class BookedAppointmentController extends Controller
{
    public function index(Request $request): Response
    {
        $bookedAppointments = BookedAppointment::with(['appointment', 'patient'])
            ->orderBy('created_at', 'desc')
            ->paginate(1);

        return Inertia::render('BookedAppointments/Index', [
            'bookedAppointments' => $bookedAppointments
        ]);
    }
}
