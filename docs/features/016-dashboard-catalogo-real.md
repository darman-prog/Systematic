---
id: 016
status: cerrada
created: 2026-10-20
updated: 2026-10-20
---
# Feature 016 — Dashboard con catálogo real

> El home pasa a un dashboard wide con las 4 materias y 3 lenguajes reales, búsqueda/filtros,
> cards accionables y progreso derivado de la persistencia.

## Objetivo
Reemplazar el catálogo actual por el diseño aprobado, sin contenido inventado, y con una sola
estructura de card/búsqueda/filtros para materias y lenguajes.

## Contexto
El prototipo `docs/PrototiposDiseños/stitch_systematic_acceso_ribbon_glass_Dashboard` muestra
8 materias y 4 lenguajes; la app tiene 4 materias y 3 lenguajes en
`src/core/registro/materias.js`. El prototipo además inventa niveles, estados y métricas.
La app ya tiene cards accionables en `src/ui/dashboard/home.js` y persistencia por materia/
lenguaje (`src/student/persistencia.js`).

## Alcance
| Incluye | Excluye |
|---|---|
| Shell wide, catálogo real, búsqueda, filtros, progreso/estado real, a11y, tests | Materias/lenguajes nuevos, niveles, sandbox, favoritos, páginas legales |

## Criterios de aceptación
| N.º | Criterio verificable | Evidencia |
|---|---|---|
| 1 | Exactamente 4 materias y 3 lenguajes reales | `home.test.js` (4/3) + E2E onboarding (6/6) |
| 2 | Cards `<button>` con `data-action` y teclado | E2E de selección y unit de home |
| 3 | Búsqueda y filtros `Todas/Materias/Lenguajes/En curso` con `aria-pressed` | unit + E2E + axe (18/18) |
| 4 | Progreso real: respondidas/total y etapas aprobadas; sin 45%/94% hardcodeados | `persistencia` + `barraDeCompetencia`; `home.test.js` |
| 5 | 390/768/1280/1440 sin overflow; 4 columnas de materias y 3 de lenguajes en wide | capturas + Playwright + `.app-dashboard` |
| 6 | Sin CDN, iconos/fuentes/logo propios y tokens `--study-*` | diff + build |
| 7 | Unit, E2E, a11y y build verdes | `rtk vitest run` 419 pass · `onboarding` 6 pass · `auditoria-a11y` 18 pass · `rtk npm run build` OK |

## Pasos
0. Spec + DESIGN.md + índice (`docs`).
1. Shell wide + catálogo real (`feat`).
2. Búsqueda + filtros + vacío (`feat`).
3. Tests + a11y (`test`).
4. QA + cierre (`docs`).

## Riesgos
- El ancho `.app-dashboard` solo aplica a `materias`; probar el resto de pantallas.
- `.materia-card` tiene estilos duplicados en `entrada.css` y `componentes.css`; scope al home.
- El progreso de materia se rotula “respondidas”, no “completadas”.
- Java (`#745e3b`) puede tener poco contraste como icono; usar mezcla con texto/accent.

## Cierre
- Implementado en `feat/dashboard-catalogo-real` sobre `refactor/limites-capas`.
- Fila en `docs/features/INDEX.md` y `DESIGN.md` actualizado.
- Evidencia: unit 419, onboarding 6, a11y 18, build OK y capturas 1440/1280/768/390.
- ADR: no aplica (solo UI; sin cambio de arquitectura).
