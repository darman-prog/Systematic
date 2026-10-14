# Spec 012 — Plan de mejoras de UI/UX (rama actual)

**Estado:** en progreso
**Rama:** `qwen-code-6042f4d1-3a4d-48ae-86c0-be7f6f261a25` (se trabaja en la misma rama para ver todo en conjunto, según confirmación del usuario)
**Depende de:** `reporte-slop-2026-10-09.md`, spec 004 (a11y), DESIGN.md

## Contexto
El diagnóstico separa lo ya resuelto de lo pendiente:
- **Ya resuelto (verificado en código):** transiciones de barras con `scaleX` + `transform-origin` (`componentes.css` l.139/813, `pantallas.css` l.188), flip 3D de flashcards (`perspective: 1000px` + `.flipped`, l.991–1003), tokens de movimiento y fallback global `prefers-reduced-motion` (`tokens.css` l.56 y bloques en componentes/pantallas).
- **Pendiente:** fases A–D de este plan.

## Fases

### Fase A — Accesibilidad (spec 004)
- [x] Etiqueta accesible en el textarea de preguntas de desarrollo (`quiz.js`, label `sr-only` "Tu respuesta").
- [x] Etiquetas y roles ARIA en buscadores e inputs de filtro por materia (sr-only labels + `aria-controls` + `role="group"` en Estudio, Apuntes y Glosario).
- [x] Chips/filtros como `role="group"` con `aria-pressed` (estudio.js, apuntes.js, glosario.js, config.js; también estrellas de favoritos).
- [x] Foco visible consistente en todos los interactivos (verificado: no queda ningún `focus:outline-none`; hay reglas `:focus-visible` en componentes/pantallas).
- [x] Auditoría axe-core sobre las pantallas principales (resultados en `docs/auditoria/a11y-*.json`; violaciones corregidas en lenguaje.js, home.js, misiones.js y flashcards.js — scrollable-region-focusable resuelto con altura auto).

### Fase B — Sistema tipográfico y tokens
- [ ] Escala tipográfica explícita (h1→h3 con pasos definidos) en lugar de jerarquía plana.
- [ ] Migrar valores hardcodeados fuera de rampa a tokens de `tokens.css`.
- [ ] Eliminar remap de clases Tailwind crudas que falsean el detector anti-slop.
- [ ] Contraste manual AA en texto secundario y acentos por materia.

### Fase C — Animación e interacción
- [x] Urgencia visual en modo Contrarreloj (ya existía: clase `timer-low` + pulso `pulseSoft` bajo 10s en `ronda.js`/`componentes.css`).
- [x] Camino progresivo animado en Misiones: los conectores entre nodos se rellenan de oro al completarse la misión (`:has(.mision-completada)` con transición de tokens). Se corrigió además un bug: el acento por materia de la misión "siguiente" desaparecía para usuarios con `prefers-reduced-motion` porque se aplicaba detrás del guard de motion; ahora el acento (no-motion) siempre se aplica y solo la animación respeta el fallback CSS global.
- [x] Micro-interacciones de refuerzo (ya existían: `popIn` en aciertos, `shakeX` en fallos, usando `--mov-base`/`--mov-ease`).

### Fase D — Gates de validación
- [x] `npm run validar` y `npm test` verdes (312/312).
- [x] `npm run build` sin errores.
- [ ] `npm run e2e` estable.
- [ ] Re-auditoría anti-slop y axe-core sin regresiones.

## Registro de avance
| Fecha | Hito | Estado |
|---|---|---|
| 2026-10-14 | Creación de la spec; inventario de lo ya resuelto vs. pendiente | ✅ |
| 2026-10-14 | Fase A parcial: label accesible en textarea de desarrollo; verificado foco visible sin regresiones | ✅ |
| 2026-10-14 | Fase C: urgencia contrarreloj confirmada existente; conectores dorados animados en Misiones + fix de acento con reduced-motion | ✅ |
| 2026-10-14 | Gates: `npm run validar` ✔ · `npm test` 312/312 ✔ · `npm run build` ✔ (e2e pendiente de ejecución local) | ✅ |
| 2026-10-14 | **Fase A COMPLETA**: buscadores con label/`role="group"`, chips con `aria-pressed`, auditoría axe-core con violaciones resueltas; fix flashcard scroll + rediseño sin scroll interno (commit `8b7b97a`) | ✅ |
| — | Fase B completa (tipografía/tokens) | ⏳ |
| — | Fase D restante: `npm run e2e` estable + re-auditoría anti-slop | ⏳ |
