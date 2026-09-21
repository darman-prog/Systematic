// stats.js — Diario de estudio · panel de estadísticas
//
// Orden del archivo:
//   1. Configuración y utilidades
//   2. Cálculo puro (sin DOM)
//   3. Vistas (devuelven HTML)
//   4. Gráfica (canvas)
//   5. Cableado del panel y API pública
//
// Los colores viven en el CSS (tokens `--ok`, `--accent`, …). Este archivo no
// duplica la paleta: el canvas los lee con getComputedStyle.

import { calcularRacha, esDebil, hoyISO, vencida } from "../../core/progreso.js";
import { DIF_LABELS, colorTema, escapar } from "../helpers.js";
import { aviso } from "../componentes/estados.js";

const $ = id => document.getElementById(id);

/* ═══════════════════════════════════════════════════════════════
 * 1. CONFIGURACIÓN Y UTILIDADES
 * ═══════════════════════════════════════════════════════════════ */

const CFG = Object.freeze({
  historialInicial: 6,   // filas visibles del historial antes de "Ver todos"
  puntosGrafica: 12,     // rondas que dibuja la gráfica
  diasHeatmap: 7,
  topPeores: 5,
  ventanaTendencia: 5,   // últimas N rondas vs. las N anteriores
  umbralTendencia: 3,    // puntos porcentuales para considerar cambio real
  metaPorDefecto: 20,
  pasoMeta: 5,
});

// Un solo juego de umbrales para color, etiqueta y diagnóstico.
const UMBRAL = Object.freeze({ solido: 75, progreso: 50 });

const C_HERO = +(2 * Math.PI * 52).toFixed(2);  // circunferencia anillo principal
const C_DIF = +(2 * Math.PI * 24).toFixed(2);   // circunferencia anillos de dificultad
const DIFICULTADES = ["facil", "media", "dificil"];

/* ─── Plantilla HTML con escape automático ───
 * Todo lo interpolado se escapa salvo lo que venga de html`` o crudo().
 * Los arrays se aplanan solos (no hace falta .join("")). null/undefined/false → "". */
class Seguro {
  constructor(s) { this.s = s; }
  toString() { return this.s; }
}
const crudo = s => new Seguro(String(s));
const valor = v =>
  v == null || v === false ? ""
  : v instanceof Seguro ? v.s
  : Array.isArray(v) ? v.map(valor).join("")
  : escapar(String(v));
const html = (lit, ...vals) =>
  new Seguro(lit.reduce((out, parte, i) => out + valor(vals[i - 1]) + parte));

/* ─── Números y niveles ─── */
const frac = h => (h.total ? h.score / h.total : 0);
const pct = h => Math.round(frac(h) * 100);
const nivel = p => (p >= UMBRAL.solido ? "ok" : p >= UMBRAL.progreso ? "warn" : "bad");
const labelNivel = p => ({ ok: "sólido", warn: "en progreso", bad: "por reforzar" })[nivel(p)];

/* ─── Fechas ─── */
const isoLocal = d =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const tiempoRelativo = iso => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (!Number.isFinite(s)) return "";
  if (s < 60) return "hace un momento";
  if (s < 3600) return `hace ${Math.floor(s / 60)} min`;
  if (s < 86400) return `hace ${Math.floor(s / 3600)} h`;
  const d = Math.floor(s / 86400);
  if (d < 14) return `hace ${d} d`;
  if (d < 60) return `hace ${Math.floor(d / 7)} sem`;
  const m = Math.floor(d / 30);
  return m === 1 ? "hace 1 mes" : `hace ${m} meses`;
};

/* El historial se normaliza una sola vez: más reciente primero. */
const ordenarHistorial = h => [...h].sort((a, b) => new Date(b.date) - new Date(a.date));

const textoPregunta = q => {
  const t = typeof q === "string" ? q : (q && (q.q || q.pregunta || q.enunciado || q.texto)) || "";
  return typeof t === "string" ? t : "";
};

const reduceMotion = () =>
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─── Easing (mismo que --ease-out del CSS: cubic-bezier(.22, 1, .36, 1)) ─── */
function cubicBezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const fx = t => ((ax * t + bx) * t + cx) * t;
  const fy = t => ((ay * t + by) * t + cy) * t;
  const dfx = t => (3 * ax * t + 2 * bx) * t + cx;
  return x => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) {                 // Newton-Raphson
      const e = fx(t) - x;
      if (Math.abs(e) < 1e-5) return fy(t);
      const d = dfx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    let lo = 0, hi = 1; t = x;                    // bisección de respaldo
    for (let i = 0; i < 20; i++) {
      const m = fx(t);
      if (Math.abs(m - x) < 1e-5) break;
      if (m < x) lo = t; else hi = t;
      t = (lo + hi) / 2;
    }
    return fy(t);
  };
}
const EASE_OUT = cubicBezier(0.22, 1, 0.36, 1);

