# ADR 014 — Límites de capas verificados por ESLint

- **Estado**: aceptado
- **Fecha**: 2026-11-08
- **Decisor**: build (plan aprobado por el usuario)

## Contexto

`docs/project-brain/ARCHITECTURE.md` declara la Dependency Rule (core → student → ui/orquestación),
pero hasta ahora se sostenía con convención, revisión manual y tests. ADR 011 dejó anotado que no
había lint de límites: una fuga como `ui → student` o `core → datos` pasaba CI sin aviso. Los
refactors de esta feature movieron módulos entre capas y aumentaron el riesgo de fuga silenciosa.

## Decisión

Configurar `no-restricted-imports` y `no-restricted-syntax` por carpeta en `eslint.config.js`:

| Capa | No puede importar | Excepción |
|---|---|---|
| `src/core/` | `ui`, `student`, `orquestacion`, `datos` (estático y dinámico) | tests |
| `src/student/` | `ui`, `orquestacion`, `datos` | `contenido.js` (único dueño de las rutas de datos) |
| `src/ui/` | `student`, `orquestacion`, `datos` (estático y dinámico) | tests; `aprendizaje/mermaid.js` (SDK lazy) |
| `src/datos/` | `core`, `student`, `ui`, `orquestacion` (estático y dinámico) | tests |

`orquestacion/` y `app.js` quedan libres: son adaptadores y composition root. Los tests quedan
fuera para poder usar fixtures de otras capas sin acoplar producción.

## Consecuencias

- **Positivas**: una fuga de capas falla en `npm run lint`, antes de CI; el mensaje de la regla
  explica la capa y la excepción; no agrega dependencias nuevas.
- **Negativas**: hay que mantener las excepciones (`student/contenido.js` y
  `ui/aprendizaje/mermaid.js`) y ampliar la regla si aparece un caso legítimo.
- **Riesgos**: `no-restricted-imports` no cubre `import()`; se compensa con `no-restricted-syntax`
  sobre `ImportExpression` en core, student, ui y datos.

## Alternativas descartadas

1. **Confiar solo en revisión manual**: es lo que había y ADR 011 ya lo señalaba como deuda.
2. **`eslint-plugin-boundaries`**: más potente, pero suma una dependencia y configuración para un
   proyecto sin monorepo; las reglas nativas cubren las cuatro fronteras actuales.
3. **Migrar todo a TypeScript con paths restringidos**: resuelve contratos, pero multiplica el
   alcance y no bloquea imports relativos entre carpetas.
