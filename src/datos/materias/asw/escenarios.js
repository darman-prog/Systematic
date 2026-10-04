// Escenarios multi-paso de Arquitectura de Software, derivados de los apuntes de
// principios de diseño y patrones (template method, proxy, composite, chain of responsibility).
const escenarios = [
  {
    id: "ESC-ASW-01",
    titulo: "Reportes lentos en la app de streaming",
    tema: "Caso integral",
    intro: "La app de streaming genera reportes de reproducciones. Cada reporte repite el mismo esqueleto (obtener datos, calcular, formatear), las consultas de datos son costosas y los filtros de validación se apilan con if/else que cambian cada semana. El equipo te pide rediseñar.",
    pasos: [
      {
        id: "p1",
        narrativa: "Cada reporte repite 'obtener, calcular, formatear' variando solo algunos pasos. ¿Qué aplicas?",
        opciones: [
          { texto: "Template Method: el esqueleto común en la clase base y los pasos variables en las subclases", feedback: "Correcto: el invariante vive una sola vez y cada reporte redefine solo lo que cambia.", puntos: 2, siguiente: "p2" },
          { texto: "Copiar el primer reporte y ajustar los detalles en cada copia", feedback: "Copiar funciona hasta el primer cambio del esqueleto: entonces hay que tocar N copias y olvidar una.", puntos: 0, siguiente: "p2" },
          { texto: "Un mega-método con flags booleanos para cada tipo de reporte", feedback: "Los flags bifurcan por todos lados: el método hace todo y no se puede probar nada aislado.", puntos: 1, siguiente: "p2" }
        ]
      },
      {
        id: "p2",
        narrativa: "Las consultas de reproducciones son costosas y los mismos datos se piden una y otra vez. ¿Qué haces?",
        opciones: [
          { texto: "Proxy de caché: misma interfaz del servicio, datos previamente calculados de forma transparente", feedback: "Correcto: el cliente ni se entera de que hay caché; el proxy controla el acceso al recurso costoso.", puntos: 2, siguiente: "p3" },
          { texto: "Clonar los resultados a mano en cada objeto con Prototype", feedback: "Prototype clona objetos ya construidos: no resuelve el costo de volver a consultar los datos.", puntos: 1, siguiente: "p3" },
          { texto: "Guardar los resultados en variables globales del proceso", feedback: "La 'caché global' acopla todo y nadie controla quién la invalida: el bug más difícil de reproducir.", puntos: 0, siguiente: "p3" }
        ]
      },
      {
        id: "p3",
        narrativa: "El reporte final mezcla secciones: resúmenes, tablas y gráficas que a su vez contienen sub-secciones. ¿Cómo lo modelas?",
        opciones: [
          { texto: "Composite: secciones y sub-secciones tratadas con la misma interfaz, como un árbol uniforme", feedback: "Correcto: con Composite, renderizar el árbol o una hoja es la misma llamada; la jerarquía deja de ser un caso especial.", puntos: 2, siguiente: "p4" },
          { texto: "Una jerarquía rígida donde una sección nunca puede contener otra sección", feedback: "El formato real exige anidamiento: prohibirlo obliga a aplanar y perder la estructura.", puntos: 0, siguiente: "p4" },
          { texto: "Concatenar strings del reporte en un método de 800 líneas", feedback: "Funciona el lunes; el martes piden 'solo reordenar las secciones' y nadie quiere tocar ese método.", puntos: 1, siguiente: "p4" }
        ]
      },
      {
        id: "p4",
        narrativa: "Los filtros de validación y limpieza llegan encadenados y cambian con frecuencia. ¿Qué estructura elige el equipo?",
        opciones: [
          { texto: "Chain of Responsibility: filtros encadenables, cada uno decide si pasa o procesa", feedback: "Correcto: agregar, quitar u ordenar filtros es configuración, no cirugía de condicionales.", puntos: 2, siguiente: "p5" },
          { texto: "Un switch gigante con todos los filtros posibles", feedback: "El switch viola abierto/cerrado: cada filtro nuevo modifica el código que ya funcionaba.", puntos: 0, siguiente: "p5" },
          { texto: "Duplicar el pipeline de filtros en cada reporte", feedback: "Dos pipelines que 'casi' son iguales: la divergencia silenciosa garantizada.", puntos: 1, siguiente: "p5" }
        ]
      },
      {
        id: "p5",
        narrativa: "Al cerrar el diseño, la regla de oro que le dejas al equipo es:",
        opciones: [
          { texto: "Programar contra interfaces y encapsular lo que varía", feedback: "Correcto: es el principio que hace posible todo lo anterior; el diseño cambia donde el requerimiento cambia, sin arrastrar el resto.", puntos: 2, siguiente: "fin" },
          { texto: "Heredar de una superclase 'Dios' para reutilizar todo", feedback: "La herencia forzada acopla los reportes al ciclo de vida de una clase gigante: composición sobre herencia.", puntos: 0, siguiente: "fin" },
          { texto: "Optimizar primero sin medir; refactorizar después si algo falla", feedback: "Sin medir, optimizas lo equivocado y el diseño se decide por intuición, no por evidencia.", puntos: 1, siguiente: "fin" }
        ]
      }
    ],
    finales: {
      exito: "El sistema respira diseño: esqueleto compartido, caché transparente, reportes como árbol y filtros flexibles. Agregar un reporte nuevo son horas, no semanas.",
      parcial: "Mejoró el esqueleto, pero varias decisiones dejaron acoplamiento: cada cambio seguirá costando más de lo que se admite.",
      fracaso: "El código quedó más rígido: copias, flags y herencia forzada garantizan que el próximo reporte rompa dos anteriores."
    }
  }
];

export default escenarios;
