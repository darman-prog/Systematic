// Componentes de estado (vacío / aviso). HTML puro, sin estado ni DOM global.
import { escapar } from "../helpers.js";
import { icono } from "../iconos.js";

export function estadoVacio(texto) {
  return '<p class="text-sm text-slate-400">' + escapar(texto) + "</p>";
}

export function aviso(texto) {
  return '<div class="bg-slate-900 border border-slate-700 rounded-xl p-4 my-5 text-sm text-amber-200 flex items-center gap-2">' +
    icono("aviso", "icono-sm") + "<span>" + escapar(texto) + "</span></div>";
}
