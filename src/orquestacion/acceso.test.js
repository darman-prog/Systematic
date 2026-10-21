// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { crearAcceso, decidirInicio } from "./acceso.js";

function montar(over = {}) {
  const elementos = {
    "screen-perfil": { classList: { contains: () => false } },
    "perfil-titulo": { focus: vi.fn() },
    "onboarding-nombre": { focus: vi.fn() }
  };
  const auth = { renderLogin: vi.fn() };
  const crearAuthUI = vi.fn(() => auth);
  const cuenta = {
    disponible: vi.fn(async () => true),
    iniciar: vi.fn(async () => {}),
    estado: vi.fn(() => null),
    ingresar: vi.fn(async () => ({ ok: true, usuario: { uid: "u1", email: "a@b.c" } })),
    registrar: vi.fn(async () => ({ ok: true, usuario: { uid: "u1", email: "a@b.c" } })),
    enviarReset: vi.fn(async () => ({ ok: true })),
    ingresarConGoogle: vi.fn(async () => ({ ok: true, usuario: { uid: "u1", email: "a@b.c" } })),
    ...over.cuenta
  };
  const persistencia = {
    nombre: vi.fn(() => ""),
    onboardingHecho: vi.fn(() => false),
    guardarOnboardingHecho: vi.fn(),
    guardarNombre: vi.fn(),
    ...over.persistencia
  };
  const deps = {
    $: id => elementos[id] || null,
    persistencia,
    home: { renderMaterias: vi.fn() },
    show: vi.fn(),
    cuenta,
    cuentaUI: { pintar: vi.fn() },
    perfilUI: { render: vi.fn() },
    nube: { bajar: vi.fn(async () => ({ ok: false })) },
    gamificacion: { perfil: () => ({ nivel: 1, xp: 0 }) },
    fechaSnapshot: vi.fn(() => new Date("2026-10-20T10:00:00")),
    aplicarSnapshot: vi.fn(),
    sesiones: { limpiar: vi.fn() },
    clearTimer: vi.fn(),
    crearAuthUI,
    recargar: vi.fn(),
    ...over.deps
  };
  const acceso = crearAcceso(deps);
  return { acceso, deps, auth, crearAuthUI, cuenta, persistencia, elementos };
}

describe("decidirInicio", () => {
  it("sin Firebase y sin identidad pide onboarding", () => {
    expect(decidirInicio({ disponible: false, usuario: null, onboardingHecho: false, nombre: "" })).toBe("onboarding");
  });

  it("sin Firebase y con identidad va a materias", () => {
    expect(decidirInicio({ disponible: false, usuario: null, onboardingHecho: true, nombre: "" })).toBe("materias");
    expect(decidirInicio({ disponible: false, usuario: null, onboardingHecho: false, nombre: "Ana" })).toBe("materias");
  });

  it("con Firebase y sesión entra a la cuenta", () => {
    expect(decidirInicio({ disponible: true, usuario: { uid: "u1" }, onboardingHecho: false, nombre: "" })).toBe("entrar");
  });

  it("con Firebase sin sesión y visitante previo va a materias", () => {
    expect(decidirInicio({ disponible: true, usuario: null, onboardingHecho: true, nombre: "" })).toBe("materias");
  });

  it("con Firebase sin sesión ni visitante muestra login", () => {
    expect(decidirInicio({ disponible: true, usuario: null, onboardingHecho: false, nombre: "" })).toBe("login");
  });
});

describe("crearAcceso.iniciar", () => {
  it("sin Firebase y sin identidad muestra onboarding", async () => {
    const { acceso, deps } = montar();
    deps.cuenta.disponible.mockResolvedValue(false);
    await acceso.iniciar();
    expect(deps.show).toHaveBeenCalledWith("onboarding");
    expect(deps.home.renderMaterias).not.toHaveBeenCalled();
  });

  it("sin Firebase con onboarding hecho va a materias", async () => {
    const { acceso, deps, persistencia } = montar();
    deps.cuenta.disponible.mockResolvedValue(false);
    persistencia.onboardingHecho.mockReturnValue(true);
    await acceso.iniciar();
    expect(deps.show).toHaveBeenCalledWith("materias");
    expect(deps.home.renderMaterias).toHaveBeenCalled();
  });

  it("con Firebase y sesión entra a la cuenta", async () => {
    const { acceso, deps, cuenta } = montar();
    cuenta.estado.mockReturnValue({ uid: "u1", email: "a@b.c" });
    await acceso.iniciar();
    expect(cuenta.iniciar).toHaveBeenCalled();
    expect(deps.cuentaUI.pintar).toHaveBeenCalledWith({ uid: "u1", email: "a@b.c" });
    expect(deps.home.renderMaterias).toHaveBeenCalled();
  });

  it("con Firebase sin sesión y visitante previo va a materias", async () => {
    const { acceso, deps, persistencia } = montar();
    persistencia.onboardingHecho.mockReturnValue(true);
    await acceso.iniciar();
    expect(deps.show).toHaveBeenCalledWith("materias");
  });

  it("con Firebase sin sesión ni visitante muestra login", async () => {
    const { acceso, deps, auth } = montar();
    await acceso.iniciar();
    expect(deps.cuentaUI.pintar).toHaveBeenCalledWith(null);
    expect(auth.renderLogin).toHaveBeenCalled();
    expect(deps.show).toHaveBeenCalledWith("cuenta");
  });
});

