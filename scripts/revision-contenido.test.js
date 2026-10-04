// El chequeo de calidad de contenido corre como test: si un lote nuevo introduce
// opciones duplicadas o explicaciones vacías, la suite falla. Los avisos (temas con
// pocas preguntas, enunciados repetidos) se informan pero no bloquean: se revisan a mano.
import { describe, it, expect } from "vitest";
import { MATERIAS, LENGUAJES, cargarContenido } from "../src/core/index.js";
import { analizarMateria, formatearPregunta, indicesCorrectos } from "./revision-contenido.mjs";

// Carga el contenido de cada track bajo demanda (spec 012) y lo fusiona con los metadatos.
async function cargadas() {
  const out = [];
  for (const m of [...MATERIAS, ...LENGUAJES]) out.push({ ...m, ...(await cargarContenido(m)) });
  return out;
}

describe("revisión de contenido", () => {
  it("no deja errores de calidad en ninguna materia", async () => {
    const errores = (await cargadas()).flatMap(m =>
      analizarMateria(m).avisos.filter(a => a.nivel === "error").map(a => `[${m.id}] ${a.id}: ${a.msg}`)
    );
    expect(errores).toEqual([]);
  });

  it("detecta avisos en el banco real (el chequeo no está ciego)", async () => {
    const avisos = (await cargadas()).flatMap(m => analizarMateria(m).avisos);
    expect(avisos.length).toBeGreaterThan(0);
  });

  it("detecta un enunciado repetido dentro del mismo tema", () => {
    const avisos = analizarMateria({
      id: "demo",
      preguntas: [
        { id: "DEMO-001", parcial: "P1", tema: "Único", dificultad: "facil", tipo: "multiple", q: "¿Qué hace ls?", options: ["a", "b"], correct: 0, exp: "x".repeat(80) },
        { id: "DEMO-002", parcial: "P1", tema: "Único", dificultad: "facil", tipo: "multiple", q: "¿Qué hace ls?", options: ["a", "b"], correct: 0, exp: "x".repeat(80) }
      ]
    }).avisos;
    expect(avisos.some(a => a.msg.includes("enunciado repetido"))).toBe(true);
  });

  it("detecta una explicación demasiado corta", () => {
    const avisos = analizarMateria({
      id: "demo",
      preguntas: [
        { id: "DEMO-003", parcial: "P1", tema: "Único", dificultad: "facil", tipo: "multiple", q: "¿Qué hace ls?", options: ["a", "b"], correct: 0, exp: "corta" }
      ]
    }).avisos;
    expect(avisos.some(a => a.msg.includes("explicación muy corta"))).toBe(true);
  });

  it("devuelve los índices correctos de multiple y de multi", () => {
    expect(indicesCorrectos({ tipo: "multiple", options: ["a", "b"], correct: 1 })).toEqual([1]);
    expect(indicesCorrectos({ tipo: "multi", options: ["a", "b", "c"], correctos: [0, 2] })).toEqual([0, 2]);
    expect(indicesCorrectos({ tipo: "desarrollo", solucion: "x" })).toEqual([]);
  });

  it("imprime la pregunta con la opción correcta marcada", () => {
    const texto = formatearPregunta(
      { id: "DEMO-004", parcial: "P1", tema: "T", dificultad: "facil", tipo: "multiple", q: "¿Qué?", options: ["a", "b"], correct: 0, exp: "porque <b>si</b>" },
      1
    );
    expect(texto).toContain("DEMO-004");
    expect(texto).toContain("* a");
    expect(texto).toContain("porque si");
  });
});
