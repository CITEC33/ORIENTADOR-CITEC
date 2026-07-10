<?php

namespace App\Http\Middleware;

use App\Http\Controllers\AdminController;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware que exige un admin_session válido para acceder al panel admin.
 * El token viaja como header X-Admin-Session o cookie admin_session.
 */
class AdminSession
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->header('X-Admin-Session')
            ?? $request->cookie('admin_session')
            // Fallback: para descargas via <a href> el navegador no puede
            // enviar headers custom. Aceptamos el token por query string.
            ?? $request->query('admin_session');

        if (! AdminController::isValidSessionToken($token)) {
            return response()->json([
                'ok' => false,
                'code' => 'admin_unauthorized',
                'message' => 'Sesión de admin inválida o expirada.',
            ], 401);
        }

        return $next($request);
    }
}
