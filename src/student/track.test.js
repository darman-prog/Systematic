// Servicio de track activo: estado de materia/lenguaje, filtros y preguntas filtradas.
// La persistencia es un stub en memoria; el contenido se carga de verdad (spec 012) como en
// materias.test.js, y el progreso/obtenerP se inyectan como fakes.
import { describe, it, expect } from "vitest";
import { crearTrack } from "./track.js";
import { esDebil, filtrarDiagramas } from "../core/index.js";

const TIPOS = ["multiple", "multi", "vf", "codigo", "dragdrop", "ordenar", "desarrollo", "relacionar", "diagrama"];

function trackConBanco(obtenerP = () => ({}), competencia = {}) {
  const persistencia = {
    competencia: () => competencia,
    progreso: () => ({})
  };
  return crearTrack({ persistencia, TIPOS, esDebil, obtenerP, filtrarDiagramas, diagramasDisponibles: () => true });
}

describe("student/track", () => {
  it("seleccionarMateria con id inválido devuelve false y no toca el estado", async () => {
    const track = trackConBanco();
    expect(await track.seleccionarMateria("no-existe")).toBe(false);
    expect(track.materia).toBeNull();
    expect(track.banco).toEqual([]);
  });

  it("seleccionarMateria carga el banco e inicializa los filtros", async () => {
    const track = trackConBanco();
    expect(await track.seleccionarMateria("bd2")).toBe(true);
    expect(track.materia.id).toBe("bd2");
    expect(track.banco.length).toBeGreaterThan(0);
    expect(track.filtros.parciales.size).toBeGreaterThan(0);
    expect(track.filtros.tipos.size).toBe(TIPOS.length);
    // Con filtros recién inicializados, todo el banco pasa.
    expect(track.preguntasFiltradas()).toHaveLength(track.banco.length);
  });

  it("toggleFiltro quita y pone valores, y el filtrado lo refleja", async () => {
    const track = trackConBanco();
    await track.seleccionarMateria("bd2");
    track.toggleFiltro("dificultades", "facil");
    expect(track.filtros.dificultades.has("facil")).toBe(false);
    expect(track.preguntasFiltradas().every(q => q.dificultad !== "facil")).toBe(true);
    track.toggleFiltro("dificultades", "facil");
    expect(track.preguntasFiltradas()).toHaveLength(track.banco.length);
  });

  it("toggleFiltroTodos vacía y restaura una clave", async () => {
    const track = trackConBanco();
    await track.seleccionarMateria("bd2");
    track.toggleFiltroTodos("dificultades", false);
    expect(track.preguntasFiltradas()).toHaveLength(0);
    track.toggleFiltroTodos("dificultades", true);
    expect(track.preguntasFiltradas()).toHaveLength(track.banco.length);
  });

  it("setOpciones guarda soloDebiles y el filtrado usa obtenerP", async () => {
    // Todas las preguntas débiles salvo TS-XXX: obtenerP marca box 1 con un fallo.
    const track = trackConBanco(id => (id === "P1-001" ? { box: 1, ok: 0, fail: 1 } : { box: 5, ok: 3, fail: 0 }));
    await track.seleccionarMateria("bd2");
    track.setOpciones({ soloDebiles: true });
    const debiles = track.preguntasFiltradas();
    expect(debiles.map(q => q.id)).toEqual(["P1-001"]);
  });

  it("valoresDe y contarPor recorren el banco activo", async () => {
    const track = trackConBanco();
    await track.seleccionarMateria("bd2");
    const parciales = track.valoresDe("parciales");
    expect(parciales.length).toBeGreaterThan(0);
    const total = parciales.reduce((a, p) => a + track.contarPor("parciales", p), 0);
    expect(total).toBe(track.banco.length);
  });

  it("seleccionarLenguaje carga roadmap y itemsDeIds resuelve por id", async () => {
    const track = trackConBanco();
    expect(await track.seleccionarLenguaje("lenguaje-ts")).toBe(true);
    expect(track.lenguaje.id).toBe("lenguaje-ts");
    expect(track.banco.length).toBeGreaterThan(0);
    const ids = [track.banco[0].id, "no-existe"];
    expect(track.itemsDeIds(ids).map(q => q.id)).toEqual([track.banco[0].id]);
  });

  it("setCompetencia reemplaza el registro vigente", async () => {
    const track = trackConBanco();
    await track.seleccionarLenguaje("lenguaje-ts");
    track.setCompetencia({ fundamentos: { aprobado: true, version: 2 } });
    expect(track.competencia.fundamentos.aprobado).toBe(true);
  });
});
