@component('mail::message')
# Follow-Up Appointment Confirmed

Dear **{{ $booking->patient->name }}**,

Your **follow-up appointment** has been successfully confirmed. Here are the details of your upcoming consultation:

@component('mail::panel')
  {{-- <div style="text-align: center;">
    <h2 style="margin-bottom: 5px; color: #4CAF50;">{{ $booking->appointment->title }}</h2>
    <div style="font-size: 18px; font-weight: bold; margin: 10px 0;">
        {{ \Carbon\Carbon::parse($booking->appointment->date_start)->format('l, F j, Y') }}
    </div>
    <div style="font-size: 20px; color: #2563EB; font-weight: bold; margin: 10px 0;">
        {{ \Carbon\Carbon::parse($booking->selected_time)->format('h:i A') }}
    </div>
    <div style="margin-top: 10px;">
        with <strong>Dr. {{ $booking->appointment->doctor->name }}</strong>
    </div>
  </div> --}}
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" border="0" style="text-align: center;">
          <tr>
            <td>
              <h2 style="margin-bottom: 5px; color: #4CAF50;">
                {{ $booking->appointment->title }}
              </h2>
              <div style="font-size: 18px; font-weight: bold; margin: 10px 0;">
                {{ \Carbon\Carbon::parse($booking->appointment->date_start)->format('l, F j, Y') }}
              </div>
              <div style="font-size: 20px; color: #2563EB; font-weight: bold; margin: 10px 0;">
                {{ \Carbon\Carbon::parse($booking->selected_time)->format('h:i A') }}
              </div>
              <div style="margin-top: 10px;">
                with <strong>Dr. {{ $booking->appointment->doctor->name }}</strong>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>   
@endcomponent

@if($booking->appointment->location)
<div style="margin: 20px 0;">
  <strong>Location:</strong> {{ $booking->appointment->location }}
</div>
@endif

@if($booking->appointment->notes)
<div style="margin: 20px 0;">
  <strong>Additional Notes:</strong><br>
  {{ $booking->appointment->notes }}
</div>
@endif

<div style="margin: 20px 0; color: #065f46;">
  🩺 This is a **follow-up consultation**. Be ready to discuss any updates, progress, or changes in your symptoms since your last visit.
</div>

<div style="background-color: #F3F4F6; padding: 15px; border-radius: 5px; margin: 20px 0;">
  <p style="margin: 0; color: #4B5563;">📝 Please arrive <strong>15 minutes</strong> before your scheduled appointment time.</p>
</div>

@component('mail::button', ['url' => url(config('app.url') . '/video-call?booking_id=' . $booking->id . '&patient_id=' . $booking->patient_id . '&recipient=' . ($recipient ?? 'patient')), 'color' => 'success'])
Join Video Call
@endcomponent

Thank you for your continued trust in our care.

Warm regards,  
The **{{ config('app.name') }}** Team
@endcomponent
