import { describe, it, expect } from "vitest";
import { MATERIAS, LENGUAJES, getMateria, getLenguaje } from "../core/index.js";
import { cargarContenido, cargarRoadmap } from "./contenido.js";

describe("contenido (carga lazy)", () => {
  it("carga las 5 piezas y los conteos coinciden con la metadata", async () => {
    for (const m of MATERIAS) {
      const c = await cargarContenido(m);
      expect(Array.isArray(c.preguntas)).toBe(true);
      expect(Array.isArray(c.apuntes)).toBe(true);
      expect(Array.isArray(c.escenarios)).toBe(true);
      expect(Array.isArray(c.casos)).toBe(true);
      expect(c.glosario && Array.isArray(c.glosario.terminos)).toBe(true);

      expect(c.preguntas.length).toBe(m.conteo.preguntas);
      expect(c.glosario.terminos.length).toBe(m.conteo.terminos);
      expect(c.apuntes.length).toBe(m.conteo.apuntes);
      expect(c.escenarios.length).toBe(m.conteo.escenarios);
      expect(c.casos.length).toBe(m.conteo.casos);
    }
  });

  it("no falla si una pieza viene vacia", async () => {
    const c = await cargarContenido(getMateria("bd2"));
    expect(c.apuntes).toEqual([]);
    expect(c.preguntas.length).toBeGreaterThan(0);
  });

  it("adjunta la presentacion de BD2 y de los lenguajes", async () => {
    const bd2 = await cargarContenido(getMateria("bd2"));
    expect(bd2.topicColors).toBeTruthy();
    expect(Array.isArray(bd2.sqlKeywords)).toBe(true);

    const ts = await cargarContenido(getLenguaje("lenguaje-ts"));
    expect(Array.isArray(ts.sqlKeywords)).toBe(true);
    expect(ts.topicColors).toBeUndefined();

    const isw = await cargarContenido(getMateria("isw"));
    expect(isw.topicColors).toBeUndefined();
    expect(isw.sqlKeywords).toBeUndefined();
  });

  describe("tracks de lenguaje", () => {
    it("cada lenguaje carga 5 etapas y su conteo coincide con el banco", async () => {
      for (const l of LENGUAJES) {
        const c = await cargarContenido(l);
        expect(c.roadmap).toBeTruthy();
        expect(c.roadmap.lenguaje).toBe(l.id);
        expect(c.roadmap.etapas).toHaveLength(5);
        expect(c.roadmap.etapas).toHaveLength(l.conteo.etapas);
        expect(c.preguntas.length).toBe(l.conteo.preguntas);
        expect(c.glosario.terminos.length).toBe(l.conteo.terminos);
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
          expect(etapa.examen.preguntas.length).toBeGreaterThanOrEqual(5);
          for (const leccion of etapa.lecciones) {
            expect(leccion.preguntas.length).toBeGreaterThanOrEqual(2);
          }
        }
        expect(c.roadmap.etapas[c.roadmap.etapas.length - 1].id).toBe("auditoria");
      }
    });

    it("cargarRoadmap solo devuelve roadmap para lenguajes", async () => {
      const ts = await cargarRoadmap(getLenguaje("lenguaje-ts"));
      expect(ts.etapas).toHaveLength(5);
      expect(await cargarRoadmap(getMateria("bd2"))).toBeNull();
      expect(await cargarRoadmap({ id: "no-existe" })).toBeNull();
    });
  });

  it("lanza un error claro para un track sin cargador", async () => {
    await expect(cargarContenido({ id: "no-existe" })).rejects.toThrow("Track sin cargador");
  });
});
