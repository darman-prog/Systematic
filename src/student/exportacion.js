// Export/import de un track (materia o lenguaje): construye el JSON, valida el archivo y
// aplica los datos. Sin DOM: el controlador (orquestacion/ajustes.js) maneja FileReader,
// Blob, descargas y confirmaciones.
import { hoyISO } from "../core/index.js";

export const FORMATO = "systematic";
export const VERSION = 2;

// Desde el Perfil se exporta el track activo: competencia si es lenguaje, avance si es materia.
export function construirExportacion({ track, avance, persistencia, ahora = () => new Date() }) {
  if (!track.lenguaje && (!track.materia || !track.materia.id)) return null;
  const esLenguaje = !!track.lenguaje;
  return {
    app: FORMATO,
    version: VERSION,
    exportado: ahora().toISOString(),
    nombre: persistencia.nombre(),
    ...(esLenguaje
      ? { lenguaje: track.lenguaje.id, competencia: persistencia.competencia(track.lenguaje.id) }
      : {
          materia: track.materia.id,
          progreso: avance.progreso,
          historial: avance.historial(),
          actividad: avance.actividad(),
          meta: avance.meta()
        })
  };
}

export function nombreArchivo(track, fecha = hoyISO()) {
  const id = track.lenguaje ? track.lenguaje.id : track.materia && track.materia.id;
  return "systematic-" + id + "-" + fecha + ".json";
}

// Acepta el export v2 de materia, el legacy de Quiz BD2 y el export v2 de competencia.
// Lanza Error("formato") si el archivo no tiene la forma esperada.
export function parsearImportacion(texto) {
  let datos;
  try {
    datos = JSON.parse(texto);
  } catch (e) {
    throw new Error("formato", { cause: e });
  }
  if (!datos || typeof datos !== "object" || Array.isArray(datos)) throw new Error("formato");

  const esLegacy = datos.app === "quiz-bd2" && typeof datos.progreso === "object";
  const esCompetencia = datos.app === FORMATO &&
    datos.competencia && typeof datos.competencia === "object" && !Array.isArray(datos.competencia);
  const esMateria = datos.app === FORMATO && typeof datos.progreso === "object";
  if (!esLegacy && !esMateria && !esCompetencia) throw new Error("formato");

  if (esCompetencia) {
    const valida = Object.values(datos.competencia).every(r =>
      r && typeof r === "object" && typeof r.aprobado === "boolean" && Number.isInteger(r.version));
    if (!valida) throw new Error("formato");
    return { tipo: "competencia", datos };
  }
  return { tipo: "materia", datos, legacy: esLegacy };
}

// Aplica un import de materia. El controlador ya confirmó el reemplazo y validó el track.
export function aplicarMateria({ datos, track, persistencia, avance }) {
  avance.reemplazar(datos.progreso || {});
  if (datos.historial) persistencia.guardarHistorial(track.materia.id, datos.historial);
  if (datos.actividad) persistencia.guardarActividad(track.materia.id, datos.actividad);
  if (datos.meta) persistencia.guardarMeta(track.materia.id, datos.meta);
  if (typeof datos.nombre === "string") persistencia.guardarNombre(datos.nombre);
}

// Aplica un import de competencia. El controlador ya confirmó el reemplazo.
export function aplicarCompetencia({ datos, track, persistencia }) {
  track.setCompetencia(datos.competencia);
  persistencia.guardarCompetencia(track.lenguaje.id, track.competencia);
}
