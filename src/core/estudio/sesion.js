// Modelo puro de una sesión de quiz (paso 4 del plan student/): estado, tiempos y resultados.
// No toca DOM ni localStorage y recibe el reloj (`inicio`/`ahora`) por parámetro, así el mismo
// cómputo se puede testear con una fecha fija. La orquestación vive en student/session.js.
import { xpContrarreloj, multiplicadorSupervivencia } from "../juego/gamificacion.js";

// Crea el estado inicial de la ronda. Los defaults por modo replican lo que antes hacía
// startSession: contrarreloj limita cada pregunta a 30 s; supervivencia lleva vidas y combo.
export function crearSesion(items, modo, inicio) {
  const sesion = { items, idx: 0, answers: {}, modo, inicio, finalizada: false, pausado: false };
  if (modo === "contrarreloj") { sesion.tPorPregunta = 30; sesion.tRestante = 30; }
  if (modo === "supervivencia") { sesion.vidas = 3; sesion.combo = 0; sesion.mejorCombo = 0; }
  return sesion;
}

// Formatea segundos como "m:ss"; lo comparten el badge de ronda y el de la pregunta.
export function formatearTiempo(segundos) {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return m + ":" + String(s).padStart(2, "0");
}

// Calcula el resultado de una sesión ya finalizada. `ahora` (ms) se inyecta para medir el
// tiempo transcurrido desde `sesion.inicio`.
export function resultadoDeSesion(sesion, ahora) {
  const items = sesion.items;
  // Las preguntas de desarrollo no suman al puntaje: se autoevalúan aparte.
  const calificables = items.filter(it => it.tipo !== "desarrollo");
  let aciertos = 0;
  const porTema = {};
  calificables.forEach(item => {
    const i = items.indexOf(item);
    const a = sesion.answers[i];
    porTema[item.tema] = porTema[item.tema] || { ok: 0, total: 0 };
    porTema[item.tema].total++;
    if (a && a.ok) {
      aciertos++;
      porTema[item.tema].ok++;
    }
  });
  // El total nunca es 0 para no dividir por cero cuando solo hay desarrollos.
  const totalCal = calificables.length || 1;
  const pct = Math.round((aciertos / totalCal) * 100);
  const falladas = calificables.filter(item => {
    const a = sesion.answers[items.indexOf(item)];
    return !(a && a.ok);
  });
  const desarrollos = items.filter(it => it.tipo === "desarrollo");
  const segundos = Math.max(0, Math.round((ahora - sesion.inicio) / 1000));
  return { items, calificables, aciertos, totalCal, pct, porTema, falladas, desarrollos, tiempo: formatearTiempo(segundos), segundos };
}

// Aplica la respuesta al estado de la sesión y devuelve el XP ganado. `xpBase` llega ya
// calculado (caja del ítem); acá solo se aplican los bonus de contrarreloj y supervivencia.
export function aplicarRespuestaSesion(sesion, ok, ahora, xpBase) {
  let ganado = xpBase;
  if (sesion && sesion.modo === "contrarreloj") {
    // Responder en menos de 10 s duplica el XP base.
    if (ok) ganado = xpContrarreloj(true, ahora - sesion.preguntaInicio, ganado);
  }
  if (sesion && sesion.modo === "supervivencia") {
    if (ok) {
      sesion.combo++;
      sesion.mejorCombo = Math.max(sesion.mejorCombo || 0, sesion.combo);
      ganado = Math.round(ganado * multiplicadorSupervivencia(sesion.combo));
    } else {
      sesion.vidas--;
      sesion.combo = 0;
      // Sin vidas restantes la partida termina en la próxima pregunta.
      if (sesion.vidas <= 0) sesion.gameOver = true;
    }
  }
  return ganado;
}

// Índice de la próxima pregunta.
export function siguienteIndice(sesion) {
  return sesion.idx + 1;
}

// Una ronda cierra por game over o al llegar a la última pregunta.
export function debeFinalizar(sesion) {
  return !!(sesion.gameOver || sesion.idx >= sesion.items.length - 1);
}
