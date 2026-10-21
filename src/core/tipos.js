// Contratos de datos compartidos (JSDoc). No hay código en runtime: `checkJs` usa estos
// typedefs para verificar las fronteras entre core, student, orquestación y UI.
/**
 * @typedef {Object} Pregunta
 * @property {string} id
 * @property {"multiple"|"multi"|"vf"|"codigo"|"dragdrop"|"ordenar"|"desarrollo"|"relacionar"|"diagrama"} tipo
 * @property {string} q
 * @property {string} [tema]
 * @property {string} [parcial]
 * @property {"facil"|"media"|"dificil"} [dificultad]
 * @property {string[]} [options]
 * @property {number} [correct]
 * @property {number[]} [correctos]
 * @property {string[]} [respuestas]
 * @property {string[]} [bloques]
 * @property {string[][]} [pares]
 * @property {string} [solucion]
 * @property {boolean} [caso]
 * @property {Object} [diagrama]
 */

/**
 * @typedef {Object} Track
 * @property {string} id
 * @property {string} nombre
 * @property {"materia"|"lenguaje"} tipo
 * @property {string} [icono]
 * @property {string} [descripcion]
 * @property {string} [color]
 * @property {Object} conteo
 * @property {Object} [roadmap]
 * @property {Object} [topicColors]
 * @property {string[]} [sqlKeywords]
 */

/**
 * @typedef {Object} EntradaProgreso
 * @property {number} ok
 * @property {number} fail
 * @property {number} box
 * @property {number|null} last
 * @property {boolean|null} lastOk
 * @property {boolean} marked
 */

/**
 * @typedef {Object} ResultadoEvaluacion
 * @property {boolean} ok
 * @property {string} selected
 * @property {string} expected
 * @property {boolean[]} [detalle]
 */

/**
 * @typedef {Object} ContextoUI
 * @property {Object|null} session
 * @property {Pregunta[]} banco
 * @property {Object} glosario
 * @property {Track|null} materia
 */

/**
 * @typedef {Object} MapaAcciones
 * @property {Record<string, (el: HTMLElement) => void>} acciones
 */

/**
 * @typedef {Object} HistorialIntento
 * @property {number} date
 * @property {number} score
 * @property {number} total
 * @property {string} modo
 */

export {};
