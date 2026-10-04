// Servicio de sesión: arranque por modo, registro de respuestas, avance y finalización
// (pct/porTema, misión y examen) con dependencias falsas. Sin DOM ni reloj real.
import { describe, it, expect, vi } from "vitest";
import { crearSesiones } from "./session.js";
import {
  XP_EVENTOS, xpDeRespuesta, estrellasDeMision, registrarExamen, prepararItem
} from "../core/index.js";
import { fusionarMision } from "./registros.js";

const multiple = (id, tema = "T1") => ({ id, tipo: "multiple", tema, options: ["A", "B"], correct: 0, exp: "" });

function fakePersistencia(over = {}) {
  return Object.assign({
    actividad: () => ({}),
    meta: () => 5,
    misiones: () => ({}),
    guardarMisiones: vi.fn(),
    guardarCompetencia: vi.fn()
  }, over);
}

function fakeGamificacion() {
  return {
    xp: 0,
    sumarXp(cantidad) { this.xp += cantidad; },
    xpEventoUnico: vi.fn(),
    revisarLogros: vi.fn(),
    estrellasTotales: () => 0
  };
}

function fakeTrack(over = {}) {
  return Object.assign({
    materia: { id: "bd2" },
    lenguaje: null,
    competencia: {},
    setCompetencia: vi.fn()
  }, over);
}

// Arma el servicio con stubs; devuelve también los espías para inspeccionar efectos.
function armar(over = {}) {
  const persistencia = over.persistencia || fakePersistencia();
  const gamificacion = over.gamificacion || fakeGamificacion();
  const track = over.track || fakeTrack();
  const intentos = [];
  const finalizados = [];
  const servicios = crearSesiones({
    persistencia, gamificacion, track,
    obtenerP: over.obtenerP || (() => ({ box: 1, ok: 0, fail: 0 })),
    xpDeRespuesta, XP_EVENTOS, estrellasDeMision, fusionarMision, registrarExamen, prepararItem,
    guardarIntento: (a, t, m) => intentos.push({ a, t, m }),
    conNombre: texto => texto.replace("@", "Ana"),
    notificar: over.notificar || vi.fn(),
    alFinalizar: r => finalizados.push(r),
    leerTextoDesarrollo: over.leerTextoDesarrollo || (() => ""),
    ahora: over.ahora || (() => 1000)
  });
  return { servicios, persistencia, gamificacion, track, intentos, finalizados };
}

