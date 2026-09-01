<?php

namespace App\Http\Controllers;

use App\Models\Village;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class VillageController extends Controller
{
    /**
     * Create a village under a union if it does not already exist.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'union_id' => ['required', 'integer', Rule::exists('unions', 'id')],
        ]);

        $village = Village::firstOrCreate([
            'union_id' => $validated['union_id'],
            'name' => trim($validated['name']),
        ]);

        return response()->json([
            'id' => $village->id,
            'union_id' => $village->union_id,
            'name' => $village->name,
        ], 201);
    }
}