describe("crearAcceso restauración y perfil", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("no ofrece restauración sin usuario o con identidad local", async () => {
    const { acceso, deps, persistencia } = montar();
    expect(await acceso.ofrecerRestauracion(null)).toBe(false);
    persistencia.nombre.mockReturnValue("Ana");
    expect(await acceso.ofrecerRestauracion({ uid: "u1" })).toBe(false);
    expect(deps.nube.bajar).not.toHaveBeenCalled();
  });

  it("no restaura si la nube falla o se cancela", async () => {
    const { acceso, deps } = montar();
    expect(await acceso.ofrecerRestauracion({ uid: "u1" })).toBe(false);
    deps.nube.bajar.mockResolvedValue({ ok: true, datos: { global: {} } });
    vi.spyOn(window, "confirm").mockReturnValue(false);
    expect(await acceso.ofrecerRestauracion({ uid: "u1" })).toBe(false);
    expect(deps.aplicarSnapshot).not.toHaveBeenCalled();
  });

  it("restaura, aplica el snapshot y recarga si se confirma", async () => {
    const { acceso, deps } = montar();
    deps.nube.bajar.mockResolvedValue({ ok: true, datos: { global: {} } });
    vi.spyOn(window, "confirm").mockReturnValue(true);
    expect(await acceso.ofrecerRestauracion({ uid: "u1" })).toBe(true);
    expect(deps.aplicarSnapshot).toHaveBeenCalledWith({ global: {} }, deps.persistencia);
    expect(deps.recargar).toHaveBeenCalled();
  });

  it("entrarConCuenta pinta, marca onboarding y va a materias sin respaldo", async () => {
    const { acceso, deps, persistencia } = montar();
    await acceso.entrarConCuenta({ uid: "u1", email: "a@b.c" });
    expect(deps.cuentaUI.pintar).toHaveBeenCalled();
    expect(persistencia.guardarOnboardingHecho).toHaveBeenCalled();
    expect(deps.home.renderMaterias).toHaveBeenCalled();
    expect(deps.show).toHaveBeenCalledWith("materias");
  });

  it("irPerfil limpia timers, pinta perfil y enfoca el título", async () => {
    const { acceso, deps, cuenta, elementos } = montar();
    cuenta.estado.mockReturnValue({ uid: "u1", email: "a@b.c" });
    await acceso.irPerfil();
    expect(deps.clearTimer).toHaveBeenCalled();
    expect(deps.sesiones.limpiar).toHaveBeenCalled();
    expect(deps.perfilUI.render).toHaveBeenCalled();
    expect(deps.show).toHaveBeenCalledWith("perfil");
    expect(document.title).toContain("Tu perfil");
    expect(elementos["perfil-titulo"].focus).toHaveBeenCalled();
  });

  it("datosPerfil refleja sesión, invitado y no disponible", async () => {
    const { acceso, cuenta } = montar();
    expect(acceso.datosPerfil().cuentaEstado).toBe("no-disponible");
    // iniciar cachea `disponible`; después el estado de sesión se refleja en el perfil.
    await acceso.iniciar();
    acceso.alCambiarSesion({ uid: "u1", email: "a@b.c" });
    expect(acceso.datosPerfil()).toMatchObject({ email: "a@b.c", cuentaEstado: "sesion" });
    cuenta.estado.mockReturnValue(null);
    acceso.alCambiarSesion(null);
    expect(acceso.datosPerfil().cuentaEstado).toBe("invitado");
  });

  it("el callback de invitado respeta el onboarding y el nombre", async () => {
    const { crearAuthUI, deps, persistencia } = montar();
    const config = crearAuthUI.mock.calls[0][0];
    config.alContinuarSinCuenta();
    expect(deps.show).toHaveBeenCalledWith("onboarding");
    persistencia.nombre.mockReturnValue("Ana");
    config.alContinuarSinCuenta();
    expect(deps.show).toHaveBeenCalledWith("materias");
  });

  it("mapea errores de auth a campo y cancelación", async () => {
    const { crearAuthUI, cuenta } = montar();
    const config = crearAuthUI.mock.calls[0][0];
    cuenta.ingresar.mockResolvedValueOnce({ ok: false, codigo: "auth/invalid-email", mensaje: "Correo inválido" });
    await expect(config.alIniciarSesion({ correo: "x", contrasena: "y" })).rejects.toEqual({
      mensaje: "Correo inválido", campo: "correo"
    });
    cuenta.ingresar.mockResolvedValueOnce({ ok: false, codigo: "auth/popup-closed-by-user" });
    await expect(config.alIniciarSesion({ correo: "x", contrasena: "y" })).rejects.toEqual({ cancelado: true });
  });
});
