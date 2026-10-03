// Verifica que cada track tenga un agregador (index.js) que expone las 5 piezas
// de contenido con la forma esperada. Es un gate de build: si un track nuevo se
// agrega sin su index.js o con una pieza mal exportada, la suite falla.
import { describe, it, expect } from "vitest";
import { MATERIAS } from "../../src/core/materias.js";

describe("agregadores de datos por track", () => {
  it("cada track expone preguntas, glosario, apuntes, escenarios y casos", async () => {
    expect(MATERIAS.length).toBeGreaterThan(0);

    for (const m of MATERIAS) {
      const mod = await import(`../../src/datos/${m.id}/index.js`);

      expect(Array.isArray(mod.preguntas), `${m.id}: preguntas debe ser arreglo`).toBe(true);
      expect(Array.isArray(mod.apuntes), `${m.id}: apuntes debe ser arreglo`).toBe(true);
      expect(Array.isArray(mod.escenarios), `${m.id}: escenarios debe ser arreglo`).toBe(true);
      expect(Array.isArray(mod.casos), `${m.id}: casos debe ser arreglo`).toBe(true);

      expect(mod.glosario, `${m.id}: falta glosario`).toBeTruthy();
      expect(Array.isArray(mod.glosario.terminos), `${m.id}: glosario.terminos debe ser arreglo`).toBe(true);
      expect(Array.isArray(mod.glosario.categorias), `${m.id}: glosario.categorias debe ser arreglo`).toBe(true);
    }
  });
});
