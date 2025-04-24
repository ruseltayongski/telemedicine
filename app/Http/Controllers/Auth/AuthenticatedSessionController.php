<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\LoginOtp;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Mail;
use Kreait\Laravel\Firebase\Facades\Firebase;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();

        if ($user->role_id == 2) {
            return redirect()->intended(route('dashboard', absolute: false));
        } elseif ($user->role_id == 3) {
            return redirect()->intended(route('home', absolute: false));
        }
        
        // return redirect()->intended(route('dashboard', absolute: false));
    }

    public function requestOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Check if user exists and password is correct
        $user = User::where('email', $request->email)->first();
        
        if (!$user || !Hash::check($request->password, $user->password)) {
            return back()->withErrors([
                'email' => 'The provided credentials are incorrect.',
            ]);
        }

        // Generate 6-digit OTP
        $otp = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Store OTP in database
        LoginOtp::where('email', $request->email)
            ->where('used', false)
            ->update(['used' => true]);
            
        LoginOtp::create([
            'email' => $request->email,
            'otp' => $otp,
            'expires_at' => now()->addMinutes(10),
        ]);

        // Send OTP via email
        // $user->notify(new LoginOtpNotification($otp));
        if($request->otp_method == 'email') {
            Mail::to($user->email)->send(new \App\Mail\OtpCodeMail($otp, $user->name));
        }
        else {
            $database = Firebase::database();
            $otpData = [
                'message' => 'Hi '.$user->name.', your Telemedicine verification code is: '.$otp.'. This code will expire in 10 minutes. Do not share this code with anyone.',
                'contact' => $user->contact,
            ];
            $database->getReference('otp')->push($otpData);
        }

        return back()->with([
            'status' => 'We have sent a verification code to your email.',
        ]);
    }

    /**
     * Verify OTP and log in the user.
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        // Find the most recent unused OTP for this email
        $otpRecord = LoginOtp::where('email', $request->email)
            ->where('otp', $request->otp)
            ->where('used', false)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (!$otpRecord) {
            return back()->withErrors([
                'otp' => 'The verification code is invalid or has expired.',
            ]);
        }

        // Mark OTP as used
        $otpRecord->update(['used' => true]);

        // Log in the user
        $user = User::where('email', $request->email)->first();
        Auth::login($user, $request->boolean('remember'));
        
        $request->session()->regenerate();
        
        if ($user->role_id == 2) {
            return redirect()->intended(route('dashboard', absolute: false));
        } elseif ($user->role_id == 3) {
            return redirect()->intended(route('home', absolute: false));
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
