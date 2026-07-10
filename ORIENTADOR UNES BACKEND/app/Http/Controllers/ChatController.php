<?php

namespace App\Http\Controllers;

use App\Models\ChatLog;
use App\Services\BotAiService;
use App\Services\RagRetriever;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Endpoint /api/chat — proxy seguro al proveedor de IA.
 * Ahora con RAG: antes de llamar a OpenAI, recupera los top-K chunks
 * relevantes de la base de conocimiento y los inyecta como system context.
 */
class ChatController extends Controller
{
    public function chat(Request $request): JsonResponse
    {
        $data = $request->validate([
            'messages'      => 'required|array|min:1|max:40',
            'messages.*.role'    => 'required|string|in:user,assistant,system',
            'messages.*.content' => 'required|string|min:1|max:4000',
        ]);

        $user = $request->user();
        $messages = $data['messages'];

        // --- RAG: recupera contexto para el último mensaje del usuario ---
        $lastUserMsg = collect($messages)->last(fn ($m) => $m['role'] === 'user');
        $ragUsed = [];
        if ($lastUserMsg) {
            try {
                $retriever = new RagRetriever();
                $ragUsed = $retriever->retrieve($lastUserMsg['content'], topK: 4);
                $contextText = $retriever->buildContextMessage($ragUsed);
                if ($contextText) {
                    // Insertamos el contexto como mensaje `system` extra, después
                    // del prompt principal (que BotAiService añade automáticamente).
                    $messages[] = [
                        'role' => 'system',
                        'content' => $contextText,
                    ];
                    // Movemos el último user al final para que quede después del contexto.
                    $lastIndex = count($messages) - 2;
                    $userMsg = $messages[array_key_last($messages) - 1] ?? null;
                    // Reordenamos: el mensaje user debe ir al FINAL.
                    // Estrategia simple: extraemos el user más reciente y lo re-agregamos al final.
                    foreach ($messages as $k => $m) {
                        if ($m['role'] === 'user' && $m['content'] === $lastUserMsg['content']) {
                            unset($messages[$k]);
                            break;
                        }
                    }
                    $messages = array_values($messages);
                    $messages[] = $lastUserMsg;
                }
            } catch (\Throwable $e) {
                // Si el RAG falla, continuamos sin contexto (chat sigue funcionando).
                report($e);
            }
        }

        try {
            $ai = new BotAiService();
            $result = $ai->chat($messages);
        } catch (\Throwable $e) {
            return response()->json([
                'ok' => false,
                'code' => 'ai_error',
                'message' => 'Aquila está descansando un momento. Intenta de nuevo en unos segundos.',
                'debug' => config('app.debug') ? $e->getMessage() : null,
            ], 502);
        }

        // Log — guardamos el último mensaje del usuario + respuesta
        if ($lastUserMsg) {
            ChatLog::create([
                'user_id' => $user->id,
                'role' => 'user',
                'content' => $lastUserMsg['content'],
            ]);
        }
        ChatLog::create([
            'user_id' => $user->id,
            'role' => 'assistant',
            'content' => $result['content'],
            'tokens_used' => $result['tokens'],
            'model_used' => $result['model'],
        ]);

        return response()->json([
            'ok' => true,
            'reply' => $result['content'],
            'model' => $result['model'],
            'rag' => [
                'used' => count($ragUsed) > 0,
                'sources' => array_map(fn ($r) => [
                    'title'    => $r['doc_title'],
                    'category' => $r['category'],
                    'heading'  => $r['heading'],
                    'score'    => $r['score'],
                ], $ragUsed),
            ],
        ]);
    }
}
