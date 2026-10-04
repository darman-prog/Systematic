// Datos de presentación del track de Java: palabras clave para el resaltado de
// código. La UI las consume desde la entrada del track en el registro (ADR 003);
// reutiliza el mismo campo `sqlKeywords` que BD2 (spec 011).
const javaKeywords = [
  "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char",
  "class", "const", "continue", "default", "do", "double", "else", "enum",
  "extends", "final", "finally", "float", "for", "goto", "if", "implements",
  "import", "instanceof", "int", "interface", "long", "native", "new", "package",
  "private", "protected", "public", "return", "short", "static", "strictfp",
  "super", "switch", "synchronized", "this", "throw", "throws", "transient",
  "try", "void", "volatile", "while", "true", "false", "null", "String", "Integer",
  "Double", "Boolean", "Long", "Float", "Short", "Byte", "Character", "Object",
  "List", "ArrayList", "LinkedList", "Map", "HashMap", "TreeMap", "Set", "HashSet",
  "TreeSet", "Queue", "Deque", "Stack", "Iterator", "Optional", "Stream", "Collectors",
  "Thread", "Runnable", "Callable", "Future", "ExecutorService", "Executors",
  "Exception", "RuntimeException", "Error", "Throwable", "System", "Math", "Arrays",
  "Collections", "Objects", "String", "StringBuilder", "StringBuffer"
];

export { javaKeywords };