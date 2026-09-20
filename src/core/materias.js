// Registro de materias de la app. El contenido vive en src/datos/<materia>/.
import bd2Preguntas from "../datos/bd2/preguntas.js";
import bd2Glosario from "../datos/bd2/glosario.js";
import bd2Escenarios from "../datos/bd2/escenarios.js";
import { topicColors as bd2TopicColors, sqlKeywords as bd2SqlKeywords } from "../datos/bd2/presentacion.js";
import iswPreguntas from "../datos/isw/preguntas.js";
import iswGlosario from "../datos/isw/glosario.js";
import iswApuntes from "../datos/isw/apuntes.js";
import iswEscenarios from "../datos/isw/escenarios.js";
import aswPreguntas from "../datos/asw/preguntas.js";
import aswGlosario from "../datos/asw/glosario.js";
import aswApuntes from "../datos/asw/apuntes.js";
import aswEscenarios from "../datos/asw/escenarios.js";

export const MATERIAS = [
  {
    id: "bd2",
    nombre: "Base de Datos 2",
    icono: "🗄️",
    descripcion: "SQL, modelado, índices, integridad y consultas.",
    color: "#9BB8C9",
    preguntas: bd2Preguntas,
    glosario: bd2Glosario,
    apuntes: [],
    escenarios: bd2Escenarios,
    topicColors: bd2TopicColors,
    sqlKeywords: bd2SqlKeywords
  },
  {
    id: "isw",
    nombre: "Ingeniería de Software",
    icono: "📋",
    descripcion: "Procesos, Scrum, requerimientos y diseño de software.",
    color: "#B5A9CF",
    preguntas: iswPreguntas,
    glosario: iswGlosario,
    apuntes: iswApuntes,
    escenarios: iswEscenarios
  },
  {
    id: "asw",
    nombre: "Arquitectura de Software",
    icono: "🏛️",
    descripcion: "POO, principios de diseño, SOLID y patrones.",
    color: "#9FBEA9",
    preguntas: aswPreguntas,
    glosario: aswGlosario,
    apuntes: aswApuntes,
    escenarios: aswEscenarios
  }
];

export function getMateria(id) {
  return MATERIAS.find(m => m.id === id) || null;
}
