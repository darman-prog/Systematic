---
id: 011
status: en progreso
created: 2026-10-03
updated: 2026-10-03
---

# 011 — Track de lenguajes: TypeScript con competencia por exámenes

## Objetivo y alcance

Agregar un track de **lenguajes de programación** con un primer lenguaje, **TypeScript**, para
entrenar la lectura y verificación de código generado por IA. No es un curso de sintaxis: el
estudiante practica trazando ejecución, siguiendo datos y detectando errores que el código
"parece correcto" pero está mal.

El track es un track más del registro (`tipo: "materia" | "lenguaje"`): reusa progreso, sesiones,
quiz, resultados, misiones y persistencia. Lo nuevo es la **progresión por etapas con examen
sumativo** y la **barra de competencia**.

**Fuera de alcance**: ejecutar o compilar código, backend o cuentas, CDN en runtime, dificultad
adaptativa, varios lenguajes simultáneos, XP propio por lenguaje, logros nuevos, certificados.

## Contenido

- **5 etapas**, cada una con lecciones y un examen que es el gate de la siguiente:

| # | Etapa | Foco de lectura | `id` en el roadmap |
|---|---|---|---|
| 1 | Fundamentos | trazar variables y salida | `fundamentos` |
| 2 | Funciones y datos | seguir el dato por una función | `funciones` |
| 3 | Tipos y genéricos | dónde el tipo miente (`any`, `as`) | `tipos` |
| 4 | Asincronía y errores | el orden real de ejecución | `asincronia` |
| 5 | Auditoría de código de IA | el bug silencioso y las APIs inexistentes | `auditoria` |

El `id` de etapa y el de examen son ids del roadmap, no de pregunta: solo las preguntas siguen el
formato `TS-NNN` que exige el validador (`scripts/validador.mjs:23`).

- **15 lecciones** (3 por etapa) y **15 pruebas** formativas (~7 preguntas cada una).
- **~165 preguntas** con prefijo `TS-` y formato `TS-NNN`, IDs únicos globales (el validador
  comparte `idsVistos` y exige `PREFIJO-NNN` con dos o más dígitos, `scripts/validador.mjs:23`).
- **1 glosario** de términos de TypeScript reutilizando el motor existente.
- **Etapa 5 es el capstone**: permanece bloqueada hasta aprobar la 4 y mezcla todo lo anterior con
  bugs silenciosos.

> **Estado (2026-10-03)**: el **flujo completo está implementado** —dominio de competencia,
> persistencia, validador de roadmap, track de TypeScript, pantalla de etapas con barra, gate y
> export/import— con 5 etapas, 5 lecciones (1 por etapa) y 35 preguntas. La expansión a las 15
> lecciones y ~165 preguntas es la tarea 7 (un lote por etapa). El umbral de 0.8 se sostiene porque
> cada examen ya tiene 5 preguntas (con menos, `Math.ceil` lo volvería un 100%).

Los nombres de etapa, el orden, el umbral y la versión de cada examen viven en
`src/datos/ts/roadmap.js` (datos, no `src/core/`), siguiendo el patrón de `presentacion.js`
(ADR 003).

## Decisiones

- **Identificador del track**: `id: "lenguaje-ts"`, `tipo: "lenguaje"`, nombre "TypeScript".
  Un id propio evita colisionar con el prefijo de preguntas `TS-` y deja el track como pariente
  lejano de una futura `materia-ts`.
- **Competencia = exámenes aprobados / etapas totales**. La barra tiene 5 tramos. Nada más la mueve.
- **Umbral de examen 80%**, con reintentos ilimitados y sin castigo por fallar (principio de
  gamificación amable, `PRODUCT.md:40`). El aprobado guarda la versión del examen que se pasó.
- **Vocabulario cerrado** (el dominio ya usa otras palabras):
  - `nivel` = nivel global de XP (`DOMAIN.md:39`). No se toca.
  - `dominada` = pregunta con Leitner `box >= 3` (`src/core/gamificacion.js:16`). No se toca.
  - `competencia` = etapas de examen aprobadas de un lenguaje. Es lo nuevo.
- **Prueba formativa vs examen sumativo**: la prueba da feedback y no sube la barra; el examen no
  muestra pistas, tiene temporizador y sube la barra.
- **Tipos de pregunta**: se reusan `codigo`, `dragdrop`, `ordenar`, `multiple`, `multi`. Se agregan
  dos campos opcionales validados:
  - `claseError: sintaxis | logica | silencioso` — metadato transversal, alimenta estadísticas y
    ordena los ejercicios de la etapa 5.
  - `focoLinea: <n>` — línea a resaltar para anclar la mirada donde está el error.
- **Resaltado**: `resaltarSQL` (`src/ui/helpers.js:43`) escapa HTML, resalta strings y aplica las
  keywords que le pasa el llamador. `sqlKeywordsDe` (`src/ui/helpers.js:39`) ya devuelve `[]` si el
  track no declara lista, así que **no hay que tocar `helpers.js` ni el quiz**: para TypeScript
  alcanza con declarar `sqlKeywords` en `src/datos/ts/presentacion.js`, igual que hoy hace `bd2`
  (`src/datos/bd2/presentacion.js:14`).

### Fuera del MVP, anotado para después

- Botón de "reiniciar competencia" (existe precedente en `reiniciarCiclo`, `src/core/mezclador.js`).
- Diagnóstico por `claseError` en la pantalla de resultados.
- Logros por competencias completas.

### Pendiente por decidir antes de implementar

