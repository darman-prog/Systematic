// Registro de tracks de la app: MATERIAS (cursada) y LENGUAJES (spec 011).
// Solo guarda metadatos y conteos: el contenido pesado (preguntas, glosario, apuntes,
// escenarios, casos) se carga bajo demanda desde src/datos/{materias,lenguajes}/<id>/index.js (spec 012).
// Así el bundle inicial no embebe las ~337 KB de datos y cada track llega en su propio chunk.
import { topicColors as bd2TopicColors, sqlKeywords as bd2SqlKeywords } from "../../datos/materias/bd2/presentacion.js";
import { tsKeywords } from "../../datos/lenguajes/ts/presentacion.js";
import { javaKeywords } from "../../datos/lenguajes/java/presentacion.js";
import { pythonKeywords } from "../../datos/lenguajes/python/presentacion.js";

export async function cargarContenido(materia) {
  const mod = await materia.cargar();
  return {
    preguntas: mod.preguntas ?? [],
    glosario: mod.glosario ?? { categorias: [], terminos: [], tips: [] },
    apuntes: mod.apuntes ?? [],
    escenarios: mod.escenarios ?? [],
    casos: mod.casos ?? [],
    // Solo los tracks de lenguaje declaran roadmap (spec 011).
    roadmap: mod.roadmap ?? null,
  };
}

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
    conteo: { preguntas: 90, terminos: 42, apuntes: 0, escenarios: 1, casos: 2 },
    topicColors: bd2TopicColors,
    sqlKeywords: bd2SqlKeywords,
    cargar: () => import("../../datos/materias/bd2/index.js"),
  },
  {
    id: "isw",
    nombre: "Ingeniería de Software",
    icono: "apuntes",
    descripcion: "Procesos, Scrum, requerimientos y diseño de software.",
    color: "#A094BA",
    accentText: "#101418",
    tipo: "materia",
    conteo: { preguntas: 98, terminos: 18, apuntes: 9, escenarios: 1, casos: 2 },
    cargar: () => import("../../datos/materias/isw/index.js"),
  },
  {
    id: "asw",
    nombre: "Arquitectura de Software",
    icono: "escenarios",
    descripcion: "POO, principios de diseño, SOLID y patrones.",
    color: "#FA9B9B",
    accentText: "#101418",
    tipo: "materia",
    conteo: { preguntas: 60, terminos: 19, apuntes: 8, escenarios: 1, casos: 2 },
    cargar: () => import("../../datos/materias/asw/index.js"),
  },
  {
    id: "infra",
    nombre: "Infraestructura",
    icono: "terminal",
    descripcion: "Comandos de Linux, permisos, SSH y redes Cisco.",
    color: "#7FC8B0",
    accentText: "#101418",
    tipo: "materia",
    conteo: { preguntas: 124, terminos: 45, apuntes: 6, escenarios: 5, casos: 0 },
    cargar: () => import("../../datos/materias/infra/index.js"),
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
    conteo: { preguntas: 100, terminos: 16, apuntes: 0, escenarios: 0, casos: 0, etapas: 5 },
    sqlKeywords: tsKeywords,
    cargar: () => import("../../datos/lenguajes/ts/index.js"),
    // Solo el roadmap (chunk chico) para calcular la barra del home sin cargar las preguntas.
    cargarRoadmap: () => import("../../datos/lenguajes/ts/roadmap.js").then(m => m.default),
  },
  {
    id: "lenguaje-java",
    tipo: "lenguaje",
    nombre: "Java",
    icono: "codigo",
    descripcion: "Leé y auditá código Java generado por IA: POO, colecciones y concurrencia.",
    color: "#745e3b",
    accentText: "#101418",
    conteo: { preguntas: 100, terminos: 20, apuntes: 0, escenarios: 0, casos: 0, etapas: 5 },
    sqlKeywords: javaKeywords,
    cargar: () => import("../../datos/lenguajes/java/index.js"),
    // Solo el roadmap (chunk chico) para calcular la barra del home sin cargar las preguntas.
    cargarRoadmap: () => import("../../datos/lenguajes/java/roadmap.js").then(m => m.default),
  },
  {
    id: "lenguaje-python",
    tipo: "lenguaje",
    nombre: "Python",
    icono: "codigo",
    descripcion: "Leé y auditá código Python generado por IA: sintaxis, estructuras y asincronía.",
    color: "#ffde57",
    accentText: "#101418",
    conteo: { preguntas: 100, terminos: 23, apuntes: 0, escenarios: 0, casos: 0, etapas: 5 },
    sqlKeywords: pythonKeywords,
    cargar: () => import("../../datos/lenguajes/python/index.js"),
    // Solo el roadmap (chunk chico) para calcular la barra del home sin cargar las preguntas.
    cargarRoadmap: () => import("../../datos/lenguajes/python/roadmap.js").then(m => m.default),
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

// Asíncrona: el contenido ya no vive en MATERIAS (spec 012).
export async function getRegistroParaMezclador() {
  const registros = [];
  for (const materia of MATERIAS) {
    const contenido = await cargarContenido(materia);
    registros.push({
      id: materia.id,
      nombre: materia.nombre,
      preguntas: contenido.preguntas.map(p => ({ ...p, materiaId: materia.id }))
    });
  }
  return registros;
}
