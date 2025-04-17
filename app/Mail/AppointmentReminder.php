<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\BookedAppointment;

class AppointmentReminder extends Mailable
{
    use Queueable, SerializesModels;

    public $booking;
    public $recipient;
    public $name;

    public function __construct(BookedAppointment $booking, $recipient, $name)
    {
        $this->booking = $booking;
        $this->recipient = $recipient;
        $this->name = $name;
    }

    public function build()
    {
        return $this->subject('Appointment Reminder')
                    ->markdown('emails.reminder');
    }

    // /**
    //  * Create a new message instance.
    //  */
    // public function __construct()
    // {
    //     //
    // }

    // /**
    //  * Get the message envelope.
    //  */
    // public function envelope(): Envelope
    // {
    //     return new Envelope(
    //         subject: 'Appointment Reminder',
    //     );
    // }

    // /**
    //  * Get the message content definition.
    //  */
    // public function content(): Content
    // {
    //     return new Content(
    //         markdown: 'emails.reminder',
    //     );
    // }

    // /**
    //  * Get the attachments for the message.
    //  *
    //  * @return array<int, \Illuminate\Mail\Mailables\Attachment>
    //  */
    // public function attachments(): array
    // {
    //     return [];
    // }
}
