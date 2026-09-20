// Render e interacción del modo flashcards (incluye la ronda de garantizadas).
// Recibe el banco vía `ctx`, callbacks de priorización/persistencia/navegación;
// el estado de la ronda (`flash`) vive en este módulo.
import { shuffle } from "../core/sesiones.js";
import { icono } from "./iconos.js";
import {
  TIPO_LABELS,
  bloqueCaso, escapar, respuestaEstudio, resaltarSQL, sqlKeywordsDe, tablaDatos
} from "./helpers.js";

const $ = id => document.getElementById(id);

export function crearFlashcardsUI({ ctx, priorizar, registrarRespuesta, mostrarPantalla }) {
  let flash = null;
  const keywords = () => sqlKeywordsDe(ctx.materia);

  function startFlashcards() {
    const items = priorizar(ctx.banco).map(it =>
      it.tipo === "ordenar" ? Object.assign({}, it, { frenteOrden: shuffle(it.bloques) }) : it
    );
    flash = { items, idx: 0, aciertos: 0, fallos: 0, volteada: false };
    mostrarPantalla("flashcards");
    renderFlashcard();
  }

  function flashcardsGarantizadas() {
    const items = ctx.banco.filter(q => q.real).map(it =>
      it.tipo === "ordenar" ? Object.assign({}, it, { frenteOrden: it.bloques.slice() }) : it
    );
    if (!items.length) return;
    flash = { items, idx: 0, aciertos: 0, fallos: 0, volteada: false };
    mostrarPantalla("flashcards");
    renderFlashcard();
  }

  function renderFlashcard() {
    if (!flash) return;
    const cont = $("flash-area");
    if (flash.idx >= flash.items.length) {
      cont.innerHTML =
        '<div class="flash-card text-center">' +
          '<div class="flex justify-center mb-3 text-amber-300">' + icono("medalla", "icono-lg") + '</div>' +
          '<h2 class="text-xl font-bold mb-2">Ronda de flashcards terminada</h2>' +
          '<p class="text-slate-300 mb-1 flex items-center justify-center gap-1.5">' + icono("check", "icono-sm") + 'Sabías: <b>' + flash.aciertos + '</b></p>' +
          '<p class="text-slate-300 mb-6 flex items-center justify-center gap-1.5">' + icono("cruz", "icono-sm") + 'No sabías: <b>' + flash.fallos + '</b></p>' +
          '<div class="flex flex-wrap gap-3 justify-center">' +
            '<button class="btn btn-primary" data-action="startFlashcards">Otra ronda</button>' +
            '<button class="btn btn-ghost" data-action="goHome">Inicio</button>' +
          '</div>' +
        '</div>';
      return;
    }
    const item = flash.items[flash.idx];
    let frente = bloqueCaso(item) + '<div class="text-xs uppercase tracking-wide text-slate-400 font-bold mb-3">' + item.parcial + ' · ' + item.tema + ' · ' + (TIPO_LABELS[item.tipo] || item.tipo) + '</div>' +
      '<div class="text-base sm:text-lg font-semibold leading-relaxed">' + escapar(item.q) + '</div>' +
      (item.tipo === "diagrama" ? '<p class="text-xs text-slate-400 mt-3">En flashcards, los diagramas se resuelven mejor en Modo Estudio o en la práctica.</p>' : "");
    if (item.datos) frente += tablaDatos(item.datos);
    if (item.codigo && item.tipo === "codigo") frente += '<pre class="code-block mt-4">' + resaltarSQL(item.codigo, keywords()) + '</pre>';
    if (item.codigo && item.tipo === "dragdrop") frente += '<pre class="code-block mt-4">' + resaltarSQL(item.codigo.replace(/\{\d\}/g, "____"), keywords()) + '</pre>';
    if (item.tipo === "ordenar") frente += '<div class="mt-4 flex flex-col gap-2">' + (item.frenteOrden || shuffle(item.bloques)).map(b => '<div class="bloque">' + escapar(b) + '</div>').join("") + '</div>';

    let reves = "";
    if (flash.volteada) {
      reves = '<hr class="border-slate-700 my-4">' + respuestaEstudio(item, keywords()) + '<div class="study-exp">' + item.exp + '</div>';
    }

    cont.innerHTML =
      '<div class="flex items-center justify-between mb-4 flex-wrap gap-2 text-sm text-slate-400">' +
        '<span>Tarjeta ' + (flash.idx + 1) + ' de ' + flash.items.length + '</span>' +
        '<span class="flex items-center gap-2">' + icono("check", "icono-sm") + ' ' + flash.aciertos + ' · ' + icono("cruz", "icono-sm") + ' ' + flash.fallos + '</span>' +
      '</div>' +
      '<div class="flash-card">' + frente + reves + '</div>' +
      '<div class="mt-5 flex flex-col sm:flex-row gap-3">' +
        (flash.volteada
          ? '<button class="btn btn-primary flex-1" data-action="responderFlash" data-ok="true">Sabía</button>' +
            '<button class="btn btn-secondary flex-1" data-action="responderFlash" data-ok="false">No sabía</button>'
          : '<button class="btn btn-primary flex-1" data-action="voltearFlash">Voltear</button>') +
        '<button class="btn btn-ghost" data-action="saltarFlash">Saltar</button>' +
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

  return { startFlashcards, flashcardsGarantizadas, voltearFlash, responderFlash, saltarFlash };
}
