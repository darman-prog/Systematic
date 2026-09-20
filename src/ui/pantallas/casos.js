// Render de la lista y ejecución de casos de diagramación (spec 003, H6c).
// Cada caso es una narrativa + un diagrama a construir con el lienzo compartido.
import { escapar, seccionesCorreccion } from "../helpers.js";
import { planCorreccion } from "../../core/diagramas.js";
import { estadoVacio } from "../componentes/estados.js";
import { tarjeta } from "../componentes/tarjetas.js";
import { tagRating } from "../componentes/etiquetas.js";

const $ = id => document.getElementById(id);

export function pintarListaCasos(casos, registros) {
  const cont = $("casos-lista");
  if (!cont) return;
  cont.innerHTML = casos.map(c => {
    const registro = registros[c.id];
    // Registro corrupto o con rating desconocido se trata como "Sin jugar" (localStorage no es confiable).
    const ratingOk = registro && ["exito", "parcial", "fracaso"].includes(registro.mejorRating);
    const mejor = ratingOk
      ? (registro.mejorRating === "exito" ? "Éxito" : registro.mejorRating === "parcial" ? "Parcial" : "Fracaso")
      : "Sin jugar";
    return tarjeta({
      tema: c.tema,
      titulo: c.titulo,
      cuerpo: '<p class="text-sm text-slate-300 mb-3">' + escapar(c.caso) + '</p>',
      pie: '<span class="text-xs text-slate-400">Mejor resultado: ' + mejor + '</span>' +
        '<button class="btn btn-primary btn-sm" data-action="jugarCaso" data-id="' + c.id + '">Jugar caso</button>'
    });
  }).join("") || estadoVacio("Aún no hay casos para esta materia.");
}

export function pintarCaso(caso, estado, resultado) {
  const cont = $("caso-escena");
  if (!cont) return;

  if (resultado) {
    const finalTexto = resultado.rating === "exito" ? caso.finales.exito : resultado.rating === "parcial" ? caso.finales.parcial : caso.finales.fracaso;
    const plan = resultado.detalle ? planCorreccion(resultado.detalle) : null;
    cont.innerHTML =
      '<div class="text-center mb-5">' +
        tagRating(resultado.rating) +
        '<p class="text-sm text-slate-300 mt-3">' + escapar(finalTexto) + '</p>' +
        '<p class="text-xs text-slate-400 mt-1">XP ganada por elementos correctos incluida</p>' +
      '</div>' +
      (plan ? seccionesCorreccion(plan) : '') +
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
