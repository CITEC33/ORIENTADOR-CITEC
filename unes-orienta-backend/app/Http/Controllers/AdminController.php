<?php

namespace App\Http\Controllers;

use App\Models\BotConfig;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

/**
 * Panel admin del bot Aquila.
 *
 * Autenticación: PIN maestro (ADMIN_PIN en .env).
 * Al aceptar el PIN, se emite un token de sesión aleatorio
 * que se guarda en cache (Cache::put) con TTL de ADMIN_SESSION_TTL segundos.
 * El cliente lo envía como cookie 'admin_session' o header 'X-Admin-Session'.
 *
 * Ventajas frente a guardar el PIN en el cliente:
 * - El PIN nunca viaja en cada request
 * - Se puede invalidar el token en cualquier momento
 * - Rate limiting protege contra brute-force
 */
class AdminController extends Controller
{
    private const CACHE_PREFIX = 'admin_session:';

    /**
     * Login del admin con PIN.
     */
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'pin' => 'required|string|max:100',
        ]);

        $expected = (string) config('bot.admin_pin', '');
        if ($expected === '' || ! hash_equals($expected, $data['pin'])) {
            return response()->json([
                'ok' => false,
                'code' => 'invalid_pin',
                'message' => 'PIN incorrecto.',
            ], 401);
        }

        $token = Str::random(64);
        $ttl = (int) config('bot.admin_session_ttl', 3600);
        Cache::put(self::CACHE_PREFIX.$token, true, $ttl);

        return response()->json([
            'ok' => true,
            'admin_session' => $token,
            'ttl' => $ttl,
        ])->cookie(
            'admin_session',
            $token,
            (int) ($ttl / 60), // minutos
            '/',
            null,
            false, // secure — poner true en producción https
            true,  // httpOnly
            false,
            'lax'
        );
    }

    public function logout(Request $request): JsonResponse
    {
        $token = $this->extractToken($request);
        if ($token) {
            Cache::forget(self::CACHE_PREFIX.$token);
        }
        return response()->json(['ok' => true])
            ->cookie('admin_session', '', -1);
    }

    /**
     * GET config del bot. Api key se devuelve enmascarada.
     */
    public function getConfig(Request $request): JsonResponse
    {
        $cfg = BotConfig::current();
        return response()->json([
            'ok' => true,
            'config' => [
                'provider' => $cfg->provider,
                'model' => $cfg->model,
                'api_base' => $cfg->api_base,
                'api_key_masked' => $cfg->getMaskedApiKey(),
                'has_api_key' => (bool) $cfg->api_key_encrypted,
                'system_prompt' => $cfg->system_prompt,
                'temperature' => $cfg->temperature,
                'max_tokens' => $cfg->max_tokens,
                'enabled' => $cfg->enabled,
                'updated_at' => $cfg->updated_at?->toIso8601String(),
            ],
            'default_prompt' => BotConfig::defaultPrompt(),
        ]);
    }

    /**
     * PUT config del bot. Si api_key llega vacía, no se sobreescribe.
     */
    public function updateConfig(Request $request): JsonResponse
    {
        $data = $request->validate([
            'provider' => 'sometimes|string|in:openai,grok,anthropic,custom',
            'model' => 'sometimes|string|max:80',
            'api_base' => 'sometimes|url|max:190',
            'api_key' => 'sometimes|nullable|string|max:500',
            'system_prompt' => 'sometimes|nullable|string|max:8000',
            'temperature' => 'sometimes|integer|min:0|max:100',
            'max_tokens' => 'sometimes|integer|min:64|max:4000',
            'enabled' => 'sometimes|boolean',
        ]);

        $cfg = BotConfig::current();
        foreach (['provider','model','api_base','system_prompt','temperature','max_tokens','enabled'] as $f) {
            if (array_key_exists($f, $data)) {
                $cfg->{$f} = $data[$f];
            }
        }
        if (array_key_exists('api_key', $data) && $data['api_key'] !== null && $data['api_key'] !== '') {
            $cfg->setApiKey($data['api_key']);
        }
        $cfg->save();

        return $this->getConfig($request);
    }

    /**
     * Test rápido: intenta un ping al proveedor con la config actual.
     */
    public function testConnection(): JsonResponse
    {
        $cfg = BotConfig::current();
        if (! $cfg->getApiKey()) {
            return response()->json([
                'ok' => false,
                'message' => 'No hay API key configurada.',
            ], 400);
        }

        try {
            $ai = new \App\Services\BotAiService();
            $answer = $ai->chat([
                ['role' => 'user', 'content' => 'Responde con una sola palabra: "listo".'],
            ], overrideMaxTokens: 20);

            return response()->json([
                'ok' => true,
                'reply' => $answer['content'],
                'model_used' => $answer['model'],
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'ok' => false,
                'message' => 'Error al conectar con el proveedor: '.$e->getMessage(),
            ], 502);
        }
    }

    public static function isValidSessionToken(?string $token): bool
    {
        if (! $token) return false;
        return (bool) Cache::get(self::CACHE_PREFIX.$token);
    }

    private function extractToken(Request $request): ?string
    {
        return $request->header('X-Admin-Session')
            ?? $request->cookie('admin_session');
    }
}
