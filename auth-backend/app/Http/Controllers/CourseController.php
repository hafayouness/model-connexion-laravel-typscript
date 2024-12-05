<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{

    public function index()
    {  
        return response()->json(['message' => "hey"]);
        
        // $courses = Course::all();
        // return response()->json($courses);
    }
    public function store(Request $request){
        $rules = [
            'title' => 'required|string|max:255',
            'slug' => 'required|string|unique:courses,slug',
            'description' => 'required|string',
            'type' => 'required|in:online,offline,hybrid',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120'
        ];
    
        $validator = Validator::make($request->all(), $rules);
    
       
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
       
        $validated = $validator->validated();
    
       
        if ($request->hasFile('image')) {
            $imageName = time() . '.' . $request->image->extension();
            $path = $request->image->storeAs('public/courses', $imageName);
            $validated['image'] = Storage::url($path);
        }
    
        
        $course = new Course($validated);
    
      
        if ($course->save()) {
            return response()->json(['message' => 'Course created successfully!', 'course' => $course], 201);
        }
    
       
        return response()->json(['error' => 'Failed to create course.'], 500);
    }
        
        
    
    // public function store(Request $request)
    // {
        
    //     $validated = $request->validate([
    //         'title' => 'required|string|max:255',
    //         'slug' => 'required|string|unique:courses,slug',
    //         'description' => 'required|string',
    //         'type' => 'required|in:online,offline,hybrid',
    //         'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
    //     ]);
    
    //     try {
            
    //         if ($request->hasFile("image")) {
    //             $imageName = time() . "." . $request->image->extension(); 
    //             $path = $request->image->storeAs('public/courses', $imageName); 
    //             $validated['image'] = Storage::url($path); 
    //             Log::info('Image uploaded successfully.', ['image_url' => $validated['image']]);
    //         }
    
            
    //         $course = Course::create($validated);
    
    //         if (!$course) {
    //             return response()->json(['error' => 'Failed to create course.'], 500);
    //         }
    
            
    //         return response()->json(['message' => 'Course created successfully!', 'course' => $course], 201);
    //     } catch (\Exception $e) {
            
    //         Log::error('Failed to create course.', [
    //             'error_message' => $e->getMessage(),
    //             'trace' => $e->getTraceAsString()
    //         ]);
    
    //         // Réponse en cas d'erreur
    //         return response()->json(['error' => 'Failed to create course. Please try again later.'], 500);
    //     }
    // }
    

}
// public function show($id){
//     $course = Course::findOrFail($id);
//     return response()->json($course);
//  }