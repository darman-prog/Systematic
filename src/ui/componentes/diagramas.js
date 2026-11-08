// Fachada del lienzo de diagramas (spec 003 + spec 013 workbench UI). Compone la pintura,
// las plantillas y la interacción; conserva el API público histórico de crearDiagramasUI.
import { crearPintura } from "./diagramas/pintura.js";
import { crearInteraccion } from "./diagramas/interaccion.js";

/** @type {(id: string) => any} */
const $ = id => document.getElementById(id);
const $area = () => document.getElementById("lienzo-area");

/**
 * @param {{
 *   ctx?: any,
 *   guardarEstado?: (estado: any) => void,
 *   obtenerItem?: () => any,
 *   obtenerEstado?: () => any,
 *   areaId?: string,
 *   accionComprobar?: string,
 *   accionCancelarTipo?: string,
 *   mostrarPregunta?: boolean
 * }} [opciones]
 */
export function crearDiagramasUI({
  ctx,
  guardarEstado,
  obtenerItem,
  obtenerEstado,
  areaId = "question-area",
  accionComprobar = "comprobarDiagrama",
  accionCancelarTipo = "cancelarDiagramaTipo",
  mostrarPregunta = true
} = {}) {
  // Estado mutable compartido entre interacción y pintura: selección activa, alto del
  // workbench, pestaña del dock móvil, aristas montadas y frame pendiente de reposición.
  const ui = { seleccion: null, expandido: false, tabPool: "nodos", aristasDom: [], raf: 0 };
  const zona = () => $(areaId);

  function estado() {
    if (obtenerEstado) return obtenerEstado();
    return ctx && ctx.session && ctx.session.diagrama;
  }

  function guardar(nuevo) {
    if (ctx && ctx.session) ctx.session.diagrama = nuevo;
    if (guardarEstado) guardarEstado(nuevo);
    return nuevo;
  }

  function esBloqueado() {
    return !!(ctx && ctx.session && ctx.session.answers && ctx.session.answers[ctx.session.idx]);
  }

  // La pintura consulta la selección vigente y delega la interacción en este mismo objeto;
  // se completa con las funciones de interacción antes de devolver el API.
  const enlaces = { seleccionActual: () => ui.seleccion };
  const pintura = crearPintura({ $, $area, zona, estado, guardar, esBloqueado, ui, interaccion: enlaces });
  const interaccion = crearInteraccion({
    $,
    $area,
    zona,
    estado,
    guardar,
    esBloqueado,
    ui,
    pintura,
    ctx,
    obtenerItem,
    accionComprobar,
    accionCancelarTipo,
    mostrarPregunta
  });
  Object.assign(enlaces, interaccion);

  return {
    renderDiagrama: interaccion.renderDiagrama,
    pintarNodos: pintura.pintarNodos,
    dibujarAristas: pintura.dibujarAristas,
    elegirTipo: interaccion.elegirTipo,
    cancelarSeleccion: interaccion.cancelarSeleccion,
    colocarMiembro: interaccion.colocarMiembro,
    colocarNodoUI: interaccion.colocarNodoUI,
    quitarNodoUI: interaccion.quitarNodoUI,
    enfocarLienzo: interaccion.enfocarLienzo
  };
}
