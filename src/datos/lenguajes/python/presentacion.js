// Datos de presentación del track de Python: palabras clave para el resaltado de
// código. La UI las consume desde la entrada del track en el registro (ADR 003);
// reutiliza el mismo campo `sqlKeywords` que BD2 (spec 011).
const pythonKeywords = [
  "def", "class", "return", "if", "elif", "else", "for", "while", "in", "not",
  "and", "or", "import", "from", "as", "with", "try", "except", "finally",
  "raise", "lambda", "yield", "global", "nonlocal", "pass", "break", "continue",
  "assert", "del", "is", "None", "True", "False", "async", "await", "self",
  "super", "property", "staticmethod", "classmethod", "print", "len", "range",
  "list", "dict", "set", "tuple", "str", "int", "float", "bool", "enumerate",
  "zip", "map", "filter", "sorted", "sum", "min", "max", "abs", "any", "all",
  "append", "extend", "insert", "pop", "remove", "sort", "split", "join",
  "strip", "replace", "format", "open", "items", "keys", "values", "get",
  "update", "copy", "deepcopy", "threading", "multiprocessing", "asyncio",
  "random", "math", "os", "sys", "json", "pathlib", "Path", "Exception",
  "ValueError", "TypeError", "KeyError", "IndexError", "AttributeError",
  "StopIteration", "ZeroDivisionError", "FileNotFoundError"
];

export { pythonKeywords };