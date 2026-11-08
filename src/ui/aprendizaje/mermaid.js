// Render de diagramas Mermaid para los apuntes. Se carga bajo demanda para no pagar
// el SDK en la pantalla de inicio; si el render falla, el bloque queda como código.
let carga = null;

function cargarMermaid() {
  if (!carga) carga = import("mermaid").then(m => m.default || m);
  return carga;
}

// Configura la paleta y espaciado de Mermaid alineados al sistema visual de Systematic.
const CONFIG_MERMAID = {
  startOnLoad: false,
  securityLevel: "strict",
  look: "classic",
  theme: "base",
  themeVariables: {
    darkMode: true,
    background: "transparent",
    primaryColor: "#1e293b",
    primaryTextColor: "#f1f5f9",
    primaryBorderColor: "#38bdf8",
    lineColor: "#94a3b8",
    secondaryColor: "#0f172a",
    tertiaryColor: "#1e293b",
    mainBkg: "#1e293b",
    nodeBorder: "#38bdf8",
    clusterBkg: "#0f172a",
    clusterBorder: "#334155",
    titleColor: "#f8fafc",
    edgeLabelBackground: "#0f172a",
    dropShadow: "none",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: "14px"
  },
  // Mantiene cajas ajustadas al texto y oculta compartimentos vacíos en diagramas de clases.
  flowchart: { htmlLabels: true, useMaxWidth: false, padding: 12, nodeSpacing: 34, rankSpacing: 42, wrappingWidth: 220 },
  class: { useMaxWidth: false, hideEmptyMembersBox: true },
  er: { useMaxWidth: false }
};

// Extrae el ancho y alto naturales desde el atributo viewBox del SVG generado por Mermaid.
function obtenerDimensionesViewBox(svgEl) {
  const vb = (svgEl.getAttribute("viewBox") || "").trim().split(/[\s,]+/).map(Number);
  if (vb.length === 4 && Number.isFinite(vb[2]) && Number.isFinite(vb[3]) && vb[2] > 0 && vb[3] > 0) {
    return { ancho: vb[2], alto: vb[3] };
  }
  return null;
}

// Normaliza atributos de tamaño del SVG para que todos los diagramas compartan una escala equilibrada.
function normalizarSvgDiagrama(svgEl, caption) {
  if (!svgEl) return;
  svgEl.setAttribute("role", "img");
  svgEl.setAttribute("aria-label", caption || "Diagrama del apunte");
  svgEl.setAttribute("preserveAspectRatio", "xMidYMid meet");
  const dims = obtenerDimensionesViewBox(svgEl);
  svgEl.removeAttribute("height");
  svgEl.removeAttribute("width");
  if (dims) {
    // Escala suavemente diagramas estrechos (1.08x) y mantiene proporción 1:1 en el resto sin desbordar.
    const factorInline = dims.ancho < 320 ? 1.08 : 1;
    svgEl.style.width = Math.round(dims.ancho * factorInline) + "px";
  }
  svgEl.style.maxWidth = "100%";
  svgEl.style.height = "auto";
}

