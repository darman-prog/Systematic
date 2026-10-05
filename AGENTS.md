# AGENTS.md — Systematic

App de estudio para materias de ingeniería (Base de Datos 2, Ingeniería de Software,
Arquitectura de Software, Infraestructura) y un track de **lenguajes de programación**
(TypeScript) para leer y verificar código generado por IA. Práctica tipo quiz, simulacro, modo
estudio, flashcards, glosario, apuntes, escenarios, casos y competencia por etapas. Sitio estático
desplegado en Vercel.

## Stack

- Frontend: JavaScript vanilla (sin framework) + HTML estático.
- Build: Vite. Estilos: Tailwind CSS 3.4 local (sin CDN en runtime).
- Datos: módulos JS en `src/datos/{materias,lenguajes}/<track>/` (`preguntas.js`, `glosario.js`,
  `apuntes.js`, `roadmap.js`); carga bajo demanda con `import()` dinámico (un chunk por track).
- Dominio: `src/core/` agrupado por subdominio con barrel `index.js` (incluye
  `lenguaje/competencia.js`: barra y gate de etapas de un lenguaje).
- Persistencia: `localStorage` con namespace `sys.*`; cuenta y respaldo en la nube opcionales con
  Firebase (ADR 008), activados por `VITE_FIREBASE_*`. Sin claves, la app es 100% local.
- Tests: Vitest (unitario) y Playwright (E2E). Validación de datos: `scripts/validar-datos.mjs`.
- Deploy: Vercel (preset Vite, salida `dist/`).

## Estructura

- `index.html` — shell de la app (pantallas y contenedores; acciones vía `data-action`, sin `onclick` inline).
- `src/app.js` — composición: estado, navegación, persistencia por track y mapa de acciones delegadas.
- `src/core/` — dominio puro agrupado por subdominio: `registro/` (materias), `estudio/` (progreso,
  sesiones, mezclador, questionSelector), `juego/` (gamificacion, escenarios), `lenguaje/`
  (competencia), `nube/` (snapshot del respaldo) y `diagramas/`. `index.js` re-exporta la API
  pública. Sin DOM ni localStorage.
- `src/student/` — servicios de aplicación con dependencias inyectadas (persistencia, gamificación,
  cuenta y nube de ADR 008).
- `src/ui/` — render separado en `aprendizaje/` (pantallas de práctica), `dashboard/` (datos del
  estudiante), `cuenta/` (acceso: login/registro/recuperar) y `componentes/` (compartidos); recibe
  estado por parámetro, no toca `localStorage`.
- `src/estilos/` — Tailwind + parciales (`tokens`, `componentes`, `pantallas`, `lienzo`).
- `src/datos/` — contenido por track en dos ramas: `materias/` y `lenguajes/` (incluye presentación:
  colores de tema, keywords).
- `scripts/` — utilidades Node.js (validador de datos, revisión de contenido).
- `e2e/` — pruebas Playwright.
- `docs/specs/`, `docs/adr/`, `docs/project-brain/` — specs, decisiones y cerebro documental.
- `BancoDeInformacion/` — material fuente (`*.md` convertidos; PDF/PPTX/DOCX no se versionan).

## Comandos

- `npm run dev` — servidor de desarrollo.
- `npm run build` — build de producción a `dist/`.
- `npm run preview` — sirve el build local.
- `npm run validar` — valida el schema de datos de todos los tracks.
- `npm run revision` — revisión de calidad de contenido (avisos, no bloquea).
- `npm run test` — Vitest (unitario).
- `npm run e2e` — Playwright (E2E sobre el build).

## Skill Gate (obligatorio antes de leer, buscar o editar)

Antes de la primera accion: identifica skills con la tabla, carga cada una con la herramienta `skill` (este archivo NO sustituye a la skill) y declara en tu primer mensaje `Skills: <cargadas>`; si omites una candidata, `omitida <nombre>: <motivo>`. Si coinciden varias señales, combina sus skills; carga solo las obligatorias al inicio y las opcionales cuando apliquen. Toda escritura o modificación de código carga `code-clue`, sin que el usuario tenga que pedir comentarios.

