# UNES Orienta IA — Backend (Laravel 11)

Backend seguro para la app **UNES Orienta IA** (mascota **Aquila**).
Provee autenticación sin contraseña, panel admin del bot y proxy a la API de IA.

## Requisitos

- PHP 8.2+
- Composer 2.x
- SQLite (dev) o MySQL / PostgreSQL (producción)

## Instalación

```bash
cd "ORIENTADOR UNES BACKEND"
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite   # si usas SQLite
php artisan migrate
php artisan serve                # http://localhost:8000
```

## Variables clave del `.env`

| Variable | Descripción |
|----------|-------------|
| `APP_KEY` | Auto-generada. Cifra la API key del bot en BD. **Nunca la pierdas.** |
| `ADMIN_PIN` | PIN para acceder al panel admin. Cámbialo antes de producción. |
| `FRONTEND_URL` | Origen del frontend React (para CORS + Sanctum). |
| `BOT_PROVIDER` | `openai` (default), `grok`, etc. |
| `BOT_MODEL` | Modelo por defecto. Se puede sobreescribir desde el panel. |

## Endpoints

### Autenticación (sin contraseña)

| Método | Ruta | Body | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/auth/register` | `nombre, apellidos, email, telefono` | Crea cuenta nueva |
| `POST` | `/api/auth/login`    | `email` | Login por email (usuario existente) |
| `GET`  | `/api/auth/me`       | — | Datos del usuario logueado (Sanctum) |
| `POST` | `/api/auth/logout`   | — | Revoca token |

Devuelve `{ ok, token, user }`. Envía luego `Authorization: Bearer <token>`.

### Chat con Aquila

| Método | Ruta | Body | Descripción |
|--------|------|------|-------------|
| `POST` | `/api/chat` | `messages: [{role, content}, …]` | Proxy seguro al proveedor de IA |

La API key del bot **nunca** se expone al frontend.

### Panel admin

| Método | Ruta | Body / Auth | Descripción |
|--------|------|-------------|-------------|
| `POST` | `/api/admin/login` | `pin` | Devuelve `admin_session` (cookie + JSON) |
| `POST` | `/api/admin/logout` | — | Invalida sesión |
| `GET`  | `/api/admin/bot-config` | admin.session | Devuelve config (API key **enmascarada**) |
| `PUT`  | `/api/admin/bot-config` | admin.session + `{api_key?, model?, system_prompt?, …}` | Actualiza config |
| `POST` | `/api/admin/bot-config/test` | admin.session | Prueba la conexión al proveedor |

## Modelo de seguridad

1. **API key cifrada en BD** — `Crypt::encryptString()` (AES-256-CBC).
2. **La key nunca sale del backend.** Todas las llamadas al proveedor pasan por `BotAiService`.
3. **En respuestas GET la key va enmascarada**: `sk-****...abcd`.
4. **Auth sin contraseña ≠ pública.** El email es identificador; los tokens Sanctum son la
   credencial real y son revocables. Rate-limit agresivo en `/auth/*`.
5. **Panel admin protegido por PIN + sesión efímera** (token aleatorio en cache, TTL 1h).
6. **CORS** restringido a `FRONTEND_URL`.
7. **HTTPS obligatorio en producción** (poner `SESSION_SECURE_COOKIE=true` y
   `secure: true` en la cookie de admin_session).

## Estructura

```
ORIENTADOR UNES BACKEND/
├── app/
│   ├── Http/
│   │   ├── Controllers/    AuthController, AdminController, ChatController
│   │   └── Middleware/     AdminSession
│   ├── Models/             User, BotConfig, ChatLog
│   └── Services/           BotAiService
├── config/                 bot.php, cors.php
├── database/migrations/    users, bot_configs, chat_logs
├── routes/api.php
├── bootstrap/app.php
├── composer.json
└── .env.example
```

## Notas para mejorar en el futuro

- Añadir **OTP por email** en el login para reforzar la auth sin contraseña.
- Rotar API key desde el panel con historial (versiones).
- Cifrar también el `system_prompt` si contiene datos sensibles.
- Añadir 2FA al panel admin (TOTP).
