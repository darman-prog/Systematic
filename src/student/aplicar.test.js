// Aplicación del snapshot de nube al estado local (ADR 008): se registra cada escritura en una
// persistencia fake (sin localStorage) y se verifica el orden/forma de lo aplicado.
import { describe, it, expect } from "vitest";
import { aplicarSnapshot } from "./aplicar.js";

function persistenciaFake() {
  const llamadas = [];
  const registrar = nombre => (...args) => llamadas.push([nombre, ...args]);
  return {
    llamadas,
    guardarNombre: registrar("guardarNombre"),
    guardarXp: registrar("guardarXp"),
    guardarXpEventos: registrar("guardarXpEventos"),
    guardarLogros: registrar("guardarLogros"),
    guardarEscenarios: registrar("guardarEscenarios"),
    guardarCasos: registrar("guardarCasos"),
    guardarOnboardingHecho: registrar("guardarOnboardingHecho"),
    guardarProgreso: registrar("guardarProgreso"),
    guardarHistorial: registrar("guardarHistorial"),
    guardarActividad: registrar("guardarActividad"),
    guardarMeta: registrar("guardarMeta"),
    guardarMisiones: registrar("guardarMisiones"),
    guardarCompetencia: registrar("guardarCompetencia")
  };
}

function snapshot({ onboarding = true } = {}) {
  return {
    app: "systematic",
    formato: "nube-1",
    exportado: "2026-01-02T03:04:05.000Z",
    nombre: "Ana",
    global: {
      xp: 120,
      xpEventos: { "meta-2026-01-01": 5 },
      logros: { racha7: true },
      escenarios: { e1: { visto: true } },
      casos: { c1: { ok: true } },
      onboarding
    },
    materias: {
      bd2: {
        progreso: { "bd2-001": { ok: 1, fail: 0, box: 2, last: null, lastOk: true, marked: false } },
        historial: [{ date: 1735776000000, score: 8, total: 10, modo: "practica" }],
        actividad: { "2026-01-01": 3 },
        meta: 20,
        misiones: { m1: { pct: 50, estrellas: 1 } }
      },
      isw: {
        progreso: {},
        historial: [],
        actividad: {},
        meta: 15,
        misiones: {}
      }
    },
    lenguajes: {
      "lenguaje-ts": { competencia: { e1: { aprobado: true, version: 1 } } }
    }
  };
}

describe("student/aplicar", () => {
  it("pisa las claves globales con los valores del respaldo", () => {
    const persistencia = persistenciaFake();
    aplicarSnapshot(snapshot(), persistencia);
    const escritas = Object.fromEntries(persistencia.llamadas.map(([nombre, valor]) => [nombre, valor]));
    expect(escritas.guardarNombre).toBe("Ana");
    expect(escritas.guardarXp).toBe(120);
    expect(escritas.guardarXpEventos).toEqual({ "meta-2026-01-01": 5 });
    expect(escritas.guardarLogros).toEqual({ racha7: true });
    expect(escritas.guardarEscenarios).toEqual({ e1: { visto: true } });
    expect(escritas.guardarCasos).toEqual({ c1: { ok: true } });
  });

  it("llama guardarOnboardingHecho solo cuando el snapshot trae onboarding true", () => {
    const conFlag = persistenciaFake();
    aplicarSnapshot(snapshot({ onboarding: true }), conFlag);
    expect(conFlag.llamadas.some(([nombre]) => nombre === "guardarOnboardingHecho")).toBe(true);

    const sinFlag = persistenciaFake();
    aplicarSnapshot(snapshot({ onboarding: false }), sinFlag);
    expect(sinFlag.llamadas.some(([nombre]) => nombre === "guardarOnboardingHecho")).toBe(false);
  });

  it("pisa progreso, historial, actividad, meta y misiones de cada materia", () => {
    const persistencia = persistenciaFake();
    aplicarSnapshot(snapshot(), persistencia);
    const deMateria = persistencia.llamadas.filter(([, id]) => id === "bd2" || id === "isw");
    expect(deMateria).toHaveLength(10); // 5 bloques × 2 materias
    expect(persistencia.llamadas).toContainEqual(["guardarMeta", "isw", 15]);
    expect(persistencia.llamadas).toContainEqual([
      "guardarHistorial", "bd2", [{ date: 1735776000000, score: 8, total: 10, modo: "practica" }]
    ]);
  });

  it("pisa la competencia de cada lenguaje del snapshot", () => {
    const persistencia = persistenciaFake();
    aplicarSnapshot(snapshot(), persistencia);
    expect(persistencia.llamadas).toContainEqual([
      "guardarCompetencia", "lenguaje-ts", { e1: { aprobado: true, version: 1 } }
    ]);
  });

  it("devuelve el resumen con los conteos aplicados", () => {
    const resumen = aplicarSnapshot(snapshot(), persistenciaFake());
    expect(resumen).toEqual({ materias: 2, lenguajes: 1 });
  });
});
