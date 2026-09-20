---
id: 003
status: aceptada
created: 2026-09-19
updated: 2026-09-19
---

# ADR 003: El contenido específico por materia vive en `src/datos/`, no en la UI ni en el core

## Contexto

`src/app.js` hardcodea `TOPIC_COLORS` con temas de BD2 (app.js:15-23) y `SQL_KEYWORDS` de Oracle
(app.js:56), que se aplican a todas las materias; una materia nueva cae al fallback azul. Además,
`migrarClavesLegacy` en `core/progreso.js:25` tiene el id `"bd2"` como default: contenido filtrando
hacia el dominio. Agregar una materia no debería exigir tocar código de UI ni de core.

## Decisión

1. Los colores por tema y las palabras clave (resaltado SQL, etc.) se exportan desde los datos de
   cada materia (`src/datos/<materia>/`) o, si son transversales, como campo de la entrada de la
   materia en `src/core/materias.js`. La UI los consume de la materia activa, con un fallback
   genérico solo cuando el campo falta.
2. `migrarClavesLegacy` no tiene default de materia: el id de materia es parámetro obligatorio.
   El core queda sin ids de materia incrustados.

## Consecuencias

Positivas: una materia nueva define sus temas y keywords solo con datos; el dominio no conoce
materias concretas; el resaltado de SQL deja de aplicarse a materias no-SQL.

Negativas y mitigaciones: más campos en los módulos de datos — el validador (`npm run validar`)
puede extenderse para checar estructura de estos campos si se vuelve fuente de errores.

## Alternativas descartadas

- Registro de temas/keywords por materia dentro de `app.js` (mapa `materiaId → {colores, keywords}`):
  sigue poniendo contenido en la capa de UI; solo mueve el problema.
- Hardcodear condicionales por materia en el render (`if (materia === 'bd2')`): escala mal con cada
  materia y tipo de contenido.
