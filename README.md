# Systematic

App de estudio para materias de ingeniería: práctica tipo quiz, simulacro, modo estudio, apuntes,
flashcards y glosario. Sitio estático (Vite + Tailwind, sin backend): el progreso se guarda en el
navegador (localStorage) y puede exportarse/importarse como JSON.

**Materias:** Base de Datos 2 · Ingeniería de Software · Arquitectura de Software.

## Uso

- Abre la URL desplegada (ver Deploy) o corre en local: `npm install` y `npm run dev`.
- Elige una materia y practica. El progreso queda en tu dispositivo; usa **Exportar progreso**
  para respaldarlo o pasarlo a otro equipo (también acepta los JSON de la app antigua Quiz BD2).

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción a `dist/` |
| `npm run preview` | Sirve el build local |
| `npm run validar` | Valida el schema de datos de todas las materias |
| `npm run test` | Tests unitarios (Vitest) |
| `npm run e2e` | Smoke E2E (Playwright, compila y sirve el build) |

## Deploy (Vercel)

1. Entra a <https://vercel.com/new> con tu cuenta.
2. Importa el repo `darman-prog/Systematic` (Vercel detecta Vite: build `npm run build`, output `dist/`).
3. Deploy. Comparte la URL `https://systematic-….vercel.app` con tus compañeros.

Alternativa por CLI: `npx vercel login` y luego `npx vercel --prod`.

Rollback: en Vercel, *Deployments → Instant Rollback*; en el repo, `git revert`.

## Aportar contenido

- El contenido vive en `src/datos/<materia>/` (`preguntas.js`, `glosario.js`, `apuntes.js`) y se
  deriva del material fuente en `BancoDeInformacion/` (los PDF/PPTX/DOCX no se versionan, solo los
  `.md` convertidos).
- Toda pregunta/apunte/glosario debe pasar `npm run validar` antes de commitear.
- Ids: BD2 conserva `P1-*` / `PR-*`; materias nuevas usan `ISW-*` / `ASW-*` (apuntes `AP-ISW-*` / `AP-ASW-*`).
