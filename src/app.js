import { MATERIAS, LENGUAJES, getMateria, getLenguaje, fechaSnapshot } from "./core/index.js";
import { registrarExamen } from "./core/index.js";
import { crearHome } from "./ui/dashboard/home.js";
import { crearConfig } from "./ui/dashboard/config.js";
import { esDebil } from "./core/index.js";
import { ordenarPrioridad, prepararItem, filtrarDiagramas } from "./core/index.js";
import { XP_EVENTOS, xpDeRespuesta, estrellasDeMision } from "./core/index.js";
import { crearApuntesUI } from "./ui/aprendizaje/apuntes.js";
import { TIPOS, TIPO_LABELS, DIF_LABELS, escapar, animar, saludoSegunHora } from "./ui/helpers.js";
import { crearQuizUI } from "./ui/aprendizaje/quiz.js";
import { crearResultadosUI } from "./ui/aprendizaje/resultados.js";
import { crearEstudioUI } from "./ui/aprendizaje/estudio.js";
import { crearGlosarioUI } from "./ui/aprendizaje/glosario.js";
import { crearFlashcardsUI } from "./ui/aprendizaje/flashcards.js";

import { icono } from "./ui/iconos.js";
import { toast, confeti } from "./ui/componentes/avisos.js";
import { crearConfirm } from "./ui/componentes/confirm.js";
import { crearRouter } from "./orquestacion/router.js";
import { crearAcciones, instalarDelegacion } from "./orquestacion/acciones.js";
import { crearConfigController } from "./orquestacion/config-controller.js";
import { crearRonda } from "./orquestacion/ronda.js";
import { crearAjustes } from "./orquestacion/ajustes.js";
import { crearMisiones } from "./orquestacion/misiones.js";
import { crearEscenarios } from "./orquestacion/escenarios.js";
import { crearCasos } from "./orquestacion/casos.js";
import { crearLenguaje } from "./orquestacion/lenguaje.js";
import { crearDashboard } from "./orquestacion/dashboard.js";
import { crearAcceso } from "./orquestacion/acceso.js";
import { crearPersistencia } from "./student/persistencia.js";
import { crearAvance } from "./student/avance.js";
import { crearRondas } from "./student/rondas.js";
import { cargarRoadmap } from "./student/contenido.js";
import { crearGamificacion } from "./student/gamificacion.js";
import { crearTrack } from "./student/track.js";
import { crearSesiones } from "./student/session.js";
import { fusionarMision } from "./student/registros.js";
// Cuenta y nube (ADR 008): servicios listos; falta cablearlos (docs/guias/aplicar-snapshots.md).
import { cargarFirebase } from "./student/firebase.js";
import { crearCuenta } from "./student/cuenta.js";
import { crearNube } from "./student/nube.js";
import { aplicarSnapshot } from "./student/aplicar.js";
import { crearCuentaUI } from "./ui/cuenta.js";
import { crearPerfil } from "./ui/cuenta/perfil.js";

// Hidrata los iconos estáticos del shell (spec 005); los renders dinámicos usan icono() directamente.
function pintarIconos(raiz) {
  (raiz || document).querySelectorAll("[data-icono]").forEach(el => {
    el.outerHTML = icono(el.dataset.icono, el.getAttribute("class") || "");
  });
}
pintarIconos();


// El constructor de diagramas (lienzo) se ofrece solo en escritorio: en dispositivos
// táctiles las preguntas de diagrama se excluyen de todas las rutas de sesión.
const diagramasDisponibles = () => !window.matchMedia("(pointer: coarse)").matches;

// Progreso del track activo (persiste en sys.progreso.<id>). El resto del estado del track
// (materia, banco, glosario, lenguaje, competencia, filtros) vive en student/track.js.
let trackIdActual = null;
let lenguaje = null;
let dashboard = null;
let acceso = null;

const $ = id => document.getElementById(id);

// El diálogo de confirmación vive en su componente (ADR 009); acá solo se instancia.
const confirm = crearConfirm({ $ });
// La navegación vive en el router (ADR 009); show conserva su nombre y firma.
const show = crearRouter({ $, animar }).show;

