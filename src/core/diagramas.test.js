import { describe, it, expect } from "vitest";
import {
  SUBTIPOS, CONFIG_SUBTIPO, claveArista, normalizarClave, crearTablero, colocarNodo, quitarNodo,
  asignarMiembro, conectar, quitarConexion, evaluarDiagrama, esDirigido, esDirigidoTipo,
  validarConexion, ratingDiagrama, resumenDiagrama, resumenDiagramaAccesible, ratingDiagramaAccesible,
  planCorreccion, actualizarPosicion, nombreAccesible
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

describe("nombreAccesible", () => {
  it("remueve caracteres especiales", () => {
    expect(nombreAccesible("Clase<T>")).toBe("ClaseT");
    expect(nombreAccesible("get()")).toBe("get");
    expect(nombreAccesible("Clase::Test")).toBe("ClaseTest");
  });

  it("mantiene guiones y espacios", () => {
    expect(nombreAccesible("mi-clase")).toBe("mi-clase");
    expect(nombreAccesible("Clase Test")).toBe("Clase Test");
  });

  it("retorna fallback para nombres vacios", () => {
    expect(nombreAccesible("")).toBe("nodo sin nombre");
    expect(nombreAccesible(null, "miembro")).toBe("miembro sin nombre");
    expect(nombreAccesible(undefined)).toBe("nodo sin nombre");
  });

  it("acepta tipo personalizable", () => {
    expect(nombreAccesible("", "clase")).toBe("clase sin nombre");
    expect(nombreAccesible("", "relacion")).toBe("relacion sin nombre");
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

  it("crea una entrada de posicion al colocar", () => {
    let estado = crearTablero(preguntaER);
    estado = colocarNodo(estado, "Estudiante");
    expect(estado.posiciones).toHaveProperty("Estudiante");
    expect(typeof estado.posiciones["Estudiante"].x).toBe("number");
    expect(typeof estado.posiciones["Estudiante"].y).toBe("number");
  });

  it("asigna posiciones diferentes a nodos apilados horizontalmente", () => {
    let estado = crearTablero(preguntaER);
    estado = colocarNodo(estado, "Estudiante");
    estado = colocarNodo(estado, "Curso");
    expect(estado.posiciones["Estudiante"].y).toBe(estado.posiciones["Curso"].y);
    expect(estado.posiciones["Estudiante"].x).not.toBe(estado.posiciones["Curso"].x);
  });

  it("quitarNodo limpia conexiones y miembros asignados", () => {
    let estado = crearTablero(preguntaER);
    ["Estudiante", "Matricula"].forEach(n => { estado = colocarNodo(estado, n); });
    estado = conectar(estado, "Estudiante", "Matricula", "1:N", false);
    estado = quitarNodo(estado, [], "Matricula");
    expect(estado.conexiones).toEqual([]);
    expect(estado.nodosDisponibles).toContain("Matricula");
    expect(estado.posiciones).not.toHaveProperty("Matricula");
  });

  it("no permite quitar nodos fijos", () => {
    const pregunta = {
      id: "test-fijos",
      subtipo: "actividades",
      nodosFijos: ["inicio"],
      nodosPool: ["Accion"]
    };
    let estado = crearTablero(pregunta);
    const antes = estado.nodosColocados.slice();
    const resultado = quitarNodo(estado, ["inicio"], "inicio");
    expect(resultado.nodosColocados).toEqual(antes);
  });

  it("rechaza auto-conexiones y conexiones repetidas (ER)", () => {
    let estado = crearTablero(preguntaER);
    ["Estudiante", "Matricula"].forEach(n => { estado = colocarNodo(estado, n); });
    const base = conectar(estado, "Estudiante", "Estudiante", "1:1", false);
    expect(base).toBe(estado);
    const una = conectar(estado, "Estudiante", "Matricula", "1:N", false);
    expect(conectar(una, "Matricula", "Estudiante", "1:N", false)).toBe(una);
  });

  it("evalua correcto solo con el conjunto exacto", () => {
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

  it("asigna miembros solo a nodos colocados y puntua el conjunto", () => {
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

  it("detecta miembros mal asignados", () => {
    let estado = crearTablero(preguntaUML);
    ["Reporte", "Tabular"].forEach(n => { estado = colocarNodo(estado, n); });
    estado = asignarMiembro(estado, "generar()", "Tabular");
    const res = evaluarDiagrama(preguntaUML, estado);
    // "generar()" quedó en la clase equivocada y "titulo" sin asignar: el motor cuenta ambos.
    expect(res.miembrosMal).toBe(2);
    expect(res.miembrosOk).toBe(0);
  });

  it("desasignar miembro lo deja en null", () => {
    let estado = crearTablero(preguntaUML);
    ["Reporte", "Tabular"].forEach(n => { estado = colocarNodo(estado, n); });
    estado = asignarMiembro(estado, "generar()", "Reporte");
    expect(estado.miembros["generar()"]).toBe("Reporte");
    estado = asignarMiembro(estado, "generar()", null);
    expect(estado.miembros["generar()"]).toBeNull();
  });
});

describe("configuracion y rating", () => {
  it("expone los 4 subtipos con direccion definida", () => {
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

  it("evalua diagrama UML con miembros correctamente", () => {
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

  it("coloca nodos fijos automaticamente y permite conectar con guardas", () => {
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
    
    estado = conectar(estado, "Validar", "Ejecutar", "transicion", true, "[error]");
    estado = conectar(estado, "Validar", "Revertir", "transicion", true, "[ok]");
    
    const res = evaluarDiagrama(preguntaActividad, estado);
    expect(res.ok).toBe(false);
    expect(res.faltantes).toBeGreaterThan(0);
    expect(res.sobrantes).toBeGreaterThan(0);
  });
});

describe("planCorreccion", () => {
  const preguntaPlan = {
    id: "T-5",
    subtipo: "uml-clases",
    nodosPool: ["A", "B"],
    miembrosPool: [{ texto: "m1", de: "A" }],
    relacionesEsperadas: [{ de: "B", a: "A", tipo: "herencia" }]
  };

  it("convierte los errores en pasos accionables con recuento de aciertos", () => {
    let estado = crearTablero(preguntaPlan);
    estado = colocarNodo(estado, "A");
    estado = colocarNodo(estado, "B");
    estado = conectar(estado, "A", "B", "herencia", true); // dirección invertida → sobrante
    const plan = planCorreccion(evaluarDiagrama(preguntaPlan, estado));
    expect(plan.aciertos).toEqual({ correctas: 0, total: 2 });
    expect(plan.porCrear[0]).toBe("Crea: B → A (herencia)");
    expect(plan.porQuitar[0]).toBe("Elimina: A → B (herencia)");
    expect(plan.porMover[0]).toBe("Ubica: m1 → A");
  });

  it("con el diagrama completo no lista acciones", () => {
    let estado = crearTablero(preguntaPlan);
    estado = colocarNodo(estado, "A");
    estado = colocarNodo(estado, "B");
    estado = conectar(estado, "B", "A", "herencia", true);
    estado = asignarMiembro(estado, "m1", "A");
    const plan = planCorreccion(evaluarDiagrama(preguntaPlan, estado));
    expect(plan.aciertos).toEqual({ correctas: 2, total: 2 });
    expect(plan.porCrear).toEqual([]);
    expect(plan.porQuitar).toEqual([]);
    expect(plan.porMover).toEqual([]);
  });

  it("tolera resultados nulos o sin detalle", () => {
    expect(planCorreccion(null)).toEqual({ aciertos: null, porCrear: [], porQuitar: [], porMover: [] });
  });
});

describe("esDirigidoTipo", () => {
  it("asociacion es no dirigida en uml-clases y casos-uso", () => {
    expect(esDirigidoTipo("uml-clases", "asociación")).toBe(false);
    expect(esDirigidoTipo("casos-uso", "asociación")).toBe(false);
  });

  it("herencia, include y transicion son dirigidas", () => {
    expect(esDirigidoTipo("uml-clases", "herencia")).toBe(true);
    expect(esDirigidoTipo("casos-uso", "include")).toBe(true);
    expect(esDirigidoTipo("actividades", "transición")).toBe(true);
  });

  it("ER nunca es dirigido y normaliza acentos", () => {
    expect(esDirigidoTipo("er", "1:N")).toBe(false);
    expect(esDirigidoTipo("uml-clases", "Asociacion")).toBe(false);
  });

  it("asociacion bidireccional no se duplica: A-B y B-A colapsan en una conexion", () => {
    const pregunta = {
      id: "T-3",
      subtipo: "uml-clases",
      nodosPool: ["A", "B"],
      relacionesEsperadas: [{ de: "A", a: "B", tipo: "asociación" }]
    };
    let estado = crearTablero(pregunta);
    estado = colocarNodo(estado, "A");
    estado = colocarNodo(estado, "B");
    estado = conectar(estado, "A", "B", "asociación", false);
    estado = conectar(estado, "B", "A", "asociación", false);
    expect(estado.conexiones).toHaveLength(1);
    expect(evaluarDiagrama(pregunta, estado).ok).toBe(true);
  });

  it("auto-conexion con asociacion se rechaza por ser no dirigida", () => {
    const pregunta = { id: "T-4", subtipo: "uml-clases", nodosPool: ["A"], relacionesEsperadas: [] };
    let estado = crearTablero(pregunta);
    estado = colocarNodo(estado, "A");
    const resultado = validarConexion(estado, "A", "A", "asociación", false);
    expect(resultado.valida).toBe(false);
    expect(resultado.error).toBe("auto_conexion_no_dirigida");
  });
});

describe("normalizacion de tipos y guardas", () => {
  it("compara tipos sin depender de acentos ni mayusculas", () => {
    const pregunta = {
      id: "T-1",
      subtipo: "uml-clases",
      nodosPool: ["A", "B"],
      relacionesEsperadas: [{ de: "A", a: "B", tipo: "composicion" }]
    };
    let estado = crearTablero(pregunta);
    estado = colocarNodo(estado, "A");
    estado = colocarNodo(estado, "B");
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
    estado = conectar(estado, "A", "B", "asociación", true);
    const res = evaluarDiagrama(pregunta, estado);
    const lineas = resumenDiagrama(res).join(" | ");
    expect(lineas).toContain("Faltan");
    expect(lineas).toContain("Sobran");
    expect(lineas).toContain("Miembros por ubicar: m1");
  });
});

describe("actualizarPosicion", () => {
  it("actualiza la posicion de un nodo colocado", () => {
    let estado = crearTablero(preguntaER);
    estado = colocarNodo(estado, "Estudiante");
    estado = actualizarPosicion(estado, "Estudiante", 250, 150);
    expect(estado.posiciones["Estudiante"]).toEqual({ x: 250, y: 150 });
  });

  it("no modifica el estado si el nodo no esta colocado", () => {
    const estado = crearTablero(preguntaER);
    const resultado = actualizarPosicion(estado, "Inexistente", 100, 100);
    expect(resultado).toBe(estado);
  });

  it("redondea las coordenadas a enteros", () => {
    let estado = crearTablero(preguntaER);
    estado = colocarNodo(estado, "Estudiante");
    estado = actualizarPosicion(estado, "Estudiante", 100.7, 200.3);
    expect(estado.posiciones["Estudiante"]).toEqual({ x: 101, y: 200 });
  });

  it("permite mover un nodo multiples veces", () => {
    let estado = crearTablero(preguntaER);
    estado = colocarNodo(estado, "Estudiante");
    estado = actualizarPosicion(estado, "Estudiante", 100, 100);
    estado = actualizarPosicion(estado, "Estudiante", 200, 200);
    estado = actualizarPosicion(estado, "Estudiante", 300, 300);
    expect(estado.posiciones["Estudiante"]).toEqual({ x: 300, y: 300 });
  });
});

describe("quitarConexion", () => {
  it("elimina una conexion existente", () => {
    let estado = crearTablero(preguntaER);
    ["Estudiante", "Matricula"].forEach(n => { estado = colocarNodo(estado, n); });
    estado = conectar(estado, "Estudiante", "Matricula", "1:N", false);
    expect(estado.conexiones).toHaveLength(1);
    estado = quitarConexion(estado, "Estudiante", "Matricula", "1:N", false);
    expect(estado.conexiones).toHaveLength(0);
  });

  it("no falla si la conexion no existe", () => {
    let estado = crearTablero(preguntaER);
    const resultado = quitarConexion(estado, "A", "B", "1:N", false);
    expect(resultado.conexiones).toEqual([]);
  });

  it("solo elimina la conexion con el mismo tipo", () => {
    let estado = crearTablero(preguntaER);
    ["Estudiante", "Matricula"].forEach(n => { estado = colocarNodo(estado, n); });
    estado = conectar(estado, "Estudiante", "Matricula", "1:N", false);
    estado = conectar(estado, "Estudiante", "Matricula", "1:1", false);
    estado = quitarConexion(estado, "Estudiante", "Matricula", "1:N", false);
    expect(estado.conexiones).toHaveLength(1);
    expect(estado.conexiones[0].tipo).toBe("1:1");
  });

  it("con guardas paralelas, elimina solo la transicion con la guarda indicada", () => {
    let estado = crearTablero(preguntaER);
    ["Estudiante", "Matricula"].forEach(n => { estado = colocarNodo(estado, n); });
    estado = conectar(estado, "Estudiante", "Matricula", "transición", true, "[ok]");
    estado = conectar(estado, "Estudiante", "Matricula", "transición", true, "[error]");
    expect(estado.conexiones).toHaveLength(2);
    estado = quitarConexion(estado, "Estudiante", "Matricula", "transición", true, "[ok]");
    expect(estado.conexiones).toHaveLength(1);
    expect(estado.conexiones[0].guarda).toBe("[error]");
    // Sin guarda, elimina solo la conexión sin guarda del par.
    estado = conectar(estado, "Estudiante", "Matricula", "transición", true);
    expect(estado.conexiones).toHaveLength(2);
    estado = quitarConexion(estado, "Estudiante", "Matricula", "transición", true);
    expect(estado.conexiones).toHaveLength(1);
    expect(estado.conexiones[0].guarda).toBe("[error]");
  });
});

describe("validarConexion", () => {
  it("rechaza datos incompletos", () => {
    const estado = crearTablero(preguntaER);
    const resultado = validarConexion(estado, "", "B", "1:N", false);
    expect(resultado.valida).toBe(false);
    expect(resultado.error).toBe("datos_incompletos");
  });

  it("rechaza auto-conexion en diagramas no dirigidos", () => {
    const estado = crearTablero(preguntaER);
    const resultado = validarConexion(estado, "A", "A", "1:N", false);
    expect(resultado.valida).toBe(false);
    expect(resultado.error).toBe("auto_conexion_no_dirigida");
  });

  it("permite auto-conexion en diagramas dirigidos", () => {
    const estado = crearTablero(preguntaER);
    const resultado = validarConexion(estado, "A", "A", "herencia", true);
    expect(resultado.valida).toBe(true);
  });

  it("detecta conexion duplicada", () => {
    let estado = crearTablero(preguntaER);
    ["Estudiante", "Matricula"].forEach(n => { estado = colocarNodo(estado, n); });
    estado = conectar(estado, "Estudiante", "Matricula", "1:N", false);
    const resultado = validarConexion(estado, "Estudiante", "Matricula", "1:N", false);
    expect(resultado.valida).toBe(false);
    expect(resultado.error).toBe("conexion_duplicada");
  });

  it("retorna mensaje accesible para conexion valida", () => {
    const estado = crearTablero(preguntaER);
    const resultado = validarConexion(estado, "A", "B", "1:N", false);
    expect(resultado.valida).toBe(true);
    expect(typeof resultado.mensajeAccesible).toBe("string");
    expect(resultado.mensajeAccesible.length).toBeGreaterThan(0);
  });
});

describe("funciones accesibles", () => {
  it("resumenDiagramaAccesible retorna estructura con announcements para resultado correcto", () => {
    const res = { 
      ok: true, 
      correctas: 2, 
      totalEsperado: 2, 
      detalle: { 
        faltantes: [], 
        sobrantes: [], 
        miembrosMal: [],
        miembrosOk: []
      } 
    };
    const resumen = resumenDiagramaAccesible(res);
    expect(resumen.announcements).toHaveLength(1);
    expect(resumen.announcements[0].priority).toBe("assertive");
    expect(resumen.progress.correctas).toBe(2);
    expect(resumen.progress.porcentaje).toBe(100);
  });

  it("resumenDiagramaAccesible incluye errores en announcements", () => {
    const res = { 
      ok: false, 
      correctas: 1, 
      totalEsperado: 3, 
      detalle: { 
        faltantes: ["A - B (1:N)"], 
        sobrantes: ["C - D (1:1)"], 
        miembrosMal: ["m1 - X"],
        miembrosOk: []
      } 
    };
    const resumen = resumenDiagramaAccesible(res);
    expect(resumen.announcements.length).toBe(3);
    resumen.announcements.forEach(a => {
      expect(a.priority).toBe("polite");
      expect(typeof a.text).toBe("string");
    });
  });

  it("resumenDiagramaAccesible maneja entrada invalida", () => {
    const resumen = resumenDiagramaAccesible(null);
    expect(resumen.announcements).toEqual([]);
    expect(resumen.progress.correctas).toBe(0);
  });

  it("ratingDiagramaAccesible retorna objeto completo para exito", () => {
    const rating = ratingDiagramaAccesible(8, 10);
    expect(rating.nivel).toBe("exito");
    expect(rating.porcentaje).toBe(80);
    expect(typeof rating.accesible).toBe("string");
    expect(rating.accesible).toContain("80%");
    expect(typeof rating.progreso).toBe("string");
    expect(rating.progreso).toContain("8 de 10");
  });

  it("ratingDiagramaAccesible retorna parcial para 50-79%", () => {
    const rating = ratingDiagramaAccesible(6, 10);
    expect(rating.nivel).toBe("parcial");
    expect(rating.porcentaje).toBe(60);
  });

  it("ratingDiagramaAccesible retorna fracaso para menos del 50%", () => {
    const rating = ratingDiagramaAccesible(4, 10);
    expect(rating.nivel).toBe("fracaso");
    expect(rating.porcentaje).toBe(40);
  });

  it("ratingDiagramaAccesible maneja cero esperadas", () => {
    const rating = ratingDiagramaAccesible(0, 0);
    expect(rating.nivel).toBe("fracaso");
    expect(rating.porcentaje).toBe(0);
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
      const tipo = ofrecidos.find(t => normalizarClave(t) === normalizarClave(r.tipo)) || r.tipo;
      estado = conectar(estado, r.de, r.a, tipo, dirigido, r.guarda);
    });
    (pregunta.miembrosPool || []).forEach(m => { estado = asignarMiembro(estado, m.texto, m.de); });
    return evaluarDiagrama(pregunta, estado);
  }

  it("detecta que hay diagramas que validar", () => {
    expect(diagramas.length).toBeGreaterThan(0);
    expect(diagramas.every(d => d.subtipo)).toBe(true);
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