import { describe, it, expect } from "vitest";
import { estadoVacio, aviso } from "./estados.js";

describe("componentes de estado", () => {
  it("estadoVacio escapa el texto", () => {
    expect(estadoVacio("Aún no hay casos.")).toBe('<p class="text-sm text-slate-400">Aún no hay casos.</p>');
    expect(estadoVacio("<b>x</b>")).toContain("&lt;b&gt;");
  });

  it("aviso incluye icono y texto escapado", () => {
    const html = aviso("Contenido en preparación");
    expect(html).toContain('class="icono icono-sm"');
    expect(html).toContain("Contenido en preparación");
  });
});
