---
status: vigente
last_reviewed: 2026-10-20
confidence: confirmado
source: código + ADR 001-013
---

# Arquitectura

Cómo está dividido el código y dónde vive cada responsabilidad. Leelo antes de mover, extraer o
agregar módulos, y al revisar un cambio que cruce capas.

## Capas actuales

La Dependency Rule apunta hacia adentro: el dominio no conoce UI, persistencia concreta ni
la ubicación del contenido.

| Capa | Carpeta | Responsabilidad |
|---|---|---|
| Dominio | `src/core/` | Reglas puras por subdominio: `registro/materias.js` (metadata de tracks, sin `import()` ni rutas de datos), `estudio/` (progreso con `storage` inyectado, sesiones con `rng` inyectable, `evaluacion.js` con la correctitud por tipo y `estadisticas.js` con el cálculo puro del panel), `juego/` (gamificación, escenarios y `misiones.js` con el gate secuencial), `lenguaje/competencia.js`, `nube/snapshot.js` y `diagramas/diagramas.js`. `index.js` re-exporta la API pública (ADR 007) |
| Aplicación | `src/student/` | Servicios con dependencias inyectadas: `persistencia.js` (claves `sys.*`), `avance.js` (progreso, actividad, meta e historial), `gamificacion.js`, `registros.js`, `track.js` (track activo y filtros), `session.js` (estado de la ronda), `rondas.js` (selección de preguntas por modo), `contenido.js` (único módulo que conoce `src/datos/` y los chunks), `exportacion.js` (serializar/validar import/export), `firebase.js`, `cuenta.js`, `nube.js` y `aplicar.js` (ADR 008) |
| Orquestación | `src/orquestacion/` | Controladores y contratos de interacción: `router.js`, `contexto.js`, `acciones/` (mapas por feature + compositor con guard de duplicados), `ronda.js` (timers, pausa y DOM de la ronda), `quiz.js` (coordinador de respuesta), `ajustes.js`, `misiones.js`, `escenarios.js`, `casos.js`, `lenguaje.js`, `dashboard.js`, `acceso.js` (cuenta/onboarding/arranque) y `atajos.js` |
| Render | `src/ui/` | `aprendizaje/` (una pantalla por flujo), `dashboard/` (`home.js`, `config.js`, `stats.js`, `misiones.js`, `portada.js`), `cuenta/` (acceso y perfil), `componentes/` (estados, tarjetas, etiquetas, anillo, avisos, confirmación, lienzo) y compartidos `helpers.js`/`iconos.js`/`entorno.js`. Reciben estado explícito; no leen `localStorage`, datos de materias ni estado global |
| Composición | `src/app.js` | Composition root: instancia servicios y controladores, compone `ACCIONES`, instala atajos y arranca. No contiene reglas de negocio ni estado mutable de una feature |
| Contenido | `src/datos/{materias,lenguajes}/<track>/` | Preguntas, glosario, apuntes, escenarios, casos, roadmap y presentación (colores/keywords) por track |

`src/main.js` importa estilos y arranca `app.js`. `index.html` es el shell con las pantallas.
`src/ui/componentes/diagramas.js` es un componente compartido: el quiz lo usa para el tipo
`diagrama` y `orquestacion/casos.js` lo instancia para el modo de casos.

## Flujo de una acción

1. El HTML declara `data-action` y sus parámetros en `data-*`.
2. `orquestacion/acciones/index.js` compone los mapas por feature y `instalarDelegacion` resuelve
   el click.
3. El controlador correspondiente actualiza el estado o llama al servicio de `student/`.
4. Las reglas puras se ejecutan en `core/` (progreso, sesiones, evaluación, misiones, diagramas).
5. La persistencia escribe en `localStorage` con claves `sys.*`.
6. La UI se repinta con estado explícito; no hay framework ni DOM virtual.

## Límites verificables

- `core/` no importa `student/`, `ui/`, `orquestacion/` ni `src/datos/` en producción.
- `student/` no importa `ui/`; `ui/` no importa `student/` ni `src/datos/` ni `localStorage`.
- `orquestacion/` puede usar `student/`, `ui/` y `core/`.
- `app.js` solo compone; `orquestacion/acciones/` falla ante claves duplicadas y un test verifica
  que todo `data-action` estático de `index.html` exista.
- Los formatos persistidos (`sys.*`, snapshot `nube-1`) y los textos de UI no cambiaron con el
  refuerzo de capas.

## Decisiones estructurales

- [ADR 001](../adr/001-arquitectura-capas.md): capas, dominio puro y dependencias hacia adentro.
- [ADR 002](../adr/002-eliminacion-window-globales.md): `data-action` y mapa de acciones; sin
  globales en `window` ni `onclick` inline.
- [ADR 003](../adr/003-contenido-desacoplado-de-ui.md): el contenido vive en `src/datos/`.
- [ADR 004](../adr/004-capa-servicios-student.md): servicios de aplicación con dependencias
  inyectadas.
- [ADR 007](../adr/007-estructura-por-subdominios.md): subdominios en `core/`, `datos/` y `ui/`.
- [ADR 008](../adr/008-cuenta-y-sincronizacion-firestore.md): cuenta opcional y respaldo en
  Firestore; la app funciona sin claves.
- [ADR 009](../adr/009-desacople-app-js.md): primeras extracciones de `app.js`.
- [ADR 010](../adr/010-app-js-composition-root.md): `app.js` como composition root y
  controladores por feature.
- [ADR 011](../adr/011-limites-capas-y-contenido.md): reglas de negocio en `core`/`student` y
  carga de contenido fuera del dominio.
- [ADR 012](../adr/012-retiro-mezclador.md): retiro del mezclador no cableado; queda en el tag
  `archive/mezclador`.
- [ADR 013](../adr/013-contratos-y-gates.md): JSDoc/`checkJs`, ESLint y CI.

## Calidad automatizada

- `npm run lint`: ESLint con errores reales, sin reglas de estilo.
- `npm run typecheck`: `tsc --noEmit` sobre `src`, `scripts`, `e2e` y configs; los contratos
  viven en `src/core/tipos.js` y en JSDoc. `strict` queda como deuda posterior.
- `npm run validar`: schema y conteos de contenido.
- `npx vitest run`: unitarios de dominio, servicios, orquestación y UI.
- `npm run build` y `npm run e2e`.
- CI en `.github/workflows/ci.yml`: `calidad` en push/PR y `e2e` en PR.

## Deuda conocida

- `strict`/`noImplicitAny` no están activos; el typecheck global usa `strict: false`.
- Import/export conserva `alert`/`confirm` nativos por decisión de alcance.
- La branch protection de GitHub se configura fuera del repo.
