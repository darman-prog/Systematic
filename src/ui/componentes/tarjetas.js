// Tarjeta de listado (.apunte-card) compartida por apuntes y escenarios/casos.
// `cuerpo` y `pie` llegan como HTML ya escapado por el llamador.
import { escapar } from "../helpers.js";

export function tarjeta({ tema, titulo, cuerpo, pie }) {
  return '<div class="apunte-card">' +
    '<div class="apunte-tema">' + escapar(tema) + '</div>' +
    '<div class="apunte-titulo">' + escapar(titulo) + '</div>' +
    (cuerpo || "") +
    (pie ? '<div class="flex items-center justify-between gap-3 flex-wrap">' + pie + '</div>' : "") +
  '</div>';
}
