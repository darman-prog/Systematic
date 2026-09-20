// Render y filtrado de apuntes curados por materia.
// El markdown proviene de datos propios (revisados), pero se sanitiza igual por defensa en profundidad.
import { marked } from "marked";
import DOMPurifyImport from "dompurify";

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
