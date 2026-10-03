import { describe, it, expect, beforeEach } from "vitest";
import { MATERIAS, getMateria, cargarContenido } from "./materias.js";

describe("Materias (metadata + carga lazy)", () => {
  it("MATERIAS expone metadata y conteos, pero no contenido embebido", () => {
    expect(MATERIAS.length).toBeGreaterThan(0);
    for (const m of MATERIAS) {
      expect(m.id).toBeTruthy();
      expect(m.nombre).toBeTruthy();
      expect(m.conteo?.preguntas).toBeGreaterThanOrEqual(0);
      // El contenido pesado NO está embebido (spec 012).
      expect(m.preguntas).toBeUndefined();
      expect(m.cargar).toBeInstanceOf(Function);
    }
  });

  it("cargarContenido devuelve las 5 piezas y el conteo coincide con metadata", async () => {
    for (const m of MATERIAS) {
      const c = await cargarContenido(m);
      expect(Array.isArray(c.preguntas)).toBe(true);
      expect(Array.isArray(c.apuntes)).toBe(true);
      expect(Array.isArray(c.escenarios)).toBe(true);
      expect(Array.isArray(c.casos)).toBe(true);
      expect(c.glosario && Array.isArray(c.glosario.terminos)).toBe(true);

      // Gate: el conteo declarado coincide con el contenido real.
      expect(c.preguntas.length).toBe(m.conteo.preguntas);
      expect(c.glosario.terminos.length).toBe(m.conteo.terminos);
      expect(c.apuntes.length).toBe(m.conteo.apuntes);
      expect(c.escenarios.length).toBe(m.conteo.escenarios);
      expect(c.casos.length).toBe(m.conteo.casos);
    }
  });

  it("cargarContenido no falla si una pieza viene vacia", async () => {
    // BD2 no tiene apuntes (intencional, spec 010); la carga normaliza a [].
    const bd2 = getMateria("bd2");
    const c = await cargarContenido(bd2);
    expect(c.apuntes).toEqual([]);
    expect(c.preguntas.length).toBeGreaterThan(0);
  });
});
