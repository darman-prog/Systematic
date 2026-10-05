// Servicio de cuenta: validación de UX, resultados con mensajes en español y observación de
// sesión. El adaptador de nube es un fake: acá no se toca Firebase ni la red.
import { describe, it, expect, vi } from "vitest";
import { crearCuenta, mensajeDeError, emailValido, ERROR_GENERICO } from "./cuenta.js";

function adaptadorFake({ error = null } = {}) {
  const lanzar = async () => {
    if (error) throw error;
  };
  return {
    auth: {
      registrar: vi.fn(async (email, pass) => {
        await lanzar();
        return { uid: "u1", email, nombre: "" };
      }),
      ingresar: vi.fn(async (email, pass) => {
        await lanzar();
        return { uid: "u1", email, nombre: "" };
      }),
      ingresarConGoogle: vi.fn(async () => {
        await lanzar();
        return { uid: "u1", email: "g@x.com", nombre: "G" };
      }),
      enviarReset: vi.fn(lanzar),
      salir: vi.fn(lanzar),
      observar: vi.fn(cb => {
        cb({ uid: "u1", email: "a@x.com", nombre: "" });
        return () => {};
      })
    },
    store: {}
  };
}

function cuentaCon(adaptador) {
  return crearCuenta({ cargarNube: async () => adaptador });
}

describe("student/cuenta", () => {
  it("disponible refleja si hay configuración de nube", async () => {
    expect(await cuentaCon(adaptadorFake()).disponible()).toBe(true);
    expect(await crearCuenta({ cargarNube: async () => null }).disponible()).toBe(false);
  });

  it("valida correo y contraseña antes de llamar al adaptador", async () => {
    const adaptador = adaptadorFake();
    const cuenta = cuentaCon(adaptador);
    expect(await cuenta.registrar("mal", "123456")).toEqual({ ok: false, mensaje: "El correo no tiene un formato válido." });
    expect(await cuenta.registrar("a@x.com", "123")).toEqual({ ok: false, mensaje: "La contraseña necesita al menos 6 caracteres." });
    expect(await cuenta.ingresar("a@x.com", "")).toEqual({ ok: false, mensaje: "Escribí tu contraseña." });
    expect(adaptador.auth.registrar).not.toHaveBeenCalled();
    expect(adaptador.auth.ingresar).not.toHaveBeenCalled();
  });

  it("registrar e ingresar devuelven el usuario y lo dejan como estado", async () => {
    const cuenta = cuentaCon(adaptadorFake());
    const alta = await cuenta.registrar("ana@x.com", "secreto1");
    expect(alta.ok).toBe(true);
    expect(alta.usuario.uid).toBe("u1");
    expect(cuenta.estado().email).toBe("ana@x.com");
    const ingreso = await cuenta.ingresar("ana@x.com", "secreto1");
    expect(ingreso.ok).toBe(true);
  });

  it("sin configuración devuelve error genérico", async () => {
    const cuenta = crearCuenta({ cargarNube: async () => null });
    expect(await cuenta.registrar("a@x.com", "123456")).toEqual({ ok: false, mensaje: ERROR_GENERICO });
    expect(await cuenta.ingresarConGoogle()).toEqual({ ok: false, mensaje: ERROR_GENERICO });
  });

  it("traduce errores de Firebase sin filtrar si la cuenta existe", async () => {
    const noExiste = cuentaCon(adaptadorFake({ error: { code: "auth/user-not-found" } }));
    const malaPass = cuentaCon(adaptadorFake({ error: { code: "auth/wrong-password" } }));
    const a = await noExiste.ingresar("a@x.com", "secreto1");
    const b = await malaPass.ingresar("a@x.com", "secreto1");
    expect(a.mensaje).toBe("Correo o contraseña incorrectos.");
    expect(b.mensaje).toBe(a.mensaje);
  });

  it("ingresarConGoogle y salir funcionan y limpian el estado", async () => {
    const adaptador = adaptadorFake();
    const cuenta = cuentaCon(adaptador);
    const google = await cuenta.ingresarConGoogle();
    expect(google.usuario.nombre).toBe("G");
    expect(await cuenta.salir()).toEqual({ ok: true });
    expect(cuenta.estado()).toBeNull();
    expect(adaptador.auth.salir).toHaveBeenCalledTimes(1);
  });

  it("enviarReset responde igual exista o no la cuenta", async () => {
    const cuenta = cuentaCon(adaptadorFake());
    const r = await cuenta.enviarReset("a@x.com");
    expect(r.ok).toBe(true);
    expect(r.mensaje).toContain("Si el correo existe");
  });

  it("iniciar observa la sesión, avisa a la UI y devuelve cómo dejar de observar", async () => {
    const alCambiarSesion = vi.fn();
    const cuenta = crearCuenta({ cargarNube: async () => adaptadorFake(), alCambiarSesion });
    const dejar = await cuenta.iniciar();
    expect(typeof dejar).toBe("function");
    expect(alCambiarSesion).toHaveBeenCalledWith({ uid: "u1", email: "a@x.com", nombre: "" });
    expect(cuenta.estado().uid).toBe("u1");
  });

  it("mensajeDeError cae al genérico con códigos desconocidos", () => {
    expect(mensajeDeError({ code: "auth/lo-que-sea" })).toBe(ERROR_GENERICO);
    expect(mensajeDeError(null)).toBe(ERROR_GENERICO);
  });

  it("emailValido acepta correos razonables y rechaza el resto", () => {
    expect(emailValido("ana@dominio.com")).toBe(true);
    expect(emailValido(" ana@dominio.com ")).toBe(true);
    expect(emailValido("ana@dominio")).toBe(false);
    expect(emailValido("")).toBe(false);
  });
});
