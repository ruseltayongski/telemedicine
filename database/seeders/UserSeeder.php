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
                'email' => 'ruseltayong@gmail.com',
                'password' => Hash::make('password'),
                'role_id' => 3, // Example role for patient
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $facilityIds = DB::table('facility')->pluck('id')->toArray();
        $specializationIds = DB::table('specializations')->pluck('id')->toArray();

        // Get facility ids for private and government
        $privateFacilities = array_filter($facilityIds, function($id) {
            return DB::table('facility')->where('id', $id)->value('type') == 'private'; // Adjust as per your table structure
        });

        $governmentFacilities = array_filter($facilityIds, function($id) {
            return DB::table('facility')->where('id', $id)->value('type') == 'government'; // Adjust as per your table structure
        });

        foreach ($specializationIds as $specializationId) {
            // Add 5 doctors for private facilities
            for ($i = 1; $i <= 5; $i++) {
                DB::table('users')->insert([
                    'name' => 'Dr. ' . $faker->firstName . ' ' . $faker->lastName,
                    'email' => 'doctor' . $specializationId . '_private_' . $i . '@gmail.com',
                    'password' => Hash::make('password'),
                    'role_id' => 2,
                    'specialization_id' => $specializationId,
                    'facility_id' => $privateFacilities[array_rand($privateFacilities)],
                    'email_verified_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Add 5 doctors for government facilities
            for ($i = 1; $i <= 5; $i++) {
                DB::table('users')->insert([
                    'name' => 'Dr. ' . $faker->firstName . ' ' . $faker->lastName,
                    'email' => 'doctor' . $specializationId . '_government_' . $i . '@gmail.com',
                    'password' => Hash::make('password'),
                    'role_id' => 2,
                    'specialization_id' => $specializationId,
                    'facility_id' => $governmentFacilities[array_rand($governmentFacilities)],
                    'email_verified_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

    }
}
