// competencia.js
// Lógica pura de la competencia por lenguaje (spec 011): barra de progreso (etapas de
// examen aprobadas / total), gate entre etapas y registro del aprobado con versión.
// Sin DOM ni localStorage: el caller inyecta datos y persiste el resultado.

// EPS evita que la representación binaria infle el umbral (0.8 * 5 podría dar
// 4.000000000000001); con 0.8 los totales reales caen exactos.
const EPS = 1e-9;

// Aciertos necesarios para aprobar un examen.
export function umbralDeExamen(totalPreguntas, umbral = 0.8) {
  if (!Number.isFinite(totalPreguntas) || totalPreguntas <= 0) return 0;
  return Math.ceil(umbral * totalPreguntas - EPS);
}

export function apruebaExamen(aciertos, totalPreguntas, umbral = 0.8) {
  if (!Number.isFinite(totalPreguntas) || totalPreguntas <= 0) return false;
  if (!Number.isFinite(aciertos) || aciertos < 0) return false;
  return aciertos >= umbralDeExamen(totalPreguntas, umbral);
}

// Un aprobado cuenta solo si sigue vigente: la versión guardada coincide con la del
// roadmap. Si el examen se reescribió, la etapa vuelve a estar pendiente sin borrar el
// resto del progreso (spec 011, riesgos).
export function aprobadoVigente(etapa, resultados) {
  const r = resultados?.[etapa.id];
  if (!r || !r.aprobado) return false;
  const versionRoadmap = etapa.examen?.version;
  if (versionRoadmap !== undefined && r.version !== versionRoadmap) return false;
  return true;
}

// Barra de competencia: cuántas etapas de examen están aprobadas y vigentes sobre el total.
export function barraDeCompetencia(etapas, resultados) {
  const total = Array.isArray(etapas) ? etapas.length : 0;
  if (total === 0) return { aprobadas: 0, total: 0, pct: 0 };
  let aprobadas = 0;
  for (const etapa of etapas) {
    if (aprobadoVigente(etapa, resultados)) aprobadas++;
  }
  return { aprobadas, total, pct: aprobadas / total };
}

// La primera etapa siempre está desbloqueada; las demás, cuando la anterior inmediata
// tiene un aprobado vigente. El capstone (etapa 5) queda bloqueado hasta aprobar la 4.
export function etapaDesbloqueada(etapas, indexEtapa, resultados) {
  if (!Array.isArray(etapas) || indexEtapa < 0 || indexEtapa >= etapas.length) return false;
  if (indexEtapa === 0) return true;
  return aprobadoVigente(etapas[indexEtapa - 1], resultados);
}

// Registra el resultado de un examen. El umbral y la versión salen del roadmap
// (etapa.examen), no de constantes: una sola fuente de verdad.
export function registrarExamen({ etapa, resultados, aciertos, umbral }) {
  const totalPreguntas = Array.isArray(etapa.examen?.preguntas) ? etapa.examen.preguntas.length : 0;
  const umbralFinal = umbral ?? etapa.examen?.umbral ?? 0.8;
  const version = etapa.examen?.version;
  const anterior = resultados?.[etapa.id] || {};
  const pasoAhora = apruebaExamen(aciertos, totalPreguntas, umbralFinal);
  const pct = totalPreguntas > 0 ? aciertos / totalPreguntas : 0;

  // Misma versión: se mantiene el aprobado previo o se aprueba ahora (reintento sin
  // castigo). Versión nueva: solo cuenta este intento (el aprobado viejo queda obsoleto).
  const versionCoincide = anterior.version === version;
  const aprobado = versionCoincide ? !!(anterior.aprobado || pasoAhora) : pasoAhora;

  return {
    ...resultados,
    [etapa.id]: {
      intentos: (anterior.intentos || 0) + 1,
      ultimoPct: pct,
      aprobado,
      version,
    },
  };
}
