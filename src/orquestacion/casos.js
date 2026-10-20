// Controlador de casos de diagramación: lista, tablero, evaluación, XP y registro del rating.
// El estado del caso vive acá; la evaluación pura en core/diagramas y el render en ui/.
import { crearTablero, evaluarDiagrama, ratingDiagrama } from "../core/index.js";
import { crearDiagramasUI } from "../ui/componentes/diagramas.js";
import { pintarListaCasos, pintarCaso } from "../ui/aprendizaje/casos.js";
import { fusionarMejor } from "../student/registros.js";

export function crearCasos({
  $, track, persistencia, gamificacion, show,
  pintarLista = pintarListaCasos,
  pintar = pintarCaso,
  fusionar = fusionarMejor
}) {
  let actual = null;
  let estado = null;

  const diagramasUI = crearDiagramasUI({
    obtenerItem: () => actual && actual.diagrama,
    obtenerEstado: () => estado,
    guardarEstado: nuevo => { estado = nuevo; },
    areaId: "lienzo-caso",
    accionComprobar: "comprobarCaso",
    accionCancelarTipo: "cancelarDiagramaTipoCaso",
    mostrarPregunta: false
  });

  function start() {
    show("casos");
    const casos = (track.materia && track.materia.casos) || [];
    pintarLista(casos, persistencia.casos());
  }

  function jugar(id) {
    const casos = (track.materia && track.materia.casos) || [];
    const c = casos.find(x => x.id === id);
    if (!c) return;
    actual = c;
    estado = crearTablero(c.diagrama);
    $("caso-titulo").textContent = c.titulo;
    pintar(c, estado);
    show("caso");
    diagramasUI.renderDiagrama(c.diagrama, $("lienzo-caso"));
    $("caso-titulo").focus({ preventScroll: true });
  }

  function comprobar() {
    if (!actual || !estado) return;
    const res = evaluarDiagrama(actual.diagrama, estado);
    // Vara deliberadamente indulgente (decisión en spec 003): el rating de casos es por
    // porcentaje (≥80 éxito) y no exige exactitud total como el quiz, para no castigar el tanteo.
    const rating = ratingDiagrama(res.correctas + res.miembrosOk, res.totalEsperado);
    const resultado = { rating, detalle: res };

    const registros = persistencia.casos();
    registros[actual.id] = fusionar(registros[actual.id], rating);
    persistencia.guardarCasos(registros);

    const xp = rating === "exito" ? 60 : rating === "parcial" ? 25 : 0;
    if (xp) gamificacion.sumarXp(xp);
    if (rating === "exito") gamificacion.revisarLogros({ casoExito: true });

    pintar(actual, estado, resultado);
  }

  return {
    start,
    jugar,
    comprobar,
    diagramasUI,
    acciones: {
      startCasos: () => start(),
      jugarCaso: el => jugar(el.dataset.id),
      comprobarCaso: () => comprobar(),
      cancelarDiagramaTipoCaso: () => diagramasUI.cancelarSeleccion()
    }
  };
}
