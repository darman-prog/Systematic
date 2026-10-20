import { MATERIAS, LENGUAJES, fechaSnapshot } from "./core/index.js";
import { registrarExamen } from "./core/index.js";
import { crearHome } from "./ui/dashboard/home.js";
import { crearConfig } from "./ui/dashboard/config.js";
import { esDebil } from "./core/index.js";
import { prepararItem, filtrarDiagramas } from "./core/index.js";
import { XP_EVENTOS, xpDeRespuesta, estrellasDeMision } from "./core/index.js";
import { crearApuntesUI } from "./ui/aprendizaje/apuntes.js";
import { TIPOS, TIPO_LABELS, DIF_LABELS, animar, saludoSegunHora, conNombre as conNombreUI } from "./ui/helpers.js";
import { crearQuizUI } from "./ui/aprendizaje/quiz.js";
import { crearResultadosUI } from "./ui/aprendizaje/resultados.js";
import { crearEstudioUI } from "./ui/aprendizaje/estudio.js";
import { crearGlosarioUI } from "./ui/aprendizaje/glosario.js";
import { crearFlashcardsUI } from "./ui/aprendizaje/flashcards.js";
import { icono, hidratarIconos } from "./ui/iconos.js";
import { diagramasDisponibles, ocultarCasosEnTactil } from "./ui/entorno.js";
import { toast, confeti } from "./ui/componentes/avisos.js";
import { crearConfirm } from "./ui/componentes/confirm.js";
import { crearRouter } from "./orquestacion/router.js";
import { crearAcciones, instalarDelegacion } from "./orquestacion/acciones/index.js";
import { instalarAtajos } from "./orquestacion/atajos.js";
import { crearConfigController } from "./orquestacion/config-controller.js";
import { crearRonda } from "./orquestacion/ronda.js";
import { crearRespuesta } from "./orquestacion/quiz.js";
import { crearAjustes } from "./orquestacion/ajustes.js";
import { crearMisiones } from "./orquestacion/misiones.js";
import { crearEscenarios } from "./orquestacion/escenarios.js";
import { crearCasos } from "./orquestacion/casos.js";
import { crearLenguaje } from "./orquestacion/lenguaje.js";
import { crearDashboard } from "./orquestacion/dashboard.js";
import { crearAcceso } from "./orquestacion/acceso.js";
import { crearContexto } from "./orquestacion/contexto.js";
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

// Hidrata los iconos estáticos del shell (spec 005); los renders dinámicos usan icono().
hidratarIconos();

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
const conNombre = texto => conNombreUI(persistencia.nombre(), texto);
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

const ctx = crearContexto({ sesiones, track });

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
const { importarDatos } = ajustes;

// Coordinador de respuesta: avance + sesión + efectos de UI (timer/vidas).
const respuesta = crearRespuesta({
  avance, sesiones,
  alApagarTimer: () => clearTimerPregunta(),
  alPerderVida: () => quiz.pintarVidas()
});



// ===== Gamificación (spec 003): el servicio vive en src/student/gamificacion.js =====
// La tarjeta de perfil vive solo en screen-perfil (ui/cuenta/perfil.js).

// Resumen, "usar todas" e ir a config: viven en ui/dashboard/config.js (ADR 007).

// ordenarPrioridad, prepararItem y respuestaCorrecta viven en core/estudio/sesiones.js (testeables).

// Arranca una ronda: ver src/app/ronda.js (ADR 009).


// La salida, el avance y los relojes de la ronda viven en src/app/ronda.js (ADR 009).

// Módulos de render por pantalla (ADR 001): reciben estado explícito y callbacks.
const quiz = crearQuizUI({
  ctx, obtenerP: avance.obtenerP, registrarRespuesta: respuesta, toggleMarked: avance.toggleMarked
});
const resultados = crearResultadosUI({
  ctx, registrarRespuesta: respuesta,
  contarDebiles: () => track.banco.filter(q => esDebil(avance.obtenerP(q.id))).length
});
const estudio = crearEstudioUI({
  ctx, obtenerP: avance.obtenerP, toggleMarked: avance.toggleMarked, mostrarPantalla: show
});
const glosarioUI = crearGlosarioUI({ ctx, mostrarPantalla: show });
const flashcards = crearFlashcardsUI({
  ctx, obtenerP: avance.obtenerP, registrarRespuesta: respuesta, mostrarPantalla: show
});

// La orquestación de la ronda vive en su controlador (ADR 009); acá quedan los
// nombres que usan las acciones y los renders vecinos.
const ronda = crearRonda({
  $, track, sesiones, show, quiz, toast, confirm, goHome: () => dashboard.goHome(),
  irLenguaje: () => lenguaje.ir(), rondas, preguntasFiltradas: configCtl.preguntasFiltradas
});
const {
  clearTimerPregunta, startSession, comenzarPractica, comenzarSimulacro,
  startContrarreloj, startSupervivencia, practicarDebiles, practicarTipo,
  practicarArrastre, practicarCasos, practicarVencidas, next, salir,
  clearTimer, alternarPausa, repetirFalladas, repetirMisma
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

// Los datos legacy (quizBD2.*) pertenecen a la app anterior de BD2: se migran a su
// namespace al arrancar, antes de que el usuario seleccione materia.
persistencia.migrarLegacy("bd2");

// El constructor de diagramas y los casos técnicos solo se ofrecen en escritorio.
ocultarCasosEnTactil();

// El mapa de acciones se compone por feature (ADR 009/010); acá solo se agrupan las
// dependencias de cada controlador y se instala la delegación de click.
const ACCIONES = crearAcciones({
  acceso: {
    $, persistencia, home, show, toast, icono, saludoSegunHora, perfilUI,
    datosPerfil: acceso.datosPerfil, irPerfil: acceso.irPerfil,
    cuenta, cuentaUI, auth: acceso.auth, nube, fechaSnapshot, aplicarSnapshot,
    limpiarCachePerfil: () => acceso.limpiarCachePerfil(),
    irMaterias: dashboard.irMaterias
  },
  practica: {
    config, alternarPausa, confirm, quiz, resultados, apuntesUI, estudio, glosarioUI,
    flashcards, sesiones, clearTimerPregunta, next, salir,
    comenzarPractica, comenzarSimulacro, startContrarreloj, startSupervivencia,
    practicarArrastre, practicarCasos, practicarDebiles, practicarTipo, practicarVencidas,
    repetirFalladas, repetirMisma,
    toggleFiltro: configCtl.toggleFiltro, toggleFiltroTodos: configCtl.toggleFiltroTodos
  },
  juego: { misiones, escenarios, casos },
  navegacion: { dashboard, lenguaje, ajustes }
});
instalarDelegacion(ACCIONES);

// Atajos globales: teclado del quiz, auto-pausa y búsquedas estáticas.
instalarAtajos({
  $, sesiones, quiz, next, alternarPausa, config, estudio, apuntesUI, glosarioUI, importarDatos
});

// Cuenta (ADR 008): decide la pantalla inicial una vez instaladas acciones y atajos.
acceso.iniciar();

