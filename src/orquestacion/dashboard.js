// Controlador del dashboard: selección de track, portada, continuidad, estadísticas,
// historial y navegación al home de materias. La UI recibe datos ya resueltos.
import { esDebil, hoyISO } from "../core/index.js";
import { renderHistory as renderHistoryUI, renderStats as renderStatsUI } from "../ui/dashboard/stats.js";
import {
  pintarPortada, aplicarAcento, pintarTiposPanel, pintarContinuidad
} from "../ui/dashboard/portada.js";

export function crearDashboard({
  $, persistencia, track, avance, home, show, config, sesiones, apuntesUI,
  lenguaje, glosarioUI, clearTimer, alCambiarTrack, diagramasDisponibles,
  ui = {
    pintarPortada, aplicarAcento, pintarTiposPanel, pintarContinuidad,
    renderStats: renderStatsUI, renderHistory: renderHistoryUI
  },
  hoy = hoyISO
}) {
  function renderStats() {
    if (!track.materia) return;
    ui.renderStats({
      materia: track.materia,
      banco: track.banco,
      obtenerP: avance.obtenerP,
      historial: avance.historial(),
      actividad: avance.actividad(),
      meta: avance.meta(),
      onCambiarMeta: valor => { avance.cambiarMeta(valor); renderStats(); }
    });
  }

  function renderHistory() {
    ui.renderHistory(avance.historial(), null, persistencia.nombre());
  }

  // Franja de continuidad: última visita + débiles por repasar.
  function renderContinuidad() {
    const slot = $("continuidad");
    if (!slot) return;
    if (!track.materia) { slot.innerHTML = ""; return; }
    const dias = Object.keys(avance.actividad());
    if (!dias.length) { slot.innerHTML = ""; return; }
    const ultima = dias.sort().pop();
    const hace = Math.round((new Date(hoy()).getTime() - new Date(ultima).getTime()) / 86400000);
    const cuando = hace <= 0 ? "hoy" : hace === 1 ? "ayer" : "hace " + hace + " días";
    const debiles = track.banco.filter(q => esDebil(avance.obtenerP(q.id))).length;
    ui.pintarContinuidad($, { cuando, debiles });
  }

  function goHome() {
    if (track.materia) ui.pintarPortada($, track);
    const btnEtapas = $("btn-etapas");
    if (btnEtapas) btnEtapas.classList.toggle("hidden", !track.lenguaje);
    show("start");
    renderContinuidad();
    renderStats();
    renderHistory();
    ui.pintarTiposPanel($, track, diagramasDisponibles);
    glosarioUI.renderTip();
  }

  function irMaterias() {
    clearTimer();
    sesiones.limpiar();
    // Salir del track de lenguaje: que no quede activo para export/import ni para el quiz.
    track.limpiarLenguaje();
    ui.aplicarAcento(null);
    const temaMeta = document.querySelector('meta[name="theme-color"]');
    if (temaMeta) temaMeta.setAttribute("content", "#1a1c22");
    show("materias");
    home.renderMaterias();
  }

  async function seleccionarMateria(id) {
    if (!await track.seleccionarMateria(id)) return;
    ui.aplicarAcento(track.materia);
    persistencia.migrarLegacy(track.materia.id);
    alCambiarTrack(track.materia.id);
    config.renderConfig();
    ui.pintarPortada($, track);
    goHome();
  }

  async function seleccionarLenguaje(id) {
    if (!await track.seleccionarLenguaje(id)) return;
    // Progreso propio del lenguaje: si no se recarga, se arrastra el de la materia anterior.
    alCambiarTrack(track.lenguaje.id);
    apuntesUI.resetTema();
    ui.aplicarAcento(track.lenguaje);
    // La portada del dashboard lleva los datos del track activo, también para lenguajes.
    ui.pintarPortada($, track);
    lenguaje.pintar();
    show("lenguaje");
  }

  return {
    goHome,
    irMaterias,
    seleccionarMateria,
    seleccionarLenguaje,
    renderStats,
    renderHistory,
    renderContinuidad,
    acciones: {
      goHome: () => goHome(),
      irMaterias: () => irMaterias(),
      seleccionarMateria: el => seleccionarMateria(el.dataset.materia),
      seleccionarLenguaje: el => seleccionarLenguaje(el.dataset.lenguaje)
    }
  };
}
