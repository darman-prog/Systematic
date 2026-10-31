import { describe, it, expect } from "vitest";
import {
  evaluarEstadoTalentos,
  detectarNuevosTalentos,
  titulosDisponibles,
  calcularPoligonoRadar
} from "./talentos.js";

const ARBOL_MUESTRA = {
  ejes: ["Modelado", "Concurrencia", "Optimización", "Integridad", "NoSQL"],
  ramas: [
    {
      id: "rama-rendimiento",
      nombre: "Rendimiento y Consultas",
      descripcion: "Índices, planes y optimización.",
      nodos: [
        {
          id: "TAL-01",
          nombre: "Estratega de Índices",
          descripcion: "Diseña índices efectivos.",
          eje: "Optimización",
          puntosRadar: 50,
          titulo: "Optimizador SQL",
          misionesRequeridas: ["Índices"],
          minEstrellas: 2,
          bossId: "ESC-BD2-01",
          bossTipo: "escenario",
          talentoPrevioId: null
        },
        {
          id: "TAL-02",
          nombre: "Arquitecto de Planes",
          descripcion: "Domina planes complejos.",
          eje: "Optimización",
          puntosRadar: 50,
          titulo: "Maestro del Planificador",
          misionesRequeridas: ["Consultas"],
          minEstrellas: 2,
          bossId: "CASO-BD2-01",
          bossTipo: "caso",
          talentoPrevioId: "TAL-01"
        }
      ]
    },
    {
      id: "rama-nosql",
      nombre: "Datos Documentales y Grafos",
      descripcion: "MongoDB y Neo4j.",
      nodos: [
        {
          id: "TAL-03",
          nombre: "Modelador Políglota",
          descripcion: "Elige entre relacional, documental y grafos.",
          eje: "NoSQL",
          puntosRadar: 100,
          titulo: "Arquitecto NoSQL",
          misionesRequeridas: ["NoSQL"],
          minEstrellas: 1
        }
      ]
    }
  ]
};

describe("evaluarEstadoTalentos", () => {
  it("marca todos los nodos como bloqueados cuando no hay progreso", () => {
    const res = evaluarEstadoTalentos(ARBOL_MUESTRA, {}, {}, {});
    expect(res.totalNodos).toBe(3);
    expect(res.totalDesbloqueados).toBe(0);
    expect(res.ramas[0].nodos[0].estado).toBe("bloqueado");
    expect(res.ramas[0].nodos[1].estado).toBe("bloqueado");
    expect(res.ramas[1].nodos[0].estado).toBe("bloqueado");
  });

  it("pasa a listo_para_boss cuando se cumplen las misiones pero falta el escenario", () => {
    const misiones = { "Índices": { estrellas: 2, mejorPct: 80 } };
    const res = evaluarEstadoTalentos(ARBOL_MUESTRA, misiones, {}, {});
    const n1 = res.ramas[0].nodos[0];
    expect(n1.estado).toBe("listo_para_boss");
    expect(n1.requisitosCumplidos).toBe(true);
    expect(n1.bossOk).toBe(false);
    expect(n1.desbloqueado).toBe(false);
  });

  it("desbloquea el talento al cumplir misiones y superar la Boss Battle con éxito", () => {
    const misiones = { "Índices": { estrellas: 2, mejorPct: 85 } };
    const escenarios = { "ESC-BD2-01": { mejorRating: "exito", jugadas: 1 } };
    const res = evaluarEstadoTalentos(ARBOL_MUESTRA, misiones, escenarios, {});
    const n1 = res.ramas[0].nodos[0];
    expect(n1.estado).toBe("desbloqueado");
    expect(n1.desbloqueado).toBe(true);
    expect(res.totalDesbloqueados).toBe(1);
  });

  it("mantiene en listo_para_boss si la Boss Battle solo tuvo resultado parcial", () => {
    const misiones = { "Índices": { estrellas: 3, mejorPct: 100 } };
    const escenarios = { "ESC-BD2-01": { mejorRating: "parcial", jugadas: 2 } };
    const res = evaluarEstadoTalentos(ARBOL_MUESTRA, misiones, escenarios, {});
    expect(res.ramas[0].nodos[0].estado).toBe("listo_para_boss");
  });

  it("exige que el talento previo esté desbloqueado para habilitar el siguiente nivel", () => {
    const misiones = {
      "Consultas": { estrellas: 3, mejorPct: 100 }
    };
    const casos = { "CASO-BD2-01": { mejorRating: "exito", jugadas: 1 } };
    // Aunque tenga la misión y el caso de TAL-02, falta TAL-01.
    const res = evaluarEstadoTalentos(ARBOL_MUESTRA, misiones, {}, {}, casos);
    expect(res.ramas[0].nodos[1].estado).toBe("bloqueado");
    expect(res.ramas[0].nodos[1].previoOk).toBe(false);
  });

  it("desbloquea el segundo nivel cuando el primero ya fue persistido o superado", () => {
    const misiones = {
      "Consultas": { estrellas: 2, mejorPct: 80 }
    };
    const guardados = { "TAL-01": { fecha: 1700000000000 } };
    const casos = { "CASO-BD2-01": { mejorRating: "exito", jugadas: 1 } };
    const res = evaluarEstadoTalentos(ARBOL_MUESTRA, misiones, {}, guardados, casos);
    expect(res.ramas[0].nodos[0].desbloqueado).toBe(true);
    expect(res.ramas[0].nodos[1].desbloqueado).toBe(true);
    expect(res.totalDesbloqueados).toBe(2);
  });

  it("tolera entradas vacías o nulas sin lanzar errores", () => {
    const res = evaluarEstadoTalentos(null);
    expect(res).toEqual({ ejes: [], ramas: [], totalNodos: 0, totalDesbloqueados: 0 });
  });
});

