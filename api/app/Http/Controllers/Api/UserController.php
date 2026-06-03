<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Room;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::where('role', 'user')
            ->latest()
            ->get();

        return response()->json($users);
    }

    public function confirm(Request $request, $id)
    {
        $request->validate([
            'room_number' => 'required|string',
        ]);

        $user = User::findOrFail($id);

        $user->update([
            'room_number' => $request->room_number,
            'status' => 'Aktif',
        ]);

        Room::where('number', $request->room_number)
            ->update(['status' => 'Terisi']);

        return response()->json([
            'message' => 'Penghuni berhasil dikonfirmasi',
            'user' => $user,
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->room_number) {
            Room::where('number', $user->room_number)
                ->update(['status' => 'Kosong']);
        }

        $user->delete();

        return response()->json([
            'message' => 'Penghuni berhasil dihapus dan kamar dikosongkan',
        ]);
    }
}