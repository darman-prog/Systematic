---
id: 003
status: aprobada
created: 2026-09-19
updated: 2026-09-19
---

# 003 — Systematic: ambiente de estudio y gamificación

## Objetivo y alcance
Sobre el refactor de `src/app.js` de la spec 002: aplicar la dirección visual única “Noche
calma” y añadir XP, niveles, logros, Contrarreloj, Supervivencia, misiones por tema, escenarios
multi-paso y preguntas de construcción de diagramas ER. Sin backend y sin cambiar `sys.*` ni
los ids de preguntas existentes.

## No-objetivos
- Modo claro/oscuro, ranking online, sincronización, simulador SQL, React, PWA y routing.

## Criterios de aceptación
1. Tokens en `src/estilos/entrada.css`: fondo `#1A1C22`, superficies `#22252D/#2B2F38`, texto
   cálido `#E7E5DE`, secundario `#A9ADB6`, azul niebla `#9BB8C9`, estados apagados; contraste
   WCAG AA, sin blanco/negro puros y `prefers-reduced-motion` respetado.
2. XP, nivel, racha e insignias visibles en materias; persistencia en `sys.xp`/`sys.logros`;
   feedback de logro y nivel sin castigo ni presión.
3. Contrarreloj (30s por pregunta) y Supervivencia (3 vidas, combo) funcionan y tienen tests.
4. Misiones por tema muestran estrellas 1/2/3, bloqueos y persistencia por materia.
5. Escenarios BD2, ISW y ASW son navegables, tienen feedback y pasan el validador.
6. El tipo `er` permite colocar entidades, conectar cardinalidades con mouse/touch y validar.
7. `npm run validar`, `npm run test`, `npm run build`, `npm run e2e` y detector Impeccable verdes.

## Diseño mínimo
- H1 usa la capa nueva `src/ui/` y tokens; no agrega `onclick` ni globals.
- `src/core/gamificacion.js`: XP, niveles, logros y reglas puras testeables.
- Nuevas claves: `sys.xp`, `sys.logros`, `sys.misiones.<materiaId>`, `sys.escenarios`.
- Nuevos módulos UI: `perfil`, `misiones`, `escenarios`, `er`; reciben estado y callbacks.
- Escenarios: pasos con opciones, feedback, `siguiente` o `fin`; validador de enlaces.
- ER: entidades y relaciones esperadas; comparación por conjunto no ordenado.

## Tareas ordenadas
1. Tokens Noche calma, estados y microinteracciones; documentar DESIGN/PRODUCT.
2. XP, niveles, logros, perfil y feedback.
3. Contrarreloj y Supervivencia.
4. Misiones por tema.
5. Motor, validador y contenido de escenarios.
6. Tipo ER, UI táctil y preguntas BD2.
7. E2E, detector visual, build y deploy.

## Riesgos
- El refactor elimina `window` y `onclick`: toda UI nueva debe usar `data-action` y el mapa de
  acciones existente.
- `app.js` debe seguir siendo orquestador; lógica nueva va a `core/` y render nuevo a `ui/`.
- ER en touch: fallback selección→conexión si drag de líneas falla.
- XP repetible: reducir recompensa de preguntas ya dominadas.

## Trazabilidad
Base refactorizada en `613cf28`; gates previos: validar, 42 tests, build y 6 E2E verdes.
Pendiente completar hitos y marcar `implementada` tras QA/deploy.