describe("detectarNuevosTalentos y titulosDisponibles", () => {
  it("detecta únicamente los talentos recién desbloqueados que no estaban guardados", () => {
    const misiones = {
      "Índices": { estrellas: 2, mejorPct: 80 },
      "NoSQL": { estrellas: 1, mejorPct: 60 }
    };
    const escenarios = { "ESC-BD2-01": { mejorRating: "exito", jugadas: 1 } };
    const guardados = { "TAL-01": { fecha: 12345 } };

    const nuevos = detectarNuevosTalentos(ARBOL_MUESTRA, misiones, escenarios, guardados, {});
    expect(nuevos.map(n => n.id)).toEqual(["TAL-03"]);
  });

  it("lista los títulos profesionales de todos los talentos desbloqueados", () => {
    const misiones = { "NoSQL": { estrellas: 2, mejorPct: 90 } };
    const guardados = { "TAL-01": { fecha: 12345 } };
    const evaluado = evaluarEstadoTalentos(ARBOL_MUESTRA, misiones, {}, guardados, {});
    const titulos = titulosDisponibles(evaluado);
    expect(titulos).toEqual([
      { id: "TAL-01", titulo: "Optimizador SQL", nombreTalento: "Estratega de Índices", eje: "Optimización" },
      { id: "TAL-03", titulo: "Arquitecto NoSQL", nombreTalento: "Modelador Políglota", eje: "NoSQL" }
    ]);
  });
});

describe("calcularPoligonoRadar", () => {
  it("calcula porcentajes por eje y genera coordenadas SVG válidas", () => {
    const guardados = {
      "TAL-01": { fecha: 1 },
      "TAL-03": { fecha: 2 }
    };
    const evaluado = evaluarEstadoTalentos(ARBOL_MUESTRA, {}, {}, guardados, {});
    const radar = calcularPoligonoRadar(evaluado, { centro: 100, radioMax: 80 });

    expect(radar.ejes).toHaveLength(5);
    const opt = radar.ejes.find(e => e.eje === "Optimización");
    const nosql = radar.ejes.find(e => e.eje === "NoSQL");
    const modelado = radar.ejes.find(e => e.eje === "Modelado");

    // TAL-01 aporta 50 de 100 posibles en Optimización (50%).
    expect(opt?.pct).toBe(50);
    // TAL-03 aporta 100 de 100 posibles en NoSQL (100%).
    expect(nosql?.pct).toBe(100);
    // Modelado no tiene puntos obtenidos (0%).
    expect(modelado?.pct).toBe(0);

    expect(radar.points.split(" ")).toHaveLength(5);
    expect(radar.niveles).toHaveLength(3);
    expect(radar.resumenPct).toBe(30); // (0 + 0 + 50 + 0 + 100) / 5 = 30
  });

  it("devuelve estructura vacía si hay menos de 3 ejes", () => {
    const radar = calcularPoligonoRadar({ ejes: ["SoloUno"], ramas: [] });
    expect(radar.points).toBe("");
    expect(radar.ejes).toEqual([]);
  });
});
