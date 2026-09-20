// Render de historial y estadísticas por materia (incluida la gráfica canvas).
// Funciones de render que reciben los datos por parámetro (materia, banco, progreso vía
// callback `obtenerP`, historial, actividad y meta ya normalizada); no lee localStorage.
//
// Refactor «Noche calma»:
//  - Paleta del sistema: acento niebla + semánticos salvia/terracota/ámbar (nada de slate/sky).
//  - Movimiento solo con tokens --mov-* y un easing; el canvas respeta prefers-reduced-motion.
//  - Feedback que nunca depende solo del color: número + texto + estructura.
//  - Objetivos táctiles de 44px, foco visible y progressbar con atributos aria.
//  - API compatible: renderHistory(historial[, onEmpezar]) y renderStats({...}).
import { calcularRacha, esDebil, hoyISO, vencida } from "../../core/progreso.js";
import { DIF_LABELS, colorTema, escapar } from "../helpers.js";
import { estadoVacio, aviso } from "../componentes/estados.js";

const $ = id => document.getElementById(id);

/* ---------------------------------------------------------------------------
 * Tokens del tema (espejo de tokens.css; si ya existen como variables CSS,
 * sustituir estos literales por su lectura).
 * ------------------------------------------------------------------------- */
const TEMA = {
  fondo: "#1A1C22",
  superficie: "#22252D",
  superficie2: "#2B2F38",
  texto: "#E7E5DE",
  apagado: "#A9ADB6",
  acento: "#9BB8C9",
  acentoFuerte: "#7898B0",
  exito: "#8FBF9F",
  alerta: "#D9BC8A",
  error: "#D99A8B",
};
const COLOR_DIF = { facil: TEMA.exito, media: TEMA.alerta, dificil: TEMA.error };

const reduceMotion = () =>
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Color semántico de un porcentaje. Siempre se muestra junto al número, nunca solo. */
const colorPct = p => (p >= 75 ? TEMA.exito : p >= 50 ? TEMA.alerta : TEMA.error);

/* Easing único del sistema, cubic-bezier(0.22, 1, 0.36, 1), resuelto en JS para el canvas. */
function easingMovimiento() {
  const cx = 3 * 0.22, bx = 3 * (0.36 - 0.22) - cx, ax = 1 - cx - bx;
  const cy = 3 * 1, by = 3 * (1 - 1) - cy, ay = 1 - cy - by;
  const fx = t => ((ax * t + bx) * t + cx) * t;
  const fy = t => ((ay * t + by) * t + cy) * t;
  const dfx = t => (3 * ax * t + 2 * bx) * t + cx;
  return x => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) { // Newton
      const e = fx(t) - x;
      if (Math.abs(e) < 1e-5) return fy(t);
      const d = dfx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    let lo = 0, hi = 1; // bisección de respaldo
    t = x;
    for (let i = 0; i < 20; i++) {
      const m = fx(t);
      if (Math.abs(m - x) < 1e-5) break;
      if (m < x) lo = t; else hi = t;
      t = (lo + hi) / 2;
    }
    return fy(t);
  };
}

/* Estado vivo de la gráfica (animación + observador de tamaño), limpio entre renders. */
let rafGrafica = 0;
let roGrafica = null;
function detenerAnimacionGrafica() {
  if (rafGrafica) { cancelAnimationFrame(rafGrafica); rafGrafica = 0; }
}
function detenerGrafica() {
  detenerAnimacionGrafica();
  if (roGrafica) { roGrafica.disconnect(); roGrafica = null; }
}

/* ------------------------------ Helpers UI ------------------------------- */

function tarjetaStat(valor, etiqueta, color, extra) {
  return '<div class="stat-card">' +
    '<div class="stat-value tabular" style="color:' + (color || TEMA.acento) + '">' + valor + '</div>' +
    '<div class="stat-label">' + etiqueta + '</div>' +
    (extra ? '<div class="stat-extra">' + extra + '</div>' : '') +
  '</div>';
}

