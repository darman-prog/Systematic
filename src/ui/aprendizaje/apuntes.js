// Render y filtrado de apuntes curados por materia.
// El markdown proviene de datos propios (revisados), pero se sanitiza igual por defensa en profundidad.
import { marked } from "marked";
import DOMPurifyImport from "dompurify";
import { escapar } from "../helpers.js";
import { tarjeta } from "../componentes/tarjetas.js";
import { estadoVacio } from "../componentes/estados.js";

// dompurify se auto-inicializa con el `window` global si existe; si no, acepta una factory.
const DOMPurify = typeof DOMPurifyImport === "function" && !DOMPurifyImport.sanitize
  ? DOMPurifyImport(window)
  : DOMPurifyImport;

export function apunteAHTML(markdown) {
  const html = marked.parse(String(markdown || ""), { breaks: true, gfm: true });
  return DOMPurify.sanitize(html);
}

export function filtrarApuntes(apuntes, filtro, temaActivo) {
  const f = String(filtro || "").trim().toLowerCase();
  return (apuntes || []).filter(a =>
    (!temaActivo || temaActivo === "todos" || a.tema === temaActivo) &&
    (!f || (a.titulo + " " + a.contenido + " " + a.tema).toLowerCase().includes(f))
  );
}

// Pantalla de apuntes: lista filtrada por tema y buscador. El tema activo es estado del módulo;
// recibe la materia activa y la navegación por parámetro (no toca localStorage ni estado global).
export function crearApuntesUI({ getMateria, mostrarPantalla }) {
  const $ = id => document.getElementById(id);
  let apunteTema = "todos";

  function apuntesDeMateria() {
    const m = getMateria();
    return m && m.apuntes ? m.apuntes : [];
  }

  function renderApuntesFiltros() {
    const cont = $("apuntes-filtros");
    if (!cont) return;
    const todos = apuntesDeMateria();
    const temas = ["todos"].concat([...new Set(todos.map(a => a.tema))]);
    cont.innerHTML = temas.map(t => {
      const cuenta = t === "todos" ? todos.length : todos.filter(a => a.tema === t).length;
      return '<button class="chip' + (apunteTema === t ? " chip-on" : "") + '" data-action="cambiarApunteTema" data-tema="' + t + '">' +
        (t === "todos" ? "Todos" : escapar(t)) + " · " + cuenta + '</button>';
    }).join("");
  }

  function renderApuntes(filtro) {
    const lista = filtrarApuntes(apuntesDeMateria(), filtro, apunteTema);
    $("apuntes-list").innerHTML = lista.map(a => tarjeta({
      tema: a.tema,
      titulo: a.titulo,
      cuerpo: '<div class="apunte-contenido">' + apunteAHTML(a.contenido) + '</div>' +
        '<div class="apunte-fuente">Fuente: ' + escapar(a.fuente) + '</div>'
    })).join("") || estadoVacio("Aún no hay apuntes para esta materia.");
    const cont = $("apuntes-count");
    if (cont) cont.textContent = lista.length + " apunte(s)";
  }

  function cambiarApunteTema(t) {
    apunteTema = t;
    const s = $("apuntes-search");
    renderApuntes(s ? s.value : "");
    renderApuntesFiltros();
  }

  function startApuntes() {
    apunteTema = "todos";
    const s = $("apuntes-search");
    if (s) s.value = "";
    renderApuntes("");
    renderApuntesFiltros();
    mostrarPantalla("apuntes");
  }

  // Al cambiar de track, el tema activo vuelve a "todos" (mismo comportamiento previo).
  function resetTema() { apunteTema = "todos"; }

  return { startApuntes, renderApuntes, renderApuntesFiltros, cambiarApunteTema, resetTema };
}
