// Controlador del Árbol de Talentos y Radar de Especialidades: sincroniza desbloqueos al
// superar misiones o Boss Battles, gestiona el título equipado y navega hacia incidentes.
import {
  evaluarEstadoTalentos,
  detectarNuevosTalentos,
  XP_EVENTOS
} from "../core/index.js";
import { pintarTalentos } from "../ui/dashboard/talentos.js";

export function crearTalentos({
  persistencia,
  track,
  gamificacion,
  sesiones,
  show,
  clearTimer,
  clearTimerPregunta,
  escenarios,
  casos,
  alDesbloquear = _nodo => {},
  alEquiparTitulo = _titulo => {},
  pintar = pintarTalentos,
  ahora = () => Date.now()
}) {
  // Sincroniza y persiste cualquier talento nuevo cuyas misiones y Boss Battle ya se hayan cumplido.
  function sincronizarDesbloqueos() {
    const m = track.materia;
    if (!m || !m.talentos) return [];

    const misiones = persistencia.misiones(m.id);
    const regEscenarios = persistencia.escenarios();
    const regCasos = persistencia.casos();
    const guardados = persistencia.talentos(m.id);

    const nuevos = detectarNuevosTalentos(
      m.talentos,
      misiones,
      regEscenarios,
      guardados,
      regCasos
    );

    for (const nodo of nuevos) {
      persistencia.guardarTalento(m.id, nodo.id, { fecha: ahora() });
      // Si el estudiante aún no tenía un título equipado, equipa automáticamente el primero obtenido.
      if (!persistencia.tituloActivo() && nodo.titulo) {
        persistencia.guardarTituloActivo(nodo.titulo);
      }
      if (gamificacion && typeof gamificacion.sumarXp === "function") {
        gamificacion.sumarXp(XP_EVENTOS.talento);
      }
      alDesbloquear(nodo);
    }

    return nuevos;
  }

  function evaluarActual() {
    const m = track.materia;
    if (!m || !m.talentos) return null;
    return evaluarEstadoTalentos(
      m.talentos,
      persistencia.misiones(m.id),
      persistencia.escenarios(),
      persistencia.talentos(m.id),
      persistencia.casos()
    );
  }

  function render() {
    sincronizarDesbloqueos();
    const arbolEvaluado = evaluarActual();
    pintar({
      arbolEvaluado,
      materia: track.materia,
      tituloActivo: persistencia.tituloActivo()
    });
  }

  function ir() {
    clearTimer();
    clearTimerPregunta();
    sesiones.limpiar();
    show("talentos");
    render();
  }

  function equiparTitulo(titulo) {
    const limpio = String(titulo || "").trim();
    if (!limpio) return;
    persistencia.guardarTituloActivo(limpio);
    alEquiparTitulo(limpio);
    render();
  }

  // Redirige al estudiante directamente al escenario o caso de diagramación que actúa como Boss Battle.
  function afrontarBoss({ bossId, bossTipo }) {
    if (!bossId) return;
    if (bossTipo === "caso" && casos && typeof casos.jugar === "function") {
      casos.jugar(bossId);
      return;
    }
    if (escenarios && typeof escenarios.jugar === "function") {
      escenarios.jugar(bossId);
    }
  }

  return {
    sincronizarDesbloqueos,
    evaluarActual,
    render,
    ir,
    equiparTitulo,
    afrontarBoss,
    acciones: {
      irTalentos: () => ir(),
      equiparTitulo: el => equiparTitulo(el.dataset.titulo),
      afrontarBoss: el => afrontarBoss({
        bossId: el.dataset.bossId,
        bossTipo: el.dataset.bossTipo
      })
    }
  };
}
