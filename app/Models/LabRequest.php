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

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }
    
    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function booking()
    {
        return $this->belongsTo(BookedAppointment::class, 'booking_id');
    }
}
