// Motor puro de repaso espaciado adaptable (SM-2 sobre entradas Leitner).
// Preserva compatibilidad total con entradas existentes { ok, fail, box, last, lastOk, marked }
// interpolando repeticiones, factor de facilidad e intervalo cuando aún no están persistidos.

import { intervaloDias } from "./progreso.js";

export const MS_DIA = 86400000;
export const EFACTOR_INICIAL = 2.5;
export const EFACTOR_MINIMO = 1.3;

/**
 * Normaliza la calidad de una respuesta a la escala SM-2 de 1 a 4:
 * 1 = Otra vez (fallo), 2 = Difícil, 3 = Bien, 4 = Fácil.
 * @param {boolean|number|string} calidadOExito
 * @returns {1|2|3|4}
 */
export function normalizarCalidad(calidadOExito) {
  // Las rondas de opción múltiple o autoevaluación binaria envían booleano: true equivale a "Bien" (3) y false a "Otra vez" (1).
  if (typeof calidadOExito === "boolean") {
    return calidadOExito ? 3 : 1;
  }
  const num = Number(calidadOExito);
  if (!Number.isFinite(num)) return 1;
  // Acotamos el valor entero al rango válido [1, 4] para proteger el cálculo ante entradas fuera de escala.
  return /** @type {1|2|3|4} */ (Math.max(1, Math.min(4, Math.round(num))));
}

/**
 * Extrae o interpola las propiedades SM-2 de una entrada de progreso (nueva o heredada).
 * @param {any} entrada
 */
export function estadoSM2De(entrada = {}) {
  const box = Number.isInteger(entrada.box) ? Math.max(1, Math.min(5, entrada.box)) : 1;
  const tuvoRespuestas = ((entrada.ok || 0) + (entrada.fail || 0)) > 0 && entrada.last !== null && entrada.last !== undefined;

  // Si la entrada viene del formato Leitner previo sin `reps`, deducimos las repeticiones activas desde la caja.
  const reps = Number.isInteger(entrada.reps)
    ? Math.max(0, entrada.reps)
    : (tuvoRespuestas && entrada.lastOk ? Math.max(1, box - 1) : 0);

  const efactor = typeof entrada.efactor === "number" && Number.isFinite(entrada.efactor)
    ? Math.max(EFACTOR_MINIMO, entrada.efactor)
    : EFACTOR_INICIAL;

  const intervaloBase = intervaloDias(box);
  const intervalo = typeof entrada.intervalo === "number" && entrada.intervalo > 0
    ? entrada.intervalo
    : (tuvoRespuestas ? Math.max(1, intervaloBase) : 0);

  return { reps, efactor, intervalo, box };
}

/**
 * Deriva la caja Leitner equivalente (1..5) a partir del intervalo SM-2 en días y la calidad.
 * @param {number} intervalo
 * @param {number} calidad
 * @returns {number}
 */
export function boxDeIntervalo(intervalo, calidad) {
  // Un olvido (calidad 1) regresa la tarjeta a la primera caja de refuerzo inmediato.
  if (calidad < 2 || intervalo <= 0) return 1;
  if (intervalo <= 1) return 2;
  if (intervalo <= 4) return 3;
  if (intervalo <= 10) return 4;
  return 5;
}

/**
 * Calcula el nuevo estado de una entrada tras responder con una calidad SM-2 (1..4 o booleano).
 * @param {any} entrada
 * @param {boolean|number|string} calidadOExito
 * @param {number} [ahora]
 */
export function calcularSM2(entrada = {}, calidadOExito, ahora = Date.now()) {
  const calidad = normalizarCalidad(calidadOExito);
  const previo = estadoSM2De(entrada);
  const esAcierto = calidad >= 2;

  let reps = previo.reps;
  let intervalo;
  let efactor = previo.efactor;

  if (!esAcierto) {
    // Al fallar (calidad 1 = "Otra vez"), se reinicia la racha de repeticiones y el intervalo vuelve a 1 día.
    reps = 0;
    intervalo = 1;
    efactor = Math.max(EFACTOR_MINIMO, +(efactor - 0.2).toFixed(2));
  } else {
    reps += 1;
    if (calidad === 2) {
      // "Difícil": el estudiante acertó con esfuerzo; el intervalo crece suavemente y baja ligeramente la facilidad.
      intervalo = reps === 1 ? 1 : Math.max(1, Math.round(Math.max(1, previo.intervalo) * 1.2));
      efactor = Math.max(EFACTOR_MINIMO, +(efactor - 0.15).toFixed(2));
    } else if (calidad === 3) {
      // "Bien": progresión clásica SM-2 (1 día -> 3 días -> intervalo * efactor).
      if (reps === 1) intervalo = 1;
      else if (reps === 2) intervalo = 3;
      else intervalo = Math.max(4, Math.round(previo.intervalo * efactor));
    } else {
      // "Fácil" (calidad 4): salto acelerado de intervalo y bonificación al factor de facilidad.
      if (reps === 1) intervalo = 2;
      else if (reps === 2) intervalo = 5;
      else intervalo = Math.max(6, Math.round(previo.intervalo * efactor * 1.3));
      efactor = +(efactor + 0.15).toFixed(2);
    }
  }

  const proximo = ahora + intervalo * MS_DIA;
  const box = boxDeIntervalo(intervalo, calidad);

  return {
    ok: (entrada.ok || 0) + (esAcierto ? 1 : 0),
    fail: (entrada.fail || 0) + (esAcierto ? 0 : 1),
    box,
    last: ahora,
    lastOk: esAcierto,
    marked: Boolean(entrada.marked),
    reps,
    intervalo,
    efactor,
    proximo
  };
}

