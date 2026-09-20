// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { apunteAHTML, filtrarApuntes } from "./apuntes.js";

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