| Tipo de tarea | Obligatoria | Opcional (solo si aplica) |
| --- | --- | --- |
| Toda tarea (buscar, leer, planificar, responder) | `uso-eficiente`, `comunicacion-asertiva` | — |
| Escribir o modificar código (cualquier lenguaje o proyecto) | `code-clue` | — |
| Definir producto, alcance, MVP, roadmap o prioridades | `criterio-proyecto` | `ingenieria-software` |
| Plan técnico, dependencias, spike/POC | `ingenieria-software` | `arquitectura` |
| Feature backend, dominio o API | `arquitectura`, `convenciones-backend` | `contratos-api`, `base-datos`, `microservicios` |
| Código frontend sin cambio visual | `convenciones-frontend` | `accesibilidad` |
| Cambio UI visible o interactivo | `ui-ux`, `impeccable`, `impeccable-doctrina` | `convenciones-frontend`, `accesibilidad`, `frontend-design-review` |
| Bug no trivial o intermitente | `debugging` | `testing`, `code-quality` |
| Refactor o deuda técnica | `refactoring` | `code-quality`, `testing` |
| Escribir o revisar tests | `testing` | `tdd` |
| Esquema, migraciones o seeds | `base-datos` | `seguridad` |
| Auth, inputs, secretos, validación o CORS | `seguridad` | `contratos-api` |
| Investigación de hechos externos o actuales | `investigacion-web` | — |
| Analizar datasets, CSV/JSON o métricas | `analisis-datos` | — |
| Automatizar tareas repetitivas con scripts | `automatizacion` | — |
| Usar Notion, Playwright u otra herramienta MCP | `activacion-mcp` | — |
| README, ADR, guía, tutorial o taller | `documentacion` | `contexto-proyecto` |
| Onboarding de proyecto o cambio en `docs/project-brain/` | `inicio-proyecto`, `contexto-proyecto` | — |
| Deploy, pipeline o rollback | `despliegue` | `infraestructura` |
| Docker, Compose o editar IaC/manifiestos | `infraestructura` | `despliegue` |
| Medir u optimizar rendimiento | `performance` | `observabilidad`, `code-quality` |
| Instrumentar logs, métricas o trazas | `observabilidad` | `debugging` |
| Editar `.opencode/` (agentes, skills, config) | `customize-opencode` | — |
| Auditar el harness (skills, agentes, scripts, permisos); pre-flight con `auditor` | `customize-opencode` | `testing` |
| Cierre de implementación o cambio | `calidad-cierre` | `testing`, `seguridad` |
| Commits, ramas o PRs | `workflow` | — |
| Manuales, solo por petición explícita | `habilidades-ofimaticas`, `informe-docx` | — |

Regla anti-omision: si la `description` de una skill menciona un verbo o dominio presente en la tarea, cargala aunque creas conocerla o este resumida aqui.

## Estilo de respuesta (obligatorio para todos los agentes)
Formato por defecto (perfil del usuario: directo, sin rodeos):
1. **Primera linea = veredicto**: `Hecho:` / `Pendiente:` / `Bloqueado:` + resumen en una frase.
2. **Maximo 5 bullets** con lo esencial: que se hizo, que falta, que decision tuya falta.
3. Termina si hace falta con `¿Detallo algo?`; nunca expandas sin que te lo pidan.
Excepciones (detalle COMPLETO aunque rompa el limite): preguntas de clarificacion, planes, ADRs y docs; hallazgos BLOCKER, riesgos de seguridad/perdida de datos o decisiones irreversibles. Prohibido: preambulos, repetir el plan, re-explicar lo ya dicho. Doctrina de redaccion, densidad y diagramas: skill `comunicacion-asertiva` (en preguntas puras responde sin etiquetas; respeta "modo detallado" como override del usuario).

## Definition of Done
Canonica en la skill `workflow` (lint/typecheck/tests, diff, secretos, cambios enfocados con tests, docs, contratos API, UI+impeccable). No la dupliques.

## Tokens y contexto
Reglas en la skill `uso-eficiente`; detalle en su `references/TOKEN-SAVING.md` (leerlo en exploracion amplia). `grep`/`glob` antes que `read`; no re-leas archivos ya vistos: este archivo es cache. **Ante la duda:** lee este archivo y `docs/project-brain/INDEX.md` antes de preguntar o asumir. **Fuera del repo:** no explores rutas externas salvo que la tarea nombre la ruta o el repo no responda.

## Manejo de `.gitignore`
Puedes crear `.gitignore` (raiz o subdirectorios) y agregar entradas. **Nunca elimines ni sobrescribas las existentes**: si hay conflicto, consulta al usuario.

## Agentes
- Primarios (Tab): `build`, `plan`.
- Subagentes (Task/@): `ui-ux` (frontend, edita), `backend-expert` (solo analiza y planifica), `auditor`, `tester`, `quality`, `debugger`, `explore`. No invocan a nadie: reportan y quien los delego decide.
- `calidad-cierre` es el gate de cierre (delegable); no sustituye `testing`, `seguridad`, `auditor` ni las skills de diseño.
- Modelos se asignan manualmente por agente.

## Convenciones

- Código e identificadores técnicos en inglés; contenido de estudio y UI en español.
- Archivos en `kebab-case`. Ids de BD2 (`P1-*`) se conservan; materias nuevas usan prefijo
  `ISW-*` / `ASW-*` / `INF-*`; el track de lenguajes usa `TS-*`.
- Contenido de materias nuevas: derivado de los `.md` de `BancoDeInformacion/` con revisión humana
  por lote. Excepción registrada (spec 011): el currículo de TypeScript es material propio revisado.
- Commits: Conventional Commits (`feat`, `fix`, `refactor`, `style`, `chore`, `test`, `docs`), uno
  por paso de plan; skills `workflow` y `uso-eficiente` como referencia.
- Editar archivos solo con herramientas que preserven UTF-8. Nunca round-trips
  `Get-Content`/`Set-Content` de PowerShell 5.1: corrompen acentos y símbolos (UTF-8 → U+FFFD).
- Sin secretos ni `.env` versionados; sin dependencias CDN en runtime.

## Deploy

- Repo: https://github.com/darman-prog/Systematic.git
- Vercel: importar el repo, preset Vite, build `npm run build`, output `dist/`.
- Cuenta/nube (opcional): cargar `VITE_FIREBASE_*` en Vercel y pegar `firestore.rules` en la
  consola de Firebase (no hay `firebase.json`).
- Rollback: instant rollback en Vercel y `git revert` en el repo.