/**
 * Obtiene el timestamp en ms en que vence una pregunta ya estudiada, o null si es nueva.
 * @param {any} entrada
 * @returns {number|null}
 */
export function proximoVencimiento(entrada) {
  if (!entrada || entrada.last === null || entrada.last === undefined) return null;
  if (((entrada.ok || 0) + (entrada.fail || 0)) <= 0 && !entrada.last) return null;
  if (typeof entrada.proximo === "number" && Number.isFinite(entrada.proximo)) {
    return entrada.proximo;
  }
  // Fallback para entradas antiguas sin `proximo`: usa `last` + días de su caja Leitner.
  return entrada.last + intervaloDias(entrada.box || 1) * MS_DIA;
}

/**
 * Determina si una pregunta estudiada previamente ya cumplió su ciclo y debe repasarse hoy.
 * A diferencia de `vencida()` legacy, nunca marca preguntas no vistas (`!last`) como vencidas.
 * @param {any} entrada
 * @param {number} [ahora]
 * @returns {boolean}
 */
export function estaVencida(entrada, ahora = Date.now()) {
  const vence = proximoVencimiento(entrada);
  if (vence === null) return false;
  return ahora >= vence;
}

/**
 * Clasifica el banco de preguntas en 4 estados de memoria:
 * - `vencidas`: ya estudiadas cuyo próximo repaso venció (`ahora >= proximo`).
 * - `aprendiendo`: estudiadas, no vencidas aún, con intervalo corto (< 7 días o reps < 3).
 * - `consolidadas`: estudiadas, no vencidas aún, con retención madura (reps >= 3 e intervalo >= 7 días).
 * - `nuevas`: nunca respondidas (`last === null`).
 * @param {any[]} banco
 * @param {(id: string) => any} obtenerP
 * @param {number} [ahora]
 */
export function clasificarBanco(banco = [], obtenerP, ahora = Date.now()) {
  const vencidas = [];
  const aprendiendo = [];
  const consolidadas = [];
  const nuevas = [];
  let proximoRepasoMs = null;

  for (const q of banco) {
    const p = obtenerP ? obtenerP(q.id) : null;
    const estudiada = Boolean(p && p.last !== null && p.last !== undefined && ((p.ok || 0) + (p.fail || 0) > 0 || p.last > 0));
    if (!estudiada) {
      nuevas.push(q);
      continue;
    }

    const vence = proximoVencimiento(p);
    if (vence !== null && ahora >= vence) {
      vencidas.push(q);
      continue;
    }

    if (vence !== null && (proximoRepasoMs === null || vence < proximoRepasoMs)) {
      proximoRepasoMs = vence;
    }

    const { reps, intervalo } = estadoSM2De(p);
    if (reps >= 3 && intervalo >= 7) {
      consolidadas.push(q);
    } else {
      aprendiendo.push(q);
    }
  }

  // Ordenamos las vencidas por urgencia: primero las que llevan más tiempo vencidas y menor facilidad.
  vencidas.sort((a, b) => {
    const pa = obtenerP(a.id);
    const pb = obtenerP(b.id);
    const va = proximoVencimiento(pa) ?? 0;
    const vb = proximoVencimiento(pb) ?? 0;
    if (va !== vb) return va - vb;
    return (pa.efactor ?? EFACTOR_INICIAL) - (pb.efactor ?? EFACTOR_INICIAL);
  });

  return {
    vencidas,
    aprendiendo,
    consolidadas,
    nuevas,
    proximoRepasoMs
  };
}

/**
 * Estima las etiquetas de intervalo ("1d", "3d", etc.) para las 4 opciones de respuesta en Flashcards.
 * @param {any} entrada
 * @param {number} [ahora]
 */
export function estimarProximosIntervalos(entrada = {}, ahora = Date.now()) {
  const fmt = dias => (dias <= 1 ? "1d" : dias + "d");
  return {
    otraVez: fmt(calcularSM2(entrada, 1, ahora).intervalo),
    dificil: fmt(calcularSM2(entrada, 2, ahora).intervalo),
    bien: fmt(calcularSM2(entrada, 3, ahora).intervalo),
    facil: fmt(calcularSM2(entrada, 4, ahora).intervalo)
  };
}
