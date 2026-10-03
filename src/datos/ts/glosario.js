// Glosario del track de TypeScript (spec 011). Misma forma que el resto de glosarios.
const glosario = {
  categorias: [
    { id: "tipos", nombre: "Tipos" },
    { id: "funciones", nombre: "Funciones" },
    { id: "async", nombre: "Asincronía" },
    { id: "errores", nombre: "Errores y auditoría" }
  ],
  terminos: [
    {
      termino: "Inferencia de tipos",
      categoria: "tipos",
      definicion: "TypeScript deduce el tipo de una variable a partir de su valor inicial, sin que lo declares.",
      ejemplo: "const n = 5; // el tipo inferido es number"
    },
    {
      termino: "Unión de tipos",
      categoria: "tipos",
      definicion: "Un tipo que admite varios valores posibles, escrito con `|`.",
      ejemplo: "let id: string | number;"
    },
    {
      termino: "Narrowing",
      categoria: "tipos",
      definicion: "Estrechar una unión a un tipo concreto con comprobaciones como typeof o in.",
      ejemplo: "if (typeof x === \"string\") { x.length; }"
    },
    {
      termino: "unknown",
      categoria: "tipos",
      definicion: "Tipo seguro para valores de origen desconocido: obliga a comprobar antes de operar, a diferencia de any.",
      ejemplo: "function f(x: unknown) { if (typeof x === \"string\") x.length; }"
    },
    {
      termino: "any",
      categoria: "tipos",
      definicion: "Desactiva el chequeo de tipos para ese valor. La IA lo usa para que compile; esconde errores en vez de resolverlos.",
      ejemplo: "const dato: any = algo; dato.cualquierCosa();"
    },
    {
      termino: "Utility types",
      categoria: "tipos",
      definicion: "Tipos incorporados que derivan otros: Partial, Pick, Omit, Readonly, Record.",
      ejemplo: "type Parcial = Partial<Usuario>;"
    },
    {
      termino: "Parámetro opcional",
      categoria: "funciones",
      definicion: "Parámetro que puede no pasarse, marcado con `?` o con un valor por defecto.",
      ejemplo: "function f(a: number, b = 2) {}"
    },
    {
      termino: "Parámetro rest",
      categoria: "funciones",
      definicion: "Junta los argumentos sobrantes en un arreglo, escrito con `...`.",
      ejemplo: "function sumar(...nums: number[]) {}"
    },
    {
      termino: "map vs forEach",
      categoria: "funciones",
      definicion: "map transforma y devuelve un arreglo nuevo; forEach recorre y devuelve undefined.",
      ejemplo: "[1,2].map(n => n * 2); // [2,4]"
    },
    {
      termino: "Promise",
      categoria: "async",
      definicion: "Objeto que representa un valor que estará disponible ahora, después o nunca.",
      ejemplo: "const p = fetch(url);"
    },
    {
      termino: "async / await",
      categoria: "async",
      definicion: "Palabras que permiten escribir código asíncrono como si fuera secuencial. Toda función async devuelve una Promise.",
      ejemplo: "async function f() { const r = await fetch(url); }"
    },
    {
      termino: "await faltante",
      categoria: "async",
      definicion: "Olvidar await deja una Promise sin resolver donde se esperaba el valor; suele fallar en silencio.",
      ejemplo: "const v = datos(); // falta await"
    },
    {
      termino: "Promise.all",
      categoria: "async",
      definicion: "Espera a que todas las promesas resuelvan y devuelve sus resultados en orden; si una falla, falla todo.",
      ejemplo: "await Promise.all([p1, p2]);"
    },
    {
      termino: "Bug silencioso",
      categoria: "errores",
      definicion: "Código que compila y parece correcto pero hace algo distinto de lo esperado. Es el error típico del código generado por IA.",
      ejemplo: "suma = p; // debía ser suma += p"
    },
    {
      termino: "Cast con as",
      categoria: "errores",
      definicion: "Le dice al compilador que confíe en un tipo sin comprobarlo. No convierte el valor en runtime.",
      ejemplo: "const n = \"hola\" as unknown as number;"
    },
    {
      termino: "API inexistente",
      categoria: "errores",
      definicion: "Método o función que la IA inventa porque suena plausible y no existe en el lenguaje.",
      ejemplo: "array.remove(2); // no existe"
    }
  ],
  tips: [
    "Antes de confiar en un método, comprobá que exista en la documentación del lenguaje.",
    "Si el código de la IA usa `any`, preguntate qué tipo se estaba evitando.",
    "Un `await` de menos no da error de compilación: revisá que cada llamada asíncrona lo tenga."
  ]
};

export default glosario;
