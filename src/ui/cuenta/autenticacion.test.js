// @vitest-environment jsdom
// UI de acceso: render de las vistas, validación inline y contrato de errores con los
// callbacks (campo, aviso general y cancelado). Sin Firebase ni red: callbacks fake.
import { describe, it, expect, vi } from "vitest";
import { crearAuth } from "./autenticacion.js";

function montar({ alIniciarSesion = vi.fn(async () => {}), alRegistrarse = vi.fn(async () => {}), alRecuperar = vi.fn(async () => {}), alGoogle } = {}) {
  document.body.innerHTML = '<div id="auth-root"></div>';
  const auth = crearAuth({ alIniciarSesion, alRegistrarse, alRecuperar, alGoogle });
  return { auth, alIniciarSesion, alRegistrarse, alRecuperar, alGoogle };
}

const $ = id => document.getElementById(id);
const flush = () => new Promise(r => setTimeout(r, 0));
const enviar = () => $("auth-form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

describe("ui/cuenta/autenticacion", () => {
  it("renderiza login con Google solo si se pasa alGoogle", () => {
    const sinGoogle = montar();
    sinGoogle.auth.renderLogin();
    expect($("login-email")).toBeTruthy();
    expect($("login-pass")).toBeTruthy();
    expect(document.querySelector("[data-google]")).toBeNull();

    const conGoogle = montar({ alGoogle: vi.fn(async () => {}) });
    conGoogle.auth.renderLogin();
    expect(document.querySelector("[data-google]")).toBeTruthy();
  });

  it("valida el correo antes de llamar al callback", () => {
    const { auth, alIniciarSesion } = montar();
    auth.renderLogin();
    $("login-email").value = "mal";
    $("login-pass").value = "secreto1";
    enviar();
    expect($("login-email-error").textContent).toBe("Revisá el formato del correo.");
    expect(alIniciarSesion).not.toHaveBeenCalled();
  });

  it("ubica bajo el campo el error que trae { campo }", async () => {
    const alIniciarSesion = vi.fn(async () => {
      throw { mensaje: "Correo o contraseña incorrectos.", campo: "contrasena" };
    });
    const { auth } = montar({ alIniciarSesion });
    auth.renderLogin();
    $("login-email").value = "ana@x.com";
    $("login-pass").value = "secreto1";
    enviar();
    await flush();
    expect($("login-pass-error").textContent).toBe("Correo o contraseña incorrectos.");
    expect($("login-pass").getAttribute("aria-invalid")).toBe("true");
  });

  it("un error sin campo sale como aviso general", async () => {
    const alIniciarSesion = vi.fn(async () => {
      throw { mensaje: "Demasiados intentos. Esperá unos minutos." };
    });
    const { auth } = montar({ alIniciarSesion });
    auth.renderLogin();
    $("login-email").value = "ana@x.com";
    $("login-pass").value = "secreto1";
    enviar();
    await flush();
    expect($("auth-alerta").textContent).toContain("Demasiados intentos");
  });

  it("{ cancelado: true } no muestra nada", async () => {
    const alGoogle = vi.fn(async () => {
      throw { cancelado: true };
    });
    const { auth } = montar({ alGoogle });
    auth.renderLogin();
    document.querySelector("[data-google]").click();
    await flush();
    expect($("auth-alerta").textContent).toBe("");
    expect($("login-email-error").textContent).toBe("");
  });

  it("el envío exitoso llama al callback con los datos y deja el botón cargando", async () => {
    const { auth, alIniciarSesion } = montar();
    auth.renderLogin();
    $("login-email").value = "ana@x.com";
    $("login-pass").value = "secreto1";
    enviar();
    await flush();
    expect(alIniciarSesion).toHaveBeenCalledWith(expect.objectContaining({ correo: "ana@x.com", contrasena: "secreto1" }));
    expect($("auth-enviar-texto").textContent).toBe("Entrando…");
  });

  it("el registro pide confirmación de contraseña y valida la coincidencia", async () => {
    const { auth, alRegistrarse } = montar();
    auth.renderRegistro();
    $("reg-nombre").value = "Ana";
    $("reg-email").value = "ana@x.com";
    $("reg-pass").value = "secreto123";
    $("reg-pass2").value = "otra12345";
    enviar();
    expect($("reg-pass2-error").textContent).toBe("Las contraseñas no coinciden.");
    expect(alRegistrarse).not.toHaveBeenCalled();
  });

  it("recuperar llama al callback y muestra la confirmación", async () => {
    const { auth, alRecuperar } = montar();
    auth.renderRecuperar();
    $("rec-email").value = "ana@x.com";
    enviar();
    await flush();
    expect(alRecuperar).toHaveBeenCalledWith(expect.objectContaining({ correo: "ana@x.com" }));
    expect(document.getElementById("auth-root").textContent).toContain("Revisá tu correo");
  });

  it("el ojo alterna la visibilidad de la contraseña", () => {
    const { auth } = montar();
    auth.renderLogin();
    document.querySelector('[data-ojo="login-pass"]').click();
    expect($("login-pass").type).toBe("text");
    document.querySelector('[data-ojo="login-pass"]').click();
    expect($("login-pass").type).toBe("password");
  });

  it("data-ir cambia entre login y registro conservando el correo", () => {
    const { auth } = montar();
    auth.renderLogin();
    $("login-email").value = "ana@x.com";
    document.querySelector('[data-ir="register"]').click();
    expect($("reg-email").value).toBe("ana@x.com");
    document.querySelector('[data-ir="login"]').click();
    expect($("login-email").value).toBe("ana@x.com");
  });
});
