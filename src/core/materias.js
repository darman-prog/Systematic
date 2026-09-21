// Registro de materias de la app. El contenido vive en src/datos/<materia>/.
import bd2Preguntas from "../datos/bd2/preguntas.js";
import bd2Glosario from "../datos/bd2/glosario.js";
import bd2Escenarios from "../datos/bd2/escenarios.js";
import bd2Casos from "../datos/bd2/casos.js";
import { topicColors as bd2TopicColors, sqlKeywords as bd2SqlKeywords } from "../datos/bd2/presentacion.js";
import iswPreguntas from "../datos/isw/preguntas.js";
import iswGlosario from "../datos/isw/glosario.js";
import iswApuntes from "../datos/isw/apuntes.js";
import iswEscenarios from "../datos/isw/escenarios.js";
import iswCasos from "../datos/isw/casos.js";
import aswPreguntas from "../datos/asw/preguntas.js";
import aswGlosario from "../datos/asw/glosario.js";
import aswApuntes from "../datos/asw/apuntes.js";
import aswEscenarios from "../datos/asw/escenarios.js";
import aswCasos from "../datos/asw/casos.js";

// accentText: color de texto sobre superficies pintadas con `color` (botones primarios).
// Los valores cumplen WCAG AA sobre su propio color de fondo.
export const MATERIAS = [
  {
    id: "bd2",
    nombre: "Base de Datos 2",
    icono: "datos",
    descripcion: "SQL, modelado, índices, integridad y consultas.",
    color: "#9FC5DA",
    accentText: "#F7F6F1",
    preguntas: bd2Preguntas,
    glosario: bd2Glosario,
    apuntes: [],
    escenarios: bd2Escenarios,
    casos: bd2Casos,
    topicColors: bd2TopicColors,
    sqlKeywords: bd2SqlKeywords
  },
  {
    id: "isw",
    nombre: "Ingeniería de Software",
    icono: "apuntes",
    descripcion: "Procesos, Scrum, requerimientos y diseño de software.",
    color: "#A094BA",
    accentText: "#E7E5DE",
    preguntas: iswPreguntas,
    glosario: iswGlosario,
    apuntes: iswApuntes,
    escenarios: iswEscenarios,
    casos: iswCasos
  },
  {
    id: "asw",
    nombre: "Arquitectura de Software",
    icono: "escenarios",
    descripcion: "POO, principios de diseño, SOLID y patrones.",
    color: "#FA9B9B",
    accentText: "#101418",
    preguntas: aswPreguntas,
    glosario: aswGlosario,
    apuntes: aswApuntes,
    escenarios: aswEscenarios,
    casos: aswCasos
  }
];

export function getMateria(id) {
  return MATERIAS.find(m => m.id === id) || null;
}

// Par de acento con fallbacks: nunca devuelve undefined aunque la materia
// no declare accentText o se llame con materia nula (pantalla de materias).
export const ACENTO_BASE = { color: "#9BB8C9", texto: "#101418" };

export function acentoDe(materia) {
  if (!materia) return ACENTO_BASE;
  return {
    color: materia.color || ACENTO_BASE.color,
    texto: materia.accentText || ACENTO_BASE.texto
  };
}

export function getRegistroParaMezclador() {
  return MATERIAS.map(materia => ({
    id: materia.id,
    nombre: materia.nombre,
    // Inyectamos materiaId en cada pregunta para trazabilidad en stats/logs
    preguntas: materia.preguntas.map(p => ({ ...p, materiaId: materia.id }))
  }));
}