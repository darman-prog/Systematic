---
id: 001
status: aceptada
created: 2026-09-19
updated: 2026-09-19
---

# ADR 001: Arquitectura en capas — dominio puro en `src/core/`, render en `src/ui/`, orquestación en `src/app.js`

## Contexto

Systematic es una app estática (JS vanilla + Vite) sin backend. El JS nació inline en `app.html`
y se extrajo a módulos. Había que decidir dónde viven la lógica de negocio (repetición espaciada,
sesiones), el acceso a `localStorage` y el render, sin introducir un framework.

## Decisión

- `src/core/` — dominio y casos de uso puros: `materias.js` (registro de materias y datos),
  `progreso.js` (Leitner + persistencia con `storage` inyectado), `sesiones.js` (funciones puras
  con `rng` inyectable). Sin DOM, sin `localStorage` global, testeable en aislamiento con mocks
  en memoria.
- `src/ui/` — módulos de render por feature (`apuntes.js` y, desde la spec 002, un módulo por
  pantalla). Producen HTML/actualizan contenedores recibidos por parámetro; no leen estado global.
- `src/app.js` — orquestación: estado de la app, navegación, persistencia por materia pasando
  `localStorage` a las primitivas de core, y registro de acciones.
- `src/datos/` — contenido por materia, independiente del código.

La Dependency Rule apunta hacia adentro: `core` no conoce UI ni persistencia concreta; `ui` no
importa de `datos` (recibe los datos como parámetros).

## Consecuencias

Positivas: lógica de negocio testeada sin DOM (Vitest con storage/rng en memoria); agregar
materias es data-driven; el contenido no contamina el dominio.

Negativas y mitigaciones: el puente hacia el DOM requiere que `app.js` conecte capas — se mitiga
manteniendo `app.js` delgado (spec 002) y con e2e de humo sobre el build.

## Alternativas descartadas

- Framework (React/Vue): MVP sin build complejo ni equipo frontend dedicado; vanilla es suficiente.
- Todo en un solo archivo (estado anterior, inline en `app.html`): innavegable y no testeable.
- Persistencia como objeto global compartido: dificulta tests y namespaces por materia; se prefiere
  inyección del storage.
