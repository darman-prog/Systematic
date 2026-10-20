# ADR 010 — app.js como composition root y controladores por feature

- **Estado**: aceptado
- **Fecha**: 2026-10-20
- **Decisor**: build (plan aprobado por el usuario)

## Contexto

`src/app.js` concentra la composición, los servicios de aplicación, los controladores de
feature, el estado mutable y la presentación. Tiene ~899 líneas, más de 40 funciones y
`crearAcciones` recibe alrededor de 60 dependencias. El [ADR 009](009-desacople-app-js.md)
extrajo confirmación, router, acciones, config y ronda, pero dejó en `app.js` el avance del
estudiante, export/import, misiones, escenarios, casos, lenguaje, cuenta/perfil, dashboard,
atajos y el mapa único de acciones.

Ese tamaño hace que cada feature nueva toque un archivo que conocen todas las demás. La
pregunta es cómo seguir extrayendo sin cambiar comportamiento ni contratos de UI
(`data-action`, pantallas, foco, claves `sys.*`).

## Decisión

`src/app.js` queda como **composition root**: imports, instanciación de servicios, `ctx`,
controladores por feature, composición de acciones, instalación de atajos y arranque. No
contiene reglas de negocio ni estado mutable de una feature.

1. Los controladores viven en `src/orquestacion/` (`misiones`, `escenarios`, `casos`,
   `lenguaje`, `dashboard`, `acceso`, `arranque`, `atajos`).
2. Los servicios de aplicación viven en `src/student/` (`avance`, `exportacion`, `rondas`,
   `estadisticas`, `contenido`).
3. Las acciones se dividen por feature en `src/orquestacion/acciones/` y se componen con un
   guard que falla ante claves duplicadas. Un test verifica que todo `data-action` de
   `index.html` exista en el mapa compuesto.
4. La migración es incremental, un commit por módulo, con tests unitarios para servicios y
   E2E para controladores.
5. No se introduce contenedor DI, framework ni TypeScript. Se mantienen las fábricas
   `crear*(deps)` y los getters de `ctx`.

**Objetivo de cierre:** `app.js` ≤300 líneas, sin `let progreso`/`escenarioActual`/`casoActual`
y sin funciones de negocio; `grep -c "^function " src/app.js` = 0. El resultado es 284 líneas y
0 funciones, una reducción del 68% desde las 899 iniciales.

## Consecuencias

- **Positivas**: cada feature tiene un dueño claro; los tests de servicios no necesitan DOM;
  el mapa de acciones deja de ser un punto único de acoplamiento; el arranque y la cuenta se
  pueden probar por separado.
- **Negativas**: más archivos y una fase de migración con imports duplicados; el orden de
  instanciación importa (avance → track → sesiones → quiz → ronda).
- **Riesgos**: ciclos de dependencia (mitiga: `orquestacion/quiz.js` coordina avance y sesión),
  claves de acción faltantes (mitiga: test contra `index.html`), foco y teclado (mitiga: E2E
  de auditoría y smoke).

## Alternativas descartadas

1. **Seguir extendiendo `app.js`**: cada pantalla nueva agrava el acoplamiento y el archivo
   ya es el más grande del repo.
2. **Reescritura big-bang**: imposible de revisar y de revertir; el repo tiene E2E pero no
   tests de `app.js`.
3. **Contenedor DI**: complejidad innecesaria para ~10 servicios; las fábricas con parámetros
   ya se mockean sin magia.
