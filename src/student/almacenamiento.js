// Almacenamiento local de la app: nombres de claves sys.*, migración de las claves
// legacy (quizBD2.*) y lectura/escritura JSON tolerante a fallos. Vive en student
// porque es política de persistencia; el dominio solo conserva las reglas de progreso.
export const FLAG_MIGRACION = "sys.migracion.v1";

const LEGACY = {
  progreso: "quizBD2.progreso",
  historial: "quizBD2.historial",
  actividad: "quizBD2.actividad",
  meta: "quizBD2.meta"
};

export function claves(materiaId) {
  return {
    progreso: "sys.progreso." + materiaId,
    historial: "sys.historial." + materiaId,
    actividad: "sys.actividad." + materiaId,
    meta: "sys.meta." + materiaId
  };
}

// Migra una sola vez las claves legacy de la app anterior (quizBD2.*) al namespace sys.*
// de la materia indicada. No borra las claves viejas: si algo sale mal, el progreso
// original sigue ahí. Recibe el storage por parámetro para poder probarla sin DOM.
export function migrarClavesLegacy(storage, materiaId) {
  if (!storage || !materiaId) return false;
  try {
    if (storage.getItem(FLAG_MIGRACION)) return false;
    const destino = claves(materiaId);
    Object.keys(LEGACY).forEach(k => {
      const valor = storage.getItem(LEGACY[k]);
      if (valor !== null && storage.getItem(destino[k]) === null) {
        storage.setItem(destino[k], valor);
      }
    });
    storage.setItem(FLAG_MIGRACION, new Date().toISOString());
    return true;
  } catch {
    return false;
  }
}

export function leerJSON(storage, clave, porDefecto) {
  try {
    const bruto = storage.getItem(clave);
    if (bruto === null) return porDefecto;
    const valor = JSON.parse(bruto);
    return valor === null || valor === undefined ? porDefecto : valor;
  } catch {
    return porDefecto;
  }
}

export function escribirJSON(storage, clave, valor) {
  try {
    storage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}
