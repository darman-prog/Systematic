---
status: vigente
last_reviewed: 2026-10-20
confidence: confirmado
source: package.json + suites del repo
---

# Testing

Estrategia y suites de tests del proyecto. Leelo al agregar tests o antes de cerrar un cambio.

## Niveles

| Nivel | Herramienta | Qué cubre |
|---|---|---|
| Unitario | Vitest (`npx vitest run`) | Dominio puro, servicios de `student/`, coordinadores de `orquestacion/` y lógica de UI |
| Validación de datos | Node (`npm run validar`) | Schema, conteos, ids únicos y roadmap de todos los tracks |
| E2E | Playwright (`npm run e2e`) | Flujos críticos sobre el build, móvil y auditorías de a11y/teclado |

## Suites actuales

- Dominio: `src/core/estudio/{progreso,sesiones,sesion,evaluacion,mezclador}.test.js`;
  `src/core/juego/{gamificacion,escenarios,misiones}.test.js`;
  `src/core/lenguaje/competencia.test.js`; `src/core/nube/snapshot.test.js`;
  `src/core/diagramas/diagramas.test.js`; `src/core/registro/materias.test.js`.
- Aplicación: `src/student/{persistencia,avance,gamificacion,registros,track,session,rondas,estadisticas,contenido,exportacion,cuenta,nube,firebase,aplicar}.test.js`.
- Orquestación: `src/orquestacion/{quiz,ajustes,acceso}.test.js` y
  `src/orquestacion/acciones/acciones.test.js` (duplicados + contrato `data-action`).
- UI: `src/ui/{iconos,helpers}.test.js`; `src/ui/aprendizaje/{apuntes,lenguaje}.test.js`;
  `src/ui/componentes/{estados,componentes,competencia}.test.js`;
  `src/ui/cuenta/{autenticacion,perfil}.test.js`.
- Datos y scripts: `src/datos/agregadores.test.js`, `scripts/validador.test.js`,
  `scripts/revision-contenido.test.js`.
- E2E: `smoke`, `onboarding`, `perfil`, `lenguajes`, `infraestructura`, `movil` y las tres
  auditorías (`a11y`, `teclado`, `funcionalidad`).

## Reglas

- Testear comportamiento, no implementación.
- El dominio y los servicios reciben `storage`, `rng`, reloj y callbacks inyectados: los tests
  usan dobles en memoria, sin DOM ni red.
- Los controladores que tocan DOM se cubren con Playwright; las decisiones puras, con unitarios.
- El E2E no depende de cifras de contenido; valida estructura y flujos.
- Todo cambio de lógica suma o ajusta tests en el mismo cambio.

## Cuándo correr qué

- Cambio de dominio, datos o servicios: `npx vitest run` y `npm run validar`.
- Cambio de UI, acciones o flujos: `npm run build` y `npm run e2e`.
- Cierre de una tarea: `npm run validar`, `npx vitest run`, `npm run build` y `npm run e2e`.
- El repo no tiene lint, typecheck ni CI; se declara en el PR.
