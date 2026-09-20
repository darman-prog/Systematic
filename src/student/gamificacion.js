// Servicio de gamificación (spec 006): XP, eventos únicos, logros, racha y perfil.
// La lógica pura vive en core/gamificacion.js; este servicio orquesta persistencia y
// notificaciones. Presentación (toast/confeti/perfil) entra por callbacks inyectados.
import { progresoDeNivel, evaluarLogros, XP_EVENTOS } from "../core/gamificacion.js";
import { calcularRacha } from "../core/progreso.js";
import { sumarEstrellas } from "./registros.js";

export function crearGamificacion({ persistencia, materias, alSubirNivel, alLogro, alCambiarPerfil }) {
  const avisarNivel = alSubirNivel || (() => {});
  const avisarLogro = alLogro || (() => {});
  const actualizarPerfil = alCambiarPerfil || (() => {});

  function xpActual() {
    return persistencia.xp();
  }

  function sumarXp(cantidad) {
    if (!cantidad) return;
    const antes = progresoDeNivel(xpActual());
    const nuevo = xpActual() + cantidad;
    persistencia.guardarXp(nuevo);
    const despues = progresoDeNivel(nuevo);
    if (despues.nivel > antes.nivel) avisarNivel(despues.nivel);
    actualizarPerfil();
  }

  // Recompensas de una sola ocurrencia (p. ej. meta diaria por fecha).
  function xpEventoUnico(clave, cantidad) {
    const eventos = persistencia.xpEventos();
    if (eventos[clave]) return;
    eventos[clave] = true;
    persistencia.guardarXpEventos(eventos);
    sumarXp(cantidad);
  }

  function statsGlobales() {
    let ok = 0;
    let total = 0;
    materias.forEach(m => {
      const p = persistencia.progreso(m.id);
      Object.keys(p).forEach(idP => {
        ok += p[idP].ok;
        total += p[idP].ok + p[idP].fail;
      });
    });
    return { respuestas: total, precision: total ? Math.round((ok / total) * 100) : 0 };
  }

  // Racha global: mezcla la actividad de todas las materias tomando el máximo por día.
  function actividadGlobal() {
    const merged = {};
    materias.forEach(m => {
      const a = persistencia.actividad(m.id);
      Object.keys(a).forEach(d => { merged[d] = Math.max(merged[d] || 0, a[d]); });
    });
    return merged;
  }

  function estrellasTotales() {
    return sumarEstrellas(materias, persistencia.misiones);
  }

  function revisarLogros(extra) {
    const actuales = persistencia.logros();
    const s = statsGlobales();
    const contexto = Object.assign(
      {
        racha: calcularRacha(actividadGlobal()),
        respuestas: s.respuestas,
        precision: s.precision,
        simulacroPerfecto: false,
        metaCumplida: false,
        misionPerfecta: false,
        estrellasTotales: 0,
        escenarioExito: false,
        casoExito: false
      },
      extra || {}
    );
    const nuevos = evaluarLogros(actuales, contexto);
    if (!nuevos.length) return [];
    nuevos.forEach(l => {
      actuales[l.id] = l.fecha;
      avisarLogro(l);
    });
    persistencia.guardarLogros(actuales);
    sumarXp(nuevos.length * XP_EVENTOS.logro);
    return nuevos;
  }

  function perfil() {
    const xp = xpActual();
    const p = progresoDeNivel(xp);
    return {
      xp,
      nivel: p.nivel,
      pct: p.pct,
      faltante: p.faltante,
      racha: calcularRacha(actividadGlobal()),
      insignias: Object.keys(persistencia.logros()).length
    };
  }

  return { xpActual, sumarXp, xpEventoUnico, statsGlobales, actividadGlobal, estrellasTotales, revisarLogros, perfil };
}
