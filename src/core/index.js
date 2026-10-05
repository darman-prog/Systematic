// Punto de entrada del dominio (capa core): re-exporta la API publica de cada subdominio.
// Los consumidores (app, student, ui, scripts) importan de aqui, no de las rutas internas,
// asi un reordenamiento futuro no vuelve a tocar a quien consume.
export * from "./registro/materias.js";
export * from "./estudio/progreso.js";
export * from "./estudio/sesiones.js";
export * from "./estudio/sesion.js";
export * from "./estudio/mezclador.js";
export * from "./estudio/questionSelector.js";
export * from "./juego/gamificacion.js";
export * from "./juego/escenarios.js";
export * from "./lenguaje/competencia.js";
export * from "./nube/snapshot.js";
export * from "./diagramas/diagramas.js";
