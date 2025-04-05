<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\User;

class FacilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $facilities = [
            ["Cebu Doctors' University Hospital", 'private'],
            ["Chong Hua Hospital", 'private'],
            ["Vicente Sotto Memorial Medical Center", 'government'],
            ["Perpetual Succour Hospital", 'private'],
            ["Mactan Doctors' Hospital", 'private'],
            ["South General Hospital", 'government'],
            ["North General Hospital", 'government'],
            ["Cebu Velez General Hospital", 'private'],
            ["St. Vincent General Hospital", 'private'],
            ["UCMed - University of Cebu Medical Center", 'private'],
            ["Cebu City Medical Center", 'government'],
            ["Sacred Heart Hospital", 'private'],
            ["Adventist Hospital Cebu", 'private'],
            ["Eversley Childs Sanitarium and General Hospital", 'government'],
            ["Mandaue City Hospital", 'government'],
            ["Lapu-Lapu City Hospital", 'government'],
            ["Talisay District Hospital", 'government'],
            ["Danao Provincial Hospital", 'government'],
            ["Carcar District Hospital", 'government'],
            ["Bogo District Hospital", 'government']
        ];

        foreach ($facilities as $facility) {
            DB::table('facility')->insert([
                'name' => $facility[0],
                'type' => $facility[1], // Set the correct type for each hospital
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
