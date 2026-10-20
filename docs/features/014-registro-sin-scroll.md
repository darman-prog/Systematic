---
id: 014
status: cerrada
date: 2026-10-20
tipo: modificación
---
# Cambio — registro sin scroll en portátiles

> El registro compacta su layout por altura para no scrollear en 1440x900, 1366x768 y 1280x720.

## Cambio
`data-vista="register"` activa tres breakpoints (≤1040, ≤820, ≤740) que reducen padding, logo y gaps; en alturas bajas ocultan subtítulo/eyebrow. El login no cambia.

## Por qué
La card del registro medía ~1037px y scrolleaba en portátiles; el login se mantiene aireado.

## Dónde mirar
- `src/estilos/cuenta.css` (media queries `max-height`), `src/ui/cuenta/autenticacion.js` (`data-vista`) y `e2e/onboarding.spec.js`.

## Verificación
`rtk playwright test e2e/onboarding.spec.js`; `scrollHeight ≤ innerHeight + 1` a 1366x768 y 1280x720.

## Evidencia
- Commit de este cambio; medición register 720/720, 768/768, 900/900, 1080/1080.
