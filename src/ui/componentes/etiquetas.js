// Etiquetas de rating compartidas por escenarios y casos de diagramación (spec 006).
// Un solo mapa y un solo render para que éxito/parcial/fracaso se vean igual en todo el flujo.
import { icono } from "../iconos.js";

export const RATINGS = {
  exito: { texto: "¡Éxito!", icono: "check", clase: "tag-ok" },
  parcial: { texto: "Resultado parcial", icono: "idea", clase: "tag-practica" },
  fracaso: { texto: "Fracaso", icono: "cruz", clase: "tag-bad" }
};

export function tagRating(rating) {
  const r = RATINGS[rating] || RATINGS.parcial;
  return '<span class="tag ' + r.clase + '">' + icono(r.icono, "icono-sm") + r.texto + "</span>";
}
