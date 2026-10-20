// Render de la portada del track: título, subtítulo, acento, panel de tipos y franja de
// continuidad. Recibe datos y callbacks; no toca localStorage ni reglas de dominio.
import { acentoDe } from "../../core/index.js";
import { TIPOS, TIPO_LABELS, animar } from "../helpers.js";
import { icono } from "../iconos.js";

export function pintarPortada($, track) {
  if (!track.materia) return;
  document.title = track.materia.nombre + " — Systematic";
  const nombre = $("materia-nombre");
  const iconoSpan = $("materia-icono");
  if (nombre) nombre.textContent = track.materia.nombre;
  if (iconoSpan) iconoSpan.innerHTML = icono(track.materia.icono);
  const sub = $("portada-sub");
  if (sub) sub.textContent = track.materia.descripcion || "";
  const temaMeta = document.querySelector('meta[name="theme-color"]');
  if (temaMeta) temaMeta.setAttribute("content", track.materia.color);
  const gloTitulo = $("glosario-titulo");
  if (gloTitulo) gloTitulo.textContent = "Glosario";
}

export function aplicarAcento(materia) {
  const root = document.documentElement;
  if (!materia) {
    root.style.removeProperty("--materia-accent");
    root.style.removeProperty("--materia-accent-texto");
    return;
  }
  const a = acentoDe(materia);
  root.style.setProperty("--materia-accent", a.color);
  root.style.setProperty("--materia-accent-texto", a.texto);
}

export function pintarTiposPanel($, track, diagramasDisponibles) {
  const panel = $("tipos-panel");
  if (!panel) return;
  const conteos = {};
  track.banco.forEach(q => { conteos[q.tipo] = (conteos[q.tipo] || 0) + 1; });
  panel.innerHTML = TIPOS.filter(t => conteos[t] && (diagramasDisponibles() || t !== "diagrama")).map(t =>
    '<button class="chip" data-action="practicarTipo" data-tipo="' + t + '">' + (TIPO_LABELS[t] || t) + ' · ' + conteos[t] + '</button>'
  ).join("");
}

export function pintarContinuidad($, { cuando, debiles }) {
  const slot = $("continuidad");
  if (!slot) return;
  slot.innerHTML = '<div class="continuidad">' +
    '<div class="min-w-0"><div class="continuidad-titulo">Sigue donde lo dejaste</div>' +
    '<div class="continuidad-sub">Última vez ' + cuando + (debiles ? " · " + debiles + " débiles por repasar" : " · sin débiles pendientes") + '</div></div>' +
    (debiles ? '<button class="btn btn-primary btn-sm shrink-0" data-action="practicarDebiles">Seguir con débiles</button>' : "") +
  '</div>';
  if (slot.firstChild) animar(slot.firstChild);
}
