// Roadmap del track de TypeScript (spec 011). Los nombres, el orden, el umbral y la
// versión de cada examen son DATOS (ADR 003), no código: agregar una etapa o renombrarla
// no toca src/core/. `version` invalida aprobados viejos si el examen se reescribe.
const roadmap = {
  lenguaje: "lenguaje-ts",
  etapas: [
    {
      id: "fundamentos",
      nombre: "Fundamentos",
      lecciones: [
        { id: "fund-tipos", nombre: "Tipos y variables", preguntas: ["TS-001", "TS-002", "TS-026", "TS-036"] },
        { id: "fund-control", nombre: "Control de flujo", preguntas: ["TS-004", "TS-038", "TS-039", "TS-044"] },
        { id: "fund-traza", nombre: "Trazar ejecución", preguntas: ["TS-003", "TS-005", "TS-027", "TS-042"] }
      ],
      examen: { version: 2, umbral: 0.8, preguntas: ["TS-037", "TS-040", "TS-041", "TS-043", "TS-045", "TS-046", "TS-047", "TS-048"] }
    },
    {
      id: "funciones",
      nombre: "Funciones y datos",
      lecciones: [
        { id: "func-funciones", nombre: "Funciones y arreglos", preguntas: ["TS-006", "TS-007"] }
      ],
      examen: { version: 1, umbral: 0.8, preguntas: ["TS-008", "TS-009", "TS-010", "TS-028", "TS-029"] }
    },
    {
      id: "tipos",
      nombre: "Tipos y genéricos",
      lecciones: [
        { id: "tipos-narrowing", nombre: "Interfaces y narrowing", preguntas: ["TS-011", "TS-012"] }
      ],
      examen: { version: 1, umbral: 0.8, preguntas: ["TS-013", "TS-014", "TS-015", "TS-030", "TS-031"] }
    },
    {
      id: "asincronia",
      nombre: "Asincronía y errores",
      lecciones: [
        { id: "async-orden", nombre: "Orden de ejecución", preguntas: ["TS-016", "TS-017"] }
      ],
      examen: { version: 1, umbral: 0.8, preguntas: ["TS-018", "TS-019", "TS-020", "TS-032", "TS-033"] }
    },
    {
      id: "auditoria",
      nombre: "Auditoría de código de IA",
      lecciones: [
        { id: "audit-bugs", nombre: "Bugs y APIs inventadas", preguntas: ["TS-021", "TS-022"] }
      ],
      examen: { version: 1, umbral: 0.8, preguntas: ["TS-023", "TS-024", "TS-025", "TS-034", "TS-035"] }
    }
  ]
};

export default roadmap;
