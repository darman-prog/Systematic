// Verifica que cada track tenga un agregador (index.js) que expone las piezas de
// contenido con la forma esperada. Es un gate de build: si un track nuevo se agrega
// sin su index.js o con una pieza mal exportada, la suite falla.
import { describe, it, expect } from "vitest";
import { MATERIAS, LENGUAJES, cargarContenido } from "../../src/core/materias.js";

const todos = [...MATERIAS, ...LENGUAJES];

describe("agregadores de datos por track", () => {
  it("cada track expone preguntas, glosario, apuntes, escenarios y casos", async () => {
    expect(todos.length).toBeGreaterThan(0);

    for (const m of todos) {
      const mod = await cargarContenido(m);

      expect(Array.isArray(mod.preguntas), `${m.id}: preguntas debe ser arreglo`).toBe(true);
      expect(Array.isArray(mod.apuntes), `${m.id}: apuntes debe ser arreglo`).toBe(true);
      expect(Array.isArray(mod.escenarios), `${m.id}: escenarios debe ser arreglo`).toBe(true);
      expect(Array.isArray(mod.casos), `${m.id}: casos debe ser arreglo`).toBe(true);

      expect(mod.glosario, `${m.id}: falta glosario`).toBeTruthy();
      expect(Array.isArray(mod.glosario.terminos), `${m.id}: glosario.terminos debe ser arreglo`).toBe(true);
      expect(Array.isArray(mod.glosario.categorias), `${m.id}: glosario.categorias debe ser arreglo`).toBe(true);
    }
  });

  it("solo los lenguajes declaran roadmap", async () => {
    for (const m of MATERIAS) {
      expect((await cargarContenido(m)).roadmap, `${m.id} no debería tener roadmap`).toBeNull();
    }
    for (const l of LENGUAJES) {
      expect((await cargarContenido(l)).roadmap, `${l.id} debería tener roadmap`).toBeTruthy();
    }
  });
});
