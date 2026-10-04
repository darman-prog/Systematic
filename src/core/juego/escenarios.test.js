import { describe, it, expect } from "vitest";
import { iniciarEscenario, pasoActual, decidir, continuar, ratingDe, xpDeEscenario } from "./escenarios.js";

const escenario = {
  id: "E-1",
  pasos: [
    { id: "p1", narrativa: "Inicio", opciones: [
      { texto: "Buena", feedback: "Correcto", puntos: 2, siguiente: "p2" },
      { texto: "Regular", feedback: "A medias", puntos: 1, siguiente: "p2" },
      { texto: "Mala", feedback: "Mal", puntos: 0, siguiente: "p2" }
    ] },
    { id: "p2", narrativa: "Cierre", opciones: [
      { texto: "Buena", feedback: "Correcto", puntos: 2, siguiente: "fin" },
      { texto: "Regular", feedback: "A medias", puntos: 1, siguiente: "fin" },
      { texto: "Mala", feedback: "Mal", puntos: 0, siguiente: "fin" }
    ] }
  ]
};

describe("motor de escenarios", () => {
  it("inicia en el primer paso sin puntos", () => {
    const estado = iniciarEscenario(escenario);
    expect(estado).toMatchObject({ escenarioId: "E-1", pasoId: "p1", puntos: 0, terminado: false });
    expect(pasoActual(escenario, estado).id).toBe("p1");
  });

  it("registra la decisión como pendiente sin avanzar", () => {
    let estado = decidir(escenario, iniciarEscenario(escenario), 0);
    expect(estado.pendiente.texto).toBe("Buena");
    expect(estado.puntos).toBe(2);
    expect(estado.pasoId).toBe("p1");
  });

  it("ignora decisiones si ya hay una pendiente o terminó", () => {
    let estado = decidir(escenario, iniciarEscenario(escenario), 0);
    expect(decidir(escenario, estado, 2)).toBe(estado);
  });

  it("avanza al paso siguiente al continuar", () => {
    let estado = continuar(escenario, decidir(escenario, iniciarEscenario(escenario), 0));
    expect(estado.pasoId).toBe("p2");
    expect(estado.pendiente).toBeNull();
  });

  it("cierra con rating exito con decisiones perfectas y XP por buenas decisiones", () => {
    let estado = decidir(escenario, iniciarEscenario(escenario), 0);
    estado = continuar(escenario, estado);
    estado = continuar(escenario, decidir(escenario, estado, 0));
    expect(estado.terminado).toBe(true);
    expect(estado.rating).toBe("exito");
    expect(xpDeEscenario(estado)).toBe(30);
  });

  it("cierra con rating parcial o fracaso según la calidad", () => {
    let estado = decidir(escenario, iniciarEscenario(escenario), 2);
    estado = continuar(escenario, estado);
    estado = continuar(escenario, decidir(escenario, estado, 2));
    expect(estado.rating).toBe("fracaso");
  });

  it("calcula ratings por porcentaje del máximo", () => {
    expect(ratingDe(4, 2)).toBe("exito");
    expect(ratingDe(2, 2)).toBe("parcial");
    expect(ratingDe(0, 2)).toBe("fracaso");
    expect(ratingDe(0, 0)).toBe("fracaso");
  });

  it("tolera índices inválidos", () => {
    const estado = iniciarEscenario(escenario);
    expect(decidir(escenario, estado, 9)).toBe(estado);
  });
});
