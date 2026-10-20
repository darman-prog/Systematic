// Acciones de onboarding, perfil, cuenta y nube.
export function accionesAcceso({
  $, persistencia, home, show, toast, icono, saludoSegunHora, perfilUI, datosPerfil,
  irPerfil, cuenta, cuentaUI, auth, nube, fechaSnapshot, aplicarSnapshot,
  limpiarCachePerfil, irMaterias
}) {
  return {
    guardarNombreOnboarding: () => {
      const entrada = $("onboarding-nombre");
      const valor = entrada ? entrada.value : "";
      if (!valor.trim()) { if (entrada) entrada.focus(); return; }
      persistencia.guardarNombre(valor);
      persistencia.guardarOnboardingHecho();
      home.renderMaterias();
      show("materias");
      toast(icono("nivel", "icono-sm") + saludoSegunHora(persistencia.nombre()) + ". ¡Vamos a estudiar!");
    },
    saltarOnboarding: () => {
      persistencia.guardarOnboardingHecho();
      home.renderMaterias();
      show("materias");
    },
    toggleNombreEditor: () => {
      const editor = $("nombre-editor");
      if (!editor) return;
      const entrada = $("nombre-input");
      entrada.value = persistencia.nombre();
      editor.classList.toggle("hidden");
      if (!editor.classList.contains("hidden")) entrada.focus();
    },
    guardarNombreAjustes: () => {
      const entrada = $("nombre-input");
      if (!entrada) return;
      persistencia.guardarNombre(entrada.value);
      persistencia.guardarOnboardingHecho();
      $("nombre-editor").classList.add("hidden");
      // El Perfil muestra el mismo nombre: si está a la vista, se repinta en el acto.
      if (!$("screen-perfil")?.classList.contains("hidden")) perfilUI.render(datosPerfil());
      toast(icono("check", "icono-sm") + saludoSegunHora(persistencia.nombre()) + (persistencia.nombre() ? ", " + persistencia.nombre() : ""));
    },
    irPerfil: () => irPerfil(),
    irCuenta: () => {
      const usuario = cuenta.estado();
      cuentaUI.pintar(usuario);
      if (!usuario) auth.renderLogin();
      show("cuenta");
    },
    salirCuenta: async () => {
      cuentaUI.procesando(true);
      const r = await cuenta.salir();
      cuentaUI.procesando(false);
      if (!r.ok) { cuentaUI.aviso(r.mensaje, false); return; }
      cuentaUI.pintar(null);
      auth.renderLogin();
      // Salir solo se ofrece desde el Perfil: al cerrar sesión se vuelve a materias.
      limpiarCachePerfil();
      irMaterias();
    },
    subirNube: async () => {
      const usuario = cuenta.estado();
      if (!usuario) return;
      cuentaUI.procesando(true);
      const r = await nube.subir(usuario.uid);
      cuentaUI.procesando(false);
      cuentaUI.aviso(r.ok ? "Progreso subido a la nube." : r.mensaje, r.ok);
    },
    restaurarNube: async () => {
      const usuario = cuenta.estado();
      if (!usuario) return;
      cuentaUI.procesando(true);
      const r = await nube.bajar(usuario.uid);
      cuentaUI.procesando(false);
      if (!r.ok) { cuentaUI.aviso(r.mensaje, false); return; }
      // ADR 008: restaurar pisa el progreso local y por eso se pregunta antes, con la fecha.
      const fecha = fechaSnapshot(r.datos);
      const cuando = fecha ? fecha.toLocaleString() : "una fecha desconocida";
      if (!window.confirm("El respaldo es del " + cuando + ". Se reemplazará tu progreso en este dispositivo. ¿Continuar?")) return;
      aplicarSnapshot(r.datos, persistencia);
      location.reload();
    }
  };
}
