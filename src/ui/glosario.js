// Render del glosario (filtros por categoría, búsqueda) y del tip del día del home.
// Recibe el glosario de la materia activa vía `ctx`; no lee localStorage ni importa datos.
import { escapar, resaltarSQL, sqlKeywordsDe } from "./helpers.js";
import { icono } from "./iconos.js";

const $ = id => document.getElementById(id);

export function crearGlosarioUI({ ctx, mostrarPantalla }) {
  let glosarioCat = "todas";
  const keywords = () => sqlKeywordsDe(ctx.materia);

  function startGlosario() {
    glosarioCat = "todas";
    renderGlosario("");
    const s = $("glosario-search");
    if (s) s.value = "";
    renderGlosarioFiltros();
    mostrarPantalla("glosario");
  }

  function renderGlosarioFiltros() {
    const cont = $("glosario-filtros");
    if (!cont) return;
    const glosario = ctx.glosario;
    const cats = [{ id: "todas", corto: "Todas", nombre: "Todas" }].concat(glosario.categorias);
    cont.innerHTML = cats.map(c => {
      const cuenta = c.id === "todas" ? glosario.terminos.length : glosario.terminos.filter(t => t.categoria === c.id).length;
      return '<button class="chip' + (glosarioCat === c.id ? " chip-on" : "") + '" data-action="cambiarGlosarioCat" data-id="' + c.id + '">' + (c.corto || c.nombre) + ' · ' + cuenta + '</button>';
    }).join("");
  }

  function cambiarGlosarioCat(id) {
    glosarioCat = id;
    const s = $("glosario-search");
    renderGlosario(s ? s.value : "");
    renderGlosarioFiltros();
  }

  function renderGlosario(filtro) {
    const glosario = ctx.glosario;
    const f = String(filtro || "").trim().toLowerCase();
    const lista = glosario.terminos.filter(t =>
      (glosarioCat === "todas" || t.categoria === glosarioCat) &&
      (!f || (t.termino + " " + t.definicion + " " + (t.ejemplo || "")).toLowerCase().includes(f))
    );
    $("glosario-list").innerHTML = lista.map(t => {
      const cat = glosario.categorias.find(c => c.id === t.categoria) || { nombre: t.categoria, color: "#3b82f6" };
      return '<div class="glosario-item mb-3">' +
        '<div class="flex items-center gap-2 flex-wrap mb-1.5">' +
          '<span class="badge" style="background:' + cat.color + ';color:#0f172a">' + escapar(cat.nombre) + '</span>' +
          '<span class="font-bold text-sky-300 font-mono">' + escapar(t.termino) + '</span>' +
        '</div>' +
        '<p class="text-sm text-slate-300 leading-relaxed">' + escapar(t.definicion) + '</p>' +
        (t.ejemplo ? '<pre class="code-block mt-2.5">' + resaltarSQL(t.ejemplo, keywords()) + '</pre>' : '') +
      '</div>';
    }).join("") || '<p class="text-sm text-slate-400">Sin resultados para esa búsqueda.</p>';
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

  return { startGlosario, cambiarGlosarioCat, renderGlosario, renderTip };
}
