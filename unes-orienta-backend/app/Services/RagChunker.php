<?php

namespace App\Services;

/**
 * Parte un documento Markdown en chunks respetando headings.
 *
 * Estrategia:
 * 1. Divide por headings de nivel 2/3 (## / ###). Cada bloque = un candidato.
 * 2. Si un bloque excede ~500 tokens (aprox 2000 caracteres),
 *    se sub-divide por párrafos hasta caber.
 * 3. Se mantiene un overlap textual (~200 chars) entre chunks contiguos.
 */
class RagChunker
{
    private const MAX_CHARS = 2000;   // ~500 tokens
    private const OVERLAP  = 200;    // ~50 tokens de solape

    /**
     * @return array<int, array{heading: ?string, content: string, index: int}>
     */
    public function chunk(string $markdown): array
    {
        $markdown = trim($markdown);
        if ($markdown === '') return [];

        // Divide por headings ## o ### manteniendo el heading en el bloque siguiente.
        $blocks = preg_split(
            '/(?=^\#{2,3}\s+)/m',
            $markdown,
            -1,
            PREG_SPLIT_NO_EMPTY
        );

        // Si no hay headings, tratamos todo como un solo bloque.
        if (! $blocks) $blocks = [$markdown];

        $chunks = [];
        $index  = 0;

        foreach ($blocks as $block) {
            $block = trim($block);
            if ($block === '') continue;

            // Extrae el heading del inicio si existe.
            $heading = null;
            if (preg_match('/^(\#{2,3}\s+.+?)$/m', $block, $m)) {
                $heading = trim(preg_replace('/^\#{2,3}\s+/', '', $m[1]));
            }

            // Si el bloque cabe entero, lo agregamos.
            if (mb_strlen($block) <= self::MAX_CHARS) {
                $chunks[] = [
                    'heading' => $heading,
                    'content' => $block,
                    'index'   => $index++,
                ];
                continue;
            }

            // Sub-dividimos por párrafos hasta caber.
            $paragraphs = preg_split('/\n\s*\n/', $block, -1, PREG_SPLIT_NO_EMPTY);
            $buffer = '';
            foreach ($paragraphs as $p) {
                $p = trim($p);
                if ($p === '') continue;

                if (mb_strlen($buffer) + mb_strlen($p) + 2 > self::MAX_CHARS && $buffer !== '') {
                    $chunks[] = [
                        'heading' => $heading,
                        'content' => trim($buffer),
                        'index'   => $index++,
                    ];
                    // Overlap: retomamos las últimas OVERLAP chars del buffer previo.
                    $buffer = mb_substr($buffer, max(0, mb_strlen($buffer) - self::OVERLAP))."\n\n".$p;
                } else {
                    $buffer = $buffer === '' ? $p : $buffer."\n\n".$p;
                }
            }

            if (trim($buffer) !== '') {
                $chunks[] = [
                    'heading' => $heading,
                    'content' => trim($buffer),
                    'index'   => $index++,
                ];
            }
        }

        return $chunks;
    }

    /** Estimación rápida de tokens (1 token ≈ 4 chars en español). */
    public function estimateTokens(string $text): int
    {
        return (int) ceil(mb_strlen($text) / 4);
    }
}
