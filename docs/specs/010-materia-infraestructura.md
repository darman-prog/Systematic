---
id: 010
status: implementada
created: 2026-09-26
updated: 2026-09-26
---

# 010 — Systematic: materia Infraestructura (Linux + Redes)

## Objetivo y alcance
Agregar la cuarta materia `infra` ("Infraestructura") con contenido de comandos de Linux y de
redes Cisco (subnetting, rutas, gateway y DNS), usando los motores existentes: práctica, simulacro,
contrarreloj, supervivencia, repaso espaciado, flashcards, modo estudio, misiones, glosario,
apuntes y escenarios. Sin motor nuevo: no hay preguntas de tipo `diagrama` ni casos de diagramación.

## Contenido
- **99 preguntas** con IDs `INF-001…INF-099`, únicas globales (el validador comparte `idsVistos`).
  - Bloque Linux: `INF-001…INF-059` (59 preguntas, 11 temas), derivadas de los 11 manuales de la
    cátedra convertidos con markitdown.
  - Bloque Redes: `INF-060…INF-099` (40 preguntas, 7 temas), generadas sin fuente de clase y
    revisadas por lote.
- **Glosario**: 45 términos en 6 categorías (Linux: sistema, permisos, servicios; Redes: IP, rutas,
  switching).
- **6 apuntes** (`AP-INF-01…06`): 4 con fuente real a los manuales, 2 de redes con fuente propia.
- **5 escenarios** narrativos de troubleshooting (servidor caído, DNS, ruta por defecto, VLAN,
  ACL).
- `casos: []`: el motor de diagramas no tiene subtipo de red (ver ADR 005).

## Decisiones
- **Identificador**: `id: "infra"`, nombre "Infraestructura", icono `terminal`, color `#7FC8B0` con
  `accentText: "#101418"`.
- **Posición**: al final del array `MATERIAS` para no romper los E2E que entran por índice
  (`nth(1)` = ISW, `nth(2)` = ASW).
- **Tipos de pregunta**: solo los 8 del validador (`multiple, multi, vf, codigo, dragdrop, ordenar,
  relacionar, desarrollo`). Sin `diagrama`.
- **Herramienta de revisión**: `scripts/revision-contenido.mjs` + `npm run revision` para revisar
  lotes de contenido en texto legible, con gate de calidad como test.
- **Material fuente**: `BancoDeInformacion/Infraestructura/**/*.md` versionado (los `.pdf` siguen
  ignorados), así `apuntes.fuente` apunta a archivos reales y `npm run validar` pasa en clone limpio.

## Desvío de la convención de contenido
`AGENTS.md` establece que el contenido de materias nuevas se deriva únicamente de los `.md` de
`BancoDeInformacion/`. El bloque Linux cumple esta convención. El bloque de Redes **no tiene fuente
de clase** (la cátedra no entregó manual de redes), así que esas 40 preguntas, 2 apuntes y los
términos de redes son material propio generado y revisado por lote antes de commitear. Este desvío
queda registrado aquí y en el changelog.

## Criterios de aceptación
1. El home lista 4 materias; la cuarta es Infraestructura con su conteo de preguntas.
2. Funcionan práctica, simulacro, contrarreloj, supervivencia, repaso, flashcards, estudio,
   misiones (18, una por tema), glosario, apuntes y escenarios.
3. Ninguna pantalla muestra el constructor de diagramas (no hay preguntas `diagrama`).
4. `npm run validar` pasa (4 materias, 335 preguntas, 124 términos).
5. `npm run revision` no deja avisos en la materia.
6. `e2e/infraestructura.spec.js` cubre home, práctica sin lienzo, misiones, glosario, apuntes,
   escenarios y el estado vacío de casos.

## Validación
- `npm run validar` — schema de datos.
- `npm run revision` — calidad de contenido (gate como test).
- `npm run test` — suite unitaria.
- `npm run build` — build de producción.
- `npm run e2e` — suite completa + `e2e/infraestructura.spec.js`.
