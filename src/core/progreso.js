// Progreso del estudiante en localStorage con namespace por materia.
// Todas las funciones reciben `storage` para poder testearlas sin DOM.

export const INTERVALOS_DIAS = [0, 1, 3, 7, 16];
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

// Migra una sola vez las claves de la app de una materia (quizBD2.*) al namespace sys.*.bd2.
// No borra las claves viejas: si algo sale mal, el progreso original sigue ahí.
export function migrarClavesLegacy(storage, materiaId = "bd2") {
  if (!storage) return false;
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
  } catch (e) {
    return false;
  }
}

export function leerJSON(storage, clave, porDefecto) {
  try {
    const bruto = storage.getItem(clave);
    if (bruto === null) return porDefecto;
    const valor = JSON.parse(bruto);
    return valor === null || valor === undefined ? porDefecto : valor;
  } catch (e) {
    return porDefecto;
  }
}

export function escribirJSON(storage, clave, valor) {
  try {
    storage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch (e) {
    return false;
  }
}

export function entradaVacia() {
  return { ok: 0, fail: 0, box: 1, last: null, lastOk: null, marked: false };
}

export function obtenerEntrada(progreso, id) {
  return progreso[id] || entradaVacia();
}

// Transición Leitner: acierto sube de caja (máx. 5), fallo reinicia a 1.
export function aplicarRespuesta(entrada, ok, ahora = Date.now()) {
  const p = Object.assign({}, entrada);
  if (ok) {
    p.ok += 1;
    p.box = Math.min(p.box + 1, 5);
  } else {
    p.fail += 1;
    p.box = 1;
  }
  p.last = ahora;
  p.lastOk = ok;
  return p;
}

export function esDebil(p) {
  return p.fail > 0 && (!p.lastOk || p.box <= 2);
}

export function intervaloDias(box) {
  return INTERVALOS_DIAS[Math.max(1, Math.min(box, 5)) - 1];
}

export function vencida(p, ahora = Date.now()) {
  if (!p.last) return true;
  return ahora - p.last >= intervaloDias(p.box) * 86400000;
}

export function fechaISO(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

export function hoyISO() {
  return fechaISO(new Date());
}

export function calcularRacha(actividad, desde = new Date()) {
  const d = new Date(desde.getTime());
  let racha = 0;
  if (!actividad[fechaISO(d)]) d.setDate(d.getDate() - 1);
  while (actividad[fechaISO(d)]) {
    racha += 1;
    d.setDate(d.getDate() - 1);
  }
  return racha;
}

export function metaDiaria(valor, porDefecto = 20) {
  const n = parseInt(valor, 10);
  return Number.isFinite(n) && n > 0 ? n : porDefecto;
}
