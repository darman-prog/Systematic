---
status: vigente
last_reviewed: 2026-09-20
confidence: confirmado
source: código (src/core/)
---

# Dominio

Reglas de negocio del estudio: repaso espaciado, sesiones, gamificación, escenarios y misiones.
Leelo antes de tocar lógica de práctica o progreso, y al agregar un modo de juego.

## Repaso espaciado (Leitner)

Vive en `src/core/progreso.js`. Cada pregunta tiene una caja de 1 a 5.

- Acierto: sube la caja (máximo 5). Fallo: reinicia a 1.
- Intervalos de repaso en días: `[0, 1, 3, 7, 16]` según la caja.
- "Débil": falló alguna vez y (no acertó la última o su caja es menor o igual a 2).
- "Vencida": pasó el intervalo de su caja desde la última respuesta.
- Racha: días consecutivos con al menos una respuesta.
- Meta diaria: preguntas por día (valor por defecto 20).

## Sesiones

Vive en `src/core/sesiones.js`. Arma la lista de práctica:

- Prioridad: débiles, luego vencidas, luego nuevas; cada grupo se baraja (`rng` inyectable).
- `prepararItem` baraja opciones, piezas, bloques o pares según el tipo de pregunta.

Tipos de pregunta actuales (definidos en `scripts/validador.mjs`): `multiple`, `multi`, `vf`,
`codigo`, `dragdrop`, `ordenar`, `desarrollo`, `relacionar` y `diagrama`.

## Gamificación

Vive en `src/core/gamificacion.js`. La persistencia se orquesta en `app.js` (ver [DATA.md](DATA.md)).

- XP base por acierto: 10; repetir una pregunta dominada (caja mayor o igual a 3) da 3.
- Nivel: `1 + floor(raíz(xp / 100))`; el inicio de cada nivel crece como 100 por (n-1) al cuadrado.
- Supervivencia: multiplicador por combo (x1.5 desde 3; x2 desde 6; x3 desde 10).
- Contrarreloj: acierto en menos de 10 segundos duplica el XP base.
- Logros: condiciones declarativas evaluadas contra un contexto calculado.
- Misiones: estrellas por precisión (1 estrella desde 50%, 2 desde 75%, 3 al 100%).

## Escenarios

Vive en `src/core/escenarios.js`. Multi-paso con decisiones y consecuencias.

- Cada opción otorga 0, 1 o 2 puntos y muestra feedback antes de continuar.
- Rating por porcentaje sobre el máximo: 70% o más es éxito, 40% o más es parcial, el resto fracaso.
- XP solo por decisiones perfectas (2 puntos cada una).

## Diagramas y casos

Motor puro en `src/core/diagramas.js`; el lienzo y el modo de casos viven en `src/ui/`.

- Subtipos: `er` (no dirigido, cardinalidad `1:1`/`1:N`/`N:M`), `uml-clases` (dirigido:
  herencia/asociación/composición/agregación y asignación de miembros a clases), `casos-uso`
  (`asociación`/`include`/`extend`) y `actividades` (`transición` con guardas).
- Estado serializable: nodos colocados y disponibles, miembros asignados y conexiones; los
  `nodosFijos` no se pueden quitar. La clave canónica de una conexión es el par de extremos
  (ordenado en ER) más el tipo (y la guarda si existe).
- Evaluación: conexiones correctas + miembros bien asignados − sobrantes; el tablero está `ok`
  solo si no sobran, no faltan y no hay miembros mal asignados.
- Rating de casos: `≥80%` éxito, `≥50%` parcial, resto fracaso; XP +60 éxito / +25 parcial y
  logro "Arquitecto". El mejor rating por caso se guarda en `sys.casos-diagrama`.

## Materias

`src/core/materias.js` registra las materias y expone `getMateria(id)`. El contenido vive en
`src/datos/<materia>/`; el core no tiene ids de materia incrustados (ADR 003).
