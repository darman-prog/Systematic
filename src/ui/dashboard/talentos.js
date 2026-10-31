// Vista del Árbol de Talentos y panel de Títulos Técnicos por materia.
// Recibe el árbol ya evaluado por el dominio; no accede a localStorage ni a datos crudos.
import { titulosDisponibles } from "../../core/index.js";
import { icono } from "../iconos.js";
import { estadoVacio } from "../componentes/estados.js";
import { renderizarRadar } from "../componentes/radar.js";
import { escapar } from "../helpers.js";

/** @type {(id: string) => any} */
const $ = id => document.getElementById(id);

// Traduce el estado técnico del nodo en una etiqueta legible para la interfaz y lectores de pantalla.
function textoEstadoNodo(estado) {
  if (estado === "desbloqueado") return "Talento desbloqueado";
  if (estado === "listo_para_boss") return "Incidente crítico disponible";
  return "Requisitos pendientes";
}

// Construye los chips de misiones requeridas permitiendo saltar directo a practicar las pendientes.
function renderizarRequisitosMisiones(nodo) {
  if (!nodo.detalleMisiones || !nodo.detalleMisiones.length) return "";
  const items = nodo.detalleMisiones.map(m => {
    const ic = m.ok ? icono("check", "icono-xs") : icono("punto", "icono-xs");
    const clase = m.ok ? "talento-req talento-req--ok" : "talento-req talento-req--pendiente";
    const texto = escapar(m.tema) + " (" + m.actual + "/" + m.requerido + " estrellas)";
    // Si la misión aún no alcanza las estrellas requeridas, ofrece un botón directo para jugarla.
    if (!m.ok) {
      return (
        '<li>' +
          '<button type="button" class="' + clase + '" data-action="iniciarMision" data-tema="' + escapar(m.tema) + '">' +
            ic + '<span>' + texto + ' · Practicar</span>' +
          '</button>' +
        '</li>'
      );
    }
    return '<li><span class="' + clase + '">' + ic + '<span>' + texto + '</span></span></li>';
  }).join("");

  return '<ul class="talento-requisitos" aria-label="Misiones requeridas">' + items + '</ul>';
}

// Construye el pie de acción del nodo: botón de Boss Battle, estado bloqueado o selector de título.
function renderizarPieNodo(nodo, tituloActivo) {
  if (nodo.estado === "desbloqueado") {
    const esEquipado = Boolean(tituloActivo && tituloActivo === nodo.titulo);
    const botonTitulo = esEquipado
      ? '<span class="talento-badge talento-badge--equipado">' + icono("check", "icono-xs") + '<span>Título equipado en perfil</span></span>'
      : '<button type="button" class="btn btn-secondary btn-sm" data-action="equiparTitulo" data-titulo="' + escapar(nodo.titulo) + '">' +
          icono("medalla", "icono-sm") + '<span>Equipar título: ' + escapar(nodo.titulo) + '</span>' +
        '</button>';
    return (
      '<div class="talento-acciones">' +
        botonTitulo +
      '</div>'
    );
  }

  if (nodo.estado === "listo_para_boss" && nodo.bossId) {
    const etiquetaBoss = nodo.bossNombre || "Incidente en Producción";
    return (
      '<div class="talento-acciones">' +
        '<button type="button" class="btn btn-primary btn-sm" data-action="afrontarBoss" ' +
                'data-boss-id="' + escapar(nodo.bossId) + '" data-boss-tipo="' + escapar(nodo.bossTipo || "escenario") + '">' +
          icono("rayo", "icono-sm") +
          '<span>Afrontar ' + escapar(etiquetaBoss) + '</span>' +
        '</button>' +
      '</div>'
    );
  }

  // Informa al estudiante qué le falta desbloquear antes de poder afrontar el incidente.
  const avisoPrevio = !nodo.previoOk
    ? '<p class="talento-bloqueo-nota">' + icono("bloqueada", "icono-xs") + '<span>Requiere desbloquear el talento anterior de esta rama.</span></p>'
    : nodo.bossId
      ? '<p class="talento-bloqueo-nota">' + icono("escenarios", "icono-xs") + '<span>Completa las misiones para habilitar ' + escapar(nodo.bossNombre || "la Boss Battle") + '.</span></p>'
      : "";

  return avisoPrevio ? '<div class="talento-acciones">' + avisoPrevio + '</div>' : "";
}

