<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ContactController;
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
    
    Route::get('/user', [AuthController::class, 'getAuthenticatedUser']);
    Route::put('/user/{id}', [AuthController::class, 'update']);
    

    
    Route::post('/courses', [CourseController::class, 'store'])->middleware('role:professor'); 
    Route::get('/courses/{id}', [CourseController::class, 'show']);
    Route::put('/courses/{id}', [CourseController::class, 'update'])->middleware('role:professor'); 
    Route::delete('/courses/{id}', [CourseController::class, 'destroy'])->middleware('role:professor'); 
    Route::get('/index', [CourseController::class, 'index']);

    
    Route::post('/courses/{id}/toggle-like', [CourseController::class, 'toggleLike']);
    Route::get('/courses/{id}/is-liked', [CourseController::class, 'isLiked']);
    Route::middleware('auth:sanctum')->post('/courses/{id}/comment', [CourseController::class, 'addComment']);

    Route::get('login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::get('/courses/{id}/comments', [CourseController::class, 'getComments']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/courses/{courseId}/comments', [CommentController::class, 'index']);
        Route::post('/comments/{commentId}/like', [CommentController::class, 'toggleLike']);
        Route::get('/comments/{commentId}/isLiked', [CommentController::class, 'isLiked']);
    });
    Route::put('/comments/{id}',[CommentController::class, 'updateComment']);
    Route::delete('/comments/{id}',[CommentController::class, 'deleteComment']);
    Route::get('/comments', [CourseController::class, 'getLatestComments']);
    Route::post('/contact', [ContactController::class, 'store']);

    




    


});


Route::middleware('throttle:500,1')->group(function () {
    Route::get('/users', [AuthController::class, 'getAllUsers']);
});
