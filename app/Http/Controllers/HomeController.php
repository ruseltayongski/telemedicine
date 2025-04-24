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
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Appointment;
use App\Models\Prescription;
use App\Models\LabTest;
use App\Models\LabRequest;
use Barryvdh\DomPDF\Facade\Pdf;
use Kreait\Laravel\Firebase\Facades\Firebase;

class HomeController extends Controller
{
    public function testFirebase()
    {
        $database = Firebase::database();

        $newData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'role' => 'admin',
        ];

        // Set to a specific path
        $database->getReference('users')->push($newData); // Auto-generated key
        // Or use set() for specific key: $database->getReference('users/user123')->set($newData);

        return response()->json(['message' => 'Data inserted to Firebase']);
    }

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

        $patients = DB::table('users')
        ->where('role_id', 3)
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
            'patients' => $patients,
        ]);
    }

    public function doctorReport() {        
        $data = $this->dashboardData();
        $pdf = PDF::loadView('pdf.doctor_report', [
            'data' => $data
        ]);
        return $pdf->stream('Doctor Report.pdf');
    }

    public function dashboardData() {
        // $doctorId = Auth::id();
        $doctorId = 3;
        $doctor = User::find($doctorId);
        
        // Get current date
        $now = Carbon::now();
        $today = $now->format('Y-m-d');
        $tomorrow = $now->copy()->addDay()->format('Y-m-d');
        $startOfMonth = $now->copy()->startOfMonth()->format('Y-m-d');
        
        // Calculate all stats for doctor dashboard
        $doctorStats = $this->getDoctorDashboardStats($doctorId, $today, $tomorrow, $startOfMonth);
        return $doctorStats;
    }

    /**
     * Get all necessary statistics for doctor dashboard
     *
     * @param int $doctorId
     * @param string $today
     * @param string $tomorrow
     * @param string $startOfMonth
     * @return array
     */
    private function getDoctorDashboardStats($doctorId, $today, $tomorrow, $startOfMonth)
    {
        $doctor = User::find($doctorId);
        
        // Get basic doctor info
        $stats = [
            'doctorName' => $doctor->name,
            'doctorSpecialty' => $this->getDoctorSpecialty($doctor->specialization_id),
        ];
        
        // Get patient stats
        $stats['totalPatients'] = $this->getTotalPatients($doctorId);
        $stats['newPatients'] = $this->getNewPatients($doctorId, $startOfMonth);
        
        // Get appointment stats
        $stats['appointmentsToday'] = $this->getAppointmentsCount($doctorId, $today);
        $stats['appointmentsTomorrow'] = $this->getAppointmentsCount($doctorId, $tomorrow);
        $stats['completedAppointments'] = $this->getCompletedAppointmentsCount($doctorId);
        
        // Get monthly appointments
        $stats['appointmentsByMonth'] = $this->getAppointmentsByMonth($doctorId);
        
        // Get appointment types distribution
        $appointmentTypes = $this->getAppointmentsByType($doctorId);
        $stats['appointmentsByType'] = [
            'new' => $appointmentTypes['new'] ?? 0,
            'followUp' => $appointmentTypes['follow_up'] ?? 0
        ];
        
        // Get patient demographics
        $stats['patientDemographics'] = $this->getPatientDemographics($doctorId);
        
        // Get today's appointments
        $stats['upcomingAppointments'] = $this->getTodaysAppointments($doctorId, $today);
        
        // Get referral stats
        $stats['referrals'] = [
            'sent' => 35, // Placeholder - implement actual referral data when available
            'received' => 22 // Placeholder - implement actual referral data when available
        ];
        
        // Get prescription stats
        $prescriptionStats = $this->getPrescriptionStats($doctorId, $startOfMonth);
        $stats['prescriptionStats'] = [
            'total' => $prescriptionStats['total'],
            'thisMonth' => $prescriptionStats['thisMonth']
        ];
        
        // Get lab request stats
        $labStats = $this->getLabRequestStats($doctorId);
        $stats['labRequestStats'] = [
            'total' => $labStats['total'],
            'pending' => $labStats['pending'],
            'completed' => $labStats['completed']
        ];
        
        return $stats;
    }
    
    /**
     * Get doctor specialty name
     * 
     * @param int|null $specializationId
     * @return string
     */
    private function getDoctorSpecialty($specializationId)
    {
        // This is a placeholder - implement mapping from specialization_id to specialty name
        $specialties = [
            1 => 'Cardiology',
            2 => 'Neurology',
            3 => 'Pediatrics',
            4 => 'Internal Medicine',
            5 => 'Orthopedics'
        ];
        
        return $specialties[$specializationId] ?? 'General Medicine';
    }
    
    /**
     * Get total patients count for doctor
     * 
     * @param int $doctorId
     * @return int
     */
    private function getTotalPatients($doctorId)
    {
        return DB::table('booked_appointments')
            ->join('users', 'users.id', '=', 'booked_appointments.patient_id')
            ->where('booked_appointments.status', '!=', 'rejected')
            ->join('appointments', 'appointments.id', '=', 'booked_appointments.appointment_id')
            ->where('appointments.doctor_id', $doctorId)
            ->distinct('booked_appointments.patient_id')
            ->count('booked_appointments.patient_id');
    }
    
    /**
     * Get new patients count this month
     * 
     * @param int $doctorId
     * @param string $startOfMonth
     * @return int
     */
    private function getNewPatients($doctorId, $startOfMonth)
    {
        return DB::table('booked_appointments')
            ->join('users', 'users.id', '=', 'booked_appointments.patient_id')
            ->where('booked_appointments.status', '!=', 'rejected')
            ->where('booked_appointments.created_at', '>=', $startOfMonth)
            ->join('appointments', 'appointments.id', '=', 'booked_appointments.appointment_id')
            ->where('appointments.doctor_id', $doctorId)
            ->distinct('booked_appointments.patient_id')
            ->count('booked_appointments.patient_id');
    }
    
    /**
     * Get appointments count for a specific date
     * 
     * @param int $doctorId
     * @param string $date
     * @return int
     */
    private function getAppointmentsCount($doctorId, $date)
    {
        return DB::table('booked_appointments')
            ->join('appointments', 'appointments.id', '=', 'booked_appointments.appointment_id')
            ->where('appointments.doctor_id', $doctorId)
            ->where('appointments.date_start', '=', $date)
            ->where('booked_appointments.status', 'confirmed')
            ->count();
    }
    
    /**
     * Get total completed appointments count
     * 
     * @param int $doctorId
     * @return int
     */
    private function getCompletedAppointmentsCount($doctorId)
    {
        $today = Carbon::now()->format('Y-m-d');
        
        return DB::table('booked_appointments')
            ->join('appointments', 'appointments.id', '=', 'booked_appointments.appointment_id')
            ->where('appointments.doctor_id', $doctorId)
            ->where(function($query) use ($today) {
                $query->where('appointments.date_start', '<', $today)
                    ->orWhere(function($q) use ($today) {
                        $q->where('appointments.date_start', '=', $today)
                            ->where('booked_appointments.status', 'confirmed');
                    });
            })
            ->count();
    }
    
    /**
     * Get appointments count by month for the last 12 months
     * 
     * @param int $doctorId
     * @return array
     */
    // private function getAppointmentsByMonth($doctorId)
    // {
    //     $results = [];
    //     $now = Carbon::now();
        
    //     // Get appointments for each of the last 12 months
    //     for ($i = 11; $i >= 0; $i--) {
    //         $date = $now->copy()->subMonths($i);
    //         $monthStart = $date->copy()->startOfMonth()->format('Y-m-d');
    //         $monthEnd = $date->copy()->endOfMonth()->format('Y-m-d');
            
    //         $count = DB::table('booked_appointments')
    //             ->join('appointments', 'appointments.id', '=', 'booked_appointments.appointment_id')
    //             ->where('appointments.doctor_id', $doctorId)
    //             ->whereBetween('appointments.date_start', [$monthStart, $monthEnd])
    //             ->where('booked_appointments.status', '!=', 'rejected')
    //             ->count();
                
    //         $results[] = $count;
    //     }
        
    //     return $results;
    // }

    private function getAppointmentsByMonth($doctorId)
    {
        $results = [];
        $now = Carbon::now();
        
        // Get appointments for each of the last 12 months
        for ($i = 11; $i >= 0; $i--) {
            $date = $now->copy()->subMonths($i);
            $monthStart = $date->copy()->startOfMonth()->format('Y-m-d');
            $monthEnd = $date->copy()->endOfMonth()->format('Y-m-d');
            
            $count = DB::table('booked_appointments')
                ->join('appointments', 'appointments.id', '=', 'booked_appointments.appointment_id')
                ->where('appointments.doctor_id', $doctorId)
                ->whereBetween('booked_appointments.created_at', [$monthStart.' 00:00:00', $monthEnd.' 23:59:59'])
                ->where('booked_appointments.status', '!=', 'rejected')
                ->count();
                
            $results[] = $count;
        }
        
        return $results;
    }
    
    /**
     * Get appointments by type (new vs follow-up)
     * 
     * @param int $doctorId
     * @return array
     */
    private function getAppointmentsByType($doctorId)
    {
        return DB::table('booked_appointments')
            ->join('appointments', 'appointments.id', '=', 'booked_appointments.appointment_id')
            ->where('appointments.doctor_id', $doctorId)
            ->select('booked_appointments.type', DB::raw('count(*) as count'))
            ->where('booked_appointments.status', '!=', 'rejected')
            ->groupBy('booked_appointments.type')
            ->pluck('count', 'type')
            ->toArray();
    }
    
    /**
     * Get patient demographics (age groups and gender)
     * 
     * @param int $doctorId
     * @return array
     */
    private function getPatientDemographics($doctorId)
    {
        // Get unique patients for this doctor
        $patientIds = DB::table('booked_appointments')
            ->join('appointments', 'appointments.id', '=', 'booked_appointments.appointment_id')
            ->where('appointments.doctor_id', $doctorId)
            ->where('booked_appointments.status', '!=', 'rejected')
            ->distinct('booked_appointments.patient_id')
            ->pluck('booked_appointments.patient_id');
            
        // Get age groups
        $now = Carbon::now();
        $patients = User::whereIn('id', $patientIds)->get();
        
        $ageGroups = [
            '0-18' => 0,
            '19-35' => 0,
            '36-50' => 0,
            '51-65' => 0,
            '65+' => 0
        ];
        
        $genderGroups = [
            'male' => 0,
            'female' => 0,
            'other' => 0
        ];
        
        foreach ($patients as $patient) {
            // Calculate age
            if ($patient->dob) {
                $age = Carbon::parse($patient->dob)->age;
                
                if ($age <= 18) {
                    $ageGroups['0-18']++;
                } elseif ($age <= 35) {
                    $ageGroups['19-35']++;
                } elseif ($age <= 50) {
                    $ageGroups['36-50']++;
                } elseif ($age <= 65) {
                    $ageGroups['51-65']++;
                } else {
                    $ageGroups['65+']++;
                }
            }
            
            // Count gender
            if ($patient->sex) {
                $genderGroups[$patient->sex]++;
            } else {
                $genderGroups['other']++;
            }
        }
        
        return [
            'age' => [
                'labels' => array_keys($ageGroups),
                'data' => array_values($ageGroups)
            ],
            'gender' => [
                'labels' => ['Male', 'Female', 'Other'],
                'data' => [
                    $genderGroups['male'],
                    $genderGroups['female'],
                    $genderGroups['other']
                ]
            ]
        ];
    }

    /**
     * Get today's appointments
     * 
     * @param int $doctorId
     * @param string $today
     * @return array
     */
    private function getTodaysAppointments($doctorId, $today)
    {
        $appointments = DB::table('booked_appointments')
            ->join('appointments', 'appointments.id', '=', 'booked_appointments.appointment_id')
            ->join('users', 'users.id', '=', 'booked_appointments.patient_id')
            ->where('appointments.doctor_id', $doctorId)
            ->where('appointments.date_start', $today)
            ->where('booked_appointments.status', 'confirmed')
            ->select(
                'users.id',
                'users.name as patientName',
                'users.dob',
                'users.avatar as patientImg',
                'booked_appointments.type as appointmentType',
                'booked_appointments.selected_time as time',
                'appointments.date_start as date',
                'booked_appointments.status',
                'booked_appointments.remarks as reason'
            )
            ->orderBy('booked_appointments.selected_time')
            ->limit(5)
            ->get();
            
        $result = [];
        foreach ($appointments as $appointment) {
            // Calculate age from DOB
            $age = $appointment->dob ? Carbon::parse($appointment->dob)->age : null;
            
            // Format time to AM/PM
            $formattedTime = Carbon::parse($appointment->time)->format('h:i A');
            // Map appointment type from database format to display format
            $appointmentType = ucfirst(str_replace('_', '-', $appointment->appointmentType));
            
            $result[] = [
                'patientName' => $appointment->patientName,
                'patientAge' => $age ?? 30, // Default to 30 if age can't be calculated
                'appointmentType' => $appointmentType,
                'time' => $formattedTime,
                'date' => $appointment->date,
                'status' => $appointment->status,
                'reason' => $appointment->reason,
                'patientImg' => $appointment->patientImg ?? 'admin/assets/images/faces/1.jpg'
            ];
        }
        
        return $result;
    }
    
    /**
     * Get prescription statistics
     * 
     * @param int $doctorId
     * @param string $startOfMonth
     * @return array
     */
    private function getPrescriptionStats($doctorId, $startOfMonth)
    {
        $total = DB::table('prescriptions')
            ->where('doctor_id', $doctorId)
            ->count();
            
        $thisMonth = DB::table('prescriptions')
            ->where('doctor_id', $doctorId)
            ->where('created_at', '>=', $startOfMonth)
            ->count();
            
        return [
            'total' => $total,
            'thisMonth' => $thisMonth
        ];
    }
    
    /**
     * Get lab request statistics
     * 
     * @param int $doctorId
     * @return array
     */
    private function getLabRequestStats($doctorId)
    {
        $total = DB::table('lab_request')
            ->where('doctor_id', $doctorId)
            ->count();
            
        $pending = DB::table('lab_request')
            ->where('doctor_id', $doctorId)
            ->whereNull('result')
            ->count();
            
        $completed = $total - $pending;
            
        return [
            'total' => $total,
            'pending' => $pending,
            'completed' => $completed
        ];
    }            

    public function forReminders() {
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
        $data = $this->dashboardData();
        return Inertia::render('Dashboard',[
            'data' => $data
        ]);
    }
}
