// Glosario de Arquitectura de Software.
// Se completa por lotes revisados a partir de los .md de BancoDeInformacion/ArquitecturaDeSoftware/.
const glosario = {
  categorias: [
    { id: "poo", nombre: "Conceptos de POO", corto: "POO", color: "#60a5fa" },
    { id: "solid", nombre: "Principios SOLID", corto: "SOLID", color: "#34d399" },
    { id: "creacionales", nombre: "Patrones Creacionales", corto: "Creacionales", color: "#f472b6" },
    { id: "estructurales", nombre: "Patrones Estructurales", corto: "Estructurales", color: "#fbbf24" },
    { id: "comportamiento", nombre: "Patrones de Comportamiento", corto: "Comportamiento", color: "#a78bfa" }
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
      ejemplo: "Un método cobrar(Transaccion) funciona igual con transacciones de Tarjeta, Transferencia o Cripto."
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
