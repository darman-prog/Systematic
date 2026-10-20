import { describe, it, expect } from "vitest";
import { MATERIAS, LENGUAJES, getMateria, getLenguaje } from "./materias.js";

describe("Registro de tracks (metadata)", () => {
  it("MATERIAS expone metadata y conteos, sin contenido embebido ni cargadores", () => {
    expect(MATERIAS.length).toBeGreaterThan(0);
    for (const m of MATERIAS) {
      expect(m.id).toBeTruthy();
      expect(m.nombre).toBeTruthy();
      expect(m.tipo).toBe("materia");
      expect(m.conteo?.preguntas).toBeGreaterThanOrEqual(0);
      // El contenido pesado y los imports viven en student/contenido.js.
      expect(m.preguntas).toBeUndefined();
      expect(m.cargar).toBeUndefined();
      expect(m.cargarRoadmap).toBeUndefined();
      expect(m.topicColors).toBeUndefined();
      expect(m.sqlKeywords).toBeUndefined();
    }
  });

  it("LENGUAJES expone metadata y conteos, sin contenido ni cargadores", () => {
    expect(LENGUAJES.length).toBeGreaterThan(0);
    for (const l of LENGUAJES) {
      expect(l.tipo).toBe("lenguaje");
      expect(l.nombre).toBeTruthy();
      expect(l.conteo?.etapas).toBe(5);
      expect(l.preguntas).toBeUndefined();
      expect(l.cargar).toBeUndefined();
      expect(l.cargarRoadmap).toBeUndefined();
      expect(l.sqlKeywords).toBeUndefined();
    }
  });

  it("getMateria y getLenguaje resuelven por id", () => {
    expect(getMateria("bd2")).toBeTruthy();
    expect(getMateria("no-existe")).toBeNull();
    expect(getLenguaje("lenguaje-ts")).toBeTruthy();
    expect(getLenguaje("no-existe")).toBeNull();
  });
});
