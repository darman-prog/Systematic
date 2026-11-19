// Render e interacción del modo flashcards como mazo apilado físico con descarte
// lateral, reordenamiento interactivo para preguntas de tipo ordenar y repaso de falladas.
import { shuffle, ordenarPrioridad } from "../../core/index.js";
import { icono } from "../iconos.js";
import {
  TIPO_LABELS, DIF_LABELS,
  bloqueCaso, colorTema, escapar, respuestaEstudio, resaltarSQL, sqlKeywordsDe, tablaDatos
} from "../helpers.js";

/** @type {(id: string) => any} */
const $ = id => document.getElementById(id);

export function crearFlashcardsUI({ ctx, obtenerP, registrarRespuesta, mostrarPantalla }) {
  let flash = null;
  let flashTema = "todos";
  let dragEstado = null;
  let dragListenersActivos = false;
  const keywords = () => sqlKeywordsDe(ctx.materia);

  // Mezcla bloques intentando que el orden inicial difiera de la solución cuando hay más de un paso.
  function mezclarBloques(bloques) {
    if (!Array.isArray(bloques) || bloques.length <= 1) return [...(bloques || [])];
    let intento = shuffle(bloques);
    for (let i = 0; i < 4 && intento.join("|") === bloques.join("|"); i++) {
      intento = shuffle(bloques);
    }
    return intento;
  }

  function prepararItem(it) {
    if (it.tipo !== "ordenar") return it;
    const orden = mezclarBloques(it.bloques);
    return Object.assign({}, it, { frenteOrden: orden, ordenUsuario: [...orden] });
  }

  function construirMazo(tema) {
    const base = (ctx.banco || []).filter(it => tema === "todos" || it.tema === tema);
    return ordenarPrioridad(base, obtenerP).map(prepararItem);
  }

  function iniciarConItems(items) {
    flash = {
      items,
      idx: 0,
      aciertos: 0,
      fallos: 0,
      resultados: {},
      volteada: false,
      transicion: "",
      saliente: null
    };
    renderFlashcard();
  }

  function startFlashcards() {
    flashTema = "todos";
    iniciarConItems(construirMazo("todos"));
    mostrarPantalla("flashcards");
  }

  function cambiarFlashTema(tema) {
    flashTema = tema || "todos";
    iniciarConItems(construirMazo(flashTema));
  }

  // Relanza una ronda enfocada únicamente en las tarjetas marcadas como "No sabía".
  function repasarFalladasFlash() {
    if (!flash) return;
    const falladas = flash.items
      .filter(it => flash.resultados[it.id] === false)
      .map(prepararItem);
    if (falladas.length === 0) {
      iniciarConItems(construirMazo(flashTema));
      return;
    }
    iniciarConItems(falladas);
  }

  function recalcularContadores() {
    if (!flash) return;
    const valores = Object.values(flash.resultados);
    flash.aciertos = valores.filter(v => v === true).length;
    flash.fallos = valores.filter(v => v === false).length;
  }

  // Sincroniza el orden actual de los bloques del DOM con el estado del ítem.
  function sincronizarOrdenUsuario(lista, item) {
    if (!lista || !item) return;
    item.ordenUsuario = [...lista.querySelectorAll(".flash-order-item")]
      .map(li => li.dataset.bloqueTexto || "");
  }

  // Instala una sola vez los listeners globales de puntero para evitar fugas entre renders.
  function asegurarListenersDrag() {
    if (dragListenersActivos) return;
    dragListenersActivos = true;

    document.addEventListener("pointermove", e => {
      if (!dragEstado) return;
      const { li, lista, item } = dragEstado;
      for (const hermano of lista.children) {
        if (hermano === li) continue;
        const r = hermano.getBoundingClientRect();
        if (e.clientY > r.top && e.clientY < r.bottom) {
          if (hermano.compareDocumentPosition(li) & Node.DOCUMENT_POSITION_FOLLOWING) {
            lista.insertBefore(li, hermano);
          } else {
            hermano.after(li);
          }
          sincronizarOrdenUsuario(lista, item);
          break;
        }
      }
    });

    const soltar = () => {
      if (!dragEstado) return;
      dragEstado.li.classList.remove("is-dragging");
      dragEstado = null;
    };
    document.addEventListener("pointerup", soltar);
    document.addEventListener("pointercancel", soltar);
  }

  function renderTemasBar() {
    const banco = ctx.banco || [];
    const temasUnicos = [...new Set(banco.map(q => q.tema).filter(Boolean))];
    if (temasUnicos.length <= 1) return "";
    return '<div class="flash-temas-bar mb-4" role="group" aria-label="Filtrar mazo por tema">' +
      ["todos", ...temasUnicos].map(t => {
        const activo = flashTema === t;
        const etiqueta = t === "todos" ? "Todo el mazo" : t;
        const cuenta = t === "todos" ? banco.length : banco.filter(q => q.tema === t).length;
        return '<button type="button" class="study-subchip' + (activo ? " is-on" : "") + '" data-action="cambiarFlashTema" data-tema="' + escapar(t) + '" aria-pressed="' + (activo ? "true" : "false") + '">' + escapar(etiqueta) + ' · ' + cuenta + '</button>';
      }).join("") +
    '</div>';
  }

  // Los atajos <kbd> llevan aria-hidden="true" para conservar el nombre accesible exacto ("Voltear", "Sabía", "No sabía").
  function renderBotonesPrincipales(volteada) {
    if (volteada) {
      return '<button type="button" class="btn btn-secondary flash-btn-bad" data-action="responderFlash" data-ok="false"><kbd aria-hidden="true">←</kbd> No sabía</button>' +
        '<button type="button" class="btn btn-primary flash-btn-ok" data-action="responderFlash" data-ok="true">Sabía <kbd aria-hidden="true">→</kbd></button>';
    }
    return '<button type="button" class="btn btn-primary flash-btn-flip" data-action="voltearFlash">Voltear <kbd aria-hidden="true">Espacio</kbd></button>';
  }

  function renderEstadoOrden(item) {
    if (item.tipo !== "ordenar") return "";
    const actual = item.ordenUsuario || item.frenteOrden || [];
    const coincide = actual.join("|") === (item.bloques || []).join("|");
    const clase = coincide ? "flash-order-check is-ok" : "flash-order-check is-bad";
    const ic = coincide ? icono("check", "icono-sm") : icono("cruz", "icono-sm");
    const texto = coincide
      ? "Tu orden coincide con la respuesta."
      : "Tu orden era distinto al de la respuesta.";
    return '<p class="' + clase + '" role="status">' + ic + ' <span>' + texto + '</span></p>';
  }

  function renderCabeceraCara(item, etiquetaCara) {
    const acentoTema = colorTema(ctx.materia, item.tema) || "#38bdf8";
    const metaPartes = [item.parcial, TIPO_LABELS[item.tipo] || item.tipo, DIF_LABELS[item.dificultad] || ""].filter(Boolean).join(" · ");
    return '<div class="flash-face-head">' +
      '<div class="flex items-center gap-2 flex-wrap">' +
        '<span class="study-tema-badge" style="--tema-color:' + escapar(acentoTema) + '">' + escapar(item.tema) + '</span>' +
        '<span class="study-meta-text">' + escapar(metaPartes) + '</span>' +
      '</div>' +
      '<span class="flash-face-pill">' + etiquetaCara + '</span>' +
    '</div>';
  }

  // Renderiza una tarjeta fantasma que vuela fuera del mazo al responder Sabía/No sabía.
  function renderTarjetaSaliente(saliente) {
    if (!saliente || !saliente.item) return "";
    const clase = saliente.ok ? "flash-discard--ok" : "flash-discard--bad";
    return '<div class="flash-card flash-card-discard ' + clase + '" aria-hidden="true">' +
      renderCabeceraCara(saliente.item, saliente.ok ? "Sabía" : "No sabía") +
      '<div class="flash-question-text">' + escapar(saliente.item.q) + '</div>' +
    '</div>';
  }

  function renderFlashcard() {
    if (!flash) return;
    const cont = $("flash-area");
    if (!cont) return;

    const total = flash.items.length;
    if (total === 0 || flash.idx >= total) {
      const falladas = flash.items.filter(it => flash.resultados[it.id] === false);
      const resumenSub = total === 0
        ? "No hay tarjetas disponibles para este tema."
        : falladas.length > 0
          ? "Te faltan " + falladas.length + " por repasar."
          : "No fallaste ninguna tarjeta en esta ronda.";

      cont.innerHTML =
        renderTemasBar() +
        '<div class="flash-card flash-summary-card text-center">' +
          '<div class="flex justify-center mb-3 text-amber-300">' + icono("medalla", "icono-lg") + '</div>' +
          '<h2 class="mb-2 text-lg font-bold text-slate-100">Ronda de flashcards terminada</h2>' +
          '<p class="text-sm text-slate-300 mb-1">' + flash.aciertos + ' de ' + total + ' las sabías.</p>' +
          '<p class="text-xs text-slate-400 mb-5">' + resumenSub + '</p>' +
          '<div class="flash-summary-metrics mb-6">' +
            '<span class="flash-metric flash-metric--ok">' + icono("check", "icono-sm") + ' Sabías: <b>' + flash.aciertos + '</b></span>' +
            '<span class="flash-metric flash-metric--bad">' + icono("cruz", "icono-sm") + ' No sabías: <b>' + flash.fallos + '</b></span>' +
          '</div>' +
          '<div class="flex flex-wrap gap-3 justify-center">' +
            (falladas.length > 0
              ? '<button type="button" class="btn btn-primary" data-action="repasarFalladasFlash">Repasar las que fallé (' + falladas.length + ')</button>'
              : '') +
            (flash.idx > 0 ? '<button type="button" class="btn btn-secondary" data-action="anteriorFlash">← Revisar última</button>' : '') +
            '<button type="button" class="btn ' + (falladas.length > 0 ? "btn-secondary" : "btn-primary") + '" data-action="startFlashcards">Otra ronda</button>' +
            '<button type="button" class="btn btn-ghost" data-action="goHome">Inicio</button>' +
          '</div>' +
        '</div>';
      flash.saliente = null;
      return;
    }

    const item = flash.items[flash.idx];
    const restantes = Math.max(0, total - flash.idx - 1);
    const nivelPila = restantes >= 2 ? "2" : restantes === 1 ? "1" : "0";
    const pct = Math.round(((flash.idx + 1) / total) * 100);

    let cuerpoFrente =
      renderCabeceraCara(item, "Pregunta") +
      bloqueCaso(item) +
      '<div class="flash-question-text">' + escapar(item.q) + '</div>' +
      (item.tipo === "diagrama" ? '<p class="text-xs text-slate-400 mt-3">En flashcards, los diagramas se resuelven mejor en Modo Estudio o en la práctica.</p>' : "");

    if (item.datos) cuerpoFrente += tablaDatos(item.datos);
    if (item.codigo && item.tipo === "codigo") cuerpoFrente += '<pre class="code-block mt-4">' + resaltarSQL(item.codigo, keywords()) + '</pre>';
    if (item.codigo && item.tipo === "dragdrop") cuerpoFrente += '<pre class="code-block mt-4">' + resaltarSQL(item.codigo.replace(/\{\d\}/g, "____"), keywords()) + '</pre>';
    if (item.tipo === "ordenar") {
      const ordenActual = item.ordenUsuario || item.frenteOrden || mezclarBloques(item.bloques);
      item.ordenUsuario = [...ordenActual];
      cuerpoFrente += '<ul class="flash-order-list mt-4" aria-label="Ordena los bloques arrastrando o con las flechas arriba y abajo">' +
        ordenActual.map(b =>
          '<li class="flash-order-item" tabindex="0" data-bloque-texto="' + escapar(b) + '" aria-label="' + escapar(b) + '. Usa flecha arriba o abajo para mover.">' +
            '<span class="flash-order-grip" aria-hidden="true">⋮⋮</span>' +
            '<span class="flash-order-text">' + escapar(b) + '</span>' +
          '</li>'
        ).join("") +
      '</ul>';
    }
    // El fragmento de teclado se oculta en móvil y dispositivos táctiles vía .flash-kbd-only.
    cuerpoFrente += '<div class="flash-flip-hint">Toca la tarjeta<span class="flash-kbd-only"> o pulsa <kbd>Espacio</kbd></span> para voltear</div>';

    // El reverso muestra la pregunta reducida como contexto y resalta la respuesta correcta en su caja propia.
    const reversoContenido =
      renderCabeceraCara(item, "Respuesta") +
      '<p class="flash-back-prompt">' + escapar(item.q) + '</p>' +
      '<div class="flash-back-section flash-answer-box">' +
        '<span class="study-drawer-label">Respuesta correcta</span>' +
        respuestaEstudio(item, keywords()) +
      '</div>' +
      '<div class="flash-order-feedback">' + renderEstadoOrden(item) + '</div>' +
      '<div class="study-exp">' +
        '<span class="study-drawer-label">Explicación</span>' +
        '<div class="study-exp-body">' + item.exp + '</div>' +
      '</div>' +
      '<div class="flash-flip-hint">Toca la tarjeta para volver a la pregunta</div>';

    // Capas físicas reales detrás de la tarjeta activa (solo decorativas para no duplicar selectores de la activa).
    let capasFondo = "";
    if (restantes >= 2) {
      capasFondo += '<div class="flash-card flash-card-under" data-depth="2" aria-hidden="true"></div>';
    }
    if (restantes >= 1) {
      capasFondo += '<div class="flash-card flash-card-under" data-depth="1" aria-hidden="true"></div>';
    }

    const tieneCodigo = Boolean(item.codigo && (item.tipo === "codigo" || item.tipo === "dragdrop"));
    const esFrenteSimple = !item.caso && !item.datos && !tieneCodigo && item.tipo !== "ordenar" && item.tipo !== "diagrama";
    const claseTransicion = flash.transicion ? " " + flash.transicion : "";

    cont.innerHTML =
      renderTemasBar() +
      '<div class="flash-topbar mb-3">' +
        '<div class="flex items-center justify-between gap-2 flex-wrap mb-1.5 text-xs sm:text-sm text-slate-300">' +
          '<span class="font-semibold">Tarjeta ' + (flash.idx + 1) + ' de ' + total + '</span>' +
          '<span class="flex items-center gap-3">' +
            '<span class="flash-score-pill flash-score-pill--ok">' + icono("check", "icono-sm") + ' ' + flash.aciertos + '</span>' +
            '<span class="flash-score-pill flash-score-pill--bad">' + icono("cruz", "icono-sm") + ' ' + flash.fallos + '</span>' +
          '</span>' +
        '</div>' +
        '<div class="flash-progress-track" aria-hidden="true">' +
          '<div class="flash-progress-fill" style="width:' + pct + '%"></div>' +
        '</div>' +
      '</div>' +
      '<div class="flash-deck-stack" data-pila="' + nivelPila + '">' +
        capasFondo +
        '<div class="flash-card-container' + claseTransicion + '">' +
          '<div class="flash-card-inner' + (flash.volteada ? " flipped" : "") + '" data-action="voltearFlash">' +
            '<div class="flash-card flash-card-front' + (esFrenteSimple ? " flash-front-simple" : "") + '">' + cuerpoFrente + '</div>' +
            '<div class="flash-card flash-card-back" tabindex="0" role="group" aria-label="Reverso de la tarjeta">' + reversoContenido + '</div>' +
          '</div>' +
        '</div>' +
        renderTarjetaSaliente(flash.saliente) +
      '</div>' +
      '<div class="flash-controls mt-6">' +
        '<button type="button" class="btn btn-ghost btn-sm" data-action="anteriorFlash"' + (flash.idx === 0 ? " disabled" : "") + '>← Anterior</button>' +
        '<div class="flash-controls-main">' + renderBotonesPrincipales(flash.volteada) + '</div>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-action="saltarFlash">Saltar →</button>' +
      '</div>';

    flash.transicion = "";
    flash.saliente = null;
    vincularOrdenar(cont, item);
  }

  // Habilita arrastrar con puntero y mover con flechas en los bloques de preguntas de tipo ordenar.
  function vincularOrdenar(cont, item) {
    if (item.tipo !== "ordenar") return;
    const lista = cont.querySelector(".flash-order-list");
    if (!lista) return;
    asegurarListenersDrag();

    lista.querySelectorAll(".flash-order-item").forEach(li => {
      // Evita que tocar o arrastrar un bloque dispare el volteo de la tarjeta padre.
      li.addEventListener("click", e => e.stopPropagation());
      li.addEventListener("pointerdown", e => {
        e.stopPropagation();
        dragEstado = { li, lista, item };
        li.classList.add("is-dragging");
      });
      li.addEventListener("keydown", e => {
        if (e.key === "ArrowUp" && li.previousElementSibling) {
          lista.insertBefore(li, li.previousElementSibling);
        } else if (e.key === "ArrowDown" && li.nextElementSibling) {
          li.nextElementSibling.after(li);
        } else {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        sincronizarOrdenUsuario(lista, item);
        li.focus();
      });
    });
  }

  function voltearFlash() {
    if (!flash || flash.idx >= flash.items.length) return;
    flash.volteada = !flash.volteada;
    flash.transicion = "";

    const cont = $("flash-area");
    const inner = cont ? cont.querySelector(".flash-card-inner") : null;
    const controlsMain = cont ? cont.querySelector(".flash-controls-main") : null;

    // Alterna la clase en sitio y anima el cambio de altura entre frente compacto y reverso expandido.
    if (inner && controlsMain) {
      const altoAntes = inner.offsetHeight;
      inner.style.height = "";
      inner.classList.toggle("flipped", flash.volteada);
      const altoDespues = inner.offsetHeight;

      if (altoAntes > 0 && altoDespues > 0 && altoAntes !== altoDespues) {
        inner.style.height = altoAntes + "px";
        void inner.offsetHeight;
        inner.style.height = altoDespues + "px";
        const limpiarAlto = () => {
          inner.style.height = "";
          inner.removeEventListener("transitionend", alTerminar);
        };
        const alTerminar = e => {
          if (e.propertyName === "height") limpiarAlto();
        };
        inner.addEventListener("transitionend", alTerminar);
        setTimeout(limpiarAlto, 380);
      }

      controlsMain.innerHTML = renderBotonesPrincipales(flash.volteada);
      const item = flash.items[flash.idx];
      if (item.tipo === "ordenar") {
        const fb = cont.querySelector(".flash-order-feedback");
        if (fb) fb.innerHTML = renderEstadoOrden(item);
      }
      return;
    }
    renderFlashcard();
  }

  function responderFlash(ok) {
    if (!flash || flash.idx >= flash.items.length) return;
    const item = flash.items[flash.idx];
    // Solo registramos en persistencia la primera vez que se evalúa la tarjeta en la ronda.
    if (flash.resultados[item.id] === undefined) {
      registrarRespuesta(item.id, ok);
    }
    flash.resultados[item.id] = ok;
    recalcularContadores();
    flash.saliente = { item, ok };
    flash.idx++;
    flash.volteada = false;
    flash.transicion = ok ? "flash-pass-ok" : "flash-pass-bad";
    renderFlashcard();
  }

  function saltarFlash() {
    if (!flash || flash.idx >= flash.items.length) return;
    flash.saliente = null;
    flash.idx++;
    flash.volteada = false;
    flash.transicion = "flash-pass-next";
    renderFlashcard();
  }

  function anteriorFlash() {
    if (!flash || flash.idx <= 0) return;
    flash.saliente = null;
    flash.idx--;
    flash.volteada = false;
    flash.transicion = "flash-pass-prev";
    renderFlashcard();
  }

  // Atajos de teclado activos cuando la pantalla de flashcards está visible.
  function manejarTecla(e) {
    if (!flash || flash.idx >= flash.items.length) return;
    // Si el foco está dentro de un bloque reordenable, cede las flechas al reordenamiento.
    if (e.target && typeof e.target.closest === "function" && e.target.closest(".flash-order-item")) return;

    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      voltearFlash();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (flash.volteada) responderFlash(true);
      else saltarFlash();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (flash.volteada) responderFlash(false);
      else anteriorFlash();
    } else if (flash.volteada && e.key === "1") {
      e.preventDefault();
      responderFlash(false);
    } else if (flash.volteada && e.key === "2") {
      e.preventDefault();
      responderFlash(true);
    }
  }

  return {
    startFlashcards,
    cambiarFlashTema,
    repasarFalladasFlash,
    voltearFlash,
    responderFlash,
    saltarFlash,
    anteriorFlash,
    manejarTecla
  };
}
