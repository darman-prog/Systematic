// Diálogo propio Noche calma: reemplaza al confirm() nativo para no romper
// la calma con una ventana del navegador. Devuelve true si confirma.
// Recibe el buscador del DOM por parámetro y no toca estado global (ADR 009).
export function crearConfirm({ $ }) {
  let resolver = null;
  let trigger = null;

  const overlay = () => $("confirm-overlay");

  function pedirConfirmacion({ titulo, mensaje, textoConfirmar }) {
    const el = overlay();
    if (!el) return Promise.resolve(window.confirm(titulo + " " + mensaje));
    $("confirm-titulo").textContent = titulo || "¿Continuar?";
    $("confirm-mensaje").textContent = mensaje || "Esta acción no se puede deshacer.";
    const btnOk = el.querySelector('[data-action="confirmarConfirm"]');
    if (btnOk) btnOk.textContent = textoConfirmar || "Confirmar";
    // Se guarda quién abrió el diálogo para devolverle el foco al cerrar.
    trigger = document.activeElement;
    el.classList.remove("hidden");
    const btnVolver = el.querySelector('[data-action="cancelarConfirm"]');
    if (btnVolver) btnVolver.focus();
    return new Promise(resolve => { resolver = resolve; });
  }

  // Cierra el diálogo y resuelve la promesa pendiente (false al cancelar).
  function cerrarConfirm(valor) {
    const el = overlay();
    if (el) el.classList.add("hidden");
    if (resolver) {
      resolver(valor);
      resolver = null;
    }
    // El foco vuelve a quien abrió el diálogo para no perder el hilo con teclado.
    if (trigger && trigger.focus) trigger.focus();
    trigger = null;
  }

  // El diálogo cicla el Tab y se cancela con Escape, igual que la pausa.
  function instalarTrampa() {
    const el = overlay();
    if (!el) return;
    el.addEventListener("keydown", e => {
      if (el.classList.contains("hidden")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        cerrarConfirm(false);
        return;
      }
      if (e.key !== "Tab") return;
      const botones = Array.from(el.querySelectorAll("button"));
      if (!botones.length) return;
      const idx = botones.indexOf(document.activeElement);
      if (e.shiftKey && idx <= 0) {
        e.preventDefault();
        botones[botones.length - 1].focus();
      } else if (!e.shiftKey && idx === botones.length - 1) {
        e.preventDefault();
        botones[0].focus();
      }
    });
  }

  return { pedirConfirmacion, cerrarConfirm, instalarTrampa };
}
