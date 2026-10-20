# Changelog

Historial legible de cambios relevantes de Systematic. El detalle por commit vive en
`git log`; acá solo lo que cambia la experiencia o la arquitectura.

## Sin publicar (rama `refactor/limites-capas`)

- Refuerzo de límites y desacople de `app.js` ([ADR 010](docs/adr/010-app-js-composition-root.md),
  [ADR 011](docs/adr/011-limites-capas-y-contenido.md)): evaluación, misiones, estadísticas,
  selección de rondas y carga de contenido en `core`/`student`; controladores por feature;
  acciones por feature con guard de duplicados; `app.js` de 899 a 273 líneas.

## Sin publicar (rama `feat/modernizacion-y-contenido`)

- Desacople de `app.js` por extracción sin contenedor DI ([ADR 009](docs/adr/009-desacople-app-js.md)):
  confirmación, router, acciones por feature, controladores y timers.
- Confirmación propia Noche calma (reemplaza `confirm()` nativo) y aviso útil cuando la
  config no deja preguntas.
- Portada con primaria a lo ancho y secundarias compactas.
- Feedback de quiz unificado con siguiente paso (marcar para repaso + tema a revisar) y
  barra que avanza al responder.
- Barras en compositor (`--pct` + `scaleX`), headings continuos, acentos tenues y shake
  de fallo ([reporte anti-slop](docs/reporte-slop-2026-10-09.md)).
- Continuidad en el dashboard ("Sigue donde lo dejaste") y "Practicar mis débiles" en
  resultados.

## `main` (2026-10-08)

- Confirmación calmada, jerarquía de portada y feedback con siguiente paso.
