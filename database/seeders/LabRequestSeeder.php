<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LabRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('lab_request')->insert([
            'doctor_id' => 3,
            'patient_id' => 2,
            'booking_id' => 1,
            'requested_date' => Carbon::now()->subDays(1)->toDateString(),
            'scheduled_date' => Carbon::now()->subDays(1)->toDateString(),
            'doctor_notes' => 'Please conduct routine tests for general health checkup.',
            'result' => 'Test completed. Results show minor irregularities in cholesterol levels.', //Review After Test Completion
            'result_comments' => 'Recommend follow-up consultation for dietary advice.', //Review After Test Completion
            'is_abnormal' => true, //Review After Test Completion
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('lab_request_lab_test')->insert([
            [
                'lab_request_id' => 1,
                'lab_test_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'lab_request_id' => 1,
                'lab_test_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'lab_request_id' => 1,
                'lab_test_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
