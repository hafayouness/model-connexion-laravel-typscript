<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{

   
    public function signup(Request $request)
    {
       try {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required_with:password'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
             'role' => 'admin', 
            //  "admin"
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
       } catch (\Exception $e) {
        Log::error('Signup error: ' . $e->getMessage());
        return response()->json(['message' => 'Server error', 'error' => $e->getMessage()], 500);
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
}