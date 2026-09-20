import { MATERIAS, getMateria } from "./core/materias.js";
import {
  obtenerEntrada, aplicarRespuesta, esDebil, vencida, hoyISO
} from "./core/progreso.js";
import { shuffle, ordenarPrioridad, prepararItem } from "./core/sesiones.js";
import { XP_EVENTOS, xpDeRespuesta, multiplicadorSupervivencia, xpContrarreloj, estrellasDeMision } from "./core/gamificacion.js";
import { apunteAHTML, filtrarApuntes } from "./ui/pantallas/apuntes.js";
import { TIPOS, TIPO_LABELS, DIF_LABELS, escapar, animar } from "./ui/helpers.js";
import { crearQuizUI } from "./ui/pantallas/quiz.js";
import { crearResultadosUI } from "./ui/pantallas/resultados.js";
import { renderHistory as renderHistoryUI, renderStats as renderStatsUI } from "./ui/pantallas/stats.js";
import { crearEstudioUI } from "./ui/pantallas/estudio.js";
import { crearGlosarioUI } from "./ui/pantallas/glosario.js";
import { crearFlashcardsUI } from "./ui/pantallas/flashcards.js";
import { estadoMisiones, pintarMisiones } from "./ui/pantallas/misiones.js";
import { iniciarEscenario, decidir as decidirEscenarioPaso, continuar as continuarEscenarioPaso, xpDeEscenario } from "./core/escenarios.js";
import { pintarListaEscenarios, pintarEscenario } from "./ui/pantallas/escenarios.js";
import { crearTablero, evaluarDiagrama, ratingDiagrama } from "./core/diagramas.js";
import { crearDiagramasUI } from "./ui/diagramas.js";
import { pintarListaCasos, pintarCaso } from "./ui/casos.js";
import { icono } from "./ui/iconos.js";
import { estadoVacio } from "./ui/componentes/estados.js";
import { tarjeta } from "./ui/componentes/tarjetas.js";
import { toast, confeti } from "./ui/componentes/avisos.js";
import { crearPersistencia } from "./student/persistencia.js";
import { crearGamificacion } from "./student/gamificacion.js";
import { fusionarMejor, fusionarMision } from "./student/registros.js";

// Hidrata los iconos estáticos del shell (spec 005); los renders dinámicos usan icono() directamente.
function pintarIconos(raiz) {
  (raiz || document).querySelectorAll("[data-icono]").forEach(el => {
    el.outerHTML = icono(el.dataset.icono, el.getAttribute("class") || "");
  });
}
pintarIconos();

// Materia activa y datos asociados (se definen al seleccionar materia en el home).
let materia = null;
let banco = [];
let glosario = { categorias: [], terminos: [], tips: [] };

let progreso = {};
let session = null;
let filtros = { parciales: new Set(), temas: new Set(), dificultades: new Set(), tipos: new Set(), soloDebiles: false, soloMarcadas: false, priorizar: true };
let apunteTema = "todos";
let escenarioActual = null;
let escenarioEstado = null;

const $ = id => document.getElementById(id);

// Servicios del recorrido del estudiante (spec 006): persistencia y gamificación con
// dependencias inyectadas. La presentación (toast/confeti/perfil) entra por callbacks.
const persistencia = crearPersistencia(localStorage);
const gamificacion = crearGamificacion({
  persistencia,
  materias: MATERIAS,
  alSubirNivel: nivel => {
    toast(icono("nivel", "icono-sm") + " ¡Nivel " + nivel + " alcanzado!");
    confeti();
  },
  alLogro: l => toast(icono(l.icono, "icono-sm") + " Logro: " + l.nombre + " (+" + XP_EVENTOS.logro + " XP)"),
  alCambiarPerfil: () => renderPerfil()
});

// Estado explícito que se inyecta a los módulos de src/ui/ (lectura vía getters,
// porque estas variables se reasignan al cambiar de materia o de sesión).
const ctx = {
  get session() { return session; },
  get banco() { return banco; },
  get glosario() { return glosario; },
  get materia() { return materia; }
};

