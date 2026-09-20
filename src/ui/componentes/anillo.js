// Anillo de puntaje para resultados. HTML puro; el color y el porcentaje llegan por parámetro.
// El dibujo del anillo lo anima `.score-ring` en componentes.css (respeta prefers-reduced-motion).
export function anilloPuntaje(pct, color) {
  return '<div class="score-ring" style="--pct:' + pct + '; --ring-color:' + color + '">' +
    '<div class="score-ring-inner">' + pct + '%</div></div>';
}
