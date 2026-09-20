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
| Aplicación | `src/student/` | Servicios del recorrido del estudiante con dependencias inyectadas: `persistencia.js` (claves `sys.*` centralizadas y CRUD con `storage`), `gamificacion.js` (XP, logros, racha y perfil; presentación por callbacks), `registros.js` (fusiones puras de mejor resultado) |
| Render | `src/ui/` | `pantallas/` con un módulo por pantalla (`quiz.js`, `resultados.js`, `stats.js`, `estudio.js`, `glosario.js`, `flashcards.js`, `misiones.js`, `escenarios.js`, `apuntes.js`) y `componentes/` con piezas compartidas (`estados.js`, `tarjetas.js`, `anillo.js`, `avisos.js`); en la raíz quedan `diagramas.js` (lienzo), `casos.js` (zona de diagramas) y los compartidos `helpers.js`/`iconos.js`. Reciben estado explícito y no leen estado global ni `localStorage` |
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
- [ADR 004](../adr/004-capa-servicios-student.md): servicios de aplicación en `src/student/` con dependencias inyectadas (persistencia, gamificación y registros).

## Deuda conocida

`src/app.js` sigue concentrando navegación, filtros de práctica, sesión/timers y el mapa
`ACCIONES`, y supera las 1.000 líneas; el objetivo de la [spec 002](../specs/002-refactor-app-js.md)
era quedar por debajo de ~400. El [ADR 004](../adr/004-capa-servicios-student.md) ya extrajo la
capa `src/student/` con persistencia, gamificación y registros (con tests propios).

## Pendiente: resto de la capa `student/` (supuesto)

Falta mover materia/filtros, sesión con clock inyectable y dividir el mapa `ACCIONES` por
pantalla (con un test que falle ante claves duplicadas), dejando `app.js` como composición root.
Si el código no coincide con esto, el código gana: es un plan, no un hecho.
