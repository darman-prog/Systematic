# ADR 011 — Reglas de negocio en core/student y carga de contenido fuera del dominio

- **Estado**: aceptado
- **Fecha**: 2026-10-20
- **Decisor**: build (plan aprobado por el usuario)

## Contexto

La arquitectura declarada en `docs/project-brain/ARCHITECTURE.md` separa dominio (`core`),
servicios (`student`), render (`ui`), orquestación y composición. En la práctica hay fugas:

- `ui/aprendizaje/quiz.js` evalúa respuestas de opción, multi, dragdrop y orden
  (`:91`, `:155`, `:600`, `:693`).
- `ui/dashboard/misiones.js` decide el desbloqueo secuencial de misiones (`:21-35`).
- `ui/dashboard/stats.js` calcula tendencia, diagnóstico, heatmap y peores preguntas
  (`:149-278`).
- `orquestacion/ronda.js` decide qué preguntas entran en cada modo (`:78-142`).
- `core/registro/materias.js` importa presentación de `src/datos/` y ejecuta `import()`
  dinámico (`:5-8`, `:10-21`, `:140-150`).

Eso impide testear las reglas sin DOM, mezcla responsabilidades y hace que un tipo de
pregunta nuevo obligue a tocar UI, dominio y validador.

## Decisión

1. La evaluación de respuestas pasa a `src/core/estudio/evaluacion.js`; la UI solo recolecta
   la entrada y muestra el resultado.
2. El desbloqueo de misiones pasa a `src/core/juego/misiones.js`.
3. El cálculo de estadísticas pasa a `src/student/estadisticas.js`; la UI conserva vistas,
   canvas y formato.
4. La selección de preguntas por modo pasa a `src/student/rondas.js`; `orquestacion/ronda.js`
   conserva timers, pausa, foco y DOM.
5. La carga de contenido y la presentación (`topicColors`, `sqlKeywords`) pasan a
   `src/student/contenido.js`. `core/registro/materias.js` queda como metadata: sin
   `import()` ni imports de `src/datos/`.
6. No cambian los formatos persistidos (`sys.*`, snapshot `nube-1`), el HTML ni los textos.

## Consecuencias

- **Positivas**: el dominio se testea sin DOM; la UI queda más delgada; `core` deja de
  conocer la ubicación del contenido; los modos de ronda se prueban con `rng` inyectable.
- **Negativas**: más módulos y una migración de imports en `track`, `home`, scripts y tests.
- **Riesgos**: diferencias sutiles en evaluación (normalización, textos repetidos), cálculo de
  stats sin tests previos y chunks de Vite al mover los `import()`.
- **Deuda restante**: no hay contratos tipados ni lint de límites; el mezclador no cableado
  queda fuera de alcance. Se registra en
  [docs/features/015-desacople-app-js-y-limites.md](../features/015-desacople-app-js-y-limites.md).

## Alternativas descartadas

1. **Dejar la mezcla actual**: mantiene reglas no testeables y contradice el cerebro
   documental.
2. **Migrar todo a TypeScript/ESLint de boundaries en el mismo cambio**: resuelve contratos,
   pero multiplica el riesgo y el alcance.
3. **Mantener la presentación en `core`**: deja `core → datos` y rompe la independencia del
   dominio.
