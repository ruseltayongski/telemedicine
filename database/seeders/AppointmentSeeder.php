<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use App\Models\User;
use Carbon\Carbon;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $doctor = User::where('role_id', 2)->first(); // Find a doctor

        if ($doctor) {
            $appointments = [];
            $titles = [
                'General Checkup', 'Dental Consultation', 'Eye Examination', 'Cardiology Consultation',
                'Dermatology Checkup', 'Orthopedic Assessment', 'Neurology Consultation', 'Pediatrics Visit',
                'ENT Checkup', 'Gynecology Consultation', 'Physical Therapy', 'Psychiatry Session',
                'Vaccination', 'Nutrition Counseling', 'Chiropractic Care', 'Speech Therapy',
                'Diabetes Management', 'Allergy Test', 'Skin Treatment', 'Annual Physical Exam'
            ];

            for ($i = 0; $i < 20; $i++) {
                $appointments[] = [
                    'title' => $titles[$i],
                    'description' => $titles[$i] . ' session.',
                    'start_time' => Carbon::now()->addDays($i + 1)->format('Y-m-d H:i:s'),
                    'end_time' => Carbon::now()->addDays($i + 1)->addHour()->format('Y-m-d H:i:s'),
                    'slot' => rand(10, 30),
                    'doctor_id' => $doctor->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            Appointment::insert($appointments);
        }
    }
}
