<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LabTest extends Model
{
    protected $table = 'lab_test';
    protected $guarded = [];
    
    public function labRequests()
    {
        return $this->belongsToMany(LabRequest::class);
    }
}
