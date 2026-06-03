<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index()
    {
        return response()->json(
            Room::latest()->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'number' => 'required|string|unique:rooms,number',
            'price' => 'required|numeric',
        ]);

        $room = Room::create([
            'number' => $request->number,
            'price' => $request->price,
            'status' => 'Kosong',
        ]);

        return response()->json([
            'message' => 'Kamar berhasil ditambahkan',
            'room' => $room,
        ], 201);
    }

    public function show(Room $room)
    {
        return response()->json($room);
    }

    public function update(Request $request, Room $room)
    {
        $request->validate([
            'number' => 'required|string|unique:rooms,number,' . $room->id,
            'price' => 'required|numeric',
            'status' => 'required|in:Kosong,Terisi',
        ]);

        $room->update([
            'number' => $request->number,
            'price' => $request->price,
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Kamar berhasil diperbarui',
            'room' => $room,
        ]);
    }

    public function destroy(Room $room)
    {
        $room->delete();

        return response()->json([
            'message' => 'Kamar berhasil dihapus',
        ]);
    }
}