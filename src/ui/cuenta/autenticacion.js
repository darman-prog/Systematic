// Pantallas de acceso: login, registro y recuperar contraseña (diseño del prototipo del usuario).
// Solo UI: no sabe de Firebase ni de persistencia. Recibe callbacks async y reacciona a lo que
// hagan:
//   - si resuelven, login/registro deben navegar fuera de la pantalla (la app pinta el panel de
//     sesión); recuperar muestra la confirmación de "revisá tu correo".
//   - si rechazan, lo hacen con { mensaje, campo? }: con `campo` ("nombre" | "correo" |
//     "contrasena" | "contrasena2") el error sale bajo ese campo; sin él, como aviso general.
//   - { cancelado: true } no muestra nada (p. ej. el usuario cerró la ventana de Google).
//   - alGoogle es opcional: si se pasa, login y registro muestran "Continuar con Google".
//   - alContinuarSinCuenta es opcional: si se pasa, aparece la puerta "Continuar sin cuenta".
// Los identificadores usan `contrasena` sin ñ (ASCII); la UI escribe "Contraseña".
import { escapar } from "../helpers.js";
import { LENGUAJES } from "../../core/index.js";

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

const ICONO_MAIL = '<svg class="campo-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>';
const ICONO_LOCK = '<svg class="campo-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
const ICONO_USER = '<svg class="campo-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>';
const ICONO_OJO = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="3"/></svg>';
const ICONO_LOGO = `<span class="head-tile" aria-hidden="true">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 3 20 7.5 12 12 4 7.5 12 3Z" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="m4 12 8 4.5 8-4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.72"/>
    <path d="m4 16.5 8 4.5 8-4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.42"/>
  </svg>
</span>`;

const CABECERA = `
  <div class="auth-head">
    ${ICONO_LOGO}
    <div class="head-texto"><span class="head-nombre">systematic</span></div>
  </div>`;

const GOOGLE_BOTON = `
  <button type="button" class="btn-sec" data-google>
    <span id="auth-google-texto">Continuar con Google</span>
  </button>`;

// Valida cada campo con las reglas de la vista. Devuelve "" si está bien.
function validar(campo, valor, vista, datos) {
  if (campo === "nombre") return valor.trim().length < 2 ? "Escribe tu nombre." : "";
  if (campo === "correo") {
    const v = valor.trim();
    if (!v) return "Escribe tu correo.";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Revisá el formato del correo.";
  }
  if (campo === "contrasena2") {
    if (!valor) return "Repetí la contraseña.";
    return valor === datos.contrasena ? "" : "Las contraseñas no coinciden.";
  }
  if (vista === "register") {
    if (!valor) return "Creá una contraseña.";
    return valor.length < MIN_CONTRASENA ? `Usá al menos ${MIN_CONTRASENA} caracteres.` : "";
  }
  return valor ? "" : "Escribe tu contraseña.";
}

function campoHtml({ id, campo, etiqueta, tipo, autocompletar, icono, ojo = false, extra = "", cabeceraExtra = "" }) {
  return `
    <div class="campo">
      <div class="campo-label-row">
        <label class="campo-label" for="${id}">${etiqueta}</label>
        ${cabeceraExtra}
      </div>
      <div class="campo-input-wrap">
        <input class="campo-input" id="${id}" data-campo="${campo}" type="${tipo}" autocomplete="${autocompletar}" ${extra} aria-describedby="${id}-error">
        ${icono}
        ${ojo ? `<button type="button" class="campo-ojo" data-ojo="${id}" aria-pressed="false" aria-label="Mostrar contraseña">${ICONO_OJO}</button>` : ""}
      </div>
      <p class="campo-error" id="${id}-error"></p>
    </div>`;
}

// Chips decorativos con los lenguajes del registro (color real de cada track).
function chipsHtml() {
  return LENGUAJES.map(l =>
    `<span class="track-chip"><span class="track-punto" style="background:${l.color}"></span>${escapar(l.nombre)}</span>`
  ).join("");
}

