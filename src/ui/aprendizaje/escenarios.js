// Render de la lista y la ejecución de escenarios multi-paso (spec 003 y evolución pedagógica).
// Funciones puras de render: reciben datos y estado; no leen localStorage.
import { escapar } from "../helpers.js";
import { estadoVacio } from "../componentes/estados.js";
import { tarjeta } from "../componentes/tarjetas.js";
import { tagRating } from "../componentes/etiquetas.js";
import {
  pasoActual, narrativaDePaso, opcionesVisiblesDePaso, temasDebilesDeEscenario
} from "../../core/index.js";

/** @type {(id: string) => any} */
const $ = id => document.getElementById(id);

export function pintarListaEscenarios(escenarios, registros) {
  const cont = $("escenarios-lista");
  if (!cont) return;
  cont.innerHTML = escenarios.map(e => {
    const registro = registros[e.id];
    const mejor = registro
      ? (registro.mejorRating === "exito" ? "Éxito" : registro.mejorRating === "parcial" ? "Parcial" : "Fracaso")
      : "Sin jugadas";
    return tarjeta({
      tema: e.tema,
      titulo: e.titulo,
      cuerpo: '<p class="text-sm text-slate-300 mb-3">' + escapar(e.intro) + '</p>',
      // Ofrece dos modalidades pedagógicas: simulacro a ciegas sin pistas intermedias o estudio guiado.
      pie: '<div class="flex items-center justify-between w-full mt-2 gap-2 flex-wrap">' +
        '<span class="text-xs text-slate-400">Mejor: ' + mejor + '</span>' +
        '<div class="flex gap-2">' +
          '<button class="btn btn-secondary btn-sm" data-action="jugarEscenario" data-id="' + e.id + '" data-modo="simulacro" title="Simulacro de parcial sin pistas intermedias, informe al final">Simulacro</button>' +
          '<button class="btn btn-primary btn-sm" data-action="jugarEscenario" data-id="' + e.id + '" data-modo="estudio" title="Estudio guiado con lentes de análisis y feedback paso a paso">Estudio</button>' +
        '</div>' +
      '</div>'
    });
  }).join("") || estadoVacio("Aún no hay escenarios para esta materia.");
}

