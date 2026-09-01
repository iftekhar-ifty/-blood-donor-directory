<?php

namespace App\Http\Controllers;

use App\Models\Union;
use App\Models\User;
use App\Models\Village;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DonorController extends Controller
{
    // GET /donors?search=&blood_group=&availability=&union_id=&village_id=&donation_status=&page=
    public function index(Request $request)
    {
        $query = User::query()
            ->where('id', '!=', $request->user()->id)
            ->with(['union:id,name', 'village:id,name'])
            ->withCount('donations');

        // 1. Search (name, username, blood group, union name, village name)
        if ($request->filled('search')) {
            $search = $request->string('search')->trim()->toString();

            $query->where(function ($q) use ($search) {
                $q->whereLike('name', "%{$search}%")
                    ->orWhereLike('username', "%{$search}%")
                    ->orWhere('blood_group', $search)
                    ->orWhereHas('union', fn ($u) => $u->whereLike('name', "%{$search}%"))
                    ->orWhereHas('village', fn ($v) => $v->whereLike('name', "%{$search}%"));
            });
        }

        // 2. Blood group filter
        if ($request->filled('blood_group') && $request->blood_group !== 'all') {
            $query->where('blood_group', $request->blood_group);
        }

        // 3. Availability filter
        if ($request->filled('availability') && $request->availability !== 'all') {
            $query->where('is_available', $request->availability === 'available');
        }

        // 4. Union filter (direct reference or via village's union)
        if ($request->filled('union_id') && $request->union_id !== 'all') {
            $unionId = $request->union_id;

            $query->where(function ($q) use ($unionId) {
                $q->where('union_id', $unionId)
                    ->orWhereHas('village', fn ($v) => $v->where('union_id', $unionId));
            });
        }

        // 5. Village filter
        if ($request->filled('village_id') && $request->village_id !== 'all') {
            $query->where('village_id', $request->village_id);
        }

        // 6. Donation status filter (uses the cached column for speed)
        if ($request->filled('donation_status') && $request->donation_status !== 'all') {
            match ($request->donation_status) {
                'never' => $query->whereNull('last_donation_date'),
                'recent' => $query->where('last_donation_date', '>=', now()->subDays(90)),
                'before' => $query->whereNotNull('last_donation_date'),
                default => null,
            };
        }

        // Available donors first, then by name
        $donors = $query->orderBy('is_available', 'desc')
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        // Public shape: hide phone number and unavailable reason
        $donors->getCollection()->transform(fn ($donor) => $this->formatPublicDonor($donor));

        return Inertia::render('donors/index', [
            'donors' => $donors,
            'filters' => $request->only(['search', 'blood_group', 'availability', 'union_id', 'village_id', 'donation_status']),
            'stats' => [
                'total' => User::count(),
                'available' => User::where('is_available', true)->count(),
            ],
            'unions' => Union::query()->orderBy('name')->get(['id', 'name']),
            'villages' => Village::query()->orderBy('name')->get(['id', 'union_id', 'name']),
        ]);
    }

    // GET /donors/{user}
    public function show(Request $request, User $user)
    {
        // Own profile lives at /profile
        if ($user->id === $request->user()->id) {
            return redirect()->route('donor.profile.show');
        }

        $donor = $user;

        $donor->load(['union:id,name', 'village:id,name'])->loadCount('donations');

        return Inertia::render('donors/show', [
            'donor' => [
                ...$this->formatPublicDonor($donor),
                // Phone is revealed only on the call-confirmation dialog of this page
                'phone' => $donor->phone,
            ],
        ]);
    }

    // Public donor format (hides phone number and unavailable reason)
    private function formatPublicDonor(User $donor): array
    {
        return [
            'id' => $donor->id,
            'name' => $donor->name,
            'username' => $donor->username,
            'blood_group' => $donor->blood_group,
            'village' => $donor->village?->name,
            'union' => $donor->union?->name,
            'available' => $donor->is_available,
            'last_donation_date' => $donor->last_donation_date?->format('Y-m-d'),
            'donations_count' => $donor->donations_count,
        ];
    }
}
