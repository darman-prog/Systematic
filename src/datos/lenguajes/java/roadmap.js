// Roadmap del track de Java (spec 011). Los nombres, el orden, el umbral y la
// versión de cada examen son DATOS (ADR 003), no código: agregar una etapa o renombrarla
// no toca src/core/. `version` invalida aprobados viejos si el examen se reescribe.
const roadmap = {
  lenguaje: "lenguaje-java",
  etapas: [
    {
      id: "fundamentos",
      nombre: "Fundamentos",
      lecciones: [
        { id: "fund-tipos", nombre: "Tipos primitivos vs objetos", preguntas: ["JV-001", "JV-002", "JV-003", "JV-036"] },
        { id: "fund-control", nombre: "Control de flujo", preguntas: ["JV-004", "JV-037"] }
      ],
      examen: { version: 1, umbral: 0.8, preguntas: ["JV-001", "JV-002", "JV-003", "JV-004", "JV-036", "JV-037"] }
    },
    {
      id: "poo",
      nombre: "Programación Orientada a Objetos",
      lecciones: [
        { id: "poo-clases", nombre: "Clases y objetos", preguntas: ["JV-005", "JV-038", "JV-039", "JV-049"] },
        { id: "poo-encapsulamiento", nombre: "Encapsulamiento", preguntas: ["JV-006", "JV-040", "JV-050"] },
        { id: "poo-herencia", nombre: "Herencia y polimorfismo", preguntas: ["JV-007", "JV-008", "JV-041", "JV-042", "JV-047", "JV-048"] },
        { id: "poo-interfaces", nombre: "Interfaces y abstractas", preguntas: ["JV-009", "JV-010", "JV-011", "JV-012", "JV-043", "JV-044", "JV-045", "JV-046"] }
      ],
      examen: { version: 1, umbral: 0.8, preguntas: ["JV-005", "JV-007", "JV-009", "JV-011", "JV-038", "JV-040", "JV-042", "JV-044", "JV-046", "JV-048"] }
    },
    {
      id: "colecciones",
      nombre: "Colecciones y Streams",
      lecciones: [
        { id: "col-listas", nombre: "List, Set y Map", preguntas: ["JV-013", "JV-014", "JV-015", "JV-051", "JV-052", "JV-053"] },
        { id: "col-streams", nombre: "Stream API", preguntas: ["JV-016", "JV-017", "JV-054", "JV-055", "JV-059", "JV-060"] },
        { id: "col-opcionales", nombre: "Optional y lambdas", preguntas: ["JV-018", "JV-019", "JV-020", "JV-056", "JV-057", "JV-058"] }
      ],
      examen: { version: 1, umbral: 0.8, preguntas: ["JV-013", "JV-016", "JV-018", "JV-051", "JV-052", "JV-054", "JV-055", "JV-057", "JV-059", "JV-060"] }
    },
    {
      id: "excepciones",
      nombre: "Excepciones y Concurrencia",
      lecciones: [
        { id: "exc-trycatch", nombre: "try-catch-finally", preguntas: ["JV-021", "JV-022", "JV-023", "JV-024", "JV-061", "JV-062", "JV-063", "JV-064", "JV-071"] },
        { id: "exc-threads", nombre: "Threads y ExecutorService", preguntas: ["JV-025", "JV-026", "JV-027", "JV-065", "JV-066", "JV-067", "JV-068"] },
        { id: "exc-sincronizacion", nombre: "Sincronización", preguntas: ["JV-028", "JV-029", "JV-069", "JV-070"] }
      ],
      examen: { version: 1, umbral: 0.8, preguntas: ["JV-021", "JV-022", "JV-025", "JV-028", "JV-061", "JV-063", "JV-065", "JV-067", "JV-069", "JV-071"] }
    },
    {
      id: "auditoria",
      nombre: "Auditoría de código Java generado por IA",
      lecciones: [
        { id: "aud-bugs", nombre: "Bugs silenciosos", preguntas: ["JV-030", "JV-031", "JV-072", "JV-073", "JV-074", "JV-081", "JV-082", "JV-085", "JV-088", "JV-090", "JV-093", "JV-096", "JV-098"] },
        { id: "aud-apis", nombre: "APIs inventadas", preguntas: ["JV-032", "JV-033", "JV-075", "JV-076", "JV-077", "JV-083", "JV-087", "JV-091", "JV-095"] },
        { id: "aud-codigo", nombre: "Auditoría en acción", preguntas: ["JV-034", "JV-035", "JV-078", "JV-079", "JV-080", "JV-084", "JV-086", "JV-089", "JV-092", "JV-094", "JV-097", "JV-099", "JV-100"] }
      ],
      examen: { version: 1, umbral: 0.8, preguntas: ["JV-030", "JV-032", "JV-034", "JV-072", "JV-075", "JV-078", "JV-080", "JV-084", "JV-086", "JV-092", "JV-094", "JV-097", "JV-100"] }
    }
  ]
};

export default roadmap;