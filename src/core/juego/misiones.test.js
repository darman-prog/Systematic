import { describe, it, expect } from "vitest";
import { estadoMisiones } from "./misiones.js";

describe("estadoMisiones", () => {
  it("deja disponible solo el primer nodo sin progreso", () => {
    const nodos = estadoMisiones(["A", "B", "C"], {});
    expect(nodos.map(n => n.estado)).toEqual(["disponible", "bloqueada", "bloqueada"]);
    expect(nodos.map(n => n.estrellas)).toEqual([0, 0, 0]);
  });

  it("desbloquea el siguiente nodo al ganar estrella", () => {
    const nodos = estadoMisiones(["A", "B", "C"], { A: { estrellas: 2, mejorPct: 80 } });
    expect(nodos.map(n => n.estado)).toEqual(["disponible", "disponible", "bloqueada"]);
    expect(nodos[0]).toMatchObject({ estrellas: 2, mejorPct: 80 });
  });

  it("bloquea la cadena cuando un nodo intermedio no tiene estrellas", () => {
    const nodos = estadoMisiones(["A", "B", "C"], { A: { estrellas: 3, mejorPct: 100 }, B: { estrellas: 0, mejorPct: 40 } });
    expect(nodos.map(n => n.estado)).toEqual(["disponible", "disponible", "bloqueada"]);
  });

  it("tolera entradas parciales", () => {
    const nodos = estadoMisiones(["A"], { A: { estrellas: 1 } });
    expect(nodos[0].mejorPct).toBe(0);
  });
});
