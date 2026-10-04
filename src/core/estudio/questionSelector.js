/**
 * questionSelector.js
 * Selector inteligente de preguntas: evita repeticiones, distribuye tipos/temas,
 * prioriza débiles y vencidas, y rompe patrones indeseados.
 *
 * API pura: no lee localStorage, no modifica el banco. El caller pasa datos
 * y recibe un array de preguntas listo para mostrar.
 */

import { esDebil, vencida } from "./progreso.js";

/* ═══════════════════════════════════════════════════════════════
 * CONFIG — exportable y sobrescribible por el caller
 * ═══════════════════════════════════════════════════════════════ */
export const CONFIG = {
  // Cooldown: una pregunta no reaparece hasta que pasen N preguntas vistas
  cooldown: 20,
  cooldownMin: 5,           // mínimo absoluto al relajar
  relaxCooldownStep: 5,     // cuánto bajar en cada relajación

  // Límites por ronda (evitan saturación de un tipo/tema)
  maxPorTipo: 3,
  maxPorTema: 4,

  // Pesos por dificultad (en modo mixto)
  pesoDificultad: { facil: 0.7, media: 1.0, dificil: 1.3 },

  // Boosts: multiplicadores del score base
  factorDebil: 2.5,
  factorVencida: 3.0,
  boostTipoRaro: 1.5,       // tipos con < 15% de frecuencia reciente
  boostTemaRaro: 1.4,       // temas con < 10% de frecuencia reciente
  boostNuncaVista: 1.3,     // pregunta sin progreso (ok=0, fail=0)

  // Penalties: multiplicadores < 1
  penaltyTipoReciente: 0.4, // si el tipo ocupa > 40% de las últimas 10
  penaltyTemaReciente: 0.5, // si el tema ocupa > 45% de las últimas 10

  // Distribución objetivo para modo "simulacro"
  distribucionSimulacro: { facil: 0.3, media: 0.5, dificil: 0.2 },

  // Umbral de "raro" para boosts (proporción sobre las últimas N)
  umbralRaroTipo: 0.15,
  umbralRaroTema: 0.10,
  ventanaFrecuencia: 10,    // últimas N preguntas para calcular frecuencia

  // Modo "debil": % mínimo de la ronda dedicado a débiles
  minDebilesEnModoDebil: 0.4,
};

/* ═══════════════════════════════════════════════════════════════
 * HELPERS
 * ═══════════════════════════════════════════════════════════════ */

/**
 * Devuelve true si el ID está en cooldown dentro del historial.
 */
function enCooldown(id, historialIds, cooldown) {
  if (!Array.isArray(historialIds) || historialIds.length === 0) return false;
  const ventana = historialIds.slice(-cooldown);
  return ventana.includes(id);
}

/**
 * Aplica filtros declarativos (temas, dificultades) a una pregunta.
 */
function pasaFiltros(p, opts) {
  if (opts.temasPermitidos && !opts.temasPermitidos.includes(p.tema)) return false;
  if (opts.dificultades && !opts.dificultades.includes(p.dificultad)) return false;
  return true;
}

/**
 * Frecuencia de un valor (tipo o tema) en las últimas `n` entradas del historial.
 * Devuelve 0 si no hay historial suficiente.
 */
function frecuencia(idCampo, valor, historialBanco, historialIds, n) {
  if (!Array.isArray(historialIds) || historialIds.length === 0) return 0;
  const ultimos = historialIds.slice(-n);
  const coincidencias = ultimos.filter(id => {
    const p = historialBanco.find(x => x.id === id);
    return p && p[idCampo] === valor;
  }).length;
  return coincidencias / ultimos.length;
}

/**
 * Calcula el score ponderado de una pregunta.
 * A mayor score, mayor probabilidad de ser elegida.
 * @export - Necesario para que el mezclador lo use
 */
