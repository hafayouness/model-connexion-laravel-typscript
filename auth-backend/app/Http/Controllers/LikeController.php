<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function like($id)
    {
        $user = auth()->user();
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        // Ajouter un "like"
        $course->likes()->attach($user->id);

        return response()->json(['message' => 'Course liked']);
    }

    public function unlike($id)
    {
        $user = auth()->user();
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        // Retirer un "like"
        $course->likes()->detach($user->id);

        return response()->json(['message' => 'Course unliked']);
    }

    public function isLiked($id)
    {
        $user = auth()->user();
        $course = Course::find($id);

        if (!$course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        // Vérifier si l'utilisateur a "liké" le cours
        $isLiked = $course->likes()->where('user_id', $user->id)->exists();

        return response()->json(['isLiked' => $isLiked]);
    }
}
