<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tabla de usuarios de la app UNES Orienta IA.
 *
 * Auth sin contraseña: se identifica por email + datos personales.
 * NO usar como sistema de seguridad fuerte; es identificación para poder
 * usar el bot y guardar historial de conversaciones.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 80);
            $table->string('apellidos', 120);
            $table->string('email', 190)->unique();
            $table->string('telefono', 30);
            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();
            $table->timestamps();

            $table->index('telefono');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
