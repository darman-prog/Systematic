---
status: vigente
last_reviewed: 2026-09-20
confidence: confirmado
source: código + ADR 001-003
---

# Arquitectura

Cómo está dividido el código y dónde vive cada responsabilidad. Leelo antes de mover, extraer o
agregar módulos, y al revisar un cambio que cruce capas.

## Capas actuales

La Dependency Rule apunta hacia adentro: el dominio no conoce UI ni persistencia concreta.

| Capa | Carpeta | Responsabilidad |
|---|---|---|
| Dominio | `src/core/` | Reglas puras: `materias.js` (registro), `progreso.js` (Leitner con `storage` inyectado), `sesiones.js` (armado de sesiones con `rng` inyectable), `escenarios.js` (motor multi-paso), `gamificacion.js` (XP, niveles y logros), `diagramas.js` (estado del tablero, conexiones por subtipo, guardas, evaluación y rating) |
| Render | `src/ui/` | Un módulo por pantalla (`quiz.js`, `resultados.js`, `stats.js`, `estudio.js`, `glosario.js`, `flashcards.js`, `misiones.js`, `escenarios.js`, `apuntes.js`, `casos.js`) más `diagramas.js` (lienzo), `iconos.js` (set de SVG) y `helpers.js`. Reciben estado explícito y no leen estado global ni `localStorage` |
| Composición | `src/app.js` | Estado de la app, navegación, persistencia por materia y mapa de acciones `ACCIONES` con un único listener delegado |
| Contenido | `src/datos/<materia>/` | Preguntas, glosario, apuntes, escenarios, casos y presentación (colores/keywords) por materia |

`src/main.js` importa estilos y arranca `app.js`. `index.html` es el shell con las pantallas.

`src/ui/diagramas.js` es un componente compartido: el quiz lo usa para el tipo de pregunta
`diagrama` y el modo de casos lo instancia aparte con `obtenerItem`/`obtenerEstado`/`guardarEstado`,
sin acoplarse a la sesión del quiz.

## Decisiones estructurales

- [ADR 001](../adr/001-arquitectura-capas.md): capas, dominio puro y dependencias hacia adentro.
- [ADR 002](../adr/002-eliminacion-window-globales.md): eventos por `data-action` y mapa de acciones; sin globales en `window` ni `onclick` inline.
- [ADR 003](../adr/003-contenido-desacoplado-de-ui.md): el contenido específico por materia vive en `src/datos/`, no en core ni UI.

## Deuda conocida

`src/app.js` concentra demasiadas responsabilidades (persistencia, gamificación, filtros, sesión y
navegación) y supera las 1.000 líneas. El objetivo de la [spec 002](../specs/002-refactor-app-js.md)
era quedar por debajo de ~400. El refactor planificado extrae una capa `src/student/` con los
servicios del recorrido del estudiante y deja `app.js` como composición root (spec 004, pendiente).

## Pendiente: capa `student/` (supuesto)

Plan todavía no implementado: mover la orquestación a `src/student/*.service.js` (progreso,
gamificación, sesión, misiones, escenarios, filtros, materia), el render a `src/ui/`, y dejar
`app.js` como root. Si el código no coincide con esto, el código gana: es un plan, no un hecho.
