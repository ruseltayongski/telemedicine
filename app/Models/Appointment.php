<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $table = 'appointments';
    protected $guarded = [];

    public function booked_appointments()
    {
        return $this->hasMany(BookedAppointment::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }
}
