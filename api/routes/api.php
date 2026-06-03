<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ComplaintController;
use App\Http\Controllers\Api\AnnouncementController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Auth
    |--------------------------------------------------------------------------
    */

    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--------------------------------------------------------------------------
    | Users
    |--------------------------------------------------------------------------
    */

    Route::get('/users', [UserController::class, 'index']);
    Route::put('/users/{id}/confirm', [UserController::class, 'confirm']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    /*
    |--------------------------------------------------------------------------
    | Rooms
    |--------------------------------------------------------------------------
    */

    Route::apiResource('rooms', RoomController::class);

    /*
    |--------------------------------------------------------------------------
    | Payments
    |--------------------------------------------------------------------------
    */

    Route::apiResource('payments', PaymentController::class);

    Route::put('/payments/{id}/paid', [
        PaymentController::class,
        'markAsPaid'
    ]);

    Route::post('/payments/{id}/submit', [
        PaymentController::class,
        'submitPayment'
    ]);

    /*
    |--------------------------------------------------------------------------
    | Complaints
    |--------------------------------------------------------------------------
    */

    Route::apiResource('complaints', ComplaintController::class);

    Route::put('/complaints/{id}/status', [
        ComplaintController::class,
        'updateStatus'
    ]);

    /*
    |--------------------------------------------------------------------------
    | Announcements
    |--------------------------------------------------------------------------
    */

    Route::apiResource('announcements', AnnouncementController::class);

    Route::post('/save-push-token', [AuthController::class, 'savePushToken']);
});