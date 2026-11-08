---
id: 020
status: activa
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
SDUI, nativo vs multiplataforma y trade-offs. Hoy ASW tiene 130 preguntas, 51 términos
y 11 apuntes; `MVC y variantes` solo llega hasta MVVM y no existe el tema móvil.
El visor de apuntes usa `marked` + `DOMPurify` y no renderiza Mermaid: los diagramas
quedan fuera de esta entrega y se retomarán en la actualización global de apuntes.

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
| 1 | 15 preguntas nuevas, todas con escenario/restricción y `ref` al PDF 16 | `ASW-131`–`ASW-145`; `npm run validar` |
| 2 | `AP-ASW-12` cubre todas las secciones del PDF, sin diagramas | `apuntes.js`; `fuente` existente |
| 3 | ASW declara 145 preguntas, 51 términos y 12 apuntes | `materias.js`; `npm run validar` (789 total) |
| 4 | Sin regresiones | `lint`, `typecheck`, `npx vitest run`, `build` |

## Pasos

1. Spec 020 e índice.
2. 15 preguntas + conteo de preguntas.
3. Apunte `AP-ASW-12` + conteo de apuntes + test de tablas GFM.
4. Cierre: evidencia, changelog y gates.

## Bitácora

| Criterio | Fecha | Comando | Exit | Commit |
|---|---|---|---|---|
| 1 | 2026-11-08 | `npm run validar` |  |  |
| 2 | 2026-11-08 | `npm run revision` |  |  |
| 3 | 2026-11-08 | `npm run validar` |  |  |
| 4 | 2026-11-08 | `lint` + `typecheck` + `vitest` + `build` |  |  |

## Rollback

`git revert` por commit; solo contenido y conteos, sin migraciones.

## Cierre

- Fila resumen del changelog.
- Decisión de arquitectura: no aplica (contenido).
