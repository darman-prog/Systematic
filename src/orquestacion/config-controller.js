// Puente entre los filtros de la config y el track (ADR 009): el estado y la lógica
// viven en student/track.js; acá solo queda el puente con el DOM (checkboxes) y el
// re-render después de cada cambio. Recibe todo por parámetro, sin estado propio.
export function crearConfigController({ $, track, alCambiarFiltro }) {
  function leerOpciones() {
    track.setOpciones({
      soloDebiles: $("cfg-solo-debiles").checked,
      soloMarcadas: $("cfg-solo-marcadas").checked,
      priorizar: $("cfg-priorizar").checked
    });
  }

  function preguntasFiltradas() {
    leerOpciones();
    return track.preguntasFiltradas();
  }

  function toggleFiltro(clave, valor) {
    track.toggleFiltro(clave, valor);
    alCambiarFiltro();
  }

  function toggleFiltroTodos(clave, activar) {
    track.toggleFiltroTodos(clave, activar);
    alCambiarFiltro();
  }

  return { leerOpciones, preguntasFiltradas, toggleFiltro, toggleFiltroTodos };
}