function show(screen) {
    ["materias", "start", "config", "quiz", "results", "study", "apuntes", "misiones", "escenarios", "escenario", "casos", "caso", "flashcards", "glosario", "repaso"].forEach(s =>
    $("screen-" + s).classList.toggle("hidden", s !== screen)
  );
  animar($("screen-" + screen));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cargarProgreso() {
  return persistencia.progreso(materia.id);
}

function guardarProgreso() {
  persistencia.guardarProgreso(materia.id, progreso);
}

function obtenerP(id) {
  return obtenerEntrada(progreso, id);
}

// Prioriza según el progreso de la materia activa (débiles → vencidas → nuevas).
const priorizar = lista => ordenarPrioridad(lista, obtenerP);

function cargarActividad() {
  return persistencia.actividad(materia.id);
}

function registrarActividad() {
  const a = cargarActividad();
  const h = hoyISO();
  a[h] = (a[h] || 0) + 1;
  persistencia.guardarActividad(materia.id, a);
}

function cargarMeta() {
  return persistencia.meta(materia.id);
}

function cambiarMeta(valor) {
  persistencia.guardarMeta(materia.id, valor);
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
  return persistencia.historial(materia.id);
}

function clearHistory() {
  persistencia.borrarHistorial(materia.id);
  renderHistory();
  renderStats();
}

function resetProgreso() {
  if (!confirm("¿Borrar todo el progreso (aciertos, fallos, marcas y racha)?")) return;
  progreso = {};
  persistencia.borrarProgresoYActividad(materia.id);
  renderStats();
  renderHistory();
}

function exportarDatos() {
  const datos = {
    app: "systematic",
    version: 2,
    materia: materia.id,
    exportado: new Date().toISOString(),
    progreso: cargarProgreso(),
    historial: cargarHistorial(),
    actividad: cargarActividad(),
    meta: cargarMeta()
  };
  const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "systematic-" + materia.id + "-" + hoyISO() + ".json";
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
      const esActual = !!datos && datos.app === "systematic" && typeof datos.progreso === "object";
      if (!esLegacy && !esActual) throw new Error("formato");
      if (esActual && datos.materia && datos.materia !== materia.id &&
          !confirm("El archivo es de otra materia («" + datos.materia + "»). ¿Importarlo igual en «" + materia.nombre + "»?")) return;
      if (!confirm("Se reemplazará tu progreso actual con el del archivo. ¿Continuar?")) return;
      progreso = datos.progreso || {};
      persistencia.guardarProgreso(materia.id, progreso);
      if (datos.historial) persistencia.guardarHistorial(materia.id, datos.historial);
      if (datos.actividad) persistencia.guardarActividad(materia.id, datos.actividad);
      if (datos.meta) persistencia.guardarMeta(materia.id, datos.meta);
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
// Aquí solo queda la presentación: perfil, toasts y confeti.

let xpMostrado = 0;

function prefiereMenosMovimiento() {
  return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

// Contador de XP (spec 006): sube con easing; sin animación si el usuario pide menos movimiento.
function contarHasta(el, desde, hasta) {
  if (!el) return;
  if (desde === hasta || prefiereMenosMovimiento()) {
    el.textContent = hasta;
    return;
  }
  const inicio = performance.now();
  const dur = 460;
  function paso(t) {
    const k = Math.min(1, (t - inicio) / dur);
    const suave = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(desde + (hasta - desde) * suave);
    if (k < 1) requestAnimationFrame(paso);
  }
  requestAnimationFrame(paso);
}

function renderPerfil() {
  const cont = $("perfil-panel");
  if (!cont) return;
  const p = gamificacion.perfil();
  const desde = xpMostrado;
  xpMostrado = p.xp;
  cont.innerHTML =
    '<div class="perfil-card">' +
      '<div class="perfil-nivel"><span class="perfil-num">' + p.nivel + '</span><span class="perfil-etq">nivel</span></div>' +
      '<div class="perfil-datos">' +
        '<div class="text-sm"><b id="perfil-xp">' + desde + '</b> XP' + (p.faltante ? " · faltan " + p.faltante + " para el nivel " + (p.nivel + 1) : "") + '</div>' +
        '<div class="progress-track mt-2"><div class="progress-fill" style="width:' + p.pct + '%"></div></div>' +
        '<div class="perfil-mini">Racha: ' + p.racha + ' día(s) · ' + p.insignias + ' logro(s) desbloqueado(s)</div>' +
      '</div>' +
    '</div>';
  contarHasta($("perfil-xp"), desde, p.xp);
}

function inicializarFiltros() {
  filtros.parciales = new Set(banco.map(q => q.parcial));
  filtros.temas = new Set(banco.map(q => q.tema));
  filtros.dificultades = new Set(["facil", "media", "dificil"]);
  filtros.tipos = new Set(TIPOS);
}

function valoresDe(clave) {
  if (clave === "parciales") return [...new Set(banco.map(q => q.parcial))];
  if (clave === "temas") return [...new Set(banco.map(q => q.tema))];
  if (clave === "dificultades") return ["facil", "media", "dificil"];
  return TIPOS;
}

function contarPor(clave, valor) {
  if (clave === "parciales") return banco.filter(q => q.parcial === valor).length;
  if (clave === "temas") return banco.filter(q => q.tema === valor).length;
  if (clave === "dificultades") return banco.filter(q => q.dificultad === valor).length;
  return banco.filter(q => q.tipo === valor).length;
}

function leerOpciones() {
  filtros.soloDebiles = $("cfg-solo-debiles").checked;
  filtros.soloMarcadas = $("cfg-solo-marcadas").checked;
  filtros.priorizar = $("cfg-priorizar").checked;
}

function preguntasFiltradas() {
  leerOpciones();
  return banco.filter(q =>
    filtros.parciales.has(q.parcial) &&
    filtros.temas.has(q.tema) &&
    filtros.dificultades.has(q.dificultad) &&
    filtros.tipos.has(q.tipo) &&
    (!filtros.soloDebiles || esDebil(obtenerP(q.id))) &&
    (!filtros.soloMarcadas || obtenerP(q.id).marked)
  );
}

function renderConfig() {
  const grupos = [
    { clave: "parciales", titulo: "Parcial", etiqueta: v => v },
    { clave: "temas", titulo: "Tema", etiqueta: v => v },
    { clave: "dificultades", titulo: "Dificultad", etiqueta: v => DIF_LABELS[v] || v },
    { clave: "tipos", titulo: "Tipo de pregunta", etiqueta: v => TIPO_LABELS[v] || v }
  ];
  let html = "";
  grupos.forEach(g => {
    html += '<div class="mb-5"><div class="flex items-center gap-2 mb-2.5"><span class="font-semibold text-sm text-slate-300">' + g.titulo +
      '</span><span class="ml-auto"></span><button class="link-btn" data-action="toggleFiltroTodos" data-clave="' + g.clave + '" data-activar="true">Todos</button>' +
      '<button class="link-btn" data-action="toggleFiltroTodos" data-clave="' + g.clave + '" data-activar="false">Ninguno</button></div><div class="flex flex-wrap gap-2">';
    valoresDe(g.clave).forEach(v => {
      const activa = filtros[g.clave].has(v);
      html += '<button type="button" class="chip' + (activa ? " chip-on" : "") + '" data-action="toggleFiltro" data-clave="' + g.clave + '" data-valor="' + v + '"' + (g.clave === "tipos" ? ' data-tipo="' + v + '"' : "") + '>' +
        g.etiqueta(v) + ' · ' + contarPor(g.clave, v) + '</button>';
    });
    html += '</div></div>';
  });
  $("config-groups").innerHTML = html;
  actualizarResumen();
}

function toggleFiltro(clave, valor) {
  if (filtros[clave].has(valor)) filtros[clave].delete(valor);
  else filtros[clave].add(valor);
  renderConfig();
}

function toggleFiltroTodos(clave, activar) {
  filtros[clave] = activar ? new Set(valoresDe(clave)) : new Set();
  renderConfig();
}

function actualizarResumen() {
  leerOpciones();
  const qs = preguntasFiltradas();
  $("cfg-max").textContent = qs.length;
  const input = $("cfg-cantidad");
  input.max = qs.length || 1;
  const actual = parseInt(input.value, 10);
  if (!actual || actual > qs.length) input.value = qs.length || 1;
  $("cfg-resumen").textContent = qs.length + " preguntas coinciden con los filtros.";
  $("btn-comenzar").disabled = qs.length === 0;
}

function usarTodas() {
  const qs = preguntasFiltradas();
  $("cfg-cantidad").value = qs.length || 1;
  actualizarResumen();
}

function irConfig() {
  renderConfig();
  show("config");
}

// ordenarPrioridad, prepararItem y respuestaCorrecta viven en core/sesiones.js (testeables).

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
  const barajar = modo !== "repaso";
  const preparadas = items.map(it => prepararItem(it, barajar));
  session = { items: preparadas, idx: 0, answers: {}, modo, inicio: Date.now(), finalizada: false, pausado: false };
  if (modo === "contrarreloj") { session.tPorPregunta = 30; session.tRestante = 30; }
  if (modo === "supervivencia") { session.vidas = 3; session.combo = 0; session.mejorCombo = 0; }
  show("quiz");
  $("timer-badge").classList.toggle("hidden", !conTimer);
  $("simulacro-badge").classList.toggle("hidden", modo !== "simulacro");
  $("repaso-badge").classList.toggle("hidden", modo !== "repaso");
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
  const lista = filtros.priorizar ? priorizar(qs) : shuffle(qs);
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
  const lista = shuffle(banco.filter(q => q.tipo !== "desarrollo")).slice(0, 10);
  if (!lista.length) return;
  startSession(lista, "contrarreloj", false);
}

function startSupervivencia() {
  if (!banco.length) return;
  startSession(shuffle(banco), "supervivencia", false);
}

// ===== Misiones por tema (spec 003): mapa secuencial con estrellas =====

function misionesDeMateria() {
  return materia ? persistencia.misiones(materia.id) : {};
}

function irMisiones() {
  clearTimer();
  clearTimerPregunta();
  session = null;
  show("misiones");
  renderMisiones();
}

function renderMisiones() {
  const temas = [...new Set(banco.map(q => q.tema))];
  pintarMisiones(estadoMisiones(temas, misionesDeMateria()));
}

function iniciarMision(tema) {
  const lista = banco.filter(q => q.tema === tema);
  if (!lista.length) return;
  startSession(priorizar(lista).slice(0, Math.min(10, lista.length)), "mision", false);
  session.misionTema = tema;
}

// ===== Escenarios multi-paso (spec 003): decidir → consecuencias → final con rating =====

function startEscenarios() {
  show("escenarios");
  pintarListaEscenarios((materia && materia.escenarios) || [], persistencia.escenarios());
}

function jugarEscenario(id) {
  const e = ((materia && materia.escenarios) || []).find(x => x.id === id);
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
  const casos = (materia && materia.casos) || [];
  pintarListaCasos(casos, persistencia.casos());
}

function jugarCaso(id) {
  const casos = (materia && materia.casos) || [];
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
  let rating = ratingDiagrama(res.correctas + res.miembrosOk, res.totalEsperado);
  // Misma vara que el quiz: un diagrama con elementos de más no puede ser "éxito".
  if (res.sobrantes > 0 && rating === "exito") rating = "parcial";
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
  const debiles = banco.filter(q => esDebil(obtenerP(q.id)));
  if (!debiles.length) return;
  startSession(shuffle(debiles).slice(0, 10), "practica", false);
}

function practicarTipo(tipo) {
  const lista = banco.filter(q => q.tipo === tipo);
  if (!lista.length) return;
  startSession(priorizar(lista).slice(0, Math.min(10, lista.length)), "practica", false);
}

function practicarArrastre() {
  const lista = banco.filter(q => q.tipo === "dragdrop" || q.tipo === "ordenar");
  if (!lista.length) return;
  startSession(priorizar(lista).slice(0, Math.min(10, lista.length)), "practica", false);
}

function practicarCasos() {
  const lista = banco.filter(q => q.caso);
  if (!lista.length) return;
  startSession(priorizar(lista).slice(0, Math.min(10, lista.length)), "practica", false);
}

function practicarVencidas() {
  const lista = banco.filter(q => vencida(obtenerP(q.id)));
  if (!lista.length) return;
  startSession(priorizar(lista).slice(0, Math.min(10, lista.length)), "practica", false);
}

function preguntasReales() {
  return banco.filter(q => q.real);
}

function irRepaso() {
  const reales = preguntasReales();
  $("repaso-n").textContent = reales.length;
  $("repaso-list").innerHTML = reales.map((q, i) => {
    const p = obtenerP(q.id);
    const marca = (p.ok + p.fail) === 0 ? "·" : (p.lastOk ? "✔" : "✖");
    const color = (p.ok + p.fail) === 0 ? "text-slate-500" : (p.lastOk ? "text-emerald-400" : "text-rose-400");
    return '<div class="peor-row mb-2"><span class="text-slate-500 font-bold">P' + (i + 1) + '</span>' +
      '<span class="flex-1 text-slate-300 leading-snug">' + escapar(q.q.length > 85 ? q.q.slice(0, 85) + "…" : q.q) + '</span>' +
      '<span class="text-xs text-slate-400 hidden sm:inline">' + (TIPO_LABELS[q.tipo] || q.tipo) + '</span>' +
      '<span class="' + color + ' font-bold">' + marca + '</span></div>';
  }).join("");
  show("repaso");
}

function iniciarRepasoQuiz() {
  const reales = preguntasReales();
  if (!reales.length) return;
  startSession(reales.slice(), "repaso", false);
}

function renderTiposPanel() {
  const panel = $("tipos-panel");
  if (!panel) return;
  const conteos = {};
  banco.forEach(q => { conteos[q.tipo] = (conteos[q.tipo] || 0) + 1; });
  panel.innerHTML = TIPOS.filter(t => conteos[t]).map(t =>
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
  if (session.modo === "supervivencia") {
    session.resultado.supervivencia = { jugadas: Object.keys(session.answers).length, mejorCombo: session.mejorCombo || 0 };
  }
  if (session.modo === "mision" && session.misionTema) {
    const mapa = misionesDeMateria();
    const nuevas = estrellasDeMision(pct);
    const merge = fusionarMision(mapa[session.misionTema], pct, nuevas);
    if (merge.cambio) {
      mapa[session.misionTema] = merge.registro;
      persistencia.guardarMisiones(materia.id, mapa);
      if (merge.mejoraEstrellas) gamificacion.sumarXp(merge.estrellasGanadas * XP_EVENTOS.estrella);
    }
    gamificacion.revisarLogros({ misionPerfecta: nuevas === 3, estrellasTotales: gamificacion.estrellasTotales() });
  }
  guardarIntento(aciertos, totalCal, session.modo);
  gamificacion.revisarLogros({
    simulacroPerfecto: totalCal > 0 && pct === 100 && (session.modo === "simulacro" || session.modo === "repaso")
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
  startSession(session.items, session.modo, session.modo === "simulacro");
}

function guardarIntento(score, total, modo) {
  const historial = cargarHistorial();
  historial.unshift({ date: Date.now(), score, total, modo: modo || "practica" });
  persistencia.guardarHistorial(materia.id, historial);
}

// Wrappers que inyectan los datos persistidos al módulo de estadísticas.
function renderStats() {
  if (!materia) return;
  renderStatsUI({
    materia,
    banco,
    obtenerP,
    historial: cargarHistorial(),
    actividad: cargarActividad(),
    meta: cargarMeta(),
    onCambiarMeta: cambiarMeta
  });
}

function renderHistory() {
  renderHistoryUI(cargarHistorial());
}

function renderMaterias() {
  const cont = $("materias-list");
  if (!cont) return;
  cont.innerHTML = MATERIAS.map(m => {
    const n = m.preguntas.length;
    const pendiente = n === 0;
    const detalles = pendiente
      ? "Contenido en preparación"
      : n + " preguntas" + (m.glosario.terminos.length ? " · " + m.glosario.terminos.length + " términos" : "");
    return '<button class="materia-card" data-action="seleccionarMateria" data-materia="' + m.id + '" style="border-left:4px solid ' + m.color + '">' +
      '<span class="icono icono-lg text-slate-300">' + icono(m.icono) + '</span>' +
      '<span class="font-bold">' + m.nombre + '</span>' +
      '<span class="text-xs text-slate-400">' + m.descripcion + '</span>' +
      '<span class="text-xs ' + (pendiente ? "text-amber-300" : "text-emerald-300") + '">' + detalles + '</span>' +
    '</button>';
  }).join("");
}

function irMaterias() {
  clearTimer();
  session = null;
  document.documentElement.style.removeProperty("--materia-accent");
  const temaMeta = document.querySelector('meta[name="theme-color"]');
  if (temaMeta) temaMeta.setAttribute("content", "#1a1c22");
  show("materias");
  renderMaterias();
  renderPerfil();
}

function seleccionarMateria(id) {
  const m = getMateria(id);
  if (!m) return;
  materia = m;
  banco = m.preguntas;
  glosario = m.glosario;
  // Acento por materia (spec 007): tiñe acciones primarias, progreso y stats de la materia.
  document.documentElement.style.setProperty("--materia-accent", m.color);
  persistencia.migrarLegacy(m.id);
  progreso = cargarProgreso();
  inicializarFiltros();
  renderConfig();
  renderMateriaUI();
  goHome();
}

function renderMateriaUI() {
  document.title = materia.nombre + " — Systematic";
  const nombre = $("materia-nombre");
  const iconoSpan = $("materia-icono");
  if (nombre) nombre.textContent = materia.nombre;
  if (iconoSpan) {
    iconoSpan.innerHTML = icono(materia.icono);
  }
  const sub = $("portada-sub");
  if (sub) sub.textContent = materia.descripcion || "";
  const temaMeta = document.querySelector('meta[name="theme-color"]');
  if (temaMeta) temaMeta.setAttribute("content", materia.color);
  const gloTitulo = $("glosario-titulo");
  if (gloTitulo) gloTitulo.textContent = "Glosario";
  const cardRepaso = $("card-repaso");
  if (cardRepaso) cardRepaso.classList.toggle("hidden", !banco.some(q => q.real));
}

function apuntesDeMateria() {
  return materia && materia.apuntes ? materia.apuntes : [];
}

function startApuntes() {
  apunteTema = "todos";
  const s = $("apuntes-search");
  if (s) s.value = "";
  renderApuntes("");
  renderApuntesFiltros();
  show("apuntes");
}

function renderApuntesFiltros() {
  const cont = $("apuntes-filtros");
  if (!cont) return;
  const todos = apuntesDeMateria();
  const temas = ["todos"].concat([...new Set(todos.map(a => a.tema))]);
  cont.innerHTML = temas.map(t => {
    const cuenta = t === "todos" ? todos.length : todos.filter(a => a.tema === t).length;
    return '<button class="chip' + (apunteTema === t ? " chip-on" : "") + '" data-action="cambiarApunteTema" data-tema="' + t + '">' +
      (t === "todos" ? "Todos" : escapar(t)) + " · " + cuenta + '</button>';
  }).join("");
}

function cambiarApunteTema(t) {
  apunteTema = t;
  const s = $("apuntes-search");
  renderApuntes(s ? s.value : "");
  renderApuntesFiltros();
}

function renderApuntes(filtro) {
  const lista = filtrarApuntes(apuntesDeMateria(), filtro, apunteTema);
  $("apuntes-list").innerHTML = lista.map(a => tarjeta({
    tema: a.tema,
    titulo: a.titulo,
    cuerpo: '<div class="apunte-contenido">' + apunteAHTML(a.contenido) + '</div>' +
      '<div class="apunte-fuente">Fuente: ' + escapar(a.fuente) + '</div>'
  })).join("") || estadoVacio("Aún no hay apuntes para esta materia.");
  const cont = $("apuntes-count");
  if (cont) cont.textContent = lista.length + " apunte(s)";
}

function goHome() {
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
renderMaterias();
renderPerfil();
show("materias");

// Registro único de acciones (ADR 002): los elementos declaran data-action con el nombre
// de la función que ejecutan y sus parámetros en data-*; un único listener delegado de
// click los resuelve desde este mapa. No se publica nada en window.
const ACCIONES = {
  actualizarResumen: () => actualizarResumen(),
  alternarPausa: () => alternarPausa(),
  autoevaluarDev: el => quiz.autoevaluarDev(el.dataset.ok === "true"),
  autoevaluarResultado: el => resultados.autoevaluarResultado(el.dataset.id, el.dataset.ok === "true"),
  cambiarApunteTema: el => cambiarApunteTema(el.dataset.tema),
  cambiarEstudioTipo: el => estudio.cambiarEstudioTipo(el.dataset.tipo),
  cambiarGlosarioCat: el => glosarioUI.cambiarGlosarioCat(el.dataset.id),
  clearHistory: () => clearHistory(),
  clickMatchDer: el => quiz.clickMatchDer(parseInt(el.dataset.idx, 10)),
  clickMatchIzq: el => quiz.clickMatchIzq(parseInt(el.dataset.i, 10)),
  comenzarPractica: () => comenzarPractica(),
  comenzarSimulacro: () => comenzarSimulacro(),
  comprobarMulti: () => quiz.comprobarMulti(),
  comprobarOrden: () => quiz.comprobarOrden(),
  estudioGarantizadas: () => estudio.estudioGarantizadas(),
  exportarDatos: () => exportarDatos(),
  flashcardsGarantizadas: () => flashcards.flashcardsGarantizadas(),
  goHome: () => goHome(),
  importarArchivo: () => $("import-file").click(),
  iniciarRepasoQuiz: () => iniciarRepasoQuiz(),
  irConfig: () => irConfig(),
  irMaterias: () => irMaterias(),
  iniciarMision: el => iniciarMision(el.dataset.tema),
  irMisiones: () => irMisiones(),
  irRepaso: () => irRepaso(),
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
  startApuntes: () => startApuntes(),
  startEscenarios: () => startEscenarios(),
  jugarEscenario: el => jugarEscenario(el.dataset.id),
  decidirEscenario: el => decidirEscenario(parseInt(el.dataset.idx, 10)),
  continuarEscenario: () => continuarEscenario(),
  startCasos: () => startCasos(),
  jugarCaso: el => jugarCaso(el.dataset.id),
  comprobarCaso: () => comprobarCaso(),
  cancelarDiagramaTipoCaso: () => diagramasUI.cancelarSeleccion(),
  comprobarDiagrama: () => quiz.comprobarDiagrama(),
  elegirDiagramaTipo: el => quiz.elegirDiagramaTipo(el.dataset.arista),
  cancelarDiagramaTipo: () => quiz.cancelarDiagramaTipo(),
  startFlashcards: () => flashcards.startFlashcards(),
  startGlosario: () => glosarioUI.startGlosario(),
  startStudy: () => estudio.startStudy(),
  toggleEstudioReales: () => estudio.toggleEstudioReales(),
  toggleFiltro: el => toggleFiltro(el.dataset.clave, el.dataset.valor),
  toggleFiltroTodos: el => toggleFiltroTodos(el.dataset.clave, el.dataset.activar === "true"),
  toggleMarcadaActual: () => quiz.toggleMarcadaActual(),
  toggleMarcadaEstudio: el => estudio.toggleMarcadaEstudio(el.dataset.id),
  toggleMulti: el => quiz.toggleMulti(parseInt(el.dataset.idx, 10)),
  toggleStudy: el => estudio.toggleStudy(el),
  usarTodas: () => usarTodas(),
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
  $(id).addEventListener("change", () => actualizarResumen())
);
$("import-file").addEventListener("change", e => importarDatos(e.target));
$("study-search").addEventListener("input", e => estudio.renderStudy(e.target.value));
$("apuntes-search").addEventListener("input", e => renderApuntes(e.target.value));
$("glosario-search").addEventListener("input", e => glosarioUI.renderGlosario(e.target.value));
