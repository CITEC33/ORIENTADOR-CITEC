<?php

return [
    'provider' => env('BOT_PROVIDER', 'openai'),
    'model'    => env('BOT_MODEL', 'gpt-4o-mini'),
    'api_base' => env('BOT_API_BASE', 'https://api.openai.com/v1'),

    // PIN maestro del panel admin. Debe definirse en .env.
    'admin_pin'         => env('ADMIN_PIN', ''),
    'admin_session_ttl' => (int) env('ADMIN_SESSION_TTL', 3600),
];
