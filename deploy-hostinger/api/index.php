<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

$maintenance = __DIR__ . '/../ORIENTADOR UNES BACKEND/storage/framework/maintenance.php';
if (file_exists($maintenance)) {
    require $maintenance;
}

require __DIR__ . '/../ORIENTADOR UNES BACKEND/vendor/autoload.php';

(require_once __DIR__ . '/../ORIENTADOR UNES BACKEND/bootstrap/app.php')
    ->handleRequest(Request::capture());
