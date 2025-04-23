<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Inertia\Response;
use Carbon\Carbon;
use App\Models\BookedAppointment;

class HomeController extends Controller
{
    public function index(): Response
    {
        $specializations = DB::table('specializations')->select('id', 'name')->get();
        
        $facilities = DB::table('facility')
            ->select('id', 'name', 'type')
            ->get();
        
        $doctors = DB::table('users')
            ->where('role_id', 2) // Assuming role_id 2 is for doctors
            ->select('id', 'name', 'specialization_id', 'facility_id')
            ->get();

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'specializations' => $specializations,
            'facilities' => $facilities,
            'doctors' => $doctors,
        ]);
    }

    public function testApi() {
        $now = Carbon::now();
        $nowTime = $now->format('H:i:s');

        $appointments = BookedAppointment::with(['appointment', 'patient', 'appointment.doctor'])
                ->select('booked_appointments.*')
                ->addSelect(DB::raw("TIMESTAMPDIFF(MINUTE, STR_TO_DATE('$nowTime', '%H:%i:%s'), selected_time) as time_difference"))
                ->where('status', 'confirmed')
                //->whereRaw("TIMESTAMPDIFF(MINUTE, STR_TO_DATE('$nowTime', '%H:%i:%s'), selected_time) = 2")
                ->whereHas('appointment', function ($query) use ($now) {
                    $query->whereDate('date_start', $now->toDateString());
                })
                ->get();
        
        return $appointments;
    }

    public function dashboard(): Response {
        return Inertia::render('Dashboard', [
            'stats' => json_encode([
                'totalDoctors' => 100,
                'totalPatients' => 1000,
                'totalAdmins' => 5,
                'totalAppointments' => 1000,
                'bookedAppointments' => 520,
                'facilities' => 20,
                'totalLabTests' => 70,
                'totalSpecializations' => 10,
                'totalPrescriptions' => 450,
                'appointmentsByMonth' => [
                    'new' => [80, 120, 90, 110, 100, 130, 150, 140, 120, 110, 100, 90],
                    'followUp' => [40, 60, 45, 55, 50, 65, 75, 70, 60, 55, 50, 45]
                ],
                'appointmentStatusCounts' => [
                    'pending' => 150,
                    'confirmed' => 300,
                    'cancelled' => 50,
                    'rejected' => 20
                ],
                'facilityTypeCounts' => [
                    'government' => 8,
                    'private' => 12
                ],
                'labTestCategories' => [
                    'names' => ['Blood', 'Urine', 'Imaging', 'Cardio', 'Other'],
                    'counts' => [24, 18, 12, 9, 7]
                ],
                'recentAppointments' => [
                    [ 
                        'patientName' => "Jane Smith", 
                        'doctorName' => "Dr. Robert Johnson",
                        'title' => "General Checkup", 
                        'date' => "2025-04-22",
                        'type' => "new",
                        'status' => "confirmed",
                        'patientImg' => "admin/assets/images/faces/5.jpg",
                        'doctorImg' => "admin/assets/images/faces/2.jpg"
                    ],
                    [ 
                        'patientName' => "Michael Brown", 
                        'doctorName' => "Dr. Sarah Lee",
                        'title' => "Cardiology Follow-up", 
                        'date' => "2025-04-23",
                        'type' => "follow_up",
                        'status' => "pending",
                        'patientImg' => "admin/assets/images/faces/3.jpg",
                        'doctorImg' => "admin/assets/images/faces/4.jpg"
                    ],
                    [ 
                        'patientName' => "David Wilson", 
                        'doctorName' => "Dr. Emily Chen",
                        'title' => "Dermatology Consultation", 
                        'date' => "2025-04-24",
                        'type' => "new",
                        'status' => "confirmed",                        
                        'patientImg' => "admin/assets/images/faces/6.jpg",
                        'doctorImg' => "admin/assets/images/faces/7.jpg"
                    ]
                ]
            ])
        ]);
    }
}
