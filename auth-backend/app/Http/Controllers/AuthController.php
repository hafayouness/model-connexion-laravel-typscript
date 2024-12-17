<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function signup(Request $request) {
        try {
            
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8|confirmed',
                'password_confirmation' => 'required_with:password',
                'role' => 'required|in:admin,professor,student',
                'profile_photo' => 'nullable|string', 
            ]);
    
            
            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed', 
                    'errors' => $validator->errors()
                ], 422);
            }
    
            $profilePhotoPath = null;
    
           
            if ($request->filled('profile_photo')) {
                try {
                    
                    Log::info('Profile Photo Received', [
                        'photo' => substr($request->input('profile_photo'), 0, 100) . '...' 
                    ]);
    
                    
                    $imageData = $request->input('profile_photo');
                    
                    
                    if (strpos($imageData, 'data:image/') === 0) {
                        
                        list($type, $imageData) = explode(';', $imageData);
                        list(, $imageData) = explode(',', $imageData);
                    }
    
                    
                    $image = base64_decode($imageData);
    
                   
                    if ($image === false) {
                        throw new \Exception('Impossible de décoder l\'image');
                    }
    
                   
                    $imageName = Str::uuid() . '.jpg';
                    $path = 'profile_photos/' . $imageName;
    
                    
                    Storage::disk('public')->put($path, $image);
    
                    
                    $profilePhotoPath = $path;
    
                    Log::info('Image uploaded successfully', ['path' => $path]);
    
                } catch (\Exception $imageException) {
                    
                    Log::error('Image upload error: ' . $imageException->getMessage());
                    
                   
                    $profilePhotoPath = null;
                }
            }
    
            
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,  
                'profile_photo' => $profilePhotoPath,
            ]);
    
            return response()->json([
                'message' => 'User created successfully',
                'user' => $user,
                'profile_photo_url' => $profilePhotoPath 
                    ? asset('storage/' . $profilePhotoPath) 
                    : null
            ], 201);
    
        } catch (\Exception $e) {
            
            Log::error('Signup error: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Server error', 
                'error' => $e->getMessage()
            ], 500);
        }
    }



    
    
    
    public function signin(Request $request)
    {
        
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();
            $token = $user->createToken('generateToken')->plainTextToken;

            return response()->json([
                'message' => 'User signed in successfully',
                'token' => $token,
            ]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }
    public function getAllUsers(){
        $users = User::all();

        return response()->json([
            'users'=>$users
        ]
           
        );

    }
    public function getAuthenticatedUser(Request $request) {
        return $request->user();
    }

    public function update(Request $request, $id){
        $validator = Validator::make($request->all(),[
            'name'=>"sometimes|string|max:255",
            "email"=> "sometimes|email|unique:users,email," . $id,
            "profile_photo" =>"sometimes|string",
        ]);
        if($validator->fails()){
            return response()->json(['errors'=> $validator->errors()],422);
        }
        $user = User::findOrFail($id);
        if(!$user) {
            return response()->json(["error"=>"user not found"],404);
        }
        if($request->user()->id !=$id){
            return response()->json(['error'=>"Unauthorized"],403);
        }

        $user->name=$request->input("name", $user->name);
        $user->email = $request->input("email",$user->email);

        
        if ($request->filled("profile_photo")) {
            $base64Image = $request->input("profile_photo");
            $base64Image = preg_replace('#^data:image/\w+;base64,#i', '', $base64Image);
            $imageData = base64_decode($base64Image);
        
            if ($imageData === false) {
                return response()->json(['error' => 'Invalid base64 image'], 422);
            }
        
           
            $imageName = Str::uuid() . '.jpg';
            $imagePath = "profile_photos/" . $imageName;
        
           
            Storage::disk('public')->put($imagePath, $imageData);
        
            
            if ($user->profile_photo) {
                Storage::disk('public')->delete($user->profile_photo);
            }
        
            
            $user->profile_photo = $imagePath;
        }
        
       
        $user->save();
        return response()->json([
            "message" => "User updated successfully",
            "user" => [
                "id" => $user->id,
                "name" => $user->name,
                "email" => $user->email,
                "profile_photo" => $user->profile_photo ? asset('storage/' . $user->profile_photo) : null,
            ],
        ], 200);


    }
}