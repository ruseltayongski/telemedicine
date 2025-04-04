<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SpecializationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $specializations = [
            ['name' => 'Cardiologist'],
            ['name' => 'Dermatologist'],
            ['name' => 'Neurologist'],
            ['name' => 'Pediatrician'],
            ['name' => 'Orthopedic Surgeon'],
            ['name' => 'Psychiatrist'],
            ['name' => 'Ophthalmologist'],
            ['name' => 'General Surgeon'],
            ['name' => 'Endocrinologist'],
            ['name' => 'Oncologist'],
        ];

        DB::table('specializations')->insert($specializations);
    }
}
