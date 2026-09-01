<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */

#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasUuids, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $keyType = 'uuid';
    public $incrementing = false;

    protected $fillable = [
        'name',
        'username',
        'phone',
        'password_hash',
        'blood_group',
        'union_id',
        'village_id',
        'is_available',
        'unavailable_reason',
        'last_donation_date',
    ];

    protected $hidden = [
        'password_hash',
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'last_donation_date' => 'date',
    ];

    public function union(): BelongsTo
    {
        return $this->belongsTo(Union::class);
    }

    public function village(): BelongsTo
    {
        return $this->belongsTo(Village::class);
    }

    /**
     * The app stores the bcrypt hash in a custom `password_hash` column.
     * Fortify and Auth expect this method to point at the right column.
     */
    public function getAuthPassword(): string
    {
        return $this->password_hash;
    }

    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class)->orderBy('donation_date', 'desc');
    }
}
