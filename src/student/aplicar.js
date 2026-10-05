// Aplica un snapshot de nube ya validado al estado local (ADR 008). Es la única pieza que
// pisa TODAS las claves sys.* con un respaldo remoto; después de aplicarla, app.js recarga
// la página (el estado en memoria —progreso, perfil, track— está repartido entre módulos).
//
// Contrato de `datos`: el snapshot `nube-1` que devuelve `nube.bajar()` (ya pasó por
// validarSnapshot en core/nube/snapshot.js). No la llames con datos crudos de la red.
// Paso a paso y errores comunes: docs/guias/aplicar-snapshots.md.
export function aplicarSnapshot(datos, persistencia) {
  // Globales.
  persistencia.guardarNombre(datos.nombre);
  persistencia.guardarXp(datos.global.xp);
  persistencia.guardarXpEventos(datos.global.xpEventos);
  persistencia.guardarLogros(datos.global.logros);
  persistencia.guardarEscenarios(datos.global.escenarios);
  persistencia.guardarCasos(datos.global.casos);
  // El flag de onboarding no se puede deshacer (guardarOnboardingHecho siempre escribe true):
  // solo se toca si el respaldo lo trae encendido.
  if (datos.global.onboarding) persistencia.guardarOnboardingHecho();

  // Materias: los cinco bloques por id. Los métodos de persistencia ya normalizan
  // (historial a 15 entradas, meta positiva), así que acá se escriben tal cual.
  const materias = Object.entries(datos.materias);
  for (const [id, m] of materias) {
    persistencia.guardarProgreso(id, m.progreso);
    persistencia.guardarHistorial(id, m.historial);
    persistencia.guardarActividad(id, m.actividad);
    persistencia.guardarMeta(id, m.meta);
    persistencia.guardarMisiones(id, m.misiones);
  }

  // Lenguajes: competencia por id.
  const lenguajes = Object.entries(datos.lenguajes);
  for (const [id, l] of lenguajes) {
    persistencia.guardarCompetencia(id, l.competencia);
  }

  return { materias: materias.length, lenguajes: lenguajes.length };
}
