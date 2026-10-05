// Adaptador de Firebase: lectura de configuración por entorno y cableado del SDK con módulos
// inyectados (no se carga el SDK real ni se toca la red).
import { describe, it, expect, vi } from "vitest";
import { leerConfig, crearAdaptador, COLECCION } from "./firebase.js";

function envCompleto() {
  return {
    VITE_FIREBASE_API_KEY: "api-key",
    VITE_FIREBASE_AUTH_DOMAIN: "demo.firebaseapp.com",
    VITE_FIREBASE_PROJECT_ID: "demo",
    VITE_FIREBASE_APP_ID: "app-id"
  };
}

function apiFake() {
  return {
    initializeApp: vi.fn(cfg => ({ cfg })),
    getAuth: vi.fn(app => ({ app })),
    getFirestore: vi.fn(app => ({ app })),
    createUserWithEmailAndPassword: vi.fn(async () => ({ user: { uid: "u1", email: "a@x.com", displayName: null } })),
    signInWithEmailAndPassword: vi.fn(async () => ({ user: { uid: "u1", email: "a@x.com", displayName: "Ana" } })),
    GoogleAuthProvider: class Proveedor {},
    signInWithPopup: vi.fn(async () => ({ user: { uid: "u1", email: "g@x.com", displayName: null } })),
    signOut: vi.fn(async () => {}),
    sendPasswordResetEmail: vi.fn(async () => {}),
    onAuthStateChanged: vi.fn((auth, cb) => {
      cb({ uid: "u1", email: "a@x.com", displayName: null });
      return () => {};
    }),
    doc: vi.fn((db, col, uid) => ({ col, uid })),
    getDoc: vi.fn(async () => ({ exists: () => true, data: () => ({ formato: "nube-1" }) })),
    setDoc: vi.fn(async () => {}),
    serverTimestamp: vi.fn(() => "TS")
  };
}

describe("student/firebase", () => {
  it("leerConfig exige las cuatro claves mínimas y devuelve solo esas", () => {
    expect(leerConfig(undefined)).toBeNull();
    const parcial = envCompleto();
    delete parcial.VITE_FIREBASE_APP_ID;
    expect(leerConfig(parcial)).toBeNull();
    expect(leerConfig(envCompleto())).toEqual({
      apiKey: "api-key",
      authDomain: "demo.firebaseapp.com",
      projectId: "demo",
      appId: "app-id"
    });
  });

  it("sin configuración no carga módulos y devuelve null", async () => {
    const cargarModulos = vi.fn();
    expect(await crearAdaptador({ env: {}, cargarModulos })).toBeNull();
    expect(cargarModulos).not.toHaveBeenCalled();
  });

  it("inicializa la app con la config y expone auth y store", async () => {
    const api = apiFake();
    const adaptador = await crearAdaptador({ env: envCompleto(), cargarModulos: async () => api });
    expect(api.initializeApp).toHaveBeenCalledWith(leerConfig(envCompleto()));
    expect(api.getAuth).toHaveBeenCalledWith({ cfg: leerConfig(envCompleto()) });
    expect(api.getFirestore).toHaveBeenCalledTimes(1);
    expect(typeof adaptador.auth.registrar).toBe("function");
    expect(typeof adaptador.store.escribir).toBe("function");
  });

  it("normaliza el usuario de las tres vías de ingreso", async () => {
    const api = apiFake();
    const adaptador = await crearAdaptador({ env: envCompleto(), cargarModulos: async () => api });
    expect(await adaptador.auth.registrar("a@x.com", "secreto1")).toEqual({ uid: "u1", email: "a@x.com", nombre: "" });
    expect(await adaptador.auth.ingresar("a@x.com", "secreto1")).toEqual({ uid: "u1", email: "a@x.com", nombre: "Ana" });
    expect(await adaptador.auth.ingresarConGoogle()).toEqual({ uid: "u1", email: "g@x.com", nombre: "" });
  });

  it("observar entrega el usuario normalizado", async () => {
    const api = apiFake();
    const adaptador = await crearAdaptador({ env: envCompleto(), cargarModulos: async () => api });
    const visto = vi.fn();
    const dejar = adaptador.auth.observar(visto);
    expect(typeof dejar).toBe("function");
    expect(visto).toHaveBeenCalledWith({ uid: "u1", email: "a@x.com", nombre: "" });
  });

  it("el store lee el documento del usuario y escribe con sello del servidor", async () => {
    const api = apiFake();
    const adaptador = await crearAdaptador({ env: envCompleto(), cargarModulos: async () => api });
    expect(await adaptador.store.leer("u1")).toEqual({ formato: "nube-1" });
    expect(api.doc).toHaveBeenCalledWith(expect.anything(), COLECCION, "u1");
    await adaptador.store.escribir("u1", { formato: "nube-1" });
    expect(api.setDoc).toHaveBeenCalledWith({ col: COLECCION, uid: "u1" }, { formato: "nube-1", actualizado: "TS" });
    api.getDoc.mockResolvedValueOnce({ exists: () => false, data: () => null });
    expect(await adaptador.store.leer("u2")).toBeNull();
  });

  it("salir y enviarReset pasan directo al SDK", async () => {
    const api = apiFake();
    const adaptador = await crearAdaptador({ env: envCompleto(), cargarModulos: async () => api });
    await adaptador.auth.salir();
    await adaptador.auth.enviarReset("a@x.com");
    expect(api.signOut).toHaveBeenCalledTimes(1);
    expect(api.sendPasswordResetEmail).toHaveBeenCalledWith(expect.anything(), "a@x.com");
  });
});
