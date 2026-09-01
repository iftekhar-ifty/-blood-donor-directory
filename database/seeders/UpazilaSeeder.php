<?php

namespace Database\Seeders;

use App\Models\Upazila;
use Illuminate\Database\Seeder;

class UpazilaSeeder extends Seeder
{
    /**
     * The 9 upazilas of Noakhali district (Bengali names).
     */
    public function run(): void
    {
        $upazilas = [
            'নোয়াখালী সদর',
            'বেগমগঞ্জ',
            'চাটখিল',
            'সোনাইমুড়ি',
            'সেনবাগ',
            'কবিরহাট',
            'কোম্পানীগঞ্জ',
            'হাতিয়া',
            'সুবর্ণচর',
        ];

        foreach ($upazilas as $name) {
            Upazila::firstOrCreate(['name' => $name]);
        }
    }
}
