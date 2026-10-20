// Controlador de escenarios multi-paso: estado de la partida, navegación, XP y registro del
// rating. La lógica del escenario vive en core/juego/escenarios.js y el render en ui/.
import {
  iniciarEscenario, decidir as decidirPaso, continuar as continuarPaso, xpDeEscenario
} from "../core/index.js";
import { pintarListaEscenarios, pintarEscenario } from "../ui/aprendizaje/escenarios.js";
import { fusionarMejor } from "../student/registros.js";

export function crearEscenarios({
  $, track, persistencia, gamificacion, show,
  pintarLista = pintarListaEscenarios,
  pintar = pintarEscenario,
  fusionar = fusionarMejor
}) {
  let actual = null;
  let estado = null;

  function start() {
    show("escenarios");
    pintarLista((track.materia && track.materia.escenarios) || [], persistencia.escenarios());
  }

  function jugar(id) {
    const e = ((track.materia && track.materia.escenarios) || []).find(x => x.id === id);
    if (!e) return;
    actual = e;
    estado = iniciarEscenario(e);
    $("escenario-titulo").textContent = e.titulo;
    pintar(e, estado);
    show("escenario");
  }

  function decidir(idx) {
    if (!actual || !estado) return;
    estado = decidirPaso(actual, estado, idx);
    pintar(actual, estado);
  }

  function continuar() {
    if (!actual || !estado) return;
    estado = continuarPaso(actual, estado);
    pintar(actual, estado);
    if (!estado.terminado) return;
    const xp = xpDeEscenario(estado);
    if (xp) gamificacion.sumarXp(xp);
    const registros = persistencia.escenarios();
    registros[actual.id] = fusionar(registros[actual.id], estado.rating);
    persistencia.guardarEscenarios(registros);
    gamificacion.revisarLogros({ escenarioExito: estado.rating === "exito" });
  }

  return {
    start,
    jugar,
    decidir,
    continuar,
    acciones: {
      startEscenarios: () => start(),
      jugarEscenario: el => jugar(el.dataset.id),
      decidirEscenario: el => decidir(parseInt(el.dataset.idx, 10)),
      continuarEscenario: () => continuar()
    }
  };
}
