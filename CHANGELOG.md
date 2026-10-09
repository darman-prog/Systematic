# Changelog

Historial legible de cambios relevantes de Systematic. El detalle por commit vive en
`git log`; acá solo lo que cambia la experiencia o la arquitectura.

## Sin publicar (rama `feat/modernizacion-y-contenido`)

- Desacople de `app.js` por extracción sin contenedor DI ([ADR 009](docs/adr/009-desacople-app-js.md)):
  confirmación, router, acciones por feature, controladores y timers.
- Confirmación propia Noche calma (reemplaza `confirm()` nativo) y aviso útil cuando la
  config no deja preguntas.
- Portada con primaria a lo ancho y secundarias compactas.
- Feedback de quiz unificado con siguiente paso (marcar para repaso + tema a revisar) y
  barra que avanza al responder.

## `main` (2026-10-08)

- Confirmación calmada, jerarquía de portada y feedback con siguiente paso.
