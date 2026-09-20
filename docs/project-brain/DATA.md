---
status: vigente
last_reviewed: 2026-09-20
confidence: confirmado
source: código (core/progreso.js, app.js, scripts/validador.mjs)
---

# Datos y persistencia

Dónde se guarda el progreso, con qué claves y con qué schema se define el contenido. Leelo al
tocar progreso, export/import, migraciones o el contenido de una materia.

## Persistencia local

No hay backend: todo vive en `localStorage`. Las claves se definen en `src/core/progreso.js`
(`claves(materiaId)`) y en `src/app.js`.

| Clave | Contenido |
|---|---|
| `sys.progreso.<materiaId>` | Estado por pregunta: `{ ok, fail, box, last, lastOk, marked }` |
| `sys.historial.<materiaId>` | Últimos intentos: `{ date, score, total, modo }` |
| `sys.actividad.<materiaId>` | Respuestas por día (`YYYY-MM-DD`) |
| `sys.meta.<materiaId>` | Meta diaria de preguntas |
| `sys.xp` | XP total acumulado |
| `sys.xp-eventos` | Recompensas únicas ya otorgadas (por ejemplo, meta del día) |
| `sys.logros` | Logros desbloqueados y su fecha |
| `sys.misiones.<materiaId>` | Estrellas y mejor porcentaje por tema |
| `sys.escenarios` | Mejor rating y cantidad de jugadas por escenario |

Si `localStorage` está bloqueado o lleno, la app degrada sin persistir.

## Migración y export/import

- Migración one-time de la app anterior: `quizBD2.*` a `sys.*.bd2`, con flag `sys.migracion.v1`.
  No borra las claves viejas (si algo falla, el progreso original sigue ahí).
- Export v2: `{ app, version: 2, materia, exportado, progreso, historial, actividad, meta }`.
- Import: acepta v1 (`quiz-bd2`) y v2; avisa si el archivo es de otra materia.

## Schema de contenido

El contenido vive en `src/datos/<materia>/` y lo valida `npm run validar`
(`scripts/validador.mjs`). Campos por tipo de pregunta:

- Comunes: `id`, `parcial`, `tema`, `dificultad` (`facil` | `media` | `dificil`), `tipo`, `q`, `exp`, `ref`.
- Opcionales: `real` (booleano), `caso`, `diagrama`, `datos`.
- `multiple`, `vf` y `codigo`: `options[]` más `correct`.
- `multi`: `options[]` más `correctos[]`.
- `dragdrop`: `piezas[]` más `respuestas[]`; `codigo` con marcadores `{1}`, `{2}`, etc.
- `ordenar`: `bloques[]`.
- `relacionar`: `pares` como `[izquierda, derecha]`.
- `desarrollo`: `solucion` más `claves[]` opcional.

Otras estructuras: `glosario` (`{ categorias, terminos, tips }`), `apuntes`
(`{ id, tema, titulo, contenido, fuente }`) y `escenarios`
(`{ id, titulo, tema, intro, pasos, finales }`).

## Convenciones de ids

- BD2 conserva `P1-*` y `PR-*`.
- Materias nuevas: `ISW-*` y `ASW-*`; apuntes `AP-ISW-*` y `AP-ASW-*`.
- Formato validado: `PREFIJO-NNN` (prefijo alfanumérico en mayúsculas, 2 o más dígitos).

## Presentación por materia

Colores de tema y palabras clave (resaltado SQL) son datos: `src/datos/bd2/presentacion.js`
(`topicColors`, `sqlKeywords`). La UI los consume de la materia activa (ADR 003).
