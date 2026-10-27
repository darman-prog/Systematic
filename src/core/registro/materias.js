// Registro de tracks de la app: MATERIAS (cursada) y LENGUAJES (spec 011).
// Solo guarda metadatos y conteos; la carga del contenido y la presentación vive en
// src/student/contenido.js. El dominio no conoce rutas de src/datos/ (ADR 011).
// tipo: clasifica el track para la UI y el mezclado (spec 011/012).
export const MATERIAS = [
  {
    id: "bd2",
    nombre: "Base de Datos 2",
    icono: "datos",
    descripcion: "SQL, modelado, índices, integridad y consultas.",
    color: "#9FC5DA",
    accentText: "#101418",
    tipo: "materia",
    // Lote 018: +30 preguntas (MongoDB P1-081–095, Neo4j P1-096–110) y +16 términos NoSQL.
    conteo: { preguntas: 120, terminos: 58, apuntes: 0, escenarios: 1, casos: 2 }
  },
  {
    id: "isw",
    nombre: "Ingeniería de Software",
    icono: "apuntes",
    descripcion: "Procesos, Scrum, requerimientos y diseño de software.",
    color: "#A094BA",
    accentText: "#101418",
    tipo: "materia",
    conteo: { preguntas: 98, terminos: 18, apuntes: 9, escenarios: 1, casos: 2 }
  },
  {
    id: "asw",
    nombre: "Arquitectura de Software",
    icono: "escenarios",
    descripcion: "POO, SOLID, patrones, estilos de arquitectura, REST y MVC.",
    color: "#FA9B9B",
    accentText: "#101418",
    tipo: "materia",
    // Lote 018: +45 preguntas (ASW-086–130), +24 términos y +3 apuntes (hexagonal, evolución, microservicios).
    conteo: { preguntas: 130, terminos: 51, apuntes: 11, escenarios: 1, casos: 2 }
  },
  {
    id: "infra",
    nombre: "Infraestructura",
    icono: "terminal",
    descripcion: "Comandos de Linux, permisos, SSH y redes Cisco.",
    color: "#7FC8B0",
    accentText: "#101418",
    tipo: "materia",
    conteo: { preguntas: 124, terminos: 45, apuntes: 6, escenarios: 5, casos: 0 }
  }
];

export function getMateria(id) {
  return MATERIAS.find(m => m.id === id) || null;
}

// Tracks de lenguaje (spec 011): misma infraestructura de contenido que las materias,
// pero con progresión por etapas/exámenes (competencia). Se mantienen separados de
// MATERIAS para no arrastrar el flujo de materia (config/quiz/stats) a su UI.
export const LENGUAJES = [
  {
    id: "lenguaje-ts",
    tipo: "lenguaje",
    nombre: "TypeScript",
    icono: "codigo",
    descripcion: "Leé y verificá código generado por IA: trazar, detectar y auditar.",
    color: "#6FA8DC",
    accentText: "#101418",
    conteo: { preguntas: 100, terminos: 16, apuntes: 0, escenarios: 0, casos: 0, etapas: 5 }
  },
  {
    id: "lenguaje-java",
    tipo: "lenguaje",
    nombre: "Java",
    icono: "codigo",
    descripcion: "Leé y auditá código Java generado por IA: POO, colecciones y concurrencia.",
    color: "#745e3b",
    accentText: "#101418",
    conteo: { preguntas: 100, terminos: 20, apuntes: 0, escenarios: 0, casos: 0, etapas: 5 }
  },
  {
    id: "lenguaje-python",
    tipo: "lenguaje",
    nombre: "Python",
    icono: "codigo",
    descripcion: "Leé y auditá código Python generado por IA: sintaxis, estructuras y asincronía.",
    color: "#ffde57",
    accentText: "#101418",
    conteo: { preguntas: 100, terminos: 23, apuntes: 0, escenarios: 0, casos: 0, etapas: 5 }
  }
];

export function getLenguaje(id) {
  return LENGUAJES.find(l => l.id === id) || null;
}

export const ACENTO_BASE = { color: "#9BB8C9", texto: "#101418" };

export function acentoDe(materia) {
  if (!materia) return ACENTO_BASE;
  return {
    color: materia.color || ACENTO_BASE.color,
    texto: materia.accentText || ACENTO_BASE.texto
  };
}

