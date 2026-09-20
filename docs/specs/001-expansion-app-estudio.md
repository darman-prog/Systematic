---
id: 001
status: aprobada
created: 2026-09-19
updated: 2026-09-19
---

# 001 — Systematic: app de estudio multipropósito desplegada en Vercel

## Objetivo y alcance
Convertir la app actual (`app.html` + `banco-preguntas.js` + `glosario.js`, solo BD2) en una app
de estudio de 3 materias (Base de Datos 2, Ingeniería de Software, Arquitectura de Software) con
selección de materia, progreso aislado en localStorage y deploy público en Vercel. Se conserva
toda la lógica interactiva; se agrega build (Vite + Tailwind local). El contenido de las materias
nuevas (preguntas, glosario y apuntes curados) se deriva **exclusivamente** de los 11 `.md` de
`BancoDeInformacion/` y pasa por revisión del usuario antes de publicarse. BD2 conserva su banco
actual de 87 preguntas.

## No-objetivos (MVP)
- Backend, cuentas y sincronización (progreso local + export/import únicamente).
- Migración a framework (React/Vue/Svelte) y routing SPA.
- Extracción de las 144 imágenes de slides (diferido; hoy huérfanas).
- Visor de los `.md` crudos; regenerar el banco de BD2; PWA/offline; i18n.
- Publicar PDF/PPTX originales en el sitio.

## Criterios de aceptación
1. `npm run build` genera `dist/` sin errores; `npm run preview` sirve la app completa.
2. Home lista 3 materias; cada una con sus modos (práctica, simulacro, garantizadas, estudio,
   flashcards, glosario) y estadísticas independientes; ISW/ASW incluyen además Apuntes.
3. El progreso BD2 previo (`quizBD2.*`) migra una sola vez a `sys.*.bd2` sin pérdida; el
   import v1 sigue funcionando.
4. ISW y ASW tienen, revisadas por el usuario: ≥30 preguntas, ≥10 términos de glosario y
   ≥1 apunte por unidad/tema fuente; `npm run validar` pasa (ids únicos, rangos de
   `correct`/`correctos`, `{n}` de dragdrop ↔ `respuestas`, tipos válidos, apuntes con fuente).
5. `npm run test` (Vitest) y `npm run e2e` (Playwright smoke) verdes sobre el build.
6. Tailwind se sirve del bundle local (sin `cdn.tailwindcss.com`); sin requests a terceros.
7. URL pública en Vercel verificada en producción (mobile + desktop, flujos críticos).
8. `AGENTS.md` y esta spec persistida (`docs/specs/001-*.md`, `aprobada` antes del commit).

## Estado de decisiones
- Confirmadas (usuario, 2026-09-19): 3 materias; vanilla + Vite + Tailwind local; contenido IA
  con revisión; progreso local; GitHub + Vercel listos; BD2 intacto; apuntes curados incluidos;
  imágenes no se extraen por ahora.
- Repo confirmado: https://github.com/darman-prog/Systematic.git
- Supuestos: Node ≥20 y npm locales; los 11 MD bastan como fuente para ISW/ASW.
- Pendientes: cantidad final por materia (mínimos del criterio 4); cobertura de temas sin
  contenido extraíble (slides solo-imagen) se documenta en cada lote.

## Evidencia
- `app.html:1-2066` — app completa; JS inline `app.html:307-2064`; CDN `app.html:7`; claves
  `app.html:310-313`; export/import `app.html:489-533`; sesión/timer `app.html:711-725`,
  `app.html:1037-1075`; textos específicos de BD2 `app.html:140-149`, `app.html:200`.
- `banco-preguntas.js:1-1327` — 87 preguntas, 8 tipos, todas "Parcial 1"; `ref` sin uso en UI
  apunta a `InfoQuiz.md` inexistente (p. ej. `banco-preguntas.js:12`).
- `glosario.js:1-277` — glosario SQL + tips.
- BancoDeInformacion (inventario 2026-09-19): 11 MD = ISW 6 (5 PPTX ~145 slides + 1 DOCX) y
  Arq 5 (PDF, ~145 bloques sin encabezados); 144 refs a imágenes huérfanas; 59 líneas con
  pseudo-tablas rotas en 3 MD de Arq; no existe ningún MD de Base de Datos.
- No existían: git, `package.json`, tests, `AGENTS.md`, `docs/`.

## Diseño mínimo
Estructura destino:
```
index.html
package.json · vite.config.js · Tailwind 3.4 (PostCSS)
src/app.js · src/ui/* · src/core/{materias,progreso,sesiones,datos}.js
src/estilos/entrada.css
src/datos/{bd2,isw,asw}/{preguntas,glosario,apuntes}.js
scripts/validar-datos.mjs · e2e/*.spec.js
AGENTS.md · README.md · docs/specs/001-expansion-app-estudio.md
```
Capa única: frontend estático (UI + lógica + datos). Sin backend/BD/API.

