<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

$backend = dirname(__DIR__, 2) . '/backend_runtime';

$maintenance = $backend . '/storage/framework/maintenance.php';
if (file_exists($maintenance)) {
    require $maintenance;
}

require $backend . '/vendor/autoload.php';

(require_once $backend . '/bootstrap/app.php')
    ->handleRequest(Request::capture());
