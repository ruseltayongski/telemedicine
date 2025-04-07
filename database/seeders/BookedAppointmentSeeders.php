<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BookedAppointment;
use App\Models\Appointment;
use App\Models\User;

class BookedAppointmentSeeders extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $patient = User::where('role_id', 3)->first();
        $appointment = Appointment::first();

        if ($patient && $appointment) {
            BookedAppointment::insert([
                [
                    'appointment_id' => $appointment->id,
                    'patient_id' => $patient->id,
                    'status' => 'confirmed',
                    'selected_time' => now()->addHours(4)->format('H:i:s'),
                    'remarks' => 'Follow-up consultation for general check-up.',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);

            BookedAppointment::insert([
                [
                    'appointment_id' => 2,
                    'patient_id' => $patient->id,
                    'status' => 'confirmed',
                    'selected_time' => now()->addHours(5)->format('H:i:s'),
                    'remarks' => 'Follow-up consultation for general check-up.',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }
    }
}
