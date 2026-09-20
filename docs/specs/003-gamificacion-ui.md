---
id: 003
status: implementada
created: 2026-09-19
updated: 2026-09-20
---

# 003 — Systematic: ambiente de estudio y gamificación

## Objetivo y alcance
Sobre el refactor de `src/app.js` de la spec 002: aplicar la dirección visual única “Noche
calma” y añadir XP, niveles, logros, Contrarreloj, Supervivencia, misiones por tema, escenarios
multi-paso, constructor generalizado de diagramas (ER, UML de clases, casos de uso,
actividades) y modo independiente “Casos de diagramación”. Sin backend y sin cambiar `sys.*`
ni los ids de preguntas existentes.

## No-objetivos
- Modo claro/oscuro, ranking online, sincronización, simulador SQL, React, PWA y routing.
- Escenarios con pasos de tipo diagrama (sería la evolución futura del modo de casos, no comprometida).

## Criterios de aceptación
1. Tokens en `src/estilos/entrada.css`: fondo `#1A1C22`, superficies `#22252D/#2B2F38`, texto
   cálido `#E7E5DE`, secundario `#A9ADB6`, azul niebla `#9BB8C9`, estados apagados; contraste
   WCAG AA, sin blanco/negro puros y `prefers-reduced-motion` respetado.
2. XP, nivel, racha e insignias visibles en materias; persistencia en `sys.xp`/`sys.logros`;
   feedback de logro y nivel sin castigo ni presión.
3. Contrarreloj (30s por pregunta) y Supervivencia (3 vidas, combo) funcionan y tienen tests.
4. Misiones por tema muestran estrellas 1/2/3, bloqueos y persistencia por materia.
5. Escenarios BD2, ISW y ASW son navegables, tienen feedback y pasan el validador.
6. El constructor soporta ER (no dirigido, cardinalidad), clases (dirigido, relaciones +
   asignación de miembros), casos de uso (dirigido, include/extend) y actividades (dirigido,
   con guardas); funciona con mouse y touch; `npm run validar` valida los 4 subtipos y su
   contenido pasa revisión del usuario.
7. El modo “Casos de diagramación” lista casos narrativos, construye el diagrama con el mismo
   lienzo, calcula rating y persiste el mejor resultado por caso.
8. `npm run validar`, `npm run test`, `npm run build`, `npm run e2e` y detector Impeccable verdes.

## Diseño mínimo
- H1 usa la capa nueva `src/ui/` y tokens; no agrega `onclick` ni globals.
- `src/core/gamificacion.js`: XP, niveles, logros y reglas puras testeables.
- Nuevas claves: `sys.xp`, `sys.logros`, `sys.misiones.<materiaId>`, `sys.escenarios`.
- Nuevos módulos UI: `perfil`, `misiones`, `escenarios`, `diagramas` (lienzo reutilizable),
  `casos`; reciben estado y callbacks.
- Escenarios: pasos con opciones, feedback, `siguiente` o `fin`; validador de enlaces.
- Tipo `diagrama` con `subtipo` (`er` | `uml-clases` | `casos-uso` | `actividades`):
  `nodosPool`, `miembrosPool`, `relacionesEsperadas [{de, a, tipo}]`, `tiposArista` y
  `nodosFijos` opcionales; validación por conjunto con dirección por subtipo (ER es no
  dirigido). Guardas de actividades y miembros de clases viajan en el schema (sin texto libre).
- Modo “Casos de diagramación”: lista de casos con narrativa + diagrama del mismo schema,
  rating por % (`≥80` éxito · `≥50` parcial), XP éxito +60 / parcial +25, mejor rating en
  `sys.casos-diagrama` y logro “Arquitecto”.

## Tareas ordenadas
1. Tokens Noche calma, estados y microinteracciones; documentar DESIGN/PRODUCT.
2. XP, niveles, logros, perfil y feedback.
3. Contrarreloj y Supervivencia.
4. Misiones por tema.
5. Motor, validador y contenido de escenarios.
6a. Motor del lienzo SVG + tipo ER + POC drag/touch; 3-4 preguntas ER en BD2.
6b. Subtipos UML/casos-uso/actividades + guardas como tipo de arista + miembros en pool;
   contenido ~10 diagramas (ER 3-4 BD2 · clases 3 ASW/ISW · casos de uso 2 · actividades 2).
6c. Modo “Casos de diagramación” (lista → caso → lienzo → rating) + contenido de ~5-6 casos.
7. E2E, detector visual, build y deploy.

## Riesgos
- El refactor elimina `window` y `onclick`: toda UI nueva debe usar `data-action` y el mapa de
  acciones existente.
- `app.js` debe seguir siendo orquestador; lógica nueva va a `core/` y render nuevo a `ui/`.
- ER en touch: fallback selección→conexión si drag de líneas falla.
- XP repetible: reducir recompensa de preguntas ya dominadas.

## Trazabilidad
Refactor base `613cf28`. H1 Noche calma y docs `c44f78c`/`06e32ad`; H2 `14569cf`; H3
`2cfd826`; H4 `73d9ab1`; H5 `fb31527`; spec ampliada `b71cecf`; H6a `d8e254e`; H6b
`049222a`; H6c `d2d0a1b`.

Gates al cierre H6c: `npm run validar` (3 materias · 160 preguntas · 79 términos),
`npm run test` (100 unitarios), `npm run build` y `npm run e2e` (12) verdes.

Pendiente de verificación manual del cliente: detector visual Impeccable (no es un comando
del repo en este entorno). Deploy por Vercel a partir de `main`.
