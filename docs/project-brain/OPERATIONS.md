---
status: vigente
last_reviewed: 2026-09-20
confidence: confirmado
source: AGENTS.md + README.md + package.json
---

# Operaciones

Build, despliegue y rollback. Leelo antes de publicar una versión o revertir un deploy.

## Build local

- `npm run dev`: servidor de desarrollo.
- `npm run build`: build de producción a `dist/`.
- `npm run preview`: sirve el build local.

## Deploy (Vercel)

- Preset Vite, build `npm run build`, output `dist/`.
- Repo: `darman-prog/Systematic` (GitHub).
- Alternativa por CLI: `npx vercel login` y luego `npx vercel --prod`.

## Rollback

- Vercel: *Deployments → Instant Rollback*.
- Repo: `git revert` del commit problemático.

## Higiene

- Sitio estático: sin backend, sin base de datos remota, sin cuentas.
- Sin secretos ni `.env` versionados.
- Sin dependencias CDN en runtime (Tailwind y utilidades van en el bundle).
