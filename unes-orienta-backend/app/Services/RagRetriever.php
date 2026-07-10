<?php

namespace App\Services;

use App\Models\KnowledgeChunk;

/**
 * Recupera los top-K chunks más relevantes para una query.
 * Usa cosine similarity en PHP (suficiente hasta ~10k chunks en SQLite).
 */
class RagRetriever
{
    private RagEmbeddingClient $embedder;

    public function __construct(?RagEmbeddingClient $embedder = null)
    {
        $this->embedder = $embedder ?? new RagEmbeddingClient();
    }

    /**
     * @return array<int, array{chunk_id:int, doc_id:int, doc_title:string, category:string, heading:?string, content:string, score:float}>
     */
    public function retrieve(string $query, int $topK = 4, float $minScore = 0.15): array
    {
        $query = trim($query);
        if ($query === '') return [];

        $qVec = $this->embedder->embedOne($query);
        if (empty($qVec)) return [];

        // Cargamos chunks con su documento habilitado.
        $chunks = KnowledgeChunk::query()
            ->with('document:id,title,category,enabled')
            ->whereHas('document', fn ($q) => $q->where('enabled', true))
            ->whereNotNull('embedding')
            ->get();

        $scored = [];
        foreach ($chunks as $c) {
            $vec = $c->embeddingVector();
            if (! $vec) continue;
            $score = RagEmbeddingClient::cosine($qVec, $vec);
            if ($score < $minScore) continue;
            $scored[] = [
                'chunk_id'  => $c->id,
                'doc_id'    => $c->document_id,
                'doc_title' => $c->document?->title ?? '',
                'category'  => $c->document?->category ?? '',
                'heading'   => $c->heading,
                'content'   => $c->content,
                'score'     => round($score, 4),
            ];
        }

        // Ordena por score desc y toma topK.
        usort($scored, fn ($a, $b) => $b['score'] <=> $a['score']);
        return array_slice($scored, 0, $topK);
    }

    /**
     * Arma el bloque de contexto para inyectar como mensaje `system` extra
     * antes de la pregunta del usuario.
     */
    public function buildContextMessage(array $retrieved): ?string
    {
        if (empty($retrieved)) return null;

        $parts = [];
        foreach ($retrieved as $i => $r) {
            $parts[] = sprintf(
                "[Fuente %d — %s%s]\n%s",
                $i + 1,
                $r['doc_title'],
                $r['heading'] ? " · {$r['heading']}" : '',
                $r['content']
            );
        }

        return "Contexto oficial de UNES Durango (usa SOLO esta información para responder cuando aplique;"
            . " si la respuesta no está aquí, dilo con honestidad y sugiere pedir informes en unes.edu.mx):\n\n"
            . implode("\n\n---\n\n", $parts);
    }
}
