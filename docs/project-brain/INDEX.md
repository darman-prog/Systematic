---
status: vigente
last_reviewed: 2026-09-20
confidence: confirmado
source: código
---

# Índice del cerebro documental

Memoria organizada de Systematic. Empezá acá para saber qué documento cargar según la tarea.
No cargues el cerebro completo: leé este índice y solo los documentos que necesites.

## Documentos

| Documento | Qué contiene | Cuándo cargarlo | Estado |
|---|---|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Capas, límites y patrones estructurales | Antes de mover o agregar módulos | vigente |
| [DOMAIN.md](DOMAIN.md) | Reglas de negocio (Leitner, XP, escenarios, misiones, diagramas y casos) | Al tocar lógica de estudio o gamificación | vigente |
| [DATA.md](DATA.md) | Persistencia, claves `sys.*`, migración y schema de datos | Al tocar progreso, export/import o contenido | vigente |
| [TESTING.md](TESTING.md) | Estrategia y suites de tests | Al agregar tests o antes de cerrar un cambio | vigente |
| [OPERATIONS.md](OPERATIONS.md) | Build, deploy en Vercel y rollback | Antes de publicar o revertir | vigente |
| [PRODUCT.md](../../PRODUCT.md) | Problema, usuarios y principios de producto | Al decidir alcance o prioridades | vigente |
| [DESIGN.md](../../DESIGN.md) | Dirección visual "Noche calma", tokens, movimiento y accesibilidad | Al tocar UI visible | vigente |

## Decisiones y planes

- ADRs: `docs/adr/` (una decisión de arquitectura por archivo).
- Specs: `docs/specs/` (intención por feature; listar con `docs/specs/*.md`).

## Convenciones de esta carpeta

- Cada documento abre con frontmatter `status` / `last_reviewed` / `confidence` / `source`.
- Los ADRs viven en `docs/adr/` y no se duplican acá.
- `PRODUCT.md` y `DESIGN.md` viven en la raíz y usan su propio schema; este índice solo los enlaza.
