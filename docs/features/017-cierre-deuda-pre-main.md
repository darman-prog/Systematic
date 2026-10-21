---
id: 017
status: en-curso
created: 2026-10-20
updated: 2026-10-20
---
# Feature 017 — Cierre de deuda pre-main

> Eliminar código muerto, formalizar contratos con `checkJs`/JSDoc, agregar lint/CI y
> cubrir dashboard/acceso con unitarios antes de mergear a `main`.

## Objetivo

Que `main` reciba solo cambios con gates automáticos verdes y sin deuda conocida
bloqueante. La feature 015 ya dejó `app.js` como composition root; esta cierra lo que
quedó fuera de ese alcance.

## Alcance

| Incluye | Excluye |
|---|---|
| Tag y retiro del mezclador no cableado | Renombrar archivos a `.ts` |
| Tests unitarios de dashboard y acceso | Rediseño visual |
| ESLint + `checkJs` global sin `strict` | Cobertura de UI al 100% |
| CI de calidad y E2E en PR | Cambios de contenido o datos |
| Ignorar snapshots locales | Publicación en Vercel |
| Estabilizar el flake de spacing móvil | `strict`/`noImplicitAny` en esta pasada |

## Criterios de aceptación

| N.º | Criterio verificable | Evidencia |
|---|---|---|
| 1 | El tag `archive/mezclador` conserva el código | `git show archive/mezclador:src/core/estudio/mezclador.js` |
| 2 | No quedan referencias al mezclador | `grep` sin `crearMezclador`, `questionSelector` ni `storeLocalStorage` |
| 3 | `npm run lint` verde | salida del comando |
| 4 | `npm run typecheck` global verde | salida del comando |
| 5 | Unitarios de dashboard y acceso verdes | suites nuevas |
| 6 | `npm run validar`, `npm run build` y `npm run e2e` verdes | salida de cada comando |
| 7 | CI y branch protection activos | GitHub Actions y checks requeridos |
| 8 | `git status` limpio y snapshots ignorados | `git status --short`, `git check-ignore` |

## Pasos

1. Documentar ADR 012/013 y esta spec.
2. Archivar el mezclador en un tag y retirarlo.
3. Inyectar `ui`/`hoy` en `dashboard` y agregar unitarios.
4. Inyectar `crearAuthUI`/`recargar` en `acceso` y agregar unitarios.
5. Configurar ESLint y corregir hallazgos.
6. Typecheck de core/student/orquestación con JSDoc.
7. Typecheck de UI y composición.
8. Typecheck de scripts/e2e/config.
9. Agregar CI y estabilizar el E2E móvil.
10. Ignorar `docs/snapshots/`.
11. Actualizar README, AGENTS, arquitectura, testing y changelog.

## Cierre

- ADR 012/013 enlazados.
- Changelog con la fila del cierre.
- `strict` queda como deuda posterior documentada, no bloquea `main`.
