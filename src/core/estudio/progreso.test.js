import { describe, it, expect } from "vitest";
import {
  obtenerEntrada, aplicarRespuesta,
  esDebil, vencida, calcularRacha, metaDiaria, fechaISO
} from "./progreso.js";

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
