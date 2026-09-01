<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Upazila extends Model
{
    protected $fillable = [
        'name',
    ];

    public function unions(): HasMany
    {
        return $this->hasMany(Union::class);
    }
}