describe("student/session", () => {
  it("iniciar prepara ítems y arranca con los defaults del modo", () => {
    const { servicios } = armar();
    const s = servicios.iniciar([multiple("a")], "contrarreloj");
    expect(s.modo).toBe("contrarreloj");
    expect(s.tRestante).toBe(30);
    expect(s.items).toHaveLength(1);
    expect(servicios.sesion).toBe(s);
  });

  it("iniciar sin ítems no crea la sesión", () => {
    const { servicios } = armar();
    expect(servicios.iniciar([], "practica")).toBeNull();
    expect(servicios.sesion).toBeNull();
  });

  it("responder suma XP y duplica el bonus de contrarreloj por rapidez", () => {
    const { servicios, gamificacion } = armar({ ahora: () => 5000 });
    const s = servicios.iniciar([multiple("a")], "contrarreloj");
    s.preguntaInicio = 0;
    expect(servicios.responder("a", true)).toBe(20); // base 10 x2 por responder en <10 s
    expect(gamificacion.xp).toBe(20);
    expect(gamificacion.revisarLogros).toHaveBeenCalledWith({ metaCumplida: false });
  });

  it("responder en supervivencia acumula combo y descuenta vidas", () => {
    const { servicios } = armar();
    const s = servicios.iniciar([multiple("a")], "supervivencia");
    servicios.responder("a", true);
    expect(s.combo).toBe(1);
    s.combo = 5;
    expect(servicios.responder("a", true)).toBe(20); // combo 6 → x2
    servicios.responder("a", false);
    expect(s.vidas).toBe(2);
    expect(s.combo).toBe(0);
  });

  it("avanzar pasa de pregunta y cierra al llegar a la última", () => {
    const { servicios, finalizados } = armar();
    servicios.iniciar([multiple("a"), multiple("b")], "practica");
    const primera = servicios.avanzar();
    expect(primera.continua).toBe(true);
    expect(servicios.sesion.idx).toBe(1);
    const ultima = servicios.avanzar();
    expect(ultima.continua).toBe(false);
    expect(finalizados).toHaveLength(1);
  });

  it("finalizar calcula pct/porTema y guarda el intento", () => {
    const { servicios, intentos, finalizados } = armar();
    servicios.iniciar([multiple("a", "T1"), multiple("b", "T1"), multiple("c", "T2")], "practica");
    const s = servicios.sesion;
    s.answers[0] = { ok: true };
    s.answers[1] = { ok: false };
    s.answers[2] = { ok: true };
    const r = servicios.finalizar();
    expect(r.pct).toBe(67);
    expect(r.porTema.T1).toEqual({ ok: 1, total: 2 });
    expect(r.falladas.map(i => i.id)).toEqual(["b"]);
    expect(intentos).toEqual([{ a: 2, t: 3, m: "practica" }]);
    expect(finalizados[0]).toBe(r);
  });

  it("finalizar una misión fusiona estrellas y revisa logros", () => {
    const persistencia = fakePersistencia();
    const gamificacion = fakeGamificacion();
    const { servicios } = armar({ persistencia, gamificacion });
    servicios.iniciar([multiple("a", "T1")], "mision");
    servicios.sesion.misionTema = "T1";
    servicios.sesion.answers[0] = { ok: true };
    servicios.finalizar();
    expect(persistencia.guardarMisiones).toHaveBeenCalledWith("bd2", { T1: { estrellas: 3, mejorPct: 100 } });
    expect(gamificacion.revisarLogros).toHaveBeenCalledWith(expect.objectContaining({ misionPerfecta: true }));
  });

  it("finalizar un examen registra competencia y notifica el resultado", () => {
    const persistencia = fakePersistencia();
    const notificar = vi.fn();
    const etapa = { id: "e1", nombre: "Fundamentos", examen: { version: 1, preguntas: ["a", "b", "c", "d", "e"] } };
    const track = fakeTrack({ lenguaje: { id: "lenguaje-ts" } });
    const { servicios } = armar({ persistencia, track, notificar });
    const items = ["a", "b", "c", "d", "e"].map(id => multiple(id, "T1"));
    servicios.iniciar(items, "examen");
    servicios.sesion.examenEtapa = etapa;
    servicios.sesion.lenguajeId = "lenguaje-ts";
    items.forEach((_, i) => { servicios.sesion.answers[i] = { ok: true }; });
    const r = servicios.finalizar();
    expect(r.examen).toEqual({ aprobado: true, etapa });
    expect(track.setCompetencia).toHaveBeenCalled();
    expect(persistencia.guardarCompetencia).toHaveBeenCalledWith(
      "lenguaje-ts",
      expect.objectContaining({ e1: expect.objectContaining({ aprobado: true }) })
    );
    expect(notificar).toHaveBeenCalledWith(expect.stringContaining("Examen aprobado"));
  });

  it("repetirMisma conserva el contexto de examen", () => {
    const { servicios } = armar();
    servicios.iniciar([multiple("a")], "examen");
    servicios.sesion.examenEtapa = { id: "e1" };
    servicios.sesion.lenguajeId = "lenguaje-ts";
    const original = servicios.sesion;
    const nueva = servicios.repetirMisma();
    expect(nueva).not.toBe(original);
    expect(servicios.sesion).toBe(nueva);
    expect(nueva.examenEtapa).toEqual({ id: "e1" });
    expect(nueva.lenguajeId).toBe("lenguaje-ts");
  });
});
