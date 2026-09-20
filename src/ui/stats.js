// Render de historial y estadísticas por materia (incluida la gráfica canvas).
// Funciones de render que reciben los datos por parámetro (materia, banco, progreso vía
// callback `obtenerP`, historial, actividad y meta ya normalizada); no lee localStorage.
import { calcularRacha, esDebil, hoyISO, vencida } from "../core/progreso.js";
import { DIF_LABELS, colorTema, escapar } from "./helpers.js";
import { icono } from "./iconos.js";

const $ = id => document.getElementById(id);

function tarjetaStat(valor, etiqueta, color) {
  return '<div class="stat-card"><div class="stat-value" style="color:' + (color || "#9BB8C9") + '">' + valor + '</div><div class="stat-label">' + etiqueta + '</div></div>';
}

export function renderHistory(historial) {
  const box = $("history-section");
  if (!historial.length) {
    box.innerHTML = '<p class="text-sm text-slate-400">Aún no hay intentos registrados. ¡Empieza con una práctica o el simulacro!</p>';
    return;
  }
  const mejor = Math.max.apply(null, historial.map(h => h.score / h.total));
  box.innerHTML = historial.slice(0, 6).map(h => {
    const pct = Math.round((h.score / h.total) * 100);
    const d = new Date(h.date);
    const fecha = d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" }) +
      " · " + d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
    const esRepaso = h.modo === "repaso";
    const esSim = h.modo === "simulacro" || esRepaso;
    const modo = esRepaso ? "RepasoQuiz" : esSim ? "Simulacro" : "Práctica";
    return '<div class="history-row' + (h.score / h.total === mejor ? " history-best" : "") + '">' +
      '<span class="text-slate-400">' + fecha + '</span>' +
      '<span class="tag tag-' + (esSim ? "simulacro" : "practica") + ' hidden sm:inline-flex">' + modo + '</span>' +
      '<span>' + h.score + '/' + h.total + '</span>' +
      '<span class="text-sky-400 font-bold">' + pct + '%</span>' +
    '</div>';
  }).join("");
}

