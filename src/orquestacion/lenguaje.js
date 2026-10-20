// Controlador del track de lenguaje: mapa de etapas, competencia, lecciones y examen.
// El estado del track y la competencia viven en student/track.js; el render en ui/.
import { barraDeCompetencia } from "../core/index.js";
import { estadoEtapas, pintarCompetencia, pintarEtapas } from "../ui/aprendizaje/lenguaje.js";

export function crearLenguaje({ $, track, show, goHome, startSession }) {
  function pintar() {
    if (!track.lenguaje || !track.lenguajeContenido) return;
    const nombre = $("lenguaje-nombre");
    if (nombre) nombre.textContent = track.lenguaje.nombre;
    const barra = barraDeCompetencia(track.lenguajeContenido.roadmap?.etapas || [], track.competencia);
    pintarCompetencia(barra, track.lenguaje.color);
    pintarEtapas(estadoEtapas(track.lenguajeContenido.roadmap, track.competencia), track.lenguaje);
  }

  function ir() {
    if (track.lenguaje && track.lenguajeContenido) {
      pintar();
      show("lenguaje");
    } else {
      goHome();
    }
  }

  // Prueba formativa: sesión sobre las preguntas de una lección. No mueve la competencia.
  function practicarLeccion(etapaId, leccionId) {
    const etapa = track.lenguajeContenido?.roadmap?.etapas.find(e => e.id === etapaId);
    const leccion = etapa?.lecciones.find(x => x.id === leccionId);
    if (!leccion) return;
    const items = track.itemsDeIds(leccion.preguntas);
    if (!items.length) return;
    const s = startSession(items, "practica", false);
    if (s) s.lenguajeId = track.lenguaje.id;
  }

  // Examen sumativo: al terminar, el servicio registra el resultado y mueve la barra.
  function rendirExamen(etapaId) {
    const etapa = track.lenguajeContenido?.roadmap?.etapas.find(e => e.id === etapaId);
    if (!etapa) return;
    const items = track.itemsDeIds(etapa.examen.preguntas);
    if (!items.length) return;
    const s = startSession(items, "examen", false);
    if (!s) return;
    s.examenEtapa = etapa;
    s.lenguajeId = track.lenguaje.id;
  }

  return {
    pintar,
    ir,
    practicarLeccion,
    rendirExamen,
    acciones: {
      irLenguaje: () => ir(),
      practicarLeccion: el => practicarLeccion(el.dataset.etapa, el.dataset.leccion),
      rendirExamen: el => rendirExamen(el.dataset.etapa)
    }
  };
}
