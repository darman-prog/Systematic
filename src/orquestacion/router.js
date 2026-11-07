// Navegación entre pantallas del shell (ADR 009): una única función show()
// alterna la visibilidad, anima la entrada y vuelve arriba del todo.
// Recibe el buscador del DOM y la animación por parámetro; no toca estado global.
const PANTALLAS = [
  "onboarding", "materias", "start", "config", "quiz", "results", "study",
  "apuntes", "misiones", "talentos", "escenarios", "escenario", "casos", "caso",
  "flashcards", "glosario", "lenguaje", "cuenta", "perfil"
];

// Ancho extendido: flashcards y talentos necesitan más superficie horizontal.
const PANTALLAS_ANCHA = ["flashcards", "talentos"];
// El dashboard y el workbench de casos de diagramación usan ancho extendido (72rem).
const PANTALLAS_DASHBOARD = ["materias", "caso"];

export function crearRouter({ $, animar, alMostrar = null }) {
  function show(screen) {
    PANTALLAS.forEach(s => {
      const nodo = $("screen-" + s);
      if (nodo) nodo.classList.toggle("hidden", s !== screen);
    });
    const app = document.querySelector(".app");
    if (app) {
      app.classList.toggle("app-ancha", PANTALLAS_ANCHA.includes(screen));
      app.classList.toggle("app-dashboard", PANTALLAS_DASHBOARD.includes(screen));
    }
    const activo = $("screen-" + screen);
    animar(activo);
    // Callback para activar observadores de scroll reveal en la pantalla activa.
    if (typeof alMostrar === "function") alMostrar(activo);
    // Cada pantalla arranca desde arriba para no heredar el scroll anterior.
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return { show, pantallas: PANTALLAS };
}
