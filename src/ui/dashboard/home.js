// Renderers del home/dashboard: catálogo real de materias y lenguajes, progreso derivado de
// persistencia y filtros locales de la pantalla. Sin localStorage ni estado global (ADR 001/007).
import { MATERIAS, LENGUAJES, barraDeCompetencia } from "../../core/index.js";
import { icono } from "../iconos.js";
import { barraCompetencia } from "../componentes/competencia.js";
import { escapar, saludoSegunHora } from "../helpers.js";

export function crearHome({ persistencia, cargarRoadmap }) {
  /** @type {(id: string) => any} */
  const $ = id => document.getElementById(id);
  let filtroActivo = "todas";
  let busqueda = "";
  let catalogoConectado = false;

  // Corpus del buscador: solo metadatos del catálogo, no preguntas ni glosario.
  function textoBusqueda(...partes) {
    return partes.filter(Boolean).join(" ").toLowerCase();
  }

  // El progreso de materia es cobertura (preguntas respondidas), no dominio Leitner.
  function estadoMateria(m) {
    const progreso = persistencia.progreso(m.id) || {};
    const total = Number(m.conteo?.preguntas) || 0;
    const respondidas = Object.keys(progreso).filter(id => {
      const p = progreso[id];
      return p && ((p.ok || 0) + (p.fail || 0) > 0);
    }).length;
    const historial = persistencia.historial(m.id) || [];
    const enCurso = respondidas > 0 || historial.length > 0;
    return {
      total,
      respondidas,
      pct: total > 0 ? Math.min(100, Math.round((respondidas / total) * 100)) : 0,
      enCurso,
      pendiente: total === 0
    };
  }

  function estadoLenguaje(barra, competencia) {
    // "En curso" incluye etapas aprobadas y también intentos fallidos con progreso parcial.
    return barra.aprobadas > 0 || Object.values(competencia || {}).some(e =>
      e && ((e.intentos || 0) > 0 || (e.ultimoPct || 0) > 0)
    );
  }

  function renderMaterias() {
    const cont = $("materias-list");
    if (!cont) return;
    const saludo = $("saludo-home");
    if (saludo) saludo.textContent = saludoSegunHora(persistencia.nombre());

    cont.innerHTML = MATERIAS.map(m => {
      const e = estadoMateria(m);
      const estadoTexto = e.pendiente ? "En preparación" : e.enCurso ? "En curso" : "Disponible";
      const estadoClase = e.pendiente ? "pendiente" : e.enCurso ? "curso" : "inactivo";
      const estadoDato = e.pendiente ? "pendiente" : e.enCurso ? "en-curso" : "disponible";
      const disabledAttr = e.pendiente ? 'disabled aria-disabled="true"' : "";

      return `
        <button class="materia-card materia-card--materia"
                data-action="seleccionarMateria"
                data-materia="${m.id}"
                data-tipo="materia"
                data-estado="${estadoDato}"
                data-busqueda="${escapar(textoBusqueda(m.nombre, m.descripcion))}"
                ${disabledAttr}
                style="--materia-color: ${m.color}">
          <span class="materia-card-top">
            <span class="materia-icono" aria-hidden="true">${icono(m.icono)}</span>
            <span class="materia-estado materia-estado--${estadoClase}">${estadoTexto}</span>
          </span>
          <span class="materia-nombre">${escapar(m.nombre)}</span>
          <span class="materia-desc">${escapar(m.descripcion)}</span>
          <span class="materia-progreso">
            <span class="materia-progreso-track" aria-hidden="true">
              <span class="materia-progreso-fill" style="--pct:${e.pct}"></span>
            </span>
            <span class="materia-progreso-texto">${e.respondidas} de ${e.total} respondidas</span>
          </span>
          <span class="materia-stats">
            <span>${e.total} preguntas</span>
            <span>${m.conteo?.terminos ?? 0} términos</span>
            <span class="materia-arrow" aria-hidden="true">→</span>
          </span>
        </button>`;
    }).join("");

    actualizarConteos();
    aplicarFiltros();
    // La sección de lenguajes se pinta después; cuando termina vuelve a aplicar los filtros.
    return renderLenguajes();
  }

  const roadmapCache = new Map();
  async function roadmapDe(l) {
    if (!roadmapCache.has(l.id)) roadmapCache.set(l.id, await cargarRoadmap(l));
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
      const competencia = persistencia.competencia(l.id) || {};
      const roadmap = await roadmapDe(l);
      const barra = barraDeCompetencia(roadmap.etapas, competencia);
      const enCurso = estadoLenguaje(barra, competencia);
      const total = barra.total;
      const preguntas = l.conteo?.preguntas ?? 0;
      const detalles = `${preguntas} preguntas · ${total} etapas`;
      const competenciaTexto = `${barra.aprobadas} de ${total} ${total === 1 ? "etapa" : "etapas"} aprobadas`;
      const ariaDesc = `${l.descripcion}. ${detalles}. Competencia: ${competenciaTexto}. ${
        enCurso ? "Presiona para continuar." : "Presiona para iniciar."
      }`;
      const estadoTexto = enCurso ? "En curso" : "No iniciado";

      return `
        <button class="materia-card materia-card--lenguaje"
                data-action="seleccionarLenguaje"
                data-lenguaje="${l.id}"
                data-tipo="lenguaje"
                data-estado="${enCurso ? "en-curso" : "no-iniciado"}"
                data-busqueda="${escapar(textoBusqueda(l.nombre, l.descripcion))}"
                aria-describedby="lenguaje-desc-${l.id}"
                style="--materia-color: ${l.color}">
          <span class="materia-card-top">
            <span class="materia-icono" aria-hidden="true">${icono(l.icono)}</span>
            <span class="materia-estado materia-estado--${enCurso ? "curso" : "inactivo"}">${estadoTexto}</span>
          </span>
          <span class="materia-nombre">${escapar(l.nombre)}</span>
          <span class="materia-desc">${escapar(l.descripcion)}</span>
          <span class="materia-stats materia-stats--lenguaje">
            ${barraCompetencia({ ...barra, color: l.color })}
            <span class="materia-stats-texto">${detalles}</span>
          </span>
          <span class="materia-cta" aria-hidden="true">${enCurso ? "Continuar" : "Iniciar"} <span aria-hidden="true">→</span></span>
          <span id="lenguaje-desc-${l.id}" class="sr-only">${escapar(ariaDesc)}</span>
        </button>`;
    }));

    cont.innerHTML = tarjetas.join("");
    actualizarConteos();
    aplicarFiltros();
  }

  function setTexto(id, texto) {
    const el = $(id);
    if (el) el.textContent = texto;
  }

  function actualizarConteos() {
    const cards = [...document.querySelectorAll("#materias-list .materia-card, #lenguajes-list .materia-card")];
    const materias = cards.filter(c => c.dataset.tipo === "materia").length;
    const lenguajes = cards.filter(c => c.dataset.tipo === "lenguaje").length;
    const enCurso = cards.filter(c => c.dataset.estado === "en-curso").length;

    setTexto("materias-count", `${materias} ${materias === 1 ? "materia" : "materias"}`);
    setTexto("lenguajes-count", `${lenguajes} ${lenguajes === 1 ? "lenguaje" : "lenguajes"}`);
    setTexto("filtro-todas-count", String(cards.length));
    setTexto("filtro-materias-count", String(materias));
    setTexto("filtro-lenguajes-count", String(lenguajes));
    setTexto("filtro-curso-count", String(enCurso));
  }

  function actualizarTabs() {
    document.querySelectorAll(".catalogo-tab").forEach(tab => {
      const activo = tab.dataset.filtro === filtroActivo;
      tab.classList.toggle("is-active", activo);
      tab.setAttribute("aria-pressed", String(activo));
    });
  }

  function aplicarFiltros() {
    const q = busqueda.trim().toLowerCase();
    const cards = [...document.querySelectorAll("#materias-list .materia-card, #lenguajes-list .materia-card")];
    let visibles = 0;

    cards.forEach(card => {
      const tipo = card.dataset.tipo;
      const estado = card.dataset.estado;
      const coincideFiltro =
        filtroActivo === "todas" ||
        (filtroActivo === "materias" && tipo === "materia") ||
        (filtroActivo === "lenguajes" && tipo === "lenguaje") ||
        (filtroActivo === "en-curso" && estado === "en-curso");
      const visible = coincideFiltro && (!q || (card.dataset.busqueda || "").includes(q));
      card.classList.toggle("hidden", !visible);
      if (visible) visibles++;
    });

    const hayMaterias = cards.some(c => c.dataset.tipo === "materia" && !c.classList.contains("hidden"));
    const hayLenguajes = cards.some(c => c.dataset.tipo === "lenguaje" && !c.classList.contains("hidden"));
    $("materias-seccion")?.classList.toggle("hidden", !hayMaterias);
    $("lenguajes-seccion")?.classList.toggle("hidden", !hayLenguajes);
    $("catalogo-vacio")?.classList.toggle("hidden", visibles > 0);
  }

  function conectarCatalogo() {
    if (catalogoConectado) return;
    const input = $("catalog-search");
    if (!input) return;
    catalogoConectado = true;
    const clear = $("catalog-clear");

    input.addEventListener("input", () => {
      busqueda = input.value;
      clear?.classList.toggle("hidden", !busqueda);
      aplicarFiltros();
    });

    input.addEventListener("keydown", e => {
      if (e.key === "Escape" && input.value) {
        input.value = "";
        busqueda = "";
        clear?.classList.add("hidden");
        aplicarFiltros();
      }
    });

    clear?.addEventListener("click", () => {
      input.value = "";
      busqueda = "";
      clear.classList.add("hidden");
      aplicarFiltros();
      input.focus();
    });

    document.querySelectorAll(".catalogo-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        filtroActivo = tab.dataset.filtro || "todas";
        actualizarTabs();
        aplicarFiltros();
      });
    });

    // Atajo del catálogo: Ctrl/Cmd+K enfoca el buscador solo cuando el home está visible.
    document.addEventListener("keydown", e => {
      const home = $("screen-materias");
      if (!home || home.classList.contains("hidden")) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        input.focus();
      }
    });

    actualizarTabs();
  }

  conectarCatalogo();

  return { renderMaterias, renderLenguajes };
}
