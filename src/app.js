import { MATERIAS, getMateria } from "./core/materias.js";
import {
  claves, migrarClavesLegacy, leerJSON, escribirJSON, obtenerEntrada,
  aplicarRespuesta, esDebil, vencida, metaDiaria, hoyISO, calcularRacha
} from "./core/progreso.js";
import { shuffle, ordenarPrioridad, prepararItem } from "./core/sesiones.js";
import { XP_EVENTOS, xpDeRespuesta, progresoDeNivel, evaluarLogros, multiplicadorSupervivencia, xpContrarreloj, estrellasDeMision } from "./core/gamificacion.js";
import { apunteAHTML, filtrarApuntes } from "./ui/apuntes.js";
import { TIPOS, TIPO_LABELS, DIF_LABELS, escapar, animar } from "./ui/helpers.js";
import { crearQuizUI } from "./ui/quiz.js";
import { crearResultadosUI } from "./ui/resultados.js";
import { renderHistory as renderHistoryUI, renderStats as renderStatsUI } from "./ui/stats.js";
import { crearEstudioUI } from "./ui/estudio.js";
import { crearGlosarioUI } from "./ui/glosario.js";
import { crearFlashcardsUI } from "./ui/flashcards.js";
import { estadoMisiones, pintarMisiones } from "./ui/misiones.js";
import { iniciarEscenario, decidir as decidirEscenarioPaso, continuar as continuarEscenarioPaso, xpDeEscenario } from "./core/escenarios.js";
import { pintarListaEscenarios, pintarEscenario } from "./ui/escenarios.js";

// Materia activa y datos asociados (se definen al seleccionar materia en el home).
let materia = null;
let banco = [];
let glosario = { categorias: [], terminos: [], tips: [] };
let clavesMateria = null;

let progreso = {};
let session = null;
let filtros = { parciales: new Set(), temas: new Set(), dificultades: new Set(), tipos: new Set(), soloDebiles: false, soloMarcadas: false, priorizar: true };
let apunteTema = "todos";
let escenarioActual = null;
let escenarioEstado = null;

const $ = id => document.getElementById(id);

// Estado explícito que se inyecta a los módulos de src/ui/ (lectura vía getters,
// porque estas variables se reasignan al cambiar de materia o de sesión).
const ctx = {
  get session() { return session; },
  get banco() { return banco; },
  get glosario() { return glosario; },
  get materia() { return materia; }
};

