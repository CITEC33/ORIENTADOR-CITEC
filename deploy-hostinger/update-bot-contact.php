<?php

use App\Models\BotConfig;
use Illuminate\Contracts\Console\Kernel;

$domainRoot = dirname(__DIR__, 2);
$backend = $domainRoot . '/backend_runtime';

require $backend . '/vendor/autoload.php';

$app = require $backend . '/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$cfg = BotConfig::current();
$cfg->system_prompt = BotConfig::defaultPrompt();
$cfg->save();

echo "Bot prompt contact updated\n";
