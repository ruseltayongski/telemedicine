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
                'role_id' => 1,
                'email_verified_at' => now(),
                'address' => 'Admin Office',
                'contact' => '09123456789',
                'sex' => 'male',
                'dob' => $faker->dateTimeBetween('-60 years', '-25 years')->format('Y-m-d'),
                'license_no' => 'ADM123456',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Rusel Tayong',
                'email' => 'ruseltayong@gmail.com',
                'password' => Hash::make('password'),
                'role_id' => 3, // for patient
                'email_verified_at' => now(),
                'address' => 'Patient Street, City',
                'contact' => '09234567890',
                'sex' => 'male',
                'dob' => $faker->dateTimeBetween('-60 years', '-25 years')->format('Y-m-d'),
                'license_no' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        User::insert([
            [
                'name' => 'Christian Martinez',
                'email' => 'rusel.ideahub@gmail.com',
                'password' => Hash::make('password'),
                'role_id' => 2,
                'specialization_id' => 2, //Dermatology
                'facility_id' => 3,
                'email_verified_at' => now(),
                'address' => $faker->address,
                'contact' => $faker->phoneNumber,
                'sex' => 'female',
                'dob' => $faker->dateTimeBetween('-60 years', '-25 years')->format('Y-m-d'),
                'license_no' => strtoupper($faker->bothify('DOC-#####')),
                'ptr_number' => strtoupper($faker->bothify('PTR-#####')),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);

        $facilityIds = DB::table('facility')->pluck('id')->toArray();
        $specializationIds = DB::table('specializations')->pluck('id')->toArray();

        $privateFacilities = array_filter($facilityIds, function($id) {
            return DB::table('facility')->where('id', $id)->value('type') == 'private';
        });

        $governmentFacilities = array_filter($facilityIds, function($id) {
            return DB::table('facility')->where('id', $id)->value('type') == 'government';
        });

        foreach ($specializationIds as $specializationId) {
            // for ($i = 1; $i <= 5; $i++) {
            //     DB::table('users')->insert([
            //         'name' => $faker->firstName . ' ' . $faker->lastName,
            //         'email' => 'doctor' . $specializationId . '_private_' . $i . '@gmail.com',
            //         'password' => Hash::make('password'),
            //         'role_id' => 2,
            //         'specialization_id' => $specializationId,
            //         'facility_id' => $privateFacilities[array_rand($privateFacilities)],
            //         'email_verified_at' => now(),
            //         'address' => $faker->address,
            //         'contact' => $faker->phoneNumber,
            //         'sex' => $faker->randomElement(['male', 'female']),
            //         'dob' => $faker->dateTimeBetween('-60 years', '-25 years')->format('Y-m-d'),
            //         'license_no' => strtoupper($faker->bothify('DOC-#####')),
            //         'ptr_number' => strtoupper($faker->bothify('PTR-#####')),
            //         'created_at' => now(),
            //         'updated_at' => now(),
            //     ]);
            // }

            for ($i = 1; $i <= 5; $i++) {
                DB::table('users')->insert([
                    'name' => $faker->firstName . ' ' . $faker->lastName,
                    'email' => 'doctor' . $specializationId . '_government_' . $i . '@gmail.com',
                    'password' => Hash::make('password'),
                    'role_id' => 2,
                    'specialization_id' => $specializationId,
                    'facility_id' => $governmentFacilities[array_rand($governmentFacilities)],
                    'email_verified_at' => now(),
                    'address' => $faker->address,
                    'contact' => $faker->phoneNumber,
                    'sex' => $faker->randomElement(['male', 'female']),
                    'dob' => $faker->dateTimeBetween('-60 years', '-25 years')->format('Y-m-d'),
                    'license_no' => strtoupper($faker->bothify('DOC-#####')),
                    'ptr_number' => strtoupper($faker->bothify('PTR-#####')),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
