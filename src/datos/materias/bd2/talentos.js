// Árbol de talentos y ejes del Radar de Especialidades de Base de Datos 2.
// Conecta las misiones por tema con las Boss Battles (escenarios y casos de diagramación).
const talentos = {
  ejes: ["Modelado", "Integridad", "Optimización", "Consultas SQL", "NoSQL"],
  ramas: [
    {
      id: "rama-modelado-bd2",
      nombre: "Arquitectura y Modelado Relacional",
      descripcion: "Estructura esquemas sólidos, claves foráneas y reglas de integridad sin huérfanos.",
      nodos: [
        {
          id: "TAL-BD2-01",
          nombre: "Arquitecto de Esquemas",
          descripcion: "Transforma reglas de negocio en modelos entidad-relación y sentencias DDL limpias.",
          eje: "Modelado",
          puntosRadar: 100,
          titulo: "Arquitecto de Esquemas ER",
          icono: "casos",
          misionesRequeridas: ["Modelado", "DDL"],
          minEstrellas: 1,
          bossId: "CASO-BD2-01",
          bossTipo: "caso",
          bossNombre: "Caso: Sistema de reservas de hotel",
          talentoPrevioId: null
        },
        {
          id: "TAL-BD2-02",
          nombre: "Guardián de Integridad Referencial",
          descripcion: "Protege la consistencia ante borrados y actualizaciones en cascada.",
          eje: "Integridad",
          puntosRadar: 100,
          titulo: "Guardián de Integridad ACID",
          icono: "medalla",
          misionesRequeridas: ["Integridad", "DML"],
          minEstrellas: 1,
          bossId: "CASO-BD2-02",
          bossTipo: "caso",
          bossNombre: "Caso: Biblioteca universitaria",
          talentoPrevioId: "TAL-BD2-01"
        }
      ]
    },
    {
      id: "rama-rendimiento-bd2",
      nombre: "Rendimiento y Consultas Críticas",
      descripcion: "Acelera lecturas pesadas eligiendo índices selectivos y funciones de agregación.",
      nodos: [
        {
          id: "TAL-BD2-03",
          nombre: "Analista de Consultas",
          descripcion: "Domina agregaciones, uniones y filtrado relacional complejo.",
          eje: "Consultas SQL",
          puntosRadar: 100,
          titulo: "Especialista en Consultas SQL",
          icono: "practica",
          misionesRequeridas: ["Consultas", "Funciones"],
          minEstrellas: 1,
          talentoPrevioId: null
        },
        {
          id: "TAL-BD2-04",
          nombre: "Estratega de Índices y Planes",
          descripcion: "Diagnostica cuellos de botella en tablas grandes sin castigar los INSERT nocturnos.",
          eje: "Optimización",
          puntosRadar: 100,
          titulo: "DBA de Alto Rendimiento",
          icono: "rayo",
          misionesRequeridas: ["Índices"],
          minEstrellas: 2,
          bossId: "ESC-BD2-01",
          bossTipo: "escenario",
          bossNombre: "Incidente: El colegio crece y las consultas se arrastran",
          talentoPrevioId: "TAL-BD2-03"
        }
      ]
    },
    {
      id: "rama-nosql-bd2",
      nombre: "Persistencia Políglota (NoSQL)",
      descripcion: "Combina motores documentales y de grafos según el patrón real de consulta.",
      nodos: [
        {
          id: "TAL-BD2-05",
          nombre: "Ingeniero de Datos Políglota",
          descripcion: "Modela documentos en MongoDB y relaciones profundas en Neo4j.",
          eje: "NoSQL",
          puntosRadar: 100,
          titulo: "Arquitecto Políglota NoSQL",
          icono: "chispa",
          misionesRequeridas: ["MongoDB", "Neo4j"],
          minEstrellas: 1,
          talentoPrevioId: null
        }
      ]
    }
  ]
};

export default talentos;