function tiempoRelativo(iso) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "hace un momento";
  if (s < 3600) return "hace " + Math.round(s / 60) + " min";
  if (s < 86400) return "hace " + Math.round(s / 3600) + " h";
  return "hace " + Math.round(s / 86400) + " d";
}

/* El banco puede traer la pregunta como string o como objeto; extraer con seguridad. */
function textoPregunta(q) {
  const t = typeof q === "string" ? q : (q && (q.pregunta || q.enunciado || q.texto)) || "";
  return typeof t === "string" ? t : "";
}

/* ------------------------------- Historial ------------------------------- */

function pintarHistorial(historial, limite, onEmpezar) {
  const box = $("history-section");
  if (!box) return;
  if (!historial.length) {
    box.innerHTML =
      estadoVacio("Aún no hay intentos registrados. ¡Empieza con una práctica o el simulacro!") +
      (onEmpezar ? '<button type="button" class="btn-cta mt-3" data-accion="empezar">Empezar una práctica</button>' : "");
    const btn = box.querySelector('[data-accion="empezar"]');
    if (btn && onEmpezar) btn.addEventListener("click", onEmpezar);
    return;
  }
  const mejor = Math.max.apply(null, historial.map(h => h.score / h.total));
  const filas = historial.slice(0, limite).map(h => {
    const pct = Math.round((h.score / h.total) * 100);
    const d = new Date(h.date);
    const fecha = d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" }) +
      " · " + d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
    const esRepaso = h.modo === "repaso";
    const esSim = h.modo === "simulacro" || esRepaso;
    const modo = esRepaso ? "RepasoQuiz" : esSim ? "Simulacro" : "Práctica";
    const esMejor = h.score / h.total === mejor;
    return '<div class="history-row' + (esMejor ? " history-best" : "") + '">' +
      '<div class="history-fecha">' +
        '<span class="history-cuando">' + fecha + '</span>' +
        '<span class="history-rel">' + tiempoRelativo(h.date) + '</span>' +
      '</div>' +
      (esMejor ? '<span class="tag-best">Mejor</span>' : '') +
      '<span class="tag tag-' + (esSim ? "simulacro" : "practica") + ' hidden sm:inline-flex">' + modo + '</span>' +
      '<span class="history-frac tabular hidden sm:inline">' + h.score + '/' + h.total + '</span>' +
      '<div class="mini-bar hidden sm:block" aria-hidden="true"><div style="width:' + pct + '%;background:' + colorPct(pct) + '"></div></div>' +
      '<span class="history-pct tabular" style="color:' + colorPct(pct) + '">' + pct + '%</span>' +
    '</div>';
  }).join("");

  let html = filas;
  if (historial.length > limite) {
    html += '<button type="button" class="btn-mas" data-expandir="1">Ver los ' + historial.length + ' intentos</button>';
  } else if (limite > 6) {
    html += '<button type="button" class="btn-mas" data-expandir="0">Ver menos</button>';
  }
  box.innerHTML = html;
  const btn = box.querySelector(".btn-mas");
  if (btn) btn.addEventListener("click", () =>
    pintarHistorial(historial, btn.dataset.expandir === "1" ? historial.length : 6, onEmpezar));
}

export function renderHistory(historial, onEmpezar) {
  pintarHistorial(historial || [], 6, onEmpezar);
}

/* ------------------------------ Estadísticas ----------------------------- */

