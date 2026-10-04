import { describe, it, expect } from "vitest";
import {
  claves, migrarClavesLegacy, leerJSON, escribirJSON, obtenerEntrada, aplicarRespuesta,
  esDebil, vencida, calcularRacha, metaDiaria, fechaISO
} from "./progreso.js";

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

describe("aplicarRespuesta (Leitner)", () => {
  it("sube box hasta 5 con aciertos y acumula contadores", () => {
    let p = obtenerEntrada({}, "x");
    p = aplicarRespuesta(p, true, 100);
    expect(p).toMatchObject({ ok: 1, fail: 0, box: 2, lastOk: true, last: 100 });
    for (let i = 0; i < 10; i++) p = aplicarRespuesta(p, true, 100);
    expect(p.box).toBe(5);
    expect(p.ok).toBe(11);
  });

  it("reinicia box a 1 al fallar", () => {
    let p = aplicarRespuesta(obtenerEntrada({}, "x"), true, 1);
    p = aplicarRespuesta(p, false, 2);
    expect(p).toMatchObject({ fail: 1, box: 1, lastOk: false, last: 2 });
  });
});

describe("esDebil / vencida", () => {
  it("esDebil solo con fallos sin recuperación", () => {
    expect(esDebil(obtenerEntrada({}, "x"))).toBe(false);
    expect(esDebil({ ok: 1, fail: 1, box: 1, lastOk: false })).toBe(true);
    expect(esDebil({ ok: 3, fail: 1, box: 3, lastOk: true })).toBe(false);
  });

  it("vencida respeta los intervalos por box", () => {
    const ahora = 10 * 86400000;
    expect(vencida({ box: 1, last: null }, ahora)).toBe(true);
    expect(vencida({ box: 3, last: ahora - 2 * 86400000 }, ahora)).toBe(false);
    expect(vencida({ box: 3, last: ahora - 4 * 86400000 }, ahora)).toBe(true);
  });
});

describe("calcularRacha", () => {
  it("cuenta días consecutivos terminando hoy", () => {
    const hoy = new Date(2026, 8, 19);
    const actividad = { "2026-09-19": 1, "2026-09-18": 2, "2026-09-17": 1, "2026-09-15": 1 };
    expect(calcularRacha(actividad, hoy)).toBe(3);
  });

  it("si hoy no hay actividad, arranca desde ayer", () => {
    const hoy = new Date(2026, 8, 19);
    expect(calcularRacha({ "2026-09-18": 1 }, hoy)).toBe(1);
    expect(calcularRacha({}, hoy)).toBe(0);
  });
});

describe("metaDiaria", () => {
  it("normaliza valores", () => {
    expect(metaDiaria(30)).toBe(30);
    expect(metaDiaria("25")).toBe(25);
    expect(metaDiaria(0)).toBe(20);
    expect(metaDiaria("abc")).toBe(20);
    expect(metaDiaria(undefined)).toBe(20);
  });
});

describe("fechaISO", () => {
  it("formatea con ceros a la izquierda", () => {
    expect(fechaISO(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});
