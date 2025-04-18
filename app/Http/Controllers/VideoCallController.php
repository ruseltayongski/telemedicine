<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Services\AgoraService;
use App\Models\BookedAppointment;
use App\Models\Prescription;

class VideoCallController extends Controller
{
    protected $agoraService;
    
    public function __construct(AgoraService $agoraService)
    {
        $this->agoraService = $agoraService;
    }
    
    public function index(Request $request): Response
    {
        $channelName = 'channelName'.$request->query('booking_id').$request->query('patient_id');
        $uid = $request->query('uid', rand(1000, 9999));
        $token = $this->agoraService->generateToken($channelName, $uid);
        $patient_id = $request->query('patient_id');
        $booking_id = $request->query('booking_id');
        $appointment = BookedAppointment::find($booking_id)->with('appointment.doctor','patient')->first();
        $doctor_id = $appointment->appointment->doctor_id;
        $recipient = $request->query('recipient');
        if($recipient === 'patient') {
            $caller_name = 'Dr. '.$appointment->appointment->doctor->name;
        } else {
            $caller_name = $appointment->patient->name;
        }
        $exist_prescription = Prescription::where('patient_id', $patient_id)
            ->where('doctor_id', $doctor_id)
            ->where('booking_id', $booking_id)
            ->first();
        
        return Inertia::render('VideoCall', [
            'appId' => config('services.agora.app_id'),
            'channelName' => $channelName,
            'token' => null,
            'uid' => $uid,
            'patient_id' => $patient_id,
            'doctor_id' => $doctor_id,
            'recipient' => $recipient,
            'booking_id' => $booking_id,
            'caller_name' => $caller_name,
            'exist_prescription' => $exist_prescription,
        ]);
    }
}
