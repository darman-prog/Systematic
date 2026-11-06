// Módulo de desplazamiento suave con inercia y revelación progresiva (Opción C).
// Proporciona inercia fluida en rueda de ratón sin interferir con touchpads de precisión,
// y animación escalonada de entrada con IntersectionObserver y CSS Scroll-Driven Animations.
// Respeta estrictamente prefers-reduced-motion (WCAG 2.2 AA).

/**
 * Activa la inercia suave en la rueda del ratón para amortiguar saltos toscos.
 * @param {Window} [ventana=window]
 * @returns {() => void} Función de limpieza para desmontar listeners.
 */
export function iniciarScrollSuave(ventana = (typeof window !== "undefined" ? window : null)) {
  if (!ventana) return () => {};

  // Respeta la preferencia de reducción de movimiento del sistema operativo (WCAG 2.2 AA).
  const prefiereReducido = typeof ventana.matchMedia === "function"
    ? ventana.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  if (prefiereReducido) return () => {};

  // Activa scroll-behavior smooth nativo en el elemento raíz para enlaces y anclas.
  if (typeof document !== "undefined" && document.documentElement) {
    document.documentElement.style.scrollBehavior = "smooth";
  }

  let animando = false;
  let destinoY = ventana.scrollY || 0;
  // Factor de amortiguación (lerp): 0.1 ofrece suavidad orgánica sin sensación de lentitud o arrastre.
  const factorLerp = 0.1;

  // Bucle de animación por frames para avance suave continuo.
  function bucleRaf() {
    const actualY = ventana.scrollY || 0;
    const diff = destinoY - actualY;

    // Al llegar a menos de 0.5px de diferencia, fijamos posición exacta y liberamos el ciclo.
    if (Math.abs(diff) < 0.5) {
      ventana.scrollTo(0, destinoY);
      animando = false;
      return;
    }

    // Interpolación lineal hacia el destino calculado.
    ventana.scrollTo(0, actualY + diff * factorLerp);
    ventana.requestAnimationFrame(bucleRaf);
  }

  // Intercepta únicamente giros de rueda convencionales escalonados.
  function alRueda(e) {
    // Si el usuario mantiene pulsadas teclas modificadoras (zoom con Ctrl, scroll horizontal con Shift), no intervenimos.
    if (e.ctrlKey || e.altKey) return;

    // Identifica saltos de rueda de mouse física (delteMode por línea o deltas altos >= 35px).
    // Los touchpads de precisión emiten micropasos continuos (1-5px) que dejamos al motor nativo.
    const esRuedaEscalonada = e.deltaMode !== 0 || Math.abs(e.deltaY) >= 35;
    if (!esRuedaEscalonada) {
      destinoY = ventana.scrollY || 0;
      return;
    }

    const docEl = document.documentElement;
    const maxScroll = Math.max(0, (docEl ? docEl.scrollHeight : 0) - (ventana.innerHeight || 0));
    const nuevoDestino = Math.max(0, Math.min(maxScroll, destinoY + e.deltaY));

    // Si ya estamos en el extremo superior o inferior, permitimos el rebote elástico natural.
    if ((e.deltaY < 0 && (ventana.scrollY || 0) <= 0) || (e.deltaY > 0 && (ventana.scrollY || 0) >= maxScroll)) {
      return;
    }

    // Previene el salto brusco instantáneo del navegador para aplicar nuestra interpolación fluida.
    if (typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    destinoY = nuevoDestino;

    if (!animando && typeof ventana.requestAnimationFrame === "function") {
      animando = true;
      ventana.requestAnimationFrame(bucleRaf);
    }
  }

  // Cancela la inercia si el usuario toca la pantalla, arrastra la barra o usa teclas directas.
  function cancelarInercia() {
    destinoY = ventana.scrollY || 0;
    animando = false;
  }

  ventana.addEventListener("wheel", alRueda, { passive: false });
  ventana.addEventListener("touchstart", cancelarInercia, { passive: true });
  ventana.addEventListener("keydown", (e) => {
    if (["Space", "PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown"].includes(e.code)) {
      cancelarInercia();
    }
  });

  return () => {
    ventana.removeEventListener("wheel", alRueda);
    ventana.removeEventListener("touchstart", cancelarInercia);
  };
}

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

  // Observador con margen inferior para que el elemento inicie la revelación justo al asomarse.
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("is-revealed");
        // Desconecta el elemento observado una vez revelado para evitar recálculos continuos.
        observador.unobserve(entrada.target);
      }
    });
  }, {
    rootMargin: "0px 0px -40px 0px",
    threshold: 0.1
  });

  elementos.forEach(el => observador.observe(el));
  return observador;
}
