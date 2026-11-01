import { describe, it, expect } from "vitest";
import { obtenerEntrada } from "./progreso.js";
import {
  MS_DIA,
  EFACTOR_INICIAL,
  EFACTOR_MINIMO,
  normalizarCalidad,
  calcularSM2,
  estaVencida,
  clasificarBanco,
  estimarProximosIntervalos
} from "./repaso.js";

describe("normalizarCalidad", () => {
  it("convierte booleanos a 3 (Bien) y 1 (Otra vez) y acota enteros entre 1 y 4", () => {
    expect(normalizarCalidad(true)).toBe(3);
    expect(normalizarCalidad(false)).toBe(1);
    expect(normalizarCalidad(1)).toBe(1);
    expect(normalizarCalidad(4)).toBe(4);
    expect(normalizarCalidad("2")).toBe(2);
    expect(normalizarCalidad(99)).toBe(4);
    expect(normalizarCalidad(-5)).toBe(1);
    expect(normalizarCalidad("invalido")).toBe(1);
  });
});

describe("calcularSM2", () => {
  it("incrementa intervalos progresivamente con respuestas 'Bien' (3)", () => {
    const t0 = 1000 * MS_DIA;
    let p = obtenerEntrada({}, "q1");

    // Primera repetición correcta -> 1 día, box 2
    p = calcularSM2(p, 3, t0);
    expect(p).toMatchObject({
      ok: 1,
      fail: 0,
      reps: 1,
      intervalo: 1,
      box: 2,
      efactor: EFACTOR_INICIAL,
      proximo: t0 + 1 * MS_DIA,
      lastOk: true
    });

    // Segunda repetición correcta -> 3 días, box 3
    p = calcularSM2(p, 3, t0 + MS_DIA);
    expect(p).toMatchObject({
      ok: 2,
      reps: 2,
      intervalo: 3,
      box: 3,
      proximo: t0 + 4 * MS_DIA
    });

    // Tercera repetición correcta -> round(3 * 2.5) = 8 días, box 4
    p = calcularSM2(p, 3, t0 + 4 * MS_DIA);
    expect(p).toMatchObject({
      ok: 3,
      reps: 3,
      intervalo: 8,
      box: 4
    });

    // Cuarta repetición correcta -> round(8 * 2.5) = 20 días, box 5
    p = calcularSM2(p, 3, t0 + 12 * MS_DIA);
    expect(p).toMatchObject({
      ok: 4,
      reps: 4,
      intervalo: 20,
      box: 5
    });
  });

  it("reinicia repeticiones e intervalo a 1 día ante 'Otra vez' (1) y reduce efactor sin bajar de 1.3", () => {
    const t0 = 100 * MS_DIA;
    let p = calcularSM2(obtenerEntrada({}, "q1"), 4, t0);
    expect(p.intervalo).toBe(2);
    expect(p.efactor).toBe(2.65);

    // Fallo reinicia racha e intervalo pero conserva el conteo histórico de aciertos.
    p = calcularSM2(p, 1, t0 + MS_DIA);
    expect(p).toMatchObject({
      ok: 1,
      fail: 1,
      reps: 0,
      intervalo: 1,
      box: 1,
      lastOk: false,
      efactor: 2.45
    });

    // Varios fallos consecutivos respetan el piso EFACTOR_MINIMO (1.3).
    for (let i = 0; i < 10; i++) {
      p = calcularSM2(p, 1, t0 + (i + 2) * MS_DIA);
    }
    expect(p.efactor).toBe(EFACTOR_MINIMO);
  });

  it("distingue entre 'Difícil' (2) y 'Fácil' (4) sobre una entrada heredada Leitner", () => {
    const legacy = { ok: 3, fail: 0, box: 3, last: 50 * MS_DIA, lastOk: true, marked: true };
    const dificil = calcularSM2(legacy, 2, 53 * MS_DIA);
    const facil = calcularSM2(legacy, 4, 53 * MS_DIA);

    expect(dificil.intervalo).toBeLessThan(facil.intervalo);
    expect(dificil.efactor).toBeLessThan(EFACTOR_INICIAL);
    expect(facil.efactor).toBeGreaterThan(EFACTOR_INICIAL);
    expect(facil.marked).toBe(true);
  });
});

