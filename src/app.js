import { MATERIAS, LENGUAJES, getMateria, getLenguaje, cargarContenido, acentoDe, fechaSnapshot } from "./core/index.js";
import { barraDeCompetencia, registrarExamen } from "./core/index.js";
import { estadoEtapas, pintarCompetencia, pintarEtapas } from "./ui/aprendizaje/lenguaje.js";
import { crearHome } from "./ui/dashboard/home.js";
import { crearConfig } from "./ui/dashboard/config.js";
import { crearMezclador, storeLocalStorage } from "./core/index.js";
import {
  obtenerEntrada, aplicarRespuesta, esDebil, vencida, hoyISO
} from "./core/index.js";
import { shuffle, ordenarPrioridad, prepararItem, filtrarDiagramas, formatearTiempo } from "./core/index.js";
import { XP_EVENTOS, xpDeRespuesta, estrellasDeMision } from "./core/index.js";
import { crearApuntesUI } from "./ui/aprendizaje/apuntes.js";
import { TIPOS, TIPO_LABELS, DIF_LABELS, escapar, animar, saludoSegunHora } from "./ui/helpers.js";
import { crearQuizUI } from "./ui/aprendizaje/quiz.js";
import { crearResultadosUI } from "./ui/aprendizaje/resultados.js";
import { renderHistory as renderHistoryUI, renderStats as renderStatsUI } from "./ui/dashboard/stats.js";
import { crearEstudioUI } from "./ui/aprendizaje/estudio.js";
import { crearGlosarioUI } from "./ui/aprendizaje/glosario.js";
import { crearFlashcardsUI } from "./ui/aprendizaje/flashcards.js";
import { estadoMisiones, pintarMisiones } from "./ui/dashboard/misiones.js";
import { iniciarEscenario, decidir as decidirEscenarioPaso, continuar as continuarEscenarioPaso, xpDeEscenario } from "./core/index.js";
import { pintarListaEscenarios, pintarEscenario } from "./ui/aprendizaje/escenarios.js";
import { crearTablero, evaluarDiagrama, ratingDiagrama } from "./core/index.js";
import { crearDiagramasUI } from "./ui/componentes/diagramas.js";
import { pintarListaCasos, pintarCaso } from "./ui/aprendizaje/casos.js";
import { icono } from "./ui/iconos.js";
import { toast, confeti } from "./ui/componentes/avisos.js";
import { crearConfirm } from "./ui/componentes/confirm.js";
import { crearRouter } from "./app/router.js";
import { crearPersistencia } from "./student/persistencia.js";
import { crearGamificacion } from "./student/gamificacion.js";
import { crearTrack } from "./student/track.js";
import { crearSesiones } from "./student/session.js";
import { fusionarMejor, fusionarMision } from "./student/registros.js";
// Cuenta y nube (ADR 008): servicios listos; falta cablearlos (docs/guias/aplicar-snapshots.md).
import { cargarFirebase } from "./student/firebase.js";
import { crearCuenta } from "./student/cuenta.js";
import { crearNube } from "./student/nube.js";
import { aplicarSnapshot } from "./student/aplicar.js";
import { crearCuentaUI } from "./ui/cuenta.js";
import { crearAuth } from "./ui/cuenta/autenticacion.js";
import { crearPerfil } from "./ui/cuenta/perfil.js";


const mezclador = crearMezclador({
  registro: MATERIAS,
  obtenerP: obtenerEntrada, 
  store: storeLocalStorage("nexora-mezclador")
});

export default mezclador;

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
const sinDiagramasEnTactil = qs => filtrarDiagramas(qs, diagramasDisponibles());

// Progreso del track activo (persiste en sys.progreso.<id>). El resto del estado del track
// (materia, banco, glosario, lenguaje, competencia, filtros) vive en student/track.js.
let progreso = {};
let escenarioActual = null;
let escenarioEstado = null;

const $ = id => document.getElementById(id);

// El diálogo de confirmación vive en su componente (ADR 009); acá solo se instancia.
const confirm = crearConfirm({ $ });
// La navegación vive en el router (ADR 009); show conserva su nombre y firma.
const show = crearRouter({ $, animar }).show;

// Servicios del recorrido del estudiante (spec 006): persistencia y gamificación con
// dependencias inyectadas. La presentación (toast/confeti/perfil) entra por callbacks.
const persistencia = crearPersistencia(localStorage);
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
  alCambiarPerfil: () => { if (!$("screen-perfil")?.classList.contains("hidden")) perfilUI.render(datosPerfil()); }
});

// Renderers del home (materias y lenguajes) extraídos a ui/dashboard (ADR 007).
const home = crearHome({ persistencia });

// Track activo (materia o lenguaje): estado, filtros y carga de contenido (student/track.js).
const track = crearTrack({
  persistencia, TIPOS, esDebil,
  obtenerP, filtrarDiagramas, diagramasDisponibles
});

// Servicio de la ronda de quiz (student/session.js): estado y orquestación. La parte que
// toca el DOM (timers, badges, pantalla) queda acá; el resto entra por dependencias.
const sesiones = crearSesiones({
  persistencia, gamificacion, track, obtenerP, xpDeRespuesta, XP_EVENTOS,
  estrellasDeMision, fusionarMision, registrarExamen, prepararItem,
  guardarIntento, conNombre,
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
  alCambiarSesion: usuario => {
    cuentaUI.pintar(usuario);
    // Si el Perfil está a la vista, su bloque de cuenta sigue al mismo estado.
    cachePerfilCuenta.email = usuario?.email ?? usuario?.correo ?? null;
    if (!$("screen-perfil")?.classList.contains("hidden")) perfilUI.render(datosPerfil());
  }
});
const nube = crearNube({
  cargarNube: cargarFirebase, persistencia, materias: MATERIAS, lenguajes: LENGUAJES
});

// Códigos de Firebase Auth que la UI de acceso sabe ubicar bajo un campo.
const campoDeCodigo = codigo => codigo === "auth/invalid-email" ? "correo"
  : codigo === "auth/weak-password" ? "contrasena" : undefined;
// Cerrar la ventana de Google no es un error que deba mostrarse.
const esCancelado = codigo => codigo === "auth/popup-closed-by-user" || codigo === "auth/cancelled-popup-request";

