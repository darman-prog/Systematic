---
id: 018
status: cerrada
created: 2026-10-27
updated: 2026-10-27
---
# Feature 018 — Hexagonal + Microservicios (ASW) y NoSQL MongoDB/Neo4j (BD2)

> Convertir 3 PDFs con MarkItDown y agregar 5 temas estándar a ASW/BD2 con
> fuentes reales y revisión humana.

## Objetivo

Estudiar arquitectura hexagonal, evolución de arquitecturas y microservicios en
ASW; y bases no relacionales (MongoDB documental, Neo4j grafos) en BD2, con
contenido curado y validado por el schema del repo.

## Alcance

| Incluye | Excluye |
|---|---|
| Conversión MarkItDown de PDFs 13/14/15 + revisión humana | Escenarios/casos nuevos |
| 3 temas ASW (45 preguntas ASW-086–130, 3 apuntes, 24 términos) | Cambios en `src/core`, `src/ui` (salvo el test de conteo), persistencia |
| 2 temas BD2 (30 preguntas P1-081–110, 16 términos, colores NoSQL) | Apuntes en BD2 (vacío intencional, spec 010) |
| Actualizar `conteo` en `materias.js` y el test del dashboard | Renumerar IDs existentes |

## Criterios de aceptación

| N.º | Criterio verificable | Evidencia |
|---|---|---|
| 1 | 3 `.md` generados junto a cada PDF, revisados a mano | `13/14/15 *.md` en `BancoDeInformacion/ArquitecturaDeSoftware/` (14 curado a mano: MarkItDown devuelve vacío al ser solo imágenes) |
| 2 | ASW +45 preguntas válidas (temas Hexagonal, Evolución, Microservicios) | `npm run validar` exit 0; `asw 130 preguntas · 15 temas` en `npm run revision` sin avisos |
| 3 | BD2 +30 preguntas MongoDB/Neo4j con refs a docs oficiales | `node` confirma ≥15 por tema; `bd2 120 preguntas · 9 temas` sin avisos |
| 4 | Sin regresiones | `npm run lint`, `npm run typecheck`, `npm run test` (419 verdes) |
| 5 | Dashboard muestra el conteo real actualizado | `home.test.js` con "1 de 120 respondidas" en verde |

## Pasos

1. MarkItDown sobre los 3 PDFs y curaduría manual (acentos, diagramas como listas/tablas).
2. Tema Hexagonal ASW (ASW-086–100, AP-ASW-09, 8 términos).
3. Tema Evolución ASW (ASW-101–115, AP-ASW-10, 8 términos).
4. Tema Microservicios ASW (ASW-116–130, AP-ASW-11, 8 términos).
5. Tema MongoDB BD2 (P1-081–095, 8 términos, color en `presentacion.js`).
6. Tema Neo4j BD2 (P1-096–110, 8 términos, color en `presentacion.js`).
7. Conteos en `materias.js`, fix del test del dashboard, spec + changelog.

## Bitácora

| Criterio | Fecha | Comando | Exit |
|---|---|---|---|
| 1 | 2026-10-27 | `python -m markitdown` ×3 + revisión manual | 0 (14 vacío → curado a mano) |
| 2 | 2026-10-27 | `npm run validar` + `npm run revision` | 0 |
| 3 | 2026-10-27 | `npm run validar` + conteo por tema con `node -e` | 0 |
| 4 | 2026-10-27 | `npm run lint` + `npm run typecheck` + `npm run test` | 0 (419 passed) |
| 5 | 2026-10-27 | `npx vitest run src/ui/dashboard/home.test.js` | 0 (5 passed) |

## Decisiones

- BD2 sin apuntes: se respeta el vacío intencional (spec 010); la profundidad NoSQL
  vive en `exp` + `ref` a la documentación oficial por pregunta.
- Todo el contenido nuevo usa `parcial: "Parcial 1"`, igual que el 100% existente.
- `ref` de las preguntas NoSQL apunta a `mongodb.com/docs` y `neo4j.com/docs`
  (verificado el 2026-10-27); el validador no exige que `ref` exista como archivo.

## Rollback

`git revert` por commit de paso; contenido aislado por tema, sin migraciones.

## Cierre

- Fila resumen del changelog.
- Decisión de arquitectura: no aplica (contenido, sin ADR).
