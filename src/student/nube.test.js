// Servicio de sincronización: arma el snapshot local al subir y valida lo que llega al bajar.
// El adaptador de nube es un fake; no hay red ni Firebase reales.
import { describe, it, expect, vi } from "vitest";
import { crearNube } from "./nube.js";

const MATERIAS = [{ id: "bd2" }];
const LENGUAJES = [{ id: "lenguaje-ts" }];

function persistenciaFake() {
  return {
    nombre: () => "Ana",
    xp: () => 10,
    xpEventos: () => ({}),
    logros: () => ({}),
    escenarios: () => ({}),
    casos: () => ({}),
    onboardingHecho: () => true,
    progreso: () => ({ "bd2-001": { ok: 1, fail: 0, box: 2, last: null, lastOk: true, marked: false } }),
    historial: () => [],
    actividad: () => ({}),
    meta: () => 20,
    misiones: () => ({}),
    competencia: () => ({})
  };
}

function nubeCon(adaptador) {
  return crearNube({
    cargarNube: async () => adaptador,
    persistencia: persistenciaFake(),
    materias: MATERIAS,
    lenguajes: LENGUAJES,
    ahora: () => new Date("2026-01-02T03:04:05.000Z")
  });
}

describe("student/nube", () => {
  it("disponible refleja si hay configuración de nube", async () => {
    expect(await nubeCon({ store: {} }).disponible()).toBe(true);
    expect(await crearNube({
      cargarNube: async () => null,
      persistencia: persistenciaFake(),
      materias: MATERIAS,
      lenguajes: LENGUAJES
    }).disponible()).toBe(false);
  });

  it("subir exige sesión y escribe el snapshot del uid", async () => {
    const store = { escribir: vi.fn(async () => {}) };
    const nube = nubeCon({ store });
    expect((await nube.subir("")).ok).toBe(false);
    expect(store.escribir).not.toHaveBeenCalled();
    const r = await nube.subir("u1");
    expect(r).toEqual({ ok: true, exportado: "2026-01-02T03:04:05.000Z" });
    const [uid, snap] = store.escribir.mock.calls[0];
    expect(uid).toBe("u1");
    expect(snap.formato).toBe("nube-1");
    expect(snap.materias.bd2.progreso["bd2-001"].box).toBe(2);
  });

  it("subir devuelve mensaje de conexión si el adaptador falla", async () => {
    const nube = nubeCon({ store: { escribir: vi.fn(async () => { throw new Error("sin red"); }) } });
    const r = await nube.subir("u1");
    expect(r.ok).toBe(false);
    expect(r.mensaje).toContain("No se pudo subir");
  });

  it("traduce los códigos de Firestore y del tope de tamaño", async () => {
    const grande = nubeCon({ store: { escribir: vi.fn(async () => { throw { code: "respaldo-grande" }; }) } });
    expect((await grande.subir("u1")).mensaje).toContain("demasiado grande");
    const sinRed = nubeCon({ store: { leer: vi.fn(async () => { throw { code: "unavailable" }; }) } });
    expect((await sinRed.bajar("u1")).mensaje).toContain("Sin conexión");
  });

  it("bajar avisa cuando no hay respaldo y rechaza formatos inválidos", async () => {
    const vacio = nubeCon({ store: { leer: vi.fn(async () => null) } });
    expect(await vacio.bajar("u1")).toEqual({ ok: false, vacio: true, mensaje: "Todavía no hay un respaldo en la nube." });
    const roto = nubeCon({ store: { leer: vi.fn(async () => ({ app: "otra-app" })) } });
    const rRoto = await roto.bajar("u1");
    expect(rRoto.ok).toBe(false);
    expect(rRoto.mensaje).toContain("formato");
  });

  it("bajar devuelve el snapshot validado (ida y vuelta real)", async () => {
    let escrito = null;
    const servicioSubida = nubeCon({ store: { escribir: vi.fn(async (uid, snap) => { escrito = snap; }) } });
    expect((await servicioSubida.subir("u1")).ok).toBe(true);
    const servicioBajada = nubeCon({ store: { leer: vi.fn(async () => escrito) } });
    const r = await servicioBajada.bajar("u1");
    expect(r.ok).toBe(true);
    expect(r.datos.formato).toBe("nube-1");
    expect(r.datos.materias.bd2.meta).toBe(20);
  });
});
