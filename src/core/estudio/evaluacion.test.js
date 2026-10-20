import { describe, it, expect } from "vitest";
import {
  evaluarOpcion, evaluarMulti, evaluarDragdrop, evaluarOrden,
  evaluarRelacion, parejaRelacionValida
} from "./evaluacion.js";

const opcion = { options: ["A", "B", "C"], correct: 1 };
const multi = { options: ["A", "B", "C"], correctos: [0, 2] };
const drag = { respuestas: ["a", "b"] };
const orden = { bloques: ["x", "y", "z"] };
const relacion = { pares: [["A", "Transición"], ["B", "Estado"]] };

describe("evaluacion", () => {
  it("evalua una opcion unica", () => {
    expect(evaluarOpcion(opcion, 1)).toEqual({ ok: true, selected: "B", expected: "B" });
    expect(evaluarOpcion(opcion, 0)).toEqual({ ok: false, selected: "A", expected: "B" });
    expect(evaluarOpcion(opcion, 99).ok).toBe(false);
  });

  it("evalua multi como conjunto, sin importar el orden", () => {
    expect(evaluarMulti(multi, [2, 0]).ok).toBe(true);
    expect(evaluarMulti(multi, [0])).toMatchObject({ ok: false, selected: "A" });
    expect(evaluarMulti(multi, [0, 1, 2])).toMatchObject({ ok: false });
    expect(evaluarMulti(multi, [])).toMatchObject({ ok: false, selected: "(ninguna)" });
    expect(evaluarMulti(multi, [0, 2]).expected).toBe("A + C");
  });

  it("evalua dragdrop por posicion y texto", () => {
    expect(evaluarDragdrop(drag, ["a", "b"])).toEqual({
      ok: true, selected: "a / b", expected: "a / b", detalle: [true, true]
    });
    expect(evaluarDragdrop(drag, ["b", "a"])).toMatchObject({ ok: false, selected: "b / a" });
    expect(evaluarDragdrop(drag, ["a"]).ok).toBe(false);
  });

  it("evalua orden por secuencia", () => {
    expect(evaluarOrden(orden, ["x", "y", "z"])).toEqual({
      ok: true, selected: "x → y → z", expected: "x → y → z", detalle: [true, true, true]
    });
    expect(evaluarOrden(orden, ["y", "x", "z"])).toMatchObject({ ok: false });
    expect(evaluarOrden(orden, ["x", "y"]).ok).toBe(false);
  });

  it("evalua relacionar solo si no hubo fallos", () => {
    const r = evaluarRelacion(relacion, 0);
    expect(r.ok).toBe(true);
    expect(r.selected).toBe("A → Transición | B → Estado");
    expect(evaluarRelacion(relacion, 1).ok).toBe(false);
  });

  it("valida una pareja normalizando acentos y mayusculas", () => {
    expect(parejaRelacionValida(relacion, 0, "transicion")).toBe(true);
    expect(parejaRelacionValida(relacion, 0, "Transición")).toBe(true);
    expect(parejaRelacionValida(relacion, 1, "Transición")).toBe(false);
    expect(parejaRelacionValida(relacion, 99, "Estado")).toBe(false);
    expect(parejaRelacionValida(null, 0, "x")).toBe(false);
  });
});
