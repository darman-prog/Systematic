// Render e interacción del modo estudio (listado con respuestas revelables).
// Recibe el estado de la app vía `ctx` y callbacks de persistencia/navegación;
// el estado propio de la pantalla (filtros activos) vive en este módulo.
import {
  TIPOS, TIPO_LABELS, DIF_LABELS, TOPIC_COLORS,
  bloqueCaso, diagramaER, escapar, respuestaEstudio, resaltarSQL, tablaDatos
} from "./helpers.js";

const $ = id => document.getElementById(id);

export function crearEstudioUI({ ctx, obtenerP, toggleMarked, mostrarPantalla }) {
  let estudioTipo = "todos";
  let estudioSoloReales = false;

  function startStudy() {
    estudioTipo = "todos";
    estudioSoloReales = false;
    renderStudy("");
    const search = $("study-search");
    if (search) search.value = "";
    renderStudyFiltros();
    mostrarPantalla("study");
  }

  function toggleEstudioReales() {
    estudioSoloReales = !estudioSoloReales;
    renderStudy($("study-search").value);
    renderStudyFiltros();
  }

  function estudioGarantizadas() {
    startStudy();
    estudioSoloReales = true;
    renderStudy("");
    renderStudyFiltros();
  }

  function renderStudyFiltros() {
    const cont = $("study-filtros");
    if (!cont) return;
    const tipos = ["todos"].concat(TIPOS);
    let html = tipos.map(t => {
      const etiqueta = t === "todos" ? "Todos" : (TIPO_LABELS[t] || t);
      const cuenta = t === "todos" ? ctx.banco.length : ctx.banco.filter(q => q.tipo === t).length;
      return '<button class="chip' + (estudioTipo === t ? " chip-on" : "") + '" data-action="cambiarEstudioTipo" data-tipo="' + t + '">' + etiqueta + ' · ' + cuenta + '</button>';
    }).join("");
    const nReales = ctx.banco.filter(q => q.real).length;
    if (nReales) {
      html += '<button class="chip' + (estudioSoloReales ? " chip-on" : "") + '" data-action="toggleEstudioReales">🔥 Garantizadas · ' + nReales + '</button>';
    }
    cont.innerHTML = html;
  }

  function cambiarEstudioTipo(tipo) {
    estudioTipo = tipo;
    renderStudy($("study-search").value);
    renderStudyFiltros();
  }

  function renderStudy(filtro) {
    const banco = ctx.banco;
    const f = String(filtro || "").trim().toLowerCase();
    const lista = banco.filter(item => {
      if (estudioTipo !== "todos" && item.tipo !== estudioTipo) return false;
      if (estudioSoloReales && !item.real) return false;
      if (!f) return true;
      const campos = [item.q, item.exp || "", item.codigo || "", item.tema, item.parcial, item.caso || "", (item.options || []).join(" "), (item.respuestas || []).join(" "), (item.bloques || []).join(" "), item.solucion || "", (item.pares || []).map(p => p[0] + " " + p[1]).join(" "), (item.claves || []).join(" ")];
      return campos.join(" ").toLowerCase().includes(f);
    });
    $("study-list").innerHTML = lista.map(item => {
      const marcada = obtenerP(item.id).marked;
      const codigo = item.codigo && item.tipo === "dragdrop" ? item.codigo.replace(/\{\d\}/g, "____") : item.codigo;
      return '<div class="study-item" id="study-' + item.id + '">' +
        '<div class="flex items-center justify-between gap-2 flex-wrap mb-2">' +
          '<div class="flex items-center gap-2 flex-wrap">' +
            '<span class="badge" style="background:' + (TOPIC_COLORS[item.tema] || "#3b82f6") + '; color:#0f172a">' + item.tema + '</span>' +
            '<span class="text-xs text-slate-400">' + item.parcial + ' · ' + (TIPO_LABELS[item.tipo] || item.tipo) + ' · ' + (DIF_LABELS[item.dificultad] || "") + (item.real ? ' · <b class="text-amber-300">🔥 garantizada</b>' : "") + '</span>' +
          '</div>' +
          '<button class="star-btn' + (marcada ? " star-on" : "") + '" data-action="toggleMarcadaEstudio" data-id="' + item.id + '">' + (marcada ? "★" : "☆") + '</button>' +
        '</div>' +
        bloqueCaso(item) +
        '<div class="font-semibold leading-relaxed mb-3">' + escapar(item.q) + '</div>' +
        (item.diagrama ? diagramaER() : "") +
        (item.datos ? tablaDatos(item.datos) : "") +
        (codigo && item.tipo !== "dragdrop" ? '<pre class="code-block mb-3">' + resaltarSQL(codigo) + '</pre>' : "") +
        (codigo && item.tipo === "dragdrop" ? '<pre class="code-block mb-3">' + resaltarSQL(codigo) + '</pre>' : "") +
        '<div class="oculto">' + respuestaEstudio(item) + '<div class="study-exp">' + item.exp + '</div></div>' +
        '<button class="btn btn-secondary btn-sm mt-3" data-action="toggleStudy">Mostrar respuesta</button>' +
      '</div>';
    }).join("") || '<p class="text-sm text-slate-400">Sin resultados para esa búsqueda.</p>';
    const contador = $("study-count");
    if (contador) contador.textContent = lista.length + " pregunta(s) encontradas";
  }

  function toggleStudy(btn) {
    const item = btn.closest(".study-item");
    const revealed = item.classList.toggle("revealed");
    btn.textContent = revealed ? "Ocultar respuesta" : "Mostrar respuesta";
  }

  function toggleMarcadaEstudio(id) {
    toggleMarked(id);
    renderStudy($("study-search").value);
  }

  return {
    startStudy,
    toggleEstudioReales,
    estudioGarantizadas,
    cambiarEstudioTipo,
    renderStudy,
    toggleStudy,
    toggleMarcadaEstudio
  };
}
