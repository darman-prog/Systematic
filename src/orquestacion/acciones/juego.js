// Acciones de misiones, escenarios y casos. Cada controlador expone su propio mapa.
export function accionesJuego({ misiones, escenarios, casos }) {
  return {
    ...misiones.acciones,
    ...escenarios.acciones,
    ...casos.acciones
  };
}
