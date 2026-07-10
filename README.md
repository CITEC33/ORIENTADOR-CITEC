# ORIENTADOR UNES

Aplicacion de orientacion vocacional para Universidad Espana Durango.

## Contenido

- `ORIENTADOR UNES/`: aplicacion principal web/mobile con React, Vite y Capacitor.
- `ORIENTADOR UNES BACKEND/`: backend Laravel con API, autenticacion, panel admin, RAG y configuracion del bot.

## Deploy frontend

Desde la raiz del repositorio:

```bash
npm run build
```

El comando compila `ORIENTADOR UNES/` y deja el resultado en `dist/` para plataformas que importan desde la raiz del repo.

## Commit a ambos repos

Para guardar y subir cambios a Cacos y CITEC al mismo tiempo:

```bash
npm run commit:both -- "Mensaje del commit"
```

El comando hace `git add -A`, crea el commit en `main` si hay cambios y empuja a `origin` (`Cacosbit99/ORIENTADOR-UNES`) y `citec` (`CITEC33/ORIENTADOR-CITEC`).

## Notas

- El flujo principal conserva las funciones de orientacion vocacional: inicio, chat, carreras UNES, vida UNES y mi orientacion.
- El chat usa el backend Laravel mediante `VITE_API_URL`.
- No se versionan `node_modules`, caches de Gradle, builds generados ni archivos `.env`.
