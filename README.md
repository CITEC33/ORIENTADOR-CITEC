# ORIENTADOR UNES

Aplicacion de orientacion vocacional para Universidad Espana Durango.

## Contenido

- `orientador-unes/`: aplicacion principal web/mobile con React, Vite y Capacitor.
- `unes-orienta-backend/`: backend Laravel con API, autenticacion, panel admin, RAG y configuracion del bot.

## Notas

- El flujo principal conserva las funciones de orientacion vocacional: inicio, chat, carreras UNES, vida UNES y mi orientacion.
- El chat usa el backend Laravel mediante `VITE_API_URL`.
- No se versionan `node_modules`, caches de Gradle, builds generados ni archivos `.env`.
