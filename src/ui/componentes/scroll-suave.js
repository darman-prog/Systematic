// Módulo de revelación animada de tarjetas al hacer scroll (Opción B: Scroll Reveal).
// No altera la velocidad ni la inercia nativa del ratón (desplazamiento 100% nativo y ágil).
// Utiliza IntersectionObserver y CSS Scroll-Driven Animations nativas.
// Respeta estrictamente prefers-reduced-motion (WCAG 2.2 AA).

/**
 * Observa elementos marcados con .scroll-reveal para aplicar su animación al entrar al viewport.
 * @param {HTMLElement | Document} [raiz=document]
 * @returns {IntersectionObserver | null}
 */
export function observarScrollReveal(raiz = (typeof document !== "undefined" ? document : null)) {
  if (!raiz) return null;

  const elementos = raiz.querySelectorAll ? [...raiz.querySelectorAll(".scroll-reveal")] : [];
  if (!elementos.length) return null;

  // En entornos de testing o navegadores antiguos sin IntersectionObserver, revelamos de inmediato.
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    elementos.forEach(el => el.classList.add("is-revealed"));
    return null;
  }

  // Respeta la preferencia de movimiento reducido sin animaciones.
  const prefiereReducido = typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  if (prefiereReducido) {
    elementos.forEach(el => el.classList.add("is-revealed"));
    return null;
  }

  // Observador con margen inferior para activar la entrada fluida sin retardo en el scroll.
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("is-revealed");
        // Desconecta el elemento observado una vez revelado para evitar recálculos continuos.
        observador.unobserve(entrada.target);
      }
    });
  }, {
    rootMargin: "0px 0px -20px 0px",
    threshold: 0.08
  });

  elementos.forEach(el => observador.observe(el));
  return observador;
}
