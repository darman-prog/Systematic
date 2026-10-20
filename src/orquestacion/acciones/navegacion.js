// Acciones de navegación: dashboard, lenguaje y ajustes de datos.
export function accionesNavegacion({ dashboard, lenguaje, ajustes }) {
  return {
    ...dashboard.acciones,
    ...lenguaje.acciones,
    ...ajustes.acciones
  };
}
