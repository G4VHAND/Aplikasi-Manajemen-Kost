<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->string('room_number')->nullable()->after('user_id');
            $table->string('start_month')->nullable()->after('month');
            $table->integer('month_count')->default(1)->after('start_month');
            $table->integer('paid_amount')->default(0)->after('amount');
            $table->integer('remaining_amount')->default(0)->after('paid_amount');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn([
                'room_number',
                'start_month',
                'month_count',
                'paid_amount',
                'remaining_amount',
            ]);
        });
    }
};
