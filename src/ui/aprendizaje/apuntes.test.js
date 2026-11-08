// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { apunteAHTML, filtrarApuntes, resumenApunte, crearApuntesUI } from "./apuntes.js";

describe("apunteAHTML", () => {
  it("renderiza markdown a HTML", () => {
    const html = apunteAHTML("## Título\n\n- punto 1\n- punto 2");
    expect(html).toContain("<h2>");
    expect(html).toContain("<li>punto 1</li>");
  });

  it("elimina scripts y atributos peligrosos", () => {
    const html = apunteAHTML('Hola <script>alert(1)</script><img src="x" onerror="alert(1)">');
    expect(html).not.toContain("script");
    expect(html).not.toContain("onerror");
    expect(html).toContain("Hola");
  });

  it("tolera contenido vacío", () => {
    expect(apunteAHTML("")).toBe("");
    expect(apunteAHTML(null)).toBe("");
  });

  it("renderiza las tablas GFM de los apuntes", () => {
    const html = apunteAHTML("| A | B |\n|---|---|\n| 1 | 2 |");
    expect(html).toContain("<table>");
    expect(html).toContain("<th>A</th>");
    expect(html).toContain("<td>1</td>");
  });
});

describe("filtrarApuntes", () => {
  const apuntes = [
    { tema: "Scrum", titulo: "Roles", contenido: "El Product Owner prioriza el backlog." },
    { tema: "Requerimientos", titulo: "Historias de usuario", contenido: "Como usuario quiero una meta." }
  ];

  it("filtra por texto", () => {
    expect(filtrarApuntes(apuntes, "backlog", "todos")).toHaveLength(1);
    expect(filtrarApuntes(apuntes, "ZZZ", "todos")).toHaveLength(0);
  });

  it("filtra por tema", () => {
    expect(filtrarApuntes(apuntes, "", "Scrum")).toHaveLength(1);
    expect(filtrarApuntes(apuntes, "", "todos")).toHaveLength(2);
  });

  it("tolera entrada vacía", () => {
    expect(filtrarApuntes(null, "x", "todos")).toEqual([]);
  });
});

describe("resumenApunte", () => {
  it("quita fences de diagrama y marcas de markdown", () => {
    const texto = resumenApunte("## Título\n\nTexto **fuerte**.\n\n~~~mermaid\nflowchart LR\nA-->B\n~~~");
    expect(texto).toContain("Título");
    expect(texto).toContain("Texto");
    expect(texto).not.toContain("flowchart");
    expect(texto).not.toContain("**");
    expect(texto.length).toBeLessThanOrEqual(220);
  });
});

describe("lector de apuntes", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="screen-apuntes">
        <div id="apuntes-lista-wrap">
          <input id="apuntes-search">
          <div id="apuntes-filtros"></div>
          <p id="apuntes-count"></p>
          <div id="apuntes-list"></div>
        </div>
        <div id="apunte-lectura" class="hidden">
          <span id="apunte-lectura-tema"></span>
          <h2 id="apunte-lectura-titulo" tabindex="-1"></h2>
          <nav id="apunte-toc"></nav>
          <div id="apunte-lectura-contenido"></div>
          <p id="apunte-lectura-fuente"></p>
        </div>
      </section>`;
  });

  it("abre un apunte, arma el TOC y vuelve a la lista", async () => {
    const apuntes = [{
      id: "AP-X",
      tema: "Tema",
      titulo: "Título",
      fuente: "fuente.md",
      contenido: "## Sección\n\nTexto del apunte."
    }];
    const ui = crearApuntesUI({ getMateria: () => ({ apuntes }), mostrarPantalla: vi.fn() });

    await ui.abrirApunte("AP-X");

    expect(document.getElementById("apunte-lectura").classList.contains("hidden")).toBe(false);
    expect(document.getElementById("apuntes-lista-wrap").classList.contains("hidden")).toBe(true);
    expect(document.querySelectorAll("#apunte-toc a")).toHaveLength(1);
    expect(document.getElementById("apunte-lectura-contenido").textContent).toContain("Texto del apunte.");
    expect(document.getElementById("apunte-lectura-fuente").textContent).toContain("fuente.md");

    ui.volverApuntes();
    expect(document.getElementById("apunte-lectura").classList.contains("hidden")).toBe(true);
    expect(document.getElementById("apuntes-lista-wrap").classList.contains("hidden")).toBe(false);
  });

  it("envuelve tablas en .apunte-tabla-wrap y agrupa bloques de 'Cómo leerlo' en .apunte-guia-lectura", async () => {
    const apuntes = [{
      id: "AP-Y",
      tema: "POO",
      titulo: "Relaciones",
      fuente: "fuente.md",
      contenido: "## Tabla\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\nCómo leerlo:\n\n- Paso 1\n- Paso 2"
    }];
    const ui = crearApuntesUI({ getMateria: () => ({ apuntes }), mostrarPantalla: vi.fn() });

    await ui.abrirApunte("AP-Y");

    const cont = document.getElementById("apunte-lectura-contenido");
    expect(cont.querySelector(".apunte-tabla-wrap table")).not.toBeNull();
    const guia = cont.querySelector(".apunte-guia-lectura");
    expect(guia).not.toBeNull();
    expect(guia.querySelector("ul")).not.toBeNull();
  });
});
