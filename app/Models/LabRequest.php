<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LabRequest extends Model
{
    protected $table = 'lab_request';
    protected $guarded = [];

    public function labTests()
    {
        return $this->belongsToMany(LabTest::class)->withTimestamps();
    }
}
