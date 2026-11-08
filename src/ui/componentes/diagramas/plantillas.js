// Plantillas HTML del lienzo de diagramas: pools de nodos y miembros, pestañas móviles
// y el workbench completo. Funciones puras (reciben estado y devuelven string) para que
// la interacción y la pintura no carguen con el marcado.
import { escapar, bloqueCaso } from "../../helpers.js";
import { icono } from "../../iconos.js";
import { CONFIG_SUBTIPO, claveMiembro } from "../../../core/index.js";

export const ETIQUETA_SUBTIPO = {
  "er": "Modelo Entidad-Relación",
  "uml-clases": "UML · Diagrama de Clases",
  "casos-uso": "UML · Casos de Uso",
  "actividades": "UML · Diagrama de Actividades"
};

export const TITULO_POOL_NODOS = {
  "er": "Entidades",
  "uml-clases": "Clases e interfaces",
  "casos-uso": "Actores y casos",
  "actividades": "Acciones y decisiones"
};

export function tiposDe(pregunta) {
  if (Array.isArray(pregunta.tiposArista) && pregunta.tiposArista.length) return pregunta.tiposArista;
  const cfg = CONFIG_SUBTIPO[pregunta.subtipo] || CONFIG_SUBTIPO.er;
  return cfg.tiposArista;
}

export function guardasDe(item) {
  const declaradas = (item.relacionesEsperadas || [])
    .map(r => r && r.guarda)
    .filter(g => typeof g === "string" && g.trim().length);
  const unicas = [...new Set(declaradas)];
  return unicas.length ? unicas : ["[sí]", "[no]", "[verdadero]", "[falso]"];
}

export function renderPoolNodosHtml(estadoActual, seleccion) {
  if (!estadoActual.nodosDisponibles.length) {
    return '<span class="diagrama-pool-vacio">Todas las piezas están en el lienzo</span>';
  }
  return estadoActual.nodosDisponibles
    .map(n => {
      const activa = seleccion === "colocar:" + n;
      return (
        '<div class="pieza pieza-nodo' + (activa ? " pieza-activa" : "") + '" data-nodo="' + escapar(n) + '" data-origen="pool-diagrama" aria-pressed="' + (activa ? "true" : "false") + '">' +
          '<span>' + escapar(n) + "</span>" +
        "</div>"
      );
    })
    .join("");
}

export function renderPoolMiembrosHtml(item, estadoActual, seleccion, tabPool) {
  if (!Array.isArray(item.miembrosPool) || !item.miembrosPool.length) return "";
  const asignados = item.miembrosPool.filter(m => !!estadoActual.miembros[claveMiembro(m)]).length;
  const ocultoMovil = tabPool !== "miembros" ? " panel-oculto-movil" : "";
  return (
    '<div class="diagrama-panel diagrama-panel--con-tabs' + ocultoMovil + '" data-panel-pool="miembros">' +
      '<div class="diagrama-panel-head">' +
        '<span class="diagrama-panel-titulo">Miembros</span>' +
        '<span class="diagrama-contador" id="contador-miembros">' + asignados + "/" + item.miembrosPool.length + "</span>" +
      "</div>" +
      '<p class="diagrama-panel-sub">Toca un miembro y luego la clase destino:</p>' +
      '<div id="pool-miembros" class="diagrama-pool">' +
        item.miembrosPool.map(m => {
          const clave = claveMiembro(m);
          const dueno = estadoActual.miembros[clave];
          const activa = seleccion === "miembro:" + clave;
          const clases = "pieza pieza-miembro" + (dueno ? " pieza-sel" : "") + (activa ? " pieza-activa" : "");
          return (
            '<div class="' + clases + '" data-miembro="' + escapar(clave) + '" aria-pressed="' + (activa ? "true" : "false") + '" title="' +
              (dueno ? "Asignado a " + escapar(dueno) + " (toca para desasignar)" : "Sin asignar") + '">' +
              '<span>' + escapar(m.texto) + "</span>" +
              (dueno ? '<span class="pieza-dueno">→ ' + escapar(dueno) + "</span>" : "") +
            "</div>"
          );
        }).join("") +
      "</div>" +
    "</div>"
  );
}

