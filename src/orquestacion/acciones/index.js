// Registro único de acciones (ADR 002/009): los elementos declaran data-action con el
// nombre de la función que ejecutan y sus parámetros en data-*; un único listener
// delegado de click los resuelve desde este mapa. No se publica nada en window.
import { accionesAcceso } from "./acceso.js";
import { accionesPractica } from "./practica.js";

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

// Aplana cada submódulo como un grupo propio: el guard detecta colisiones también entre
// dashboard/lenguaje/ajustes y entre misiones/talentos/escenarios/casos.
function gruposDe(prefijo, mapas) {
  return Object.fromEntries(Object.entries(mapas).map(([nombre, mapa]) => [prefijo + ":" + nombre, mapa]));
}

export function crearAcciones({ acceso, practica, juego, navegacion }) {
  const gruposJuego = {
    misiones: juego.misiones.acciones,
    escenarios: juego.escenarios.acciones,
    casos: juego.casos.acciones
  };
  // Incluye las acciones del árbol de talentos cuando el controlador está registrado.
  if (juego.talentos && juego.talentos.acciones) {
    gruposJuego.talentos = juego.talentos.acciones;
  }

  return componerAcciones({
    acceso: accionesAcceso(acceso),
    practica: accionesPractica(practica),
    ...gruposDe("juego", gruposJuego),
    ...gruposDe("navegacion", {
      dashboard: navegacion.dashboard.acciones,
      lenguaje: navegacion.lenguaje.acciones,
      ajustes: navegacion.ajustes.acciones
    })
  });
}

// El listener delegado vive junto al mapa que resuelve (ADR 002).
export function instalarDelegacion(mapa) {
  document.addEventListener("click", event => {
    const el = /** @type {HTMLElement|null} */ (/** @type {any} */ (event.target).closest("[data-action]"));
    if (!el) return;
    const accion = mapa[el.dataset.action];
    if (accion) accion(el);
  });
}
