// Pantallas de acceso: login, registro y recuperar contraseña (diseño del prototipo del usuario).
// Solo UI: no sabe de Firebase ni de persistencia. Recibe callbacks async y reacciona a lo que
// hagan:
//   - si resuelven, login/registro deben navegar fuera de la pantalla (la app pinta el panel de
//     sesión); recuperar muestra la confirmación de "revisa tu correo".
//   - si rechazan, lo hacen con { mensaje, campo? }: con `campo` ("nombre" | "correo" |
//     "contrasena" | "contrasena2") el error sale bajo ese campo; sin él, como aviso general.
//   - { cancelado: true } no muestra nada (p. ej. el usuario cerró la ventana de Google).
//   - alGoogle es opcional: si se pasa, login y registro muestran "Continuar con Google".
//   - alContinuarSinCuenta es opcional: si se pasa, aparece "Continuar sin cuenta" al pie de la
//     tarjeta (es la salida de la pantalla cuando no hay sesión).
// Los identificadores usan `contrasena` sin ñ (ASCII); la UI escribe "Contraseña".
// Textos en tuteo ("tú"), igual que el resto de la app.
import { escapar } from "../helpers.js";

const MIN_CONTRASENA = 8;

const CAMPOS = {
  login: ["correo", "contrasena"],
  register: ["nombre", "correo", "contrasena", "contrasena2"],
  recuperar: ["correo"]
};

// Id de cada input por vista: los errores se escriben en `<id>-error`.
const IDS = {
  login: { correo: "login-email", contrasena: "login-pass" },
  register: { nombre: "reg-nombre", correo: "reg-email", contrasena: "reg-pass", contrasena2: "reg-pass2" },
  recuperar: { correo: "rec-email" }
};

const TEXTOS = {
  login: { enviar: "Entrar", cargando: "Entrando…" },
  register: { enviar: "Crear cuenta", cargando: "Creando cuenta…" },
  recuperar: { enviar: "Enviar enlace", cargando: "Enviando…" }
};

// Dos iconos apilados: el CSS cruza uno u otro según aria-pressed (estado del botón).
const ICONO_OJO = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="3"/></svg>';
const ICONO_OJO_OFF = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
// Logo oficial de la app (el mismo del registro aprobado); el SVG ya trae su fondo.
const LOGO_SYSTEMATIC = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Systematic">
  <rect width="64" height="64" rx="14" fill="#1A1C22"/>
  <rect x="0.5" y="0.5" width="63" height="63" rx="13.5" fill="none" stroke="#2B2F38"/>
  <rect x="10" y="10" width="44" height="44" rx="9" fill="#22252D" stroke="#2B2F38" stroke-width="1.5"/>
  <path d="M19 7v6M32 7v6M45 7v6" stroke="#9BB8C9" stroke-width="2.5" stroke-linecap="round"/>
  <path class="logo-s" d="M37.5 25 A5.5 5.5 0 1 0 32 30.5 A5.5 5.5 0 1 1 26.5 36" fill="none" stroke="#E7E5DE" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M18 47h28M18 51h15" stroke="#2B2F38" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;

// Emblema circular del registro: halo + SVG. El CSS lo reduce en móvil.
const LOGO_BLOQUE = `<div class="auth-logo">${LOGO_SYSTEMATIC}</div>`;

// Logo oficial de Google (4 colores), solo decorativo.
const ICONO_GOOGLE = `<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
</svg>`;

// Divisor "o" + botón de Google, siempre justo debajo del botón principal.
const GOOGLE_BLOQUE = `
  <div class="auth-divider" role="separator">o</div>
  <button type="button" class="btn-sec" data-google>
    ${ICONO_GOOGLE}
    <span id="auth-google-texto">Continuar con Google</span>
  </button>`;

