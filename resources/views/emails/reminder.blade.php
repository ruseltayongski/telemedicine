@component('mail::message')
# Appointment Reminder

Hello {{ ucfirst($recipient) }},

This is a reminder that you have an upcoming appointment:

- **Title:** {{ $booking->appointment->title }}
- **Date:** {{ \Carbon\Carbon::parse($booking->appointment->date_start)->format('F j, Y') }}
- **Time:** {{ \Carbon\Carbon::parse($booking->appointment->date_start)->format('h:i A') }}

Please be ready 15 minutes before the scheduled time.

{{-- <a href="{{ url(config('app.url') . '/video-call?booking_id='.$booking->id) }}" style="text-decoration: none;">Click here to join call</a> --}}
<a href="{{ url(config('app.url') . '/video-call?booking_id=' . $booking->id . '&patient_id=' . $booking->patient_id) }}" style="text-decoration: none;">Click here to join call</a>

Thanks,<br>
{{ config('app.name') }}
@endcomponent
