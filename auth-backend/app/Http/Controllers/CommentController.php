<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\CommentLike;
use App\Models\Course;
use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\ModelNotFoundException;
class CommentController extends Controller
{
//     public function toggleLike(Request $request, $id)
// {
//     $user = Auth::user();  
//     $comment = Comment::findOrFail($id);  

   
//     $like = CommentLike::where('comment_id', $id)
//                        ->where('user_id', $user->id)
//                        ->first();

//     if ($like) {
    
//         $like->delete();
//         return response()->json(['message' => 'Like removed'], 200);
//     } else {
       
//         CommentLike::create([
//             'comment_id' => $id,
//             'user_id' => $user->id
//         ]);
//         return response()->json(['message' => 'Like added'], 200);
//     }
// }
 public function updateComment(Request $request , $id){
    $user = Auth::user();
    $comment = Comment::findOrFail($id);

    if($comment-> user_id != $user->id){
        return response()->json(['error'=>"unauthorized"],400);


    }
     $request->validate([
        "content"=> "sometimes|string|max:255",
     ]);
     $comment->update([
        'content'=>$request->content
     ]);
     return response()->json(["message"=>"comment update successFully"],200);
 }
  
  public function deleteComment($id){
    $user = auth::user();
    $comment = Comment::findOrFail($id);

    if($comment-> user_id !=$user->id){
        return response()->json(["error"=>"Unauthorized"],400);
    }

    $comment->delete();

    return response()->json(['message'=> "comment deleted successFully"],200);

  }
     
  
  public function index($courseId)
  {
      try {
          $comments = Comment::with('user')
              ->where('course_id', $courseId)
              ->get()
              ->map(function ($comment) {
                  return [
                      'id' => $comment->id,
                      'comment' => $comment->comment,
                      'user' => $comment->user,
                      'is_liked' => $comment->is_liked,
                      'likes_count' => $comment->likes_count,
                      // autres champs nécessaires...
                  ];
              });

          return response()->json($comments);
      } catch (\Exception $e) {
          return response()->json([
              'message' => 'Error fetching comments',
              'error' => $e->getMessage()
          ], 500);
      }
  }
 


public function toggleLike($commentId)
{
    $userId = auth()->id();
    if (!$userId) {
        return response()->json(['message' => 'User not authenticated'], 401);
    }

    try {
        $comment = Comment::findOrFail($commentId);
        $like = $comment->likes()->where('user_id', $userId)->first();

        if ($like) {
            $like->delete();
            $message = 'Like removed';
        } else {
            $comment->likes()->attach($userId);
            $message = 'Like added';
        }

        return response()->json([
            'message' => $message,
            'likes_count' => $comment->fresh()->likes()->count()
        ]);

    } catch (ModelNotFoundException $e) {
        return response()->json(['message' => 'Comment not found'], 404);
    }
}

    public function isLiked($commentId)
    {
        $comment = Comment::findOrFail($commentId);
        $isLiked = $comment->likes()
            ->where('user_id', Auth::id())
            ->exists();

        return response()->json([
            'isLiked' => $isLiked,
            'likesCount' => $comment->likes()->count()
        ]);
    }

    






}
