import { describe, it, expect } from "vitest";
import { saludoSegunHora } from "./helpers.js";

describe("saludoSegunHora", () => {
  const conHora = h => new Date(2026, 8, 20, h, 0);

  it("saluda según el tramo horario", () => {
    expect(saludoSegunHora("Diego", conHora(8))).toBe("Buenos días, Diego");
    expect(saludoSegunHora("Diego", conHora(15))).toBe("Buenas tardes, Diego");
    expect(saludoSegunHora("Diego", conHora(22))).toBe("Buenas noches, Diego");
    expect(saludoSegunHora("Ana", conHora(3))).toBe("Buenas noches, Ana");
  });

  it("sin nombre devuelve el saludo a secas", () => {
    expect(saludoSegunHora("", conHora(8))).toBe("Buenos días");
    expect(saludoSegunHora(null, conHora(15))).toBe("Buenas tardes");
    expect(saludoSegunHora("   ", conHora(22))).toBe("Buenas noches");
  });

  it("cubre los bordes de los tramos", () => {
    expect(saludoSegunHora("A", conHora(6))).toContain("días");
    expect(saludoSegunHora("A", conHora(11))).toContain("días");
    expect(saludoSegunHora("A", conHora(12))).toContain("tardes");
    expect(saludoSegunHora("A", conHora(18))).toContain("tardes");
    expect(saludoSegunHora("A", conHora(19))).toContain("noches");
  });
});
