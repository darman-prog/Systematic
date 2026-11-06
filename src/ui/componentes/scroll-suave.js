// Revelación de tarjetas al hacer scroll.
// Desplazamiento 100% nativo; solo añade la clase .is-revealed al entrar al viewport.
// Respeta prefers-reduced-motion y funciona con contenido renderizado dinámicamente.

/**
 * Observa los elementos .scroll-reveal que aún no se han revelado.
 * Se puede volver a llamar tras re-renderizar listas: ignora los ya revelados.
 * @param {HTMLElement | Document} [raiz=document]
 * @returns {IntersectionObserver | null} null si no hay nada que observar o no hace falta animar.
 */
export function observarScrollReveal(raiz = typeof document !== "undefined" ? document : null) {
  if (!raiz?.querySelectorAll) return null;

  const elementos = [...raiz.querySelectorAll(".scroll-reveal:not(.is-revealed)")];
  if (!elementos.length) return null;

  const sinAnimacion =
    typeof window === "undefined" ||
    !("IntersectionObserver" in window) ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Sin soporte o con movimiento reducido: todo visible de inmediato.
  if (sinAnimacion) {
    elementos.forEach((el) => el.classList.add("is-revealed"));
    return null;
  }

  const observador = new IntersectionObserver(
    (entradas, obs) => {
      let i = 0; // índice del lote, para el stagger
      for (const entrada of entradas) {
        // También revela lo que ya quedó por encima (scroll restaurado, anclas).
        if (entrada.isIntersecting || (entrada.boundingClientRect && entrada.boundingClientRect.top < 0)) {
          const el = /** @type {HTMLElement} */ (entrada.target);
          el.style.setProperty("--i", String(Math.min(i++, 6)));
          el.classList.add("is-revealed");
          (obs || observador)?.unobserve(el);
        }
      }
    },
    { rootMargin: "0px 0px -20px 0px", threshold: 0.08 }
  );

  elementos.forEach((el) => observador.observe(el));
  return observador;
}