export function calcularScore(p, ctx) {
  const { obtenerP, historialIds, historialBanco, config } = ctx;
  const progreso = obtenerP ? obtenerP(p.id) : { ok: 0, fail: 0 };

  let score = 1.0;

  // Peso por dificultad
  score *= config.pesoDificultad[p.dificultad] || 1.0;

  // Nunca vista → boost suave
  if ((progreso.ok || 0) === 0 && (progreso.fail || 0) === 0) {
    score *= config.boostNuncaVista;
  }

  // Pregunta débil → boost fuerte
  if (esDebil(progreso)) {
    score *= config.factorDebil;
  }

  // Pregunta vencida → boost muy fuerte
  if (vencida(progreso)) {
    score *= config.factorVencida;
  }

  // Tipo raro (poco visto) → boost
  const freqTipo = frecuencia("tipo", p.tipo, historialBanco, historialIds, config.ventanaFrecuencia);
  if (freqTipo < config.umbralRaroTipo) score *= config.boostTipoRaro;
  if (freqTipo > 0.4) score *= config.penaltyTipoReciente;

  // Tema raro (poco visto) → boost
  const freqTema = frecuencia("tema", p.tema, historialBanco, historialIds, config.ventanaFrecuencia);
  if (freqTema < config.umbralRaroTema) score *= config.boostTemaRaro;
  if (freqTema > 0.45) score *= config.penaltyTemaReciente;

  return Math.max(score, 0.01);
}

/**
 * Muestreo ponderado sin reemplazo usando ruleta (roulette wheel).
 * Devuelve `k` elementos del array `items` usando sus scores.
 * @export - Necesario para que el mezclador lo use
 */
export function muestrearPonderado(items, scores, k, random) {
  const seleccionados = [];
  const disponibles = items.map((item, i) => ({ item, score: scores[i] }));

  for (let i = 0; i < k && disponibles.length > 0; i++) {
    const total = disponibles.reduce((s, x) => s + x.score, 0);
    if (total <= 0) break;
    let r = random() * total;
    let elegido = null;
    for (const d of disponibles) {
      r -= d.score;
      if (r <= 0) { elegido = d; break; }
    }
    if (!elegido) elegido = disponibles[disponibles.length - 1];
    seleccionados.push(elegido.item);
    disponibles.splice(disponibles.indexOf(elegido), 1);
  }
  return seleccionados;
}

/**
 * Rebalance: si un tipo o tema supera el máximo permitido, quita los de
 * menor score y los reemplaza con otros elegibles (respetando cooldown).
 */
function rebalancear(seleccion, elegibles, campo, maxPermitido, random) {
  const resultado = [...seleccion];

  const grupos = new Map();
  resultado.forEach((p, i) => {
    const k = p[campo];
    if (!grupos.has(k)) grupos.set(k, []);
    grupos.get(k).push(i);
  });

  for (const [clave, indices] of grupos.entries()) {
    if (indices.length <= maxPermitido) continue;

    // Ordenar por score ascendente: los de menor score son los que sacamos
    const ordenados = [...indices].sort((a, b) => {
      const sa = resultado[a].__score || 0;
      const sb = resultado[b].__score || 0;
      return sa - sb;
    });
    const aQuitar = ordenados.slice(0, indices.length - maxPermitido);

    for (const idx of aQuitar) {
      const removida = resultado[idx];

      // Buscar reemplazo: mismo tipo/tema NO, otro sí, sin estar ya en la ronda
      const idsEnRonda = new Set(resultado.map(x => x.id));
      const candidatos = elegibles.filter(c =>
        !idsEnRonda.has(c.id) &&
        c[campo] !== clave
      );

      if (candidatos.length === 0) continue;

      // Sorteo ponderado por score
      const scores = candidatos.map(c => c.__score || 1);
      const total = scores.reduce((s, x) => s + x, 0);
      let r = random() * total;
      let reemplazo = candidatos[0];
      for (let i = 0; i < candidatos.length; i++) {
        r -= scores[i];
        if (r <= 0) { reemplazo = candidatos[i]; break; }
      }
      resultado[idx] = reemplazo;
    }
  }
  return resultado;
}

/* ═══════════════════════════════════════════════════════════════
 * UTILIDADES EXPORTABLES (útiles para stats y debugging)
 * ═══════════════════════════════════════════════════════════════ */

/**
 * Devuelve el array de preguntas elegibles con el cooldown actual.
 * Útil para mostrar "quedan X preguntas nuevas por ver".
 */
export function filtrarElegibles(banco, opts = {}) {
  const config = { ...CONFIG, ...(opts.config || {}) };
  const historialIds = opts.historialIds || [];
  const historialReciente = opts.historialReciente || [];

  return banco.filter(p => {
    if (historialReciente.includes(p.id)) return false;
    if (enCooldown(p.id, historialIds, config.cooldown)) return false;
    if (!pasaFiltros(p, opts)) return false;
    return true;
  });
}

/**
 * Distribución actual de tipos y temas en el historial reciente.
 * Útil para mostrar estadísticas de "variedad" en la UI.
 */