// Servicios del recorrido del estudiante (spec 006): persistencia y gamificación con
// dependencias inyectadas. La presentación (toast/confeti/perfil) entra por callbacks.
const persistencia = crearPersistencia(localStorage);
// Avance del track activo (student/avance.js): progreso Leitner, actividad, meta e historial.
// `trackIdActual` lo fija app.js al seleccionar materia o lenguaje.
const avance = crearAvance({ persistencia, getTrackId: () => trackIdActual });
// Selección de preguntas por modo (student/rondas.js); el DOM/timers viven en ronda.js.
const rondas = crearRondas({ obtenerP: avance.obtenerP, diagramasDisponibles });
// El sistema le habla al estudiante por su nombre en los hitos (onboarding).
const conNombre = texto => {
  const n = persistencia.nombre();
  return n ? texto.replace("@", n) : texto.replace(" @", "").replace("@", "");
};
const gamificacion = crearGamificacion({
  persistencia,
  materias: MATERIAS,
  alSubirNivel: nivel => {
    toast(icono("nivel", "icono-sm") + conNombre("¡Nivel " + nivel + ", @!"));
    confeti();
  },
  alLogro: l => toast(icono(l.icono, "icono-sm") + conNombre("Logro nuevo, @: " + l.nombre) + " (+" + XP_EVENTOS.logro + " XP)"),
  // La tarjeta de perfil vive solo en screen-perfil: si está a la vista se repinta.
  alCambiarPerfil: () => acceso?.repintarPerfil()
});

// Renderers del home (materias y lenguajes) extraídos a ui/dashboard (ADR 007).
const home = crearHome({ persistencia, cargarRoadmap });

// Track activo (materia o lenguaje): estado, filtros y carga de contenido (student/track.js).
const track = crearTrack({
  persistencia, TIPOS, esDebil,
  obtenerP: avance.obtenerP, filtrarDiagramas, diagramasDisponibles
});

// Servicio de la ronda de quiz (student/session.js): estado y orquestación. La parte que
// toca el DOM (timers, badges, pantalla) queda acá; el resto entra por dependencias.
const sesiones = crearSesiones({
  persistencia, gamificacion, track, obtenerP: avance.obtenerP, xpDeRespuesta, XP_EVENTOS,
  estrellasDeMision, fusionarMision, registrarExamen, prepararItem,
  guardarIntento: avance.guardarIntento, conNombre,
  // El toast del examen no lleva icono: se pasa el texto tal cual.
  notificar: texto => toast(texto),
  alFinalizar: () => { resultados.pintarResultados(false); show("results"); },
  leerTextoDesarrollo: () => { const ta = $("dev-texto"); return ta ? ta.value : ""; }
});

// Estado explícito que se inyecta a los módulos de src/ui/ (lectura vía getters,
// porque estas variables se reasignan al cambiar de materia o de sesión).
const ctx = {
  get session() { return sesiones.sesion; },
  get banco() { return track.banco; },
  get glosario() { return track.glosario; },
  get materia() { return track.materia; }
};

// Cuenta y nube (ADR 008): servicios con dependencias inyectadas; la UI de acceso vive en
// ui/cuenta/autenticacion.js y el panel de sesión en ui/cuenta.js.
const cuentaUI = crearCuentaUI({ ctx });
const perfilUI = crearPerfil();
const cuenta = crearCuenta({
  cargarNube: cargarFirebase,
  alCambiarSesion: usuario => acceso?.alCambiarSesion(usuario)
});
const nube = crearNube({
  cargarNube: cargarFirebase, persistencia, materias: MATERIAS, lenguajes: LENGUAJES
});

// Filtros de práctica: el estado y la lógica viven en student/track.js; el puente
// con el DOM vive en su controlador (ADR 009). Se instancia antes de la config
// porque ella lo recibe inyectado (el re-render es perezoso, sin ciclo).
const configCtl = crearConfigController({
  $, track, alCambiarFiltro: () => config.renderConfig()
});
// Config de práctica y pantalla de apuntes (extraídas de app.js, ADR 007).
const config = crearConfig({
  getFiltros: () => track.filtros,
  valoresDe: track.valoresDe, contarPor: track.contarPor,
  // Los puentes llegan del controlador (las const alias viven más abajo, en zona muerta acá).
  leerOpciones: (...args) => configCtl.leerOpciones(...args),
  preguntasFiltradas: (...args) => configCtl.preguntasFiltradas(...args),
  diagramasDisponibles, TIPO_LABELS, DIF_LABELS,
  mostrarPantalla: show
});
const apuntesUI = crearApuntesUI({ getMateria: () => track.materia, mostrarPantalla: show });

// Export/import, borrar historial y reiniciar progreso (orquestacion/ajustes.js).
const ajustes = crearAjustes({
  $, persistencia, track, avance, confirm,
  renderStats: () => dashboard.renderStats(),
  renderHistory: () => dashboard.renderHistory(),
  irHome: () => dashboard.goHome(),
  refrescarLenguaje: () => lenguaje.pintar()
});
const { clearHistory, resetProgreso, exportarDatos, importarDatos } = ajustes;

// Prioriza según el progreso del track activo (débiles → vencidas → nuevas).
const priorizar = lista => ordenarPrioridad(lista, avance.obtenerP);

