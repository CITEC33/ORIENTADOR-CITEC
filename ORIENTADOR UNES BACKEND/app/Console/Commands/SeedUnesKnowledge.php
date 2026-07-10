<?php

namespace App\Console\Commands;

use App\Models\KnowledgeDocument;
use App\Services\RagIndexer;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Semilla masiva de la base de conocimiento (RAG) desde los datos oficiales
 * de UNES Durango ya scrapeados en ORIENTADOR UNES/src/data/*.js.
 *
 * Genera ~50 documentos Markdown y llama a RagIndexer::reindex() para chunk + embed.
 *
 * Uso:
 *   php artisan knowledge:seed-unes            # Crea/actualiza + reindexa
 *   php artisan knowledge:seed-unes --dry-run  # Solo muestra qué crearía
 *   php artisan knowledge:seed-unes --fresh    # Borra todos los docs UNES antes
 */
class SeedUnesKnowledge extends Command
{
    protected $signature = 'knowledge:seed-unes {--dry-run} {--fresh} {--skip-index}';
    protected $description = 'Poblar la base de conocimiento (RAG) con datos oficiales de UNES Durango';

    public function handle(RagIndexer $indexer): int
    {
        $jsonPath = database_path('seeders/data/unes-data.json');
        if (! is_file($jsonPath)) {
            $this->error("No se encontró {$jsonPath}. Ejecuta: node database/seeders/data/export-unes-data.mjs");
            return self::FAILURE;
        }

        $data = json_decode(file_get_contents($jsonPath), true);
        if (! is_array($data)) {
            $this->error('unes-data.json inválido');
            return self::FAILURE;
        }

        $dryRun = (bool) $this->option('dry-run');
        $fresh  = (bool) $this->option('fresh');
        $skipIndex = (bool) $this->option('skip-index');

        if ($fresh && ! $dryRun) {
            $deleted = KnowledgeDocument::whereIn('category', $this->allCategories())->delete();
            $this->warn("🗑️  Borrados {$deleted} documentos UNES previos");
        }

        $docs = $this->buildDocuments($data);
        $this->info(sprintf('📚 Generados %d documentos', count($docs)));

        if ($dryRun) {
            foreach ($docs as $d) {
                $this->line(sprintf('  · [%s] %s (%d chars)', $d['category'], $d['title'], strlen($d['content'])));
            }
            $this->warn('DRY RUN: no se guardó ni indexó nada.');
            return self::SUCCESS;
        }

        $bar = $this->output->createProgressBar(count($docs));
        $bar->setFormat(' %current%/%max% [%bar%] %percent:3s%% · %message%');
        $bar->setMessage('preparando…');
        $bar->start();

        $created = 0;
        $updated = 0;
        $totalChunks = 0;
        $totalTokens = 0;
        $errors = [];

        foreach ($docs as $spec) {
            $bar->setMessage(mb_strimwidth($spec['title'], 0, 45, '…'));

            try {
                DB::beginTransaction();

                $doc = KnowledgeDocument::where('slug', $spec['slug'])->first();
                if ($doc) {
                    $doc->update([
                        'title'    => $spec['title'],
                        'category' => $spec['category'],
                        'content'  => $spec['content'],
                        'enabled'  => true,
                    ]);
                    $updated++;
                } else {
                    $doc = KnowledgeDocument::create([
                        'title'    => $spec['title'],
                        'slug'     => $spec['slug'],
                        'category' => $spec['category'],
                        'content'  => $spec['content'],
                        'enabled'  => true,
                    ]);
                    $created++;
                }

                DB::commit();

                if (! $skipIndex) {
                    $stats = $indexer->reindex($doc);
                    $totalChunks += $stats['chunks'];
                    $totalTokens += $stats['tokens'];
                }
            } catch (\Throwable $e) {
                DB::rollBack();
                $errors[] = "{$spec['slug']}: {$e->getMessage()}";
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("✅ Seed completo:");
        $this->line("   · Creados:     {$created}");
        $this->line("   · Actualizados: {$updated}");
        if (! $skipIndex) {
            $this->line("   · Chunks:      {$totalChunks}");
            $this->line("   · Tokens:      {$totalTokens}");
        } else {
            $this->warn('   ⚠  --skip-index activo: no se generaron embeddings');
        }

        if (! empty($errors)) {
            $this->error(sprintf('❌ %d errores:', count($errors)));
            foreach ($errors as $e) {
                $this->line("   · {$e}");
            }
            return self::FAILURE;
        }

        return self::SUCCESS;
    }

    /** Lista de categorías usadas por este seeder (para --fresh) */
    private function allCategories(): array
    {
        return [
            'unes-general',
            'unes-licenciatura',
            'unes-maestria',
            'unes-doctorado',
            'unes-modalidad',
            'unes-admision',
            'unes-becas',
            'unes-contacto',
        ];
    }

    /**
     * Genera la lista completa de documentos a insertar.
     * @return array<int, array{title:string,slug:string,category:string,content:string}>
     */
    private function buildDocuments(array $data): array
    {
        $docs = [];

        // 1. General institucional
        $docs[] = $this->docGeneral($data);
        $docs[] = $this->docContacto($data);
        $docs[] = $this->docModalidades($data);
        $docs[] = $this->docAdmisiones($data);
        $docs[] = $this->docBecas($data);
        $docs[] = $this->docOfertaCompleta($data);

        // 2. Un documento por licenciatura (33)
        foreach ($data['index'] as $slug => $career) {
            $docs[] = $this->docLicenciatura($slug, $career, $data);
        }

        // 3. Un documento por área con lista de carreras
        foreach ($data['areas'] as $area) {
            $docs[] = $this->docArea($area);
        }

        // 4. Documentos por área de maestría/doctorado
        foreach ($data['maestrias'] as $group) {
            $docs[] = $this->docMaestriasArea($group);
        }
        $docs[] = $this->docDoctorados($data['doctorados']);

        return $docs;
    }

    private function docGeneral(array $data): array
    {
        $c = $data['contact'];
        $counts = $data['counts'];
        $content = <<<MD
# Universidad España (UNES) — Durango

**{$c['name']}** ({$c['shortName']}) es una universidad privada ubicada en **{$c['city']}**, México,
con más de dos décadas formando profesionistas. Ofrece **{$counts['licenciaturas']} licenciaturas**,
**{$counts['maestrias']} maestrías** y **{$counts['doctorados']} doctorados** en modalidades
presencial (cuatrimestre), virtual y sabatino ejecutivo.

## Datos oficiales

- **Dirección:** {$c['address']}
- **Teléfono:** {$c['phonePretty']} ({$c['phone']})
- **WhatsApp:** {$c['whatsappPretty']}
- **Correo:** {$c['email']}
- **Sitio web:** {$c['website']}
- **Campus online:** {$c['campusOnline']}
- **Facebook:** {$c['facebook']}

## Filosofía institucional

UNES forma **líderes** en distintas áreas del conocimiento con enfoque
práctico, humanístico y de responsabilidad social. Su lema motivacional es
**"El éxito es ahora UNES 🦅"**.
MD;
        return [
            'title'    => 'UNES Durango — Información general',
            'slug'     => 'unes-general',
            'category' => 'unes-general',
            'content'  => $content,
        ];
    }

    private function docContacto(array $data): array
    {
        $c = $data['contact'];
        $content = <<<MD
# Cómo contactar a UNES Durango

Para informes, dudas, agendar una visita al campus, solicitar folletos o iniciar
el proceso de inscripción, hay varios canales oficiales:

## Teléfono
**{$c['phonePretty']}** (marcación desde México). Atienden en horario de oficina de lunes a viernes.

## WhatsApp
**{$c['whatsappPretty']}** — respuesta rápida para dudas puntuales sobre carreras,
costos, becas y fechas.

## Correo electrónico
**{$c['email']}** — ideal para solicitudes formales, documentos e información detallada.

## Presencial
**{$c['address']}**. Puedes agendar una visita guiada al campus llamando previamente.

## Web y redes
- Sitio principal: {$c['website']}
- Campus online (alumnos): {$c['campusOnline']}
- Facebook: {$c['facebook']}

Cuando necesites información específica de costos vigentes, fechas exactas de
convocatoria o becas puntuales, **contáctanos directamente** por cualquiera de
estos canales.
MD;
        return [
            'title'    => 'Contacto UNES Durango',
            'slug'     => 'unes-contacto',
            'category' => 'unes-contacto',
            'content'  => $content,
        ];
    }

    private function docModalidades(array $data): array
    {
        $lines = ['# Modalidades de estudio en UNES Durango', ''];
        $lines[] = 'UNES ofrece **tres modalidades** para que puedas adaptar tus estudios a tu ritmo de vida:';
        $lines[] = '';
        foreach ($data['modalidades'] as $m) {
            $lines[] = "## {$m['nombre']}";
            $lines[] = $m['detalle'];
            $lines[] = '';
        }
        $lines[] = '## ¿Cómo elegir modalidad?';
        $lines[] = '- **Cuatrimestre**: ideal si estás recién egresado de prepa/bachillerato y quieres terminar rápido (3 años).';
        $lines[] = '- **Virtual**: perfecta si necesitas flexibilidad total (trabajas, tienes hijos, vives lejos).';
        $lines[] = '- **Sabatino Ejecutivo**: para quienes trabajan de lunes a viernes y solo tienen sábados libres.';
        $lines[] = '';
        $lines[] = 'Todas las carreras se pueden cursar en cuatrimestre y sabatino. Algunas carreras del área médica (Médico Cirujano, Odontología) **solo se ofrecen presencial** por sus prácticas clínicas.';

        return [
            'title'    => 'Modalidades UNES (Cuatrimestre / Virtual / Sabatino)',
            'slug'     => 'unes-modalidades',
            'category' => 'unes-modalidad',
            'content'  => implode("\n", $lines),
        ];
    }

    private function docAdmisiones(array $data): array
    {
        $c = $data['contact'];
        $content = <<<MD
# Proceso de admisión UNES Durango

UNES tiene un proceso de admisión ágil, pensado para que puedas comenzar tu
carrera lo antes posible. **No hay examen de admisión eliminatorio**; el objetivo
es evaluarte, orientarte y darte la bienvenida.

## Documentos requeridos

- Acta de nacimiento (original + copia).
- Certificado de bachillerato o preparatoria (para licenciatura) o de licenciatura (para maestría).
- CURP.
- Comprobante de domicilio reciente.
- 6 fotografías tamaño infantil blanco y negro.
- Identificación oficial (INE / pasaporte / cartilla).

## Pasos generales

1. **Contáctanos** al {$c['phonePretty']} o por WhatsApp {$c['whatsappPretty']}
   para agendar una asesoría personalizada.
2. **Recibe información** de la carrera y modalidad que te interesa (costos,
   plan de estudios, becas disponibles).
3. **Aplica un examen diagnóstico** (no eliminatorio) para orientarte académicamente.
4. **Entrega documentación** completa.
5. **Realiza el pago de inscripción** y **primer pago mensual**.
6. **¡Bienvenido a UNES!** Recibes credencial, acceso al campus online y kit de bienvenida.

## Cuándo aplicar

UNES tiene **ingresos cuatrimestrales**, por lo que puedes iniciar en varios momentos del año.
Consulta las próximas fechas en {$c['website']} o llamando al {$c['phonePretty']}.

## Requisitos especiales por carrera

- **Médico Cirujano** y **Médico Cirujano Odontólogo**: solo modalidad presencial (cuatrimestre)
  por sus componentes clínicos y prácticas hospitalarias.
- **Arquitectura** e ingenierías: se recomienda buen nivel en matemáticas y física.
- **Ciencias de la Enfermería** y **Prótesis Dental**: solo cuatrimestre o sabatino (no virtual).

Para dudas específicas contáctanos en **{$c['email']}**.
MD;
        return [
            'title'    => 'Admisión e inscripción a UNES Durango',
            'slug'     => 'unes-admisiones',
            'category' => 'unes-admision',
            'content'  => $content,
        ];
    }

    private function docBecas(array $data): array
    {
        $c = $data['contact'];
        $content = <<<MD
# Becas y apoyos financieros en UNES Durango

UNES ofrece diversos esquemas de **becas y financiamiento** para que el costo no
sea un impedimento para tu formación profesional.

## Tipos de beca disponibles

- **Beca por excelencia académica** — para alumnos con promedio destacado del
  bachillerato o del semestre anterior (en UNES).
- **Beca deportiva y cultural** — para quienes representan a la universidad
  en actividades deportivas, artísticas o culturales.
- **Beca por hermanos** — descuento cuando dos o más hermanos estudian
  simultáneamente en UNES.
- **Beca convenio empresarial** — para colaboradores de empresas con las que
  UNES tiene convenios activos.
- **Beca socioeconómica** — evaluada caso por caso para estudiantes con
  necesidades económicas comprobadas.

## Financiamiento y pagos

- Pagos **mensuales** para facilitar el flujo (no colegiaturas semestrales).
- Descuentos por pronto pago.
- Planes de financiamiento internos.
- Convenio con instituciones para créditos educativos.

## Cómo aplicar

1. Solicita tu **entrevista de beca** al {$c['phonePretty']} o {$c['email']}.
2. Presenta los documentos requeridos (comprobantes de ingreso familiar,
   constancia de estudios, etc.).
3. El comité de becas evalúa y responde en un plazo aproximado de 5 días hábiles.
4. Si eres aceptado, la beca aplica desde tu primer cuatrimestre en UNES.

## Importante

Los **porcentajes de descuento** y **montos vigentes** varían por convocatoria.
Contáctanos directamente para conocer los **porcentajes actualizados** aplicables
a tu carrera y modalidad. Escríbenos a **{$c['email']}** o llama al **{$c['phonePretty']}**.
MD;
        return [
            'title'    => 'Becas y financiamiento UNES',
            'slug'     => 'unes-becas',
            'category' => 'unes-becas',
            'content'  => $content,
        ];
    }

    private function docOfertaCompleta(array $data): array
    {
        $lines = ['# Oferta educativa completa de UNES Durango', ''];
        $lines[] = "UNES imparte **{$data['counts']['licenciaturas']} licenciaturas**, **{$data['counts']['maestrias']} maestrías** y **{$data['counts']['doctorados']} doctorados**.";
        $lines[] = '';

        $lines[] = '## Licenciaturas por área';
        $lines[] = '';
        foreach ($data['areas'] as $area) {
            $lines[] = "### {$area['icon']} {$area['area']}";
            $lines[] = $area['description'];
            $lines[] = '';
            foreach ($area['careers'] as $c) {
                $lines[] = "- **{$c['name']}**";
            }
            $lines[] = '';
        }

        $lines[] = '## Maestrías';
        $lines[] = '';
        foreach ($data['maestrias'] as $group) {
            $lines[] = "### {$group['area']}";
            foreach ($group['items'] as $m) {
                $lines[] = "- {$m}";
            }
            $lines[] = '';
        }

        $lines[] = '## Doctorados';
        $lines[] = '';
        foreach ($data['doctorados'] as $group) {
            $lines[] = "### {$group['area']}";
            foreach ($group['items'] as $d) {
                $lines[] = "- {$d}";
            }
            $lines[] = '';
        }

        return [
            'title'    => 'Oferta educativa completa UNES (licenciaturas, maestrías y doctorados)',
            'slug'     => 'unes-oferta-completa',
            'category' => 'unes-general',
            'content'  => implode("\n", $lines),
        ];
    }

    private function docLicenciatura(string $slug, array $career, array $data): array
    {
        $name = $career['name'];
        $area = $career['areaName'];
        $description = $career['description'] ?? '';
        $modalidades = $career['modalidades'] ?? [];
        $modLabels = array_map(fn ($m) => match($m) {
            'cuatrimestre' => 'Cuatrimestre (presencial, 3 años)',
            'virtual' => 'Virtual (campus en línea)',
            'sabatino' => 'Sabatino Ejecutivo (sábados)',
            default => $m,
        }, $modalidades);

        $lines = ["# Licenciatura en {$name} — UNES Durango", ''];
        $lines[] = "**Área:** {$area}";
        $lines[] = "**Modalidades disponibles:** " . implode(', ', $modLabels);
        $lines[] = '';

        $lines[] = '## Descripción de la carrera';
        $lines[] = $description;
        $lines[] = '';

        // Ficha detallada si existe
        if (isset($data['details'][$slug])) {
            $d = $data['details'][$slug];
            $lines[] = '## Ficha adicional';
            if (isset($d['duration'])) {
                $lines[] = "- **Duración:** {$d['duration']}";
            }
            if (isset($d['perfil'])) {
                $lines[] = "- **Perfil recomendado:** {$d['perfil']}";
            }
            if (isset($d['campo'])) {
                $lines[] = "- **Campo laboral:** {$d['campo']}";
            }
            $lines[] = '';
        }

        // Plan de estudios detallado si existe
        if (isset($data['plans'][$slug])) {
            $p = $data['plans'][$slug];
            if (! empty($p['rvoe'])) {
                $lines[] = "**RVOE:** {$p['rvoe']}";
                $lines[] = '';
            }
            if (! empty($p['perfilIngreso'])) {
                $lines[] = '## Perfil de ingreso';
                foreach ($p['perfilIngreso'] as $pt) {
                    $lines[] = "- " . strip_tags(str_replace(['**', '*'], '', $pt));
                }
                $lines[] = '';
            }
            if (! empty($p['perfilEgreso'])) {
                $lines[] = '## Perfil de egreso';
                foreach ($p['perfilEgreso'] as $pt) {
                    $lines[] = "- " . strip_tags(str_replace(['**', '*'], '', $pt));
                }
                $lines[] = '';
            }
            if (! empty($p['planEstudios'])) {
                $lines[] = '## Plan de estudios';
                foreach ($p['planEstudios'] as $ciclo) {
                    $lines[] = "### {$ciclo['ciclo']}";
                    foreach ($ciclo['materias'] as $mat) {
                        $lines[] = "- {$mat}";
                    }
                    $lines[] = '';
                }
            }
        }

        $lines[] = '## Contacto';
        $lines[] = "Para información específica sobre costos, fechas de inicio y becas de la Licenciatura en **{$name}**, contáctanos:";
        $lines[] = "- Teléfono: {$data['contact']['phonePretty']}";
        $lines[] = "- WhatsApp: {$data['contact']['whatsappPretty']}";
        $lines[] = "- Correo: {$data['contact']['email']}";
        $lines[] = '';
        $lines[] = "*El éxito es ahora UNES 🦅*";

        return [
            'title'    => "Licenciatura en {$name}",
            'slug'     => 'lic-' . $slug,
            'category' => 'unes-licenciatura',
            'content'  => implode("\n", $lines),
        ];
    }

    private function docArea(array $area): array
    {
        $lines = ["# Área académica: {$area['area']} — UNES Durango", ''];
        $lines[] = $area['description'];
        $lines[] = '';
        $lines[] = '## Licenciaturas de esta área';
        foreach ($area['careers'] as $c) {
            $lines[] = "- **{$c['name']}**: " . strip_tags(str_replace(['**', '*'], '', $c['description']));
        }
        $lines[] = '';
        $lines[] = "Si te interesan carreras de **{$area['area']}**, cualquiera de estas puede ser una excelente opción para ti. Habla con un asesor UNES para encontrar la que mejor se adapte a tu perfil.";

        return [
            'title'    => "Área: {$area['area']}",
            'slug'     => 'area-' . $area['id'],
            'category' => 'unes-general',
            'content'  => implode("\n", $lines),
        ];
    }

    private function docMaestriasArea(array $group): array
    {
        $lines = ["# Maestrías UNES — {$group['area']}", ''];
        $lines[] = "UNES ofrece las siguientes maestrías en el área de **{$group['area']}**:";
        $lines[] = '';
        foreach ($group['items'] as $m) {
            $lines[] = "- **{$m}**";
        }
        $lines[] = '';
        $lines[] = '## Modalidades';
        $lines[] = 'Las maestrías UNES se cursan generalmente en modalidad **sabatino ejecutivo** o **virtual**, ideal para profesionistas que ya trabajan.';
        $lines[] = '';
        $lines[] = 'Para conocer plan de estudios, costos vigentes y fechas de inicio, contáctanos al **618 833 9000** o **informes@unes.edu.mx**.';

        return [
            'title'    => "Maestrías UNES en {$group['area']}",
            'slug'     => 'maestrias-' . \Illuminate\Support\Str::slug($group['area']),
            'category' => 'unes-maestria',
            'content'  => implode("\n", $lines),
        ];
    }

    private function docDoctorados(array $doctorados): array
    {
        $lines = ['# Doctorados UNES Durango', ''];
        $lines[] = 'UNES ofrece tres doctorados en áreas estratégicas:';
        $lines[] = '';
        foreach ($doctorados as $group) {
            $lines[] = "## {$group['area']}";
            foreach ($group['items'] as $d) {
                $lines[] = "- **{$d}**";
            }
            $lines[] = '';
        }
        $lines[] = '## Modalidad';
        $lines[] = 'Los doctorados UNES se cursan en modalidad **sabatino ejecutivo** o **virtual**, con un enfoque de investigación aplicada.';
        $lines[] = '';
        $lines[] = 'Consulta plan de estudios, líneas de investigación y costos al **618 833 9000** o **informes@unes.edu.mx**.';

        return [
            'title'    => 'Doctorados UNES Durango',
            'slug'     => 'doctorados-unes',
            'category' => 'unes-doctorado',
            'content'  => implode("\n", $lines),
        ];
    }
}
