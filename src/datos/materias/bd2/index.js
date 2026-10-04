// Agregador de datos de BD2. Centraliza las 5 piezas de contenido para que
// `cargarContenido()` las importe como un solo chunk bajo demanda (spec 012).
export { default as preguntas } from "./preguntas.js";
export { default as glosario } from "./glosario.js";
export { default as apuntes } from "./apuntes.js";
export { default as escenarios } from "./escenarios.js";
export { default as casos } from "./casos.js";
