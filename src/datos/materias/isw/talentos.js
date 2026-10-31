// Árbol de talentos y ejes del Radar de Especialidades de Ingeniería de Software.
const talentos = {
  ejes: ["Agilidad", "Procesos", "Requisitos", "Modelado UML", "Flujos"],
  ramas: [
    {
      id: "rama-procesos-isw",
      nombre: "Ingeniería de Procesos y Agilidad",
      descripcion: "Selecciona el ciclo de vida adecuado y coordina entregas iterativas con Scrum.",
      nodos: [
        {
          id: "TAL-ISW-01",
          nombre: "Facilitador Ágil",
          descripcion: "Domina eventos, artefactos y responsabilidades de equipos ágiles.",
          eje: "Agilidad",
          puntosRadar: 100,
          titulo: "Scrum Master Táctico",
          icono: "rayo",
          misionesRequeridas: ["Scrum", "Metodologías ágiles"],
          minEstrellas: 1,
          talentoPrevioId: null
        },
        {
          id: "TAL-ISW-02",
          nombre: "Director de Ciclo de Vida",
          descripcion: "Equilibra alcance, riesgos y modelos de proceso en proyectos empresariales.",
          eje: "Procesos",
          puntosRadar: 100,
          titulo: "Líder de Ciclo de Vida",
          icono: "escenarios",
          misionesRequeridas: ["Proceso del software", "Modelos de proceso"],
          minEstrellas: 1,
          bossId: "ESC-ISW-01",
          bossTipo: "escenario",
          bossNombre: "Incidente: El ERP de Naibe Colombia",
          talentoPrevioId: "TAL-ISW-01"
        }
      ]
    },
    {
      id: "rama-requisitos-isw",
      nombre: "Descubrimiento y Requisitos",
      descripcion: "Alinea a los interesados del proyecto y redacta historias verificables.",
      nodos: [
        {
          id: "TAL-ISW-03",
          nombre: "Analista de Producto",
          descripcion: "Traduce necesidades de interesados en historias de usuario con criterios claros.",
          eje: "Requisitos",
          puntosRadar: 100,
          titulo: "Ingeniero de Requerimientos",
          icono: "apuntes",
          misionesRequeridas: ["Historias de usuario", "Interesados del proyecto"],
          minEstrellas: 1,
          talentoPrevioId: null
        }
      ]
    },
    {
      id: "rama-modelado-isw",
      nombre: "Diseño y Modelado Comportamental",
      descripcion: "Representa interacciones de actores y flujos de actividades sin ambigüedades.",
      nodos: [
        {
          id: "TAL-ISW-04",
          nombre: "Modelador de Interacciones",
          descripcion: "Estructura casos de uso con relaciones include y extend bien delimitadas.",
          eje: "Modelado UML",
          puntosRadar: 100,
          titulo: "Diseñador de Casos de Uso",
          icono: "casos",
          misionesRequeridas: ["UML y casos de uso", "Casos de Uso"],
          minEstrellas: 1,
          bossId: "CASO-ISW-01",
          bossTipo: "caso",
          bossNombre: "Caso: Sistema de gestión de tareas",
          talentoPrevioId: null
        },
        {
          id: "TAL-ISW-05",
          nombre: "Orquestador de Flujos",
          descripcion: "Modela decisiones y bifurcaciones complejas en diagramas de actividad.",
          eje: "Flujos",
          puntosRadar: 100,
          titulo: "Arquitecto de Procesos UML",
          icono: "medalla",
          misionesRequeridas: ["Diseño de software", "Diagramas de Actividad"],
          minEstrellas: 1,
          bossId: "CASO-ISW-02",
          bossTipo: "caso",
          bossNombre: "Caso: Flujo de aprobación de gastos",
          talentoPrevioId: "TAL-ISW-04"
        }
      ]
    }
  ]
};

export default talentos;
