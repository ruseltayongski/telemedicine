<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Prescription;
use Illuminate\Support\Str;

class PrescriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Prescription::create([
            'prescription_no' => 'RX-' . strtoupper(Str::random(8)),
            'doctor_id' => 3,
            'patient_id' => 2,
            'booking_id' => 1,
            'content' => '
                <p><strong>Patient Instructions:</strong></p>
                <ol>
                    <li>Take <strong>Amoxicillin 500mg</strong> every 8 hours for 7 days.</li>
                    <li>Apply <em>Topical Cream</em> to the affected area twice daily.</li>
                    <li>Avoid dairy products while taking medication.</li>
                </ol>
                <p><strong>Additional Notes:</strong></p>
                <ul>
                    <li>Stay hydrated – aim for 2 liters of water daily.</li>
                    <li>Monitor symptoms and report any side effects.</li>
                    <li>Follow-up appointment scheduled for next week.</li>
                </ul>
            ',
        ]);
    }
}
