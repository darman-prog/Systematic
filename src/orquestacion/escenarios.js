// Controlador de escenarios multi-paso: estado de la partida, navegación, XP y registro del
// rating. La lógica del escenario vive en core/juego/escenarios.js y el render en ui/.
import {
  iniciarEscenario, decidir as decidirPaso, continuar as continuarPaso, xpDeEscenario,
  cambiarLente as cambiarLentePaso, alternarVariante as alternarVariantePaso, iniciarCorreccion
} from "../core/index.js";
import { pintarListaEscenarios, pintarEscenario } from "../ui/aprendizaje/escenarios.js";
import { fusionarMejor } from "../student/registros.js";

export function crearEscenarios({
  $, track, persistencia, gamificacion, show,
  alFinalizar = _estado => {},
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

  // Registra XP, estadísticas y logros cuando la partida concluye (sea en estudio, simulacro o corrección).
  function registrarFinSiAplica() {
    if (!estado || !estado.terminado) return;
    const xp = xpDeEscenario(estado);
    if (xp) gamificacion.sumarXp(xp);
    const registros = persistencia.escenarios();
    registros[actual.id] = fusionar(registros[actual.id], estado.rating);
    persistencia.guardarEscenarios(registros);
    gamificacion.revisarLogros({ escenarioExito: estado.rating === "exito" });
    // Permite sincronizar el árbol de talentos cuando el escenario actúa como Boss Battle.
    alFinalizar(estado);
  }

  function jugar(id, modo = "estudio") {
    const e = ((track.materia && track.materia.escenarios) || []).find(x => x.id === id);
    if (!e) return;
    actual = e;
    estado = iniciarEscenario(e, { modo });
    $("escenario-titulo").textContent = e.titulo;
    pintar(e, estado);
    show("escenario");
  }

  function decidir(idx) {
    if (!actual || !estado) return;
    estado = decidirPaso(actual, estado, idx);
    pintar(actual, estado);
    // En modo simulacro el último paso termina de inmediato sin pasar por continuar().
    registrarFinSiAplica();
  }

  function continuar() {
    if (!actual || !estado) return;
    estado = continuarPaso(actual, estado);
    pintar(actual, estado);
    registrarFinSiAplica();
  }

  // Conmuta la perspectiva conceptual visible (negocio, calidad, síntoma) durante el estudio.
  function cambiarLente(lente) {
    if (!actual || !estado || estado.terminado) return;
    estado = cambiarLentePaso(estado, lente);
    pintar(actual, estado);
  }

  // Rota la redacción del enunciado para entrenar transferencia de ideas sin memorización de texto.
  function alternarVariante() {
    if (!actual || !estado || estado.terminado) return;
    estado = alternarVariantePaso(estado);
    pintar(actual, estado);
  }

  // Inicia una ronda de recuperación que repite únicamente los pasos fallados con opciones permutadas.
  function corregir() {
    if (!actual || !estado) return;
    estado = iniciarCorreccion(actual, estado);
    pintar(actual, estado);
  }

  return {
    start,
    jugar,
    decidir,
    continuar,
    cambiarLente,
    alternarVariante,
    corregir,
    acciones: {
      startEscenarios: () => start(),
      jugarEscenario: el => jugar(el.dataset.id, el.dataset.modo || "estudio"),
      decidirEscenario: el => decidir(parseInt(el.dataset.idx, 10)),
      continuarEscenario: () => continuar(),
      cambiarLenteEscenario: el => cambiarLente(el.dataset.lente),
      alternarVarianteEscenario: () => alternarVariante(),
      corregirEscenario: () => corregir()
    }
  };
}
