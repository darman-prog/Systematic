---
status: vigente
last_reviewed: 2026-10-05
confidence: confirmado
source: código (core/estudio/progreso.js, core/nube/snapshot.js, app.js, scripts/validador.mjs)
---

# Datos y persistencia

Dónde se guarda el progreso, con qué claves y con qué schema se define el contenido. Leelo al
tocar progreso, export/import, migraciones o el contenido de una materia.

## Persistencia local

No hay backend propio: todo vive en `localStorage` (con un respaldo opcional en la nube, ADR 008).
Las claves se definen en `src/core/estudio/progreso.js` (`claves(materiaId)`) y en `src/app.js`.

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
| `sys.casos-diagrama` | Mejor rating y cantidad de jugadas por caso de diagramación |
| `sys.competencia.<lenguajeId>` | Competencia por lenguaje (spec 011): `{ <etapaId>: { aprobado, version, ultimoPct, intentos } }` |

Si `localStorage` está bloqueado o lleno, la app degrada sin persistir.

## Respaldo en la nube (opcional, ADR 008)

Con una cuenta de Firebase, el estado completo se respalda a mano en `estudiantes/{uid}` como
texto JSON (campos `datos`, `version` y `actualizadoEn`), con tope de 900 kB. El snapshot
(`nube-1`, `src/core/nube/snapshot.js`) agrupa globales, materias y lenguajes; se valida con
`validarSnapshot` antes de aplicarlo. `localStorage` no se reemplaza: restaurar pisa el estado
local con confirmación previa y recarga la app.

## Migración y export/import

- Migración one-time de la app anterior: `quizBD2.*` a `sys.*.bd2`, con flag `sys.migracion.v1`.
  No borra las claves viejas (si algo falla, el progreso original sigue ahí).
- Export v2: `{ app, version: 2, materia, exportado, progreso, historial, actividad, meta }`.
- Import: acepta v1 (`quiz-bd2`) y v2; avisa si el archivo es de otra materia.

## Schema de contenido

El contenido vive en `src/datos/materias/<materia>/` (y `src/datos/lenguajes/<lenguaje>/`) y lo valida `npm run validar`
(`scripts/validador.mjs`). Campos por tipo de pregunta:

- Comunes: `id`, `parcial`, `tema`, `dificultad` (`facil` | `media` | `dificil`), `tipo`, `q`, `exp`, `ref`.
- Opcionales: `real` (booleano), `caso`, `diagrama`, `datos`.
- `multiple`, `vf` y `codigo`: `options[]` más `correct`.
- `multi`: `options[]` más `correctos[]`.
- `dragdrop`: `piezas[]` más `respuestas[]`; `codigo` con marcadores `{1}`, `{2}`, etc.
- `ordenar`: `bloques[]`.
- `relacionar`: `pares` como `[izquierda, derecha]`.
- `desarrollo`: `solucion` más `claves[]` opcional.
- `diagrama`: construcción en lienzo con `subtipo` (`er` | `uml-clases` | `casos-uso` |
  `actividades`), `nodosPool`, `relacionesEsperadas` (`[{ de, a, tipo, guarda? }]`) y
  `miembrosPool`; `tiposArista` y `nodosFijos` son opcionales. Los `nodosFijos` no deben
  repetirse en `nodosPool` (se verían duplicados en el pool) y los `miembrosPool` deben tener
  `texto` único dentro de la pregunta. El `tipo` debe existir entre los tipos que ofrece el
  lienzo para ese subtipo (el validador lo verifica, comparando sin acentos).

Otras estructuras: `glosario` (`{ categorias, terminos, tips }`), `apuntes`
(`{ id, tema, titulo, contenido, fuente }`), `escenarios`
(`{ id, titulo, tema, intro, pasos, finales }`) y `casos`
(`{ id, titulo, tema, caso, diagrama, finales }`, con `diagrama` del schema anterior en
versión standalone sin `id`).

## Convenciones de ids

- BD2 conserva `P1-*` y `PR-*`.
- Materias nuevas: `ISW-*`, `ASW-*` e `INF-*`; apuntes `AP-ISW-*`, `AP-ASW-*` y `AP-INF-*`.
- Formato validado: `PREFIJO-NNN` (prefijo alfanumérico en mayúsculas, 2 o más dígitos).

## Presentación por materia

Colores de tema y palabras clave (resaltado SQL) son datos: `src/datos/materias/bd2/presentacion.js`
(`topicColors`, `sqlKeywords`). La UI los consume de la materia activa (ADR 003).
