import { MATERIAS, getMateria, getLenguaje, cargarContenido, acentoDe } from "./core/index.js";
import { barraDeCompetencia, registrarExamen } from "./core/index.js";
import { estadoEtapas, pintarCompetencia, pintarEtapas } from "./ui/aprendizaje/lenguaje.js";
import { crearHome } from "./ui/dashboard/home.js";
import { crearConfig } from "./ui/dashboard/config.js";
import { crearMezclador, storeLocalStorage } from "./core/index.js";
import {
  obtenerEntrada, aplicarRespuesta, esDebil, vencida, hoyISO
} from "./core/index.js";
import { shuffle, ordenarPrioridad, prepararItem, filtrarDiagramas } from "./core/index.js";
import { XP_EVENTOS, xpDeRespuesta, multiplicadorSupervivencia, xpContrarreloj, estrellasDeMision } from "./core/index.js";
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
import { crearPersistencia } from "./student/persistencia.js";
import { crearGamificacion } from "./student/gamificacion.js";
import { crearTrack } from "./student/track.js";
import { fusionarMejor, fusionarMision } from "./student/registros.js";


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
let session = null;
let escenarioActual = null;
let escenarioEstado = null;

const $ = id => document.getElementById(id);

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
  alCambiarPerfil: () => home.renderPerfil()
});

// Renderers del home (materias, lenguajes y perfil) extraídos a ui/dashboard (ADR 007).
const home = crearHome({ persistencia, gamificacion });

// Track activo (materia o lenguaje): estado, filtros y carga de contenido (student/track.js).
const track = crearTrack({
  persistencia, TIPOS, esDebil,
  obtenerP, filtrarDiagramas, diagramasDisponibles
});

// Estado explícito que se inyecta a los módulos de src/ui/ (lectura vía getters,
// porque estas variables se reasignan al cambiar de materia o de sesión).
const ctx = {
  get session() { return session; },
  get banco() { return track.banco; },
  get glosario() { return track.glosario; },
  get materia() { return track.materia; }
};

// Config de práctica y pantalla de apuntes (extraídas de app.js, ADR 007).
const config = crearConfig({
  getFiltros: () => track.filtros,
  valoresDe: track.valoresDe, contarPor: track.contarPor,
  leerOpciones, preguntasFiltradas,
  diagramasDisponibles, TIPO_LABELS, DIF_LABELS,
  mostrarPantalla: show
});
const apuntesUI = crearApuntesUI({ getMateria: () => track.materia, mostrarPantalla: show });

