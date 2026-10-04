// Roadmap del track de Python (spec 011). Los nombres, el orden, el umbral y la
// versión de cada examen son DATOS (ADR 003), no código: agregar una etapa o renombrarla
// no toca src/core/. `version` invalida aprobados viejos si el examen se reescribe.
const roadmap = {
  lenguaje: "lenguaje-python",
  etapas: [
    {
      id: "fundamentos",
      nombre: "Fundamentos",
      lecciones: [
        { id: "fund-sintaxis", nombre: "Sintaxis y tipos", preguntas: ["PY-001", "PY-002", "PY-003", "PY-004"] },
        { id: "fund-referencias", nombre: "Mutabilidad y referencias", preguntas: ["PY-005", "PY-006", "PY-007", "PY-008"] }
      ],
      examen: { version: 1, umbral: 0.8, preguntas: ["PY-001", "PY-002", "PY-005", "PY-006", "PY-007", "PY-008"] }
    },
    {
      id: "estructuras",
      nombre: "Estructuras de datos",
      lecciones: [
        { id: "col-listas", nombre: "Listas y tuplas", preguntas: ["PY-009", "PY-010", "PY-011", "PY-012", "PY-013", "PY-014", "PY-015", "PY-016"] },
        { id: "col-dicts", nombre: "Diccionarios y sets", preguntas: ["PY-017", "PY-018", "PY-019", "PY-020", "PY-021", "PY-022", "PY-023", "PY-024"] },
        { id: "col-comprensiones", nombre: "Comprehensions y slicing", preguntas: ["PY-025", "PY-026", "PY-027", "PY-028", "PY-029", "PY-030"] }
      ],
      examen: { version: 1, umbral: 0.8, preguntas: ["PY-009", "PY-011", "PY-014", "PY-016", "PY-017", "PY-019", "PY-022", "PY-025", "PY-028", "PY-030"] }
    },
    {
      id: "funciones-poo",
      nombre: "Funciones y POO",
      lecciones: [
        { id: "fun-args", nombre: "Funciones y argumentos", preguntas: ["PY-031", "PY-032", "PY-033", "PY-034", "PY-035", "PY-036", "PY-037"] },
        { id: "fun-closures", nombre: "Closures y decoradores", preguntas: ["PY-038", "PY-039", "PY-040", "PY-041", "PY-042", "PY-043"] },
        { id: "poo-clases", nombre: "Clases, self y atributos", preguntas: ["PY-044", "PY-045", "PY-046", "PY-047", "PY-048", "PY-049", "PY-050"] },
        { id: "poo-herencia", nombre: "Herencia y dunders", preguntas: ["PY-051", "PY-052", "PY-053", "PY-054", "PY-055", "PY-056"] }
      ],
      examen: { version: 1, umbral: 0.8, preguntas: ["PY-031", "PY-032", "PY-035", "PY-038", "PY-040", "PY-044", "PY-047", "PY-051", "PY-052", "PY-056"] }
    },
    {
      id: "errores-concurrencia",
      nombre: "Errores, generators y concurrencia",
      lecciones: [
        { id: "err-excepciones", nombre: "Excepciones y context managers", preguntas: ["PY-057", "PY-058", "PY-059", "PY-060", "PY-061", "PY-062", "PY-063", "PY-064"] },
        { id: "err-generators", nombre: "Generators e iteradores", preguntas: ["PY-065", "PY-066", "PY-067", "PY-068", "PY-069", "PY-070", "PY-071"] },
        { id: "err-concurrencia", nombre: "Threading y asyncio", preguntas: ["PY-072", "PY-073", "PY-074", "PY-075", "PY-076", "PY-077", "PY-078"] }
      ],
      examen: { version: 1, umbral: 0.8, preguntas: ["PY-057", "PY-058", "PY-061", "PY-063", "PY-065", "PY-067", "PY-072", "PY-075", "PY-077", "PY-078"] }
    },
    {
      id: "auditoria",
      nombre: "Auditoría de código Python generado por IA",
      lecciones: [
        { id: "aud-bugs", nombre: "Bugs silenciosos", preguntas: ["PY-079", "PY-080", "PY-081", "PY-082", "PY-083", "PY-084", "PY-085", "PY-086", "PY-087"] },
        { id: "aud-apis", nombre: "APIs inventadas", preguntas: ["PY-088", "PY-089", "PY-090", "PY-091", "PY-092", "PY-093"] },
        { id: "aud-codigo", nombre: "Auditoría en acción", preguntas: ["PY-094", "PY-095", "PY-096", "PY-097", "PY-098", "PY-099", "PY-100"] }
      ],
      examen: { version: 1, umbral: 0.8, preguntas: ["PY-079", "PY-080", "PY-082", "PY-085", "PY-086", "PY-088", "PY-091", "PY-094", "PY-095", "PY-097", "PY-099", "PY-100"] }
    }
  ]
};

export default roadmap;