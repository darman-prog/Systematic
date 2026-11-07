import { describe, it, expect } from "vitest";
import { saludoSegunHora, seccionesCorreccion } from "./helpers.js";

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

describe("seccionesCorreccion", () => {
  it("renderiza tarjetas separadas con chips visuales para relaciones y miembros", () => {
    const html = seccionesCorreccion({
      aciertos: { correctas: 4, total: 8 },
      porCrear: ["Crea: TarjetaCredito → MetodoPago (herencia)"],
      porQuitar: ["Elimina: PayPal → TarjetaCredito (composición)"],
      porMover: ["Ubica: numeroTarjeta → TarjetaCredito"]
    });
    expect(html).toContain("4 de 8");
    expect(html).toContain("50% completado");
    expect(html).toContain("Falta crear");
    expect(html).toContain("Elimina");
    expect(html).toContain("Ubica");
    expect(html).toContain("corr-chip--nodo");
    expect(html).toContain("corr-chip--miembro");
  });
});
