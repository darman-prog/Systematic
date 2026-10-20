import { describe, it, expect } from "vitest";
import { crearRondas } from "./rondas.js";

const q = (id, over = {}) => ({
  id, tipo: "multiple", tema: "T1", parcial: "P1", dificultad: "facil", ...over
});

function banco() {
  return [
    q("a"),
    q("b", { tipo: "diagrama" }),
    q("c", { tipo: "desarrollo", tema: "T2" }),
    q("d", { tipo: "dragdrop", tema: "T2", caso: true }),
    q("e", { tipo: "ordenar", tema: "T3", caso: true }),
    q("f", { tema: "T4" }),
    q("g", { tema: "T5" }),
    q("h", { tema: "T6" }),
    q("i", { tema: "T7" }),
    q("j", { tema: "T8" }),
    q("k", { tema: "T9" }),
    q("l", { tema: "T10" })
  ];
}

function montar(over = {}) {
  const ids = banco().map(x => x.id);
  const debiles = new Set(ids);
  const vencidas = new Set(ids);
  return crearRondas({
    obtenerP: id => ({
      fail: debiles.has(id) ? 1 : 0,
      lastOk: false,
      box: 1,
      last: vencidas.has(id) ? 0 : Date.now()
    }),
    priorizar: lista => lista.slice().reverse(),
    rng: () => 0,
    ...over
  });
}

describe("rondas", () => {
  it("practica respeta el tope y el orden de prioridad", () => {
    const r = montar().practica({ items: banco(), cantidad: 2, priorizando: true });
    expect(r.modo).toBe("practica");
    expect(r.items).toHaveLength(2);
    expect(r.items.map(x => x.id)).toEqual(["l", "k"]);
  });

  it("practica sin prioridad devuelve el tope pedido", () => {
    const r = montar().practica({ items: banco(), cantidad: 3, priorizando: false });
    expect(r.items).toHaveLength(3);
  });

  it("simulacro usa como maximo 10 preguntas", () => {
    const r = montar().simulacro({ items: banco() });
    expect(r.modo).toBe("simulacro");
    expect(r.conTimer).toBe(true);
    expect(r.items).toHaveLength(10);
  });

  it("contrarreloj excluye desarrollo y conserva el maximo de 10", () => {
    const r = montar().contrarreloj({ banco: banco() });
    expect(r.modo).toBe("contrarreloj");
    expect(r.items.some(x => x.tipo === "desarrollo")).toBe(false);
    expect(r.items).toHaveLength(10);
  });

  it("supervivencia usa todo el banco", () => {
    const r = montar().supervivencia({ banco: banco() });
    expect(r.modo).toBe("supervivencia");
    expect(r.items).toHaveLength(banco().length);
  });

  it("debiles filtra por esDebil y baraja", () => {
    const r = montar().debiles({ banco: banco() });
    expect(r.items.length).toBeGreaterThan(0);
    expect(r.items.length).toBeLessThanOrEqual(10);
  });

  it("porTipo filtra el tipo pedido", () => {
    const r = montar().porTipo({ banco: banco(), tipo: "dragdrop" });
    expect(r.items.map(x => x.id)).toEqual(["d"]);
  });

  it("arrastre incluye dragdrop y ordenar", () => {
    const r = montar().arrastre({ banco: banco() });
    expect(r.items.map(x => x.id).sort()).toEqual(["d", "e"]);
  });

  it("casos filtra preguntas con caso", () => {
    const r = montar().casos({ banco: banco() });
    expect(r.items.map(x => x.id).sort()).toEqual(["d", "e"]);
  });

  it("vencidas filtra por progreso vencido y respeta el maximo de 10", () => {
    const r = montar().vencidas({ banco: banco() });
    expect(r.items.length).toBeGreaterThan(0);
    expect(r.items.length).toBeLessThanOrEqual(10);
  });

  it("mision filtra por tema", () => {
    const r = montar().mision({ banco: banco(), tema: "T2" });
    expect(r.items.map(x => x.id).sort()).toEqual(["c", "d"]);
  });

  it("excluye diagramas cuando no estan disponibles en las rutas que los filtran", () => {
    const r = montar({ diagramasDisponibles: () => false }).porTipo({ banco: banco(), tipo: "diagrama" });
    expect(r).toBeNull();
  });

  it("devuelve null cuando no hay preguntas", () => {
    const r = montar();
    expect(r.practica({ items: [], cantidad: 10 })).toBeNull();
    expect(r.simulacro({ items: [] })).toBeNull();
    expect(r.contrarreloj({ banco: [] })).toBeNull();
    expect(r.supervivencia({ banco: [] })).toBeNull();
    expect(r.debiles({ banco: [] })).toBeNull();
    expect(r.mision({ banco: [], tema: "T1" })).toBeNull();
  });
});
