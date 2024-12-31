<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{

    public function index(Request $request)
    {    
         $limit = $request->query("limit",10);
        $courses = Course::limit($limit)->get();
        
        return response()->json($courses);
    }
    

   
    public function store(Request $request)
    {
   
    $validator = Validator::make($request->all(), [
        'title' => 'required|string|max:255',
        'slug' => 'required|string|max:255',
        'description' => 'required|string',
        'type' => 'required|string',
        'image' => 'required|string', 
        'level' => 'required|string', 
        'sub_level' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422);
    }

    
    $imageData = $request->input('image');
    if (strpos($imageData, 'base64') !== false) {
        $imageData = explode(',', $imageData)[1]; 
    }

    try {
       
        $fileName = 'image_' . time() . '.png';
        Storage::disk('public')->put($fileName, base64_decode($imageData));
        $imagePath = Storage::url($fileName);

        
        $course = Course::create([
            'title' => $request->input('title'),
            'slug' => $request->input('slug'),
            'description' => $request->input('description'),
            'type' => $request->input('type'),
            'image_url' => $imagePath,
            "level"=>$request->input('level'),
            'sub_level' => $request->input('sub_level'),
        ]);

        
        return response()->json([
            'message' => 'Course created successfully',
            'course' => $course,
        ], 201);

        } catch (\Exception $e) {
        
        return response()->json([
            'message' => 'Failed to create course',
            'error' => $e->getMessage(),
        ], 500);
        }
        
    }
   
    

    public function show($id){
        $course = Course::findOrFail($id);
        return response()->json($course);
     }
        
    
   public function update(Request $request, $id ){
    $validated = $request->validate([
        "title" => "sometimes|string|max:255",
        "description"=>"sometimes|string",
        "imageUrl"=> "sometimes|string",
        "type"=>"sometimes|string",
        "level"=>"sometimes|string",
        "sub_level"=>"sometimes|string"
    ]

    ); 
    $course = Course::findOrFail($id);
    if ($request->hasFile('imageUrl')) {
        $imagePath = $request->file('imageUrl')->store('images', 'public');
        $validated['imageUrl'] = $imagePath;
    }

    $course->update($validated);


    return response()->json($course,200);






   }

   public function destroy($id)
   {
       try {
  
           $course = Course::findOrFail($id);
   
           
           $course->delete();
   
           return response()->json(["message" => "Course deleted successfully"], 200);
       } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
           
           return response()->json(["message" => "Course not found"], 404);
       } catch (\Exception $e) {
          
           Log::error("Error deleting course with ID {$id}: " . $e->getMessage());
           return response()->json(["message" => "Failed to delete course", "error" => $e->getMessage()], 500);
       }
   }
   
   
   public function toggleLike($id)
   {
       $user = auth()->user();
       $course = Course::find($id);
   
       if (!$course) {
           return response()->json(['error' => 'Course not found'], 404);
       }
   
      
       if ($course->likes()->where('user_id', $user->id)->exists()) {
         
           $course->likes()->detach($user->id);
           return response()->json(['message' => 'Course unliked']);
       }
   
       
       $course->likes()->attach($user->id);
       return response()->json(['message' => 'Course liked']);
   }
   
   public function isLiked($id)
   {
       $user = auth()->user();
       $course = Course::findOrFail($id);
   
       if (!$course) {
           return response()->json(['error' => 'Course not found'], 404);
       }
   
       
       $isLiked = $course->likes()->where('user_id', $user->id)->exists();
   
       return response()->json(['isLiked' => $isLiked]);
   }
     
  public function addComment(Request $request, $id){
    $validated = $request->validate([
        "comment" => " required|string|max:255",
    ]);

    $course = Course::findOrFail($id);
    
    $comment = Comment::create([
        "comment" => $validated['comment'],
        "user_id" => auth()->id(),
        "course_id" => $course->id,
    ]);
    return response()->json(['message'=>"Commentaire ajoute avec succes ", 'comment'=>$comment]);
  }

    public function getComments($id)
    {
      try 
      {
        
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

       
        $comments = Comment::where('course_id', $id)
            ->with('user:id,name,profile_photo')->get();
        

        return response()->json($comments);
    } catch (\Exception $e) {
        
        return response()->json(['message' => 'An error occurred', 'error' => $e->getMessage()], 500);
     }
   }

   public function getLatestComments()
   {
       try {
           $comments = Comment::with(['user:id,name,profile_photo', 'course:id,title'])
               ->orderBy('created_at', 'desc')
               ->limit(3)
               ->get();
   
           return response()->json($comments);
       } catch (\Exception $e) {
           return response()->json([
               'message' => 'An error occurred',
               'error' => $e->getMessage()
           ], 500);
       }
   }

 

 

   



}
