// Renderers del home (dashboard): lista de materias, sección de lenguajes con su barra de
// competencia y panel de perfil. Reciben sus dependencias por parámetro y no tocan
// localStorage ni estado global (ADR 001/007).
import { MATERIAS, LENGUAJES, barraDeCompetencia } from "../../core/index.js";
import { icono } from "../iconos.js";
import { barraCompetencia } from "../componentes/competencia.js";
import { escapar, saludoSegunHora } from "../helpers.js";

export function crearHome({ persistencia }) {
  const $ = id => document.getElementById(id);

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
        : `${n} preguntas${nGlosario ? ` · ${nGlosario} términos` : ""}`;

      const ariaLabel = `${m.nombre}. ${m.descripcion}. ${detalles}. ${
        pendiente ? "Materia no disponible aún." : "Presiona para entrar."
      }`;

      const disabledAttr = pendiente ? 'disabled aria-disabled="true"' : "";
      const statsClass = `materia-stats-texto${pendiente ? " materia-pendiente-texto" : ""}`;
      const arrow = pendiente ? "" : '<span class="materia-arrow" aria-hidden="true">→</span>';

      return `
        <button class="materia-card" 
                data-action="seleccionarMateria" 
                data-materia="${m.id}" 
                aria-label="${ariaLabel}" 
                ${disabledAttr}
                style="--materia-color: ${m.color}">
          <span class="materia-icono">${icono(m.icono)}</span>
          <div class="materia-info">
            <span class="materia-nombre">${m.nombre}</span>
            <span class="materia-desc">${m.descripcion}</span>
          </div>
          <div class="materia-stats">
            <span class="${statsClass}">${detalles}</span>
            ${arrow}
          </div>
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
        : `${l.conteo.preguntas} preguntas · ${total} etapas`;

      // La barra es visual; el conteo entra en el nombre accesible del botón para que un
      // lector de pantalla lo anuncie al enfocar la tarjeta.
      const competenciaTexto = `${barra.aprobadas} de ${total} ${
        total === 1 ? "etapa aprobada" : "etapas aprobadas"
      }`;

      const ariaLabel = `${l.nombre}. ${l.descripcion}. ${detalles}. Competencia: ${competenciaTexto}. ${
        pendiente ? "No disponible aún." : "Presiona para entrar."
      }`;

      const disabledAttr = pendiente ? 'disabled aria-disabled="true"' : "";

      return `
        <button class="materia-card materia-card--lenguaje" 
                data-action="seleccionarLenguaje" 
                data-lenguaje="${l.id}" 
                aria-label="${ariaLabel}" 
                ${disabledAttr}
                style="--materia-color: ${l.color}">
          <span class="materia-icono">${icono(l.icono)}</span>
          <div class="materia-info">
            <span class="materia-nombre">${l.nombre}</span>
            <span class="materia-desc">${l.descripcion}</span>
          </div>
          <div class="materia-stats">
            <span class="materia-stats-texto">${detalles}</span>
            ${barraCompetencia({ ...barra, color: l.color })}
          </div>
        </button>
      `;
    }));

    cont.innerHTML = tarjetas.join("");
  }

  return { renderMaterias, renderLenguajes };
}