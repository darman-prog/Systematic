// Preguntas del track de Java (spec 011). Cada pregunta tiene un ID único,
// un parcial (etapa), un tema, dificultad, tipo (multiple/codigo/dragdrop),
// y una explicación didáctica. `claseError` clasifica el error: silencioso, logica, sintaxis.
const preguntas = [
     {
    id: "JV-001",
    parcial: "Fundamentos",
    tema: "Tipos primitivos vs objetos",
    dificultad: "facil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "int a = 5;\nInteger b = 5;\nSystem.out.println(a == b);",
    options: ["true", "false", "Error de compilación", "Depende de la JVM"],
    correct: 0,
    exp: "`a == b` compara el valor porque Java hace autounboxing de `b` a `int`. Si `b` fuera `null`, lanzaría NullPointerException. Para comparar objetos Integer, usá `.equals()`.",
    claseError: "logica"
  },
  {
    id: "JV-002",
    parcial: "Fundamentos",
    tema: "Tipos primitivos vs objetos",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "Integer x = null;\nint y = x;\nSystem.out.println(y);",
    options: ["0", "null", "NullPointerException", "Error de compilación"],
    correct: 2,
    exp: "El autounboxing de `x` a `int` lanza NullPointerException porque `x` es null. Es el bug silencioso más común cuando la IA usa wrappers sin verificar null.",
    claseError: "silencioso"
  },
  {
    id: "JV-003",
    parcial: "Fundamentos",
    tema: "Sintaxis básica",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Cuál es la diferencia entre `==` y `.equals()` en Java?",
    options: [
      "`==` compara referencias (direcciones de memoria); `.equals()` compara contenido",
      "`==` compara contenido; `.equals()` compara referencias",
      "No hay diferencia, son sinónimos",
      "`==` solo funciona con primitivos; `.equals()` solo con objetos"
    ],
    correct: 0,
    exp: "`==` en objetos compara si apuntan al mismo objeto en memoria. `.equals()` compara el contenido (si la clase lo implementa). Para strings, usá siempre `.equals()`.",
    claseError: "logica"
  },
  {
    id: "JV-004",
    parcial: "Fundamentos",
    tema: "Control de flujo",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "String s = \"hola\";\nif (s == \"hola\") {\n  System.out.println(\"igual\");\n} else {\n  System.out.println(\"distinto\");\n}",
    options: ["distinto", "igual", "Error de compilación", "Depende del compilador"],
    correct: 0,
    exp: "`s == \"hola\"` compara referencias, no contenido. Aunque el valor sea el mismo, son objetos distintos en memoria. Usá `s.equals(\"hola\")` para comparar strings.",
    claseError: "silencioso"
  },

  // ─── Etapa 2 · POO ─────────────────────────────────────
  {
    id: "JV-005",
    parcial: "POO",
    tema: "Clases y objetos",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué palabra clave se usa para crear una instancia de una clase en Java?",
    options: ["new", "create", "instance", "make"],
    correct: 0,
    exp: "`new` reserva memoria para el objeto y llama al constructor. Sin `new`, solo tenés una referencia null.",
    claseError: "sintaxis"
  },
  {
    id: "JV-006",
    parcial: "POO",
    tema: "Encapsulamiento",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "class Persona {\n  private int edad;\n  public void setEdad(int e) { edad = e; }\n  public int getEdad() { return edad; }\n}\nPersona p = new Persona();\np.setEdad(25);\nSystem.out.println(p.edad);",
    options: ["Error de compilación", "25", "0", "null"],
    correct: 0,
    exp: "`edad` es `private`, así que no se puede acceder desde fuera de la clase. El compilador marca error. Usá `p.getEdad()` para leer el valor. La IA a veces olvida el encapsulamiento.",
    claseError: "sintaxis"
  },
  {
    id: "JV-007",
    parcial: "POO",
    tema: "Herencia",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "class Animal {\n  public void hablar() { System.out.println(\"...\"); }\n}\nclass Perro extends Animal {\n  public void hablar() { System.out.println(\"Guau\"); }\n}\nAnimal a = new Perro();\na.hablar();",
    options: ["Guau", "...", "Error de compilación", "Depende del compilador"],
    correct: 0,
    exp: "Aunque la referencia sea de tipo `Animal`, el objeto es `Perro`. Java usa enlace dinámico: llama al método de la clase real del objeto (Perro), no de la referencia (Animal). Esto es polimorfismo.",
    claseError: "logica"
  },
  {
    id: "JV-008",
    parcial: "POO",
    tema: "Herencia",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "class A {\n  public A() { System.out.println(\"A\"); }\n}\nclass B extends A {\n  public B() { System.out.println(\"B\"); }\n}\nnew B();",
    options: ["A\\nB", "B\\nA", "B", "Error de compilación"],
    correct: 0,
    exp: "El constructor de la clase hija llama implícitamente al constructor de la padre (`super()`) antes de ejecutar su propio cuerpo. Por eso imprime \"A\" y luego \"B\".",
    claseError: "logica"
  },
  {
    id: "JV-009",
    parcial: "POO",
    tema: "Interfaces",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuál es la diferencia clave entre una clase abstracta y una interfaz en Java?",
    options: [
      "Una clase puede implementar varias interfaces pero solo extender una clase abstracta",
      "Las interfaces pueden tener campos; las clases abstractas no",
      "Las clases abstractas no pueden tener métodos concretos; las interfaces sí",
      "No hay diferencia, son sinónimos"
    ],
    correct: 0,
    exp: "Java no permite herencia múltiple de clases, pero sí de interfaces. Una clase puede `implements` varias interfaces pero solo `extends` una clase (abstracta o concreta).",
    claseError: "logica"
  },
  {
    id: "JV-010",
    parcial: "POO",
    tema: "Interfaces",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "interface Volador {\n  void volar();\n}\nclass Pajaro implements Volador {\n  public void volar() { System.out.println(\"Vuela\"); }\n}\nVolador v = new Pajaro();\nv.volar();",
    options: ["Vuela", "Error de compilación", "null", "No imprime nada"],
    correct: 0,
    exp: "La interfaz define el contrato; la clase lo implementa. Aunque la referencia sea de tipo `Volador`, el objeto es `Pajaro`, así que se ejecuta su método `volar()`.",
    claseError: "logica"
  },
  {
    id: "JV-011",
    parcial: "POO",
    tema: "Polimorfismo",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "class A {\n  public void metodo() { System.out.println(\"A\"); }\n}\nclass B extends A {\n  public void metodo() { System.out.println(\"B\"); }\n}\nA a = new B();\na.metodo();",
    options: ["B", "A", "Error de compilación", "Depende del compilador"],
    correct: 0,
    exp: "Aunque la referencia sea de tipo `A`, el objeto es `B`. Java usa enlace dinámico para métodos de instancia: llama al método de la clase real del objeto, no de la referencia.",
    claseError: "logica"
  },
  {
    id: "JV-012",
    parcial: "POO",
    tema: "Polimorfismo",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "class A {\n  public static void metodo() { System.out.println(\"A\"); }\n}\nclass B extends A {\n  public static void metodo() { System.out.println(\"B\"); }\n}\nA a = new B();\na.metodo();",
    options: ["A", "B", "Error de compilación", "Depende del compilador"],
    correct: 0,
    exp: "Los métodos `static` no son polimórficos: se resuelven en tiempo de compilación según el tipo de la referencia, no del objeto. Por eso imprime \"A\", no \"B\".",
    claseError: "silencioso"
  },

  // ─── Etapa 3 · Colecciones y Streams ─────────────────────────────────────
  {
    id: "JV-013",
    parcial: "Colecciones y Streams",
    tema: "List",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Cuál es la diferencia principal entre ArrayList y LinkedList?",
    options: [
      "ArrayList tiene acceso O(1) por índice; LinkedList tiene inserción/eliminación O(1) en los extremos",
      "ArrayList admite duplicados; LinkedList no",
      "ArrayList es thread-safe; LinkedList no",
      "No hay diferencia, son sinónimos"
    ],
    correct: 0,
    exp: "ArrayList usa un array interno, así que acceder por índice es rápido pero insertar en el medio es lento. LinkedList usa nodos enlazados, así que insertar/eliminar es rápido pero acceder por índice es lento.",
    claseError: "logica"
  },
  {
    id: "JV-014",
    parcial: "Colecciones y Streams",
    tema: "Map",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "Map<String, Integer> map = new HashMap<>();\nmap.put(\"a\", 1);\nmap.put(\"b\", 2);\nmap.put(\"a\", 3);\nSystem.out.println(map.get(\"a\"));",
    options: ["3", "1", "Error", "null"],
    correct: 0,
    exp: "Las claves en un Map son únicas. Al hacer `put(\"a\", 3)`, se sobreescribe el valor anterior (1) con el nuevo (3). Por eso `get(\"a\")` devuelve 3.",
    claseError: "logica"
  },
  {
    id: "JV-015",
    parcial: "Colecciones y Streams",
    tema: "Set",
    dificultad: "facil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "Set<Integer> set = new HashSet<>();\nset.add(1);\nset.add(2);\nset.add(1);\nSystem.out.println(set.size());",
    options: ["2", "3", "1", "Error"],
    correct: 0,
    exp: "Un Set no admite duplicados. El segundo `add(1)` no hace nada porque 1 ya está en el set. Por eso el tamaño es 2, no 3.",
    claseError: "logica"
  },
  {
    id: "JV-016",
    parcial: "Colecciones y Streams",
    tema: "Stream API",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "List<Integer> nums = List.of(1, 2, 3, 4, 5);\nint suma = nums.stream()\n  .filter(n -> n % 2 == 0)\n  .mapToInt(n -> n)\n  .sum();\nSystem.out.println(suma);",
    options: ["6", "15", "10", "0"],
    correct: 0,
    exp: "`filter` deja los pares [2, 4], `mapToInt` los convierte a primitivos, y `sum` los suma: 2 + 4 = 6. Si esperabas 15, te salteaste el `filter`.",
    claseError: "logica"
  },
  {
    id: "JV-017",
    parcial: "Colecciones y Streams",
    tema: "Stream API",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "List<String> palabras = List.of(\"hola\", \"mundo\");\npalabras.stream()\n  .map(String::toUpperCase)\n  .forEach(System.out::println);\nSystem.out.println(palabras);",
    options: ["[hola, mundo]", "[HOLA, MUNDO]", "Error", "[]"],
    correct: 0,
    exp: "Los streams no modifican la colección original. `map` transforma los elementos en un nuevo stream, pero `palabras` sigue igual. Si querías modificarla, usá un bucle o `.collect()`.",
    claseError: "silencioso"
  },
  {
    id: "JV-018",
    parcial: "Colecciones y Streams",
    tema: "Optional",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "Optional<String> opt = Optional.empty();\nString valor = opt.orElse(\"default\");\nSystem.out.println(valor);",
    options: ["default", "null", "Error", "Optional.empty"],
    correct: 0,
    exp: "`orElse` devuelve el valor si está presente, o el valor por defecto si no. Como `opt` está vacío, devuelve \"default\". Es más seguro que usar `null`.",
    claseError: "logica"
  },
  {
    id: "JV-019",
    parcial: "Colecciones y Streams",
    tema: "Lambdas",
    dificultad: "media",
    tipo: "dragdrop",
    q: "Completá la lambda para filtrar números mayores a 5.",
    codigo: "List<Integer> nums = List.of(3, 7, 2, 9);\nList<Integer> grandes = nums.stream()\n  .filter({1} n {2} n > 5)\n  .collect(Collectors.toList());",
    piezas: ["->", ">", "<", "=="],
    respuestas: ["n ->", ">"],
    exp: "La sintaxis de lambda es `(parametros) -> { cuerpo }`. Para un solo parámetro, los paréntesis son opcionales: `n -> n > 5`.",
    claseError: "sintaxis"
  },
  {
    id: "JV-020",
    parcial: "Colecciones y Streams",
    tema: "Lambdas",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "List<String> nombres = List.of(\"Ana\", \"Luis\", \"Carlos\");\nnombres.stream()\n  .filter(n -> n.length() > 3)\n  .map(String::toUpperCase)\n  .forEach(System.out::println);",
    options: ["LUIS\\nCARLOS", "ANA\\nLUIS\\nCARLOS", "Error", "No imprime nada"],
    correct: 0,
    exp: "`filter` deja los nombres con más de 3 caracteres (Luis, Carlos), `map` los pasa a mayúsculas, y `forEach` los imprime. \"Ana\" tiene 3 caracteres, así que se filtra.",
    claseError: "logica"
  },

  // ─── Etapa 4 · Excepciones y Concurrencia ─────────────────────────────────────
  {
    id: "JV-021",
    parcial: "Excepciones y Concurrencia",
    tema: "Checked vs Unchecked",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuál es la diferencia entre una checked exception y una unchecked exception?",
    options: [
      "Las checked las obliga a manejar el compilador; las unchecked no",
      "Las checked son más graves que las unchecked",
      "Las unchecked no se pueden capturar con try-catch",
      "No hay diferencia, son sinónimos"
    ],
    correct: 0,
    exp: "Las checked exceptions (como IOException) heredan de Exception y el compilador obliga a manejarlas con try-catch o throws. Las unchecked (como NullPointerException) heredan de RuntimeException y no las obliga.",
    claseError: "logica"
  },
  {
    id: "JV-022",
    parcial: "Excepciones y Concurrencia",
    tema: "try-catch-finally",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "try {\n  System.out.println(\"A\");\n  throw new RuntimeException();\n} catch (Exception e) {\n  System.out.println(\"B\");\n} finally {\n  System.out.println(\"C\");\n}",
    options: ["A\\nB\\nC", "A\\nC", "A\\nB", "Error"],
    correct: 0,
    exp: "El bloque `try` imprime \"A\" y lanza una excepción. El `catch` la captura e imprime \"B\". El `finally` siempre se ejecuta, imprima \"C\".",
    claseError: "logica"
  },
  {
    id: "JV-023",
    parcial: "Excepciones y Concurrencia",
    tema: "try-catch-finally",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "try {\n  System.out.println(\"A\");\n  return;\n} finally {\n  System.out.println(\"B\");\n}",
    options: ["A\\nB", "A", "B", "Error"],
    correct: 0,
    exp: "El `finally` siempre se ejecuta, incluso si hay un `return` en el `try`. Imprime \"A\", ejecuta el `finally` (imprime \"B\"), y luego retorna.",
    claseError: "silencioso"
  },
  {
    id: "JV-024",
    parcial: "Excepciones y Concurrencia",
    tema: "Excepciones propias",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cómo se crea una excepción propia en Java?",
    options: [
      "Extendiendo Exception (checked) o RuntimeException (unchecked)",
      "Implementando la interfaz Throwable",
      "Usando la palabra clave `exception`",
      "No se pueden crear excepciones propias"
    ],
    correct: 0,
    exp: "Para crear una excepción propia, extendés Exception (si querés que sea checked) o RuntimeException (si querés que sea unchecked). Ejemplo: `class MiExcepcion extends Exception {}`.",
    claseError: "sintaxis"
  },
  {
    id: "JV-025",
    parcial: "Excepciones y Concurrencia",
    tema: "Thread",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "Thread t = new Thread(() -> System.out.println(\"Hilo\"));\nt.start();\nSystem.out.println(\"Main\");",
    options: ["Main\\nHilo o Hilo\\nMain", "Main\\nHilo", "Hilo\\nMain", "Error"],
    correct: 0,
    exp: "`start()` crea un hilo nuevo que ejecuta el Runnable en paralelo al hilo principal. El orden de impresión depende del planificador de la JVM: puede ser \"Main\" primero o \"Hilo\" primero.",
    claseError: "logica"
  },
  {
    id: "JV-026",
    parcial: "Excepciones y Concurrencia",
    tema: "Thread",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "Thread t = new Thread(() -> System.out.println(\"Hilo\"));\nt.run();\nSystem.out.println(\"Main\");",
    options: ["Hilo\\nMain", "Main\\nHilo", "Hilo", "Error"],
    correct: 0,
    exp: "`run()` no crea un hilo nuevo: ejecuta el método en el hilo actual (el mismo que llama a `run()`). Por eso imprime \"Hilo\" y luego \"Main\", en orden secuencial.",
    claseError: "silencioso"
  },
  {
    id: "JV-027",
    parcial: "Excepciones y Concurrencia",
    tema: "ExecutorService",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Por qué es mejor usar ExecutorService que crear threads manualmente?",
    options: [
      "Reutiliza threads, reduce overhead y permite controlar el tamaño del pool",
      "Es más rápido que crear threads",
      "No hay diferencia, son sinónimos",
      "ExecutorService es obsoleto"
    ],
    correct: 0,
    exp: "Crear threads es costoso. ExecutorService mantiene un pool de threads reutilizables, así que evitás el overhead de crear/destruir threads. Además, podés limitar el número de threads activos.",
    claseError: "logica"
  },
  {
    id: "JV-028",
    parcial: "Excepciones y Concurrencia",
    tema: "synchronized",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola si 2 threads ejecutan `incrementar()` 1000 veces cada uno?",
    codigo: "class Contador {\n  private int count = 0;\n  public void incrementar() { count++; }\n  public int getCount() { return count; }\n}",
    options: ["Menos de 2000", "2000", "Error", "Depende de la JVM"],
    correct: 0,
    exp: "`count++` no es atómico: lee, incrementa y escribe. Si 2 threads lo ejecutan simultáneamente, pueden perder actualizaciones (condición de carrera). Usá `synchronized` o `AtomicInteger`.",
    claseError: "silencioso"
  },
  {
    id: "JV-029",
    parcial: "Excepciones y Concurrencia",
    tema: "synchronized",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola si 2 threads ejecutan `incrementar()` 1000 veces cada uno?",
    codigo: "class Contador {\n  private int count = 0;\n  public synchronized void incrementar() { count++; }\n  public int getCount() { return count; }\n}",
    options: ["2000", "Menos de 2000", "Error", "Depende de la JVM"],
    correct: 0,
    exp: "`synchronized` impide que 2 threads ejecuten el método simultáneamente. Cada thread espera su turno, así que las 2000 incrementos se ejecutan correctamente.",
    claseError: "logica"
  },

  // ─── Etapa 5 · Auditoría de código Java generado por IA ─────────────────────────────────────
  {
    id: "JV-030",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Bugs silenciosos",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "List<String> lista = new ArrayList<>();\nlista.add(\"a\");\nlista.add(\"b\");\nlista.remove(\"b\");\nSystem.out.println(lista.size());",
    options: ["1", "2", "0", "Error"],
    correct: 0,
    exp: "`remove(\"b\")` elimina el elemento \"b\" de la lista. La lista queda con solo \"a\", así que el tamaño es 1. Si esperabas 2, pensaste que `remove` eliminaba por índice (que sería `remove(1)`).",
    claseError: "silencioso"
  },
  {
    id: "JV-031",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Bugs silenciosos",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "String s = \"hola\";\ns.toUpperCase();\nSystem.out.println(s);",
    options: ["hola", "HOLA", "Error", "null"],
    correct: 0,
    exp: "Los strings en Java son inmutables. `toUpperCase()` devuelve un nuevo string en mayúsculas, pero no modifica `s`. Si querías el string en mayúsculas, usá `s = s.toUpperCase()`.",
    claseError: "silencioso"
  },
  {
    id: "JV-032",
    parcial: "Auditoría de código Java generado por IA",
    tema: "APIs inventadas",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuál de estos métodos NO existe en la clase String de Java?",
    options: [
      "String.capitalize()",
      "String.toUpperCase()",
      "String.toLowerCase()",
      "String.trim()"
    ],
    correct: 0,
    exp: "String no tiene método `capitalize()`. La IA lo inventa porque suena plausible. Para capitalizar, usá `Character.toUpperCase(s.charAt(0)) + s.substring(1).toLowerCase()`.",
    claseError: "silencioso"
  },
  {
    id: "JV-033",
    parcial: "Auditoría de código Java generado por IA",
    tema: "APIs inventadas",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuál de estos métodos NO existe en la clase ArrayList de Java?",
    options: [
      "ArrayList.remove(int index)",
      "ArrayList.remove(Object o)",
      "ArrayList.delete(int index)",
      "ArrayList.clear()"
    ],
    correct: 2,
    exp: "ArrayList no tiene método `delete()`. La IA lo inventa porque suena plausible. Para eliminar por índice, usá `remove(int index)`. Para eliminar por objeto, usá `remove(Object o)`.",
    claseError: "silencioso"
  },
  {
    id: "JV-034",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Auditoría en acción",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué bug tiene este código generado por IA?",
    codigo: "List<Integer> nums = List.of(1, 2, 3);\nfor (int i = 0; i <= nums.size(); i++) {\n  System.out.println(nums.get(i));\n}",
    options: [
      "IndexOutOfBoundsException en la última iteración",
      "No imprime nada",
      "Error de compilación",
      "Imprime null"
    ],
    correct: 0,
    exp: "El bucle usa `i <= nums.size()`, así que en la última iteración `i = 3` y `nums.get(3)` lanza IndexOutOfBoundsException (los índices van de 0 a 2). Usá `i < nums.size()`.",
    claseError: "silencioso"
  },
  {
    id: "JV-035",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Auditoría en acción",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué bug tiene este código generado por IA?",
    codigo: "Map<String, Integer> map = new HashMap<>();\nmap.put(\"a\", 1);\nint valor = map.get(\"b\");\nSystem.out.println(valor);",
    options: [
      "NullPointerException al hacer autounboxing",
      "Imprime null",
      "Imprime 0",
      "Error de compilación"
    ],
    correct: 0,
    exp: "`map.get(\"b\")` devuelve null porque la clave \"b\" no existe. Al asignar null a un `int`, Java hace autounboxing y lanza NullPointerException. Usá `Integer valor = map.get(\"b\")` o `map.getOrDefault(\"b\", 0)`.",
    claseError: "silencioso"
  },
  // ─── Etapa 1 · Fundamentos (continuación) ─────────────────────────────────────
  {
    id: "JV-036",
    parcial: "Fundamentos",
    tema: "Tipos primitivos vs objetos",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Cuál de estos NO es un tipo primitivo en Java?",
    options: ["String", "int", "boolean", "double"],
    correct: 0,
    exp: "String es una clase (objeto), no un tipo primitivo. Los tipos primitivos son: byte, short, int, long, float, double, boolean, char.",
    claseError: "logica"
  },
  {
    id: "JV-037",
    parcial: "Fundamentos",
    tema: "Control de flujo",
    dificultad: "media",
    tipo: "dragdrop",
    q: "Completá el switch para que imprima 'Par' cuando el número es par.",
    codigo: "int num = 4;\nswitch (num {1} 2) {\n  {2} 0:\n    System.out.println(\"Par\");\n    break;\n  default:\n    System.out.println(\"Impar\");\n}",
    piezas: ["%", "case", "mod", "if"],
    respuestas: ["%", "case"],
    exp: "El operador `%` calcula el resto de la división. `num % 2` da 0 si es par. `case` define cada rama del switch.",
    claseError: "sintaxis"
  },

  // ─── Etapa 2 · POO (continuación) ─────────────────────────────────────
  {
    id: "JV-038",
    parcial: "POO",
    tema: "Clases y objetos",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "class Punto {\n  int x, y;\n  public Punto(int x, int y) {\n    this.x = x;\n    this.y = y;\n  }\n}\nPunto p1 = new Punto(1, 2);\nPunto p2 = new Punto(1, 2);\nSystem.out.println(p1 == p2);",
    options: ["false", "true", "Error", "Depende de la JVM"],
    correct: 0,
    exp: "`==` compara referencias, no contenido. Aunque p1 y p2 tengan los mismos valores, son objetos distintos en memoria. Para comparar contenido, implementá `.equals()` en la clase.",
    claseError: "silencioso"
  },
  {
    id: "JV-039",
    parcial: "POO",
    tema: "Clases y objetos",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "class Punto {\n  int x, y;\n  public Punto(int x, int y) {\n    this.x = x;\n    this.y = y;\n  }\n}\nPunto p1 = new Punto(1, 2);\nPunto p2 = p1;\nSystem.out.println(p1 == p2);",
    options: ["true", "false", "Error", "Depende de la JVM"],
    correct: 0,
    exp: "`p2 = p1` hace que p2 apunte al mismo objeto que p1. Por eso `p1 == p2` es true: son la misma referencia.",
    claseError: "logica"
  },
  {
    id: "JV-040",
    parcial: "POO",
    tema: "Encapsulamiento",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué bug tiene este código?",
    codigo: "class Cuenta {\n  private double saldo;\n  public void depositar(double monto) {\n    if (monto > 0) {\n      saldo += monto;\n    }\n  }\n  public void retirar(double monto) {\n    saldo -= monto;\n  }\n}",
    options: [
      "retirar() no valida que haya saldo suficiente ni que el monto sea positivo",
      "depositar() no retorna el nuevo saldo",
      "saldo debería ser public",
      "No hay bug"
    ],
    correct: 0,
    exp: "retirar() resta el monto sin verificar que sea positivo ni que haya saldo suficiente. Podrías retirar más de lo que tenés, dejando el saldo negativo. La IA a veces olvida las validaciones.",
    claseError: "silencioso"
  },
  {
    id: "JV-041",
    parcial: "POO",
    tema: "Herencia",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué palabra clave se usa para llamar al constructor de la clase padre desde la hija?",
    options: ["super()", "parent()", "base()", "this()"],
    correct: 0,
    exp: "`super()` llama al constructor de la clase padre. Debe ser la primera línea del constructor de la hija. Si no lo escribís, Java lo llama implícitamente.",
    claseError: "sintaxis"
  },
  {
    id: "JV-042",
    parcial: "POO",
    tema: "Herencia",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "class A {\n  protected int x = 1;\n}\nclass B extends A {\n  private int x = 2;\n  public void imprimir() {\n    System.out.println(x);\n  }\n}\nnew B().imprimir();",
    options: ["2", "1", "Error", "Depende del compilador"],
    correct: 0,
    exp: "B declara su propio campo `x` (private), que oculta (shadowing) el campo `x` de A. Dentro de B, `x` se refiere al campo de B, no al de A. Para acceder al de A, usarías `super.x`.",
    claseError: "silencioso"
  },
  {
    id: "JV-043",
    parcial: "POO",
    tema: "Interfaces",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Puede una interfaz tener métodos con implementación en Java?",
    options: [
      "Sí, desde Java 8 con métodos default y static",
      "No, nunca",
      "Solo si es abstracta",
      "Solo en Java 17+"
    ],
    correct: 0,
    exp: "Desde Java 8, las interfaces pueden tener métodos `default` con implementación. Esto permite agregar métodos nuevos sin romper clases que ya implementan la interfaz.",
    claseError: "logica"
  },
  {
    id: "JV-044",
    parcial: "POO",
    tema: "Interfaces",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "interface A {\n  default void metodo() { System.out.println(\"A\"); }\n}\ninterface B extends A {\n  default void metodo() { System.out.println(\"B\"); }\n}\nclass C implements B {}\nnew C().metodo();",
    options: ["B", "A", "Error", "Ambos"],
    correct: 0,
    exp: "Cuando una clase implementa varias interfaces que tienen el mismo método default, gana el de la interfaz más específica (la que extiende a la otra). B extiende A, así que su método gana.",
    claseError: "logica"
  },
  {
    id: "JV-045",
    parcial: "POO",
    tema: "Clases abstractas",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Se puede instanciar una clase abstracta directamente?",
    options: [
      "No, solo se puede instanciar una subclase concreta",
      "Sí, con new",
      "Solo si tiene constructor",
      "Solo en Java 8+"
    ],
    correct: 0,
    exp: "Las clases abstractas no se pueden instanciar con `new`. Solo sirven como base para subclases que implementen todos los métodos abstractos.",
    claseError: "sintaxis"
  },
  {
    id: "JV-046",
    parcial: "POO",
    tema: "Clases abstractas",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "abstract class Figura {\n  abstract double area();\n  public void imprimir() {\n    System.out.println(\"Área: \" + area());\n  }\n}\nclass Cuadrado extends Figura {\n  double lado;\n  Cuadrado(double l) { lado = l; }\n  double area() { return lado * lado; }\n}\nnew Cuadrado(3).imprimir();",
    options: ["Área: 9.0", "Error de compilación", "Área: 0.0", "null"],
    correct: 0,
    exp: "Cuadrado implementa el método abstracto `area()`. Cuando llamas a `imprimir()` en la instancia de Cuadrado, ejecuta `area()` que devuelve 3*3=9.0.",
    claseError: "logica"
  },
  {
    id: "JV-047",
    parcial: "POO",
    tema: "Polimorfismo",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "class A {\n  public void metodo(B b) { System.out.println(\"A-B\"); }\n}\nclass B extends A {}\nclass C extends B {}\nA a = new A();\nC c = new C();\na.metodo(c);",
    options: ["A-B", "Error de compilación", "No imprime nada", "null"],
    correct: 0,
    exp: "El método `metodo(B b)` acepta cualquier subclase de B. Como C extiende B, podés pasar una instancia de C. Java usa el tipo más específico en tiempo de compilación.",
    claseError: "logica"
  },
  {
    id: "JV-048",
    parcial: "POO",
    tema: "Polimorfismo",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "class A {\n  public void metodo(A a) { System.out.println(\"A-A\"); }\n}\nclass B extends A {\n  public void metodo(B b) { System.out.println(\"B-B\"); }\n}\nA a = new B();\nB b = new B();\na.metodo(b);",
    options: ["A-A", "B-B", "Error", "Depende de la JVM"],
    correct: 0,
    exp: "Aunque el objeto sea de tipo B, la referencia `a` es de tipo A. Java resuelve el método en tiempo de compilación según el tipo de la referencia, no del objeto. Por eso llama a `metodo(A a)` de la clase A.",
    claseError: "silencioso"
  },
  {
    id: "JV-049",
    parcial: "POO",
    tema: "Clases y objetos",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué hace la palabra clave `this` en Java?",
    options: [
      "Se refiere a la instancia actual del objeto",
      "Se refiere a la clase padre",
      "Crea un nuevo objeto",
      "No existe en Java"
    ],
    correct: 0,
    exp: "`this` se refiere a la instancia actual del objeto. Se usa para acceder a campos y métodos de la propia clase, especialmente cuando hay ambigüedad con parámetros.",
    claseError: "logica"
  },
  {
    id: "JV-050",
    parcial: "POO",
    tema: "Encapsulamiento",
    dificultad: "media",
    tipo: "dragdrop",
    q: "Completá el getter y setter para el campo privado `nombre`.",
    codigo: "class Persona {\n  {1} String nombre;\n  public String {2}Nombre() { return nombre; }\n  public void {3}Nombre(String n) { nombre = n; }\n}",
    piezas: ["private", "get", "set", "public"],
    respuestas: ["private", "get", "set"],
    exp: "El campo debe ser `private` para encapsularlo. El getter se llama `getNombre()` y el setter `setNombre(String n)`. Es la convención JavaBean.",
    claseError: "sintaxis"
  },

  // ─── Etapa 3 · Colecciones y Streams (continuación) ─────────────────────────────────────
  {
    id: "JV-051",
    parcial: "Colecciones y Streams",
    tema: "List",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "List<Integer> lista = new ArrayList<>();\nlista.add(1);\nlista.add(2);\nlista.add(3);\nlista.remove(2);\nSystem.out.println(lista);",
    options: ["[1, 2]", "[1, 3]", "[2, 3]", "Error"],
    correct: 0,
    exp: "`remove(2)` elimina el elemento en el índice 2 (que es el número 3). La lista queda [1, 2]. Si querías eliminar el valor 2, usarías `remove(Integer.valueOf(2))`.",
    claseError: "silencioso"
  },
  {
    id: "JV-052",
    parcial: "Colecciones y Streams",
    tema: "Map",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "Map<String, Integer> map = new HashMap<>();\nmap.put(\"a\", 1);\nmap.put(\"b\", 2);\nmap.put(\"c\", 3);\nmap.keySet().forEach(k -> map.put(k, map.get(k) * 2));\nSystem.out.println(map);",
    options: ["ConcurrentModificationException", "{a=2, b=4, c=6}", "{a=1, b=2, c=3}", "Error"],
    correct: 0,
    exp: "No podés modificar un Map mientras lo recorrés con un iterador (keySet()). Lanzará ConcurrentModificationException. Para modificar durante el recorrido, usá `forEach` del Map o un iterador explícito.",
    claseError: "silencioso"
  },
  {
    id: "JV-053",
    parcial: "Colecciones y Streams",
    tema: "Set",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "Set<String> set = new TreeSet<>();\nset.add(\"c\");\nset.add(\"a\");\nset.add(\"b\");\nSystem.out.println(set);",
    options: ["[a, b, c]", "[c, a, b]", "[b, a, c]", "Error"],
    correct: 0,
    exp: "TreeSet mantiene los elementos ordenados según su orden natural (alfabético para strings). Por eso imprime [a, b, c], no en el orden de inserción.",
    claseError: "logica"
  },
  {
    id: "JV-054",
    parcial: "Colecciones y Streams",
    tema: "Stream API",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "List<Integer> nums = List.of(1, 2, 3, 4, 5);\nOptional<Integer> max = nums.stream()\n  .filter(n -> n % 2 == 0)\n  .max(Integer::compareTo);\nSystem.out.println(max);",
    options: ["Optional[4]", "4", "Optional.empty", "Error"],
    correct: 0,
    exp: "`filter` deja los pares [2, 4], `max` devuelve un Optional con el máximo (4). Como hay elementos, el Optional no está vacío. Si no hubiera pares, sería Optional.empty.",
    claseError: "logica"
  },
  {
    id: "JV-055",
    parcial: "Colecciones y Streams",
    tema: "Stream API",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "List<String> palabras = List.of(\"hola\", \"mundo\");\nString resultado = palabras.stream()\n  .reduce(\"\", (a, b) -> a + b);\nSystem.out.println(resultado);",
    options: ["holamundo", "[hola, mundo]", "Error", "null"],
    correct: 0,
    exp: "`reduce` acumula los elementos usando la función lambda. Empieza con \"\" (identidad), luego concatena \"hola\" y \"mundo\", resultando en \"holamundo\".",
    claseError: "logica"
  },
  {
    id: "JV-056",
    parcial: "Colecciones y Streams",
    tema: "Optional",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "Optional<String> opt = Optional.of(\"hola\");\nopt.ifPresent(s -> System.out.println(s.toUpperCase()));\nSystem.out.println(opt.get());",
    options: ["HOLA\\nhola", "hola\\nHOLA", "HOLA\\nHOLA", "Error"],
    correct: 0,
    exp: "`ifPresent` ejecuta el lambda si hay valor, imprimiendo \"HOLA\". Luego `get()` devuelve el valor original \"hola\". Los Optional son inmutables.",
    claseError: "logica"
  },
  {
    id: "JV-057",
    parcial: "Colecciones y Streams",
    tema: "Optional",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuál es la diferencia entre `orElse()` y `orElseGet()` en Optional?",
    options: [
      "`orElse()` siempre evalúa el valor por defecto; `orElseGet()` solo lo evalúa si el Optional está vacío",
      "No hay diferencia",
      "`orElseGet()` es más rápido",
      "`orElse()` lanza excepción si está vacío"
    ],
    correct: 0,
    exp: "`orElse(valor)` siempre evalúa `valor`, aunque el Optional tenga contenido. `orElseGet(() -> valor)` solo ejecuta el supplier si el Optional está vacío. Usá `orElseGet` si el valor por defecto es costoso de calcular.",
    claseError: "logica"
  },
  {
    id: "JV-058",
    parcial: "Colecciones y Streams",
    tema: "Lambdas",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué es una interfaz funcional en Java?",
    options: [
      "Una interfaz con un solo método abstracto",
      "Una interfaz con solo métodos default",
      "Una interfaz marcada con @Functional",
      "Una interfaz que no se puede implementar"
    ],
    correct: 0,
    exp: "Una interfaz funcional tiene exactamente un método abstracto. Puede tener métodos default y static, pero solo un método abstracto. Las lambdas solo funcionan con interfaces funcionales.",
    claseError: "logica"
  },
  {
    id: "JV-059",
    parcial: "Colecciones y Streams",
    tema: "Lambdas",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "List<Integer> nums = List.of(1, 2, 3);\nnums.stream()\n  .peek(n -> System.out.println(\"Procesando: \" + n))\n  .map(n -> n * 2)\n  .forEach(n -> System.out.println(\"Resultado: \" + n));",
    options: [
      "Procesando: 1\\nResultado: 2\\nProcesando: 2\\nResultado: 4\\nProcesando: 3\\nResultado: 6",
      "Procesando: 1\\nProcesando: 2\\nProcesando: 3\\nResultado: 2\\nResultado: 4\\nResultado: 6",
      "Error",
      "No imprime nada"
    ],
    correct: 0,
    exp: "`peek` ejecuta una acción por cada elemento sin modificarlo. Como los streams son lazy, procesa un elemento a la vez: peek, map, forEach, luego el siguiente.",
    claseError: "logica"
  },
  {
    id: "JV-060",
    parcial: "Colecciones y Streams",
    tema: "Stream API",
    dificultad: "media",
    tipo: "dragdrop",
    q: "Completá el stream para convertir una lista de strings a una lista de sus longitudes.",
    codigo: "List<String> palabras = List.of(\"hola\", \"mundo\");\nList<Integer> longitudes = palabras.stream()\n  .{1}(String::length)\n  .{2}(Collectors.toList());",
    piezas: ["map", "collect", "filter", "reduce"],
    respuestas: ["map", "collect"],
    exp: "`map` transforma cada elemento (string a su longitud). `collect` acumula los resultados en una lista usando Collectors.toList().",
    claseError: "sintaxis"
  },

  // ─── Etapa 4 · Excepciones y Concurrencia (continuación) ─────────────────────────────────────
  {
    id: "JV-061",
    parcial: "Excepciones y Concurrencia",
    tema: "Checked vs Unchecked",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "try {\n  throw new IOException(\"Error\");\n} catch (IOException e) {\n  System.out.println(\"A\");\n} catch (Exception e) {\n  System.out.println(\"B\");\n}",
    options: ["A", "B", "A\\nB", "Error de compilación"],
    correct: 0,
    exp: "El primer catch que coincide con el tipo de excepción se ejecuta. IOException es más específico que Exception, así que se ejecuta el primer catch e imprime \"A\".",
    claseError: "logica"
  },
  {
    id: "JV-062",
    parcial: "Excepciones y Concurrencia",
    tema: "try-catch-finally",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "try {\n  System.out.println(\"A\");\n  throw new RuntimeException();\n} catch (Exception e) {\n  System.out.println(\"B\");\n  throw new RuntimeException();\n} finally {\n  System.out.println(\"C\");\n}",
    options: ["A\\nB\\nC", "A\\nB", "A\\nC", "Error"],
    correct: 0,
    exp: "El `try` imprime \"A\" y lanza una excepción. El `catch` la captura, imprime \"B\" y lanza otra excepción. El `finally` siempre se ejecuta, imprime \"C\", y luego la segunda excepción se propaga.",
    claseError: "silencioso"
  },
  {
    id: "JV-063",
    parcial: "Excepciones y Concurrencia",
    tema: "try-with-resources",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué ventaja tiene try-with-resources sobre try-catch tradicional?",
    options: [
      "Cierra automáticamente los recursos que implementan AutoCloseable",
      "Es más rápido",
      "No necesita catch",
      "No hay diferencia"
    ],
    correct: 0,
    exp: "try-with-resources cierra automáticamente los recursos (como archivos, conexiones) al finalizar el bloque, incluso si hay excepciones. Evita fugas de recursos.",
    claseError: "logica"
  },
  {
    id: "JV-064",
    parcial: "Excepciones y Concurrencia",
    tema: "try-with-resources",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "class Recurso implements AutoCloseable {\n  public void close() { System.out.println(\"Cerrando\"); }\n}\ntry (Recurso r = new Recurso()) {\n  System.out.println(\"Usando\");\n}",
    options: ["Usando\\nCerrando", "Cerrando\\nUsando", "Usando", "Error"],
    correct: 0,
    exp: "El bloque try ejecuta \"Usando\", luego el try-with-resources llama automáticamente a `close()`, que imprime \"Cerrando\". Esto pasa incluso si hay excepciones.",
    claseError: "logica"
  },
  {
    id: "JV-065",
    parcial: "Excepciones y Concurrencia",
    tema: "Thread",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "Thread t = new Thread(() -> {\n  try {\n    Thread.sleep(1000);\n    System.out.println(\"Hilo\");\n  } catch (InterruptedException e) {}\n});\nt.start();\nt.join();\nSystem.out.println(\"Main\");",
    options: ["Hilo\\nMain", "Main\\nHilo", "Hilo", "Error"],
    correct: 0,
    exp: "`join()` hace que el hilo actual (main) espere a que el hilo `t` termine. Por eso imprime \"Hilo\" (después de 1 segundo) y luego \"Main\".",
    claseError: "logica"
  },
  {
    id: "JV-066",
    parcial: "Excepciones y Concurrencia",
    tema: "Thread",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué diferencia hay entre `Thread.sleep()` y `Thread.yield()`?",
    options: [
      "sleep() pausa el hilo por un tiempo; yield() sugiere al planificador que pause el hilo",
      "No hay diferencia",
      "yield() es más preciso",
      "sleep() solo funciona en el hilo main"
    ],
    correct: 0,
    exp: "`sleep(milis)` pausa el hilo por el tiempo especificado. `yield()` sugiere al planificador que pause el hilo para dar oportunidad a otros, pero no garantiza nada.",
    claseError: "logica"
  },
  {
    id: "JV-067",
    parcial: "Excepciones y Concurrencia",
    tema: "ExecutorService",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "ExecutorService pool = Executors.newFixedThreadPool(2);\nFuture<String> f1 = pool.submit(() -> \"A\");\nFuture<String> f2 = pool.submit(() -> \"B\");\nSystem.out.println(f1.get() + f2.get());\npool.shutdown();",
    options: ["AB", "BA", "Error", "Depende del orden de ejecución"],
    correct: 0,
    exp: "`submit()` devuelve un Future. `get()` espera a que la tarea termine y devuelve su resultado. Como llamás a `f1.get()` primero, esperás a que f1 termine antes de obtener f2. El resultado es \"AB\".",
    claseError: "logica"
  },
  {
    id: "JV-068",
    parcial: "Excepciones y Concurrencia",
    tema: "ExecutorService",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué bug tiene este código?",
    codigo: "ExecutorService pool = Executors.newFixedThreadPool(4);\nfor (int i = 0; i < 1000; i++) {\n  pool.submit(() -> System.out.println(\"Tarea\"));\n}\nSystem.out.println(\"Fin\");",
    options: [
      "No llama a pool.shutdown(), así que el programa nunca termina",
      "Imprime 'Fin' antes de que las tareas terminen",
      "Ambas son correctas",
      "No hay bug"
    ],
    correct: 2,
    exp: "El código no llama a `shutdown()`, así que el ExecutorService sigue activo y el programa no termina. Además, `submit()` es asíncrono, así que \"Fin\" se imprime antes de que las tareas terminen.",
    claseError: "silencioso"
  },
  {
    id: "JV-069",
    parcial: "Excepciones y Concurrencia",
    tema: "synchronized",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué es un deadlock en concurrencia?",
    options: [
      "Cuando dos o más threads se bloquean mutuamente esperando recursos que el otro tiene",
      "Cuando un thread consume toda la CPU",
      "Cuando un thread lanza una excepción",
      "Cuando un thread termina inesperadamente"
    ],
    correct: 0,
    exp: "Un deadlock ocurre cuando el thread A espera un recurso que tiene B, y B espera un recurso que tiene A. Ambos quedan bloqueados para siempre. Se evita manteniendo un orden consistente al adquirir locks.",
    claseError: "logica"
  },
  {
    id: "JV-070",
    parcial: "Excepciones y Concurrencia",
    tema: "synchronized",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "class Contador {\n  private AtomicInteger count = new AtomicInteger(0);\n  public void incrementar() { count.incrementAndGet(); }\n  public int getCount() { return count.get(); }\n}",
    options: ["Thread-safe sin synchronized", "Requiere synchronized", "Error de compilación", "No es thread-safe"],
    correct: 0,
    exp: "AtomicInteger usa operaciones atómicas de bajo nivel (CAS - Compare-And-Swap) que son thread-safe sin necesidad de synchronized. Es más eficiente que synchronized para operaciones simples.",
    claseError: "logica"
  },
  {
    id: "JV-071",
    parcial: "Excepciones y Concurrencia",
    tema: "Excepciones propias",
    dificultad: "media",
    tipo: "dragdrop",
    q: "Completá la definición de una excepción propia checked.",
    codigo: "class MiExcepcion {1} Exception {\n  public MiExcepcion(String mensaje) {\n    {2}(mensaje);\n  }\n}",
    piezas: ["extends", "super", "implements", "this"],
    respuestas: ["extends", "super"],
    exp: "Para crear una excepción checked, extendés Exception. El constructor llama a `super(mensaje)` para pasar el mensaje al constructor de la clase padre.",
    claseError: "sintaxis"
  },

  // ─── Etapa 5 · Auditoría de código Java generado por IA (continuación) ─────────────────────────────────────
  {
    id: "JV-072",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Bugs silenciosos",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué bug tiene este código generado por IA?",
    codigo: "List<String> lista = new ArrayList<>();\nlista.add(\"a\");\nlista.add(\"b\");\nfor (String s : lista) {\n  if (s.equals(\"b\")) {\n    lista.remove(s);\n  }\n}",
    options: [
      "ConcurrentModificationException al modificar la lista mientras se recorre",
      "No elimina 'b'",
      "Error de compilación",
      "No hay bug"
    ],
    correct: 0,
    exp: "No podés modificar una lista (remove) mientras la recorrés con un for-each. Lanzará ConcurrentModificationException. Usá un Iterator explícito o removeIf().",
    claseError: "silencioso"
  },
  {
    id: "JV-073",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Bugs silenciosos",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "int[] nums = {1, 2, 3};\nnums[0] = 10;\nint[] copia = nums;\ncopia[0] = 20;\nSystem.out.println(nums[0]);",
    options: ["20", "10", "1", "Error"],
    correct: 0,
    exp: "`copia = nums` no crea una copia: hace que `copia` apunte al mismo array que `nums`. Modificar `copia[0]` también modifica `nums[0]`. Para copiar, usá `Arrays.copyOf()` o `nums.clone()`.",
    claseError: "silencioso"
  },
  {
    id: "JV-074",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Bugs silenciosos",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué bug tiene este código generado por IA?",
    codigo: "StringBuilder sb = new StringBuilder();\nfor (int i = 0; i < 1000; i++) {\n  sb.append(\"a\");\n}\nString resultado = sb.toString();\nsb = null;",
    options: [
      "No hay bug, pero sb = null es innecesario (el GC lo limpia)",
      "Debería usar StringBuffer",
      "Debería concatenar con +",
      "Error de compilación"
    ],
    correct: 0,
    exp: "El código es correcto, pero `sb = null` es innecesario. El garbage collector limpiará el StringBuilder cuando salga del alcance. La IA a veces agrega líneas innecesarias.",
    claseError: "logica"
  },
  {
    id: "JV-075",
    parcial: "Auditoría de código Java generado por IA",
    tema: "APIs inventadas",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuál de estos métodos NO existe en la clase Arrays de Java?",
    options: [
      "Arrays.sort(int[] a)",
      "Arrays.binarySearch(int[] a, int key)",
      "Arrays.shuffle(int[] a)",
      "Arrays.copyOf(int[] original, int newLength)"
    ],
    correct: 2,
    exp: "Arrays no tiene método `shuffle()`. La IA lo inventa porque suena plausible. Para mezclar un array, convertilo a List, usá Collections.shuffle(), y convertilo de vuelta.",
    claseError: "silencioso"
  },
  {
    id: "JV-076",
    parcial: "Auditoría de código Java generado por IA",
    tema: "APIs inventadas",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuál de estos métodos NO existe en la clase Collections de Java?",
    options: [
      "Collections.sort(List<T> list)",
      "Collections.reverse(List<T> list)",
      "Collections.shuffle(List<T> list)",
      "Collections.find(List<T> list, T key)"
    ],
    correct: 3,
    exp: "Collections no tiene método `find()`. La IA lo inventa porque suena plausible. Para buscar en una lista, usá `indexOf()` o `contains()`.",
    claseError: "silencioso"
  },
  {
    id: "JV-077",
    parcial: "Auditoría de código Java generado por IA",
    tema: "APIs inventadas",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué bug tiene este código generado por IA?",
    codigo: "LocalDate fecha = LocalDate.now();\nfecha.addDays(5);\nSystem.out.println(fecha);",
    options: [
      "LocalDate no tiene método addDays(); debe usar plusDays()",
      "addDays() no modifica la fecha original",
      "Ambas son correctas",
      "No hay bug"
    ],
    correct: 2,
    exp: "LocalDate no tiene `addDays()`, debe usar `plusDays()`. Además, las clases de java.time son inmutables, así que `plusDays()` devuelve una nueva fecha. Debería ser `fecha = fecha.plusDays(5)`.",
    claseError: "silencioso"
  },
  {
    id: "JV-078",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Auditoría en acción",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué bug tiene este código generado por IA?",
    codigo: "Map<String, List<Integer>> map = new HashMap<>();\nmap.get(\"clave\").add(1);\nmap.get(\"clave\").add(2);",
    options: [
      "NullPointerException si 'clave' no existe en el map",
      "ConcurrentModificationException",
      "Error de compilación",
      "No hay bug"
    ],
    correct: 0,
    exp: "Si \"clave\" no existe en el map, `get(\"clave\")` devuelve null, y llamar a `add()` en null lanza NullPointerException. Usá `map.computeIfAbsent(\"clave\", k -> new ArrayList<>()).add(1)`.",
    claseError: "silencioso"
  },
  {
    id: "JV-079",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Auditoría en acción",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué bug tiene este código generado por IA?",
    codigo: "public static void main(String[] args) {\n  List<String> lista = new ArrayList<>();\n  lista.add(\"a\");\n  procesar(lista);\n  System.out.println(lista.size());\n}\nstatic void procesar(List<String> l) {\n  l = new ArrayList<>();\n  l.add(\"b\");\n}",
    options: ["Imprime 1, no 2", "Imprime 2", "Error", "Depende de la JVM"],
    correct: 0,
    exp: "Dentro de `procesar()`, `l = new ArrayList<>()` crea una nueva lista local, no modifica la lista original. La lista del main sigue con un solo elemento (\"a\"), así que imprime 1.",
    claseError: "silencioso"
  },
  {
    id: "JV-080",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Auditoría en acción",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué bug tiene este código generado por IA?",
    codigo: "class Persona {\n  private String nombre;\n  public Persona(String nombre) {\n    nombre = nombre;\n  }\n  public String getNombre() { return nombre; }\n}",
    options: [
      "El constructor no asigna el parámetro al campo (falta this.nombre)",
      "nombre debería ser public",
      "Falta un setter",
      "No hay bug"
    ],
    correct: 0,
    exp: "`nombre = nombre` asigna el parámetro a sí mismo, no al campo de la clase. Debería ser `this.nombre = nombre`. El campo `nombre` queda null. La IA a veces olvida `this`.",
    claseError: "silencioso"
  },
  {
    id: "JV-081",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Bugs silenciosos",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "Integer a = 100;\nInteger b = 100;\nSystem.out.println(a == b);\nInteger c = 200;\nInteger d = 200;\nSystem.out.println(c == d);",
    options: ["true\\nfalse", "true\\ntrue", "false\\nfalse", "Error"],
    correct: 0,
    exp: "Java cachea Integer entre -128 y 127. Por eso `a == b` es true (son el mismo objeto cacheado), pero `c == d` es false (son objetos distintos). Usá `.equals()` para comparar objetos.",
    claseError: "silencioso"
  },
  {
    id: "JV-082",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Bugs silenciosos",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué bug tiene este código generado por IA?",
    codigo: "List<Integer> lista = new ArrayList<>();\nlista.add(1);\nlista.add(2);\nlista.add(3);\nint ultimo = lista.get(lista.size());\nSystem.out.println(ultimo);",
    options: [
      "IndexOutOfBoundsException: el último índice es size()-1",
      "Imprime null",
      "Imprime 3",
      "Error de compilación"
    ],
    correct: 0,
    exp: "Los índices van de 0 a size()-1. `lista.get(lista.size())` intenta acceder al índice 3, pero la lista solo tiene índices 0, 1, 2. Lanzará IndexOutOfBoundsException.",
    claseError: "silencioso"
  },
  {
    id: "JV-083",
    parcial: "Auditoría de código Java generado por IA",
    tema: "APIs inventadas",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuál de estos métodos NO existe en la clase String de Java?",
    options: [
      "String.replace(char oldChar, char newChar)",
      "String.replaceAll(String regex, String replacement)",
      "String.reverse()",
      "String.substring(int beginIndex)"
    ],
    correct: 2,
    exp: "String no tiene método `reverse()`. La IA lo inventa porque suena plausible. Para invertir un string, usá `new StringBuilder(s).reverse().toString()`.",
    claseError: "silencioso"
  },
  {
    id: "JV-084",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Auditoría en acción",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué bug tiene este código generado por IA?",
    codigo: "try {\n  FileReader fr = new FileReader(\"archivo.txt\");\n  BufferedReader br = new BufferedReader(fr);\n  String linea = br.readLine();\n  System.out.println(linea);\n} catch (IOException e) {\n  e.printStackTrace();\n}",
    options: [
      "No cierra los recursos (FileReader y BufferedReader)",
      "Debería usar try-with-resources",
      "Ambas son correctas",
      "No hay bug"
    ],
    correct: 2,
    exp: "El código no cierra FileReader ni BufferedReader, causando fugas de recursos. Debería usar try-with-resources: `try (FileReader fr = new FileReader(...); BufferedReader br = new BufferedReader(fr))`.",
    claseError: "silencioso"
  },
  {
    id: "JV-085",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Bugs silenciosos",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "double a = 0.1;\ndouble b = 0.2;\ndouble c = 0.3;\nSystem.out.println(a + b == c);",
    options: ["false", "true", "Error", "Depende de la JVM"],
    correct: 0,
    exp: "Los números de punto flotante tienen errores de precisión. `0.1 + 0.2` no es exactamente `0.3` en binario, así que la comparación es false. Para comparar doubles, usá un epsilon: `Math.abs(a + b - c) < 0.0001`.",
    claseError: "silencioso"
  },
  {
    id: "JV-086",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Auditoría en acción",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué bug tiene este código generado por IA?",
    codigo: "public class Main {\n  public static void main(String[] args) {\n    List<String> lista = Arrays.asList(\"a\", \"b\", \"c\");\n    lista.add(\"d\");\n    System.out.println(lista);\n  }\n}",
    options: [
      "UnsupportedOperationException: Arrays.asList() devuelve una lista de tamaño fijo",
      "IndexOutOfBoundsException",
      "Error de compilación",
      "No hay bug"
    ],
    correct: 0,
    exp: "`Arrays.asList()` devuelve una lista de tamaño fijo respaldada por el array original. No podés agregar o eliminar elementos. Para una lista modificable, usá `new ArrayList<>(Arrays.asList(...))`.",
    claseError: "silencioso"
  },
  {
    id: "JV-087",
    parcial: "Auditoría de código Java generado por IA",
    tema: "APIs inventadas",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué bug tiene este código generado por IA?",
    codigo: "LocalDateTime ahora = LocalDateTime.now();\nahora.setHour(10);\nSystem.out.println(ahora);",
    options: [
      "LocalDateTime no tiene setHour(); debe usar withHour()",
      "setHour() no modifica el objeto original",
      "Ambas son correctas",
      "No hay bug"
    ],
    correct: 2,
    exp: "LocalDateTime no tiene `setHour()`, debe usar `withHour()`. Además, las clases de java.time son inmutables, así que `withHour()` devuelve un nuevo objeto. Debería ser `ahora = ahora.withHour(10)`.",
    claseError: "silencioso"
  },
  {
    id: "JV-088",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Bugs silenciosos",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "String s = \"hola\";\nchar[] chars = s.toCharArray();\nchars[0] = 'H';\nSystem.out.println(s);",
    options: ["hola", "Hola", "Error", "null"],
    correct: 0,
    exp: "Los strings son inmutables. `toCharArray()` crea una copia del array de caracteres, así que modificar `chars` no afecta a `s`. Si querías modificar el string, convertilo a StringBuilder.",
    claseError: "silencioso"
  },
  {
    id: "JV-089",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Auditoría en acción",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué bug tiene este código generado por IA?",
    codigo: "public class Main {\n  public static void main(String[] args) {\n    Map<String, Integer> map = new HashMap<>();\n    map.put(\"a\", 1);\n    if (map.containsKey(\"b\")) {\n      int valor = map.get(\"b\");\n      System.out.println(valor);\n    }\n  }\n}",
    options: [
      "No hay bug, pero es redundante (podría usar getOrDefault)",
      "Debería usar TreeMap",
      "Error de compilación",
      "NullPointerException"
    ],
    correct: 0,
    exp: "El código es correcto, pero redundante. Podría simplificarse con `int valor = map.getOrDefault(\"b\", 0)`. La IA a veces genera código más verboso de lo necesario.",
    claseError: "logica"
  },
  {
    id: "JV-090",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Bugs silenciosos",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "int[] a = {1, 2, 3};\nint[] b = {1, 2, 3};\nSystem.out.println(a.equals(b));\nSystem.out.println(Arrays.equals(a, b));",
    options: ["false\\ntrue", "true\\ntrue", "false\\nfalse", "Error"],
    correct: 0,
    exp: "`a.equals(b)` compara referencias (son arrays distintos), así que es false. `Arrays.equals(a, b)` compara el contenido de los arrays, así que es true. Para arrays, usá `Arrays.equals()`.",
    claseError: "silencioso"
  },
  {
    id: "JV-091",
    parcial: "Auditoría de código Java generado por IA",
    tema: "APIs inventadas",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuál de estos métodos NO existe en la clase Math de Java?",
    options: [
      "Math.abs(int a)",
      "Math.max(int a, int b)",
      "Math.round(double a)",
      "Math.random(int min, int max)"
    ],
    correct: 3,
    exp: "Math.random() no acepta parámetros: devuelve un double entre 0.0 y 1.0. La IA inventa `random(min, max)` porque suena plausible. Para un rango específico, usá `(int)(Math.random() * (max - min)) + min`.",
    claseError: "silencioso"
  },
  {
    id: "JV-092",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Auditoría en acción",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué bug tiene este código generado por IA?",
    codigo: "public class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    System.out.print(\"Ingrese un número: \");\n    int n = sc.nextInt();\n    System.out.println(\"Ingresó: \" + n);\n  }\n}",
    options: [
      "No cierra el Scanner (fuga de recursos)",
      "nextInt() puede lanzar InputMismatchException si el usuario no ingresa un número",
      "Ambas son correctas",
      "No hay bug"
    ],
    correct: 2,
    exp: "El código tiene dos problemas: no cierra el Scanner (fuga de recursos) y no maneja InputMismatchException si el usuario ingresa texto en lugar de un número. Debería usar try-with-resources y try-catch.",
    claseError: "silencioso"
  },
  {
    id: "JV-093",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Bugs silenciosos",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "List<Integer> lista = new ArrayList<>();\nfor (int i = 0; i < 5; i++) {\n  lista.add(i);\n}\nfor (int i = 0; i < lista.size(); i++) {\n  if (lista.get(i) % 2 == 0) {\n    lista.remove(i);\n  }\n}\nSystem.out.println(lista);",
    options: ["[1, 3]", "[1, 2, 3, 4]", "[0, 1, 2, 3, 4]", "Error"],
    correct: 0,
    exp: "Cuando eliminás un elemento, los índices siguientes se desplazan. Si eliminás el índice 0 (valor 0), el elemento en índice 1 (valor 1) pasa a índice 0, pero el bucle incrementa i a 1, saltándose ese elemento. El resultado es [1, 3] en lugar de [1, 3, 5].",
    claseError: "silencioso"
  },
  {
    id: "JV-094",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Auditoría en acción",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué bug tiene este código generado por IA?",
    codigo: "public class Main {\n  public static void main(String[] args) {\n    String s = null;\n    if (s != null || s.length() > 0) {\n      System.out.println(\"No vacío\");\n    }\n  }\n}",
    options: [
      "NullPointerException: si s es null, s.length() se evalúa de todos modos",
      "Error de compilación",
      "No hay bug",
      "Imprime 'No vacío'"
    ],
    correct: 0,
    exp: "El operador `||` evalúa ambos lados si el primero es false. Si `s` es null, `s != null` es false, así que evalúa `s.length()`, que lanza NullPointerException. Debería usar `&&` en lugar de `||`.",
    claseError: "silencioso"
  },
  {
    id: "JV-095",
    parcial: "Auditoría de código Java generado por IA",
    tema: "APIs inventadas",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuál de estos constructores NO existe en la clase ArrayList?",
    options: [
      "ArrayList()",
      "ArrayList(int initialCapacity)",
      "ArrayList(Collection<? extends E> c)",
      "ArrayList(int[] array)"
    ],
    correct: 3,
    exp: "ArrayList no tiene constructor que acepte un array de primitivos. La IA lo inventa porque suena plausible. Para crear un ArrayList desde un array, usá `new ArrayList<>(Arrays.asList(array))` o un bucle.",
    claseError: "silencioso"
  },
  {
    id: "JV-096",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Bugs silenciosos",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "Map<String, Integer> map = new HashMap<>();\nmap.put(\"a\", null);\nSystem.out.println(map.containsKey(\"a\"));\nSystem.out.println(map.get(\"a\"));",
    options: ["true\\nnull", "false\\nnull", "true\\n0", "Error"],
    correct: 0,
    exp: "HashMap permite valores null. `containsKey(\"a\")` es true porque la clave existe, aunque su valor sea null. `get(\"a\")` devuelve null. No confundas 'clave no existe' con 'clave existe con valor null'.",
    claseError: "silencioso"
  },
  {
    id: "JV-097",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Auditoría en acción",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué bug tiene este código generado por IA?",
    codigo: "public class Main {\n  public static void main(String[] args) {\n    Thread t = new Thread(() -> {\n      while (true) {\n        System.out.println(\"Ejecutando\");\n      }\n    });\n    t.start();\n  }\n}",
    options: [
      "Bucle infinito que consume 100% de CPU sin condición de salida",
      "Error de compilación",
      "No hay bug",
      "El thread nunca se ejecuta"
    ],
    correct: 0,
    exp: "El bucle `while (true)` no tiene condición de salida ni Thread.sleep(), así que consume 100% de CPU indefinidamente. Debería tener una condición de parada o usar Thread.sleep() para liberar la CPU.",
    claseError: "silencioso"
  },
  {
    id: "JV-098",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Bugs silenciosos",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "String s1 = new String(\"hola\");\nString s2 = new String(\"hola\");\nSystem.out.println(s1 == s2);\nSystem.out.println(s1.equals(s2));",
    options: ["false\\ntrue", "true\\ntrue", "false\\nfalse", "Error"],
    correct: 0,
    exp: "`new String()` crea un objeto nuevo en el heap, así que `s1 == s2` es false (son objetos distintos). Pero `.equals()` compara el contenido, así que es true. Para strings, usá siempre `.equals()`.",
    claseError: "silencioso"
  },
  {
    id: "JV-099",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Auditoría en acción",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué bug tiene este código generado por IA?",
    codigo: "public class Main {\n  public static void main(String[] args) {\n    List<String> lista = new ArrayList<>();\n    lista.add(\"a\");\n    lista.add(\"b\");\n    lista.add(\"c\");\n    Collections.sort(lista, (a, b) -> b.compareTo(a));\n    System.out.println(lista);\n  }\n}",
    options: [
      "No hay bug, ordena en orden descendente [c, b, a]",
      "El comparador está invertido",
      "Error de compilación",
      "ConcurrentModificationException"
    ],
    correct: 0,
    exp: "El código es correcto. `(a, b) -> b.compareTo(a)` invierte el orden natural, así que ordena de Z a A: [c, b, a]. La IA a veces genera código correcto pero confuso.",
    claseError: "logica"
  },
  {
    id: "JV-100",
    parcial: "Auditoría de código Java generado por IA",
    tema: "Auditoría en acción",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué bug tiene este código generado por IA?",
    codigo: "public class Main {\n  public static void main(String[] args) {\n    ExecutorService pool = Executors.newFixedThreadPool(4);\n    for (int i = 0; i < 10; i++) {\n      final int taskId = i;\n      pool.submit(() -> {\n        System.out.println(\"Tarea \" + taskId);\n      });\n    }\n    pool.shutdown();\n  }\n}",
    options: [
      "No espera a que las tareas terminen antes de cerrar el pool",
      "Error de compilación",
      "No hay bug",
      "Las tareas no se ejecutan"
    ],
    correct: 0,
    exp: "`shutdown()` inicia el cierre pero no espera a que las tareas terminen. El programa puede terminar antes de que se impriman todas las tareas. Debería usar `pool.awaitTermination()` o `shutdownNow()`.",
    claseError: "silencioso"
  }
];

export default preguntas;