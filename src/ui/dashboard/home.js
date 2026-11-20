// Renderers del home/dashboard: catálogo real de materias y lenguajes, progreso derivado de
// persistencia y filtros locales de la pantalla. Sin localStorage ni estado global (ADR 001/007).
import { MATERIAS, LENGUAJES, barraDeCompetencia } from "../../core/index.js";
import { icono } from "../iconos.js";
import { barraCompetencia } from "../componentes/competencia.js";
import { escapar, saludoSegunHora } from "../helpers.js";
import { observarScrollReveal } from "../componentes/scroll-suave.js";

export function crearHome({ persistencia, cargarRoadmap, resumen }) {
  /** @type {(id: string) => any} */
  const $ = id => document.getElementById(id);

  // El DOM devuelve Element; el catálogo necesita dataset/clases de HTMLElement.
  /**
   * @param {string} selector
   * @returns {HTMLElement[]}
   */
  function elementos(selector) {
    return /** @type {HTMLElement[]} */ ([...document.querySelectorAll(selector)]);
  }

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

  // Traduce la diferencia en días a la copia del resumen; el cálculo vive en student/resumen.
  function textoDias(dias) {
    const n = Number(dias) || 0;
    if (n <= 0) return "hoy";
    if (n === 1) return "ayer";
    return "hace " + n + " días";
  }

  // El saludo del prototipo: tramo en texto normal y nombre en itálica de acento.
  // Google devuelve el nombre completo; el saludo usa solo el primer token.
  function renderSaludo() {
    const el = $("saludo-home");
    if (!el) return;
    const nombre = persistencia.nombre();
    const primerNombre = nombre ? String(nombre).trim().split(/\s+/)[0] : "";
    el.innerHTML = escapar(saludoSegunHora("")) +
      (primerNombre ? ', <em>' + escapar(primerNombre) + "</em>" : "");
  }

  // El resumen replica el prototipo: continuidad del último track + tres KPI.
  // La búsqueda y los filtros existentes se conservan; el prototipo no los reemplaza.
  function renderResumen() {
    const cont = $("home-resumen-contenido");
    if (!cont || !resumen) return;
    const datos = resumen.actual();
    if (!datos) return;

    const continuar = datos.continuar;
    const bloqueContinuar = continuar
      ? '<div class="resumen-continuar">' +
          '<p class="resumen-eyebrow">Continuá donde te quedaste</p>' +
          '<p class="resumen-continuar-titulo">' + escapar(continuar.nombre) + '</p>' +
          '<p class="resumen-continuar-meta">' +
            (continuar.pregunta ? 'Pregunta ' + continuar.pregunta + ' de ' + continuar.preguntas.total + ' · ' : '') +
            'Última actividad: ' + textoDias(continuar.dias) +
          '</p>' +
          '<div class="resumen-progreso" aria-hidden="true"><span style="--pct:' +
            continuar.preguntas.pct + '"></span></div>' +
          '<div class="resumen-continuar-pie">' +
            '<p class="resumen-continuar-sub">' + continuar.preguntas.respondidas +
              ' respondidas · ' + continuar.preguntas.pct + '% completado</p>' +
            '<button class="btn btn-primary btn-sm resumen-cta" data-action="' +
              (continuar.tipo === "lenguaje" ? "seleccionarLenguaje" : "seleccionarMateria") +
              '" data-' + (continuar.tipo === "lenguaje" ? "lenguaje" : "materia") + '="' +
              escapar(continuar.id) + '">Continuar <span aria-hidden="true">→</span></button>' +
          '</div>' +
        '</div>'
      : '<div class="resumen-continuar resumen-continuar--vacio">' +
          '<p class="resumen-eyebrow">Continuá donde te quedaste</p>' +
          '<p class="resumen-continuar-titulo">Todavía no hay actividad</p>' +
          '<p class="resumen-continuar-sub">Elegí una materia o un lenguaje para empezar. Tu avance aparecerá acá.</p>' +
        '</div>';

    const materias = '<div class="resumen-kpi" id="resumen-materias">' +
      '<p class="resumen-kpi-label">Respondidas en materias</p>' +
      '<p class="resumen-kpi-valor"><b>' + datos.materias.respondidas + '</b> <span>de ' +
        datos.materias.total + '</span></p>' +
      '</div>';

    const etiquetaPrecision = datos.precision
      ? 'Precisión <span class="resumen-kpi-label-suave">· ' + datos.precision.intentos + ' intentos</span>'
      : 'Precisión';
    const tendencia = datos.precision && datos.tendencia
      ? '<span class="resumen-tendencia ' + (datos.tendencia.sube ? 'is-up' : 'is-down') + '">' +
          (datos.tendencia.sube ? '▲' : '▼') + ' ' + Math.abs(datos.tendencia.delta) + '% esta semana</span>'
      : '';
    const precision = '<div class="resumen-kpi" id="resumen-precision">' +
      '<p class="resumen-kpi-label">' + etiquetaPrecision + '</p>' +
      '<p class="resumen-kpi-valor"><b>' + (datos.precision ? datos.precision.pct + '%' : '—') + '</b>' +
        tendencia + '</p>' +
      (datos.precision ? '' : '<p class="resumen-kpi-sub">Sin intentos todavía</p>') +
      '</div>';

    const repaso = datos.repaso
      ? '<button type="button" class="resumen-repasar" data-action="' +
          (datos.repaso.tipo === "lenguaje" ? "seleccionarLenguaje" : "seleccionarMateria") +
          '" data-' + (datos.repaso.tipo === "lenguaje" ? "lenguaje" : "materia") + '="' +
          escapar(datos.repaso.id) + '">Repasar ' + datos.repaso.total +
          (datos.repaso.total === 1 ? ' pregunta' : ' preguntas') +
          ' <span aria-hidden="true">→</span></button>'
      : '';
    const racha = '<div class="resumen-kpi resumen-kpi--racha" id="resumen-racha">' +
      '<div class="resumen-kpi-head">' +
        '<p class="resumen-kpi-label">Racha de estudio</p>' + repaso +
      '</div>' +
      '<p class="resumen-kpi-valor"><b>' + datos.racha + '</b> <span>' +
        (datos.racha === 1 ? 'día' : 'días') + '</span></p>' +
      '</div>';

    cont.innerHTML = bloqueContinuar +
      '<div class="resumen-kpis">' + materias + precision + racha + '</div>';
  }

  function renderMaterias() {
    const cont = $("materias-list");
    if (!cont) return;
    renderSaludo();
    renderResumen();

    cont.innerHTML = MATERIAS.map(m => {
      const e = estadoMateria(m);
      const estadoDato = e.pendiente ? "pendiente" : e.enCurso ? "en-curso" : "disponible";
      const disabledAttr = e.pendiente ? 'disabled aria-disabled="true"' : "";

      return `
        <button class="materia-card materia-card--materia scroll-reveal"
                data-action="seleccionarMateria"
                data-materia="${m.id}"
                data-tipo="materia"
                data-estado="${estadoDato}"
                data-busqueda="${escapar(textoBusqueda(m.nombre, m.descripcion))}"
                ${disabledAttr}
                style="--materia-color: ${m.color}">
          <span class="materia-icono" aria-hidden="true">${icono(m.icono)}</span>
          <span class="materia-nombre">${escapar(m.nombre)}</span>
          <span class="materia-desc">${escapar(m.descripcion)}</span>
          <span class="materia-progreso">
            <span class="materia-progreso-track" aria-hidden="true">
              <span class="materia-progreso-fill" style="--pct:${e.pct}"></span>
            </span>
            <span class="materia-progreso-texto">${e.respondidas} de ${e.total} respondidas</span>
          </span>
          <span class="materia-stats">
            <span>${m.conteo?.terminos ?? 0} términos</span>
            <span class="materia-cta" aria-hidden="true">
              <span>${e.enCurso ? "Continuar" : "Empezar"}</span>
              <span class="materia-cta-flecha">→</span>
            </span>
          </span>
        </button>`;
    }).join("");

    actualizarConteos();
    aplicarFiltros();
    // Activa la revelación progresiva fluida de las tarjetas del catálogo.
    observarScrollReveal(cont);
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
      const etapas = `${total} ${total === 1 ? "etapa" : "etapas"}`;
      const detalles = `${preguntas} preguntas`;
      const competenciaTexto = `${barra.aprobadas} de ${etapas} aprobadas`;
      const ariaDesc = `${l.descripcion}. ${detalles} · ${etapas}. Competencia: ${competenciaTexto}. ${
        enCurso ? "Presiona para continuar." : "Presiona para empezar."
      }`;

      return `
        <button class="materia-card materia-card--lenguaje scroll-reveal"
                data-action="seleccionarLenguaje"
                data-lenguaje="${l.id}"
                data-tipo="lenguaje"
                data-estado="${enCurso ? "en-curso" : "no-iniciado"}"
                data-busqueda="${escapar(textoBusqueda(l.nombre, l.descripcion))}"
                aria-describedby="lenguaje-desc-${l.id}"
                style="--materia-color: ${l.color}">
          <span class="materia-icono" aria-hidden="true">${icono(l.icono)}</span>
          <span class="materia-nombre">${escapar(l.nombre)}</span>
          <span class="materia-desc">${escapar(l.descripcion)}</span>
          <span class="materia-stats materia-stats--lenguaje">
            ${barraCompetencia({ ...barra, color: l.color })}
            <span class="materia-stats-pie">
              <span class="materia-stats-texto">${detalles}</span>
              <span class="materia-cta" aria-hidden="true">
                <span>${enCurso ? "Continuar" : "Empezar"}</span>
                <span class="materia-cta-flecha">→</span>
              </span>
            </span>
          </span>
          <span id="lenguaje-desc-${l.id}" class="sr-only">${escapar(ariaDesc)}</span>
        </button>`;
    }));

    cont.innerHTML = tarjetas.join("");
    actualizarConteos();
    aplicarFiltros();
    // Revela suavemente las tarjetas de lenguajes al montarse o scrollear.
    observarScrollReveal(cont);
  }

  function setTexto(id, texto) {
    const el = $(id);
    if (el) el.textContent = texto;
  }

  function actualizarConteos() {
    const cards = elementos("#materias-list .materia-card, #lenguajes-list .materia-card");
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
    elementos(".catalogo-tab").forEach(tab => {
      const activo = tab.dataset.filtro === filtroActivo;
      tab.classList.toggle("is-active", activo);
      tab.setAttribute("aria-pressed", String(activo));
    });
  }

  function animarEntrada(cards) {
    if (!cards.length) return;
    // Quita la clase y fuerza un único reflow: así la animación se reinicia aunque la
    // card ya estuviera visible. El stagger se corta a 5 pasos (máx. 120ms).
    cards.forEach(card => card.classList.remove("catalogo-entra"));
    void cards[0].offsetWidth;
    cards.forEach((card, i) => {
      card.style.setProperty("--entrada-delay", `${Math.min(i, 5) * 24}ms`);
      card.classList.add("catalogo-entra");
    });
  }

  // El vacío no es un callejón: ofrece la acción exacta que devuelve al catálogo según
  // si el problema es la búsqueda o el filtro activo.
  function renderVacio(visibles) {
    const vacio = $("catalogo-vacio");
    if (!vacio) return;
    if (visibles.length) {
      vacio.classList.add("hidden");
      vacio.innerHTML = "";
      return;
    }

    const hayBusqueda = busqueda.trim().length > 0;
    const acciones = [];
    if (hayBusqueda) {
      acciones.push('<button type="button" class="btn btn-secondary btn-sm" data-vacio="busqueda">Limpiar búsqueda</button>');
    }
    if (filtroActivo !== "todas") {
      acciones.push('<button type="button" class="btn btn-ghost btn-sm" data-vacio="filtro">Ver todas</button>');
    }

    vacio.innerHTML = '<p class="catalogo-vacio-titulo">No encontramos resultados</p>' +
      '<p class="catalogo-vacio-texto">' +
        (hayBusqueda ? "Probá con otro nombre o limpiá la búsqueda." : "No hay tracks en curso todavía.") +
      '</p>' +
      (acciones.length ? '<div class="catalogo-vacio-acciones">' + acciones.join("") + '</div>' : "");
    vacio.classList.remove("hidden");
  }

  function anunciarResultados(visibles, total) {
    const resultado = $("catalogo-resultado");
    if (!resultado) return;
    const texto = "Mostrando " + visibles + " de " + total;
    // Solo se escribe si cambió: el lector de pantalla no repite el mismo conteo en cada tecla.
    if (resultado.textContent !== texto) resultado.textContent = texto;
  }

  function aplicarFiltros({ animar = false } = {}) {
    const q = busqueda.trim().toLowerCase();
    const cards = elementos("#materias-list .materia-card, #lenguajes-list .materia-card");
    const visiblesCards = [];

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
      if (visible) visiblesCards.push(card);
    });

    const hayMaterias = cards.some(c => c.dataset.tipo === "materia" && !c.classList.contains("hidden"));
    const hayLenguajes = cards.some(c => c.dataset.tipo === "lenguaje" && !c.classList.contains("hidden"));
    $("materias-seccion")?.classList.toggle("hidden", !hayMaterias);
    $("lenguajes-seccion")?.classList.toggle("hidden", !hayLenguajes);
    renderVacio(visiblesCards);
    anunciarResultados(visiblesCards.length, cards.length);
    if (animar) animarEntrada(visiblesCards);
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

    // Delegación dentro del vacío: el HTML se regenera en cada filtro y los botones
    // no deben perder su listener.
    $("catalogo-vacio")?.addEventListener("click", e => {
      const objetivo = /** @type {HTMLElement} */ (e.target);
      const boton = /** @type {HTMLElement | null} */ (objetivo.closest("[data-vacio]"));
      if (!boton) return;

      if (boton.dataset.vacio === "busqueda") {
        input.value = "";
        busqueda = "";
        clear?.classList.add("hidden");
      } else {
        filtroActivo = "todas";
        actualizarTabs();
      }
      aplicarFiltros({ animar: true });
      input.focus();
    });

    elementos(".catalogo-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        filtroActivo = tab.dataset.filtro || "todas";
        actualizarTabs();
        aplicarFiltros({ animar: true });
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
