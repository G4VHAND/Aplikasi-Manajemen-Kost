<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
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
            'user_id' => 'required|exists:users,id',
            'month' => 'required|string',
            'amount' => 'required|numeric',
        ]);

        $payment = Payment::create([
            'user_id' => $request->user_id,
            'month' => $request->month,
            'amount' => $request->amount,
            'status' => 'Belum Bayar',
        ]);

        return response()->json([
            'message' => 'Tagihan berhasil ditambahkan',
            'payment' => $payment,
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
            'status' => 'required|in:Belum Bayar,Menunggu Verifikasi,Lunas',
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

        $payment->update([
            'status' => 'Lunas',
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
            'proof' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $payment = Payment::findOrFail($id);

        $proofPath = $payment->proof;

        if ($request->hasFile('proof')) {
            $proofPath = $request->file('proof')->store('payment-proofs', 'public');
        }

        $payment->update([
            'method' => $request->method,
            'proof' => $proofPath,
            'status' => 'Menunggu Verifikasi',
        ]);

        return response()->json([
            'message' => 'Pembayaran menunggu verifikasi admin',
            'payment' => $payment,
        ]);
    }
}