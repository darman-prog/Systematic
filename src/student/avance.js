// Avance del estudiante para el track activo: progreso Leitner, actividad diaria, meta,
// historial de intentos y marcas de repaso. Sin DOM ni gamificación: recibe persistencia y
// un getter del id activo; app.js decide cuándo recargar al cambiar de materia o lenguaje.
import { aplicarRespuesta, obtenerEntrada, hoyISO } from "../core/index.js";

export function crearAvance({ persistencia, getTrackId, ahora = () => Date.now(), metaPorDefecto = 20 }) {
  let progreso = {};

  // `getTrackId` se evalúa en cada operación: el track activo cambia sin recrear el servicio.
  const trackId = () => {
    const id = typeof getTrackId === "function" ? getTrackId() : getTrackId;
    return id || null;
  };

  // Carga el progreso del track activo. Se llama después de seleccionar materia/lenguaje.
  function cargar() {
    const id = trackId();
    progreso = id ? persistencia.progreso(id) : {};
    return progreso;
  }

  function guardar() {
    const id = trackId();
    if (id) persistencia.guardarProgreso(id, progreso);
  }

  function obtenerP(id) {
    return obtenerEntrada(progreso, id);
  }

  // Registra una respuesta en el progreso Leitner y suma la actividad del día.
  function registrar(id, ok) {
    progreso[id] = aplicarRespuesta(obtenerP(id), ok, ahora());
    guardar();
    registrarActividad();
    return progreso[id];
  }

  function toggleMarked(id) {
    const marcada = !obtenerP(id).marked;
    progreso[id] = Object.assign({}, obtenerP(id), { marked: marcada });
    guardar();
    return marcada;
  }

  function actividad() {
    const id = trackId();
    return id ? persistencia.actividad(id) : {};
  }

  function registrarActividad() {
    const id = trackId();
    if (!id) return;
    const a = persistencia.actividad(id);
    const h = hoyISO();
    a[h] = (a[h] || 0) + 1;
    persistencia.guardarActividad(id, a);
  }

  function meta() {
    const id = trackId();
    return id ? persistencia.meta(id, metaPorDefecto) : metaPorDefecto;
  }

  function cambiarMeta(valor) {
    const id = trackId();
    if (id) persistencia.guardarMeta(id, valor);
  }

  function historial() {
    const id = trackId();
    return id ? persistencia.historial(id) : [];
  }

  // Guarda un intento al cerrar la ronda; persistencia recorta el historial a 15.
  function guardarIntento(score, total, modo) {
    const id = trackId();
    if (!id) return;
    const h = persistencia.historial(id);
    h.unshift({ date: ahora(), score, total, modo: modo || "practica" });
    persistencia.guardarHistorial(id, h);
  }

  function borrarHistorial() {
    const id = trackId();
    if (id) persistencia.borrarHistorial(id);
  }

  // Reinicia el track activo: progreso, actividad, historial y misiones.
  function reiniciar() {
    const id = trackId();
    progreso = {};
    if (id) persistencia.reiniciarMateria(id);
  }

  // Reemplaza el progreso en memoria (import de archivo) y lo persiste.
  function reemplazar(nuevo) {
    progreso = nuevo && typeof nuevo === "object" && !Array.isArray(nuevo) ? nuevo : {};
    guardar();
  }

  function limpiar() {
    progreso = {};
  }

  return {
    cargar,
    guardar,
    obtenerP,
    registrar,
    toggleMarked,
    actividad,
    registrarActividad,
    meta,
    cambiarMeta,
    historial,
    guardarIntento,
    borrarHistorial,
    reiniciar,
    reemplazar,
    limpiar,
    get progreso() { return progreso; }
  };
}
