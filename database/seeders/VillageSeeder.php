<?php

namespace Database\Seeders;

use App\Models\Union;
use App\Models\Village;
use Illuminate\Database\Seeder;

class VillageSeeder extends Seeder
{
    /**
     * Starter villages grouped by union name (Noakhali).
     * The catalog grows organically as donors add their own.
     */
    public function run(): void
    {
        $villagesByUnion = [
            'বিনোদপুর' => ['মাইজদী কোর্ট', 'দৌলতগঞ্জ', 'সোনাপুর'],
            'নোয়াখালী' => ['নোয়াখালী বাজার', 'রাজগঞ্জ বাজার'],
            'জয়াগ' => ['জয়াগ বাজার', 'উত্তর জয়াগ'],
            'চাষীর হাট' => ['চাষীর হাট', 'পশ্চিম চাষীর হাট'],
            'বেগমগঞ্জ' => ['বেগমগঞ্জ বাজার', 'চৌমুহনী'],
            'ছয়ানী' => ['ছয়ানী', 'পূর্ব ছয়ানী'],
            'কাবিলপুর' => ['কাবিলপুর বাজার', 'দক্ষিণ কাবিলপুর'],
            'সাহাপুর' => ['সাহাপুর', 'উত্তর সাহাপুর'],
            'পাঁচগাঁও' => ['পাঁচগাঁও বাজার', 'মধ্যম পাঁচগাঁও'],
            'চর আমানউল্যাহ' => ['চর আমানউল্যাহ', 'পূর্ব চর আমানউল্যাহ'],
            'চরবাটা' => ['চরবাটা বাজার', 'নয়াবাজার'],
            'হরণী' => ['হরণী', 'পশ্চিম হরণী'],
            'সুখচর' => ['সুখচর বাজার', 'পূর্ব সুখচর'],
            'নরোত্তমপুর' => ['নরোত্তমপুর বাজার', 'কাজিরহাট'],
        ];

        foreach ($villagesByUnion as $unionName => $villages) {
            $union = Union::where('name', $unionName)->first();

            if (! $union) {
                continue;
            }

            foreach ($villages as $village) {
                Village::firstOrCreate([
                    'union_id' => $union->id,
                    'name' => $village,
                ]);
            }
        }
    }
}