describe("estaVencida y clasificarBanco", () => {
  it("nunca marca preguntas nuevas (!last) como vencidas", () => {
    const ahora = 100 * MS_DIA;
    expect(estaVencida(obtenerEntrada({}, "nueva"), ahora)).toBe(false);
    expect(estaVencida({ ok: 0, fail: 0, box: 1, last: null }, ahora)).toBe(false);
  });

  it("detecta vencimiento por campo `proximo` o por fallback Leitner", () => {
    const ahora = 100 * MS_DIA;
    expect(estaVencida({ ok: 1, fail: 0, box: 2, last: ahora - 2 * MS_DIA, proximo: ahora - MS_DIA }, ahora)).toBe(true);
    expect(estaVencida({ ok: 1, fail: 0, box: 2, last: ahora, proximo: ahora + MS_DIA }, ahora)).toBe(false);
    // Fallback sin campo `proximo` (box 3 = 3 días)
    expect(estaVencida({ ok: 2, fail: 0, box: 3, last: ahora - 4 * MS_DIA, lastOk: true }, ahora)).toBe(true);
  });

  it("clasifica el banco en nuevas, vencidas, aprendiendo y consolidadas y ordena vencidas por urgencia", () => {
    const ahora = 200 * MS_DIA;
    const banco = [
      { id: "nueva-1" },
      { id: "vencida-reciente" },
      { id: "vencida-antigua" },
      { id: "aprendiendo-1" },
      { id: "consolidada-1" }
    ];
    const mapa = {
      "vencida-reciente": {
        ok: 1, fail: 1, box: 2, last: ahora - 3 * MS_DIA, lastOk: true,
        reps: 1, intervalo: 1, efactor: 2.5, proximo: ahora - 1 * MS_DIA
      },
      "vencida-antigua": {
        ok: 1, fail: 2, box: 1, last: ahora - 10 * MS_DIA, lastOk: false,
        reps: 0, intervalo: 1, efactor: 1.8, proximo: ahora - 8 * MS_DIA
      },
      "aprendiendo-1": {
        ok: 1, fail: 0, box: 2, last: ahora, lastOk: true,
        reps: 1, intervalo: 2, efactor: 2.5, proximo: ahora + 2 * MS_DIA
      },
      "consolidada-1": {
        ok: 5, fail: 0, box: 5, last: ahora, lastOk: true,
        reps: 4, intervalo: 14, efactor: 2.6, proximo: ahora + 14 * MS_DIA
      }
    };

    const res = clasificarBanco(banco, id => obtenerEntrada(mapa, id), ahora);
    expect(res.nuevas.map(q => q.id)).toEqual(["nueva-1"]);
    expect(res.vencidas.map(q => q.id)).toEqual(["vencida-antigua", "vencida-reciente"]);
    expect(res.aprendiendo.map(q => q.id)).toEqual(["aprendiendo-1"]);
    expect(res.consolidadas.map(q => q.id)).toEqual(["consolidada-1"]);
    expect(res.proximoRepasoMs).toBe(ahora + 2 * MS_DIA);
  });
});

describe("estimarProximosIntervalos", () => {
  it("devuelve etiquetas legibles para los 4 botones de flashcards", () => {
    const nueva = obtenerEntrada({}, "q1");
    expect(estimarProximosIntervalos(nueva)).toEqual({
      otraVez: "1d",
      dificil: "1d",
      bien: "1d",
      facil: "2d"
    });

    const segunda = calcularSM2(nueva, 3, 1000);
    expect(estimarProximosIntervalos(segunda)).toEqual({
      otraVez: "1d",
      dificil: "1d",
      bien: "3d",
      facil: "5d"
    });
  });
});
