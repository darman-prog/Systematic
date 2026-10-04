// Modelo puro de sesión: defaults por modo, formateo de tiempo, resultado y XP de respuesta.
// El reloj entra por parámetro, así no se depende de Date.now() real.
import { describe, it, expect } from "vitest";
import {
  crearSesion, formatearTiempo, resultadoDeSesion, aplicarRespuestaSesion,
  siguienteIndice, debeFinalizar
} from "./sesion.js";

describe("crearSesion", () => {
  it("arma el estado base en práctica", () => {
    const s = crearSesion([{ id: "a" }], "practica", 1000);
    expect(s).toMatchObject({ idx: 0, answers: {}, modo: "practica", inicio: 1000, finalizada: false, pausado: false });
    expect(s.tPorPregunta).toBeUndefined();
    expect(s.vidas).toBeUndefined();
  });

  it("contrarreloj arranca con 30 s por pregunta", () => {
    const s = crearSesion([], "contrarreloj", 0);
    expect(s.tPorPregunta).toBe(30);
    expect(s.tRestante).toBe(30);
  });

  it("supervivencia arranca con 3 vidas y combo en cero", () => {
    const s = crearSesion([], "supervivencia", 0);
    expect(s.vidas).toBe(3);
    expect(s.combo).toBe(0);
    expect(s.mejorCombo).toBe(0);
  });
});

describe("formatearTiempo", () => {
  it("da m:ss con segundos rellenados a dos dígitos", () => {
    expect(formatearTiempo(0)).toBe("0:00");
    expect(formatearTiempo(65)).toBe("1:05");
    expect(formatearTiempo(600)).toBe("10:00");
  });
});

describe("resultadoDeSesion", () => {
  const items = [
    { id: "a", tipo: "multiple", tema: "T1" },
    { id: "b", tipo: "multiple", tema: "T1" },
    { id: "c", tipo: "vf", tema: "T2" },
    { id: "d", tipo: "desarrollo", tema: "T2" }
  ];

  it("cuenta aciertos, pct, porTema y falladas; el desarrollo queda fuera del puntaje", () => {
    const s = crearSesion(items, "practica", 1000);
    s.answers[0] = { ok: true };
    s.answers[1] = { ok: false };
    s.answers[2] = { ok: true };
    const r = resultadoDeSesion(s, 1000 + 125000); // 125 s con reloj fijo
    expect(r.aciertos).toBe(2);
    expect(r.totalCal).toBe(3);
    expect(r.pct).toBe(67);
    expect(r.porTema.T1).toEqual({ ok: 1, total: 2 });
    expect(r.porTema.T2).toEqual({ ok: 1, total: 1 });
    expect(r.falladas.map(i => i.id)).toEqual(["b"]);
    expect(r.desarrollos.map(i => i.id)).toEqual(["d"]);
    expect(r.tiempo).toBe("2:05");
    expect(r.segundos).toBe(125);
  });

  it("sin calificables usa total 1 para no dividir por cero", () => {
    const s = crearSesion([{ id: "d", tipo: "desarrollo", tema: "T" }], "practica", 0);
    const r = resultadoDeSesion(s, 0);
    expect(r.totalCal).toBe(1);
    expect(r.pct).toBe(0);
  });
});

describe("aplicarRespuestaSesion", () => {
  it("contrarreloj duplica el XP si responde en menos de 10 s", () => {
    const s = crearSesion([], "contrarreloj", 0);
    s.preguntaInicio = 1000;
    expect(aplicarRespuestaSesion(s, true, 5000, 10)).toBe(20);
    expect(aplicarRespuestaSesion(s, true, 12000, 10)).toBe(10);
    expect(aplicarRespuestaSesion(s, false, 2000, 0)).toBe(0);
  });

  it("supervivencia acumula combo y aplica el multiplicador", () => {
    const s = crearSesion([], "supervivencia", 0);
    expect(aplicarRespuestaSesion(s, true, 0, 10)).toBe(10); // combo 1 → x1
    expect(s.mejorCombo).toBe(1);
    s.combo = 5;
    expect(aplicarRespuestaSesion(s, true, 0, 10)).toBe(20); // combo 6 → x2
    expect(s.mejorCombo).toBe(6);
  });

  it("supervivencia pierde una vida por fallo y llega a gameOver en la tercera", () => {
    const s = crearSesion([], "supervivencia", 0);
    aplicarRespuestaSesion(s, false, 0, 10);
    aplicarRespuestaSesion(s, false, 0, 10);
    expect(s.vidas).toBe(1);
    expect(s.gameOver).toBeUndefined();
    aplicarRespuestaSesion(s, false, 0, 10);
    expect(s.vidas).toBe(0);
    expect(s.gameOver).toBe(true);
  });
});

describe("avance de la ronda", () => {
  it("siguienteIndice avanza y debeFinalizar marca el último ítem", () => {
    const s = crearSesion([{ id: "a" }, { id: "b" }], "practica", 0);
    expect(debeFinalizar(s)).toBe(false);
    expect(siguienteIndice(s)).toBe(1);
    s.idx = 1;
    expect(debeFinalizar(s)).toBe(true);
  });

  it("gameOver fuerza el cierre aunque queden preguntas", () => {
    const s = crearSesion([{ id: "a" }, { id: "b" }], "supervivencia", 0);
    s.gameOver = true;
    expect(debeFinalizar(s)).toBe(true);
  });
});
