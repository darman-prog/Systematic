# ADR 006 — Un lenguaje es un track del registro, no una entidad nueva

- **Estado**: aceptado
- **Fecha**: 2026-10-03
- **Decisor**: build (con revisión del usuario)

## Contexto

El usuario quiere agregar lenguajes de programación a Systematic, con una dinámica distinta a las
materias: etapas ordenadas (Fundamentos → Funciones y datos → Tipos y genéricos → Asincronía y
errores → Auditoría de código de IA), pruebas formativas y exámenes sumativos, y una barra de
competencia que refleje el avance. El objetivo real es que el estudiante pueda leer y verificar el
código que le da una IA.

Hoy el concepto de "materia" está cableado en varios lugares a la vez: el array literal `MATERIAS`
(`src/core/materias.js:25-80`), `getMateria`, las claves `sys.progreso.<materiaId>`
(`src/core/progreso.js:14-21`), la lista de 15 pantallas (`src/app.js:96-102`) y el mapa `ACCIONES`
de 66 acciones (`src/app.js:986-1083`). No hay abstracción de "tipo de track" ni campo `tipo`.

La pregunta es si los lenguajes son una segunda entidad con pantallas y persistencia propias, o una
propiedad del registro actual con progresión distinta.

## Decisión

Un lenguaje es **un track del mismo registro**, marcado con `tipo: "lenguaje"`. Comparte
infraestructura con las materias (progreso, sesiones, quiz, resultados, misiones, glosario,
persistencia) y se diferencia solo en dos cosas:

1. **La progresión**: etapas secuenciales con examen sumativo que hace de gate. La competencia es
   `exámenes aprobados / etapas totales`, calculada en el módulo nuevo `src/core/competencia.js`.
2. **El contenido**: roadmap y nombres de etapa viven en `src/datos/<lenguaje>/roadmap.js`, como
   datos, nunca en `src/core/` (mismo criterio que el ADR 003).

La barra de competencia se calcula desde los aprobados, sin estado duplicado, y el vocabulario
`competencia` queda separado de `nivel` (XP global) y de `dominada` (Leitner `box >= 3`), que ya
existen con otro significado.

## Consecuencias

- **Positivas**: no se duplica infraestructura; cada feature futura se escribe una vez. Las
  mecánicas que la idea necesita ya existen como tipos de pregunta (`codigo`, `dragdrop` con
  marcadores `{n}`, `ordenar`) y como patrón de mapa secuencial con bloqueo (`misiones`). El
  concepto de "track" queda explícito en el registro, así que agregar un segundo lenguaje es
  agregar datos.
- **Negativas**: `src/core/materias.js` y `src/app.js` pasan a hablar de "tracks" y no de materias;
  `materias.js` suma un `tipo` y quizá un renombre que toca imports. El registro tiene un concepto
  más que aprender, y `app.js` —ya con más de 1.000 líneas y deuda declarada en
  `ARCHITECTURE.md:40`— recibe un poco más de carga hasta que se fragmente.
- **Riesgos**: mezclar en un mismo listado materias y lenguajes puede confundir si no se separan
  visualmente; el ADR asume que `competencia` no reemplaza la gamificación existente y que el track
  nuevo no arrastra XP propio.

## Alternativas consideradas

1. **Entidad "Lenguaje" con pantallas, acciones y persistencia propias**: rechazada — duplicaría
   navegación, acciones y esquema de datos, y cada feature futura habría que implementarla dos
   veces.
2. **Modelar el lenguaje como una materia común**: rechazada — no permite gate por etapas ni
   distinguir prueba de examen, y mezcla el vocabulario de competencia con el de las materias.
3. **Etapa dedicada para el bug de IA frente a metadato transversal**: se evaluaron ambas; el
   usuario eligió **etapa propia** (capstone "Auditoría de código de IA") porque es el diferencial
   del producto y merece peso visible en la barra. El metadato `claseError` se conserva aparte para
   estadísticas.
4. **Ejecutar o compilar el código en el navegador**: rechazada — exige un motor o dependencia en
   runtime, contradice "sin dependencias CDN" de `AGENTS.md`, y no hace falta: el objetivo es
   lectura, no ejecución.
5. **Dificultad adaptativa (IRT) o XP propio por lenguaje**: rechazada por sobre-ingeniería para un
   lenguaje, y por crear una segunda economía de gamificación.