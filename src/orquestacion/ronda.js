// Orquestación de la ronda de práctica (ADR 009): arranques por modo, timers,
// pausa y salida. El estado vive en student/session.js y el track; acá solo se
// monta la pantalla y se pinta. Recibe todo por parámetro, sin estado propio.
import { formatearTiempo } from "../core/index.js";
import { icono } from "../ui/iconos.js";

export function crearRonda({
  $, track, sesiones, show, quiz, toast, confirm, goHome, irLenguaje,
  rondas, preguntasFiltradas
}) {
  // Timer por pregunta del modo Contrarreloj (spec 003): 30s o fallo. La cuenta y
  // el reloj viven en el estado de la sesión (student/session.js); acá solo se pinta.
  function iniciarTimerPregunta() {
    const s = sesiones.sesion;
    if (!s || s.modo !== "contrarreloj") return;
    s.tRestante = s.tPorPregunta;
    s.preguntaInicio = Date.now();
    actualizarTimerPregunta();
    s.timerPreguntaId = setInterval(() => {
      s.tRestante--;
      actualizarTimerPregunta();
      if (s.tRestante <= 0) {
        clearTimerPregunta();
        quiz.expirarPregunta();
      }
    }, 1000);
  }

  function actualizarTimerPregunta() {
    const badge = $("timer-pregunta");
    const s = sesiones.sesion;
    if (!badge || !s) return;
    badge.innerHTML = icono("rayo", "icono-sm") + "<span>" + Math.max(0, s.tRestante) + "s</span>";
    badge.classList.toggle("timer-low", s.tRestante <= 10);
  }

  function clearTimerPregunta() {
    const s = sesiones.sesion;
    if (s && s.timerPreguntaId) {
      clearInterval(s.timerPreguntaId);
      s.timerPreguntaId = null;
    }
  }

  // Arranca una ronda: el estado lo crea student/session.js y acá se monta la
  // pantalla. Devuelve la sesión (o null sin ítems) para ajustar contexto extra.
  function startSession(items, modo, conTimer) {
    clearTimer();
    clearTimerPregunta();
    const s = sesiones.iniciar(items, modo);
    if (!s) return null;
    mostrarQuiz(modo, conTimer);
    return s;
  }

  // Monta la pantalla de quiz y sus badges para la ronda ya creada (solo DOM).
  function mostrarQuiz(modo, conTimer) {
    show("quiz");
    $("timer-badge").classList.toggle("hidden", !conTimer);
    $("simulacro-badge").classList.toggle("hidden", modo !== "simulacro");
    const mb = $("modo-badge");
    mb.innerHTML = modo === "contrarreloj"
      ? icono("contrarreloj", "icono-sm") + "<span>Contrarreloj</span>"
      : modo === "supervivencia"
        ? icono("supervivencia", "icono-sm") + "<span>Supervivencia</span>"
        : "";
    mb.classList.toggle("hidden", !mb.innerHTML);
    $("vidas-badge").classList.toggle("hidden", modo !== "supervivencia");
    $("timer-pregunta").classList.toggle("hidden", modo !== "contrarreloj");
    $("pause-btn").classList.toggle("hidden", modo !== "simulacro");
    $("pause-overlay").classList.add("hidden");
    quiz.renderQuestion();
    if (modo === "supervivencia") quiz.pintarVidas();
    if (conTimer) iniciarTimer(20 * 60);
    if (modo === "contrarreloj") iniciarTimerPregunta();
  }

  function comenzarPractica() {
    const qs = preguntasFiltradas();
    // Con filtros que dejan 0 no se arranca en silencio: se explica cómo reparar.
    if (!qs.length) {
      toast("Sin preguntas con esos filtros. Pulsa Todos o quita Solo débiles / Solo marcadas.");
      return;
    }
    const r = rondas.practica({
      items: qs,
      cantidad: $("cfg-cantidad").value,
      priorizando: track.filtros.priorizar
    });
    if (r) startSession(r.items, r.modo, r.conTimer);
  }

  function comenzarSimulacro() {
    const qs = preguntasFiltradas();
    // Mismo aviso que en práctica: el simulacro tampoco sale sin preguntas.
    if (!qs.length) {
      toast("Sin preguntas con esos filtros. Pulsa Todos o quita Solo débiles / Solo marcadas.");
      return;
    }
    const r = rondas.simulacro({ items: qs });
    if (r) startSession(r.items, r.modo, r.conTimer);
  }

  function startContrarreloj() {
    const r = rondas.contrarreloj({ banco: track.banco });
    if (r) startSession(r.items, r.modo, r.conTimer);
  }

  function startSupervivencia() {
    const r = rondas.supervivencia({ banco: track.banco });
    if (r) startSession(r.items, r.modo, r.conTimer);
  }

  function practicarDebiles() {
    const r = rondas.debiles({ banco: track.banco });
    if (r) startSession(r.items, r.modo, r.conTimer);
  }

  function practicarTipo(tipo) {
    const r = rondas.porTipo({ banco: track.banco, tipo });
    if (r) startSession(r.items, r.modo, r.conTimer);
  }

  function practicarArrastre() {
    const r = rondas.arrastre({ banco: track.banco });
    if (r) startSession(r.items, r.modo, r.conTimer);
  }

  function practicarCasos() {
    const r = rondas.casos({ banco: track.banco });
    if (r) startSession(r.items, r.modo, r.conTimer);
  }

  function practicarVencidas() {
    const r = rondas.vencidas({ banco: track.banco });
    if (r) startSession(r.items, r.modo, r.conTimer);
  }

  function next() {
    if (!sesiones.sesion) return;
    const r = sesiones.avanzar();
    if (!r.continua) {
      // La ronda cerró (game over o última): apagar el reloj antes de que siga corriendo.
      clearTimer();
      return;
    }
    quiz.renderQuestion();
    if (sesiones.sesion.modo === "contrarreloj") iniciarTimerPregunta();
  }

  function salir() {
    confirm.pedirConfirmacion({
      titulo: "¿Salir de la ronda?",
      mensaje: "Se pierde el avance de esta ronda. Puedes volver a empezar cuando quieras, sin prisa.",
      textoConfirmar: "Salir de la ronda"
    }).then(ok => {
      if (!ok) return;
      // Una sesión lanzada desde el mapa de etapas vuelve ahí; la práctica libre, al dashboard.
      const desdeEtapas = !!(sesiones.sesion && sesiones.sesion.lenguajeId);
      clearTimer();
      clearTimerPregunta();
      sesiones.limpiar();
      $("pause-overlay").classList.add("hidden");
      if (desdeEtapas) irLenguaje(); else goHome();
    });
  }

  function iniciarTimer(segundos) {
    const s = sesiones.sesion;
    s.restante = segundos;
    actualizarTimer();
    s.timerId = setInterval(() => {
      s.restante--;
      actualizarTimer();
      if (s.restante <= 0) {
        clearTimer();
        finalizar();
      }
    }, 1000);
  }

  function actualizarTimer() {
    const s = sesiones.sesion;
    const badge = $("timer-badge");
    if (!s || !badge) return;
    badge.innerHTML = icono("reloj", "icono-sm") + "<span>" + formatearTiempo(s.restante) + "</span>";
    badge.classList.toggle("timer-low", s.restante <= 60);
  }

  function clearTimer() {
    const s = sesiones.sesion;
    if (s && s.timerId) {
      clearInterval(s.timerId);
      s.timerId = null;
    }
  }

  function alternarPausa() {
    const s = sesiones.sesion;
    if (!s || s.modo !== "simulacro" || s.finalizada) return;
    s.pausado = !s.pausado;
    $("pause-overlay").classList.toggle("hidden", !s.pausado);
    $("pause-btn").innerHTML = icono(s.pausado ? "seguir" : "pausa", "icono-sm");
    if (s.pausado) {
      clearTimer();
      // El foco entra al diálogo para que el teclado no siga operando la ronda de atrás.
      const primero = $("pause-overlay").querySelector("button");
      if (primero) primero.focus();
    } else {
      if (s.restante > 0) iniciarTimer(s.restante);
      // Al cerrar, el foco vuelve al trigger de pausa (cierra el ciclo del modal).
      const trigger = $("pause-btn");
      if (trigger) trigger.focus();
    }
  }

  // Trampa de foco del modal de pausa (M5): Tab cicla entre sus botones y Escape
  // reanuda. Mismo patrón que el diálogo de guardas de diagramas.
  function instalarTrampaPausa() {
    $("pause-overlay").addEventListener("keydown", e => {
      const s = sesiones.sesion;
      if (!s || !s.pausado) return;
      if (e.key === "Escape") {
        e.preventDefault();
        alternarPausa();
        return;
      }
      if (e.key !== "Tab") return;
      const botones = Array.from($("pause-overlay").querySelectorAll("button"));
      if (!botones.length) return;
      const idx = botones.indexOf(document.activeElement);
      if (e.shiftKey && idx <= 0) {
        e.preventDefault();
        botones[botones.length - 1].focus();
      } else if (!e.shiftKey && idx === botones.length - 1) {
        e.preventDefault();
        botones[0].focus();
      }
    });
  }

  // Cierra la ronda: la orquestación (resultado, examen, misión, historial) vive en
  // student/session.js; acá solo se apaga el reloj y se delega. La pantalla la pinta
  // el callback `alFinalizar` que recibe el servicio.
  function finalizar() {
    clearTimer();
    sesiones.finalizar();
  }

  function repetirFalladas() {
    const s = sesiones.repetirFalladas();
    if (s) mostrarQuiz(s.modo, false);
  }

  function repetirMisma() {
    // student/session.js conserva el contexto de examen/lenguaje al repetir la ronda.
    const s = sesiones.repetirMisma();
    if (s) mostrarQuiz(s.modo, s.modo === "simulacro");
  }

  return {
    iniciarTimerPregunta, actualizarTimerPregunta, clearTimerPregunta,
    startSession, mostrarQuiz, comenzarPractica, comenzarSimulacro,
    startContrarreloj, startSupervivencia, practicarDebiles, practicarTipo,
    practicarArrastre, practicarCasos, practicarVencidas, next, salir,
    iniciarTimer, actualizarTimer, clearTimer, alternarPausa, instalarTrampaPausa,
    finalizar, repetirFalladas, repetirMisma
  };
}
