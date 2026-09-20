import { describe, it, expect, beforeEach } from "vitest";
import { crearPersistencia } from "./persistencia.js";
import { crearGamificacion } from "./gamificacion.js";

function storageMemoria() {
  const datos = {};
  return {
    getItem: k => (k in datos ? datos[k] : null),
    setItem: (k, v) => { datos[k] = String(v); },
    removeItem: k => { delete datos[k]; }
  };
}

const MATERIAS = [{ id: "bd2" }, { id: "isw" }];

describe("servicio de gamificación", () => {
  let persistencia;
  let gamificacion;
  let eventos;
  beforeEach(() => {
    eventos = { niveles: [], logros: [], perfiles: 0 };
    persistencia = crearPersistencia(storageMemoria());
    gamificacion = crearGamificacion({
      persistencia,
      materias: MATERIAS,
      alSubirNivel: n => eventos.niveles.push(n),
      alLogro: l => eventos.logros.push(l.id),
      alCambiarPerfil: () => { eventos.perfiles++; }
    });
  });

  it("suma XP y avisa al subir de nivel", () => {
    gamificacion.sumarXp(10);
    expect(gamificacion.xpActual()).toBe(10);
    expect(eventos.niveles).toEqual([]);
    gamificacion.sumarXp(100);
    expect(gamificacion.xpActual()).toBe(110);
    expect(eventos.niveles).toEqual([2]);
    expect(eventos.perfiles).toBe(2);
  });

  it("otorga recompensas únicas una sola vez", () => {
    gamificacion.xpEventoUnico("meta-2026-01-01", 25);
    gamificacion.xpEventoUnico("meta-2026-01-01", 25);
    expect(gamificacion.xpActual()).toBe(25);
  });

  it("calcula stats globales y actividad mezclada", () => {
    persistencia.guardarProgreso("bd2", { q1: { ok: 3, fail: 1 } });
    persistencia.guardarProgreso("isw", { q2: { ok: 1, fail: 0 } });
    persistencia.guardarActividad("bd2", { "2026-01-01": 2 });
    persistencia.guardarActividad("isw", { "2026-01-01": 5, "2026-01-02": 1 });
    expect(gamificacion.statsGlobales()).toEqual({ respuestas: 5, precision: 80 });
    expect(gamificacion.actividadGlobal()).toEqual({ "2026-01-01": 5, "2026-01-02": 1 });
  });

  it("revisa logros, los persiste y premia", () => {
    const nuevos = gamificacion.revisarLogros({ metaCumplida: true });
    expect(nuevos.map(l => l.id)).toContain("meta-cumplida");
    expect(eventos.logros).toContain("meta-cumplida");
    expect(gamificacion.xpActual()).toBeGreaterThan(0);
    expect(gamificacion.revisarLogros({})).toEqual([]);
  });

  it("expone el perfil con nivel, racha e insignias", () => {
    gamificacion.sumarXp(400);
    const p = gamificacion.perfil();
    expect(p.xp).toBe(400);
    expect(p.nivel).toBeGreaterThanOrEqual(2);
    expect(p.pct).toBeGreaterThanOrEqual(0);
    expect(p.racha).toBe(0);
    expect(p.insignias).toBe(0);
  });
});
