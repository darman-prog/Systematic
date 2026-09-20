---
id: 002
status: aceptada
created: 2026-09-19
updated: 2026-09-19
---

# ADR 002: Eliminar globales de `window` y `onclick` inline, a favor de delegación de eventos con `data-action`

## Contexto

`index.html` usa ~40 atributos `onclick="fn()"` y `src/app.js` publica ~61 funciones con
`Object.assign(window, {...})` (app.js:1780-1842) para conectar template y lógica. El acoplamiento
no es verificable estáticamente: un rename silencioso rompe la UI solo en runtime y ningún test
unitario lo detecta. Además, puebla el scope global.

## Decisión

Los elementos interactivos declaran `data-action="nombre"` en el HTML; `src/app.js` registra un
único listener delegado de eventos y resuelve la acción desde un mapa `{ nombre: fn }` privado del
módulo. No se publica nada en `window`. Los listeners existentes de `keydown`, `visibilitychange`
y los puntuales del quiz se conservan; la delegación solo sustituye el `onclick` declarativo.

## Consecuencias

Positivas: acoplamiento estático verificable (grep/rename seguro); sin contaminación del scope
global; un solo punto de registro de acciones facilita debugging.

Negativas y mitigaciones: el vínculo template↔acción deja de verse en el HTML y hay que buscarlo
en el mapa de acciones — se mitiga nombrando las acciones igual que la función que ejecutan y
concentrándolo en un único bloque de `app.js`.

## Alternativas descartadas

- `addEventListener` individual por botón en JS: requiere tocar cada elemento al renderizar dinámico
  y dispersa el wiring; la delegación centraliza.
- Mantener `onclick` inline: conserva el runtime-failure silencioso, que es el problema a resolver.
- Framework de componentes: fuera de alcance (ver ADR 001).
