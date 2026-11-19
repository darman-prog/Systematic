// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { crearEstudioUI } from "./estudio.js";

const bancoDemo = [
  {
    id: "Q-01",
    parcial: "Parcial 1",
    tema: "POO",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué es el polimorfismo?",
    options: ["Un bucle", "Tratar objetos distintos bajo una misma interfaz", "Una tabla SQL"],
    correct: 1,
    exp: "Permite operar sobre una abstracción común."
  },
  {
    id: "Q-02",
    parcial: "Parcial 1",
    tema: "SOLID",
    dificultad: "media",
    tipo: "vf",
    q: "SRP indica que una clase debe tener una única razón para cambiar.",
    options: ["Verdadero", "Falso"],
    correct: 0,
    exp: "Cada clase se enfoca en una sola responsabilidad."
  }
];

function montarDOM() {
  document.body.innerHTML = `
    <input id="study-search" type="search" />
    <div id="study-filtros"></div>
    <div id="study-temas"></div>
    <p id="study-count"></p>
    <button id="study-toggle-all" type="button">Revelar todas</button>
    <div id="study-list"></div>
  `;
}

beforeEach(() => {
  montarDOM();
});

describe("crearEstudioUI", () => {
  it("renderiza tarjetas cerradas por defecto y despliega/oculta el cajón con aria-expanded", () => {
    const estadoP = { "Q-01": { marked: false }, "Q-02": { marked: true } };
    const ui = crearEstudioUI({
      ctx: { materia: { id: "asw", coloresTema: { POO: "#38bdf8" } }, banco: bancoDemo },
      obtenerP: id => estadoP[id] || { marked: false },
      toggleMarked: id => { estadoP[id].marked = !estadoP[id].marked; },
      mostrarPantalla: vi.fn()
    });

    ui.startStudy();

    const items = document.querySelectorAll("#study-list .study-item");
    expect(items).toHaveLength(2);
    expect(items[0].classList.contains("revealed")).toBe(false);

    const btnToggle = /** @type {HTMLButtonElement} */ (items[0].querySelector(".study-toggle-btn"));
    expect(btnToggle.getAttribute("aria-expanded")).toBe("false");
    expect(btnToggle.textContent).toBe("Mostrar respuesta");

    ui.toggleStudy(btnToggle);
    expect(items[0].classList.contains("revealed")).toBe(true);
    expect(btnToggle.getAttribute("aria-expanded")).toBe("true");
    expect(btnToggle.textContent).toBe("Ocultar respuesta");

    // Marcar la estrella no debe cerrar las tarjetas que ya estaban reveladas.
    ui.toggleMarcadaEstudio("Q-01");
    const itemRecreado = document.getElementById("study-Q-01");
    expect(itemRecreado.classList.contains("revealed")).toBe(true);
  });

  it("filtra por tema, por marcadas y permite revelar/ocultar todas las visibles", () => {
    const estadoP = { "Q-01": { marked: false }, "Q-02": { marked: true } };
    const ui = crearEstudioUI({
      ctx: { materia: { id: "asw" }, banco: bancoDemo },
      obtenerP: id => estadoP[id] || { marked: false },
      toggleMarked: id => { estadoP[id].marked = !estadoP[id].marked; },
      mostrarPantalla: vi.fn()
    });

    ui.startStudy();
    ui.cambiarEstudioTema("SOLID");
    expect(document.querySelectorAll("#study-list .study-item")).toHaveLength(1);
    expect(document.querySelector("#study-list .study-question").textContent).toContain("SRP");

    ui.limpiarEstudioFiltros();
    expect(document.querySelectorAll("#study-list .study-item")).toHaveLength(2);

    ui.toggleSoloMarcadas();
    expect(document.querySelectorAll("#study-list .study-item")).toHaveLength(1);
    expect(document.getElementById("study-Q-02")).not.toBeNull();

    ui.toggleSoloMarcadas();
    ui.toggleRevelarTodas();
    expect(document.querySelectorAll("#study-list .study-item.revealed")).toHaveLength(2);
    expect(document.getElementById("study-toggle-all").textContent).toBe("Ocultar todas");

    ui.toggleRevelarTodas();
    expect(document.querySelectorAll("#study-list .study-item.revealed")).toHaveLength(0);
    expect(document.getElementById("study-toggle-all").textContent).toBe("Revelar todas");
  });
});
