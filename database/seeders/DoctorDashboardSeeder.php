<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Appointment;
use App\Models\BookedAppointment;
use App\Models\Prescription;
use App\Models\LabTest;
use App\Models\LabRequest;

class DoctorDashboardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Create doctor
        $doctorId = 3;

        // Create patients (mixed genders and ages)
        $patients = [];
        $patientData = [
            ['Jane Smith', 'female', '1983-08-22', 'jane.smith@example.com'],
            ['Thomas Anderson', 'male', '1990-03-11', 'thomas.anderson@example.com'],
            ['Emily Parker', 'female', '1969-11-04', 'emily.parker@example.com'],
            ['Michael Brown', 'male', '1977-07-29', 'michael.brown@example.com'],
            ['Sarah Wilson', 'female', '1992-05-17', 'sarah.wilson@example.com'],
            ['James Lee', 'male', '1965-09-12', 'james.lee@example.com'],
            ['Emma Garcia', 'female', '1988-12-03', 'emma.garcia@example.com'],
            ['David Lopez', 'male', '1998-02-19', 'david.lopez@example.com'],
            ['Sophia Wang', 'female', '1973-04-30', 'sophia.wang@example.com'],
            ['Robert Miller', 'male', '1959-01-25', 'robert.miller@example.com'],
            ['Olivia Davis', 'female', '2005-10-08', 'olivia.davis@example.com'],
            ['William Rodriguez', 'male', '2010-06-14', 'william.r@example.com'],
        ];
        
        $avatarBase = 'admin/assets/images/faces/';
        foreach ($patientData as $index => $data) {
            $id = DB::table('users')->insertGetId([
                'name' => $data[0],
                'email' => $data[3],
                'password' => Hash::make('password'),
                'sex' => $data[1],
                'dob' => $data[2],
                'role_id' => 3, // Patient role
                'email_verified_at' => now(),
                'avatar' => $avatarBase . ($index + 1) . '.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            $patients[] = $id;
        }

        // Create open appointment slots (doctor availability)
        $now = Carbon::now();
        $appointmentSlots = [];
        
        // Create availability for next 30 days
        for ($i = 0; $i < 30; $i++) {
            $date = $now->copy()->addDays($i);
            
            // Skip weekends
            if ($date->isWeekend()) {
                continue;
            }
            
            $appointmentId = DB::table('appointments')->insertGetId([
                'title' => 'Dr. Johnson\'s Appointments',
                'description' => 'Regular consultation hours',
                'date_start' => $date->format('Y-m-d'),
                'date_end' => $date->format('Y-m-d'),
                'slot' => 8, // 8 slots per day
                'doctor_id' => $doctorId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            $appointmentSlots[] = $appointmentId;
        }

        // Create booked appointments
        $times = ['09:00', '10:30', '11:45', '13:00', '14:15', '15:30', '16:45'];
        $types = ['new', 'follow_up'];
        $statuses = ['pending', 'confirmed', 'cancelled', 'rejected'];
        $reasons = [
            'Hypertension follow-up',
            'Chest pain evaluation',
            'Medication review',
            'Post-procedure checkup',
            'Heart palpitations',
            'Annual cardiac check-up',
            'Shortness of breath',
            'Irregular heartbeat',
            'High cholesterol consultation'
        ];
        
        // Create booking history (past 12 months)
        $bookedAppointments = [];
        $appointmentsPerMonth = [8, 2, 3, 12, 15, 3, 12, 1, 2, 1, 2, 3];
        
        for ($month = 11; $month >= 0; $month--) {
            $monthDate = $now->copy()->subMonths($month);
            $monthStart = $monthDate->copy()->startOfMonth();
            $monthEnd = $monthDate->copy()->endOfMonth();
            
            $count = $appointmentsPerMonth[$month];
            
            for ($i = 0; $i < $count; $i++) {
                $date = Carbon::createFromTimestamp(
                    rand($monthStart->timestamp, $monthEnd->timestamp)
                )->format('Y-m-d');
                
                $timeIndex = array_rand($times);
                $patientIndex = array_rand($patients);
                $typeIndex = array_rand($types);
                $statusIndex = array_rand($statuses);
                $reasonIndex = array_rand($reasons);
                
                $bookingId = DB::table('booked_appointments')->insertGetId([
                    'booking_code' => 'BK' . mt_rand(10000, 99999),
                    'appointment_id' => $appointmentSlots[array_rand($appointmentSlots)],
                    'patient_id' => $patients[$patientIndex],
                    'status' => $month > 0 ? 'confirmed' : $statuses[$statusIndex],
                    'type' => $types[$typeIndex],
                    'selected_time' => $times[$timeIndex],
                    'remarks' => $reasons[$reasonIndex],
                    'created_at' => $date,
                    'updated_at' => $date,
                ]);
                
                $bookedAppointments[] = $bookingId;
                
                // Add prescriptions for completed appointments (80% chance)
                if ($month > 0 && $statuses[$statusIndex] === 'confirmed' && rand(1, 100) <= 64) {
                    DB::table('prescriptions')->insert([
                        'prescription_no' => 'RX' . mt_rand(100000, 999999),
                        'doctor_id' => $doctorId,
                        'patient_id' => $patients[$patientIndex],
                        'booking_id' => $bookingId,
                        'content' => $this->generatePrescriptionContent(),
                        'created_at' => $date,
                        'updated_at' => $date,
                    ]);
                }
            }
        }
        
        // Create today's appointments specifically
        $today = $now->format('Y-m-d');
        $todayAppointments = [
            [
                'time' => '09:00 AM',
                'patient' => 0, // Jane Smith
                'type' => 'follow_up',
                'reason' => 'Hypertension follow-up',
            ],
            [
                'time' => '10:30 AM',
                'patient' => 1, // Thomas Anderson
                'type' => 'new',
                'reason' => 'Chest pain evaluation',
            ],
            [
                'time' => '11:45 AM',
                'patient' => 2, // Emily Parker
                'type' => 'follow_up',
                'reason' => 'Medication review',
            ],
            [
                'time' => '02:15 PM',
                'patient' => 3, // Michael Brown
                'type' => 'follow_up',
                'reason' => 'Post-procedure checkup',
            ],
            [
                'time' => '03:30 PM',
                'patient' => 4, // Sarah Wilson
                'type' => 'new',
                'reason' => 'Heart palpitations',
            ],
        ];
        
        foreach ($todayAppointments as $appt) {
            DB::table('booked_appointments')->insert([
                'booking_code' => 'BK' . mt_rand(10000, 99999),
                'appointment_id' => $appointmentSlots[0], // Today's slot
                'patient_id' => $patients[$appt['patient']],
                'status' => 'confirmed',
                'type' => $appt['type'],
                'selected_time' => substr($appt['time'], 0, 5),
                'remarks' => $appt['reason'],
                'created_at' => $today,
                'updated_at' => $today,
            ]);
        }
        
        // Create lab tests
        $labTests = [
            [
                'name' => 'Complete Blood Count (CBC)',
                'description' => 'Measures different components of blood including red cells, white cells, and platelets',
                'category' => 'Hematology',
                'code' => 'CBC-001',
                'requires_fasting' => false,
                'sample_type' => 'Blood',
                'normal_range' => 'Varies by component'
            ],
            [
                'name' => 'Lipid Profile',
                'description' => 'Measures cholesterol and triglyceride levels',
                'category' => 'Chemistry',
                'code' => 'LIP-001',
                'requires_fasting' => true,
                'sample_type' => 'Blood',
                'normal_range' => 'Total Cholesterol: <200 mg/dL, LDL: <100 mg/dL, HDL: >40 mg/dL, Triglycerides: <150 mg/dL'
            ],
            [
                'name' => 'Cardiac Enzyme Panel',
                'description' => 'Used to diagnose heart attacks and assess heart health',
                'category' => 'Cardiac',
                'code' => 'CAR-001',
                'requires_fasting' => false,
                'sample_type' => 'Blood',
                'normal_range' => 'Troponin: <0.4 ng/mL, CK-MB: <5 ng/mL'
            ],
            [
                'name' => 'Electrocardiogram (ECG)',
                'description' => 'Records electrical signals in the heart',
                'category' => 'Cardiac',
                'code' => 'ECG-001',
                'requires_fasting' => false,
                'sample_type' => 'Non-invasive test',
                'normal_range' => 'Regular rhythm, normal intervals'
            ],
            [
                'name' => 'Echocardiogram',
                'description' => 'Ultrasound imaging of the heart',
                'category' => 'Cardiac',
                'code' => 'ECHO-001',
                'requires_fasting' => false,
                'sample_type' => 'Non-invasive test',
                'normal_range' => 'Normal chamber size and function, no abnormalities'
            ]
        ];
        
        foreach ($labTests as $test) {
            DB::table('lab_test')->insert([
                'name' => $test['name'],
                'description' => $test['description'],
                'category' => $test['category'],
                'code' => $test['code'],
                'requires_fasting' => $test['requires_fasting'],
                'sample_type' => $test['sample_type'],
                'normal_range' => $test['normal_range'],
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        
        // Create lab requests
        for ($i = 0; $i < 420; $i++) {
            $isRecent = $i >= 408;
            $date = $isRecent ? $now->copy()->subDays(rand(0, 10)) : $now->copy()->subDays(rand(11, 365));
            $patientIndex = array_rand($patients);
            $bookingIndex = array_rand($bookedAppointments);
            
            $labRequestId = DB::table('lab_request')->insertGetId([
                'doctor_id' => $doctorId,
                'patient_id' => $patients[$patientIndex],
                'booking_id' => $bookedAppointments[$bookingIndex],
                'requested_date' => $date->format('Y-m-d'),
                'scheduled_date' => $isRecent ? null : $date->addDays(rand(1, 7))->format('Y-m-d'),
                'doctor_notes' => 'Please check cardiac markers and basic vitals',
                'result' => $isRecent ? null : 'Results within normal range',
                'result_comments' => $isRecent ? null : 'Patient is stable, continue current treatment regimen',
                'is_abnormal' => $isRecent ? null : (rand(0, 10) > 8),
                'created_at' => $date,
                'updated_at' => $date,
            ]);
            
            // Associate random tests with each lab request
            $numTests = rand(1, 3);
            $testIds = range(1, count($labTests));
            shuffle($testIds);
            
            for ($j = 0; $j < $numTests; $j++) {
                DB::table('lab_request_lab_test')->insert([
                    'lab_request_id' => $labRequestId,
                    'lab_test_id' => $testIds[$j],
                    'created_at' => $date,
                    'updated_at' => $date,
                ]);
            }
        }
    }
    
    /**
     * Generate random prescription content
     *
     * @return string
     */
    private function generatePrescriptionContent()
    {
        $medications = [
            'Lisinopril 10mg - Take 1 tablet daily for hypertension',
            'Atorvastatin 20mg - Take 1 tablet at bedtime for cholesterol',
            'Metoprolol 25mg - Take 1 tablet twice daily for blood pressure/heart rate',
            'Aspirin 81mg - Take 1 tablet daily to prevent blood clots',
            'Furosemide 20mg - Take 1 tablet in the morning for fluid retention',
            'Warfarin 5mg - Take as directed based on INR results',
            'Clopidogrel 75mg - Take 1 tablet daily to prevent blood clots',
            'Digoxin 0.125mg - Take 1 tablet daily for heart failure/rhythm',
            'Spironolactone 25mg - Take 1 tablet daily for heart failure'
        ];
        
        $instructions = [
            'Continue current diet and exercise regimen',
            'Monitor blood pressure daily and keep a log',
            'Reduce sodium intake',
            'Follow up in 3 months',
            'Schedule an echocardiogram before next visit',
            'Call if experiencing chest pain or shortness of breath',
            'Take medication with food to reduce stomach upset',
            'Avoid grapefruit juice while taking this medication',
            'Monitor weight daily and report gains of more than 2lbs in a day'
        ];
        
        $content = "";
        $medCount = rand(1, 3);
        $instCount = rand(1, 3);
        
        $selectedMeds = array_rand($medications, $medCount);
        if (!is_array($selectedMeds)) $selectedMeds = [$selectedMeds];
        
        $selectedInst = array_rand($instructions, $instCount);
        if (!is_array($selectedInst)) $selectedInst = [$selectedInst];
        
        $content .= "Medications:\n";
        foreach ($selectedMeds as $index) {
            $content .= "- " . $medications[$index] . "\n";
        }
        
        $content .= "\nInstructions:\n";
        foreach ($selectedInst as $index) {
            $content .= "- " . $instructions[$index] . "\n";
        }
        
        return $content;
    }
}
