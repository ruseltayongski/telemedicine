<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BookedAppointment;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Support\Str;

class BookedAppointmentSeeders extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $patient = User::where('role_id', 3)->first();

        if ($patient) {
            do {
                $bookingCode = 'BOOK-' . strtoupper(Str::random(7));
            } while (BookedAppointment::where('booking_code', $bookingCode)->exists());

            BookedAppointment::insert([
                [
                    'booking_code' => $bookingCode,
                    'appointment_id' => 1,
                    'patient_id' => $patient->id,
                    'status' => 'confirmed',
                    'selected_time' => now()->addHours(4)->format('H:i:s'),
                    'remarks' => 'Consultation for general check-up.',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);

            do {
                $bookingCode = 'BOOK-' . strtoupper(Str::random(7));
            } while (BookedAppointment::where('booking_code', $bookingCode)->exists());

            BookedAppointment::insert([
                [
                    'booking_code' => $bookingCode,
                    'appointment_id' => 2,
                    'patient_id' => $patient->id,
                    'status' => 'pending',
                    'selected_time' => now()->addHours(5)->format('H:i:s'),
                    'remarks' => 'Consultation for general check-up.',
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }
    }
}
