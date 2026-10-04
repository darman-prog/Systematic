import { describe, it, expect } from "vitest";
import { estadoEtapas } from "./lenguaje.js";

const roadmap = {
  etapas: [
    { id: "a", examen: { version: 1, umbral: 0.8, preguntas: ["x"] } },
    { id: "b", examen: { version: 1, umbral: 0.8, preguntas: ["y"] } },
  ],
};

describe("estadoEtapas", () => {
  it("desbloquea la siguiente a una etapa aprobada", () => {
    const nodos = estadoEtapas(roadmap, { a: { aprobado: true, version: 1 } });
    expect(nodos[0].aprobada).toBe(true);
    expect(nodos[0].desbloqueada).toBe(true);
    expect(nodos[1].desbloqueada).toBe(true);
  });

  it("bloquea la segunda sin aprobado de la primera", () => {
    const nodos = estadoEtapas(roadmap, {});
    expect(nodos[1].desbloqueada).toBe(false);
  });

  it("ignora un aprobado de versión vieja", () => {
    const nodos = estadoEtapas(roadmap, { a: { aprobado: true, version: 9 } });
    expect(nodos[0].aprobada).toBe(false);
    expect(nodos[1].desbloqueada).toBe(false);
  });
});
