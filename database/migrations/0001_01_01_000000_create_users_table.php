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
        Schema::create('users', function (Blueprint $table) {
             $table->uuid('id')->primary();
            
            // Authentication & Identity
            $table->string('name', 150);
            $table->string('username', 50)->unique();
            $table->string('phone', 20)->unique();
            $table->string('password_hash', 255); // Or just 'password' if using Laravel Breeze/Jetstream
            
            // Blood & Location Info
            $table->string('blood_group', 3);
            $table->foreignId('union_id')->nullable()->constrained('unions')->nullOnDelete();
            $table->foreignId('village_id')->nullable()->constrained('villages')->nullOnDelete();
            
            // Status & Privacy
            $table->boolean('is_available')->default(true);
            $table->string('unavailable_reason', 50)->nullable();
            
            // Cached field for fast filtering
            $table->date('last_donation_date')->nullable();
            
            $table->timestamps();
            
            // Indexes for Directory Search & Filtering
            $table->index(['name']);
            $table->index(['union_id', 'village_id']);
            $table->index(['blood_group', 'is_available', 'union_id']);
            $table->index(['last_donation_date']);
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignUuid('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
