// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { observarScrollReveal } from "./scroll-suave.js";

describe("ui/componentes/scroll-suave (Scroll Reveal)", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("añade is-revealed inmediatamente si no existe IntersectionObserver", () => {
    const origIO = window.IntersectionObserver;
    delete window.IntersectionObserver;

    document.body.innerHTML = `
      <div class="scroll-reveal" id="el1"></div>
      <div class="scroll-reveal" id="el2"></div>
    `;

    observarScrollReveal(document);
    expect(document.getElementById("el1")?.classList.contains("is-revealed")).toBe(true);
    expect(document.getElementById("el2")?.classList.contains("is-revealed")).toBe(true);

    window.IntersectionObserver = origIO;
  });

  it("añade is-revealed inmediatamente si el usuario tiene activado prefers-reduced-motion", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true });
    document.body.innerHTML = `
      <div class="scroll-reveal" id="el1"></div>
    `;

    observarScrollReveal(document);
    expect(document.getElementById("el1")?.classList.contains("is-revealed")).toBe(true);
  });

  it("observa elementos cuando existe IntersectionObserver y revela en intersección", () => {
    const observeSpy = vi.fn();
    const unobserveSpy = vi.fn();
    let callbackIO = null;

    class MockIO {
      constructor(cb) {
        callbackIO = cb;
      }
      observe = observeSpy;
      unobserve = unobserveSpy;
      disconnect = vi.fn();
    }
    window.IntersectionObserver = MockIO;

    document.body.innerHTML = `
      <div class="scroll-reveal" id="el1"></div>
      <div class="scroll-reveal" id="el2"></div>
    `;

    const obs = observarScrollReveal(document);
    expect(obs).not.toBeNull();
    expect(observeSpy).toHaveBeenCalledTimes(2);

    // Simula intersección en el elemento 1
    const el1 = document.getElementById("el1");
    callbackIO([{ target: el1, isIntersecting: true }], obs);
    expect(el1?.classList.contains("is-revealed")).toBe(true);
    expect(unobserveSpy).toHaveBeenCalledWith(el1);
  });

  it("devuelve null si la raíz no contiene elementos .scroll-reveal", () => {
    document.body.innerHTML = "<div>Sin elementos</div>";
    const obs = observarScrollReveal(document);
    expect(obs).toBeNull();
  });
});