// Adapta los resultados de los servicios al contrato de crearAuth: los errores se lanzan
// como { mensaje, campo? } (o { cancelado: true }) y el éxito entra a la app (entrarConCuenta).
async function pedirCuenta(ejecutar, alExito) {
  const r = await ejecutar();
  if (!r.ok) {
    if (esCancelado(r.codigo)) throw { cancelado: true };
    throw { mensaje: r.mensaje, campo: campoDeCodigo(r.codigo) };
  }
  if (alExito) await alExito(r);
  return r;
}

const auth = crearAuth({
  alIniciarSesion: datos => pedirCuenta(
    () => cuenta.ingresar(datos.correo, datos.contrasena),
    r => entrarConCuenta(r.usuario)
  ),
  alRegistrarse: datos => pedirCuenta(
    async () => {
      const r = await cuenta.registrar(datos.correo, datos.contrasena);
      // El nombre es identidad local (saludo/perfil): se guarda al crear la cuenta.
      if (r.ok && datos.nombre) persistencia.guardarNombre(datos.nombre);
      return r;
    },
    r => entrarConCuenta(r.usuario)
  ),
  alRecuperar: datos => pedirCuenta(() => cuenta.enviarReset(datos.correo)),
  alGoogle: () => pedirCuenta(
    () => cuenta.ingresarConGoogle(),
    // Con redirect la página navega y no hay usuario todavía: la sesión llega al recargar.
    r => { if (!r.navegando) entrarConCuenta(r.usuario); }
  ),
  // Puerta de invitado: quien no quiere cuenta sigue con el flujo local de siempre.
  alContinuarSinCuenta: () => {
    if (!persistencia.nombre() && !persistencia.onboardingHecho()) mostrarOnboardingLocal();
    else mostrarMaterias();
  }
});

// Config de práctica y pantalla de apuntes (extraídas de app.js, ADR 007).
const config = crearConfig({
  getFiltros: () => track.filtros,
  valoresDe: track.valoresDe, contarPor: track.contarPor,
  leerOpciones, preguntasFiltradas,
  diagramasDisponibles, TIPO_LABELS, DIF_LABELS,
  mostrarPantalla: show
});
const apuntesUI = crearApuntesUI({ getMateria: () => track.materia, mostrarPantalla: show });

function cargarProgreso() {
  return persistencia.progreso(track.materia.id);
}

function guardarProgreso() {
  persistencia.guardarProgreso(track.materia.id, progreso);
}

function obtenerP(id) {
  return obtenerEntrada(progreso, id);
}

// Prioriza según el progreso de la materia activa (débiles → vencidas → nuevas).
const priorizar = lista => ordenarPrioridad(lista, obtenerP);

function cargarActividad() {
  return persistencia.actividad(track.materia.id);
}

function registrarActividad() {
  const a = cargarActividad();
  const h = hoyISO();
  a[h] = (a[h] || 0) + 1;
  persistencia.guardarActividad(track.materia.id, a);
}

function cargarMeta() {
  return persistencia.meta(track.materia.id);
}

function cambiarMeta(valor) {
  persistencia.guardarMeta(track.materia.id, valor);
  renderStats();
}

// El progreso de la materia lo sigue escribiendo app.js; el XP de la ronda, la meta diaria y
// los logros los resuelve el servicio (student/session.js).
function registrarRespuesta(id, ok) {
  progreso[id] = aplicarRespuesta(obtenerP(id), ok);
  guardarProgreso();
  registrarActividad();
  // El bonus de contrarreloj mide contra `sesion.preguntaInicio`; clearTimerPregunta solo
  // apaga el intervalo, así que el dato sigue intacto para el servicio.
  if (sesiones.sesion && sesiones.sesion.modo === "contrarreloj") clearTimerPregunta();
  sesiones.responder(id, ok);
  // La supervivencia pierde vidas dentro del servicio; el badge lo repinta la UI.
  if (sesiones.sesion && sesiones.sesion.modo === "supervivencia") quiz.pintarVidas();
}

function toggleMarked(id) {
  const marcada = !obtenerP(id).marked;
  progreso[id] = Object.assign({}, obtenerP(id), { marked: marcada });
  guardarProgreso();
  return marcada;
}

function cargarHistorial() {
  return persistencia.historial(track.materia.id);
}

function clearHistory() {
  confirm.pedirConfirmacion({
    titulo: "¿Borrar el historial?",
    mensaje: "Se borran los intentos de esta materia. No se puede deshacer.",
    textoConfirmar: "Borrar historial"
  }).then(ok => {
    if (!ok) return;
    if (!track.materia || !track.materia.id) return;
    persistencia.borrarHistorial(track.materia.id);
    renderHistory();
    renderStats();
  });
}

function resetProgreso() {
  confirm.pedirConfirmacion({
    titulo: "¿Reiniciar el progreso?",
    mensaje: "Se eliminan aciertos, fallos, marcas, racha, historial y misiones. Tu XP y logros globales se conservan.",
    textoConfirmar: "Reiniciar todo"
  }).then(ok => {
    if (!ok) return;
    if (!track.materia || !track.materia.id) return;
    progreso = {};
    persistencia.reiniciarMateria(track.materia.id);
    renderStats();
    renderHistory();
  });
}

