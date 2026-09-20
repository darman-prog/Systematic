// Acceso único a localStorage (spec 006): claves centralizadas y CRUD por materia/global.
// Recibe `storage` por parámetro (igual que src/core/progreso.js) para poder testear sin DOM.
import { claves, migrarClavesLegacy, leerJSON, escribirJSON, metaDiaria } from "../core/progreso.js";

// Claves globales (no dependen de la materia activa).
export const CLAVES_GLOBALES = {
  xp: "sys.xp",
  xpEventos: "sys.xp-eventos",
  logros: "sys.logros",
  escenarios: "sys.escenarios",
  casos: "sys.casos-diagrama"
};

export const claveMisiones = materiaId => "sys.misiones." + materiaId;

export function crearPersistencia(storage) {
  const leer = (clave, porDefecto) => leerJSON(storage, clave, porDefecto);
  const escribir = (clave, valor) => escribirJSON(storage, clave, valor);
  const borrar = clave => {
    try { storage.removeItem(clave); } catch (e) { /* sin persistencia */ }
  };

  return {
    // ---- Por materia ----
    clavesMateria: claves,
    migrarLegacy: materiaId => migrarClavesLegacy(storage, materiaId),
    progreso: materiaId => leer(claves(materiaId).progreso, {}),
    guardarProgreso: (materiaId, valor) => escribir(claves(materiaId).progreso, valor),
    historial: materiaId => leer(claves(materiaId).historial, []),
    guardarHistorial: (materiaId, valor) => escribir(claves(materiaId).historial, valor.slice(0, 15)),
    actividad: materiaId => leer(claves(materiaId).actividad, {}),
    guardarActividad: (materiaId, valor) => escribir(claves(materiaId).actividad, valor),
    meta: (materiaId, porDefecto = 20) => metaDiaria(leer(claves(materiaId).meta, porDefecto)),
    guardarMeta: (materiaId, valor) => escribir(claves(materiaId).meta, metaDiaria(valor)),
    borrarProgresoYActividad: materiaId => {
      borrar(claves(materiaId).progreso);
      borrar(claves(materiaId).actividad);
    },
    borrarHistorial: materiaId => borrar(claves(materiaId).historial),
    // Reset por materia: borra progreso, racha, historial de intentos y misiones.
    // Conserva la meta (preferencia) y todo lo global (XP, logros, casos, escenarios).
    reiniciarMateria: materiaId => {
      borrar(claves(materiaId).progreso);
      borrar(claves(materiaId).actividad);
      borrar(claves(materiaId).historial);
      borrar(claveMisiones(materiaId));
    },

    // ---- Globales ----
    xp: () => leer(CLAVES_GLOBALES.xp, 0),
    guardarXp: valor => escribir(CLAVES_GLOBALES.xp, valor),
    xpEventos: () => leer(CLAVES_GLOBALES.xpEventos, {}),
    guardarXpEventos: valor => escribir(CLAVES_GLOBALES.xpEventos, valor),
    logros: () => leer(CLAVES_GLOBALES.logros, {}),
    guardarLogros: valor => escribir(CLAVES_GLOBALES.logros, valor),
    misiones: materiaId => leer(claveMisiones(materiaId), {}),
    guardarMisiones: (materiaId, valor) => escribir(claveMisiones(materiaId), valor),
    escenarios: () => leer(CLAVES_GLOBALES.escenarios, {}),
    guardarEscenarios: valor => escribir(CLAVES_GLOBALES.escenarios, valor),
    casos: () => leer(CLAVES_GLOBALES.casos, {}),
    guardarCasos: valor => escribir(CLAVES_GLOBALES.casos, valor)
  };
}
