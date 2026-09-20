# ADR 004: capa de servicios `src/student/` para el recorrido del estudiante

## Contexto
`src/app.js` supera las 1.100 líneas y mezcla la composición root con responsabilidades de
aplicación: persistencia (`localStorage` con claves `sys.*` dispersas como strings), gamificación
(XP, logros, racha, perfil, toasts), sesión y timers, filtros de práctica, export/import y
migración legacy, además del mapa de acciones. Es la única capa sin tests propios y ya sufrió
bugs por esa concentración (claves duplicadas en `ACCIONES`, shadowing de un import).

## Decisión
Extraer servicios de aplicación en `src/student/` con dependencias inyectadas (mismo patrón que
`src/core/`):

- `persistencia.js`: claves centralizadas (`CLAVES_GLOBALES`, `claveMisiones`) y CRUD por
  materia/global; recibe `storage` para testear sin DOM.
- `gamificacion.js`: XP, eventos únicos, logros, racha y perfil; la presentación (toast, confeti,
  perfil) entra por callbacks inyectados.
- `registros.js`: fusiones puras del mejor resultado (escenarios, casos, misiones) y suma de
  estrellas.

`app.js` queda como composición root y conserva por ahora navegación, filtros, sesión/timers y el
mapa `ACCIONES`. La extracción es incremental y preserva el formato de `localStorage`.

## Consecuencias
- Positivas: las claves de persistencia viven en un solo lugar; la gamificación y los registros se
  testean sin DOM; se elimina la duplicación del merge de ratings (3 copias).
- Negativas y mitigación: `app.js` sigue grande; los pasos restantes (materia/filtros, sesión con
  clock inyectable, división de `ACCIONES`) quedan planificados y se hacen preservando
  comportamiento con la red de tests actual.

## Alternativas descartadas
- Extraer todo en un solo paso: riesgo alto sin red de tests de `app.js`.
- Framework o estado global reactivo: fuera de alcance (sitio estático sin backend).
