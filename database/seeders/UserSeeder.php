<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        
        User::insert([
            [
                'name' => 'Admin User',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('password'),
                'role_id' => 1, // Example role for admin/doctor
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'patient@gmail.com',
                'password' => Hash::make('password'),
                'role_id' => 3, // Example role for patient
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $facilityIds = DB::table('facility')->pluck('id')->toArray();

        $specializationIds = DB::table('specializations')->pluck('id')->toArray();

        for ($i = 1; $i <= 50; $i++) {
            DB::table('users')->insert([
                'name' => 'Dr. ' . $faker->firstName . ' ' . $faker->lastName,
                'email' => 'doctor' . $i . '@gmail.com',
                'password' => Hash::make('password'),
                'role_id' => 2,
                'specialization_id' => $specializationIds[array_rand($specializationIds)],
                'facility_id' => $facilityIds[array_rand($facilityIds)],
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

    }
}
