// Preguntas del track de TypeScript (spec 011). Ejercicios de LECTURA de código
// generado por IA: trazar ejecución, seguir datos y detectar errores que el código
// "parece correcto" pero está mal. No se ejecuta código: todo es conceptual o de
// completar. IDs TS-NNN, únicos globales (validador comparte idsVistos).
//
// claseError: sintaxis | logica | silencioso (metadato transversal, spec 011).
// focoLinea: línea del bloque `codigo` donde mirar (1-indexada), opcional.
const preguntas = [
  // ─── Etapa 1 · Fundamentos ───────────────────────────────────────────
  {
    id: "TS-001",
    parcial: "Fundamentos",
    tema: "Tipos y variables",
    dificultad: "facil",
    tipo: "codigo",
    q: "¿Qué imprime este fragmento?",
    codigo: "let x = 5;\nx = x + 1;\nconst y = \"5\";\nconsole.log(x + y);",
    options: ["65", "11", "6", "\"51\""],
    correct: 0,
    exp: "`x + y` mezcla un number (6) con un string (\"5\"): JavaScript convierte el número a texto y concatena, así que sale \"65\". Si esperabas 11, estás leyendo el `+` como suma cuando uno de los operandos es string.",
    claseError: "silencioso"
  },
  {
    id: "TS-002",
    parcial: "Fundamentos",
    tema: "Tipos y variables",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Cuál es el tipo inferido de `const activo = true;`?",
    options: ["boolean", "number", "any", "string"],
    correct: 0,
    exp: "TypeScript infiere el tipo primitivo `boolean` para `true` o `false`. `Boolean` (con mayúscula) es el objeto envoltorio y casi nunca es lo que querés; `any` solo aparece si lo declarás o desactivás el chequeo.",
    claseError: "logica"
  },
  {
    id: "TS-003",
    parcial: "Fundamentos",
    tema: "Tipos y variables",
    dificultad: "facil",
    tipo: "codigo",
    q: "¿Qué valor imprime la consola?",
    codigo: "const frutas = [\"pera\", \"uva\"];\nfrutas.push(\"kiwi\");\nconsole.log(frutas.length);",
    options: ["3", "2", "undefined", "Error"],
    correct: 0,
    exp: "`const` impide reasignar la variable, no mutar el contenido del arreglo. `push` agrega \"kiwi\" y `length` pasa a 3. Es el error típico de creer que `const` congela el objeto.",
    claseError: "logica"
  },
  {
    id: "TS-004",
    parcial: "Fundamentos",
    tema: "Control de flujo",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué devuelve la función con `edad = 17`?",
    codigo: "function permiso(edad: number): string {\n  if (edad >= 18) return \"puede\";\n  if (edad < 18) return \"no puede\";\n}",
    options: ["\"no puede\"", "\"puede\"", "undefined", "Error de compilación"],
    correct: 0,
    exp: "Con 17 la segunda condición se cumple y retorna \"no puede\". Ojo: la función no contempla el caso en que ninguna rama retorne, así que TypeScript marcaría el retorno como posiblemente `undefined`. Eso es una señal de que falta un `return` final.",
    claseError: "silencioso"
  },
  {
    id: "TS-005",
    parcial: "Fundamentos",
    tema: "Control de flujo",
    dificultad: "media",
    tipo: "dragdrop",
    q: "Completá el bucle para que recorra del 1 al 3 y sume.",
    codigo: "let total = 0;\nfor (let i = {1}; i <= 3; i{2}) {\n  total += i;\n}",
    piezas: ["1", "++", "0", "--"],
    respuestas: ["1", "++"],
    exp: "El bucle arranca en 1 (`i = 1`) e incrementa (`i++`). Con `i = 0` sumaría 0+1+2+3; con `i--` el ciclo no terminaría nunca porque `i` se aleja de 3.",
    claseError: "sintaxis"
  },

  // ─── Etapa 2 · Funciones y datos ─────────────────────────────────────
  {
    id: "TS-006",
    parcial: "Funciones y datos",
    tema: "Funciones",
    dificultad: "facil",
    tipo: "codigo",
    q: "¿Qué imprime `doble(4)`?",
    codigo: "const doble = (n: number) => {\n  n * 2;\n};",
    options: ["undefined", "8", "4", "NaN"],
    correct: 0,
    exp: "La función tiene llaves pero no `return`: calcula `n * 2` y lo descarta. Devuelve `undefined`. Es el bug silencioso más común cuando se cambia de `n => n * 2` a un cuerpo con llaves.",
    claseError: "silencioso"
  },
  {
    id: "TS-007",
    parcial: "Funciones y datos",
    tema: "Funciones",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "function saludar(nombre: string, saludo = \"Hola\") {\n  return saludo + \", \" + nombre;\n}\nconsole.log(saludar(\"Ana\"));",
    options: ["Hola, Ana", "Hola, undefined", "undefined", "Error"],
    correct: 0,
    exp: "El parámetro `saludo` tiene valor por defecto \"Hola\", así que al no pasarlo usa ese valor. El resultado es \"Hola, Ana\".",
    claseError: "logica"
  },
  {
    id: "TS-008",
    parcial: "Funciones y datos",
    tema: "Arreglos",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué devuelve `numeros.map(n => n * 2)`?",
    codigo: "const numeros = [1, 2, 3];\nconst resultado = numeros.map(n => n * 2);",
    options: ["[2, 4, 6]", "6", "[1, 2, 3]", "[2, 4, 6, 8]"],
    correct: 0,
    exp: "`map` transforma cada elemento y devuelve un arreglo nuevo del mismo largo: [2, 4, 6]. No muta `numeros`. Si querías un solo número, esa operación es `reduce`.",
    claseError: "logica"
  },
  {
    id: "TS-009",
    parcial: "Funciones y datos",
    tema: "Arreglos",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime la consola?",
    codigo: "const nums = [1, 2, 3, 4];\nconst total = nums\n  .filter(n => n % 2 === 0)\n  .reduce((acc, n) => acc + n, 0);\nconsole.log(total);",
    options: ["6", "10", "4", "0"],
    correct: 0,
    exp: "`filter` deja los pares [2, 4] y `reduce` los suma desde 0: 2 + 4 = 6. Confundir `reduce` con el arreglo completo da 10 (1+2+3+4), que es el error de saltearse el `filter`.",
    claseError: "logica"
  },
  {
    id: "TS-010",
    parcial: "Funciones y datos",
    tema: "Funciones",
    dificultad: "media",
    tipo: "dragdrop",
    q: "Completá la función para que devuelva el cuadrado.",
    codigo: "const cuadrado = (n: number): number {1} { {2} n * n; }",
    piezas: ["=>", "return", "function", "void"],
    respuestas: ["=>", "return"],
    exp: "Es una arrow function (`=>`) con cuerpo entre llaves, así que necesita `return` explícito. Sin `return`, devolvería `undefined` (el bug de TS-006).",
    claseError: "sintaxis"
  },

  // ─── Etapa 3 · Tipos y genéricos ─────────────────────────────────────
  {
    id: "TS-011",
    parcial: "Tipos y genéricos",
    tema: "Interfaces",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuál es la diferencia clave entre `interface` y `type` en TypeScript?",
    options: [
      "`interface` se puede extender/declarar de nuevo; `type` no admite redeclaración",
      "`interface` solo sirve para clases y `type` para objetos",
      "`type` no admite uniones",
      "No hay ninguna diferencia"
    ],
    correct: 0,
    exp: "Ambos describen formas, pero `interface` admite declaration merging (declararla dos veces) y se extiende con `extends`; un `type` no se puede redeclarar con el mismo nombre. `type` sí admite uniones e intersecciones.",
    claseError: "logica"
  },
  {
    id: "TS-012",
    parcial: "Tipos y genéricos",
    tema: "Narrowing",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime con `dato = \"hola\"`?",
    codigo: "function largo(dato: string | number) {\n  if (typeof dato === \"string\") {\n    return dato.length;\n  }\n  return dato.toFixed(2);\n}\nconsole.log(largo(\"hola\"));",
    options: ["4", "hola", "Error", "NaN"],
    correct: 0,
    exp: "El `typeof` estrecha la unión a `string` dentro del `if`, así que `.length` es válido y da 4. Fuera del `if`, TypeScript sabe que es `number` y permite `.toFixed`.",
    claseError: "logica"
  },
  {
    id: "TS-013",
    parcial: "Tipos y genéricos",
    tema: "Utility types",
    dificultad: "dificil",
    tipo: "multi",
    q: "¿Cuáles de estos son utility types de TypeScript?",
    options: ["Partial<T>", "Pick<T, K>", "Filter<T>", "Omit<T, K>"],
    correctos: [0, 1, 3],
    exp: "`Partial`, `Pick` y `Omit` existen. `Filter<T>` NO existe en TypeScript: es un nombre inventado que aparece en código generado por IA y compila solo si alguien lo define antes. Confiar en una API que no existe es el error que entrena la etapa de auditoría.",
    claseError: "silencioso"
  },
  {
    id: "TS-014",
    parcial: "Tipos y genéricos",
    tema: "Inferencia",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué tipo tiene `valor`?",
    codigo: "const valor = [1, 2, 3].find(n => n > 5);",
    options: ["number | undefined", "number", "undefined", "null"],
    correct: 0,
    exp: "`find` puede no encontrar nada y devuelve `undefined`. TypeScript lo modela como `number | undefined`, así que usarlo como número sin comprobar da error de compilación. Ignorar ese `undefined` es un bug silencioso clásico.",
    claseError: "silencioso"
  },
  {
    id: "TS-015",
    parcial: "Tipos y genéricos",
    tema: "any vs unknown",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Por qué `unknown` es más seguro que `any`?",
    options: [
      "`unknown` obliga a comprobar el tipo antes de usarlo; `any` desactiva el chequeo",
      "`unknown` acepta más tipos que `any`",
      "`any` solo funciona con números",
      "Son idénticos"
    ],
    correct: 0,
    exp: "Con `any` podés llamar cualquier método y TypeScript no dice nada; con `unknown` no podés operar hasta estrechar el tipo. La IA suele tirar `any` para que compile rápido: eso esconde el error en vez de resolverlo.",
    claseError: "silencioso"
  },

  // ─── Etapa 4 · Asincronía y errores ──────────────────────────────────
  {
    id: "TS-016",
    parcial: "Asincronía y errores",
    tema: "Orden de ejecución",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿En qué orden imprime?",
    codigo: "console.log(\"A\");\nasync function f() {\n  console.log(\"B\");\n  await null;\n  console.log(\"C\");\n}\nf();\nconsole.log(\"D\");",
    options: ["A, B, D, C", "A, B, C, D", "A, D, B, C", "B, A, C, D"],
    correct: 0,
    exp: "Se ejecuta el cuerpo hasta el primer `await`: imprime A y B. El `await` suspende la función y devuelve el control, así que sigue D. Al resolverse la microtarea, imprime C. El orden real casi nunca es el que sugiere la lectura lineal.",
    claseError: "silencioso"
  },
  {
    id: "TS-017",
    parcial: "Asincronía y errores",
    tema: "Promesas",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué devuelve siempre una función declarada `async`?",
    options: ["Una Promise", "El valor directo", "void", "undefined"],
    correct: 0,
    exp: "Toda función `async` devuelve una Promise, incluso si retornás un valor plano: ese valor queda envuelto. Por eso hay que `await`arla o encadenar `.then`.",
    claseError: "logica"
  },
  {
    id: "TS-018",
    parcial: "Asincronía y errores",
    tema: "Errores",
    dificultad: "media",
    tipo: "vf",
    q: "Un `await` que rechaza y no está dentro de un `try/catch` se convierte en un error no capturado.",
    options: ["Verdadero", "Falso"],
    correct: 0,
    exp: "Si la Promise rechaza y nadie la captura, el error se propaga y queda sin manejar. En código de IA es típico ver `await` sin `try/catch` alrededor de una llamada que puede fallar.",
    claseError: "silencioso"
  },
  {
    id: "TS-019",
    parcial: "Asincronía y errores",
    tema: "Await faltante",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime este código?",
    codigo: "async function datos() {\n  return 42;\n}\nfunction usar() {\n  const valor = datos();\n  console.log(valor + 1);\n}\nusar();",
    options: ["\"[object Promise]1\"", "43", "42", "NaN"],
    correct: 0,
    exp: "Falta el `await`: `valor` es una Promise, no 42. Sumar una Promise con 1 la convierte a texto y da \"[object Promise]1\". TypeScript puede no avisar si el tipo se infirió mal: bug silencioso puro de código de IA.",
    claseError: "silencioso"
  },
  {
    id: "TS-020",
    parcial: "Asincronía y errores",
    tema: "Errores",
    dificultad: "media",
    tipo: "dragdrop",
    q: "Completá el manejo de error de la llamada asíncrona.",
    codigo: "try {\n  await guardar();\n} {1} (error) {\n  console.error({2});\n}",
    piezas: ["catch", "error", "then", "finally"],
    respuestas: ["catch", "error"],
    exp: "`try` se acompaña de `catch` para capturar el rechazo, y dentro del `catch` se usa la variable `error` que declara el propio catch. `then` no va con `try`, y `finally` no recibe error.",
    claseError: "sintaxis"
  },

  // ─── Etapa 5 · Auditoría de código de IA ─────────────────────────────
  {
    id: "TS-021",
    parcial: "Auditoría de código de IA",
    tema: "Bug lógico",
    dificultad: "dificil",
    tipo: "codigo",
    q: "La IA escribió esta función para sumar los precios. ¿Qué está mal?",
    codigo: "function total(precios: number[]): number {\n  let suma = 0;\n  for (const p of precios) {\n    suma = p;\n  }\n  return suma;\n}",
    options: [
      "Asigna en vez de acumular: debería ser `suma += p`",
      "El `for...of` no recorre números",
      "Falta declarar `p`",
      "No hay nada mal"
    ],
    correct: 0,
    exp: "`suma = p` pisa el acumulador en cada vuelta: devuelve el último precio, no la suma. Compila sin errores y parece correcto. El bug lógico que la IA introduce al reescribir un `+=` por `=`.",
    claseError: "logica",
    focoLinea: 4
  },
  {
    id: "TS-022",
    parcial: "Auditoría de código de IA",
    tema: "API inexistente",
    dificultad: "dificil",
    tipo: "multiple",
    q: "La IA usó `array.remove(2)`. ¿Qué pasa?",
    options: [
      "`remove` no existe en los arreglos: falla en runtime",
      "Elimina el índice 2 correctamente",
      "Elimina el valor 2",
      "TypeScript lo corrige solo"
    ],
    correct: 0,
    exp: "Los arreglos de JavaScript no tienen `remove` (eso es de otros lenguajes o de librerías). Para sacar por índice se usa `splice`; por valor, `filter`. La IA inventa métodos plausibles: hay que verificar que la API exista.",
    claseError: "silencioso"
  },
  {
    id: "TS-023",
    parcial: "Auditoría de código de IA",
    tema: "Señales de alarma",
    dificultad: "media",
    tipo: "multi",
    q: "¿Cuáles son señales de que el código de una IA conviene revisar con lupa?",
    options: [
      "Uso de `any` para que compile",
      "Casts con `as` sin comprobar el tipo",
      "Comentarios que repiten lo que hace la línea",
      "Un `await` de una función que no es async"
    ],
    correctos: [0, 1, 3],
    exp: "`any`, `as` sin verificar y `await` de algo que no es Promise son parches que ocultan problemas. Que un comentario repita la línea es ruido, pero no un bug de comportamiento.",
    claseError: "silencioso"
  },
  {
    id: "TS-024",
    parcial: "Auditoría de código de IA",
    tema: "Bug silencioso",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué devuelve `contar(null)`?",
    codigo: "function contar(lista: string[] | null): number {\n  return lista?.length ?? 0;\n}\ncontar(null);",
    options: ["0", "undefined", "null", "Error"],
    correct: 0,
    exp: "`?.` corta en `null` y devuelve `undefined`; el `?? 0` lo convierte a 0. Acá está bien, pero el mismo patrón puede esconder un `null` que debía ser un error: distinguir \"vacío\" de \"dato faltante\" es parte de auditar.",
    claseError: "silencioso"
  },
  {
    id: "TS-025",
    parcial: "Auditoría de código de IA",
    tema: "Casts que mienten",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "const dato = \"hola\" as unknown as number;\nconsole.log(dato + 1);",
    options: ["\"hola1\"", "NaN", "1", "Error de compilación"],
    correct: 0,
    exp: "El doble `as` le dice a TypeScript que `dato` es un número cuando en runtime sigue siendo el string \"hola\". `dato + 1` concatena: \"hola1\". El cast no convierte nada, solo silencia al compilador.",
    claseError: "silencioso"
  },

  // ─── Refuerzo por etapa (completan los exámenes a 5 preguntas) ───────
  {
    id: "TS-026",
    parcial: "Fundamentos",
    tema: "Tipos y variables",
    dificultad: "facil",
    tipo: "codigo",
    q: "¿Qué imprime `typeof []`?",
    options: ["\"object\"", "\"array\"", "\"list\"", "\"undefined\""],
    correct: 0,
    exp: "`typeof` devuelve \"object\" para arreglos (y para `null`, un bug histórico del lenguaje). Para saber si algo es arreglo se usa `Array.isArray(...)`. La IA a veces usa `typeof x === \"array\"`, que nunca es true.",
    claseError: "silencioso"
  },
  {
    id: "TS-027",
    parcial: "Fundamentos",
    tema: "Tipos y variables",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuál es la diferencia entre `undefined` y `null`?",
    options: [
      "`undefined` es ausencia por defecto; `null` es ausencia asignada a propósito",
      "Son exactamente lo mismo",
      "`null` es un número",
      "`undefined` solo existe en TypeScript"
    ],
    correct: 0,
    exp: "`undefined` aparece cuando algo no se definió (variable sin valor, propiedad inexistente); `null` se asigna explícitamente para decir \"vacío a propósito\". Confundirlos hace que las comprobaciones de nulidad fallen.",
    claseError: "logica"
  },
  {
    id: "TS-028",
    parcial: "Funciones y datos",
    tema: "Arreglos",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "const nums = [1, 2, 3];\nconst r = nums.forEach(n => n * 2);\nconsole.log(r);",
    options: ["undefined", "[2, 4, 6]", "6", "[1, 2, 3]"],
    correct: 0,
    exp: "`forEach` recorre y no devuelve nada: el resultado es `undefined`. Para transformar y obtener un arreglo nuevo hay que usar `map`. Cambiar `map` por `forEach` sin querer es un bug silencioso frecuente.",
    claseError: "silencioso"
  },
  {
    id: "TS-029",
    parcial: "Funciones y datos",
    tema: "Funciones",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime `sumar(1, 2, 3, 4)`?",
    codigo: "function sumar(...nums: number[]): number {\n  return nums.reduce((a, n) => a + n, 0);\n}",
    options: ["10", "3", "[1, 2, 3, 4]", "Error"],
    correct: 0,
    exp: "El parámetro rest (`...nums`) junta todos los argumentos en un arreglo, así que suma 1+2+3+4 = 10. Sin el `...` solo tomaría el primero y el resto sería un error de tipos.",
    claseError: "logica"
  },
  {
    id: "TS-030",
    parcial: "Tipos y genéricos",
    tema: "Narrowing",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime con `animal = { ladra: true }`?",
    codigo: "type Animal = { ladra: true } | { maulla: true };\nfunction sonido(animal: Animal): string {\n  if (\"ladra\" in animal) return \"guau\";\n  return \"miau\";\n}",
    options: ["guau", "miau", "undefined", "Error"],
    correct: 0,
    exp: "El operador `in` estrecha la unión: si el objeto tiene `ladra`, TypeScript sabe que es el primer miembro y retorna \"guau\". Es la forma correcta de distinguir por forma en vez de por un campo `tipo` inventado.",
    claseError: "logica"
  },
  {
    id: "TS-031",
    parcial: "Tipos y genéricos",
    tema: "Interfaces",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué impide `readonly` en una propiedad?",
    options: [
      "Reasignarla después de crear el objeto",
      "Leerla",
      "Que sea opcional",
      "Que sea de tipo string"
    ],
    correct: 0,
    exp: "`readonly` bloquea la reasignación tras la construcción, pero permite leer. No hace inmutable el objeto en runtime: es una garantía de tipos que desaparece al compilar.",
    claseError: "logica"
  },
  {
    id: "TS-032",
    parcial: "Asincronía y errores",
    tema: "Promesas",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué devuelve `Promise.all([p1, p2])` si ambas resuelven?",
    options: [
      "Un arreglo con ambos resultados, en orden",
      "El resultado de la primera",
      "Un objeto con claves p1/p2",
      "La última que resuelva"
    ],
    correct: 0,
    exp: "`Promise.all` espera a todas y devuelve un arreglo con los resultados en el mismo orden de entrada. Si una rechaza, todo el `all` rechaza: por eso conviene saber si querés \"todas o nada\" o tolerar fallos.",
    claseError: "logica"
  },
  {
    id: "TS-033",
    parcial: "Asincronía y errores",
    tema: "Await faltante",
    dificultad: "dificil",
    tipo: "multiple",
    q: "¿Qué está mal en `[1,2].forEach(async n => { await guardar(n); });`?",
    options: [
      "`forEach` no espera las promesas: el bucle termina antes que los guardados",
      "`async` no se puede usar en una arrow function",
      "Falta un `return`",
      "Nada, funciona bien"
    ],
    correct: 0,
    exp: "`forEach` ignora lo que devuelve el callback, así que los `await` internos no se esperan y el código sigue sin que los guardados hayan terminado. Para esperar hay que usar `for...of` con `await` o `Promise.all` con `map`.",
    claseError: "silencioso"
  },
  {
    id: "TS-034",
    parcial: "Auditoría de código de IA",
    tema: "Bug silencioso",
    dificultad: "dificil",
    tipo: "codigo",
    q: "La IA quiso devolver los primeros 3 elementos. ¿Qué devuelve?",
    codigo: "function primeros(lista: number[]): number[] {\n  return lista.slice(0, 4);\n}",
    options: [
      "4 elementos: el índice final de slice es exclusivo y quedó uno de más",
      "3 elementos, está bien",
      "Error de compilación",
      "El último elemento"
    ],
    correct: 0,
    exp: "`slice(0, 4)` toma los índices 0,1,2,3: cuatro elementos. Para los primeros 3 hay que usar `slice(0, 3)`. El off-by-one que compila y \"casi\" funciona.",
    claseError: "logica",
    focoLinea: 2
  },
  {
    id: "TS-035",
    parcial: "Auditoría de código de IA",
    tema: "API inexistente",
    dificultad: "dificil",
    tipo: "multi",
    q: "¿Cuáles de estos métodos NO existen en un arreglo de JavaScript?",
    options: ["push", "remove", "insertAt", "filter"],
    correctos: [1, 2],
    exp: "`push` y `filter` son reales. `remove` e `insertAt` no existen en `Array` (son de otros lenguajes o de librerías): la IA los inventa porque suenan plausibles. Verificar la API antes de confiar es la base de la auditoría.",
    claseError: "silencioso"
  },
  // --- Ampliación de Fundamentos (lote 1) ---
  {
    id: "TS-036",
    parcial: "Fundamentos",
    tema: "Template literals",
    dificultad: "facil",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "const n = 3;\nconsole.log(`total: ${n + 1}`);",
    options: ["total: 4", "total: 31", "total: ${n + 1}", "Error"],
    correct: 0,
    exp: "El template literal evalúa la expresión `${n + 1}`: 3 + 1 = 4. Si estuviera entre comillas simples, se vería el texto literal `${n + 1}`.",
    claseError: "logica"
  },
  {
    id: "TS-037",
    parcial: "Fundamentos",
    tema: "Igualdad",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué diferencia hay entre `==` y `===`?",
    options: [
      "`===` compara valor y tipo; `==` convierte tipos antes de comparar",
      "`==` es más estricto que `===`",
      "`===` solo sirve para números",
      "Son equivalentes"
    ],
    correct: 0,
    exp: "`===` no convierte: `1 === \"1\"` es false. `==` aplica coerción y da true. Mezclar ambos esconde comparaciones inesperadas.",
    claseError: "logica"
  },
  {
    id: "TS-038",
    parcial: "Fundamentos",
    tema: "Condicionales",
    dificultad: "facil",
    tipo: "codigo",
    q: "¿Qué imprime con `nota = 75`?",
    codigo: "function nivel(nota: number): string {\n  if (nota >= 90) return \"alto\";\n  else if (nota >= 70) return \"medio\";\n  else return \"bajo\";\n}\nconsole.log(nivel(75));",
    options: ["medio", "alto", "bajo", "undefined"],
    correct: 0,
    exp: "75 no llega a 90, pero sí a 70: entra al `else if` y devuelve \"medio\". Las cadenas de `else if` se evalúan en orden.",
    claseError: "logica"
  },
  {
    id: "TS-039",
    parcial: "Fundamentos",
    tema: "Cortocircuito",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "const usuario = null;\nconsole.log(usuario && usuario.nombre);",
    options: ["null", "undefined", "Error", "false"],
    correct: 0,
    exp: "`&&` cortocircuita: si `usuario` es null (falsy), devuelve null sin evaluar `usuario.nombre`. Por eso no lanza error; creer que devuelve un booleano lleva a bugs.",
    claseError: "silencioso"
  },
  {
    id: "TS-040",
    parcial: "Fundamentos",
    tema: "Bucles",
    dificultad: "facil",
    tipo: "dragdrop",
    q: "Completá el bucle para que reste hasta llegar a 0.",
    codigo: "let n = 3;\nwhile (n {1} 0) {\n  n{2};\n}",
    piezas: [">", "--", "<", "++"],
    respuestas: [">", "--"],
    exp: "El `while` sigue mientras `n > 0` y `n--` resta 1 en cada vuelta, así termina en 0. Con `n++` el ciclo nunca terminaría.",
    claseError: "sintaxis"
  },
  {
    id: "TS-041",
    parcial: "Fundamentos",
    tema: "Bucles",
    dificultad: "facil",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "let suma = 0;\nfor (let i = 1; i <= 4; i++) {\n  suma += i;\n}\nconsole.log(suma);",
    options: ["10", "6", "4", "0"],
    correct: 0,
    exp: "Suma 1+2+3+4 = 10. El `<=` incluye el 4; con `<` daría 6.",
    claseError: "logica"
  },
  {
    id: "TS-042",
    parcial: "Fundamentos",
    tema: "Switch",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "const color = \"rojo\";\nswitch (color) {\n  case \"rojo\":\n    console.log(\"A\");\n  case \"azul\":\n    console.log(\"B\");\n    break;\n  default:\n    console.log(\"C\");\n}",
    options: ["A y B", "Solo A", "Solo B", "A, B y C"],
    correct: 0,
    exp: "Falta el `break` en el caso \"rojo\": la ejecución cae al siguiente caso (fall-through) e imprime A y B. El `break` de \"azul\" corta antes del default.",
    claseError: "silencioso"
  },
  {
    id: "TS-043",
    parcial: "Fundamentos",
    tema: "NaN",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué devuelve `NaN === NaN`?",
    options: [
      "false: NaN nunca es igual a sí mismo",
      "true",
      "undefined",
      "Error"
    ],
    correct: 0,
    exp: "NaN es el único valor distinto de sí mismo. Para comprobarlo se usa `Number.isNaN(x)`. Comparar con `=== NaN` siempre da false: bug silencioso típico.",
    claseError: "silencioso"
  },
  {
    id: "TS-044",
    parcial: "Fundamentos",
    tema: "Precedencia",
    dificultad: "facil",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "console.log(2 + 3 * 4);",
    options: ["14", "20", "24", "9"],
    correct: 0,
    exp: "La multiplicación tiene mayor precedencia: 3*4 = 12, más 2 = 14. Para sumar primero harían falta paréntesis.",
    claseError: "logica"
  },
  {
    id: "TS-045",
    parcial: "Fundamentos",
    tema: "Truthiness",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "const valor = \"0\";\nif (valor) console.log(\"verdadero\");\nelse console.log(\"falso\");",
    options: ["verdadero", "falso", "Error", "undefined"],
    correct: 0,
    exp: "El string \"0\" no está vacío, así que es truthy: imprime \"verdadero\". El número 0 sí sería falsy. Confundir ambos es un bug silencioso frecuente.",
    claseError: "silencioso"
  },
  {
    id: "TS-046",
    parcial: "Fundamentos",
    tema: "typeof",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué devuelve `typeof null`?",
    options: ["\"object\"", "\"null\"", "\"undefined\"", "\"boolean\""],
    correct: 0,
    exp: "`typeof null` devuelve \"object\" por un bug histórico de JavaScript. Para comprobar null se usa `x === null`; `typeof x === \"null\"` nunca es true.",
    claseError: "silencioso"
  },
  {
    id: "TS-047",
    parcial: "Fundamentos",
    tema: "Bucles",
    dificultad: "facil",
    tipo: "codigo",
    q: "¿Qué pasa con este bucle?",
    codigo: "let i = 0;\nwhile (i < 3) {\n  console.log(i);\n}",
    options: [
      "Se cuelga: `i` nunca cambia",
      "Imprime 0, 1 y 2",
      "Imprime 0 una vez",
      "No imprime nada"
    ],
    correct: 0,
    exp: "Falta incrementar `i` dentro del bucle: la condición siempre es true y se repite para siempre. El bucle infinito más común.",
    claseError: "sintaxis"
  },
  {
    id: "TS-048",
    parcial: "Fundamentos",
    tema: "Bucles",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "let x = 5;\nwhile (x > 0) {\n  x -= 2;\n}\nconsole.log(x);",
    options: ["-1", "0", "1", "-2"],
    correct: 0,
    exp: "x va 5 → 3 → 1 → -1. Con x = 1 la condición 1 > 0 es true y resta 2, quedando -1; ahí corta. No se detiene en 0 porque 0 no es mayor que 0.",
    claseError: "logica"
  },
  // --- Ampliación de Funciones y datos (lote 2) ---
  {
    id: "TS-049",
    parcial: "Funciones y datos",
    tema: "Parámetros",
    dificultad: "facil",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "function saludar(nombre = \"mundo\") {\n  return `hola ${nombre}`;\n}\nconsole.log(saludar());",
    options: ["hola mundo", "hola undefined", "hola ", "Error"],
    correct: 0,
    exp: "Al llamar sin argumentos, `nombre` toma el valor por defecto \"mundo\". Sin el default sería undefined.",
    claseError: "logica"
  },
  {
    id: "TS-050",
    parcial: "Funciones y datos",
    tema: "Arrow functions",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué devuelve `doble(3)`?",
    codigo: "const doble = n => { n * 2 };\nconsole.log(doble(3));",
    options: ["undefined", "6", "NaN", "Error"],
    correct: 0,
    exp: "La flecha con llaves no devuelve nada sin `return`: `{ n * 2 }` es un bloque, no un objeto. Para devolver 6 hacía falta `n => n * 2` o `return n * 2`.",
    claseError: "silencioso"
  },
  {
    id: "TS-051",
    parcial: "Funciones y datos",
    tema: "Map",
    dificultad: "facil",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "console.log([1, 2, 3].map(n => n * 2));",
    options: ["[2, 4, 6]", "[1, 2, 3, 1, 2, 3]", "[2, 4, 6, 8]", "6"],
    correct: 0,
    exp: "`map` devuelve un arreglo nuevo con cada elemento transformado: [2, 4, 6]. No muta el original.",
    claseError: "logica"
  },
  {
    id: "TS-052",
    parcial: "Funciones y datos",
    tema: "Reduce",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "const total = [1, 2, 3].reduce((acc, n) => acc + n, 0);\nconsole.log(total);",
    options: ["6", "3", "123", "0"],
    correct: 0,
    exp: "`reduce` acumula desde 0: 0+1=1, 1+2=3, 3+3=6. El segundo argumento (0) es el valor inicial; sin él, el primer elemento se usa como semilla.",
    claseError: "logica"
  },
  {
    id: "TS-053",
    parcial: "Funciones y datos",
    tema: "Destructuring",
    dificultad: "facil",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "const persona = { nombre: \"Ana\", edad: 30 };\nconst { nombre } = persona;\nconsole.log(nombre);",
    options: ["Ana", "{ nombre: \"Ana\", edad: 30 }", "undefined", "Error"],
    correct: 0,
    exp: "El destructuring `{ nombre }` extrae la propiedad `nombre` del objeto: imprime \"Ana\".",
    claseError: "logica"
  },
  {
    id: "TS-054",
    parcial: "Funciones y datos",
    tema: "Spread",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué hace `const copia = [...original];`?",
    options: [
      "Crea un arreglo nuevo con los mismos elementos (copia superficial)",
      "Copia el arreglo por referencia",
      "Vacía el original",
      "Convierte el arreglo en objeto"
    ],
    correct: 0,
    exp: "El spread copia los elementos a un arreglo nuevo, así que mutar `copia` no toca `original`. Es superficial: los objetos internos siguen compartidos.",
    claseError: "logica"
  },
  {
    id: "TS-055",
    parcial: "Funciones y datos",
    tema: "Filter",
    dificultad: "facil",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "const pares = [1, 2, 3, 4].filter(n => n % 2 === 0);\nconsole.log(pares);",
    options: ["[2, 4]", "[1, 3]", "[true, false, true, false]", "2"],
    correct: 0,
    exp: "`filter` conserva los elementos que cumplen la condición: los pares [2, 4]. Devuelve un arreglo nuevo.",
    claseError: "logica"
  },
  {
    id: "TS-056",
    parcial: "Funciones y datos",
    tema: "Map + parseInt",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime? (bug clásico)",
    codigo: "console.log([\"1\", \"2\", \"3\"].map(parseInt));",
    options: ["[1, NaN, NaN]", "[1, 2, 3]", "[\"1\", \"2\", \"3\"]", "Error"],
    correct: 0,
    exp: "`map` pasa (valor, índice): `parseInt(\"2\", 1)` y `parseInt(\"3\", 2)` usan el índice como base y dan NaN. Hay que envolver: `.map(s => parseInt(s, 10))`.",
    claseError: "silencioso"
  },
  {
    id: "TS-057",
    parcial: "Funciones y datos",
    tema: "Return faltante",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué devuelve `sumar(2, 3)`?",
    codigo: "function sumar(a, b) {\n  a + b;\n}",
    options: ["undefined", "5", "NaN", "Error"],
    correct: 0,
    exp: "Sin `return`, la función devuelve undefined aunque calcule a + b. El resultado se descarta: bug silencioso muy común en código generado.",
    claseError: "silencioso"
  },
  {
    id: "TS-058",
    parcial: "Funciones y datos",
    tema: "Mutabilidad",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué método devuelve un arreglo nuevo sin mutar el original?",
    options: ["map", "push", "sort", "splice"],
    correct: 0,
    exp: "`map` (y `filter`) devuelven un arreglo nuevo. `push`, `sort` y `splice` mutan el original: confundirlos altera datos compartidos.",
    claseError: "logica"
  },
  {
    id: "TS-059",
    parcial: "Funciones y datos",
    tema: "Reduce",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué pasa con `[].reduce((a, b) => a + b)`?",
    options: [
      "Lanza TypeError: reduce de un arreglo vacío sin valor inicial",
      "Devuelve 0",
      "Devuelve undefined",
      "Devuelve NaN"
    ],
    correct: 0,
    exp: "`reduce` sobre un arreglo vacío sin valor inicial lanza TypeError. Con `reduce((a,b)=>a+b, 0)` devolvería 0. La IA a veces olvida el valor inicial.",
    claseError: "logica"
  },
  {
    id: "TS-060",
    parcial: "Funciones y datos",
    tema: "Sort",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "const a = [3, 1, 2];\nconst b = a.sort();\nconsole.log(a);",
    options: ["[1, 2, 3]", "[3, 1, 2]", "undefined", "Error"],
    correct: 0,
    exp: "`sort` ordena en el lugar y devuelve el mismo arreglo: `a` también queda [1, 2, 3]. Para no mutar: `[...a].sort()`.",
    claseError: "silencioso"
  },
  {
    id: "TS-061",
    parcial: "Funciones y datos",
    tema: "Destructuring",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "const { puerto = 3000 } = { host: \"localhost\" };\nconsole.log(puerto);",
    options: ["3000", "undefined", "null", "Error"],
    correct: 0,
    exp: "El default `= 3000` se usa cuando la propiedad no existe o es undefined. Como no hay `puerto`, imprime 3000.",
    claseError: "logica"
  },
  // --- Ampliación de Tipos y genéricos (lote 3) ---
  {
    id: "TS-062",
    parcial: "Tipos y genéricos",
    tema: "Interface vs type",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué es cierto sobre `interface` y `type`?",
    options: [
      "Ambos describen la forma de un objeto; `interface` se puede extender con declaraciones repetidas",
      "Solo `type` sirve para objetos",
      "`interface` no admite métodos",
      "Son sinónimos exactos en todos los casos"
    ],
    correct: 0,
    exp: "`interface` y `type` describen formas; `interface` se puede reabrir/mergear con el mismo nombre, `type` no. `type` sí admite uniones y tuplas, que `interface` no.",
    claseError: "logica"
  },
  {
    id: "TS-063",
    parcial: "Tipos y genéricos",
    tema: "Propiedades opcionales",
    dificultad: "facil",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "type Usuario = { nombre: string; email?: string };\nconst u: Usuario = { nombre: \"Ana\" };\nconsole.log(u.email);",
    options: ["undefined", "null", "Error de compilación", "\"\""],
    correct: 0,
    exp: "`email?` es opcional: si no se pasa, la propiedad no existe y leerla da undefined. TypeScript obliga a comprobarla antes de usarla como string.",
    claseError: "logica"
  },
  {
    id: "TS-064",
    parcial: "Tipos y genéricos",
    tema: "Narrowing",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "function largo(x: string | number): number {\n  if (typeof x === \"string\") return x.length;\n  return x;\n}\nconsole.log(largo(\"hola\"));",
    options: ["4", "\"hola\"", "undefined", "Error"],
    correct: 0,
    exp: "`typeof x === \"string\"` estrecha la unión y dentro del if `x` es string: `x.length` = 4. El narrowing permite operar sin castear.",
    claseError: "logica"
  },
  {
    id: "TS-065",
    parcial: "Tipos y genéricos",
    tema: "Unión discriminada",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "type Forma =\n  | { tipo: \"circulo\"; radio: number }\n  | { tipo: \"cuadrado\"; lado: number };\nfunction area(f: Forma): number {\n  if (f.tipo === \"circulo\") return 3.14 * f.radio ** 2;\n  return f.lado ** 2;\n}\nconsole.log(area({ tipo: \"cuadrado\", lado: 3 }));",
    options: ["9", "3.14 * 9", "3", "Error"],
    correct: 0,
    exp: "El campo `tipo` discrimina la unión: al no ser círculo, TypeScript sabe que es cuadrado y `f.lado` = 3, así que el área es 9. Este patrón evita `any`.",
    claseError: "logica"
  },
  {
    id: "TS-066",
    parcial: "Tipos y genéricos",
    tema: "Genéricos",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué devuelve `identidad(5)`?",
    codigo: "function identidad<T>(x: T): T {\n  return x;\n}\nconsole.log(identidad(5));",
    options: ["5", "undefined", "T", "Error"],
    correct: 0,
    exp: "El genérico `<T>` se infiere como number al pasar 5, y devuelve el mismo valor. Los genéricos preservan el tipo sin usar `any`.",
    claseError: "logica"
  },
  {
    id: "TS-067",
    parcial: "Tipos y genéricos",
    tema: "Restricciones",
    dificultad: "dificil",
    tipo: "multiple",
    q: "¿Para qué sirve `T extends { id: number }` en un genérico?",
    options: [
      "Exige que T tenga al menos la propiedad id, sin fijar el resto",
      "Hace que T sea siempre number",
      "Impide pasar cualquier objeto",
      "Convierte T en any"
    ],
    correct: 0,
    exp: "`extends` restringe el genérico: T debe incluir `id: number`, pero puede tener más campos. Es la forma de pedir una forma mínima sin perder el tipo concreto.",
    claseError: "logica"
  },
  {
    id: "TS-068",
    parcial: "Tipos y genéricos",
    tema: "Readonly",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué pasa con `lista.push(4)`?",
    codigo: "const lista: readonly number[] = [1, 2, 3];\nlista.push(4);",
    options: [
      "Error de compilación: readonly number[] no tiene push",
      "Agrega el 4 en runtime",
      "Devuelve undefined",
      "Nada, lo ignora"
    ],
    correct: 0,
    exp: "`readonly number[]` quita los métodos que mutan, incluido `push`: TypeScript falla al compilar. Es una garantía de tipos, no una protección en runtime.",
    claseError: "sintaxis"
  },
  {
    id: "TS-069",
    parcial: "Tipos y genéricos",
    tema: "as const",
    dificultad: "dificil",
    tipo: "multiple",
    q: "¿Qué tipo infiere `const direcciones = [\"norte\", \"sur\"] as const;`?",
    options: [
      "Una tupla readonly de literales: [\"norte\", \"sur\"]",
      "string[]",
      "readonly string[]",
      "any[]"
    ],
    correct: 0,
    exp: "`as const` congela los literales: el tipo es una tupla readonly con exactamente \"norte\" y \"sur\", no string[]. Sirve para mapas de valores válidos.",
    claseError: "logica"
  },
  {
    id: "TS-070",
    parcial: "Tipos y genéricos",
    tema: "unknown vs any",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué diferencia hay entre `any` y `unknown`?",
    options: [
      "`unknown` obliga a comprobar el tipo antes de usarlo; `any` no comprueba nada",
      "Son lo mismo",
      "`any` es más seguro",
      "`unknown` solo admite strings"
    ],
    correct: 0,
    exp: "Con `unknown` no podés operar hasta estrecharlo (typeof, instanceof): es la opción segura para datos externos. `any` desactiva el chequeo y esconde bugs.",
    claseError: "logica"
  },
  {
    id: "TS-071",
    parcial: "Tipos y genéricos",
    tema: "Enum",
    dificultad: "facil",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "enum Estado { Activo, Inactivo }\nconsole.log(Estado.Activo);",
    options: ["0", "\"Activo\"", "1", "undefined"],
    correct: 0,
    exp: "Por defecto los enums numéricos arrancan en 0: Estado.Activo vale 0. Es una de las razones por las que muchos equipos prefieren uniones de literales.",
    claseError: "logica"
  },
  {
    id: "TS-072",
    parcial: "Tipos y genéricos",
    tema: "Tipos literales",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué pasa al asignar `direccion = \"arriba\"`?",
    codigo: "type Direccion = \"norte\" | \"sur\";\nlet direccion: Direccion = \"arriba\";",
    options: [
      "Error de compilación: \"arriba\" no pertenece a la unión",
      "Se asigna sin problema",
      "Queda undefined",
      "Se convierte a string"
    ],
    correct: 0,
    exp: "`Direccion` solo admite \"norte\" o \"sur\": \"arriba\" no compila. Los tipos literales atrapan valores inválidos en tiempo de compilación.",
    claseError: "sintaxis"
  },
  {
    id: "TS-073",
    parcial: "Tipos y genéricos",
    tema: "Non-null assertion",
    dificultad: "dificil",
    tipo: "multiple",
    q: "¿Qué hace `valor!.toString()`?",
    options: [
      "Le dice a TypeScript que valor no es null/undefined, sin comprobarlo en runtime",
      "Lanza un error si valor es null",
      "Convierte null en string",
      "Comprueba el tipo en runtime"
    ],
    correct: 0,
    exp: "El `!` es una afirmación, no una comprobación: si valor es null en runtime, igual revienta. Es un atajo peligroso que suele esconder el bug.",
    claseError: "silencioso"
  },
  {
    id: "TS-074",
    parcial: "Tipos y genéricos",
    tema: "Genéricos",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué devuelve `primero([10, 20, 30])`?",
    codigo: "function primero<T>(lista: T[]): T | undefined {\n  return lista[0];\n}\nconsole.log(primero([10, 20, 30]));",
    options: ["10", "30", "undefined", "Error"],
    correct: 0,
    exp: "`lista[0]` es 10 y el tipo de retorno `T | undefined` recuerda que un arreglo puede estar vacío. Devolver undefined es correcto, no un bug.",
    claseError: "logica"
  },
  // --- Ampliación de Asincronía y errores (lote 4) ---
  {
    id: "TS-075",
    parcial: "Asincronía y errores",
    tema: "Event loop",
    dificultad: "media",
    tipo: "codigo",
    q: "¿En qué orden imprime?",
    codigo: "console.log(\"A\");\nsetTimeout(() => console.log(\"B\"), 0);\nconsole.log(\"C\");",
    options: ["A, C, B", "A, B, C", "B, A, C", "C, A, B"],
    correct: 0,
    exp: "El setTimeout, aunque sea 0 ms, va a la cola de macrotareas: el código sincrónico (A, C) corre primero y B al final. Confundir esto rompe el orden esperado.",
    claseError: "logica"
  },
  {
    id: "TS-076",
    parcial: "Asincronía y errores",
    tema: "Microtareas",
    dificultad: "dificil",
    tipo: "multiple",
    q: "¿Cuál corre antes: una promesa resuelta o un setTimeout de 0 ms?",
    options: [
      "La promesa: las microtareas van antes que las macrotareas",
      "El setTimeout",
      "Depende del navegador",
      "Se ejecutan a la vez"
    ],
    correct: 0,
    exp: "Las microtareas (promesas, queueMicrotask) se vacían antes de la siguiente macrotarea (setTimeout). Es la base del orden en el event loop.",
    claseError: "logica"
  },
  {
    id: "TS-077",
    parcial: "Asincronía y errores",
    tema: "Promesas",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "Promise.resolve(1).then(v => console.log(v + 1));\nconsole.log(\"fin\");",
    options: ["fin, luego 2", "2, luego fin", "1, luego fin", "Error"],
    correct: 0,
    exp: "El callback de `then` es asincrónico: \"fin\" (sincrónico) se imprime primero y 2 después. No se puede leer el resultado de una promesa fuera de su callback.",
    claseError: "logica"
  },
  {
    id: "TS-078",
    parcial: "Asincronía y errores",
    tema: "Promise.all",
    dificultad: "dificil",
    tipo: "multiple",
    q: "¿Qué diferencia hay entre `Promise.all` y `Promise.allSettled`?",
    options: [
      "`all` rechaza si una falla; `allSettled` espera todas y reporta el estado de cada una",
      "Son iguales",
      "`allSettled` cancela las demás",
      "`all` solo acepta dos promesas"
    ],
    correct: 0,
    exp: "`all` es todo-o-nada: el primer rechazo corta. `allSettled` nunca rechaza y devuelve {status, value|reason} de cada promesa. Elegir mal esconde fallos.",
    claseError: "logica"
  },
  {
    id: "TS-079",
    parcial: "Asincronía y errores",
    tema: "Try/catch",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime si `cargar()` rechaza?",
    codigo: "async function init() {\n  try {\n    await cargar();\n  } catch (e) {\n    console.log(\"error controlado\");\n  }\n}\ninit();",
    options: ["error controlado", "Unhandled rejection", "undefined", "Error de compilación"],
    correct: 0,
    exp: "Con `await` dentro del try, el rechazo se convierte en excepción y lo captura el catch: imprime \"error controlado\". Sin await, el catch no lo vería.",
    claseError: "logica"
  },
  {
    id: "TS-080",
    parcial: "Asincronía y errores",
    tema: "Async",
    dificultad: "facil",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "async function f() { return 5; }\nconsole.log(f());",
    options: ["Promise { 5 }", "5", "undefined", "Error"],
    correct: 0,
    exp: "Una función async siempre devuelve una promesa: `f()` da Promise resuelta con 5. Para obtener 5 hay que usar `await f()` o `.then`.",
    claseError: "logica"
  },
  {
    id: "TS-081",
    parcial: "Asincronía y errores",
    tema: "Await",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué pasa con este código?",
    codigo: "function cargar() {\n  const datos = await fetch(\"/api\");\n}",
    options: [
      "Error de sintaxis: await solo se usa en funciones async",
      "Funciona igual",
      "Devuelve undefined",
      "Lanza una promesa"
    ],
    correct: 0,
    exp: "`await` solo es válido dentro de una función `async` (o en el nivel superior de un módulo). Fuera, es error de sintaxis. La IA a veces lo olvida.",
    claseError: "sintaxis"
  },
  {
    id: "TS-082",
    parcial: "Asincronía y errores",
    tema: "Rechazo sin manejar",
    dificultad: "dificil",
    tipo: "multiple",
    q: "¿Qué pasa si una promesa rechaza y nadie la captura?",
    options: [
      "Unhandled promise rejection: el error se pierde o cae el proceso",
      "Se ignora sin consecuencias",
      "Se convierte en un valor null",
      "Se reintenta sola"
    ],
    correct: 0,
    exp: "Sin `.catch` ni `try/catch`, el rechazo queda sin manejar: en Node puede tumbar el proceso. Es el bug silencioso clásico de `fetch` sin manejo.",
    claseError: "silencioso"
  },
  {
    id: "TS-083",
    parcial: "Asincronía y errores",
    tema: "Finally",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Cuándo se ejecuta el bloque `finally`?",
    codigo: "try {\n  return 1;\n} finally {\n  console.log(\"cierre\");\n}",
    options: [
      "Siempre, incluso si hay return o error",
      "Solo si hay error",
      "Solo si no hay return",
      "Nunca, el return lo saltea"
    ],
    correct: 0,
    exp: "`finally` corre siempre, con o sin error y aunque haya `return`. Sirve para cerrar recursos (conexiones, archivos).",
    claseError: "logica"
  },
  {
    id: "TS-084",
    parcial: "Asincronía y errores",
    tema: "Promise.race",
    dificultad: "dificil",
    tipo: "multiple",
    q: "¿Qué devuelve `Promise.race([p1, p2])`?",
    options: [
      "El resultado de la primera promesa que se resuelva o rechace",
      "Un arreglo con ambos resultados",
      "La suma de ambos",
      "Siempre la primera del arreglo"
    ],
    correct: 0,
    exp: "`race` gana la primera en asentarse (resuelta o rechazada), no la primera del arreglo. Se usa para timeouts: competir la petición contra un temporizador.",
    claseError: "logica"
  },
  {
    id: "TS-085",
    parcial: "Asincronía y errores",
    tema: "Async",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué devuelve `f()`?",
    codigo: "async function f() {\n  return Promise.resolve(3);\n}",
    options: [
      "Una promesa resuelta con 3 (el return se aplana)",
      "Una promesa que contiene otra promesa",
      "3",
      "undefined"
    ],
    correct: 0,
    exp: "Una función async aplana lo que devuelve: devolver una promesa no anida promesas, la promesa externa se resuelve con 3.",
    claseError: "logica"
  },
  {
    id: "TS-086",
    parcial: "Asincronía y errores",
    tema: "Try/catch",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Captura el catch el rechazo de `cargar()`?",
    codigo: "try {\n  cargar();\n} catch (e) {\n  console.log(\"atrapado\");\n}",
    options: [
      "No: sin await, el rechazo es asincrónico y el catch ya terminó",
      "Sí, lo atrapa",
      "Solo si cargar es async",
      "Depende del navegador"
    ],
    correct: 0,
    exp: "Sin `await`, `cargar()` devuelve una promesa y el try/catch no la observa: el rechazo queda sin manejar. El catch solo atrapa errores sincrónicos de esa llamada.",
    claseError: "silencioso"
  },
  {
    id: "TS-087",
    parcial: "Asincronía y errores",
    tema: "Encadenamiento",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "Promise.resolve(2)\n  .then(v => v * 3)\n  .then(v => console.log(v));",
    options: ["6", "2", "3", "undefined"],
    correct: 0,
    exp: "Cada `then` recibe lo que devolvió el anterior: 2 * 3 = 6. Encadenar permite transformar el valor paso a paso sin anidar callbacks.",
    claseError: "logica"
  },
  // --- Ampliación de Auditoría de código de IA (lote 5, capstone) ---
  {
    id: "TS-088",
    parcial: "Auditoría de código de IA",
    tema: "Condición invertida",
    dificultad: "media",
    tipo: "codigo",
    q: "La IA quería devolver true para mayores de edad. ¿Qué devuelve con edad = 20?",
    codigo: "function esMayor(edad: number): boolean {\n  return edad <= 18;\n}",
    options: ["false", "true", "undefined", "Error"],
    correct: 0,
    exp: "El operador está invertido: debería ser `edad >= 18`. Con 20 devuelve false, justo lo contrario. El bug compila y pasa desapercibido.",
    claseError: "logica",
    focoLinea: 2
  },
  {
    id: "TS-089",
    parcial: "Auditoría de código de IA",
    tema: "Off-by-one",
    dificultad: "facil",
    tipo: "codigo",
    q: "La IA quería imprimir del 1 al 5. ¿Qué imprime?",
    codigo: "for (let i = 1; i < 5; i++) {\n  console.log(i);\n}",
    options: ["1, 2, 3, 4", "1, 2, 3, 4, 5", "0, 1, 2, 3, 4", "1, 2, 3"],
    correct: 0,
    exp: "`i < 5` corta en 4: imprime 1..4, falta el 5. Para incluir el 5 hay que usar `i <= 5`. Off-by-one clásico.",
    claseError: "logica",
    focoLinea: 1
  },
  {
    id: "TS-090",
    parcial: "Auditoría de código de IA",
    tema: "API inexistente",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué método NO existe en un string de JavaScript?",
    options: ["reverse", "toUpperCase", "slice", "includes"],
    correct: 0,
    exp: "`reverse` no existe en String (sí en Array). Para invertir un string hay que hacer `[...s].reverse().join(\"\")`. La IA lo inventa porque suena lógico.",
    claseError: "silencioso"
  },
  {
    id: "TS-091",
    parcial: "Auditoría de código de IA",
    tema: "Conversión",
    dificultad: "media",
    tipo: "codigo",
    q: "La IA quería convertir \"12px\" a número. ¿Qué devuelve `Number(\"12px\")`?",
    options: ["NaN", "12", "0", "\"12px\""],
    correct: 0,
    exp: "`Number` es estricto: si el string no es un número completo, da NaN. `parseInt(\"12px\")` sí devuelve 12. Elegir el conversor equivocado rompe el cálculo.",
    claseError: "silencioso"
  },
  {
    id: "TS-092",
    parcial: "Auditoría de código de IA",
    tema: "Igualdad de objetos",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué imprime?",
    codigo: "const a = { x: 1 };\nconst b = { x: 1 };\nconsole.log(a === b);",
    options: ["false: compara referencias, no contenido", "true", "undefined", "Error"],
    correct: 0,
    exp: "`===` en objetos compara referencias, no campos: dos objetos con el mismo contenido son distintos. Para comparar por valor hay que revisar cada propiedad.",
    claseError: "silencioso"
  },
  {
    id: "TS-093",
    parcial: "Auditoría de código de IA",
    tema: "Mutación",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué imprime `console.log(lista)` tras llamar `agregar(lista)`?",
    codigo: "function agregar(items: number[]) {\n  items.push(4);\n}\nconst lista = [1, 2, 3];\nagregar(lista);\nconsole.log(lista);",
    options: ["[1, 2, 3, 4]: el push muta el arreglo original", "[1, 2, 3]", "undefined", "Error"],
    correct: 0,
    exp: "El arreglo se pasa por referencia: `push` muta `lista`. Si se esperaba una copia, hay que hacer `[...items, 4]`. Efecto colateral silencioso.",
    claseError: "silencioso"
  },
  {
    id: "TS-094",
    parcial: "Auditoría de código de IA",
    tema: "Async en forEach",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué problema tiene este guardado?",
    codigo: "async function guardarTodo(items: Item[]) {\n  items.forEach(async (it) => {\n    await api.guardar(it);\n  });\n}",
    options: [
      "forEach no espera: la función termina antes de que se guarden los ítems",
      "Falta el return",
      "api.guardar no es async",
      "Ninguno, está correcto"
    ],
    correct: 0,
    exp: "`forEach` ignora las promesas del callback: `guardarTodo` resuelve sin que los guardados terminen. Se arregla con `for...of` + await o `Promise.all(items.map(...))`.",
    claseError: "silencioso"
  },
  {
    id: "TS-095",
    parcial: "Auditoría de código de IA",
    tema: "Señales de bug",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuál es la señal más clara de que el código de la IA no está verificado?",
    options: [
      "Usa métodos o parámetros que no existen en la API real",
      "Tiene comentarios",
      "Usa nombres en inglés",
      "Está formateado"
    ],
    correct: 0,
    exp: "La IA inventa APIs plausibles (`remove`, `insertAt`, `reverse` en string). Verificar que cada método exista y haga lo esperado es el núcleo de la auditoría.",
    claseError: "silencioso"
  },
  {
    id: "TS-096",
    parcial: "Auditoría de código de IA",
    tema: "Catch vacío",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué problema tiene este catch?",
    codigo: "try {\n  await procesar();\n} catch (e) {\n  // nada\n}",
    options: [
      "Traga el error: el fallo desaparece sin aviso ni log",
      "No compila",
      "Es correcto para ignorar errores",
      "Falta un return"
    ],
    correct: 0,
    exp: "Un catch vacío oculta el fallo: el programa sigue como si todo hubiera ido bien. Mejor registrar (`console.error(e)`) o propagar. Bug silencioso por excelencia.",
    claseError: "silencioso"
  },
  {
    id: "TS-097",
    parcial: "Auditoría de código de IA",
    tema: "Coerción",
    dificultad: "dificil",
    tipo: "codigo",
    q: "¿Qué problema tiene esta validación?",
    codigo: "function esCero(n) {\n  return n == 0;\n}\nconsole.log(esCero(\"\"));",
    options: [
      "Devuelve true: \"\" == 0 por coerción, aunque no sea un cero",
      "Devuelve false",
      "Lanza error",
      "Devuelve undefined"
    ],
    correct: 0,
    exp: "Con `==`, el string vacío se convierte a 0 y da true. Con `===` sería false. En validaciones, `==` deja pasar valores que no querías.",
    claseError: "silencioso"
  },
  {
    id: "TS-098",
    parcial: "Auditoría de código de IA",
    tema: "indexOf",
    dificultad: "dificil",
    tipo: "codigo",
    q: "La IA quiso comprobar si el arreglo contiene el 1. ¿Qué imprime?",
    codigo: "const numeros = [1, 2, 3];\nconsole.log(numeros.indexOf(1) > 0);",
    options: [
      "false: indexOf(1) es 0, y 0 > 0 es falso",
      "true",
      "1",
      "undefined"
    ],
    correct: 0,
    exp: "`indexOf(1)` devuelve 0 (está en la primera posición), y `0 > 0` es false: el bug clásico de usar `> 0` en vez de `>= 0`. Con `includes` no pasa.",
    claseError: "silencioso"
  },
  {
    id: "TS-099",
    parcial: "Auditoría de código de IA",
    tema: "Null sin comprobar",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué pasa si `usuario` es null?",
    codigo: "function nombre(usuario: { nombre: string } | null): string {\n  return usuario.nombre;\n}",
    options: [
      "Error de compilación: usuario podría ser null y no se comprueba",
      "Devuelve \"\"",
      "Devuelve undefined",
      "Funciona siempre"
    ],
    correct: 0,
    exp: "TypeScript marca el error porque `usuario` puede ser null: hay que estrecharlo (`if (usuario)`) o usar optional chaining. Ignorar el tipo reintroduce el crash en runtime.",
    claseError: "sintaxis"
  },
  {
    id: "TS-100",
    parcial: "Auditoría de código de IA",
    tema: "Filter sin return",
    dificultad: "dificil",
    tipo: "codigo",
    q: "La IA quiso quedarse con los mayores de 18. ¿Qué devuelve el filtro?",
    codigo: "const adultos = personas.filter(p => {\n  p.edad > 18;\n});",
    options: [
      "Un arreglo vacío: el callback devuelve undefined (falsy)",
      "Todas las personas",
      "Solo los mayores de 18",
      "undefined"
    ],
    correct: 0,
    exp: "La flecha con llaves no devuelve la comparación: el callback retorna undefined, que es falsy, y `filter` descarta todo. Falta `return` o quitar las llaves. Bug silencioso total.",
    claseError: "silencioso"
  }
];

export default preguntas;

