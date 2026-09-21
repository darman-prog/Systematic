// Banco de preguntas de Ingeniería de Software.
// Se completa por lotes revisados a partir de los .md de BancoDeInformacion/IngenieriaDeSoftware/.
const preguntas = [
  {
    id: "ISW-001", parcial: "Parcial 1", tema: "Scrum", dificultad: "facil", tipo: "multiple",
    q: "Según el proceso Scrum descrito en clase, ¿a qué caja de tiempo predefinida debe ajustarse un sprint?",
    options: ["15 minutos", "30 días", "1 semana", "6 meses"], correct: 1,
    exp: "<b>El sprint es una caja de tiempo predefinida de 30 días</b>. Los 15 minutos corresponden a la reunión diaria, no al sprint. Esta ventana fija da al equipo un ambiente de corto plazo pero estable."
  },
  {
    id: "ISW-002", parcial: "Parcial 1", tema: "Scrum", dificultad: "facil", tipo: "multiple",
    q: "¿Cuál de las siguientes es una de las tres preguntas clave de la reunión diaria de Scrum?",
    options: ["¿Cuánto presupuesto queda por gastar?", "¿Qué obstáculos estás encontrando?", "¿Quién es el responsable del retraso?", "¿Qué producto competidor estamos imitando?"],
    correct: 1,
    exp: "Las tres preguntas son: <b>qué hiciste desde la última reunión</b>, <b>qué obstáculos encuentras</b> y <b>qué planeas hacer</b> hasta la siguiente. La reunión dura unos 15 minutos y la dirige el maestro Scrum."
  },
  {
    id: "ISW-003", parcial: "Parcial 1", tema: "Scrum", dificultad: "media", tipo: "multiple",
    q: "En Scrum, el retraso (backlog) es:",
    options: ["el contrato legal entre el cliente y el proveedor", "una lista priorizada de requerimientos o características que dan valor de negocio al cliente", "el diagrama de clases del sistema", "una prueba de rendimiento obligatoria al final del proyecto"],
    correct: 1,
    exp: "El retraso es la <b>lista priorizada de requerimientos</b> que dan valor de negocio al cliente. Se pueden agregar aspectos en cualquier momento y el gerente del proyecto la evalúa y actualiza las prioridades según se requiera."
  },
  {
    id: "ISW-004", parcial: "Parcial 1", tema: "Scrum", dificultad: "media", tipo: "multi",
    q: "¿Cuáles de las siguientes son acciones de desarrollo del proceso Scrum?",
    options: ["Retraso (lista priorizada de requerimientos)", "Sprints con caja de tiempo predefinida", "Reuniones breves diarias dirigidas por el maestro Scrum", "Pruebas de estrés trimestrales obligatorias"],
    correctos: [0, 1, 2],
    exp: "Las acciones de Scrum son el <b>retraso</b>, los <b>sprints</b>, las <b>reuniones diarias</b> y las <b>demostraciones preliminares</b> del incremento al cliente. Las pruebas de estrés trimestrales no forman parte de las acciones descritas."
  },
  {
    id: "ISW-005", parcial: "Parcial 1", tema: "Scrum", dificultad: "media", tipo: "vf",
    q: "Durante un sprint en curso se pueden introducir cambios al trabajo planificado siempre que el cliente lo apruebe.",
    options: ["Verdadero", "Falso"], correct: 1,
    exp: "<b>Falso</b>: durante el sprint <b>no se introducen cambios</b>, precisamente para que el equipo trabaje en un ambiente de corto plazo pero estable. Los cambios se agregan al retraso y se priorizan para sprints siguientes."
  },
  {
    id: "ISW-006", parcial: "Parcial 1", tema: "Software y sus categorías", dificultad: "facil", tipo: "multiple",
    q: "Respecto a la durabilidad del software, la afirmación correcta es:",
    options: ["el software se desgasta igual que el hardware", "el software no se desgasta, pero sí se deteriora", "el software se deteriora solo por factores ambientales", "el software nunca falla una vez liberado"],
    correct: 1,
    exp: "El software <b>no se desgasta</b> porque no sufre la curva de fallas del hardware (curva de bañera), pero <b>sí se deteriora</b>: al ser dinámico, cada cambio puede introducir errores que generan picos súbitos en la tasa de fallas."
  },
  {
    id: "ISW-007", parcial: "Parcial 1", tema: "Software y sus categorías", dificultad: "facil", tipo: "multiple",
    q: "El software que reside dentro de un producto (como electrodomésticos o automóviles) para controlar sus funciones se llama:",
    options: ["software de sistemas", "software de aplicación", "software incrustado", "software de línea de productos"],
    correct: 2,
    exp: "El <b>software incrustado</b> reside dentro de un producto o sistema y se usa para implementar y controlar características y funciones para el usuario final, como en electrodomésticos y automóviles."
  },
  {
    id: "ISW-008", parcial: "Parcial 1", tema: "Software y sus categorías", dificultad: "media", tipo: "relacionar",
    q: "Relaciona cada categoría de software con el ejemplo que la caracteriza.",
    pares: [
      ["Software de sistemas", "Compiladores, controladores y componentes del sistema operativo"],
      ["Software de aplicación", "Programas que resuelven necesidades de negocio como ventas o marketing"],
      ["Software incrustado", "Control de funciones en electrodomésticos y automóviles"],
      ["Software de Inteligencia Artificial", "Redes neuronales, sistemas expertos y reconocimiento de patrones"]
    ],
    exp: "Cada categoría agrupa software con propósito distinto: el <b>de sistemas</b> sirve a otros programas, el <b>de aplicación</b> resuelve necesidades de negocio, el <b>incrustado</b> vive dentro de un producto físico y el <b>de IA</b> usa algoritmos no numéricos para problemas complejos."
  },
  {
    id: "ISW-009", parcial: "Parcial 1", tema: "Proceso del software", dificultad: "facil", tipo: "multiple",
    q: "¿Qué flujo de proceso ejecuta las actividades en secuencia, comenzando por la comunicación y finalizando en el despliegue?",
    options: ["Flujo paralelo", "Flujo evolutivo", "Flujo lineal", "Flujo iterativo"],
    correct: 2,
    exp: "El <b>flujo lineal</b> organiza las actividades estructurales en secuencia: comunicación, planeación, modelado, construcción y despliegue. El evolutivo es circular y el iterativo repite actividades antes de avanzar."
  },
  {
    id: "ISW-010", parcial: "Parcial 1", tema: "Proceso del software", dificultad: "dificil", tipo: "multiple",
    q: "¿Cuál de las siguientes es una actividad sombrilla del proceso de software?",
    options: ["Modelado", "Administración de riesgos", "Construcción", "Despliegue"],
    correct: 1,
    exp: "Las <b>actividades sombrilla</b> se aplican a lo largo de todo el proyecto: seguimiento y control, administración de riesgos, aseguramiento de la calidad, administración de la configuración y revisiones técnicas. Modelado, construcción y despliegue son actividades estructurales."
  },
  {
    id: "ISW-011", parcial: "Parcial 1", tema: "Proceso del software", dificultad: "dificil", tipo: "multiple",
    q: "En el flujo de proceso paralelo, ¿qué describe mejor su comportamiento?",
    options: ["Las actividades se ejecutan en forma circular generando versiones cada vez más completas", "Se repite una actividad varias veces antes de pasar a la siguiente", "Una o más actividades se ejecutan al mismo tiempo que otras, como modelar un aspecto mientras se construye otro", "Las actividades se ejecutan solo al final del proyecto"],
    correct: 2,
    exp: "El flujo <b>paralelo</b> ejecuta una o más actividades en simultáneo con otras: por ejemplo, el modelado de un aspecto del software avanza en paralelo con la construcción de otro. El comportamiento circular corresponde al flujo evolutivo."
  },
  {
    id: "ISW-012", parcial: "Parcial 1", tema: "Proceso del software", dificultad: "media", tipo: "ordenar",
    q: "Ordena las actividades estructurales del proceso de software según su secuencia estándar.",
    bloques: ["Comunicación", "Planeación", "Modelado", "Construcción", "Despliegue"],
    exp: "La estructura del proceso va de <b>comunicación</b> (entender objetivos y reunir requerimientos) a <b>planeación</b>, <b>modelado</b> (análisis y diseño), <b>construcción</b> (código y pruebas) y <b>despliegue</b> (entrega y realimentación del cliente)."
  },
  {
    id: "ISW-013", parcial: "Parcial 1", tema: "Modelos de proceso", dificultad: "facil", tipo: "multiple",
    q: "El modelo de proceso prescriptivo más antiguo de la ingeniería de software, con trabajo lineal y enfoque sistemático y secuencial, es:",
    options: ["el modelo incremental", "el modelo de Cascada", "el paradigma de prototipos", "el Proceso Unificado"],
    correct: 1,
    exp: "El <b>modelo de Cascada</b> (ciclo de vida clásico) es el paradigma más antiguo: el trabajo fluye en forma lineal y funciona bien con requerimientos bien definidos y estabilidad razonable."
  },
  {
    id: "ISW-014", parcial: "Parcial 1", tema: "Modelos de proceso", dificultad: "media", tipo: "multiple",
    q: "El modelo de proceso incremental es especialmente útil cuando:",
    options: ["el cliente ignora por completo los detalles de lo que necesita", "no se cuenta con personal para la implementación completa en el plazo establecido por el negocio", "los requerimientos nunca cambian", "el proyecto no requiere entregas operables"],
    correct: 1,
    exp: "El modelo incremental entrega <b>avances (incrementos) que son productos operables</b>; es útil cuando falta personal para implementar todo en el plazo del negocio. El caso del cliente que ignora los detalles corresponde al prototipo."
  },
  {
    id: "ISW-015", parcial: "Parcial 1", tema: "Modelos de proceso", dificultad: "media", tipo: "multiple",
    q: "El paradigma de prototipos se recomienda cuando:",
    options: ["el cliente tiene una necesidad real pero ignora los detalles de lo que quiere", "los requerimientos están congelados y son estables", "el equipo quiere evitar entregas al cliente", "el sistema no necesita evolucionar"],
    correct: 0,
    exp: "El prototipo sirve cuando el cliente <b>tiene una necesidad real pero ignora los detalles</b>. Algunos prototipos se construyen para ser desechados y otros evolucionan hacia el producto real."
  },
  {
    id: "ISW-016", parcial: "Parcial 1", tema: "Modelos de proceso", dificultad: "dificil", tipo: "multi",
    q: "¿Cuáles de las siguientes son fases del Proceso Unificado (PU)?",
    options: ["Concepción", "Elaboración", "Transición", "Refactorización"],
    correctos: [0, 1, 2],
    exp: "Las fases del PU son <b>concepción, elaboración, construcción, transición y producción</b>. La refactorización es una práctica de desarrollo de código, no una fase del Proceso Unificado."
  },
  {
    id: "ISW-017", parcial: "Parcial 1", tema: "Modelos de proceso", dificultad: "dificil", tipo: "ordenar",
    q: "Ordena las fases del Proceso Unificado (PU / RUP).",
    bloques: ["Concepción", "Elaboración", "Construcción", "Transición", "Producción"],
    exp: "El PU avanza de <b>concepción</b> (requerimientos del negocio y plan) a <b>elaboración</b> (casos de uso y arquitectura ampliada), <b>construcción</b> (componentes operativos), <b>transición</b> (pruebas beta y entrega) y <b>producción</b> (soporte y evaluación de cambios)."
  },
  {
    id: "ISW-018", parcial: "Parcial 1", tema: "Scrum", dificultad: "facil", tipo: "multiple",
    q: "Según el Manifiesto Ágil, ¿qué se valora por encima de apegarse a un plan?",
    options: ["La documentación exhaustiva", "Responder al cambio", "La negociación del contrato", "Los procesos y las herramientas"],
    correct: 1,
    exp: "El manifiesto valora <b>responder al cambio</b> mejor que apegarse a un plan. Además privilegia a los individuos y sus interacciones, el software que funciona y la colaboración con el cliente."
  },
  {
    id: "ISW-019", parcial: "Parcial 1", tema: "Metodologías ágiles", dificultad: "facil", tipo: "multiple",
    q: "La metodología Kanban se originó en Toyota como prácticas de ingeniería industrial y fue adaptada al desarrollo de software por:",
    options: ["Ken Schwaber", "David Anderson", "James Rumbaugh", "Grady Booch"],
    correct: 1,
    exp: "Kanban nació en <b>Toyota</b> como conjunto de prácticas de ingeniería industrial y <b>David Anderson</b> lo adaptó al desarrollo de software. Rumbaugh y Booch están asociados a UML."
  },
  {
    id: "ISW-020", parcial: "Parcial 1", tema: "Metodologías ágiles", dificultad: "media", tipo: "multiple",
    q: "¿Cuál de las siguientes NO aparece entre las metodologías ágiles más utilizadas vistas en clase?",
    options: ["Extreme Programming (XP)", "Kanban", "Modelo de Cascada", "Design Sprint"],
    correct: 2,
    exp: "La Cascada es un <b>modelo prescriptivo clásico</b>, no una metodología ágil. Entre las ágiles mencionadas están XP, Scrum, Kanban, Agile Inception y Design Sprint (la metodología de Google)."
  },
  {
    id: "ISW-021", parcial: "Parcial 1", tema: "Historias de usuario", dificultad: "facil", tipo: "multiple",
    q: "Una historia de usuario se caracteriza por ser:",
    options: ["el contrato formal del proyecto", "una explicación general e informal de una función, escrita desde la perspectiva del usuario final", "un diagrama técnico de base de datos", "la especificación detallada de la interfaz gráfica"],
    correct: 1,
    exp: "Una historia de usuario es una <b>explicación general e informal</b> de una función de software, escrita desde la perspectiva del usuario final, cuyo propósito es articular cómo esa función dará <b>valor al cliente</b>. Es la unidad de trabajo más pequeña del marco ágil."
  },
  {
    id: "ISW-022", parcial: "Parcial 1", tema: "Historias de usuario", dificultad: "facil", tipo: "vf",
    q: "Los epics son grandes elementos de trabajo que se dividen en un conjunto de historias, y varios epics constituyen una iniciativa.",
    options: ["Verdadero", "Falso"], correct: 0,
    exp: "<b>Verdadero</b>: la jerarquía es historia (unidad mínima) → <b>epic</b> (conjunto de historias) → <b>iniciativa</b> (conjunto de epics). Así se organizan los marcos ágiles más grandes."
  },
  {
    id: "ISW-023", parcial: "Parcial 1", tema: "Historias de usuario", dificultad: "media", tipo: "multi",
    q: "Un flujo de trabajo (workflow) bien realizado permite responder preguntas como:",
    options: ["¿Qué trabajo ha finalizado el equipo?", "¿El backlog sigue el ritmo del equipo o está aumentando?", "¿Hay cuellos de botella que ralenticen al equipo?", "¿Cuál es el salario promedio del equipo?"],
    correctos: [0, 1, 2],
    exp: "El workflow permite inspeccionar el avance: trabajo finalizado, ritmo del backlog, elementos por estado, <b>cuellos de botella</b>, duración media de una tarea y elementos que no pasaron el estándar de calidad a la primera."
  },
  {
    id: "ISW-024", parcial: "Parcial 1", tema: "Historias de usuario", dificultad: "dificil", tipo: "relacionar",
    q: "Relaciona cada término de la gestión ágil con su definición.",
    pares: [
      ["Historia de usuario", "Unidad de trabajo más pequeña, expresada desde la perspectiva del usuario"],
      ["Epic", "Gran elemento de trabajo dividido en un conjunto de historias"],
      ["Iniciativa", "Colección de varios epics alineados a un objetivo mayor"],
      ["Workflow", "Flujo de estados por los que pasa una tarea del equipo"]
    ],
    exp: "Piénsalo como muñecas rusas: las <b>historias</b> componen <b>epics</b> y varios <b>epics</b> forman una <b>iniciativa</b>. El <b>workflow</b>, en cambio, no agrupa trabajo: define los estados por los que atraviesa cada elemento."
  },
  {
    id: "ISW-025", parcial: "Parcial 1", tema: "UML y casos de uso", dificultad: "facil", tipo: "multiple",
    q: "En un diagrama de casos de uso UML, ¿cómo se representan respectivamente los casos de uso, los actores y el límite del sistema?",
    options: ["Rectángulos, rombos y líneas punteadas", "Forma ovalada etiquetada, figuras de palitos y un cuadro alrededor", "Círculos, flechas y cilindros", "Tablas, líneas y elipses"],
    correct: 1,
    exp: "Los casos de uso se dibujan como una <b>forma ovalada etiquetada</b>, los actores como <b>figuras de palitos</b> conectados con una línea, y el <b>límite del sistema</b> con un cuadro alrededor de los casos de uso."
  },
  {
    id: "ISW-026", parcial: "Parcial 1", tema: "UML y casos de uso", dificultad: "media", tipo: "dragdrop",
    q: "Completa la descripción del diagrama de casos de uso UML.",
    codigo: "Cada caso de uso se representa con un {1}, los actores con {2} y el límite del sistema se dibuja con un cuadro alrededor de los casos de uso.",
    respuestas: ["óvalo etiquetado", "figuras de palitos"],
    piezas: ["óvalo etiquetado", "figuras de palitos", "rombo de decisión", "cilindro de datos"],
    exp: "La notación básica del diagrama de casos de uso usa un <b>óvalo etiquetado</b> por caso de uso y <b>figuras de palitos</b> para los actores. El rombo es propio de los diagramas de actividades."
  },
  {
    id: "ISW-027", parcial: "Parcial 1", tema: "UML y casos de uso", dificultad: "media", tipo: "multiple",
    q: "En el análisis de casos de uso, un escenario secundario (excepción) describe:",
    options: ["la secuencia ideal de pasos sin alternativas", "una situación, condición de falla o alternativa elegida por el actor que provoca un comportamiento distinto del sistema", "la lista de requerimientos no funcionales", "el plan de pruebas del sistema"],
    correct: 1,
    exp: "Un <b>escenario secundario o excepción</b> describe una condición de falla o una alternativa elegida por el actor que hace que el sistema <b>exhiba un comportamiento distinto</b>. Cada paso del escenario principal debe evaluarse considerando sus alternativas."
  },
  {
    id: "ISW-028", parcial: "Parcial 1", tema: "UML y casos de uso", dificultad: "media", tipo: "desarrollo",
    q: "Menciona al menos cuatro diagramas UML de comportamiento (dinámicos) y explica qué los distingue de los diagramas estructurales o estáticos.",
    solucion: "Los diagramas UML de comportamiento o dinámicos incluyen: diagrama de secuencia, diagrama de comunicación (o de colaboración), diagrama de máquina de estados, diagrama de actividades, diagrama de visión global de la interacción y diagrama de tiempos. Se distinguen de los estructurales o estáticos (casos de uso, objetos, clases, paquetes, despliegue, estructuras compuestas) porque modelan cómo se comporta y cambia el sistema en el tiempo, es decir, las interacciones y transiciones entre estados, mientras que los estructurales muestran la organización estática del sistema.",
    claves: ["secuencia", "actividades", "máquina de estados", "comportamiento"],
    exp: "Los diagramas <b>de comportamiento o dinámicos</b> incluyen secuencia, comunicación, máquina de estados, actividades, visión global de la interacción y tiempos. El <b>diagrama de clases</b> es estructural o estático."
  },
  {
    id: "ISW-029", parcial: "Parcial 1", tema: "UML y casos de uso", dificultad: "dificil", tipo: "desarrollo",
    q: "Explica la diferencia entre el escenario principal y los escenarios secundarios (excepciones) de un caso de uso, y por qué cada paso del escenario principal debe evaluarse frente a alternativas.",
    solucion: "El escenario principal es la narrativa fluida que describe la interacción típica del actor con el sistema, sin considerar interacciones alternativas. Los escenarios secundarios o excepciones describen situaciones, ya sea una condición de falla o una alternativa elegida por el actor, que provocan que el sistema exhiba un comportamiento distinto. Cada paso del principal se evalúa preguntando qué podría fallar o qué caminos alternativos existen, porque un modelo de requerimientos completo necesita cubrir esas variantes y no solo el camino feliz.",
    claves: ["escenario principal", "excepción", "alternativa", "comportamiento"],
    exp: "La clave es distinguir el <b>camino típico</b> (escenario principal) de las <b>desviaciones</b> (excepciones o alternativas del actor). Un buen caso de uso documenta ambas para que el diseño cubra los fallos."
  },
  {
    id: "ISW-030", parcial: "Parcial 1", tema: "Diseño de software", dificultad: "facil", tipo: "multiple",
    q: "El diseño de software es la etapa que:",
    options: ["genera el código final del sistema", "transforma los requerimientos en modelos de solución que describen un sistema de alta calidad", "define el presupuesto del proyecto", "realiza las pruebas beta con los usuarios finales"],
    correct: 1,
    exp: "El diseño combina <b>creatividad y conocimiento técnico</b>: reúne principios, conceptos y prácticas para <b>transformar los requerimientos en modelos de solución</b> de alta calidad. La codificación y las pruebas corresponden a otras actividades del proceso."
  },
  {
    id: "ISW-031", parcial: "Parcial 1", tema: "Diseño de software", dificultad: "facil", tipo: "vf",
    q: "La deuda técnica ocurre cuando se elige una solución rápida en lugar de una mejor solución de diseño.",
    options: ["Verdadero", "Falso"], correct: 0,
    exp: "<b>Verdadero</b>: la deuda técnica nace de preferir la solución rápida sobre la mejor solución de diseño. Sus consecuencias son mayor esfuerzo de mantenimiento, código difícil de modificar e incremento del costo del proyecto."
  },
  {
    id: "ISW-032", parcial: "Parcial 1", tema: "Diseño de software", dificultad: "media", tipo: "multiple",
    q: "Durante la evaluación del diseño, el equipo verifica el modelo para detectar:",
    options: ["solo errores de sintaxis del código", "errores, inconsistencias, omisiones, cumplimiento de restricciones de costo y tiempo, y viabilidad técnica", "la opinión del cliente sobre los colores de la interfaz", "la cantidad de líneas de código producidas"],
    correct: 1,
    exp: "La evaluación del diseño verifica <b>errores, inconsistencias y omisiones</b>, el cumplimiento de <b>restricciones de costo y tiempo</b> y la <b>viabilidad técnica</b>. Es una revisión del modelo, no del código."
  },
  {
    id: "ISW-033", parcial: "Parcial 1", tema: "Diseño de software", dificultad: "dificil", tipo: "multiple",
    q: "En los conceptos del diseño, la diversificación y la convergencia consisten respectivamente en:",
    options: ["copiar diseños existentes y eliminar la documentación", "generar múltiples alternativas de diseño y evaluarlas para seleccionar la mejor según los requerimientos funcionales y no funcionales", "agregar más funcionalidades y reducir las pruebas", "aumentar la deuda técnica y luego pagarla"],
    correct: 1,
    exp: "<b>Diversificar</b> es generar múltiples alternativas de diseño; <b>converger</b> es evaluarlas y seleccionar la mejor solución según los requerimientos funcionales y no funcionales. Juntas equilibran creatividad y decisión técnica."
  },
  {
    id: "ISW-034", parcial: "Parcial 1", tema: "Diseño de software", dificultad: "facil", tipo: "multiple",
    q: "¿Cuál de los siguientes NO es uno de los elementos del modelo de diseño de software?",
    options: ["Diseño de datos / clases", "Diseño arquitectónico", "Diseño de interfaces", "Diseño de pruebas de aceptación"],
    correct: 3,
    exp: "Los cuatro elementos del modelo de diseño son: <b>datos/clases</b>, <b>arquitectónico</b>, <b>interfaces</b> y <b>componentes</b>. El diseño de pruebas pertenece a la actividad de construcción, no al modelo de diseño."
  },
  {
    id: "ISW-035", parcial: "Parcial 1", tema: "Interesados del proyecto", dificultad: "media", tipo: "multiple",
    q: "En el guión de interesados del caso ERP de Naibe, la técnica usada para capturar la percepción de cada personaje y retroalimentar entregables como el Acta de Constitución es:",
    options: ["Blueprinting", "VOC (Voice of Customers)", "Cutover", "Daily Scrum"],
    correct: 1,
    exp: "El guión usa el <b>VOC (Voice of Customers)</b>: cada interesado describe su percepción del proyecto y esa información alimenta el análisis de interesados y entregables como el Acta de Constitución. El blueprinting y el cutover son responsabilidades del proveedor del ERP."
  },
  {
    id: "ISW-036",
    parcial: "Parcial 1",
    tema: "Casos de Uso",
    dificultad: "media",
    tipo: "diagrama",
    subtipo: "casos-uso",
    q: "Modela el sistema ERP de Naibe: los actores (Gerente Proyecto, Analista Negocios, Usuario Financiero) y sus casos de uso principales. El Gerente coordina el proyecto, el Analista hace blueprinting, y el Usuario Financiero participa en la migración de datos.",
    nodosPool: ["Gerente Proyecto", "Analista Negocios", "Usuario Financiero", "Coordinar Proyecto", "Blueprinting", "Migrar Datos"],
    relacionesEsperadas: [
      { de: "Gerente Proyecto", a: "Coordinar Proyecto", tipo: "asociación" },
      { de: "Analista Negocios", a: "Blueprinting", tipo: "asociación" },
      { de: "Usuario Financiero", a: "Migrar Datos", tipo: "asociación" }
    ],
    exp: "En un diagrama de <b>casos de uso</b>, los <b>actores</b> (personas o sistemas externos) se conectan con los <b>casos de uso</b> (funcionalidades del sistema) mediante líneas de <b>asociación</b>. Cada actor participa en los casos de uso que le corresponden según sus responsabilidades en el proyecto ERP."
  },
  {
    id: "ISW-037",
    parcial: "Parcial 1",
    tema: "Diagramas de Actividad",
    dificultad: "dificil",
    tipo: "diagrama",
    subtipo: "actividades",
    q: "Modela el flujo del cutover del proyecto ERP: inicio → preparar migración → ¿datos validados? → si sí: ejecutar cutover → fin exitoso; si no: revertir cambios → fin fallido.",
    nodosPool: ["preparar migración", "¿datos validados?", "ejecutar cutover", "revertir cambios"],
    nodosFijos: ["inicio", "fin exitoso", "fin fallido"],
    relacionesEsperadas: [
      { de: "inicio", a: "preparar migración", tipo: "transición" },
      { de: "preparar migración", a: "¿datos validados?", tipo: "transición" },
      { de: "¿datos validados?", a: "ejecutar cutover", tipo: "transición", guarda: "[sí]" },
      { de: "¿datos validados?", a: "revertir cambios", tipo: "transición", guarda: "[no]" },
      { de: "ejecutar cutover", a: "fin exitoso", tipo: "transición" },
      { de: "revertir cambios", a: "fin fallido", tipo: "transición" }
    ],
    exp: "Los <b>diagramas de actividad</b> modelan flujos de trabajo con nodos de acción y decisiones. Los nodos de <b>decisión</b> (rombos) tienen salidas con <b>guardas</b> [condición] que determinan qué camino tomar. En este caso, el cutover solo procede si los datos están validados; si no, se revierten los cambios. Los nodos de inicio/fin son puntos fijos del flujo."
  },
  {
    id: "ISW-038", parcial: "Parcial 1", tema: "Interesados del proyecto", dificultad: "media", tipo: "multiple",
    q: "En el caso ERP de Naibe, ¿cuál de las siguientes tareas es responsabilidad del proveedor Pepesoft (y no del equipo interno de Naibe)?",
    options: ["Garantizar los recursos del proyecto distintos del personal de TI", "Documentar los procesos del negocio mediante Blueprinting", "Ser el punto único de contacto y comunicación del proyecto", "Decidir qué personas del proyecto deben ser cambiadas"],
    correct: 1,
    exp: "Entre las responsabilidades del proveedor están <b>levantar y documentar la información de procesos (Blueprinting)</b>, parametrizar el software, entrenar a los usuarios clave (KUs) y guiar el cutover. Garantizar recursos y reorganizar personal corresponden al gerente del país, y el punto de contacto es rol del gerente de proyecto interno."
  },
  {
    id: "ISW-039", parcial: "Parcial 1", tema: "Interesados del proyecto", dificultad: "facil", tipo: "multiple",
    q: "Según Diego Sin Miedo (gerente de proyecto interno de Naibe Colombia), ¿en cuáles tres temas es el responsable directo?",
    options: ["Compras, accesos y licenciamiento del software", "Pruebas, entrenamiento de usuarios finales y migración de datos", "Blueprinting, cutover y soporte de tercer nivel", "Presupuesto, contratación internacional y hosting"],
    correct: 1,
    exp: "Diego Sin Miedo declara ser responsable directo de <b>las pruebas, el entrenamiento de los usuarios finales y la migración de datos</b>, además de ser el punto de contacto y comunicación. El blueprinting y el cutover son del proveedor; las compras y accesos son su día a día pero no las lista como responsabilidades directas del proyecto."
  },
  {
    id: "ISW-040", parcial: "Parcial 1", tema: "Interesados del proyecto", dificultad: "dificil", tipo: "relacionar",
    q: "Relaciona cada personaje del guión de interesados con su rol en el proyecto ERP de Naibe.",
    pares: [
      ["Diego Sin Miedo", "Gerente de proyecto interno de Naibe Colombia"],
      ["Andrew Belt", "Nuevo gerente del país, que garantiza los recursos y pide lecciones aprendidas"],
      ["Herman Monster", "Gerente regional de TI con respaldo del Gerente Global de TI"],
      ["Papa Jeff", "Arquitecto empresarial con dedicación parcial al proyecto"],
      ["Lucho Chávez", "Gerente financiero que delegó en un usuario financiero"]
    ],
    exp: "Cada personaje del guión representa un interesado distinto: Diego es el <b>gerente de proyecto interno</b>, Andrew el <b>gerente del país</b>, Herman el <b>gerente regional de TI</b>, Papa Jeff el <b>arquitecto empresarial</b> y Lucho el <b>gerente financiero</b> que se aleja del proyecto delegando en su representante."
  },
  {
    id: "ISW-041", parcial: "Parcial 1", tema: "Interesados del proyecto", dificultad: "media", tipo: "vf",
    q: "En el caso Naibe, la mejor fecha para salir a producción sería el cambio de año fiscal (primeros días de enero), pero esa fecha no es factible y la operación iniciará en febrero.",
    options: ["Verdadero", "Falso"],
    correct: 0,
    exp: "<b>Verdadero</b>: el guión indica que la fecha ideal coincidiría con el fin del año fiscal e inicio del nuevo (primeros días de enero), pero <b>no es factible</b> y se empezará a operar en <b>febrero</b>, a pesar de que el proyecto tiene presupuesto aprobado."
  },
  {
    id: "ISW-042", parcial: "Parcial 1", tema: "Metodologías ágiles", dificultad: "facil", tipo: "multiple",
    q: "¿Quién propuso Extreme Programming (XP)?",
    options: ["David Anderson", "Kent Beck", "James Rumbaugh", "Ken Schwaber"],
    correct: 1,
    exp: "XP fue propuesta por <b>Kent Beck</b> y se apoya en prácticas de ingeniería muy disciplinadas y ciclos cortos de desarrollo. David Anderson adaptó Kanban al software y Rumbaugh está asociado a UML."
  },
  {
    id: "ISW-043", parcial: "Parcial 1", tema: "Metodologías ágiles", dificultad: "media", tipo: "multi",
    q: "¿Cuáles de las siguientes prácticas promueve Extreme Programming (XP) según su flujo de proceso?",
    options: ["Entregas frecuentes y pequeñas", "Refactorización continua del código", "Integración continua y pruebas automatizadas", "Limitar el trabajo en curso (WIP) por estado"],
    correctos: [0, 1, 2],
    exp: "XP promueve entregas pequeñas y frecuentes, <b>refactorización continua</b>, pruebas automatizadas, <b>integración continua</b> y comunicación directa entre programadores y clientes. Limitar el WIP por estado es una práctica básica de <b>Kanban</b>, no de XP."
  },
  {
    id: "ISW-044", parcial: "Parcial 1", tema: "Metodologías ágiles", dificultad: "media", tipo: "multiple",
    q: "Frente al enfoque clásico (que asume requerimientos congelados y un costo del cambio creciente con el tiempo), ¿cuál es la premisa del enfoque ágil respecto al costo del cambio?",
    options: ["Acepta que el costo del cambio crece y por eso congela los requerimientos temprano", "Busca mantener el costo del cambio bajo mediante entregas cortas y feedback continuo del cliente", "Elimina el costo del cambio porque no permite modificaciones tras el despliegue", "Traslada el costo del cambio al cliente mediante contratos rígidos"],
    correct: 1,
    exp: "Para el enfoque ágil <b>el cambio es constante</b> y la pregunta de negocio es cómo controlar lo imprevisible; los métodos ágiles mantienen <b>bajo el costo del cambio</b> con entregas cortas y <b>realimentación del cliente en cada iteración</b>. Congelar requerimientos temprano es justamente el supuesto clásico que encarece los cambios."
  },
  {
    id: "ISW-045", parcial: "Parcial 1", tema: "UML y casos de uso", dificultad: "facil", tipo: "multiple",
    q: "En el modelado basado en escenarios de UML, un escenario se define como:",
    options: ["la lista jerárquica de requerimientos funcionales del sistema", "una historia de cómo el sistema, un actor y los elementos circundantes reaccionan a un evento", "el diagrama de la estructura estática de las clases del sistema", "una tabla de decisiones con todas las combinaciones de entradas"],
    correct: 1,
    exp: "Un escenario es una <b>historia de cómo el sistema, un actor y los elementos circundantes reaccionan a un evento</b>; un escenario bien definido puede referirse a sí mismo como un caso de uso."
  },
  {
    id: "ISW-046", parcial: "Parcial 1", tema: "UML y casos de uso", dificultad: "media", tipo: "multiple",
    q: "¿Con qué tipo de audiencia se señala que los diagramas de casos de uso son especialmente útiles para comunicar el alcance funcional?",
    options: ["Con los desarrolladores que codifican los componentes internos", "Con clientes y usuarios no técnicos", "Con los administradores de bases de datos", "Con el equipo de pruebas de rendimiento"],
    correct: 1,
    exp: "Los diagramas de casos de uso son <b>ideales para comunicar el alcance funcional con clientes y usuarios no técnicos</b>: visualizan quiénes interactúan con el sistema y qué funcionalidades están disponibles, y definen el alcance de forma clara y visual."
  },
  {
    id: "ISW-047", parcial: "Parcial 1", tema: "UML y casos de uso", dificultad: "media", tipo: "ordenar",
    q: "Ordena los elementos que el escritor de un caso de uso debe identificar, según la plantilla vista en clase.",
    bloques: ["Actor(es) involucrados", "Descripción del objetivo", "Flujo de eventos (secuencia de pasos)", "Resultados esperados"],
    exp: "La plantilla del caso de uso pide identificar primero los <b>actores</b>, luego la <b>descripción del objetivo</b>, después el <b>flujo de eventos</b> y finalmente los <b>resultados esperados</b>. El caso de uso describe la función del sistema desde el punto de vista del usuario."
  },
  {
    id: "ISW-048", parcial: "Parcial 1", tema: "Scrum", dificultad: "facil", tipo: "multiple",
    q: "El nombre de la metodología Scrum proviene de:",
    options: ["un acrónimo en inglés sobre gestión de requerimientos", "una jugada del Rugby", "el apellido de su creador japonés", "una herramienta de la ingeniería industrial de Toyota"],
    correct: 1,
    exp: "El nombre proviene de una <b>jugada de Rugby</b>. Scrum es eficaz para proyectos con plazos de entrega muy cortos, requerimientos cambiantes y negocios críticos, e incorpora las actividades estructurales del proceso."
  },
  {
    id: "ISW-049", parcial: "Parcial 1", tema: "Scrum", dificultad: "media", tipo: "multiple",
    q: "En Scrum, ¿en qué consisten las \"demostraciones preliminares\"?",
    options: ["En presentar el acta de constitución del proyecto al comité directivo", "En entregar el incremento de software al cliente para demostrar y evaluar la funcionalidad implementada", "En mostrar el diagrama de Gantt actualizado cada fin de mes", "En ejecutar las pruebas beta con usuarios externos antes del lanzamiento"],
    correct: 1,
    exp: "Las demostraciones preliminares <b>entregan el incremento de software al cliente</b> para que la funcionalidad que se va implementando pueda <b>demostrarse y evaluarse</b>. Son una de las cuatro acciones de desarrollo de Scrum junto con el retraso, los sprints y las reuniones diarias."
  },
  {
    id: "ISW-050", parcial: "Parcial 1", tema: "Modelos de proceso", dificultad: "dificil", tipo: "multiple",
    q: "El modelo en V se caracteriza por ser:",
    options: ["un modelo evolutivo que construye prototipos desechables antes del producto real", "una variante de la cascada que relaciona las acciones de aseguramiento de la calidad con las etapas de comunicación, modelado y construcción temprana", "un modelo incremental donde cada incremento agrega funcionalidad operable al cliente", "un marco extensible impulsado por UML con fases de concepción y transición"],
    correct: 1,
    exp: "El modelo en V es una <b>variante del modelo de cascada</b> que vincula el <b>aseguramiento de la calidad</b> con las acciones de comunicación, modelado y construcción temprana. La opción del marco impulsado por UML describe al Proceso Unificado y la de prototipos, al paradigma de prototipos."
  },
  {
    id: "ISW-051", parcial: "Parcial 1", tema: "Modelos de proceso", dificultad: "dificil", tipo: "multi",
    q: "¿Cuáles de las siguientes afirmaciones corresponden a los modelos evolutivos del proceso de software?",
    options: ["Cada iteración genera una versión final más completa del software", "Los productos del trabajo, el aseguramiento de la calidad y los mecanismos de control del cambio son características de estos modelos", "Asumen requerimientos bien definidos y estabilidad razonable desde el inicio", "Combinan el proceso lineal con el paralelo para entregar incrementos operables"],
    correctos: [0, 1],
    exp: "En los modelos <b>evolutivos</b> el software cambia y evoluciona: cada iteración produce una versión más completa, y entre sus características están los productos del trabajo, el aseguramiento de la calidad y el control del cambio; el prototipo (desechable o evolutivo) es un ejemplo. Las otras dos opciones describen respectivamente la <b>Cascada</b> y el modelo <b>incremental</b>."
  },
  {
    id: "ISW-052", parcial: "Parcial 1", tema: "Diseño de software", dificultad: "facil", tipo: "multiple",
    q: "Según la clase de diseño de software, ¿quién debe realizar las tareas de diseño?",
    options: ["El cliente, pues conoce sus necesidades de negocio", "Los ingenieros de software, entendiendo tanto el problema como las limitaciones del entorno de implementación", "Un gerente de proyecto externo especializado en estimaciones", "El equipo de pruebas, al validar cada componente terminado"],
    correct: 1,
    exp: "Las tareas de diseño las realizan los <b>ingenieros de software</b>: el diseñador debe entender <b>tanto el problema como las limitaciones del entorno</b> donde se implementará la solución, combinando creatividad y conocimiento técnico."
  }
];

export default preguntas;
