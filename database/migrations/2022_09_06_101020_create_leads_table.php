<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('salesperson_id')
                ->nullable()
                ->constrained('admins')->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->nullable();
            $table->enum('gender', \App\DataHolders\Enum\Gender::onlyNames())->default(\App\DataHolders\Enum\Gender::male->name);
            $table->string('phone_no')->nullable();
            $table->string('street');
            $table->integer('postal_code');
            $table->string('city');
            $table->string('country');
            $table->string('map_longitude');
            $table->string('map_latitude');
            $table->foreignId('lead_status_id')
                ->nullable()
                ->constrained('lead_status')
                ->cascadeOnUpdate()
                ->nullOnDelete();
            //$table->enum('status', \App\DataHolders\Enum\LeadStatus::onlyNames())->default(\App\DataHolders\Enum\LeadStatus::processing->name);
            $table->text('objection')->nullable();
            $table->boolean('has_conversion_request')->default(0);
            $table->boolean('is_converted')->default(0);
            $table->dateTime('converted_at')->nullable();
            $table->unsignedBigInteger('converted_to')->nullable();
            $table->foreign('converted_to')->references('id')->on('users')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('admins')->cascadeOnUpdate()->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('leads');
    }
};
