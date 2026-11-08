// stats.js — Cableado del panel de estadísticas: render, meta editable, historial y
// contadores del encabezado. Las vistas viven en stats/plantillas.js y el canvas en
// stats/grafica.js.
import { calcularStats, ordenarHistorial } from "../../core/index.js";
import { colorTema } from "../helpers.js";
import { aviso } from "../componentes/estados.js";
import {
  CFG,
  html,
  pintarHistorial,
  heroHTML,
  kpisHTML,
  diagnosticoHTML,
  metaHTML,
  heatmapHTML,
  evolucionHTML,
  textoFaltan,
  temasHTML,
  difsHTML,
  peoresHTML
} from "./stats/plantillas.js";
import { dibujarGrafica, detenerGrafica, observarGrafica } from "./stats/grafica.js";

/** @type {(id: string) => any} */
const $ = id => document.getElementById(id);

/* ═══════════════════════════════════════════════════════════════
 * 5. CABLEADO DEL PANEL Y API PÚBLICA
 * ═══════════════════════════════════════════════════════════════ */

/* Estado por panel (el panel persiste entre renders, sus hijos no). */
const contextos = new WeakMap();
const normalizarMeta = v => Math.max(1, Math.floor(Number(v)) || 1);

/** Actualiza la tarjeta de meta sin reconstruir el panel (conserva foco y animaciones). */
function actualizarMeta(panel, hoy, meta) {
  const card = panel.querySelector(".meta-card");
  if (!card) return;
  const cumplida = hoy >= meta;
  const visto = Math.min(hoy, meta);
  card.classList.toggle("meta-ok", cumplida);
  card.querySelector(".meta-ico").textContent = cumplida ? "✦" : "◐";
  card.querySelector(".meta-badge").hidden = !cumplida;
  card.querySelector(".progress-fill").style.setProperty("--pct", Math.min(100, Math.round((hoy / meta) * 100)));
  const barra = card.querySelector(".progress-track");
  barra.setAttribute("aria-valuemax", meta);
  barra.setAttribute("aria-valuenow", visto);
  barra.setAttribute("aria-valuetext", `${visto} de ${meta} preguntas`);
  card.querySelector(".meta-count").innerHTML = `<b>${hoy}</b> / ${meta}`;
  card.querySelector(".meta-extra").textContent = textoFaltan(hoy, meta);
}

function cambiarMeta(panel, valorNuevo) {
  const ctx = contextos.get(panel);
  if (!ctx) return;
  const v = normalizarMeta(valorNuevo);
  const input = $("meta-input");
  if (input) input.value = v;
  actualizarMeta(panel, ctx.hoy, v);
  ctx.onCambiarMeta?.(v);   // siempre un número
}

/* Un solo listener por panel (delegación): sobrevive a los re-renders. */
function enlazarPanel(panel) {
  if (panel.dataset.enlazado) return;
  panel.dataset.enlazado = "1";

  panel.addEventListener("click", e => {
    const paso = e.target.closest(".meta-btn");
    if (paso) {
      const actual = normalizarMeta($("meta-input")?.value);
      cambiarMeta(panel, actual + Number(paso.dataset.paso));
      return;
    }
    if (e.target.closest('[data-accion="repasar-debiles"]')) $("btn-debiles")?.click();
  });

  panel.addEventListener("change", e => {
    if (e.target.id === "meta-input") cambiarMeta(panel, e.target.value);
  });
}

/* Si algo dispara un re-render completo, el foco vuelve al mismo control. */
function selectorFoco(panel) {
  const a = /** @type {HTMLElement|null} */ (document.activeElement);
  if (!a || !panel.contains(a)) return null;
  if (a.id) return "#" + CSS.escape(a.id);
  if (a.dataset?.paso) return `.meta-btn[data-paso="${a.dataset.paso}"]`;
  if (a.dataset?.accion) return `[data-accion="${a.dataset.accion}"]`;
  return null;
}

const setTxt = (id, v) => { const el = $(id); if (el) el.textContent = v; };

export function renderHistory(historial, onEmpezar, nombre = "") {
  pintarHistorial(ordenarHistorial(historial || []), CFG.historialInicial, onEmpezar, nombre);
}

export function renderStats({ materia, banco = [], obtenerP, historial = [], actividad = {}, meta, onCambiarMeta }) {
  if (!materia) return;
  const panel = $("stats-panel");
  if (!panel) return;
  detenerGrafica();

  if (!banco.length) {
    panel.dataset.firma = "";
    setTxt("stat-total", "0");
    setTxt("stat-parciales", "0");
    setTxt("stat-temas", "0");
    panel.innerHTML = aviso("Contenido en preparación: esta materia todavía no tiene preguntas. Vuelve pronto.");
    ["btn-debiles", "btn-vencidas"].forEach(id => $(id)?.classList.add("hidden"));
    return;
  }

  const s = calcularStats({
    materia, banco, obtenerP, historial, actividad, meta,
    colorDeTema: colorTema
  });

  /* Las barras y anillos solo se animan cuando los datos cambian de verdad,
   * no al mover la meta ni al re-renderizar lo mismo. */
  const idMateria = typeof materia === "object" ? (materia.id ?? materia.nombre ?? "") : String(materia);
  const firma = [idMateria, s.total, s.ok, s.fail, s.hist.length, s.hist[0]?.date ?? ""].join("|");
  const repetido = panel.dataset.firma === firma;
  panel.dataset.firma = firma;
  panel.classList.toggle("sin-anim", repetido);

  const foco = selectorFoco(panel);

  panel.innerHTML = html`
    ${heroHTML(s)}
    ${kpisHTML(s)}
    ${diagnosticoHTML(s)}
    ${metaHTML(s)}
    ${heatmapHTML(s)}
    ${evolucionHTML(s)}
    ${temasHTML(s)}
    ${difsHTML(s)}
    ${peoresHTML(s)}`.s;

  contextos.set(panel, { onCambiarMeta, hoy: s.hoy });
  enlazarPanel(panel);
  if (foco) panel.querySelector(foco)?.focus({ preventScroll: true });

  /* Contadores del header (fuera del panel) */
  setTxt("stat-total", s.total);
  setTxt("stat-parciales", s.parciales);
  setTxt("stat-parciales-txt", s.parciales === 1 ? "parcial" : "parciales");
  setTxt("stat-temas", s.totalTemas);

  const vencidasCount = s.vencidas;
  const btnV = $("btn-vencidas");
  if (btnV) { btnV.classList.toggle("hidden", !vencidasCount); btnV.textContent = "Repaso espaciado (" + vencidasCount + ")"; }

  /* Gráfica + redibujo al cambiar el ancho (el observer y los rAF viven en grafica.js) */
  dibujarGrafica(s.hist, repetido);
  observarGrafica($("grafica-wrap"), s.hist);
}