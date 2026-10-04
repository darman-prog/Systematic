// Renderers del home (dashboard): lista de materias, sección de lenguajes con su barra de
// competencia y panel de perfil. Reciben sus dependencias por parámetro y no tocan
// localStorage ni estado global (ADR 001/007).
import { MATERIAS, LENGUAJES, barraDeCompetencia } from "../../core/index.js";
import { icono } from "../iconos.js";
import { barraCompetencia } from "../componentes/competencia.js";
import { escapar, saludoSegunHora } from "../helpers.js";

const plural = (n, uno, varios) => (n === 1 ? uno : varios);

export function crearHome({ persistencia, gamificacion }) {
  const $ = id => document.getElementById(id);
  let xpMostrado = 0;
  let versionLenguajes = 0;

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

    const pct = Math.max(0, Math.min(100, Math.round(p.pct)));
    const nombrePerfil = persistencia.nombre() ? `Perfil de ${escapar(persistencia.nombre())}` : "Tu perfil";
    const faltan = p.faltante
      ? `<p class="perfil-faltan">Faltan ${p.faltante} XP para el nivel ${p.nivel + 1}</p>`
      : "";

    cont.innerHTML = `
      <div class="perfil-card">
        <div class="perfil-anillo" role="progressbar" aria-label="Progreso hacia el nivel ${p.nivel + 1}"
             aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}">
          <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            <circle class="anillo-pista" cx="50" cy="50" r="44"/>
            <circle class="anillo-valor" cx="50" cy="50" r="44" pathLength="100" style="--pct:${pct}"/>
          </svg>
          <span class="perfil-num">${p.nivel}</span>
          <span class="perfil-etq">nivel</span>
        </div>

        <div class="perfil-datos">
          <p class="perfil-nombre">${nombrePerfil}</p>
          <p class="perfil-xp"><b id="perfil-xp">${desde}</b> XP</p>
          ${faltan}
          <ul class="perfil-chips">
            <li class="perfil-chip perfil-chip--racha">
              ${icono("llama", "icono-sm")}
              <span><b>${p.racha}</b> ${plural(p.racha, "día", "días")} de racha</span>
            </li>
            <li class="perfil-chip perfil-chip--logros">
              ${icono("medalla", "icono-sm")}
              <span><b>${p.insignias}</b> ${plural(p.insignias, "logro", "logros")}</span>
            </li>
          </ul>
        </div>
      </div>
    `;
    contarHasta($("perfil-xp"), desde, p.xp);
  }

  function renderMaterias() {
    const cont = $("materias-list");
    if (!cont) return;
    const saludo = $("saludo-home");
    if (saludo) saludo.textContent = saludoSegunHora(persistencia.nombre());

    const html = MATERIAS.map(m => {
      const n = m.conteo?.preguntas ?? 0;
      const nGlosario = m.conteo?.terminos ?? 0;
      const pendiente = n === 0;

      const detalles = pendiente
        ? "Contenido en preparación"
        : `${n} ${plural(n, "pregunta", "preguntas")}${nGlosario ? ` · ${nGlosario} ${plural(nGlosario, "término", "términos")}` : ""}`;

      const ariaLabel = `${m.nombre}. ${m.descripcion}. ${detalles}. ${
        pendiente ? "Materia no disponible aún." : "Presiona para entrar."
      }`;

      const disabledAttr = pendiente ? 'disabled aria-disabled="true"' : "";

      const stats = pendiente
        ? '<span class="chip-proximamente">Próximamente</span>'
        : `<span class="materia-stats-texto">${detalles}</span>
           <span class="materia-arrow" aria-hidden="true">${icono("flecha", "icono-sm")}</span>`;

      return `
        <button class="materia-card ${pendiente ? "is-pendiente" : ""}"
                data-action="seleccionarMateria"
                data-materia="${m.id}"
                aria-label="${escapar(ariaLabel)}"
                ${disabledAttr}
                style="--materia-color: ${m.color}">
          <span class="materia-icono">${icono(m.icono)}</span>
          <span class="materia-info">
            <span class="materia-nombre">${escapar(m.nombre)}</span>
            <span class="materia-desc">${escapar(m.descripcion)}</span>
          </span>
          <span class="materia-stats">${stats}</span>
        </button>
      `;
    }).join("");

    cont.innerHTML = html;
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

  function esqueletoLenguajes(n) {
    return Array.from({ length: n }, () =>
      '<div class="materia-card materia-card--lenguaje is-esqueleto" aria-hidden="true"></div>'
    ).join("");
  }

  function tarjetaErrorLenguaje(l) {
    return `
      <div class="materia-card materia-card--lenguaje is-error" role="group" aria-label="${escapar(l.nombre)}: no se pudo cargar"
           style="--materia-color: ${l.color}">
        <span class="materia-icono">${icono(l.icono)}</span>
        <span class="materia-info">
          <span class="materia-nombre">${escapar(l.nombre)}</span>
          <span class="materia-desc">No se pudo cargar el progreso. Recarga la página para intentarlo de nuevo.</span>
        </span>
      </div>
    `;
  }

  async function tarjetaLenguaje(l) {
    const registro = persistencia.competencia(l.id);
    const roadmap = await roadmapDe(l);
    const barra = barraDeCompetencia(roadmap.etapas, registro);
    const total = barra.total;
    const nPreguntas = l.conteo?.preguntas ?? 0;
    const pendiente = nPreguntas === 0;

    const detalles = pendiente
      ? "Contenido en preparación"
      : `${nPreguntas} ${plural(nPreguntas, "pregunta", "preguntas")} · ${total} ${plural(total, "etapa", "etapas")}`;

    // La barra es visual; el conteo entra en el nombre accesible del botón para que un
    // lector de pantalla lo anuncie al enfocar la tarjeta.
    const competenciaTexto = `${barra.aprobadas} de ${total} ${
      total === 1 ? "etapa aprobada" : "etapas aprobadas"
    }`;

    const ariaLabel = `${l.nombre}. ${l.descripcion}. ${detalles}. Competencia: ${competenciaTexto}. ${
      pendiente ? "No disponible aún." : "Presiona para entrar."
    }`;

    const disabledAttr = pendiente ? 'disabled aria-disabled="true"' : "";

    const cta = barra.aprobadas === 0 ? "Empezar"
      : barra.aprobadas >= total ? "Repasar"
      : "Continuar";

    const accion = pendiente
      ? '<span class="chip-proximamente">Próximamente</span>'
      : `<span class="materia-cta">${cta}<span class="materia-arrow" aria-hidden="true">${icono("flecha", "icono-sm")}</span></span>`;

    const progreso = pendiente ? "" : `
      <span class="lenguaje-progreso">
        ${barraCompetencia({ ...barra, color: l.color })}
        <span class="lenguaje-progreso-texto">${competenciaTexto} · ${nPreguntas} ${plural(nPreguntas, "pregunta", "preguntas")}</span>
      </span>`;

    return `
      <button class="materia-card materia-card--lenguaje ${pendiente ? "is-pendiente" : ""}"
              data-action="seleccionarLenguaje"
              data-lenguaje="${l.id}"
              aria-label="${escapar(ariaLabel)}"
              ${disabledAttr}
              style="--materia-color: ${l.color}">
        <span class="materia-icono">${icono(l.icono)}</span>
        <span class="materia-info">
          <span class="materia-nombre">${escapar(l.nombre)}</span>
          <span class="materia-desc">${escapar(l.descripcion)}</span>
        </span>
        ${accion}
        ${progreso}
      </button>
    `;
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

    // Si dos renders se pisan, solo escribe el último.
    const version = ++versionLenguajes;

    // Primera carga: esqueletos para que la sección no aparezca de golpe.
    if (!cont.children.length) cont.innerHTML = esqueletoLenguajes(LENGUAJES.length);
    cont.setAttribute("aria-busy", "true");

    const tarjetas = await Promise.all(LENGUAJES.map(async l => {
      try {
        return await tarjetaLenguaje(l);
      } catch (error) {
        console.error(`No se pudo cargar el lenguaje ${l.id}`, error);
        return tarjetaErrorLenguaje(l);
      }
    }));

    if (version !== versionLenguajes) return;
    cont.innerHTML = tarjetas.join("");
    cont.removeAttribute("aria-busy");
  }

  return { renderMaterias, renderLenguajes, renderPerfil };
}
