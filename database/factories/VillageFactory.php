<?php

namespace Database\Factories;

use App\Models\Union;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Village>
 */
class VillageFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'union_id' => Union::factory(),
            'name' => fake()->unique()->streetName(),
        ];
    }
}
