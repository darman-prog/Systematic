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
// El dashboard necesita una grilla de 4 columnas; el resto mantiene el ancho de lectura.
const PANTALLAS_DASHBOARD = ["materias"];

export function crearRouter({ $, animar }) {
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
    animar($("screen-" + screen));
    // Cada pantalla arranca desde arriba para no heredar el scroll anterior.
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return { show, pantallas: PANTALLAS };
}
