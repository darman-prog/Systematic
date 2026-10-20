// Controlador del mapa de misiones: navegación, render y arranque de la ronda por tema.
// La regla de desbloqueo vive en core/juego/misiones.js; el render en ui/dashboard/misiones.js.
import { estadoMisiones } from "../core/index.js";
import { pintarMisiones } from "../ui/dashboard/misiones.js";

export function crearMisiones({
  persistencia, track, sesiones, show, clearTimer, clearTimerPregunta,
  rondas, startSession
}) {
  function progreso() {
    return track.materia ? persistencia.misiones(track.materia.id) : {};
  }

  function render() {
    const temas = [...new Set(track.banco.map(q => q.tema))];
    pintarMisiones(estadoMisiones(temas, progreso()));
  }

  function ir() {
    clearTimer();
    clearTimerPregunta();
    sesiones.limpiar();
    show("misiones");
    render();
  }

  function iniciar(tema) {
    const r = rondas.mision({ banco: track.banco, tema });
    if (!r) return;
    const s = startSession(r.items, r.modo, r.conTimer);
    if (s) s.misionTema = tema;
  }

  return {
    render,
    ir,
    iniciar,
    acciones: {
      irMisiones: () => ir(),
      iniciarMision: el => iniciar(el.dataset.tema)
    }
  };
}
