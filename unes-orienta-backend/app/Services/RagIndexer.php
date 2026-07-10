<?php

namespace App\Services;

use App\Models\KnowledgeChunk;
use App\Models\KnowledgeDocument;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Indexa un documento Markdown en chunks + embeddings.
 * Es idempotente: al reindexar borra los chunks previos y regenera.
 */
class RagIndexer
{
    private RagChunker $chunker;
    private RagEmbeddingClient $embedder;

    public function __construct(?RagChunker $chunker = null, ?RagEmbeddingClient $embedder = null)
    {
        $this->chunker  = $chunker  ?? new RagChunker();
        $this->embedder = $embedder ?? new RagEmbeddingClient();
    }

    /**
     * Re-chunkea y re-embebe el documento entero.
     * @return array{chunks:int, tokens:int}
     */
    public function reindex(KnowledgeDocument $doc): array
    {
        $chunks = $this->chunker->chunk($doc->content ?? '');
        $totalTokens = 0;

        DB::transaction(function () use ($doc, $chunks, &$totalTokens) {
            // Limpia chunks viejos
            KnowledgeChunk::where('document_id', $doc->id)->delete();

            if (empty($chunks)) {
                $doc->update([
                    'chunk_count' => 0,
                    'token_count' => 0,
                    'content_hash' => $doc->computeContentHash(),
                    'indexed_at' => now(),
                ]);
                return;
            }

            $texts = array_map(fn ($c) => $c['content'], $chunks);
            $vectors = $this->embedder->embed($texts);

            foreach ($chunks as $i => $c) {
                $tokens = $this->chunker->estimateTokens($c['content']);
                $totalTokens += $tokens;

                KnowledgeChunk::create([
                    'document_id' => $doc->id,
                    'heading'     => $c['heading'],
                    'content'     => $c['content'],
                    'chunk_index' => $c['index'],
                    'token_count' => $tokens,
                    'embedding'   => isset($vectors[$i]) ? json_encode($vectors[$i]) : null,
                    'embedding_model' => RagEmbeddingClient::MODEL,
                ]);
            }

            $doc->update([
                'chunk_count'  => count($chunks),
                'token_count'  => $totalTokens,
                'content_hash' => $doc->computeContentHash(),
                'indexed_at'   => now(),
            ]);
        });

        Log::info('RAG reindex done', [
            'doc_id' => $doc->id,
            'title'  => $doc->title,
            'chunks' => count($chunks),
            'tokens' => $totalTokens,
        ]);

        return [
            'chunks' => count($chunks),
            'tokens' => $totalTokens,
        ];
    }

    /**
     * Reindexa todos los documentos habilitados. Devuelve stats por documento.
     * @return array<int, array{id:int,title:string,chunks:int,tokens:int}>
     */
    public function reindexAll(): array
    {
        $out = [];
        foreach (KnowledgeDocument::where('enabled', true)->get() as $doc) {
            try {
                $stats = $this->reindex($doc);
                $out[] = [
                    'id' => $doc->id,
                    'title' => $doc->title,
                    'chunks' => $stats['chunks'],
                    'tokens' => $stats['tokens'],
                ];
            } catch (\Throwable $e) {
                Log::error('RAG reindex failed', [
                    'doc_id' => $doc->id,
                    'error'  => $e->getMessage(),
                ]);
                $out[] = [
                    'id' => $doc->id,
                    'title' => $doc->title,
                    'chunks' => 0,
                    'tokens' => 0,
                    'error'  => $e->getMessage(),
                ];
            }
        }
        return $out;
    }
}
