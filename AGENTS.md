# AGENTS.md — Systematic

App de estudio para materias de ingeniería (Base de Datos 2, Ingeniería de Software,
Arquitectura de Software): práctica tipo quiz, simulacro, modo estudio, flashcards, glosario y
apuntes. Sitio estático desplegado en Vercel.

## Stack

- Frontend: JavaScript vanilla (sin framework) + HTML estático.
- Build: Vite. Estilos: Tailwind CSS 3.4 local (sin CDN en runtime).
- Datos: módulos JS en `src/datos/<materia>/` (`preguntas.js`, `glosario.js`, `apuntes.js`).
- Persistencia: `localStorage` con namespace `sys.*.<materiaId>` (sin backend ni cuentas).
- Tests: Vitest (unitario) y Playwright (smoke E2E). Validación de datos: `scripts/validar-datos.mjs`.
- Deploy: Vercel (preset Vite, salida `dist/`).

## Estructura

- `index.html` — shell de la app (pantallas y contenedores; acciones vía `data-action`, sin `onclick` inline).
- `src/app.js` — orquestación: estado, navegación, persistencia por materia y mapa de acciones delegadas
  (antes todo el JS vivía inline en `app.html`).
- `src/core/` — dominio testeable: materias (registro), progreso (localStorage inyectado), sesiones.
  Sin DOM ni ids de materia incrustados.
- `src/ui/` — render por pantalla (quiz, resultados, stats, estudio, glosario, flashcards, apuntes) con
  helpers compartidos; recibe estado por parámetro, no toca `localStorage` ni `src/datos/`.
- `src/estilos/entrada.css` — Tailwind + estilos de la app.
- `src/datos/` — contenido por materia (incluye presentación: colores de tema, keywords).
- `scripts/` — utilidades Node.js (validador de datos).
- `e2e/` — pruebas Playwright.
- `docs/specs/` — specs (formato de la skill `ingenieria-software`).
- `docs/adr/` — decisiones de arquitectura (formato Contexto/Decisión/Consecuencias/Alternativas).
- `BancoDeInformacion/` — material fuente (`*.md` convertidos; PDF/PPTX/DOCX no se versionan).

## Comandos

- `npm run dev` — servidor de desarrollo.
- `npm run build` — build de producción a `dist/`.
- `npm run preview` — sirve el build local.
- `npm run validar` — valida el schema de datos de todas las materias.
- `npm run test` — Vitest (unitario).
- `npm run e2e` — Playwright (smoke sobre el build).

## Convenciones

- Código e identificadores técnicos en inglés; contenido de estudio y UI en español.
- Archivos en `kebab-case`. Ids de BD2 (`P1-*`) se conservan; materias nuevas usan prefijo
  `ISW-*` / `ASW-*`.
- Contenido de materias nuevas: derivado únicamente de los `.md` de `BancoDeInformacion/`,
  con revisión humana por lote antes de commitear.
- Commits: Conventional Commits (`feat`, `fix`, `chore`, `build`, `test`, `docs`), uno por paso
  de plan; skills `workflow` y `uso-eficiente` como referencia.
- Editar archivos solo con herramientas que preserven UTF-8. Nunca hacer round-trips
  `Get-Content`/`Set-Content` de PowerShell 5.1: corrompen acentos y símbolos ( UTF-8 → U+FFFD).
- Sin secretos ni `.env` versionados; sin dependencias CDN en runtime.

## Deploy

- Repo: https://github.com/darman-prog/Systematic.git
- Vercel: importar el repo, preset Vite, build `npm run build`, output `dist/`.
- Rollback: instant rollback en Vercel y `git revert` en el repo.
