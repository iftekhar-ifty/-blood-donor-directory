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
        Schema::create('donations', function (Blueprint $table) {
             $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->date('donation_date');
            $table->string('location', 255);
            $table->string('donation_type', 20)->default('Whole Blood');
            $table->string('hospital', 150)->nullable();
            $table->text('notes')->nullable();
            $table->string('status', 20)->default('Completed');
            $table->timestamps();
            
            // Foreign Key
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Index for fetching user history quickly
            $table->index(['user_id', 'donation_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
