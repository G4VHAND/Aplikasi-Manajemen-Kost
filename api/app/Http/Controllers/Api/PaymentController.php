<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\User;
use App\Models\Room;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        return response()->json(
            Payment::with('user')
                ->latest()
                ->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'room_number' => 'required|string',
            'start_month' => 'required|string',
            'month_count' => 'required|integer|min:1',
        ]);

        $room = Room::where('number', $request->room_number)->firstOrFail();

        $user = User::where('room_number', $request->room_number)
            ->where('role', 'user')
            ->where('status', 'Aktif')
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'Tidak ada penghuni aktif di kamar ini',
            ], 422);
        }

        $totalAmount = $room->price * $request->month_count;

        $payment = Payment::create([
            'user_id' => $user->id,
            'room_number' => $request->room_number,
            'month' => $request->start_month,
            'start_month' => $request->start_month,
            'month_count' => $request->month_count,
            'amount' => $totalAmount,
            'paid_amount' => 0,
            'remaining_amount' => $totalAmount,
            'status' => 'Belum Bayar',
        ]);

        return response()->json([
            'message' => 'Tagihan berhasil ditambahkan',
            'payment' => $payment->load('user'),
        ], 201);
    }

    public function show(Payment $payment)
    {
        return response()->json(
            $payment->load('user')
        );
    }

    public function update(Request $request, Payment $payment)
    {
        $request->validate([
            'month' => 'required|string',
            'amount' => 'required|numeric',
            'status' => 'required|in:Belum Bayar,Menunggu Verifikasi,Kurang Bayar,Lunas',
            'method' => 'nullable|in:Tunai,Transfer',
        ]);

        $payment->update([
            'month' => $request->month,
            'amount' => $request->amount,
            'status' => $request->status,
            'method' => $request->method,
        ]);

        return response()->json([
            'message' => 'Tagihan berhasil diperbarui',
            'payment' => $payment,
        ]);
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();

        return response()->json([
            'message' => 'Tagihan berhasil dihapus',
        ]);
    }

    public function markAsPaid($id)
    {
        $payment = Payment::findOrFail($id);

        if ($payment->paid_amount < $payment->amount) {
            $payment->update([
                'status' => 'Kurang Bayar',
                'remaining_amount' => $payment->amount - $payment->paid_amount,
            ]);

            return response()->json([
                'message' => 'Pembayaran kurang dari total tagihan',
                'payment' => $payment,
            ]);
        }

        $payment->update([
            'status' => 'Lunas',
            'remaining_amount' => 0,
        ]);

        return response()->json([
            'message' => 'Pembayaran berhasil ditandai lunas',
            'payment' => $payment,
        ]);
    }

    public function submitPayment(Request $request, $id)
    {
        $request->validate([
            'method' => 'required|in:Tunai,Transfer',
            'paid_amount' => 'required|numeric|min:1',
            'proof' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $payment = Payment::findOrFail($id);

        $proofPath = $payment->proof;

        if ($request->hasFile('proof')) {
            $proofPath = $request->file('proof')->store('payment-proofs', 'public');
        }

        $totalPaid = $payment->paid_amount + $request->paid_amount;
        $remainingAmount = $payment->amount - $totalPaid;

        $payment->update([
            'method' => $request->method,
            'paid_amount' => $totalPaid,
            'remaining_amount' => max($remainingAmount, 0),
            'proof' => $proofPath,
            'status' => 'Menunggu Verifikasi',
        ]);

        return response()->json([
            'message' => 'Pembayaran menunggu verifikasi admin',
            'payment' => $payment,
        ]);
    }
}