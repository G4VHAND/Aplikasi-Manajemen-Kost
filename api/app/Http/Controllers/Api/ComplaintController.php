<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    public function index()
    {
        return response()->json(
            Complaint::with('user')
                ->latest()
                ->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'content' => 'required|string',
        ]);

        $complaint = Complaint::create([
            'user_id' => $request->user_id,
            'content' => $request->content,
            'status' => 'Menunggu',
        ]);

        return response()->json([
            'message' => 'Keluhan berhasil dikirim',
            'complaint' => $complaint,
        ], 201);
    }

    public function show(Complaint $complaint)
    {
        return response()->json(
            $complaint->load('user')
        );
    }

    public function update(Request $request, Complaint $complaint)
    {
        $request->validate([
            'content' => 'required|string',
            'status' => 'required|in:Menunggu,Diproses,Selesai',
        ]);

        $complaint->update([
            'content' => $request->content,
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Keluhan berhasil diperbarui',
            'complaint' => $complaint,
        ]);
    }

    public function destroy(Complaint $complaint)
    {
        $complaint->delete();

        return response()->json([
            'message' => 'Keluhan berhasil dihapus',
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Menunggu,Diproses,Selesai',
        ]);

        $complaint = Complaint::findOrFail($id);

        $complaint->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Status keluhan berhasil diperbarui',
            'complaint' => $complaint,
        ]);
    }
}