/* ─── Colores del canvas: se leen de los tokens CSS ─── */
const conAlfa = (hex, a) => {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex;
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
function leerTema(el) {
  const cs = getComputedStyle(el);
  const v = (nombre, respaldo) => cs.getPropertyValue(nombre).trim() || respaldo;
  return {
    superficie: v("--surface", "#22252D"),
    superficie2: v("--surface-2", "#2B2F38"),
    superficie3: v("--surface-3", "#343942"),
    texto: v("--text", "#E7E5DE"),
    apagado: v("--muted", "#A9ADB6"),
    acento: v("--accent", "#9BB8C9"),
    acentoFuerte: v("--accent-strong", "#7898B0"),
    ok: v("--ok", "#8FBF9F"),
    warn: v("--warn", "#D9BC8A"),
    bad: v("--bad", "#D99A8B"),
  };
}

/* ═══════════════════════════════════════════════════════════════
 * 2. CÁLCULO PURO (sin DOM)
 * ═══════════════════════════════════════════════════════════════ */

function calcularTendencia(hist) {
  const V = CFG.ventanaTendencia;
  if (hist.length > V) {
    const media = arr => arr.reduce((s, h) => s + frac(h), 0) / arr.length;
    const diff = Math.round((media(hist.slice(0, V)) - media(hist.slice(V, V * 2))) * 100);
    if (diff > CFG.umbralTendencia) return { dir: "up", texto: "subiendo", val: diff, fiable: true };
    if (diff < -CFG.umbralTendencia) return { dir: "down", texto: "bajando", val: diff, fiable: true };
    return { dir: "flat", texto: "estable", val: diff, fiable: true };
  }
  if (hist.length >= 2) return { dir: "flat", texto: "empezando", val: 0, fiable: false };
  return { dir: "flat", texto: "sin datos", val: 0, fiable: false };
}

function calcularStats({ materia, banco, obtenerP, historial, actividad, meta }) {
  /* Una sola pasada por el banco (antes eran ~10 recorridos con filter). */
  let ok = 0, fail = 0, respondidas = 0, debiles = 0, vencidas = 0;
  const porTema = new Map(), porDif = new Map(), candidatas = [];
  const acumular = (mapa, clave, p) => {
    const a = mapa.get(clave) ?? mapa.set(clave, { ok: 0, fail: 0 }).get(clave);
    a.ok += p.ok; a.fail += p.fail;
  };

  for (const q of banco) {
    const p = obtenerP(q.id);
    ok += p.ok; fail += p.fail;
    if (p.ok + p.fail > 0) respondidas++;
    if (vencida(p)) vencidas++;
    if (esDebil(p)) {
      debiles++;
      if (p.fail > 0) candidatas.push({ q, p });
    }
    acumular(porTema, q.tema, p);
    acumular(porDif, q.dificultad, p);
  }

  const totalResp = ok + fail;
  const precision = totalResp ? Math.round((ok / totalResp) * 100) : 0;

  /* Historial */
  const hist = ordenarHistorial(historial);
  const pcts = hist.map(pct);
  const mejor = pcts.length ? Math.max(...pcts) : null;
  const promedio = pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : null;
  const tendencia = calcularTendencia(hist);

  /* Meta y racha */
  const metaN = Number(meta) > 0 ? Math.floor(Number(meta)) : CFG.metaPorDefecto;
  const hoy = actividad[hoyISO()] || 0;
  const racha = calcularRacha(actividad);
  const pctMeta = Math.min(100, Math.round((hoy / metaN) * 100));

  /* Heatmap: se ancla en hoyISO() (a mediodía local) para que las claves
   * coincidan con las de `actividad` y el día de la semana no se corra. */
  const ancla = new Date(hoyISO() + "T12:00:00");
  const base = Number.isNaN(ancla.getTime()) ? new Date() : ancla;
  const dias = [];
  for (let i = CFG.diasHeatmap - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    const n = actividad[isoLocal(d)] || 0;
    const r = n / metaN;   // la intensidad se mide contra la meta, no contra el máximo semanal
    dias.push({
      n, esHoy: i === 0,
      dow: d.toLocaleDateString("es-CO", { weekday: "short" }),
      intensidad: n === 0 ? 0 : r < 0.34 ? 1 : r < 0.67 ? 2 : r < 1 ? 3 : 4,
    });
  }

  /* Temas y dificultades */
  const temas = [...porTema].map(([nombre, a]) => {
    const n = a.ok + a.fail;
    return { nombre, n, pct: n ? Math.round((a.ok / n) * 100) : null, color: colorTema(materia, nombre) };
  });
  const temasConDatos = temas.filter(t => t.n > 0).sort((a, b) => b.pct - a.pct);
  const difs = DIFICULTADES.map(d => {
    const a = porDif.get(d) ?? { ok: 0, fail: 0 };
    const n = a.ok + a.fail;
    return { d, n, pct: n ? Math.round((a.ok / n) * 100) : null };
  });

  /* Peores preguntas: mismo criterio que el contador de débiles (esDebil).
   * El orden usa una proporción suavizada para que 1 fallo y 0 aciertos
   * no supere a una pregunta con 8 fallos y 4 aciertos. */
  const peores = candidatas
    .map(({ q, p }) => {
      const ratio = p.fail / (p.ok + p.fail);
      return {
        q, p,
        score: (p.fail + 1) / (p.ok + p.fail + 2),
        urg: ratio >= 0.6 ? "alta" : ratio >= 0.4 ? "media" : "baja",
      };
    })
    .sort((a, b) => b.score - a.score || b.p.fail - a.p.fail)
    .slice(0, CFG.topPeores);

  return {
    ok, fail, totalResp, precision, respondidas, debiles, vencidas,
    total: banco.length,
    parciales: new Set(banco.map(q => q.parcial)).size,
    totalTemas: porTema.size,
    hist, mejor, promedio, tendencia,
    meta: metaN, hoy, racha, pctMeta, cumplida: hoy >= metaN,
    dias,
    temasConDatos, temaFuerte: temasConDatos[0], temaDebil: temasConDatos[temasConDatos.length - 1],
    difs, peores,
  };
}

function generarDiagnostico(s) {
  if (!s.hist.length) {
    return "Cuando completes tu primera ronda, aquí aparecerá un resumen de tu desempeño.";
  }
  const { tendencia: t } = s;
  const base = s.precision >= UMBRAL.solido ? "Tu precisión es <b>sólida</b>"
    : s.precision >= UMBRAL.progreso ? "Vas por buen camino"
    : "Necesitas reforzar conceptos";
  const tend = !t.fiable ? ""
    : t.dir === "up" ? ` y estás <b>mejorando</b> (+${t.val}%)`
    : t.dir === "down" ? ` pero tu rendimiento ha <b>bajado</b> (${t.val}%)`
    : " y te mantienes <b>estable</b>";

  const frases = [`${base}${tend}.`];
  if (s.racha >= 7) frases.push(`Tu constancia de <b>${s.racha} días</b> está dando frutos.`);
  else if (s.racha >= 3) frases.push(`Llevas <b>${s.racha} días</b> seguidos, buen ritmo.`);
  else if (s.racha === 0) frases.push("Hoy todavía no has practicado.");

  if (s.debiles > 3) frases.push(`Prioriza las <b>${s.debiles} preguntas débiles</b> antes de seguir avanzando.`);
  else if (s.debiles === 0 && s.respondidas > s.total * 0.5) frases.push("No tienes puntos débiles activos: excelente.");
  return frases.join(" ");
}

const textoFaltan = (hoy, meta) =>
  hoy < meta ? `faltan ${meta - hoy}` : hoy === meta ? "¡lograda!" : `+${hoy - meta} extra`;

/* ═══════════════════════════════════════════════════════════════
 * 3. VISTAS
 * ═══════════════════════════════════════════════════════════════ */

/* ─── Historial ─── */
const vacioHistorial = (nombre, conBoton) => html`
  <div class="empty-historial">
    <div class="empty-ico" aria-hidden="true">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 8v4l3 2"/><circle cx="12" cy="12" r="9"/>
      </svg>
    </div>
    <p class="empty-texto">${nombre ? nombre + ", aún" : "Aún"} no hay intentos registrados.</p>
    <p class="empty-sub">Tu historial empezará a aparecer aquí en cuanto completes tu primera ronda.</p>
    ${conBoton ? html`<button type="button" class="btn-cta mt-3" data-accion="empezar">Empezar una práctica →</button>` : ""}
  </div>`;

function filaHistorial(h, i, hist, mejorIdx) {
  const p = pct(h);
  const d = new Date(h.date);
  const fecha = d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" }) +
    " · " + d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  const esSim = h.modo === "simulacro";
  const prev = hist[i + 1];   // el historial completo, no el slice visible

  let tendencia = "";
  if (prev) {
    const diff = p - pct(prev);
    tendencia = diff > 0
      ? html`<span class="trend trend-up">↑ ${diff}<span class="sr-only"> puntos más que el intento anterior</span></span>`
      : diff < 0
      ? html`<span class="trend trend-down">↓ ${-diff}<span class="sr-only"> puntos menos que el intento anterior</span></span>`
      : html`<span class="trend trend-flat">—<span class="sr-only"> igual que el intento anterior</span></span>`;
  }

  return html`
    <div class="history-row${i === mejorIdx ? " history-best" : ""}" data-nivel="${nivel(p)}" style="--pct:${p}">
      <div class="history-dot" aria-hidden="true"></div>
      <div class="history-main">
        <div class="history-top">
          <span class="history-frac tabular">${h.score}/${h.total}</span>
          <span class="history-pct tabular">${p}% · ${labelNivel(p)}</span>
          ${tendencia}
          ${i === mejorIdx ? html`<span class="tag-best">★ mejor</span>` : ""}
          <span class="tag tag-${esSim ? "simulacro" : "practica"}">${esSim ? "simulacro" : "práctica"}</span>
        </div>
        <div class="history-meta">
          <span class="history-fecha">${fecha}</span>
          <span class="history-rel">${tiempoRelativo(h.date)}</span>
        </div>
      </div>
      <div class="history-bar" aria-hidden="true"><div></div></div>
    </div>`;
}

function pintarHistorial(hist, limite, onEmpezar, nombre) {
  const box = $("history-section");
  if (!box) return;

  if (!hist.length) {
    box.innerHTML = vacioHistorial(nombre, !!onEmpezar).s;
    const btn = box.querySelector('[data-accion="empezar"]');
    if (btn && onEmpezar) btn.addEventListener("click", onEmpezar);
    return;
  }

  const teniaFocoEnMas = document.activeElement?.classList?.contains("btn-mas") && box.contains(document.activeElement);
  const mejorPct = Math.max(...hist.map(pct));
  const mejorIdx = hist.findIndex(h => pct(h) === mejorPct);   // el más reciente entre empates

  box.innerHTML = html`
    <div class="history-list">
      ${hist.slice(0, limite).map((h, i) => filaHistorial(h, i, hist, mejorIdx))}
    </div>
    ${hist.length > limite
      ? html`<button type="button" class="btn-mas" data-expandir="1">Ver los ${hist.length} intentos ↓</button>`
      : limite > CFG.historialInicial
      ? html`<button type="button" class="btn-mas" data-expandir="0">Ver menos ↑</button>`
      : ""}`.s;

  const btn = box.querySelector(".btn-mas");
  if (btn) {
    btn.addEventListener("click", () =>
      pintarHistorial(hist, btn.dataset.expandir === "1" ? hist.length : CFG.historialInicial, onEmpezar, nombre));
    if (teniaFocoEnMas) btn.focus({ preventScroll: true });
  }
}

/* ─── Stats ─── */
const heroHTML = s => {
  const tiene = s.totalResp > 0;
  const t = s.tendencia;
  const flecha = t.dir === "up" ? "↑" : t.dir === "down" ? "↓" : "→";
  const sufijo = t.val !== 0 ? ` (${t.val > 0 ? "+" : ""}${t.val}%)` : "";
  return html`
    <section class="hero-stat" aria-label="Precisión global">
      <div class="hero-ring" aria-hidden="true" data-nivel="${tiene ? nivel(s.precision) : "none"}">
        <svg viewBox="0 0 120 120">
          <circle class="ring-track" cx="60" cy="60" r="52" stroke-width="8" fill="none"/>
          <circle class="ring-fill hero-ring-fill" cx="60" cy="60" r="52" stroke-width="8" fill="none"
                  stroke-linecap="round" stroke-dasharray="${C_HERO}"
                  stroke-dashoffset="${tiene ? +(C_HERO * (1 - s.precision / 100)).toFixed(2) : C_HERO}"
                  transform="rotate(-90 60 60)" style="--circ:${C_HERO}"/>
        </svg>
        <div class="hero-ring-value">
          <span class="hero-num tabular">${tiene ? s.precision : "—"}</span>
          <span class="hero-unit">%</span>
        </div>
      </div>
      <div class="hero-info" data-nivel="${tiene ? nivel(s.precision) : "none"}">
        <span class="hero-label">Precisión global</span>
        <span class="sr-only">${tiene ? s.precision + "%" : "sin datos"}</span>
        <span class="hero-veredicto">${tiene ? labelNivel(s.precision) : "esperando tu primera respuesta"}</span>
        <span class="hero-meta">
          <span class="hero-ok tabular">${s.ok} aciertos</span>
          <span class="hero-sep" aria-hidden="true">·</span>
          <span class="hero-fail tabular">${s.fail} fallos</span>
        </span>
        ${tiene ? html`<span class="hero-trend" data-dir="${t.dir}">${flecha} ${t.texto}${sufijo}</span>` : ""}
      </div>
    </section>`;
};

const kpisHTML = s => html`
  <section class="kpi-row" aria-label="Indicadores clave">
    <div class="kpi">
      <div class="kpi-v tabular">${s.respondidas}<span class="kpi-of">/${s.total}</span></div>
      <div class="kpi-l">Preguntas respondidas</div>
      ${s.debiles
        ? html`<div class="kpi-note note-alert">${s.debiles} por reforzar</div>`
        : html`<div class="kpi-note note-ok">sin puntos débiles</div>`}
    </div>
    <div class="kpi">
      <div class="kpi-v tabular">${s.racha}<span class="kpi-of">d</span></div>
      <div class="kpi-l">Racha activa</div>
      <div class="kpi-note">${s.hoy} preguntas hoy</div>
    </div>
    <div class="kpi">
      <div class="kpi-v tabular">${s.mejor ?? "—"}<span class="kpi-of">%</span></div>
      <div class="kpi-l">Mejor puntaje</div>
      <div class="kpi-note">${s.promedio === null ? "—" : "prom. " + s.promedio + "%"}</div>
    </div>
  </section>`;

const diagnosticoHTML = s => html`
  <section class="diagnostico" style="margin-top: 24px; margin-bottom: 24px;" aria-label="Diagnóstico">
    <div class="diagnostico-ico" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>
      </svg>
    </div>
    <p class="diagnostico-texto">${crudo(generarDiagnostico(s))}</p>
    ${s.debiles > 3 && $("btn-debiles")
      ? html`<button type="button" class="diagnostico-cta" data-accion="repasar-debiles">Repasar las débiles</button>`
      : ""}
  </section>
  `;

const metaHTML = s => html`
  <section class="meta-card${s.cumplida ? " meta-ok" : ""}" aria-label="Meta diaria">
    <div class="meta-head">
      <div class="meta-title-wrap">
        <span class="meta-ico" aria-hidden="true">${s.cumplida ? "✦" : "◐"}</span>
        <span class="meta-title">Meta de hoy</span>
        <span class="meta-badge"${s.cumplida ? "" : crudo(" hidden")}>cumplida</span>
      </div>
      <div class="meta-controles">
        <button type="button" class="meta-btn" data-paso="${-CFG.pasoMeta}" aria-label="Reducir ${CFG.pasoMeta} preguntas">−</button>
        <input id="meta-input" type="number" inputmode="numeric" min="1" value="${s.meta}" class="stat-input" aria-label="Preguntas por día">
        <button type="button" class="meta-btn" data-paso="${CFG.pasoMeta}" aria-label="Aumentar ${CFG.pasoMeta} preguntas">+</button>
      </div>
    </div>
    <div class="progress-track" role="progressbar" aria-label="Progreso de la meta diaria"
         aria-valuemin="0" aria-valuemax="${s.meta}" aria-valuenow="${Math.min(s.hoy, s.meta)}"
         aria-valuetext="${Math.min(s.hoy, s.meta)} de ${s.meta} preguntas">
      <div class="progress-fill" style="--pct:${s.pctMeta}"></div>
    </div>
    <div class="meta-pie">
      <span class="meta-count tabular"><b>${s.hoy}</b> / ${s.meta}</span>
      <span class="meta-extra">${textoFaltan(s.hoy, s.meta)}</span>
    </div>
  </section>`;

const heatmapHTML = s => html`
  <section class="heatmap-card" aria-label="Actividad de los últimos ${CFG.diasHeatmap} días">
    <h2 class="section-title">Últimos ${CFG.diasHeatmap} días</h2>
    <ul class="heatmap" role="list">
      ${s.dias.map(d => html`
        <li class="heatmap-cell${d.esHoy ? " heatmap-today" : ""}" data-int="${d.intensidad}">
          <span class="heatmap-dow">${d.dow}</span>
          <span class="heatmap-n tabular">${d.n}<span class="sr-only"> preguntas${d.esHoy ? ", hoy" : ""}</span></span>
        </li>`)}
    </ul>
    <p class="hint heatmap-leyenda">El color se mide contra tu meta diaria (${s.meta}).</p>
  </section>`;

const evolucionHTML = s => html`
  <section class="evolucion-card">
    <div class="evolucion-head">
      <h2 class="section-title">Evolución</h2>
      ${s.hist.length >= 2 ? html`<span class="evolucion-count tabular">${s.hist.length} rondas</span>` : ""}
    </div>
    <div id="grafica-wrap" class="hidden">
      <canvas id="grafica" class="grafica-canvas" role="img">Gráfica de evolución de tus rondas</canvas>
      <p id="grafica-resumen" class="sr-only"></p>
    </div>
    <p id="grafica-vacia" class="hint graf hint-ico">
      <span aria-hidden="true">◯</span>
      Completa al menos 2 rondas para ver tu evolución
    </p>
  </section>`;

const temasHTML = s => {
  if (!s.temasConDatos.length) {
    return html`
      <section class="temas-card">
        <h2 class="section-title">Por tema</h2>
        <p class="hint">Responde preguntas para ver tu avance.</p>
      </section>`;
  }
  const destacado = (cls, etiqueta, t) => html`
    <div class="tema-destacado ${cls}" data-nivel="${nivel(t.pct)}">
      <span class="td-label">${etiqueta}</span>
      <span class="td-nombre">${t.nombre}</span>
      <span class="td-pct tabular">${t.pct}%</span>
    </div>`;
  return html`
    <section class="temas-card">
      <h2 class="section-title">Por tema</h2>
      <div class="temas-destacados">
        ${destacado("td-fuerte", "fuerte", s.temaFuerte)}
        ${s.temaDebil !== s.temaFuerte ? destacado("td-debil", "por reforzar", s.temaDebil) : ""}
      </div>
      <div class="temas-list">
        ${s.temasConDatos.map(t => html`
          <div class="tema-row" data-nivel="${nivel(t.pct)}" style="--tema:${t.color}; --pct:${t.pct}">
            <span class="tema-dot" aria-hidden="true"></span>
            <span class="tema-nombre" title="${t.nombre}">${t.nombre}</span>
            <div class="tema-bar" aria-hidden="true"><div class="tema-bar-fill"></div></div>
            <span class="tema-score tabular">${t.pct}%</span>
            <span class="tema-n tabular">${t.n}</span>
          </div>`)}
      </div>
    </section>`;
};

const difsHTML = s => html`
  <section class="difs-card">
    <h2 class="section-title">Por dificultad</h2>
    ${s.difs.every(d => d.n === 0)
      ? html`<p class="hint">Responde preguntas para ver tu avance.</p>`
      : html`
        <div class="difs-grid">
          ${s.difs.map(d => html`
            <div class="dif-cell" data-dif="${d.d}">
              <div class="dif-nombre">${DIF_LABELS[d.d] || d.d}</div>
              <div class="dif-ring" aria-hidden="true">
                <svg viewBox="0 0 60 60">
                  <circle class="ring-track" cx="30" cy="30" r="24" stroke-width="5" fill="none"/>
                  <circle class="ring-fill" cx="30" cy="30" r="24" stroke-width="5" fill="none"
                          stroke-linecap="round" stroke-dasharray="${C_DIF}"
                          stroke-dashoffset="${d.pct !== null ? +(C_DIF * (1 - d.pct / 100)).toFixed(2) : C_DIF}"
                          transform="rotate(-90 30 30)" style="--circ:${C_DIF}"/>
                </svg>
                <span class="dif-ring-v tabular">${d.pct ?? "—"}</span>
              </div>
              <span class="sr-only">${DIF_LABELS[d.d] || d.d}: ${d.pct === null ? "sin datos" : d.pct + "%"}</span>
              <div class="dif-n tabular">${d.n} resp.</div>
            </div>`)}
        </div>`}
  </section>`;

const peoresHTML = s => !s.peores.length ? "" : html`
  <section class="peores-card mt-6 mb-6">
    <h2 class="section-title">Por reforzar <span class="section-count">${s.debiles}</span></h2>
    <div class="peor-list">
      ${s.peores.map(({ q, p, urg }) => {
        const texto = textoPregunta(q);
        return html`
          <div class="peor-row" data-urg="${urg}">
            <div class="peor-urg">
              <span class="peor-urg-dot"></span>
              <span class="sr-only">Urgencia ${urg}</span>
            </div>
            <div class="peor-main">
              <div class="peor-texto" title="${texto}">${texto}</div>
              <div class="peor-meta">
                ${q.tema ? html`<span class="peor-tema">${q.tema}</span>` : ""}
                ${q.dificultad && DIF_LABELS[q.dificultad]
                  ? html`<span class="diff diff-${q.dificultad}">${DIF_LABELS[q.dificultad]}</span>` : ""}
                <span class="peor-stats tabular">${p.ok}✓ · ${p.fail}✗</span>
              </div>
            </div>
            <span class="peor-fallos tabular" title="${p.fail} fallo(s)">${p.fail}×</span>
          </div>`;
      })}
    </div>
  </section>`;

/* ═══════════════════════════════════════════════════════════════
 * 4. GRÁFICA (canvas)
 * ═══════════════════════════════════════════════════════════════ */

let rafGrafica = 0, rafResize = 0, roGrafica = null;
const detenerAnimacionGrafica = () => {
  if (rafGrafica) { cancelAnimationFrame(rafGrafica); rafGrafica = 0; }
};
const detenerGrafica = () => {
  detenerAnimacionGrafica();
  if (rafResize) { cancelAnimationFrame(rafResize); rafResize = 0; }
  if (roGrafica) { roGrafica.disconnect(); roGrafica = null; }
};

/** @param hist historial ya ordenado (más reciente primero) */
function dibujarGrafica(hist, sinAnimar) {
  const canvas = $("grafica"), wrap = $("grafica-wrap"), vacia = $("grafica-vacia");
  if (!canvas) return;
  detenerAnimacionGrafica();

  const rondas = hist.slice(0, CFG.puntosGrafica).reverse();
  if (rondas.length < 2) {
    wrap?.classList.add("hidden");
    vacia?.classList.remove("hidden");
    return;
  }
  wrap?.classList.remove("hidden");
  vacia?.classList.add("hidden");

  const datos = rondas.map(pct);
  const promedio = datos.reduce((a, b) => a + b, 0) / datos.length;
  const ultimoDato = datos[datos.length - 1];

  canvas.setAttribute("aria-label",
    `Evolución de tus últimos ${datos.length} resultados. Último: ${ultimoDato}%. Promedio: ${Math.round(promedio)}%.`);
  canvas.setAttribute("aria-describedby", "grafica-resumen");
  const resumen = $("grafica-resumen");
  if (resumen) resumen.textContent = "Resultados del más antiguo al más reciente: " + datos.map(v => v + "%").join(", ") + ".";

  const T = leerTema(canvas);
  const colorNivel = v => T[nivel(v)];

  const dpr = window.devicePixelRatio || 1;
  const ancho = canvas.clientWidth || 600;
  const alto = canvas.clientHeight || 220;
  canvas.width = Math.round(ancho * dpr);
  canvas.height = Math.round(alto * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const pad = { l: 36, r: 24, t: 24, b: 32 };
  const W = ancho - pad.l - pad.r, H = alto - pad.t - pad.b;
  const x = i => pad.l + (i * W) / (datos.length - 1);
  const y = v => pad.t + (1 - v / 100) * H;
  const fmt = d => new Date(d).toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
  const rectRedondo = (rx, ry, rw, rh, r) => {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(rx, ry, rw, rh, r);   // Safari < 16 no lo tiene
    else ctx.rect(rx, ry, rw, rh);
  };

  const trazarCurva = () => {
    ctx.beginPath();
    ctx.moveTo(x(0), y(datos[0]));
    for (let i = 1; i < datos.length - 1; i++) {
      ctx.quadraticCurveTo(x(i), y(datos[i]), (x(i) + x(i + 1)) / 2, (y(datos[i]) + y(datos[i + 1])) / 2);
    }
    ctx.lineTo(x(datos.length - 1), y(ultimoDato));
  };

  const dibujar = progreso => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, ancho, alto);

    // Rejilla
    ctx.font = "10px system-ui, -apple-system, sans-serif";
    ctx.textBaseline = "middle";
    [0, 50, 100].forEach(v => {
      ctx.strokeStyle = T.superficie2;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.l, y(v)); ctx.lineTo(ancho - pad.r, y(v)); ctx.stroke();
      ctx.fillStyle = T.apagado;
      ctx.textAlign = "right";
      ctx.fillText(v + "%", pad.l - 6, y(v));
    });

    // Línea de promedio global
    ctx.strokeStyle = conAlfa(T.acento, 0.3);
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(pad.l, y(promedio)); ctx.lineTo(ancho - pad.r, y(promedio)); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = T.apagado;
    ctx.textAlign = "right";
    ctx.fillText("prom. " + Math.round(promedio) + "%", ancho - pad.r, y(promedio) - 8);

    // Fechas extremas
    ctx.textAlign = "center";
    ctx.fillText(fmt(rondas[0].date), pad.l, alto - 12);
    ctx.fillText(fmt(rondas[rondas.length - 1].date), ancho - pad.r, alto - 12);

    // Revelado progresivo por recorte
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, pad.l + W * progreso + 4, alto);
    ctx.clip();

    // Área bajo la curva
    const base = y(0);
    trazarCurva();
    ctx.lineTo(x(datos.length - 1), base);
    ctx.lineTo(x(0), base);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, y(100), 0, base);
    grad.addColorStop(0, conAlfa(T.acento, 0.22));
    grad.addColorStop(1, conAlfa(T.acento, 0));
    ctx.fillStyle = grad;
    ctx.fill();

    // Línea principal
    trazarCurva();
    ctx.strokeStyle = T.acentoFuerte;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    ctx.stroke();

    // Puntos (con borde para legibilidad)
    datos.forEach((v, i) => {
      ctx.beginPath();
      ctx.arc(x(i), y(v), 4, 0, Math.PI * 2);
      ctx.fillStyle = colorNivel(v);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = T.superficie;
      ctx.stroke();
    });

    // Último punto destacado: halo + etiqueta
    if (progreso >= 1) {
      const last = datos.length - 1;
      ctx.beginPath();
      ctx.arc(x(last), y(ultimoDato), 8, 0, Math.PI * 2);
      ctx.fillStyle = conAlfa(T.acento, 0.15);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x(last), y(ultimoDato), 5, 0, Math.PI * 2);
      ctx.fillStyle = colorNivel(ultimoDato);
      ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = T.superficie; ctx.stroke();

      const label = ultimoDato + "%";
      ctx.font = "bold 11px system-ui, sans-serif";
      const lw = ctx.measureText(label).width + 12;
      const lx = Math.min(x(last) - lw / 2, ancho - pad.r - lw);
      const ly = Math.max(0, y(ultimoDato) - 24);
      ctx.fillStyle = T.superficie3;
      rectRedondo(lx, ly, lw, 18, 4);
      ctx.fill();
      ctx.fillStyle = T.texto;
      ctx.textAlign = "center";
      ctx.fillText(label, lx + lw / 2, ly + 10);
    }
    ctx.restore();
  };

  if (sinAnimar || reduceMotion()) { dibujar(1); return; }
  const t0 = performance.now();
  const DUR = 600;
  const paso = ahora => {
    const t = Math.min(1, (ahora - t0) / DUR);
    dibujar(EASE_OUT(t));
    rafGrafica = t < 1 ? requestAnimationFrame(paso) : 0;
  };
  rafGrafica = requestAnimationFrame(paso);
}

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
  const a = document.activeElement;
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

  const s = calcularStats({ materia, banco, obtenerP, historial, actividad, meta });

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

  const btnV = $("btn-vencidas"), btnD = $("btn-debiles");
  if (btnV) {
    btnV.classList.toggle("hidden", !s.vencidas);
    btnV.textContent = `Repaso espaciado (${s.vencidas})`;
  }
  if (btnD) btnD.classList.toggle("hidden", !s.debiles);

  /* Gráfica + redibujo al cambiar el ancho (con rAF para no redibujar en ráfaga) */
  dibujarGrafica(s.hist, repetido);
  const wrapG = $("grafica-wrap");
  if (wrapG && s.hist.length >= 2) {
    let primera = true;
    roGrafica = new ResizeObserver(() => {
      if (primera) { primera = false; return; }
      cancelAnimationFrame(rafResize);
      rafResize = requestAnimationFrame(() => dibujarGrafica(s.hist, true));
    });
    roGrafica.observe(wrapG);
  }
}