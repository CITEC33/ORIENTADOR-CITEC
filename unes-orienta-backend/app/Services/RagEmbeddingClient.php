<?php

namespace App\Services;

use App\Models\BotConfig;
use GuzzleHttp\Client;

/**
 * Cliente delgado para generar embeddings.
 * Usa la misma api_base y api_key que BotConfig (compatible con OpenAI).
 * Modelo por defecto: text-embedding-3-small (1536 dims, económico).
 */
class RagEmbeddingClient
{
    public const MODEL = 'text-embedding-3-small';
    public const DIMS  = 1536;

    private BotConfig $cfg;
    private Client $http;

    public function __construct()
    {
        $this->cfg  = BotConfig::current();
        $this->http = new Client([
            'timeout' => 60,
            'connect_timeout' => 15,
        ]);
    }

    /**
     * Genera embeddings para una lista de textos en un solo request (batch).
     *
     * @param  array<int, string>  $inputs
     * @return array<int, array<int, float>>  vectores en el mismo orden
     */
    public function embed(array $inputs, string $model = self::MODEL): array
    {
        if (! $this->cfg->enabled) {
            throw new \RuntimeException('El bot está deshabilitado.');
        }
        $key = $this->cfg->getApiKey();
        if (! $key) {
            throw new \RuntimeException('No hay API key configurada.');
        }
        $inputs = array_values(array_filter($inputs, fn ($t) => is_string($t) && trim($t) !== ''));
        if (! $inputs) return [];

        $endpoint = rtrim($this->cfg->api_base, '/').'/embeddings';
        $res = $this->http->post($endpoint, [
            'headers' => [
                'Authorization' => 'Bearer '.$key,
                'Content-Type'  => 'application/json',
            ],
            'json' => [
                'model' => $model,
                'input' => $inputs,
            ],
        ]);

        $data = json_decode((string) $res->getBody(), true);
        $vectors = [];
        foreach ($data['data'] ?? [] as $row) {
            $idx = $row['index'] ?? count($vectors);
            $vectors[$idx] = $row['embedding'] ?? [];
        }
        ksort($vectors);
        return array_values($vectors);
    }

    /** Embedding de un único texto (helper). */
    public function embedOne(string $input, string $model = self::MODEL): array
    {
        $v = $this->embed([$input], $model);
        return $v[0] ?? [];
    }

    /** Similitud coseno entre dos vectores. */
    public static function cosine(array $a, array $b): float
    {
        $len = min(count($a), count($b));
        if ($len === 0) return 0.0;

        $dot = 0.0; $na = 0.0; $nb = 0.0;
        for ($i = 0; $i < $len; $i++) {
            $av = (float) $a[$i]; $bv = (float) $b[$i];
            $dot += $av * $bv;
            $na  += $av * $av;
            $nb  += $bv * $bv;
        }
        if ($na === 0.0 || $nb === 0.0) return 0.0;
        return $dot / (sqrt($na) * sqrt($nb));
    }
}
