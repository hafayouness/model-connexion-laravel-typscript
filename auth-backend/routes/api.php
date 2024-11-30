<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

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
// Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show'])->name('sanctum.csrf-cookie');
Route::get('/users',[AuthController::class,"getAllUsers"] );
Route::post("signup",[AuthController::class,"signup"]);
Route::post("signin",[AuthController::class,"signin"]);
