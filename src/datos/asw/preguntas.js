// Banco de preguntas de Arquitectura de Software.
// Se completa por lotes revisados a partir de los .md de BancoDeInformacion/ArquitecturaDeSoftware/.
const preguntas = [
  {
    id: "ASW-001",
    parcial: "Parcial 1",
    tema: "POO",
    dificultad: "facil",
    tipo: "multiple",
    q: "Según el material, ¿qué es la Programación Orientada a Objetos (POO)?",
    options: [
      "Un lenguaje de programación exclusivo de Java",
      "Un paradigma basado en envolver información y su comportamiento en objetos, construidos a partir de clases",
      "Una técnica para escribir código sin variables"
    ],
    correct: 1,
    exp: "<b>La POO</b> es un paradigma que agrupa datos y comportamiento en <b>objetos</b>, los cuales se crean a partir de «planos» llamados <b>clases</b>. Piensa en la clase como el molde de galletas y en los objetos como las galletas que sales de él."
  },
  {
    id: "ASW-002",
    parcial: "Parcial 1",
    tema: "POO",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Cuál de los siguientes NO es uno de los pilares de la POO vistos en clase?",
    options: ["Abstracción", "Cohesión", "Encapsulación"],
    correct: 1,
    exp: "Los pilares son <b>abstracción, encapsulación, herencia y polimorfismo</b>. La <b>cohesión</b> es un concepto de calidad de diseño (qué tan enfocada está una clase), no uno de los pilares fundamentales."
  },
  {
    id: "ASW-003",
    parcial: "Parcial 1",
    tema: "POO",
    dificultad: "media",
    tipo: "multiple",
    q: "Un avión se modela con comportamientos de vuelo en un simulador, pero solo con asientos y precios en una app de reservas. ¿Qué pilar de la POO describe esta decisión?",
    options: ["Herencia", "Abstracción", "Polimorfismo"],
    correct: 1,
    exp: "La <b>abstracción</b> modela un objeto del mundo real <b>limitado a un contexto específico</b>: representa los datos relevantes a ese contexto y omite el resto. El mismo objeto real cambia según para qué lo necesites."
  },
  {
    id: "ASW-004",
    parcial: "Parcial 1",
    tema: "POO",
    dificultad: "facil",
    tipo: "vf",
    q: "La encapsulación es la capacidad de un objeto de esconder partes de su estado y comportamiento, exponiendo únicamente una interfaz limitada al resto del programa.",
    options: ["Verdadero", "Falso"],
    correct: 0,
    exp: "<b>Verdadero.</b> La encapsulación funciona como una vitrina: el objeto muestra solo lo que otros necesitan usar (su interfaz) y protege sus detalles internos de miradas y modificaciones externas."
  },
  {
    id: "ASW-005",
    parcial: "Parcial 1",
    tema: "POO",
    dificultad: "facil",
    tipo: "multi",
    q: "Selecciona TODOS los elementos que son pilares de la POO:",
    options: ["Abstracción", "Compilación", "Herencia", "Polimorfismo"],
    correctos: [0, 2, 3],
    exp: "Los cuatro pilares son <b>abstracción, encapsulación, herencia y polimorfismo</b>. La <b>compilación</b> es un paso técnico de traducción del código, no tiene relación con los pilares."
  },
  {
    id: "ASW-006",
    parcial: "Parcial 1",
    tema: "Relaciones entre Objetos",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Cuál es la relación más básica y débil entre clases?",
    options: ["Composición", "Dependencia", "Herencia"],
    correct: 1,
    exp: "La <b>dependencia</b> es la relación más débil: existe cuando cambios en una clase pueden forzar modificaciones en otra, por ejemplo al usar clases concretas en firmas de métodos o al instanciar con el constructor. No hay vínculo permanente entre los objetos."
  },
  {
    id: "ASW-007",
    parcial: "Parcial 1",
    tema: "Relaciones entre Objetos",
    dificultad: "media",
    tipo: "multiple",
    q: "¿En qué se diferencia la composición de la agregación?",
    options: [
      "En la composición el componente solo puede existir como parte del contenedor; en la agregación puede existir sin él",
      "En la agregación el contenedor gestiona el ciclo de vida del componente; en la composición no",
      "No hay diferencia, son sinónimos en UML"
    ],
    correct: 0,
    exp: "En la <b>composición</b> rige la regla de «vivir o morir»: el componente no existe fuera del contenedor y este <b>gestiona su ciclo de vida</b>. En la <b>agregación</b> el componente es independiente: puede sobrevivir al contenedor e incluso vincularse a varios a la vez."
  },
  {
    id: "ASW-008",
    parcial: "Parcial 1",
    tema: "Relaciones entre Objetos",
    dificultad: "dificil",
    tipo: "multiple",
    q: "En un diagrama UML, ¿cómo se representa la composición?",
    options: [
      "Con una flecha simple sin adornos",
      "Con un triángulo en la base de la flecha",
      "Igual que la agregación, pero con un diamante relleno en la base de la flecha"
    ],
    correct: 2,
    exp: "La <b>composición</b> se dibuja como la agregación pero con <b>diamante relleno</b> en la base; la agregación usa diamante vacío, la asociación flecha simple y la herencia triángulo. El diamante siempre va del lado del <b>contenedor</b>."
  },
  {
    id: "ASW-009",
    parcial: "Parcial 1",
    tema: "Relaciones entre Objetos",
    dificultad: "media",
    tipo: "vf",
    q: "En UML, es totalmente normal tener asociaciones bidireccionales, representadas con una flecha que tiene punta en cada extremo.",
    options: ["Verdadero", "Falso"],
    correct: 0,
    exp: "<b>Verdadero.</b> En una asociación bidireccional ambos objetos se conocen y interactúan entre sí, por eso la flecha lleva punta en los dos extremos. Recuerda que la asociación implica un acceso permanente, a diferencia de la dependencia simple."
  },
  {
    id: "ASW-010",
    parcial: "Parcial 1",
    tema: "Relaciones entre Objetos",
    dificultad: "dificil",
    tipo: "ordenar",
    q: "Ordena las relaciones entre objetos de MENOR a MAYOR intimidad/acoplamiento (según el resumen del material):",
    bloques: [
      "Dependencia: A puede verse afectada por cambios en B",
      "Asociación: A conoce a B",
      "Agregación: A conoce a B y consiste en B",
      "Composición: A conoce a B, consiste en B y gestiona su ciclo de vida"
    ],
    exp: "La escalera de intimidad es: <b>dependencia → asociación → agregación → composición</b>. Cada peldaño añade más compromiso: primero un uso pasajero, luego conocimiento, luego pertenencia y finalmente el control total del ciclo de vida del otro objeto."
  },
  {
    id: "ASW-011",
    parcial: "Parcial 1",
    tema: "Principios de Diseño",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Cuál es el primer principio de diseño de software visto en clase?",
    options: [
      "Favorece la composición sobre la herencia",
      "Encapsula lo que varía",
      "Programa a una interfaz, no a una implementación"
    ],
    correct: 1,
    exp: "El primer principio es <b>encapsula lo que varía</b>: identifica los aspectos que cambian con frecuencia y sepáralos de los que se mantienen estables. Puede hacerse a nivel de método o a nivel de clase."
  },
  {
    id: "ASW-012",
    parcial: "Parcial 1",
    tema: "Principios de Diseño",
    dificultad: "media",
    tipo: "multiple",
    q: "Si la clase Cat depende de la interfaz Food en lugar de la clase concreta Sausage, ¿cuál es la ventaja principal?",
    options: [
      "El programa compila más rápido",
      "Mañana puedes crear Fish o Meat que implementen Food y el gato podrá usarlas sin modificar la clase Cat",
      "Cat podrá comer cualquier clase de Java automáticamente"
    ],
    correct: 1,
    exp: "Depender de la abstracción <b>Food</b> desacopla a <b>Cat</b> de cualquier alimento concreto: nuevas implementaciones como <b>Fish</b> o <b>Meat</b> se integran sin tocar el código del gato. Eso es exactamente lo que persigue el principio de <b>programar a una interfaz</b>."
  },
  {
    id: "ASW-013",
    parcial: "Parcial 1",
    tema: "Principios de Diseño",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué sugiere el tercer principio de diseño de software?",
    options: [
      "Favorecer la herencia sobre la composición",
      "Usar siempre clases abstractas",
      "Favorecer la composición sobre la herencia"
    ],
    correct: 2,
    exp: "El tercer principio pide <b>favorecer la composición sobre la herencia</b>: componer objetos es más flexible que heredar, porque no te ata a jerarquías rígidas y te permite cambiar comportamiento combinando piezas."
  },
  {
    id: "ASW-014",
    parcial: "Parcial 1",
    tema: "SOLID",
    dificultad: "facil",
    tipo: "multiple",
    q: "En el acrónimo SOLID, ¿a qué principio corresponde la letra O?",
    options: [
      "Object-Oriented Principle",
      "Open/Closed Principle (Abierto/Cerrado)",
      "Optimization Principle"
    ],
    correct: 1,
    exp: "La <b>O</b> es el <b>Open/Closed Principle</b>: las clases deben estar <b>abiertas a la extensión</b> (subclases, nuevos métodos, sobrescribir comportamiento) pero <b>cerradas a la modificación</b> de su código existente."
  },
  {
    id: "ASW-015",
    parcial: "Parcial 1",
    tema: "SOLID",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuál es la idea central del Single Responsibility Principle (SRP)?",
    options: [
      "Una clase debe tener una sola instancia en todo el programa",
      "Una clase solo debe tener una razón para cambiar",
      "Cada programa debe tener una sola clase principal"
    ],
    correct: 1,
    exp: "<b>SRP</b> dice que una clase debe tener <b>una sola razón para cambiar</b>: que sea responsable de una única parte de la funcionalidad, encapsulada dentro de ella. No confundas con el patrón Singleton, que sí habla de una única instancia."
  },
  {
    id: "ASW-016",
    parcial: "Parcial 1",
    tema: "SOLID",
    dificultad: "media",
    tipo: "multiple",
    q: "El Principio de Sustitución de Liskov (LSP) fue definido por Barbara Liskov en 1987. ¿Qué establece?",
    options: [
      "Las interfaces grandes deben dividirse en varias pequeñas",
      "Al extender una clase, debes poder pasar objetos de las subclases en lugar de los de la clase padre sin descomponer el código cliente",
      "Las clases de alto nivel no deben depender de las de bajo nivel"
    ],
    correct: 1,
    exp: "<b>LSP</b> exige que cualquier <b>subclase pueda usarse donde se espera la clase padre</b> sin romper al código cliente. Si una subclase sorprende con comportamientos incompatibles, estás violando el principio. Barbara Liskov lo formuló en 1987 en <b>Data abstraction and hierarchy</b>."
  },
  {
    id: "ASW-017",
    parcial: "Parcial 1",
    tema: "SOLID",
    dificultad: "facil",
    tipo: "multiple",
    q: "Según el Interface Segregation Principle (ISP), ¿qué no se le debe hacer a los clientes?",
    options: [
      "Forzarlos a depender de métodos que no utilizan",
      "Darles acceso a clases concretas",
      "Permitirles crear subclases"
    ],
    correct: 0,
    exp: "<b>ISP</b> pide desintegrar las interfaces «gruesas» en interfaces más <b>detalladas y específicas</b>, para que cada cliente implemente solo lo que necesita. Si una interfaz gigante cambia, se rompen incluso clientes que jamás usaban los métodos modificados."
  },
  {
    id: "ASW-018",
    parcial: "Parcial 1",
    tema: "SOLID",
    dificultad: "dificil",
    tipo: "multiple",
    q: "Según el Dependency Inversion Principle (DIP), ¿de qué deben depender las clases de alto nivel y las de bajo nivel?",
    options: [
      "Las de alto nivel de las de bajo nivel, y las de bajo nivel de las de alto nivel",
      "Ambas deben depender de abstracciones, y los detalles deben depender de las abstracciones",
      "Las de bajo nivel deben depender directamente de la lógica de negocio"
    ],
    correct: 1,
    exp: "En <b>DIP</b>, las clases de <b>alto nivel</b> (lógica de negocio) y las de <b>bajo nivel</b> (disco, red, base de datos) <b>ambas dependen de abstracciones</b>. Así ninguna depende de detalles concretos y puedes reemplazar la implementación de bajo nivel sin tocar la lógica."
  },
  {
    id: "ASW-019",
    parcial: "Parcial 1",
    tema: "SOLID",
    dificultad: "facil",
    tipo: "relacionar",
    q: "Relaciona cada principio SOLID con su idea central:",
    pares: [
      ["Single Responsibility", "Una clase solo debe tener una razón para cambiar"],
      ["Open/Closed", "Abiertas a la extensión, cerradas a la modificación"],
      ["Interface Segregation", "No forzar a los clientes a depender de métodos que no usan"],
      ["Dependency Inversion", "Depender de abstracciones, no de clases concretas"]
    ],
    exp: "Memoriza SOLID por su <b>idea fuerza</b>: <b>S</b> = una razón para cambiar, <b>O</b> = extender sin modificar, <b>L</b> = subclases sustituibles, <b>I</b> = interfaces pequeñas y <b>D</b> = depender de abstracciones."
  },
  {
    id: "ASW-020",
    parcial: "Parcial 1",
    tema: "Patrones de Diseño",
    dificultad: "media",
    tipo: "desarrollo",
    q: "Explica qué son los patrones de diseño y por qué vale la pena aprenderlos.",
    solucion: "Los patrones de diseño son soluciones habituales a problemas que ocurren con frecuencia en el diseño de software. Son como planos prefabricados que se personalizan para resolver un problema recurrente: no son porciones de código copiables como funciones o bibliotecas, sino conceptos generales que se adaptan a cada programa. Conviene aprenderlos porque son soluciones comprobadas y porque definen un lenguaje común que permite comunicar ideas de diseño de forma más eficiente.",
    claves: ["problemas frecuentes", "planos prefabricados", "personalizar", "lenguaje común"],
    exp: "Un patrón es un <b>concepto general</b>, no código listo para pegar: primero reconoces el problema recurrente y luego adaptas el «plano prefabricado» a tu contexto. Además, hablar en patrones (<b>lenguaje común</b>) hace que digas «usa un Proxy aquí» en vez de explicar media arquitectura."
  },
  {
    id: "ASW-021",
    parcial: "Parcial 1",
    tema: "Patrones de Comportamiento",
    dificultad: "dificil",
    tipo: "vf",
    q: "En el patrón Memento, el Cuidador (Caretaker) puede inspeccionar y modificar el contenido de los Mementos que guarda para administrar mejor el historial.",
    options: ["Verdadero", "Falso"],
    correct: 1,
    exp: "<b>Falso.</b> El <b>Cuidador</b> solo guarda la pila de Mementos y decide cuándo pedir guardar o restaurar; <b>nunca inspecciona ni modifica</b> su contenido. Solo el <b>Originador</b> sabe cómo crear un Memento con su estado y restaurarse a partir de uno, y el Memento es inmutable para todos los demás."
  },
  {
    id: "ASW-022",
    parcial: "Parcial 1",
    tema: "Patrones de Diseño",
    dificultad: "media",
    tipo: "multiple",
    q: "¿En qué situaciones es especialmente útil el patrón Prototype?",
    options: [
      "Cuando se necesita validar permisos antes de ejecutar una operación",
      "Cuando crear un objeto desde cero es costoso (cálculos pesados, consultas a BD, llamadas a API) o se quiere evitar una subclase por cada tipo de objeto",
      "Cuando se quiere recorrer una colección sin exponer su estructura interna"
    ],
    correct: 1,
    exp: "<b>Prototype</b> brilla cuando la creación desde cero es <b>costosa en recursos</b> o cuando habría que crear demasiadas subclases: el propio objeto se clona a sí mismo y tu código no se acopla a su clase concreta. En Python lo facilita el módulo <b>copy</b> con <b>copy.deepcopy()</b> para copias profundas."
  },
  {
    id: "ASW-023",
    parcial: "Parcial 1",
    tema: "Patrones Estructurales",
    dificultad: "dificil",
    tipo: "multiple",
    q: "Al combinar formas (Circulo, Cuadrado) con renderizadores (Vector, Raster) por herencia aparecen CirculoVector, CirculoRaster, etc. ¿Qué patrón resuelve esta explosión de clases y cómo?",
    options: [
      "Composite, componiendo las formas en un árbol",
      "Bridge, cambiando la herencia por composición y dividiendo en dos jerarquías independientes",
      "Proxy, interceptando las llamadas a las formas"
    ],
    correct: 1,
    exp: "Es el escenario típico de <b>Bridge</b>: en lugar de heredar todas las combinaciones, separa la <b>Abstracción</b> (Forma, capa de alto nivel con referencia a la implementación) de la <b>Implementación</b> (Renderizador, capa de bajo nivel). Así ambas dimensiones varían de forma independiente y las clases no crecen exponencialmente."
  },
  {
    id: "ASW-024",
    parcial: "Parcial 1",
    tema: "Patrones Estructurales",
    dificultad: "media",
    tipo: "multiple",
    q: "En un sistema de archivos con archivos y carpetas anidadas, ¿qué propone el patrón Composite para calcular el tamaño total sin bucles if/isinstance?",
    options: [
      "Crear un Proxy que calcule el tamaño antes de abrir cada archivo",
      "Guardar el tamaño de cada carpeta en una base de datos",
      "Tratar elementos simples (Leaves) y compuestos (Composite) con una interfaz común, de modo que el contenedor recorra a sus hijos y les pida la misma operación"
    ],
    correct: 2,
    exp: "<b>Composite</b> unifica hojas y contenedores bajo la <b>misma interfaz</b>: si el hijo es un archivo devuelve su tamaño y si es una carpeta el cálculo se hace recursivamente. El contenedor ya no necesita saber qué tiene dentro, solo pedir la operación a todos sus hijos."
  },
  {
    id: "ASW-025",
    parcial: "Parcial 1",
    tema: "Patrones Estructurales",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué es un Proxy en el diseño de software?",
    options: [
      "Un patrón creacional para clonar objetos costosos",
      "Un sustituto o intermediario que controla el acceso a otro objeto y puede realizar tareas adicionales antes o después de delegar la petición",
      "Un método de clase base que define el esqueleto de un algoritmo"
    ],
    correct: 1,
    exp: "Un <b>Proxy</b> es un intermediario que implementa la <b>misma interfaz</b> que el objeto real: el cliente cree hablar con el original, pero el Proxy intercepta las llamadas para hacer validación, caché, logs o carga diferida, y solo cuando es necesario delega al objeto real."
  },
  {
    id: "ASW-026",
    parcial: "Parcial 1",
    tema: "Patrones Estructurales",
    dificultad: "media",
    tipo: "multi",
    q: "Selecciona TODAS las tareas adicionales que un Proxy puede realizar antes o después de delegar la petición al objeto real:",
    options: [
      "Validación y control de acceso",
      "Almacenamiento en caché",
      "Redefinir la jerarquía de clases del objeto real",
      "Registro de logs y carga diferida"
    ],
    correctos: [0, 1, 3],
    exp: "El <b>Proxy</b> intercepta llamadas para ejecutar lógica adicional: <b>validación/control de acceso, caché, registro de logs y carga diferida</b>. Lo que NO puede hacer es cambiar la estructura del objeto real: se limita a intermediar, porque implementa su misma interfaz."
  },
  {
    id: "ASW-027",
    parcial: "Parcial 1",
    tema: "Patrones de Diseño",
    dificultad: "media",
    tipo: "relacionar",
    q: "Relaciona cada patrón de diseño con el problema que resuelve:",
    pares: [
      ["Prototype", "Clonar objetos costosos sin acoplarse a sus clases concretas"],
      ["Bridge", "Evitar la explosión de clases al combinar dos dimensiones de variabilidad"],
      ["Memento", "Guardar y restaurar el estado anterior de un objeto (Deshacer)"],
      ["Iterator", "Recorrer una colección sin exponer su estructura interna"]
    ],
    exp: "Asocia cada patrón con su <b>síntoma</b>: crear objetos caros → <b>Prototype</b>; combinaciones que multiplican clases → <b>Bridge</b>; necesitas Ctrl+Z → <b>Memento</b>; recorrer estructuras distintas de forma uniforme → <b>Iterator</b>."
  },
  {
    id: "ASW-028",
    parcial: "Parcial 1",
    tema: "Patrones de Comportamiento",
    dificultad: "media",
    tipo: "ordenar",
    q: "Ordena los pasos del flujo general del algoritmo en el ejemplo de Template Method (procesamiento de archivos PDF, DOCX y CSV):",
    bloques: [
      "Abrir el archivo",
      "Extraer los datos (varía según el formato)",
      "Analizar los datos",
      "Generar un reporte",
      "Cerrar el archivo"
    ],
    exp: "En <b>Template Method</b> la clase base define el <b>esqueleto</b> del algoritmo en ese orden fijo; el paso de <b>extraer datos</b> es el que varía por formato y se delega como método abstracto a las subclases. Así no se duplica abrir, analizar, reportar y cerrar en cada clase."
  },
  {
    id: "ASW-029",
    parcial: "Parcial 1",
    tema: "Patrones de Comportamiento",
    dificultad: "media",
    tipo: "dragdrop",
    q: "Completa la estructura del patrón Memento arrastrando las piezas correctas:",
    codigo: "El {1} crea un {2} con su estado actual, y el {3} guarda la pila del historial sin inspeccionar su contenido.",
    respuestas: ["Originador", "Memento", "Cuidador"],
    piezas: ["Originador", "Memento", "Cuidador", "Iterador", "Proxy"],
    exp: "Los tres actores de <b>Memento</b>: el <b>Originador</b> (ej. un Editor) es el único que crea y restaura su estado; el <b>Memento</b> es una copia inmutable de ese estado; el <b>Cuidador</b> administra el historial como una caja fuerte que no puede abrir. <b>Iterador</b> y <b>Proxy</b> son distractores de otros patrones."
  },
  {
    id: "ASW-030",
    parcial: "Parcial 1",
    tema: "Patrones Estructurales",
    dificultad: "dificil",
    tipo: "desarrollo",
    q: "Explica qué problema resuelve el patrón Bridge y cómo lo soluciona. Incluye el ejemplo de las formas geométricas y los renderizadores.",
    solucion: "Bridge resuelve la explosión de clases que ocurre al usar herencia para combinar múltiples dimensiones de variabilidad: con formas (Circulo, Cuadrado) y renderizadores (Vector, Raster) aparecerían CirculoVector, CirculoRaster, CuadradoVector, CuadradoRaster, y el número de clases crecería exponencialmente con cada forma o motor nuevo. La solución es cambiar la herencia por composición, dividiendo las clases en dos jerarquías independientes: la Abstracción (capa de alto nivel que interactúa con el cliente, como Forma, y contiene una referencia hacia la implementación) y la Implementación (capa de bajo nivel que realiza el trabajo, como Renderizador). Así ambas dimensiones pueden variar de forma independiente sin afectarse mutuamente.",
    claves: ["explosión de clases", "composición", "abstracción", "implementación", "independiente"],
    exp: "El síntoma clave es la <b>explosión de clases</b> por combinar dos dimensiones con herencia. La cura es <b>composición</b>: dos jerarquías independientes (<b>Abstracción</b> arriba, <b>Implementación</b> abajo) conectadas por una referencia, de modo que agregar un Triangulo o un motor 3D ya no multiplica clases."
  },
  {
    id: "ASW-031",
    parcial: "Parcial 1",
    tema: "Relaciones entre Objetos",
    dificultad: "media",
    tipo: "diagrama",
    subtipo: "uml-clases",
    q: "Modela el sistema de transacciones: una clase base Transacción con método procesar(), y tres subclases específicas (Tarjeta, Transferencia, Cripto) que heredan de ella. Cada subclase sobrescribe procesar() con su lógica específica.",
    nodosPool: ["Transacción", "Tarjeta", "Transferencia", "Cripto"],
    miembrosPool: [
      { texto: "procesar()", de: "Transacción" },
      { texto: "validarNumero()", de: "Tarjeta" },
      { texto: "codigoBanco", de: "Transferencia" },
      { texto: "clavePrivada", de: "Cripto" }
    ],
    relacionesEsperadas: [
      { de: "Tarjeta", a: "Transacción", tipo: "herencia" },
      { de: "Transferencia", a: "Transacción", tipo: "herencia" },
      { de: "Cripto", a: "Transacción", tipo: "herencia" }
    ],
    exp: "La <b>herencia</b> permite reutilizar código: las tres subclases heredan de <b>Transacción</b> y sobrescriben <b>procesar()</b> con su lógica específica. Cada subclase tiene sus propios miembros (Tarjeta valida el número, Transferencia guarda el código de banco, Cripto tiene su propio procesamiento). Esto es el pilar de <b>herencia</b> de la POO aplicado al patrón Template Method."
  },
  {
    id: "ASW-032",
    parcial: "Parcial 1",
    tema: "Relaciones entre Objetos",
    dificultad: "media",
    tipo: "diagrama",
    subtipo: "uml-clases",
    q: "Modela un sistema de archivos: una clase Carpeta que contiene múltiples Archivos. La Carpeta gestiona el ciclo de vida de los Archivos (si eliminas la carpeta, se eliminan los archivos). Usa composición.",
    nodosPool: ["Carpeta", "Archivo"],
    miembrosPool: [
      { texto: "tamaño", de: "Archivo" },
      { texto: "extensión", de: "Archivo" },
      { texto: "nombre", de: "Carpeta" },
      { texto: "agregarArchivo()", de: "Carpeta" }
    ],
    relacionesEsperadas: [
      { de: "Carpeta", a: "Archivo", tipo: "composición" }
    ],
    exp: "La <b>composición</b> es una relación fuerte donde el contenedor (Carpeta) gestiona el ciclo de vida de los componentes (Archivos). Si eliminas la carpeta, los archivos también se eliminan. En UML se representa con un <b>diamante relleno</b> en el lado del contenedor. Es diferente a la agregación (diamante vacío), donde los componentes pueden existir independientemente."
  },
  {
    id: "ASW-033",
    parcial: "Parcial 1",
    tema: "Patrones Estructurales",
    dificultad: "dificil",
    tipo: "diagrama",
    subtipo: "uml-clases",
    q: "Modela el patrón Composite para un sistema de archivos: una interfaz común Componente con método tamaño(), una clase Archivo (hoja) que implementa Componente, y una clase Carpeta (compuesto) que contiene una lista de Componentes y también implementa Componente.",
    nodosPool: ["Componente", "Archivo", "Carpeta"],
    miembrosPool: [
      { texto: "tamaño()", de: "Componente" },
      { texto: "peso: int", de: "Archivo" },
      { texto: "hijos: Componente[]", de: "Carpeta" },
      { texto: "agregar()", de: "Carpeta" }
    ],
    relacionesEsperadas: [
      { de: "Archivo", a: "Componente", tipo: "herencia" },
      { de: "Carpeta", a: "Componente", tipo: "herencia" },
      { de: "Carpeta", a: "Componente", tipo: "agregación" }
    ],
    exp: "El patrón <b>Composite</b> permite tratar objetos individuales (Archivo) y composiciones (Carpeta) de manera uniforme a través de una interfaz común (Componente). La Carpeta <b>hereda</b> de Componente igual que Archivo y además <b>agrega</b> una lista de Componentes (pueden ser Archivos u otras Carpetas). Esto permite calcular el tamaño total recursivamente: si es Archivo devuelve su tamaño, si es Carpeta suma recursivamente el tamaño de sus hijos."
  },
  {
    id: "ASW-034",
    parcial: "Parcial 1",
    tema: "Patrones Estructurales",
    dificultad: "media",
    tipo: "multiple",
    q: "Según el material, ¿qué problema aparece si creas e inicializas de inmediato, al arrancar la aplicación, un objeto que consume muchos recursos (una consulta pesada a base de datos o la descarga de un archivo grande)?",
    options: ["El objeto real pierde su interfaz y el cliente ya no puede llamarlo", "Se desperdician memoria y recursos si el usuario finalmente no usa esa funcionalidad, y no hay un lugar limpio para verificar permisos, aplicar caché o registrar auditorías antes de la operación", "El objeto se clona automáticamente y provoca una explosión de clases", "El compilador duplica el constructor y la aplicación tarda más en iniciar"],
    correct: 1,
    exp: "Crear un objeto costoso al arrancar <b>desperdicia recursos</b> si nunca se usa y deja sin punto de control para <b>permisos, caché o auditoría</b>. El <b>Proxy</b> resuelve ambas cosas: intercepta las llamadas y delega al objeto real solo cuando es necesario."
  },
  {
    id: "ASW-035",
    parcial: "Parcial 1",
    tema: "Patrones de Diseño",
    dificultad: "media",
    tipo: "multi",
    q: "Según la clasificación vista en clase, selecciona TODOS los patrones que son CREACIONALES:",
    options: ["Adapter", "Singleton", "Observer", "Factory", "Builder", "Decorator"],
    correctos: [1, 3, 4],
    exp: "Los <b>creacionales</b> se encargan de crear objetos según la situación: <b>Singleton, Factory, Builder y Prototype</b>. <b>Adapter</b> y <b>Decorator</b> son estructurales; <b>Observer</b> es de comportamiento."
  },
  {
    id: "ASW-036",
    parcial: "Parcial 1",
    tema: "Patrones de Comportamiento",
    dificultad: "facil",
    tipo: "vf",
    q: "En el patrón Template Method, todos los pasos del algoritmo deben ser métodos abstractos que las subclases están obligadas a implementar.",
    options: ["Verdadero", "Falso"],
    correct: 1,
    exp: "<b>Falso.</b> El método plantilla llama a los pasos en orden: algunos tienen <b>implementación predeterminada</b> en la clase base y solo los pasos específicos son <b>métodos abstractos</b> que las subclases deben o pueden sobrescribir."
  },
  {
    id: "ASW-037",
    parcial: "Parcial 1",
    tema: "Patrones de Comportamiento",
    dificultad: "dificil",
    tipo: "ordenar",
    q: "Ordena lo que ocurre cuando una petición llega a un manejador en el patrón Chain of Responsibility:",
    bloques: ["El manejador actual evalúa la petición", "Si puede (o debe) procesarla, la procesa", "Decide si corta el flujo o llama al siguiente manejador de la cadena", "El siguiente manejador repite el mismo proceso"],
    exp: "En <b>Chain of Responsibility</b> cada manejador implementa una interfaz común y <b>guarda una referencia al siguiente</b>: evalúa, procesa si corresponde y decide si corta o continúa. Así se evita el bloque enorme de <b>if/else frágil y acoplado</b> del material."
  },
  {
    id: "ASW-038",
    parcial: "Parcial 1",
    tema: "Principios de Diseño",
    dificultad: "media",
    tipo: "multiple",
    q: "El primer principio de diseño (\"encapsula lo que varía\") puede aplicarse a dos niveles. ¿Cuáles?",
    options: ["A nivel de paquete y a nivel de módulo", "A nivel de base de datos y a nivel de red", "A nivel de método (extraer el comportamiento que cambia a un método separado) y a nivel de clase (aislar lo que varía en unas pocas clases)", "A nivel de compilación y a nivel de ejecución"],
    correct: 2,
    exp: "La separación se hace a nivel de <b>método</b> (el algoritmo general queda estable) o a nivel de <b>clase</b> (se puede cambiar la estrategia sin tocar las clases cliente), aislando las partes volátiles del resto del sistema."
  },
  {
    id: "ASW-039",
    parcial: "Parcial 1",
    tema: "Principios de Diseño",
    dificultad: "media",
    tipo: "multiple",
    q: "Según el material, ¿por qué conviene componer comportamientos mediante delegación en lugar de construir jerarquías de herencia profundas?",
    options: ["Porque la herencia está prohibida en los lenguajes orientados a objetos", "Porque la composición permite cambiar el comportamiento en tiempo de ejecución, combinar responsabilidades con flexibilidad y evita la fragilidad de las jerarquías, donde un cambio en la clase padre puede romper a todas las subclases", "Porque la composición elimina la necesidad de escribir interfaces", "Porque la herencia impide que las subclases sobrescriban métodos"],
    correct: 1,
    exp: "Componer es más flexible: permite <b>cambiar el comportamiento en tiempo de ejecución</b> y evita la <b>fragilidad</b> de las jerarquías rígidas. La herencia sigue siendo útil para expresar <b>\"es-un\"</b>, pero para compartir comportamiento reutilizable (<b>\"tiene-un\"</b>) la composición es la opción más segura."
  },
  {
    id: "ASW-040",
    parcial: "Parcial 1",
    tema: "Principios de Diseño",
    dificultad: "facil",
    tipo: "multiple",
    q: "El material compara una interface con \"las reglas de un juego\". ¿Qué significa esa analogía?",
    options: ["Obliga a que todos los personajes del juego tengan exactamente el mismo comportamiento", "Define qué acciones debe poder hacer un personaje, pero no dice cómo las hace", "Es una lista de errores que el compilador debe reportar antes de ejecutar", "Es el contrato que fija el precio de las suscripciones del juego"],
    correct: 1,
    exp: "La interface dice <b>qué</b> debe poder hacerse, pero no <b>cómo</b>: así el código cliente no depende de la implementación concreta y el cambio futuro es más fácil. Es <b>polimorfismo</b> aplicado a través de interfaces."
  },
  {
    id: "ASW-041",
    parcial: "Parcial 1",
    tema: "Principios de Diseño",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué característica del buen diseño se define como la capacidad de agregar nuevas funcionalidades sin reescribir el sistema?",
    options: ["Reutilización de código", "Encapsulación", "Extensibilidad", "Cohesión"],
    correct: 2,
    exp: "La <b>extensibilidad</b> es agregar funcionalidades sin reescribir el sistema. La <b>reutilización</b>, en cambio, es usar componentes existentes en nuevos contextos para reducir costos de desarrollo."
  },
  {
    id: "ASW-042",
    parcial: "Parcial 1",
    tema: "Principios de Diseño",
    dificultad: "facil",
    tipo: "multiple",
    q: "El material afirma que \"el cambio es lo único constante\" en la vida de un programador. ¿Cuál es, según ese mismo texto, una de las formas más habituales de reducir los costos de desarrollo?",
    options: ["Reescribir los módulos desde cero en cada proyecto para evitar dependencias", "Reutilizar el código existente en nuevos proyectos", "Congelar los requisitos para que nada cambie después del lanzamiento", "Elegir un lenguaje de programación que no necesite actualizaciones"],
    correct: 1,
    exp: "La <b>reutilización de código</b> es una de las formas más habituales de reducir costos: en lugar de desarrollar algo una y otra vez, se reutiliza el código existente en nuevos proyectos. El cambio igual llegará (versiones para otro SO, botones redondos, nuevas funciones)."
  },
  {
    id: "ASW-043",
    parcial: "Parcial 1",
    tema: "POO",
    dificultad: "media",
    tipo: "multiple",
    q: "Según el material, ¿qué permite el polimorfismo?",
    options: ["Que todas las clases del programa hereden de una única clase raíz", "Que un objeto pueda cambiar de clase durante la ejecución del programa", "Que los métodos privados puedan invocarse desde cualquier otra clase", "Que objetos de clases distintas puedan tratarse de forma uniforme a través de una misma interfaz o clase base, y que el objeto concreto decida en tiempo de ejecución cómo responder a cada mensaje"],
    correct: 3,
    exp: "El <b>polimorfismo</b> permite operar sobre una abstracción (por ejemplo, una interfaz <b>Forma</b>) y que el objeto concreto decida <b>en tiempo de ejecución</b> cómo responder a cada mensaje. No cambia de clase ni expone métodos privados."
  },
  {
    id: "ASW-044",
    parcial: "Parcial 1",
    tema: "POO",
    dificultad: "media",
    tipo: "multiple",
    q: "Además de esconder partes de su estado y comportamiento, ¿qué otros efectos tiene la encapsulación según el material?",
    options: ["Convierte automáticamente la clase en abstracta", "Protege los datos internos de accesos no deseados y reduce el acoplamiento entre componentes", "Garantiza que los métodos se ejecuten más rápido", "Elimina la necesidad de usar interfaces en el resto del programa"],
    correct: 1,
    exp: "Al exponer solo una <b>interfaz limitada</b>, la encapsulación <b>protege los datos internos</b> de accesos no deseados y <b>reduce el acoplamiento</b> entre componentes. No tiene relación con velocidad ni con clases abstractas."
  },
  {
    id: "ASW-045",
    parcial: "Parcial 1",
    tema: "Relaciones entre Objetos",
    dificultad: "dificil",
    tipo: "relacionar",
    q: "Relaciona cada relación entre objetos con su descripción según la tabla resumen del material:",
    pares: [
      ["Dependencia", "A no conoce realmente a B: solo hay una referencia sin vínculo permanente"],
      ["Asociación", "A conoce a B con acceso permanente, pero no lo contiene"],
      ["Agregación", "A consiste en B, pero B puede existir sin A y vincularse a varios contenedores"],
      ["Composición", "A consiste en B y gestiona su ciclo de vida (vivir o morir)"]
    ],
    exp: "La escalera de la tabla resumen: <b>dependencia</b> (ni siquiera conoce), <b>asociación</b> (conoce, no contiene), <b>agregación</b> (contiene pero sin control del ciclo de vida) y <b>composición</b> (contiene y controla el ciclo de vida)."
  },
  {
    id: "ASW-046",
    parcial: "Parcial 1",
    tema: "SOLID",
    dificultad: "media",
    tipo: "multiple",
    q: "Una clase ya funciona y está probada. Según el Open/Closed Principle, ¿cómo se le agregan nuevos comportamientos?",
    options: ["Modificando directamente su código interno para cubrir los nuevos casos", "Haciendo públicos todos sus atributos para facilitar los cambios futuros", "Mediante herencia, decoradores o composición, sin modificar su código interno; algunos lenguajes incluso permiten restringir la extensión con palabras clave como final", "Renombrando la clase y publicándola de nuevo como versión 2"],
    correct: 2,
    exp: "Una clase está <b>abierta</b> si puedes extenderla (subclases, nuevos métodos o campos, sobrescribir comportamiento) y <b>cerrada</b> a la modificación de su código ya probado. Palabras clave como <b>final</b> permiten incluso restringir la extensión."
  },
  {
    id: "ASW-047",
    parcial: "Parcial 1",
    tema: "SOLID",
    dificultad: "facil",
    tipo: "vf",
    q: "Aplicar los principios SOLID siempre mejora el diseño y no tiene ningún costo asociado.",
    options: ["Verdadero", "Falso"],
    correct: 1,
    exp: "<b>Falso.</b> Su uso debe ir acompañado de un <b>análisis previo</b>: aplicados de forma descuidada pueden hacer más mal que bien y volver la arquitectura <b>más complicada de lo que debería</b>. Fueron presentados por Robert Martin en 2002."
  },
  {
    id: "ASW-048",
    parcial: "Parcial 1",
    tema: "SOLID",
    dificultad: "dificil",
    tipo: "multi",
    q: "En la práctica, ¿qué cosas NO debe hacer una subclase para respetar el Principio de Sustitución de Liskov? Selecciona TODAS las que apliquen:",
    options: ["Forzar condiciones imposibles", "Añadir nuevos métodos o campos propios", "Cambiar precondiciones o postcondiciones de forma incompatible", "Lanzar excepciones que el cliente no espera"],
    correctos: [0, 2, 3],
    exp: "LSP se rompe con <b>condiciones imposibles, pre/postcondiciones incompatibles o excepciones inesperadas</b>. Añadir métodos o campos nuevos es <b>extensión legítima</b> (lo que fomenta el Open/Closed), no una violación de sustituibilidad."
  }
];

export default preguntas;