function show(screen) {
    ["materias", "start", "config", "quiz", "results", "study", "apuntes", "misiones", "escenarios", "escenario", "flashcards", "glosario", "repaso"].forEach(s =>
    $("screen-" + s).classList.toggle("hidden", s !== screen)
  );
  animar($("screen-" + screen));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cargarProgreso() {
  return leerJSON(localStorage, clavesMateria.progreso, {});
}

function guardarProgreso() {
  escribirJSON(localStorage, clavesMateria.progreso, progreso);
}

function obtenerP(id) {
  return obtenerEntrada(progreso, id);
}

// Prioriza según el progreso de la materia activa (débiles → vencidas → nuevas).
const priorizar = lista => ordenarPrioridad(lista, obtenerP);

function cargarActividad() {
  return leerJSON(localStorage, clavesMateria.actividad, {});
}

function registrarActividad() {
  const a = cargarActividad();
  const h = hoyISO();
  a[h] = (a[h] || 0) + 1;
  escribirJSON(localStorage, clavesMateria.actividad, a);
}

function cargarMeta() {
  return metaDiaria(leerJSON(localStorage, clavesMateria.meta, 20));
}

function cambiarMeta(valor) {
  escribirJSON(localStorage, clavesMateria.meta, metaDiaria(valor));
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
  if (ganado) sumarXp(ganado);
  const metaCumplida = (cargarActividad()[hoyISO()] || 0) >= cargarMeta();
  if (metaCumplida) xpEventoUnico("meta-" + hoyISO(), XP_EVENTOS.metaDiaria);
  revisarLogros({ metaCumplida });
}

function toggleMarked(id) {
  const marcada = !obtenerP(id).marked;
  progreso[id] = Object.assign({}, obtenerP(id), { marked: marcada });
  guardarProgreso();
  return marcada;
}

function cargarHistorial() {
  return leerJSON(localStorage, clavesMateria.historial, []);
}

function clearHistory() {
  try { localStorage.removeItem(clavesMateria.historial); } catch (e) { /* sin persistencia */ }
  renderHistory();
  renderStats();
}

function resetProgreso() {
  if (!confirm("¿Borrar todo el progreso (aciertos, fallos, marcas y racha)?")) return;
  progreso = {};
  try {
    localStorage.removeItem(clavesMateria.progreso);
    localStorage.removeItem(clavesMateria.actividad);
  } catch (e) { /* sin persistencia */ }
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
      escribirJSON(localStorage, clavesMateria.progreso, progreso);
      if (datos.historial) escribirJSON(localStorage, clavesMateria.historial, datos.historial);
      if (datos.actividad) escribirJSON(localStorage, clavesMateria.actividad, datos.actividad);
      if (datos.meta) escribirJSON(localStorage, clavesMateria.meta, metaDiaria(datos.meta));
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

// ===== Gamificación (spec 003): XP, niveles, logros, perfil y avisos =====
// La lógica pura vive en core/gamificacion.js; aquí solo orquestación y persistencia.

function xpActual() {
  return leerJSON(localStorage, "sys.xp", 0);
}

function sumarXp(cantidad) {
  if (!cantidad) return;
  const antes = progresoDeNivel(xpActual());
  const nuevo = xpActual() + cantidad;
  escribirJSON(localStorage, "sys.xp", nuevo);
  const despues = progresoDeNivel(nuevo);
  if (despues.nivel > antes.nivel) {
    toast("🌟 ¡Nivel " + despues.nivel + " alcanzado!");
    confeti();
  }
  renderPerfil();
}

// Recompensas de una sola ocurrencia (p. ej. meta diaria por fecha).
function xpEventoUnico(clave, cantidad) {
  const eventos = leerJSON(localStorage, "sys.xp-eventos", {});
  if (eventos[clave]) return;
  eventos[clave] = true;
  escribirJSON(localStorage, "sys.xp-eventos", eventos);
  sumarXp(cantidad);
}

function statsGlobales() {
  let ok = 0;
  let total = 0;
  MATERIAS.forEach(m => {
    const p = leerJSON(localStorage, claves(m.id).progreso, {});
    Object.keys(p).forEach(idP => {
      ok += p[idP].ok;
      total += p[idP].ok + p[idP].fail;
    });
  });
  return { respuestas: total, precision: total ? Math.round((ok / total) * 100) : 0 };
}

// Racha global: mezcla la actividad de todas las materias tomando el máximo por día.
function actividadGlobal() {
  const merged = {};
  MATERIAS.forEach(m => {
    const a = leerJSON(localStorage, claves(m.id).actividad, {});
    Object.keys(a).forEach(d => { merged[d] = Math.max(merged[d] || 0, a[d]); });
  });
  return merged;
}

function revisarLogros(extra) {
  const actuales = leerJSON(localStorage, "sys.logros", {});
  const s = statsGlobales();
  const ctx = Object.assign(
    {
      racha: calcularRacha(actividadGlobal()),
      respuestas: s.respuestas,
      precision: s.precision,
      simulacroPerfecto: false,
      metaCumplida: false,
      misionPerfecta: false,
      estrellasTotales: 0,
      escenarioExito: false
    },
    extra || {}
  );
  const nuevos = evaluarLogros(actuales, ctx);
  if (!nuevos.length) return;
  nuevos.forEach(l => {
    actuales[l.id] = l.fecha;
    toast(l.icono + " Logro: " + l.nombre + " (+" + XP_EVENTOS.logro + " XP)");
  });
  escribirJSON(localStorage, "sys.logros", actuales);
  sumarXp(nuevos.length * XP_EVENTOS.logro);
}

function renderPerfil() {
  const cont = $("perfil-panel");
  if (!cont) return;
  const xp = xpActual();
  const p = progresoDeNivel(xp);
  const racha = calcularRacha(actividadGlobal());
  const insignias = Object.keys(leerJSON(localStorage, "sys.logros", {})).length;
  cont.innerHTML =
    '<div class="perfil-card">' +
      '<div class="perfil-nivel"><span class="perfil-num">' + p.nivel + '</span><span class="perfil-etq">nivel</span></div>' +
      '<div class="perfil-datos">' +
        '<div class="text-sm"><b>' + xp + '</b> XP' + (p.faltante ? " · faltan " + p.faltante + " para el nivel " + (p.nivel + 1) : "") + '</div>' +
        '<div class="progress-track mt-2"><div class="progress-fill" style="width:' + p.pct + '%"></div></div>' +
        '<div class="perfil-mini">🔥 Racha: ' + racha + ' día(s) · 🏅 ' + insignias + ' logro(s) desbloqueado(s)</div>' +
      '</div>' +
    '</div>';
}

function toast(mensaje) {
  let zona = $("toast-zone");
  if (!zona) {
    zona = document.createElement("div");
    zona.id = "toast-zone";
    document.body.appendChild(zona);
  }
  const el = document.createElement("div");
  el.className = "toast";
  el.setAttribute("role", "status");
  el.textContent = mensaje;
  zona.appendChild(el);
  setTimeout(() => el.classList.add("toast-out"), 2800);
  setTimeout(() => el.remove(), 3300);
}

// Confeti breve y discreto (respeta prefers-reduced-motion).
function confeti() {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let c = $("confeti-canvas");
  if (!c) {
    c = document.createElement("canvas");
    c.id = "confeti-canvas";
    document.body.appendChild(c);
  }
  const dpr = window.devicePixelRatio || 1;
  c.width = window.innerWidth * dpr;
  c.height = window.innerHeight * dpr;
  const lienzo = c.getContext("2d");
  if (!lienzo) return;
  lienzo.setTransform(dpr, 0, 0, dpr, 0, 0);
  const colores = ["#9BB8C9", "#8FBF9F", "#D9BC8A", "#B5A9CF", "#E7E5DE"];
  const partes = Array.from({ length: 60 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * window.innerHeight * 0.3,
    vy: 120 + Math.random() * 160,
    vx: -40 + Math.random() * 80,
    tam: 4 + Math.random() * 5,
    rot: Math.random() * Math.PI,
    color: colores[Math.floor(Math.random() * colores.length)]
  }));
  const inicio = performance.now();
  function cuadro(t) {
    const dt = (t - inicio) / 1000;
    lienzo.clearRect(0, 0, window.innerWidth, window.innerHeight);
    partes.forEach(p => {
      lienzo.save();
      lienzo.translate(p.x + p.vx * dt, p.y + p.vy * dt);
      lienzo.rotate(p.rot + dt * 3);
      lienzo.fillStyle = p.color;
      lienzo.fillRect(-p.tam / 2, -p.tam / 2, p.tam, p.tam * 0.6);
      lienzo.restore();
    });
    if (dt < 1.6) requestAnimationFrame(cuadro);
    else lienzo.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
  requestAnimationFrame(cuadro);
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
      html += '<button type="button" class="chip' + (activa ? " chip-on" : "") + '" data-action="toggleFiltro" data-clave="' + g.clave + '" data-valor="' + v + '">' +
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
  badge.textContent = "⚡ " + Math.max(0, session.tRestante) + "s";
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
  mb.textContent = modo === "contrarreloj" ? "⚡ Contrarreloj" : modo === "supervivencia" ? "❤️ Supervivencia" : "";
  mb.classList.toggle("hidden", !mb.textContent);
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
  return materia ? leerJSON(localStorage, "sys.misiones." + materia.id, {}) : {};
}

function estrellasTotales() {
  return MATERIAS.reduce((acc, m) => {
    const mapa = leerJSON(localStorage, "sys.misiones." + m.id, {});
    return acc + Object.keys(mapa).reduce((s, t) => s + (mapa[t].estrellas || 0), 0);
  }, 0);
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
  pintarListaEscenarios((materia && materia.escenarios) || [], leerJSON(localStorage, "sys.escenarios", {}));
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
  if (xp) sumarXp(xp);
  const registros = leerJSON(localStorage, "sys.escenarios", {});
  const previo = registros[escenarioActual.id];
  const orden = { fracaso: 0, parcial: 1, exito: 2 };
  const jugadas = ((previo && previo.jugadas) || 0) + 1;
  if (!previo || orden[escenarioEstado.rating] > orden[previo.mejorRating]) {
    registros[escenarioActual.id] = { mejorRating: escenarioEstado.rating, jugadas };
  } else {
    registros[escenarioActual.id] = { mejorRating: previo.mejorRating, jugadas };
  }
  escribirJSON(localStorage, "sys.escenarios", registros);
  revisarLogros({ escenarioExito: escenarioEstado.rating === "exito" });
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
  badge.textContent = "⏱ " + m + ":" + String(s).padStart(2, "0");
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
  $("pause-btn").textContent = session.pausado ? "▶" : "⏸";
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
    const previa = mapa[session.misionTema] || { estrellas: 0, mejorPct: 0 };
    const nuevas = estrellasDeMision(pct);
    if (nuevas > previa.estrellas || pct > previa.mejorPct) {
      mapa[session.misionTema] = { estrellas: Math.max(previa.estrellas, nuevas), mejorPct: Math.max(previa.mejorPct, pct) };
      escribirJSON(localStorage, "sys.misiones." + materia.id, mapa);
      if (nuevas > previa.estrellas) sumarXp((nuevas - previa.estrellas) * XP_EVENTOS.estrella);
    }
    revisarLogros({ misionPerfecta: nuevas === 3, estrellasTotales: estrellasTotales() });
  }
  guardarIntento(aciertos, totalCal, session.modo);
  revisarLogros({
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
  escribirJSON(localStorage, clavesMateria.historial, historial.slice(0, 15));
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
    return '<button class="mode-card" data-action="seleccionarMateria" data-materia="' + m.id + '" style="border-left:4px solid ' + m.color + '">' +
      '<span class="text-2xl">' + m.icono + '</span>' +
      '<span class="font-bold">' + m.nombre + '</span>' +
      '<span class="text-xs text-slate-400">' + m.descripcion + '</span>' +
      '<span class="text-xs ' + (pendiente ? "text-amber-300" : "text-emerald-300") + '">' + detalles + '</span>' +
    '</button>';
  }).join("");
}

function irMaterias() {
  clearTimer();
  session = null;
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
  clavesMateria = claves(m.id);
  migrarClavesLegacy(localStorage, m.id);
  progreso = cargarProgreso();
  inicializarFiltros();
  renderConfig();
  renderMateriaUI();
  goHome();
}

function renderMateriaUI() {
  document.title = materia.nombre + " — Systematic";
  const nombre = $("materia-nombre");
  const icono = $("materia-icono");
  if (nombre) nombre.textContent = materia.nombre;
  if (icono) icono.textContent = materia.icono;
  const gloTitulo = $("glosario-titulo");
  if (gloTitulo) gloTitulo.textContent = "📚 Glosario";
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
  $("apuntes-list").innerHTML = lista.map(a =>
    '<div class="apunte-card">' +
      '<div class="apunte-tema">' + escapar(a.tema) + '</div>' +
      '<div class="apunte-titulo">' + escapar(a.titulo) + '</div>' +
      '<div class="apunte-contenido">' + apunteAHTML(a.contenido) + '</div>' +
      '<div class="apunte-fuente">Fuente: ' + escapar(a.fuente) + '</div>' +
    '</div>'
  ).join("") || '<p class="text-sm text-slate-400">Aún no hay apuntes para esta materia.</p>';
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

document.addEventListener("keydown", e => {
  if ($("screen-quiz").classList.contains("hidden") || !session) return;
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
migrarClavesLegacy(localStorage, "bd2");
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
