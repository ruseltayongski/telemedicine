<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\BookedAppointmentController;
use App\Http\Controllers\VideoCallController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('appointments', AppointmentController::class);
    Route::get('/booked-appointments', [BookedAppointmentController::class, 'bookedAppointments'])->name('booked.appointments.index');
    Route::get('/calendar', [BookedAppointmentController::class, 'calendar'])->name('calendar');
    Route::post('/appointments/book', [BookedAppointmentController::class, 'book'])->name('appointments.book');
    Route::get('/video-call', [VideoCallController::class, 'index'])->name('video-call');
    
    Route::get('/doctor-bookings', [BookedAppointmentController::class, 'manageBooking'])->name('doctor.manage.booking');
    Route::put('/doctor-bookings/{id}/status', [BookedAppointmentController::class, 'updateStatus'])->name('doctor.bookings.update-status');
});

require __DIR__.'/auth.php';
