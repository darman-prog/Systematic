// Verifica que cada track tenga un agregador (index.js) que expone las piezas de
// contenido con la forma esperada. Es un gate de build: si un track nuevo se agrega
// sin su index.js o con una pieza mal exportada, la suite falla.
import { describe, it, expect } from "vitest";
import { MATERIAS, LENGUAJES } from "../../src/core/index.js";
import { cargarContenido } from "../student/contenido.js";

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

  it("cada materia declara un árbol de talentos cuyos temas y Boss Battles existen en su banco", async () => {
    for (const m of MATERIAS) {
      const mod = await cargarContenido(m);
      expect(mod.talentos, `${m.id} debe declarar talentos`).toBeTruthy();
      expect(mod.talentos.ejes).toHaveLength(5);
      expect(mod.talentos.ramas.length).toBeGreaterThanOrEqual(3);

      const temasDisponibles = new Set(mod.preguntas.map(p => p.tema));
      const escenariosIds = new Set(mod.escenarios.map(e => e.id));
      const casosIds = new Set(mod.casos.map(c => c.id));
      const ejesSet = new Set(mod.talentos.ejes);

      for (const rama of mod.talentos.ramas) {
        for (const nodo of rama.nodos) {
          expect(ejesSet.has(nodo.eje), `${m.id}/${nodo.id}: eje ${nodo.eje} no existe`).toBe(true);
          for (const tema of nodo.misionesRequeridas) {
            expect(temasDisponibles.has(tema), `${m.id}/${nodo.id}: tema ${tema} no existe en banco`).toBe(true);
          }
          if (nodo.bossId) {
            const existeBoss = nodo.bossTipo === "caso" ? casosIds.has(nodo.bossId) : escenariosIds.has(nodo.bossId);
            expect(existeBoss, `${m.id}/${nodo.id}: boss ${nodo.bossId} no existe`).toBe(true);
          }
        }
      }
    }
  });
});
