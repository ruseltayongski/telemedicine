<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookedAppointment extends Model
{
    protected $table = 'booked_appointments';
    protected $guarded = [];

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }
}