export function renderStats({ materia, banco, obtenerP, historial, actividad, meta, onCambiarMeta }) {
  if (!materia) return;
  if (!banco.length) {
    $("stat-total").textContent = "0";
    $("stat-parciales").textContent = "0";
    $("stat-temas").textContent = "0";
    $("stats-panel").innerHTML = '<div class="bg-slate-900 border border-slate-700 rounded-xl p-4 my-5 text-sm text-amber-200 flex items-center gap-2">' + icono("aviso", "icono-sm") + '<span>Contenido en preparación: esta materia todavía no tiene preguntas. Vuelve pronto.</span></div>';
    const bd = $("btn-debiles");
    const bv = $("btn-vencidas");
    if (bd) bd.classList.add("hidden");
    if (bv) bv.classList.add("hidden");
    return;
  }
  let ok = 0, fail = 0, respondidas = 0, debiles = 0;
  banco.forEach(q => {
    const p = obtenerP(q.id);
    ok += p.ok;
    fail += p.fail;
    if (p.ok + p.fail > 0) respondidas++;
    if (esDebil(p)) debiles++;
  });
  const precision = (ok + fail) ? Math.round((ok / (ok + fail)) * 100) : 0;
  const mejor = historial.length ? Math.max.apply(null, historial.map(h => Math.round((h.score / h.total) * 100))) : null;
  const racha = calcularRacha(actividad);
  const hoy = actividad[hoyISO()] || 0;
  const pctMeta = Math.min(100, Math.round((hoy / meta) * 100));

  let html = '<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">' +
    tarjetaStat(precision + "%", "Precisión global", "#38bdf8") +
    tarjetaStat(respondidas + " / " + banco.length, "Respondidas", "#a78bfa") +
    tarjetaStat(String(racha), "Racha (días)", "#fbbf24") +
    tarjetaStat(mejor === null ? "—" : mejor + "%", "Mejor puntaje", "#34d399") +
  '</div>';

  html += '<div class="bg-slate-900 border border-slate-700 rounded-xl p-4 my-5">' +
    '<div class="flex items-center justify-between gap-3 flex-wrap">' +
      '<span class="text-sm font-semibold text-slate-300">Meta de hoy</span>' +
      '<label class="text-xs text-slate-400 flex items-center gap-2">meta diaria:' +
        '<input id="meta-input" type="number" min="1" value="' + meta + '" class="stat-input">' +
      '</label>' +
    '</div>' +
    '<div class="progress-track mt-3 mb-2"><div class="progress-fill" style="width:' + pctMeta + '%"></div></div>' +
    '<p class="text-xs text-slate-400">' + hoy + ' de ' + meta + ' preguntas hoy · racha de ' + racha + ' día(s) · ' + debiles + ' débil(es) por repasar</p>' +
  '</div>';

  html += '<h2 class="section-title">Evolución</h2>' +
    '<div id="grafica-wrap" class="hidden"><canvas id="grafica" class="w-full h-48 bg-slate-900 border border-slate-700 rounded-xl"></canvas></div>' +
    '<p id="grafica-vacia" class="text-sm text-slate-400">Completa al menos 2 rondas para ver tu evolución.</p>';

  const temas = [...new Set(banco.map(q => q.tema))];
  let hayAvance = false;
  let filas = "";
  temas.forEach(t => {
    const qs = banco.filter(q => q.tema === t);
    let tOk = 0, tFail = 0;
    qs.forEach(q => { const p = obtenerP(q.id); tOk += p.ok; tFail += p.fail; });
    if (tOk + tFail > 0) hayAvance = true;
    const pct = (tOk + tFail) ? Math.round((tOk / (tOk + tFail)) * 100) : 0;
    filas += '<div class="topic-row">' +
      '<span class="text-slate-300">' + t + '</span>' +
      '<div class="topic-bar"><div class="topic-bar-fill" style="width:' + pct + '%; background:' + colorTema(materia, t) + '"></div></div>' +
      '<span class="topic-score">' + pct + '%</span>' +
    '</div>';
  });
  html += '<h2 class="section-title">Avance por tema</h2>' +
    (hayAvance ? '<div class="flex flex-col gap-2.5">' + filas + '</div>' : '<p class="text-sm text-slate-400">Responde preguntas para ver tu avance.</p>');

  let filasDif = "";
  ["facil", "media", "dificil"].forEach(d => {
    const qs = banco.filter(q => q.dificultad === d);
    let tOk = 0, tFail = 0;
    qs.forEach(q => { const p = obtenerP(q.id); tOk += p.ok; tFail += p.fail; });
    const pctD = (tOk + tFail) ? Math.round((tOk / (tOk + tFail)) * 100) : 0;
    const color = d === "facil" ? "#34d399" : d === "media" ? "#fbbf24" : "#f87171";
    filasDif += '<div class="topic-row">' +
      '<span class="text-slate-300">' + (DIF_LABELS[d] || d) + '</span>' +
      '<div class="topic-bar"><div class="topic-bar-fill" style="width:' + pctD + '%; background:' + color + '"></div></div>' +
      '<span class="topic-score">' + pctD + '%</span>' +
    '</div>';
  });
  html += '<h2 class="section-title">Avance por dificultad</h2>' +
    (hayAvance ? '<div class="flex flex-col gap-2.5">' + filasDif + '</div>' : '<p class="text-sm text-slate-400">Responde preguntas para ver tu avance.</p>');

  const peores = banco.map(q => ({ q, fail: obtenerP(q.id).fail })).filter(x => x.fail > 0).sort((a, b) => b.fail - a.fail).slice(0, 5);
  if (peores.length) {
    html += '<h2 class="section-title">Más falladas</h2><div class="flex flex-col gap-2">';
    peores.forEach(x => {
      html += '<div class="peor-row"><span class="flex-1 text-slate-300 leading-snug">' + escapar(x.q.length > 95 ? x.q.slice(0, 95) + "…" : x.q) + '</span><span class="text-rose-300 font-bold whitespace-nowrap">' + x.fail + ' fallo' + (x.fail > 1 ? "s" : "") + '</span></div>';
    });
    html += '</div>';
  }

  $("stats-panel").innerHTML = html;
  const metaInput = $("meta-input");
  if (metaInput) metaInput.addEventListener("change", e => onCambiarMeta(e.target.value));
  const nParciales = new Set(banco.map(q => q.parcial)).size;
  $("stat-total").textContent = banco.length;
  $("stat-parciales").textContent = nParciales;
  $("stat-parciales-txt").textContent = nParciales === 1 ? "parcial" : "parciales";
  $("stat-temas").textContent = new Set(banco.map(q => q.tema)).size;
  const vencidasCount = banco.filter(q => vencida(obtenerP(q.id))).length;
  const btnVencidas = $("btn-vencidas");
  if (btnVencidas) {
    btnVencidas.classList.toggle("hidden", !vencidasCount);
    btnVencidas.textContent = "Repaso espaciado (" + vencidasCount + ")";
  }
  $("btn-debiles").classList.toggle("hidden", !debiles);
  dibujarGrafica(historial);
}

function dibujarGrafica(historialCompleto) {
  const canvas = $("grafica");
  const wrap = $("grafica-wrap");
  const vacia = $("grafica-vacia");
  if (!canvas) return;
  const historial = historialCompleto.slice(0, 12).reverse();
  if (historial.length < 2) {
    if (wrap) wrap.classList.add("hidden");
    if (vacia) vacia.classList.remove("hidden");
    return;
  }
  if (wrap) wrap.classList.remove("hidden");
  if (vacia) vacia.classList.add("hidden");
  const dpr = window.devicePixelRatio || 1;
  const ancho = canvas.clientWidth || 600;
  const alto = 180;
  canvas.width = ancho * dpr;
  canvas.height = alto * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, ancho, alto);
  const pad = 32;
  const datos = historial.map(h => Math.round((h.score / h.total) * 100));
  const x = i => pad + (i * (ancho - pad * 2)) / (datos.length - 1);
  const y = v => alto - pad - (v / 100) * (alto - pad * 2);
  ctx.font = "10px sans-serif";
  [0, 50, 100].forEach(v => {
    ctx.strokeStyle = "#334155";
    ctx.beginPath();
    ctx.moveTo(pad, y(v));
    ctx.lineTo(ancho - pad, y(v));
    ctx.stroke();
    ctx.fillStyle = "#64748b";
    ctx.fillText(v + "%", 4, y(v) + 3);
  });
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  datos.forEach((v, i) => { i ? ctx.lineTo(x(i), y(v)) : ctx.moveTo(x(i), y(v)); });
  ctx.stroke();
  ctx.fillStyle = "#38bdf8";
  datos.forEach((v, i) => {
    ctx.beginPath();
    ctx.arc(x(i), y(v), 3, 0, Math.PI * 2);
    ctx.fill();
  });
}