function show(screen) {
    ["onboarding", "materias", "start", "config", "quiz", "results", "study", "apuntes", "misiones", "escenarios", "escenario", "casos", "caso", "flashcards", "glosario", "lenguaje"].forEach(s =>
    $("screen-" + s).classList.toggle("hidden", s !== screen)
  );
  animar($("screen-" + screen));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

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

function registrarRespuesta(id, ok) {
  progreso[id] = aplicarRespuesta(obtenerP(id), ok);
  guardarProgreso();
  registrarActividad();
  let ganado = xpDeRespuesta(ok, progreso[id]);
  if (session && session.modo === "contrarreloj") {
    clearTimerPregunta();
    if (ok) ganado = xpContrarreloj(true, Date.now() - session.preguntaInicio, ganado);
  }
  if (session && session.modo === "supervivencia") {
    if (ok) {
      session.combo++;
      session.mejorCombo = Math.max(session.mejorCombo, session.combo);
      ganado = Math.round(ganado * multiplicadorSupervivencia(session.combo));
    } else {
      session.vidas--;
      session.combo = 0;
      if (session.vidas <= 0) session.gameOver = true;
      quiz.pintarVidas();
    }
  }
  if (ganado) gamificacion.sumarXp(ganado);
  const metaCumplida = (cargarActividad()[hoyISO()] || 0) >= cargarMeta();
  if (metaCumplida) gamificacion.xpEventoUnico("meta-" + hoyISO(), XP_EVENTOS.metaDiaria);
  gamificacion.revisarLogros({ metaCumplida });
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
  persistencia.borrarHistorial(track.materia.id);
  renderHistory();
  renderStats();
}

function resetProgreso() {
  if (!confirm("¿Borrar todo el progreso de esta materia? Se eliminan aciertos, fallos, marcas, racha, historial de intentos y misiones. Tu XP y logros globales se conservan.")) return;
  progreso = {};
  persistencia.reiniciarMateria(track.materia.id);
  renderStats();
  renderHistory();
}

function exportarDatos() {
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
          alert("Este archivo es de un lenguaje. Entrá al lenguaje para importarlo.");
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
        alert("Este archivo es de una materia. Entrá a la materia para importarlo.");
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
// Perfil y contador de XP: renderPerfil vive en ui/dashboard/home.js (ADR 007).

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

// Timer por pregunta del modo Contrarreloj (spec 003): 30s o fallo.
function iniciarTimerPregunta() {
  if (!session || session.modo !== "contrarreloj") return;
  session.tRestante = session.tPorPregunta;
  session.preguntaInicio = Date.now();
  actualizarTimerPregunta();
  session.timerPreguntaId = setInterval(() => {
    session.tRestante--;
    actualizarTimerPregunta();
    if (session.tRestante <= 0) {
      clearTimerPregunta();
      quiz.expirarPregunta();
    }
  }, 1000);
}

function actualizarTimerPregunta() {
  const badge = $("timer-pregunta");
  if (!badge) return;
  badge.innerHTML = icono("rayo", "icono-sm") + "<span>" + Math.max(0, session.tRestante) + "s</span>";
  badge.classList.toggle("timer-low", session.tRestante <= 10);
}

function clearTimerPregunta() {
  if (session && session.timerPreguntaId) {
    clearInterval(session.timerPreguntaId);
    session.timerPreguntaId = null;
  }
}

function startSession(items, modo, conTimer) {
  clearTimer();
  clearTimerPregunta();
  if (!items || !items.length) return;
  const preparadas = items.map(it => prepararItem(it, true));
  session = { items: preparadas, idx: 0, answers: {}, modo, inicio: Date.now(), finalizada: false, pausado: false };
  if (modo === "contrarreloj") { session.tPorPregunta = 30; session.tRestante = 30; }
  if (modo === "supervivencia") { session.vidas = 3; session.combo = 0; session.mejorCombo = 0; }
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
  if (!qs.length) return;
  const cant = Math.min(parseInt($("cfg-cantidad").value, 10) || qs.length, qs.length);
  const lista = track.filtros.priorizar ? priorizar(qs) : shuffle(qs);
  startSession(lista.slice(0, cant), "practica", false);
}

function comenzarSimulacro() {
  const qs = preguntasFiltradas();
  if (!qs.length) return;
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
  session = null;
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
  startSession(priorizar(lista).slice(0, Math.min(10, lista.length)), "mision", false);
  session.misionTema = tema;
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
  if (!session) return;
  const item = session.items[session.idx];
  if (item.tipo === "desarrollo" && session.modo === "simulacro" && !session.answers[session.idx]) {
    const ta = $("dev-texto");
    const texto = ta ? ta.value : "";
    session.answers[session.idx] = { ok: null, selected: texto || "(sin escribir)", expected: item.solucion, tipo: "desarrollo", texto };
  }
  if (session.gameOver || session.idx >= session.items.length - 1) {
    finalizar();
    return;
  }
  session.idx++;
  quiz.renderQuestion();
  if (session.modo === "contrarreloj") iniciarTimerPregunta();
}

function salir() {
  if (!confirm("¿Salir? Se perderá el avance de esta ronda.")) return;
  clearTimer();
  clearTimerPregunta();
  session = null;
  $("pause-overlay").classList.add("hidden");
  goHome();
}

function iniciarTimer(segundos) {
  session.restante = segundos;
  actualizarTimer();
  session.timerId = setInterval(() => {
    session.restante--;
    actualizarTimer();
    if (session.restante <= 0) {
      clearTimer();
      finalizar();
    }
  }, 1000);
}

function actualizarTimer() {
  const m = Math.floor(session.restante / 60);
  const s = session.restante % 60;
  const badge = $("timer-badge");
  badge.innerHTML = icono("reloj", "icono-sm") + "<span>" + m + ":" + String(s).padStart(2, "0") + "</span>";
  badge.classList.toggle("timer-low", session.restante <= 60);
}

function clearTimer() {
  if (session && session.timerId) {
    clearInterval(session.timerId);
    session.timerId = null;
  }
}

function alternarPausa() {
  if (!session || session.modo !== "simulacro" || session.finalizada) return;
  session.pausado = !session.pausado;
  $("pause-overlay").classList.toggle("hidden", !session.pausado);
  $("pause-btn").innerHTML = icono(session.pausado ? "seguir" : "pausa", "icono-sm");
  if (session.pausado) {
    clearTimer();
  } else if (session.restante > 0) {
    iniciarTimer(session.restante);
  }
}

function finalizar() {
  clearTimer();
  if (!session) return;
  session.finalizada = true;
  const items = session.items;
  const calificables = items.filter(it => it.tipo !== "desarrollo");
  let aciertos = 0;
  const porTema = {};
  calificables.forEach(item => {
    const i = items.indexOf(item);
    const a = session.answers[i];
    porTema[item.tema] = porTema[item.tema] || { ok: 0, total: 0 };
    porTema[item.tema].total++;
    if (a && a.ok) {
      aciertos++;
      porTema[item.tema].ok++;
    }
  });
  const totalCal = calificables.length || 1;
  const pct = Math.round((aciertos / totalCal) * 100);
  const falladas = calificables.filter(item => {
    const a = session.answers[items.indexOf(item)];
    return !(a && a.ok);
  });
  const desarrollos = items.filter(it => it.tipo === "desarrollo");
  const segundos = Math.max(0, Math.round((Date.now() - session.inicio) / 1000));
  const tiempo = Math.floor(segundos / 60) + ":" + String(segundos % 60).padStart(2, "0");
  session.resultado = { items, calificables, aciertos, totalCal, pct, porTema, falladas, desarrollos, tiempo };
  // Una sesión de lenguaje (prueba o examen) vuelve al mapa de etapas, no al inicio de materia.
  if (session.lenguajeId) session.resultado.lenguaje = true;
  // Examen de un track de lenguaje: registra el aprobado (con versión) y mueve la barra.
  if (session.modo === "examen" && session.examenEtapa && track.lenguaje) {
    const nuevo = registrarExamen({ etapa: session.examenEtapa, resultados: track.competencia, aciertos });
    track.setCompetencia(nuevo);
    persistencia.guardarCompetencia(track.lenguaje.id, nuevo);
    const aprobado = nuevo[session.examenEtapa.id].aprobado;
    session.resultado.examen = { aprobado, etapa: session.examenEtapa };
    toast(aprobado
      ? conNombre("¡Examen aprobado, @! ") + session.examenEtapa.nombre
      : "Aún no: " + pct + "% en " + session.examenEtapa.nombre + ". Repasá y volvé a intentar.");
  }
  if (session.modo === "supervivencia") {
    session.resultado.supervivencia = { jugadas: Object.keys(session.answers).length, mejorCombo: session.mejorCombo || 0 };
  }
  if (session.modo === "mision" && session.misionTema) {
    const mapa = misionesDeMateria();
    const nuevas = estrellasDeMision(pct);
    const merge = fusionarMision(mapa[session.misionTema], pct, nuevas);
    if (merge.cambio) {
      mapa[session.misionTema] = merge.registro;
      persistencia.guardarMisiones(track.materia.id, mapa);
      if (merge.mejoraEstrellas) gamificacion.sumarXp(merge.estrellasGanadas * XP_EVENTOS.estrella);
    }
    gamificacion.revisarLogros({ misionPerfecta: nuevas === 3, estrellasTotales: gamificacion.estrellasTotales() });
  }
  guardarIntento(aciertos, totalCal, session.modo);
  gamificacion.revisarLogros({
    simulacroPerfecto: totalCal > 0 && pct === 100 && session.modo === "simulacro"
  });
  resultados.pintarResultados(false);
  show("results");
}

function repetirFalladas() {
  if (session && session.resultado && session.resultado.falladas.length) {
    startSession(session.resultado.falladas, "practica", false);
  }
}

function repetirMisma() {
  // Conserva el contexto de examen/lenguaje para que "Repetir ronda" siga registrando competencia.
  const examenEtapa = session.examenEtapa;
  const lenguajeId = session.lenguajeId;
  startSession(session.items, session.modo, session.modo === "simulacro");
  if (examenEtapa) session.examenEtapa = examenEtapa;
  if (lenguajeId) session.lenguajeId = lenguajeId;
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
  session = null;
  // Salir del track de lenguaje: que no quede activo para export/import ni para el quiz.
  track.limpiarLenguaje();
  aplicarAcento(null);
  const temaMeta = document.querySelector('meta[name="theme-color"]');
  if (temaMeta) temaMeta.setAttribute("content", "#1a1c22");
  show("materias");
  home.renderMaterias();
  home.renderPerfil();
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
  if (items.length) startSession(items, "practica", false);
  if (session) session.lenguajeId = track.lenguaje.id;
}

// Examen sumativo: al terminar, finalizar() registra el resultado y mueve la barra.
function rendirExamen(etapaId) {
  const etapa = track.lenguajeContenido?.roadmap?.etapas.find(e => e.id === etapaId);
  if (!etapa) return;
  const items = track.itemsDeIds(etapa.examen.preguntas);
  if (!items.length) return;
  startSession(items, "examen", false);
  session.examenEtapa = etapa;
  session.lenguajeId = track.lenguaje.id;
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
  if ($("screen-quiz").classList.contains("hidden") || !session) return;
  const t = e.target;
  if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
  const item = session.items[session.idx];
  const answered = !!session.answers[session.idx];
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
  if (document.hidden && session && session.modo === "simulacro" && !session.pausado && !session.finalizada) {
    alternarPausa();
  }
});

// Los datos legacy (quizBD2.*) pertenecen a la app anterior de BD2: se migran a su
// namespace al arrancar, antes de que el usuario seleccione materia.
persistencia.migrarLegacy("bd2");
// Onboarding (primera impresión): si nunca dijimos quién es, la pantalla de bienvenida
// pide el nombre. Con flag o nombre guardado se entra directo al home con saludo.
if (!persistencia.nombre() && !persistencia.onboardingHecho()) {
  show("onboarding");
  const entrada = $("onboarding-nombre");
  if (entrada) entrada.focus();
} else {
  home.renderMaterias();
  home.renderPerfil();
  show("materias");
}

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
    home.renderPerfil();
    show("materias");
    toast(icono("nivel", "icono-sm") + saludoSegunHora(persistencia.nombre()) + ". ¡Vamos a estudiar!");
  },
  saltarOnboarding: () => {
    persistencia.guardarOnboardingHecho();
    home.renderMaterias();
    home.renderPerfil();
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
    home.renderPerfil();
    toast(icono("check", "icono-sm") + saludoSegunHora(persistencia.nombre()) + (persistencia.nombre() ? ", " + persistencia.nombre() : ""));
  },
  actualizarResumen: () => config.actualizarResumen(),
  alternarPausa: () => alternarPausa(),
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
  saltarPregunta: () => { quiz.saltarPregunta(); if (session && session.modo === "contrarreloj") clearTimerPregunta(); },
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
  voltearFlash: () => flashcards.voltearFlash()
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

