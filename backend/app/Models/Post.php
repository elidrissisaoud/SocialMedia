<?php

namespace App\Models;
use App\Models\User;
use App\Models\Reaction;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'user_id',
        'image',
        'description',
    ];
    public function user(){
        return $this->belongsTo(User::class);
    }
    public function reactions()
    {
        return $this->hasMany(Reaction::class, 'post_id');
    }
}

