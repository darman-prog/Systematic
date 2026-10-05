// Servicio de sincronización (ADR 008): sube el snapshot completo del estado local a la nube
// del usuario y lo baja ya validado. La red vive en el adaptador inyectado; acá solo se decide
// qué se manda y se valida lo que llega. Sin config de nube queda inactivo.
import { construirSnapshot, validarSnapshot } from "../core/index.js";

export function crearNube({ cargarNube, persistencia, materias, lenguajes, ahora = () => new Date() }) {
  let adaptador = null;

  // Misma carga perezosa que cuenta.js; false = nube deshabilitada o SDK inaccesible.
  async function nube() {
    if (adaptador === null) {
      try {
        adaptador = (await cargarNube()) || false;
      } catch (e) {
        adaptador = false;
      }
    }
    return adaptador || null;
  }

  async function disponible() {
    return !!(await nube());
  }

  // Sube el estado local completo del usuario. Devuelve la fecha del snapshot para la UI.
  async function subir(uid) {
    const api = await nube();
    if (!api) return { ok: false, mensaje: "La cuenta no está configurada." };
    if (!uid) return { ok: false, mensaje: "Iniciá sesión para subir tus datos." };
    try {
      const snapshot = construirSnapshot({ persistencia, materias, lenguajes, ahora: ahora() });
      await api.store.escribir(uid, snapshot);
      return { ok: true, exportado: snapshot.exportado };
    } catch (e) {
      return { ok: false, mensaje: "No se pudo subir el progreso. Revisá tu conexión." };
    }
  }

  // Baja el respaldo del usuario y lo valida antes de devolverlo: la capa que aplique decide
  // cómo pisar el estado local (flujo con confirmación, ADR 008).
  async function bajar(uid) {
    const api = await nube();
    if (!api) return { ok: false, mensaje: "La cuenta no está configurada." };
    if (!uid) return { ok: false, mensaje: "Iniciá sesión para restaurar tus datos." };
    try {
      const datos = await api.store.leer(uid);
      if (!datos) return { ok: false, vacio: true, mensaje: "Todavía no hay un respaldo en la nube." };
      const valido = validarSnapshot(datos);
      if (!valido.ok) return { ok: false, mensaje: "El respaldo tiene un formato que no reconocemos." };
      return { ok: true, datos: valido.datos };
    } catch (e) {
      return { ok: false, mensaje: "No se pudo bajar el respaldo. Revisá tu conexión." };
    }
  }

  return { disponible, subir, bajar };
}
