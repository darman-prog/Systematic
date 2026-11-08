---
id: 020
status: cerrada
area: contenido
created: 2026-11-08
updated: 2026-11-08
---
# Feature 020 — Preguntas y apunte de arquitecturas móviles

> Agregar 15 preguntas de decisión y un apunte fiel al PDF 16, sin diagramas ni
> contenido externo, para estudiar arquitecturas móviles en ASW.

## Objetivo

Cubrir el hueco de MVI y arquitecturas móviles con 15 preguntas que obliguen a decidir
bajo restricciones, y un apunte consultable desde la pantalla de apuntes.

## Contexto

El docente agregó `BancoDeInformacion/ArquitecturaDeSoftware/16_-_Arquitecturas_para_Aplicaciones_Moviles.md`
(205 líneas): MVC, MVP, MVVM, MVI, BFF, API Gateway, GraphQL, offline-first, MBaaS,
SDUI, nativo vs multiplataforma y trade-offs. Antes de esta feature ASW tenía 130
preguntas, 51 términos y 11 apuntes; `MVC y variantes` llegaba hasta MVVM y no existía
el tema móvil. El visor de apuntes usa `marked` + `DOMPurify` y no renderiza Mermaid;
los diagramas se dejan para la actualización global de apuntes.

## Alcance

| Incluye | Excluye |
|---|---|
| 15 preguntas (ASW-131–145) con escenario y distractor plausible | Temario maestro o contenido de otros PDFs |
| 5 preguntas en `MVC y variantes` y 10 en el tema nuevo `Arquitecturas móviles` | Glosario nuevo |
| Apunte `AP-ASW-12` con texto y tablas del PDF 16 | Diagramas Mermaid o ASCII |
| Actualizar conteos y spec | Cambios de UI o de persistencia |

## Criterios de aceptación

| N.º | Criterio verificable | Evidencia |
|---|---|---|
| 1 | 15 preguntas nuevas, todas con escenario/restricción y `ref` al PDF 16 | `ASW-131`–`ASW-145`; `validar` 789 preguntas y ASW 145 |
| 2 | `AP-ASW-12` cubre las 12 secciones del PDF, sin diagramas | 7.571 caracteres; sin `mermaid`/`flowchart`; `fuente` existe |
| 3 | ASW declara 145 preguntas, 51 términos y 12 apuntes | `materias.js`; `revision` ASW 145/16 temas sin avisos |
| 4 | Sin regresiones | `lint`, `typecheck`, 477 unitarios y `build` verdes |

## Pasos

1. Material y spec 020 (`12212cf`).
2. 15 preguntas + conteo (`9b08e91`).
3. Apunte `AP-ASW-12` + conteo + test de tablas GFM (`5458d1d`).
4. Cierre: evidencia, changelog y gates.

## Bitácora

| Criterio | Fecha | Comando | Exit | Commit |
|---|---|---|---|---|
| 1 | 2026-11-08 | `npm run validar` | 0 | `9b08e91` |
| 2 | 2026-11-08 | `npm run revision` + búsqueda de `mermaid` | 0 | `5458d1d` |
| 3 | 2026-11-08 | `npm run validar` (789) + `npm run revision` | 0 | `5458d1d` |
| 4 | 2026-11-08 | `lint` + `typecheck` + `npx vitest run` (477) + `build` | 0 | `5458d1d` |

## Rollback

`git revert` por commit; solo contenido y conteos, sin migraciones.

## Cierre

- Fila resumen del changelog.
- Decisión de arquitectura: no aplica (contenido).