Contrato de datos:
- `materia: { id, nombre, icono, descripcion, color, preguntas[], glosario{categorias,terminos,tips}, apuntes[] }`.
- Pregunta: schema actual (`banco-preguntas.js:1`) con id prefijado por materia; BD2 conserva
  ids `P1-*`; opcionales `real`, `caso`, `diagrama`, `datos`, `claves`.
- Apunte: `{ id, tema, titulo, contenido (markdown), fuente ("BancoDeInformacion/…md") }`;
  contenido en español, curado y revisado; render con `marked` + sanitización.
- Progreso: `sys.{progreso|historial|actividad|meta}.<materiaId>`; migración one-time
  `quizBD2.* → sys.*.bd2` (flag `sys.migracion.v1`, no borra claves viejas); export v2 con
  materia; import acepta v1 (asume bd2).

## Tareas ordenadas (= plan de ejecución, 1 commit por tarea)
1. Fundación: `git init`, `.gitignore`, `AGENTS.md`, persistir esta spec.
2. Migrar a Vite + Tailwind local sin cambio de comportamiento.
3. Multi-materia: registro, datos bd2, namespacing + migración, selector, temas visuales; tests.
4. Validador de datos (preguntas/glosario/apuntes) + tests con fixtures + empty states.
5. Sección Apuntes (UI + render markdown + búsqueda).
6. Contenido ISW por fuentes: apuntes + lotes de preguntas + glosario, revisión del usuario.
7. Contenido ASW idem (interpretar texto de PDF desordenado).
8. QA pre-deploy: Playwright smoke + correcciones.
9. Deploy Vercel + verificación en producción + README con URL.

Reglas de generación: cada ítem cita su MD fuente; fidelidad sobre cantidad; fragmentos
ininteligibles no generan contenido; slides solo-imagen se excluyen y documentan; apuntes sin
copiar literal. Validación por tarea: build/preview + `npm run validar` + `npm run test` +
smoke manual; `npm run e2e` desde la tarea 8.

## Riesgos y edge cases
- Regresión al extraer JS inline → ids DOM intactos, smoke checklist, tests de core.
- Fidelidad del contenido desde fuentes rotas (columnas entrelazadas, pseudo-tablas) →
  reglas de generación + revisión humana por lote; excluir fragmentos ininteligibles.
- Pérdida/duplicación de progreso → flag one-time, conservar claves viejas, tests de migración
  e import v1.
- XSS en apuntes renderizados → sanitizar salida de `marked`; contenido es de primera mano.
- Tailwind v4 (`@apply`, `@layer components`) → se adopta v3.4 (misma sintaxis que el CDN
  actual) para garantizar comportamiento idéntico; v4 queda como migración futura.
- Binarios fuente (PDF/PPTX/JPG) no versionados → `.gitignore`; solo `.md` derivados.
- Material de cátedra → uso interno de estudio; no publicar fuentes originales.
- localStorage bloqueado/lleno → degradar sin persistir; verificar Safari iOS.
- Cobertura parcial por slides solo-imagen → documentar temas sin contenido en el lote.

## Spike/POC
No hay incertidumbre invalidante: migración, namespacing y render de apuntes son mecánicos y
reversibles en un commit.

## Cierre
- Comandos: `npm run dev`, `npm run build`, `npm run preview`, `npm run validar`,
  `npm run test`, `npm run e2e`.
- Docs: `AGENTS.md` (stack/comandos), `README.md` (URL y guía de aporte), spec → `implementada`.
- Terminado con los 8 criterios de aceptación cumplidos y deploy público verificado.

## Trazabilidad
- Commits: 8f3bfad fundación · 7f91904 Vite+Tailwind · 6434c79 multi-materia · c1e1689 validador ·
  c68ab5a fix priorización · b5b3e0b e2e smoke · 92e3400 apuntes · 2055cfb contenido ISW ·
  ec991ed contenido ASW · ce1d564 fix repaso+smoke.
- Evidencia al cierre de implementación: `npm run validar` (3 materias · 152 preguntas · 79
  términos) · `npm run test` 42/42 · `npm run e2e` 6/6 (Playwright, build incluido).
- Pendiente: criterio 7 — deploy y verificación en Vercel (requiere login del usuario, CLI o
  dashboard). Nota de revisión humana pendiente del contenido generado (ASW: definiciones
  estándar en polimorfismo y "composición sobre herencia" donde la lámina solo traía el título).
