---
id: 021
status: cerrada
area: contenido
created: 2026-11-08
updated: 2026-11-08
---
# Feature 021 — Apuntes explícitos con diagramas (ola 1)

> Infraestructura de diagramas y lector, más apuntes de POO, arquitecturas, casos de uso y BD2.

## Objetivo

Que los apuntes de las áreas núcleo sean explícitos (qué, para qué, cómo, ejemplo, ventajas,
desventajas y errores) y incluyan diagramas cuando aportan; que la pantalla permita leerlos
sin cargar todos los diagramas a la vez.

## Contexto

`apuntes.js` guardaba resúmenes y la lista renderizaba todo el contenido. No había Mermaid
ni lector con TOC. BD2 tenía 0 apuntes por decisión de spec 010/018. La ola 1 cubre solo las
áreas pedidas: POO, arquitecturas, casos de uso y bases de datos relacionales.

## Alcance

| Incluye | Excluye |
|---|---|
| Lector con TOC y render Mermaid lazy | Rediseño visual completo de apuntes |
| ASW-01/02/08/09/10/11/12 con diagramas | SOLID, patrones, Scrum, INFRA y demás apuntes |
| ISW-07 con casos de uso y actividades | Otros apuntes de ISW |
| BD2-01–07 nuevos con ER/flujo | Preguntas nuevas o cambios de glosario |
| ADR 015 y tests de render/lector | Migración de contenido a archivos `.md` |

## Criterios de aceptación

| N.º | Criterio verificable | Evidencia |
|---|---|---|
| 1 | Mermaid se carga lazy y no está en el inicial | build con chunk `mermaid.core-*.js` fuera de `index.html` |
| 2 | Lector: lista → detalle → volver, con TOC y foco | test de `apuntes.test.js` + E2E |
| 3 | ASW 01/02/08–12 explícitos y con diagrama | 7 apuntes revisados; E2E de POO |
| 4 | ISW-07 con casos de uso y actividades | E2E de casos de uso |
| 5 | BD2 01–07 con diagramas | E2E de ER; `revision` sin avisos |
| 6 | Gates verdes | `lint`, `typecheck`, `validar`, `vitest`, `build`, E2E de apuntes |

## Pasos

1. Infra: Mermaid + lector + estilos + tests.
2. Piloto: ASW-01, ISW-07, BD2-05.
3. Ola ASW: 02, 08, 09, 10, 11, 12.
4. Ola BD2: 01, 02, 03, 04, 06, 07.
5. Cierre: ADR 015, spec, gates y changelog.

## Bitácora

| Criterio | Fecha | Comando | Exit | Commit |
|---|---|---|---|---|
| 1-2 | 2026-11-08 | `build` + `vitest` de apuntes/mermaid | 0 | `f0bbb31` |
| 3-4 | 2026-11-08 | E2E `apuntes:` (4 pruebas; 15 diagramas) | 0 | `ca0d13b` |
| 5 | 2026-11-08 | `validar` (789) + `revision` (ASW/ISW/BD2 sin avisos) | 0 | `e01e7d8` |
| 6 | 2026-11-08 | `lint` + `typecheck` + 482 unitarios + `build` + axe `apunte` | 0 | `2f72538` |

## Rollback

`git revert` por bloque; el contenido nuevo es aislado y no hay migraciones de datos.

## Cierre

- Fila resumen del changelog.
- Decisión de arquitectura: `ADR 015`.
