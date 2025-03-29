<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ReactionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::apiResource('post',PostController::class)->middleware('auth:sanctum');
Route::apiResource('reaction',ReactionController::class)->middleware('auth:sanctum');
//Route::post('post/update/{id}',[PostController::class,"update"])->middleware('auth:sanctum');


Route::post('register',[UserController::class,"register"]);
Route::get('user',[UserController::class,"user"])->middleware('auth:sanctum');
Route::get('userposts/{id}',[UserController::class,"userPosts"])->middleware('auth:sanctum');
Route::post('login',[UserController::class,"login"]);
Route::post('logout',[UserController::class,"logout"])->middleware('auth:sanctum');

