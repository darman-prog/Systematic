// Glosario de Ingeniería de Software.
// Se completa por lotes revisados a partir de los .md de BancoDeInformacion/IngenieriaDeSoftware/.
const glosario = {
  categorias: [
    { id: "procesos", nombre: "Procesos de software", corto: "Procesos", color: "#a78bfa" },
    { id: "agil", nombre: "Desarrollo ágil", corto: "Ágil", color: "#fbbf24" },
    { id: "scrum", nombre: "Scrum y sus ceremonias", corto: "Scrum", color: "#34d399" },
    { id: "requerimientos", nombre: "Requerimientos e historias", corto: "Requerimientos", color: "#60a5fa" },
    { id: "uml", nombre: "Modelado UML", corto: "UML", color: "#f472b6" },
    { id: "diseno", nombre: "Diseño de software", corto: "Diseño", color: "#fb923c" }
  ],
  terminos: [
    {
      termino: "Proceso de software",
      categoria: "procesos",
      definicion: "Marco de actividades, acciones y tareas que se lleva a cabo para crear un producto de software. No es una prescripción rígida: es un enfoque adaptable que el equipo ajusta al proyecto.",
      ejemplo: "Un equipo decide combinar sprints de dos semanas con revisiones técnicas semanales según su contexto."
    },
    {
      termino: "Actividades sombrilla",
      categoria: "procesos",
      definicion: "Actividades que se aplican a lo largo de todo el proyecto, transversales a las fases: seguimiento y control, administración de riesgos, aseguramiento de la calidad, administración de la configuración y revisiones técnicas.",
      ejemplo: "La administración de riesgos se mantiene activa desde la concepción hasta el despliegue, como una sombrilla sobre todo el proyecto."
    },
    {
      termino: "Flujo de proceso",
      categoria: "procesos",
      definicion: "Forma en que se ejecutan las actividades del proceso: lineal (en secuencia), iterativo (se repiten actividades), evolutivo (circular, cada giro produce una versión más completa) o paralelo (actividades simultáneas).",
      ejemplo: "En un flujo paralelo, el modelado de un módulo avanza mientras otro módulo se construye."
    },
    {
      termino: "Modelo de Cascada",
      categoria: "procesos",
      definicion: "Paradigma más antiguo de la ingeniería de software: el trabajo fluye en forma lineal y secuencial. Encaja con requerimientos bien definidos y estabilidad razonable.",
      ejemplo: "Un sistema contable con reglas fijas y documentadas puede desarrollarse fase a fase sin retornos."
    },
    {
      termino: "Proceso Unificado (PU / RUP)",
      categoria: "procesos",
      definicion: "Marco extensible impulsado por UML con fases de concepción, elaboración, construcción, transición y producción. RUP es su variante desarrollada por Rational Corporation.",
      ejemplo: "En la fase de transición se entregan manuales de usuario y guías de solución de problemas para el lanzamiento."
    },
    {
      termino: "Manifiesto Ágil",
      categoria: "agil",
      definicion: "Declaración de valores escrita por Kent Beck y otros desarrolladores: individuos e interacciones sobre procesos y herramientas, software que funciona sobre documentación exhaustiva, colaboración con el cliente sobre negociación contractual y responder al cambio sobre seguir un plan.",
      ejemplo: "Ante un cambio de requerimiento a mitad del proyecto, el equipo ágil lo negocia con el cliente en lugar de exigir un cambio de contrato."
    },
    {
      termino: "Kanban",
      categoria: "agil",
      definicion: "Metodología originada en Toyota como práctica de ingeniería industrial, adaptada al software por David Anderson. El equipo gestiona el trabajo, se autoorganiza y las políticas evolucionan para mejorar los resultados.",
      ejemplo: "Un equipo visualiza sus tareas en un tablero con columnas Por hacer, En progreso y Hecho."
    },
    {
      termino: "Workflow",
      categoria: "agil",
      definicion: "Flujo de trabajo ágil: los estados por los que pasa una tarea. Un buen workflow responde qué trabajo terminó, si el backlog sigue el ritmo del equipo, cuántos elementos hay por estado y dónde hay cuellos de botella.",
      ejemplo: "Si varias tareas se acumulan en el estado de pruebas, el tablero revela ese cuello de botella."
    },
    {
      termino: "Scrum",
      categoria: "scrum",
      definicion: "Metodología ágil cuyo nombre proviene de una jugada de Rugby. Guía el desarrollo mediante sprints, un retraso priorizado, reuniones diarias y demostraciones al cliente, ideal para plazos cortos y requerimientos cambiantes.",
      ejemplo: "Un equipo con entregas cada 30 días y demos al final de cada sprint para validar con el cliente."
    },
    {
      termino: "Sprint",
      categoria: "scrum",
      definicion: "Unidad de trabajo para alcanzar un requerimiento del retraso, ajustada a una caja de tiempo predefinida de 30 días. Durante el sprint no se introducen cambios.",
      ejemplo: "El equipo implementa el módulo de facturación durante el sprint; cualquier idea nueva entra al backlog, no al sprint actual."
    },
    {
      termino: "Backlog (retraso)",
      categoria: "scrum",
      definicion: "Lista priorizada de los requerimientos o características del proyecto que dan valor de negocio al cliente. Puede recibir nuevos elementos en cualquier momento y sus prioridades se actualizan.",
      ejemplo: "El cliente pide exportar reportes a PDF; el gerente inserta esa característica en la posición 3 del backlog."
    },
    {
      termino: "Scrum Master",
      categoria: "scrum",
      definicion: "Líder del equipo que dirige las reuniones diarias de Scrum y ayuda a eliminar los obstáculos que reporta el equipo.",
      ejemplo: "Cuando el equipo reporta que el servidor de pruebas está caído, el Scrum Master gestiona su restablecimiento."
    },
    {
      termino: "Historia de usuario",
      categoria: "requerimientos",
      definicion: "Explicación general e informal de una función de software, escrita desde la perspectiva del usuario final. Es la unidad de trabajo más pequeña de un marco ágil y articula cómo la función dará valor al cliente.",
      ejemplo: "Como estudiante, quiero recuperar mi contraseña para volver a entrar a mi cuenta si la olvido."
    },
    {
      termino: "Epic",
      categoria: "requerimientos",
      definicion: "Gran elemento de trabajo que se divide en un conjunto de historias de usuario; varios epics constituyen una iniciativa.",
      ejemplo: "El epic Gestionar pagos se divide en historias como pagar con tarjeta, ver el historial y descargar facturas."
    },
    {
      termino: "Caso de uso",
      categoria: "requerimientos",
      definicion: "Narración o plantilla que describe una función o rasgo del sistema desde el punto de vista del usuario. Sirve de base para un modelo de requerimientos más completo e incluye escenarios principales y secundarios.",
      ejemplo: "El caso de uso Retirar dinero en un cajero tiene el escenario feliz y excepciones como fondos insuficientes."
    },
    {
      termino: "UML",
      categoria: "uml",
      definicion: "Lenguaje Unificado de Modelado creado por Grady Booch, James Rumbaugh e Ivar Jacobson. Notación visual basada en trece tipos de diagramas (estructurales y de comportamiento) para visualizar, especificar y documentar software.",
      ejemplo: "El equipo dibuja un diagrama de clases para acordar la estructura del dominio antes de codificar."
    },
    {
      termino: "Deuda técnica",
      categoria: "diseno",
      definicion: "Se produce cuando se elige una solución rápida en lugar de la mejor solución de diseño. Trae mayor esfuerzo de mantenimiento, código difícil de modificar e incremento del costo del proyecto.",
      ejemplo: "Copiar y pegar la validación de un formulario en diez pantallas ahorra horas hoy, pero cada cambio futuro hay que repetirlo diez veces."
    },
    {
      termino: "Diseño de software",
      categoria: "diseno",
      definicion: "Etapa que combina creatividad y conocimiento técnico para transformar los requerimientos en modelos de solución de alta calidad, mediante diseño de datos/clases, arquitectónico, de interfaces y de componentes.",
      ejemplo: "A partir del requerimiento de facturación, el equipo diseña las clases, la arquitectura y las pantallas del módulo."
    }
  ],
  tips: [
    "Las fases del Proceso Unificado forman la palabra CECTP: Concepción, Elaboración, Construcción, Transición y Producción; memorízalas como una línea de producción que termina con el producto en marcha.",
    "Las tres preguntas del daily Scrum son un pulso diario: qué hice, qué obstáculos tengo y qué haré después; si la reunión dura más de 15 minutos, se convirtió en otra cosa.",
    "Recuerda la jerarquía ágil como muñecas rusas: las historias forman epics y los epics forman iniciativas, de lo más pequeño a lo más grande.",
    "No confundas desgaste con deterioro: el hardware se desgasta con el uso (curva de bañera); el software no se desgasta, pero se deteriora cada vez que se le meten cambios sin control.",
    "La deuda técnica funciona como un préstamo: la solución rápida te da dinero (tiempo) hoy, pero los intereses se pagan en cada mantenimiento futuro."
  ]
};

export default glosario;
