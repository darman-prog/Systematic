# Reporte anti-slop — Systematic (2026-10-09)

Para qué sirve: inventario de patrones de IA-slop y deriva del sistema de diseño,
con backlog priorizado. Cuándo leerlo: antes de tocar UI visible.

Metodología: `detect --json` sobre `index.html` y los 5 parciales de `src/estilos/`
+ veredicto por pilares (sin doble-review con `critique`: acá solo formato y scoring).

## Veredicto por pilares

- **Sin fricción**: OK con notas — el flujo responde "qué hago" y "qué sigue"
  (primaria a lo ancho, feedback con siguiente paso). Nota: errores de config ya guían.
- **Craft**: 9 warnings — 3 acentos laterales gruesos (el tell más reconocible de UI
  generada), 3 grises sobre color (legibilidad), 3 `transition: width` (layout thrash),
  jerarquía tipográfica plana y un salto de heading. 121 avisos de deriva de tokens
  (tamaños, radios, colores fuera de rampa: verificar intención, no cambiar a ciegas).
- **Confianza**: OK — errores con guía de reparación, sin contenido generado por IA
  que declarar.

## Backlog

### P1 (rendimiento, a11y, jerarquía)

1. `transition: width` ×3 (`componentes.css:137,808`, `pantallas.css:186`): animar
   `transform`/`opacity`, nunca `width`. → Corregido con `--pct` + `scaleX`.
2. Salto de heading (`index.html`: h1 BD2 → h3 Practica): nivel continuo para lectores.
   → Grupos a `h2`.
3. Jerarquía plana (h1/h2/h3 = 16px): un paso ≥1.25× en el título de pantalla.
   → Parcial: portada ya usa 24/30px; queda auditar el resto de pantallas.

### P2 (slop visual)

4. Acento lateral grueso ×3 (`entrada.css:119`, `componentes.css:536`,
   `pantallas.css:130`): atenuado a 3px con `color-mix` al 65%.
5. Gris sobre color ×3 (`entrada.css:49,71,98`): el remap de `tokens.css` falsea al
   detector (evalúa Tailwind crudo, no los tokens reales); pasa a auditoría manual
   de contraste por par real antes de tocar.

### P3 (deriva de sistema, verificar antes de tocar)

6. 84 tamaños, 21 radios y 16 colores fuera de rampa DESIGN.md: auditar por archivo;
   lo intencional se documenta en el sidecar, lo accidental se alinea a tokens.
