// Registro de tracks de la app (materias hoy; lenguajes en el futuro, spec 011).
// Solo guarda metadatos y conteos: el contenido pesado (preguntas, glosario, apuntes,
// escenarios, casos) se carga bajo demanda desde src/datos/<id>/index.js (spec 012).
// Así el bundle inicial no embebe las ~337 KB de datos y cada track llega en su propio chunk.
import { topicColors as bd2TopicColors, sqlKeywords as bd2SqlKeywords } from "../datos/bd2/presentacion.js";

export async function cargarContenido(materia) {
  const mod = await materia.cargar();
  return {
    preguntas: mod.preguntas ?? [],
    glosario: mod.glosario ?? { categorias: [], terminos: [], tips: [] },
    apuntes: mod.apuntes ?? [],
    escenarios: mod.escenarios ?? [],
    casos: mod.casos ?? [],
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
    accentText: "#F7F6F1",
    tipo: "materia",
    conteo: { preguntas: 90, terminos: 42, apuntes: 0, escenarios: 1, casos: 2 },
    topicColors: bd2TopicColors,
    sqlKeywords: bd2SqlKeywords,
    cargar: () => import("../datos/bd2/index.js"),
  },
  {
    id: "isw",
    nombre: "Ingeniería de Software",
    icono: "apuntes",
    descripcion: "Procesos, Scrum, requerimientos y diseño de software.",
    color: "#A094BA",
    accentText: "#E7E5DE",
    tipo: "materia",
    conteo: { preguntas: 98, terminos: 18, apuntes: 9, escenarios: 1, casos: 2 },
    cargar: () => import("../datos/isw/index.js"),
  },
  {
    id: "asw",
    nombre: "Arquitectura de Software",
    icono: "escenarios",
    descripcion: "POO, principios de diseño, SOLID y patrones.",
    color: "#FA9B9B",
    accentText: "#101418",
    tipo: "materia",
    conteo: { preguntas: 48, terminos: 19, apuntes: 7, escenarios: 1, casos: 2 },
    cargar: () => import("../datos/asw/index.js"),
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
    cargar: () => import("../datos/infra/index.js"),
  }
];

export function getMateria(id) {
  return MATERIAS.find(m => m.id === id) || null;
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
