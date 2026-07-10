#!/usr/bin/env bash
set -euo pipefail

DOMAIN_ROOT="$HOME/domains/orientador.xn--sistemaespaa-khb.com"
ROOT="$DOMAIN_ROOT/public_html"
SOURCE_BACKEND="$ROOT/ORIENTADOR UNES BACKEND"
BACKEND="$DOMAIN_ROOT/backend_runtime"

mkdir -p "$ROOT/api"
cp "$ROOT/deploy-hostinger/api/index.php" "$ROOT/api/index.php"
cp "$ROOT/deploy-hostinger/api/.htaccess" "$ROOT/api/.htaccess"
cp "$ROOT/deploy-hostinger/root.htaccess" "$ROOT/.htaccess"
chmod 644 "$ROOT/api/index.php" "$ROOT/api/.htaccess" "$ROOT/.htaccess"

mkdir -p "$BACKEND"
cd "$SOURCE_BACKEND"
tar \
  --exclude='./.env' \
  --exclude='./vendor' \
  --exclude='./storage' \
  --exclude='./bootstrap/cache' \
  --exclude='./database/database.sqlite' \
  -cf - . | (cd "$BACKEND" && tar -xf -)

cd "$BACKEND"

rm -f bootstrap/cache/packages.php bootstrap/cache/services.php bootstrap/cache/config.php bootstrap/cache/routes-*.php

if [ ! -f .env ]; then
  cat > .env <<'ENV'
APP_NAME=UNES_Orienta_IA
APP_ENV=production
APP_KEY=base64:kjvRA7H6plOKwnqanMR7teVmiM8bLCUv0DVGYtqkOPg=
APP_DEBUG=false
APP_URL=https://orientador.xn--sistemaespaa-khb.com
LOG_CHANNEL=stack
LOG_LEVEL=error
DB_CONNECTION=sqlite
FRONTEND_URL=https://orientador.xn--sistemaespaa-khb.com
SANCTUM_STATEFUL_DOMAINS=orientador.sistemaespaña.com,orientador.xn--sistemaespaa-khb.com
ADMIN_PIN=1234-unes
ADMIN_SESSION_TTL=3600
BOT_PROVIDER=openai
BOT_MODEL=gpt-4o-mini
BOT_API_BASE=https://api.openai.com/v1
SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true
ENV
fi

composer install --no-dev --no-interaction --no-scripts --optimize-autoloader

mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache database
touch database/database.sqlite
chmod -R 775 storage bootstrap/cache database

php artisan migrate --force
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true

echo "Backend runtime listo"
