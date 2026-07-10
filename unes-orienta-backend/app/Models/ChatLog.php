<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatLog extends Model
{
    protected $fillable = [
        'user_id',
        'role',
        'content',
        'tokens_used',
        'model_used',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
