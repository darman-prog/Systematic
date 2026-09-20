---
id: 007
status: implementada
created: 2026-09-20
updated: 2026-09-20
---

# 007 — Systematic: identidad visual por materia

## Objetivo y alcance
Darle a la app un estilo propio (no genérico) usando lo que ya existe: acento de color por
materia, tipografía display self-hosted solo para titulares, portada de materia, favicon SVG y
`theme-color` dinámico, y superficies del navegador con la paleta. Sin tocar la zona congelada de
diagramas (spec 006) ni cambiar contenido ni lógica de negocio.

## No-objetivos
- Flip 3D de flashcards, urgencia animada en Contrarreloj y camino visual en Misiones: quedan como
  pases futuros (el segundo requiere tocar quiz.js/flashcards.js con calma).
- Modo claro, nuevas paletas, ilustraciones externas o dependencias de CDN.

## Criterios de aceptación
1. Al seleccionar una materia, `--materia-accent` toma su color y lo heredan el botón primario,
   la barra de progreso y los valores de stats; al volver a materias vuelve el valor base.
   Contraste AA verificado: las tres materias usan pasteles claros con texto oscuro (~8:1).
2. Los titulares (h1/h2) usan Source Serif 4 self-hosted vía `@fontsource` (sin CDN); el cuerpo
   queda en la fuente del sistema. La fuente viaja en el bundle de Vite.
3. `screen-start` muestra una portada: tile tintado con el acento + icono de la materia, nombre y
   descripción.
4. Favicon SVG propio en `public/logo.svg` y `<meta name="theme-color">` que sigue el acento de la
   materia (vuelve a `#1a1c22` en materias).
5. Scrollbar y caret usan la paleta.
6. `npm run validar`, `npm run test`, `npm run build` y `npm run e2e` verdes; detector Impeccable
   exit 0.

## Diseño mínimo
- Un solo par de variables: `--materia-accent` y `--materia-accent-texto` (fijas en tokens.css con
  valores base; app.js las sobreescribe al seleccionar).
- `--fuente-display: "Source Serif 4", Georgia, serif` en tokens.css; regla `h1, h2` en
  componentes.css.
- El tile de portada usa `color-mix` al 16 % sobre transparente; degradación graceful en
  navegadores viejos (fondo transparente).

## Tareas ordenadas
1. Acento por materia (tokens + botón primario + progreso + stats + wiring en app.js).
2. Tipografía display self-hosted.
3. Portada, favicon, theme-color y superficies del navegador.
4. Documentación (esta spec y DESIGN.md).

## Riesgos
- Contraste del acento: las tres materias son pasteles claros con texto `--study-bg` (~8:1); si se
  agregara una materia con color oscuro, habría que definir su `--materia-accent-texto`.
- `color-mix` (2023+): degrada a fondo transparente, sin romper.
- Peso de la fuente: solo pesos 600/700, subset latin (~26 kB por peso en el bundle).

## Trazabilidad
- `feat: acento por materia en acciones, progreso y stats` (`1b21312`).
- `feat: tipografia display Source Serif 4 en titulares` (`5af9bf6`).
- `feat: portada de materia, favicon SVG y superficies del navegador` (`9c3fd38`).
- Verificación con E2E temporal: acento por materia, `theme-color`, fuente aplicada y capturas.
