// Banco de preguntas de Ingeniería de Software.
// Se completa por lotes revisados a partir de los .md de BancoDeInformacion/IngenieriaDeSoftware/.
// Regla de redacción: los enunciados no mencionan material externo (clase, guión, etc.);
// todo el contexto necesario para responder va dentro del propio enunciado.
const preguntas = [
  {
    id: "ISW-001", parcial: "Parcial 1", tema: "Scrum", dificultad: "facil", tipo: "multiple",
    q: "En el proceso Scrum, ¿a qué caja de tiempo predefinida debe ajustarse un sprint?",
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
    q: "En el Manifiesto Ágil, ¿qué se valora por encima de apegarse a un plan?",
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
    q: "¿Cuál de las siguientes NO es una metodología ágil?",
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
    q: "En el diseño de software, la diversificación y la convergencia consisten respectivamente en:",
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
    q: "En la implementación de un ERP, ¿qué técnica se usa para capturar la percepción que cada interesado tiene del proyecto y retroalimentar entregables como el Acta de Constitución?",
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
    q: "La empresa Naibe implementa un ERP con apoyo del proveedor Pepesoft. ¿Cuál de las siguientes tareas es responsabilidad del proveedor (y no del equipo interno de Naibe)?",
    options: ["Garantizar los recursos del proyecto distintos del personal de TI", "Documentar los procesos del negocio mediante Blueprinting", "Ser el punto único de contacto y comunicación del proyecto", "Decidir qué personas del proyecto deben ser cambiadas"],
    correct: 1,
    exp: "Entre las responsabilidades del proveedor están <b>levantar y documentar la información de procesos (Blueprinting)</b>, parametrizar el software, entrenar a los usuarios clave (KUs) y guiar el cutover. Garantizar recursos y reorganizar personal corresponden al gerente del país, y el punto de contacto es rol del gerente de proyecto interno."
  },
  {
    id: "ISW-039", parcial: "Parcial 1", tema: "Interesados del proyecto", dificultad: "facil", tipo: "multiple",
    q: "Diego Sin Miedo es el gerente de proyecto interno de Naibe Colombia en la implementación de un ERP y es el punto de contacto y comunicación del proyecto. ¿De cuáles tres temas es además el responsable directo?",
    options: ["Compras, accesos y licenciamiento del software", "Pruebas, entrenamiento de usuarios finales y migración de datos", "Blueprinting, cutover y soporte de tercer nivel", "Presupuesto, contratación internacional y hosting"],
    correct: 1,
    exp: "Diego Sin Miedo declara ser responsable directo de <b>las pruebas, el entrenamiento de los usuarios finales y la migración de datos</b>, además de ser el punto de contacto y comunicación. El blueprinting y el cutover son del proveedor; las compras y accesos son su día a día pero no las lista como responsabilidades directas del proyecto."
  },
  {
    id: "ISW-040", parcial: "Parcial 1", tema: "Interesados del proyecto", dificultad: "dificil", tipo: "relacionar",
    q: "En el proyecto de implementación del ERP de Naibe, relaciona cada personaje con su rol.",
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
    q: "En la implementación del ERP de Naibe, la mejor fecha para salir a producción sería el cambio de año fiscal (primeros días de enero), pero esa fecha no es factible y la operación iniciará en febrero.",
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
    q: "¿Cuáles de las siguientes prácticas promueve Extreme Programming (XP)?",
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
    q: "¿Con qué tipo de audiencia resultan especialmente útiles los diagramas de casos de uso para comunicar el alcance funcional?",
    options: ["Con los desarrolladores que codifican los componentes internos", "Con clientes y usuarios no técnicos", "Con los administradores de bases de datos", "Con el equipo de pruebas de rendimiento"],
    correct: 1,
    exp: "Los diagramas de casos de uso son <b>ideales para comunicar el alcance funcional con clientes y usuarios no técnicos</b>: visualizan quiénes interactúan con el sistema y qué funcionalidades están disponibles, y definen el alcance de forma clara y visual."
  },
  {
    id: "ISW-047", parcial: "Parcial 1", tema: "UML y casos de uso", dificultad: "media", tipo: "ordenar",
    q: "Ordena los elementos que debe identificar quien escribe un caso de uso, siguiendo el orden habitual de su plantilla.",
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
    q: "¿Quién debe realizar las tareas de diseño de software?",
    options: ["El cliente, pues conoce sus necesidades de negocio", "Los ingenieros de software, entendiendo tanto el problema como las limitaciones del entorno de implementación", "Un gerente de proyecto externo especializado en estimaciones", "El equipo de pruebas, al validar cada componente terminado"],
    correct: 1,
    exp: "Las tareas de diseño las realizan los <b>ingenieros de software</b>: el diseñador debe entender <b>tanto el problema como las limitaciones del entorno</b> donde se implementará la solución, combinando creatividad y conocimiento técnico."
  },
  /* ═══ Lote 2 · ISW-053 a ISW-098 ═══ */
  {
    id: "ISW-053", parcial: "Parcial 1", tema: "Scrum", dificultad: "facil", tipo: "multiple",
    q: "En Scrum, ¿cuál es la responsabilidad principal del maestro Scrum?",
    options: ["Asignar las tareas individuales a cada desarrollador y controlar cuántas horas trabaja cada uno", "Aprobar o rechazar el presupuesto del proyecto y negociar el contrato con el cliente", "Facilitar el proceso y ayudar al equipo a eliminar los obstáculos que le impiden avanzar", "Escribir el código más complejo de cada sprint para asegurar la calidad técnica del producto"],
    correct: 2,
    exp: "El <b>maestro Scrum</b> facilita el proceso: dirige las reuniones diarias, ayuda a eliminar los obstáculos del equipo y vela por que se sigan las prácticas de Scrum. No asigna tareas: el equipo se autoorganiza y decide cómo repartirse el trabajo."
  },
  {
    id: "ISW-054", parcial: "Parcial 1", tema: "Scrum", dificultad: "media", tipo: "multiple",
    q: "¿Quién es responsable de ordenar y priorizar los elementos del retraso (backlog) del producto para maximizar su valor?",
    options: ["El maestro Scrum", "El dueño del producto (Product Owner)", "Cada desarrollador según su criterio", "El gerente de calidad al cierre del sprint"],
    correct: 1,
    exp: "El <b>dueño del producto</b> representa los intereses del cliente y es quien ordena y prioriza el retraso para maximizar el valor del producto. El maestro Scrum facilita el proceso y el equipo de desarrollo construye el incremento."
  },
  {
    id: "ISW-055", parcial: "Parcial 1", tema: "Scrum", dificultad: "media", tipo: "ordenar",
    q: "Ordena los eventos de un sprint de Scrum desde su inicio hasta su cierre.",
    bloques: ["Planeación del sprint", "Reuniones diarias durante el sprint", "Revisión del sprint (demostración del incremento)", "Retrospectiva del sprint"],
    exp: "El sprint arranca con la <b>planeación</b> (se elige el trabajo del retraso que se abordará), continúa con las <b>reuniones diarias</b> durante el desarrollo y termina con la <b>revisión</b> (demostración del incremento al cliente) y la <b>retrospectiva</b> (mejora del propio proceso del equipo)."
  },
  {
    id: "ISW-056", parcial: "Parcial 1", tema: "Scrum", dificultad: "media", tipo: "vf",
    q: "La retrospectiva del sprint sirve para que el equipo inspeccione su propia forma de trabajar y acuerde mejoras para el siguiente sprint.",
    options: ["Verdadero", "Falso"], correct: 0,
    exp: "<b>Verdadero</b>: la retrospectiva inspecciona el <b>proceso y la forma de trabajar</b> del equipo (personas, relaciones, herramientas) y define mejoras para el siguiente sprint. La revisión del sprint, en cambio, inspecciona el <b>producto</b> (el incremento)."
  },
  {
    id: "ISW-057", parcial: "Parcial 1", tema: "Scrum", dificultad: "dificil", tipo: "multi",
    q: "¿Cuáles de las siguientes afirmaciones sobre el retraso (backlog) del producto son correctas?",
    options: ["Es una lista priorizada de lo que necesita el producto", "Puede actualizarse y reordenarse durante el proyecto", "Los elementos de mayor prioridad deben estar más claros y detallados que los de menor prioridad", "Queda congelado después del primer sprint y no admite cambios"],
    correctos: [0, 1, 2],
    exp: "El retraso es una lista <b>viva y priorizada</b>: se puede actualizar y reordenar a lo largo del proyecto, y los elementos más prioritarios se detallan más porque serán los primeros en trabajarse. No se congela tras el primer sprint: su flexibilidad es justamente lo que permite responder al cambio."
  },
  {
    id: "ISW-058", parcial: "Parcial 1", tema: "Scrum", dificultad: "media", tipo: "desarrollo",
    q: "Describe los tres roles del equipo Scrum (dueño del producto, maestro Scrum y equipo de desarrollo) y la responsabilidad principal de cada uno.",
    solucion: "El dueño del producto (Product Owner) representa los intereses del cliente y de los interesados, y es responsable de gestionar y priorizar el retraso (backlog) para maximizar el valor del producto. El maestro Scrum (Scrum Master) facilita el proceso, dirige las reuniones y ayuda a eliminar los obstáculos del equipo. El equipo de desarrollo es un grupo autoorganizado y multidisciplinario que construye el incremento de software en cada sprint.",
    claves: ["dueño del producto", "maestro scrum", "equipo de desarrollo", "retraso"],
    exp: "Los tres roles se complementan: el <b>dueño del producto</b> decide <i>qué</i> construir y en qué orden, el <b>equipo de desarrollo</b> decide <i>cómo</i> construirlo y el <b>maestro Scrum</b> cuida que el proceso funcione y que los obstáculos se eliminen."
  },
  {
    id: "ISW-059", parcial: "Parcial 1", tema: "Software y sus categorías", dificultad: "facil", tipo: "multiple",
    q: "Un programa que simula fenómenos físicos y realiza cálculos numéricos intensivos para apoyar el trabajo de científicos e ingenieros se clasifica como:",
    options: ["software científico y de ingeniería", "software incrustado en dispositivos", "software de línea de productos", "software de sistemas y utilerías"],
    correct: 0,
    exp: "El <b>software científico y de ingeniería</b> se apoya en algoritmos de procesamiento numérico (simulación, análisis y modelado de fenómenos). El incrustado vive dentro de un producto físico, el de línea de productos se ofrece a muchos clientes y el de sistemas da servicio a otros programas."
  },
  {
    id: "ISW-060", parcial: "Parcial 1", tema: "Software y sus categorías", dificultad: "media", tipo: "multiple",
    q: "El software diseñado para ofrecer una capacidad específica que puede usarse por muchos clientes distintos (por ejemplo, un procesador de texto o una hoja de cálculo) se conoce como software:",
    options: ["incrustado", "de sistemas", "de línea de productos", "de inteligencia artificial"],
    correct: 2,
    exp: "El <b>software de línea de productos</b> ofrece una capacidad específica para uso de muchos clientes distintos, ya sea en un mercado limitado (control de inventario) o masivo (procesadores de texto, hojas de cálculo). El incrustado controla funciones dentro de un producto y el de IA usa algoritmos no numéricos."
  },
  {
    id: "ISW-061", parcial: "Parcial 1", tema: "Software y sus categorías", dificultad: "media", tipo: "vf",
    q: "El software se manufactura igual que el hardware: una vez diseñado, su mayor costo está en producir cada copia.",
    options: ["Verdadero", "Falso"], correct: 1,
    exp: "<b>Falso</b>: el software se <b>desarrolla o modifica mediante ingeniería</b>, no se fabrica en el sentido clásico. Su costo está en el análisis, el diseño, la construcción y las pruebas; reproducir una copia cuesta casi nada, a diferencia del hardware."
  },
  {
    id: "ISW-062", parcial: "Parcial 1", tema: "Software y sus categorías", dificultad: "dificil", tipo: "multi",
    q: "¿Cuáles son razones frecuentes por las que el software heredado (legacy) debe evolucionar?",
    options: ["Adaptarse a nuevos entornos o tecnologías de cómputo", "Incorporar nuevos requerimientos de negocio", "Volverse interoperable con otros sistemas y bases de datos", "Porque se desgasta físicamente con el uso"],
    correctos: [0, 1, 2],
    exp: "El software heredado sigue en uso porque satisface necesidades del negocio, pero debe evolucionar: <b>adaptarse</b> a nuevos entornos, <b>incorporar</b> nuevos requerimientos, volverse <b>interoperable</b> y <b>rediseñar su arquitectura</b>. El software no se desgasta físicamente con el uso; se deteriora por los cambios acumulados."
  },
  {
    id: "ISW-063", parcial: "Parcial 1", tema: "Proceso del software", dificultad: "facil", tipo: "multiple",
    q: "En las capas de la ingeniería de software, ¿cuál es la base sobre la que se apoyan el proceso, los métodos y las herramientas?",
    options: ["El enfoque en la calidad", "Las herramientas de soporte", "La documentación del proyecto", "El despliegue al cliente"],
    correct: 0,
    exp: "La ingeniería de software es una tecnología en capas cuya base es el <b>enfoque en la calidad</b>. Sobre ella se apoyan el <b>proceso</b> (el marco que une las capas), los <b>métodos</b> (cómo construir el software) y las <b>herramientas</b> (soporte automatizado)."
  },
  {
    id: "ISW-064", parcial: "Parcial 1", tema: "Proceso del software", dificultad: "media", tipo: "relacionar",
    q: "Relaciona cada actividad estructural del proceso de software con su propósito.",
    pares: [
      ["Comunicación", "Entender los objetivos de los participantes y reunir los requerimientos"],
      ["Planeación", "Definir el trabajo, los recursos, los riesgos y el calendario"],
      ["Modelado", "Crear representaciones para comprender mejor el problema y su solución"],
      ["Construcción", "Generar el código y realizar las pruebas"],
      ["Despliegue", "Entregar el software al cliente para su evaluación y recibir realimentación"]
    ],
    exp: "Cada actividad estructural responde a una pregunta distinta: <b>comunicación</b> (qué necesita el cliente), <b>planeación</b> (cómo y cuándo se hará), <b>modelado</b> (cómo se ve la solución), <b>construcción</b> (implementarla y probarla) y <b>despliegue</b> (entregarla y aprender de la realimentación)."
  },
  {
    id: "ISW-065", parcial: "Parcial 1", tema: "Proceso del software", dificultad: "media", tipo: "multiple",
    q: "En un proceso de software, ¿cómo se relacionan las actividades estructurales, las acciones y las tareas?",
    options: ["Una tarea contiene varias actividades estructurales, y cada actividad contiene varias acciones", "Cada actividad estructural contiene acciones, y cada acción se compone de un conjunto de tareas que generan productos de trabajo", "Las acciones y las tareas son sinónimos y las actividades estructurales no las incluyen", "Las actividades estructurales son opcionales y se sustituyen por las tareas"],
    correct: 1,
    exp: "El proceso se organiza de lo general a lo particular: cada <b>actividad estructural</b> incluye <b>acciones</b> (por ejemplo, la obtención de requerimientos dentro de comunicación) y cada acción se detalla en un <b>conjunto de tareas</b> con sus productos de trabajo, puntos de control de calidad e hitos."
  },
  {
    id: "ISW-066", parcial: "Parcial 1", tema: "Modelos de proceso", dificultad: "media", tipo: "multiple",
    q: "¿Qué caracteriza al modelo de proceso en espiral?",
    options: ["Es un modelo estrictamente secuencial que no permite volver a una etapa anterior", "Se aplica solo durante las pruebas finales del sistema, cuando el código ya está terminado", "Es un modelo evolutivo dirigido por el riesgo, donde cada vuelta produce versiones cada vez más completas del software", "Elimina la planeación porque el software se construye por intuición y ajustes sucesivos"],
    correct: 2,
    exp: "El modelo en <b>espiral</b> combina la naturaleza iterativa de los prototipos con aspectos sistemáticos de la cascada. Se dirige por el <b>análisis de riesgos</b> y cada vuelta produce una versión más completa. La secuencia estricta describe a la cascada."
  },
  {
    id: "ISW-067", parcial: "Parcial 1", tema: "Modelos de proceso", dificultad: "media", tipo: "multiple",
    q: "El desarrollo rápido de aplicaciones (DRA / RAD) se caracteriza por:",
    options: ["un ciclo de desarrollo muy corto apoyado en la construcción basada en componentes reutilizables", "un análisis previo de varios años antes de escribir la primera línea de código", "su aplicación exclusiva a sistemas monolíticos que no pueden dividirse en módulos", "la ausencia total de modelado del negocio y de los datos"],
    correct: 0,
    exp: "El DRA es un modelo incremental de <b>ciclo muy corto</b> (una adaptación de alta velocidad de la cascada) que logra rapidez mediante <b>construcción basada en componentes</b>. Requiere que el sistema pueda dividirse en módulos, por lo que no aplica a sistemas monolíticos."
  },
  {
    id: "ISW-068", parcial: "Parcial 1", tema: "Modelos de proceso", dificultad: "facil", tipo: "vf",
    q: "En el modelo de Cascada, el cliente no ve una versión funcional del software sino hasta etapas avanzadas del proyecto.",
    options: ["Verdadero", "Falso"], correct: 0,
    exp: "<b>Verdadero</b>: la cascada avanza de forma lineal y secuencial, así que el software funcional aparece tarde. Por eso los cambios en etapas avanzadas son costosos y se requiere paciencia del cliente."
  },
  {
    id: "ISW-069", parcial: "Parcial 1", tema: "Modelos de proceso", dificultad: "media", tipo: "vf",
    q: "El Proceso Unificado está dirigido por casos de uso, se centra en la arquitectura y es iterativo e incremental.",
    options: ["Verdadero", "Falso"], correct: 0,
    exp: "<b>Verdadero</b>: esas son las tres características que definen al PU. Sus fases son concepción, elaboración, construcción, transición y producción, y se apoya en UML para modelar el sistema."
  },
  {
    id: "ISW-070", parcial: "Parcial 1", tema: "Modelos de proceso", dificultad: "dificil", tipo: "multiple",
    q: "¿Cuál es un riesgo frecuente del paradigma de prototipos?",
    options: ["Que el cliente crea que el prototipo ya es el producto final y presione por entregarlo aunque se haya construido sin cuidar la calidad", "Que no permita obtener retroalimentación del cliente, porque el prototipo se construye sin mostrárselo a nadie hasta el final", "Que impida definir requerimientos que al inicio del proyecto no están claros ni para el propio cliente", "Que su costo siempre supere al del sistema final, por lo que nunca conviene construirlo"],
    correct: 0,
    exp: "Un problema típico es que los participantes ven lo que parece una <b>versión funcional</b> y no saben que el prototipo se armó sin cuidar la calidad ni la mantenibilidad. Piden entregarlo con pocos ajustes. Justamente el prototipo <b>sirve</b> para obtener retroalimentación y aclarar requerimientos."
  },
  {
    id: "ISW-071", parcial: "Parcial 1", tema: "Modelos de proceso", dificultad: "dificil", tipo: "relacionar",
    q: "Relaciona cada modelo de proceso con su característica principal.",
    pares: [
      ["Cascada", "Trabajo lineal y secuencial con requerimientos bien definidos"],
      ["Incremental", "Entrega avances operables en cada incremento"],
      ["Prototipos", "Construye versiones preliminares para aclarar requerimientos poco definidos"],
      ["Espiral", "Evolutivo y dirigido por el análisis de riesgos en cada vuelta"],
      ["Proceso Unificado", "Dirigido por casos de uso, centrado en la arquitectura e iterativo"]
    ],
    exp: "Cada modelo responde a un tipo de proyecto: la <b>cascada</b> a requerimientos estables, el <b>incremental</b> a entregas operables parciales, los <b>prototipos</b> a necesidades poco claras, la <b>espiral</b> a proyectos donde el riesgo domina y el <b>PU</b> a sistemas modelados con UML y casos de uso."
  },
  {
    id: "ISW-072", parcial: "Parcial 1", tema: "Modelos de proceso", dificultad: "dificil", tipo: "desarrollo",
    q: "Compara el modelo de Cascada con el modelo en espiral: explica cómo maneja cada uno los cambios en los requerimientos y los riesgos.",
    solucion: "En el modelo de Cascada el trabajo fluye de forma lineal y secuencial (comunicación, planeación, modelado, construcción y despliegue), por lo que funciona bien cuando los requerimientos están bien definidos y son estables; los cambios tardíos son costosos, no incluye un análisis de riesgos explícito en cada etapa y el cliente ve el software funcionando hasta el final. El modelo en espiral es evolutivo e iterativo: el proyecto avanza en vueltas y en cada una se planifica, se analizan los riesgos, se construye y se evalúa, generando versiones cada vez más completas; por eso tolera mejor los cambios en los requerimientos y permite detectar y mitigar riesgos de forma temprana.",
    claves: ["cascada", "espiral", "riesgo", "requerimientos"],
    exp: "La diferencia clave: la <b>cascada</b> asume requerimientos estables y avanza una sola vez de principio a fin; la <b>espiral</b> itera y revisa los <b>riesgos</b> en cada vuelta, así que absorbe mejor el cambio."
  },
  {
    id: "ISW-073", parcial: "Parcial 1", tema: "Metodologías ágiles", dificultad: "facil", tipo: "multiple",
    q: "¿Cuál de los siguientes es uno de los valores del Manifiesto Ágil?",
    options: ["Procesos y herramientas por encima de los individuos y sus interacciones", "Seguir un plan por encima de responder al cambio", "Software que funciona por encima de la documentación exhaustiva", "Negociación contractual por encima de la colaboración con el cliente"],
    correct: 2,
    exp: "Los cuatro valores son: <b>individuos e interacciones</b> sobre procesos y herramientas, <b>software que funciona</b> sobre documentación exhaustiva, <b>colaboración con el cliente</b> sobre negociación contractual y <b>responder al cambio</b> sobre seguir un plan. Las otras opciones invierten el orden."
  },
  {
    id: "ISW-074", parcial: "Parcial 1", tema: "Metodologías ágiles", dificultad: "media", tipo: "multi",
    q: "¿Cuáles de las siguientes son prácticas básicas de Kanban?",
    options: ["Visualizar el flujo de trabajo en un tablero", "Limitar el trabajo en curso (WIP)", "Medir y gestionar el flujo, por ejemplo con el tiempo de ciclo", "Exigir iteraciones de duración fija con planeación al inicio de cada una"],
    correctos: [0, 1, 2],
    exp: "Kanban <b>visualiza</b> el trabajo en un tablero, <b>limita el WIP</b> y <b>gestiona el flujo</b> con métricas como el tiempo de ciclo. No obliga a iteraciones de duración fija con planeación periódica: eso es propio de Scrum."
  },
  {
    id: "ISW-075", parcial: "Parcial 1", tema: "Metodologías ágiles", dificultad: "media", tipo: "ordenar",
    q: "Ordena las etapas de un Design Sprint, que se desarrolla en una semana.",
    bloques: ["Mapear el problema", "Esbozar soluciones", "Decidir", "Prototipar", "Probar con usuarios"],
    exp: "El Design Sprint, creado en Google Ventures, condensa el proceso en cinco días: <b>mapear</b> el problema, <b>esbozar</b> soluciones, <b>decidir</b> cuál probar, <b>prototipar</b> una versión realista y <b>probar</b> con usuarios reales."
  },
  {
    id: "ISW-076", parcial: "Parcial 1", tema: "Metodologías ágiles", dificultad: "media", tipo: "dragdrop",
    q: "Completa la descripción de un tablero Kanban.",
    codigo: "En un tablero Kanban el trabajo avanza por columnas como Por hacer, En progreso y {1}, y se limita el {2} para no sobrecargar al equipo.",
    respuestas: ["Hecho", "trabajo en curso (WIP)"],
    piezas: ["Hecho", "trabajo en curso (WIP)", "presupuesto", "incremento"],
    exp: "Las tarjetas se mueven por columnas hasta <b>Hecho</b>, y el límite de <b>trabajo en curso (WIP)</b> evita empezar más cosas de las que el equipo puede terminar, lo que deja al descubierto los cuellos de botella."
  },
  {
    id: "ISW-077", parcial: "Parcial 1", tema: "Metodologías ágiles", dificultad: "media", tipo: "multi",
    q: "¿Cuáles de los siguientes son valores de Extreme Programming (XP)?",
    options: ["Comunicación", "Simplicidad", "Retroalimentación (feedback)", "Burocracia documental"],
    correctos: [0, 1, 2],
    exp: "Los valores de XP son <b>comunicación</b>, <b>simplicidad</b>, <b>retroalimentación</b>, valor (coraje) y respeto. La burocracia documental va en contra del espíritu de XP, que prefiere el software funcionando y la comunicación directa."
  },
  {
    id: "ISW-078", parcial: "Parcial 1", tema: "Historias de usuario", dificultad: "facil", tipo: "multiple",
    q: "¿Cuál es la plantilla habitual para redactar una historia de usuario?",
    options: ["Clase, atributo, método y visibilidad de cada elemento", "Si [condición] entonces [acción] en caso contrario [otra acción]", "Como [rol], quiero [funcionalidad] para [beneficio]", "Entrada, proceso y salida descritos en pseudocódigo"],
    correct: 2,
    exp: "La plantilla clásica es <b>«Como [rol], quiero [funcionalidad] para [beneficio]»</b>: identifica a quién sirve la función, qué necesita y qué valor obtiene. Las otras opciones corresponden a otros artefactos técnicos."
  },
  {
    id: "ISW-079", parcial: "Parcial 1", tema: "Historias de usuario", dificultad: "media", tipo: "multiple",
    q: "¿Para qué sirven los criterios de aceptación de una historia de usuario?",
    options: ["Para asignar el presupuesto de cada historia dentro del plan financiero del proyecto", "Para documentar el diseño de la base de datos que respaldará la historia", "Para reemplazar todas las pruebas del sistema durante la fase de construcción", "Para definir las condiciones que debe cumplir la historia para considerarse terminada y aceptada"],
    correct: 3,
    exp: "Los <b>criterios de aceptación</b> concretan cuándo una historia está terminada desde el punto de vista del usuario y sirven de base para probarla. No definen presupuesto ni diseño técnico, y no sustituyen las demás pruebas."
  },
  {
    id: "ISW-080", parcial: "Parcial 1", tema: "Historias de usuario", dificultad: "dificil", tipo: "multi",
    q: "¿Cuáles de las siguientes son características de una buena historia de usuario según el criterio INVEST?",
    options: ["Independiente", "Estimable", "Verificable (testeable)", "Inmutable (no se puede negociar)"],
    correctos: [0, 1, 2],
    exp: "INVEST significa Independiente, <b>N</b>egociable, con <b>V</b>alor, <b>E</b>stimable, pequeña (<b>S</b>mall) y <b>T</b>esteable. «Inmutable» contradice la característica de ser <b>negociable</b>: los detalles se conversan y se ajustan."
  },
  {
    id: "ISW-081", parcial: "Parcial 1", tema: "Historias de usuario", dificultad: "media", tipo: "vf",
    q: "Una buena historia de usuario debe especificar en detalle la solución técnica que implementarán los desarrolladores.",
    options: ["Verdadero", "Falso"], correct: 1,
    exp: "<b>Falso</b>: la historia describe <b>qué</b> necesita el usuario y <b>por qué</b> (el valor), no <b>cómo</b> se implementará. Los detalles se aclaran conversando con el equipo y se concretan en los criterios de aceptación."
  },
  {
    id: "ISW-082", parcial: "Parcial 1", tema: "Historias de usuario", dificultad: "media", tipo: "desarrollo",
    q: "Redacta una historia de usuario para que un estudiante pueda consultar sus calificaciones en una plataforma académica y añade dos criterios de aceptación.",
    solucion: "Historia: Como estudiante, quiero consultar mis calificaciones en la plataforma para conocer mi rendimiento en cada asignatura. Criterios de aceptación: 1) Dado que inicié sesión, cuando entro a la sección de calificaciones, entonces veo la nota de cada asignatura del periodo actual. 2) Dado que una nota aún no fue publicada, cuando consulto la asignatura, entonces se muestra el estado pendiente en lugar de un valor.",
    claves: ["como", "quiero", "para", "criterio"],
    exp: "Una buena respuesta sigue la plantilla <b>Como [rol], quiero [funcionalidad] para [beneficio]</b> y añade criterios de aceptación <b>verificables</b> (por ejemplo, en formato Dado / Cuando / Entonces) que cubran el caso normal y una situación límite."
  },
  {
    id: "ISW-083", parcial: "Parcial 1", tema: "UML y casos de uso", dificultad: "media", tipo: "dragdrop",
    q: "Completa la descripción de los elementos de un diagrama de casos de uso UML.",
    codigo: "La línea que une a un actor con un caso de uso se denomina {1}, y el cuadro que encierra los casos de uso representa el {2}.",
    respuestas: ["asociación", "límite del sistema"],
    piezas: ["asociación", "límite del sistema", "herencia de clases", "nodo de despliegue"],
    exp: "El actor se conecta con el caso de uso mediante una <b>asociación</b>, y el cuadro que agrupa los casos de uso es el <b>límite del sistema</b>: lo que queda dentro es responsabilidad del sistema y lo de fuera son actores externos."
  },
  {
    id: "ISW-084", parcial: "Parcial 1", tema: "UML y casos de uso", dificultad: "media", tipo: "multiple",
    q: "¿Qué muestra principalmente un diagrama de secuencia UML?",
    options: ["La estructura estática de las clases, sus atributos y sus relaciones", "La interacción entre objetos mediante mensajes ordenados en el tiempo", "El hardware sobre el que se despliega el sistema y sus nodos de red", "La agrupación de componentes en paquetes y sus dependencias"],
    correct: 1,
    exp: "El diagrama de <b>secuencia</b> es un diagrama de comportamiento: muestra qué <b>mensajes</b> intercambian los objetos y en qué <b>orden temporal</b>. La estructura de clases se modela con el diagrama de clases, y el hardware con el de despliegue."
  },
  {
    id: "ISW-085", parcial: "Parcial 1", tema: "UML y casos de uso", dificultad: "media", tipo: "relacionar",
    q: "Relaciona cada diagrama UML con su propósito.",
    pares: [
      ["Casos de uso", "Muestra qué funcionalidades ofrece el sistema a sus actores"],
      ["Clases", "Muestra la estructura estática: clases, atributos, métodos y relaciones"],
      ["Secuencia", "Muestra el intercambio de mensajes entre objetos a lo largo del tiempo"],
      ["Máquina de estados", "Muestra los estados de un objeto y las transiciones entre ellos"],
      ["Actividades", "Muestra el flujo de trabajo con acciones y decisiones"]
    ],
    exp: "Los diagramas de <b>clases</b> y de <b>casos de uso</b> describen estructura y funcionalidad, mientras que <b>secuencia</b>, <b>máquina de estados</b> y <b>actividades</b> son de comportamiento: modelan cómo cambia y actúa el sistema en el tiempo."
  },
  {
    id: "ISW-086", parcial: "Parcial 1", tema: "UML y casos de uso", dificultad: "dificil", tipo: "multiple",
    q: "En un diagrama de casos de uso UML, la relación «include» indica que:",
    options: ["un caso de uso incorpora siempre el comportamiento de otro caso de uso", "un caso de uso se amplía solo en ciertas condiciones con comportamiento opcional", "un actor hereda las responsabilidades de otro actor", "un caso de uso se ejecuta en otro nodo de hardware"],
    correct: 0,
    exp: "«<b>include</b>» es una inclusión <b>obligatoria</b>: el caso base siempre incorpora el comportamiento del caso incluido. El comportamiento opcional o condicional se modela con «extend», y la herencia entre actores es una generalización."
  },
  {
    id: "ISW-087", parcial: "Parcial 1", tema: "Diseño de software", dificultad: "facil", tipo: "multiple",
    q: "¿Qué principio de diseño propone dividir el software en partes independientes y con propósito definido para manejar mejor su complejidad?",
    options: ["Modularidad", "Redundancia", "Acoplamiento alto", "Dependencia circular"],
    correct: 0,
    exp: "La <b>modularidad</b> divide el software en módulos con un propósito claro, lo que facilita entenderlo, probarlo y cambiarlo. El acoplamiento alto y la dependencia circular son justamente lo que un buen diseño modular busca evitar."
  },
  {
    id: "ISW-088", parcial: "Parcial 1", tema: "Diseño de software", dificultad: "media", tipo: "multiple",
    q: "En el diseño de módulos, ¿cuál es la combinación deseable?",
    options: ["Alto acoplamiento y baja cohesión", "Bajo acoplamiento y alta cohesión", "Alto acoplamiento y alta cohesión", "Bajo acoplamiento y baja cohesión"],
    correct: 1,
    exp: "Un buen diseño busca <b>alta cohesión</b> (cada módulo hace una sola cosa bien definida) y <b>bajo acoplamiento</b> (los módulos dependen poco unos de otros). Así los cambios en un módulo afectan poco a los demás."
  },
  {
    id: "ISW-089", parcial: "Parcial 1", tema: "Diseño de software", dificultad: "dificil", tipo: "multiple",
    q: "El principio de ocultamiento de información (encapsulamiento) sugiere que:",
    options: ["todos los módulos deben conocer los detalles internos de los demás para poder cooperar", "los datos deben ser globales para que cualquier parte del sistema pueda acceder a ellos", "cada módulo debe ocultar sus decisiones internas y exponer solo la interfaz necesaria", "la interfaz de un módulo debe publicar todos sus atributos para facilitar su uso"],
    correct: 2,
    exp: "Con el <b>ocultamiento de información</b>, cada módulo esconde sus decisiones internas y expone solo una <b>interfaz mínima</b>. Así se puede cambiar su implementación sin afectar a quienes lo usan, y se reduce el acoplamiento."
  },
  {
    id: "ISW-090", parcial: "Parcial 1", tema: "Diseño de software", dificultad: "media", tipo: "relacionar",
    q: "Relaciona cada elemento del modelo de diseño de software con lo que describe.",
    pares: [
      ["Diseño de datos / clases", "Transforma el modelo de análisis en clases y estructuras de datos"],
      ["Diseño arquitectónico", "Define la estructura general, los componentes principales y sus relaciones"],
      ["Diseño de interfaces", "Describe cómo se comunican el software, los sistemas externos y las personas"],
      ["Diseño de componentes", "Detalla la estructura interna de cada componente de software"]
    ],
    exp: "Los cuatro elementos del modelo de diseño van de lo general a lo particular: la <b>arquitectura</b> fija la estructura global, los <b>datos/clases</b> y los <b>componentes</b> detallan las partes, y las <b>interfaces</b> definen cómo se comunican."
  },
  {
    id: "ISW-091", parcial: "Parcial 1", tema: "Interesados del proyecto", dificultad: "facil", tipo: "multiple",
    q: "En la gestión de proyectos, ¿qué es un interesado (stakeholder)?",
    options: ["Solo el cliente que financia el proyecto y firma el contrato con la organización", "Únicamente los miembros del equipo de desarrollo que participan en la construcción", "Cualquier persona, grupo u organización que puede afectar o verse afectada por el proyecto", "El proveedor de la infraestructura tecnológica sobre la que se ejecutará el sistema"],
    correct: 2,
    exp: "Un <b>interesado</b> es cualquier persona, grupo u organización que puede <b>afectar o ser afectada</b> por el proyecto: patrocinadores, clientes, usuarios, el equipo, proveedores, áreas de la empresa, etc. No se limita a quien paga ni al equipo técnico."
  },
  {
    id: "ISW-092", parcial: "Parcial 1", tema: "Interesados del proyecto", dificultad: "media", tipo: "multiple",
    q: "En una matriz de poder e interés, ¿qué estrategia corresponde a un interesado con alto poder y alto interés?",
    options: ["Gestionarlo de cerca", "Solo monitorearlo con mínimo esfuerzo", "Mantenerlo informado con reportes periódicos", "Ignorarlo hasta el cierre del proyecto"],
    correct: 0,
    exp: "Los interesados con <b>alto poder y alto interés</b> se <b>gestionan de cerca</b>: participan en las decisiones y se les comunica con frecuencia. Mantener informado corresponde a bajo poder y alto interés, y monitorear a bajo poder y bajo interés."
  },
  {
    id: "ISW-093", parcial: "Parcial 1", tema: "Interesados del proyecto", dificultad: "media", tipo: "relacionar",
    q: "Relaciona cada cuadrante de la matriz de poder e interés con la estrategia recomendada.",
    pares: [
      ["Alto poder, alto interés", "Gestionar de cerca"],
      ["Alto poder, bajo interés", "Mantener satisfecho"],
      ["Bajo poder, alto interés", "Mantener informado"],
      ["Bajo poder, bajo interés", "Monitorear con el mínimo esfuerzo"]
    ],
    exp: "La estrategia sube con el <b>poder</b> (quien puede influir en las decisiones) y con el <b>interés</b> (quien está pendiente del proyecto): a mayor poder y mayor interés, más cercana debe ser la gestión."
  },
  {
    id: "ISW-094", parcial: "Parcial 1", tema: "Interesados del proyecto", dificultad: "media", tipo: "multiple",
    q: "En un proyecto de implementación de un ERP, el cutover se refiere a:",
    options: ["el levantamiento inicial de los procesos del negocio que el sistema deberá soportar", "la firma del contrato con el proveedor y la aprobación del presupuesto del proyecto", "la capacitación de la alta dirección sobre los beneficios esperados del sistema", "la transición final del sistema anterior al nuevo, incluida la migración de datos y la salida a producción"],
    correct: 3,
    exp: "El <b>cutover</b> es el momento de la transición: se migran los datos definitivos, se deja de usar el sistema anterior y se entra en producción con el ERP. El levantamiento de procesos corresponde al blueprinting."
  },
  {
    id: "ISW-095", parcial: "Parcial 1", tema: "Interesados del proyecto", dificultad: "media", tipo: "multiple",
    q: "En un proyecto de implementación de un ERP, ¿qué es el blueprinting?",
    options: ["La migración final de los datos al nuevo sistema y el arranque en producción", "La documentación y el diseño de los procesos de negocio que el sistema soportará", "Las pruebas de estrés de la infraestructura antes de abrir el sistema a los usuarios", "El retiro definitivo del sistema anterior una vez terminada la migración"],
    correct: 1,
    exp: "El <b>blueprinting</b> es la etapa en la que se levantan y documentan los procesos de negocio que el ERP soportará, como base para parametrizarlo. La migración final y el retiro del sistema anterior pertenecen al cutover."
  },
  {
    id: "ISW-096", parcial: "Parcial 1", tema: "Interesados del proyecto", dificultad: "dificil", tipo: "multi",
    q: "¿Cuáles de las siguientes son técnicas o herramientas usadas para identificar y analizar interesados?",
    options: ["Matriz de poder e interés", "Registro de interesados", "Entrevistas y talleres con los interesados", "Compilación del código fuente"],
    correctos: [0, 1, 2],
    exp: "Para identificar y analizar interesados se usan herramientas como la <b>matriz de poder e interés</b>, el <b>registro de interesados</b> y técnicas de recopilación como <b>entrevistas y talleres</b>. Compilar código no tiene relación con la gestión de interesados."
  },
  {
    id: "ISW-097",
    parcial: "Parcial 1",
    tema: "Casos de Uso",
    dificultad: "media",
    tipo: "diagrama",
    subtipo: "casos-uso",
    q: "Modela el sistema de una biblioteca: los actores (Socio, Bibliotecario) y sus casos de uso principales. El Socio consulta el catálogo y solicita préstamos; el Bibliotecario registra devoluciones y administra el inventario.",
    nodosPool: ["Socio", "Bibliotecario", "Consultar Catálogo", "Solicitar Préstamo", "Registrar Devolución", "Administrar Inventario"],
    relacionesEsperadas: [
      { de: "Socio", a: "Consultar Catálogo", tipo: "asociación" },
      { de: "Socio", a: "Solicitar Préstamo", tipo: "asociación" },
      { de: "Bibliotecario", a: "Registrar Devolución", tipo: "asociación" },
      { de: "Bibliotecario", a: "Administrar Inventario", tipo: "asociación" }
    ],
    exp: "En un diagrama de <b>casos de uso</b>, cada <b>actor</b> se une mediante una línea de <b>asociación</b> con los casos de uso en los que participa. Aquí el Socio interactúa con la consulta y el préstamo, y el Bibliotecario con las devoluciones y el inventario."
  },
  {
    id: "ISW-098",
    parcial: "Parcial 1",
    tema: "Diagramas de Actividad",
    dificultad: "dificil",
    tipo: "diagrama",
    subtipo: "actividades",
    q: "Modela el flujo de una solicitud de cambio en un proyecto: inicio → recibir solicitud → ¿cambio aprobado? → si sí: implementar cambio → fin implementado; si no: rechazar solicitud → fin rechazado.",
    nodosPool: ["recibir solicitud", "¿cambio aprobado?", "implementar cambio", "rechazar solicitud"],
    nodosFijos: ["inicio", "fin implementado", "fin rechazado"],
    relacionesEsperadas: [
      { de: "inicio", a: "recibir solicitud", tipo: "transición" },
      { de: "recibir solicitud", a: "¿cambio aprobado?", tipo: "transición" },
      { de: "¿cambio aprobado?", a: "implementar cambio", tipo: "transición", guarda: "[sí]" },
      { de: "¿cambio aprobado?", a: "rechazar solicitud", tipo: "transición", guarda: "[no]" },
      { de: "implementar cambio", a: "fin implementado", tipo: "transición" },
      { de: "rechazar solicitud", a: "fin rechazado", tipo: "transición" }
    ],
    exp: "En un <b>diagrama de actividad</b>, el nodo de <b>decisión</b> (rombo) tiene salidas con <b>guardas</b> que determinan el camino. Aquí la solicitud solo se implementa si el cambio es aprobado [sí]; de lo contrario se rechaza [no]. Los nodos de inicio y de fin son puntos fijos del flujo."
  }
];

export default preguntas;