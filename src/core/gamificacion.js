// Gamificación amable (spec 003): XP, niveles y logros.
// Funciones puras: la persistencia (sys.xp, sys.logros, sys.xp-eventos) vive en app.js.

export const XP_EVENTOS = {
  acierto: 10,
  aciertoDominada: 3, // repetir una pregunta ya dominada (box >= 3) evita el farmeo
  metaDiaria: 50,
  logro: 25,
  escenaCorrecta: 15, // se usa desde H5 (escenarios)
  estrella: 40        // se usa desde H4 (misiones)
};

// Un acierto en una pregunta con caja >= 3 cuenta como "dominada": menos XP.
export function xpDeRespuesta(ok, entradaNueva) {
  if (!ok) return 0;
  return entradaNueva && entradaNueva.box >= 3 ? XP_EVENTOS.aciertoDominada : XP_EVENTOS.acierto;
}

// Curva cuadrática: cada nivel cuesta progresivamente más (100·(n-1)² XP).
export function nivelDe(xp) {
  return 1 + Math.floor(Math.sqrt(Math.max(0, xp) / 100));
}

export function xpInicioNivel(nivel) {
  const n = Math.max(1, nivel) - 1;
  return n * n * 100;
}

export function progresoDeNivel(xp) {
  const nivel = nivelDe(xp);
  const inicio = xpInicioNivel(nivel);
  const siguiente = xpInicioNivel(nivel + 1);
  const enNivel = Math.max(0, xp) - inicio;
  const tramo = siguiente - inicio;
  return {
    nivel,
    enNivel,
    tramo,
    pct: Math.min(100, Math.max(0, Math.round((enNivel / tramo) * 100))),
    faltante: Math.max(0, siguiente - Math.max(0, xp))
  };
}

// Logros declarativos: la condición recibe un contexto calculado por el orquestador
// { racha, respuestas, precision, simulacroPerfecto, metaCumplida, ... }.
export const LOGROS = [
  { id: "racha-3", icono: "🔥", nombre: "Tres días seguidos", descripcion: "Estudia 3 días seguidos", condicion: c => c.racha >= 3 },
  { id: "racha-7", icono: "📅", nombre: "Semana completa", descripcion: "Estudia 7 días seguidos", condicion: c => c.racha >= 7 },
  { id: "racha-30", icono: "🏆", nombre: "Mes de constancia", descripcion: "Estudia 30 días seguidos", condicion: c => c.racha >= 30 },
  { id: "cien-respuestas", icono: "💯", nombre: "Cien respuestas", descripcion: "Responde 100 preguntas en total", condicion: c => c.respuestas >= 100 },
  { id: "quinientas-respuestas", icono: "🚀", nombre: "Quinientas respuestas", descripcion: "Responde 500 preguntas en total", condicion: c => c.respuestas >= 500 },
  { id: "simulacro-perfecto", icono: "🎯", nombre: "Simulacro perfecto", descripcion: "100% en un simulacro o RepasoQuiz", condicion: c => c.simulacroPerfecto },
  { id: "meta-cumplida", icono: "🌅", nombre: "Meta del día", descripcion: "Cumple tu meta diaria de preguntas", condicion: c => c.metaCumplida },
  { id: "preciso-80", icono: "🎖️", nombre: "Precisión fina", descripcion: "80% de precisión con al menos 50 respuestas", condicion: c => c.respuestas >= 50 && c.precision >= 80 }
];

// Devuelve solo los logros nuevos (no repetidos) con su fecha de desbloqueo.
export function evaluarLogros(logrosActuales, contexto) {
  return LOGROS
    .filter(l => !logrosActuales[l.id] && l.condicion(contexto))
    .map(l => ({ id: l.id, nombre: l.nombre, icono: l.icono, descripcion: l.descripcion, fecha: new Date().toISOString() }));
}
