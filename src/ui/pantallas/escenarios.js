// Render de la lista y la ejecución de escenarios multi-paso (spec 003).
// Funciones puras de render: reciben datos y estado; no leen localStorage.
import { escapar } from "../helpers.js";
import { icono } from "../iconos.js";

const $ = id => document.getElementById(id);

const RATINGS = {
  exito: { texto: "¡Éxito!", icono: "check", clase: "tag-ok" },
  parcial: { texto: "Resultado parcial", icono: "idea", clase: "tag-practica" },
  fracaso: { texto: "Fracaso", icono: "cruz", clase: "tag-bad" }
};

export function pintarListaEscenarios(escenarios, registros) {
  const cont = $("escenarios-lista");
  if (!cont) return;
  cont.innerHTML = escenarios.map(e => {
    const registro = registros[e.id];
    const mejor = registro
      ? (registro.mejorRating === "exito" ? "Éxito" : registro.mejorRating === "parcial" ? "Parcial" : "Fracaso")
      : "Sin jugadas";
    return '<div class="apunte-card">' +
      '<div class="apunte-tema">' + escapar(e.tema) + '</div>' +
      '<div class="apunte-titulo">' + escapar(e.titulo) + '</div>' +
      '<p class="text-sm text-slate-300 mb-3">' + escapar(e.intro) + '</p>' +
      '<div class="flex items-center justify-between gap-3 flex-wrap">' +
        '<span class="text-xs text-slate-400">Mejor resultado: ' + mejor + '</span>' +
        '<button class="btn btn-primary btn-sm" data-action="jugarEscenario" data-id="' + e.id + '">Jugar escenario</button>' +
      '</div>' +
    '</div>';
  }).join("") || '<p class="text-sm text-slate-400">Aún no hay escenarios para esta materia.</p>';
}

export function pintarEscenario(escenario, estado) {
  const cont = $("escenario-escena");
  if (!cont) return;
  if (estado.terminado) {
    const r = RATINGS[estado.rating] || RATINGS.parcial;
    const finalTexto = estado.rating === "exito" ? escenario.finales.exito : estado.rating === "parcial" ? escenario.finales.parcial : escenario.finales.fracaso;
    cont.innerHTML =
      '<div class="text-center mb-5">' +
        '<span class="tag ' + r.clase + '">' + icono(r.icono, "icono-sm") + r.texto + '</span>' +
        '<p class="text-sm text-slate-300 mt-3">' + escapar(finalTexto) + '</p>' +
        '<p class="text-xs text-slate-400 mt-1">Puntuación: ' + estado.puntos + ' pts · XP por buenas decisiones incluida</p>' +
      '</div>' +
      '<h2 class="section-title">Tus decisiones</h2>' +
      estado.decisiones.map(d =>
        '<div class="review-item ' + (d.puntos === 2 ? "review-ok" : d.puntos === 0 ? "review-bad" : "") + ' mb-3">' +
          '<div class="font-semibold text-sm mb-1">' + escapar(d.texto) + ' <span class="text-xs text-slate-400">(' + d.puntos + ' pts)</span></div>' +
          '<div class="text-sm text-slate-300">' + escapar(d.feedback) + '</div>' +
        '</div>'
      ).join("") +
      '<div class="flex flex-wrap gap-3 justify-center mt-5">' +
        '<button class="btn btn-primary" data-action="startEscenarios">Volver a escenarios</button>' +
        '<button class="btn btn-ghost" data-action="goHome">Inicio</button>' +
      '</div>';
    return;
  }
  const paso = escenario.pasos.find(p => p.id === estado.pasoId);
  if (!paso) return;
  const decididas = estado.decisiones.length + (estado.pendiente ? 1 : 0);
  let html = '<div class="text-xs text-slate-400 mb-2">Decisión ' + decididas + ' · ' + estado.puntos + ' pts acumulados</div>';
  html += '<div class="text-base sm:text-lg leading-relaxed mb-4">' + escapar(paso.narrativa) + '</div>';
  if (estado.pendiente) {
    html += '<div class="feedback feedback-neutro" style="display:block">' + escapar(estado.pendiente.feedback) + '</div>';
    html += '<div class="mt-4"><button class="btn btn-primary" data-action="continuarEscenario">Continuar</button></div>';
  } else {
    html += '<div class="flex flex-col gap-3">' + paso.opciones.map((o, i) =>
      '<button class="option" data-action="decidirEscenario" data-idx="' + i + '"><span class="opt-key">' + (i + 1) + '</span><span>' + escapar(o.texto) + '</span></button>'
    ).join("") + '</div>';
  }
  cont.innerHTML = html;
}
