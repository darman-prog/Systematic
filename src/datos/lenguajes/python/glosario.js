// Glosario del track de Python (spec 011). Misma forma que el resto de glosarios.
const glosario = {
  categorias: [
    { id: "estructuras", nombre: "Estructuras de datos" },
    { id: "funciones", nombre: "Funciones" },
    { id: "poo", nombre: "POO" },
    { id: "errores", nombre: "Errores" },
    { id: "concurrencia", nombre: "Concurrencia" },
    { id: "auditoria", nombre: "Auditoría de IA" }
  ],
  terminos: [
    {
      termino: "Mutabilidad",
      categoria: "estructuras",
      definicion: "Listas, dicts y sets se pueden modificar después de creados; tuplas, strings y números no. Asignar no copia: comparte la referencia.",
      ejemplo: "a = [1]; b = a; b.append(2); # a también cambia"
    },
    {
      termino: "Tupla",
      categoria: "estructuras",
      definicion: "Secuencia inmutable. Ojo: si contiene una lista, la lista interna sí puede mutar.",
      ejemplo: "t = (1, [2]); t[1].append(3); # válido"
    },
    {
      termino: "Diccionario",
      categoria: "estructuras",
      definicion: "Colección de pares clave-valor. Desde Python 3.7 garantiza orden de inserción. Las claves deben ser hashables.",
      ejemplo: "d = {\"a\": 1}; d.get(\"b\", 0)"
    },
    {
      termino: "Set",
      categoria: "estructuras",
      definicion: "Colección sin duplicados ni orden. `{}` crea un dict vacío, no un set: el set vacío es `set()`.",
      ejemplo: "unicos = set(lista)"
    },
    {
      termino: "Slicing",
      categoria: "estructuras",
      definicion: "Corte de secuencias con `[inicio:fin:paso]`. Incluye el inicio y excluye el fin. `lista[:]` copia la lista superficialmente.",
      ejemplo: "nums[1:3], nums[::-1]"
    },
    {
      termino: "Comprehension",
      categoria: "estructuras",
      definicion: "Sintaxis declarativa para construir listas, dicts o sets. Con paréntesis en vez de corchetes es una generator expression.",
      ejemplo: "[n * n for n in range(5) if n % 2 == 0]"
    },
    {
      termino: "*args y **kwargs",
      categoria: "funciones",
      definicion: "Juntan argumentos sobrantes: *args en tupla (posicionales), **kwargs en dict (por nombre). También desempaquetan al llamar.",
      ejemplo: "def f(*args, **kwargs): ...  /  f(*lista, **d)"
    },
    {
      termino: "Argumento default mutable",
      categoria: "funciones",
      definicion: "Un default como `lista=[]` se crea una sola vez al definir la función y se comparte entre llamadas. Es el bug silencioso más clásico de Python.",
      ejemplo: "def f(x, acc=[]): acc.append(x); return acc"
    },
    {
      termino: "Closure",
      categoria: "funciones",
      definicion: "Función que captura variables del entorno donde se definió. Captura la variable, no su valor: con loops causa late binding.",
      ejemplo: "funcs = [lambda: i for i in range(3)] # todas devuelven 2"
    },
    {
      termino: "Decorador",
      categoria: "funciones",
      definicion: "Función que recibe otra y devuelve una nueva, extendiendo su comportamiento sin modificarla. Se aplica con `@`.",
      ejemplo: "@mi_deco\ndef f(): ..."
    },
    {
      termino: "Generator y yield",
      categoria: "funciones",
      definicion: "Función que produce valores bajo demanda con `yield`. No ejecuta su cuerpo hasta el primer `next()` y se agota al recorrerse.",
      ejemplo: "def gen(): yield 1; yield 2"
    },
    {
      termino: "Lambda",
      categoria: "funciones",
      definicion: "Función anónima de una sola expresión. No admite statements ni anotaciones.",
      ejemplo: "sorted(lista, key=lambda x: x[1])"
    },
    {
      termino: "self",
      categoria: "poo",
      definicion: "La instancia actual, pasada como primer argumento de los métodos. No es palabra reservada: es convención.",
      ejemplo: "def __init__(self, x): self.x = x"
    },
    {
      termino: "Método dunder",
      categoria: "poo",
      definicion: "Métodos especiales con doble guion bajo que conectan tu clase con el lenguaje: __init__, __str__, __eq__, __len__.",
      ejemplo: "def __eq__(self, otro): return self.x == otro.x"
    },
    {
      termino: "property",
      categoria: "poo",
      definicion: "Decorador que expone un método como si fuera un atributo, permitiendo validación al leer o escribir.",
      ejemplo: "@property\ndef radio(self): return self._r"
    },
    {
      termino: "MRO",
      categoria: "poo",
      definicion: "Method Resolution Order: el orden lineal en que Python busca métodos con herencia múltiple. Se ve con `Clase.__mro__`.",
      ejemplo: "class C(A, B): ...  # busca en C, A, B, object"
    },
    {
      termino: "Context manager",
      categoria: "errores",
      definicion: "Objeto que usa `with` y garantiza liberar recursos implementando __enter__ y __exit__, incluso si hay excepciones.",
      ejemplo: "with open(\"f.txt\") as f: ..."
    },
    {
      termino: "Falsy",
      categoria: "errores",
      definicion: "Valores que evalúan a False en contexto booleano: None, 0, \"\", [], {}, set(). Confundirlos es fuente de bugs.",
      ejemplo: "if not lista:  # lista vacía"
    },
    {
      termino: "GIL",
      categoria: "concurrencia",
      definicion: "Global Interpreter Lock de CPython: impide que varios threads ejecuten bytecode en paralelo. Para CPU intensivo, multiprocessing.",
      ejemplo: "threading sirve para I/O, no para CPU"
    },
    {
      termino: "Coroutine",
      categoria: "concurrencia",
      definicion: "Función `async def` que se pausa con `await`. Llamarla sin await no la ejecuta: devuelve un objeto coroutine.",
      ejemplo: "async def f(): await asyncio.sleep(1)"
    },
    {
      termino: "asyncio.gather",
      categoria: "concurrencia",
      definicion: "Ejecuta varias corrutinas en concurrencia y devuelve sus resultados en orden, como una lista.",
      ejemplo: "await asyncio.gather(t1(), t2())"
    },
    {
      termino: "Bug silencioso",
      categoria: "auditoria",
      definicion: "Código que corre sin excepción pero hace algo distinto de lo esperado: mutar al iterar, defaults mutables, late binding.",
      ejemplo: "for x in lista: lista.remove(x)"
    },
    {
      termino: "API inexistente",
      categoria: "auditoria",
      definicion: "Método que la IA inventa mezclando lenguajes: lista.add(), s.contains(), d.has_key(), lista.length().",
      ejemplo: "lista.add(1)  # es append(); add es de set"
    }
  ],
  tips: [
    "Si una función recibe una colección por default, usá `None` y creala adentro: nunca `[]` o `{}`.",
    "Antes de confiar en un método, comprobá que exista: la IA mezcla APIs de JavaScript y Python 2.",
    "Un `for` que muta la lista que recorre casi siempre salta elementos: recorré una copia o construí una lista nueva."
  ]
};

export default glosario;