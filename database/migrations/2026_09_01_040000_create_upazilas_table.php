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
        Schema::create('upazilas', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->timestamps();
        });

        Schema::table('unions', function (Blueprint $table) {
            // Union names repeat across upazilas (e.g. নোয়াখালী in সদর and
            // বেগমগঞ্জ), so uniqueness moves from name alone to (upazila_id, name).
            $table->dropUnique('unions_name_unique');

            $table->foreignId('upazila_id')->nullable()->after('name')->constrained('upazilas')->nullOnDelete();

            $table->unique(['upazila_id', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('unions', function (Blueprint $table) {
            $table->dropUnique('unions_upazila_id_name_unique');
            $table->dropConstrainedForeignId('upazila_id');
            $table->unique('name');
        });

        Schema::dropIfExists('upazilas');
    }
};
