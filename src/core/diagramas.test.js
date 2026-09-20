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

describe("diagramas UML con miembros", () => {
  const preguntaUML = {
    id: "ASW-031",
    subtipo: "uml-clases",
    nodosPool: ["Transaccion", "Tarjeta", "Transferencia"],
    miembrosPool: [
      { texto: "procesar()", de: "Transaccion" },
      { texto: "validarNumero()", de: "Tarjeta" },
      { texto: "codigoBanco", de: "Transferencia" }
    ],
    relacionesEsperadas: [
      { de: "Tarjeta", a: "Transaccion", tipo: "herencia" },
      { de: "Transferencia", a: "Transaccion", tipo: "herencia" }
    ]
  };

  it("coloca nodos y asigna miembros correctamente", () => {
    let estado = crearTablero(preguntaUML);
    estado = colocarNodo(estado, "Transaccion");
    estado = colocarNodo(estado, "Tarjeta");
    estado = colocarNodo(estado, "Transferencia");
    expect(estado.nodosColocados).toEqual(["Transaccion", "Tarjeta", "Transferencia"]);
    expect(estado.nodosDisponibles).toEqual([]);
    
    estado = asignarMiembro(estado, "procesar()", "Transaccion");
    estado = asignarMiembro(estado, "validarNumero()", "Tarjeta");
    estado = asignarMiembro(estado, "codigoBanco", "Transferencia");
    expect(estado.miembros["procesar()"]).toBe("Transaccion");
    expect(estado.miembros["validarNumero()"]).toBe("Tarjeta");
    expect(estado.miembros["codigoBanco"]).toBe("Transferencia");
  });

  it("evalúa diagrama UML con miembros correctamente", () => {
    let estado = crearTablero(preguntaUML);
    ["Transaccion", "Tarjeta", "Transferencia"].forEach(n => { estado = colocarNodo(estado, n); });
    estado = asignarMiembro(estado, "procesar()", "Transaccion");
    estado = asignarMiembro(estado, "validarNumero()", "Tarjeta");
    estado = asignarMiembro(estado, "codigoBanco", "Transferencia");
    estado = conectar(estado, "Tarjeta", "Transaccion", "herencia", true);
    estado = conectar(estado, "Transferencia", "Transaccion", "herencia", true);
    
    const res = evaluarDiagrama(preguntaUML, estado);
    expect(res.ok).toBe(true);
    expect(res.miembrosOk).toBe(3);
    expect(res.correctas).toBe(2);
  });
});

describe("diagramas de actividades con guardas", () => {
  const preguntaActividad = {
    id: "ISW-037",
    subtipo: "actividades",
    nodosPool: ["Validar", "Ejecutar", "Revertir"],
    nodosFijos: ["inicio", "fin"],
    relacionesEsperadas: [
      { de: "inicio", a: "Validar", tipo: "transicion" },
      { de: "Validar", a: "Ejecutar", tipo: "transicion", guarda: "[ok]" },
      { de: "Validar", a: "Revertir", tipo: "transicion", guarda: "[error]" },
      { de: "Ejecutar", a: "fin", tipo: "transicion" },
      { de: "Revertir", a: "fin", tipo: "transicion" }
    ]
  };

  it("coloca nodos fijos automáticamente y permite conectar con guardas", () => {
    let estado = crearTablero(preguntaActividad);
    expect(estado.nodosColocados).toEqual(["inicio", "fin"]);
    expect(estado.nodosDisponibles).toEqual(["Validar", "Ejecutar", "Revertir"]);
    
    estado = colocarNodo(estado, "Validar");
    estado = colocarNodo(estado, "Ejecutar");
    estado = colocarNodo(estado, "Revertir");
    
    estado = conectar(estado, "inicio", "Validar", "transicion", true);
    estado = conectar(estado, "Validar", "Ejecutar", "transicion", true, "[ok]");
    estado = conectar(estado, "Validar", "Revertir", "transicion", true, "[error]");
    estado = conectar(estado, "Ejecutar", "fin", "transicion", true);
    estado = conectar(estado, "Revertir", "fin", "transicion", true);
    
    const res = evaluarDiagrama(preguntaActividad, estado);
    expect(res.ok).toBe(true);
    expect(res.correctas).toBe(5);
  });

  it("distingue transiciones con diferentes guardas", () => {
    let estado = crearTablero(preguntaActividad);
    ["Validar", "Ejecutar", "Revertir"].forEach(n => { estado = colocarNodo(estado, n); });
    
    // Conectar con guarda incorrecta
    estado = conectar(estado, "Validar", "Ejecutar", "transicion", true, "[error]");
    estado = conectar(estado, "Validar", "Revertir", "transicion", true, "[ok]");
    
    const res = evaluarDiagrama(preguntaActividad, estado);
    expect(res.ok).toBe(false);
    expect(res.faltantes).toBeGreaterThan(0);
    expect(res.sobrantes).toBeGreaterThan(0);
  });
});
