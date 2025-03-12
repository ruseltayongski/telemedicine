<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
            Appointment::insert([
                [
                    'title' => 'General Checkup',
                    'description' => 'Routine health checkup.',
                    'start_time' => Carbon::now()->addDays(1)->format('Y-m-d H:i:s'),
                    'end_time' => Carbon::now()->addDays(1)->addHour()->format('Y-m-d H:i:s'),
                    'slot' => 20,
                    'doctor_id' => $doctor->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'title' => 'Dental Consultation',
                    'description' => 'Teeth and gum assessment.',
                    'start_time' => Carbon::now()->addDays(2)->format('Y-m-d H:i:s'),
                    'end_time' => Carbon::now()->addDays(2)->addHour()->format('Y-m-d H:i:s'),
                    'slot' => 20,
                    'doctor_id' => $doctor->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }
    }
}
