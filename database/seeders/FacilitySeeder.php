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
            "Cebu Doctors' University Hospital", "Chong Hua Hospital", "Vicente Sotto Memorial Medical Center",
            "Perpetual Succour Hospital", "Mactan Doctors' Hospital", "South General Hospital",
            "North General Hospital", "Cebu Velez General Hospital", "St. Vincent General Hospital",
            "UCMed - University of Cebu Medical Center", "Cebu City Medical Center", "Sacred Heart Hospital",
            "Adventist Hospital Cebu", "Eversley Childs Sanitarium and General Hospital", "Mandaue City Hospital",
            "Lapu-Lapu City Hospital", "Talisay District Hospital", "Danao Provincial Hospital",
            "Carcar District Hospital", "Bogo District Hospital"
        ];

        foreach ($facilities as $facility) {
            DB::table('facility')->insert([
                'name' => $facility,
                'type' => (rand(0, 1) ? 'government' : 'private'),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
