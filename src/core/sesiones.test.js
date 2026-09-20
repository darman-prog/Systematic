import { describe, it, expect } from "vitest";
import { shuffle, prepararItem, ordenarPrioridad, respuestaCorrecta } from "./sesiones.js";
import { obtenerEntrada } from "./progreso.js";

const cero = () => 0;

describe("shuffle", () => {
  it("no muta el arreglo original y permuta con rng determinista", () => {
    const original = [1, 2, 3];
    const r = shuffle(original, cero);
    expect(original).toEqual([1, 2, 3]);
    expect(r).toEqual([2, 3, 1]);
  });

  it("conserva los elementos", () => {
    const r = shuffle([1, 2, 3, 4, 5], () => 0.5);
    expect([...r].sort()).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("prepararItem", () => {
  it("multiple: sigue el texto correcto tras barajar", () => {
    const item = { id: "X-1", tipo: "multiple", options: ["A", "B", "C"], correct: 1 };
    const p = prepararItem(item, true, cero);
    expect(p.options[p.correct]).toBe("B");
    expect([...p.options].sort()).toEqual(["A", "B", "C"]);
  });

  it("multi: recalcula los índices correctos", () => {
    const item = { id: "X-2", tipo: "multi", options: ["A", "B", "C", "D"], correctos: [1, 3] };
    const p = prepararItem(item, true, () => 0.99);
    expect(p.correctos.map(i => p.options[i]).sort()).toEqual(["B", "D"]);
  });

  it("dragdrop: genera piezas con pid y respeta el orden sin barajar", () => {
    const item = { id: "X-3", tipo: "dragdrop", piezas: ["uno", "dos"], respuestas: ["uno", "dos"] };
    const sinBarajar = prepararItem(item, false);
    expect(sinBarajar.piezasRuntime).toEqual([
      { pid: "X-3-p0", text: "uno" },
      { pid: "X-3-p1", text: "dos" }
    ]);
  });

  it("ordenar: cambia el orden inicial y conserva los bloques", () => {
    const item = { id: "X-4", tipo: "ordenar", bloques: ["a", "b", "c"] };
    const p = prepararItem(item, true, cero);
    expect(p.bloquesRuntime.join("|")).not.toBe(item.bloques.join("|"));
    expect([...p.bloquesRuntime].sort()).toEqual(["a", "b", "c"]);
  });

  it("relacionar: arma la columna derecha con índices", () => {
    const item = { id: "X-5", tipo: "relacionar", pares: [["a", "1"], ["b", "2"]] };
    const p = prepararItem(item, false);
    expect(p.derecha).toEqual([
      { idx: 0, texto: "1" },
      { idx: 1, texto: "2" }
    ]);
  });

  it("desarrollo: no transforma el ítem", () => {
    const item = { id: "X-6", tipo: "desarrollo", solucion: "SELECT 1" };
    expect(prepararItem(item, true)).toEqual(item);
  });

  it("diagrama: se copia sin barajar campos inexistentes", () => {
    const item = {
      id: "X-7", tipo: "diagrama", subtipo: "er",
      nodosPool: ["A", "B"],
      relacionesEsperadas: [{ de: "A", a: "B", tipo: "1:N" }]
    };
    const p = prepararItem(item, true, cero);
    expect(p).toEqual(item);
    expect(p).not.toBe(item);
  });
});

describe("ordenarPrioridad", () => {
  it("agrupa débiles primero y deja las fuertes al final", () => {
    const lista = [{ id: "nueva" }, { id: "debil" }, { id: "fuerte" }];
    const progresoFalso = {
      fuerte: { ok: 5, fail: 0, box: 5, lastOk: true, last: Date.now() },
      debil: { ok: 1, fail: 3, box: 1, lastOk: false, last: Date.now() }
    };
    const orden = ordenarPrioridad(lista, id => obtenerEntrada(progresoFalso, id), cero);
    expect(orden[0].id).toBe("debil");
    expect(orden[2].id).toBe("fuerte");
    expect(orden).toHaveLength(3);
  });
});

describe("respuestaCorrecta", () => {
  it("multiple y multi", () => {
    expect(respuestaCorrecta({ tipo: "multiple", options: ["A", "B"], correct: 1 })).toBe("B");
    expect(respuestaCorrecta({ tipo: "multi", options: ["A", "B", "C"], correctos: [0, 2] })).toBe("A · C");
  });

  it("dragdrop, ordenar y relacionar unen sus partes", () => {
    expect(respuestaCorrecta({ tipo: "dragdrop", respuestas: ["a", "b"] })).toBe("a / b");
    expect(respuestaCorrecta({ tipo: "ordenar", bloques: ["a", "b"] })).toBe("a → b");
    expect(respuestaCorrecta({ tipo: "relacionar", pares: [["a", "1"]] })).toBe("a → 1");
  });

  it("desarrollo devuelve la solución", () => {
    expect(respuestaCorrecta({ tipo: "desarrollo", solucion: "SELECT 1" })).toBe("SELECT 1");
  });

  it("diagrama resume el conjunto esperado", () => {
    expect(respuestaCorrecta({
      tipo: "diagrama", subtipo: "er",
      relacionesEsperadas: [{ de: "A", a: "B", tipo: "1:N" }],
      miembrosPool: [{ texto: "id", de: "A" }]
    })).toBe("Diagrama er | Relaciones: A 1:N B | Miembros: A: id");
  });
});
