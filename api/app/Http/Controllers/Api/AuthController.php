<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function savePushToken(Request $request)
{
    $request->validate([
        'push_token' => 'required|string',
    ]);

    $request->user()->update([
        'push_token' => $request->push_token,
    ]);

    return response()->json([
        'message' => 'Push token berhasil disimpan',
    ]);
}

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'phone' => 'required|string',
            'address' => 'required|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => strtolower($request->email),
            'password' => Hash::make($request->password),
            'role' => 'user',
            'phone' => $request->phone,
            'address' => $request->address,
            'status' => 'Menunggu Konfirmasi',
        ]);

        return response()->json([
            'message' => 'Registrasi berhasil, menunggu konfirmasi admin',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', strtolower($request->email))->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah'],
            ]);
        }

        if ($user->role === 'user' && $user->status !== 'Aktif') {
            return response()->json([
                'message' => 'Akun belum dikonfirmasi admin',
            ], 403);
        }

        $token = $user->createToken('kost-token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil',
        ]);
    }
}