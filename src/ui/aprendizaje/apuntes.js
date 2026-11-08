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

// Estima el tiempo de lectura en minutos a partir del texto limpio (base ~180 palabras/min en material técnico).
function estimarMinutosLectura(contenido) {
  const limpio = resumenApunte(contenido, 50000);
  const palabras = limpio ? limpio.split(/\s+/).filter(Boolean).length : 0;
  return Math.max(1, Math.round(palabras / 180));
}

// Envuelve tablas para scroll horizontal seguro en móvil y destaca los bloques de "Cómo leerlo:".
function enriquecerEstructuraEditorial(contenedor) {
  if (!contenedor) return;
  contenedor.querySelectorAll("table").forEach(tabla => {
    if (tabla.parentElement && tabla.parentElement.classList.contains("apunte-tabla-wrap")) return;
    const wrap = document.createElement("div");
    wrap.className = "apunte-tabla-wrap";
    tabla.replaceWith(wrap);
    wrap.appendChild(tabla);
  });

  // Agrupa los párrafos de guía ("Cómo leerlo:") junto con su lista inmediata en una tarjeta pedagógica.
  contenedor.querySelectorAll("p").forEach(p => {
    const texto = (p.textContent || "").trim();
    if (!/^c[oó]mo\s+(leerlo|interpretar)/i.test(texto)) return;
    const caja = document.createElement("div");
    caja.className = "apunte-guia-lectura";
    const siguiente = p.nextElementSibling;
    p.replaceWith(caja);
    caja.appendChild(p);
    if (siguiente && (siguiente.tagName === "UL" || siguiente.tagName === "OL")) {
      caja.appendChild(siguiente);
    }
  });
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
    const tiempoEl = $("apunte-lectura-tiempo");
    if (tiempoEl) tiempoEl.textContent = "· " + estimarMinutosLectura(apunte.contenido) + " min de lectura";
    $("apunte-lectura-titulo").textContent = apunte.titulo;
    $("apunte-lectura-fuente").textContent = "Fuente: " + apunte.fuente;

    const cont = $("apunte-lectura-contenido");
    cont.innerHTML = apunteAHTML(apunte.contenido);
    enriquecerEstructuraEditorial(cont);

    // TOC numerado a partir de los headings reales; el id permite enlazar y resaltar la sección activa.
    const headings = [...cont.querySelectorAll("h2,h3")];
    const toc = $("apunte-toc");
    let numH2 = 0;
    const enlacesHtml = headings.map((h, i) => {
      const ancla = "apunte-sec-" + i;
      h.id = ancla;
      const esH3 = h.tagName === "H3";
      if (!esH3) numH2 += 1;
      const prefijo = esH3 ? "↳ " : numH2 + ". ";
      const nivel = esH3 ? " apunte-toc-h3" : "";
      const activo = i === 0 ? " apunte-toc-link--activo" : "";
      return '<a class="apunte-toc-link' + nivel + activo + '" href="#' + ancla + '">' + prefijo + escapar(h.textContent) + "</a>";
    }).join("");

    toc.innerHTML = headings.length
      ? '<span class="apunte-toc-head">Contenido del apunte (' + numH2 + ' secciones)</span>' +
        '<div class="apunte-toc-lista">' + enlacesHtml + "</div>"
      : "";
    toc.classList.toggle("hidden", headings.length === 0);

    toc.querySelectorAll(".apunte-toc-link").forEach(link => {
      link.addEventListener("click", () => {
        toc.querySelectorAll(".apunte-toc-link").forEach(l => l.classList.remove("apunte-toc-link--activo"));
        link.classList.add("apunte-toc-link--activo");
      });
    });

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
    const boton = [...document.querySelectorAll('[data-action="leerApunte"]')]
      .find(b => /** @type {HTMLElement} */ (b).dataset.id === id);
    if (boton) /** @type {HTMLElement} */ (boton).focus({ preventScroll: true });
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
