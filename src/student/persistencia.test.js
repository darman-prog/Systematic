import { describe, it, expect, beforeEach } from "vitest";
import { crearPersistencia, CLAVES_GLOBALES, claveMisiones } from "./persistencia.js";

function storageMemoria() {
  const datos = {};
  return {
    getItem: k => (k in datos ? datos[k] : null),
    setItem: (k, v) => { datos[k] = String(v); },
    removeItem: k => { delete datos[k]; },
    _datos: datos
  };
}

describe("persistencia", () => {
  let storage;
  let p;
  beforeEach(() => {
    storage = storageMemoria();
    p = crearPersistencia(storage);
  });

  it("centraliza las claves por materia y globales", () => {
    expect(p.clavesMateria("bd2").progreso).toBe("sys.progreso.bd2");
    expect(CLAVES_GLOBALES.xp).toBe("sys.xp");
    expect(claveMisiones("isw")).toBe("sys.misiones.isw");
  });

  it("lee con valor por defecto y escribe JSON", () => {
    expect(p.progreso("bd2")).toEqual({});
    expect(p.historial("bd2")).toEqual([]);
    expect(p.xp()).toBe(0);
    p.guardarXp(120);
    expect(p.xp()).toBe(120);
    p.guardarProgreso("bd2", { q1: { ok: 1 } });
    expect(p.progreso("bd2")).toEqual({ q1: { ok: 1 } });
  });

  it("normaliza la meta diaria y recorta el historial a 15", () => {
    p.guardarMeta("bd2", 0);
    expect(p.meta("bd2")).toBeGreaterThan(0);
    const largo = Array.from({ length: 20 }, (_, i) => i);
    p.guardarHistorial("bd2", largo);
    expect(p.historial("bd2")).toHaveLength(15);
  });

  it("borra progreso, actividad e historial de una materia", () => {
    p.guardarProgreso("bd2", { a: 1 });
    p.guardarActividad("bd2", { "2026-01-01": 3 });
    p.guardarHistorial("bd2", [{ date: 1 }]);
    p.borrarProgresoYActividad("bd2");
    p.borrarHistorial("bd2");
    expect(p.progreso("bd2")).toEqual({});
    expect(p.actividad("bd2")).toEqual({});
    expect(p.historial("bd2")).toEqual([]);
  });

  it("reiniciarMateria borra progreso, racha, historial y misiones; conserva meta y globales", () => {
    p.guardarProgreso("bd2", { a: 1 });
    p.guardarActividad("bd2", { "2026-01-01": 3 });
    p.guardarHistorial("bd2", [{ date: 1 }]);
    p.guardarMisiones("bd2", { m1: { estrellas: 2 } });
    p.guardarMeta("bd2", 30);
    p.guardarXp(120);
    p.guardarLogros({ l1: "fecha" });
    p.guardarCasos({ c1: { mejorRating: "exito" } });
    p.guardarEscenarios({ e1: { mejorRating: "parcial" } });

    p.reiniciarMateria("bd2");

    expect(p.progreso("bd2")).toEqual({});
    expect(p.actividad("bd2")).toEqual({});
    expect(p.historial("bd2")).toEqual([]);
    expect(p.misiones("bd2")).toEqual({});
    expect(p.meta("bd2")).toBe(30);
    expect(p.xp()).toBe(120);
    expect(p.logros().l1).toBe("fecha");
    expect(p.casos().c1.mejorRating).toBe("exito");
    expect(p.escenarios().e1.mejorRating).toBe("parcial");
    // Las otras materias no se tocan.
    p.guardarProgreso("isw", { b: 2 });
    p.reiniciarMateria("bd2");
    expect(p.progreso("isw")).toEqual({ b: 2 });
  });

  it("guarda y lee escenarios, casos, misiones y logros", () => {
    p.guardarEscenarios({ e1: { mejorRating: "exito", jugadas: 1 } });
    p.guardarCasos({ c1: { mejorRating: "parcial", jugadas: 2 } });
    p.guardarMisiones("asw", { t1: { estrellas: 3 } });
    p.guardarLogros({ l1: "fecha" });
    expect(p.escenarios().e1.mejorRating).toBe("exito");
    expect(p.casos().c1.jugadas).toBe(2);
    expect(p.misiones("asw").t1.estrellas).toBe(3);
    expect(p.logros().l1).toBe("fecha");
  });

  it("degrada en silencio si el storage falla", () => {
    const roto = { getItem: () => { throw new Error("bloqueado"); }, setItem: () => { throw new Error("lleno"); }, removeItem: () => { throw new Error("x"); } };
    const pr = crearPersistencia(roto);
    expect(pr.progreso("bd2")).toEqual({});
    expect(pr.guardarXp(10)).toBe(false);
  });
});
