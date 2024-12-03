<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;


class CourseController extends Controller
{
    public function store(Request $request)
        {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'slug' => 'required|string|unique:courses,slug',
                'description' => 'required|string',
                'about_course' => 'nullable|string',
            ]);
    
            $course = Course::create($validated);
    
            return response()->json(['message' => 'Course created successfully!', 'course' => $course], 201);
        }
    
     public function show($id){
        $course = Course::findOrFail($id);
        return response()->json($course);
     }
}
