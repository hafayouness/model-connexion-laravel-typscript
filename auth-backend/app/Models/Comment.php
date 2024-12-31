<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = ['comment', 'user_id', 'course_id' ];
    protected $appends = ['is_liked', 'likes_count'];
    protected $casts = [
        'is_liked' => 'boolean',
    ];
    

    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
    
    
    public function likes()
    {
        return $this->belongsToMany(User::class, 'comments_likes', 'comment_id', 'user_id');
        return $this->hasMany(Like::class);
    }
    
    public function getIsLikedAttribute()
    {
        if (!auth()->check()) {
            return false;
        }
        return $this->likes()->where('user_id', auth()->id())->exists();
    }

    // Accesseur pour likes_count
    public function getLikesCountAttribute()
    {
        return $this->likes()->count();
    }

   
    
     
}