export function calcularDistribucion(banco, historialIds, n = 10) {
  const ultimos = (historialIds || []).slice(-n);
  const tipos = {};
  const temas = {};

  ultimos.forEach(id => {
    const p = banco.find(x => x.id === id);
    if (!p) return;
    tipos[p.tipo] = (tipos[p.tipo] || 0) + 1;
    temas[p.tema] = (temas[p.tema] || 0) + 1;
  });

  return {
    total: ultimos.length,
    tipos,
    temas,
  };
}

/* ═══════════════════════════════════════════════════════════════
 * FUNCIÓN PRINCIPAL
 * ═══════════════════════════════════════════════════════════════ */

/**
 * Selecciona una ronda de preguntas respetando cooldown, balance de tipos/temas,
 * priorización de débiles/vencidas y el modo indicado.
 *
 * @param {Array} banco — array completo de preguntas
 * @param {Object} opts
 * @param {number} opts.tamaño — cuántas preguntas pedir (default 10)
 * @param {Function} opts.obtenerP — (id) => { ok, fail, lastSeen, ... }
 * @param {Array<string>} opts.historialIds — últimos N ids vistos (global, FIFO)
 * @param {Array<string>} opts.historialReciente — ids de la sesión actual
 * @param {string} opts.modo — "mixto" | "debil" | "vencido" | "simulacro" | "nuevo"
 * @param {Array<string>} opts.temasPermitidos — filtro opcional
 * @param {Array<string>} opts.dificultades — filtro opcional
 * @param {Object} opts.config — overrides de CONFIG
 * @param {Function} opts.random — RNG inyectable (para tests)
 * @returns {Array} — array de preguntas seleccionadas
 */
export function seleccionarRonda(banco, opts = {}) {
  const config = { ...CONFIG, ...(opts.config || {}) };
  const random = opts.random || Math.random;
  const tamaño = opts.tamaño || 10;
  const historialIds = opts.historialIds || [];
  const historialReciente = opts.historialReciente || [];
  const modo = opts.modo || "mixto";

  if (!Array.isArray(banco) || banco.length === 0) return [];

  // ─── Modo especial: solo nuevas ──────────────────────────────
  if (modo === "nuevo") {
    const nuevas = banco.filter(p => {
      const prog = opts.obtenerP ? opts.obtenerP(p.id) : { ok: 0, fail: 0 };
      return (prog.ok || 0) === 0 && (prog.fail || 0) === 0 && pasaFiltros(p, opts);
    });
    const pool = nuevas.length >= tamaño ? nuevas : banco.filter(p => pasaFiltros(p, opts));
    const shuffled = [...pool].sort(() => random() - 0.5);
    return shuffled.slice(0, tamaño);
  }

  // ─── Modo especial: solo vencidas ────────────────────────────
  if (modo === "vencido") {
    const vencidas = banco.filter(p => {
      const prog = opts.obtenerP ? opts.obtenerP(p.id) : {};
      return vencida(prog) && pasaFiltros(p, opts);
    });
    if (vencidas.length === 0) {
      // Fallback a mixto si no hay vencidas
      return seleccionarRonda(banco, { ...opts, modo: "mixto" });
    }
    const ctx = { obtenerP: opts.obtenerP, historialIds, historialBanco: banco, config };
    const scores = vencidas.map(p => calcularScore(p, ctx));
    return muestrearPonderado(vencidas, scores, Math.min(tamaño, vencidas.length), random);
  }

  // ─── Paso 1: filtrar elegibles con cooldown relajante ───────
  let cooldownActual = config.cooldown;
  let elegibles = [];

  while (cooldownActual >= config.cooldownMin) {
    elegibles = banco.filter(p => {
      if (historialReciente.includes(p.id)) return false;
      if (enCooldown(p.id, historialIds, cooldownActual)) return false;
      if (!pasaFiltros(p, opts)) return false;
      return true;
    });
    if (elegibles.length >= tamaño) break;
    cooldownActual -= config.relaxCooldownStep;
  }

  // Si aún faltan, permitir preguntas en cooldown (último recurso)
  if (elegibles.length < tamaño) {
    elegibles = banco.filter(p => {
      if (historialReciente.includes(p.id)) return false;
      if (!pasaFiltros(p, opts)) return false;
      return true;
    });
  }

  // Si no hay absolutamente nada, fallback: shuffle de todo el banco
  if (elegibles.length === 0) {
    return [...banco].filter(p => pasaFiltros(p, opts))
                     .sort(() => random() - 0.5)
                     .slice(0, tamaño);
  }

  // ─── Paso 2: calcular scores ─────────────────────────────────
  const ctx = {
    obtenerP: opts.obtenerP,
    historialIds,
    historialBanco: banco,
    config,
  };

  // Modo simulacro: distribución fija por dificultad
  if (modo === "simulacro") {
    return seleccionarSimulacro(elegibles, tamaño, ctx, random, config);
  }

  const scores = elegibles.map(p => calcularScore(p, ctx));

  // Modo débil: garantizar mínimo de débiles
  if (modo === "debil") {
    const debiles = elegibles.filter((p, i) => esDebil(opts.obtenerP ? opts.obtenerP(p.id) : {}));
    const minDebiles = Math.ceil(tamaño * config.minDebilesEnModoDebil);

    if (debiles.length >= minDebiles) {
      // Forzar minDebiles débiles + resto ponderado
      const scoresDebiles = debiles.map(p => calcularScore(p, ctx));
      const debilesSel = muestrearPonderado(debiles, scoresDebiles, minDebiles, random);
      const idsDebiles = new Set(debilesSel.map(p => p.id));
      const resto = elegibles.filter(p => !idsDebiles.has(p.id));
      const scoresResto = resto.map(p => calcularScore(p, ctx));
      const restoSel = muestrearPonderado(resto, scoresResto, tamaño - minDebiles, random);
      const ronda = [...debilesSel, ...restoSel];
      return rebalanceFinal(ronda, elegibles, ctx, random, config);
    }
    // Si no hay suficientes débiles, boost extra y caer en mixto
  }

  // ─── Paso 3: muestreo ponderado ──────────────────────────────
  let ronda = muestrearPonderado(elegibles, scores, Math.min(tamaño, elegibles.length), random);

  // ─── Paso 4: rebalance por tipo y tema ───────────────────────
  return rebalanceFinal(ronda, elegibles, ctx, random, config);
}