- **Entrada al mezclador global**: `getRegistroParaMezclador` (`src/core/materias.js:98`) alimenta el
  simulacro mixto con las materias. Recomendación: **que el track de lenguaje no entre** en el MVP,
  para no alterar el comportamiento del simulacro mixto ni los E2E que entran por índice. Se resuelve
  al implementar la tarea 1.

## Modelo de datos

```js
// src/datos/ts/roadmap.js
{
  lenguaje: "lenguaje-ts",
  etapas: [
    {
      id: "fundamentos",
      nombre: "Fundamentos",
      lecciones: [
        { id: "fund-1", nombre: "Tipos primitivos", preguntas: ["TS-001", "TS-002", "TS-003"] }
      ],
      examen: {
        id: "fund",
        version: 1,
        umbral: 0.8,
        preguntas: ["TS-031", "TS-032"]
      }
    }
  ]
}
```

Persistencia nueva, en el mismo esquema `sys.*` y sin tocar las claves por materia
(`src/core/progreso.js:14-21`):

| Clave | Contenido |
|---|---|
| `sys.competencia.lenguaje-ts` | `{ <etapaId>: { aprobado, version, ultimoPct, intentos } }` |

## Plan por tareas (orden de dependencia)

| # | Tarea | Depende de |
|---|---|---|
| 1 | `tipo` en el registro + `getTrack`/`getLenguaje` sin ids incrustados | — |
| 2 | `src/core/competencia.js`: cálculo de barra, gate y aprobado por versión de examen | 1 |
| 3 | Persistencia `sys.competencia.*` en `src/student/persistencia.js` | 1 |
| 4 | Validador: campos `claseError` y `focoLinea`, y registro del track en `npm run validar` | 1 |
| 5 | `roadmap.js` + contenido de la etapa 1 (pruebas + examen) | 2, 3, 4 |
| 6 | UI: mapa de etapas + barra de competencia (reusando el patrón de `misiones.js`) | 2, 5 |
| 7 | Contenido de las etapas 2 a 5, en 4 lotes, uno por etapa | 6 |
| 8 | `sqlKeywords` de TypeScript en `src/datos/ts/presentacion.js` (solo datos) | 5 |
| 9 | Export/import incluye competencia | 3 |
| 10 | E2E del recorrido completo | 6, 9 |

## Riesgos y edge cases

- **Redondeo del umbral**: con 12 preguntas, `0.8 * 12 = 9.6`. Se calcula
  `Math.ceil(umbral * total)` para que exija 10 y nunca dependa de precisión de coma flotante.
- **El examen se reescribe**: si cambia el contenido, un aprobado puede quedar obsoleto. El
  resultado guarda `version`; si no coincide con la del roadmap, la etapa vuelve a estar pendiente
  sin borrar el resto del progreso.
- **Huecos de dragdrop**: el validador acepta marcadores `{1}`…`{9}` de un solo dígito
  (`scripts/validador.mjs:64-73`), así que ningún ejercicio de completar código puede tener más
  de 9 huecos.
- **Resaltado que rompe el quiz existente**: descartado. El resaltado se agrega solo como dato
  (`sqlKeywords`), sin tocar `helpers.js`, así que las 4 materias quedan intactas y la suite
  existente lo verifica.
- **`localStorage` bloqueado o corrupto**: misma degradación que el resto de la app — la barra
  muestra 0 de 5 y el contenido sigue navegable.
- **IDs globales**: `TS-*` no colisiona con `P1-`/`PR-`, `ISW-`, `ASW-` ni `INF-`; el validador lo
  verifica (`scripts/validador.mjs`, `idsVistos` compartido).
- **La barra no puede depender solo del color**: el valor se escribe (`"2 de 5 etapas"`) por WCAG AA
  (`PRODUCT.md:47`).
- **Estado duplicado**: el bloqueo de la etapa 5 se deriva del aprobado de la etapa 4, no se guarda
  un booleano aparte.

## Desvío de la convención de contenido

`AGENTS.md` exige que el contenido de materias nuevas se derive de los `.md` de
`BancoDeInformacion/`. Un currículo de "lectura de código" no existe en ese material, así que **las
~165 preguntas, las 5 etapas y el glosario son material propio**, revisado por lote antes de cada
commit. Mismo desvío que el bloque de redes del spec 010. La etapa 5 se escribe última, cuando las
4 anteriores ya estén revisadas y estables, porque es la de mayor riesgo de contenido.

## Criterios de aceptación

1. El home lista los 4 tracks de materia y, en una sección aparte, el track de TypeScript con su
   barra de competencia.
2. Una prueba completada **no** mueve la barra.
3. Un examen aprobado sube la barra, desbloquea la etapa siguiente y queda registrado.
4. Un examen reprobado no bloquea el reintento y muestra el detalle de lo fallado.
5. La etapa 5 permanece bloqueada hasta aprobar la 4.
6. El progreso del lenguaje no lee ni escribe `sys.progreso.<materia>`.
7. Exportar e importar en una máquina limpia conserva la competencia.
8. `npm run validar` pasa incluyendo el nuevo track; `npm run test` en verde; E2E del recorrido
   completo.

## Validación

- `npm run validar` — schema del contenido y del roadmap.
- `npm run revision` — calidad de contenido por lote.
- `npm run test` — unitarios de `competencia.js`, `persistencia.js`, validador y registro.
- `npm run build` — build de producción.
- `npm run e2e` — `e2e/lenguajes.spec.js`: prueba → examen aprobado → barra sube → desbloquea.
- Casos a cubrir en unitarios: umbral con redondeo, aprobado de versión vieja, `localStorage` vacío
  o corrupto, examen reprobado y reintento, y que el estado del lenguaje no toque claves de materia.