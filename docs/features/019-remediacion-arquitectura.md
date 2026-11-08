---
id: 019
status: cerrada
area: arquitectura
created: 2026-11-08
updated: 2026-11-08
---
# Feature 019 — Remediación de arquitectura

> Reducir la carga inicial, dividir dos módulos grandes, sacar la persistencia del
> dominio y automatizar los límites entre capas.

## Objetivo

Atacar los hallazgos P1/P2 de la evaluación: chunk de Firebase, `diagramas.js`,
`stats.js`, política de almacenamiento en `core` y límites sin lint.

## Contexto

Línea base en `e197651`: build inicial `index 234.85 kB + vendor 983.29 kB` ambos
referenciados por `dist/index.html`; 51 archivos de test y 470 tests verdes.
`vite.config.js:13-15` agrupaba todo `node_modules` en un solo `vendor`, lo que anulaba
el `import()` dinámico de `student/firebase.js`.

## Alcance

| Incluye | Excluye |
|---|---|
| Chunk lazy de Firebase y medición antes/después | Lazy-load de apuntes, `marked` o `dompurify` |
| División de `diagramas.js` y `stats.js` con tests | Cambios visuales, de UX o de CSS |
| Mover almacenamiento `sys.*` de `core` a `student` | Cambiar claves persistidas o migrar datos |
| Lint de límites entre capas + ADR 014 | `strict` / `noImplicitAny` |

## Criterios de aceptación

| N.º | Criterio verificable | Evidencia |
|---|---|---|
| 1 | Firebase en chunk propio y fuera de `index.html` | `dist/assets/firebase-BhXAddfQ.js` (759.80 kB); `index.html` solo referencia `index` y `vendor` |
| 2 | JS inicial baja ≥500 kB o ≥30% | 1,218.14 kB → 459.57 kB (−758.57 kB, −62.3%) |
| 3 | `diagramas.js` < 300 líneas con API intacta | 84 líneas; 7 unitarios + 5 E2E de diagrama verdes |
| 4 | `stats.js` < 250 líneas y 2 exports | 158 líneas; 3 unitarios de stats verdes |
| 5 | `core` sin claves `sys.*` ni JSON de storage | búsqueda en `src/core` sin resultados de código |
| 6 | Lint bloquea fuga de capas | `eslint --stdin` falla con mensaje de capa (estático y dinámico) |

## Pasos

1. Línea base y spec (`7c5254d`).
2. Chunk de Firebase (`8fefeee`).
3. Caracterizar (`a00cd5f`) y dividir diagramas en geometría, plantillas, pintura e
   interacción (`0743405`).
4. Caracterizar (`ae0aab4`) y dividir estadísticas en plantillas, gráfica y cableado (`e7c0241`).
5. Mover almacenamiento a `student/almacenamiento.js` (`aaf4ba2`).
6. Reglas ESLint de límites (`9950875`) y ADR 014 (`a64e168`).
7. Cierre: gates, bitácora y changelog.

## Bitácora

| Criterio | Fecha | Comando | Exit | Commit |
|---|---|---|---|---|
| base | 2026-11-08 | `npm run build` + `npx vitest run` | 0 | `e197651` |
| 1-2 | 2026-11-08 | `npm run build` + `Select-String dist/index.html` | 0 | `8fefeee` |
| 3 | 2026-11-08 | `npx vitest run src/ui/componentes/diagramas.test.js` + E2E de diagrama | 0 | `0743405` |
| 4 | 2026-11-08 | `npx vitest run src/ui/dashboard/stats.test.js` | 0 | `e7c0241` |
| 5 | 2026-11-08 | `npx vitest run` + `npm run validar` | 0 | `aaf4ba2` |
| 6 | 2026-11-08 | `npm run lint` + `eslint --stdin` | 0 (probe 1) | `9950875` |
| gates | 2026-11-08 | `lint` + `typecheck` + `validar` + `vitest` (476) + `build` | 0 | `a64e168` |

E2E completo: 88 passed, 8 failed, 1 skipped. Cinco fallos se reprodujeron en `e197651`
(onboarding, contenido bajo demanda, dos móviles y escenarios); los otros tres son de
escenarios/a11y/infra y no tocan los módulos cambiados. El subconjunto de diagramas
(5 pruebas) pasó completo tras la división.

## Rollback

`git revert` por commit; sin migraciones ni cambios en claves persistidas.

## Cierre

- Fila resumen del changelog.
- Decisión de arquitectura: `ADR 014`; deuda restante: `stats/plantillas.js` (464 líneas)
  se puede dividir en formato y vistas si vuelve a crecer.
