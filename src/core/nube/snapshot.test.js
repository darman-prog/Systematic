// Dominio del snapshot de nube: construcción completa del estado y validación defensiva del
// respaldo que llega por red (nunca se aplica sin pasar validarSnapshot).
import { describe, it, expect } from "vitest";
import { construirSnapshot, validarSnapshot, fechaSnapshot, FORMATO_NUBE } from "./snapshot.js";

const MATERIAS = [{ id: "bd2" }, { id: "isw" }];
const LENGUAJES = [{ id: "lenguaje-ts" }];

function persistenciaFake() {
  return {
    nombre: () => "Ana",
    xp: () => 120,
    xpEventos: () => ({ "meta-2026-01-01": 5 }),
    logros: () => ({ racha7: true }),
    escenarios: () => ({ e1: { visto: true } }),
    casos: () => ({ c1: { ok: true } }),
    onboardingHecho: () => true,
    progreso: id => ({ [id + "-001"]: { ok: 1, fail: 0, box: 2, last: null, lastOk: true, marked: false } }),
    historial: () => [{ fecha: "2026-01-01", pct: 80 }],
    actividad: () => ({ "2026-01-01": 3 }),
    meta: () => 20,
    misiones: () => ({ m1: { pct: 50, estrellas: 1 } }),
    competencia: () => ({ e1: { aprobado: true, version: 1 } })
  };
}

function snapshotValido() {
  return construirSnapshot({
    persistencia: persistenciaFake(),
    materias: MATERIAS,
    lenguajes: LENGUAJES,
    ahora: new Date("2026-01-02T03:04:05.000Z")
  });
}

describe("core/nube/snapshot", () => {
  it("construye el estado de todas las materias, lenguajes y globales", () => {
    const snap = snapshotValido();
    expect(snap.app).toBe("systematic");
    expect(snap.formato).toBe(FORMATO_NUBE);
    expect(snap.exportado).toBe("2026-01-02T03:04:05.000Z");
    expect(snap.nombre).toBe("Ana");
    expect(snap.global).toEqual({
      xp: 120,
      xpEventos: { "meta-2026-01-01": 5 },
      logros: { racha7: true },
      escenarios: { e1: { visto: true } },
      casos: { c1: { ok: true } },
      onboarding: true
    });
    expect(Object.keys(snap.materias)).toEqual(["bd2", "isw"]);
    expect(snap.materias.bd2.meta).toBe(20);
    expect(snap.materias.isw.misiones.m1.estrellas).toBe(1);
    expect(snap.lenguajes["lenguaje-ts"].competencia.e1.aprobado).toBe(true);
  });

  it("validarSnapshot acepta el snapshot recién construido", () => {
    const resultado = validarSnapshot(snapshotValido());
    expect(resultado.ok).toBe(true);
    expect(resultado.datos.formato).toBe(FORMATO_NUBE);
  });

  it("rechaza basura, formatos ajenos y globales incompletos", () => {
    expect(validarSnapshot(null).error).toBe("formato");
    expect(validarSnapshot({ app: "systematic", formato: "otro" }).error).toBe("formato");
    const sinGlobal = snapshotValido();
    delete sinGlobal.global;
    expect(validarSnapshot(sinGlobal).error).toBe("global");
    const nombreMalo = snapshotValido();
    nombreMalo.nombre = 7;
    expect(validarSnapshot(nombreMalo).error).toBe("nombre");
  });

  it("rechaza materias y competencias con forma inválida", () => {
    const metaMala = snapshotValido();
    metaMala.materias.bd2.meta = 0;
    expect(validarSnapshot(metaMala).error).toBe("materias");
    const historialMalo = snapshotValido();
    historialMalo.materias.bd2.historial = "nada";
    expect(validarSnapshot(historialMalo).error).toBe("materias");
    const competenciaMala = snapshotValido();
    competenciaMala.lenguajes["lenguaje-ts"].competencia = { e1: { aprobado: "si", version: 1 } };
    expect(validarSnapshot(competenciaMala).error).toBe("lenguajes");
  });

  it("fechaSnapshot devuelve la fecha válida y null si no lo es", () => {
    expect(fechaSnapshot({ exportado: "2026-01-02T03:04:05.000Z" }).toISOString())
      .toBe("2026-01-02T03:04:05.000Z");
    expect(fechaSnapshot({ exportado: "no-es-fecha" })).toBeNull();
    expect(fechaSnapshot(null)).toBeNull();
  });
});
