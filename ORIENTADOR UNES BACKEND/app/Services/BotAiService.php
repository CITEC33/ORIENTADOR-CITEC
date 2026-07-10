<?php

namespace App\Services;

use App\Models\BotConfig;
use GuzzleHttp\Client;

/**
 * Servicio que llama al proveedor de IA (OpenAI-compatible por defecto).
 * La API key se lee cifrada desde BotConfig y solo se descifra aquí.
 * NUNCA se envía al frontend.
 */
class BotAiService
{
    private BotConfig $cfg;
    private Client $http;

    public function __construct()
    {
        $this->cfg = BotConfig::current();
        $this->http = new Client([
            'timeout' => 30,
            'connect_timeout' => 10,
        ]);
    }

    /**
     * @param  array  $messages  [['role'=>'user'|'assistant'|'system', 'content'=>'…'], …]
     * @return array{content:string, model:string, tokens:?int}
     */
    public function chat(array $messages, ?int $overrideMaxTokens = null): array
    {
        if (! $this->cfg->enabled) {
            throw new \RuntimeException('El bot está deshabilitado en el panel admin.');
        }
        $key = $this->cfg->getApiKey();
        if (! $key) {
            throw new \RuntimeException('No hay API key configurada.');
        }

        // SIEMPRE anteponemos el system prompt principal (Aquila) al inicio.
        // Otros mensajes 'system' (como el contexto RAG que inyecta ChatController)
        // se mantienen intactos DESPUÉS del prompt principal. Esto garantiza que
        // la identidad, reglas y lista de carreras de Aquila siempre estén presentes.
        if (! empty($this->cfg->system_prompt)) {
            // Verificamos que el primer mensaje no sea ya el system_prompt principal
            // (por si el caller lo pasó explícitamente en la primera posición).
            $firstMsg = $messages[0] ?? null;
            $alreadyHasMainPrompt = $firstMsg
                && ($firstMsg['role'] ?? '') === 'system'
                && trim($firstMsg['content'] ?? '') === trim($this->cfg->system_prompt);

            if (! $alreadyHasMainPrompt) {
                array_unshift($messages, [
                    'role' => 'system',
                    'content' => $this->cfg->system_prompt,
                ]);
            }
        }

        // Formato OpenAI-compatible (funciona con OpenAI, Grok, Together, Groq, etc.)
        $endpoint = rtrim($this->cfg->api_base, '/').'/chat/completions';
        $body = [
            'model' => $this->cfg->model,
            'messages' => $messages,
            'temperature' => $this->cfg->temperature / 100,
            'max_tokens' => $overrideMaxTokens ?? $this->cfg->max_tokens,
        ];

        $res = $this->http->post($endpoint, [
            'headers' => [
                'Authorization' => 'Bearer '.$key,
                'Content-Type' => 'application/json',
            ],
            'json' => $body,
        ]);

        $data = json_decode((string) $res->getBody(), true);
        $content = $data['choices'][0]['message']['content'] ?? '';
        $tokens = $data['usage']['total_tokens'] ?? null;

        return [
            'content' => trim($content),
            'model' => $data['model'] ?? $this->cfg->model,
            'tokens' => $tokens,
        ];
    }
}
