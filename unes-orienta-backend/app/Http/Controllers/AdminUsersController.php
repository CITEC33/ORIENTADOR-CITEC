<?php

namespace App\Http\Controllers;

use App\Models\ChatLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Endpoints admin de gestión de usuarios registrados en UNES Orienta IA.
 * Protegidos con middleware admin.session en routes/api.php.
 */
class AdminUsersController extends Controller
{
    /**
     * Lista paginada + filtros.
     * Query params:
     *   - q         búsqueda libre (nombre / apellidos / email / teléfono / ciclo)
     *   - ciclo     filtra por ciclo exacto (formato YYYY-N)
     *   - desde     fecha inicial de registro (YYYY-MM-DD)
     *   - hasta     fecha final de registro (YYYY-MM-DD)
     *   - page      número de página, 1-based
     *   - per_page  10-200, default 25
     *   - sort      created_at | last_login_at | nombre | email | ciclo
     *   - dir       asc | desc, default desc
     */
    public function index(Request $request): JsonResponse
    {
        [$q, $ciclo, $desde, $hasta] = $this->readFilters($request);

        $perPage = min(200, max(10, (int) $request->query('per_page', 25)));
        $sort    = $request->query('sort', 'created_at');
        $dir     = strtolower($request->query('dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $allowedSort = ['created_at', 'last_login_at', 'nombre', 'apellidos', 'email', 'ciclo'];
        if (! in_array($sort, $allowedSort, true)) {
            $sort = 'created_at';
        }

        $query = User::query()
            ->select([
                'id', 'nombre', 'apellidos', 'email', 'telefono', 'ciclo',
                'last_login_at', 'created_at', 'updated_at',
            ])
            ->withCount(['chatLogs as message_count']);

        $this->applyFilters($query, $q, $ciclo, $desde, $hasta);

        $query->orderBy($sort, $dir)->orderBy('id', $dir);

        $paginator = $query->paginate($perPage);

        return response()->json([
            'ok' => true,
            'users' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'per_page'     => $paginator->perPage(),
                'total'        => $paginator->total(),
                'from'         => $paginator->firstItem(),
                'to'           => $paginator->lastItem(),
                'sort'         => $sort,
                'dir'          => $dir,
                'q'            => $q,
                'ciclo'        => $ciclo,
                'desde'        => $desde,
                'hasta'        => $hasta,
            ],
            'stats' => $this->overallStats(),
            'ciclos_disponibles' => $this->ciclosDisponibles(),
        ]);
    }

    /** Detalle de un usuario, con últimos mensajes. */
    public function show(int $id): JsonResponse
    {
        $user = User::withCount(['chatLogs as message_count'])
            ->findOrFail($id);

        $recent = ChatLog::where('user_id', $user->id)
            ->orderByDesc('id')
            ->limit(20)
            ->get(['id', 'role', 'content', 'model_used', 'tokens_used', 'created_at']);

        return response()->json([
            'ok' => true,
            'user' => $user,
            'recent_messages' => $recent,
        ]);
    }

    /** Elimina usuario + tokens + chat logs. */
    public function destroy(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        ChatLog::where('user_id', $user->id)->delete();
        $user->tokens()->delete();
        $user->delete();

        return response()->json(['ok' => true]);
    }

    /**
     * Exporta usuarios a CSV aplicando los mismos filtros que index().
     */
    public function exportCsv(Request $request): StreamedResponse
    {
        [$q, $ciclo, $desde, $hasta] = $this->readFilters($request);

        $query = User::query()
            ->select([
                'id', 'nombre', 'apellidos', 'email', 'telefono', 'ciclo',
                'last_login_at', 'created_at', 'updated_at',
            ])
            ->withCount(['chatLogs as message_count'])
            ->orderBy('created_at', 'desc');

        $this->applyFilters($query, $q, $ciclo, $desde, $hasta);

        $suffix = [];
        if ($ciclo !== '') $suffix[] = 'ciclo-'.$ciclo;
        if ($desde !== '') $suffix[] = 'desde-'.$desde;
        if ($hasta !== '') $suffix[] = 'hasta-'.$hasta;
        $tag = $suffix ? '_'.implode('_', $suffix) : '';
        $filename = 'unes-orienta-usuarios'.$tag.'_'.date('Y-m-d_H-i').'.csv';

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            'Cache-Control'       => 'no-store, no-cache',
            'Pragma'              => 'no-cache',
        ];

        return response()->streamDownload(function () use ($query) {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF"); // BOM UTF-8

            fputcsv($out, [
                'ID', 'Nombre', 'Apellidos', 'Email', 'Teléfono', 'Ciclo',
                'Mensajes', 'Último ingreso', 'Fecha de registro', 'Última actualización',
            ], ',', '"', '\\');

            $query->chunk(500, function ($users) use ($out) {
                foreach ($users as $u) {
                    fputcsv($out, [
                        $u->id,
                        $u->nombre,
                        $u->apellidos,
                        $u->email,
                        $u->telefono,
                        $u->ciclo ?? '',
                        $u->message_count ?? 0,
                        optional($u->last_login_at)->format('Y-m-d H:i:s') ?? '',
                        optional($u->created_at)->format('Y-m-d H:i:s') ?? '',
                        optional($u->updated_at)->format('Y-m-d H:i:s') ?? '',
                    ], ',', '"', '\\');
                }
            });

            fclose($out);
        }, $filename, $headers);
    }