export function renderStats({ materia, banco = [], obtenerP, historial = [], actividad = {}, meta, onCambiarMeta }) {
  if (!materia) return;
  const panel = $("stats-panel");
  if (!panel) return;
  detenerGrafica();

  if (!banco.length) {
    $("stat-total").textContent = "0";
    $("stat-parciales").textContent = "0";
    $("stat-temas").textContent = "0";
    panel.innerHTML = aviso("Contenido en preparación: esta materia todavía no tiene preguntas. Vuelve pronto.");
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
  const totalResp = ok + fail;
  const precision = totalResp ? Math.round((ok / totalResp) * 100) : 0;
  const mejor = historial.length
    ? Math.max.apply(null, historial.map(h => Math.round((h.score / h.total) * 100)))
    : null;
  const promedio = historial.length
    ? Math.round((historial.reduce((s, h) => s + h.score / h.total, 0) / historial.length) * 100)
    : null;
  const racha = calcularRacha(actividad);
  const hoy = actividad[hoyISO()] || 0;
  const pctMeta = meta > 0 ? Math.min(100, Math.round((hoy / meta) * 100)) : 0;
  const cumplida = meta > 0 && hoy >= meta;

  let html = '<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">' +
    tarjetaStat(totalResp ? precision + "%" : "—", "Precisión global",
      totalResp ? colorPct(precision) : TEMA.apagado,
      totalResp ? ok + " aciertos · " + fail + " fallos" : "sin respuestas aún") +
    tarjetaStat(respondidas + " / " + banco.length, "Respondidas", TEMA.acento,
      debiles ? debiles + " en estado débil" : "sin temas débiles") +
    tarjetaStat(String(racha), "Racha (días)", TEMA.alerta, hoy + " preguntas hoy") +
    tarjetaStat(mejor === null ? "—" : mejor + "%", "Mejor puntaje", TEMA.exito,
      promedio === null ? "" : "promedio " + promedio + "%") +
  '</div>';

  /* Meta diaria: se celebra el cumplimiento, nunca se castiga el retraso. */
  html += '<section class="meta-card' + (cumplida ? ' meta-ok' : '') + '" aria-label="Meta diaria">' +
    '<div class="meta-head">' +
      '<span class="meta-title">Meta de hoy</span>' +
      '<div class="meta-controles">' +
        '<button type="button" class="meta-btn" data-paso="-5" aria-label="Reducir la meta diaria">−</button>' +
        '<label class="meta-label" for="meta-input">meta diaria</label>' +
        '<input id="meta-input" type="number" min="1" value="' + meta + '" class="stat-input">' +
        '<button type="button" class="meta-btn" data-paso="5" aria-label="Aumentar la meta diaria">+</button>' +
      '</div>' +
    '</div>' +
    '<div class="progress-track mt-3 mb-2" role="progressbar" aria-label="Progreso de la meta diaria" ' +
      'aria-valuenow="' + Math.min(hoy, meta) + '" aria-valuemin="0" aria-valuemax="' + meta + '">' +
      '<div class="progress-fill" style="width:' + pctMeta + '%"></div>' +
    '</div>' +
    '<p class="meta-pie">' +
      (cumplida ? '<strong>Meta cumplida.</strong> ' : '') +
      hoy + ' de ' + meta + ' preguntas hoy · racha de ' + racha + ' día(s) · ' +
      debiles + ' débil(es) por repasar' +
    '</p>' +
  '</section>';

  html += '<h2 class="section-title">Evolución</h2>' +
    '<div id="grafica-wrap" class="hidden"><canvas id="grafica" class="grafica-canvas" role="img"></canvas></div>' +
    '<p id="grafica-vacia" class="hint">Completa al menos 2 rondas para ver tu evolución.</p>';

  /* Tema y dificultad: listas paralelas, juntas en pantallas anchas. */
  const temas = [...new Set(banco.map(q => q.tema))];
  let hayAvance = false;
  let filas = "";
  temas.forEach(t => {
    let tOk = 0, tFail = 0;
    banco.filter(q => q.tema === t).forEach(q => { const p = obtenerP(q.id); tOk += p.ok; tFail += p.fail; });
    if (tOk + tFail > 0) hayAvance = true;
    const pct = (tOk + tFail) ? Math.round((tOk / (tOk + tFail)) * 100) : 0;
    filas += '<div class="topic-row">' +
      '<span class="topic-nombre" title="' + escapar(t) + '">' + escapar(t) + '</span>' +
      '<div class="topic-bar" aria-hidden="true"><div class="topic-bar-fill" style="width:' + pct + '%;background:' + colorTema(materia, t) + '"></div></div>' +
      '<span class="topic-score tabular">' + pct + '%<span class="topic-n">' + (tOk + tFail) + ' resp.</span></span>' +
    '</div>';
  });

  let filasDif = "";
  ["facil", "media", "dificil"].forEach(d => {
    let tOk = 0, tFail = 0;
    banco.filter(q => q.dificultad === d).forEach(q => { const p = obtenerP(q.id); tOk += p.ok; tFail += p.fail; });
    const pctD = (tOk + tFail) ? Math.round((tOk / (tOk + tFail)) * 100) : 0;
    filasDif += '<div class="topic-row">' +
      '<span class="topic-nombre">' + (DIF_LABELS[d] || d) + '</span>' +
      '<div class="topic-bar" aria-hidden="true"><div class="topic-bar-fill" style="width:' + pctD + '%;background:' + COLOR_DIF[d] + '"></div></div>' +
      '<span class="topic-score tabular">' + pctD + '%<span class="topic-n">' + (tOk + tFail) + ' resp.</span></span>' +
    '</div>';
  });

  html += '<div class="grid-avance">' +
    '<section><h2 class="section-title">Avance por tema</h2>' +
      (hayAvance ? filas : '<p class="hint">Responde preguntas para ver tu avance.</p>') + '</section>' +
    '<section><h2 class="section-title">Avance por dificultad</h2>' +
      (hayAvance ? filasDif : '<p class="hint">Responde preguntas para ver tu avance.</p>') + '</section>' +
  '</div>';

  const peores = banco
    .map(q => ({ q, fail: obtenerP(q.id).fail }))
    .filter(x => x.fail > 0)
    .sort((a, b) => b.fail - a.fail)
    .slice(0, 5);
  if (peores.length) {
    html += '<h2 class="section-title">Preguntas que más te cuestan</h2><div class="peor-list">';
    peores.forEach(x => {
      const dif = x.q && x.q.dificultad;
      const texto = textoPregunta(x.q);
      html += '<div class="peor-row">' +
        (DIF_LABELS[dif] ? '<span class="tag-dif tag-dif-' + dif + '">' + DIF_LABELS[dif] + '</span>' : '') +
        '<span class="peor-texto">' + escapar(texto.length > 95 ? texto.slice(0, 95) + "…" : texto) + '</span>' +
        '<span class="peor-fallos tabular">' + x.fail + ' fallo' + (x.fail > 1 ? "s" : "") + '</span>' +
      '</div>';
    });
    html += '</div>';
  }

  panel.innerHTML = html;

  /* Controles de la meta: input + steppers de 44px (cómodos en móvil). */
  const metaInput = $("meta-input");
  if (metaInput) {
    const cambiar = v => { if (onCambiarMeta) onCambiarMeta(v); };
    metaInput.addEventListener("change", e => cambiar(e.target.value));
    panel.querySelectorAll(".meta-btn").forEach(b =>
      b.addEventListener("click", () => {
        const v = Math.max(1, (parseInt(metaInput.value, 10) || 1) + Number(b.dataset.paso));
        metaInput.value = v;
        cambiar(v);
      }));
  }

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
  const btnDebiles = $("btn-debiles"); // antes sin guarda: un TypeError aquí impedía dibujar la gráfica
  if (btnDebiles) btnDebiles.classList.toggle("hidden", !debiles);

  dibujarGrafica(historial);
  const wrapG = $("grafica-wrap");
  if (wrapG && historial.length >= 2) {
    let primeraLectura = true; // ResizeObserver dispara al observar: no repetir la animación
    roGrafica = new ResizeObserver(() => {
      if (primeraLectura) { primeraLectura = false; return; }
      dibujarGrafica(historial, true);
    });
    roGrafica.observe(wrapG);
  }
}

/* -------------------------------- Gráfica -------------------------------- */

function dibujarGrafica(historialCompleto, sinAnimar) {
  const canvas = $("grafica");
  const wrap = $("grafica-wrap");
  const vacia = $("grafica-vacia");
  if (!canvas) return;
  detenerAnimacionGrafica();

  const historial = historialCompleto.slice(0, 12).reverse();
  if (historial.length < 2) {
    if (wrap) wrap.classList.add("hidden");
    if (vacia) vacia.classList.remove("hidden");
    return;
  }
  if (wrap) wrap.classList.remove("hidden");
  if (vacia) vacia.classList.add("hidden");

  const datos = historial.map(h => Math.round((h.score / h.total) * 100));
  canvas.setAttribute("aria-label",
    "Evolución de tus últimos " + datos.length + " resultados. Último resultado: " +
    datos[datos.length - 1] + " por ciento.");

  const dpr = window.devicePixelRatio || 1;
  const ancho = canvas.clientWidth || 600;
  const alto = canvas.clientHeight || 192; // coincide con la altura CSS; antes 180 y el bitmap se deformaba
  canvas.width = ancho * dpr;
  canvas.height = alto * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const pad = 32;
  const x = i => pad + (i * (ancho - pad * 2)) / (datos.length - 1);
  const y = v => alto - pad - (v / 100) * (alto - pad * 2);
  const fmt = d => new Date(d).toLocaleDateString("es-CO", { day: "2-digit", month: "short" });

  const trazarCurva = () => {
    ctx.beginPath();
    ctx.moveTo(x(0), y(datos[0]));
    for (let i = 1; i < datos.length - 1; i++) { // suavizado por puntos medios
      ctx.quadraticCurveTo(x(i), y(datos[i]),
        (x(i) + x(i + 1)) / 2, (y(datos[i]) + y(datos[i + 1])) / 2);
    }
    ctx.lineTo(x(datos.length - 1), y(datos[datos.length - 1]));
  };

  const dibujar = progreso => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, ancho, alto);
    ctx.font = '10px "Segoe UI", Tahoma, sans-serif';

    // Rejilla y eje Y (separación por luminancia sutil, como las superficies)
    ctx.textAlign = "left";
    [0, 50, 100].forEach(v => {
      ctx.strokeStyle = TEMA.superficie2;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad, y(v));
      ctx.lineTo(ancho - pad, y(v));
      ctx.stroke();
      ctx.fillStyle = TEMA.apagado;
      ctx.fillText(v + "%", 4, y(v) + 3);
    });

    // Fechas de los extremos
    ctx.textAlign = "center";
    ctx.fillStyle = TEMA.apagado;
    ctx.fillText(fmt(historial[0].date), Math.max(pad, 34), alto - 8);
    ctx.fillText(fmt(historial[historial.length - 1].date), Math.min(ancho - pad, ancho - 34), alto - 8);

    // Datos revelados de izquierda a derecha según `progreso`
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, pad + (ancho - pad * 2) * progreso + 3, alto);
    ctx.clip();

    // Área bajo la curva: acento niebla muy tenue (profundidad, no neón)
    const base = y(0) + 4;
    trazarCurva();
    ctx.lineTo(x(datos.length - 1), base);
    ctx.lineTo(x(0), base);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, y(100), 0, base);
    grad.addColorStop(0, "rgba(155, 184, 201, 0.20)");
    grad.addColorStop(1, "rgba(155, 184, 201, 0)");
    ctx.fillStyle = grad;
    ctx.fill();

    // Línea de tendencia
    trazarCurva();
    ctx.strokeStyle = TEMA.acentoFuerte;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    // Puntos: color semántico + borde de superficie (legibles sin depender del color)
    datos.forEach((v, i) => {
      ctx.beginPath();
      ctx.arc(x(i), y(v), 3.5, 0, Math.PI * 2);
      ctx.fillStyle = colorPct(v);
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = TEMA.superficie;
      ctx.stroke();
    });
    ctx.restore();
  };

  if (sinAnimar || reduceMotion()) {
    dibujar(1);
    return;
  }
  // Trazado progresivo con el easing único del sistema (~--mov-enfasis)
  const ease = easingMovimiento();
  const t0 = performance.now();
  const DUR = 460;
  const paso = ahora => {
    const t = Math.min(1, (ahora - t0) / DUR);
    dibujar(ease(t));
    rafGrafica = t < 1 ? requestAnimationFrame(paso) : 0;
  };
  rafGrafica = requestAnimationFrame(paso);
}