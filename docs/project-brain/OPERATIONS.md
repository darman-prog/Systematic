---
status: vigente
last_reviewed: 2026-10-05
confidence: confirmado
source: AGENTS.md + README.md + package.json + ADR 008
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
- Cuenta/nube (opcional): definir `VITE_FIREBASE_*` en Vercel (Settings → Environment Variables);
  sin esas claves la app queda solo local y el botón "Cuenta" no aparece.
- Reglas de Firestore: pegar `firestore.rules` en la consola de Firebase (no hay `firebase.json`).

## Rollback

- Vercel: *Deployments → Instant Rollback*.
- Repo: `git revert` del commit problemático.

## Higiene

- Sitio estático sin servidor propio; la cuenta y el respaldo (opcionales) usan Firebase Auth + Firestore (ADR 008).
- Sin secretos ni `.env` versionados.
- Sin dependencias CDN en runtime (Tailwind y utilidades van en el bundle).
