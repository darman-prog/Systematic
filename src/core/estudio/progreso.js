// Reglas de progreso del estudiante (Leitner): entradas, aciertos, debilidad, vencimiento
// y racha. El acceso al almacenamiento y las claves persistidas viven en student/almacenamiento.js.

export const INTERVALOS_DIAS = [0, 1, 3, 7, 16];
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
  // Si la entrada ya tiene fecha SM-2 explícita (`proximo`), se evalúa directamente contra ella.
  if (typeof p.proximo === "number" && Number.isFinite(p.proximo)) {
    return ahora >= p.proximo;
  }
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
