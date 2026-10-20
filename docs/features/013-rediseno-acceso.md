---
id: 013
status: cerrada
created: 2026-10-20
updated: 2026-10-20
---
# Feature 013 — Rediseño unificado de acceso

> Login, registro y recuperación comparten un shell ribbon-glass full-bleed; se conserva la
> lógica de autenticación y se unifica la presentación.

## Objetivo
Que las tres vistas de acceso se vean y se estructuren igual, con el logo del registro y el
botón outline del login, sin cambiar callbacks, validación, persistencia ni el contrato de
`crearAuth`.

## Contexto
Los prototipos aprobados (`docs/PrototiposDiseños/`, insumo local) difieren en logo, marco,
campos, botón, pie y extras. El registro no tiene versión móvil; se deriva del shell común y del
login móvil. Se descarta el logo del login.

## Alcance
| Incluye | Excluye |
|---|---|
| Shell ribbon-glass full-bleed, logo del registro, campos outline, primario outline, copy “Comienza tu estudio”, hint “Mín. 8 caracteres”, responsive y tests | Lógica Firebase/auth, páginas legales, medidor de fuerza, cambios visuales fuera de acceso, fuente Source Sans 3 |

## Decisiones
- Full-bleed = `#screen-cuenta` sin card ni título “Cuenta” cuando no hay sesión; el header
  global se conserva.
- Logo: emblema del registro (96px desktop / 80px móvil) con SVG de 64/56px.
- Primario: outline del login (transparente, borde `#9BB8C9`, glow sutil), full width.
- Register: “Comienza tu estudio”, subtítulo del prototipo; Nombre completo, Correo, Contraseña
  y Confirmar contraseña.
- Contraseña: solo hint “Mín. 8 caracteres”; sin barras.
- Legal y chevron: omitidos.
- Prototipos: no se versionan (`.gitignore`).

## Criterios de aceptación
| N.º | Criterio verificable | Evidencia |
|---|---|---|
| 1 | Login/register/recuperar usan el mismo shell y clases | `plantilla`/`CABECERAS` en `autenticacion.js`; tests del shell |
| 2 | IDs, callbacks y validación intactos | `rtk vitest run` → PASS (339) |
| 3 | Full-bleed anónimo y card con sesión | `e2e/onboarding.spec.js` → `acceso-libre`; `src/ui/cuenta.test.js` |
| 4 | AA, foco, 44px, inputs 16px en móvil | `e2e/auditoria-a11y.spec.js` → PASS (18); capturas 1280/390 |
| 5 | Build y E2E verdes | `rtk npm run build` OK; suites de acceso verdes (full suite: 93 pass, 1 fallo flaky preexistente en `e2e/movil.spec.js`) |

## Pasos
0. Rama `feat/rediseno-acceso` + `.gitignore` de prototipos (`chore`).
1. Spec + DESIGN.md (`docs`).
2. Shell full-bleed + logo + CSS (`feat`).
3. Paridad login/register (`feat`).
4. Tests + a11y (`test`).
5. QA + cierre (`docs`).

## Riesgos
- El full-bleed no debe romper el panel “Cuenta” con sesión: toggle por `acceso-libre` y prueba
  de ambos estados.
- Glass/glow: fallback sin `backdrop-filter`, contraste AA y glow contenido.
- Register con 4 campos: card content-driven, scroll vertical en móvil, sin overflow horizontal.
- No copiar CDN del prototipo: Tailwind local e iconos SVG inline.

## Cierre
- Implementado en la rama `feat/rediseno-acceso`.
- Fila resumen en `docs/features/INDEX.md`.
- ADR: no aplica (solo UI; si el lenguaje glass se globaliza, se abre ADR/spec).
- Nota: el fallo de `e2e/movil.spec.js` es de layout/rounding en perfil/quiz y no toca el acceso; se deja fuera de esta feature.
