---
status: vigente
last_reviewed: 2026-09-20
confidence: confirmado
source: package.json + suites del repo
---

# Testing

Estrategia y suites de tests del proyecto. Leelo al agregar tests o antes de cerrar un cambio.

## Niveles

| Nivel | Herramienta | Qué cubre |
|---|---|---|
| Unitario | Vitest (`npm run test`) | Dominio puro en `src/core/` y lógica de módulos UI |
| Validación de datos | Node (`npm run validar`) | Schema de preguntas, glosario, apuntes, escenarios y casos de diagramación |
| E2E | Playwright (`npm run e2e`) | Smoke de flujos críticos sobre el build |

## Suites actuales

- `src/core/progreso.test.js`, `sesiones.test.js`, `gamificacion.test.js`, `escenarios.test.js`, `diagramas.test.js`.
- `src/student/persistencia.test.js`, `gamificacion.test.js`, `registros.test.js`.
- `src/ui/misiones.test.js`, `apuntes.test.js`, `iconos.test.js`.
- `scripts/validador.test.js`.
- `e2e/smoke.spec.js` (incluye recorrido de teclado del lienzo de diagramas).

## Reglas

- Testear comportamiento, no implementación.
- El dominio recibe `storage` y `rng` inyectados: los tests usan dobles en memoria, sin DOM ni red.
- El E2E no depende de cifras de contenido; valida estructura y flujos.
- Todo cambio de lógica suma o ajusta tests en el mismo cambio.

## Cuándo correr qué

- Cambio de dominio o datos: `npm run test` y `npm run validar`.
- Cambio de UI o flujos: `npm run build` y `npm run e2e`.
- Cierre de una tarea: `npm run validar`, `npm run test` y `npm run build` (más `npm run e2e` para QA).
