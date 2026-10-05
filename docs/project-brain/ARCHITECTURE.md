---
status: vigente
last_reviewed: 2026-10-05
confidence: confirmado
source: código + ADR 001-008
---

# Arquitectura

Cómo está dividido el código y dónde vive cada responsabilidad. Leelo antes de mover, extraer o
agregar módulos, y al revisar un cambio que cruce capas.

## Capas actuales

La Dependency Rule apunta hacia adentro: el dominio no conoce UI ni persistencia concreta.

| Capa | Carpeta | Responsabilidad |
|---|---|---|
| Dominio | `src/core/` | Reglas puras, agrupadas por subdominio: `registro/materias.js` (registro de tracks), `estudio/` (progreso con `storage` inyectado, sesiones con `rng` inyectable, mezclador y questionSelector), `juego/` (gamificacion: XP/niveles/logros; escenarios: motor multi-paso), `lenguaje/competencia.js` (barra y gate de etapas, spec 011), `nube/snapshot.js` (snapshot serializable del estado para el respaldo, ADR 008) y `diagramas/diagramas.js` (estado del tablero, conexiones por subtipo, guardas, evaluación y rating). `index.js` re-exporta la API pública; los consumidores importan de ahí, no de las rutas internas (ADR 007) |
| Aplicación | `src/student/` | Servicios del recorrido del estudiante con dependencias inyectadas: `persistencia.js` (claves `sys.*` centralizadas y CRUD con `storage`), `gamificacion.js` (XP, logros, racha y perfil; presentación por callbacks), `registros.js` (fusiones puras de mejor resultado), `firebase.js` (adaptador lazy de Auth/Firestore), `cuenta.js` (sesión), `nube.js` (subir/bajar respaldo) y `aplicar.js` (pisa el estado local al restaurar), todos ADR 008 |
| Render | `src/ui/` | `aprendizaje/` con un módulo por pantalla de práctica (`quiz.js`, `resultados.js`, `estudio.js`, `glosario.js`, `flashcards.js`, `escenarios.js`, `apuntes.js`, `casos.js`, `lenguaje.js`), `dashboard/` con los datos del estudiante (`stats.js`, `misiones.js`) y `cuenta.js` + `cuenta/autenticacion.js` (acceso y sesión, ADR 008); `componentes/` con piezas compartidas (`estados.js`, `tarjetas.js`, `etiquetas.js`, `anillo.js`, `avisos.js`, `diagramas.js` como lienzo); en la raíz quedan los compartidos `helpers.js`/`iconos.js`. Reciben estado explícito y no leen estado global ni `localStorage` |
| Composición | `src/app.js` | Estado de la app, navegación, persistencia por materia y mapa de acciones `ACCIONES` con un único listener delegado |
| Contenido | `src/datos/{materias,lenguajes}/<track>/` | Preguntas, glosario, apuntes, escenarios, casos, roadmap y presentación (colores/keywords) por track |

`src/main.js` importa estilos y arranca `app.js`. `index.html` es el shell con las pantallas.

`src/ui/componentes/diagramas.js` es un componente compartido: el quiz lo usa para el tipo de pregunta
`diagrama` y el modo de casos lo instancia aparte con `obtenerItem`/`obtenerEstado`/`guardarEstado`,
sin acoplarse a la sesión del quiz.

## Decisiones estructurales

- [ADR 001](../adr/001-arquitectura-capas.md): capas, dominio puro y dependencias hacia adentro.
- [ADR 002](../adr/002-eliminacion-window-globales.md): eventos por `data-action` y mapa de acciones; sin globales en `window` ni `onclick` inline.
- [ADR 003](../adr/003-contenido-desacoplado-de-ui.md): el contenido específico por materia vive en `src/datos/`, no en core ni UI.
- [ADR 004](../adr/004-capa-servicios-student.md): servicios de aplicación en `src/student/` con dependencias inyectadas (persistencia, gamificación y registros).
- [ADR 007](../adr/007-estructura-por-subdominios.md): organización por subdominios en `core/` (con barrel `index.js`), `datos/` (materias/lenguajes) y `ui/` (dashboard/aprendizaje).
- [ADR 008](../adr/008-cuenta-y-sincronizacion-firestore.md): cuenta opcional (Firebase Auth) y respaldo del progreso en Firestore; `localStorage` sigue siendo la fuente de verdad y la app funciona sin claves configuradas.

## Deuda conocida

`src/app.js` sigue concentrando navegación, filtros de práctica, sesión/timers y el mapa
`ACCIONES`, y supera las 1.000 líneas; el objetivo de la [spec 002](../specs/002-refactor-app-js.md)
era quedar por debajo de ~400. El [ADR 004](../adr/004-capa-servicios-student.md) ya extrajo la
capa `src/student/` con persistencia, gamificación y registros (con tests propios).

## Pendiente: resto de la capa `student/` (supuesto)

Falta mover materia/filtros, sesión con clock inyectable y dividir el mapa `ACCIONES` por
pantalla (con un test que falle ante claves duplicadas), dejando `app.js` como composición root.
Si el código no coincide con esto, el código gana: es un plan, no un hecho.
