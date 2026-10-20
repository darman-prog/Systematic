import { describe, it, expect } from "vitest";
import { hoyISO, fechaISO } from "./progreso.js";
import { calcularStats } from "./estadisticas.js";

const q = (id, tema, dificultad, parcial = "P1") => ({ id, tema, dificultad, parcial });

function base(over = {}) {
  return {
    materia: { id: "bd2", nombre: "BD2" },
    banco: [],
    obtenerP: () => ({ ok: 0, fail: 0, box: 1, last: null, lastOk: null, marked: false }),
    historial: [],
    actividad: {},
    meta: 20,
    colorDeTema: (materia, tema) => "color-" + tema,
    ...over
  };
}

describe("estadisticas", () => {
  it("devuelve ceros y heatmap vacio sin datos", () => {
    const s = calcularStats(base());
    expect(s.total).toBe(0);
    expect(s.ok).toBe(0);
    expect(s.precision).toBe(0);
    expect(s.respondidas).toBe(0);
    expect(s.hist).toEqual([]);
    expect(s.mejor).toBeNull();
    expect(s.promedio).toBeNull();
    expect(s.tendencia).toMatchObject({ texto: "sin datos", fiable: false });
    expect(s.meta).toBe(20);
    expect(s.hoy).toBe(0);
    expect(s.racha).toBe(0);
    expect(s.pctMeta).toBe(0);
    expect(s.dias).toHaveLength(7);
    expect(s.temasConDatos).toEqual([]);
    expect(s.difs.map(d => d.d)).toEqual(["facil", "media", "dificil"]);
    expect(s.peores).toEqual([]);
  });

  it("agrega progreso, temas, dificultades, racha y vencidas", () => {
    const ahora = Date.now();
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    const s = calcularStats(base({
      banco: [
        q("q1", "T1", "facil"),
        q("q2", "T1", "media"),
        q("q3", "T2", "dificil", "P2")
      ],
      obtenerP: id => ({
        q1: { ok: 3, fail: 0, box: 3, last: ahora, lastOk: true, marked: false },
        q2: { ok: 1, fail: 2, box: 1, last: ahora, lastOk: false, marked: false },
        q3: { ok: 0, fail: 1, box: 1, last: 0, lastOk: false, marked: false }
      })[id],
      historial: [
        { date: ahora, score: 10, total: 10, modo: "practica" },
        { date: ahora - 86400000, score: 5, total: 10, modo: "practica" }
      ],
      actividad: { [hoyISO()]: 10, [fechaISO(ayer)]: 5 }
    }));

    expect(s.total).toBe(3);
    expect(s.ok).toBe(4);
    expect(s.fail).toBe(3);
    expect(s.totalResp).toBe(7);
    expect(s.precision).toBe(57);
    expect(s.respondidas).toBe(3);
    expect(s.debiles).toBe(2);
    expect(s.vencidas).toBe(2);
    expect(s.parciales).toBe(2);
    expect(s.totalTemas).toBe(2);
    expect(s.hoy).toBe(10);
    expect(s.racha).toBe(2);
    expect(s.pctMeta).toBe(50);
    expect(s.cumplida).toBe(false);
    expect(s.mejor).toBe(100);
    expect(s.promedio).toBe(75);
    expect(s.temasConDatos.map(t => t.nombre)).toEqual(["T1", "T2"]);
    expect(s.temaFuerte).toMatchObject({ nombre: "T1", pct: 67 });
    expect(s.temaDebil).toMatchObject({ nombre: "T2", pct: 0 });
    expect(s.temasConDatos[0].color).toBe("color-T1");
    expect(s.difs.find(d => d.d === "facil")).toMatchObject({ n: 3, pct: 100 });
    expect(s.difs.find(d => d.d === "media")).toMatchObject({ n: 3, pct: 33 });
    expect(s.difs.find(d => d.d === "dificil")).toMatchObject({ n: 1, pct: 0 });
    expect(s.peores).toHaveLength(2);
    expect(s.peores[0].q.id).toBe("q3");
    expect(s.dias[s.dias.length - 1]).toMatchObject({ n: 10, esHoy: true, intensidad: 2 });
  });

  it("calcula tendencia subiendo, bajando y estable", () => {
    const hist = scores => scores.map((score, i) => ({
      date: Date.now() - i * 86400000, score, total: 10, modo: "practica"
    }));
    const arriba = calcularStats(base({ historial: hist([9, 9, 9, 9, 9, 2, 2, 2, 2, 2]) }));
    expect(arriba.tendencia).toMatchObject({ dir: "up", fiable: true });
    const abajo = calcularStats(base({ historial: hist([2, 2, 2, 2, 2, 9, 9, 9, 9, 9]) }));
    expect(abajo.tendencia).toMatchObject({ dir: "down", fiable: true });
    const estable = calcularStats(base({ historial: hist([5, 5, 5, 5, 5, 5, 5, 5, 5, 5]) }));
    expect(estable.tendencia).toMatchObject({ dir: "flat", fiable: true });
    const pocas = calcularStats(base({ historial: hist([5, 5]) }));
    expect(pocas.tendencia).toMatchObject({ texto: "empezando", fiable: false });
  });

  it("normaliza la meta y usa color nulo por defecto", () => {
    const s = calcularStats(base({
      banco: [q("q1", "T1", "facil")],
      obtenerP: () => ({ ok: 1, fail: 0, box: 2, last: Date.now(), lastOk: true, marked: false }),
      meta: 0,
      colorDeTema: undefined
    }));
    expect(s.meta).toBe(20);
    expect(s.temasConDatos[0].color).toBeNull();
  });
});
