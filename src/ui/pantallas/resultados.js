// Render de la pantalla de resultados de una sesión.
// Recibe la sesión vía `ctx` y el callback de persistencia; no lee localStorage.
import { respuestaCorrecta } from "../../core/sesiones.js";
import { animar, colorTema, escapar, resaltarSQL, sqlKeywordsDe } from "../helpers.js";
import { icono } from "../iconos.js";
import { anilloPuntaje } from "../componentes/anillo.js";

const $ = id => document.getElementById(id);

export function crearResultadosUI({ ctx, registrarRespuesta }) {
  const keywords = () => sqlKeywordsDe(ctx.materia);
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
    const session = ctx.session;
    if (!session || !session.resultado) return;
    const r = session.resultado;
    const mensaje = r.aciertos === r.totalCal
      ? "¡Perfecto! Dominas todos los conceptos."
      : r.pct >= 70
        ? "¡Muy bien! Repasa las fallas para afinar los detalles."
        : "Buen intento. Lee las explicaciones y repite el repaso.";

    const colorAnillo = r.pct >= 80 ? "#10b981" : r.pct >= 60 ? "#38bdf8" : r.pct >= 40 ? "#fbbf24" : "#f43f5e";
    let html = '<div class="text-center mb-6">' +
      anilloPuntaje(r.pct, colorAnillo) +
      '<p class="text-base sm:text-lg">Acertaste <b>' + r.aciertos + ' de ' + r.totalCal + '</b> preguntas' + (session.modo === "simulacro" ? " en el simulacro." : session.modo === "supervivencia" ? " en Supervivencia." : ".") + '</p>' +
      (r.supervivencia ? '<p class="text-xs text-slate-400 mt-2 flex items-center gap-1.5">' + icono("supervivencia", "icono-sm") + '<span>Respondiste ' + r.supervivencia.jugadas + ' pregunta(s) · mejor combo: ' + r.supervivencia.mejorCombo + '</span></p>' : "") +
      (r.desarrollos.length ? '<p class="text-xs text-slate-400 mt-2">' + r.desarrollos.length + ' pregunta(s) de desarrollo se autoevalúan aparte.</p>' : "") +
      '<p class="text-xs text-slate-400 mt-2 flex items-center justify-center gap-1.5">' + icono("reloj", "icono-sm") + '<span>Tiempo: ' + r.tiempo + '</span></p>' +
      '<p class="text-slate-400 mt-2 text-sm">' + mensaje + '</p>' +
    '</div>';

    html += '<h2 class="section-title">Desglose por tema</h2><div class="flex flex-col gap-2.5">' +
      Object.keys(r.porTema).map(tema => {
        const d = r.porTema[tema];
        const p = Math.round((d.ok / d.total) * 100);
        return '<div class="topic-row">' +
          '<span class="text-slate-300">' + tema + '</span>' +
          '<div class="topic-bar"><div class="topic-bar-fill" style="width:' + p + '%; background:' + colorTema(ctx.materia, tema) + '"></div></div>' +
          '<span class="topic-score">' + d.ok + '/' + d.total + '</span>' +
        '</div>';
      }).join("") +
    '</div>';

    const lista = verTodas ? r.calificables : r.falladas;
    if (lista.length) {
      html += '<h2 class="section-title">' + (verTodas ? "Todas las preguntas (" + r.calificables.length + ")" : "Preguntas falladas (" + r.falladas.length + ")") + '</h2><div class="flex flex-col gap-3">';
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
      html += '<h2 class="section-title">Preguntas de desarrollo</h2><div class="flex flex-col gap-3">';
      r.desarrollos.forEach(item => {
        const i = r.items.indexOf(item);
        const a = session.answers[i] || {};
        const pendiente = a.skipped || a.ok === null || a.ok === undefined;
        html += '<div class="review-item review-bad">' +
          '<div class="font-semibold leading-relaxed mb-3">' + escapar(item.q) + '</div>' +
          '<div class="flex items-start gap-2 text-sm mb-2"><span class="tag tag-bad mt-0.5">Tu respuesta</span><div class="flex-1 min-w-0"><pre class="code-block">' + escapar(a.selected || "(sin escribir)") + '</pre></div></div>' +
          '<div class="text-sm mb-2"><span class="tag tag-ok">Solución modelo</span></div>' +
          '<pre class="code-block">' + resaltarSQL(item.solucion, keywords()) + '</pre>' +
          '<div class="mt-3 text-sm text-slate-300 leading-relaxed">' + item.exp + '</div>' +
          '<div class="mt-3" id="eval-' + item.id + '">' +
            (pendiente
              ? '<p class="text-xs text-slate-400 mb-2">Autoevaluación (no afecta el puntaje):</p><div class="flex gap-3 flex-wrap"><button class="btn btn-primary btn-sm" data-action="autoevaluarResultado" data-id="' + item.id + '" data-ok="true">Me acerqué</button><button class="btn btn-secondary btn-sm" data-action="autoevaluarResultado" data-id="' + item.id + '" data-ok="false">No pude</button></div>'
              : '<span class="tag ' + (a.ok ? "tag-ok" : "tag-bad") + '">Autoevaluación: ' + (a.ok ? "Me acerqué" : "No pude") + '</span>') +
          '</div>' +
        '</div>';
      });
      html += '</div>';
    }

    html += '<div class="flex flex-wrap gap-3 justify-center mt-7">' +
      (session.modo === "mision" ? '<button class="btn btn-primary w-full sm:w-auto" data-action="irMisiones">Volver al mapa</button>' : "") +
      (r.falladas.length ? '<button class="btn btn-primary w-full sm:w-auto" data-action="repetirFalladas">Repasar solo falladas (' + r.falladas.length + ')</button>' : "") +
      (r.calificables.length ? '<button class="btn btn-secondary w-full sm:w-auto" data-action="pintarResultados" data-ver-todas="' + !verTodas + '">' + (verTodas ? "Ver solo falladas" : "Ver todas las preguntas") + '</button>' : "") +
      '<button class="btn btn-secondary w-full sm:w-auto" data-action="repetirMisma">Repetir ronda</button>' +
      '<button class="btn btn-ghost w-full sm:w-auto" data-action="goHome">Inicio</button>' +
    '</div>';

    $("screen-results").innerHTML = html;
    animar($("screen-results"));
  }

  function autoevaluarResultado(id, ok) {
    const session = ctx.session;
    const i = session.items.findIndex(it => it.id === id);
    if (i >= 0 && session.answers[i]) session.answers[i].ok = ok;
    registrarRespuesta(id, ok);
    const cont = $("eval-" + id);
    if (cont) cont.innerHTML = '<span class="tag ' + (ok ? "tag-ok" : "tag-bad") + '">Autoevaluación: ' + (ok ? "Me acerqué" : "No pude") + '</span>';
  }

  return { pintarResultados, autoevaluarResultado };
}
