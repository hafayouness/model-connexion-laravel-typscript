<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash; 

class AuthController extends Controller
{
    public function signup(Request $request)
    {
       
        $request->validate([
            "name" => "required|string|max:255",
            "email" => "required|string|email|unique:users", // Ajout de la règle 'email' pour validation
            "password" => "required|string|min:8|confirmed"
        ]);

       
        $user = User::create([
            "name" => $request->name,
            "email" => $request->email,
            "password" => Hash::make($request->password)
        ]);

     
        return response()->json([
            "message" => "User registered successfully"
        ], 201);
    }
}
