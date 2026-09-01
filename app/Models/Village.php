<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Village extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'union_id',
    ];

    public function union(): BelongsTo
    {
        return $this->belongsTo(Union::class);
    }
}
