import { describe, it, expect, vi } from "vitest";
import {
  construirExportacion, nombreArchivo, parsearImportacion, aplicarMateria, aplicarCompetencia
} from "./exportacion.js";

function trackMateria() {
  return { materia: { id: "bd2", nombre: "Base de Datos 2" }, lenguaje: null };
}

function trackLenguaje() {
  return {
    materia: { id: "lenguaje-ts", nombre: "TypeScript" },
    lenguaje: { id: "lenguaje-ts", nombre: "TypeScript" }
  };
}

function avanceFake(over = {}) {
  return {
    progreso: { q1: { ok: 2 } },
    historial: () => [{ date: 1, score: 1, total: 2, modo: "practica" }],
    actividad: () => ({ "2026-10-20": 3 }),
    meta: () => 20,
    reemplazar: vi.fn(),
    ...over
  };
}

function persistenciaFake(over = {}) {
  return {
    nombre: () => "Ana",
    competencia: () => ({ etapa1: { aprobado: true, version: 1 } }),
    guardarHistorial: vi.fn(),
    guardarActividad: vi.fn(),
    guardarMeta: vi.fn(),
    guardarNombre: vi.fn(),
    guardarCompetencia: vi.fn(),
    ...over
  };
}

describe("exportacion", () => {
  it("construye el export de una materia con avance e historial", () => {
    const datos = construirExportacion({
      track: trackMateria(),
      avance: avanceFake(),
      persistencia: persistenciaFake(),
      ahora: () => new Date("2026-10-20T10:00:00Z")
    });
    expect(datos).toMatchObject({
      app: "systematic",
      version: 2,
      nombre: "Ana",
      materia: "bd2",
      progreso: { q1: { ok: 2 } },
      meta: 20
    });
    expect(datos.historial).toHaveLength(1);
    expect(datos.competencia).toBeUndefined();
  });

  it("construye el export de un lenguaje con su competencia", () => {
    const datos = construirExportacion({
      track: trackLenguaje(),
      avance: avanceFake(),
      persistencia: persistenciaFake()
    });
    expect(datos.lenguaje).toBe("lenguaje-ts");
    expect(datos.competencia.etapa1.aprobado).toBe(true);
    expect(datos.progreso).toBeUndefined();
  });

  it("no exporta sin track activo", () => {
    expect(construirExportacion({
      track: { materia: null, lenguaje: null },
      avance: avanceFake(),
      persistencia: persistenciaFake()
    })).toBeNull();
  });

  it("genera un nombre de archivo estable por track y fecha", () => {
    expect(nombreArchivo(trackMateria(), "2026-10-20")).toBe("systematic-bd2-2026-10-20.json");
    expect(nombreArchivo(trackLenguaje(), "2026-10-20")).toBe("systematic-lenguaje-ts-2026-10-20.json");
  });

  it("parsea un export v2 de materia", () => {
    const r = parsearImportacion(JSON.stringify({ app: "systematic", progreso: { q1: {} } }));
    expect(r.tipo).toBe("materia");
    expect(r.legacy).toBe(false);
  });

  it("parsea el legacy de Quiz BD2 como materia", () => {
    const r = parsearImportacion(JSON.stringify({ app: "quiz-bd2", progreso: { q1: {} } }));
    expect(r.tipo).toBe("materia");
    expect(r.legacy).toBe(true);
  });

  it("parsea y valida un export de competencia", () => {
    const r = parsearImportacion(JSON.stringify({
      app: "systematic",
      competencia: { etapa1: { aprobado: true, version: 1 } }
    }));
    expect(r.tipo).toBe("competencia");
  });

  it("rechaza JSON inválido, app desconocida, arrays y competencia rota", () => {
    expect(() => parsearImportacion("{")).toThrow("formato");
    expect(() => parsearImportacion("[]")).toThrow("formato");
    expect(() => parsearImportacion(JSON.stringify({ app: "otra", progreso: {} }))).toThrow("formato");
    expect(() => parsearImportacion(JSON.stringify({
      app: "systematic",
      competencia: { etapa1: { aprobado: "sí", version: 1 } }
    }))).toThrow("formato");
  });

  it("aplica una materia en el avance y en la persistencia", () => {
    const avance = avanceFake();
    const persistencia = persistenciaFake();
    aplicarMateria({
      datos: { progreso: { q2: {} }, historial: [1], actividad: { a: 1 }, meta: 30, nombre: "Luz" },
      track: trackMateria(),
      persistencia,
      avance
    });
    expect(avance.reemplazar).toHaveBeenCalledWith({ q2: {} });
    expect(persistencia.guardarHistorial).toHaveBeenCalledWith("bd2", [1]);
    expect(persistencia.guardarActividad).toHaveBeenCalledWith("bd2", { a: 1 });
    expect(persistencia.guardarMeta).toHaveBeenCalledWith("bd2", 30);
    expect(persistencia.guardarNombre).toHaveBeenCalledWith("Luz");
  });

  it("aplica una competencia al track activo", () => {
    const track = trackLenguaje();
    track.setCompetencia = vi.fn(function (nuevo) { this.competencia = nuevo; });
    const persistencia = persistenciaFake();
    const datos = { competencia: { etapa1: { aprobado: true, version: 1 } } };
    aplicarCompetencia({ datos, track, persistencia });
    expect(track.competencia).toEqual(datos.competencia);
    expect(persistencia.guardarCompetencia).toHaveBeenCalledWith("lenguaje-ts", datos.competencia);
  });
});
