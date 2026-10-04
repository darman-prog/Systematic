// Datos de presentación del track de TypeScript: palabras clave para el resaltado de
// código. La UI las consume desde la entrada del track en el registro (ADR 003);
// reutiliza el mismo campo `sqlKeywords` que BD2 (spec 011).
const tsKeywords = [
  "const", "let", "var", "function", "return", "if", "else", "for", "of", "in",
  "while", "switch", "case", "break", "continue", "try", "catch", "finally",
  "throw", "async", "await", "class", "extends", "implements", "interface",
  "type", "enum", "import", "export", "from", "new", "this", "typeof", "instanceof",
  "keyof", "readonly", "public", "private", "protected", "static", "void", "never",
  "unknown", "any", "string", "number", "boolean", "null", "undefined", "true",
  "false", "as", "is", "Promise", "Array", "console", "log", "map", "filter",
  "reduce", "forEach", "push", "slice", "splice", "length"
];

export { tsKeywords };
