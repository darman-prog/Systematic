// Capacidades del entorno que condicionan la UI (pointer coarse = táctil).
export const diagramasDisponibles = () => !window.matchMedia("(pointer: coarse)").matches;

// En táctil se ocultan las entradas al constructor de diagramas y a los casos técnicos.
export function ocultarCasosEnTactil() {
  if (diagramasDisponibles()) return;
  document.querySelectorAll('#screen-start [data-action="startCasos"], #screen-start [data-action="practicarCasos"]')
    .forEach(el => el.classList.add("hidden"));
}