function exportarDatos() {
  // Desde el Perfil se exporta el track activo (materia o lenguaje); sin track no hay nada que exportar.
  if (!track.lenguaje && (!track.materia || !track.materia.id)) return;
  // En un track de lenguaje se exporta la competencia; en una materia, su progreso.
  const esLenguaje = !!track.lenguaje;
  const datos = {
    app: "systematic",
    version: 2,
    exportado: new Date().toISOString(),
    nombre: persistencia.nombre(),
    ...(esLenguaje
      ? { lenguaje: track.lenguaje.id, competencia: persistencia.competencia(track.lenguaje.id) }
      : {
          materia: track.materia.id,
          progreso: cargarProgreso(),
          historial: cargarHistorial(),
          actividad: cargarActividad(),
          meta: cargarMeta()
        })
  };
  const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "systematic-" + (esLenguaje ? track.lenguaje.id : track.materia.id) + "-" + hoyISO() + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importarDatos(input) {
  const archivo = input.files && input.files[0];
  if (!archivo) return;
  const lector = new FileReader();
  lector.onload = () => {
    try {
      const datos = JSON.parse(lector.result);
      const esLegacy = !!datos && datos.app === "quiz-bd2" && typeof datos.progreso === "object";
      const esCompetencia = !!datos && datos.app === "systematic" &&
        datos.competencia && typeof datos.competencia === "object" && !Array.isArray(datos.competencia);
      const esMateria = !!datos && datos.app === "systematic" && typeof datos.progreso === "object";
      if (!esLegacy && !esMateria && !esCompetencia) throw new Error("formato");

      // Import de competencia de un lenguaje.
      if (esCompetencia) {
        if (!track.lenguaje) {
          alert("Este archivo es de un lenguaje. Entra al lenguaje para importarlo.");
          return;
        }
        // Validar la forma antes de persistir: no aceptar basura que rompa la UI.
        const valida = Object.values(datos.competencia).every(r =>
          r && typeof r === "object" && typeof r.aprobado === "boolean" && Number.isInteger(r.version));
        if (!valida) throw new Error("formato");
        if (datos.lenguaje && datos.lenguaje !== track.lenguaje.id &&
            !confirm("El archivo es de otro lenguaje («" + datos.lenguaje + "»). ¿Importarlo igual en «" + track.lenguaje.nombre + "»?")) return;
        if (!confirm("Se reemplazará tu competencia actual con la del archivo. ¿Continuar?")) return;
        track.setCompetencia(datos.competencia);
        persistencia.guardarCompetencia(track.lenguaje.id, track.competencia);
        pintarLenguaje();
        alert("Competencia importada correctamente.");
        return;
      }

      // Import de materia: no se permite estando dentro de un lenguaje (claves distintas).
      if (track.lenguaje) {
        alert("Este archivo es de una materia. Entra a la materia para importarlo.");
        return;
      }
      if (esMateria && datos.materia && datos.materia !== track.materia.id &&
          !confirm("El archivo es de otra materia («" + datos.materia + "»). ¿Importarlo igual en «" + track.materia.nombre + "»?")) return;
      if (!confirm("Se reemplazará tu progreso actual con el del archivo. ¿Continuar?")) return;
      progreso = datos.progreso || {};
      persistencia.guardarProgreso(track.materia.id, progreso);
      if (datos.historial) persistencia.guardarHistorial(track.materia.id, datos.historial);
      if (datos.actividad) persistencia.guardarActividad(track.materia.id, datos.actividad);
      if (datos.meta) persistencia.guardarMeta(track.materia.id, datos.meta);
      if (typeof datos.nombre === "string") persistencia.guardarNombre(datos.nombre);
      goHome();
      alert("Progreso importado correctamente.");
    } catch (e) {
      alert("El archivo no es válido. Debe ser un JSON exportado desde esta app.");
    } finally {
      input.value = "";
    }
  };
  lector.readAsText(archivo);
}

// ===== Gamificación (spec 003): el servicio vive en src/student/gamificacion.js =====
// La tarjeta de perfil vive solo en screen-perfil (ui/cuenta/perfil.js).

// Filtros de práctica: el estado y la lógica viven en student/track.js; acá solo queda el
// puente con el DOM (checkboxes de la config) y el re-render después de cada cambio.
function leerOpciones() {
  track.setOpciones({
    soloDebiles: $("cfg-solo-debiles").checked,
    soloMarcadas: $("cfg-solo-marcadas").checked,
    priorizar: $("cfg-priorizar").checked
  });
}

function preguntasFiltradas() {
  leerOpciones();
  return track.preguntasFiltradas();
}

// Render de la config de práctica: vive en ui/dashboard/config.js (ADR 007).

function toggleFiltro(clave, valor) {
  track.toggleFiltro(clave, valor);
  config.renderConfig();
}

function toggleFiltroTodos(clave, activar) {
  track.toggleFiltroTodos(clave, activar);
  config.renderConfig();
}

// Resumen, "usar todas" e ir a config: viven en ui/dashboard/config.js (ADR 007).

// ordenarPrioridad, prepararItem y respuestaCorrecta viven en core/estudio/sesiones.js (testeables).

// Timer por pregunta del modo Contrarreloj (spec 003): 30s o fallo. La cuenta y el reloj
// viven en el estado de la sesión (student/session.js); acá solo se pinta el badge.
function iniciarTimerPregunta() {
  const s = sesiones.sesion;
  if (!s || s.modo !== "contrarreloj") return;
  s.tRestante = s.tPorPregunta;
  s.preguntaInicio = Date.now();
  actualizarTimerPregunta();
  s.timerPreguntaId = setInterval(() => {
    s.tRestante--;
    actualizarTimerPregunta();
    if (s.tRestante <= 0) {
      clearTimerPregunta();
      quiz.expirarPregunta();
    }
  }, 1000);
}

function actualizarTimerPregunta() {
  const badge = $("timer-pregunta");
  const s = sesiones.sesion;
  if (!badge || !s) return;
  badge.innerHTML = icono("rayo", "icono-sm") + "<span>" + Math.max(0, s.tRestante) + "s</span>";
  badge.classList.toggle("timer-low", s.tRestante <= 10);
}

function clearTimerPregunta() {
  const s = sesiones.sesion;
  if (s && s.timerPreguntaId) {
    clearInterval(s.timerPreguntaId);
    s.timerPreguntaId = null;
  }
}

// Arranca una ronda: el estado lo crea student/session.js y acá se monta la pantalla. Devuelve
// la sesión (o null sin ítems) para que quien llama ajuste misionTema/lenguajeId/examenEtapa.
function startSession(items, modo, conTimer) {
  clearTimer();
  clearTimerPregunta();
  const s = sesiones.iniciar(items, modo);
  if (!s) return null;
  mostrarQuiz(modo, conTimer);
  return s;
}

// Monta la pantalla de quiz y sus badges para la ronda ya creada (solo DOM).
function mostrarQuiz(modo, conTimer) {
  show("quiz");
  $("timer-badge").classList.toggle("hidden", !conTimer);
  $("simulacro-badge").classList.toggle("hidden", modo !== "simulacro");
  const mb = $("modo-badge");
  mb.innerHTML = modo === "contrarreloj"
    ? icono("contrarreloj", "icono-sm") + "<span>Contrarreloj</span>"
    : modo === "supervivencia"
      ? icono("supervivencia", "icono-sm") + "<span>Supervivencia</span>"
      : "";
  mb.classList.toggle("hidden", !mb.innerHTML);
  $("vidas-badge").classList.toggle("hidden", modo !== "supervivencia");
  $("timer-pregunta").classList.toggle("hidden", modo !== "contrarreloj");
  $("pause-btn").classList.toggle("hidden", modo !== "simulacro");
  $("pause-overlay").classList.add("hidden");
  quiz.renderQuestion();
  if (modo === "supervivencia") quiz.pintarVidas();
  if (conTimer) iniciarTimer(20 * 60);
  if (modo === "contrarreloj") iniciarTimerPregunta();
}

function comenzarPractica() {
  const qs = preguntasFiltradas();
  // Con filtros que dejan 0 no se arranca en silencio: se explica cómo reparar.
  if (!qs.length) {
    toast("Sin preguntas con esos filtros. Pulsa Todos o quita Solo débiles / Solo marcadas.");
    return;
  }
  const cant = Math.min(parseInt($("cfg-cantidad").value, 10) || qs.length, qs.length);
  const lista = track.filtros.priorizar ? priorizar(qs) : shuffle(qs);
  startSession(lista.slice(0, cant), "practica", false);
}

function comenzarSimulacro() {
  const qs = preguntasFiltradas();
  // Mismo aviso que en práctica: el simulacro tampoco sale sin preguntas.
  if (!qs.length) {
    toast("Sin preguntas con esos filtros. Pulsa Todos o quita Solo débiles / Solo marcadas.");
    return;
  }
  const lista = shuffle(qs).slice(0, Math.min(10, qs.length));
  startSession(lista, "simulacro", true);
}

function startContrarreloj() {
  // El desarrollo se autoevalúa sin prisa: se excluye del modo contrarreloj.
  const lista = shuffle(track.banco.filter(q => q.tipo !== "desarrollo")).slice(0, 10);
  if (!lista.length) return;
  startSession(lista, "contrarreloj", false);
}

function startSupervivencia() {
  if (!track.banco.length) return;
  startSession(shuffle(track.banco), "supervivencia", false);
}

// ===== Misiones por tema (spec 003): mapa secuencial con estrellas =====

function misionesDeMateria() {
  return track.materia ? persistencia.misiones(track.materia.id) : {};
}

function irMisiones() {
  clearTimer();
  clearTimerPregunta();
  sesiones.limpiar();
  show("misiones");
  renderMisiones();
}

function renderMisiones() {
  const temas = [...new Set(track.banco.map(q => q.tema))];
  pintarMisiones(estadoMisiones(temas, misionesDeMateria()));
}

function iniciarMision(tema) {
  const lista = sinDiagramasEnTactil(track.banco.filter(q => q.tema === tema));
  if (!lista.length) return;
  const s = startSession(priorizar(lista).slice(0, Math.min(10, lista.length)), "mision", false);
  if (s) s.misionTema = tema;
}

// ===== Escenarios multi-paso (spec 003): decidir → consecuencias → final con rating =====

function startEscenarios() {
  show("escenarios");
  pintarListaEscenarios((track.materia && track.materia.escenarios) || [], persistencia.escenarios());
}

function jugarEscenario(id) {
  const e = ((track.materia && track.materia.escenarios) || []).find(x => x.id === id);
  if (!e) return;
  escenarioActual = e;
  escenarioEstado = iniciarEscenario(e);
  $("escenario-titulo").textContent = e.titulo;
  pintarEscenario(e, escenarioEstado);
  show("escenario");
}

function decidirEscenario(idx) {
  if (!escenarioActual || !escenarioEstado) return;
  escenarioEstado = decidirEscenarioPaso(escenarioActual, escenarioEstado, idx);
  pintarEscenario(escenarioActual, escenarioEstado);
}

function continuarEscenario() {
  if (!escenarioActual || !escenarioEstado) return;
  escenarioEstado = continuarEscenarioPaso(escenarioActual, escenarioEstado);
  pintarEscenario(escenarioActual, escenarioEstado);
  if (!escenarioEstado.terminado) return;
  const xp = xpDeEscenario(escenarioEstado);
  if (xp) gamificacion.sumarXp(xp);
  const registros = persistencia.escenarios();
  registros[escenarioActual.id] = fusionarMejor(registros[escenarioActual.id], escenarioEstado.rating);
  persistencia.guardarEscenarios(registros);
  gamificacion.revisarLogros({ escenarioExito: escenarioEstado.rating === "exito" });
}

// ===== Casos de diagramación (spec 003, H6c) =====

let casoActual = null;
let casoEstado = null;

function startCasos() {
  show("casos");
  const casos = (track.materia && track.materia.casos) || [];
  pintarListaCasos(casos, persistencia.casos());
}

function jugarCaso(id) {
  const casos = (track.materia && track.materia.casos) || [];
  const c = casos.find(x => x.id === id);
  if (!c) return;
  casoActual = c;
  casoEstado = crearTablero(c.diagrama);
  $("caso-titulo").textContent = c.titulo;
  pintarCaso(c, casoEstado);
  show("caso");
  diagramasUI.renderDiagrama(c.diagrama, $("lienzo-caso"));
  $("caso-titulo").focus({ preventScroll: true });
}

function comprobarCaso() {
  if (!casoActual || !casoEstado) return;
  const res = evaluarDiagrama(casoActual.diagrama, casoEstado);
  // Vara deliberadamente indulgente (decisión en spec 003): el rating de casos es por
  // porcentaje (≥80 éxito) y no exige exactitud total como el quiz, para no castigar el tanteo.
  const rating = ratingDiagrama(res.correctas + res.miembrosOk, res.totalEsperado);
  const resultado = { rating, detalle: res };
  
  // Guardar resultado
  const registros = persistencia.casos();
  registros[casoActual.id] = fusionarMejor(registros[casoActual.id], rating);
  persistencia.guardarCasos(registros);
  
  // XP y logros
  const xp = rating === "exito" ? 60 : rating === "parcial" ? 25 : 0;
  if (xp) gamificacion.sumarXp(xp);
  if (rating === "exito") gamificacion.revisarLogros({ casoExito: true });
  
  pintarCaso(casoActual, casoEstado, resultado);
}

function practicarDebiles() {
  const debiles = sinDiagramasEnTactil(track.banco.filter(q => esDebil(obtenerP(q.id))));
  if (!debiles.length) return;
  startSession(shuffle(debiles).slice(0, 10), "practica", false);
}

function practicarTipo(tipo) {
  const lista = sinDiagramasEnTactil(track.banco.filter(q => q.tipo === tipo));
  if (!lista.length) return;
  startSession(priorizar(lista).slice(0, Math.min(10, lista.length)), "practica", false);
}

function practicarArrastre() {
  const lista = sinDiagramasEnTactil(track.banco.filter(q => q.tipo === "dragdrop" || q.tipo === "ordenar"));
  if (!lista.length) return;
  startSession(priorizar(lista).slice(0, Math.min(10, lista.length)), "practica", false);
}

function practicarCasos() {
  const lista = sinDiagramasEnTactil(track.banco.filter(q => q.caso));
  if (!lista.length) return;
  startSession(priorizar(lista).slice(0, Math.min(10, lista.length)), "practica", false);
}

function practicarVencidas() {
  const lista = sinDiagramasEnTactil(track.banco.filter(q => vencida(obtenerP(q.id))));
  if (!lista.length) return;
  startSession(priorizar(lista).slice(0, Math.min(10, lista.length)), "practica", false);
}

function renderTiposPanel() {
  const panel = $("tipos-panel");
  if (!panel) return;
  const conteos = {};
  track.banco.forEach(q => { conteos[q.tipo] = (conteos[q.tipo] || 0) + 1; });
  panel.innerHTML = TIPOS.filter(t => conteos[t] && (diagramasDisponibles() || t !== "diagrama")).map(t =>
    '<button class="chip" data-action="practicarTipo" data-tipo="' + t + '">' + (TIPO_LABELS[t] || t) + ' · ' + conteos[t] + '</button>'
  ).join("");
}

function next() {
  if (!sesiones.sesion) return;
  const r = sesiones.avanzar();
  if (!r.continua) {
    // La ronda cerró (game over o última): apagar el reloj antes de que siga corriendo.
    clearTimer();
    return;
  }
  quiz.renderQuestion();
  if (sesiones.sesion.modo === "contrarreloj") iniciarTimerPregunta();
}

function salir() {
  confirm.pedirConfirmacion({
    titulo: "¿Salir de la ronda?",
    mensaje: "Se pierde el avance de esta ronda. Puedes volver a empezar cuando quieras, sin prisa.",
    textoConfirmar: "Salir de la ronda"
  }).then(ok => {
    if (!ok) return;
    // Una sesión lanzada desde el mapa de etapas vuelve ahí; la práctica libre, al dashboard.
    const desdeEtapas = !!(sesiones.sesion && sesiones.sesion.lenguajeId);
    clearTimer();
    clearTimerPregunta();
    sesiones.limpiar();
    $("pause-overlay").classList.add("hidden");
    if (desdeEtapas) irLenguaje(); else goHome();
  });
}

// La trampa de foco del diálogo vive en su componente; acá solo se instala.
confirm.instalarTrampa();

function iniciarTimer(segundos) {
  const s = sesiones.sesion;
  s.restante = segundos;
  actualizarTimer();
  s.timerId = setInterval(() => {
    s.restante--;
    actualizarTimer();
    if (s.restante <= 0) {
      clearTimer();
      finalizar();
    }
  }, 1000);
}

function actualizarTimer() {
  const s = sesiones.sesion;
  const badge = $("timer-badge");
  if (!s || !badge) return;
  badge.innerHTML = icono("reloj", "icono-sm") + "<span>" + formatearTiempo(s.restante) + "</span>";
  badge.classList.toggle("timer-low", s.restante <= 60);
}

function clearTimer() {
  const s = sesiones.sesion;
  if (s && s.timerId) {
    clearInterval(s.timerId);
    s.timerId = null;
  }
}

function alternarPausa() {
  const s = sesiones.sesion;
  if (!s || s.modo !== "simulacro" || s.finalizada) return;
  s.pausado = !s.pausado;
  $("pause-overlay").classList.toggle("hidden", !s.pausado);
  $("pause-btn").innerHTML = icono(s.pausado ? "seguir" : "pausa", "icono-sm");
  if (s.pausado) {
    clearTimer();
    // El foco entra al diálogo para que el teclado no siga operando la ronda de atrás.
    const primero = $("pause-overlay").querySelector("button");
    if (primero) primero.focus();
  } else {
    if (s.restante > 0) iniciarTimer(s.restante);
    // Al cerrar, el foco vuelve al trigger de pausa (cierra el ciclo del modal).
    const trigger = $("pause-btn");
    if (trigger) trigger.focus();
  }
}

// Trampa de foco del modal de pausa (M5): Tab cicla entre sus botones y Escape
// reanuda. Mismo patrón que el diálogo de guardas de diagramas.
$("pause-overlay").addEventListener("keydown", e => {
  const s = sesiones.sesion;
  if (!s || !s.pausado) return;
  if (e.key === "Escape") {
    e.preventDefault();
    alternarPausa();
    return;
  }
  if (e.key !== "Tab") return;
  const botones = Array.from($("pause-overlay").querySelectorAll("button"));
  if (!botones.length) return;
  const idx = botones.indexOf(document.activeElement);
  if (e.shiftKey && idx <= 0) {
    e.preventDefault();
    botones[botones.length - 1].focus();
  } else if (!e.shiftKey && idx === botones.length - 1) {
    e.preventDefault();
    botones[0].focus();
  }
});

// Cierra la ronda: la orquestación (resultado, examen, misión, historial) vive en
// student/session.js; acá solo se apaga el reloj y se delega. La pantalla la pinta el
// callback `alFinalizar` que recibe el servicio.
function finalizar() {
  clearTimer();
  sesiones.finalizar();
}   

function repetirFalladas() {
  const s = sesiones.repetirFalladas();
  if (s) mostrarQuiz(s.modo, false);
}

function repetirMisma() {
  // student/session.js conserva el contexto de examen/lenguaje al repetir la ronda.
  const s = sesiones.repetirMisma();
  if (s) mostrarQuiz(s.modo, s.modo === "simulacro");
}

function guardarIntento(score, total, modo) {
  const historial = cargarHistorial();
  historial.unshift({ date: Date.now(), score, total, modo: modo || "practica" });
  persistencia.guardarHistorial(track.materia.id, historial);
}

// Wrappers que inyectan los datos persistidos al módulo de estadísticas.
function renderStats() {
  if (!track.materia) return;
  renderStatsUI({
    materia: track.materia,
    banco: track.banco,
    obtenerP,
    historial: cargarHistorial(),
    actividad: cargarActividad(),
    meta: cargarMeta(),
    onCambiarMeta: cambiarMeta
  });
}

function renderHistory() {
  renderHistoryUI(cargarHistorial(), null, persistencia.nombre());
}

// Home (materias y lenguajes): renderMaterias/renderLenguajes viven en ui/dashboard/home.js (ADR 007).

function irMaterias() {
  clearTimer();
  sesiones.limpiar();
  // Salir del track de lenguaje: que no quede activo para export/import ni para el quiz.
  track.limpiarLenguaje();
  aplicarAcento(null);
  const temaMeta = document.querySelector('meta[name="theme-color"]');
  if (temaMeta) temaMeta.setAttribute("content", "#1a1c22");
  show("materias");
    home.renderMaterias();
}

// Perfil (4 bloques): identidad local + cuenta + datos + peligro. Reúne nombre,
// sesión y gamificación y los pasa como estado explícito a la UI (ADR 001).
let cachePerfilCuenta = { disponible: false, email: null };
function datosPerfil() {
  const usuario = cuenta.estado();
  const email = usuario?.email ?? usuario?.correo ?? null;
  const cuentaEstado = !cachePerfilCuenta.disponible ? "no-disponible" : (email ? "sesion" : "invitado");
  return { nombre: persistencia.nombre(), email, cuentaEstado, perfil: gamificacion.perfil() };
}
async function irPerfil() {
  clearTimer();
  sesiones.limpiar();
  const disponible = await cuenta.disponible();
  const usuario = cuenta.estado();
  // Se cachea para repintar en sync tras cambiar el nombre sin re-preguntar a Firebase.
  cachePerfilCuenta = { disponible, email: usuario?.email ?? usuario?.correo ?? null };
  perfilUI.render(datosPerfil());
  document.title = "Tu perfil — Systematic";
  show("perfil");
  // El foco va al título (igual que auth-titulo): orienta al lector sin abrir teclados.
  $("perfil-titulo")?.focus({ preventScroll: true });
}

async function seleccionarMateria(id) {
  if (!await track.seleccionarMateria(id)) return;
  aplicarAcento(track.materia);
  persistencia.migrarLegacy(track.materia.id);
  progreso = cargarProgreso();
  config.renderConfig();
  renderMateriaUI();
  goHome();
}

// ─── Track de lenguaje (spec 011) ─────────────────────────────────────
async function seleccionarLenguaje(id) {
  if (!await track.seleccionarLenguaje(id)) return;
  // Progreso propio del lenguaje: si no se recarga, se arrastra el de la
  // materia anterior y se persiste bajo la clave equivocada.
  progreso = persistencia.progreso(track.lenguaje.id);
  apuntesUI.resetTema();
  aplicarAcento(track.lenguaje);
  // La portada del dashboard lleva los datos del track activo, también para lenguajes:
  // sin esto, el título por defecto de index.html ("Base de Datos 2") queda congelado
  // y al salir de una sesión se ve el dashboard de otra materia.
  renderMateriaUI();
  pintarLenguaje();
  show("lenguaje");
}

function pintarLenguaje() {
  if (!track.lenguaje || !track.lenguajeContenido) return;
  const nombre = $("lenguaje-nombre");
  if (nombre) nombre.textContent = track.lenguaje.nombre;
  const barra = barraDeCompetencia(track.lenguajeContenido.roadmap?.etapas || [], track.competencia);
  pintarCompetencia(barra, track.lenguaje.color);
  pintarEtapas(estadoEtapas(track.lenguajeContenido.roadmap, track.competencia), track.lenguaje);
}

function irLenguaje() {
  if (track.lenguaje && track.lenguajeContenido) {
    pintarLenguaje();
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

function renderMateriaUI() {
  document.title = track.materia.nombre + " — Systematic";
  const nombre = $("materia-nombre");
  const iconoSpan = $("materia-icono");
  if (nombre) nombre.textContent = track.materia.nombre;
  if (iconoSpan) {
    iconoSpan.innerHTML = icono(track.materia.icono);
  }
  const sub = $("portada-sub");
  if (sub) sub.textContent = track.materia.descripcion || "";
  const temaMeta = document.querySelector('meta[name="theme-color"]');
  if (temaMeta) temaMeta.setAttribute("content", track.materia.color);
  const gloTitulo = $("glosario-titulo");
  if (gloTitulo) gloTitulo.textContent = "Glosario";
}


function aplicarAcento(materia) {
  const root = document.documentElement;
  if (!materia) {
    root.style.removeProperty("--materia-accent");
    root.style.removeProperty("--materia-accent-texto");
    return;
  }
  const a = acentoDe(materia);
  root.style.setProperty("--materia-accent", a.color);
  root.style.setProperty("--materia-accent-texto", a.texto);
}



// Pantalla de apuntes: vive en ui/aprendizaje/apuntes.js (crearApuntesUI, ADR 007).

function goHome() {
  // El dashboard refleja siempre el track activo: al volver de una sesión (o al salir de
  // ella con "Salir") la portada y el tema deben ser del track vigente, no de la última
  // materia visitada.
  if (track.materia) renderMateriaUI();
  // En un track de lenguaje el dashboard es la práctica libre: dejar a mano el acceso al
  // mapa de etapas (en una materia no aplica y se oculta).
  const btnEtapas = $("btn-etapas");
  if (btnEtapas) btnEtapas.classList.toggle("hidden", !track.lenguaje);
  show("start");
  renderStats();
  renderHistory();
  renderTiposPanel();
  glosarioUI.renderTip();
}

// Módulos de render por pantalla (ADR 001): reciben estado explícito y callbacks.
const quiz = crearQuizUI({ ctx, obtenerP, registrarRespuesta, toggleMarked });
const resultados = crearResultadosUI({ ctx, registrarRespuesta });
const estudio = crearEstudioUI({ ctx, obtenerP, toggleMarked, mostrarPantalla: show });
const glosarioUI = crearGlosarioUI({ ctx, mostrarPantalla: show });
const flashcards = crearFlashcardsUI({ ctx, priorizar, registrarRespuesta, mostrarPantalla: show });
const diagramasUI = crearDiagramasUI({
  obtenerItem: () => casoActual && casoActual.diagrama,
  obtenerEstado: () => casoEstado,
  guardarEstado: estado => { casoEstado = estado; },
  areaId: "lienzo-caso",
  accionComprobar: "comprobarCaso",
  accionCancelarTipo: "cancelarDiagramaTipoCaso",
  mostrarPregunta: false
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

// Onboarding local (primera impresión sin cuenta): pide el nombre una sola vez.
function mostrarOnboardingLocal() {
  show("onboarding");
  const entrada = $("onboarding-nombre");
  if (entrada) entrada.focus();
}

function mostrarMaterias() {
    home.renderMaterias();
  show("materias");
}

// Ofrece traer el respaldo cuando el navegador todavía no tiene estado local. Devuelve true
// si restauró (la página se recarga y el arranque termina ahí).
async function ofrecerRestauracion(usuario) {
  if (!usuario || persistencia.nombre() || persistencia.onboardingHecho()) return false;
  const r = await nube.bajar(usuario.uid);
  if (!r.ok) return false; // sin respaldo (o sin conexión): se entra en modo local
  const fecha = fechaSnapshot(r.datos);
  const cuando = fecha ? fecha.toLocaleString() : "una fecha desconocida";
  if (!confirm("Encontramos un respaldo del " + cuando + ". ¿Restaurar tu progreso en este dispositivo?")) return false;
  aplicarSnapshot(r.datos, persistencia);
  location.reload();
  return true;
}

// Entrada común tras iniciar sesión o registrarse: pinta el panel, ofrece restaurar si hay
// respaldo y entra al home. La cuenta ya da identidad: no se repite el onboarding por nombre.
async function entrarConCuenta(usuario) {
  cuentaUI.pintar(usuario);
  if (await ofrecerRestauracion(usuario)) return;
  if (!persistencia.onboardingHecho()) persistencia.guardarOnboardingHecho();
  mostrarMaterias();
}

// Cuenta (ADR 008): decide la pantalla inicial. Sin claves de Firebase la app queda 100%
// local (onboarding por nombre); con claves, el primer contacto es el acceso y la sesión se
// restaura al recargar. El estado de cuenta vive en el Perfil (irPerfil).
(async () => {
  const disponible = await cuenta.disponible();
  cachePerfilCuenta.disponible = disponible;

  if (!disponible) {
    if (!persistencia.nombre() && !persistencia.onboardingHecho()) mostrarOnboardingLocal();
    else mostrarMaterias();
    return;
  }

  await cuenta.iniciar();
  const usuario = cuenta.estado();
  if (usuario) {
    await entrarConCuenta(usuario);
    return;
  }

  // Navegador nuevo sin sesión: primero el acceso. Quien ya usó la app como invitado sigue
  // entrando directo a sus materias.
  if (persistencia.onboardingHecho() || persistencia.nombre()) {
    mostrarMaterias();
    return;
  }
  cuentaUI.pintar(null);
  auth.renderLogin();
  show("cuenta");
})();

// Registro único de acciones (ADR 002): los elementos declaran data-action con el nombre
// de la función que ejecutan y sus parámetros en data-*; un único listener delegado de
// click los resuelve desde este mapa. No se publica nada en window.
const ACCIONES = {
  guardarNombreOnboarding: () => {
    const entrada = $("onboarding-nombre");
    const valor = entrada ? entrada.value : "";
    if (!valor.trim()) { if (entrada) entrada.focus(); return; }
    persistencia.guardarNombre(valor);
    persistencia.guardarOnboardingHecho();
    home.renderMaterias();
    show("materias");
    toast(icono("nivel", "icono-sm") + saludoSegunHora(persistencia.nombre()) + ". ¡Vamos a estudiar!");
  },
  saltarOnboarding: () => {
    persistencia.guardarOnboardingHecho();
    home.renderMaterias();
    show("materias");
  },
  toggleNombreEditor: () => {
    const editor = $("nombre-editor");
    if (!editor) return;
    const entrada = $("nombre-input");
    entrada.value = persistencia.nombre();
    editor.classList.toggle("hidden");
    if (!editor.classList.contains("hidden")) entrada.focus();
  },
  guardarNombreAjustes: () => {
    const entrada = $("nombre-input");
    if (!entrada) return;
    persistencia.guardarNombre(entrada.value);
    persistencia.guardarOnboardingHecho();
    $("nombre-editor").classList.add("hidden");
    // El Perfil muestra el mismo nombre: si está a la vista, se repinta en el acto.
    if (!$("screen-perfil")?.classList.contains("hidden")) perfilUI.render(datosPerfil());
    toast(icono("check", "icono-sm") + saludoSegunHora(persistencia.nombre()) + (persistencia.nombre() ? ", " + persistencia.nombre() : ""));
  },
  actualizarResumen: () => config.actualizarResumen(),
  alternarPausa: () => alternarPausa(),
  cancelarConfirm: () => confirm.cerrarConfirm(false),
  confirmarConfirm: () => confirm.cerrarConfirm(true),
  autoevaluarDev: el => quiz.autoevaluarDev(el.dataset.ok === "true"),
  autoevaluarResultado: el => resultados.autoevaluarResultado(el.dataset.id, el.dataset.ok === "true"),
  cambiarApunteTema: el => apuntesUI.cambiarApunteTema(el.dataset.tema),
  cambiarEstudioTipo: el => estudio.cambiarEstudioTipo(el.dataset.tipo),
  cambiarGlosarioCat: el => glosarioUI.cambiarGlosarioCat(el.dataset.id),
  clearHistory: () => clearHistory(),
  clickMatchDer: el => quiz.clickMatchDer(parseInt(el.dataset.idx, 10)),
  clickMatchIzq: el => quiz.clickMatchIzq(parseInt(el.dataset.i, 10)),
  comenzarPractica: () => comenzarPractica(),
  comenzarSimulacro: () => comenzarSimulacro(),
  comprobarMulti: () => quiz.comprobarMulti(),
  comprobarOrden: () => quiz.comprobarOrden(),
  exportarDatos: () => exportarDatos(),
  goHome: () => goHome(),
  importarArchivo: () => $("import-file").click(),
  irConfig: () => config.irConfig(),
  irMaterias: () => irMaterias(),
  irPerfil: () => irPerfil(),
  iniciarMision: el => iniciarMision(el.dataset.tema),
  irMisiones: () => irMisiones(),
  moverBloque: el => quiz.moverBloque(parseInt(el.dataset.i, 10), parseInt(el.dataset.dir, 10)),
  next: () => next(),
  pintarResultados: el => resultados.pintarResultados(el.dataset.verTodas === "true"),
  practicarArrastre: () => practicarArrastre(),
  practicarCasos: () => practicarCasos(),
  practicarDebiles: () => practicarDebiles(),
  practicarTipo: el => practicarTipo(el.dataset.tipo),
  practicarVencidas: () => practicarVencidas(),
  repetirFalladas: () => repetirFalladas(),
  repetirMisma: () => repetirMisma(),
  resetProgreso: () => resetProgreso(),
  responderFlash: el => flashcards.responderFlash(el.dataset.ok === "true"),
  revelarSolucion: () => quiz.revelarSolucion(),
  saltarFlash: () => flashcards.saltarFlash(),
  saltarPregunta: () => { quiz.saltarPregunta(); if (sesiones.sesion && sesiones.sesion.modo === "contrarreloj") clearTimerPregunta(); },
  startContrarreloj: () => startContrarreloj(),
  startSupervivencia: () => startSupervivencia(),
  salir: () => salir(),
    seleccionarMateria: el => seleccionarMateria(el.dataset.materia),
    seleccionarLenguaje: el => seleccionarLenguaje(el.dataset.lenguaje),
    practicarLeccion: el => practicarLeccion(el.dataset.etapa, el.dataset.leccion),
    rendirExamen: el => rendirExamen(el.dataset.etapa),
    irLenguaje: () => irLenguaje(),
  startApuntes: () => apuntesUI.startApuntes(),
  startEscenarios: () => startEscenarios(),
  jugarEscenario: el => jugarEscenario(el.dataset.id),
  decidirEscenario: el => decidirEscenario(parseInt(el.dataset.idx, 10)),
  continuarEscenario: () => continuarEscenario(),
  startCasos: () => startCasos(),
  jugarCaso: el => jugarCaso(el.dataset.id),
  comprobarCaso: () => comprobarCaso(),
  cancelarDiagramaTipoCaso: () => diagramasUI.cancelarSeleccion(),
  comprobarDiagrama: () => quiz.comprobarDiagrama(),
  cancelarDiagramaTipo: () => quiz.cancelarDiagramaTipo(),
  startFlashcards: () => flashcards.startFlashcards(),
  startGlosario: () => glosarioUI.startGlosario(),
  startStudy: () => estudio.startStudy(),
  toggleFiltro: el => toggleFiltro(el.dataset.clave, el.dataset.valor),
  toggleFiltroTodos: el => toggleFiltroTodos(el.dataset.clave, el.dataset.activar === "true"),
  toggleMarcadaActual: () => quiz.toggleMarcadaActual(),
  toggleMarcadaEstudio: el => estudio.toggleMarcadaEstudio(el.dataset.id),
  toggleMulti: el => quiz.toggleMulti(parseInt(el.dataset.idx, 10)),
  toggleStudy: el => estudio.toggleStudy(el),
  usarTodas: () => config.usarTodas(),
  voltearFlash: () => flashcards.voltearFlash(),
  // ---- Cuenta y nube (ADR 008) ----
  irCuenta: () => {
    const usuario = cuenta.estado();
    cuentaUI.pintar(usuario);
    if (!usuario) auth.renderLogin();
    show("cuenta");
  },
  salirCuenta: async () => {
    cuentaUI.procesando(true);
    const r = await cuenta.salir();
    cuentaUI.procesando(false);
    if (!r.ok) { cuentaUI.aviso(r.mensaje, false); return; }
    cuentaUI.pintar(null);
    auth.renderLogin();
    // Salir solo se ofrece desde el Perfil: al cerrar sesión se vuelve a materias.
    cachePerfilCuenta.email = null;
    irMaterias();
  },
  subirNube: async () => {
    const usuario = cuenta.estado();
    if (!usuario) return;
    cuentaUI.procesando(true);
    const r = await nube.subir(usuario.uid);
    cuentaUI.procesando(false);
    cuentaUI.aviso(r.ok ? "Progreso subido a la nube." : r.mensaje, r.ok);
  },
  restaurarNube: async () => {
    const usuario = cuenta.estado();
    if (!usuario) return;
    cuentaUI.procesando(true);
    const r = await nube.bajar(usuario.uid);
    cuentaUI.procesando(false);
    if (!r.ok) { cuentaUI.aviso(r.mensaje, false); return; }
    // ADR 008: restaurar pisa el progreso local y por eso se pregunta antes, con la fecha.
    const fecha = fechaSnapshot(r.datos);
    const cuando = fecha ? fecha.toLocaleString() : "una fecha desconocida";
    if (!confirm("El respaldo es del " + cuando + ". Se reemplazará tu progreso en este dispositivo. ¿Continuar?")) return;
    aplicarSnapshot(r.datos, persistencia);
    location.reload();
  }
};

document.addEventListener("click", event => {
  const el = event.target.closest("[data-action]");
  if (!el) return;
  const accion = ACCIONES[el.dataset.action];
  if (accion) accion(el);
});

// Listeners puntuales sobre elementos estáticos (eventos change/input, fuera del alcance
// de la delegación de click).
["cfg-priorizar", "cfg-solo-debiles", "cfg-solo-marcadas"].forEach(id =>
  $(id).addEventListener("change", () => config.actualizarResumen())
);
$("import-file").addEventListener("change", e => importarDatos(e.target));
$("study-search").addEventListener("input", e => estudio.renderStudy(e.target.value));
$("apuntes-search").addEventListener("input", e => apuntesUI.renderApuntes(e.target.value));
$("glosario-search").addEventListener("input", e => glosarioUI.renderGlosario(e.target.value));

