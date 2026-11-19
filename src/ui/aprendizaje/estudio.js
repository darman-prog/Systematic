// Render e interacción del modo estudio (listado editorial con cajón de respuesta colapsable).
// Recibe el estado de la app vía `ctx` y callbacks de persistencia/navegación;
// el estado propio de la pantalla (filtros activos y tarjetas reveladas) vive en este módulo.
import {
  TIPOS, TIPO_LABELS, DIF_LABELS,
  bloqueCaso, colorTema, diagramaER, escapar, respuestaEstudio, resaltarSQL, sqlKeywordsDe, tablaDatos
} from "../helpers.js";

/** @type {(id: string) => any} */
const $ = id => document.getElementById(id);

export function crearEstudioUI({ ctx, obtenerP, toggleMarked, mostrarPantalla }) {
  let estudioTipo = "todos";
  let estudioTema = "todos";
  let soloMarcadas = false;
  // Conserva qué preguntas abrió el estudiante para no cerrarlas al marcar una estrella.
  const reveladas = new Set();
  const keywords = () => sqlKeywordsDe(ctx.materia);

  function valorBusqueda() {
    const search = $("study-search");
    return search ? search.value : "";
  }

  function startStudy() {
    estudioTipo = "todos";
    estudioTema = "todos";
    soloMarcadas = false;
    reveladas.clear();
    const search = $("study-search");
    if (search) search.value = "";
    renderStudy("");
    renderStudyFiltros();
    renderStudyTemas();
    mostrarPantalla("study");
  }

  function renderStudyFiltros() {
    const cont = $("study-filtros");
    if (!cont) return;
    // Solo mostramos tipos que tengan preguntas en la materia actual para evitar chips en cero irrelevantes.
    const tiposPresentes = TIPOS.filter(t => ctx.banco.some(q => q.tipo === t));
    const tipos = ["todos"].concat(tiposPresentes.length ? tiposPresentes : TIPOS);
    cont.innerHTML = tipos.map(t => {
      const etiqueta = t === "todos" ? "Todos" : (TIPO_LABELS[t] || t);
      const cuenta = t === "todos" ? ctx.banco.length : ctx.banco.filter(q => q.tipo === t).length;
      return '<button type="button" class="chip' + (estudioTipo === t ? " chip-on" : "") + '" data-action="cambiarEstudioTipo" data-tipo="' + t + '" aria-pressed="' + (estudioTipo === t ? "true" : "false") + '">' + escapar(etiqueta) + ' · ' + cuenta + '</button>';
    }).join("");
  }

  // Renderiza el filtro rápido de marcadas (★) y los chips por tema de la materia activa.
  function renderStudyTemas() {
    const cont = $("study-temas");
    if (!cont) return;
    const banco = ctx.banco || [];
    const totalMarcadas = banco.filter(q => obtenerP(q.id).marked).length;
    const temasUnicos = [...new Set(banco.map(q => q.tema).filter(Boolean))];

    const btnMarcadas =
      '<button type="button" class="study-subchip study-subchip--star' + (soloMarcadas ? " is-on" : "") + '" data-action="toggleSoloMarcadas" aria-pressed="' + (soloMarcadas ? "true" : "false") + '">' +
        '★ Marcadas · ' + totalMarcadas +
      '</button>';

    const chipsTemas = ["todos", ...temasUnicos].map(tema => {
      const activo = estudioTema === tema;
      const etiqueta = tema === "todos" ? "Todos los temas" : tema;
      return '<button type="button" class="study-subchip' + (activo ? " is-on" : "") + '" data-action="cambiarEstudioTema" data-tema="' + escapar(tema) + '" aria-pressed="' + (activo ? "true" : "false") + '">' + escapar(etiqueta) + '</button>';
    }).join("");

    cont.innerHTML = btnMarcadas + chipsTemas;
  }

  function filtrarLista(filtro) {
    const banco = ctx.banco || [];
    const f = String(filtro || "").trim().toLowerCase();
    return banco.filter(item => {
      if (estudioTipo !== "todos" && item.tipo !== estudioTipo) return false;
      if (estudioTema !== "todos" && item.tema !== estudioTema) return false;
      if (soloMarcadas && !obtenerP(item.id).marked) return false;
      if (!f) return true;
      const campos = [
        item.q, item.exp || "", item.codigo || "", item.tema, item.parcial, item.caso || "",
        (item.options || []).join(" "), (item.respuestas || []).join(" "), (item.bloques || []).join(" "),
        item.solucion || "", (item.pares || []).map(p => p[0] + " " + p[1]).join(" "),
        (item.claves || []).join(" "), (item.nodosPool || []).join(" "),
        (item.relacionesEsperadas || []).map(r => r.de + " " + r.a + " " + r.tipo).join(" ")
      ];
      return campos.join(" ").toLowerCase().includes(f);
    });
  }

  function cambiarEstudioTipo(tipo) {
    estudioTipo = tipo;
    renderStudy(valorBusqueda());
    renderStudyFiltros();
  }

  function cambiarEstudioTema(tema) {
    estudioTema = tema;
    renderStudy(valorBusqueda());
    renderStudyTemas();
  }

  function toggleSoloMarcadas() {
    soloMarcadas = !soloMarcadas;
    renderStudy(valorBusqueda());
    renderStudyTemas();
  }

  function limpiarEstudioFiltros() {
    estudioTipo = "todos";
    estudioTema = "todos";
    soloMarcadas = false;
    const search = $("study-search");
    if (search) search.value = "";
    renderStudy("");
    renderStudyFiltros();
    renderStudyTemas();
  }

  // Abre o cierra en bloque todas las tarjetas visibles en el filtro actual.
  function toggleRevelarTodas() {
    const visibles = filtrarLista(valorBusqueda());
    if (!visibles.length) return;
    const todasAbiertas = visibles.every(item => reveladas.has(item.id));
    for (const item of visibles) {
      if (todasAbiertas) reveladas.delete(item.id);
      else reveladas.add(item.id);
    }
    renderStudy(valorBusqueda());
  }

  function renderStudy(filtro) {
    const lista = filtrarLista(filtro);
    const listEl = $("study-list");
    if (listEl) {
      listEl.innerHTML = lista.map(item => {
        const marcada = obtenerP(item.id).marked;
        const abierta = reveladas.has(item.id);
        const codigo = item.codigo && item.tipo === "dragdrop" ? item.codigo.replace(/\{\d\}/g, "____") : item.codigo;
        const acentoTema = colorTema(ctx.materia, item.tema) || "#38bdf8";
        const metaPartes = [item.parcial, TIPO_LABELS[item.tipo] || item.tipo, DIF_LABELS[item.dificultad] || ""].filter(Boolean).join(" · ");

        return '<article class="study-item' + (abierta ? " revealed" : "") + '" id="study-' + item.id + '">' +
          '<header class="study-item-head">' +
            '<div class="flex items-center gap-2 flex-wrap">' +
              '<span class="study-tema-badge" style="--tema-color:' + escapar(acentoTema) + '">' + escapar(item.tema) + '</span>' +
              '<span class="study-meta-text">' + escapar(metaPartes) + '</span>' +
            '</div>' +
            '<button type="button" class="star-btn' + (marcada ? " star-on" : "") + '" data-action="toggleMarcadaEstudio" data-id="' + item.id + '" aria-pressed="' + (marcada ? "true" : "false") + '" aria-label="Marcar pregunta para repaso">' + (marcada ? "★" : "☆") + '</button>' +
          '</header>' +
          bloqueCaso(item) +
          '<div class="study-question">' + escapar(item.q) + '</div>' +
          (item.diagrama ? diagramaER() : "") +
          (item.datos ? tablaDatos(item.datos) : "") +
          (codigo ? '<pre class="code-block mb-3">' + resaltarSQL(codigo, keywords()) + '</pre>' : "") +
          '<div class="study-item-actions">' +
            '<button type="button" class="btn btn-secondary btn-sm study-toggle-btn" data-action="toggleStudy" data-id="' + item.id + '" aria-expanded="' + (abierta ? "true" : "false") + '">' +
              (abierta ? "Ocultar respuesta" : "Mostrar respuesta") +
            '</button>' +
          '</div>' +
          '<div class="oculto study-drawer">' +
            '<div class="study-drawer-section">' +
              '<span class="study-drawer-label">Respuesta</span>' +
              respuestaEstudio(item, keywords()) +
            '</div>' +
            '<div class="study-exp">' +
              '<span class="study-drawer-label">Explicación</span>' +
              '<div class="study-exp-body">' + item.exp + '</div>' +
            '</div>' +
          '</div>' +
        '</article>';
      }).join("") ||
        '<div class="study-empty">' +
          '<p class="text-sm text-slate-300 mb-3">No hay preguntas que coincidan con tu búsqueda o filtros activos.</p>' +
          '<button type="button" class="btn btn-secondary btn-sm" data-action="limpiarEstudioFiltros">Limpiar filtros</button>' +
        '</div>';
    }

    const contador = $("study-count");
    if (contador) contador.textContent = lista.length + " pregunta(s) encontradas";

    const btnAll = $("study-toggle-all");
    if (btnAll) {
      const todasAbiertas = lista.length > 0 && lista.every(item => reveladas.has(item.id));
      btnAll.textContent = todasAbiertas ? "Ocultar todas" : "Revelar todas";
      btnAll.disabled = lista.length === 0;
    }
  }

  function toggleStudy(btn) {
    if (!btn) return;
    const item = btn.closest(".study-item");
    if (!item) return;
    const id = btn.dataset?.id || item.id.replace(/^study-/, "");
    const revealed = item.classList.toggle("revealed");
    if (revealed) reveladas.add(id);
    else reveladas.delete(id);
    btn.textContent = revealed ? "Ocultar respuesta" : "Mostrar respuesta";
    btn.setAttribute("aria-expanded", revealed ? "true" : "false");

    // Actualiza la etiqueta del botón global si existe en el DOM.
    const btnAll = $("study-toggle-all");
    if (btnAll) {
      const visibles = filtrarLista(valorBusqueda());
      const todasAbiertas = visibles.length > 0 && visibles.every(q => reveladas.has(q.id));
      btnAll.textContent = todasAbiertas ? "Ocultar todas" : "Revelar todas";
    }
  }

  function toggleMarcadaEstudio(id) {
    toggleMarked(id);
    renderStudy(valorBusqueda());
    renderStudyTemas();
  }

  return {
    startStudy,
    cambiarEstudioTipo,
    cambiarEstudioTema,
    toggleSoloMarcadas,
    toggleRevelarTodas,
    limpiarEstudioFiltros,
    renderStudy,
    toggleStudy,
    toggleMarcadaEstudio
  };
}
