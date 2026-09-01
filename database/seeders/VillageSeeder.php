<?php

namespace Database\Seeders;

use App\Models\Union;
use App\Models\Village;
use Illuminate\Database\Seeder;

class VillageSeeder extends Seeder
{
    /**
     * Villages grouped by union name.
     */
    public function run(): void
    {
        $villagesByUnion = [
            'Barura Union' => ['West Village', 'East Village', 'Barura Bazar'],
            'Kachua Union' => ['Kachua', 'North Kachua'],
            'Cumilla Sadar Union' => ['Cumilla Sadar', 'Daudkandi'],
            'Mirpur Union' => ['Mirpur'],
            'Brahmanbaria Union' => ['Brahmanbaria'],
            'Sonaimuri Union' => ['Sonaimuri'],
            'Sitakunda Union' => ['Sitakunda'],
            'Patiya Union' => ['Patiya'],
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
