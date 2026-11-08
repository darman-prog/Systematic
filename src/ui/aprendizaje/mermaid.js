// Render de diagramas Mermaid para los apuntes. Se carga bajo demanda para no pagar
// el SDK en la pantalla de inicio; si el render falla, el bloque queda como código.
let carga = null;

function cargarMermaid() {
  if (!carga) carga = import("mermaid").then(m => m.default || m);
  return carga;
}

// marked convierte ```mermaid o ~~~mermaid en <pre><code class="language-mermaid">.
// Cada bloque se reemplaza por una figura con caption y una copia del fuente accesible.
export async function renderizarDiagramas(raiz, { cargar = cargarMermaid } = {}) {
  if (!raiz) return 0;
  const bloques = [...raiz.querySelectorAll("pre > code.language-mermaid")];
  if (!bloques.length) return 0;

  let mermaid;
  try {
    mermaid = await cargar();
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "dark",
      // htmlLabels desactivado: evita HTML dentro de las etiquetas del SVG.
      flowchart: { htmlLabels: false, useMaxWidth: true }
    });
  } catch {
    return 0;
  }

  let renderizados = 0;
  for (const code of bloques) {
    const pre = code.parentElement;
    if (!pre) continue;
    const fuente = code.textContent || "";
    const caption = tomarCaption(pre);
    const id = "mermaid-" + Math.random().toString(36).slice(2);

    try {
      const { svg } = await mermaid.render(id, fuente);
      const figura = document.createElement("figure");
      figura.className = "apunte-diagrama";
      figura.dataset.diagrama = "mermaid";
      figura.innerHTML = svg;
      const svgEl = figura.querySelector("svg");
      if (svgEl) {
        svgEl.setAttribute("role", "img");
        svgEl.setAttribute("aria-label", caption || "Diagrama del apunte");
        svgEl.removeAttribute("height");
        svgEl.style.maxWidth = "100%";
        svgEl.style.height = "auto";
      }
      if (caption) {
        const cap = document.createElement("figcaption");
        cap.textContent = caption;
        figura.appendChild(cap);
      }
      figura.appendChild(crearFuente(fuente));
      pre.replaceWith(figura);
      renderizados += 1;
    } catch {
      pre.replaceWith(crearError(fuente));
    }
  }
  return renderizados;
}

// Una figura se anuncia con el párrafo anterior si empieza con "Figura"; si no, usa
// un texto genérico para que el SVG nunca quede sin nombre accesible.
function tomarCaption(pre) {
  const prev = pre.previousElementSibling;
  if (!prev || prev.tagName !== "P") return "";
  const texto = (prev.textContent || "").trim();
  if (!/^figura\b/i.test(texto)) return "";
  prev.remove();
  return texto;
}

function crearFuente(fuente) {
  const detalles = document.createElement("details");
  detalles.className = "apunte-diagrama-fuente";
  const resumen = document.createElement("summary");
  resumen.textContent = "Ver código del diagrama";
  const bloque = document.createElement("pre");
  const codigo = document.createElement("code");
  codigo.textContent = fuente;
  bloque.appendChild(codigo);
  detalles.append(resumen, bloque);
  return detalles;
}

function crearError(fuente) {
  const caja = document.createElement("div");
  caja.className = "apunte-diagrama-error";
  caja.setAttribute("role", "note");
  caja.textContent = "No se pudo dibujar el diagrama. Revisa el código:";
  caja.appendChild(crearFuente(fuente).querySelector("pre"));
  return caja;
}
