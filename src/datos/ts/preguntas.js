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
  }
];

export default preguntas;

