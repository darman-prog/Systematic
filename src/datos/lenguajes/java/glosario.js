// Glosario del track de Java (spec 011). Misma forma que el resto de glosarios.
const glosario = {
  categorias: [
    { id: "poo", nombre: "POO" },
    { id: "colecciones", nombre: "Colecciones" },
    { id: "streams", nombre: "Streams y lambdas" },
    { id: "excepciones", nombre: "Excepciones" },
    { id: "concurrencia", nombre: "Concurrencia" },
    { id: "errores", nombre: "Errores y auditoría" }
  ],
  terminos: [
    {
      termino: "Clase vs Objeto",
      categoria: "poo",
      definicion: "La clase es el molde (definición); el objeto es la instancia creada con `new`.",
      ejemplo: "class Auto {} Auto miAuto = new Auto();"
    },
    {
      termino: "Encapsulamiento",
      categoria: "poo",
      definicion: "Ocultar el estado interno y exponerlo solo mediante métodos públicos (getters/setters).",
      ejemplo: "private int edad; public int getEdad() { return edad; }"
    },
    {
      termino: "Herencia",
      categoria: "poo",
      definicion: "Una clase hija hereda campos y métodos de la padre con `extends`. Java solo permite herencia simple.",
      ejemplo: "class Perro extends Animal { ... }"
    },
    {
      termino: "Polimorfismo",
      categoria: "poo",
      definicion: "Un mismo método se comporta distinto según la clase del objeto en runtime.",
      ejemplo: "Animal a = new Perro(); a.hablar(); // llama al método de Perro"
    },
    {
      termino: "Interface",
      categoria: "poo",
      definicion: "Contrato que define métodos sin implementación. Una clase puede implementar varias interfaces con `implements`.",
      ejemplo: "interface Volador { void volar(); } class Pajaro implements Volador { ... }"
    },
    {
      termino: "Clase abstracta",
      categoria: "poo",
      definicion: "Clase que no se puede instanciar y puede tener métodos abstractos (sin cuerpo). Se usa con `extends`.",
      ejemplo: "abstract class Figura { abstract double area(); }"
    },
    {
      termino: "List",
      categoria: "colecciones",
      definicion: "Colección ordenada que admite duplicados. Implementaciones comunes: ArrayList (acceso rápido) y LinkedList (inserción rápida).",
      ejemplo: "List<String> nombres = new ArrayList<>();"
    },
    {
      termino: "Map",
      categoria: "colecciones",
      definicion: "Colección de pares clave-valor. Las claves son únicas. Implementaciones: HashMap (rápido), TreeMap (ordenado).",
      ejemplo: "Map<String, Integer> edades = new HashMap<>();"
    },
    {
      termino: "Set",
      categoria: "colecciones",
      definicion: "Colección que no admite duplicados. Implementaciones: HashSet (rápido), TreeSet (ordenado).",
      ejemplo: "Set<Integer> unicos = new HashSet<>();"
    },
    {
      termino: "Stream API",
      categoria: "streams",
      definicion: "API para procesar colecciones de forma declarativa: filtrar, transformar, reducir. No modifica la colección original.",
      ejemplo: "lista.stream().filter(x -> x > 5).collect(Collectors.toList());"
    },
    {
      termino: "Lambda",
      categoria: "streams",
      definicion: "Función anónima concisa. Sintaxis: `(parametros) -> { cuerpo }`. Se usa con interfaces funcionales.",
      ejemplo: "lista.forEach(x -> System.out.println(x));"
    },
    {
      termino: "Optional",
      categoria: "streams",
      definicion: "Contenedor que puede o no tener un valor. Evita NullPointerException y fuerza a manejar el caso ausente.",
      ejemplo: "Optional<String> opt = Optional.ofNullable(valor);"
    },
    {
      termino: "Checked Exception",
      categoria: "excepciones",
      definicion: "Excepción que el compilador obliga a manejar (try-catch o throws). Hereda de Exception, no de RuntimeException.",
      ejemplo: "IOException, SQLException"
    },
    {
      termino: "Unchecked Exception",
      categoria: "excepciones",
      definicion: "Excepción que el compilador no obliga a manejar. Hereda de RuntimeException. Indica errores de programación.",
      ejemplo: "NullPointerException, ArrayIndexOutOfBoundsException"
    },
    {
      termino: "Thread",
      categoria: "concurrencia",
      definicion: "Hilo de ejecución independiente. Se crea extendiendo Thread o implementando Runnable.",
      ejemplo: "new Thread(() -> System.out.println(\"Hola\")).start();"
    },
    {
      termino: "ExecutorService",
      categoria: "concurrencia",
      definicion: "Pool de threads reutilizable. Más eficiente que crear threads manualmente. Se usa con Executors.newFixedThreadPool().",
      ejemplo: "ExecutorService pool = Executors.newFixedThreadPool(4);"
    },
    {
      termino: "synchronized",
      categoria: "concurrencia",
      definicion: "Palabra clave que impide que dos threads ejecuten un método o bloque simultáneamente. Evita condiciones de carrera.",
      ejemplo: "public synchronized void incrementar() { count++; }"
    },
    {
      termino: "Bug silencioso",
      categoria: "errores",
      definicion: "Código que compila y parece correcto pero hace algo distinto. Típico en código Java generado por IA.",
      ejemplo: "lista.add(objeto); // debía ser lista.set(i, objeto)"
    },
    {
      termino: "API inexistente",
      categoria: "errores",
      definicion: "Método que la IA inventa porque suena plausible pero no existe en la JDK.",
      ejemplo: "lista.remove(2); // si lista es un array, no existe ese método"
    },
    {
      termino: "Autoboxing peligroso",
      categoria: "errores",
      definicion: "Conversión automática entre primitivos y wrappers. Puede causar NullPointerException si el wrapper es null.",
      ejemplo: "Integer x = null; int y = x; // lanza NullPointerException"
    }
  ],
  tips: [
    "Antes de confiar en un método, comprobá que exista en la documentación de la JDK.",
    "Si el código de la IA usa `null` sin verificar, preguntate si falta un Optional o una validación.",
    "Un `synchronized` mal puesto puede causar deadlocks: revisá que el orden de los locks sea consistente."
  ]
};

export default glosario;