# ADR 012 — Retiro del mezclador no cableado

- **Estado**: aceptado
- **Fecha**: 2026-10-20
- **Decisor**: build (plan aprobado por el usuario)

## Contexto

`src/core/estudio/mezclador.js` y `questionSelector.js` implementan un mezclador de
preguntas de varias materias con cooldown, pesos y distribución por dificultad. La idea
original era un “simulacro mixto” entre tracks, mencionada como pendiente en la
[spec 011](../specs/011-lenguajes-competencia.md).

En la aplicación real ese flujo nunca se conectó:

- `crearMezclador` solo se importa desde `mezclador.test.js`.
- `questionSelector.js` solo se importa desde `mezclador.js`.
- `core/index.js` los reexporta, pero ningún módulo de `app`, `student`, `ui`, `scripts`
  o `e2e` los consume.
- `app.js` llegó a instanciarlo y exportarlo por defecto, pero nadie importaba ese default
  ni llamaba a `siguienteRonda`.
- La mezcla que usa la app vive en `src/student/rondas.js` y
  `src/core/estudio/sesiones.js` (barajado, prioridad y preparación de ítems).
- `storeLocalStorage` es la única referencia directa a `localStorage` dentro de `core/`.

## Decisión

1. Archivar la implementación en el tag `archive/mezclador`, creado sobre `main`, para
   conservar la idea fuera del código de producción.
2. Eliminar `mezclador.js`, `mezclador.test.js` y `questionSelector.js` de `main`.
3. Quitar sus exports de `src/core/index.js`.
4. No crear un simulacro mixto entre materias en este cambio: si se retoma, será una
   feature nueva sobre `student/contenido` y `student/rondas`, no una reactivación
   implícita del módulo archivado.

## Consecuencias

- **Positivas**: se eliminan ~550 líneas sin consumidores; `core` deja de tener un
  adaptador `localStorage`; el flujo real de mezcla queda con un dueño claro
  (`rondas.js`/`sesiones.js`).
- **Negativas**: la lógica de cooldown y pesos no queda disponible en `main`; se recupera
  desde el tag si se necesita.
- **Riesgos**: ninguno de comportamiento actual; los tests del mezclador desaparecen y el
  conteo de la suite baja.

## Alternativas descartadas

1. **Cablearlo como simulacro mixto**: es producto nuevo, con UI, selección de tracks y
   tests; no es una reparación de deuda.
2. **Dejarlo como código muerto**: mantiene la excepción de `localStorage` en core y
   confunde a quien lee `core/index.js`.
3. **Borrarlo sin tag**: pierde una implementación que podría reutilizarse; el tag no
   ensucia `main`.
