---
id: 013
status: en-curso
created: 2026-10-20
updated: 2026-10-20
---
# Feature 013 — Desacople de app.js y refuerzo de límites de capas

> `app.js` deja de ser un god object y las reglas de negocio vuelven a `core`/`student`,
> sin cambiar comportamiento, datos persistidos ni UI.

## Objetivo

Que `app.js` sea un composition root de ≤250 líneas y que evaluación, misiones,
estadísticas, selección de rondas y carga de contenido vivan en la capa que les
corresponde. El usuario debe notar exactamente el mismo comportamiento.

## Contexto

`app.js` tiene ~899 líneas, ~40 funciones y `crearAcciones` recibe ~60 dependencias. Las
reglas de evaluación, desbloqueo de misiones, cálculo de stats y selección de modos viven en
UI/orquestación; `core/registro/materias.js` importa datos y ejecuta `import()` dinámico.
Ver [ADR 010](../adr/010-app-js-composition-root.md) y
[ADR 011](../adr/011-limites-capas-y-contenido.md).

## Alcance

| Incluye | Excluye |
|---|---|
| Desacople de `app.js` por controladores y servicios | Cambios visuales, HTML o estilos |
| Evaluación en `core/estudio/evaluacion.js` | Contenido, datos o claves `sys.*` |
| Gate de misiones en `core/juego/misiones.js` | Snapshot `nube-1` o Firebase |
| Stats en `student/estadisticas.js` | Mezclador muerto (solo se quita su wiring) |
| Rondas en `student/rondas.js` | TypeScript, lint de boundaries o CI |
| Carga de contenido en `student/contenido.js` | Reemplazo de `alert`/`confirm` nativos |

## Criterios de aceptación

| N.º | Criterio verificable | Evidencia |
|---|---|---|
| 1 | `app.js` ≤250 líneas y sin funciones de feature | `(Get-Content src/app.js).Count`; `grep "^function "` |
| 2 | `src/ui` no evalúa respuestas ni desbloquea misiones | `grep` de `item.correct`, `item.respuestas`, `item.bloques`, `estadoMisiones` |
| 3 | `core` producción no importa `datos/` | `grep -R "datos/" src/core --include=*.js` solo tests |
| 4 | Acciones sin duplicados y completas frente a `index.html` | `orquestacion/acciones.test.js` |
| 5 | `npx vitest run` verde con las suites nuevas | salida del comando |
| 6 | `npm run validar` verde | salida del comando |
| 7 | `npm run build` verde y chunks por track | salida de build |
| 8 | `npm run e2e` verde | salida de Playwright |

## Pasos

Cada paso es un commit independiente; la validación se ejecuta al cerrarlo.

1. Documentar la feature y los ADR 010/011.
2. Extraer `student/avance.js`; el coordinador de respuesta queda como función de
   composición hasta el paso 14.
3. Extraer `student/exportacion.js` y `orquestacion/ajustes.js`.
4. Extraer `student/rondas.js` y adelgazar `orquestacion/ronda.js`.
5. Extraer `orquestacion/misiones.js` y `core/juego/misiones.js`.
6. Extraer `orquestacion/escenarios.js`.
7. Extraer `orquestacion/casos.js`.
8. Extraer `orquestacion/lenguaje.js`.
9. Mover carga y presentación a `student/contenido.js`.
10. Mover cálculo de stats a `student/estadisticas.js`.
11. Extraer `orquestacion/dashboard.js` y la portada.
12. Extraer `orquestacion/acceso.js` y `arranque.js`.
13. Mover evaluación a `core/estudio/evaluacion.js`.
14. Dividir acciones, extraer atajos y dejar `app.js` como composition root.
15. Actualizar arquitectura, testing y changelog.

## Cierre

- Fila resumen en `CHANGELOG.md`.
- Decisión de arquitectura: [ADR 010](../adr/010-app-js-composition-root.md) y
  [ADR 011](../adr/011-limites-capas-y-contenido.md).
- Evidencia por criterio en esta spec; `calidad-cierre` la verifica antes de marcar `cerrada`.
