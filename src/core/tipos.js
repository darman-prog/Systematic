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
 * @property {number} [reps]
 * @property {number} [intervalo]
 * @property {number} [efactor]
 * @property {number} [proximo]
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

/**
 * @typedef {Object} Talento
 * @property {string} id
 * @property {string} nombre
 * @property {string} descripcion
 * @property {string} eje
 * @property {number} puntosRadar
 * @property {string} titulo
 * @property {string} [icono]
 * @property {string[]} misionesRequeridas
 * @property {number} [minEstrellas]
 * @property {string} [bossId]
 * @property {"escenario"|"caso"} [bossTipo]
 * @property {string} [bossNombre]
 * @property {string|null} [talentoPrevioId]
 */

/**
 * @typedef {Object} RamaTalentos
 * @property {string} id
 * @property {string} nombre
 * @property {string} descripcion
 * @property {Talento[]} nodos
 */

/**
 * @typedef {Object} ArbolTalentos
 * @property {string[]} ejes
 * @property {RamaTalentos[]} ramas
 */

/**
 * @typedef {Object} AutopsiaOpcion
 * @property {string} incidente Consecuencia catastrófica en producción
 * @property {string} trampa Mentalidad o sesgo que sedujo a tomar la opción
 * @property {string} principio Regla o principio arquitectónico que la descalifica
 */

/**
 * @typedef {Object} LentesPaso
 * @property {string} [negocio] Perspectiva de dolor o impacto de negocio
 * @property {string} [calidad] Perspectiva de atributo de calidad según SEI/ISO 25010
 * @property {string} [sintoma] Perspectiva de síntoma o antipatrón técnico
 */

/**
 * @typedef {Object} OpcionEscenario
 * @property {string} texto
 * @property {string} feedback
 * @property {number} puntos
 * @property {string} siguiente
 * @property {AutopsiaOpcion} [autopsia]
 */

/**
 * @typedef {Object} PasoEscenario
 * @property {string} id
 * @property {string} narrativa
 * @property {string} [tema]
 * @property {string[]} [variantes]
 * @property {LentesPaso} [lentes]
 * @property {OpcionEscenario[]} opciones
 */

/**
 * @typedef {Object} FinalesEscenario
 * @property {string} exito
 * @property {string} parcial
 * @property {string} fracaso
 */

/**
 * @typedef {Object} Escenario
 * @property {string} id
 * @property {string} titulo
 * @property {string} tema
 * @property {string} intro
 * @property {PasoEscenario[]} pasos
 * @property {FinalesEscenario} finales
 */

export {};
