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
}
