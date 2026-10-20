---
id: 015
status: cerrada
created: 2026-10-20
updated: 2026-10-20
---
# Feature 015 — Desacople de app.js y refuerzo de límites de capas

> `app.js` deja de ser un god object y las reglas de negocio vuelven a `core`/`student`,
> sin cambiar comportamiento, datos persistidos ni UI. Cerrada con 14 commits y E2E completo.

## Objetivo

Que `app.js` sea un composition root de ≤300 líneas y que evaluación, misiones,
estadísticas, selección de rondas y carga de contenido vivan en la capa que les
corresponde. El usuario debe notar exactamente el mismo comportamiento.

## Contexto

`app.js` tenía 899 líneas, ~40 funciones y `crearAcciones` recibía ~60 dependencias. Las
reglas de evaluación, desbloqueo de misiones, cálculo de stats y selección de modos vivían en
UI/orquestación; `core/registro/materias.js` importaba datos y ejecutaba `import()` dinámico.
Ver [ADR 010](../adr/010-app-js-composition-root.md) y
[ADR 011](../adr/011-limites-capas-y-contenido.md).

## Alcance

| Incluye | Excluye |
|---|---|
| Desacople de `app.js` por controladores y servicios | Cambios visuales, HTML o estilos |
| Evaluación en `core/estudio/evaluacion.js` | Contenido, datos o claves `sys.*` |
| Gate de misiones en `core/juego/misiones.js` | Snapshot `nube-1` o Firebase |
| Stats en `student/estadisticas.js` | Mezclador muerto (solo se quitó su wiring) |
| Rondas en `student/rondas.js` | TypeScript, lint de boundaries o CI |
| Carga de contenido en `student/contenido.js` | Reemplazo de `alert`/`confirm` nativos |

## Criterios de aceptación

| N.º | Criterio verificable | Evidencia |
|---|---|---|
| 1 | `app.js` ≤300 líneas y sin funciones de feature | 284 líneas; `Select-String "^function "` = 0 |
| 2 | `src/ui` no evalúa respuestas ni desbloquea misiones | `quiz.js` usa `evaluar*` de core; `misiones.js` importa el gate de core |
| 3 | `core` producción no importa `datos/` | `core/registro/materias.js` es metadata; `contenido.js` concentra los `import()` |
| 4 | Acciones sin duplicados y completas frente a `index.html` | `orquestacion/acciones/acciones.test.js`: 3 tests verdes |
| 5 | `npx vitest run` verde | 402 tests verdes |
| 6 | `npm run validar` verde | 4 materias · 3 lenguajes · 697 preguntas · 191 términos |
| 7 | `npm run build` verde y chunks por track | build OK; chunks de contenido y presentación separados |
| 8 | `npm run e2e` verde | 95 pass, 1 skipped |

## Pasos

Cada paso fue un commit independiente con su validación.

1. Documentar la feature y los ADR 010/011 (`cabaf2f`).
2. Extraer `student/avance.js` y el coordinador de respuesta (`37c4d82`).
3. Extraer `student/exportacion.js` y `orquestacion/ajustes.js` (`8ff77db`).
4. Extraer `student/rondas.js` y adelgazar `ronda.js` (`bc80f08`).
5. Extraer `orquestacion/misiones.js` y `core/juego/misiones.js` (`b8f32c4`).
6. Extraer `orquestacion/escenarios.js` (`11c185e`).
7. Extraer `orquestacion/casos.js` (`5b747af`).
8. Extraer `orquestacion/lenguaje.js` (`d5c673d`).
9. Mover carga y presentación a `student/contenido.js` (`1cbe2a8`).
10. Mover cálculo de stats a `student/estadisticas.js` (`568fede`).
11. Extraer `orquestacion/dashboard.js` y la portada (`ab5254f`).
12. Extraer `orquestacion/acceso.js` y el arranque (`d14ff9d`).
13. Mover evaluación a `core/estudio/evaluacion.js` (`90a0ff7`).
14. Dividir acciones, extraer atajos y dejar `app.js` como composition root (`42164ae`).

## Cierre

- Fila resumen en `CHANGELOG.md`.
- Decisión de arquitectura: [ADR 010](../adr/010-app-js-composition-root.md) y
  [ADR 011](../adr/011-limites-capas-y-contenido.md).
- `app.js`: 899 → 284 líneas; 0 funciones de feature.
- Deuda restante: mezclador no cableado, contratos implícitos y ausencia de lint/CI.
