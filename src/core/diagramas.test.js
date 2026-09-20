import { describe, it, expect } from "vitest";
import {
  SUBTIPOS, CONFIG_SUBTIPO, claveArista, normalizarClave, crearTablero, colocarNodo, quitarNodo,
  asignarMiembro, conectar, quitarConexion, evaluarDiagrama, esDirigido, ratingDiagrama, resumenDiagrama
} from "./diagramas.js";
import bd2Preguntas from "../datos/bd2/preguntas.js";
import iswPreguntas from "../datos/isw/preguntas.js";
import aswPreguntas from "../datos/asw/preguntas.js";
import bd2Casos from "../datos/bd2/casos.js";
import iswCasos from "../datos/isw/casos.js";
import aswCasos from "../datos/asw/casos.js";

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

describe("normalización de tipos y guardas", () => {
  it("compara tipos sin depender de acentos ni mayúsculas", () => {
    const pregunta = {
      id: "T-1",
      subtipo: "uml-clases",
      nodosPool: ["A", "B"],
      relacionesEsperadas: [{ de: "A", a: "B", tipo: "composicion" }]
    };
    let estado = crearTablero(pregunta);
    estado = colocarNodo(estado, "A");
    estado = colocarNodo(estado, "B");
    // La UI ofrece el tipo canonical con acento; el dato lo escribe sin acento.
    estado = conectar(estado, "A", "B", "composición", true);
    expect(evaluarDiagrama(pregunta, estado).ok).toBe(true);
  });

  it("normaliza guardas con acentos", () => {
    expect(normalizarClave("[sí]")).toBe(normalizarClave("[si]"));
    expect(normalizarClave("Transición")).toBe("transicion");
  });

  it("resumenDiagrama describe faltantes, sobrantes y miembros sin DOM", () => {
    const pregunta = {
      id: "T-2",
      subtipo: "uml-clases",
      nodosPool: ["A", "B"],
      miembrosPool: [{ texto: "m1", de: "A" }],
      relacionesEsperadas: [{ de: "A", a: "B", tipo: "herencia" }]
    };
    let estado = crearTablero(pregunta);
    estado = colocarNodo(estado, "A");
    estado = colocarNodo(estado, "B");
    estado = conectar(estado, "A", "B", "asociación", true); // tipo que no corresponde
    const res = evaluarDiagrama(pregunta, estado);
    const lineas = resumenDiagrama(res).join(" | ");
    expect(lineas).toContain("Faltan");
    expect(lineas).toContain("Sobran");
    expect(lineas).toContain("Miembros por ubicar: m1 → A");
  });
});

describe("contenido real resoluble (ISW/ASW/BD2)", () => {
  const diagramas = [...bd2Preguntas, ...iswPreguntas, ...aswPreguntas].filter(p => p.tipo === "diagrama");

  function resolver(pregunta) {
    let estado = crearTablero(pregunta);
    (pregunta.nodosPool || []).forEach(n => { estado = colocarNodo(estado, n); });
    const cfg = CONFIG_SUBTIPO[pregunta.subtipo] || CONFIG_SUBTIPO.er;
    const ofrecidos = Array.isArray(pregunta.tiposArista) && pregunta.tiposArista.length ? pregunta.tiposArista : cfg.tiposArista;
    const dirigido = esDirigido(pregunta.subtipo);
    (pregunta.relacionesEsperadas || []).forEach(r => {
      // La UI ofrece el label canonical; buscamos el equivalente normalizado al del dato.
      const tipo = ofrecidos.find(t => normalizarClave(t) === normalizarClave(r.tipo)) || r.tipo;
      estado = conectar(estado, r.de, r.a, tipo, dirigido, r.guarda);
    });
    (pregunta.miembrosPool || []).forEach(m => { estado = asignarMiembro(estado, m.texto, m.de); });
    return evaluarDiagrama(pregunta, estado);
  }

  it("detecta que hay diagramas que validar", () => {
    expect(diagramas.length).toBeGreaterThan(0);
  });

  diagramas.forEach(p => {
    it(`permite resolver ${p.id} tal como lo ofrece el lienzo`, () => {
      const res = resolver(p);
      expect(res.totalEsperado).toBeGreaterThan(0);
      expect({ faltantes: res.faltantes, sobrantes: res.sobrantes, ok: res.ok }).toEqual({ faltantes: 0, sobrantes: 0, ok: true });
    });
  });

  [...bd2Casos, ...iswCasos, ...aswCasos].forEach(c => {
    it(`permite resolver el caso ${c.id} tal como lo ofrece el lienzo`, () => {
      const res = resolver(c.diagrama);
      expect(res.totalEsperado).toBeGreaterThan(0);
      expect({ faltantes: res.faltantes, sobrantes: res.sobrantes, ok: res.ok }).toEqual({ faltantes: 0, sobrantes: 0, ok: true });
    });
  });
});
