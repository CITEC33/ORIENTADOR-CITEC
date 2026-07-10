<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tabla de documentos Markdown para RAG.
 * Cada fila = un archivo .md editable desde el panel admin.
 * Se re-chunkea/embebe cuando se guarda o cuando el admin hace "Reindexar".
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('knowledge_documents', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->string('slug', 200)->unique();
            $table->string('category', 60)->index(); // carrera | admision | beca | modalidad | general
            $table->longText('content'); // markdown crudo
            $table->string('content_hash', 64)->nullable()->index(); // sha256 para saber si cambió
            $table->boolean('enabled')->default(true);
            $table->integer('chunk_count')->default(0);
            $table->integer('token_count')->default(0);
            $table->timestamp('indexed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('knowledge_documents');
    }
};