function rebalanceFinal(ronda, elegibles, ctx, random, config) {
  // Adjuntar __score para el rebalance
  ronda.forEach(p => {
    if (p.__score === undefined) p.__score = calcularScore(p, ctx);
  });

  let resultado = rebalancear(ronda, elegibles, "tipo", config.maxPorTipo, random);
  resultado = rebalancear(resultado, elegibles, "tema", config.maxPorTema, random);

  // Limpiar propiedad auxiliar
  resultado.forEach(p => { if (p.__score !== undefined) delete p.__score; });
  return resultado;
}

/* ═══════════════════════════════════════════════════════════════
 * MODO SIMULACRO
 * Distribución fija: 30% fácil / 50% media / 20% difícil
 * ═══════════════════════════════════════════════════════════════ */
function seleccionarSimulacro(elegibles, tamaño, ctx, random, config) {
  const porDif = { facil: [], media: [], dificil: [] };
  elegibles.forEach(p => {
    if (porDif[p.dificultad]) porDif[p.dificultad].push(p);
  });

  const objetivos = {
    facil: Math.round(tamaño * config.distribucionSimulacro.facil),
    media: Math.round(tamaño * config.distribucionSimulacro.media),
    dificil: Math.round(tamaño * config.distribucionSimulacro.dificil),
  };

  // Ajustar para que sumen exactamente `tamaño`
  let suma = objetivos.facil + objetivos.media + objetivos.dificil;
  while (suma < tamaño) { objetivos.media++; suma++; }
  while (suma > tamaño) {
    if (objetivos.media > 0) { objetivos.media--; suma--; }
    else if (objetivos.facil > 0) { objetivos.facil--; suma--; }
    else { objetivos.dificil--; suma--; }
  }

  const ronda = [];
  for (const dif of ["facil", "media", "dificil"]) {
    const pool = porDif[dif];
    const n = objetivos[dif];
    if (pool.length === 0) continue;
    const scores = pool.map(p => calcularScore(p, ctx));
    const sel = muestrearPonderado(pool, scores, Math.min(n, pool.length), random);
    ronda.push(...sel);
  }

  // Si faltan (por poca oferta de alguna dificultad), rellenar con lo que haya
  if (ronda.length < tamaño) {
    const idsUsados = new Set(ronda.map(p => p.id));
    const resto = elegibles.filter(p => !idsUsados.has(p.id));
    const scores = resto.map(p => calcularScore(p, ctx));
    const faltantes = muestrearPonderado(resto, scores, tamaño - ronda.length, random);
    ronda.push(...faltantes);
  }

  return rebalanceFinal(ronda, elegibles, ctx, random, config);
}

export default seleccionarRonda;