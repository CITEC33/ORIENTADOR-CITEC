<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

/**
 * Documento Markdown de la base de conocimiento (RAG).
 * Editable desde el panel admin. Al guardar, se re-indexa (chunk + embedding).
 */
class KnowledgeDocument extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'category',
        'content',
        'content_hash',
        'enabled',
        'chunk_count',
        'token_count',
        'indexed_at',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'chunk_count' => 'integer',
        'token_count' => 'integer',
        'indexed_at' => 'datetime',
    ];

    public function chunks(): HasMany
    {
        return $this->hasMany(KnowledgeChunk::class, 'document_id');
    }

    /** Genera un slug único a partir del título. */
    public static function makeUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'doc';
        $slug = $base;
        $i = 2;
        while (
            static::where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $base.'-'.$i++;
        }
        return $slug;
    }

    /** Hash sha256 del contenido para saber si cambió. */
    public function computeContentHash(): string
    {
        return hash('sha256', $this->content ?? '');
    }
}
