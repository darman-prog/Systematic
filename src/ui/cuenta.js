// Módulo UI de la pantalla de cuenta (ADR 008). Recibe estado por parámetro y no toca
// localStorage ni la nube: las acciones viven en el mapa ACCIONES de app.js, como el resto
// de los módulos de ui/ (ADR 007).
//
// Markup servido en index.html#screen-cuenta; estos son los ids que maneja:
//   #cuenta-anon         → panel sin sesión (adentro vive #auth-root, lo pinta autenticacion.js)
//   #cuenta-sesion       → panel con sesión (subir, restaurar, cerrar sesión)
//   #cuenta-email-actual → correo del usuario logueado
//   #cuenta-aviso        → role="status" para éxito/error/procesando
export function crearCuentaUI({ ctx }) {
  const $ = id => document.getElementById(id);
  const PANELES = ["cuenta-anon", "cuenta-sesion"];

  // Panel que está bloqueado por una acción en curso (null si no hay ninguna).
  let panelOcupado = null;

  function panelVisible() {
    return PANELES.map($).find(p => p && !p.classList.contains("hidden")) || null;
  }

  // Escribe el aviso. El color sale de data-estado ("ok" | "error" | "procesando"),
  // así que el CSS decide los colores y este módulo no toca estilos.
  function escribirAviso(mensaje, estado) {
    const el = $("cuenta-aviso");
    if (!el) return;
    el.textContent = mensaje || "";
    el.classList.toggle("hidden", !mensaje);
    if (mensaje) el.dataset.estado = estado;
    else delete el.dataset.estado;
  }

  // Alterna los paneles según haya sesión, muestra el correo y limpia el aviso.
  // `usuario` es el usuario de la sesión (con `email`) o null/undefined si no hay sesión.
  function pintar(usuario) {
    // Si cambia el estado a mitad de una acción (p. ej. el listener de sesión dispara
    // mientras se procesa), el bloqueo se traslada al panel que quede visible.
    const ocupado = !!panelOcupado;
    if (ocupado) procesando(false);

    const conSesion = !!usuario;
    $("cuenta-anon")?.classList.toggle("hidden", conSesion);
    $("cuenta-sesion")?.classList.toggle("hidden", !conSesion);

    const correo = $("cuenta-email-actual");
    if (correo) correo.textContent = usuario?.email ?? usuario?.correo ?? "";

    if (ocupado) procesando(true);
    else escribirAviso("");
  }

  // Muestra un mensaje de éxito (ok = true) o de error (ok = false). Vacío = ocultar.
  function aviso(mensaje, ok = true) {
    escribirAviso(mensaje, ok ? "ok" : "error");
  }

  // Deshabilita los botones del panel visible y muestra "Procesando…" mientras `activo`.
  // Al terminar restaura cada botón a como estaba (uno que ya venía deshabilitado sigue así).
  function procesando(activo) {
    if (activo) {
      if (panelOcupado) return;
      const panel = panelVisible();
      if (!panel) return;
      panelOcupado = panel;
      panel.setAttribute("aria-busy", "true");
      panel.querySelectorAll("button").forEach(b => {
        b.dataset.previoDeshabilitado = b.disabled ? "1" : "";
        b.disabled = true;
      });
      escribirAviso("Procesando…", "procesando");
      return;
    }

    if (!panelOcupado) return;
    panelOcupado.removeAttribute("aria-busy");
    panelOcupado.querySelectorAll("button").forEach(b => {
      b.disabled = b.dataset.previoDeshabilitado === "1";
      delete b.dataset.previoDeshabilitado;
    });
    panelOcupado = null;

    // Solo se limpia "Procesando…"; un éxito o error escrito antes se conserva.
    if ($("cuenta-aviso")?.dataset.estado === "procesando") escribirAviso("");
  }

  return { pintar, aviso, procesando };
}
