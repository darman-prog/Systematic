// @vitest-environment jsdom
// Pantalla de cuenta: el estado anónimo quita la card del shell y pasa a full-bleed;
// con sesión vuelve la card y el título "Cuenta". Sin Firebase ni localStorage.
import { describe, it, expect } from "vitest";
import { crearCuentaUI } from "./cuenta.js";

function montar() {
  document.body.innerHTML = `
    <section id="screen-cuenta" aria-labelledby="cuenta-titulo">
      <div class="cuenta-head"><h1 id="cuenta-titulo">Cuenta</h1></div>
      <div id="cuenta-anon"></div>
      <div id="cuenta-sesion" class="hidden"></div>
      <b id="cuenta-email-actual"></b>
      <p id="cuenta-aviso" class="hidden"></p>
    </section>`;
  return crearCuentaUI({ ctx: {} });
}

describe("ui/cuenta", () => {
  it("sin sesión deja el acceso full-bleed y lo nombra Acceso", () => {
    const ui = montar();
    ui.pintar(null);
    const seccion = document.getElementById("screen-cuenta");
    expect(seccion.classList.contains("acceso-libre")).toBe(true);
    expect(seccion.getAttribute("aria-label")).toBe("Acceso");
    expect(seccion.hasAttribute("aria-labelledby")).toBe(false);
    expect(document.getElementById("cuenta-anon").classList.contains("hidden")).toBe(false);
    expect(document.getElementById("cuenta-sesion").classList.contains("hidden")).toBe(true);
  });

  it("con sesión vuelve a la card y al título Cuenta", () => {
    const ui = montar();
    ui.pintar(null);
    ui.pintar({ email: "ana@x.com" });
    const seccion = document.getElementById("screen-cuenta");
    expect(seccion.classList.contains("acceso-libre")).toBe(false);
    expect(seccion.getAttribute("aria-labelledby")).toBe("cuenta-titulo");
    expect(seccion.hasAttribute("aria-label")).toBe(false);
    expect(document.getElementById("cuenta-anon").classList.contains("hidden")).toBe(true);
    expect(document.getElementById("cuenta-sesion").classList.contains("hidden")).toBe(false);
    expect(document.getElementById("cuenta-email-actual").textContent).toBe("ana@x.com");
  });
});