// Abre un visor modal accesible con el SVG clonado para inspeccionar diagramas con mayor detalle.
export function abrirModalDiagrama(svgOriginal, tituloTexto, triggerBtn) {
  if (!svgOriginal) return;
  let modal = document.getElementById("modal-diagrama-ampliado");
  // Si el contenedor no está en el DOM (ej. en tests aislados), lo creamos bajo demanda.
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-diagrama-ampliado";
    modal.className = "modal-diagrama hidden";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "modal-diagrama-titulo");
    modal.innerHTML =
      '<div class="modal-diagrama-caja">' +
        '<div class="modal-diagrama-head">' +
          '<span id="modal-diagrama-titulo" class="modal-diagrama-titulo"></span>' +
          '<button type="button" id="cerrar-modal-diagrama" class="btn btn-secondary btn-sm">Cerrar (Esc)</button>' +
        "</div>" +
        '<div id="modal-diagrama-cuerpo" class="modal-diagrama-cuerpo"></div>' +
      "</div>";
    document.body.appendChild(modal);
  }

  const tituloEl = document.getElementById("modal-diagrama-titulo");
  const cuerpoEl = document.getElementById("modal-diagrama-cuerpo");
  const btnCerrar = document.getElementById("cerrar-modal-diagrama");
  if (!cuerpoEl || !btnCerrar) return;

  if (tituloEl) tituloEl.textContent = tituloTexto || "Diagrama ampliado";
  cuerpoEl.innerHTML = "";
  const clon = /** @type {SVGElement} */ (svgOriginal.cloneNode(true));
  // Renombra el id del SVG y actualiza su hoja de estilos interna para conservar los selectores de Mermaid sin duplicar IDs.
  const idOriginal = svgOriginal.getAttribute("id");
  if (idOriginal) {
    const nuevoId = idOriginal + "-modal";
    clon.setAttribute("id", nuevoId);
    clon.innerHTML = clon.innerHTML.split(idOriginal).join(nuevoId);
  }
  const dims = obtenerDimensionesViewBox(clon);
  if (dims) {
    // Amplía el diagrama de forma armónica (1.35x-1.45x) evitando que diagramas pequeños se estiren en exceso.
    const factorModal = dims.ancho < 340 ? 1.45 : 1.35;
    clon.style.width = Math.max(Math.round(dims.ancho * factorModal), 360) + "px";
  }
  clon.style.maxWidth = "100%";
  clon.style.height = "auto";
  cuerpoEl.appendChild(clon);

  modal.classList.remove("hidden");
  btnCerrar.focus({ preventScroll: true });

  const cerrar = () => {
    modal.classList.add("hidden");
    cuerpoEl.innerHTML = "";
    window.removeEventListener("keydown", alTecla);
    modal.removeEventListener("click", alClickFondo);
    btnCerrar.removeEventListener("click", cerrar);
    if (triggerBtn && typeof triggerBtn.focus === "function") {
      triggerBtn.focus({ preventScroll: true });
    }
  };

  const alTecla = e => {
    if (e.key === "Escape") {
      e.preventDefault();
      cerrar();
    } else if (e.key === "Tab") {
      // Mantiene el foco atrapado en el botón de cierre mientras el modal esté abierto.
      e.preventDefault();
      btnCerrar.focus({ preventScroll: true });
    }
  };

  const alClickFondo = e => {
    if (e.target === modal) cerrar();
  };

  window.addEventListener("keydown", alTecla);
  modal.addEventListener("click", alClickFondo);
  btnCerrar.addEventListener("click", cerrar);
}

// marked convierte ```mermaid o ~~~mermaid en <pre><code class="language-mermaid">.
// Cada bloque se reemplaza por una figura con barra superior, lienzo normalizado y fuente accesible.
export async function renderizarDiagramas(raiz, { cargar = cargarMermaid } = {}) {
  if (!raiz) return 0;
  const bloques = [...raiz.querySelectorAll("pre > code.language-mermaid")];
  if (!bloques.length) return 0;

  let mermaid;
  try {
    mermaid = await cargar();
    mermaid.initialize(CONFIG_MERMAID);
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

      const head = document.createElement("div");
      head.className = "apunte-diagrama-head";
      const cap = document.createElement("figcaption");
      cap.textContent = caption || "Diagrama explicativo";
      head.appendChild(cap);

      const btnZoom = document.createElement("button");
      btnZoom.type = "button";
      btnZoom.className = "apunte-diagrama-zoom";
      btnZoom.textContent = "Ampliar diagrama";
      btnZoom.setAttribute("aria-label", "Ampliar " + (caption || "diagrama"));
      head.appendChild(btnZoom);

      const lienzo = document.createElement("div");
      lienzo.className = "apunte-diagrama-lienzo";
      lienzo.innerHTML = svg;
      const svgEl = lienzo.querySelector("svg");
      normalizarSvgDiagrama(svgEl, caption);

      btnZoom.addEventListener("click", () => abrirModalDiagrama(svgEl, caption || "Diagrama del apunte", btnZoom));

      figura.append(head, lienzo, crearFuente(fuente));
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