// El avance (progreso, actividad, historial) vive en student/avance.js; el XP de la ronda,
// la meta diaria y los logros los resuelve student/session.js.
function registrarRespuesta(id, ok) {
  avance.registrar(id, ok);
  // El bonus de contrarreloj mide contra `sesion.preguntaInicio`; clearTimerPregunta solo
  // apaga el intervalo, así que el dato sigue intacto para el servicio.
  if (sesiones.sesion && sesiones.sesion.modo === "contrarreloj") clearTimerPregunta();
  sesiones.responder(id, ok);
  // La supervivencia pierde vidas dentro del servicio; el badge lo repinta la UI.
  if (sesiones.sesion && sesiones.sesion.modo === "supervivencia") quiz.pintarVidas();
}



// ===== Gamificación (spec 003): el servicio vive en src/student/gamificacion.js =====
// La tarjeta de perfil vive solo en screen-perfil (ui/cuenta/perfil.js).

// Render de la config de práctica: vive en ui/dashboard/config.js (ADR 007).
const leerOpciones = configCtl.leerOpciones;
const preguntasFiltradas = configCtl.preguntasFiltradas;
const toggleFiltro = configCtl.toggleFiltro;
const toggleFiltroTodos = configCtl.toggleFiltroTodos;

// Resumen, "usar todas" e ir a config: viven en ui/dashboard/config.js (ADR 007).

// ordenarPrioridad, prepararItem y respuestaCorrecta viven en core/estudio/sesiones.js (testeables).

// Arranca una ronda: ver src/app/ronda.js (ADR 009).


// La salida, el avance y los relojes de la ronda viven en src/app/ronda.js (ADR 009).

// Módulos de render por pantalla (ADR 001): reciben estado explícito y callbacks.
const quiz = crearQuizUI({
  ctx, obtenerP: avance.obtenerP, registrarRespuesta, toggleMarked: avance.toggleMarked
});
const resultados = crearResultadosUI({
  ctx, registrarRespuesta,
  contarDebiles: () => track.banco.filter(q => esDebil(avance.obtenerP(q.id))).length
});
const estudio = crearEstudioUI({
  ctx, obtenerP: avance.obtenerP, toggleMarked: avance.toggleMarked, mostrarPantalla: show
});
const glosarioUI = crearGlosarioUI({ ctx, mostrarPantalla: show });
const flashcards = crearFlashcardsUI({ ctx, priorizar, registrarRespuesta, mostrarPantalla: show });

// La orquestación de la ronda vive en su controlador (ADR 009); acá quedan los
// nombres que usan las acciones y los renders vecinos.
const ronda = crearRonda({
  $, track, sesiones, show, quiz, toast, confirm, goHome: () => dashboard.goHome(),
  irLenguaje: () => lenguaje.ir(), rondas, preguntasFiltradas
});
const {
  iniciarTimerPregunta, actualizarTimerPregunta, clearTimerPregunta,
  startSession, mostrarQuiz, comenzarPractica, comenzarSimulacro,
  startContrarreloj, startSupervivencia, practicarDebiles, practicarTipo,
  practicarArrastre, practicarCasos, practicarVencidas, next, salir,
  iniciarTimer, actualizarTimer, clearTimer, alternarPausa,
  finalizar, repetirFalladas, repetirMisma
} = ronda;
ronda.instalarTrampaPausa();
// La trampa del diálogo vive en su componente; acá solo se instala.
confirm.instalarTrampa();

// Controlador del track de lenguaje (orquestacion/lenguaje.js).
lenguaje = crearLenguaje({ $, track, show, goHome: () => dashboard.goHome(), startSession });

// Controlador del dashboard (orquestacion/dashboard.js): portada, stats, historial y track.
dashboard = crearDashboard({
  $, persistencia, track, avance, home, show, config, sesiones, apuntesUI,
  lenguaje, glosarioUI, clearTimer, diagramasDisponibles,
  alCambiarTrack: id => { trackIdActual = id; avance.cargar(); }
});

// Controlador de acceso y perfil (orquestacion/acceso.js): cuenta, onboarding y arranque.
acceso = crearAcceso({
  $, persistencia, home, show, cuenta, cuentaUI, perfilUI, nube, gamificacion,
  fechaSnapshot, aplicarSnapshot, sesiones, clearTimer
});

// Controlador del mapa de misiones (orquestacion/misiones.js).
const misiones = crearMisiones({
  persistencia, track, sesiones, show, clearTimer, clearTimerPregunta,
  rondas, startSession
});

// Controlador de escenarios (orquestacion/escenarios.js).
const escenarios = crearEscenarios({
  $, track, persistencia, gamificacion, show
});

