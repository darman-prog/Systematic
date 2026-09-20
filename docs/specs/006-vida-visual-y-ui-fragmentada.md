---
id: 006
status: implementada
created: 2026-09-20
updated: 2026-09-20
---

# 006 — Systematic: UI fragmentada y sistema de movimiento

## Objetivo y alcance
1. Reorganizar `src/ui/` en `pantallas/` (un módulo por pantalla) y `componentes/` (piezas
   reutilizables) para que la carpeta sea navegable.
2. Fragmentar `entrada.css` en parciales (`tokens`, `componentes`, `pantallas`) conservando el
   orden de cascada.
3. Incorporar un sistema de movimiento con tokens y momentos acotados que dé vida sin
   reintroducir slop, respetando `prefers-reduced-motion`.

## No-objetivos y zona congelada
El **área de diagramas está congelada** durante esta spec (el usuario trabaja en ella):
`src/core/diagramas.js`, `src/ui/diagramas.js`, `src/ui/casos.js`, el bloque de diagramas de
`entrada.css` (`#lienzo-diagrama`, nodos, etiquetas, modal de guarda) y sus tests/E2E no se
mueven ni se editan. Tampoco se anima el lienzo.

## Criterios de aceptación
1. La reorganización no cambia comportamiento: misma UI, mismos flujos y mismo formato de
   `localStorage` (lo protegen los 13 E2E y la migración legacy).
2. `src/ui/pantallas/` agrupa quiz, resultados, stats, estudio, apuntes, glosario, flashcards,
   misiones y escenarios (con sus tests); `src/ui/componentes/` agrupa `estados`, `tarjetas`,
   `anillo` y `avisos`; `helpers.js`, `iconos.js`, `diagramas.js` y `casos.js` quedan en la raíz
   de `ui/`.
3. `entrada.css` conserva `@tailwind` y el `@layer components`; `tokens.css`, `componentes.css` y
   `pantallas.css` se importan desde `main.js` en ese orden. La cascada no cambia (tokens ganan a
   las utilidades) y se corrige `.materia-card`, que usaba slate crudo.
4. Movimiento: tokens `--mov-rapida/base/enfasis` + un easing; momentos de entrada de pantalla,
   pop al acertar, estrella que salta, anillo que se dibuja, toast desde la derecha y contador de
   XP en el perfil. Con `prefers-reduced-motion` todo queda neutralizado y el contador no anima.
5. `npm run validar`, `npm run test`, `npm run build` y `npm run e2e` verdes y detector Impeccable
   con exit 0.

## Diseño mínimo
- Los componentes emiten HTML puro (sin estado ni DOM global) y reciben datos ya escapados por el
  llamador cuando corresponde.
- `avisos.js` conserva la firma de `toast(mensaje)`/`confeti()` que usan los callbacks de
  `src/student/gamificacion.js`; la composición no cambia.
- Los parciales de CSS usan `@apply` en reglas planas (sin `@layer` fuera de `entrada.css`) para
  no depender del manejo de capas entre archivos.

## Tareas ordenadas
1. Mover 9 módulos + 2 tests a `pantallas/` y actualizar imports.
2. Extraer `componentes/` (estados, tarjetas, anillo, avisos) y migrar llamadores.
3. Fragmentar el CSS en `tokens`/`componentes`/`pantallas`.
4. Sistema de movimiento y momentos.
5. Documentación (esta spec, ARCHITECTURE, DESIGN, TESTING) y handoff.

## Riesgos
- Churn de imports: mitigado con suite completa por paso.
- Cascada al dividir CSS: mitigada con orden de imports equivalente y verificación de estilos
  computados (tokens sobre utilidades).
- Motion → slop: tokens + momentos acotados + detector Impeccable; nada obligatorio.

## Pendientes (al descongelar diagramas) — EJECUTADOS

Al descongelarse la zona (el usuario cerró su trabajo del motor y el lienzo), se ejecutaron:

- `ui/diagramas.js` movido a `ui/componentes/diagramas.js` (lienzo compartido por quiz y casos).
- `ui/casos.js` movido a `ui/pantallas/casos.js`.
- `casos.js` adopta `componentes/estados.js`, `tarjetas.js` y `etiquetas.js` (nuevo módulo que
  centraliza el mapa `RATINGS` y el render de la etiqueta, antes duplicado con escenarios).
- `estilos/lienzo.css` extraído de `entrada.css` (incluye los overrides móviles del usuario).

Además, al cerrar su trabajo el usuario dejó la suite del motor pegada en `apuntes.test.js`; se
reubicó en `core/diagramas.test.js` (donde resuelve `./diagramas.js`), se restauraron los tests de
apuntes y se corrigió una expectativa (`miembrosMal` cuenta también los miembros sin asignar).

## Trazabilidad
- `refactor: agrupar las pantallas de ui en src/ui/pantallas` (`206edca`).
- `refactor: extraer componentes visuales compartidos en src/ui/componentes` (`6fe3887`).
- `refactor: fragmentar los estilos en tokens, componentes y pantallas` (`0faac9a`).
- `feat: sistema de movimiento con tokens y momentos acotados` (`69634aa`).
- Gates por paso: validar, 143 unitarios, build y 13 E2E; detector Impeccable exit 0.
