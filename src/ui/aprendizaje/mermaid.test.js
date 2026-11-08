// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderizarDiagramas } from "./mermaid.js";

const mermaidFalso = () => ({
  initialize: vi.fn(),
  render: vi.fn(async (id, fuente) => ({
    svg: `<svg id="${id}" viewBox="0 0 300 200" data-src="${fuente.length}"><style>#${id} .relation{fill:none;}</style></svg>`
  }))
});

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("renderizarDiagramas", () => {
  it("reemplaza el bloque por una figura con caption y fuente", async () => {
    document.body.innerHTML = `
      <div id="raiz">
        <p><strong>Figura 1.</strong> Flujo de una petición</p>
        <pre><code class="language-mermaid">flowchart LR
A-->B</code></pre>
      </div>`;
    const cargar = vi.fn(async () => mermaidFalso());
    const n = await renderizarDiagramas(document.getElementById("raiz"), { cargar });

    expect(n).toBe(1);
    const figura = document.querySelector("figure.apunte-diagrama");
    expect(figura).not.toBeNull();
    expect(figura.querySelector("svg")).not.toBeNull();
    expect(figura.querySelector("figcaption").textContent).toContain("Figura 1");
    expect(figura.querySelector("details").textContent).toContain("A-->B");
    expect(document.querySelector("p")).toBeNull();
  });

  it("si Mermaid falla, conserva el código como fallback accesible", async () => {
    document.body.innerHTML = `<div id="raiz"><pre><code class="language-mermaid">flowchart LR
A-->B</code></pre></div>`;
    const cargar = async () => ({
      initialize: vi.fn(),
      render: async () => { throw new Error("boom"); }
    });
    const n = await renderizarDiagramas(document.getElementById("raiz"), { cargar });

    expect(n).toBe(0);
    const error = document.querySelector(".apunte-diagrama-error");
    expect(error).not.toBeNull();
    expect(error.textContent).toContain("No se pudo dibujar");
    expect(error.textContent).toContain("A-->B");
  });

  it("no hace nada si el apunte no tiene diagramas", async () => {
    document.body.innerHTML = '<div id="raiz"><p>Sin diagramas</p></div>';
    const cargar = vi.fn();
    expect(await renderizarDiagramas(document.getElementById("raiz"), { cargar })).toBe(0);
    expect(cargar).not.toHaveBeenCalled();
  });

  it("permite ampliar el diagrama en un modal accesible y cerrarlo con Escape devolviendo el foco", async () => {
    document.body.innerHTML = `
      <div id="raiz">
        <p><strong>Figura 1.</strong> Diagrama de prueba</p>
        <pre><code class="language-mermaid">flowchart LR
A-->B</code></pre>
      </div>`;
    const cargar = vi.fn(async () => mermaidFalso());
    await renderizarDiagramas(document.getElementById("raiz"), { cargar });

    const btnZoom = /** @type {HTMLButtonElement} */ (document.querySelector(".apunte-diagrama-zoom"));
    expect(btnZoom).not.toBeNull();
    btnZoom.click();

    const modal = document.getElementById("modal-diagrama-ampliado");
    expect(modal).not.toBeNull();
    expect(modal.classList.contains("hidden")).toBe(false);
    const svgOriginal = document.querySelector("figure.apunte-diagrama svg");
    const svgModal = modal.querySelector("#modal-diagrama-cuerpo svg");
    expect(svgModal).not.toBeNull();
    expect(svgModal.id).toBe(svgOriginal.id + "-modal");
    expect(svgModal.innerHTML).toContain("#" + svgOriginal.id + "-modal .relation{fill:none;}");

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(modal.classList.contains("hidden")).toBe(true);
    expect(document.activeElement).toBe(btnZoom);
  });
});
