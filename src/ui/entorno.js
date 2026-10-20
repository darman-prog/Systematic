// Capacidades del entorno que condicionan la UI (pointer coarse = táctil).
export const diagramasDisponibles = () => !window.matchMedia("(pointer: coarse)").matches;
