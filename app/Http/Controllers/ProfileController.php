<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\Union;
use App\Models\User;
use App\Models\Village;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProfileController extends Controller
{
    // GET /profile
    public function show(Request $request)
    {
        $user = $request->user()->load(['union:id,name', 'village:id,name']);

        return Inertia::render('profile/index', [
            'user' => $this->formatOwnProfile($user),
            'donations' => $user->donations()->latest('donation_date')->get(),
        ]);
    }

    // GET /profile/edit
    public function edit(Request $request)
    {
        $user = $request->user()->load(['union:id,name', 'village:id,name']);

        return Inertia::render('profile/edit', [
            'user' => $this->formatOwnProfile($user),
            'unions' => Union::query()->orderBy('name')->get(['id', 'name']),
            'villages' => Village::query()->orderBy('name')->get(['id', 'union_id', 'name']),
        ]);
    }

    // PUT /profile
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'phone' => ['required', 'string', 'max:20', Rule::unique('users', 'phone')->ignore($user->id)],
            'username' => ['required', 'string', 'max:50', 'alpha_dash', Rule::unique('users', 'username')->ignore($user->id)],
            'blood_group' => ['required', 'string', 'in:A+,A-,B+,B-,AB+,AB-,O+,O-'],
            'union_id' => ['nullable', 'integer', 'exists:unions,id'],
            'village_id' => [
                'nullable',
                'integer',
                Rule::exists('villages', 'id')->where('union_id', $request->input('union_id')),
            ],
            'is_available' => ['boolean'],
        ]);

        $user->update(Arr::except($validated, ['village_id']) + (
            // Keep village only when it belongs to the chosen union
            $this->villageBelongsToUnion($validated) ? ['village_id' => $validated['village_id'] ?? null] : ['village_id' => null]
        ));

        return redirect()->route('donor.profile.show')->with('success', 'Profile updated successfully.');
    }

    // PATCH /profile/availability
    public function toggleAvailability(Request $request)
    {
        $validated = $request->validate([
            'is_available' => ['required', 'boolean'],
            'unavailable_reason' => ['nullable', 'string', 'max:50'],
        ]);

        $user = $request->user();
        $user->is_available = $validated['is_available'];

        // Only keep a reason while unavailable
        $user->unavailable_reason = $validated['is_available'] ? null : ($validated['unavailable_reason'] ?? null);

        $user->save();

        return redirect()->back()->with(
            'success',
            $user->is_available ? 'You are now available.' : 'You are now unavailable.'
        );
    }

    // GET /profile/donations
    public function donations(Request $request)
    {
        $donations = $request->user()
            ->donations()
            ->latest('donation_date')
            ->get();

        return Inertia::render('profile/donations', [
            'donations' => $donations,
        ]);
    }

    // POST /profile/donations
    public function storeDonation(Request $request)
    {
        $validated = $request->validate([
            'donation_date' => ['required', 'date', 'before_or_equal:today'],
            'location' => ['required', 'string', 'max:255'],
            'donation_type' => ['required', 'string', 'in:Whole Blood,Platelets,Plasma'],
            'hospital' => ['nullable', 'string', 'max:150'],
            'notes' => ['nullable', 'string'],
        ]);

        $user = $request->user();

        $donation = Donation::create([
            ...$validated,
            'user_id' => $user->id,
            'status' => 'Completed',
        ]);

        // Keep the cached last_donation_date fresh for directory filtering
        if (! $user->last_donation_date || $donation->donation_date->gt($user->last_donation_date)) {
            $user->last_donation_date = $donation->donation_date;
            $user->save();
        }

        return redirect()->route('donor.profile.donations')->with('success', 'Donation record added.');
    }

    // Whether the submitted village belongs to the submitted union
    private function villageBelongsToUnion(array $validated): bool
    {
        if (empty($validated['village_id'])) {
            return true;
        }

        return Village::query()
            ->where('id', $validated['village_id'])
            ->where('union_id', $validated['union_id'] ?? 0)
            ->exists();
    }

    // Full own-profile shape (includes phone + private reason)
    private function formatOwnProfile(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'phone' => $user->phone,
            'blood_group' => $user->blood_group,
            'village' => $user->village?->name,
            'village_id' => $user->village_id,
            'union' => $user->union?->name,
            'union_id' => $user->union_id,
            'available' => $user->is_available,
            'unavailable_reason' => $user->unavailable_reason,
            'last_donation_date' => $user->last_donation_date?->format('Y-m-d'),
            'donations_count' => $user->donations()->count(),
        ];
    }
}
