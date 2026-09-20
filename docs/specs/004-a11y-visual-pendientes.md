---
id: 004
status: borrador
created: 2026-09-20
updated: 2026-09-20
---

# 004 — Requisitos de accesibilidad y visual pendientes (inyección en spec 003 + residual)

Pre-spec derivada de la auditoría UI-UX del 2026-09-20. Para qué sirve: define los requisitos de
accesibilidad que el agente de la spec 003 (H6a/H6b/H6c/H7) debe incorporar en sus pasos, y los
fixes residuales que quedan para después de su paso 5. No introduce features nuevas.

## Parte C — Absorbida por la spec 003 (requisitos por paso)

### H6a — Lienzo SVG + tipo ER
1. Lienzo operable por teclado: modo selección→conexión con Enter/Espacio; flechas para mover
   nodos; `Esc` deselecciona. (El fallback de touch previsto en la spec 003 sirve de base.)
2. `aria-live` anunciando selección/conexión ("Nodo X seleccionado", "Conectados A–B").
3. Foco gestionado: al montar el lienzo y tras cada pregunta, el foco va a un control real
   (nunca queda en `body`). WCAG 2.4.3.
4. Keydown global: ignorar atajos 1/2/3/Enter cuando `e.target` sea `input`/`textarea`. WCAG 2.1.1/2.1.4.
5. Si se toca el render de dragdrop en `src/ui/quiz.js`: piezas/huecos como `<button>` focusables
   con `aria-pressed` (hoy `<div draggable tabindex=-1>`, quiz.js:416/:519). WCAG 2.1.1.

### H6b — Subtipos UML/casos-uso/actividades
6. `aria-pressed` en toggles (nodos, tipos de arista, chips); errores de guardas con texto, no
   solo borde rojo. WCAG 1.4.1/4.1.2.
7. Controles del lienzo (agregar/conectar/borrar) con nombre accesible y target ≥24px (ideal 44px
   en móvil). WCAG 2.5.8/2.5.5.

### H6c — Modo Casos + rating
8. Foco al heading al entrar a la pantalla; rating final anunciado con `aria-live`; lista de
   casos como lista de `<button>`; sin `onclick` ni globales (usar `data-action` + `ACCIONES`).

### H7 — QA + deploy
9. 1 e2e nuevo de teclado sobre el lienzo; recorrido teclado-only de las pantallas nuevas;
   verificación de tokens AA (ya en criterio 1 de la 003) incluyendo markup generado por JS.

## Parte A — Residual post-paso-5 (lo ejecuta plan/QA, no el agente de la 003)

1. `aria-label` o `<label class="sr-only">` en `#study-search`, `#apuntes-search`,
   `#glosario-search` y `#dev-texto` (hoy placeholder como único label). WCAG 1.3.1/3.3.2.
2. Gráfica de stats (`src/ui/stats.js:147-194`): `role="img"` + `aria-label` con resumen (o tabla
   oculta equivalente); redibujar en `resize`. WCAG 1.1.1.
3. `aria-hidden="true"` en emojis decorativos; `aria-pressed` + label dinámico en `#star-btn`
   (hoy estado ★/☆ solo visual).
4. Contraste residual en markup generado por JS contra la paleta Noche calma: `app.js:645-646`
   (peor-row), `helpers.js:82,92`, `stats.js:180-181` (eje del canvas ≈3:1). WCAG 1.4.3.
5. Re-auditoría completa (teclado + responsive + lector) incluyendo pantallas nuevas
   (lienzo, Casos, perfil/misiones) antes de cerrar esta spec.

## Criterios de aceptación
1. Los 9 requisitos de la Parte C implementados y verificados por el agente de la 003 en H7.
2. Los 5 puntos de la Parte A ejecutados tras el paso 5 de la 003, con gates verdes
   (`validar`/`test`/`build`/`e2e`).
3. `npm run e2e` incluye el test de teclado del lienzo.
4. Esta spec pasa a `implementada` solo tras la re-auditoría post-003 sin críticos abiertos.

## Trazabilidad
- Auditoría UI-UX 2026-09-20: 3 críticos, 5 altos, 3 medios (evidencia en la sesión).
- Base actual: `main` con spec 003 H5 en `fb31527`; H6a-H6c/H7 en curso.
- Relación: la Parte C es delta de la spec 003 (no la modifica, la complementa); la Parte A
  es trabajo nuevo diferido.
