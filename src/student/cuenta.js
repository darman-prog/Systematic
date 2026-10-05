// Servicio de cuenta (ADR 008): registro, ingreso (email/contraseña y Google), salida y
// observación de sesión. No conoce Firebase: recibe `cargarNube` inyectado y devuelve
// resultados con mensajes en español listos para la UI. Sin config de nube queda inactivo.

// Traducción de códigos de Firebase Auth a mensajes de UI. Los códigos que revelarían si un
// correo existe comparten mensaje (evita enumeración de cuentas).
const MENSAJES = {
  "auth/email-already-in-use": "Ya existe una cuenta con ese correo.",
  "auth/invalid-email": "El correo no tiene un formato válido.",
  "auth/weak-password": "Usa al menos 8 caracteres.",
  "auth/user-not-found": "Correo o contraseña incorrectos.",
  "auth/wrong-password": "Correo o contraseña incorrectos.",
  "auth/invalid-credential": "Correo o contraseña incorrectos.",
  "auth/user-disabled": "Esta cuenta está deshabilitada.",
  "auth/too-many-requests": "Demasiados intentos. Espera unos minutos y prueba de nuevo.",
  "auth/network-request-failed": "Sin conexión. Revisa tu internet.",
  "auth/popup-closed-by-user": "Se canceló el ingreso con Google.",
  "auth/cancelled-popup-request": "Se canceló el ingreso con Google.",
  "auth/popup-blocked": "El navegador bloqueó la ventana de Google. Permite las ventanas emergentes e inténtalo de nuevo.",
  "auth/unauthorized-domain": "Este dominio no está autorizado para ingresar con Google.",
  "auth/internal-error": "Google no respondió correctamente. Inténtalo de nuevo en un momento.",
  "auth/api-key-not-valid.-please-pass-a-valid-api-key.": "La configuración de Firebase está incompleta.",
  "auth/requires-recent-login": "Vuelve a iniciar sesión para confirmar tu identidad.",
  "auth/operation-not-allowed": "Ese método de ingreso no está habilitado.",
  "auth/missing-password": "Escribe tu contraseña."
};

// Misma política que la UI de acceso: 8 caracteres como mínimo.
const MIN_CONTRASENA = 8;

export const ERROR_GENERICO = "No se pudo completar la operación. Inténtalo de nuevo.";

export function mensajeDeError(error) {
  const codigo = error && (error.code || error.message);
  const conocido = MENSAJES[codigo];
  // Un código sin traducir es configuración rota o un caso nuevo: se deja visible en la
  // consola (solo el código, nunca correo ni token) para poder diagnosticarlo.
  if (!conocido) console.warn("[cuenta] Código de Firebase Auth sin traducir:", codigo);
  return conocido || ERROR_GENERICO;
}

// Validación de UX: Firebase vuelve a validar del lado servidor; esto solo evita el viaje obvio.
export function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

export function crearCuenta({ cargarNube, alCambiarSesion = () => {} }) {
  let adaptador = null;
  let usuario = null;

  // Carga perezosa y compartida del adaptador. Si no hay configuración o el SDK falla, la
  // cuenta queda deshabilitada (false) y la app sigue funcionando solo en local.
  async function nube() {
    if (adaptador === null) {
      try {
        adaptador = (await cargarNube()) || false;
      } catch (e) {
        adaptador = false;
      }
    }
    return adaptador || null;
  }

  async function disponible() {
    return !!(await nube());
  }

  async function registrar(email, pass) {
    const correo = String(email || "").trim();
    if (!emailValido(correo)) return { ok: false, mensaje: MENSAJES["auth/invalid-email"] };
    if (String(pass || "").length < MIN_CONTRASENA) return { ok: false, mensaje: MENSAJES["auth/weak-password"] };
    const api = await nube();
    if (!api) return { ok: false, mensaje: ERROR_GENERICO };
    try {
      usuario = await api.auth.registrar(correo, pass);
      return { ok: true, usuario };
    } catch (e) {
      return { ok: false, mensaje: mensajeDeError(e), codigo: e && e.code };
    }
  }

  async function ingresar(email, pass) {
    const correo = String(email || "").trim();
    if (!emailValido(correo)) return { ok: false, mensaje: MENSAJES["auth/invalid-email"] };
    if (!String(pass || "")) return { ok: false, mensaje: MENSAJES["auth/missing-password"] };
    const api = await nube();
    if (!api) return { ok: false, mensaje: ERROR_GENERICO };
    try {
      usuario = await api.auth.ingresar(correo, pass);
      return { ok: true, usuario };
    } catch (e) {
      return { ok: false, mensaje: mensajeDeError(e), codigo: e && e.code };
    }
  }

  async function ingresarConGoogle() {
    const api = await nube();
    if (!api) return { ok: false, mensaje: ERROR_GENERICO };
    try {
      const u = await api.auth.ingresarConGoogle();
      // Con redirect el SDK no devuelve usuario: la página navega y la sesión llega por
      // onAuthStateChanged. La UI se queda en "Abriendo Google…" hasta la recarga.
      if (!u) return { ok: true, usuario: null, navegando: true };
      usuario = u;
      return { ok: true, usuario: u };
    } catch (e) {
      return { ok: false, mensaje: mensajeDeError(e), codigo: e && e.code };
    }
  }

  async function enviarReset(email) {
    const correo = String(email || "").trim();
    if (!emailValido(correo)) return { ok: false, mensaje: MENSAJES["auth/invalid-email"] };
    const api = await nube();
    if (!api) return { ok: false, mensaje: ERROR_GENERICO };
    try {
      await api.auth.enviarReset(correo);
      // Mismo mensaje exista o no la cuenta: no se confirma qué correos están registrados.
      return { ok: true, mensaje: "Si el correo existe, te enviamos un enlace para restablecerla." };
    } catch (e) {
      return { ok: false, mensaje: mensajeDeError(e), codigo: e && e.code };
    }
  }

  async function salir() {
    const api = await nube();
    if (!api) return { ok: false, mensaje: ERROR_GENERICO };
    try {
      await api.auth.salir();
      usuario = null;
      return { ok: true };
    } catch (e) {
      return { ok: false, mensaje: mensajeDeError(e), codigo: e && e.code };
    }
  }

  // Empieza a observar la sesión (restaura al recargar y avisa a la UI en cada cambio).
  // Resuelve con la función para dejar de observar (o null sin cuenta) DESPUÉS del primer
  // evento de sesión, para que el arranque decida la pantalla con el estado real.
  async function iniciar() {
    const api = await nube();
    if (!api) return null;
    return new Promise(resolve => {
      let primera = true;
      const dejar = api.auth.observar(u => {
        usuario = u;
        alCambiarSesion(u);
        if (primera) {
          primera = false;
          resolve(dejar);
        }
      });
    });
  }

  return {
    disponible,
    registrar,
    ingresar,
    ingresarConGoogle,
    enviarReset,
    salir,
    iniciar,
    estado: () => usuario
  };
}
