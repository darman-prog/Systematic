// Navegación entre pantallas del shell (ADR 009): una única función show()
// alterna la visibilidad, anima la entrada y vuelve arriba del todo.
// Recibe el buscador del DOM y la animación por parámetro; no toca estado global.
const PANTALLAS = [
  "onboarding", "materias", "start", "config", "quiz", "results", "study",
  "apuntes", "misiones", "escenarios", "escenario", "casos", "caso",
  "flashcards", "glosario", "lenguaje", "cuenta", "perfil"
];

export function crearRouter({ $, animar }) {
  function show(screen) {
    PANTALLAS.forEach(s =>
      $("screen-" + s).classList.toggle("hidden", s !== screen)
    );
    animar($("screen-" + screen));
    // Cada pantalla arranca desde arriba para no heredar el scroll anterior.
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return { show, pantallas: PANTALLAS };
}
