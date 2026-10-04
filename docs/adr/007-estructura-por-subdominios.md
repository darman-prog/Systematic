# ADR 007 — Estructura por subdominios en core, datos y ui

- **Estado**: aceptado
- **Fecha**: 2026-10-03
- **Decisor**: build (con revisión del usuario)

## Contexto

`src/` había crecido con carpetas planas: `src/core/` tenía 9 módulos y sus tests en el mismo nivel
sin agrupar por subdominio; `src/datos/` mezclaba las 4 materias con el track de lenguajes; y
`src/ui/pantallas/` juntaba pantallas de dos recorridos distintos (datos del estudiante y
práctica/estudio). Encontrar dónde vive cada cosa costaba y cada módulo nuevo sumaba ruido.

La Dependency Rule del [ADR 001](001-arquitectura-capas.md) no cambia: el dominio sigue puro y las
dependencias apuntan hacia adentro. El problema es de **organización dentro de cada capa**, no de
límites entre capas.

## Decisión

Se agrupa por subdominio, sin cambiar contratos ni comportamiento:

1. **`src/datos/`** se divide en `materias/` (bd2, isw, asw, infra) y `lenguajes/` (ts). El registro
   (`core/registro/materias.js`) es el único que conoce estas rutas.
2. **`src/core/`** se agrupa en `registro/` (materias), `estudio/` (progreso, sesiones, mezclador,
   questionSelector), `juego/` (gamificacion, escenarios), `lenguaje/` (competencia) y `diagramas/`
   (diagramas). Se agrega `src/core/index.js` como **barrel**: re-exporta la API pública y los
   consumidores (app, student, ui, scripts) importan de ahí, no de rutas internas.
3. **`src/ui/`** separa `dashboard/` (stats, misiones: datos del estudiante) de `aprendizaje/`
   (quiz, resultados, estudio, flashcards, glosario, escenarios, casos, apuntes, lenguaje). Los
   compartidos (`helpers.js`, `iconos.js`, `componentes/`) quedan en la raíz de `ui/`.

El home (lista de materias/lenguajes y perfil) sigue renderizándose en `app.js`: extraerlo es un
refactor aparte, fuera de esta decisión.

## Consecuencias

- **Positivas**: cada subcarpeta responde a una pregunta ("¿dónde vive la progresión de estudio?");
  el barrel de core desacopla a los consumidores de la ruta interna, así que un reordenamiento
  futuro no vuelve a tocar `app.js` ni `scripts/`. Los tests viajan junto a su módulo.
- **Negativas**: hay un nivel más de profundidad y una indirección (`core/index.js`). El barrel
  exige que no existan nombres de export repetidos entre subdominios; hoy no los hay (verificado).
- **Riesgos**: los nombres de chunk de Vite cambian (hash por ruta), sin impacto funcional.

## Alternativas consideradas

1. **Dejar `core/` plano y solo dividir datos/ui**: rechazada — no resolvía el desorden de core.
2. **Sin barrel, con rutas directas a cada subcarpeta**: rechazada — cada movimiento futuro
   volvería a tocar a todos los consumidores; el barrel es el punto de estabilidad.
3. **Extraer el home a `ui/dashboard/home.js` en el mismo cambio**: postergada — el home depende del
   estado y la navegación de `app.js`; conviene hacerlo como refactor propio (deuda de la spec 002).
