import { describe, it, expect } from "vitest";
import { ORDEN_RATING, fusionarMejor, fusionarMision, sumarEstrellas } from "./registros.js";

describe("registros", () => {
  it("conserva el mejor rating y acumula jugadas", () => {
    expect(fusionarMejor(undefined, "parcial")).toEqual({ mejorRating: "parcial", jugadas: 1 });
    expect(fusionarMejor({ mejorRating: "parcial", jugadas: 1 }, "fracaso")).toEqual({ mejorRating: "parcial", jugadas: 2 });
    expect(fusionarMejor({ mejorRating: "parcial", jugadas: 1 }, "exito")).toEqual({ mejorRating: "exito", jugadas: 2 });
    expect(ORDEN_RATING.exito).toBeGreaterThan(ORDEN_RATING.parcial);
  });

  it("fusiona la misión conservando máximos de estrellas y precisión", () => {
    const primera = fusionarMision(undefined, 60, 1);
    expect(primera.registro).toEqual({ estrellas: 1, mejorPct: 60 });
    expect(primera.estrellasGanadas).toBe(1);
    expect(primera.mejoraEstrellas).toBe(true);

    const peor = fusionarMision(primera.registro, 50, 0);
    expect(peor.cambio).toBe(false);
    expect(peor.registro).toEqual({ estrellas: 1, mejorPct: 60 });
    expect(peor.estrellasGanadas).toBe(0);

    const mejor = fusionarMision(primera.registro, 100, 3);
    expect(mejor.registro).toEqual({ estrellas: 3, mejorPct: 100 });
    expect(mejor.estrellasGanadas).toBe(2);
  });

  it("suma estrellas de todas las materias", () => {
    const mapas = { bd2: { t1: { estrellas: 2 }, t2: { estrellas: 1 } }, isw: { t1: { estrellas: 3 } } };
    expect(sumarEstrellas([{ id: "bd2" }, { id: "isw" }, { id: "asw" }], id => mapas[id] || {})).toBe(6);
  });
});
