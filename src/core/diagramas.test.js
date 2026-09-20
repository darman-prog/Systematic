import { describe, it, expect } from "vitest";
import {
  SUBTIPOS, CONFIG_SUBTIPO, claveArista, crearTablero, colocarNodo, quitarNodo,
  asignarMiembro, conectar, quitarConexion, evaluarDiagrama, esDirigido, ratingDiagrama
} from "./diagramas.js";

const preguntaER = {
  id: "P1-078",
  subtipo: "er",
  nodosPool: ["Estudiante", "Curso", "Matricula"],
  relacionesEsperadas: [
    { de: "Estudiante", a: "Matricula", tipo: "1:N" },
    { de: "Curso", a: "Matricula", tipo: "1:N" }
  ],
  tiposArista: ["1:1", "1:N", "N:M"]
};

describe("claveArista", () => {
  it("ER ignora el orden de los extremos", () => {
    expect(claveArista("A", "B", "1:N", false)).toBe(claveArista("B", "A", "1:N", false));
  });

  it("subtipos dirigidos respetan el orden", () => {
    expect(claveArista("A", "B", "herencia", true)).not.toBe(claveArista("B", "A", "herencia", true));
  });
});

describe("tablero ER", () => {
  it("coloca sin duplicar y respeta el pool", () => {
    let estado = crearTablero(preguntaER);
    estado = colocarNodo(estado, "Estudiante");
    expect(estado.nodosColocados).toEqual(["Estudiante"]);
    expect(colocarNodo(estado, "Estudiante")).toBe(estado);
    expect(colocarNodo(estado, "Inexistente")).toBe(estado);
  });

  it("quitarNodo limpia conexiones y miembros asignados", () => {
    let estado = crearTablero(preguntaER);
    ["Estudiante", "Matricula"].forEach(n => { estado = colocarNodo(estado, n); });
    estado = conectar(estado, "Estudiante", "Matricula", "1:N", false);
    estado = quitarNodo(estado, [], "Matricula");
    expect(estado.conexiones).toEqual([]);
    expect(estado.nodosDisponibles).toContain("Matricula");
  });

  it("rechaza auto-conexiones y conexiones repetidas (ER)", () => {
    let estado = crearTablero(preguntaER);
    ["Estudiante", "Matricula"].forEach(n => { estado = colocarNodo(estado, n); });
    const base = conectar(estado, "Estudiante", "Estudiante", "1:1", false);
    expect(base).toBe(estado);
    const una = conectar(estado, "Estudiante", "Matricula", "1:N", false);
    expect(conectar(una, "Matricula", "Estudiante", "1:N", false)).toBe(una);
  });

  it("evalúa correcto solo con el conjunto exacto", () => {
    let estado = crearTablero(preguntaER);
    ["Estudiante", "Curso", "Matricula"].forEach(n => { estado = colocarNodo(estado, n); });
    estado = conectar(estado, "Estudiante", "Matricula", "1:N", false);
    estado = conectar(estado, "Curso", "Matricula", "1:N", false);
    const res = evaluarDiagrama(preguntaER, estado);
    expect(res).toMatchObject({ ok: true, correctas: 2, sobrantes: 0, faltantes: 0, totalEsperado: 2 });
  });

  it("detecta faltantes y sobrantes", () => {
    let estado = crearTablero(preguntaER);
    ["Estudiante", "Curso", "Matricula"].forEach(n => { estado = colocarNodo(estado, n); });
    estado = conectar(estado, "Estudiante", "Matricula", "1:N", false);
    estado = conectar(estado, "Estudiante", "Curso", "1:1", false);
    const res = evaluarDiagrama(preguntaER, estado);
    expect(res.ok).toBe(false);
    expect(res.faltantes).toBe(1);
    expect(res.sobrantes).toBe(1);
  });
});

describe("miembros de clase (H6b)", () => {
  const preguntaUML = {
    id: "ASW-101",
    subtipo: "uml-clases",
    nodosPool: ["Reporte", "Tabular"],
    miembrosPool: [
      { texto: "generar()", de: "Reporte" },
      { texto: "titulo", de: "Tabular" }
    ],
    relacionesEsperadas: [{ de: "Tabular", a: "Reporte", tipo: "herencia" }],
    tiposArista: ["herencia", "asociación", "composición", "agregación"]
  };

  it("asigna miembros solo a nodos colocados y puntúa el conjunto", () => {
    const vacio = crearTablero(preguntaUML);
    expect(asignarMiembro(vacio, "generar()", "Reporte")).toBe(vacio);
    expect(asignarMiembro(vacio, "inexistente", null)).toBe(vacio);
    let estado = crearTablero(preguntaUML);
    ["Reporte", "Tabular"].forEach(n => { estado = colocarNodo(estado, n); });
    estado = asignarMiembro(estado, "generar()", "Tabular");
    estado = asignarMiembro(estado, "titulo", "Tabular");
    estado = conectar(estado, "Tabular", "Reporte", "herencia", true);
    const res = evaluarDiagrama(preguntaUML, estado);
    expect(res.miembrosOk).toBe(1);
    expect(res.ok).toBe(false);
    expect(res.sobrantes).toBe(1);
  });
});

describe("configuración y rating", () => {
  it("expone los 4 subtipos con dirección definida", () => {
    expect(SUBTIPOS).toEqual(["er", "uml-clases", "casos-uso", "actividades"]);
    expect(CONFIG_SUBTIPO.er.dirigido).toBe(false);
    expect(esDirigido("casos-uso")).toBe(true);
    expect(esDirigido("rara")).toBe(false);
  });

  it("rating por porcentaje de aciertos", () => {
    expect(ratingDiagrama(8, 10)).toBe("exito");
    expect(ratingDiagrama(5, 10)).toBe("parcial");
    expect(ratingDiagrama(4, 10)).toBe("fracaso");
    expect(ratingDiagrama(0, 0)).toBe("fracaso");
  });
});
