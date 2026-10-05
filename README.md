# Systematic

App de estudio para materias de ingeniería: práctica tipo quiz y simulacro, modo estudio,
Contrarreloj, Supervivencia, misiones por tema, escenarios, casos de diagramación (constructor
ER/UML), apuntes, flashcards y glosario. Sitio estático (Vite + Tailwind, sin servidor propio):
el progreso se guarda en el navegador (localStorage) y puede exportarse/importarse como JSON;
con una cuenta opcional (Firebase) se respalda en la nube y se lleva entre dispositivos (ADR 008).

**Materias:** Base de Datos 2 · Ingeniería de Software · Arquitectura de Software.

## Uso

- Abre la URL desplegada (ver Deploy) o corre en local: `npm install` y `npm run dev`.
- Elige una materia y practica. El progreso queda en tu dispositivo; usa **Exportar progreso**
  para respaldarlo o pasarlo a otro equipo (también acepta los JSON de la app antigua Quiz BD2).
- La primera vez (con Firebase configurado) aparece el acceso: iniciá sesión o creá una cuenta
  para traer tu progreso; **Continuar sin cuenta** mantiene el modo local de siempre.
- Con una cuenta (botón **Cuenta** en el dashboard) podés subir el progreso a la nube y
  restaurarlo en otro dispositivo. Sin cuenta, la app funciona igual que siempre.

## Cuenta y sincronización (opcional)

Para habilitarla en un proyecto propio de Firebase:

1. Crear un proyecto web, habilitar **Authentication** (Email/Password y Google) y **Firestore**.
2. Pegar `firestore.rules` en las reglas de Firestore (consola de Firebase).
3. Copiar `.env.example` a `.env` y completar las claves `VITE_FIREBASE_*`.
4. En Vercel: cargar las mismas variables en *Settings → Environment Variables*.

Sin claves configuradas, la pantalla de cuenta se oculta y la app queda 100% local. Detalle
técnico: [ADR 008](docs/adr/008-cuenta-y-sincronizacion-firestore.md) y
[guía de snapshots](docs/guias/aplicar-snapshots.md).

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

- El contenido vive en `src/datos/materias/<materia>/` (y `src/datos/lenguajes/<lenguaje>/`) con
  `preguntas.js`, `glosario.js`, `apuntes.js`, `escenarios.js` y `casos.js`; se deriva del material fuente en `BancoDeInformacion/` (los
  PDF/PPTX/DOCX no se versionan, solo los `.md` convertidos).
- Toda pregunta/apunte/glosario debe pasar `npm run validar` antes de commitear.
- Ids: BD2 conserva `P1-*` / `PR-*`; materias nuevas usan `ISW-*` / `ASW-*` / `INF-*` (apuntes `AP-ISW-*` / `AP-ASW-*` / `AP-INF-*`).
