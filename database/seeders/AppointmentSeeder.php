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
                continue;
            }

            $title = $titleMap[$specialization->name] ?? 'General Checkup';

            for ($i = 0; $i < 10; $i++) {
                if($dayOffset == 30) {
                    $dayOffset = 1;
                }
                $appointments[] = [
                    'title' => $title.' '.($i + 1),
                    'description' => $title . ' session.',
                    'date_start' => Carbon::now()->addDays($dayOffset)->format('Y-m-d'),
                    'date_end' => Carbon::now()->addDays($dayOffset)->format('Y-m-d'),
                    'slot' => rand(10, 30),
                    'doctor_id' => $doctor->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $dayOffset++;
            }
        }

        Appointment::insert($appointments);

        // $startDate = Carbon::now()->addDays(1);

        // $titles = [
        //     'Acne Consultation',
        //     'Skin Allergy Assessment',
        //     'Eczema Evaluation',
        //     'Psoriasis Follow-up',
        //     'Mole & Skin Tag Check',
        //     'Hair Loss Diagnosis',
        //     'Rash and Irritation Review',
        //     'Routine Skin Checkup',
        //     'Dry Skin Treatment Plan',
        //     'Hyperpigmentation Review',
        //     'Rosacea Monitoring',
        //     'Itchy Skin Assessment',
        //     'Scalp Condition Check',
        //     'Wart Removal Discussion',
        //     'Skin Cancer Screening',
        // ];

        // foreach ($titles as $i => $title) {
        //     Appointment::create([
        //         'title' => $title,
        //         'description' => 'Dermatology appointment for ' . strtolower($title) . '.',
        //         'date_start' => $startDate->copy()->addDays($i-1)->format('Y-m-d'),
        //         'date_end' => $startDate->copy()->addDays($i-1)->format('Y-m-d'),
        //         'slot' => 10,
        //         'doctor_id' => 3,
        //     ]);
        // }
    }
}
