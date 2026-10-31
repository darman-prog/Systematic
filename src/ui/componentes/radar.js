// Componente puro SVG para el Radar de Especialidades (spec talentos): dibuja la malla
// poligonal, los ejes temáticos y el área de maestría con resumen accesible para lectores.
import { calcularPoligonoRadar } from "../../core/index.js";
import { escapar } from "../helpers.js";

// Determina la alineación horizontal del texto SVG según su posición respecto al centro del radar.
function anclajeTexto(x, centro) {
  const delta = x - centro;
  if (Math.abs(delta) < 12) return "middle";
  return delta > 0 ? "start" : "end";
}

// Genera el bloque HTML del radar SVG junto con su lista accesible de porcentajes por eje.
export function renderizarRadar(arbolEvaluado, opciones = {}) {
  const centro = 135;
  const radioMax = 78;
  const radioEtiqueta = 104;
  const radar = calcularPoligonoRadar(arbolEvaluado, {
    centro,
    radioMax,
    radioEtiqueta
  });

  if (!radar.ejes.length) {
    return '<div class="radar-vacio"><p class="subtitle">Sin ejes de especialidad disponibles para esta materia.</p></div>';
  }

  const nombreMateria = opciones.materia && opciones.materia.nombre ? opciones.materia.nombre : "la materia";
  const resumenAria = "Radar de especialidades de " + nombreMateria +
    ": dominio promedio " + radar.resumenPct + "%. " +
    radar.ejes.map(e => e.eje + " " + e.pct + "%").join(", ") + ".";

  const mallasHTML = radar.niveles.map(n =>
    '<polygon class="radar-malla" points="' + n.points + '" />'
  ).join("");

  const ejesLineasHTML = radar.ejes.map(e =>
    '<line class="radar-eje" x1="' + centro + '" y1="' + centro + '" x2="' + e.xMax + '" y2="' + e.yMax + '" />'
  ).join("");

  const verticesHTML = radar.ejes.map(e =>
    '<circle class="radar-vertice" cx="' + e.x + '" cy="' + e.y + '" r="3.5" />'
  ).join("");

  const etiquetasHTML = radar.ejes.map(e => {
    const anchor = anclajeTexto(e.xLabel, centro);
    return '<text class="radar-etiqueta" x="' + e.xLabel + '" y="' + e.yLabel + '" text-anchor="' + anchor + '" dominant-baseline="middle">' +
      escapar(e.eje) +
    '</text>';
  }).join("");

  const desgloseHTML = radar.ejes.map(e =>
    '<li class="radar-leyenda-item">' +
      '<span class="radar-leyenda-nombre">' + escapar(e.eje) + '</span>' +
      '<span class="radar-leyenda-barra" aria-hidden="true"><span style="width:' + e.pct + '%"></span></span>' +
      '<span class="radar-leyenda-valor">' + e.pct + '%</span>' +
    '</li>'
  ).join("");

  return (
    '<figure class="radar-card" aria-label="' + escapar(resumenAria) + '">' +
      '<div class="radar-cabecera">' +
        '<h2 class="radar-titulo">Radar de Especialidades</h2>' +
        '<span class="radar-promedio">' + radar.resumenPct + '% dominio global</span>' +
      '</div>' +
      '<div class="radar-lienzo">' +
        '<svg viewBox="0 0 270 270" class="radar-svg" role="img" aria-label="' + escapar(resumenAria) + '" focusable="false">' +
          '<g class="radar-mallas" aria-hidden="true">' + mallasHTML + '</g>' +
          '<g class="radar-ejes" aria-hidden="true">' + ejesLineasHTML + '</g>' +
          '<polygon class="radar-poligono" points="' + radar.points + '" aria-hidden="true" />' +
          '<g class="radar-vertices" aria-hidden="true">' + verticesHTML + '</g>' +
          '<g class="radar-etiquetas" aria-hidden="true">' + etiquetasHTML + '</g>' +
        '</svg>' +
      '</div>' +
      '<ul class="radar-leyenda" aria-label="Dominio por eje temático">' +
        desgloseHTML +
      '</ul>' +
    '</figure>'
  );
}
