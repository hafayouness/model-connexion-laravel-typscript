<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LikeController;

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

// Routes publiques (sans authentification)
Route::group([], function () {
    Route::get('/hello', function () {
        return response()->json(['message' => 'Welcome']);
    });

    Route::post('/signup', [AuthController::class, 'signup']);
    Route::post('/signin', [AuthController::class, 'signin']);
});

// Routes nécessitant une authentification (auth:sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Utilisateur authentifié
    Route::get('/user', [AuthController::class, 'getAuthenticatedUser']);
    Route::put('/user/{id}', [AuthController::class, 'update']);

    // Actions liées aux cours
    Route::post('/courses', [CourseController::class, 'store'])->middleware('role:professor'); 
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    Route::put('/courses/{id}', [CourseController::class, 'update'])->middleware('role:professor'); 
    Route::delete('/courses/{id}', [CourseController::class, 'destroy'])->middleware('role:professor'); 
    Route::get('/index', [CourseController::class, 'index']);

    // Système de "like" pour les cours
    Route::post('/courses/{id}/like', [LikeController::class, 'like']);
    Route::post('/courses/{id}/unlike', [LikeController::class, 'unlikeCourse']);
    Route::get('/courses/{id}/is-liked', [CourseController::class, 'isLiked']);
});

// Gestion de la limitation des requêtes
Route::middleware('throttle:500,1')->group(function () {
    Route::get('/users', [AuthController::class, 'getAllUsers']);
});