export function pintarEscenario(escenario, estado) {
  const cont = $("escenario-escena");
  if (!cont) return;

  // Pantalla de cierre al concluir el escenario (con informe de autopsia, corrección y puente).
  if (estado.terminado) {
    const finalTexto = estado.rating === "exito"
      ? escenario.finales.exito
      : estado.rating === "parcial"
        ? escenario.finales.parcial
        : escenario.finales.fracaso;

    const falladas = estado.decisiones.filter(d => d.puntos < 2);
    const temasDebiles = temasDebilesDeEscenario(estado);

    let html =
      '<div class="text-center mb-5">' +
        tagRating(estado.rating) +
        '<p class="text-sm text-slate-300 mt-3 leading-relaxed">' + escapar(finalTexto) + '</p>' +
        '<p class="text-xs text-slate-400 mt-1">Puntuación: ' + estado.puntos + ' pts · XP por buenas decisiones incluida</p>' +
      '</div>' +
      '<h2 class="section-title">Informe Forense de Decisiones</h2>' +
      estado.decisiones.map(d => {
        const claseClima = d.puntos === 2 ? "review-ok" : d.puntos === 0 ? "review-bad" : "review-parcial";
        let card = '<div class="review-item ' + claseClima + ' mb-3">';
        card += '<div class="flex items-center justify-between mb-1 gap-2 flex-wrap">';
        card += '<div class="font-semibold text-sm">' + escapar(d.texto) + ' <span class="text-xs text-slate-400">(' + d.puntos + ' pts)</span></div>';
        if (d.tema) card += '<span class="chip text-xs">' + escapar(d.tema) + '</span>';
        card += '</div>';
        card += '<div class="text-sm text-slate-300 mb-2">' + escapar(d.feedback) + '</div>';

        // Desglose de autopsia arquitectónica si la decisión contenía post-mortem estructurado.
        if (d.autopsia) {
          card += '<div class="autopsia-box p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs flex flex-col gap-1.5 mt-2">' +
            '<div class="text-rose-400 leading-snug"><strong>💥 Incidente:</strong> ' + escapar(d.autopsia.incidente) + '</div>' +
            '<div class="text-amber-300 leading-snug"><strong>🧠 Trampa Mental:</strong> ' + escapar(d.autopsia.trampa) + '</div>' +
            '<div class="text-emerald-300 leading-snug"><strong>📐 Regla de Examen:</strong> ' + escapar(d.autopsia.principio) + '</div>' +
          '</div>';
        }
        card += '</div>';
        return card;
      }).join("");

    // Botones de acción final: recuperación focalizada de fallos, volver a lista o inicio.
    html += '<div class="flex flex-wrap gap-3 justify-center mt-6">';
    if (falladas.length > 0) {
      html += '<button class="btn btn-primary" data-action="corregirEscenario">🛠️ Corregir decisiones falladas (' + falladas.length + ')</button>';
    }
    html += '<button class="btn btn-secondary" data-action="startEscenarios">Volver a escenarios</button>' +
      '<button class="btn btn-ghost" data-action="goHome">Inicio</button>' +
    '</div>';

    // Puente de refuerzo pedagógico: conecta los fallos con las misiones y apuntes específicos.
    if (temasDebiles.length > 0) {
      html += '<div class="puente-refuerzo mt-6 p-4 rounded-xl bg-slate-950 border border-slate-700 text-left">' +
        '<h3 class="text-sm font-bold text-sky-400 mb-1">Puente de Refuerzo Pedagógico</h3>' +
        '<p class="text-xs text-slate-400 mb-3">Refuerza la teoría de los conceptos específicos donde hubo fallos antes de repetir el caso:</p>' +
        '<div class="flex flex-wrap gap-2">' +
          temasDebiles.map(t =>
            '<button class="btn btn-secondary btn-sm" data-action="iniciarMision" data-tema="' + escapar(t) + '">🎯 Misión: ' + escapar(t) + '</button>'
          ).join("") +
          '<button class="btn btn-ghost btn-sm" data-action="startApuntes">📖 Ver Apuntes</button>' +
        '</div>' +
      '</div>';
    }

    cont.innerHTML = html;
    return;
  }

  const paso = pasoActual(escenario, estado);
  if (!paso) return;

  const decididas = estado.decisiones.length + (estado.pendiente ? 1 : 0);
  const modoLabel = estado.modoCorreccion
    ? "Modo Corrección"
    : estado.modo === "simulacro"
      ? "Simulacro a Ciegas"
      : "Estudio Guiado";

  // Barra de estado superior: progreso, puntaje, modo pedagógico y tema conceptual.
  let html = '<div class="flex items-center justify-between mb-3 flex-wrap gap-2 text-xs text-slate-400">';
  html += '<span>Decisión ' + decididas + ' · ' + estado.puntos + ' pts acumulados</span>';
  html += '<div class="flex items-center gap-2">';
  html += '<span class="chip text-xs">' + modoLabel + '</span>';
  if (paso.tema) html += '<span class="chip text-xs">' + escapar(paso.tema) + '</span>';
  html += '</div></div>';

  // Botón para alternar variantes de redacción del enunciado (evita memorización visual).
  if (Array.isArray(paso.variantes) && paso.variantes.length > 0) {
    html += '<div class="flex justify-end mb-2">' +
      '<button class="btn btn-ghost btn-mini text-xs" data-action="alternarVarianteEscenario" title="Ver otra forma de plantear la misma situación">🔄 Otra forma de expresar la idea</button>' +
    '</div>';
  }

  // Barra de Lentes pedagógicos: visible solo en modo estudio para guiar el análisis conceptual.
  if (estado.modo !== "simulacro" && paso.lentes) {
    const hayLentes = paso.lentes.negocio || paso.lentes.calidad || paso.lentes.sintoma;
    if (hayLentes) {
      html += '<div class="flex items-center gap-2 mb-3 flex-wrap"><span class="text-xs text-slate-400 font-semibold">Lentes de análisis:</span>';
      if (paso.lentes.negocio) {
        const on = estado.lenteActivo === "negocio" ? "chip-on" : "";
        html += '<button class="chip ' + on + '" data-action="cambiarLenteEscenario" data-lente="negocio">💼 Negocio</button>';
      }
      if (paso.lentes.calidad) {
        const on = estado.lenteActivo === "calidad" ? "chip-on" : "";
        html += '<button class="chip ' + on + '" data-action="cambiarLenteEscenario" data-lente="calidad">📐 Calidad SEI</button>';
      }
      if (paso.lentes.sintoma) {
        const on = estado.lenteActivo === "sintoma" ? "chip-on" : "";
        html += '<button class="chip ' + on + '" data-action="cambiarLenteEscenario" data-lente="sintoma">⚠️ Síntoma Técnico</button>';
      }
      html += '</div>';

      // Panel desplegable con el contenido del lente seleccionado.
      if (estado.lenteActivo && paso.lentes[estado.lenteActivo]) {
        const etiqueta = estado.lenteActivo === "negocio"
          ? "Dolor e Impacto de Negocio"
          : estado.lenteActivo === "calidad"
            ? "Atributo de Calidad (SEI / ISO 25010)"
            : "Síntoma y Antipatrón en Código";
        html += '<div class="lente-panel mb-4 p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-slate-200 anim-in">' +
          '<div class="font-bold text-xs uppercase tracking-wide text-sky-400 mb-1">Perspectiva: ' + etiqueta + '</div>' +
          escapar(paso.lentes[estado.lenteActivo]) +
        '</div>';
      }
    }
  }

  // Narrativa del paso actual, considerando la variante activa.
  html += '<div class="text-base sm:text-lg leading-relaxed mb-4">' + escapar(narrativaDePaso(paso, estado)) + '</div>';

  // Si hay una decisión pendiente de avance, muestra el feedback y la autopsia del fallo si aplica.
  if (estado.pendiente) {
    const pnt = estado.pendiente.puntos;
    const claseClima = pnt === 2 ? "feedback-ok" : pnt === 1 ? "feedback-neutro" : "feedback-bad";
    const tituloPuntos = pnt === 2
      ? "✅ Decisión Óptima (+2 pts)"
      : pnt === 1
        ? "⚠️ Solución Parcial (+1 pto)"
        : "❌ Fallo Arquitectónico (0 pts)";

    html += '<div class="feedback ' + claseClima + '" style="display:block">';
    html += '<div class="font-semibold text-sm mb-1">' + tituloPuntos + '</div>';
    html += '<div class="text-sm text-slate-300">' + escapar(estado.pendiente.feedback) + '</div>';

    if (estado.pendiente.autopsia) {
      const a = estado.pendiente.autopsia;
      html += '<div class="autopsia-box mt-3 pt-3 border-t border-slate-700/60 flex flex-col gap-1.5 text-xs text-left">' +
        '<div class="text-rose-400 leading-snug"><strong>💥 Incidente en Producción:</strong> ' + escapar(a.incidente) + '</div>' +
        '<div class="text-amber-300 leading-snug"><strong>🧠 Trampa Mental:</strong> ' + escapar(a.trampa) + '</div>' +
        '<div class="text-emerald-300 leading-snug"><strong>📐 Regla de Examen:</strong> ' + escapar(a.principio) + '</div>' +
      '</div>';
    }
    html += '</div>';
    html += '<div class="mt-4"><button class="btn btn-primary" data-action="continuarEscenario">Continuar</button></div>';
  } else {
    // Lista de opciones respetando la permutación anti-descarte configurada en el estado.
    const opciones = opcionesVisiblesDePaso(paso, estado);
    html += '<div class="flex flex-col gap-3">' + opciones.map((o, i) =>
      '<button class="option" data-action="decidirEscenario" data-idx="' + i + '"><span class="opt-key">' + (i + 1) + '</span><span>' + escapar(o.texto) + '</span></button>'
    ).join("") + '</div>';
  }

  cont.innerHTML = html;
}
