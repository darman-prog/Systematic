# ADR 013 — Contratos JSDoc y gates automatizados

- **Estado**: aceptado
- **Fecha**: 2026-10-20
- **Decisor**: build (plan aprobado por el usuario)

## Contexto

El repo declara límites de capas y contratos de datos (ADR 001/007/011), pero la mayoría
de los contratos de código son implícitos:

- `ctx` se describe solo por getters.
- Las fábricas `crearX({ deps })` no declaran la forma de sus dependencias.
- Las claves `sys.*` están centralizadas, pero no tipadas.
- El mapa de acciones ya tiene un test de duplicados y un contrato contra `index.html`;
  el resto de los módulos no tiene una verificación equivalente.
- No hay lint, typecheck ni CI: los gates son comandos locales que se pueden omitir.
- `dashboard` y `acceso` se cubren solo con E2E, sin unitarios de su orquestación.

## Decisión

1. Formalizar contratos con **JSDoc + `checkJs` global sin `strict`**:
   - `src/core/tipos.js` declara `Pregunta`, `Track`, `EntradaProgreso`,
     `ResultadoEvaluacion`, `ContextoUI`, `MapaAcciones` y `Snapshot`.
   - `tsconfig.json` usa `allowJs`, `checkJs: true`, `noEmit` y `skipLibCheck`.
   - El `include` crece por fases: core/student/orquestación → UI/app → scripts/e2e/config.
   - `strict`/`noImplicitAny` quedan como deuda posterior para no bloquear `main`.
2. Agregar **ESLint** con configuración plana y reglas de errores reales
   (`no-unused-vars`, `no-undef`, `no-redeclare`, `no-empty` con catch vacío permitido),
   sin reglas de estilo que generen ruido.
3. Agregar **CI** en GitHub Actions:
   - `calidad` en push/PR: lint, typecheck, validar, unitarios y build.
   - `e2e` en PR: Chromium y Playwright.
   - Branch protection exige ambos checks antes de mergear a `main`.
4. Agregar **unitarios** de `dashboard` y `acceso` inyectando UI, auth y reloj; el E2E
   sigue cubriendo los flujos completos.
5. Ignorar `docs/snapshots/` como insumo local de diseño, igual que
   `docs/PrototiposDiseños/`.

## Consecuencias

- **Positivas**: los contratos quedan visibles y verificados; un PR roto no llega a
  `main`; los controladores tienen pruebas sin DOM real; el flake móvil se estabiliza.
- **Negativas**: `checkJs` destapa errores de tipos implícitos y exige una migración por
  fases; ESLint puede requerir correcciones puntuales; CI agrega tiempo.
- **Riesgos**: el typecheck global puede crecer más de lo previsto. Mitigación: fases por
  carpeta y subdivisión de UI si hace falta.
- **Fuera de alcance**: renombrar archivos a `.ts`, `strict` desde el inicio y cobertura
  de UI al 100%.

## Alternativas descartadas

1. **Solo JSDoc y tests**: documenta, pero no bloquea errores de tipo.
2. **TypeScript completo con renombrado a `.ts`**: diff masivo y riesgo alto antes de
   `main`; `checkJs` da la mayor parte del beneficio sin mover archivos.
3. **CI solo con unitarios**: deja pasar lint, typecheck, datos y build.
4. **Dejar E2E manual**: el flake y las regresiones de flujo llegarían a `main`.
