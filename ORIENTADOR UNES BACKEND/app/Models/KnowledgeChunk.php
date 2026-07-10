<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Chunk indexado con embedding.
 * El embedding se guarda como JSON string; para búsqueda se decodifica en PHP.
 */
class KnowledgeChunk extends Model
{
    protected $fillable = [
        'document_id',
        'heading',
        'content',
        'chunk_index',
        'token_count',
        'embedding',
        'embedding_model',
    ];

    protected $casts = [
        'chunk_index' => 'integer',
        'token_count' => 'integer',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(KnowledgeDocument::class, 'document_id');
    }

    /** Devuelve el embedding como array de floats. */
    public function embeddingVector(): ?array
    {
        if (! $this->embedding) return null;
        $decoded = json_decode($this->embedding, true);
        return is_array($decoded) ? $decoded : null;
    }
}
