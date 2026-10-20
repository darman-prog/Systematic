// Registro único de acciones (ADR 002/009): los elementos declaran data-action con el
// nombre de la función que ejecutan y sus parámetros en data-*; un único listener
// delegado de click los resuelve desde este mapa. No se publica nada en window.
import { accionesAcceso } from "./acceso.js";
import { accionesPractica } from "./practica.js";
import { accionesJuego } from "./juego.js";
import { accionesNavegacion } from "./navegacion.js";

// Compone mapas por feature y falla si dos grupos declaran la misma acción: una clave
// duplicada pisaría silenciosamente a la otra.
export function componerAcciones(grupos) {
  const acciones = {};
  for (const [grupo, mapa] of Object.entries(grupos)) {
    for (const [clave, fn] of Object.entries(mapa)) {
      if (Object.prototype.hasOwnProperty.call(acciones, clave)) {
        throw new Error("Acción duplicada: " + clave + " (grupo " + grupo + ")");
      }
      acciones[clave] = fn;
    }
  }
  return acciones;
}

export function crearAcciones({ acceso, practica, juego, navegacion }) {
  return componerAcciones({
    acceso: accionesAcceso(acceso),
    practica: accionesPractica(practica),
    juego: accionesJuego(juego),
    navegacion: accionesNavegacion(navegacion)
  });
}

// El listener delegado vive junto al mapa que resuelve (ADR 002).
export function instalarDelegacion(mapa) {
  document.addEventListener("click", event => {
    const el = event.target.closest("[data-action]");
    if (!el) return;
    const accion = mapa[el.dataset.action];
    if (accion) accion(el);
  });
}
