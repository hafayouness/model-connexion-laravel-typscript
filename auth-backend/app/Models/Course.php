<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;
    protected $fillable = ["title", "slug","description",'type', 'level', 'sub_level', 'image_url'];
    
    public function likeedByUsers(){
        return $this->belongsToMany(User::class, 'likes')->withTimestamps();
    }

}
