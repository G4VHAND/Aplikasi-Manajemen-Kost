<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'user_id',
        'room_number',
        'month',
        'start_month',
        'month_count',
        'amount',
        'paid_amount',
        'remaining_amount',
        'status',
        'method',
        'proof',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}