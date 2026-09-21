import { describe, it, expect, beforeEach } from "vitest";
import { crearMezclador } from "./mezclador.js";

/* ── Banco de pruebas ── */
const bancoPruebas = [
  {
    id: "bd2",
    nombre: "BD2",
    preguntas: Array.from({ length: 20 }, (_, i) => ({
      id: `BD2-${i}`,
      tema: "SQL",
      tipo: "multiple",
      dificultad: ["facil", "media", "dificil"][i % 3],
    })),
  },
  {
    id: "isw",
    nombre: "ISW",
    preguntas: Array.from({ length: 15 }, (_, i) => ({
      id: `ISW-${i}`,
      tema: "Scrum",
      tipo: "vf",
      dificultad: ["facil", "media", "dificil"][i % 3],
    })),
  },
  {
    id: "asw",
    nombre: "ASW",
    preguntas: Array.from({ length: 10 }, (_, i) => ({
      id: `ASW-${i}`,
      tema: "SOLID",
      tipo: "multiple",
      dificultad: ["facil", "media", "dificil"][i % 3],
    })),
  },
];

const obtenerP = () => ({ ok: 0, fail: 0 });

describe("Mezclador", () => {
  let mezclador;

  beforeEach(() => {
    mezclador = crearMezclador({
      registro: bancoPruebas,
      obtenerP,
      store: { cargar: () => null, guardar: () => {} }, // memoria pura
    });
  });

  it("devuelve el tamaño solicitado", () => {
    const ronda = mezclador.siguienteRonda({ tamaño: 9 });
    expect(ronda).toHaveLength(9);
  });

  it("reparte equitativamente entre materias", () => {
    const ronda = mezclador.siguienteRonda({ tamaño: 9 });
    const porMateria = {};
    ronda.forEach(p => {
      // El id empieza con BD2-, ISW- o ASW-
      const prefijo = p.id.split("-")[0];
      porMateria[prefijo] = (porMateria[prefijo] || 0) + 1;
    });
    // 3 materias × 3 preguntas = 9 total
    expect(porMateria.BD2).toBe(3);
    expect(porMateria.ISW).toBe(3);
    expect(porMateria.ASW).toBe(3);
  });

  it("no repite preguntas dentro de la misma sesión", () => {
    const idsVistos = new Set();
    // 5 rondas × 9 preguntas = 45 preguntas
    for (let i = 0; i < 5; i++) {
      const ronda = mezclador.siguienteRonda({ tamaño: 9 });
      ronda.forEach(p => {
        expect(idsVistos.has(p.id)).toBe(false);
        idsVistos.add(p.id);
      });
    }
    // Deberíamos haber visto 45 preguntas distintas
    expect(idsVistos.size).toBe(45);
  });

  it("reinicia el ciclo de una materia cuando se agota", () => {
    // ASW solo tiene 10 preguntas. Pido 9 varias veces.
    const todasVistas = new Set();

    // Ronda 1: 3 de ASW (de las 10)
    let ronda = mezclador.siguienteRonda({ tamaño: 9 });
    ronda.filter(p => p.id.startsWith("ASW-")).forEach(p => todasVistas.add(p.id));
    expect(todasVistas.size).toBe(3);

    // Ronda 2: otras 3 (total 6)
    ronda = mezclador.siguienteRonda({ tamaño: 9 });
    ronda.filter(p => p.id.startsWith("ASW-")).forEach(p => todasVistas.add(p.id));
    expect(todasVistas.size).toBe(6);

    // Ronda 3: otras 3 (total 9)
    ronda = mezclador.siguienteRonda({ tamaño: 9 });
    ronda.filter(p => p.id.startsWith("ASW-")).forEach(p => todasVistas.add(p.id));
    expect(todasVistas.size).toBe(9);

    // Ronda 4: debería reiniciar el ciclo de ASW (1 vista = primera del nuevo ciclo)
    ronda = mezclador.siguienteRonda({ tamaño: 9 });
    const aswRonda4 = ronda.filter(p => p.id.startsWith("ASW-"));
    expect(aswRonda4).toHaveLength(3);
    // Al menos una debe ser repetida (el ciclo se reinició)
    const algunaRepetida = aswRonda4.some(p => todasVistas.has(p.id));
    expect(algunaRepetida).toBe(true);
  });

  it("permite dar más peso a una materia específica", () => {
    const ronda = mezclador.siguienteRonda({
      tamaño: 9,
      pesos: { bd2: 2, isw: 1, asw: 1 }, // BD2 pesa el doble
    });
    const porMateria = {};
    ronda.forEach(p => {
      const prefijo = p.id.split("-")[0];
      porMateria[prefijo] = (porMateria[prefijo] || 0) + 1;
    });
    // BD2 debería tener más preguntas que las otras
    expect(porMateria.BD2).toBeGreaterThan(porMateria.ISW);
    expect(porMateria.BD2).toBeGreaterThan(porMateria.ASW);
  });

  it("intercala las materias (no salen todas de una seguidas)", () => {
    const ronda = mezclador.siguienteRonda({ tamaño: 12 });
    const prefijos = ronda.map(p => p.id.split("-")[0]);

    // Cuenta rachas del mismo prefijo (no debe haber más de 3 seguidos)
    let rachaMax = 1, rachaActual = 1;
    for (let i = 1; i < prefijos.length; i++) {
      if (prefijos[i] === prefijos[i - 1]) {
        rachaActual++;
        rachaMax = Math.max(rachaMax, rachaActual);
      } else {
        rachaActual = 1;
      }
    }
    // Con 12 preguntas de 3 materias, es casi imposible que haya 4 iguales seguidas
    expect(rachaMax).toBeLessThan(4);
  });

  it("devuelve ronda vacía si no hay materias con preguntas", () => {
    const vacio = crearMezclador({
      registro: [{ id: "x", nombre: "X", preguntas: [] }],
      obtenerP,
      store: { cargar: () => null, guardar: () => {} },
    });
    expect(vacio.siguienteRonda({ tamaño: 10 })).toEqual([]);
  });

  it("expone el estado actual para stats", () => {
    mezclador.siguienteRonda({ tamaño: 6 });
    const estado = mezclador.estado();
    expect(estado.ciclos).toBeDefined();
    expect(estado.recientes).toBeDefined();
    expect(estado.recientes.length).toBe(6);
  });

  it("permite reiniciar manualmente el ciclo de una materia", () => {
    mezclador.siguienteRonda({ tamaño: 9 });
    const estadoAntes = mezclador.estado();
    expect(estadoAntes.ciclos.bd2.length).toBeGreaterThan(0);

    mezclador.reiniciarCiclo("bd2");
    const estadoDespues = mezclador.estado();
    expect(estadoDespues.ciclos.bd2).toEqual([]);
  });
});