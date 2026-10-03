// Barra de competencia de un track de lenguaje (spec 011). HTML puro.
// El avance se escribe en texto además de la barra, para no depender solo del color
// (WCAG AA, PRODUCT.md).
import { escapar } from "../helpers.js";

export function barraCompetencia({ aprobadas, total, color }) {
  const n = Number.isFinite(total) ? total : 0;
  const a = Number.isFinite(aprobadas) ? aprobadas : 0;
  const pct = n > 0 ? Math.round((a / n) * 100) : 0;
  const texto = a + " de " + n + (n === 1 ? " etapa" : " etapas");
  const colorSeguro = /^#[0-9a-fA-F]{3,8}$/.test(color || "") ? color : "";

  return '<div class="competencia" role="group" aria-label="Competencia: ' + texto + '">' +
    '<div class="competencia-track" aria-hidden="true">' +
      '<div class="competencia-fill" style="width:' + pct + "%" +
        (colorSeguro ? ";--competencia-color:" + colorSeguro : "") + '"></div>' +
    '</div>' +
    '<span class="competencia-texto">' + escapar(texto) + '</span>' +
  '</div>';
}
