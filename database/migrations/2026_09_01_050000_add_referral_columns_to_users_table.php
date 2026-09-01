<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('referral_code', 8)->nullable()->unique()->after('username');
            $table->foreignUuid('referred_by_user_id')->nullable()->after('referral_code')
                ->constrained('users')->nullOnDelete();
        });

        // Backfill codes for existing (seeded) users
        User::query()->whereNull('referral_code')->each(function (User $user) {
            do {
                $code = strtoupper(Str::random(8));
            } while (User::query()->where('referral_code', $code)->exists());

            $user->forceFill(['referral_code' => $code])->save();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('referred_by_user_id');
            $table->dropUnique('users_referral_code_unique');
            $table->dropColumn('referral_code');
        });
    }
};
