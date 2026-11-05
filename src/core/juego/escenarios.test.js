import { describe, it, expect } from "vitest";
import {
  iniciarEscenario, pasoActual, decidir, continuar, ratingDe, xpDeEscenario,
  narrativaDePaso, opcionesVisiblesDePaso, cambiarLente, alternarVariante,
  iniciarCorreccion, temasDebilesDeEscenario
} from "./escenarios.js";

const escenario = {
  id: "E-1",
  tema: "General",
  pasos: [
    {
      id: "p1",
      tema: "Arquitectura Hexagonal",
      narrativa: "Inicio",
      variantes: ["Inicio alternativo 1", "Inicio alternativo 2"],
      opciones: [
        { texto: "Buena", feedback: "Correcto", puntos: 2, siguiente: "p2" },
        { texto: "Regular", feedback: "A medias", puntos: 1, siguiente: "p2", autopsia: { incidente: "Inc 1", trampa: "Tra 1", principio: "Pri 1" } },
        { texto: "Mala", feedback: "Mal", puntos: 0, siguiente: "p2", autopsia: { incidente: "Inc 2", trampa: "Tra 2", principio: "Pri 2" } }
      ]
    },
    {
      id: "p2",
      tema: "Microservicios",
      narrativa: "Cierre",
      opciones: [
        { texto: "Buena", feedback: "Correcto", puntos: 2, siguiente: "fin" },
        { texto: "Regular", feedback: "A medias", puntos: 1, siguiente: "fin" },
        { texto: "Mala", feedback: "Mal", puntos: 0, siguiente: "fin" }
      ]
    }
  ]
};

describe("motor de escenarios", () => {
  it("inicia en el primer paso sin puntos y en modo estudio por defecto", () => {
    const estado = iniciarEscenario(escenario);
    expect(estado).toMatchObject({
      escenarioId: "E-1",
      pasoId: "p1",
      puntos: 0,
      terminado: false,
      modo: "estudio",
      lenteActivo: null,
      varianteIdx: 0
    });
    expect(pasoActual(escenario, estado).id).toBe("p1");
  });

  it("registra la decisión como pendiente sin avanzar en modo estudio", () => {
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

  it("en modo simulacro avanza de inmediato sin pausar en pendiente", () => {
    let estado = iniciarEscenario(escenario, { modo: "simulacro" });
    expect(estado.modo).toBe("simulacro");
    // Al decidir el paso 1, no queda en pendiente sino que avanza directamente a p2.
    estado = decidir(escenario, estado, 0);
    expect(estado.pasoId).toBe("p2");
    expect(estado.pendiente).toBeNull();
    expect(estado.terminado).toBe(false);

    // Al decidir el último paso en simulacro, cierra de inmediato.
    estado = decidir(escenario, estado, 0);
    expect(estado.terminado).toBe(true);
    expect(estado.rating).toBe("exito");
  });

  it("rota variantes de narrativa y conmuta lentes de análisis", () => {
    const paso = escenario.pasos[0];
    let estado = iniciarEscenario(escenario);
    expect(narrativaDePaso(paso, estado)).toBe("Inicio");

    estado = alternarVariante(estado);
    expect(narrativaDePaso(paso, estado)).toBe("Inicio alternativo 1");

    estado = alternarVariante(estado);
    expect(narrativaDePaso(paso, estado)).toBe("Inicio alternativo 2");

    estado = alternarVariante(estado);
    expect(narrativaDePaso(paso, estado)).toBe("Inicio");

    // Lentes
    estado = cambiarLente(estado, "negocio");
    expect(estado.lenteActivo).toBe("negocio");
    estado = cambiarLente(estado, "negocio");
    expect(estado.lenteActivo).toBeNull();
  });

  it("respeta ordenOpciones para anti-descarte al leer opciones y decidir", () => {
    const paso = escenario.pasos[0];
    const estadoConPermutacion = iniciarEscenario(escenario, {
      ordenOpciones: { p1: [2, 0, 1] }
    });

    const visibles = opcionesVisiblesDePaso(paso, estadoConPermutacion);
    expect(visibles[0].texto).toBe("Mala");
    expect(visibles[1].texto).toBe("Buena");
    expect(visibles[2].texto).toBe("Regular");

    // Al pulsar la opción visible 1 ("Buena", que en datos es índice 0), debe obtener 2 puntos.
    const res = decidir(escenario, estadoConPermutacion, 1);
    expect(res.pendiente.texto).toBe("Buena");
    expect(res.puntos).toBe(2);
  });

  it("iniciarCorreccion prepara una ronda focalizada solo con los pasos fallados y opciones permutadas", () => {
    // Jugamos fallando p1 (índice 2 = 0 pts) y acertando p2 (índice 0 = 2 pts).
    let estado = decidir(escenario, iniciarEscenario(escenario), 2);
    estado = continuar(escenario, estado);
    estado = continuar(escenario, decidir(escenario, estado, 0));
    expect(estado.rating).toBe("parcial");

    // Extraer temas débiles
    expect(temasDebilesDeEscenario(estado)).toEqual(["Arquitectura Hexagonal"]);

    // Iniciar corrección
    let corr = iniciarCorreccion(escenario, estado);
    expect(corr.modoCorreccion).toBe(true);
    expect(corr.pasoId).toBe("p1");
    expect(corr.puntos).toBe(2); // Conservó los 2 puntos de p2
    expect(corr.decisiones).toHaveLength(1);
    expect(corr.decisiones[0].pasoId).toBe("p2");
    // Comprueba que las opciones de p1 se desplazaron cíclicamente (anti-descarte)
    expect(corr.ordenOpciones.p1).toEqual([1, 2, 0]);

    // En la corrección, la opción en índice visible 2 corresponde ahora a datos[0] ("Buena").
    corr = decidir(escenario, corr, 2);
    expect(corr.pendiente.texto).toBe("Buena");
    corr = continuar(escenario, corr);

    // Como p1 era el único fallo, la corrección termina consolidando ambas decisiones y logra éxito.
    expect(corr.terminado).toBe(true);
    expect(corr.puntos).toBe(4);
    expect(corr.rating).toBe("exito");
  });
});
