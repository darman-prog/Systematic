// Servicio de la sesión de quiz (paso 4 del plan student/): orquesta el modelo puro de
// core/estudio/sesion.js con persistencia, gamificación y competencia. Sin DOM ni
// localStorage: dependencias y callbacks de UI entran inyectados, igual que student/track.js.
import {
  crearSesion, resultadoDeSesion, aplicarRespuestaSesion, siguienteIndice, debeFinalizar, hoyISO
} from "../core/index.js";

export function crearSesiones({
  persistencia, gamificacion, track, obtenerP, xpDeRespuesta, XP_EVENTOS,
  estrellasDeMision, fusionarMision, registrarExamen, prepararItem,
  guardarIntento, conNombre, notificar, alFinalizar, leerTextoDesarrollo, ahora
}) {
  const reloj = ahora || (() => Date.now());
  const avisar = notificar || (() => {});
  const nombrar = conNombre || (texto => texto);
  const alTerminar = alFinalizar || (() => {});
  const leerDesarrollo = leerTextoDesarrollo || (() => "");
  let sesion = null;

  // Arma los ítems (barajando opciones/piezas) y crea el estado de la ronda; null si no hay
  // ítems, para que app.js no muestre el quiz vacío.
  function iniciar(items, modo) {
    if (!items || !items.length) return null;
    const preparadas = items.map(it => prepararItem(it, true));
    sesion = crearSesion(preparadas, modo, reloj());
    return sesion;
  }

  // Registra la respuesta del ítem actual: XP de sesión, XP global, meta diaria y logros. La
  // escritura de `progreso` la sigue haciendo app.js antes de llamar acá.
  function responder(id, ok) {
    if (!sesion) return 0;
    const xpBase = xpDeRespuesta(ok, obtenerP(id));
    const ganado = aplicarRespuestaSesion(sesion, ok, reloj(), xpBase);
    if (ganado) gamificacion.sumarXp(ganado);
    // La meta diaria se premia una sola vez por fecha.
    const hoy = hoyISO();
    const metaCumplida = (persistencia.actividad(track.materia.id)[hoy] || 0) >= persistencia.meta(track.materia.id);
    if (metaCumplida) gamificacion.xpEventoUnico("meta-" + hoy, XP_EVENTOS.metaDiaria);
    gamificacion.revisarLogros({ metaCumplida });
    return ganado;
  }

  // Avanza a la siguiente pregunta. En simulacro autoevalúa el desarrollo con el texto que
  // provee la UI; si la ronda terminó (game over o última) finaliza y devuelve el resultado.
  function avanzar() {
    if (!sesion) return { continua: false, resultado: null };
    const item = sesion.items[sesion.idx];
    if (item.tipo === "desarrollo" && sesion.modo === "simulacro" && !sesion.answers[sesion.idx]) {
      const texto = leerDesarrollo();
      sesion.answers[sesion.idx] = { ok: null, selected: texto || "(sin escribir)", expected: item.solucion, tipo: "desarrollo", texto };
    }
    if (debeFinalizar(sesion)) return { continua: false, resultado: finalizar() };
    sesion.idx = siguienteIndice(sesion);
    return { continua: true, modo: sesion.modo };
  }

  // Cierra la ronda: calcula el resultado y conserva el manejo de examen de lenguaje,
  // supervivencia, misión e historial de intentos. La pantalla la pinta app.js en `alFinalizar`.
  function finalizar() {
    if (!sesion) return null;
    sesion.finalizada = true;
    sesion.resultado = resultadoDeSesion(sesion, reloj());
    // Una sesión de lenguaje (prueba o examen) vuelve al mapa de etapas.
    if (sesion.lenguajeId) sesion.resultado.lenguaje = true;
    if (sesion.modo === "examen" && sesion.examenEtapa && track.lenguaje) {
      const nuevo = registrarExamen({ etapa: sesion.examenEtapa, resultados: track.competencia, aciertos: sesion.resultado.aciertos });
      track.setCompetencia(nuevo);
      persistencia.guardarCompetencia(track.lenguaje.id, nuevo);
      const aprobado = nuevo[sesion.examenEtapa.id].aprobado;
      sesion.resultado.examen = { aprobado, etapa: sesion.examenEtapa };
      avisar(aprobado
        ? nombrar("¡Examen aprobado, @! ") + sesion.examenEtapa.nombre
        : "Aún no: " + sesion.resultado.pct + "% en " + sesion.examenEtapa.nombre + ". Repasá y volvé a intentar.");
    }
    if (sesion.modo === "supervivencia") {
      sesion.resultado.supervivencia = { jugadas: Object.keys(sesion.answers).length, mejorCombo: sesion.mejorCombo || 0 };
    }
    if (sesion.modo === "mision" && sesion.misionTema) {
      const mapa = persistencia.misiones(track.materia.id);
      const nuevas = estrellasDeMision(sesion.resultado.pct);
      const merge = fusionarMision(mapa[sesion.misionTema], sesion.resultado.pct, nuevas);
      if (merge.cambio) {
        mapa[sesion.misionTema] = merge.registro;
        persistencia.guardarMisiones(track.materia.id, mapa);
        if (merge.mejoraEstrellas) gamificacion.sumarXp(merge.estrellasGanadas * XP_EVENTOS.estrella);
      }
      gamificacion.revisarLogros({ misionPerfecta: nuevas === 3, estrellasTotales: gamificacion.estrellasTotales() });
    }
    guardarIntento(sesion.resultado.aciertos, sesion.resultado.totalCal, sesion.modo);
    gamificacion.revisarLogros({
      simulacroPerfecto: sesion.resultado.totalCal > 0 && sesion.resultado.pct === 100 && sesion.modo === "simulacro"
    });
    alTerminar(sesion.resultado);
    return sesion.resultado;
  }

  // Repite solo las falladas de la última ronda; null si no hay nada que repetir.
  function repetirFalladas() {
    if (sesion && sesion.resultado && sesion.resultado.falladas.length) {
      return iniciar(sesion.resultado.falladas, "practica");
    }
    return null;
  }

  // Repite la misma ronda conservando el contexto de examen/lenguaje.
  function repetirMisma() {
    if (!sesion) return null;
    const examenEtapa = sesion.examenEtapa;
    const lenguajeId = sesion.lenguajeId;
    const nueva = iniciar(sesion.items, sesion.modo);
    if (examenEtapa) nueva.examenEtapa = examenEtapa;
    if (lenguajeId) nueva.lenguajeId = lenguajeId;
    return nueva;
  }

  function limpiar() {
    sesion = null;
  }

  return {
    get sesion() { return sesion; },
    iniciar,
    responder,
    avanzar,
    finalizar,
    repetirFalladas,
    repetirMisma,
    limpiar
  };
}
