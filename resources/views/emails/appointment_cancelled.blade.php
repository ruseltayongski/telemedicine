@component('mail::message')
# Appointment Cancelled

Dear **{{ $booking->patient->name }}**,

We regret to inform you that your appointment has been **cancelled**.

@component('mail::panel')
<div style="text-align: center;">
    <h2 style="margin-bottom: 5px; color: #EF4444;">{{ $booking->appointment->title }}</h2>
    <div style="font-size: 18px; font-weight: bold; margin: 10px 0;">
        {{ \Carbon\Carbon::parse($booking->appointment->date_start)->format('l, F j, Y') }}
    </div>
    <div style="font-size: 20px; color: #9CA3AF; font-weight: bold; margin: 10px 0;">
        {{ \Carbon\Carbon::parse($booking->selected_time)->format('h:i A') }}
    </div>
    <div style="margin-top: 10px;">
        with <strong>Dr. {{ $booking->appointment->doctor->name }}</strong>
    </div>
</div>
@endcomponent

@if($booking->appointment->location)
<div style="margin: 20px 0;">
    <strong>Original Location:</strong> {{ $booking->appointment->location }}
</div>
@endif

@if($booking->appointment->notes)
<div style="margin: 20px 0;">
    <strong>Original Notes:</strong><br>
    {{ $booking->appointment->notes }}
</div>
@endif

<div style="background-color: #FEF2F2; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p style="margin: 0; color: #B91C1C;">⚠️ We're sorry for any inconvenience this may have caused. You are welcome to book another appointment at your convenience.</p>
</div>

@component('mail::button', ['url' => url(config('app.url') . '/'), 'color' => 'error'])
Book Another Appointment
@endcomponent

We truly apologize for any inconvenience this may have caused. We appreciate your patience and understanding.

Regards,<br>
The {{ config('app.name') }} Team
@endcomponent