    /* -------------------- helpers -------------------- */

    /** @return array{0:string,1:string,2:string,3:string} [q, ciclo, desde, hasta] */
    private function readFilters(Request $request): array
    {
        $q     = trim((string) $request->query('q', ''));
        $ciclo = trim((string) $request->query('ciclo', ''));
        $desde = trim((string) $request->query('desde', ''));
        $hasta = trim((string) $request->query('hasta', ''));

        // Normalizamos formato ciclo (YYYY-N) — si no matchea, lo ignoramos.
        if ($ciclo !== '' && ! preg_match('/^\d{4}-[1-3]$/', $ciclo)) {
            $ciclo = '';
        }
        // Fechas: solo permitir YYYY-MM-DD.
        if ($desde !== '' && ! preg_match('/^\d{4}-\d{2}-\d{2}$/', $desde)) {
            $desde = '';
        }
        if ($hasta !== '' && ! preg_match('/^\d{4}-\d{2}-\d{2}$/', $hasta)) {
            $hasta = '';
        }

        return [$q, $ciclo, $desde, $hasta];
    }

    private function applyFilters(Builder $query, string $q, string $ciclo, string $desde, string $hasta): void
    {
        if ($q !== '') {
            $like = '%'.str_replace(['%','_'], ['\\%','\\_'], $q).'%';
            $query->where(function ($sub) use ($like) {
                $sub->where('nombre', 'like', $like)
                    ->orWhere('apellidos', 'like', $like)
                    ->orWhere('email', 'like', $like)
                    ->orWhere('telefono', 'like', $like)
                    ->orWhere('ciclo', 'like', $like);
            });
        }
        if ($ciclo !== '') {
            $query->where('ciclo', $ciclo);
        }
        if ($desde !== '') {
            $query->whereDate('created_at', '>=', $desde);
        }
        if ($hasta !== '') {
            $query->whereDate('created_at', '<=', $hasta);
        }
    }

    /** Estadísticas globales para el dashboard rápido de /admin/users. */
    private function overallStats(): array
    {
        $now = now();
        return [
            'total_users'    => User::count(),
            'new_today'      => User::whereDate('created_at', $now->toDateString())->count(),
            'new_week'       => User::where('created_at', '>=', $now->copy()->subDays(7))->count(),
            'active_week'    => User::where('last_login_at', '>=', $now->copy()->subDays(7))->count(),
            'total_messages' => ChatLog::count(),
            'ciclo_actual'   => User::currentCiclo(),
        ];
    }

    /**
     * Lista de ciclos existentes en la BD (para poblar el dropdown del filtro).
     * @return array<int, array{ciclo:string,total:int}>
     */
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
