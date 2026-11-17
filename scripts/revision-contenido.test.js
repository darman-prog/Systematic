// El chequeo de calidad de contenido corre como test: si un lote nuevo introduce
// opciones duplicadas o explicaciones vacías, la suite falla. Los avisos (temas con
// pocas preguntas, enunciados repetidos) se informan pero no bloquean: se revisan a mano.
import { describe, it, expect } from "vitest";
import { MATERIAS, LENGUAJES } from "../src/core/index.js";
import { cargarContenido } from "../src/student/contenido.js";
import { analizarMateria, formatearPregunta, indicesCorrectos, auditarCalidadOpciones } from "./revision-contenido.mjs";

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

  // Tras la fase de calidad y enriquecimiento, el banco real no debe dejar avisos pendientes.
  it("no deja avisos de calidad en el banco real", async () => {
    const avisos = (await cargadas()).flatMap(m => analizarMateria(m).avisos);
    expect(avisos).toEqual([]);
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

  describe("auditarCalidadOpciones", () => {
    it("detecta desbalance extremo de longitud entre opciones", () => {
      const p = {
        id: "TEST-01",
        tipo: "multiple",
        q: "¿Qué es el polimorfismo?",
        options: [
          "Una técnica de herencia múltiple",
          "Permite que objetos de distintas clases respondan al mismo mensaje según su propia implementación específica en tiempo de ejecución",
          "Un patrón de diseño estructural"
        ],
        exp: "Explicación detallada con suficiente longitud para superar el mínimo de caracteres requeridos."
      };
      const avisos = auditarCalidadOpciones(p);
      expect(avisos.some(a => a.msg.includes("desbalance de longitud"))).toBe(true);
    });

    it("detecta opciones cliché como 'todas las anteriores'", () => {
      const p = {
        id: "TEST-02",
        tipo: "multiple",
        q: "¿Cuáles son ventajas de la arquitectura por capas?",
        options: ["Desacoplamiento", "Facilidad de prueba", "Todas las anteriores"],
        exp: "Explicación detallada con suficiente longitud para superar el mínimo de caracteres requeridos."
      };
      const avisos = auditarCalidadOpciones(p);
      expect(avisos.some(a => a.msg.includes("opción cliché"))).toBe(true);
    });

    it("detecta traducción errónea de backlog como 'el retraso'", () => {
      const p = {
        id: "TEST-03",
        tipo: "multiple",
        q: "En Scrum, ¿quién prioriza el retraso del producto?",
        options: ["Product Owner", "Scrum Master", "Developers"],
        exp: "El Product Owner gestiona el backlog del sprint y del producto con suficiente extensión."
      };
      const avisos = auditarCalidadOpciones(p);
      expect(avisos.some(a => a.msg.includes("traducción errónea de backlog"))).toBe(true);
    });

    it("detecta acoplamiento a números de paso de manual o diapositiva", () => {
      const p = {
        id: "TEST-04",
        tipo: "multiple",
        q: "En el paso 12 del manual de instalación, ¿qué comando se ejecuta?",
        options: ["apt update", "systemctl start nginx", "reboot"],
        exp: "Explicación adecuada con suficiente extensión explicativa sobre la instalación del paquete."
      };
      const avisos = auditarCalidadOpciones(p);
      expect(avisos.some(a => a.msg.includes("acoplado a numeración de pasos"))).toBe(true);
    });

    it("no emite avisos en preguntas con opciones equilibradas y vocabulario correcto", () => {
      const p = {
        id: "TEST-05",
        tipo: "multiple",
        q: "En Scrum, ¿cuál es el objetivo del Sprint Backlog?",
        options: [
          "Comprometer el trabajo acordado para el sprint actual",
          "Definir la visión de producto para el siguiente trimestre",
          "Evaluar las métricas individuales de cada desarrollador"
        ],
        exp: "El Sprint Backlog es el plan detallado de trabajo de los desarrolladores para alcanzar el Objetivo del Sprint."
      };
      const avisos = auditarCalidadOpciones(p);
      expect(avisos).toEqual([]);
    });

    it("analizarMateria integra los avisos pedagógicos cuando estrictoCalidad es true", () => {
      const materia = {
        id: "demo",
        preguntas: [
          {
            id: "DEMO-CLICHE",
            parcial: "P1",
            tema: "General",
            dificultad: "facil",
            tipo: "multiple",
            q: "¿Cuál es una ventaja de los microservicios?",
            options: ["Escalabilidad", "Despliegue independiente", "Todas las anteriores"],
            correct: 2,
            exp: "Explicación técnica suficiente para superar el mínimo requerido sin problemas de tamaño."
          }
        ]
      };
      const normal = analizarMateria(materia, { estrictoCalidad: false });
      expect(normal.avisos.some(a => a.msg.includes("opción cliché"))).toBe(false);

      const estricto = analizarMateria(materia, { estrictoCalidad: true });
      expect(estricto.avisos.some(a => a.msg.includes("opción cliché"))).toBe(true);
    });
  });
});