// Valida cada campo con las reglas de la vista. Devuelve "" si está bien.
function validar(campo, valor, vista, datos) {
  if (campo === "nombre") return valor.trim().length < 2 ? "Escribe tu nombre." : "";
  if (campo === "correo") {
    const v = valor.trim();
    if (!v) return "Escribe tu correo.";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Revisa el formato del correo.";
  }
  if (campo === "contrasena2") {
    if (!valor) return "Repite la contraseña.";
    return valor === datos.contrasena ? "" : "Las contraseñas no coinciden.";
  }
  if (vista === "register") {
    if (!valor) return "Crea una contraseña.";
    return valor.length < MIN_CONTRASENA ? `Usa al menos ${MIN_CONTRASENA} caracteres.` : "";
  }
  return valor ? "" : "Escribe tu contraseña.";
}

function campoHtml({ id, campo, etiqueta, tipo, autocompletar, ojo = false, extra = "", labelExtra = "", hintId = "" }) {
  // El nombre accesible del botón de ojo es fijo ("Mostrar contraseña"); el estado lo
  // comunica aria-pressed. Cambiar el nombre Y el estado a la vez se leería al revés.
  const describedBy = hintId ? `${hintId} ${id}-error` : `${id}-error`;
  return `
    <div class="campo">
      <div class="campo-label-row">
        <label class="campo-label" for="${id}">${etiqueta}</label>
        ${labelExtra}
      </div>
      <div class="campo-input-wrap">
        <input class="campo-input${ojo ? " campo-input--ojo" : ""}" id="${id}" data-campo="${campo}" type="${tipo}" autocomplete="${autocompletar}" ${extra} aria-describedby="${describedBy}">
        ${ojo ? `<button type="button" class="campo-ojo" data-ojo="${id}" aria-pressed="false" aria-label="Mostrar contraseña"><span class="ojo-on">${ICONO_OJO}</span><span class="ojo-off">${ICONO_OJO_OFF}</span></button>` : ""}
      </div>
      <p class="campo-error" id="${id}-error"></p>
    </div>`;
}

const ATRIBUTOS_CORREO = 'placeholder="tucorreo@ejemplo.com" inputmode="email" autocapitalize="none" spellcheck="false"';

// Copy editorial por vista. "Enviado" arma su subtítulo con el correo en renderEnviado.
const CABECERAS = {
  login: {
    eyebrow: "Acceso al entorno",
    titulo: 'Bienvenido <em>de vuelta</em>',
    sub: "Sigue donde lo dejaste."
  },
  register: {
    eyebrow: "Acceso al entorno",
    titulo: 'Comienza tu <em>estudio</em>',
    sub: "Estudio sereno para ingeniería y arquitectura de software."
  },
  recuperar: {
    eyebrow: "Recuperar acceso",
    titulo: 'Recupera tu <em>contraseña</em>',
    sub: "Te enviaremos un enlace para crear una nueva."
  },
  enviado: {
    eyebrow: "Recuperar acceso",
    titulo: 'Revisa tu <em>correo</em>',
    sub: ""
  }
};

function cabeceraHtml(vista, sub = "") {
  const c = CABECERAS[vista];
  return `
    <header class="auth-head">
      <span class="auth-eyebrow">${c.eyebrow}</span>
      <h1 class="auth-titulo" id="auth-titulo" tabindex="-1">${c.titulo}</h1>
      <p class="auth-sub">${sub || c.sub}</p>
    </header>`;
}

