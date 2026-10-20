import { describe, it, expect, beforeEach } from "vitest";
import { hoyISO } from "../core/index.js";
import { crearPersistencia } from "./persistencia.js";
import { crearAvance } from "./avance.js";

function storageMemoria() {
  const datos = {};
  return {
    getItem: k => (k in datos ? datos[k] : null),
    setItem: (k, v) => { datos[k] = String(v); },
    removeItem: k => { delete datos[k]; },
    _datos: datos
  };
}

describe("avance", () => {
  let storage;
  let persistencia;
  let trackId;
  let avance;

  beforeEach(() => {
    storage = storageMemoria();
    persistencia = crearPersistencia(storage);
    trackId = "bd2";
    avance = crearAvance({ persistencia, getTrackId: () => trackId });
  });

  it("carga el progreso del track activo", () => {
    persistencia.guardarProgreso("bd2", { q1: { ok: 2 } });
    expect(avance.cargar()).toEqual({ q1: { ok: 2 } });
    expect(avance.obtenerP("q1").ok).toBe(2);
  });

  it("registra una respuesta, guarda el progreso y suma actividad", () => {
    avance.cargar();
    const entrada = avance.registrar("q1", true);
    expect(entrada.ok).toBe(1);
    expect(entrada.box).toBe(2);
    expect(persistencia.progreso("bd2").q1.ok).toBe(1);
    expect(avance.actividad()[hoyISO()]).toBe(1);
  });

  it("alterna la marca de repaso sin perder el resto de la entrada", () => {
    avance.registrar("q1", true);
    expect(avance.toggleMarked("q1")).toBe(true);
    expect(avance.obtenerP("q1").marked).toBe(true);
    expect(avance.obtenerP("q1").ok).toBe(1);
    expect(avance.toggleMarked("q1")).toBe(false);
  });

  it("normaliza la meta y recorta el historial a 15 intentos", () => {
    avance.cambiarMeta(0);
    expect(avance.meta()).toBeGreaterThan(0);
    for (let i = 0; i < 20; i++) avance.guardarIntento(1, 2, "practica");
    expect(avance.historial()).toHaveLength(15);
    expect(avance.historial()[0]).toMatchObject({ score: 1, total: 2, modo: "practica" });
  });

  it("borra el historial y reinicia la materia sin tocar las globales", () => {
    avance.registrar("q1", true);
    avance.guardarIntento(1, 1, "practica");
    persistencia.guardarMisiones("bd2", { T1: { estrellas: 3 } });
    persistencia.guardarXp(120);

    avance.borrarHistorial();
    expect(avance.historial()).toEqual([]);

    avance.reiniciar();
    expect(avance.progreso).toEqual({});
    expect(avance.actividad()).toEqual({});
    expect(avance.historial()).toEqual([]);
    expect(persistencia.misiones("bd2")).toEqual({});
    expect(persistencia.xp()).toBe(120);
  });

  it("cambia de track sin arrastrar el progreso anterior", () => {
    avance.registrar("q1", true);
    trackId = "isw";
    expect(avance.cargar()).toEqual({});
    expect(avance.obtenerP("q1").ok).toBe(0);
  });

  it("reemplaza el progreso al importar y lo persiste", () => {
    avance.reemplazar({ q9: { ok: 4, box: 5 } });
    expect(avance.obtenerP("q9").ok).toBe(4);
    expect(persistencia.progreso("bd2").q9.ok).toBe(4);
  });

  it("no falla sin track activo", () => {
    trackId = null;
    expect(avance.cargar()).toEqual({});
    expect(avance.meta()).toBe(20);
    expect(avance.historial()).toEqual([]);
    expect(() => avance.registrar("q1", true)).not.toThrow();
    expect(() => avance.guardarIntento(1, 1)).not.toThrow();
    expect(avance.actividad()).toEqual({});
  });
});
