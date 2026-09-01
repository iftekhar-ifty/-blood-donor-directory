<?php

namespace Database\Seeders;

use App\Models\Union;
use Illuminate\Database\Seeder;

class UnionSeeder extends Seeder
{
    /**
     * Unions of the single district this app operates in.
     */
    public function run(): void
    {
        $unions = [
            'Barura Union',
            'Kachua Union',
            'Cumilla Sadar Union',
            'Mirpur Union',
            'Brahmanbaria Union',
            'Sonaimuri Union',
            'Sitakunda Union',
            'Patiya Union',
        ];

        foreach ($unions as $name) {
            Union::firstOrCreate(['name' => $name]);
        }
    }
}
