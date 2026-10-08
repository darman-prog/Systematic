// @vitest-environment jsdom
// Render del Perfil: identidad y los 3 estados de cuenta (con sesión, invitado,
// sin Firebase). Sin Firebase ni red: estado explícito por parámetro (ADR 001).
import { describe, it, expect } from "vitest";
import { crearPerfil } from "./perfil.js";

function montar() {
  document.body.innerHTML = `
    <section id="screen-perfil" class="card">
      <div id="perfil-identidad"></div>
      <div id="perfil-cuenta"></div>
      <p id="perfil-aviso" class="hidden" role="status"></p>
    </section>`;
  return crearPerfil();
}

const PERFIL_BASE = { nivel: 3, xp: 250, pct: 40, faltante: 50, racha: 4, insignias: 2 };

describe("ui/cuenta/perfil", () => {
  it("con sesión muestra email, nube y salir", () => {
    const ui = montar();
    ui.render({ nombre: "Ana", email: "ana@x.com", cuentaEstado: "sesion", perfil: PERFIL_BASE });
    expect(document.querySelector("#perfil-identidad").textContent).toContain("Perfil de Ana");
    expect(document.querySelector("#perfil-identidad").textContent).toContain("250");
    expect(document.querySelector("#perfil-cuenta").textContent).toContain("ana@x.com");
    expect(document.querySelector('#perfil-cuenta [data-action="subirNube"]')).toBeTruthy();
    expect(document.querySelector('#perfil-cuenta [data-action="restaurarNube"]')).toBeTruthy();
    expect(document.querySelector('#perfil-cuenta [data-action="salirCuenta"]')).toBeTruthy();
  });

  it("invitado ofrece iniciar sesión sin nube ni salir", () => {
    const ui = montar();
    ui.render({ nombre: "", email: null, cuentaEstado: "invitado", perfil: PERFIL_BASE });
    expect(document.querySelector("#perfil-identidad").textContent).toContain("Tu perfil");
    expect(document.querySelector('#perfil-cuenta [data-action="irCuenta"]')).toBeTruthy();
    expect(document.querySelector('#perfil-cuenta [data-action="subirNube"]')).toBeNull();
    expect(document.querySelector('#perfil-cuenta [data-action="salirCuenta"]')).toBeNull();
  });

  it("sin Firebase explica por qué no hay cuenta", () => {
    const ui = montar();
    ui.render({ nombre: "Diego", email: null, cuentaEstado: "no-disponible", perfil: PERFIL_BASE });
    expect(document.querySelector("#perfil-cuenta").textContent).toContain("Sin cuenta");
    expect(document.querySelector('#perfil-cuenta [data-action="irCuenta"]')).toBeNull();
    expect(document.querySelector('#perfil-cuenta [data-action="subirNube"]')).toBeNull();
  });

  it("hero conserva anillo y chips con iconos SVG, sin emojis", () => {
    const ui = montar();
    ui.render({ nombre: "Ana", email: null, cuentaEstado: "invitado", perfil: PERFIL_BASE });
    // Variante hero con más aire sobre el mismo anillo + chips del home.
    expect(document.querySelector("#perfil-identidad .perfil-card--hero")).toBeTruthy();
    expect(document.querySelector('#perfil-identidad [role="progressbar"]')).toBeTruthy();
    // Los iconos son SVG del set propio, con texto real al lado (sin emoji).
    const chips = document.querySelector("#perfil-identidad").innerHTML;
    expect(chips).toContain("<svg");
    expect(chips).not.toContain("🔥");
    expect(chips).not.toContain("🏅");
  });

});
