// Evaluación de respuestas por tipo de pregunta. Funciones puras: la UI recolecta la
// selección y el dominio decide si es correcta, para no duplicar reglas en la presentación.
import { normalizarClave } from "../diagramas/diagramas.js";

const correctaDe = item => item.options[item.correct] ?? "";

export function evaluarOpcion(item, indice) {
  return {
    ok: Number.isInteger(indice) && indice === item.correct,
    selected: item.options[indice] ?? "",
    expected: correctaDe(item)
  };
}

export function evaluarMulti(item, seleccionados) {
  const sel = [...new Set(seleccionados || [])].sort((a, b) => a - b);
  const ok = sel.length === item.correctos.length && sel.every((v, i) => v === item.correctos[i]);
  return {
    ok,
    selected: sel.length ? sel.map(i => item.options[i]).join(" + ") : "(ninguna)",
    expected: item.correctos.map(i => item.options[i]).join(" + ")
  };
}

export function evaluarDragdrop(item, textos) {
  const seleccion = textos || [];
  const detalle = item.respuestas.map((resp, i) => seleccion[i] === resp);
  return {
    ok: seleccion.length === item.respuestas.length && detalle.every(Boolean),
    selected: seleccion.join(" / "),
    expected: item.respuestas.join(" / "),
    detalle
  };
}

export function evaluarOrden(item, textos) {
  const orden = textos || [];
  const detalle = item.bloques.map((bloque, i) => orden[i] === bloque);
  return {
    ok: orden.length === item.bloques.length && detalle.every(Boolean),
    selected: orden.join(" → "),
    expected: item.bloques.join(" → "),
    detalle
  };
}

// Relacionar se juega par a par: el fallo se acumula y la ronda se considera correcta solo
// si no hubo ningún intento fallido. El detalle visible conserva el formato actual.
export function evaluarRelacion(item, fallos) {
  const detalle = item.pares.map(p => p[0] + " → " + p[1]).join(" | ");
  return { ok: fallos === 0, selected: detalle, expected: detalle };
}

export function parejaRelacionValida(item, indiceIzquierda, textoDerecha) {
  if (!item || !Array.isArray(item.pares)) return false;
  if (!Number.isInteger(indiceIzquierda) || indiceIzquierda < 0 || indiceIzquierda >= item.pares.length) return false;
  return normalizarClave(item.pares[indiceIzquierda][1]) === normalizarClave(textoDerecha);
}
