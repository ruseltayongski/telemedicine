<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\BookedAppointmentController;
use App\Http\Controllers\VideoCallController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\LabRequestController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Models\User;
use Illuminate\Http\Request;


Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/test-api', [HomeController::class, 'dashboardData'])->name('test-api');

Route::get('/dashboard', [HomeController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('dashboard');

// Route::middleware('auth')->group(function () {
//     Route::get('/email/verify', function () {
//         return Inertia::render('Auth/VerifyEmail');
//     })->name('verification.notice');
    
//     Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
//         $request->fulfill();
//         return redirect('/dashboard');
//     })->middleware(['signed'])->name('verification.verify');
    
//     Route::post('/email/verification-notification', function (Request $request) {
//         $request->user()->sendEmailVerificationNotification();
//         return back()->with('message', 'Verification link sent!');
//     })->middleware(['throttle:6,1'])->name('verification.send');
// });

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('appointments', AppointmentController::class);
    Route::get('/booked-appointments', [BookedAppointmentController::class, 'bookedAppointments'])->name('booked.appointments.index');
    Route::get('/calendar', [BookedAppointmentController::class, 'calendar'])->name('calendar');
    Route::post('/appointments/book', [BookedAppointmentController::class, 'book'])->name('appointments.book');
    
    Route::get('/doctor-bookings', [BookedAppointmentController::class, 'manageBooking'])->name('doctor.manage.booking');
    Route::put('/doctor-bookings/{id}/status', [BookedAppointmentController::class, 'updateStatus'])->name('doctor.bookings.update-status');

    Route::resource('prescriptions', PrescriptionController::class)->only(['store', 'show']);

    Route::get('/chat', [ChatController::class, 'index'])->name('chat');
    Route::post('/update-status', [ChatController::class, 'updateOnlineStatus'])->name('update.status');
});
Route::get('prescriptions/{patient_id}/{doctor_id}/{booking_id}/pdf', [PrescriptionController::class, 'downloadPrescriptionPdf'])->name('prescriptions.pdf');
Route::post('/chats', [ChatController::class, 'store'])->name('chats.store');
Route::get('/chats', [ChatController::class, 'chats'])->name('chats');
Route::get('/chats/{id}/download', [ChatController::class, 'downloadFile'])->name('chats.download');
Route::match(['POST','GET'],'/video-call', [VideoCallController::class, 'index'])->name('video-call');
Route::post('/lab-requests-create', [LabRequestController::class, 'labRequestCreate'])->name('lab-requests.create');
Route::get('/lab-tests', [LabRequestController::class, 'labTests'])->name('lab-tests');
Route::get('/lab-requests/pdf', [LabRequestController::class, 'downloadLabRequestPdf'])->name('laboratory.request.pdf');
Route::get('/doctor/report', [HomeController::class, 'doctorReport'])->name('doctor.report');

Route::middleware('guest')->group(function () {
    Route::post('login/request-otp', [AuthenticatedSessionController::class, 'requestOtp'])
        ->name('login.request-otp');
    
    Route::post('login/verify-otp', [AuthenticatedSessionController::class, 'verifyOtp'])
        ->name('login.verify-otp');
});

Route::post('/ai/prescription', function (Request $request) {
    try {
        $client = OpenAI::client(config('services.openai.key'));
        
        $response = $client->chat()->create([
            'model' => 'gpt-4.1',
            'messages' => [
                [
                    'role' => 'system', 
                    'content' => 'You are a helpful medical assistant that helps doctors create and refine prescriptions. 
                    Always respond with properly formatted HTML lists of medications with dosages and instructions.
                    Never suggest medications without proper dosage information.
                    Include warnings about potential interactions when relevant.'
                ],
                ['role' => 'user', 'content' => $request->prompt]
            ],
            'temperature' => 0.3
        ]);

        return response()->json([
            'content' => $response->choices[0]->message->content
        ]);

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

Route::post('/appointments/follow-up', [BookedAppointmentController::class, 'createFollowUpAppointment'])->name('appointments.follow-up');

require __DIR__.'/auth.php';
