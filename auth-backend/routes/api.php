<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SocialAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\CourseController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', [AuthController::class,"getAuthenticatedUser"]);
Route::get('/hello', function () {
    return 'welcome';
});

Route::get('/users',[AuthController::class,"getAllUsers"] );
Route::post("signup",[AuthController::class,"signup"]);
Route::post("signin",[AuthController::class,"signin"]);
Route::get('/auth/google', [SocialAuthController::class, 'redirectToGoogle'])->name("google_auth");
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);
Route::middleware('auth:sanctum')->get('/dashboard', function (Request $request) {
    return response()->json([
        'user' => $request->user(),
        'role' => $request->user()->role, 
    ]);
});

Route::resource('courses', CourseController::class);
Route::get("/courses/{id}", [CourseController::class],"show");  
