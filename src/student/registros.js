// Fusiones de "mejor resultado" y estrellas (spec 006): lógica pura, sin storage ni DOM.
// Evita duplicar el merge de ratings que antes vivía repetido en app.js (escenarios y casos).
export const ORDEN_RATING = { fracaso: 0, parcial: 1, exito: 2 };

// Registro por ítem: conserva el mejor rating y acumula jugadas.
export function fusionarMejor(previo, rating) {
  const jugadas = ((previo && previo.jugadas) || 0) + 1;
  if (!previo || ORDEN_RATING[rating] > ORDEN_RATING[previo.mejorRating]) {
    return { mejorRating: rating, jugadas };
  }
  return { mejorRating: previo.mejorRating, jugadas };
}

// Misión por tema: conserva el máximo de estrellas y de precisión.
export function fusionarMision(previa, pct, estrellas) {
  const prev = previa || { estrellas: 0, mejorPct: 0 };
  const estrellasNuevas = Math.max(prev.estrellas, estrellas);
  const mejorPct = Math.max(prev.mejorPct, pct);
  const mejoraEstrellas = estrellasNuevas > prev.estrellas;
  const cambio = mejoraEstrellas || mejorPct > prev.mejorPct;
  return { registro: { estrellas: estrellasNuevas, mejorPct }, mejoraEstrellas, estrellasGanadas: estrellasNuevas - prev.estrellas, cambio };
}

// Total de estrellas de todas las materias a partir de sus mapas de misiones.
export function sumarEstrellas(materias, mapaDe) {
  return materias.reduce((acc, m) => {
    const mapa = mapaDe(m.id);
    return acc + Object.keys(mapa).reduce((s, t) => s + (mapa[t].estrellas || 0), 0);
  }, 0);
}
