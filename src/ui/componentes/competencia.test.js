import { describe, it, expect } from "vitest";
import { barraCompetencia } from "./competencia.js";

describe("barraCompetencia", () => {
  it("escribe el avance en texto además de la barra (WCAG)", () => {
    const html = barraCompetencia({ aprobadas: 2, total: 5 });
    expect(html).toContain("2 de 5 etapas");
    expect(html).toContain("width:40%");
    expect(html).toContain('aria-label="Competencia: 2 de 5 etapas"');
  });

  it("no divide por cero", () => {
    expect(barraCompetencia({ aprobadas: 0, total: 0 })).toContain("0 de 0 etapas");
  });

  it("ignora un color inválido y aplica uno válido", () => {
    expect(barraCompetencia({ aprobadas: 1, total: 2, color: "rojo" })).not.toContain("--competencia-color");
    expect(barraCompetencia({ aprobadas: 1, total: 2, color: "#6FA8DC" })).toContain("--competencia-color:#6FA8DC");
  });
});
