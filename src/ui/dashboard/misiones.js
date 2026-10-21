// Render del mapa de misiones por tema (spec 003): nodos secuenciales con estrellas.
// Funciones puras de render: reciben datos y callbacks; no leen localStorage.
import { icono } from "../iconos.js";
import { estadoVacio } from "../componentes/estados.js";
import { colorTema, escapar } from "../helpers.js";

/** @type {(id: string) => any} */
const $ = id => document.getElementById(id);

/* ─── Paleta "Noche calma" (alinee con stats.js/resultados.js) ─── */
const TEMA = {
  superficie2: "#2B2F38",
  superficie3: "#343942",
  texto: "#E7E5DE",
  apagado: "#A9ADB6",
  sutil: "#6B707A",
  acento: "#9BB8C9",
};

function etiquetaEstado(n) {
  if (n.estado === "bloqueada") return "Bloqueada";
  if (n.completada) return "Completada con medalla";
  if (n.estrellas > 0) return "Disponible, " + n.estrellas + " de 3 estrellas";
  return "Disponible, sin intentos";
}

function iconoDeEstado(n) {
  if (n.estado === "bloqueada") return "bloqueada";
  if (n.completada) return "medalla";
  if (n.estrellas > 0) return "punto";
  return "punto";
}

export function pintarMisiones(nodos, materia) {
  const cont = $("misiones-lista");
  if (!cont) return;

  if (!nodos || !nodos.length) {
    cont.innerHTML = estadoVacio("Esta materia aún no tiene temas para misiones.");
    return;
  }

  const acento = colorTema(materia, nodos[0] ? nodos[0].tema : "") || TEMA.acento;

  const html = nodos.map((n, i) => {
    const disponible = n.estado === "disponible";
    const esSiguiente = disponible && n.estrellas === 0 &&
      (i === 0 || nodos[i - 1].completada);
    const estrellaLlena = "★";
    const estrellaVacia = "☆";
    const estrellasHTML = Array.from({ length: 3 }, (_, k) =>
      '<span class="mision-star' + (k < n.estrellas ? " mision-star-on" : "") + '" aria-hidden="true">' +
        (k < n.estrellas ? estrellaLlena : estrellaVacia) +
      '</span>'
    ).join("");

    const iconoClave = iconoDeEstado(n);
    // El nombre accesible surge del contenido visible (tema); el estado y la precisión
    // se anuncian como texto oculto para evitar axe: label-content-name-mismatch.
    const detalleEstado = etiquetaEstado(n) + ". " +
      (n.mejorPct ? "Mejor precisión: " + n.mejorPct + " por ciento." : "Sin intentos aún.");

    const clases = [
      "mision-nodo",
      disponible ? "mision-disponible" : "",
      n.estado === "bloqueada" ? "mision-bloqueada" : "",
      n.completada ? "mision-completada" : "",
      esSiguiente ? "mision-siguiente" : ""
    ].filter(Boolean).join(" ");

    // Conector entre nodos (no después del último)
    const conector = i < nodos.length - 1
      ? '<span class="mision-conector" aria-hidden="true"></span>'
      : "";

    return '<li class="mision-item">' +
      '<button class="' + clases + '"' +
        (disponible
          ? ' data-action="iniciarMision" data-tema="' + n.tema + '"'
          : ' disabled aria-disabled="true"') +
        '>' +
      '<span class="sr-only">' + escapar(detalleEstado) + '</span>' +
        '<span class="mision-num" aria-hidden="true">' + (i + 1) + '</span>' +
        '<span class="mision-info">' +
          '<span class="mision-tema">' + n.tema + '</span>' +
          '<span class="mision-meta">' +
            (n.mejorPct
              ? '<span class="mision-pct">' + n.mejorPct + '% precisión</span>'
              : '<span class="mision-vacio">Sin intentos</span>') +
          '</span>' +
        '</span>' +
        '<span class="mision-estrellas" role="img" aria-label="' + n.estrellas + ' de 3 estrellas">' +
          estrellasHTML +
        '</span>' +
        '<span class="mision-ico">' + icono(iconoClave, "icono-lg") + '</span>' +
      '</button>' +
      conector +
    '</li>';
  }).join("");

  cont.innerHTML = '<ul class="misiones-camino" role="list">' + html + '</ul>';

  // Acento dinámico por materia aplicado a la misión "siguiente"
  const siguiente = cont.querySelector(".mision-siguiente");
  if (siguiente) {
    siguiente.style.setProperty("--mision-accent", acento);
  }
}