function renderizarNodo(nodo, tituloActivo) {
  const icClave = nodo.estado === "bloqueado" ? "bloqueada" : (nodo.icono || "medalla");
  const estadoTexto = textoEstadoNodo(nodo.estado);

  return (
    '<li class="talento-nodo talento-nodo--' + escapar(nodo.estado) + '" data-talento-id="' + escapar(nodo.id) + '">' +
      '<div class="talento-nodo-cabecera">' +
        '<div class="talento-nodo-icono" aria-hidden="true">' + icono(icClave, "icono-md") + '</div>' +
        '<div class="talento-nodo-titular">' +
          '<div class="talento-nodo-meta">' +
            '<span class="talento-eje-pill">' + escapar(nodo.eje) + ' +' + nodo.puntosRadar + '%</span>' +
            '<span class="talento-estado-pill talento-estado-pill--' + escapar(nodo.estado) + '">' + escapar(estadoTexto) + '</span>' +
          '</div>' +
          '<h3 class="talento-nodo-nombre">' + escapar(nodo.nombre) + '</h3>' +
        '</div>' +
      '</div>' +
      '<p class="talento-nodo-desc">' + escapar(nodo.descripcion) + '</p>' +
      renderizarRequisitosMisiones(nodo) +
      renderizarPieNodo(nodo, tituloActivo) +
    '</li>'
  );
}

function renderizarPanelTitulos(arbolEvaluado, tituloActivo) {
  const disponibles = titulosDisponibles(arbolEvaluado);
  if (!disponibles.length) {
    return (
      '<section class="talentos-titulos-card" aria-label="Títulos profesionales">' +
        '<h2 class="radar-titulo">Títulos de Especialidad</h2>' +
        '<p class="subtitle">Supera las misiones y Boss Battles de cada rama para desbloquear títulos técnicos en tu perfil.</p>' +
      '</section>'
    );
  }

  const itemsHTML = disponibles.map(t => {
    const activo = tituloActivo === t.titulo;
    return (
      '<li class="talento-titulo-item">' +
        '<button type="button" class="talento-titulo-btn' + (activo ? " talento-titulo-btn--activo" : "") + '" ' +
                'data-action="equiparTitulo" data-titulo="' + escapar(t.titulo) + '" ' +
                'aria-pressed="' + (activo ? "true" : "false") + '">' +
          icono(activo ? "check" : "medalla", "icono-sm") +
          '<span class="talento-titulo-texto">' + escapar(t.titulo) + '</span>' +
          '<span class="talento-titulo-eje">' + escapar(t.eje) + '</span>' +
        '</button>' +
      '</li>'
    );
  }).join("");

  return (
    '<section class="talentos-titulos-card" aria-label="Títulos profesionales">' +
      '<div class="radar-cabecera">' +
        '<h2 class="radar-titulo">Títulos Desbloqueados</h2>' +
        '<span class="radar-promedio">' + disponibles.length + ' disponibles</span>' +
      '</div>' +
      '<ul class="talento-titulos-lista">' + itemsHTML + '</ul>' +
    '</section>'
  );
}

export function pintarTalentos({ arbolEvaluado, materia, tituloActivo = "" } = {}) {
  const cont = $("talentos-vista");
  if (!cont) return;

  if (!arbolEvaluado || !Array.isArray(arbolEvaluado.ramas) || !arbolEvaluado.ramas.length) {
    cont.innerHTML = estadoVacio("Esta materia aún no tiene un árbol de talentos configurado.");
    return;
  }

  const ramasHTML = arbolEvaluado.ramas.map(rama => {
    const nodosHTML = (rama.nodos || []).map(n => renderizarNodo(n, tituloActivo)).join("");
    return (
      '<article class="talento-rama" data-rama-id="' + escapar(rama.id) + '">' +
        '<header class="talento-rama-header">' +
          '<h2 class="talento-rama-titulo">' + escapar(rama.nombre) + '</h2>' +
          '<p class="talento-rama-desc">' + escapar(rama.descripcion) + '</p>' +
        '</header>' +
        '<ol class="talento-nodos-lista">' +
          nodosHTML +
        '</ol>' +
      '</article>'
    );
  }).join("");

  const radarHTML = renderizarRadar(arbolEvaluado, { materia });
  const titulosHTML = renderizarPanelTitulos(arbolEvaluado, tituloActivo);
  const insigniaActiva = tituloActivo
    ? '<span class="talento-activo-banner">' + icono("medalla", "icono-sm") + '<span>Título activo: <b>' + escapar(tituloActivo) + '</b></span></span>'
    : '<span class="talento-activo-banner talento-activo-banner--vacio">Sin título profesional equipado</span>';

  cont.innerHTML =
    '<div class="talentos-resumen-bar">' +
      '<span class="talentos-progreso-pill">' +
        icono("chispa", "icono-sm") +
        '<span><b>' + arbolEvaluado.totalDesbloqueados + '</b> de <b>' + arbolEvaluado.totalNodos + '</b> talentos dominados</span>' +
      '</span>' +
      insigniaActiva +
    '</div>' +
    '<div class="talentos-layout">' +
      '<div class="talentos-columna-arbol">' +
        ramasHTML +
      '</div>' +
      '<aside class="talentos-columna-radar">' +
        radarHTML +
        titulosHTML +
      '</aside>' +
    '</div>';
}
