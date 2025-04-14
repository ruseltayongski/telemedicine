<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use App\Models\BookedAppointment;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\AppointmentReminder;
use Illuminate\Support\Facades\DB;

class SendAppointmentReminder extends Command
{
    protected $signature = 'appointment:send-reminder';
    protected $description = 'Send email reminders to doctor and patient 15 minutes before appointment time';

    public function handle()
    {
        $now = Carbon::now();
        $nowTime = $now->format('H:i:s');

        $appointments = BookedAppointment::with(['appointment', 'patient', 'appointment.doctor'])
                ->select('booked_appointments.*')
                ->addSelect(DB::raw("TIMESTAMPDIFF(MINUTE, STR_TO_DATE('$nowTime', '%H:%i:%s'), selected_time) as time_difference"))
                ->where('status', 'confirmed')
                //->whereRaw("TIMESTAMPDIFF(MINUTE, STR_TO_DATE('$nowTime', '%H:%i:%s'), selected_time) = 2")
                ->whereHas('appointment', function ($query) use ($now) {
                    $query->whereDate('date_start', $now->toDateString());
                })
                ->get();

        foreach ($appointments as $booking) {
            $startTime = Carbon::parse($booking->appointment->date_start);

            Mail::to($booking->patient->email)->send(new AppointmentReminder($booking, 'patient'));
            Log::debug("Reminder sent to patient: {$booking->patient->email}");
            Mail::to($booking->appointment->doctor->email)->send(new AppointmentReminder($booking, 'doctor'));
        }

        $this->info('Appointment reminders sent.');
        Log::debug('Appointment reminder command completed');
    }
}
