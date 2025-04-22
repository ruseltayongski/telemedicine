<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\BookedAppointment;

class AppointmentConfirmed extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public $booking;

    public function __construct(BookedAppointment $booking)
    {
        $this->booking = $booking;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->booking->type === 'follow_up'
            ? 'Follow-Up Appointment Confirmed'
            : 'Appointment Confirmed';

        return new Envelope(
            subject: $subject,
        );
    }

    public function build()
    {
        if ($this->booking->type === 'follow_up') {
            return $this->subject('Follow-Up Appointment Confirmed')
                        ->markdown('emails.followup_confirmed')
                        ->with(['booking' => $this->booking]);
        }

        return $this->subject('Your Appointment Has Been Confirmed')
                    ->markdown('emails.appointment_confirmed');
    }
}
