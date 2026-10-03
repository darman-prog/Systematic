// Pantalla del track de lenguaje (spec 011): barra de competencia y mapa de etapas con
// sus pruebas (lecciones) y el examen que hace de gate. Recibe estado por parámetro;
// no lee localStorage. El motor de quiz se reusa tal cual para pruebas y exámenes.
import { escapar } from "../helpers.js";
import { icono } from "../iconos.js";
import { estadoVacio } from "../componentes/estados.js";
import { etapaDesbloqueada, aprobadoVigente, umbralDeExamen } from "../../core/competencia.js";
import { barraCompetencia } from "../componentes/competencia.js";

const $ = id => document.getElementById(id);

// Estado de cada etapa: desbloqueada, aprobada e intentos/último porcentaje.
export function estadoEtapas(roadmap, competencia) {
  const etapas = roadmap?.etapas || [];
  return etapas.map((etapa, i) => {
    const registro = competencia?.[etapa.id] || null;
    return {
      etapa,
      desbloqueada: etapaDesbloqueada(etapas, i, competencia),
      aprobada: aprobadoVigente(etapa, competencia),
      intentos: registro?.intentos || 0,
      ultimoPct: registro?.ultimoPct ?? null,
    };
  });
}

export function pintarCompetencia(barra, color) {
  const cont = $("lenguaje-competencia");
  if (!cont) return;
  cont.innerHTML = barraCompetencia({ ...barra, color });
}

function etiquetaEtapa(nodo) {
  if (nodo.aprobada) return "Aprobada";
  if (!nodo.desbloqueada) return "Bloqueada: aprobá la etapa anterior";
  if (nodo.intentos) return "Último examen: " + Math.round((nodo.ultimoPct || 0) * 100) + "%";
  return "Disponible";
}

export function pintarEtapas(nodos, lenguaje) {
  const cont = $("lenguaje-etapas");
  if (!cont) return;

  if (!nodos || !nodos.length) {
    cont.innerHTML = estadoVacio("Este lenguaje todavía no tiene etapas.");
    return;
  }

  const color = lenguaje?.color || "";

  const html = nodos.map((nodo, i) => {
    const etapa = nodo.etapa;
    const necesita = umbralDeExamen(etapa.examen.preguntas.length, etapa.examen.umbral);
    const total = etapa.examen.preguntas.length;

    const clases = ["etapa", nodo.aprobada ? "etapa-aprobada" : "", nodo.desbloqueada ? "" : "etapa-bloqueada"].filter(Boolean).join(" ");

    const lecciones = etapa.lecciones.map(lec =>
      '<button class="etapa-leccion" data-action="practicarLeccion" data-etapa="' + etapa.id +
        '" data-leccion="' + lec.id + '"' + (nodo.desbloqueada ? "" : " disabled aria-disabled=\"true\"") +
        ' aria-label="Prueba: ' + escapar(lec.nombre) + '">' +
        icono("practica", "icono-sm") + '<span>' + escapar(lec.nombre) + '</span>' +
        '<span class="etapa-leccion-meta">' + lec.preguntas.length + ' preguntas</span>' +
      '</button>'
    ).join("");

    const examen = '<button class="etapa-examen" data-action="rendirExamen" data-etapa="' + etapa.id + '"' +
      (nodo.desbloqueada ? "" : " disabled aria-disabled=\"true\"") +
      ' aria-label="Examen de ' + escapar(etapa.nombre) + '">' +
      icono("medalla", "icono-sm") + '<span>Examen</span>' +
      '<span class="etapa-leccion-meta">' + total + ' preguntas · aprueba con ' + necesita + '</span>' +
    '</button>';

    const estadoIco = nodo.aprobada ? "check" : (nodo.desbloqueada ? "punto" : "bloqueada");

    return '<li class="etapa-item">' +
      '<div class="' + clases + '" style="' + (color ? "--competencia-color:" + color : "") + '">' +
        '<div class="etapa-cabecera">' +
          '<span class="etapa-num" aria-hidden="true">' + (i + 1) + '</span>' +
          '<span class="etapa-nombre">' + escapar(etapa.nombre) + '</span>' +
          '<span class="etapa-ico">' + icono(estadoIco, "icono-sm") + '</span>' +
        '</div>' +
        '<p class="etapa-estado">' + escapar(etiquetaEtapa(nodo)) + '</p>' +
        '<div class="etapa-acciones">' + lecciones + examen + '</div>' +
      '</div>' +
    '</li>';
  }).join("");

  cont.innerHTML = '<ol class="etapas-camino" role="list">' + html + '</ol>';
}