export function renderWorkbench({
  item,
  estadoActual,
  bloqueado,
  expandido,
  tabPool,
  seleccion,
  tituloNodos,
  subtipoLabel,
  totalNodos,
  tieneMiembros,
  asignadosMiembros,
  mostrarPregunta,
  accionComprobar,
  accionCancelarTipo
}) {
  const tabsMovilHtml = tieneMiembros
    ? '<div class="diagrama-tabs-movil" role="tablist" aria-label="Bandejas de piezas">' +
        '<button type="button" role="tab" class="diagrama-tab' + (tabPool === "nodos" ? " diagrama-tab--activa" : "") + '" data-tab-pool="nodos" aria-selected="' + (tabPool === "nodos" ? "true" : "false") + '">' +
          '<span>' + escapar(tituloNodos) + "</span>" +
          '<span class="diagrama-contador" id="contador-nodos-tab">' + estadoActual.nodosColocados.length + "/" + totalNodos + "</span>" +
        "</button>" +
        '<button type="button" role="tab" class="diagrama-tab' + (tabPool === "miembros" ? " diagrama-tab--activa" : "") + '" data-tab-pool="miembros" aria-selected="' + (tabPool === "miembros" ? "true" : "false") + '">' +
          '<span>Miembros</span>' +
          '<span class="diagrama-contador" id="contador-miembros-tab">' + asignadosMiembros + "/" + item.miembrosPool.length + "</span>" +
        "</button>" +
      "</div>"
    : "";
  const clasesPanelNodos = "diagrama-panel" +
    (tieneMiembros ? " diagrama-panel--con-tabs" : "") +
    (tieneMiembros && tabPool !== "nodos" ? " panel-oculto-movil" : "");

  return (
    (mostrarPregunta
      ? bloqueCaso(item) +
        '<div class="text-base sm:text-lg font-semibold leading-relaxed mb-3">' + escapar(item.q) + "</div>"
      : "") +
    '<div class="diagrama-workbench' + (expandido ? " workbench-expandido" : "") + '">' +
      '<aside class="diagrama-sidebar" aria-label="Piezas del diagrama">' +
        tabsMovilHtml +
        '<div class="' + clasesPanelNodos + '" data-panel-pool="nodos">' +
          '<div class="diagrama-panel-head">' +
            '<span class="diagrama-panel-titulo">' + escapar(tituloNodos) + "</span>" +
            '<span class="diagrama-contador" id="contador-nodos">' + estadoActual.nodosColocados.length + "/" + totalNodos + "</span>" +
          "</div>" +
          '<p class="diagrama-panel-sub">Arrastra al lienzo o toca para colocar:</p>' +
          '<div id="pool-diagrama" class="diagrama-pool">' +
            renderPoolNodosHtml(estadoActual, seleccion) +
          "</div>" +
        "</div>" +
        renderPoolMiembrosHtml(item, estadoActual, seleccion, tabPool) +
        '<div class="diagrama-guia">' +
          "<span><b>Conectar:</b> toca un nodo y luego el destino.</span>" +
          "<span><b>Mover:</b> arrastra el nodo o usa las flechas.</span>" +
          "<span><b>Quitar:</b> pulsa × sobre el nodo o la relación.</span>" +
        "</div>" +
      "</aside>" +
      '<div class="diagrama-main">' +
        '<div class="lienzo-toolbar">' +
          '<div class="lienzo-toolbar-info">' +
            '<span class="lienzo-subtipo-badge">' + escapar(subtipoLabel) + "</span>" +
            '<span class="lienzo-metricas" id="metricas-lienzo">' +
              estadoActual.nodosColocados.length + " en lienzo · " + estadoActual.conexiones.length + " relaciones" +
            "</span>" +
          "</div>" +
          '<button type="button" class="btn-expandir-lienzo" id="btn-expandir-lienzo" aria-pressed="' + (expandido ? "true" : "false") + '">' +
            (expandido ? "Contraer lienzo" : "Ampliar lienzo") +
          "</button>" +
        "</div>" +
        '<div id="tipos-diagrama" class="flex flex-wrap gap-2 items-center" hidden>' +
          '<span class="tipos-etiqueta" id="tipos-etiqueta-texto">Tipo de relación:</span>' +
          tiposDe(item).map(t => '<button type="button" class="pieza" data-arista="' + escapar(t) + '">' + escapar(t) + "</button>").join("") +
          '<button type="button" class="btn-mini" data-action="' + accionCancelarTipo + '" aria-label="Cancelar selección">' + icono("cruz", "icono-sm") + "</button>" +
        "</div>" +
        '<div id="lienzo-diagrama" tabindex="0" role="group" aria-label="Lienzo del diagrama, desliza para desplazarte">' +
          '<div id="lienzo-area">' +
            '<svg id="edges-diagrama">' +
              '<defs><marker id="flecha-diagrama" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">' +
              '<path d="M0,0 L8,4 L0,8 z" class="flecha-punta"></path></marker></defs>' +
            "</svg>" +
          "</div>" +
        "</div>" +
        '<div class="lienzo-footer">' +
          '<p id="hint-diagrama" class="lienzo-hint" role="status" aria-live="polite"></p>' +
          '<button class="btn btn-primary" id="btn-comprobar-diagrama" data-action="' + accionComprobar + '" ' +
            (bloqueado ? "disabled" : "") + ">Comprobar</button>" +
        "</div>" +
      "</div>" +
    "</div>"
  );
}
