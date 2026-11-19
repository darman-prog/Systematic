// Render del glosario (grilla editorial, filtros por categoría e inicial) y del tip del día.
// Recibe el glosario de la materia activa vía `ctx`; no lee localStorage ni importa datos.
import { escapar, resaltarSQL, sqlKeywordsDe } from "../helpers.js";
import { icono } from "../iconos.js";

/** @type {(id: string) => any} */
const $ = id => document.getElementById(id);

// Extrae la inicial alfabética normalizada (sin tildes) para agrupar en el índice A-Z.
function inicialTermino(termino) {
  const limpio = String(termino || "").trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const primera = limpio.charAt(0).toUpperCase();
  return /[A-Z]/.test(primera) ? primera : "#";
}

export function crearGlosarioUI({ ctx, mostrarPantalla }) {
  let glosarioCat = "todas";
  let glosarioLetra = "todas";
  const keywords = () => sqlKeywordsDe(ctx.materia);

  function valorBusqueda() {
    const s = $("glosario-search");
    return s ? s.value : "";
  }

  function startGlosario() {
    glosarioCat = "todas";
    glosarioLetra = "todas";
    const s = $("glosario-search");
    if (s) s.value = "";
    renderGlosario("");
    renderGlosarioFiltros();
    renderGlosarioLetras();
    mostrarPantalla("glosario");
  }

  function renderGlosarioFiltros() {
    const cont = $("glosario-filtros");
    if (!cont) return;
    const glosario = ctx.glosario;
    const cats = [{ id: "todas", corto: "Todas", nombre: "Todas" }].concat(glosario.categorias);
    cont.innerHTML = cats.map(c => {
      const cuenta = c.id === "todas" ? glosario.terminos.length : glosario.terminos.filter(t => t.categoria === c.id).length;
      // aria-pressed comunica el filtro activo al lector de pantalla, no solo el color.
      return '<button class="chip' + (glosarioCat === c.id ? " chip-on" : "") + '" data-action="cambiarGlosarioCat" data-id="' + c.id + '" aria-pressed="' + (glosarioCat === c.id ? "true" : "false") + '">' + escapar(c.corto || c.nombre) + ' · ' + cuenta + '</button>';
    }).join("");
  }

  // Construye las píldoras de salto rápido con las iniciales presentes en la categoría activa.
  function renderGlosarioLetras() {
    const cont = $("glosario-letras");
    if (!cont) return;
    const base = ctx.glosario.terminos.filter(t => glosarioCat === "todas" || t.categoria === glosarioCat);
    const presentes = [...new Set(base.map(t => inicialTermino(t.termino)))].sort();
    // Si hay muy pocos términos, no hace falta barra alfabética adicional.
    if (presentes.length <= 1) {
      cont.innerHTML = "";
      return;
    }
    const items = ["todas", ...presentes];
    cont.innerHTML = items.map(letra => {
      const etiqueta = letra === "todas" ? "A–Z" : letra;
      const activa = glosarioLetra === letra;
      return '<button type="button" class="glosario-letra-btn' + (activa ? " is-on" : "") + '" data-action="cambiarGlosarioLetra" data-letra="' + letra + '" aria-pressed="' + (activa ? "true" : "false") + '">' + etiqueta + '</button>';
    }).join("");
  }

  function cambiarGlosarioCat(id) {
    glosarioCat = id;
    glosarioLetra = "todas";
    renderGlosario(valorBusqueda());
    renderGlosarioFiltros();
    renderGlosarioLetras();
  }

  function cambiarGlosarioLetra(letra) {
    glosarioLetra = letra;
    renderGlosario(valorBusqueda());
    renderGlosarioLetras();
  }

  function limpiarGlosarioFiltros() {
    glosarioCat = "todas";
    glosarioLetra = "todas";
    const s = $("glosario-search");
    if (s) s.value = "";
    renderGlosario("");
    renderGlosarioFiltros();
    renderGlosarioLetras();
  }

  function renderGlosario(filtro) {
    const glosario = ctx.glosario;
    const f = String(filtro || "").trim().toLowerCase();
    const lista = glosario.terminos.filter(t =>
      (glosarioCat === "todas" || t.categoria === glosarioCat) &&
      (glosarioLetra === "todas" || inicialTermino(t.termino) === glosarioLetra) &&
      (!f || (t.termino + " " + t.definicion + " " + (t.ejemplo || "")).toLowerCase().includes(f))
    );

    const listEl = $("glosario-list");
    if (listEl) {
      listEl.innerHTML = lista.map(t => {
        const cat = glosario.categorias.find(c => c.id === t.categoria) || { nombre: t.categoria, color: "#38bdf8" };
        // El ejemplo fluye con salto de línea natural sin caja anidada ni scroll horizontal.
        const bloqueEjemplo = t.ejemplo
          ? '<div class="glosario-ejemplo"><span class="glosario-ejemplo-label">Ejemplo</span><p class="glosario-ejemplo-texto">' + resaltarSQL(t.ejemplo, keywords()) + '</p></div>'
          : "";
        return '<article class="glosario-item">' +
          '<header class="glosario-item-head">' +
            '<h2 class="glosario-termino">' + escapar(t.termino) + '</h2>' +
            '<span class="glosario-cat-badge" style="--cat-color:' + escapar(cat.color || "#38bdf8") + '">' + escapar(cat.nombre) + '</span>' +
          '</header>' +
          '<p class="glosario-def">' + escapar(t.definicion) + '</p>' +
          bloqueEjemplo +
        '</article>';
      }).join("") ||
        '<div class="glosario-empty">' +
          '<p class="text-sm text-slate-300 mb-3">No hay términos que coincidan con tu búsqueda o filtros actuales.</p>' +
          '<button type="button" class="btn btn-secondary btn-sm" data-action="limpiarGlosarioFiltros">Limpiar filtros</button>' +
        '</div>';
    }

    const cont = $("glosario-count");
    if (cont) cont.textContent = lista.length + " término(s)";
  }

  function renderTip() {
    const cont = $("tip-dia");
    if (!cont) return;
    const tips = ctx.glosario.tips;
    if (!tips || !tips.length) { cont.innerHTML = ""; return; }
    const tip = tips[Math.floor(Math.random() * tips.length)];
    cont.innerHTML = '<div class="bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-slate-300 leading-relaxed flex items-start gap-2"><span class="text-amber-300 mt-0.5">' + icono("idea", "icono-sm") + '</span><span><b class="text-amber-300">Tip:</b> ' + tip + '</span></div>';
  }

  return {
    startGlosario,
    cambiarGlosarioCat,
    cambiarGlosarioLetra,
    limpiarGlosarioFiltros,
    renderGlosario,
    renderTip
  };
}
