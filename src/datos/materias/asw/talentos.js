// Árbol de talentos y ejes del Radar de Especialidades de Arquitectura de Software.
const talentos = {
  ejes: ["SOLID y POO", "Patrones", "Estilos", "Hexagonal", "Microservicios"],
  ramas: [
    {
      id: "rama-patrones-asw",
      nombre: "Diseño Orientado a Objetos y Patrones",
      descripcion: "Desacopla responsabilidades con principios SOLID y patrones GoF probados.",
      nodos: [
        {
          id: "TAL-ASW-01",
          nombre: "Artesano SOLID",
          descripcion: "Aplica inversión de dependencias y responsabilidad única en modelos de dominio.",
          eje: "SOLID y POO",
          puntosRadar: 100,
          titulo: "Defensor del Código Limpio",
          icono: "casos",
          misionesRequeridas: ["POO", "SOLID", "Principios de Diseño"],
          minEstrellas: 1,
          bossId: "CASO-ASW-01",
          bossTipo: "caso",
          bossNombre: "Caso: Sistema de pagos con múltiples métodos",
          talentoPrevioId: null
        },
        {
          id: "TAL-ASW-02",
          nombre: "Maestro de Patrones GoF",
          descripcion: "Combina patrones estructurales y de comportamiento sin sobre-ingeniería.",
          eje: "Patrones",
          puntosRadar: 100,
          titulo: "Especialista en Patrones de Diseño",
          icono: "medalla",
          misionesRequeridas: ["Patrones de Diseño", "Patrones de Comportamiento", "Patrones Estructurales"],
          minEstrellas: 1,
          bossId: "CASO-ASW-02",
          bossTipo: "caso",
          bossNombre: "Caso: Sistema de notificaciones",
          talentoPrevioId: "TAL-ASW-01"
        }
      ]
    },
    {
      id: "rama-hexagonal-asw",
      nombre: "Arquitectura Limpia y Hexagonal",
      descripcion: "Aísla el núcleo de negocio de los detalles de infraestructura, web y bases de datos.",
      nodos: [
        {
          id: "TAL-ASW-03",
          nombre: "Diseñador de Capas y APIs",
          descripcion: "Estructura contratos REST, MVC y separación en N-Tier.",
          eje: "Estilos",
          puntosRadar: 100,
          titulo: "Arquitecto de Sistemas Web",
          icono: "practica",
          misionesRequeridas: ["N-Tier", "Estilos de arquitectura", "API REST", "MVC y variantes"],
          minEstrellas: 1,
          talentoPrevioId: null
        },
        {
          id: "TAL-ASW-04",
          nombre: "Estratega de Puertos y Adaptadores",
          descripcion: "Protege el dominio puro mediante puertos de entrada/salida e inversión de control.",
          eje: "Hexagonal",
          puntosRadar: 100,
          titulo: "Arquitecto Hexagonal",
          icono: "chispa",
          misionesRequeridas: ["Arquitectura Hexagonal"],
          minEstrellas: 1,
          bossId: "ESC-ASW-02",
          bossTipo: "escenario",
          bossNombre: "Escenario: De Monolito N-Tier a Servicios Resilientes",
          talentoPrevioId: "TAL-ASW-03"
        }
      ]
    },
    {
      id: "rama-distribuidos-asw",
      nombre: "Sistemas Distribuidos y Resiliencia",
      descripcion: "Evoluciona monolitos y mitiga cuellos de botella en producción.",
      nodos: [
        {
          id: "TAL-ASW-05",
          nombre: "Arquitecto de Sistemas Distribuidos",
          descripcion: "Diseña microservicios resilientes y migra sistemas con Strangler Fig.",
          eje: "Microservicios",
          puntosRadar: 100,
          titulo: "Principal Cloud Architect",
          icono: "rayo",
          misionesRequeridas: ["Evolución de arquitecturas", "Microservicios"],
          minEstrellas: 1,
          bossId: "ESC-ASW-03",
          bossTipo: "escenario",
          bossNombre: "Escenario: Monolito Modular vs. Microservicios",
          talentoPrevioId: null
        }
      ]
    }
  ]
};

export default talentos;
