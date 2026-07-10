<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Chunks derivados de cada documento Markdown.
 * embedding: JSON con array de floats (1536 dims para text-embedding-3-small).
 * La búsqueda por cosine similarity se hace en PHP (suficiente <10k chunks).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('knowledge_chunks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')
                ->constrained('knowledge_documents')
                ->cascadeOnDelete();
            $table->string('heading', 300)->nullable();
            $table->longText('content'); // texto del chunk
            $table->integer('chunk_index'); // orden dentro del documento
            $table->integer('token_count')->default(0);
            $table->longText('embedding')->nullable(); // JSON [0.123, -0.456, ...]
            $table->string('embedding_model', 60)->nullable();
            $table->timestamps();

            $table->index(['document_id', 'chunk_index']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('knowledge_chunks');
    }
};
