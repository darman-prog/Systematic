// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderizarDiagramas } from "./mermaid.js";

const mermaidFalso = () => ({
  initialize: vi.fn(),
  render: vi.fn(async (id, fuente) => ({ svg: `<svg data-id="${id}" data-src="${fuente.length}"></svg>` }))
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
});
