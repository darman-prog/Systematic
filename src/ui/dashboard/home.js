// Renderers del home (dashboard): lista de materias, sección de lenguajes con su barra de
// competencia y panel de perfil. Reciben sus dependencias por parámetro y no tocan
// localStorage ni estado global (ADR 001/007).
import { MATERIAS, LENGUAJES, barraDeCompetencia } from "../../core/index.js";
import { icono } from "../iconos.js";
import { barraCompetencia } from "../componentes/competencia.js";
import { escapar, saludoSegunHora } from "../helpers.js";

export function crearHome({ persistencia, gamificacion }) {
  const $ = id => document.getElementById(id);
  let xpMostrado = 0;

  // Respeta la preferencia del sistema: sin animación de conteo si el usuario pide menos movimiento.
  function prefiereMenosMovimiento() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  // Contador de XP (spec 006): sube con easing; sin animación si el usuario pide menos movimiento.
  function contarHasta(el, desde, hasta) {
    if (!el) return;
    if (desde === hasta || prefiereMenosMovimiento()) {
      el.textContent = hasta;
      return;
    }
    const inicio = performance.now();
    const dur = 460;
    function paso(t) {
      const k = Math.min(1, (t - inicio) / dur);
      const suave = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(desde + (hasta - desde) * suave);
      if (k < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
  }

  function renderPerfil() {
    const cont = $("perfil-panel");
    if (!cont) return;
    const p = gamificacion.perfil();
    const desde = xpMostrado;
    xpMostrado = p.xp;
    cont.innerHTML =
      '<div class="perfil-card">' +
        '<div class="perfil-nivel"><span class="perfil-num">' + p.nivel + '</span><span class="perfil-etq">nivel</span></div>' +
        '<div class="perfil-datos">' +
          '<p class="text-xs font-semibold text-slate-300 mb-1">' + (persistencia.nombre() ? "Perfil de " + escapar(persistencia.nombre()) : "Tu perfil") + '</p>' +
          '<div class="text-sm"><b id="perfil-xp">' + desde + '</b> XP' + (p.faltante ? " · faltan " + p.faltante + " para el nivel " + (p.nivel + 1) : "") + '</div>' +
          '<div class="progress-track mt-2"><div class="progress-fill" style="width:' + p.pct + '%"></div></div>' +
          '<div class="perfil-mini">Racha: ' + p.racha + ' día(s) · ' + p.insignias + ' logro(s) desbloqueado(s)</div>' +
        '</div>' +
      '</div>';
    contarHasta($("perfil-xp"), desde, p.xp);
  }

  function renderMaterias() {
    const cont = $("materias-list");
    if (!cont) return;
    const saludo = $("saludo-home");
    if (saludo) saludo.textContent = saludoSegunHora(persistencia.nombre());

    cont.innerHTML = MATERIAS.map(m => {
      const n = m.conteo?.preguntas ?? 0;
      const nGlosario = m.conteo?.terminos ?? 0;
      const pendiente = n === 0;

      const detalles = pendiente
        ? "Contenido en preparación"
        : n + " preguntas" + (nGlosario ? " · " + nGlosario + " términos" : "");

      const ariaLabel = m.nombre + ". " + m.descripcion + ". " + detalles + ". " +
        (pendiente ? "Materia no disponible aún." : "Presiona para entrar.");

      return '<button class="materia-card" data-action="seleccionarMateria" data-materia="' + m.id + '" ' +
        'aria-label="' + ariaLabel + '" ' +
        (pendiente ? 'disabled aria-disabled="true" ' : '') +
        'style="--materia-color:' + m.color + '">' +
        '<span class="materia-icono">' + icono(m.icono) + '</span>' +
        '<div class="materia-info">' +
          '<span class="materia-nombre">' + m.nombre + '</span>' +
          '<span class="materia-desc">' + m.descripcion + '</span>' +
        '</div>' +
        '<div class="materia-stats">' +
          '<span class="materia-stats-texto' + (pendiente ? " materia-pendiente-texto" : "") + '">' + detalles + '</span>' +
          (pendiente ? '' : '<span class="materia-arrow" aria-hidden="true">→</span>') +
        '</div>' +
      '</button>';
    }).join("");

    renderLenguajes();
  }

  // Sección de lenguajes del home (spec 011): tarjeta por track con su barra de competencia.
  // La barra reconcilia la versión del examen contra el roadmap, así que se carga solo el
  // roadmap (chunk chico) y se cachea; no se descargan las preguntas hasta entrar al track.
  const roadmapCache = new Map();
  async function roadmapDe(l) {
    if (!roadmapCache.has(l.id)) roadmapCache.set(l.id, await l.cargarRoadmap());
    return roadmapCache.get(l.id);
  }

  async function renderLenguajes() {
    const seccion = $("lenguajes-seccion");
    const cont = $("lenguajes-list");
    if (!seccion || !cont) return;
    if (!LENGUAJES.length) {
      seccion.classList.add("hidden");
      return;
    }
    seccion.classList.remove("hidden");

    const tarjetas = await Promise.all(LENGUAJES.map(async l => {
      const registro = persistencia.competencia(l.id);
      const roadmap = await roadmapDe(l);
      const barra = barraDeCompetencia(roadmap.etapas, registro);
      const total = barra.total;
      const pendiente = (l.conteo?.preguntas ?? 0) === 0;
      const detalles = pendiente
        ? "Contenido en preparación"
        : l.conteo.preguntas + " preguntas · " + total + " etapas";

      // La barra es visual; el conteo entra en el nombre accesible del botón para que un
      // lector de pantalla lo anuncie al enfocar la tarjeta.
      const competenciaTexto = barra.aprobadas + " de " + total + (total === 1 ? " etapa aprobada" : " etapas aprobadas");

      const ariaLabel = l.nombre + ". " + l.descripcion + ". " + detalles + ". Competencia: " +
        competenciaTexto + ". " + (pendiente ? "No disponible aún." : "Presiona para entrar.");

      return '<button class="materia-card materia-card--lenguaje" data-action="seleccionarLenguaje" data-lenguaje="' + l.id + '" ' +
        'aria-label="' + ariaLabel + '" ' +
        (pendiente ? 'disabled aria-disabled="true" ' : '') +
        'style="--materia-color:' + l.color + '">' +
        '<span class="materia-icono">' + icono(l.icono) + '</span>' +
        '<div class="materia-info">' +
          '<span class="materia-nombre">' + l.nombre + '</span>' +
          '<span class="materia-desc">' + l.descripcion + '</span>' +
        '</div>' +
        '<div class="materia-stats">' +
          '<span class="materia-stats-texto">' + detalles + '</span>' +
          barraCompetencia({ ...barra, color: l.color }) +
        '</div>' +
      '</button>';
    }));

    cont.innerHTML = tarjetas.join("");
  }

  return { renderMaterias, renderLenguajes, renderPerfil };
}
