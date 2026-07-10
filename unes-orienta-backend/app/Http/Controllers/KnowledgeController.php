<?php

namespace App\Http\Controllers;

use App\Models\KnowledgeChunk;
use App\Models\KnowledgeDocument;
use App\Services\RagIndexer;
use App\Services\RagRetriever;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * CRUD de documentos Markdown para RAG.
 * Todos los endpoints se protegen con middleware admin.session en routes/api.php.
 */
class KnowledgeController extends Controller
{
    /** Lista compacta de documentos (sin el contenido completo para no saturar). */
    public function index(Request $request): JsonResponse
    {
        $category = $request->query('category');

        $docs = KnowledgeDocument::query()
            ->when($category, fn ($q) => $q->where('category', $category))
            ->orderByDesc('updated_at')
            ->get([
                'id', 'title', 'slug', 'category', 'enabled',
                'chunk_count', 'token_count', 'indexed_at',
                'created_at', 'updated_at',
            ]);

        $totalChunks = KnowledgeChunk::count();

        return response()->json([
            'ok' => true,
            'documents' => $docs,
            'stats' => [
                'total_docs' => KnowledgeDocument::count(),
                'enabled_docs' => KnowledgeDocument::where('enabled', true)->count(),
                'total_chunks' => $totalChunks,
                'total_tokens' => (int) KnowledgeDocument::sum('token_count'),
            ],
        ]);
    }

    /** Devuelve un documento con su contenido completo. */
    public function show(int $id): JsonResponse
    {
        $doc = KnowledgeDocument::findOrFail($id);
        return response()->json([
            'ok' => true,
            'document' => $doc,
        ]);
    }

    /** Crea un documento nuevo y lo indexa. */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'    => 'required|string|max:200',
            'category' => 'required|string|max:60|in:carrera,admision,beca,modalidad,general,contacto,evento',
            'content'  => 'required|string|max:100000',
            'enabled'  => 'sometimes|boolean',
        ]);

        $doc = new KnowledgeDocument();
        $doc->title    = $data['title'];
        $doc->slug     = KnowledgeDocument::makeUniqueSlug($data['title']);
        $doc->category = $data['category'];
        $doc->content  = $data['content'];
        $doc->enabled  = $data['enabled'] ?? true;
        $doc->save();

        // Indexa
        try {
            (new RagIndexer())->reindex($doc);
        } catch (\Throwable $e) {
            return response()->json([
                'ok' => false,
                'message' => 'Documento guardado, pero falló la indexación: '.$e->getMessage(),
                'document' => $doc->fresh(),
            ], 500);
        }

        return response()->json([
            'ok' => true,
            'document' => $doc->fresh(),
        ], 201);
    }

    /** Actualiza un documento. Si cambió el contenido, re-indexa. */
    public function update(Request $request, int $id): JsonResponse
    {
        $doc = KnowledgeDocument::findOrFail($id);

        $data = $request->validate([
            'title'    => 'sometimes|string|max:200',
            'category' => 'sometimes|string|max:60|in:carrera,admision,beca,modalidad,general,contacto,evento',
            'content'  => 'sometimes|string|max:100000',
            'enabled'  => 'sometimes|boolean',
        ]);

        $needsReindex = false;
        if (array_key_exists('title', $data) && $data['title'] !== $doc->title) {
            $doc->title = $data['title'];
            $doc->slug  = KnowledgeDocument::makeUniqueSlug($data['title'], $doc->id);
        }
        if (array_key_exists('category', $data)) {
            $doc->category = $data['category'];
        }
        if (array_key_exists('content', $data) && $data['content'] !== $doc->content) {
            $doc->content = $data['content'];
            $needsReindex = true;
        }
        if (array_key_exists('enabled', $data)) {
            $doc->enabled = $data['enabled'];
        }
        $doc->save();

        if ($needsReindex) {
            try {
                (new RagIndexer())->reindex($doc);
            } catch (\Throwable $e) {
                return response()->json([
                    'ok' => false,
                    'message' => 'Cambios guardados, pero falló la re-indexación: '.$e->getMessage(),
                    'document' => $doc->fresh(),
                ], 500);
            }
        }

        return response()->json([
            'ok' => true,
            'document' => $doc->fresh(),
            'reindexed' => $needsReindex,
        ]);
    }

    /** Elimina un documento (cascade borra sus chunks). */
    public function destroy(int $id): JsonResponse
    {
        $doc = KnowledgeDocument::findOrFail($id);
        $doc->delete();

        return response()->json(['ok' => true]);
    }

    /** Fuerza reindexación de un documento. */
    public function reindexOne(int $id): JsonResponse
    {
        $doc = KnowledgeDocument::findOrFail($id);
        try {
            $stats = (new RagIndexer())->reindex($doc);
        } catch (\Throwable $e) {
            return response()->json([
                'ok' => false,
                'message' => 'Error al re-indexar: '.$e->getMessage(),
            ], 500);
        }
        return response()->json([
            'ok' => true,
            'document' => $doc->fresh(),
            'stats' => $stats,
        ]);
    }

    /** Reindexa toda la base de conocimiento (solo docs habilitados). */
    public function reindexAll(): JsonResponse
    {
        try {
            $results = (new RagIndexer())->reindexAll();
        } catch (\Throwable $e) {
            return response()->json([
                'ok' => false,
                'message' => 'Error al re-indexar todo: '.$e->getMessage(),
            ], 500);
        }
        return response()->json([
            'ok' => true,
            'results' => $results,
        ]);
    }

    /** Endpoint de prueba: dada una query, muestra qué chunks recuperaría. */
    public function preview(Request $request): JsonResponse
    {
        $data = $request->validate([
            'query'  => 'required|string|min:2|max:2000',
            'top_k'  => 'sometimes|integer|min:1|max:10',
        ]);

        try {
            $results = (new RagRetriever())->retrieve(
                $data['query'],
                $data['top_k'] ?? 4,
                0.0 // sin umbral para debug
            );
        } catch (\Throwable $e) {
            return response()->json([
                'ok' => false,
                'message' => 'Error al buscar: '.$e->getMessage(),
            ], 500);
        }

        return response()->json([
            'ok' => true,
            'query'   => $data['query'],
            'results' => $results,
        ]);
    }
}
