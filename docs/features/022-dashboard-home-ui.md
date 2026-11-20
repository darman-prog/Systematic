---
id: 022
status: cerrada
area: ui
tarea: -
created: 2026-11-19
updated: 2026-11-19
---
# Feature 022 — Dashboard principal: resumen real y pulido

> El home replica los elementos nuevos del prototipo `Systematic — Dashboard mejorado`: saludo con nombre, continuidad con pregunta, tres KPI y CTA por card, conservando búsqueda y filtros.

## Objetivo

Que el home abra con el track donde quedó el estudiante, su próximo paso y tres señales reales
(materias, precisión y racha), sin métricas inventadas ni romper la navegación existente.

## Contexto

La feature 016 dejó el catálogo real con búsqueda, filtros y progreso por track. El prototipo
`docs/PrototiposDiseños/Systematic — Dashboard mejorado.html` agrega una tarjeta de continuidad
con “Pregunta N de total”, tres KPI laterales y CTAs por card. El prototipo no incluye la
búsqueda ni los filtros actuales: se conservan para no perder funcionalidad.

## Alcance

| Incluye | Excluye |
|---|---|
| Saludo grande con nombre y resumen del prototipo | Mover la búsqueda al header o eliminar filtros |
| Continuidad con pregunta/próximo paso, barra y CTA | Cambiar la pantalla de cada track o sus modos |
| KPI: materias/489, precisión con tendencia, racha y repaso | Nuevos bancos, materias o métricas ficticias |
| CTA “Continuar/Empezar” y pie de card | Cambios de esquema o de claves `sys.*` |

## Criterios de aceptación

| N.º | Criterio verificable | Comando | Evidencia |
|---|---|---|---|
| 1 | Resumen: continuidad, materias, precisión, tendencia, racha y repaso | `npx vitest run src/student/resumen.test.js` | 9 tests |
| 2 | Home: saludo, tarjeta, tres KPI y CTA de materia/lenguaje | `npx vitest run src/ui/dashboard/home.test.js` | 9 tests |
| 3 | Flujos del home con datos sembrados y búsqueda vacía | `npx playwright test e2e/home-dashboard.spec.js` | 5/5 |
| 4 | axe del home sin violaciones | `npx playwright test e2e/auditoria-a11y.spec.js -g "axe: materias"` | 1/1 |
| 5 | Responsive 360/390/768/1280/1440 sin overflow | `npx playwright test e2e/home-dashboard.spec.js` | 0 overflow |
| 6 | Gates completos | `npm run lint && npm run typecheck && npx vitest run && npm run build` | exit 0 |

## Runner

| Campo | Valor |
|---|---|
| estado | cerrada |
| dueño | build |
| paso | 6/6 |
| siguiente | - |
| bloqueado_por | - |
| ultimo_handoff | - |

## Pasos

0. Persistir spec 022 e índice (`docs`).
1. Servicio `student/resumen.js` + tests (`feat`).
2. Resumen, saludo, KPI y wiring en el home (`feat`).
3. CTAs y pie de cards del prototipo (`style`).
4. Búsqueda, filtros y vacío accionable (`feat`).
5. DESIGN.md, project-brain, changelog y cierre (`docs`).

## Bitácora

| Criterio | Fecha | Comando | Exit | Commit |
|---|---|---|---|---|
| 1 | 2026-11-19 | `npx vitest run src/student/resumen.test.js` (9) | 0 | `0de3cf5` |
| 2 | 2026-11-19 | `npx vitest run src/ui/dashboard/home.test.js` (10) | 0 | `0de3cf5` |
| 3 y 5 | 2026-11-19 | `npx playwright test e2e/home-dashboard.spec.js` (5) | 0 | `0de3cf5` |
| 4 | 2026-11-19 | `npm run e2e` · axe `materias` (1/1) | 0 | `0de3cf5` |
| 6 | 2026-11-19 | `lint` + `typecheck` + 514 unitarios + `build` + 105 E2E | 0 | `01c96ef` |

## Rollback

`git revert <commit>` por paso; no hay migraciones ni cambios de datos.

## Cierre

- Fila resumen del changelog.
- El saludo usa el primer nombre y se completa con el `displayName` de la cuenta si el navegador no tenía nombre (`3f2ed3b`).
- Decisión de arquitectura: no aplica; `student/resumen.js` sigue ADR 004/007.
