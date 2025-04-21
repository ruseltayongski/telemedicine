<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lab_request', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('booking_id')->constrained('booked_appointments')->onDelete('cascade');
            $table->date('requested_date');
            $table->date('scheduled_date')->nullable();
            $table->text('doctor_notes')->nullable();
            $table->text('result')->nullable(); //Review After Test Completion
            $table->text('result_comments')->nullable(); //Review After Test Completion
            $table->boolean('is_abnormal')->nullable(); #true	The result is abnormal, false	The result is normal, null	The doctor has not reviewed or decided yet
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lab_request');
    }
};
