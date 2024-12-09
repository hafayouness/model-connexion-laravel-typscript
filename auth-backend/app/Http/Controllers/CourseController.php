<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
// use Illuminate\Support\Facades\Log;
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
    // Valider les données
    $validator = Validator::make($request->all(), [
        'title' => 'required|string|max:255',
        'slug' => 'required|string|max:255',
        'description' => 'required|string',
        'type' => 'required|string',
        'image' => 'required|string', 
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422);
    }

    // Traiter l'image Base64
    $imageData = $request->input('image');
    if (strpos($imageData, 'base64') !== false) {
        $imageData = explode(',', $imageData)[1]; 
    }

    try {
        // Générer un nom de fichier unique
        $fileName = 'image_' . time() . '.png';

        // Stocker l'image dans le disque public
        Storage::disk('public')->put($fileName, base64_decode($imageData));

        // Générer l'URL de l'image
        $imagePath = Storage::url($fileName);

        
        $course = Course::create([
            'title' => $request->input('title'),
            'slug' => $request->input('slug'),
            'description' => $request->input('description'),
            'type' => $request->input('type'),
            'image_url' => $imagePath,
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
        
    
   
    

}
