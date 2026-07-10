<?php

namespace App\Http\Controllers;

use App\Models\ChatLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * Endpoint /api/admin/stats — dashboard analítico del panel orientador.
 *
 * Devuelve métricas globales de usuarios y mensajes con filtros de:
 *   - desde (YYYY-MM-DD)
 *   - hasta (YYYY-MM-DD)
 *   - ciclo (YYYY-N)
 *
 * Todo se calcula por SQL agregado, sin cargar filas en memoria.
 */
class AdminStatsController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        [$desde, $hasta, $ciclo] = $this->readFilters($request);

        // Rango efectivo: si no se especifica, últimos 90 días.
        $endCarbon   = $hasta !== '' ? Carbon::parse($hasta)->endOfDay()   : now()->endOfDay();
        $startCarbon = $desde !== '' ? Carbon::parse($desde)->startOfDay() : $endCarbon->copy()->subDays(89)->startOfDay();

        // --- Query base de usuarios en rango ---
        $usersQ = User::query();
        $this->scopeUsers($usersQ, $startCarbon, $endCarbon, $ciclo);

        $totalUsers = (clone $usersQ)->count();

        // Distribución por día (registros nuevos) — usamos DATE(created_at)
        $porDia = (clone $usersQ)
            ->selectRaw('DATE(created_at) as fecha, COUNT(*) as total')
            ->groupBy('fecha')
            ->orderBy('fecha')
            ->get()
            ->map(fn ($r) => ['fecha' => (string) $r->fecha, 'total' => (int) $r->total])
            ->all();

        // Distribución por ciclo
        $porCiclo = (clone $usersQ)
            ->selectRaw('COALESCE(NULLIF(ciclo, ""), "sin-ciclo") as ciclo, COUNT(*) as total')
            ->groupBy('ciclo')
            ->orderByDesc('total')
            ->get()
            ->map(fn ($r) => ['ciclo' => (string) $r->ciclo, 'total' => (int) $r->total])
            ->all();

        // --- Mensajes en rango ---
        $msgQ = ChatLog::query()
            ->whereBetween('created_at', [$startCarbon, $endCarbon]);
        if ($ciclo !== '') {
            $msgQ->whereIn('user_id', User::query()->where('ciclo', $ciclo)->pluck('id'));
        }

        $totalMensajes = (clone $msgQ)->count();
        $mensajesUsuario = (clone $msgQ)->where('role', 'user')->count();
        $mensajesAsistente = (clone $msgQ)->where('role', 'assistant')->count();
        $tokensTotales = (int) (clone $msgQ)->sum('tokens_used');

        $mensajesPorDia = (clone $msgQ)
            ->selectRaw('DATE(created_at) as fecha, COUNT(*) as total')
            ->groupBy('fecha')
            ->orderBy('fecha')
            ->get()
            ->map(fn ($r) => ['fecha' => (string) $r->fecha, 'total' => (int) $r->total])
            ->all();

        // Usuarios más activos en el rango
        $topUsers = (clone $msgQ)
            ->selectRaw('user_id, COUNT(*) as total')
            ->whereNotNull('user_id')
            ->groupBy('user_id')
            ->orderByDesc('total')
            ->limit(10)
            ->get();

        $usersById = User::whereIn('id', $topUsers->pluck('user_id'))
            ->get(['id', 'nombre', 'apellidos', 'email', 'ciclo'])
            ->keyBy('id');

        $topUsuarios = $topUsers->map(function ($r) use ($usersById) {
            $u = $usersById->get($r->user_id);
            return [
                'user_id'   => (int) $r->user_id,
                'nombre'    => $u ? trim(($u->nombre ?? '').' '.($u->apellidos ?? '')) : 'Usuario '.$r->user_id,
                'email'     => $u->email ?? null,
                'ciclo'     => $u->ciclo ?? null,
                'mensajes'  => (int) $r->total,
            ];
        })->all();

        // Actividad global
        $now = now();
        $globales = [
            'usuarios_totales_all_time'  => User::count(),
            'usuarios_hoy'               => User::whereDate('created_at', $now->toDateString())->count(),
            'usuarios_ultimos_7d'        => User::where('created_at', '>=', $now->copy()->subDays(7))->count(),
            'usuarios_ultimos_30d'       => User::where('created_at', '>=', $now->copy()->subDays(30))->count(),
            'activos_ultimos_7d'         => User::where('last_login_at', '>=', $now->copy()->subDays(7))->count(),
            'mensajes_totales_all_time'  => ChatLog::count(),
            'ciclo_actual'               => User::currentCiclo(),
        ];

        return response()->json([
            'ok' => true,
            'filtros' => [
                'desde' => $startCarbon->toDateString(),
                'hasta' => $endCarbon->toDateString(),
                'ciclo' => $ciclo,
            ],
            'resumen' => [
                'usuarios_en_rango'   => $totalUsers,
                'mensajes_en_rango'   => $totalMensajes,
                'mensajes_usuario'    => $mensajesUsuario,
                'mensajes_asistente'  => $mensajesAsistente,
                'tokens_totales'      => $tokensTotales,
                'promedio_msgs_user'  => $totalUsers > 0 ? round($mensajesUsuario / max(1, $totalUsers), 2) : 0,
            ],
            'usuarios_por_dia'   => $porDia,
            'usuarios_por_ciclo' => $porCiclo,
            'mensajes_por_dia'   => $mensajesPorDia,
            'top_usuarios'       => $topUsuarios,
            'globales'           => $globales,
            'ciclos_disponibles' => $this->ciclosDisponibles(),
        ]);
    }

    /** @return array{0:string,1:string,2:string} [desde, hasta, ciclo] */
    private function readFilters(Request $request): array
    {
        $desde = trim((string) $request->query('desde', ''));
        $hasta = trim((string) $request->query('hasta', ''));
        $ciclo = trim((string) $request->query('ciclo', ''));

        if ($desde !== '' && ! preg_match('/^\d{4}-\d{2}-\d{2}$/', $desde)) $desde = '';
        if ($hasta !== '' && ! preg_match('/^\d{4}-\d{2}-\d{2}$/', $hasta)) $hasta = '';
        if ($ciclo !== '' && ! preg_match('/^\d{4}-[1-3]$/', $ciclo)) $ciclo = '';

        return [$desde, $hasta, $ciclo];
    }

    private function scopeUsers(Builder $q, Carbon $start, Carbon $end, string $ciclo): void
    {
        $q->whereBetween('created_at', [$start, $end]);
        if ($ciclo !== '') {
            $q->where('ciclo', $ciclo);
        }
    }

    /** @return array<int, array{ciclo:string,total:int}> */
    private function ciclosDisponibles(): array
    {
        return User::query()
            ->selectRaw('ciclo, COUNT(*) as total')
            ->whereNotNull('ciclo')
            ->where('ciclo', '<>', '')
            ->groupBy('ciclo')
            ->orderByDesc('ciclo')
            ->get()
            ->map(fn ($r) => ['ciclo' => $r->ciclo, 'total' => (int) $r->total])
            ->all();
    }
}
