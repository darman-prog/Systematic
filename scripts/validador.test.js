import { describe, it, expect } from "vitest";
import { validarPregunta, validarGlosario, validarApuntes, validarEscenarios, validarTodo } from "./validador.mjs";

const base = {
  id: "X-001",
  parcial: "Parcial 1",
  tema: "Tema",
  dificultad: "media",
  tipo: "multiple",
  q: "¿Pregunta?",
  options: ["A", "B"],
  correct: 0,
  exp: "Explicación"
};

describe("validarPregunta", () => {
  it("acepta una pregunta correcta", () => {
    expect(validarPregunta(base, new Set())).toEqual([]);
  });

  it("detecta id duplicado e inválido", () => {
    const ids = new Set(["X-001"]);
    expect(validarPregunta(base, ids).join(" ")).toContain("id duplicado");
    expect(validarPregunta({ ...base, id: "mal_id" }, new Set()).join(" ")).toContain("formato inesperado");
    expect(validarPregunta({ ...base, id: "PR-01" }, new Set())).toEqual([]);
  });

  it("detecta correct fuera de rango y options duplicadas", () => {
    expect(validarPregunta({ ...base, correct: 5 }, new Set()).join(" ")).toContain("correct fuera de rango");
    expect(validarPregunta({ ...base, options: ["A", "A"] }, new Set()).join(" ")).toContain("options con textos duplicados");
  });

  it("valida multi: índices fuera de rango y repetidos", () => {
    const multi = { ...base, tipo: "multi", options: ["A", "B", "C"], correctos: [0, 3, 3], correct: undefined };
    const errores = validarPregunta(multi, new Set()).join(" ");
    expect(errores).toContain("correctos fuera de rango: 3");
    expect(errores).toContain("correctos con índices repetidos");
  });

  it("valida dragdrop: piezas/respuestas y marcadores {n}", () => {
    const drag = {
      ...base, tipo: "dragdrop", options: undefined, correct: undefined,
      piezas: ["uno", "dos"], respuestas: ["uno", "dos"], codigo: "SELECT {1} FROM t WHERE x = {1}"
    };
    const errores = validarPregunta(drag, new Set()).join(" ");
    expect(errores).toContain("faltan marcadores {n} en codigo: 2");
    expect(errores).toContain("marcadores {n} repetidos: 1");

    const menosPiezas = { ...drag, piezas: ["uno"], respuestas: ["uno", "dos"], codigo: "SELECT {1} FROM t WHERE x = {2}" };
    expect(validarPregunta(menosPiezas, new Set()).join(" ")).toContain("menos piezas que respuestas");

    const conDistractores = { ...drag, piezas: ["uno", "dos", "tres"], respuestas: ["uno", "dos"], codigo: "SELECT {1} FROM t WHERE x = {2}" };
    expect(validarPregunta(conDistractores, new Set())).toEqual([]);
  });

  it("valida desarrollo sin solucion", () => {
    const dev = { ...base, tipo: "desarrollo", options: undefined, correct: undefined };
    expect(validarPregunta(dev, new Set()).join(" ")).toContain("falta solucion");
  });
});

describe("validarGlosario", () => {
  it("acepta un glosario correcto y detecta categoría inexistente", () => {
    const ok = { categorias: [{ id: "dml", nombre: "DML" }], terminos: [{ termino: "INSERT", categoria: "dml", definicion: "..." }], tips: [] };
    expect(validarGlosario(ok)).toEqual([]);
    const malo = { ...ok, terminos: [{ termino: "X", categoria: "otra", definicion: "..." }] };
    expect(validarGlosario(malo).join(" ")).toContain("categoría inexistente");
  });
});

describe("validarApuntes", () => {
  it("detecta fuente inexistente con el verificador inyectado", () => {
    const apuntes = [{ id: "A-1", tema: "T", titulo: "Título", contenido: "# Hola", fuente: "no-existe.md" }];
    const existe = f => f === "existe.md";
    expect(validarApuntes(apuntes, { existeFuente: existe }).join(" ")).toContain("fuente inexistente");
    expect(validarApuntes([{ ...apuntes[0], fuente: "existe.md" }], { existeFuente: existe })).toEqual([]);
  });
});

describe("validarEscenarios", () => {
  const ok = {
    id: "ESC-1", titulo: "T", tema: "Caso", intro: "I",
    pasos: [
      { id: "p1", narrativa: "N1", opciones: [
        { texto: "A", feedback: "F", puntos: 2, siguiente: "p2" },
        { texto: "B", feedback: "F", puntos: 0, siguiente: "fin" }
      ] },
      { id: "p2", narrativa: "N2", opciones: [
        { texto: "A", feedback: "F", puntos: 1, siguiente: "fin" },
        { texto: "B", feedback: "F", puntos: 0, siguiente: "fin" }
      ] }
    ],
    finales: { exito: "E", parcial: "P", fracaso: "F" }
  };

  it("acepta un escenario correcto", () => {
    expect(validarEscenarios([ok])).toEqual([]);
  });

  it("detecta enlaces a pasos inexistentes y duplicados", () => {
    const roto = JSON.parse(JSON.stringify(ok));
    roto.pasos[0].opciones[0].siguiente = "pX";
    const errores = validarEscenarios([roto, ok]).join(" ");
    expect(errores).toContain("paso inexistente: pX");
    expect(errores).toContain("duplicado");
  });

  it("exige al menos 2 opciones con puntos 0-2 y finales completos", () => {
    const malo = JSON.parse(JSON.stringify(ok));
    malo.pasos[0].opciones = [
      { texto: "A", feedback: "F", puntos: 5, siguiente: "fin" },
      { texto: "B", feedback: "F", puntos: 0, siguiente: "fin" }
    ];
    malo.finales = { exito: "E" };
    const errores = validarEscenarios([malo]).join(" ");
    expect(errores).toContain("puntos inválidos");
    expect(errores).toContain("finales incompletos");
  });
});

describe("validarTodo", () => {
  it("acumula resumen y detecta ids duplicados entre materias", () => {
    const materia = { id: "m1", nombre: "Materia", preguntas: [base], glosario: { categorias: [], terminos: [], tips: [] } };
    const { errores, resumen } = validarTodo([materia, { ...materia, id: "m2" }]);
    expect(errores.join(" ")).toContain("id duplicado");
    expect(resumen).toEqual({ materias: 2, preguntas: 2, terminos: 0 });
  });
});
