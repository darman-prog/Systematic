# ADR 009 — Desacople de app.js por extracción sin contenedor DI

- **Estado**: aceptado
- **Fecha**: 2026-10-09
- **Decisor**: build (plan aprobado por el usuario)

## Contexto

`src/app.js` concentra la composición y la orquesta: ~40 imports, el mapa `ACCIONES` con
delegación de clicks, `show()` para 18 pantallas, el diálogo de confirmación propio, los
puentes de config/quiz hacia `track`, los timers y el estado reasignable (`progreso`,
`sesion`). Cada feature nueva lo toca y cada toque arriesga a las demás.

Los servicios ya usan fábricas con dependencias por parámetro (`src/student/`) y los
renders reciben estado por parámetro ([ADR 004](004-capa-servicios-student.md),
[ADR 007](007-estructura-por-subdominios.md)). La pregunta es cómo extraer sin romper los
contratos que ya funcionan: claves `data-action`, lista de `show()`, `ctx` con getters y
firmas `crear*`.

## Decisión

Se extrae en orden de menor a mayor dependencia, sin cambiar comportamiento:

1. Confirmación → `src/ui/componentes/confirm.js` (misma firma Promise + retorno de foco).
2. `show()` → `src/orquestacion/router.js` (ya se inyecta como `mostrarPantalla`).
3. `ACCIONES` → `src/orquestacion/acciones.js` por feature, conservando claves y listener delegado.
4. Puentes config/quiz → controladores con `{ track, sesiones, ui }`.
5. Timers → `quizUI`/sesión (mútan `sesiones.sesion`, no se duplican).

Se mantienen las fábricas con parámetros y **no** se crea contenedor DI: los tests
mockean params sin magia y `ctx` ya resuelve la reasignación con getters.

## Consecuencias

- **Positivas**: cada extracción es un commit con tests en verde; `app.js` queda como
  composición delgada; los contratos UI (`data-action`, pantallas, foco) no cambian.
- **Negativas**: más archivos para una misma ronda; el mapa de acciones vive en dos
  lugares durante la migración (se cierra al terminar el paso 3).
- **Riesgos**: foco de modales y orden Tab/Escape (mitiga: preservar retorno de foco y
  trampas); estado global duplicado (mitiga: no duplicar store, `ctx` getters mandan).

## Alternativas consideradas

1. **Contenedor DI mínimo**: rechazado — magia innecesaria para ~8 servicios; las
   fábricas con params ya se mockean fácil en los 334 tests.
2. **Barrel de app como en core**: rechazado — el problema no es la ruta de imports
   sino responsabilidades mezcladas en un solo módulo.
3. **No refactorizar y seguir extendiendo app.js**: rechazado — cada UI nueva
   (dashboard con continuidad, resultados accionables) lo haría más frágil.
