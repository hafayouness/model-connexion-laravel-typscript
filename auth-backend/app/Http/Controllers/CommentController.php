<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\CommentLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function toggleLike(Request $request, $id)
{
    $user = Auth::user();  
    $comment = Comment::findOrFail($id);  

   
    $like = CommentLike::where('comment_id', $id)
                       ->where('user_id', $user->id)
                       ->first();

    if ($like) {
    
        $like->delete();
        return response()->json(['message' => 'Like removed'], 200);
    } else {
       
        CommentLike::create([
            'comment_id' => $id,
            'user_id' => $user->id
        ]);
        return response()->json(['message' => 'Like added'], 200);
    }
}
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
}
