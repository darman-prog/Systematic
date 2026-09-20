// Anillo de puntaje para resultados. HTML puro; el color y el porcentaje llegan por parámetro.
export function anilloPuntaje(pct, color) {
  return '<div class="score-ring anim-in" style="--pct:' + pct + '; --ring-color:' + color + '">' +
    '<div class="score-ring-inner">' + pct + '%</div></div>';
}
