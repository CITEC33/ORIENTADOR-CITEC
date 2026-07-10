<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Configuración del bot Aquila.
 *
 * Solo existe UN registro con id=1 (patrón singleton).
 * La api_key se guarda CIFRADA con AES-256-CBC vía Crypt::encryptString().
 * NUNCA se devuelve la key completa por API — se enmascara en respuestas GET.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bot_configs', function (Blueprint $table) {
            $table->id();
            $table->string('provider', 40)->default('openai'); // openai, grok, anthropic...
            $table->string('model', 80)->default('gpt-4o-mini');
            $table->string('api_base', 190)->default('https://api.openai.com/v1');
            // Guardada cifrada. Puede ser NULL cuando aún no se configura.
            $table->text('api_key_encrypted')->nullable();
            // Prompt de comportamiento (persona Aquila).
            $table->text('system_prompt')->nullable();
            $table->unsignedSmallInteger('temperature')->default(70); // 0..100 => /100
            $table->unsignedSmallInteger('max_tokens')->default(800);
            $table->boolean('enabled')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bot_configs');
    }
};
