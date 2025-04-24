{{-- @component('mail::message')
# Appointment Reminder

Hello, {{ $name }}!

This is a reminder that you have an upcoming appointment:

- **Title:** {{ $booking->appointment->title }}
- **Date:** {{ \Carbon\Carbon::parse($booking->appointment->date_start)->format('F j, Y') }}
- **Time:** {{ \Carbon\Carbon::parse($booking->appointment->date_start)->format('h:i A') }}

Please be ready 15 minutes before the scheduled time.

<a href="{{ url(config('app.url') . '/video-call?booking_id=' . $booking->id . '&patient_id=' . $booking->patient_id . '&recipient=' . $recipient) }}" style="text-decoration: none;">
    Click here to join call
</a>

Thanks,<br>
{{ config('app.name') }}
@endcomponent --}}

@component('mail::message')
# Appointment Reminder

Dear **{{ $name }}**,

This is a reminder for your upcoming appointment:

@component('mail::panel')
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" style="text-align: center;">
                    <tr>
                        <td>
                            <h2 style="margin-bottom: 5px; color: #006838; text-align: center;">
                                {{ $booking->appointment->title }}
                            </h2>
                            <div style="font-size: 18px; font-weight: bold; margin: 10px 0;">
                                {{ \Carbon\Carbon::parse($booking->appointment->date_start)->format('l, F j, Y') }}
                            </div>
                            <div style="font-size: 20px; color: #004025; font-weight: bold; margin: 10px 0;">
                                {{ \Carbon\Carbon::parse($booking->appointment->date_start)->format('h:i A') }}
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>        
@endcomponent

<div style="background-color: #f3f8f5; padding: 15px; border-left: 4px solid #3c9f63; border-radius: 5px; margin: 20px 0;">
    <p style="margin: 0; color: #004025;">⏰ Please be ready <strong>15 minutes</strong> before your scheduled appointment time.</p>
</div>

@component('mail::button', ['url' => '#', 'color' => 'success'])
Join Call
@endcomponent

Thank you for choosing our services!

Regards,<br>
{{ config('app.name') }}
@endcomponent
