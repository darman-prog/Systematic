import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { componerAcciones, crearAcciones } from "./index.js";

// Stubs mínimos: las fábricas devuelven funciones que solo se ejecutan al hacer clic.
const accionesStub = {
  misiones: { acciones: { irMisiones: () => {}, iniciarMision: () => {} } },
  escenarios: { acciones: { startEscenarios: () => {}, jugarEscenario: () => {}, decidirEscenario: () => {}, continuarEscenario: () => {} } },
  casos: { acciones: { startCasos: () => {}, jugarCaso: () => {}, comprobarCaso: () => {}, cancelarDiagramaTipoCaso: () => {} } }
};

function mapaCompleto() {
  return crearAcciones({
    acceso: {},
    practica: {},
    juego: accionesStub,
    navegacion: {
      dashboard: {
        acciones: {
          goHome: () => {}, irMaterias: () => {},
          seleccionarMateria: () => {}, seleccionarLenguaje: () => {}
        }
      },
      lenguaje: { acciones: { irLenguaje: () => {}, practicarLeccion: () => {}, rendirExamen: () => {} } },
      ajustes: {
        acciones: {
          clearHistory: () => {}, resetProgreso: () => {},
          exportarDatos: () => {}, importarArchivo: () => {}
        }
      }
    }
  });
}

describe("acciones", () => {
  it("compone mapas por feature", () => {
    const acciones = mapaCompleto();
    expect(typeof acciones.goHome).toBe("function");
    expect(typeof acciones.startCasos).toBe("function");
    expect(typeof acciones.exportarDatos).toBe("function");
  });

  it("falla ante una acción duplicada", () => {
    expect(() => componerAcciones({
      a: { x: () => {} },
      b: { x: () => {} }
    })).toThrow("Acción duplicada: x");
  });

  it("toda acción estática de index.html existe en el mapa", () => {
    const html = readFileSync(fileURLToPath(new URL("../../../index.html", import.meta.url)), "utf8");
    const acciones = mapaCompleto();
    const usadas = [...html.matchAll(/data-action="([^"]+)"/g)].map(m => m[1]);
    const faltantes = [...new Set(usadas)].filter(a => typeof acciones[a] !== "function");
    expect(faltantes).toEqual([]);
  });
});
