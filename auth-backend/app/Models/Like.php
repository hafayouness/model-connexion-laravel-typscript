<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    use HasFactory;

    // Indiquer les tables concernées par le modèle
    protected $table = 'comments_likes';

    // Mass assignable attributes (les champs qu'on peut affecter en masse)
    protected $fillable = ['comment_id', 'user_id'];

    // Relation avec l'utilisateur qui a aimé le commentaire
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relation avec le commentaire qui a été aimé
    public function comment()
    {
        return $this->belongsTo(Comment::class);
    }
}
