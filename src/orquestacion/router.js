// Navegación entre pantallas del shell (ADR 009): una única función show()
// alterna la visibilidad, anima la entrada y vuelve arriba del todo.
// Recibe el buscador del DOM y la animación por parámetro; no toca estado global.
const PANTALLAS = [
  "onboarding", "materias", "start", "config", "quiz", "results", "study",
  "apuntes", "misiones", "escenarios", "escenario", "casos", "caso",
  "flashcards", "glosario", "lenguaje", "cuenta", "perfil"
];

// Ancho extendido: flashcards necesita más superficie de lectura para que el
// reverso no quede atrapado en un rectángulo pequeño con scroll interno.
const PANTALLAS_ANCHA = ["flashcards"];

export function crearRouter({ $, animar }) {
  function show(screen) {
    PANTALLAS.forEach(s =>
      $("screen-" + s).classList.toggle("hidden", s !== screen)
    );
    const app = document.querySelector(".app");
    if (app) app.classList.toggle("app-ancha", PANTALLAS_ANCHA.includes(screen));
    animar($("screen-" + screen));
    // Cada pantalla arranca desde arriba para no heredar el scroll anterior.
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return { show, pantallas: PANTALLAS };
}
