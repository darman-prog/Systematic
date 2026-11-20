import { describe, it, expect } from "vitest";
import { crearResumen } from "./resumen.js";

const MATERIAS = [
  { id: "bd2", tipo: "materia", nombre: "Base de Datos 2", conteo: { preguntas: 10 } },
  { id: "isw", tipo: "materia", nombre: "Ingeniería de Software", conteo: { preguntas: 20 } }
];
const LENGUAJES = [
  { id: "lenguaje-ts", tipo: "lenguaje", nombre: "TypeScript", conteo: { preguntas: 30 } }
];
const HOY = "2026-11-19";

function persistencia({ progreso = {}, actividad = {}, historial = {} } = {}) {
  return {
    progreso: id => progreso[id] || {},
    actividad: id => actividad[id] || {},
    historial: id => historial[id] || []
  };
}

function resumenDe(datos, { racha = () => 0, hoy = () => HOY } = {}) {
  return crearResumen({
    persistencia: persistencia(datos),
    materias: MATERIAS,
    lenguajes: LENGUAJES,
    racha,
    hoy
  }).actual();
}

const aprobada = () => ({ ok: 1, fail: 0, lastOk: true });
const fallada = () => ({ ok: 0, fail: 1, lastOk: false, box: 1 });

describe("student/resumen", () => {
  it("arma continuidad, materias, precisión, tendencia, racha y repaso", () => {
    const resumen = resumenDe({
      progreso: {
        bd2: { a: aprobada(), b: aprobada(), c: fallada() },
        isw: { d: aprobada(), e: fallada() },
        "lenguaje-ts": { f: aprobada() }
      },
      actividad: { bd2: { [HOY]: 1 } },
      historial: {
        bd2: [{ date: new Date(2026, 10, 18, 12).getTime(), score: 8, total: 10 }],
        isw: [{ date: new Date(2026, 10, 10, 12).getTime(), score: 6, total: 10 }]
      }
    }, { racha: () => 4 });

    expect(resumen.continuar).toMatchObject({
      tipo: "materia",
      id: "bd2",
      nombre: "Base de Datos 2",
      dias: 0,
      pregunta: 4,
      preguntas: { respondidas: 3, total: 10, pct: 30 }
    });
    expect(resumen.continuar.precision).toEqual({ pct: 67, intentos: 3 });
    expect(resumen.materias).toEqual({ respondidas: 5, total: 30, pct: 17 });
    // 4 aciertos y 2 fallos entre los tres tracks: 67% sobre 6 intentos.
    expect(resumen.precision).toEqual({ pct: 67, intentos: 6 });
    expect(resumen.tendencia).toEqual({ delta: 20, sube: true });
    expect(resumen.racha).toBe(4);
    expect(resumen.repaso).toMatchObject({ total: 2, tipo: "materia", id: "bd2" });
  });

  it("topa la cobertura al total y deja la pregunta final", () => {
    const progreso = {};
    for (let i = 1; i <= 12; i += 1) progreso["q" + i] = aprobada();

    const resumen = resumenDe({
      progreso: { bd2: progreso },
      actividad: { bd2: { [HOY]: 1 } }
    });

    expect(resumen.continuar.preguntas).toEqual({ respondidas: 10, total: 10, pct: 100 });
    expect(resumen.continuar.pregunta).toBe(10);
  });

  it("sin actividad no inventa continuidad, pero conserva cobertura y precisión", () => {
    const resumen = resumenDe({
      progreso: { bd2: { q1: aprobada() } }
    });

    expect(resumen.continuar).toBeNull();
    expect(resumen.materias).toEqual({ respondidas: 1, total: 30, pct: 3 });
    expect(resumen.precision).toEqual({ pct: 100, intentos: 1 });
    expect(resumen.tendencia).toBeNull();
    expect(resumen.racha).toBe(0);
    expect(resumen.repaso).toBeNull();
  });

  it("elige el track con la actividad más reciente y su siguiente pregunta", () => {
    const resumen = resumenDe({
      progreso: {
        bd2: { q1: aprobada() },
        isw: { a: aprobada(), b: fallada() }
      },
      actividad: { bd2: { "2026-11-18": 2 }, isw: { [HOY]: 1 } }
    });

    expect(resumen.continuar).toMatchObject({ id: "isw", dias: 0, pregunta: 3 });
    expect(resumen.continuar.preguntas).toEqual({ respondidas: 2, total: 20, pct: 10 });
  });

  it("en empate gana el orden estable del registro (materias antes que lenguajes)", () => {
    const resumen = resumenDe({
      progreso: { isw: { a: aprobada() }, "lenguaje-ts": { b: aprobada() } },
      actividad: {
        isw: { [HOY]: 1 },
        "lenguaje-ts": { [HOY]: 3 }
      }
    });

    expect(resumen.continuar.id).toBe("isw");
    expect(resumen.continuar.preguntas.total).toBe(20);
  });

  it("cae al historial cuando no hay actividad y calcula los días", () => {
    const resumen = resumenDe({
      progreso: { bd2: { q1: aprobada() } },
      historial: { bd2: [{ date: new Date(2026, 10, 18, 12).getTime(), score: 1, total: 1 }] }
    });

    expect(resumen.continuar).toMatchObject({ id: "bd2", dias: 1 });
  });

  it("marca tendencia negativa y la omite si falta la semana previa", () => {
    const negativa = resumenDe({
      historial: {
        bd2: [
          { date: new Date(2026, 10, 18, 12).getTime(), score: 5, total: 10 },
          { date: new Date(2026, 10, 10, 12).getTime(), score: 8, total: 10 }
        ]
      }
    });
    expect(negativa.tendencia).toEqual({ delta: -30, sube: false });

    const sinPrevia = resumenDe({
      historial: { bd2: [{ date: new Date(2026, 10, 18, 12).getTime(), score: 5, total: 10 }] }
    });
    expect(sinPrevia.tendencia).toBeNull();
  });

  it("normaliza un lenguaje sin tipo y no lo suma a materias", () => {
    const resumen = crearResumen({
      persistencia: persistencia({
        progreso: { "lenguaje-ts": { q1: aprobada() } },
        actividad: { "lenguaje-ts": { [HOY]: 1 } }
      }),
      materias: [],
      lenguajes: [{ id: "lenguaje-ts", nombre: "TypeScript", conteo: { preguntas: 30 } }],
      hoy: () => HOY
    }).actual();

    expect(resumen.continuar.tipo).toBe("lenguaje");
    expect(resumen.materias.total).toBe(0);
    expect(resumen.precision).toEqual({ pct: 100, intentos: 1 });
  });

  it("ignora progreso y fechas con forma inválida", () => {
    const resumen = resumenDe({
      progreso: {
        bd2: [],
        isw: { q1: null, q2: { ok: "2", fail: "x" }, q3: { ok: 0, fail: 0 } }
      },
      actividad: { bd2: { "no-fecha": 1 }, isw: { [HOY]: 2 } },
      historial: { "lenguaje-ts": [{ date: "no" }, { date: null }] }
    });

    expect(resumen.continuar.id).toBe("isw");
    expect(resumen.continuar.preguntas.respondidas).toBe(1);
    expect(resumen.precision).toEqual({ pct: 100, intentos: 2 });
  });
});