function vistaHtml(vista, conGoogle) {
  const conGoogleBtn = conGoogle && vista !== "recuperar" ? GOOGLE_BOTON : "";
  const alerta = '<p class="auth-alerta" id="auth-alerta" role="alert"></p>';

  if (vista === "recuperar") {
    return `
      <h1 class="auth-titulo" id="auth-titulo" tabindex="-1">Recuperá tu <em>contraseña</em></h1>
      <p class="auth-sub">Te enviamos un enlace para crear una nueva.</p>
      ${alerta}
      <form class="auth-form" id="auth-form" novalidate>
        ${campoHtml({ id: "rec-email", campo: "correo", etiqueta: "Email", tipo: "email", autocompletar: "email", icono: ICONO_MAIL })}
        <button class="btn-primario" type="submit"><span id="auth-enviar-texto">${TEXTOS.recuperar.enviar}</span></button>
      </form>`;
  }

  if (vista === "register") {
    return `
      <h1 class="auth-titulo" id="auth-titulo" tabindex="-1">Creá tu <em>cuenta</em></h1>
      <p class="auth-sub">Un perfil para todos tus tracks.</p>
      ${alerta}
      <form class="auth-form" id="auth-form" novalidate>
        ${campoHtml({ id: "reg-nombre", campo: "nombre", etiqueta: "Nombre", tipo: "text", autocompletar: "name", icono: ICONO_USER, extra: 'placeholder="Cómo querés que te salude" autocapitalize="words"' })}
        ${campoHtml({ id: "reg-email", campo: "correo", etiqueta: "Email", tipo: "email", autocompletar: "email", icono: ICONO_MAIL, extra: 'placeholder="vos@ejemplo.com" inputmode="email" autocapitalize="none" spellcheck="false"' })}
        ${campoHtml({ id: "reg-pass", campo: "contrasena", etiqueta: "Contraseña", tipo: "password", autocompletar: "new-password", icono: ICONO_LOCK, ojo: true })}
        ${campoHtml({ id: "reg-pass2", campo: "contrasena2", etiqueta: "Confirmar contraseña", tipo: "password", autocompletar: "new-password", icono: ICONO_LOCK, ojo: true })}
        <button class="btn-primario" type="submit"><span id="auth-enviar-texto">${TEXTOS.register.enviar}</span></button>
        ${conGoogleBtn}
      </form>`;
  }

  return `
    <h1 class="auth-titulo" id="auth-titulo" tabindex="-1">Bienvenido <em>de vuelta</em></h1>
    <p class="auth-sub">Seguí donde dejaste.</p>
    ${alerta}
    <form class="auth-form" id="auth-form" novalidate>
      ${campoHtml({ id: "login-email", campo: "correo", etiqueta: "Email", tipo: "email", autocompletar: "email", icono: ICONO_MAIL, extra: 'placeholder="vos@ejemplo.com" inputmode="email" autocapitalize="none" spellcheck="false"' })}
      ${campoHtml({ id: "login-pass", campo: "contrasena", etiqueta: "Contraseña", tipo: "password", autocompletar: "current-password", icono: ICONO_LOCK, ojo: true, cabeceraExtra: '<button type="button" class="link" data-ir="recuperar">¿La olvidaste?</button>' })}
      <button class="btn-primario" type="submit"><span id="auth-enviar-texto">${TEXTOS.login.enviar}</span></button>
      ${conGoogleBtn}
    </form>`;
}

const PIES = {
  login: '¿No tenés cuenta? <button type="button" class="link" data-ir="register">Creá una</button>',
  register: '¿Ya tenés cuenta? <button type="button" class="link" data-ir="login">Ingresá</button>',
  recuperar: '<button type="button" class="link" data-ir="login">Volver a ingresar</button>'
};

function plantilla(vista, conGoogle, conInvitado) {
  return `
    <div class="auth-caja">
      <div class="auth-card">
        ${CABECERA}
        ${vistaHtml(vista, conGoogle)}
        <div class="auth-divider">Lenguajes disponibles</div>
        <div class="auth-tracks" aria-hidden="true">${chipsHtml()}</div>
      </div>
      <p class="auth-pie">${PIES[vista]}</p>
      ${conInvitado ? '<p class="auth-pie auth-invitado"><button type="button" class="link" data-invitado>Continuar sin cuenta</button></p>' : ""}
      <p class="auth-foot">systematic · método sobre intuición</p>
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
        <div class="auth-card">
          ${CABECERA}
          <h1 class="auth-titulo" id="auth-titulo" tabindex="-1">Revisá tu <em>correo</em></h1>
          <p class="auth-sub">Si existe una cuenta con <strong>${escapar(correo)}</strong>, te enviamos un enlace para restablecer tu contraseña. Puede tardar un par de minutos.</p>
          <button type="button" class="btn-primario" data-ir="login">Volver a ingresar</button>
        </div>
        <p class="auth-foot">systematic · método sobre intuición</p>
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
      || (vista === "login" ? "Correo o contraseña incorrectos." : "No pudimos completar la acción. Intentá de nuevo.");
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
      mostrarAlerta("Sin conexión. Revisá tu internet e intentá de nuevo.");
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
      mostrarAlerta("Sin conexión. Revisá tu internet e intentá de nuevo.");
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

  function toggleOjo(btn) {
    const input = $(btn.dataset.ojo);
    if (!input) return;
    const ocultar = input.type === "text";
    input.type = ocultar ? "password" : "text";
    btn.setAttribute("aria-pressed", String(!ocultar));
    btn.setAttribute("aria-label", ocultar ? "Mostrar contraseña" : "Ocultar contraseña");
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
