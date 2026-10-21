// Controlador de acceso y perfil: cuenta, onboarding, restauración de respaldo y decisión
// de pantalla inicial. La UI de autenticación y el panel de cuenta reciben estado explícito.
import { crearAuth } from "../ui/cuenta/autenticacion.js";

export function decidirInicio({ disponible, usuario, onboardingHecho, nombre }) {
  if (!disponible) return !nombre && !onboardingHecho ? "onboarding" : "materias";
  if (usuario) return "entrar";
  if (onboardingHecho || nombre) return "materias";
  return "login";
}

export function crearAcceso({
  $, persistencia, home, show, cuenta, cuentaUI, perfilUI, nube, gamificacion,
  fechaSnapshot, aplicarSnapshot, sesiones, clearTimer,
  crearAuthUI = crearAuth,
  recargar = () => location.reload()
}) {
  let cache = { disponible: false, email: null };

  function datosPerfil() {
    const usuario = cuenta.estado();
    // `cache.email` cubre el cambio de sesión antes de que el servicio vuelva a consultar.
    const email = usuario?.email ?? usuario?.correo ?? cache.email ?? null;
    const cuentaEstado = !cache.disponible ? "no-disponible" : (email ? "sesion" : "invitado");
    return { nombre: persistencia.nombre(), email, cuentaEstado, perfil: gamificacion.perfil() };
  }

  function repintarPerfil() {
    if (!$("screen-perfil")?.classList.contains("hidden")) perfilUI.render(datosPerfil());
  }

  function alCambiarSesion(usuario) {
    cuentaUI.pintar(usuario);
    cache.email = usuario?.email ?? usuario?.correo ?? null;
    repintarPerfil();
  }

  function limpiarCachePerfil() {
    cache.email = null;
  }

  // Onboarding local (primera impresión sin cuenta): pide el nombre una sola vez.
  function mostrarOnboardingLocal() {
    show("onboarding");
    const entrada = $("onboarding-nombre");
    if (entrada) entrada.focus();
  }

  function mostrarMaterias() {
    home.renderMaterias();
    show("materias");
  }

  // Ofrece traer el respaldo cuando el navegador todavía no tiene estado local. Devuelve true
  // si restauró (la página se recarga y el arranque termina ahí).
  async function ofrecerRestauracion(usuario) {
    if (!usuario || persistencia.nombre() || persistencia.onboardingHecho()) return false;
    const r = await nube.bajar(usuario.uid);
    if (!r.ok) return false; // sin respaldo (o sin conexión): se entra en modo local
    const fecha = fechaSnapshot(r.datos);
    const cuando = fecha ? fecha.toLocaleString() : "una fecha desconocida";
    if (!window.confirm("Encontramos un respaldo del " + cuando + ". ¿Restaurar tu progreso en este dispositivo?")) return false;
    aplicarSnapshot(r.datos, persistencia);
    recargar();
    return true;
  }

  // Entrada común tras iniciar sesión o registrarse: pinta el panel, ofrece restaurar si hay
  // respaldo y entra al home. La cuenta ya da identidad: no se repite el onboarding por nombre.
  async function entrarConCuenta(usuario) {
    cuentaUI.pintar(usuario);
    if (await ofrecerRestauracion(usuario)) return;
    if (!persistencia.onboardingHecho()) persistencia.guardarOnboardingHecho();
    mostrarMaterias();
  }

  async function irPerfil() {
    clearTimer();
    sesiones.limpiar();
    const disponible = await cuenta.disponible();
    const usuario = cuenta.estado();
    // Se cachea para repintar en sync tras cambiar el nombre sin re-preguntar a Firebase.
    cache = { disponible, email: usuario?.email ?? usuario?.correo ?? null };
    perfilUI.render(datosPerfil());
    document.title = "Tu perfil — Systematic";
    show("perfil");
    // El foco va al título (igual que auth-titulo): orienta al lector sin abrir teclados.
    $("perfil-titulo")?.focus({ preventScroll: true });
  }

  // Códigos de Firebase Auth que la UI de acceso sabe ubicar bajo un campo.
  const campoDeCodigo = codigo => codigo === "auth/invalid-email" ? "correo"
    : codigo === "auth/weak-password" ? "contrasena" : undefined;
  // Cerrar la ventana de Google no es un error que deba mostrarse.
  const esCancelado = codigo => codigo === "auth/popup-closed-by-user" || codigo === "auth/cancelled-popup-request";

  // Adapta los resultados de los servicios al contrato de crearAuth: los errores se lanzan
  // como { mensaje, campo? } (o { cancelado: true }) y el éxito entra a la app.
  async function pedirCuenta(ejecutar, alExito) {
    const r = await ejecutar();
    if (!r.ok) {
      if (esCancelado(r.codigo)) throw { cancelado: true };
      throw { mensaje: r.mensaje, campo: campoDeCodigo(r.codigo) };
    }
    if (alExito) await alExito(r);
    return r;
  }

  const auth = crearAuthUI({
    alIniciarSesion: datos => pedirCuenta(
      () => cuenta.ingresar(datos.correo, datos.contrasena),
      r => entrarConCuenta(r.usuario)
    ),
    alRegistrarse: datos => pedirCuenta(
      async () => {
        const r = await cuenta.registrar(datos.correo, datos.contrasena);
        // El nombre es identidad local (saludo/perfil): se guarda al crear la cuenta.
        if (r.ok && datos.nombre) persistencia.guardarNombre(datos.nombre);
        return r;
      },
      r => entrarConCuenta(r.usuario)
    ),
    alRecuperar: datos => pedirCuenta(() => cuenta.enviarReset(datos.correo)),
    alGoogle: () => pedirCuenta(
      () => cuenta.ingresarConGoogle(),
      // Con redirect la página navega y no hay usuario todavía: la sesión llega al recargar.
      r => { if (!r.navegando) entrarConCuenta(r.usuario); }
    ),
    // Puerta de invitado: quien no quiere cuenta sigue con el flujo local de siempre.
    alContinuarSinCuenta: () => {
      if (!persistencia.nombre() && !persistencia.onboardingHecho()) mostrarOnboardingLocal();
      else mostrarMaterias();
    }
  });

  // Decide la pantalla inicial: onboarding local, materias, cuenta con sesión o login.
  async function iniciar() {
    const disponible = await cuenta.disponible();
    cache.disponible = disponible;
    let usuario = null;
    if (disponible) {
      await cuenta.iniciar();
      usuario = cuenta.estado();
    }
    const decision = decidirInicio({
      disponible, usuario,
      onboardingHecho: persistencia.onboardingHecho(),
      nombre: persistencia.nombre()
    });
    if (decision === "onboarding") return mostrarOnboardingLocal();
    if (decision === "materias") return mostrarMaterias();
    if (decision === "entrar") return entrarConCuenta(usuario);
    cuentaUI.pintar(null);
    auth.renderLogin();
    show("cuenta");
  }

  return {
    datosPerfil,
    repintarPerfil,
    alCambiarSesion,
    limpiarCachePerfil,
    mostrarOnboardingLocal,
    mostrarMaterias,
    ofrecerRestauracion,
    entrarConCuenta,
    irPerfil,
    auth,
    iniciar,
    acciones: { irPerfil: () => irPerfil() }
  };
}
