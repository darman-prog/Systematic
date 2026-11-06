// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { iniciarScrollSuave, observarScrollReveal } from "./scroll-suave.js";

describe("ui/componentes/scroll-suave", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    document.documentElement.style.scrollBehavior = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("iniciarScrollSuave", () => {
    it("activa scroll-behavior smooth y registra listener de wheel", () => {
      const addSpy = vi.spyOn(window, "addEventListener");
      const removeSpy = vi.spyOn(window, "removeEventListener");

      const limpiar = iniciarScrollSuave(window);
      expect(document.documentElement.style.scrollBehavior).toBe("smooth");
      expect(addSpy).toHaveBeenCalledWith("wheel", expect.any(Function), { passive: false });

      limpiar();
      expect(removeSpy).toHaveBeenCalledWith("wheel", expect.any(Function));
    });

    it("no activa listeners ni altera scroll si prefiere movimiento reducido", () => {
      vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true });
      const addSpy = vi.spyOn(window, "addEventListener");

      const limpiar = iniciarScrollSuave(window);
      expect(addSpy).not.toHaveBeenCalled();
      expect(document.documentElement.style.scrollBehavior).toBe("");
      limpiar();
    });

    it("maneja eventos wheel escalonados sin lanzar errores", () => {
      Object.defineProperty(document.documentElement, "scrollHeight", { value: 1000, configurable: true });
      Object.defineProperty(window, "innerHeight", { value: 500, configurable: true });

      iniciarScrollSuave(window);
      const preventDefault = vi.fn();
      const eventoRueda = new Event("wheel");
      Object.assign(eventoRueda, { deltaY: 100, deltaMode: 1, preventDefault });

      window.dispatchEvent(eventoRueda);
      expect(preventDefault).toHaveBeenCalled();
    });
  });

  describe("observarScrollReveal", () => {
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

    it("observa elementos cuando existe IntersectionObserver", () => {
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
      callbackIO([{ target: el1, isIntersecting: true }]);
      expect(el1?.classList.contains("is-revealed")).toBe(true);
      expect(unobserveSpy).toHaveBeenCalledWith(el1);
    });
  });
});
