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
        Schema::create('lab_request_lab_test', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lab_request_id')->constrained('lab_request')->onDelete('cascade');
            $table->foreignId('lab_test_id')->constrained('lab_test')->onDelete('cascade');
            $table->timestamps();
        });        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lab_request_lab_test');
    }
};
