import { describe, it, expect, beforeEach } from "vitest";
import { MATERIAS, LENGUAJES, getMateria, getLenguaje, cargarContenido } from "./materias.js";

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

  describe("tracks de lenguaje (spec 011)", () => {
    it("registra cada lenguaje con tipo lenguaje y roadmap", () => {
      expect(LENGUAJES.length).toBeGreaterThan(0);
      for (const l of LENGUAJES) {
        expect(l.tipo).toBe("lenguaje");
        expect(l.nombre).toBeTruthy();
        expect(l.cargar).toBeInstanceOf(Function);
        expect(l.cargarRoadmap).toBeInstanceOf(Function);
        // El contenido pesado NO está embebido (spec 012).
        expect(l.preguntas).toBeUndefined();
      }
      expect(getLenguaje("lenguaje-ts")).toBeTruthy();
      expect(getLenguaje("no-existe")).toBeNull();
    });

    it("cada lenguaje carga 5 etapas y su conteo coincide con el banco", async () => {
      for (const l of LENGUAJES) {
        const c = await cargarContenido(l);
        expect(c.roadmap).toBeTruthy();
        expect(c.roadmap.lenguaje).toBe(l.id);
        expect(c.roadmap.etapas).toHaveLength(5);
        expect(c.roadmap.etapas).toHaveLength(l.conteo.etapas);
        expect(c.preguntas.length).toBe(l.conteo.preguntas);
        expect(c.glosario.terminos.length).toBe(l.conteo.terminos);
        // Un lenguaje no trae apuntes, escenarios ni casos.
        expect(c.apuntes).toEqual([]);
        expect(c.escenarios).toEqual([]);
        expect(c.casos).toEqual([]);
      }
    });

    it("todas las preguntas del roadmap existen en el banco de su lenguaje", async () => {
      for (const l of LENGUAJES) {
        const c = await cargarContenido(l);
        const ids = new Set(c.preguntas.map(p => p.id));
        const referenciadas = [];
        for (const etapa of c.roadmap.etapas) {
          for (const leccion of etapa.lecciones) referenciadas.push(...leccion.preguntas);
          referenciadas.push(...etapa.examen.preguntas);
        }
        const faltantes = referenciadas.filter(id => !ids.has(id));
        expect(faltantes, `faltantes en ${l.id}`).toEqual([]);
      }
    });

    it("cada examen declara version, umbral 0.8 y al menos 5 preguntas; el capstone va ultimo", async () => {
      for (const l of LENGUAJES) {
        const c = await cargarContenido(l);
        for (const etapa of c.roadmap.etapas) {
          expect(Number.isInteger(etapa.examen.version)).toBe(true);
          expect(etapa.examen.umbral).toBe(0.8);
          // El piso de 5 fija el minimo jugable; la ampliacion de contenido puede sumar mas.
          expect(etapa.examen.preguntas.length).toBeGreaterThanOrEqual(5);
          for (const leccion of etapa.lecciones) {
            expect(leccion.preguntas.length).toBeGreaterThanOrEqual(2);
          }
        }
        expect(c.roadmap.etapas[c.roadmap.etapas.length - 1].id).toBe("auditoria");
      }
    });
  });
});
