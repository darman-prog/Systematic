---
id: 002
status: implementada
created: 2026-09-19
updated: 2026-09-20
---

# 002 — Refactor de `src/app.js`: extracción de renderers y eliminación de acoplamiento por `window`

Spec de la revisión de arquitectura del 2026-09-19. Para qué sirve: guía la refactorización de
`src/app.js` (1.842 líneas) en módulos por pantalla, elimina el acoplamiento template↔módulo vía
globales de `window` y saca contenido de BD2 de la capa de UI. Leerla antes de tocar `app.js`,
`index.html` o los selectores del e2e. Decisiones estructurales registradas en
[ADR 001](../adr/001-arquitectura-capas.md), [ADR 002](../adr/002-eliminacion-window-globales.md)
y [ADR 003](../adr/003-contenido-desacoplado-de-ui.md).

## Objetivo y alcance

Reducir `src/app.js` a orquestación (estado compartido, navegación, persistencia por materia y
registro de acciones) extrayendo el render de cada pantalla a `src/ui/<pantalla>.js`, reemplazando
los `onclick` inline y las ~61 funciones en `window` por listeners delegados con `data-action`,
y moviendo el contenido específico de BD2 (`TOPIC_COLORS`, `SQL_KEYWORDS`, default `"bd2"` en la
migración) fuera de la capa de UI/core. Refactor que preserva comportamiento: cero cambios visuales
ni funcionales.

## No-objetivos

- Migrar a framework, routing SPA o TypeScript.
- Lazy-loading por materia (`import()` dinámico): diferido hasta que el bundle sea problema real.
- Nuevas features, cambios de contenido de materias ni rediseño visual.
- Consolidar todo el acceso a `localStorage` en un repositorio único (las primitivas ya viven en
  `core/progreso.js`; la migración completa es deuda menor aceptada).

## Pasos (un commit cada uno, Conventional Commits)

1. **`refactor: extraer renderers por pantalla desde app.js`** — crear `src/ui/quiz.js`,
   `resultados.js`, `estudio.js`, `flashcards.js`, `glosario.js`, `stats.js` y mover el render
   correspondiente (quiz 8 tipos: app.js:428-1060; resultados :1062-1203; historial/stats
   :1350-1397; estudio :1507-1609; glosario :1621-1666; flashcards :1668-1741; home :1399).
   Contrato de cada módulo: exporta funciones puras de render que reciben estado explícito
   (materia, sesión, progreso) y devuelven HTML string o manipulan contenedores pasados por
   parámetro; ningún módulo de `src/ui/` lee estado global ni `localStorage`.
2. **`refactor: reemplazar onclick inline por delegación de eventos`** — quitar ~40 atributos
   `onclick` de `index.html` y `Object.assign(window, {...})` (app.js:1780-1842); usar
   `data-action` en los elementos y un único listener delegado en `app.js` con un mapa
   `{ acción: fn }`. Sin funciones globales en `window`.
3. **`refactor: mover contenido de BD2 fuera de la UI y del core`** — `TOPIC_COLORS` (app.js:15-23)
   y `SQL_KEYWORDS` (app.js:56) pasan a los datos por materia (campo exportado por
   `src/datos/<materia>/` o entrada de `MATERIAS` en `core/materias.js`); `migrarClavesLegacy`
   (`core/progreso.js:25`) recibe el id de materia por parámetro, sin default `"bd2"`.
4. **`test: desacoplar e2e de cifras de contenido`** — `e2e/smoke.spec.js` deja de hardcodear
   "87"/"35"/"30" y `#stat-total`; aserciones por estructura (elementos presentes, contadores
   calculados contra los datos importados o patrón numérico).
5. **`docs: actualizar AGENTS.md y cerrar spec`** — reflejar la nueva estructura de `src/ui/`,
   marcar esta spec como `implementada`.

## Criterios de aceptación

1. `src/app.js` queda por debajo de ~400 líneas, sin render de pantallas ni funciones en `window`.
2. `index.html` sin atributos `onclick`; cero referencias a funciones globales vía `window`.
3. `grep TOPIC_COLORS\|SQL_KEYWORDS` en `src/app.js` vacío; `src/core/` sin ids de materia.
4. Comportamiento idéntico: flujo quiz completo, resultados, estudio, flashcards, glosario y
   apuntes funcionan igual en `npm run preview`.
5. `npm run test`, `npm run validar` y `npm run build` verdes; `npm run e2e` verde sin cifras
   hardcodeadas.
6. La migración legacy (`quizBD2.*` → `sys.*.bd2`) sigue funcionando (e2e existente la cubre).

## Riesgos y mitigaciones

- **Regresión visual silenciosa al mover render**: migrar pantalla por pantalla ejecutando e2e
  tras cada extracción; sin retoques de estilo durante el movimiento.
- **Delegación de eventos rompe foco/teclado**: el listener de `keydown` (app.js:1743) y los
  listeners puntuales del quiz (app.js:814-830, :1018) se conservan tal cual; la delegación solo
  sustituye `onclick` declarativo.
- **`Object.assign(window)` eliminado rompe referencias no detectadas**: grep previo de cada
  nombre exportado en `index.html` y `src/` antes de borrar el puente.
- **Migración con firma nueva**: mantener comportamiento idéntico para datos existentes; el e2e
  de migración (smoke.spec.js) es la red.

## Evidencia

- `src/app.js:1.842 líneas`; puente a globales `app.js:1780-1842` (~61 funciones);
  `onclick` inline ~40 en `index.html` (p. ej. :24, :41, :118).
- Contenido BD2 en UI: `TOPIC_COLORS` app.js:15-23 (fallback azul app.js:1302/:1581),
  `SQL_KEYWORDS` app.js:56.
- Default de materia en core: `core/progreso.js:25`.
- E2E acoplado a cifras: `e2e/smoke.spec.js:10-15`, `:25`.
- `src/core/` sin DOM ni `localStorage` directo (grep vacío) — límite que se preserva.

## Desviación conocida

El criterio de aceptación 1 (`src/app.js` por debajo de ~400 líneas) no se cumplió al cierre: el
archivo quedó por encima de las 1.000 líneas y sigue concentrando persistencia, gamificación,
filtros, sesión y navegación. El resto de los criterios sí se cumple. La deuda se resuelve con el
refactor a la capa `student/` (spec 004, pendiente).
