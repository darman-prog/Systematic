// Glosario de Arquitectura de Software.
// Se completa por lotes revisados a partir de los .md de BancoDeInformacion/ArquitecturaDeSoftware/.
const glosario = {
  categorias: [
    { id: "poo", nombre: "Conceptos de POO", corto: "POO", color: "#60a5fa" },
    { id: "solid", nombre: "Principios SOLID", corto: "SOLID", color: "#34d399" },
    { id: "creacionales", nombre: "Patrones Creacionales", corto: "Creacionales", color: "#f472b6" },
    { id: "estructurales", nombre: "Patrones Estructurales", corto: "Estructurales", color: "#fbbf24" },
    { id: "comportamiento", nombre: "Patrones de Comportamiento", corto: "Comportamiento", color: "#a78bfa" },
    { id: "fundamentos", nombre: "Fundamentos del desarrollo", corto: "Fundamentos", color: "#f472b6" },
    // Lote 018: categorías de los 3 temas nuevos (hexagonal, evolución, microservicios).
    { id: "hexagonal", nombre: "Arquitectura Hexagonal", corto: "Hexagonal", color: "#4ade80" },
    { id: "evolucion", nombre: "Evolución de arquitecturas", corto: "Evolución", color: "#38bdf8" },
    { id: "microservicios", nombre: "Microservicios", corto: "Micro", color: "#fb923c" }
  ],
  terminos: [
    {
      termino: "Abstracción",
      categoria: "poo",
      definicion: "Modelo de un objeto o fenómeno del mundo real, limitado a un contexto específico, que representa todos los datos relevantes a ese contexto con gran precisión y omite el resto.",
      ejemplo: "Un avión se modela con física de vuelo en un simulador, pero solo con asientos y precios en una app de reservas."
    },
    {
      termino: "Encapsulación",
      categoria: "poo",
      definicion: "Capacidad de un objeto de esconder partes de su estado y comportamiento de otros objetos, exponiendo únicamente una interfaz limitada al resto del programa.",
      ejemplo: "Una clase CuentaBancaria expone depositar() y retirar(), pero esconde su saldo interno detrás de métodos privados."
    },
    {
      termino: "Herencia",
      categoria: "poo",
      definicion: "Capacidad de crear nuevas clases sobre otras existentes; su principal ventaja es la reutilización de código sin duplicarlo.",
      ejemplo: "Si Vehiculo tiene encender(), la subclase Cisterna hereda el método y puede sobrescribirlo o extenderlo con super()."
    },
    {
      termino: "Polimorfismo",
      categoria: "poo",
      definicion: "Capacidad de tratar objetos de clases distintas de forma uniforme a través de una misma interfaz o clase base.",
      ejemplo: "Un método cobrar(Transacción) funciona igual con transacciones de Tarjeta, Transferencia o Cripto."
    },
    {
      termino: "Dependencia",
      categoria: "poo",
      definicion: "La relación más básica y débil entre clases: cambios en la definición de una clase pueden provocar modificaciones en otra. Se debilita dependiendo de interfaces o clases abstractas.",
      ejemplo: "Un método que recibe Sausage concreta crea dependencia; recibir la interfaz Food la debilita."
    },
    {
      termino: "Composición",
      categoria: "poo",
      definicion: "Tipo específico de agregación donde el componente solo puede existir como parte del contenedor («vivir o morir»). En UML se dibuja con diamante relleno en la base de la flecha.",
      ejemplo: "Un Casa está compuesta por sus Cuartas: si la casa se destruye, sus cuartos dejan de existir con ella."
    },
    {
      termino: "Single Responsibility Principle",
      categoria: "solid",
      definicion: "Una clase solo debe tener una razón para cambiar: responsable de una única parte de la funcionalidad, totalmente encapsulada dentro de ella.",
      ejemplo: "Separar la clase Reporte (formatear) de la clase ReporteDao (guardar en base de datos)."
    },
    {
      termino: "Open/Closed Principle",
      categoria: "solid",
      definicion: "Las clases deben estar abiertas a la extensión (subclases, nuevos métodos, sobrescribir comportamiento) pero cerradas a la modificación.",
      ejemplo: "Agregar un nuevo tipo de pago como subclase en vez de editar un switch gigante en el código existente."
    },
    {
      termino: "Liskov Substitution",
      categoria: "solid",
      definicion: "Al extender una clase, debe poder pasarse objetos de las subclases en lugar de objetos de la clase padre sin descomponer el código cliente. Definido por Barbara Liskov en 1987.",
      ejemplo: "Si Pajaro.volar() existe, un Pinguino (subclase) no debe romper al cliente que espera que todo pájaro vuele."
    },
    {
      termino: "Interface Segregation",
      categoria: "solid",
      definicion: "No forzar a los clientes a depender de métodos que no utilizan: desintegrar las interfaces «gruesas» en otras más detalladas y específicas.",
      ejemplo: "Dividir una interfaz Trabajador gigante en Trabaja y Come, para que un Robot no implemente comer()."
    },
    {
      termino: "Dependency Inversion",
      categoria: "solid",
      definicion: "Las clases de alto nivel no deben depender de clases de bajo nivel: ambas deben depender de abstracciones, y los detalles de las abstracciones.",
      ejemplo: "La lógica de pedidos depende de la interfaz Notificador, no de la clase EmailSender concreta."
    },
    {
      termino: "Prototype",
      categoria: "creacionales",
      definicion: "Patrón creacional que permite copiar o clonar objetos existentes sin que el código dependa de sus clases concretas; el propio objeto se clona a sí mismo actuando como prototipo.",
      ejemplo: "Clonar un personaje de juego con todo su equipamiento usando copy.deepcopy() en Python en vez de re-ejecutar su constructor costoso."
    },
    {
      termino: "Bridge",
      categoria: "estructurales",
      definicion: "Patrón estructural que desacopla una abstracción de su implementación para que ambas varíen de forma independiente, evitando la explosión de clases mediante composición.",
      ejemplo: "Forma (Circulo, Cuadrado) referencia a Renderizador (Vector, Raster): dos jerarquías en vez de CirculoVector y CirculoRaster."
    },
    {
      termino: "Composite",
      categoria: "estructurales",
      definicion: "Patrón estructural que compone objetos en estructuras de árbol y permite trabajar con ellas como si fueran objetos individuales, con una interfaz común para hojas y contenedores.",
      ejemplo: "Calcular el tamaño de una carpeta: si el hijo es archivo devuelve su tamaño; si es carpeta, se calcula recursivamente."
    },
    {
      termino: "Proxy",
      categoria: "estructurales",
      definicion: "Patrón estructural que proporciona un sustituto o intermediario de otro objeto, controlando el acceso y ejecutando tareas adicionales (validación, caché, logs, carga diferida) antes o después de delegar.",
      ejemplo: "Un Proxy verifica permisos y revisa caché antes de delegar la consulta pesada al objeto real de base de datos."
    },
    {
      termino: "Memento",
      categoria: "comportamiento",
      definicion: "Patrón de comportamiento que permite guardar y restaurar el estado anterior de un objeto sin revelar su implementación interna, distribuido en Originador, Memento y Cuidador.",
      ejemplo: "La función Deshacer (Ctrl+Z) de un editor: el Editor crea Mementos y el historial (Cuidador) los apila sin leerlos."
    },
    {
      termino: "Template Method",
      categoria: "comportamiento",
      definicion: "Patrón de comportamiento que define el esqueleto de un algoritmo en un método de una clase base, delegando la implementación de pasos específicos a las subclases.",
      ejemplo: "Procesar documentos: abrir, extraer (abstracto por formato), analizar, reportar y cerrar; solo extraer varía entre PDF y CSV."
    },
    {
      termino: "Chain of Responsibility",
      categoria: "comportamiento",
      definicion: "Patrón de comportamiento que pasa las peticiones a lo largo de una cadena de manejadores; cada uno decide si la procesa o la pasa al siguiente.",
      ejemplo: "Un middleware web: autenticación → permisos → validación de formato → stock, cada uno un manejador independiente."
    },
    {
      termino: "Iterator",
      categoria: "comportamiento",
      definicion: "Patrón de comportamiento que permite recorrer los elementos de una colección de forma secuencial sin exponer su estructura interna, encapsulando el recorrido en un objeto Iterador.",
      ejemplo: "Recorrer un árbol con el mismo for que recorre una lista, sin saber que por dentro usa DFS o índices."
    },
    {
      termino: "Monolito",
      categoria: "fundamentos",
      definicion: "Sistema en una sola unidad desplegable, con un proceso y una base de datos. Rápido a escala pequeña; su riesgo es la contienda de releases cuando el equipo crece.",
      ejemplo: "Una tienda en un solo despliegue que atiende catálogo, pagos y envíos desde el mismo proceso."
    },
    {
      termino: "Microservicios",
      categoria: "fundamentos",
      definicion: "Estilo con servicios finos por dominio, cada uno con su base y su despliegue independiente. Gana autonomía y escalado horizontal; paga complejidad distribuida.",
      ejemplo: "Pagos, catálogo e inventario como servicios separados que se comunican por red."
    },
    {
      termino: "Event-driven",
      categoria: "fundamentos",
      definicion: "Estilo donde productores y consumidores se desacoplan mediante un broker de eventos. Absorbe picos de carga; su riesgo es el flujo de control invisible.",
      ejemplo: "Al pagar, se publica PedidoPagado y facturación, envío y puntos lo consumen sin conocerse."
    },
    {
      termino: "Arquitectura hexagonal",
      categoria: "fundamentos",
      definicion: "Estilo (puertos y adaptadores, Cockburn 2005) donde la lógica de negocio al centro define puertos y la infraestructura (BD, HTTP, colas) son adaptadores. Las dependencias apuntan hacia adentro.",
      ejemplo: "Probar el cálculo de descuentos con un repositorio en memoria en vez de la base real."
    },
    {
      termino: "API REST",
      categoria: "fundamentos",
      definicion: "Estilo sobre HTTP con recursos direccionables, verbos con semántica, códigos de estado y comunicación sin estado. Solo con hipermedia (nivel 3 de Richardson) es REST pleno.",
      ejemplo: "GET /pedidos/42 devuelve el pedido; POST /pedidos crea uno y responde 201."
    },
    {
      termino: "Modelo de madurez de Richardson",
      categoria: "fundamentos",
      definicion: "Escalera de Leonard Richardson hacia REST: Nivel 0 un solo endpoint, Nivel 1 recursos, Nivel 2 verbos HTTP, Nivel 3 controles hipermedia.",
      ejemplo: "Pasar de un único /api con action=crear a GET /pedidos, POST /pedidos y enlaces next en la respuesta."
    },
    {
      termino: "MVC",
      categoria: "fundamentos",
      definicion: "Modelo (datos y reglas), Vista (lo visible) y Controlador (coordina la entrada). En APIs el controlador devuelve el cuerpo directo; la regla vive en el modelo o servicio, nunca en el controlador gordo.",
      ejemplo: "Un EmployeeController con @GetMapping que delega al servicio y devuelve JSON, sin lógica de negocio adentro."
    },
    {
      termino: "Strangler fig",
      categoria: "fundamentos",
      definicion: "Migración por estrangulamiento: rodear el sistema legado con servicios nuevos, enrutarles tráfico y retirar lo viejo por partes, en vez de reescribir de golpe.",
      ejemplo: "Sacar primero el login del monolito a un servicio de autenticación y apagar el módulo viejo."
    },
    // Lote 018: términos de Arquitectura Hexagonal (fuente 13).
    {
      termino: "Puerto (port)",
      categoria: "hexagonal",
      definicion: "Contrato o interfaz pura que marca la frontera del hexágono; se define por el propósito del negocio, no por la tecnología que lo implementará.",
      ejemplo: "La interfaz RateRepository con getRate(amt) que el dominio define y la infraestructura implementa."
    },
    {
      termino: "Adaptador primario (driving)",
      categoria: "hexagonal",
      definicion: "Traductor que convierte peticiones externas (HTTP, eventos, consola) en comandos de dominio; despierta a la aplicación desde afuera.",
      ejemplo: "Un Controlador REST que extrae JSON, valida tipos y llama al servicio del dominio."
    },
    {
      termino: "Adaptador secundario (driven)",
      categoria: "hexagonal",
      definicion: "Traductor que convierte peticiones del dominio en llamadas de infraestructura (persistencia, pagos, eventos).",
      ejemplo: "Un adaptador Hibernate que traduce objetos del dominio a SQL y mapea los resultados."
    },
    {
      termino: "Inversión de dependencias (DIP)",
      categoria: "hexagonal",
      definicion: "Módulos de alto y bajo nivel dependen de abstracciones: la ejecución fluye hacia la BD pero la dependencia de código apunta al dominio.",
      ejemplo: "DiscounterApp depende de la interfaz RateRepository, no de SqlRateRepository ni del driver JDBC."
    },
    {
      termino: "Inyección de dependencias (DI)",
      categoria: "hexagonal",
      definicion: "En tiempo de ejecución se inyecta el adaptador concreto (SQL en producción, memoria en tests) mediante constructores, sin cambiar el dominio.",
      ejemplo: "new DiscounterApp(new MockRateRepository()) en un test unitario ultrarrápido."
    },
    {
      termino: "Lenguaje ubicuo",
      categoria: "hexagonal",
      definicion: "Vocabulario del negocio compartido entre negocio y código: el núcleo refleja el problema del negocio, no la infraestructura.",
      ejemplo: "Hablar de descuento y monto en el dominio, no de tablas ORDERS ni de JSON."
    },
    {
      termino: "Repository",
      categoria: "hexagonal",
      definicion: "Patrón que media entre dominio y datos como colección en memoria: su interfaz es puerto secundario en el núcleo y su implementación es adaptador secundario en infraestructura.",
      ejemplo: "UserRepository con save/getById, implementado por SQLRepository y por TestRepository en memoria."
    },
    {
      termino: "Casos de uso sobre el puerto",
      categoria: "hexagonal",
      definicion: "Especificar la intención del negocio (precondiciones, reglas, postcondiciones) agnóstica al origen del dato, en vez de acoplar el caso a la UI.",
      ejemplo: "«El sistema calcula el descuento dado un monto válido» en lugar de «clic en guardar → guarda en ORDERS»."
    },
    // Lote 018: términos de Evolución de arquitecturas (fuente 14).
    {
      termino: "Big Ball of Mud",
      categoria: "evolucion",
      definicion: "Antipatrón de ausencia de estructura: jungla de código espagueti con soluciones rápidas, información promiscua y efectos secundarios impredecibles.",
      ejemplo: "Tocar una clase de reportes y romper el login sin relación aparente."
    },
    {
      termino: "Capa cerrada",
      categoria: "evolucion",
      definicion: "Capa que no puede saltarse: la petición debe atravesar la capa inmediata inferior de forma estricta, conteniendo el impacto del cambio.",
      ejemplo: "En N-Tier la UI no accede directo a persistencia; pasa por negocio."
    },
    {
      termino: "Capa abierta",
      categoria: "evolucion",
      definicion: "Capa que la superior puede consumir o atravesar directo (fast-lane) sin penalización estructural, aportando flexibilidad pragmática.",
      ejemplo: "Una capa de servicios compartidos que negocio puede usar o ignorar limpiamente."
    },
    {
      termino: "Architecture Sinkhole",
      categoria: "evolucion",
      definicion: "Antipatrón donde las peticiones cruzan todas las capas como pass-through sin lógica: la estructura suma costo sin valor.",
      ejemplo: "Cuatro capas que solo reenvían el DTO hasta la BD sin transformar nada."
    },
    {
      termino: "Quantum arquitectónico",
      categoria: "evolucion",
      definicion: "Artefacto desplegable independiente con alta cohesión: vale 1 en el monolito (todo junto) y N en lo distribuido (cada servicio por separado).",
      ejemplo: "No poder escalar Pagos sin escalar Reportes delata Quantum = 1."
    },
    {
      termino: "Corte horizontal vs. vertical",
      categoria: "evolucion",
      definicion: "Particionar por roles técnicos (presentación/lógica/datos) frente a particionar por flujos de dominio (Catálogo, Checkout, Pagos con su propia pila).",
      ejemplo: "Un cambio en Catálogo que toca todas las capas pide un corte vertical."
    },
    {
      termino: "Falacias de la red",
      categoria: "evolucion",
      definicion: "Ocho asunciones letales de lo distribuido: red confiable, latencia cero, ancho infinito, red segura, topología fija, un admin, transporte gratis y red homogénea.",
      ejemplo: "Asumir latencia cero y diseñar chats finos entre servicios por REST."
    },
    {
      termino: "Trade-off arquitectónico",
      categoria: "evolucion",
      definicion: "Toda decisión de arquitectura sacrifica algo: el monolito gana simplicidad y costo inicial; lo distribuido gana agilidad, elasticidad y tolerancia.",
      ejemplo: "Elegir consistencia eventual (sagas) para ganar disponibilidad y elasticidad."
    },
    // Lote 018: términos de Microservicios (fuente 15).
    {
      termino: "Bounded Context",
      categoria: "microservicios",
      definicion: "Frontera explícita del modelo de dominio (DDD) que define la responsabilidad exacta de cada microservicio con lenguaje ubicuo.",
      ejemplo: "Pedidos y Pagos como contextos separados, cada uno dueño de sus datos."
    },
    {
      termino: "Database per microservice",
      categoria: "microservicios",
      definicion: "Cada servicio es dueño único de su almacenamiento; prohibido compartir bases relacionales para evitar acoplamiento de esquema.",
      ejemplo: "Búsqueda en NoSQL + caché, Reservas en relacional estricta, cada una la suya."
    },
    {
      termino: "CQRS",
      categoria: "microservicios",
      definicion: "Segregación de responsabilidades entre comandos y consultas: modelos separados para escritura y para lectura optimizada.",
      ejemplo: "Escribir en el modelo de dominio y leer desde vistas materializadas rápidas."
    },
    {
      termino: "Event Sourcing",
      categoria: "microservicios",
      definicion: "Persistir los cambios como secuencia inmutable de eventos en vez del estado actual; el estado se reconstruye rejugándolos.",
      ejemplo: "La cuenta se reconstruye sumando Depósito/Retiro en vez de guardar solo el saldo."
    },
    {
      termino: "Orquestación",
      categoria: "microservicios",
      definicion: "Coordinación con un orquestador central paso a paso: estado global visible, con riesgo de monolito distribuido.",
      ejemplo: "Un Orchestrator Service que comanda a Servicio 1, 2 y 3 y recoge sus estados."
    },
    {
      termino: "Coreografía",
      categoria: "microservicios",
      definicion: "Coordinación donde cada servicio escucha eventos y reacciona solo: máximo desacople, difícil de rastrear.",
      ejemplo: "Tres servicios que publican y consumen del event bus sin director central."
    },
    {
      termino: "Saga",
      categoria: "microservicios",
      definicion: "Transacciones distribuidas como secuencia de transacciones locales encadenadas por eventos, con compensatorias en reversa ante fallos.",
      ejemplo: "Reserva → Pago → Notificación; si el pago falla, se compensa cancelando la reserva."
    },
    {
      termino: "Microservice Tax",
      categoria: "microservicios",
      definicion: "Costo fijo de lo distribuido: infraestructura, CI/CD, redes, observabilidad obligatoria y pérdida del ACID simple.",
      ejemplo: "Montar trazas, métricas y logs distribuidos antes del primer servicio productivo."
    }
  ],
  tips: [
    "Aprende cada patrón por el problema que resuelve, no de memoria: en el examen llega primero el síntoma (explosión de clases, if/else gigantes, creación costosa) y después el nombre del patrón.",
    "Para las relaciones UML recuerda la escalera de intimidad: dependencia → asociación → agregación → composición; a cada peldaño el objeto A tiene más control sobre B, hasta gestionar su ciclo de vida.",
    "SOLID con criterio: el material advierte que aplicarlos de forma descuidada puede hacer más mal que bien y complicar la arquitectura; primero analiza, después aplica.",
    "Asocia cada patrón de comportamiento con un gesto cotidiano: Memento = Ctrl+Z, Template Method = una receta con pasos fijos, Chain of Responsibility = una fila de trámites, Iterator = pasar las páginas de un libro."
  ]
};

export default glosario;
