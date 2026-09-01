<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Donation extends Model
{
    use HasUuids;

    /**
     * Minimum days between two donations (the 2.5-month rule).
     * Single source of truth for validation, eligibility display and filtering.
     */
    public const MIN_DONATION_GAP_DAYS = 75;

    protected $fillable = [
        'user_id',
        'donation_date',
        'location',
        'donation_type',
        'hospital',
        'notes',
        'status',
    ];

    protected $casts = [
        'donation_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
