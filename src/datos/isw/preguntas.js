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
      { de: "Gerente Proyecto", a: "Coordinar Proyecto", tipo: "asociacion" },
      { de: "Analista Negocios", a: "Blueprinting", tipo: "asociacion" },
      { de: "Usuario Financiero", a: "Migrar Datos", tipo: "asociacion" }
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
      { de: "inicio", a: "preparar migración", tipo: "transicion" },
      { de: "preparar migración", a: "¿datos validados?", tipo: "transicion" },
      { de: "¿datos validados?", a: "ejecutar cutover", tipo: "transicion", guarda: "[sí]" },
      { de: "¿datos validados?", a: "revertir cambios", tipo: "transicion", guarda: "[no]" },
      { de: "ejecutar cutover", a: "fin exitoso", tipo: "transicion" },
      { de: "revertir cambios", a: "fin fallido", tipo: "transicion" }
    ],
    exp: "Los <b>diagramas de actividad</b> modelan flujos de trabajo con nodos de acción y decisiones. Los nodos de <b>decisión</b> (rombos) tienen salidas con <b>guardas</b> [condición] que determinan qué camino tomar. En este caso, el cutover solo procede si los datos están validados; si no, se revierten los cambios. Los nodos de inicio/fin son puntos fijos del flujo."
  }
];

export default preguntas;
