// Render y filtrado de apuntes curados por materia.
// El markdown proviene de datos propios (revisados), pero se sanitiza igual por defensa en profundidad.
import { marked } from "marked";
import DOMPurifyImport from "dompurify";
import { escapar } from "../helpers.js";
import { tarjeta } from "../componentes/tarjetas.js";
import { estadoVacio } from "../componentes/estados.js";
import { renderizarDiagramas } from "./mermaid.js";

// dompurify se auto-inicializa con el `window` global si existe; si no, acepta una factory.
const DOMPurify = typeof DOMPurifyImport === "function" && !DOMPurifyImport.sanitize
  ? DOMPurifyImport(window)
  : DOMPurifyImport;

export function apunteAHTML(markdown) {
  const html = /** @type {string} */ (marked.parse(String(markdown || ""), { breaks: true, gfm: true }));
  return DOMPurify.sanitize(html);
}

export function filtrarApuntes(apuntes, filtro, temaActivo) {
  const f = String(filtro || "").trim().toLowerCase();
  return (apuntes || []).filter(a =>
    (!temaActivo || temaActivo === "todos" || a.tema === temaActivo) &&
    (!f || (a.titulo + " " + a.contenido + " " + a.tema).toLowerCase().includes(f))
  );
}

// Resumen corto para la tarjeta: quita fences de código (incluidos los diagramas
// Mermaid), marcas de markdown y colapsa espacios para no romper el listado.
export function resumenApunte(contenido, max = 220) {
  const texto = String(contenido || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_`>|-]/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return texto.length > max ? texto.slice(0, max - 1).trimEnd() + "…" : texto;
}

// Pantalla de apuntes: lista filtrada por tema y buscador. El tema activo es estado del módulo;
// recibe la materia activa y la navegación por parámetro (no toca localStorage ni estado global).
export function crearApuntesUI({ getMateria, mostrarPantalla }) {
  /** @type {(id: string) => any} */
const $ = id => document.getElementById(id);
  let apunteTema = "todos";
  let apunteActivo = null;

  function apuntesDeMateria() {
    const m = getMateria();
    return m && m.apuntes ? m.apuntes : [];
  }

  function mostrarDetalle(mostrar) {
    $("apuntes-lista-wrap")?.classList.toggle("hidden", mostrar);
    $("apunte-lectura")?.classList.toggle("hidden", !mostrar);
  }

  function renderApuntesFiltros() {
    const cont = $("apuntes-filtros");
    if (!cont) return;
    const todos = apuntesDeMateria();
    const temas = ["todos"].concat([...new Set(todos.map(a => a.tema))]);
    cont.innerHTML = temas.map(t => {
      const cuenta = t === "todos" ? todos.length : todos.filter(a => a.tema === t).length;
      // aria-pressed comunica el filtro activo al lector de pantalla, no solo el color.
      return '<button class="chip' + (apunteTema === t ? " chip-on" : "") + '" data-action="cambiarApunteTema" data-tema="' + t + '" aria-pressed="' + (apunteTema === t ? "true" : "false") + '">' +
        (t === "todos" ? "Todos" : escapar(t)) + " · " + cuenta + '</button>';
    }).join("");
  }

  function renderApuntes(filtro) {
    const lista = filtrarApuntes(apuntesDeMateria(), filtro, apunteTema);
    $("apuntes-list").innerHTML = lista.map(a => tarjeta({
      tema: a.tema,
      titulo: a.titulo,
      pie: "",
      cuerpo: '<p class="apunte-resumen">' + escapar(resumenApunte(a.contenido)) + '</p>' +
        '<button class="btn btn-secondary btn-sm" data-action="leerApunte" data-id="' + escapar(a.id) + '">Leer apunte →</button>'
    })).join("") || estadoVacio("Aún no hay apuntes para esta materia.");
    const cont = $("apuntes-count");
    if (cont) cont.textContent = lista.length + " apunte(s)";
  }

  async function abrirApunte(id) {
    const apunte = apuntesDeMateria().find(a => a.id === id);
    if (!apunte) return;
    apunteActivo = apunte;

    $("apunte-lectura-tema").textContent = apunte.tema;
    $("apunte-lectura-titulo").textContent = apunte.titulo;
    $("apunte-lectura-fuente").textContent = "Fuente: " + apunte.fuente;

    const cont = $("apunte-lectura-contenido");
    cont.innerHTML = apunteAHTML(apunte.contenido);

    // TOC a partir de los headings reales; el id permite enlazar y volver con foco.
    const headings = [...cont.querySelectorAll("h2,h3")];
    const toc = $("apunte-toc");
    toc.innerHTML = headings.map((h, i) => {
      const ancla = "apunte-sec-" + i;
      h.id = ancla;
      const nivel = h.tagName === "H3" ? " apunte-toc-h3" : "";
      return '<a class="apunte-toc-link' + nivel + '" href="#' + ancla + '">' + escapar(h.textContent) + "</a>";
    }).join("");
    toc.classList.toggle("hidden", headings.length === 0);

    mostrarDetalle(true);
    $("apunte-lectura-titulo").focus({ preventScroll: true });
    const pantalla = $("screen-apuntes");
    if (pantalla && typeof pantalla.scrollIntoView === "function") pantalla.scrollIntoView({ block: "start" });
    await renderizarDiagramas(cont);
  }

  function volverApuntes() {
    const id = apunteActivo && apunteActivo.id;
    apunteActivo = null;
    mostrarDetalle(false);
    if (!id) return;
    const boton = [...document.querySelectorAll('[data-action="leerApunte"]')].find(b => b.dataset.id === id);
    if (boton) boton.focus({ preventScroll: true });
  }

  function cambiarApunteTema(t) {
    apunteTema = t;
    if (apunteActivo) volverApuntes();
    const s = $("apuntes-search");
    renderApuntes(s ? s.value : "");
    renderApuntesFiltros();
  }

  function startApuntes() {
    apunteTema = "todos";
    apunteActivo = null;
    mostrarDetalle(false);
    const s = $("apuntes-search");
    if (s) s.value = "";
    renderApuntes("");
    renderApuntesFiltros();
    mostrarPantalla("apuntes");
  }

  // Al cambiar de track, el tema activo vuelve a "todos" y se cierra el lector.
  function resetTema() {
    apunteTema = "todos";
    apunteActivo = null;
    mostrarDetalle(false);
  }

  return { startApuntes, renderApuntes, renderApuntesFiltros, cambiarApunteTema, resetTema, abrirApunte, volverApuntes };
}
