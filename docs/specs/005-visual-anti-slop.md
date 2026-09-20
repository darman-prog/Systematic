---
id: 005
status: implementada
created: 2026-09-20
updated: 2026-09-20
---

# 005 — Systematic: refinamiento visual anti-slop (refinamiento, no rediseño)

## Objetivo y alcance
Eliminar los patrones que denuncian generación automática manteniendo la identidad "Noche
calma": reemplazar los 100+ emojis usados como iconografía por un set propio de iconos SVG de
trazo, jerarquizar el home (antes una grilla de 10 cards idénticas), reducir el spam de badges
del quiz a una meta-línea con pills solo para estado vivo, unificar radios/sombras/hover y
calibrar (no quitar) confeti y toasts. Alcance: toda la app. Sin cambios de lógica, contenido,
persistencia ni accesibilidad ya implementada (teclado y roles del lienzo se preservan).

## No-objetivos
- No se cambia el tema, la paleta, la fuente (Segoe UI) ni el modo de juego; no hay rediseño de
  mundo visual (refinamiento según DESIGN.md vigente).
- No se toca la Parte A de la spec 004 ni los ítems 5-7 de su Parte C.
- Sin dependencias nuevas en runtime (los iconos son SVG inline; sin CDN).

## Criterios de aceptación
1. Cero emojis decorativos en `index.html` y `src/` (los glifos funcionales ★/☆ del marcador y
   ☑/☐ de selección múltiple permanecen); toda la iconografía sale de `src/ui/iconos.js`
   (SVG stroke 1.5, `currentColor`, viewBox 24).
2. El home distingue jerarquía: RepasoQuiz destacado, "Configurar práctica" como acción
   primaria a lo ancho y el resto como filas compactas; sin `hover:-translate-y-0.5` (hover
   cambia borde/fondo).
3. El quiz muestra una meta-línea informativa (pregunta · tema · tipo · dificultad) y como pills
   únicamente los estados vivos: temporizador, vidas, simulacro/repaso/modo.
4. Radios unificados (8/12px), `shadow-xl` reservado a overlays/toasts, `section-title` sin
   borde inferior, sin bordes dashed decorativos.
5. Logros y RATINGS usan claves del set de iconos; toasts y confeti se conservan, discretos.
6. `npm run validar`, `npm run test`, `npm run build` y `npm run e2e` verdes (los E2E actualizados
   a los nuevos nombres accesibles, sin depender de emojis) y detector Impeccable con exit 0.
7. Revisión con capturas desktop/móvil de home, quiz, resultados y casos sin regresiones de
   contraste AA (los iconos heredan `currentColor`).

## Diseño mínimo
- `src/ui/iconos.js`: `icono(nombre, clases)` devuelve el SVG; `existeIcono` y `NOMBRES_ICONO`
  para validación. Claves de modo usan el nombre del modo; alias (`corazon`, `cruz`, `llama`,
  `meta`) resuelven a la clave canónica.
- `LOGROS[].icono` y `MATERIAS[].icono` son claves del set (los ids no cambian; no hay
  migración de `localStorage`).
- El shell hidrata `[data-icono]` una vez al cargar (`pintarIconos` en `src/app.js`); los
  renders dinámicos llaman `icono()` directamente.
- CSS: `.icono` (20px) con variantes `.icono-sm` (16) y `.icono-lg` (22); los botones de acción
  mantienen texto con nombre de acción, el icono acompaña.

## Tareas ordenadas
1. Spec y actualización de DESIGN.md (lenguaje de iconos, jerarquía de home, reglas de
   badge/sombra/radio).
2. `src/ui/iconos.js` + `.icono` en CSS + test de claves referenciadas.
3. Home/materias/inicio: reemplazo de emojis estáticos y jerarquía de mode-cards.
4. Quiz: meta-línea, pills de estado vivo, iconos de acciones; actualizar E2E.
5. Superficies de contenido: resultados, estudio, flashcards, apuntes, glosario, escenarios y
   casos (RATINGS incluidos); dashed decorativo fuera.
6. Gamificación calibrada: perfil, toasts, logros con iconos del set.
7. Refino global de CSS (radios, sombras, section-title).
8. Gates + detector Impeccable + revisión con capturas.

## Riesgos
- Los nombres accesibles cambian (los E2E usaban texto con emoji): actualizar selectores y
  `aria-label` en el mismo commit de cada pantalla.
- La sustitución por SVG debe heredar `currentColor` o se rompe el contraste en estados
  semánticos; probado dentro de feedback, tags y chips.
- El `#safelist` de Tailwind (`index.html`) debe seguir conteniendo las clases usadas por
  renders dinámicos.

## Trazabilidad
- Auditoría anti-slop 2026-09-20 con evidencia en la sesión (emoji map de `index.html`,
  `src/ui/*`, `src/core/gamificacion.js`).
- Complementa (no modifica) specs 003/004; DESIGN.md sigue siendo la fuente del mundo visual.