function vistaHtml(vista, conGoogle) {
  const google = conGoogle && vista !== "recuperar" ? GOOGLE_BLOQUE : "";
  const alerta = '<p class="auth-alerta" id="auth-alerta" role="alert"></p>';

  if (vista === "recuperar") {
    return `
      ${alerta}
      <form class="auth-form" id="auth-form" novalidate>
        ${campoHtml({ id: "rec-email", campo: "correo", etiqueta: "Correo", tipo: "email", autocompletar: "email", extra: ATRIBUTOS_CORREO })}
        <button class="btn-primario" type="submit"><span id="auth-enviar-texto">${TEXTOS.recuperar.enviar}</span></button>
      </form>`;
  }

  if (vista === "register") {
    const hint = `<span class="campo-extra" id="reg-pass-hint">Mín. ${MIN_CONTRASENA} caracteres</span>`;
    return `
      ${alerta}
      <form class="auth-form" id="auth-form" novalidate>
        ${campoHtml({ id: "reg-nombre", campo: "nombre", etiqueta: "Nombre completo", tipo: "text", autocompletar: "name", extra: 'placeholder="ej. Ada Lovelace" autocapitalize="words"' })}
        ${campoHtml({ id: "reg-email", campo: "correo", etiqueta: "Correo", tipo: "email", autocompletar: "email", extra: ATRIBUTOS_CORREO })}
        ${campoHtml({ id: "reg-pass", campo: "contrasena", etiqueta: "Contraseña", tipo: "password", autocompletar: "new-password", ojo: true, labelExtra: hint, hintId: "reg-pass-hint" })}
        ${campoHtml({ id: "reg-pass2", campo: "contrasena2", etiqueta: "Confirmar contraseña", tipo: "password", autocompletar: "new-password", ojo: true })}
        <button class="btn-primario" type="submit"><span id="auth-enviar-texto">${TEXTOS.register.enviar}</span></button>
        ${google}
      </form>`;
  }

  return `
    ${alerta}
    <form class="auth-form" id="auth-form" novalidate>
      ${campoHtml({ id: "login-email", campo: "correo", etiqueta: "Correo", tipo: "email", autocompletar: "email", extra: ATRIBUTOS_CORREO })}
      ${campoHtml({ id: "login-pass", campo: "contrasena", etiqueta: "Contraseña", tipo: "password", autocompletar: "current-password", ojo: true, labelExtra: '<button type="button" class="link campo-extra" data-ir="recuperar">¿Olvidaste tu contraseña?</button>' })}
      <button class="btn-primario" type="submit"><span id="auth-enviar-texto">${TEXTOS.login.enviar}</span></button>
      ${google}
    </form>`;
}

const PIES = {
  login: '¿No tienes cuenta? <button type="button" class="link" data-ir="register">Crea una</button>',
  register: '¿Ya tienes cuenta? <button type="button" class="link" data-ir="login">Inicia sesión</button>',
  recuperar: '<button type="button" class="link" data-ir="login">Volver a iniciar sesión</button>'
};

// Un solo marco: emblema, cabecera, formulario y enlaces; cambia solo el contenido de la vista.
function plantilla(vista, conGoogle, conInvitado) {
  return `
    <div class="auth-caja">
      <div class="auth-ribbon-wrap">
        <div class="auth-ribbon-back" aria-hidden="true"></div>
        <div class="auth-ribbon">
          <div class="auth-ribbon-body">
            ${LOGO_BLOQUE}
            ${cabeceraHtml(vista)}
            ${vistaHtml(vista, conGoogle)}
            <p class="auth-pie">${PIES[vista]}</p>
            ${conInvitado ? '<p class="auth-pie auth-invitado"><button type="button" class="link" data-invitado>Continuar sin cuenta</button></p>' : ""}
          </div>
        </div>
      </div>
    </div>`;
}

