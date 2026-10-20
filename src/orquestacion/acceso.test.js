import { describe, it, expect } from "vitest";
import { decidirInicio } from "./acceso.js";

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
