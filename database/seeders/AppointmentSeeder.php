<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Appointment;
use App\Models\Specialization;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $doctors = User::where('role_id', 2)->get(); // Get all doctors

        $titleMap = [
            'Cardiologist' => 'Cardiology Consultation',
            'Dermatologist' => 'Dermatology Checkup',
            'Neurologist' => 'Neurology Consultation',
            'Pediatrician' => 'Pediatrics Visit',
            'Orthopedic Surgeon' => 'Orthopedic Assessment',
            'Psychiatrist' => 'Psychiatry Session',
            'Ophthalmologist' => 'Eye Examination',
            'General Surgeon' => 'General Checkup',
            'Endocrinologist' => 'Diabetes Management',
            'Oncologist' => 'Cancer Screening'
        ];

        $appointments = [];
        $dayOffset = 1;

        foreach ($doctors as $doctor) {
            $specialization = Specialization::find($doctor->specialization_id);

            if (!$specialization) {
                continue; // Skip if doctor has no specialization
            }

            $title = $titleMap[$specialization->name] ?? 'General Checkup';

            // Create 10 appointments for each doctor
            for ($i = 0; $i < 10; $i++) {
                if($dayOffset == 30) {
                    $dayOffset = 1;
                }
                $appointments[] = [
                    'title' => $title.' '.($i + 1),
                    'description' => $title . ' session.',
                    'start_time' => Carbon::now()->addDays($dayOffset)->format('Y-m-d H:i:s'),
                    'end_time' => Carbon::now()->addDays($dayOffset)->format('Y-m-d H:i:s'),
                    'slot' => rand(10, 30),
                    'doctor_id' => $doctor->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $dayOffset++;
            }
        }

        Appointment::insert($appointments);
    }
}
