import { describe, it, expect } from "vitest";
import { tarjeta } from "./tarjetas.js";
import { anilloPuntaje } from "./anillo.js";

describe("tarjeta de listado", () => {
  it("arma el shell apunte-card con tema y titulo escapados", () => {
    const html = tarjeta({ tema: "Modelado", titulo: "Reservas", cuerpo: "<p>intro</p>", pie: "<span>meta</span>" });
    expect(html).toContain('<div class="apunte-card">');
    expect(html).toContain('<div class="apunte-tema">Modelado</div>');
    expect(html).toContain('<div class="apunte-titulo">Reservas</div>');
    expect(html).toContain("<p>intro</p>");
    expect(html).toContain("<span>meta</span>");
  });

  it("omite el pie cuando no se pasa", () => {
    const html = tarjeta({ tema: "T", titulo: "X", cuerpo: "c" });
    expect(html).not.toContain("justify-between");
    expect(tarjeta({ tema: "<t>", titulo: "X", cuerpo: "c" })).toContain("&lt;t&gt;");
  });
});

describe("anillo de puntaje", () => {
  it("expone porcentaje y color por variables CSS", () => {
    const html = anilloPuntaje(80, "#8FBF9F");
    expect(html).toContain("--pct:80");
    expect(html).toContain("--ring-color:#8FBF9F");
    expect(html).toContain(">80%<");
  });
});
