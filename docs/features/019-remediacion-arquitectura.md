---
id: 019
status: activa
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

Línea base (commit `e197651`): build inicial `index 234.85 kB + vendor 983.29 kB`
(ambos referenciados por `dist/index.html`); 51 archivos de test y 470 tests verdes.
`vite.config.js:13-15` agrupa todo `node_modules` en un solo `vendor`, lo que anula
el `import()` dinámico de `student/firebase.js:39-46`.

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
| 1 | Firebase va en chunk propio y no se precarga | `dist/assets/firebase-*.js`; `dist/index.html` sin referencia |
| 2 | JS inicial baja ≥500 kB o ≥30% | suma de chunks de `index.html` antes/después |
| 3 | `diagramas.js` < 300 líneas con API intacta | conteo + tests + E2E de diagrama/casos |
| 4 | `stats.js` < 250 líneas y 2 exports | conteo + tests + E2E de dashboard |
| 5 | `core` sin claves `sys.*` ni JSON de storage | búsqueda en `src/core` sin resultados |
| 6 | Lint bloquea una fuga de capas | `eslint --stdin` falla con mensaje de capa |

## Pasos

1. Línea base y spec.
2. Chunk de Firebase.
3. Caracterizar `diagramas.js`; 4-6. extraer geometría/estado, render e interacción.
7. Caracterizar `stats.js`; 8-10. extraer plantillas, gráfica e historial.
11. Mover almacenamiento a `student/almacenamiento.js`.
12. Reglas ESLint de límites; 13. ADR 014 y docs.
14. Cierre: gates, bitácora y changelog.

## Bitácora

| Criterio | Fecha | Comando | Exit | Commit |
|---|---|---|---|---|
| base | 2026-11-08 | `npm run build` + `npx vitest run` | 0 | `e197651` |

## Rollback

`git revert` por commit; sin migraciones ni cambios en claves persistidas.

## Cierre

- Fila resumen del changelog.
- Decisión de arquitectura: `ADR 014`.
