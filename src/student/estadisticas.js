// Cálculo puro del panel de estadísticas: precisión, racha, heatmap, temas, dificultades,
// tendencia y peores preguntas. Sin DOM: el color de tema entra por parámetro y la UI se
// queda con las vistas, el canvas y el diagnóstico en prosa.
import { esDebil, vencida, hoyISO, calcularRacha } from "../core/index.js";

export const CFG_ESTADISTICAS = Object.freeze({
  diasHeatmap: 7,
  topPeores: 5,
  ventanaTendencia: 5,
  umbralTendencia: 3,
  metaPorDefecto: 20
});

export const DIFICULTADES = ["facil", "media", "dificil"];

export const frac = h => (h.total ? h.score / h.total : 0);
export const pct = h => Math.round(frac(h) * 100);

export const ordenarHistorial = h => [...h].sort((a, b) => new Date(b.date) - new Date(a.date));

const isoLocal = d =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function calcularTendencia(hist) {
  const V = CFG_ESTADISTICAS.ventanaTendencia;
  if (hist.length > V) {
    const media = arr => arr.reduce((s, h) => s + frac(h), 0) / arr.length;
    const diff = Math.round((media(hist.slice(0, V)) - media(hist.slice(V, V * 2))) * 100);
    if (diff > CFG_ESTADISTICAS.umbralTendencia) return { dir: "up", texto: "subiendo", val: diff, fiable: true };
    if (diff < -CFG_ESTADISTICAS.umbralTendencia) return { dir: "down", texto: "bajando", val: diff, fiable: true };
    return { dir: "flat", texto: "estable", val: diff, fiable: true };
  }
  if (hist.length >= 2) return { dir: "flat", texto: "empezando", val: 0, fiable: false };
  return { dir: "flat", texto: "sin datos", val: 0, fiable: false };
}

export function calcularStats({
  materia, banco, obtenerP, historial, actividad, meta,
  colorDeTema = () => null
}) {
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
  const metaN = Number(meta) > 0 ? Math.floor(Number(meta)) : CFG_ESTADISTICAS.metaPorDefecto;
  const hoy = actividad[hoyISO()] || 0;
  const racha = calcularRacha(actividad);
  const pctMeta = Math.min(100, Math.round((hoy / metaN) * 100));

  /* Heatmap: se ancla en hoyISO() (a mediodía local) para que las claves
   * coincidan con las de `actividad` y el día de la semana no se corra. */
  const ancla = new Date(hoyISO() + "T12:00:00");
  const base = Number.isNaN(ancla.getTime()) ? new Date() : ancla;
  const dias = [];
  for (let i = CFG_ESTADISTICAS.diasHeatmap - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    const n = actividad[isoLocal(d)] || 0;
    const r = n / metaN;   // la intensidad se mide contra la meta, no contra el máximo semanal
    dias.push({
      n, esHoy: i === 0,
      dow: d.toLocaleDateString("es-CO", { weekday: "short" }),
      intensidad: n === 0 ? 0 : r < 0.34 ? 1 : r < 0.67 ? 2 : r < 1 ? 3 : 4
    });
  }

  /* Temas y dificultades */
  const temas = [...porTema].map(([nombre, a]) => {
    const n = a.ok + a.fail;
    return { nombre, n, pct: n ? Math.round((a.ok / n) * 100) : null, color: colorDeTema(materia, nombre) };
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
        urg: ratio >= 0.6 ? "alta" : ratio >= 0.4 ? "media" : "baja"
      };
    })
    .sort((a, b) => b.score - a.score || b.p.fail - a.p.fail)
    .slice(0, CFG_ESTADISTICAS.topPeores);

  return {
    ok, fail, totalResp, precision, respondidas, debiles, vencidas,
    total: banco.length,
    parciales: new Set(banco.map(q => q.parcial)).size,
    totalTemas: porTema.size,
    hist, mejor, promedio, tendencia,
    meta: metaN, hoy, racha, pctMeta, cumplida: hoy >= metaN,
    dias,
    temasConDatos, temaFuerte: temasConDatos[0], temaDebil: temasConDatos[temasConDatos.length - 1],
    difs, peores
  };
}
