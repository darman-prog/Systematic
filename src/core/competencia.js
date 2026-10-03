// competencia.js
// Lógica pura de la competencia por lenguaje: barra de progreso (etapas de examen
// aprobadas / etapas totales), gate entre etapas y registro de aprobado con versión
// (spec 011). Sin DOM ni localStorage: el caller inyecta datos y persiste resultados.

// Calcula el umbral de aciertos para aprobar un examen.
// Usa Math.ceil para no depender de la precisión de coma flotante: con 12 preguntas
// al 80% exige 10, no 9.
export function umbralDeExamen(totalPreguntas, umbral = 0.8) {
  if (!Number.isFinite(totalPreguntas) || totalPreguntas <= 0) return 0;
  return Math.ceil(umbral * totalPreguntas);
}

// Determina si un resultado (aciertos) aprueba el examen.
export function apruebaExamen(aciertos, totalPreguntas, umbral = 0.8) {
  if (!Number.isFinite(totalPreguntas) || totalPreguntas <= 0) return false;
  if (!Number.isFinite(aciertos) || aciertos < 0) return false;
  return aciertos >= umbralDeExamen(totalPreguntas, umbral);
}

// Barra de competencia: cuántas etapas de examen están aprobadas sobre el total.
export function barraDeCompetencia(etapas, resultados) {
  const total = Array.isArray(etapas) ? etapas.length : 0;
  if (total === 0) return { aprobadas: 0, total: 0, pct: 0 };
  let aprobadas = 0;
  for (const etapa of etapas) {
    const r = resultados?.[etapa.id];
    if (r && r.aprobado) aprobadas++;
  }
  return { aprobadas, total, pct: total > 0 ? aprobadas / total : 0 };
}

// Indica si una etapa está desbloqueada: la primera siempre; las demás, cuando la
// anterior inmediata está aprobada. La última (capstone) requiere la anterior.
export function etapaDesbloqueada(etapas, indexEtapa, resultados) {
  if (!Array.isArray(etapas) || indexEtapa < 0 || indexEtapa >= etapas.length) {
    return false;
  }
  if (indexEtapa === 0) return true;
  const anterior = etapas[indexEtapa - 1];
  const r = resultados?.[anterior.id];
  return !!(r && r.aprobado);
}

// Registra el resultado de un examen y decide si la etapa pasa a "aprobado".
// Si el examen cambió (version distinta a la guardada), el aprobado previo
// se invalida y la etapa vuelve a estar pendiente (spec 011).
export function registrarExamen({ etapa, resultados, aciertos, versionExamen, umbral = 0.8 }) {
  const totalPreguntas = Array.isArray(etapa.examen?.preguntas) ? etapa.examen.preguntas.length : 0;
  const pasoAhora = apruebaExamen(aciertos, totalPreguntas, umbral);
  const versionCoincide = (resultados?.[etapa.id]?.version ?? undefined) === versionExamen;
  const pct = totalPreguntas > 0 ? aciertos / totalPreguntas : 0;

  const anterior = resultados?.[etapa.id] || {};

  // Misma versión: se aprueba si ya estaba aprobado o si aprueba ahora (reintento sin
  // castigo). Versión distinta: el aprobado anterior se invalida, solo cuenta el intento actual.
  let aprobadoAhora;
  if (versionCoincide) {
    aprobadoAhora = !!(anterior.aprobado || pasoAhora);
  } else {
    aprobadoAhora = pasoAhora;
  }

  return {
    ...resultados,
    [etapa.id]: {
      intentos: (anterior.intentos || 0) + 1,
      ultimoPct: pct,
      aprobado: aprobadoAhora,
      version: versionExamen,
    },
  };
}

export default {
  umbralDeExamen,
  apruebaExamen,
  barraDeCompetencia,
  etapaDesbloqueada,
  registrarExamen,
};
