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
            ->where('status', '!=', 'Keluar')
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

        $user->update([
            'status' => 'Keluar',
            'room_number' => null,
            'exit_date' => now()
        ]);

        return response()->json([
            'message' => 'Penghuni ditandai keluar dan kamar dikosongkan',
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'phone' => 'required|string',
            'address' => 'required|string',
            'room_number' => 'required|string',
        ]);

        $user = User::findOrFail($id);

        $oldRoom = $user->room_number;
        $newRoom = $request->room_number;

        if ($oldRoom && $oldRoom !== $newRoom) {
            Room::where('number', $oldRoom)->update([
                'status' => 'Kosong',
            ]);

            Room::where('number', $newRoom)->update([
                'status' => 'Terisi',
            ]);
        }

        $user->update([
            'name' => $request->name,
            'phone' => $request->phone,
            'address' => $request->address,
            'room_number' => $newRoom,
        ]);

        return response()->json([
            'message' => 'Data penghuni berhasil diperbarui',
            'user' => $user,
        ]);
    }
    public function history()
    {
        $users = User::where('role', 'user')
            ->where('status', 'Keluar')
            ->latest('exit_date')
            ->get();

        return response()->json($users);
    }
}