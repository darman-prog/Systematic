# ADR 015 — Apuntes con diagramas Mermaid y lector con TOC

- **Estado**: aceptado
- **Fecha**: 2026-11-08
- **Decisor**: build (plan aprobado por el usuario)

## Contexto

Los apuntes eran resúmenes breves dentro de `apuntes.js` y la pantalla pintaba el contenido completo de todos en una sola lista (`ui/aprendizaje/apuntes.js`). Los temas de arquitectura, POO, casos de uso y bases de datos necesitan diagramas para explicar estructura y flujo, pero el visor solo usaba `marked` + `DOMPurify` y no renderizaba Mermaid. Además, BD2 no tenía apuntes por una decisión anterior (spec 010/018).

## Decisión

1. Agregar `mermaid` como dependencia **lazy**: se importa solo cuando un apunte tiene un bloque `~~~mermaid` y se renderiza en un módulo aislado (`ui/aprendizaje/mermaid.js`).
2. Cambiar la pantalla de apuntes a **lista + lector**: la lista muestra un resumen y un botón “Leer”; el lector pinta un solo apunte, genera un TOC desde los headings y vuelve a la lista con foco.
3. Mantener el contenido en `apuntes.js` con fences `~~~mermaid`. Se descartó migrar a archivos `.md` con `import.meta.glob`/`?raw` porque `scripts/validar-datos.mjs` corre en Node y no resuelve esos imports de Vite.
4. Cada diagrama se envuelve en `<figure>` con `figcaption`, `role="img"` y un `<details>` con el código fuente; si Mermaid falla, queda el código como fallback.
5. BD2 pasa a tener 7 apuntes con diagramas ER/flujo, revirtiendo el vacío intencional anterior.

## Consecuencias

- **Positivas**: los apuntes pueden explicar estructura y flujo; el lector evita renderizar todos los diagramas a la vez; Mermaid queda fuera del bundle inicial; BD2 gana material de estudio.
- **Negativas**: nueva dependencia (~650 kB en chunk lazy); el contenido sigue siendo texto JS, menos cómodo de editar que un `.md`; los diagramas deben validarse en navegador.
- **Riesgos**: sintaxis Mermaid inválida se muestra como fallback; el chunk de Mermaid crece si se agregan tipos de diagrama. Mitigación: pruebas de render y E2E por materia.

## Alternativas descartadas

1. **Diagramas ASCII/estáticos**: no requieren dependencia, pero no representan clases, ER ni casos de uso con claridad.
2. **SVG autorados a mano**: control total, pero costoso de mantener y propenso a romper el layout.
3. **Migrar todo a `.md` con `?raw`**: mejor autoría, pero incompatible con el validador Node actual; exigiría migrar `validar` a Vite.
4. **Mantener la lista con todo el contenido**: simple, pero con apuntes largos y diagramas se vuelve pesada e ilegible.
