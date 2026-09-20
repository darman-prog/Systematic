import { MATERIAS, getMateria } from "./core/materias.js";
import {
  claves, migrarClavesLegacy, leerJSON, escribirJSON, obtenerEntrada,
  aplicarRespuesta, esDebil, vencida, calcularRacha, metaDiaria, hoyISO, fechaISO
} from "./core/progreso.js";
import { shuffle, ordenarPrioridad, prepararItem, respuestaCorrecta } from "./core/sesiones.js";
import { apunteAHTML, filtrarApuntes } from "./ui/apuntes.js";

  // Materia activa y datos asociados (se definen al seleccionar materia en el home).
  let materia = null;
  let banco = [];
  let glosario = { categorias: [], terminos: [], tips: [] };
  let clavesMateria = null;

  const TOPIC_COLORS = {
    "DML": "#38bdf8",
    "DDL": "#a78bfa",
    "Integridad": "#f472b6",
    "Índices": "#facc15",
    "Modelado": "#34d399",
    "Consultas": "#fb923c",
    "Funciones": "#22d3ee"
  };
  const TIPO_LABELS = {
    multiple: "Opción múltiple",
    multi: "Selección múltiple",
    vf: "Verdadero / Falso",
    codigo: "Lee el código",
    dragdrop: "Arrastrar piezas",
    ordenar: "Ordenar bloques",
    desarrollo: "Desarrollo",
    relacionar: "Relacionar columnas"
  };
  const DIF_LABELS = { facil: "Fácil", media: "Media", dificil: "Difícil" };
  const TIPOS = ["multiple", "multi", "vf", "codigo", "dragdrop", "ordenar", "desarrollo", "relacionar"];

  let progreso = {};
  let session = null;
  let flash = null;
  let estudioTipo = "todos";
  let estudioSoloReales = false;
  let dragPid = null;
  let dragBloqueIndex = null;
  let filtros = { parciales: new Set(), temas: new Set(), dificultades: new Set(), tipos: new Set(), soloDebiles: false, soloMarcadas: false, priorizar: true };

  const $ = id => document.getElementById(id);

  function escapar(texto) {
    return String(texto).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function escaparRegex(texto) {
    return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  const SQL_KEYWORDS = ["SELECT", "FROM", "WHERE", "JOIN", "ON", "GROUP BY", "ORDER BY", "WITHIN GROUP", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE TABLE", "ALTER TABLE", "ADD", "DROP TABLE", "PRIMARY KEY", "FOREIGN KEY", "REFERENCES", "LISTAGG", "GROUP_CONCAT", "SUBSTR", "SUBSTRING", "CAST", "TO_CHAR", "TO_NUMBER", "VARCHAR2", "NUMBER", "AS", "AND", "OR", "COUNT", "DISTINCT", "INT", "FLOAT", "NULL", "NOT", "CASCADE", "ASC", "HAVING", "SUM", "INTO"];

  function resaltarSQL(sql) {
    let base = escapar(sql).replace(/'([^']*)'/g, "<span class=\"str\">'$1'</span>");
    const patron = new RegExp("\\b(" + SQL_KEYWORDS.slice().sort((a, b) => b.length - a.length).map(escaparRegex).join("|") + ")\\b", "g");
    return base.replace(patron, m => '<span class="kw">' + m + '</span>');
  }

  function animar(el) {
    if (!el || !el.classList) return;
    el.classList.remove("anim-in");
    void el.offsetWidth;
    el.classList.add("anim-in");
  }

  function show(screen) {
    ["materias", "start", "config", "quiz", "results", "study", "apuntes", "flashcards", "glosario", "repaso"].forEach(s =>
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
        '</span><span class="ml-auto"></span><button class="link-btn" onclick="toggleFiltroTodos(\'' + g.clave + '\', true)">Todos</button>' +
        '<button class="link-btn" onclick="toggleFiltroTodos(\'' + g.clave + '\', false)">Ninguno</button></div><div class="flex flex-wrap gap-2">';
      valoresDe(g.clave).forEach(v => {
        const activa = filtros[g.clave].has(v);
        html += '<button type="button" class="chip' + (activa ? " chip-on" : "") + '" onclick="toggleFiltro(\'' + g.clave + '\',\'' + v + '\')">' +
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

  function diagramaER() {
    const flecha = '<div class="text-slate-500 text-xl font-bold text-center px-2"><span class="md:hidden">↓</span><span class="hidden md:inline">→</span></div>';
    return '<div class="my-5">' +
      '<p class="text-xs uppercase tracking-wide text-slate-400 mb-2 font-bold">Esquema de referencia</p>' +
      '<div class="flex flex-col md:flex-row items-stretch md:items-center gap-2">' +
        tarjetaER("Profesor", [["PK", "ID_Profesor"], ["", "nombre"]]) +
        flecha +
        tarjetaER("Horas (tabla puente)", [["PK·FK", "ID_Profesor"], ["PK·FK", "ID_Asignatura"]]) +
        flecha +
        tarjetaER("Asignatura", [["PK", "ID_Asignatura"], ["", "nombre"]]) +
      '</div>' +
      '<p class="text-xs text-slate-500 mt-2">Profesor 1 → N Horas N ← 1 Asignatura (relación muchos a muchos resuelta por la tabla puente)</p>' +
    '</div>';
  }

  function tarjetaER(titulo, filas) {
    return '<div class="er-card">' +
      '<div class="er-head">' + titulo + '</div>' +
      filas.map(f => {
        const clase = f[0] === "PK" ? "er-pk" : f[0] === "PK·FK" ? "er-pkfk" : "er-fk";
        return '<div class="er-row"><span class="' + clase + '">' + (f[0] || "") + '</span><span class="font-mono">' + f[1] + '</span></div>';
      }).join("") +
    '</div>';
  }

  function startSession(items, modo, conTimer) {
    clearTimer();
    if (!items || !items.length) return;
    const barajar = modo !== "repaso";
    const preparadas = items.map(it => prepararItem(it, barajar));
    session = { items: preparadas, idx: 0, answers: {}, modo, inicio: Date.now(), finalizada: false, pausado: false };
    show("quiz");
    $("timer-badge").classList.toggle("hidden", !conTimer);
    $("simulacro-badge").classList.toggle("hidden", modo !== "simulacro");
    $("repaso-badge").classList.toggle("hidden", modo !== "repaso");
    $("pause-btn").classList.toggle("hidden", modo !== "simulacro");
    $("pause-overlay").classList.add("hidden");
    renderQuestion();
    if (conTimer) iniciarTimer(20 * 60);
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

  function flashcardsGarantizadas() {
    const items = preguntasReales().map(it =>
      it.tipo === "ordenar" ? Object.assign({}, it, { frenteOrden: it.bloques.slice() }) : it
    );
    if (!items.length) return;
    flash = { items, idx: 0, aciertos: 0, fallos: 0, volteada: false };
    show("flashcards");
    renderFlashcard();
  }

  function renderTiposPanel() {
    const panel = $("tipos-panel");
    if (!panel) return;
    const conteos = {};
    banco.forEach(q => { conteos[q.tipo] = (conteos[q.tipo] || 0) + 1; });
    panel.innerHTML = TIPOS.filter(t => conteos[t]).map(t =>
      '<button class="chip" onclick="practicarTipo(\'' + t + '\')">' + (TIPO_LABELS[t] || t) + ' · ' + conteos[t] + '</button>'
    ).join("");
  }

  function renderQuestion() {
    const item = session.items[session.idx];
    const n = session.items.length;
    $("progress").textContent = "Pregunta " + (session.idx + 1) + " de " + n + " · " + Math.round(((session.idx + 1) / n) * 100) + "%";
    const tb = $("topic-badge");
    tb.textContent = item.tema;
    tb.style.background = TOPIC_COLORS[item.tema] || "#3b82f6";
    tb.style.color = "#0f172a";
    $("type-badge").textContent = (TIPO_LABELS[item.tipo] || item.tipo) + (item.real ? " · 🔥 real" : "");
    const db = $("dif-badge");
    const coloresDif = { facil: ["#065f46", "#a7f3d0"], media: ["#78350f", "#fde68a"], dificil: ["#881337", "#fecdd3"] };
    const cd = coloresDif[item.dificultad] || ["#334155", "#e2e8f0"];
    db.textContent = DIF_LABELS[item.dificultad] || "";
    db.classList.remove("hidden");
    db.style.background = cd[0];
    db.style.color = cd[1];
    $("progress-fill").style.width = ((session.idx / n) * 100) + "%";
    actualizarEstrella(item.id);
    const fb = $("feedback-box");
    fb.style.display = "none";
    fb.className = "feedback hidden";
    $("next-btn").style.display = "none";
    $("skip-btn").style.display = "inline-flex";

    const area = $("question-area");
    if (item.tipo === "dragdrop") renderDragdrop(item, area);
    else if (item.tipo === "ordenar") renderOrdenar(item, area);
    else if (item.tipo === "desarrollo") renderDesarrollo(item, area);
    else if (item.tipo === "relacionar") renderRelacionar(item, area);
    else if (item.tipo === "multi") renderMulti(item, area);
    else renderOpciones(item, area);

    animar(area);
    if (item.tipo === "desarrollo" && session.modo === "simulacro") mostrarBotonSiguiente();
  }

  function renderOpciones(item, area) {
    let html = bloqueCaso(item);
    html += '<div class="text-base sm:text-lg font-semibold leading-relaxed mb-4" id="question-text"></div>';
    if (item.diagrama) html += diagramaER();
    if (item.datos) html += tablaDatos(item.datos);
    if (item.tipo === "codigo" && item.codigo) html += '<pre class="code-block mb-4" id="code-block"></pre>';
    html += '<div class="flex flex-col gap-3" id="options-container"></div>';
    area.innerHTML = html;
    $("question-text").textContent = item.q;
    if (item.tipo === "codigo" && item.codigo) $("code-block").innerHTML = resaltarSQL(item.codigo);
    const cont = $("options-container");
    item.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.className = "option";
      const tecla = item.tipo === "vf" ? (/^verdad/i.test(opt) ? "V" : "F") : String(idx + 1);
      btn.innerHTML = '<span class="opt-key">' + tecla + '</span><span>' + escapar(opt) + '</span>';
      btn.onclick = () => responderOpcion(idx);
      cont.appendChild(btn);
    });
  }

  function responderOpcion(idx) {
    if (session.answers[session.idx]) return;
    const item = session.items[session.idx];
    const buttons = document.querySelectorAll("#options-container .option");
    buttons.forEach(b => b.disabled = true);
    const ok = idx === item.correct;
    if (ok) {
      buttons[idx].classList.add("option-correct");
    } else {
      buttons[idx].classList.add("option-wrong");
      buttons[item.correct].classList.add("option-correct");
      buttons[idx].classList.add("shake");
    }
    session.answers[session.idx] = { ok, selected: item.options[idx], expected: item.options[item.correct] };
    registrarRespuesta(item.id, ok);
    mostrarResultadoPregunta(item, ok);
  }

  function renderMulti(item, area) {
    session.multi = { item, sel: {}, bloqueado: false };
    area.innerHTML =
      bloqueCaso(item) +
      '<div class="text-base sm:text-lg font-semibold leading-relaxed mb-2" id="question-text"></div>' +
      '<p class="text-xs text-sky-300 mb-3">☑ Seleccione una o más de una: marca todas las correctas y luego pulsa Comprobar.</p>' +
      (item.diagrama ? diagramaER() : "") +
      (item.datos ? tablaDatos(item.datos) : "") +
      '<div class="flex flex-col gap-3 mt-4" id="multi-container"></div>' +
      '<div class="mt-4"><button class="btn btn-primary" id="btn-comprobar-multi" onclick="comprobarMulti()">Comprobar</button></div>';
    $("question-text").textContent = item.q;
    pintarMulti();
  }

  function pintarMulti() {
    const e = session.multi;
    if (!e) return;
    $("multi-container").innerHTML = e.item.options.map((opt, idx) => {
      let clase = "option";
      if (e.bloqueado) {
        const esCorrecta = e.item.correctos.indexOf(idx) !== -1;
        const estaSel = !!e.sel[idx];
        if (esCorrecta) clase += " option-correct";
        if (estaSel && !esCorrecta) clase += " option-wrong";
      } else if (e.sel[idx]) {
        clase += " pieza-sel";
      }
      return '<button class="' + clase + '" ' + (e.bloqueado ? "disabled" : "") + ' onclick="toggleMulti(' + idx + ')">' +
        '<span class="opt-key">' + (e.sel[idx] ? "☑" : "☐") + '</span><span>' + escapar(opt) + '</span></button>';
    }).join("");
    const btn = $("btn-comprobar-multi");
    if (btn) btn.disabled = e.bloqueado || Object.keys(e.sel).length === 0;
  }

  function toggleMulti(idx) {
    const e = session.multi;
    if (!e || e.bloqueado || session.answers[session.idx]) return;
    if (e.sel[idx]) delete e.sel[idx];
    else e.sel[idx] = true;
    pintarMulti();
  }

  function comprobarMulti() {
    const e = session.multi;
    if (!e || e.bloqueado || session.answers[session.idx]) return;
    const item = e.item;
    const sel = Object.keys(e.sel).map(Number).sort((a, b) => a - b);
    const ok = sel.length === item.correctos.length && sel.every((v, i) => v === item.correctos[i]);
    e.bloqueado = true;
    pintarMulti();
    session.answers[session.idx] = {
      ok,
      selected: sel.length ? sel.map(i => item.options[i]).join(" + ") : "(ninguna)",
      expected: item.correctos.map(i => item.options[i]).join(" + ")
    };
    registrarRespuesta(item.id, ok);
    mostrarResultadoPregunta(item, ok);
  }

  function mostrarResultadoPregunta(item, ok) {
    if (session.modo !== "simulacro") {
      const fb = $("feedback-box");
      fb.className = "feedback " + (ok ? "feedback-ok" : "feedback-bad");
      fb.innerHTML = '<div class="font-bold mb-2">' +
        (ok ? "✅ ¡Correcto!" : "❌ Incorrecto — la respuesta era: <b>" + escapar(respuestaCorrecta(item)) + "</b>") +
        '</div><div>' + item.exp + '</div>';
      fb.style.display = "block";
    }
    mostrarBotonSiguiente();
  }

  function mostrarBotonSiguiente() {
    const ultima = session.idx === session.items.length - 1;
    const btn = $("next-btn");
    btn.textContent = ultima ? (session.modo === "simulacro" ? "Finalizar simulacro" : "Ver resultados") : "Siguiente";
    btn.style.display = "inline-flex";
    $("skip-btn").style.display = "none";
  }

  function saltarPregunta() {
    if (!session || session.answers[session.idx]) return;
    const item = session.items[session.idx];
    session.answers[session.idx] = { ok: false, skipped: true, selected: "(Sin responder)", expected: respuestaCorrecta(item) };
    if (item.tipo === "dragdrop" && session.drag) {
      session.drag.bloqueado = true;
      pintarDragdrop();
    } else if (item.tipo === "ordenar" && session.orden) {
      session.orden.bloqueado = true;
      pintarOrden();
    } else if (item.tipo === "relacionar" && session.rel) {
      session.rel.bloqueado = true;
      pintarRelacionar();
    } else if (item.tipo === "multi" && session.multi) {
      session.multi.bloqueado = true;
      pintarMulti();
    } else if (item.tipo === "desarrollo" && session.desarrollo) {
      session.desarrollo.evaluada = true;
      const ev = $("dev-eval");
      if (ev) ev.innerHTML = '<span class="text-xs text-slate-400">Pregunta saltada</span>';
    }
    if (session.modo !== "simulacro") {
      const fb = $("feedback-box");
      fb.className = "feedback feedback-neutro";
      fb.innerHTML = '<div class="font-bold mb-2">⏭ Pregunta saltada — la respuesta era: <b>' + escapar(respuestaCorrecta(item)) + '</b></div><div>' + item.exp + '</div>';
      fb.style.display = "block";
    }
    mostrarBotonSiguiente();
  }

  function next() {
    if (!session) return;
    const item = session.items[session.idx];
    if (item.tipo === "desarrollo" && session.modo === "simulacro" && !session.answers[session.idx]) {
      const ta = $("dev-texto");
      const texto = ta ? ta.value : "";
      session.answers[session.idx] = { ok: null, selected: texto || "(sin escribir)", expected: item.solucion, tipo: "desarrollo", texto };
    }
    if (session.idx < session.items.length - 1) {
      session.idx++;
      renderQuestion();
    } else {
      finalizar();
    }
  }

  function salir() {
    if (!confirm("¿Salir? Se perderá el avance de esta ronda.")) return;
    clearTimer();
    session = null;
    $("pause-overlay").classList.add("hidden");
    goHome();
  }

  function toggleMarcadaActual() {
    const item = session.items[session.idx];
    actualizarEstrella(item.id, toggleMarked(item.id));
  }

  function actualizarEstrella(id, estado) {
    const marcada = typeof estado === "boolean" ? estado : obtenerP(id).marked;
    const btn = $("star-btn");
    btn.textContent = marcada ? "★" : "☆";
    btn.classList.toggle("star-on", marcada);
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

  function bloqueCaso(item) {
    return item.caso
      ? '<div class="bg-amber-950/50 border-l-4 border-amber-500 rounded-xl p-3.5 text-xs sm:text-sm text-amber-100 leading-relaxed mb-4"><b>Caso técnico:</b> ' + escapar(item.caso) + '</div>'
      : "";
  }

  function tablaDatos(datos) {
    return datos.map(d =>
      '<div class="my-3"><p class="text-xs font-bold text-slate-400 mb-1 font-mono">' + d.tabla + '</p>' +
        '<div class="overflow-x-auto rounded-xl border border-slate-700"><table class="w-full text-xs">' +
          '<thead><tr class="bg-slate-800">' + d.columnas.map(c => '<th class="px-3 py-1.5 text-left font-mono font-bold text-slate-300">' + c + '</th>').join("") + '</tr></thead>' +
          '<tbody>' + d.filas.map(f => '<tr class="border-t border-slate-800">' + f.map(v => '<td class="px-3 py-1.5 font-mono">' + escapar(v) + '</td>').join("") + '</tr>').join("") + '</tbody>' +
        '</table></div></div>'
    ).join("");
  }

  function renderRelacionar(item, area) {
    session.rel = {
      item,
      pares: item.pares,
      derecha: item.derecha,
      emparejados: new Array(item.pares.length).fill(false),
      usadosDerecha: {},
      seleccion: null,
      errorIdx: null,
      fallos: 0,
      bloqueado: false
    };
    area.innerHTML =
      bloqueCaso(item) +
      '<div class="text-base sm:text-lg font-semibold leading-relaxed mb-3">' + escapar(item.q) + '</div>' +
      (item.diagrama ? diagramaER() : "") +
      (item.datos ? tablaDatos(item.datos) : "") +
      '<p class="text-xs text-slate-400 mb-3">Toca un elemento de la izquierda y luego su pareja de la derecha.</p>' +
      '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">' +
        '<div id="match-izq" class="flex flex-col gap-2"></div>' +
        '<div id="match-der" class="flex flex-col gap-2"></div>' +
      '</div>';
    pintarRelacionar();
  }

  function pintarRelacionar() {
    const e = session.rel;
    $("match-izq").innerHTML = e.pares.map((p, i) => {
      let clase = "match-item";
      if (e.emparejados[i]) clase += " match-ok";
      else if (e.seleccion === i) clase += " match-sel";
      return '<button class="' + clase + '" data-i="' + i + '" ' + (e.emparejados[i] || e.bloqueado ? "disabled" : "") + ' onclick="clickMatchIzq(' + i + ')">' + escapar(p[0]) + '</button>';
    }).join("");
    $("match-der").innerHTML = e.derecha.map(d => {
      const usado = e.usadosDerecha[d.idx] !== undefined;
      let clase = "match-item";
      if (usado) clase += " match-ok";
      if (e.errorIdx === d.idx) clase += " match-err";
      return '<button class="' + clase + '" data-idx="' + d.idx + '" ' + (usado || e.bloqueado ? "disabled" : "") + ' onclick="clickMatchDer(' + d.idx + ')">' + escapar(d.texto) + '</button>';
    }).join("");
  }

  function clickMatchIzq(i) {
    const e = session.rel;
    if (!e || e.bloqueado || e.emparejados[i] || session.answers[session.idx]) return;
    e.seleccion = e.seleccion === i ? null : i;
    e.errorIdx = null;
    pintarRelacionar();
  }

  function clickMatchDer(idx) {
    const e = session.rel;
    if (!e || e.bloqueado || e.usadosDerecha[idx] !== undefined || e.seleccion === null || session.answers[session.idx]) return;
    if (e.seleccion === idx) {
      e.emparejados[e.seleccion] = true;
      e.usadosDerecha[idx] = e.seleccion;
      e.seleccion = null;
      e.errorIdx = null;
      pintarRelacionar();
      if (e.emparejados.every(Boolean)) terminarRelacionar();
    } else {
      e.fallos++;
      e.errorIdx = idx;
      e.seleccion = null;
      pintarRelacionar();
    }
  }

  function terminarRelacionar() {
    const e = session.rel;
    if (!e || session.answers[session.idx] || e.bloqueado) return;
    e.bloqueado = true;
    const item = e.item;
    const ok = e.fallos === 0;
    pintarRelacionar();
    session.answers[session.idx] = {
      ok,
      selected: item.pares.map(p => p[0] + " → " + p[1]).join(" | "),
      expected: item.pares.map(p => p[0] + " → " + p[1]).join(" | ")
    };
    registrarRespuesta(item.id, ok);
    if (session.modo !== "simulacro") {
      const fb = $("feedback-box");
      fb.className = "feedback " + (ok ? "feedback-ok" : "feedback-bad");
      fb.innerHTML = '<div class="font-bold mb-2">' + (ok ? "✅ ¡Todas las parejas correctas!" : "❌ Hubo " + e.fallos + " intento(s) fallido(s)") + '</div><div>' + item.exp + '</div>';
      fb.style.display = "block";
    }
    mostrarBotonSiguiente();
  }

  function renderDragdrop(item, area) {
    session.drag = {
      item,
      piezas: item.piezasRuntime,
      slots: new Array(item.respuestas.length).fill(null),
      seleccion: null,
      resultado: null,
      bloqueado: false
    };
    area.innerHTML =
      bloqueCaso(item) +
      '<div class="text-base sm:text-lg font-semibold leading-relaxed mb-3">' + escapar(item.q) + '</div>' +
      (item.diagrama ? diagramaER() : "") +
      (item.datos ? tablaDatos(item.datos) : "") +
      '<p class="text-xs text-slate-400 mb-3">Arrastra cada pieza a su hueco, o toca una pieza y luego el hueco. Toca un hueco lleno para devolver la pieza.</p>' +
      '<pre class="code-block" id="drag-code"></pre>' +
      '<div id="piezas-pool" class="flex flex-wrap gap-2.5 mt-4 min-h-[44px]"></div>' +
      '<p id="drag-contador" class="text-xs text-slate-400 mt-2"></p>' +
      '<div class="mt-4"><button class="btn btn-primary" id="btn-comprobar" disabled>Comprobar</button></div>';
    const pre = $("drag-code");
    pre.addEventListener("click", e => {
      const h = e.target.closest(".hueco");
      if (h) clickHueco(parseInt(h.dataset.slot, 10));
    });
    pre.addEventListener("dragover", e => {
      if (!session.drag.bloqueado) e.preventDefault();
    });
    pre.addEventListener("drop", e => {
      const h = e.target.closest(".hueco");
      if (h && dragPid && !session.drag.bloqueado) {
        e.preventDefault();
        colocarPieza(dragPid, parseInt(h.dataset.slot, 10));
        dragPid = null;
      }
    });
    const pool = $("piezas-pool");
    pool.addEventListener("click", e => {
      const p = e.target.closest(".pieza");
      if (p) clickPieza(p.dataset.pid);
    });
    $("btn-comprobar").onclick = () => comprobarDragdrop();
    pintarDragdrop();
  }

  function piezaTexto(pid) {
    const p = session.drag.piezas.find(x => x.pid === pid);
    return p ? p.text : "";
  }

  function piezasUsadas() {
    return session.drag.slots.filter(Boolean);
  }

  function pintarDragdrop() {
    const estado = session.drag;
    let html = resaltarSQL(estado.item.codigo);
    html = html.replace(/\{(\d)\}/g, (m, n) => {
      const i = parseInt(n, 10) - 1;
      const pid = estado.slots[i];
      let clase = "hueco";
      if (pid) clase += " hueco-lleno";
      if (estado.resultado) clase += estado.resultado[i] ? " hueco-ok" : " hueco-mal";
      return '<span class="' + clase + '" data-slot="' + i + '">' + (pid ? escapar(piezaTexto(pid)) : "&nbsp;&nbsp;&nbsp;&nbsp;") + '</span>';
    });
    $("drag-code").innerHTML = html;
    const usadas = piezasUsadas();
    const pool = $("piezas-pool");
    pool.innerHTML = estado.piezas.filter(p => usadas.indexOf(p.pid) === -1).map(p =>
      '<div class="pieza' + (estado.seleccion === p.pid ? " pieza-sel" : "") + '" draggable="true" data-pid="' + p.pid + '" ondragstart="iniciarArrastre(event, \'' + p.pid + '\')">' + escapar(p.text) + '</div>'
    ).join("") || '<span class="text-sm text-slate-400">Todas las piezas están colocadas.</span>';
    const contador = $("drag-contador");
    if (contador) {
      contador.textContent = "Huecos: " + usadas.length + " / " + estado.slots.length + " · Piezas en la bandeja: " + (estado.piezas.length - usadas.length);
    }
    $("btn-comprobar").disabled = usadas.length !== estado.slots.length || estado.bloqueado;
  }

  function iniciarArrastre(event, pid) {
    if (session.drag.bloqueado) return;
    dragPid = pid;
    event.dataTransfer.setData("text/plain", pid);
  }

  function clickPieza(pid) {
    if (session.drag.bloqueado) return;
    session.drag.seleccion = session.drag.seleccion === pid ? null : pid;
    pintarDragdrop();
  }

  function clickHueco(i) {
    if (session.drag.bloqueado) return;
    const estado = session.drag;
    if (estado.slots[i]) {
      estado.slots[i] = null;
      estado.seleccion = null;
    } else if (estado.seleccion) {
      colocarPieza(estado.seleccion, i);
      return;
    }
    pintarDragdrop();
  }

  function colocarPieza(pid, i) {
    const estado = session.drag;
    estado.slots.forEach((s, j) => { if (s === pid) estado.slots[j] = null; });
    estado.slots[i] = pid;
    estado.seleccion = null;
    pintarDragdrop();
  }

  function comprobarDragdrop() {
    const estado = session.drag;
    const item = estado.item;
    if (session.answers[session.idx] || estado.bloqueado || piezasUsadas().length !== estado.slots.length) return;
    const seleccion = estado.slots.map(pid => piezaTexto(pid));
    const ok = seleccion.every((t, i) => t === item.respuestas[i]);
    estado.bloqueado = true;
    if (session.modo !== "simulacro") {
      estado.resultado = estado.slots.map((pid, i) => piezaTexto(pid) === item.respuestas[i]);
    }
    pintarDragdrop();
    session.answers[session.idx] = { ok, selected: seleccion.join(" / "), expected: item.respuestas.join(" / ") };
    registrarRespuesta(item.id, ok);
    if (session.modo !== "simulacro") {
      const fb = $("feedback-box");
      fb.className = "feedback " + (ok ? "feedback-ok" : "feedback-bad");
      fb.innerHTML = '<div class="font-bold mb-2">' +
        (ok ? "✅ ¡Correcto!" : "❌ Incorrecto — el orden correcto era: <b>" + escapar(item.respuestas.join(" / ")) + "</b>") +
        '</div><div>' + item.exp + '</div>';
      fb.style.display = "block";
    }
    mostrarBotonSiguiente();
  }

  function renderOrdenar(item, area) {
    session.orden = { item, orden: item.bloquesRuntime.slice(), resultado: null, bloqueado: false };
    area.innerHTML =
      bloqueCaso(item) +
      '<div class="text-base sm:text-lg font-semibold leading-relaxed mb-3">' + escapar(item.q) + '</div>' +
      (item.diagrama ? diagramaER() : "") +
      (item.datos ? tablaDatos(item.datos) : "") +
      '<p class="text-xs text-slate-400 mb-3">Usa ▲▼ o arrastra los bloques hasta lograr el orden correcto.</p>' +
      '<div id="bloques" class="flex flex-col gap-2"></div>' +
      '<div class="mt-4"><button class="btn btn-primary" id="btn-comprobar-orden" onclick="comprobarOrden()">Comprobar</button></div>';
    pintarOrden();
  }

  function pintarOrden() {
    const estado = session.orden;
    $("bloques").innerHTML = estado.orden.map((texto, i) => {
      let clase = "bloque";
      if (estado.resultado) clase += estado.resultado[i] ? " bloque-ok" : " bloque-mal";
      return '<div class="' + clase + '" draggable="' + (estado.bloqueado ? "false" : "true") + '" data-i="' + i + '" ondragstart="iniciarArrastreBloque(event,' + i + ')" ondragover="event.preventDefault()" ondrop="soltarBloque(event,' + i + ')">' +
        '<div class="flex gap-1">' +
          '<button class="btn-mini" onclick="moverBloque(' + i + ',-1)" ' + (i === 0 || estado.bloqueado ? "disabled" : "") + '>▲</button>' +
          '<button class="btn-mini" onclick="moverBloque(' + i + ',1)" ' + (i === estado.orden.length - 1 || estado.bloqueado ? "disabled" : "") + '>▼</button>' +
        '</div>' +
        '<span class="flex-1 min-w-0">' + escapar(texto) + '</span>' +
      '</div>';
    }).join("");
  }

  function moverBloque(i, dir) {
    const estado = session.orden;
    if (estado.bloqueado) return;
    const j = i + dir;
    if (j < 0 || j >= estado.orden.length) return;
    const tmp = estado.orden[i];
    estado.orden[i] = estado.orden[j];
    estado.orden[j] = tmp;
    pintarOrden();
  }

  function iniciarArrastreBloque(event, i) {
    if (session.orden.bloqueado) return;
    dragBloqueIndex = i;
    event.dataTransfer.setData("text/plain", String(i));
  }

  function soltarBloque(event, i) {
    event.preventDefault();
    const estado = session.orden;
    if (estado.bloqueado || dragBloqueIndex === null || dragBloqueIndex === i) return;
    const movido = estado.orden.splice(dragBloqueIndex, 1)[0];
    estado.orden.splice(i, 0, movido);
    dragBloqueIndex = null;
    pintarOrden();
  }

  function comprobarOrden() {
    const estado = session.orden;
    if (!estado || session.answers[session.idx] || estado.bloqueado) return;
    const item = estado.item;
    const ok = estado.orden.every((t, i) => t === item.bloques[i]);
    estado.bloqueado = true;
    if (session.modo !== "simulacro") {
      estado.resultado = estado.orden.map((t, i) => t === item.bloques[i]);
    }
    pintarOrden();
    session.answers[session.idx] = { ok, selected: estado.orden.join(" → "), expected: item.bloques.join(" → ") };
    registrarRespuesta(item.id, ok);
    if (session.modo !== "simulacro") {
      const fb = $("feedback-box");
      fb.className = "feedback " + (ok ? "feedback-ok" : "feedback-bad");
      fb.innerHTML = '<div class="font-bold mb-2">' +
        (ok ? "✅ ¡Correcto!" : "❌ Incorrecto — el orden correcto era:") +
        '</div><ol class="list-decimal list-inside font-mono text-xs mb-3">' + item.bloques.map(b => "<li>" + escapar(b) + "</li>").join("") + '</ol><div>' + item.exp + '</div>';
      fb.style.display = "block";
    }
    mostrarBotonSiguiente();
  }

  function renderDesarrollo(item, area) {
    session.desarrollo = { item, texto: "", revelada: false, evaluada: false };
    area.innerHTML =
      bloqueCaso(item) +
      '<div class="text-base sm:text-lg font-semibold leading-relaxed mb-3">' + escapar(item.q) + '</div>' +
      (item.diagrama ? diagramaER() : "") +
      (item.datos ? tablaDatos(item.datos) : "") +
      '<textarea id="dev-texto" rows="5" placeholder="Escribe tu consulta SQL aquí..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 font-mono text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-blue-500 mb-4"></textarea>' +
      '<div id="dev-solucion" class="hidden"></div>' +
      '<div id="dev-eval" class="flex flex-wrap gap-3 mt-3"></div>' +
      (session.modo === "simulacro" ? "" : '<div class="mt-3" id="dev-ver"><button class="btn btn-secondary" onclick="revelarSolucion()">Ver solución modelo</button></div>');
    const ta = $("dev-texto");
    ta.addEventListener("input", () => { if (session.desarrollo) session.desarrollo.texto = ta.value; });
  }

  function analizarClaves(item, texto) {
    if (!item.claves || !item.claves.length) return "";
    const t = String(texto || "").toUpperCase().replace(/\s+/g, " ");
    const chips = item.claves.map(c => {
      const ok = t.indexOf(c.toUpperCase()) !== -1;
      return '<span class="tag ' + (ok ? "tag-ok" : "tag-bad") + '">' + (ok ? "✓ " : "✗ ") + escapar(c) + '</span>';
    }).join(" ");
    return '<div class="mt-3"><p class="text-xs text-slate-400 mb-2">Elementos que debería incluir tu respuesta:</p><div class="flex flex-wrap gap-2">' + chips + '</div></div>';
  }

  function revelarSolucion() {
    const d = session.desarrollo;
    if (!d || d.revelada) return;
    d.revelada = true;
    const cont = $("dev-solucion");
    cont.innerHTML = '<p class="text-xs uppercase tracking-wide text-slate-400 font-bold mb-2">Solución modelo</p><pre class="code-block">' + resaltarSQL(d.item.solucion) + '</pre>' + analizarClaves(d.item, d.texto);
    cont.classList.remove("hidden");
    const btnVer = $("dev-ver");
    if (btnVer) btnVer.classList.add("hidden");
    $("dev-eval").innerHTML =
      '<button class="btn btn-primary" onclick="autoevaluarDev(true)">Me acerqué</button>' +
      '<button class="btn btn-secondary" onclick="autoevaluarDev(false)">No pude</button>';
  }

  function autoevaluarDev(ok) {
    const d = session.desarrollo;
    if (!d || d.evaluada || session.answers[session.idx]) return;
    d.evaluada = true;
    const item = d.item;
    session.answers[session.idx] = { ok, selected: d.texto || "(sin escribir)", expected: item.solucion, tipo: "desarrollo" };
    registrarRespuesta(item.id, ok);
    $("dev-eval").innerHTML = '<span class="tag ' + (ok ? "tag-ok" : "tag-bad") + '">Autoevaluación: ' + (ok ? "Me acerqué" : "No pude") + '</span>';
    if (session.modo !== "simulacro") {
      const fb = $("feedback-box");
      fb.className = "feedback " + (ok ? "feedback-ok" : "feedback-bad");
      fb.innerHTML = '<div class="font-bold mb-2">' + (ok ? "✅ ¡Bien!" : "❌ Sigue practicando") + '</div><div>' + item.exp + '</div>';
      fb.style.display = "block";
    }
    mostrarBotonSiguiente();
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
    guardarIntento(aciertos, totalCal, session.modo);
    pintarResultados(false);
    show("results");
  }

  function respuestaHTML(item, texto, esCorrecta) {
    if (item.tipo === "relacionar") {
      return '<ul class="flex flex-col gap-1 text-xs sm:text-sm">' + item.pares.map(p => "<li><b>" + escapar(p[0]) + "</b> → " + escapar(p[1]) + "</li>").join("") + '</ul>';
    }
    if (item.tipo === "ordenar" && esCorrecta) {
      return '<ol class="list-decimal list-inside font-mono text-xs flex flex-col gap-1">' + item.bloques.map(b => "<li>" + escapar(b) + "</li>").join("") + '</ol>';
    }
    if (item.tipo === "desarrollo") return '<pre class="code-block">' + escapar(texto) + '</pre>';
    return '<span>' + escapar(texto) + '</span>';
  }

  function pintarResultados(verTodas) {
    if (!session || !session.resultado) return;
    const r = session.resultado;
    const mensaje = r.aciertos === r.totalCal
      ? "¡Perfecto! Dominas todos los conceptos."
      : r.pct >= 70
        ? "¡Muy bien! Repasa las fallas para afinar los detalles."
        : "Buen intento. Lee las explicaciones y repite el repaso.";

    const colorAnillo = r.pct >= 80 ? "#10b981" : r.pct >= 60 ? "#38bdf8" : r.pct >= 40 ? "#fbbf24" : "#f43f5e";
    let html = '<div class="text-center mb-6">' +
      '<div class="score-ring anim-in" style="--pct:' + r.pct + '; --ring-color:' + colorAnillo + '"><div class="score-ring-inner">' + r.pct + '%</div></div>' +
      '<p class="text-base sm:text-lg">Acertaste <b>' + r.aciertos + ' de ' + r.totalCal + '</b> preguntas' + (session.modo === "simulacro" ? " en el simulacro." : session.modo === "repaso" ? " en el RepasoQuiz." : ".") + '</p>' +
      (r.desarrollos.length ? '<p class="text-xs text-slate-400 mt-2">' + r.desarrollos.length + ' pregunta(s) de desarrollo se autoevalúan aparte.</p>' : "") +
      '<p class="text-xs text-slate-400 mt-2">⏱ Tiempo: ' + r.tiempo + '</p>' +
      '<p class="text-slate-400 mt-2 text-sm">' + mensaje + '</p>' +
    '</div>';

    html += '<h3 class="section-title">Desglose por tema</h3><div class="flex flex-col gap-2.5">' +
      Object.keys(r.porTema).map(tema => {
        const d = r.porTema[tema];
        const p = Math.round((d.ok / d.total) * 100);
        return '<div class="topic-row">' +
          '<span class="text-slate-300">' + tema + '</span>' +
          '<div class="topic-bar"><div class="topic-bar-fill" style="width:' + p + '%; background:' + (TOPIC_COLORS[tema] || "#3b82f6") + '"></div></div>' +
          '<span class="topic-score">' + d.ok + '/' + d.total + '</span>' +
        '</div>';
      }).join("") +
    '</div>';

    const lista = verTodas ? r.calificables : r.falladas;
    if (lista.length) {
      html += '<h3 class="section-title">' + (verTodas ? "Todas las preguntas (" + r.calificables.length + ")" : "Preguntas falladas (" + r.falladas.length + ")") + '</h3><div class="flex flex-col gap-3">';
      lista.forEach(item => {
        const i = r.items.indexOf(item);
        const a = session.answers[i];
        const ok = !!(a && a.ok);
        html += '<div class="review-item ' + (ok ? "review-ok" : "review-bad") + '">' +
          '<div class="font-semibold leading-relaxed mb-2">' + escapar(item.q) + '</div>' +
          '<div class="flex items-start gap-2 text-sm mb-1.5"><span class="tag tag-bad mt-0.5">Tu respuesta</span><div class="flex-1 min-w-0">' + respuestaHTML(item, a ? a.selected : "Sin responder", false) + '</div></div>' +
          (ok ? "" : '<div class="flex items-start gap-2 text-sm mb-1.5"><span class="tag tag-ok mt-0.5">Correcta</span><div class="flex-1 min-w-0">' + respuestaHTML(item, a ? a.expected : respuestaCorrecta(item), true) + '</div></div>') +
          '<div class="mt-3 pt-3 border-t border-dashed border-slate-700 text-sm text-slate-300 leading-relaxed">' + item.exp + '</div>' +
        '</div>';
      });
      html += '</div>';
    }

    if (r.desarrollos.length) {
      html += '<h3 class="section-title">Preguntas de desarrollo</h3><div class="flex flex-col gap-3">';
      r.desarrollos.forEach(item => {
        const i = r.items.indexOf(item);
        const a = session.answers[i] || {};
        const pendiente = a.skipped || a.ok === null || a.ok === undefined;
        html += '<div class="review-item review-bad">' +
          '<div class="font-semibold leading-relaxed mb-3">' + escapar(item.q) + '</div>' +
          '<div class="flex items-start gap-2 text-sm mb-2"><span class="tag tag-bad mt-0.5">Tu respuesta</span><div class="flex-1 min-w-0"><pre class="code-block">' + escapar(a.selected || "(sin escribir)") + '</pre></div></div>' +
          '<div class="text-sm mb-2"><span class="tag tag-ok">Solución modelo</span></div>' +
          '<pre class="code-block">' + resaltarSQL(item.solucion) + '</pre>' +
          '<div class="mt-3 text-sm text-slate-300 leading-relaxed">' + item.exp + '</div>' +
          '<div class="mt-3" id="eval-' + item.id + '">' +
            (pendiente
              ? '<p class="text-xs text-slate-400 mb-2">Autoevaluación (no afecta el puntaje):</p><div class="flex gap-3 flex-wrap"><button class="btn btn-primary btn-sm" onclick="autoevaluarResultado(\'' + item.id + '\', true)">Me acerqué</button><button class="btn btn-secondary btn-sm" onclick="autoevaluarResultado(\'' + item.id + '\', false)">No pude</button></div>'
              : '<span class="tag ' + (a.ok ? "tag-ok" : "tag-bad") + '">Autoevaluación: ' + (a.ok ? "Me acerqué" : "No pude") + '</span>') +
          '</div>' +
        '</div>';
      });
      html += '</div>';
    }

    html += '<div class="flex flex-wrap gap-3 justify-center mt-7">' +
      (r.falladas.length ? '<button class="btn btn-primary w-full sm:w-auto" onclick="repetirFalladas()">Repasar solo falladas (' + r.falladas.length + ')</button>' : "") +
      (r.calificables.length ? '<button class="btn btn-secondary w-full sm:w-auto" onclick="pintarResultados(' + !verTodas + ')">' + (verTodas ? "Ver solo falladas" : "Ver todas las preguntas") + '</button>' : "") +
      '<button class="btn btn-secondary w-full sm:w-auto" onclick="repetirMisma()">Repetir ronda</button>' +
      '<button class="btn btn-ghost w-full sm:w-auto" onclick="goHome()">Inicio</button>' +
    '</div>';

    $("screen-results").innerHTML = html;
    animar($("screen-results"));
  }

  function autoevaluarResultado(id, ok) {
    const i = session.items.findIndex(it => it.id === id);
    if (i >= 0 && session.answers[i]) session.answers[i].ok = ok;
    registrarRespuesta(id, ok);
    const cont = $("eval-" + id);
    if (cont) cont.innerHTML = '<span class="tag ' + (ok ? "tag-ok" : "tag-bad") + '">Autoevaluación: ' + (ok ? "Me acerqué" : "No pude") + '</span>';
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

  function renderHistory() {
    const historial = cargarHistorial();
    const box = $("history-section");
    if (!historial.length) {
      box.innerHTML = '<p class="text-sm text-slate-400">Aún no hay intentos registrados. ¡Empieza con una práctica o el simulacro!</p>';
      return;
    }
    const mejor = Math.max.apply(null, historial.map(h => h.score / h.total));
    box.innerHTML = historial.slice(0, 6).map(h => {
      const pct = Math.round((h.score / h.total) * 100);
      const d = new Date(h.date);
      const fecha = d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" }) +
        " · " + d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
      const esRepaso = h.modo === "repaso";
      const esSim = h.modo === "simulacro" || esRepaso;
      const modo = esRepaso ? "RepasoQuiz" : esSim ? "Simulacro" : "Práctica";
      return '<div class="history-row' + (h.score / h.total === mejor ? " history-best" : "") + '">' +
        '<span class="text-slate-400">' + fecha + '</span>' +
        '<span class="tag tag-' + (esSim ? "simulacro" : "practica") + ' hidden sm:inline-flex">' + modo + '</span>' +
        '<span>' + h.score + '/' + h.total + '</span>' +
        '<span class="text-sky-400 font-bold">' + pct + '%</span>' +
      '</div>';
    }).join("");
  }

  function tarjetaStat(valor, etiqueta, color) {
    return '<div class="stat-card"><div class="stat-value" style="color:' + (color || "#38bdf8") + '">' + valor + '</div><div class="stat-label">' + etiqueta + '</div></div>';
  }

  function renderStats() {
    if (!materia) return;
    if (!banco.length) {
      $("stat-total").textContent = "0";
      $("stat-parciales").textContent = "0";
      $("stat-temas").textContent = "0";
      $("stats-panel").innerHTML = '<div class="bg-slate-900 border border-slate-700 rounded-xl p-4 my-5 text-sm text-amber-200">🚧 Contenido en preparación: esta materia todavía no tiene preguntas. Vuelve pronto.</div>';
      const bd = $("btn-debiles");
      const bv = $("btn-vencidas");
      if (bd) bd.classList.add("hidden");
      if (bv) bv.classList.add("hidden");
      return;
    }
    let ok = 0, fail = 0, respondidas = 0, debiles = 0;
    banco.forEach(q => {
      const p = obtenerP(q.id);
      ok += p.ok;
      fail += p.fail;
      if (p.ok + p.fail > 0) respondidas++;
      if (esDebil(p)) debiles++;
    });
    const precision = (ok + fail) ? Math.round((ok / (ok + fail)) * 100) : 0;
    const historial = cargarHistorial();
    const mejor = historial.length ? Math.max.apply(null, historial.map(h => Math.round((h.score / h.total) * 100))) : null;
    const actividad = cargarActividad();
    const racha = calcularRacha(actividad);
    const hoy = actividad[hoyISO()] || 0;
    const meta = cargarMeta();
    const pctMeta = Math.min(100, Math.round((hoy / meta) * 100));

    let html = '<div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">' +
      tarjetaStat(precision + "%", "Precisión global", "#38bdf8") +
      tarjetaStat(respondidas + " / " + banco.length, "Respondidas", "#a78bfa") +
      tarjetaStat(racha + " 🔥", "Racha (días)", "#fbbf24") +
      tarjetaStat(mejor === null ? "—" : mejor + "%", "Mejor puntaje", "#34d399") +
    '</div>';

    html += '<div class="bg-slate-900 border border-slate-700 rounded-xl p-4 my-5">' +
      '<div class="flex items-center justify-between gap-3 flex-wrap">' +
        '<span class="text-sm font-semibold text-slate-300">🎯 Meta de hoy</span>' +
        '<label class="text-xs text-slate-400 flex items-center gap-2">meta diaria:' +
          '<input id="meta-input" type="number" min="1" value="' + meta + '" onchange="cambiarMeta(this.value)" class="stat-input">' +
        '</label>' +
      '</div>' +
      '<div class="progress-track mt-3 mb-2"><div class="progress-fill" style="width:' + pctMeta + '%"></div></div>' +
      '<p class="text-xs text-slate-400">' + hoy + ' de ' + meta + ' preguntas hoy · racha de ' + racha + ' día(s) · ' + debiles + ' débil(es) por repasar</p>' +
    '</div>';

    html += '<h3 class="section-title">Evolución</h3>' +
      '<div id="grafica-wrap" class="hidden"><canvas id="grafica" class="w-full h-48 bg-slate-900 border border-slate-700 rounded-xl"></canvas></div>' +
      '<p id="grafica-vacia" class="text-sm text-slate-400">Completa al menos 2 rondas para ver tu evolución.</p>';

    const temas = [...new Set(banco.map(q => q.tema))];
    let hayAvance = false;
    let filas = "";
    temas.forEach(t => {
      const qs = banco.filter(q => q.tema === t);
      let tOk = 0, tFail = 0;
      qs.forEach(q => { const p = obtenerP(q.id); tOk += p.ok; tFail += p.fail; });
      if (tOk + tFail > 0) hayAvance = true;
      const pct = (tOk + tFail) ? Math.round((tOk / (tOk + tFail)) * 100) : 0;
      filas += '<div class="topic-row">' +
        '<span class="text-slate-300">' + t + '</span>' +
        '<div class="topic-bar"><div class="topic-bar-fill" style="width:' + pct + '%; background:' + (TOPIC_COLORS[t] || "#3b82f6") + '"></div></div>' +
        '<span class="topic-score">' + pct + '%</span>' +
      '</div>';
    });
    html += '<h3 class="section-title">Avance por tema</h3>' +
      (hayAvance ? '<div class="flex flex-col gap-2.5">' + filas + '</div>' : '<p class="text-sm text-slate-400">Responde preguntas para ver tu avance.</p>');

    let filasDif = "";
    ["facil", "media", "dificil"].forEach(d => {
      const qs = banco.filter(q => q.dificultad === d);
      let tOk = 0, tFail = 0;
      qs.forEach(q => { const p = obtenerP(q.id); tOk += p.ok; tFail += p.fail; });
      const pctD = (tOk + tFail) ? Math.round((tOk / (tOk + tFail)) * 100) : 0;
      const color = d === "facil" ? "#34d399" : d === "media" ? "#fbbf24" : "#f87171";
      filasDif += '<div class="topic-row">' +
        '<span class="text-slate-300">' + (DIF_LABELS[d] || d) + '</span>' +
        '<div class="topic-bar"><div class="topic-bar-fill" style="width:' + pctD + '%; background:' + color + '"></div></div>' +
        '<span class="topic-score">' + pctD + '%</span>' +
      '</div>';
    });
    html += '<h3 class="section-title">Avance por dificultad</h3>' +
      (hayAvance ? '<div class="flex flex-col gap-2.5">' + filasDif + '</div>' : '<p class="text-sm text-slate-400">Responde preguntas para ver tu avance.</p>');

    const peores = banco.map(q => ({ q, fail: obtenerP(q.id).fail })).filter(x => x.fail > 0).sort((a, b) => b.fail - a.fail).slice(0, 5);
    if (peores.length) {
      html += '<h3 class="section-title">Más falladas</h3><div class="flex flex-col gap-2">';
      peores.forEach(x => {
        html += '<div class="peor-row"><span class="flex-1 text-slate-300 leading-snug">' + escapar(x.q.length > 95 ? x.q.slice(0, 95) + "…" : x.q) + '</span><span class="text-rose-300 font-bold whitespace-nowrap">' + x.fail + ' fallo' + (x.fail > 1 ? "s" : "") + '</span></div>';
      });
      html += '</div>';
    }

    $("stats-panel").innerHTML = html;
    const nParciales = new Set(banco.map(q => q.parcial)).size;
    $("stat-total").textContent = banco.length;
    $("stat-parciales").textContent = nParciales;
    $("stat-parciales-txt").textContent = nParciales === 1 ? "parcial" : "parciales";
    $("stat-temas").textContent = new Set(banco.map(q => q.tema)).size;
    const vencidasCount = banco.filter(q => vencida(obtenerP(q.id))).length;
    const btnVencidas = $("btn-vencidas");
    if (btnVencidas) {
      btnVencidas.classList.toggle("hidden", !vencidasCount);
      btnVencidas.textContent = "⏰ Repaso espaciado (" + vencidasCount + ")";
    }
    $("btn-debiles").classList.toggle("hidden", !debiles);
    dibujarGrafica();
  }

  function dibujarGrafica() {
    const canvas = $("grafica");
    const wrap = $("grafica-wrap");
    const vacia = $("grafica-vacia");
    if (!canvas) return;
    const historial = cargarHistorial().slice(0, 12).reverse();
    if (historial.length < 2) {
      if (wrap) wrap.classList.add("hidden");
      if (vacia) vacia.classList.remove("hidden");
      return;
    }
    if (wrap) wrap.classList.remove("hidden");
    if (vacia) vacia.classList.add("hidden");
    const dpr = window.devicePixelRatio || 1;
    const ancho = canvas.clientWidth || 600;
    const alto = 180;
    canvas.width = ancho * dpr;
    canvas.height = alto * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, ancho, alto);
    const pad = 32;
    const datos = historial.map(h => Math.round((h.score / h.total) * 100));
    const x = i => pad + (i * (ancho - pad * 2)) / (datos.length - 1);
    const y = v => alto - pad - (v / 100) * (alto - pad * 2);
    ctx.font = "10px sans-serif";
    [0, 50, 100].forEach(v => {
      ctx.strokeStyle = "#334155";
      ctx.beginPath();
      ctx.moveTo(pad, y(v));
      ctx.lineTo(ancho - pad, y(v));
      ctx.stroke();
      ctx.fillStyle = "#64748b";
      ctx.fillText(v + "%", 4, y(v) + 3);
    });
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    datos.forEach((v, i) => { i ? ctx.lineTo(x(i), y(v)) : ctx.moveTo(x(i), y(v)); });
    ctx.stroke();
    ctx.fillStyle = "#38bdf8";
    datos.forEach((v, i) => {
      ctx.beginPath();
      ctx.arc(x(i), y(v), 3, 0, Math.PI * 2);
      ctx.fill();
    });
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
      return '<button class="mode-card" onclick="seleccionarMateria(\'' + m.id + '\')" style="border-left:4px solid ' + m.color + '">' +
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

  let apunteTema = "todos";

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
      return '<button class="chip' + (apunteTema === t ? " chip-on" : "") + '" onclick="cambiarApunteTema(\'' + t + '\')">' +
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
    renderTip();
  }

  function startStudy() {
    estudioTipo = "todos";
    estudioSoloReales = false;
    renderStudy("");
    const search = $("study-search");
    if (search) search.value = "";
    renderStudyFiltros();
    show("study");
  }

  function toggleEstudioReales() {
    estudioSoloReales = !estudioSoloReales;
    renderStudy($("study-search").value);
    renderStudyFiltros();
  }

  function estudioGarantizadas() {
    startStudy();
    estudioSoloReales = true;
    renderStudy("");
    renderStudyFiltros();
  }

  function renderStudyFiltros() {
    const cont = $("study-filtros");
    if (!cont) return;
    const tipos = ["todos"].concat(TIPOS);
    let html = tipos.map(t => {
      const etiqueta = t === "todos" ? "Todos" : (TIPO_LABELS[t] || t);
      const cuenta = t === "todos" ? banco.length : banco.filter(q => q.tipo === t).length;
      return '<button class="chip' + (estudioTipo === t ? " chip-on" : "") + '" onclick="cambiarEstudioTipo(\'' + t + '\')">' + etiqueta + ' · ' + cuenta + '</button>';
    }).join("");
    const nReales = banco.filter(q => q.real).length;
    if (nReales) {
      html += '<button class="chip' + (estudioSoloReales ? " chip-on" : "") + '" onclick="toggleEstudioReales()">🔥 Garantizadas · ' + nReales + '</button>';
    }
    cont.innerHTML = html;
  }

  function cambiarEstudioTipo(tipo) {
    estudioTipo = tipo;
    renderStudy($("study-search").value);
    renderStudyFiltros();
  }

  function respuestaEstudio(item) {
    if (item.tipo === "dragdrop") return '<div class="study-answer">' + escapar(item.respuestas.join("  |  ")) + '</div>';
    if (item.tipo === "relacionar") return '<ul class="flex flex-col gap-1 text-xs sm:text-sm bg-emerald-900/40 border border-emerald-700 rounded-xl p-3 mb-3">' + item.pares.map(p => "<li><b>" + escapar(p[0]) + "</b> → " + escapar(p[1]) + "</li>").join("") + '</ul>';
    if (item.tipo === "ordenar") return '<ol class="list-decimal list-inside flex flex-col gap-1 font-mono text-xs sm:text-sm bg-emerald-900/40 border border-emerald-700 rounded-xl p-3 mb-3">' + item.bloques.map(b => '<li>' + escapar(b) + '</li>').join("") + '</ol>';
    if (item.tipo === "desarrollo") return '<pre class="code-block mb-3">' + resaltarSQL(item.solucion) + '</pre>';
    if (item.tipo === "multi") {
      return '<div class="flex flex-col gap-2 mb-3">' + item.options.map((o, j) => {
        const esOk = item.correctos.indexOf(j) !== -1;
        return '<div class="study-option' + (esOk ? " study-option-ok" : "") + '">' + (esOk ? "✔ " : "✗ ") + escapar(o) + '</div>';
      }).join("") + '</div>';
    }
    return '<div class="flex flex-col gap-2 mb-3">' + item.options.map((o, j) => '<div class="study-option' + (j === item.correct ? " study-option-ok" : "") + '">' + escapar(o) + '</div>').join("") + '</div>';
  }

  function renderStudy(filtro) {
    const f = String(filtro || "").trim().toLowerCase();
    const lista = banco.filter(item => {
      if (estudioTipo !== "todos" && item.tipo !== estudioTipo) return false;
      if (estudioSoloReales && !item.real) return false;
      if (!f) return true;
      const campos = [item.q, item.exp || "", item.codigo || "", item.tema, item.parcial, item.caso || "", (item.options || []).join(" "), (item.respuestas || []).join(" "), (item.bloques || []).join(" "), item.solucion || "", (item.pares || []).map(p => p[0] + " " + p[1]).join(" "), (item.claves || []).join(" ")];
      return campos.join(" ").toLowerCase().includes(f);
    });
    $("study-list").innerHTML = lista.map(item => {
      const marcada = obtenerP(item.id).marked;
      const codigo = item.codigo && item.tipo === "dragdrop" ? item.codigo.replace(/\{\d\}/g, "____") : item.codigo;
      return '<div class="study-item" id="study-' + item.id + '">' +
        '<div class="flex items-center justify-between gap-2 flex-wrap mb-2">' +
          '<div class="flex items-center gap-2 flex-wrap">' +
            '<span class="badge" style="background:' + (TOPIC_COLORS[item.tema] || "#3b82f6") + '; color:#0f172a">' + item.tema + '</span>' +
            '<span class="text-xs text-slate-400">' + item.parcial + ' · ' + (TIPO_LABELS[item.tipo] || item.tipo) + ' · ' + (DIF_LABELS[item.dificultad] || "") + (item.real ? ' · <b class="text-amber-300">🔥 garantizada</b>' : "") + '</span>' +
          '</div>' +
          '<button class="star-btn' + (marcada ? " star-on" : "") + '" onclick="toggleMarcadaEstudio(\'' + item.id + '\')">' + (marcada ? "★" : "☆") + '</button>' +
        '</div>' +
        bloqueCaso(item) +
        '<div class="font-semibold leading-relaxed mb-3">' + escapar(item.q) + '</div>' +
        (item.diagrama ? diagramaER() : "") +
        (item.datos ? tablaDatos(item.datos) : "") +
        (codigo && item.tipo !== "dragdrop" ? '<pre class="code-block mb-3">' + resaltarSQL(codigo) + '</pre>' : "") +
        (codigo && item.tipo === "dragdrop" ? '<pre class="code-block mb-3">' + resaltarSQL(codigo) + '</pre>' : "") +
        '<div class="oculto">' + respuestaEstudio(item) + '<div class="study-exp">' + item.exp + '</div></div>' +
        '<button class="btn btn-secondary btn-sm mt-3" onclick="toggleStudy(this)">Mostrar respuesta</button>' +
      '</div>';
    }).join("") || '<p class="text-sm text-slate-400">Sin resultados para esa búsqueda.</p>';
    const contador = $("study-count");
    if (contador) contador.textContent = lista.length + " pregunta(s) encontradas";
  }

  function toggleStudy(btn) {
    const item = btn.closest(".study-item");
    const revealed = item.classList.toggle("revealed");
    btn.textContent = revealed ? "Ocultar respuesta" : "Mostrar respuesta";
  }

  function toggleMarcadaEstudio(id) {
    toggleMarked(id);
    renderStudy($("study-search").value);
  }

  let glosarioCat = "todas";

  function renderTip() {
    const cont = $("tip-dia");
    if (!cont) return;
    if (!glosario.tips || !glosario.tips.length) { cont.innerHTML = ""; return; }
    const tip = glosario.tips[Math.floor(Math.random() * glosario.tips.length)];
    cont.innerHTML = '<div class="bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-slate-300 leading-relaxed"><b class="text-amber-300">💡 Tip:</b> ' + tip + '</div>';
  }

  function startGlosario() {
    glosarioCat = "todas";
    renderGlosario("");
    const s = $("glosario-search");
    if (s) s.value = "";
    renderGlosarioFiltros();
    show("glosario");
  }

  function renderGlosarioFiltros() {
    const cont = $("glosario-filtros");
    if (!cont) return;
    const cats = [{ id: "todas", corto: "Todas", nombre: "Todas" }].concat(glosario.categorias);
    cont.innerHTML = cats.map(c => {
      const cuenta = c.id === "todas" ? glosario.terminos.length : glosario.terminos.filter(t => t.categoria === c.id).length;
      return '<button class="chip' + (glosarioCat === c.id ? " chip-on" : "") + '" onclick="cambiarGlosarioCat(\'' + c.id + '\')">' + (c.corto || c.nombre) + ' · ' + cuenta + '</button>';
    }).join("");
  }

  function cambiarGlosarioCat(id) {
    glosarioCat = id;
    const s = $("glosario-search");
    renderGlosario(s ? s.value : "");
    renderGlosarioFiltros();
  }

  function renderGlosario(filtro) {
    const f = String(filtro || "").trim().toLowerCase();
    const lista = glosario.terminos.filter(t =>
      (glosarioCat === "todas" || t.categoria === glosarioCat) &&
      (!f || (t.termino + " " + t.definicion + " " + (t.ejemplo || "")).toLowerCase().includes(f))
    );
    $("glosario-list").innerHTML = lista.map(t => {
      const cat = glosario.categorias.find(c => c.id === t.categoria) || { nombre: t.categoria, color: "#3b82f6" };
      return '<div class="glosario-item mb-3">' +
        '<div class="flex items-center gap-2 flex-wrap mb-1.5">' +
          '<span class="badge" style="background:' + cat.color + ';color:#0f172a">' + escapar(cat.nombre) + '</span>' +
          '<span class="font-bold text-sky-300 font-mono">' + escapar(t.termino) + '</span>' +
        '</div>' +
        '<p class="text-sm text-slate-300 leading-relaxed">' + escapar(t.definicion) + '</p>' +
        (t.ejemplo ? '<pre class="code-block mt-2.5">' + resaltarSQL(t.ejemplo) + '</pre>' : '') +
      '</div>';
    }).join("") || '<p class="text-sm text-slate-400">Sin resultados para esa búsqueda.</p>';
    const cont = $("glosario-count");
    if (cont) cont.textContent = lista.length + " término(s)";
  }

  function startFlashcards() {
    const items = priorizar(banco).map(it =>
      it.tipo === "ordenar" ? Object.assign({}, it, { frenteOrden: shuffle(it.bloques) }) : it
    );
    flash = { items, idx: 0, aciertos: 0, fallos: 0, volteada: false };
    show("flashcards");
    renderFlashcard();
  }

  function renderFlashcard() {
    if (!flash) return;
    const cont = $("flash-area");
    if (flash.idx >= flash.items.length) {
      cont.innerHTML =
        '<div class="flash-card text-center">' +
          '<div class="text-4xl mb-3">🎉</div>' +
          '<h2 class="text-xl font-bold mb-2">Ronda de flashcards terminada</h2>' +
          '<p class="text-slate-300 mb-1">✅ Sabías: <b>' + flash.aciertos + '</b></p>' +
          '<p class="text-slate-300 mb-6">❌ No sabías: <b>' + flash.fallos + '</b></p>' +
          '<div class="flex flex-wrap gap-3 justify-center">' +
            '<button class="btn btn-primary" onclick="startFlashcards()">Otra ronda</button>' +
            '<button class="btn btn-ghost" onclick="goHome()">Inicio</button>' +
          '</div>' +
        '</div>';
      return;
    }
    const item = flash.items[flash.idx];
    let frente = bloqueCaso(item) + '<div class="text-xs uppercase tracking-wide text-slate-400 font-bold mb-3">' + item.parcial + ' · ' + item.tema + ' · ' + (TIPO_LABELS[item.tipo] || item.tipo) + '</div>' +
      '<div class="text-base sm:text-lg font-semibold leading-relaxed">' + escapar(item.q) + '</div>';
    if (item.datos) frente += tablaDatos(item.datos);
    if (item.codigo && item.tipo === "codigo") frente += '<pre class="code-block mt-4">' + resaltarSQL(item.codigo) + '</pre>';
    if (item.codigo && item.tipo === "dragdrop") frente += '<pre class="code-block mt-4">' + resaltarSQL(item.codigo.replace(/\{\d\}/g, "____")) + '</pre>';
    if (item.tipo === "ordenar") frente += '<div class="mt-4 flex flex-col gap-2">' + (item.frenteOrden || shuffle(item.bloques)).map(b => '<div class="bloque">' + escapar(b) + '</div>').join("") + '</div>';

    let reves = "";
    if (flash.volteada) {
      reves = '<hr class="border-slate-700 my-4">' + respuestaEstudio(item) + '<div class="study-exp">' + item.exp + '</div>';
    }

    cont.innerHTML =
      '<div class="flex items-center justify-between mb-4 flex-wrap gap-2 text-sm text-slate-400">' +
        '<span>Tarjeta ' + (flash.idx + 1) + ' de ' + flash.items.length + '</span>' +
        '<span>✅ ' + flash.aciertos + ' · ❌ ' + flash.fallos + '</span>' +
      '</div>' +
      '<div class="flash-card">' + frente + reves + '</div>' +
      '<div class="mt-5 flex flex-col sm:flex-row gap-3">' +
        (flash.volteada
          ? '<button class="btn btn-primary flex-1" onclick="responderFlash(true)">Sabía</button>' +
            '<button class="btn btn-secondary flex-1" onclick="responderFlash(false)">No sabía</button>'
          : '<button class="btn btn-primary flex-1" onclick="voltearFlash()">Voltear</button>') +
        '<button class="btn btn-ghost" onclick="saltarFlash()">Saltar</button>' +
      '</div>';
  }

  function voltearFlash() {
    flash.volteada = true;
    renderFlashcard();
  }

  function responderFlash(ok) {
    const item = flash.items[flash.idx];
    registrarRespuesta(item.id, ok);
    if (ok) flash.aciertos++;
    else flash.fallos++;
    flash.idx++;
    flash.volteada = false;
    renderFlashcard();
  }

  function saltarFlash() {
    flash.idx++;
    flash.volteada = false;
    renderFlashcard();
  }

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
      if (n >= 1 && n <= item.options.length) toggleMulti(n - 1);
      return;
    }
    if (!["multiple", "vf", "codigo"].includes(item.tipo)) return;
    if (item.tipo === "vf") {
      const k = e.key.toLowerCase();
      if (k === "v" || k === "f") {
        const j = item.options.findIndex(o => (/^verdad/i.test(o) ? "v" : "f") === k);
        if (j >= 0) responderOpcion(j);
        return;
      }
    }
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= item.options.length) responderOpcion(n - 1);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && session && session.modo === "simulacro" && !session.pausado && !session.finalizada) {
      alternarPausa();
    }
  });

  migrarClavesLegacy(localStorage);
  renderMaterias();
  show("materias");
// Puente de funciones para atributos inline (onclick, onchange, ...):
// este script es un modulo ES y las funciones no son globales por defecto.
Object.assign(window, {
  actualizarResumen,
  alternarPausa,
  autoevaluarDev,
  autoevaluarResultado,
  cambiarEstudioTipo,
  cambiarGlosarioCat,
  cambiarMeta,
  clearHistory,
  clickMatchDer,
  clickMatchIzq,
  comenzarPractica,
  comenzarSimulacro,
  comprobarMulti,
  comprobarOrden,
  estudioGarantizadas,
  exportarDatos,
  flashcardsGarantizadas,
  goHome,
  importarDatos,
  iniciarArrastre,
  iniciarArrastreBloque,
  iniciarRepasoQuiz,
  irConfig,
  irRepaso,
  moverBloque,
  next,
  pintarResultados,
  practicarArrastre,
  practicarCasos,
  practicarDebiles,
  practicarTipo,
  practicarVencidas,
  renderGlosario,
  renderStudy,
  repetirFalladas,
  repetirMisma,
  resetProgreso,
  responderFlash,
  revelarSolucion,
  salir,
  saltarFlash,
  saltarPregunta,
  shuffle,
  soltarBloque,
  startFlashcards,
  startGlosario,
  startStudy,
  toggleEstudioReales,
  toggleFiltro,
  toggleFiltroTodos,
  toggleMarcadaActual,
  toggleMarcadaEstudio,
  toggleMulti,
  toggleStudy,
  irMaterias,
  seleccionarMateria,
  usarTodas,
  voltearFlash,
  startApuntes,
  renderApuntes,
  cambiarApunteTema
});
