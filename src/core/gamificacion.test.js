import { describe, it, expect } from "vitest";
import { XP_EVENTOS, xpDeRespuesta, nivelDe, progresoDeNivel, evaluarLogros } from "./gamificacion.js";

describe("xpDeRespuesta", () => {
  it("premia el acierto completo en preguntas nuevas", () => {
    expect(xpDeRespuesta(true, { ok: 1, fail: 0, box: 2 })).toBe(XP_EVENTOS.acierto);
  });

  it("reduce la recompensa en preguntas ya dominadas (anti-farmeo)", () => {
    expect(xpDeRespuesta(true, { ok: 5, fail: 0, box: 4 })).toBe(XP_EVENTOS.aciertoDominada);
  });

  it("no premia el fallo", () => {
    expect(xpDeRespuesta(false, { ok: 0, fail: 1, box: 1 })).toBe(0);
  });

  it("tolera entrada ausente", () => {
    expect(xpDeRespuesta(true, undefined)).toBe(XP_EVENTOS.acierto);
  });
});

describe("niveles", () => {
  it("arranca en nivel 1 sin XP", () => {
    expect(nivelDe(0)).toBe(1);
    expect(progresoDeNivel(0)).toMatchObject({ nivel: 1, pct: 0, faltante: 100 });
  });

  it("sube de nivel con la curva cuadrática", () => {
    expect(nivelDe(99)).toBe(1);
    expect(nivelDe(100)).toBe(2);
    expect(nivelDe(399)).toBe(2);
    expect(nivelDe(400)).toBe(3);
  });

  it("calcula el progreso dentro del nivel", () => {
    expect(progresoDeNivel(150)).toMatchObject({ nivel: 2, enNivel: 50, tramo: 300, pct: 17, faltante: 250 });
  });

  it("degrada con seguridad ante XP inválido", () => {
    expect(nivelDe(-50)).toBe(1);
    expect(progresoDeNivel(-50).pct).toBe(0);
  });
});

describe("evaluarLogros", () => {
  const base = { racha: 0, respuestas: 0, precision: 0, simulacroPerfecto: false, metaCumplida: false };

  it("desbloquea por racha en los umbrales correctos", () => {
    expect(evaluarLogros({}, { ...base, racha: 2 }).map(l => l.id)).toEqual([]);
    expect(evaluarLogros({}, { ...base, racha: 3 }).map(l => l.id)).toEqual(["racha-3"]);
    expect(evaluarLogros({}, { ...base, racha: 8 }).map(l => l.id).sort()).toEqual(["racha-3", "racha-7"]);
  });

  it("desbloquea por volumen y precisión", () => {
    expect(evaluarLogros({}, { ...base, respuestas: 100 }).map(l => l.id)).toEqual(["cien-respuestas"]);
    expect(evaluarLogros({}, { ...base, respuestas: 60, precision: 80 }).map(l => l.id)).toEqual(["preciso-80"]);
    expect(evaluarLogros({}, { ...base, respuestas: 60, precision: 70 })).toEqual([]);
  });

  it("desbloquea simulacro perfecto y meta cumplida", () => {
    expect(evaluarLogros({}, { ...base, simulacroPerfecto: true }).map(l => l.id)).toEqual(["simulacro-perfecto"]);
    expect(evaluarLogros({}, { ...base, metaCumplida: true }).map(l => l.id)).toEqual(["meta-cumplida"]);
  });

  it("no vuelve a desbloquear logros ya obtenidos", () => {
    const actuales = { "racha-3": "2026-09-20T00:00:00.000Z" };
    expect(evaluarLogros(actuales, { ...base, racha: 5 })).toEqual([]);
  });

  it("registra fecha de desbloqueo en cada logro nuevo", () => {
    const ganados = evaluarLogros({}, { ...base, racha: 3 });
    expect(ganados[0].fecha).toBeTruthy();
  });
});
