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
        Schema::create('booked_appointments', function (Blueprint $table) {
            $table->id();
            $table->string('booking_code');
            $table->unsignedBigInteger('appointment_id');
            $table->unsignedBigInteger('patient_id');
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'rejected'])->default('pending');
            $table->enum('type', ['new', 'follow_up'])->default('new');
            $table->time('selected_time')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();

            $table->foreign('appointment_id')->references('id')->on('appointments')->onDelete('cascade');
            $table->foreign('patient_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booked_appointments');
    }
};
