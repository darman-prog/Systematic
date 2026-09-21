// Render e interacción de la pantalla de quiz (los 8 tipos de pregunta).
// Recibe el estado de la app vía `ctx` (session/banco como getters) y callbacks para
// persistencia y acciones; no lee localStorage ni importa datos de materias.
import { respuestaCorrecta } from "../../core/sesiones.js";
import {
  TIPO_LABELS, DIF_LABELS,
  animar, bloqueCaso, colorTema, diagramaER, escapar, resaltarSQL, seccionesCorreccion, sqlKeywordsDe, tablaDatos
} from "../helpers.js";
import { evaluarDiagrama, normalizarClave, planCorreccion, resumenDiagrama } from "../../core/diagramas.js";
import { icono } from "../iconos.js";
import { crearDiagramasUI } from "../componentes/diagramas.js";

const $ = id => document.getElementById(id);

export function crearQuizUI({ ctx, obtenerP, registrarRespuesta, toggleMarked }) {
  let dragPid = null;
  let dragBloqueIndex = null;
  const keywords = () => sqlKeywordsDe(ctx.materia);
  const diagramas = crearDiagramasUI({
    ctx,
    guardarEstado: () => {}
  });

  function renderQuestion() {
    const session = ctx.session;
    const item = session.items[session.idx];
    const n = session.items.length;
    $("progress").textContent = "Pregunta " + (session.idx + 1) + " de " + n + " · " + Math.round(((session.idx + 1) / n) * 100) + "%";
    // Meta-línea calmada (spec 005/006): el tema lleva un punto de color y el resto es texto;
    // la dificultad es texto con tinte semántico de la paleta, nunca un resaltado.
    $("topic-dot").style.background = colorTema(ctx.materia, item.tema);
    $("topic-badge").textContent = item.tema;
    $("type-badge").textContent = TIPO_LABELS[item.tipo] || item.tipo;
    const etiquetaDif = DIF_LABELS[item.dificultad] || "";
    const tinteDif = { facil: "var(--study-success)", media: "var(--study-warning)", dificil: "var(--study-error)" };
    $("dif-badge").classList.toggle("hidden", !etiquetaDif);
    if (etiquetaDif) {
      const dt = $("dif-texto");
      dt.textContent = etiquetaDif;
      dt.style.color = tinteDif[item.dificultad] || "var(--study-muted)";
    }
    $("progress-fill").style.width = ((session.idx / n) * 100) + "%";
    actualizarEstrella(item.id);
    const fb = $("feedback-box");
    fb.style.display = "none";
    fb.className = "feedback hidden";
    $("next-btn").style.display = "none";
    $("skip-btn").style.display = "inline-flex";

    const area = $("question-area");
    if (item.tipo === "diagrama") renderDiagramaPregunta(item, area);
    else if (item.tipo === "dragdrop") renderDragdrop(item, area);
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
    if (item.tipo === "codigo" && item.codigo) $("code-block").innerHTML = resaltarSQL(item.codigo, keywords());
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
    const session = ctx.session;
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
    const session = ctx.session;
    session.multi = { item, sel: {}, bloqueado: false };
    area.innerHTML =
      bloqueCaso(item) +
      '<div class="text-base sm:text-lg font-semibold leading-relaxed mb-2" id="question-text"></div>' +
      '<p class="text-xs text-sky-300 mb-3">Seleccione una o más de una: marca todas las correctas y luego pulsa Comprobar.</p>' +
      (item.diagrama ? diagramaER() : "") +
      (item.datos ? tablaDatos(item.datos) : "") +
      '<div class="flex flex-col gap-3 mt-4" id="multi-container"></div>' +
      '<div class="mt-4"><button class="btn btn-primary" id="btn-comprobar-multi" data-action="comprobarMulti">Comprobar</button></div>';
    $("question-text").textContent = item.q;
    pintarMulti();
  }

  function pintarMulti() {
    const session = ctx.session;
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
      return '<button class="' + clase + '" ' + (e.bloqueado ? "disabled" : "") + ' data-action="toggleMulti" data-idx="' + idx + '">' +
        '<span class="opt-key">' + (e.sel[idx] ? "☑" : "☐") + '</span><span>' + escapar(opt) + '</span></button>';
    }).join("");
    const btn = $("btn-comprobar-multi");
    if (btn) btn.disabled = e.bloqueado || Object.keys(e.sel).length === 0;
  }

  function toggleMulti(idx) {
    const session = ctx.session;
    const e = session.multi;
    if (!e || e.bloqueado || session.answers[session.idx]) return;
    if (e.sel[idx]) delete e.sel[idx];
    else e.sel[idx] = true;
    pintarMulti();
  }

  function comprobarMulti() {
    const session = ctx.session;
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
    const session = ctx.session;
    if (session.modo !== "simulacro") {
      const fb = $("feedback-box");
      fb.className = "feedback " + (ok ? "feedback-ok" : "feedback-bad");
      fb.innerHTML = '<div class="font-bold mb-2">' +
        (ok ? icono("check", "icono-sm") + " ¡Correcto!" : icono("cruz", "icono-sm") + " Incorrecto — la respuesta era: <b>" + escapar(respuestaCorrecta(item)) + "</b>") +
        '</div><div>' + item.exp + '</div>';
      fb.style.display = "block";
    }
    mostrarBotonSiguiente();
  }

  function mostrarBotonSiguiente() {
    const session = ctx.session;
    const ultima = session.gameOver || session.idx === session.items.length - 1;
    const btn = $("next-btn");
    btn.textContent = ultima ? (session.modo === "simulacro" ? "Finalizar simulacro" : "Ver resultados") : "Siguiente";
    btn.style.display = "inline-flex";
    $("skip-btn").style.display = "none";
  }

  // Indicador de vidas y combo del modo Supervivencia.
  function pintarVidas() {
    const session = ctx.session;
    const badge = $("vidas-badge");
    if (!badge || !session || session.modo !== "supervivencia") return;
    badge.innerHTML = icono("supervivencia", "icono-sm").repeat(Math.max(0, session.vidas)) + "<span> · combo " + session.combo + "</span>";
  }

  // Fin del tiempo en Contrarreloj: cuenta como fallo y revela la respuesta.
  function expirarPregunta() {
    const session = ctx.session;
    if (!session || session.finalizada || session.answers[session.idx]) return;
    const item = session.items[session.idx];
    session.answers[session.idx] = { ok: false, timeout: true, selected: "(Tiempo agotado)", expected: respuestaCorrecta(item) };
    registrarRespuesta(item.id, false);
    const fb = $("feedback-box");
    fb.className = "feedback feedback-bad";
    fb.innerHTML = '<div class="font-bold mb-2 flex items-center gap-2">' + icono("reloj", "icono-sm") + "<span>Tiempo agotado — la respuesta era: <b>" + escapar(respuestaCorrecta(item)) + "</b></span></div><div>" + item.exp + "</div>";
    fb.style.display = "block";
    mostrarBotonSiguiente();
  }

  function saltarPregunta() {
    const session = ctx.session;
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

  function toggleMarcadaActual() {
    const session = ctx.session;
    const item = session.items[session.idx];
    actualizarEstrella(item.id, toggleMarked(item.id));
  }

  function actualizarEstrella(id, estado) {
    const marcada = typeof estado === "boolean" ? estado : obtenerP(id).marked;
    const btn = $("star-btn");
    btn.textContent = marcada ? "★" : "☆";
    btn.classList.toggle("star-on", marcada);
  }

  function renderRelacionar(item, area) {
    const session = ctx.session;
    session.rel = {
      item,
      pares: item.pares,
      derecha: item.derecha,
      emparejados: new Array(item.pares.length).fill(false),
      usadosDerecha: {},
      seleccion: null,
      errorIdx: null,
      errorIzq: null,
      errorTimer: null,
      parDeIzq: new Array(item.pares.length).fill(null),
      parContador: 0,
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
      '</div>' +
      '<p id="match-aviso" role="status" class="sr-only"></p>';
    pintarRelacionar();
  }

  // Paleta de pares (spec 009): pasteles legibles sobre oscuro; el badge lleva texto oscuro.
  const COLORES_PAR = ["#9BB8C9", "#E3C08D", "#B7A6E0", "#8FD0B3", "#E0A6A6", "#A6C8E0"];

  function anunciarMatch(texto) {
    const aviso = $("match-aviso");
    if (aviso) aviso.textContent = texto;
  }

  function limpiarErrorRel(e) {
    if (e.errorTimer) { clearTimeout(e.errorTimer); e.errorTimer = null; }
    e.errorIzq = null;
    e.errorIdx = null;
  }

  function pintarRelacionar() {
    const session = ctx.session;
    const e = session.rel;
    $("match-izq").innerHTML = e.pares.map((p, i) => {
      let clase = "match-item";
      let extra = "";
      let contenido = escapar(p[0]);
      if (e.emparejados[i]) {
        const color = COLORES_PAR[e.parDeIzq[i] % COLORES_PAR.length];
        clase += " match-ok";
        extra = ' style="--par-color:' + color + '"';
        contenido = '<span class="match-par">' + (e.parDeIzq[i] + 1) + '</span>' + icono("check", "icono-sm") + contenido;
      } else if (e.errorIzq === i) {
        clase += " match-err";
      } else if (e.seleccion === i) {
        clase += " match-sel";
      }
      return '<button class="' + clase + '"' + extra + ' data-action="clickMatchIzq" data-i="' + i + '" ' + (e.emparejados[i] || e.bloqueado ? "disabled" : "") + '>' + contenido + '</button>';
    }).join("");
    $("match-der").innerHTML = e.derecha.map(d => {
      const usado = e.usadosDerecha[d.idx] !== undefined;
      let clase = "match-item";
      let extra = "";
      let contenido = escapar(d.texto);
      if (usado) {
        const color = COLORES_PAR[e.parDeIzq[e.usadosDerecha[d.idx]] % COLORES_PAR.length];
        clase += " match-ok";
        extra = ' style="--par-color:' + color + '"';
        contenido = '<span class="match-par">' + (e.parDeIzq[e.usadosDerecha[d.idx]] + 1) + '</span>' + icono("check", "icono-sm") + contenido;
      }
      if (e.errorIdx === d.idx) clase += " match-err";
      return '<button class="' + clase + '"' + extra + ' data-action="clickMatchDer" data-idx="' + d.idx + '" ' + (usado || e.bloqueado ? "disabled" : "") + '>' + contenido + '</button>';
    }).join("");
  }

  function clickMatchIzq(i) {
    const session = ctx.session;
    const e = session.rel;
    if (!e || e.bloqueado || e.emparejados[i] || session.answers[session.idx]) return;
    limpiarErrorRel(e);
    e.seleccion = e.seleccion === i ? null : i;
    pintarRelacionar();
  }

  function clickMatchDer(idx) {
    const session = ctx.session;
    const e = session.rel;
    if (!e || e.bloqueado || e.usadosDerecha[idx] !== undefined || e.seleccion === null || session.answers[session.idx]) return;
    // Par correcto si el texto de la derecha corresponde al esperado por la izquierda,
    // comparado normalizado (equivale por tipo base: p. ej. cualquier opción VARCHAR2
    // vale para cualquier campo que espere VARCHAR2). Requiere que los datos balanceen
    // las opciones repetidas con la cantidad de campos que las esperan.
    if (normalizarClave(e.pares[e.seleccion][1]) === normalizarClave(e.derecha[idx].texto)) {
      // Par correcto (spec 009): número correlativo y color compartido en ambas columnas.
      e.parDeIzq[e.seleccion] = e.parContador;
      e.parContador++;
      e.emparejados[e.seleccion] = true;
      e.usadosDerecha[idx] = e.seleccion;
      e.seleccion = null;
      limpiarErrorRel(e);
      pintarRelacionar();
      if (e.emparejados.every(Boolean)) terminarRelacionar();
    } else {
      // Par incorrecto (spec 009): marcado en ambos lados, >=900 ms o hasta el siguiente
      // tap, y anuncio por la región aria-live. Sin animación (respeta reduced-motion).
      e.fallos++;
      e.errorIzq = e.seleccion;
      e.errorIdx = idx;
      e.seleccion = null;
      pintarRelacionar();
      anunciarMatch("Pareja incorrecta: " + e.pares[e.errorIzq][0] + " no corresponde con " + e.derecha.find(d => d.idx === idx).texto);
      if (e.errorTimer) clearTimeout(e.errorTimer);
      e.errorTimer = setTimeout(() => {
        e.errorTimer = null;
        e.errorIzq = null;
        e.errorIdx = null;
        if (ctx.session && ctx.session.rel === e && !e.bloqueado) pintarRelacionar();
      }, 900);
    }
  }

  function terminarRelacionar() {
    const session = ctx.session;
    const e = session.rel;
    if (!e || session.answers[session.idx] || e.bloqueado) return;
    e.bloqueado = true;
    limpiarErrorRel(e);
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
      fb.innerHTML = '<div class="font-bold mb-2 flex items-center gap-2">' +
        (ok ? icono("check", "icono-sm") + "<span>¡Todas las parejas correctas!</span>"
            : icono("cruz", "icono-sm") + "<span>Hubo " + e.fallos + " intento(s) fallido(s)</span>") +
        '</div><div>' + item.exp + '</div>';
      fb.style.display = "block";
    }
    mostrarBotonSiguiente();
  }

  function renderDiagramaPregunta(item, area) {
    // El estado del lienzo vive en session.diagrama y es idempotente por pregunta:
    // si ya existe para este ítem se conserva el trabajo en re-renders, y si la
    // pregunta cambió se monta un tablero nuevo.
    const tablero = ctx.session.diagrama;
    if (!tablero || tablero.preguntaId !== item.id) {
      ctx.session.diagrama = null;
      diagramas.renderDiagrama(item, area);
      diagramas.enfocarLienzo();
      return;
    }
    // Mismo ítem ya montado: conserva el lienzo y las posiciones de los nodos.
    if (!area.querySelector("#lienzo-diagrama")) diagramas.renderDiagrama(item, area);
  }

  function comprobarDiagrama() {
    const session = ctx.session;
    const item = session.items[session.idx];
    const estado = session.diagrama;
    if (!item || item.tipo !== "diagrama" || !estado || session.answers[session.idx]) return;
    const res = evaluarDiagrama(item, estado);
    const plan = planCorreccion(res);
    const resumen = resumenDiagrama(res);
    session.answers[session.idx] = {
      ok: res.ok,
      selected: res.ok
        ? "Diagrama correcto"
        : resumen.join(" · "),
      expected: "El diagrama esperado del tema"
    };
    registrarRespuesta(item.id, res.ok);
    // El veredicto vive solo en el feedback-box (como los demás tipos); el lienzo
    // conserva el diagrama sin duplicar el resumen. En simulacro no hay feedback.
    diagramas.renderDiagrama(item, $("question-area"));
    if (session.modo !== "simulacro") {
      const fb = $("feedback-box");
      fb.className = "feedback " + (res.ok ? "feedback-ok" : "feedback-bad");
      fb.innerHTML = '<div class="font-bold mb-2">' +
        (res.ok
          ? icono("check", "icono-sm") + " ¡Diagrama correcto!"
          : icono("cruz", "icono-sm") + " Aún no: revisa el detalle") +
        "</div>" +
        seccionesCorreccion(plan) +
        '<div>' + item.exp + '</div>';
      fb.style.display = "block";
    }
    mostrarBotonSiguiente();
  }

  function renderDragdrop(item, area) {
    const session = ctx.session;
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
    pool.addEventListener("dragstart", e => {
      const p = e.target.closest(".pieza");
      if (p) iniciarArrastre(e, p.dataset.pid);
    });
    $("btn-comprobar").onclick = () => comprobarDragdrop();
    pintarDragdrop();
  }

  function piezaTexto(pid) {
    const session = ctx.session;
    const p = session.drag.piezas.find(x => x.pid === pid);
    return p ? p.text : "";
  }

  function piezasUsadas() {
    const session = ctx.session;
    return session.drag.slots.filter(Boolean);
  }

  function pintarDragdrop() {
    const session = ctx.session;
    const estado = session.drag;
    let html = resaltarSQL(estado.item.codigo, keywords());
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
      '<div class="pieza' + (estado.seleccion === p.pid ? " pieza-sel" : "") + '" draggable="true" data-pid="' + p.pid + '">' + escapar(p.text) + '</div>'
    ).join("") || '<span class="text-sm text-slate-400">Todas las piezas están colocadas.</span>';
    const contador = $("drag-contador");
    if (contador) {
      contador.textContent = "Huecos: " + usadas.length + " / " + estado.slots.length + " · Piezas en la bandeja: " + (estado.piezas.length - usadas.length);
    }
    $("btn-comprobar").disabled = usadas.length !== estado.slots.length || estado.bloqueado;
  }

  function iniciarArrastre(event, pid) {
    const session = ctx.session;
    if (session.drag.bloqueado) return;
    dragPid = pid;
    event.dataTransfer.setData("text/plain", pid);
  }

  function clickPieza(pid) {
    const session = ctx.session;
    if (session.drag.bloqueado) return;
    session.drag.seleccion = session.drag.seleccion === pid ? null : pid;
    pintarDragdrop();
  }

  function clickHueco(i) {
    const session = ctx.session;
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
    const session = ctx.session;
    const estado = session.drag;
    estado.slots.forEach((s, j) => { if (s === pid) estado.slots[j] = null; });
    estado.slots[i] = pid;
    estado.seleccion = null;
    pintarDragdrop();
  }

  function comprobarDragdrop() {
    const session = ctx.session;
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
        (ok ? icono("check", "icono-sm") + " ¡Correcto!" : icono("cruz", "icono-sm") + " Incorrecto — el orden correcto era: <b>" + escapar(item.respuestas.join(" / ")) + "</b>") +
        '</div><div>' + item.exp + '</div>';
      fb.style.display = "block";
    }
    mostrarBotonSiguiente();
  }

  function renderOrdenar(item, area) {
    const session = ctx.session;
    session.orden = { item, orden: item.bloquesRuntime.slice(), resultado: null, bloqueado: false };
    area.innerHTML =
      bloqueCaso(item) +
      '<div class="text-base sm:text-lg font-semibold leading-relaxed mb-3">' + escapar(item.q) + '</div>' +
      (item.diagrama ? diagramaER() : "") +
      (item.datos ? tablaDatos(item.datos) : "") +
      '<p class="text-xs text-slate-400 mb-3">Usa ▲▼ o arrastra los bloques hasta lograr el orden correcto.</p>' +
      '<div id="bloques" class="flex flex-col gap-2"></div>' +
      '<div class="mt-4"><button class="btn btn-primary" id="btn-comprobar-orden" data-action="comprobarOrden">Comprobar</button></div>';
    const bloques = $("bloques");
    bloques.addEventListener("dragstart", e => {
      const b = e.target.closest(".bloque");
      if (b) iniciarArrastreBloque(e, parseInt(b.dataset.i, 10));
    });
    bloques.addEventListener("dragover", e => {
      if (e.target.closest(".bloque")) e.preventDefault();
    });
    bloques.addEventListener("drop", e => {
      const b = e.target.closest(".bloque");
      if (b) soltarBloque(e, parseInt(b.dataset.i, 10));
    });
    pintarOrden();
  }

  function pintarOrden() {
    const session = ctx.session;
    const estado = session.orden;
    $("bloques").innerHTML = estado.orden.map((texto, i) => {
      let clase = "bloque";
      if (estado.resultado) clase += estado.resultado[i] ? " bloque-ok" : " bloque-mal";
      return '<div class="' + clase + '" draggable="' + (estado.bloqueado ? "false" : "true") + '" data-i="' + i + '">' +
        '<div class="flex gap-1">' +
          '<button class="btn-mini" data-action="moverBloque" data-i="' + i + '" data-dir="-1" ' + (i === 0 || estado.bloqueado ? "disabled" : "") + '>▲</button>' +
          '<button class="btn-mini" data-action="moverBloque" data-i="' + i + '" data-dir="1" ' + (i === estado.orden.length - 1 || estado.bloqueado ? "disabled" : "") + '>▼</button>' +
        '</div>' +
        '<span class="flex-1 min-w-0">' + escapar(texto) + '</span>' +
      '</div>';
    }).join("");
  }

  function moverBloque(i, dir) {
    const session = ctx.session;
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
    const session = ctx.session;
    if (session.orden.bloqueado) return;
    dragBloqueIndex = i;
    event.dataTransfer.setData("text/plain", String(i));
  }

  function soltarBloque(event, i) {
    const session = ctx.session;
    event.preventDefault();
    const estado = session.orden;
    if (estado.bloqueado || dragBloqueIndex === null || dragBloqueIndex === i) return;
    const movido = estado.orden.splice(dragBloqueIndex, 1)[0];
    estado.orden.splice(i, 0, movido);
    dragBloqueIndex = null;
    pintarOrden();
  }

  function comprobarOrden() {
    const session = ctx.session;
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
        (ok ? icono("check", "icono-sm") + " ¡Correcto!" : icono("cruz", "icono-sm") + " Incorrecto — el orden correcto era:") +
        '</div><ol class="list-decimal list-inside font-mono text-xs mb-3">' + item.bloques.map(b => "<li>" + escapar(b) + "</li>").join("") + '</ol><div>' + item.exp + '</div>';
      fb.style.display = "block";
    }
    mostrarBotonSiguiente();
  }

  function renderDesarrollo(item, area) {
    const session = ctx.session;
    session.desarrollo = { item, texto: "", revelada: false, evaluada: false };
    area.innerHTML =
      bloqueCaso(item) +
      '<div class="text-base sm:text-lg font-semibold leading-relaxed mb-3">' + escapar(item.q) + '</div>' +
      (item.diagrama ? diagramaER() : "") +
      (item.datos ? tablaDatos(item.datos) : "") +
      '<textarea id="dev-texto" rows="5" placeholder="Escribe tu consulta SQL aquí..." class="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 font-mono text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-blue-500 mb-4"></textarea>' +
      '<div id="dev-solucion" class="hidden"></div>' +
      '<div id="dev-eval" class="flex flex-wrap gap-3 mt-3"></div>' +
      (session.modo === "simulacro" ? "" : '<div class="mt-3" id="dev-ver"><button class="btn btn-secondary" data-action="revelarSolucion">Ver solución modelo</button></div>');
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
    const session = ctx.session;
    const d = session.desarrollo;
    if (!d || d.revelada) return;
    d.revelada = true;
    const cont = $("dev-solucion");
    cont.innerHTML = '<p class="text-xs uppercase tracking-wide text-slate-400 font-bold mb-2">Solución modelo</p><pre class="code-block">' + resaltarSQL(d.item.solucion, keywords()) + '</pre>' + analizarClaves(d.item, d.texto);
    cont.classList.remove("hidden");
    const btnVer = $("dev-ver");
    if (btnVer) btnVer.classList.add("hidden");
    $("dev-eval").innerHTML =
      '<button class="btn btn-primary" data-action="autoevaluarDev" data-ok="true">Me acerqué</button>' +
      '<button class="btn btn-secondary" data-action="autoevaluarDev" data-ok="false">No pude</button>';
  }

  function autoevaluarDev(ok) {
    const session = ctx.session;
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
      fb.innerHTML = '<div class="font-bold mb-2 flex items-center gap-2">' + (ok ? icono("check", "icono-sm") + "<span>¡Bien!</span>" : icono("cruz", "icono-sm") + "<span>Sigue practicando</span>") + '</div><div>' + item.exp + '</div>';
      fb.style.display = "block";
    }
    mostrarBotonSiguiente();
  }

  return {
    renderQuestion,
    responderOpcion,
    toggleMulti,
    comprobarMulti,
    saltarPregunta,
    toggleMarcadaActual,
    clickMatchIzq,
    clickMatchDer,
    iniciarArrastre,
    iniciarArrastreBloque,
    moverBloque,
    soltarBloque,
    comprobarOrden,
    revelarSolucion,
    autoevaluarDev,
    pintarVidas,
    expirarPregunta,
    comprobarDiagrama,
    cancelarDiagramaTipo: () => diagramas.cancelarSeleccion()
  };
}