// Controlador de casos (orquestacion/casos.js): estado y lienzo propios.
const casos = crearCasos({
  $, track, persistencia, gamificacion, show
});

document.addEventListener("keydown", e => {
  const s = sesiones.sesion;
  if ($("screen-quiz").classList.contains("hidden") || !s) return;
  const t = e.target;
  if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
  const item = s.items[s.idx];
  const answered = !!s.answers[s.idx];
  if (answered) {
    if (e.key === "Enter") next();
    return;
  }
  if (item.tipo === "multi") {
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= item.options.length) quiz.toggleMulti(n - 1);
    return;
  }
  if (!["multiple", "vf", "codigo"].includes(item.tipo)) return;
  if (item.tipo === "vf") {
    const k = e.key.toLowerCase();
    if (k === "v" || k === "f") {
      const j = item.options.findIndex(o => (/^verdad/i.test(o) ? "v" : "f") === k);
      if (j >= 0) quiz.responderOpcion(j);
      return;
    }
  }
  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= item.options.length) quiz.responderOpcion(n - 1);
});

document.addEventListener("visibilitychange", () => {
  const s = sesiones.sesion;
  if (document.hidden && s && s.modo === "simulacro" && !s.pausado && !s.finalizada) {
    alternarPausa();
  }
});

// Los datos legacy (quizBD2.*) pertenecen a la app anterior de BD2: se migran a su
// namespace al arrancar, antes de que el usuario seleccione materia.
persistencia.migrarLegacy("bd2");

// El constructor de diagramas (y los casos técnicos) solo se ofrece en escritorio: en táctil
// se ocultan sus entradas del dashboard, que viven en el HTML estático.
if (!diagramasDisponibles()) {
  document.querySelectorAll('#screen-start [data-action="startCasos"], #screen-start [data-action="practicarCasos"]')
    .forEach(el => el.classList.add("hidden"));
}

// Cuenta (ADR 008): decide la pantalla inicial. Sin claves de Firebase la app queda 100%
// local (onboarding por nombre); con claves, el primer contacto es el acceso y la sesión se
// restaura al recargar. El estado de cuenta vive en el Perfil.
acceso.iniciar();

// El mapa de acciones vive en su módulo (ADR 009), agrupado por feature; acá solo
// se instancia con el alcance actual y se instala la delegación de click.
const ACCIONES = crearAcciones({
  $, persistencia, home, show, toast, icono, saludoSegunHora, perfilUI, datosPerfil: acceso.datosPerfil,
  config, alternarPausa, confirm, quiz, resultados, apuntesUI, estudio, glosarioUI,
  clearHistory, comenzarPractica, comenzarSimulacro, exportarDatos, goHome: dashboard.goHome,
  irMaterias: dashboard.irMaterias, irPerfil: acceso.irPerfil, iniciarMision: misiones.iniciar, irMisiones: misiones.ir, next, practicarArrastre,
  practicarCasos, practicarDebiles, practicarTipo, practicarVencidas, repetirFalladas,
  repetirMisma, resetProgreso, flashcards, sesiones, clearTimerPregunta,
  startContrarreloj, startSupervivencia, salir,
  seleccionarMateria: dashboard.seleccionarMateria,
  seleccionarLenguaje: dashboard.seleccionarLenguaje,
  practicarLeccion: lenguaje.practicarLeccion, rendirExamen: lenguaje.rendirExamen,
  irLenguaje: lenguaje.ir,
  startEscenarios: escenarios.start, jugarEscenario: escenarios.jugar,
  decidirEscenario: escenarios.decidir, continuarEscenario: escenarios.continuar,
  startCasos: casos.start, jugarCaso: casos.jugar, comprobarCaso: casos.comprobar,
  diagramasUI: casos.diagramasUI, toggleFiltro, toggleFiltroTodos, cuenta, cuentaUI, auth: acceso.auth,
  // El caché se reasigna al iniciar: se limpia por callback para no capturar el viejo.
  limpiarCachePerfil: () => acceso.limpiarCachePerfil(),
  nube, fechaSnapshot, aplicarSnapshot
});
instalarDelegacion(ACCIONES);

// Listeners puntuales sobre elementos estáticos (eventos change/input, fuera del alcance
// de la delegación de click).
["cfg-priorizar", "cfg-solo-debiles", "cfg-solo-marcadas"].forEach(id =>
  $(id).addEventListener("change", () => config.actualizarResumen())
);
$("import-file").addEventListener("change", e => importarDatos(e.target));
$("study-search").addEventListener("input", e => estudio.renderStudy(e.target.value));
$("apuntes-search").addEventListener("input", e => apuntesUI.renderApuntes(e.target.value));
$("glosario-search").addEventListener("input", e => glosarioUI.renderGlosario(e.target.value));

