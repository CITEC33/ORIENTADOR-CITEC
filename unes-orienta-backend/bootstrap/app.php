<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // API stateless: usamos tokens Bearer (Sanctum), NO sesión/cookies.
        // Por eso NO usamos EnsureFrontendRequestsAreStateful ni CSRF en /api/*.
        $middleware->alias([
            'admin.session' => \App\Http\Middleware\AdminSession::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->create();
