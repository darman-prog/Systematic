import { describe, it, expect } from "vitest";
import { claves, migrarClavesLegacy, leerJSON, escribirJSON } from "./almacenamiento.js";

function memoriaStorage(inicial = {}) {
  const datos = new Map(Object.entries(inicial));
  return {
    getItem: k => (datos.has(k) ? datos.get(k) : null),
    setItem: (k, v) => datos.set(k, String(v)),
    removeItem: k => datos.delete(k)
  };
}

describe("claves", () => {
  it("genera claves namespaced por materia", () => {
    expect(claves("demo")).toEqual({
      progreso: "sys.progreso.demo",
      historial: "sys.historial.demo",
      actividad: "sys.actividad.demo",
      meta: "sys.meta.demo"
    });
  });
});

describe("migrarClavesLegacy", () => {
  it("copia quizBD2.* al namespace sys.* de la materia indicada y marca el flag", () => {
    const s = memoriaStorage({
      "quizBD2.progreso": '{"P1-001":{"ok":2}}',
      "quizBD2.historial": '[{"score":8}]',
      "quizBD2.actividad": '{"2026-09-01":5}',
      "quizBD2.meta": "30"
    });
    expect(migrarClavesLegacy(s, "demo")).toBe(true);
    expect(s.getItem("sys.progreso.demo")).toBe('{"P1-001":{"ok":2}}');
    expect(s.getItem("sys.historial.demo")).toBe('[{"score":8}]');
    expect(s.getItem("sys.actividad.demo")).toBe('{"2026-09-01":5}');
    expect(s.getItem("sys.meta.demo")).toBe("30");
    expect(s.getItem("sys.migracion.v1")).toBeTruthy();
  });

  it("no sobreescribe claves destino existentes", () => {
    const s = memoriaStorage({
      "quizBD2.progreso": '{"viejo":true}',
      "sys.progreso.demo": '{"nuevo":true}'
    });
    migrarClavesLegacy(s, "demo");
    expect(s.getItem("sys.progreso.demo")).toBe('{"nuevo":true}');
  });

  it("es idempotente (segunda corrida no re-migra)", () => {
    const s = memoriaStorage({ "quizBD2.progreso": '{"a":1}' });
    migrarClavesLegacy(s, "demo");
    s.setItem("quizBD2.progreso", '{"a":2}');
    expect(migrarClavesLegacy(s, "demo")).toBe(false);
    expect(s.getItem("sys.progreso.demo")).toBe('{"a":1}');
  });

  it("no falla si el storage lanza errores", () => {
    const roto = {
      getItem: () => { throw new Error("bloqueado"); },
      setItem: () => {},
      removeItem: () => {}
    };
    expect(migrarClavesLegacy(roto, "demo")).toBe(false);
  });
});

describe("leerJSON / escribirJSON", () => {
  it("lee con default y tolera JSON inválido", () => {
    const s = memoriaStorage({ a: '{"x":1}', b: "no-json" });
    expect(leerJSON(s, "a", {})).toEqual({ x: 1 });
    expect(leerJSON(s, "b", { y: 2 })).toEqual({ y: 2 });
    expect(leerJSON(s, "c", [])).toEqual([]);
  });

  it("escribe y devuelve true", () => {
    const s = memoriaStorage();
    expect(escribirJSON(s, "k", { a: 1 })).toBe(true);
    expect(s.getItem("k")).toBe('{"a":1}');
  });
});
