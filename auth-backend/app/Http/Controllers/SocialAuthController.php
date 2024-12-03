<?php

namespace App\Http\Controllers;
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Log;

class SocialAuthController extends Controller
{
    
   public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
       
    }
    public function handleGoogleCallback()
    {  
        try{
            $googleUser = Socialite::driver('google')->user();
            $user = User::where("google_id", $googleUser->getId())->first();

            if(!$user){
                $newUser = User::create([
                "name" => $googleUser->getName(),
                "email"=> $googleUser->getEmail(),
                "google_id" => $googleUser->getId()
            ]);
             Auth::login($newUser);
             return redirect()->intended("dashboard");
            }else{
            Auth::login($user);
            return redirect()->intended("dashboard");
            }

        }catch (\Throwable $th) {
            dd("Something went wrong: " . $th->getMessage());  // Affichage de l'erreur
        }
    

        
        
    }

    // public  function handleFacebookCallback(Request $request){
    //     $token = $request->input('token');
    //     $url ="https://graph.facebook.com/me?fields=id,name,email&access_token={$token}";

    //     $response = Http::get($url);
    //      if($response->ok()){
    //         $facebookData = $request->json();
    //         $email =$facebookData['email'];
    //         $name = $facebookData["name"];

    //         $user = User::firstOrCreate(
    //             ['email'=>$email],
    //             ['name'=> $name,"provider" => 'facebook', "provider_id" =>$facebookData["id"]]
    //         );
    //         return response()->json([
    //             'user'=>$user,
    //             "token" => $user->createToken('generateToken')->plainTextToken
    //         ]);

    //      }
    //      return response()->json(['error'=>"Invalid token"],401);
    // }
}