export function crearAuth({ alIniciarSesion, alRegistrarse, alRecuperar, alGoogle, alContinuarSinCuenta }) {
  const $ = id => document.getElementById(id);
  const raiz = () => $("auth-root");

  let vista = "login";
  let correoRecordado = ""; // se conserva al cambiar entre login, registro y recuperar
  let intentado = false;    // tras el primer envío fallido, se valida mientras escribe
  let enviando = false;
  let renderizando = false;
  let enlazadoA = null;

  function campoDe(el) {
    const campo = el?.dataset?.campo;
    return campo && CAMPOS[vista].includes(campo) ? campo : null;
  }

  function mostrarError(campo, mensaje) {
    const id = IDS[vista][campo];
    if (!id) return;
    const input = $(id);
    const salida = $(`${id}-error`);
    if (!input || !salida) return;
    salida.textContent = mensaje;
    if (mensaje) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
  }

  function validarCampo(campo) {
    const id = IDS[vista][campo];
    if (!id) return true;
    const input = $(id);
    if (!input) return true;
    const mensaje = validar(campo, input.value, vista, leerDatos());
    mostrarError(campo, mensaje);
    return !mensaje;
  }

  function mostrarAlerta(mensaje) {
    const alerta = $("auth-alerta");
    if (alerta) alerta.textContent = mensaje;
  }

  // `origen` indica qué botón disparó la acción: "enviar" (formulario) o "google".
  function fijarCargando(activo, origen = "enviar") {
    const r = raiz();
    if (!r) return;
    enviando = activo;
    // aria-disabled (no disabled) para que el botón no pierda el foco mientras carga.
    r.querySelectorAll(".btn-primario, .btn-sec").forEach(b => b.setAttribute("aria-disabled", String(activo)));
    const esGoogle = origen === "google";
    const activoBtn = r.querySelector(esGoogle ? "[data-google]" : ".btn-primario[type='submit']");
    activoBtn?.setAttribute("aria-busy", String(activo));
    const texto = $(esGoogle ? "auth-google-texto" : "auth-enviar-texto");
    if (!texto) return;
    const t = TEXTOS[vista];
    texto.textContent = esGoogle
      ? (activo ? "Abriendo Google…" : "Continuar con Google")
      : (activo ? t.cargando : t.enviar);
  }

  function enfocarInicial() {
    const primero = raiz()?.querySelector(".campo-input");
    const conPuntero = window.matchMedia?.("(pointer: fine)")?.matches;
    // En móvil se enfoca el título: así no se abre el teclado de golpe.
    (conPuntero && primero ? primero : $("auth-titulo"))?.focus({ preventScroll: true });
  }

  function render(nueva) {
    const r = raiz();
    if (!r) return;
    vista = nueva;
    intentado = false;
    enviando = false;

    renderizando = true;
    r.innerHTML = plantilla(vista, !!alGoogle, !!alContinuarSinCuenta && vista !== "recuperar");
    renderizando = false;

    const correo = $(IDS[vista].correo);
    if (correo && correoRecordado) correo.value = correoRecordado;

    if (enlazadoA !== r) {
      enlazar(r);
      enlazadoA = r;
    }
    enfocarInicial();
  }

  function renderEnviado(correo) {
    renderizando = true;
    raiz().innerHTML = `
      <div class="auth-caja">
        <div class="auth-ribbon-wrap">
          <div class="auth-ribbon-back" aria-hidden="true"></div>
          <div class="auth-ribbon">
            <div class="auth-ribbon-body">
              ${LOGO_BLOQUE}
              ${cabeceraHtml("enviado", `Si existe una cuenta con <strong>${escapar(correo)}</strong>, te enviamos un enlace para restablecer tu contraseña. Puede tardar un par de minutos.`)}
              <div class="auth-accion">
                <button type="button" class="btn-primario" data-ir="login">Volver a iniciar sesión</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    renderizando = false;
    $("auth-titulo")?.focus({ preventScroll: true });
  }

  function leerDatos() {
    const valor = campo => {
      const id = IDS[vista][campo];
      return id ? ($(id)?.value ?? "") : "";
    };
    return {
      nombre: valor("nombre").trim(),
      correo: valor("correo").trim(),
      contrasena: valor("contrasena"), // la contraseña no se recorta
      contrasena2: valor("contrasena2")
    };
  }

  function manejarError(error) {
    if (error?.cancelado) return; // p. ej. el usuario cerró la ventana de Google
    const mensaje = error?.mensaje
      || (vista === "login" ? "Correo o contraseña incorrectos." : "No pudimos completar la acción. Inténtalo de nuevo.");
    if (error?.campo && CAMPOS[vista].includes(error.campo)) {
      mostrarError(error.campo, mensaje);
      const id = IDS[vista][error.campo];
      if (id) $(id)?.focus();
    } else {
      mostrarAlerta(mensaje);
    }
  }

  async function entrarConGoogle() {
    if (enviando || !alGoogle) return;
    mostrarAlerta("");
    if (navigator.onLine === false) {
      mostrarAlerta("Sin conexión. Revisa tu internet e inténtalo de nuevo.");
      return;
    }
    fijarCargando(true, "google");
    try {
      await alGoogle();
      // Si resuelve, la app navega fuera de esta pantalla (igual que en login y registro).
    } catch (error) {
      fijarCargando(false, "google");
      manejarError(error);
    }
  }

  async function enviar(e) {
    e.preventDefault();
    if (enviando) return;

    intentado = true;
    mostrarAlerta("");

    const invalidos = CAMPOS[vista].filter(c => !validarCampo(c));
    if (invalidos.length) {
      const id = IDS[vista][invalidos[0]];
      if (id) $(id)?.focus();
      return;
    }
    if (navigator.onLine === false) {
      mostrarAlerta("Sin conexión. Revisa tu internet e inténtalo de nuevo.");
      return;
    }

    const datos = leerDatos();
    correoRecordado = datos.correo;
    fijarCargando(true);

    try {
      if (vista === "login") await alIniciarSesion(datos);
      else if (vista === "register") await alRegistrarse(datos);
      else {
        await alRecuperar(datos);
        renderEnviado(datos.correo);
      }
      // En login y registro no se reactiva el botón: el callback navega fuera de esta pantalla.
    } catch (error) {
      fijarCargando(false);
      manejarError(error);
    }
  }

  function alSalir(e) {
    if (renderizando) return;
    if (e.relatedTarget?.closest?.("[data-ir]")) return; // va a cambiar de pantalla
    const campo = campoDe(e.target);
    // No se regaña un campo vacío que el usuario todavía no tocó.
    if (campo && (intentado || e.target.value)) validarCampo(campo);
  }

  function alEscribir(e) {
    const campo = campoDe(e.target);
    if (!campo) return;
    if (intentado || e.target.getAttribute("aria-invalid") === "true") validarCampo(campo);
    // Si cambia la contraseña, la confirmación cargada vuelve a compararse.
    if (campo === "contrasena" && vista === "register" && $("reg-pass2")?.value) validarCampo("contrasena2");
  }

  function recordarCorreo() {
    const id = IDS[vista].correo;
    if (id && $(id)) correoRecordado = $(id).value.trim();
  }

  // El estado visible/oculto vive en aria-pressed; el CSS cruza los dos iconos con eso.
  function toggleOjo(btn) {
    const input = $(btn.dataset.ojo);
    if (!input) return;
    const mostrar = input.type === "password";
    input.type = mostrar ? "text" : "password";
    btn.setAttribute("aria-pressed", String(mostrar));
  }

  function alHacerClic(e) {
    const ir = e.target.closest("[data-ir]");
    if (ir) {
      recordarCorreo();
      render(ir.dataset.ir);
      return;
    }
    if (e.target.closest("[data-invitado]")) {
      if (alContinuarSinCuenta) alContinuarSinCuenta();
      return;
    }
    if (e.target.closest("[data-google]")) {
      entrarConGoogle();
      return;
    }
    const ojo = e.target.closest("[data-ojo]");
    if (ojo) toggleOjo(ojo);
  }

  function enlazar(r) {
    r.addEventListener("submit", enviar);
    r.addEventListener("focusout", alSalir);
    r.addEventListener("input", alEscribir);
    r.addEventListener("click", alHacerClic);
  }

  return {
    renderLogin: () => render("login"),
    renderRegistro: () => render("register"),
    renderRecuperar: () => render("recuperar")
  };
}
