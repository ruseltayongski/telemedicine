<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Services\AgoraService;

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
        
        return Inertia::render('VideoCall', [
            'appId' => config('services.agora.app_id'),
            'channelName' => $channelName,
            'token' => null,
            'uid' => $uid
        ]);
    }
}
