// Registro de materias de la app. El contenido vive en src/datos/<materia>/.
import bd2Preguntas from "../datos/bd2/preguntas.js";
import bd2Glosario from "../datos/bd2/glosario.js";
import iswPreguntas from "../datos/isw/preguntas.js";
import iswGlosario from "../datos/isw/glosario.js";
import iswApuntes from "../datos/isw/apuntes.js";
import aswPreguntas from "../datos/asw/preguntas.js";
import aswGlosario from "../datos/asw/glosario.js";
import aswApuntes from "../datos/asw/apuntes.js";

export const MATERIAS = [
  {
    id: "bd2",
    nombre: "Base de Datos 2",
    icono: "🗄️",
    descripcion: "SQL, modelado, índices, integridad y consultas.",
    color: "#38bdf8",
    preguntas: bd2Preguntas,
    glosario: bd2Glosario,
    apuntes: []
  },
  {
    id: "isw",
    nombre: "Ingeniería de Software",
    icono: "📋",
    descripcion: "Procesos, Scrum, requerimientos y diseño de software.",
    color: "#a78bfa",
    preguntas: iswPreguntas,
    glosario: iswGlosario,
    apuntes: iswApuntes
  },
  {
    id: "asw",
    nombre: "Arquitectura de Software",
    icono: "🏛️",
    descripcion: "POO, principios de diseño, SOLID y patrones.",
    color: "#34d399",
    preguntas: aswPreguntas,
    glosario: aswGlosario,
    apuntes: aswApuntes
  }
];

export function getMateria(id) {
  return MATERIAS.find(m => m.id === id) || null;
}
