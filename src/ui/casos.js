// Render de la lista y ejecución de casos de diagramación (spec 003, H6c).
// Cada caso es una narrativa + un diagrama a construir con el lienzo compartido.
import { escapar } from "./helpers.js";
import { resumenDiagrama } from "../core/diagramas.js";

const $ = id => document.getElementById(id);

const RATINGS = {
  exito: { texto: "🎉 ¡Éxito!", clase: "tag-ok" },
  parcial: { texto: "🤔 Resultado parcial", clase: "tag-practica" },
  fracaso: { texto: "😖 Fracaso", clase: "tag-bad" }
};

export function pintarListaCasos(casos, registros) {
  const cont = $("casos-lista");
  if (!cont) return;
  cont.innerHTML = casos.map(c => {
    const registro = registros[c.id];
    const mejor = registro
      ? (registro.mejorRating === "exito" ? "🏆 Éxito" : registro.mejorRating === "parcial" ? "🤔 Parcial" : "😖 Fracaso")
      : "Sin jugar";
    return '<div class="apunte-card">' +
      '<div class="apunte-tema">' + escapar(c.tema) + '</div>' +
      '<div class="apunte-titulo">' + escapar(c.titulo) + '</div>' +
      '<p class="text-sm text-slate-300 mb-3">' + escapar(c.caso) + '</p>' +
      '<div class="flex items-center justify-between gap-3 flex-wrap">' +
        '<span class="text-xs text-slate-400">Mejor resultado: ' + mejor + '</span>' +
        '<button class="btn btn-primary btn-sm" data-action="jugarCaso" data-id="' + c.id + '">Jugar caso</button>' +
      '</div>' +
    '</div>';
  }).join("") || '<p class="text-sm text-slate-400">Aún no hay casos para esta materia.</p>';
}

export function pintarCaso(caso, estado, resultado) {
  const cont = $("caso-escena");
  if (!cont) return;
  
  if (resultado) {
    const r = RATINGS[resultado.rating] || RATINGS.parcial;
    const finalTexto = resultado.rating === "exito" ? caso.finales.exito : resultado.rating === "parcial" ? caso.finales.parcial : caso.finales.fracaso;
    const resumen = resultado.detalle ? resumenDiagrama(resultado.detalle) : [];
    cont.innerHTML =
      '<div class="text-center mb-5">' +
        '<span class="tag ' + r.clase + '">' + r.texto + '</span>' +
        '<p class="text-sm text-slate-300 mt-3">' + escapar(finalTexto) + '</p>' +
        '<p class="text-xs text-slate-400 mt-1">XP ganada por elementos correctos incluida</p>' +
      '</div>' +
      (resumen.length ? '<ul class="text-sm text-slate-300 mb-4 list-disc list-inside">' +
        resumen.map(l => "<li>" + escapar(l) + "</li>").join("") + '</ul>' : '') +
      '<div class="apunte-card mb-4">' +
        '<div class="apunte-tema">Explicación</div>' +
        '<div class="text-sm text-slate-300">' + caso.diagrama.exp + '</div>' +
      '</div>' +
      '<div class="flex flex-wrap gap-3 justify-center mt-5">' +
        '<button class="btn btn-primary" data-action="startCasos">Volver a casos</button>' +
        '<button class="btn btn-ghost" data-action="goHome">Inicio</button>' +
      '</div>';
    return;
  }
  
  // Estado inicial: mostrar narrativa y montar el lienzo del constructor.
  cont.innerHTML =
    '<div class="apunte-card mb-4">' +
      '<div class="apunte-tema">Caso</div>' +
      '<div class="text-sm text-slate-300">' + escapar(caso.caso) + '</div>' +
    '</div>' +
    '<div id="lienzo-caso"></div>';
}
