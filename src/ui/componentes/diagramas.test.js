// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { crearDiagramasUI } from "./diagramas.js";

const preguntaDemo = {
  id: "ASW-D1",
  tipo: "diagrama",
  subtipo: "uml-clases",
  q: "Modela el sistema de pagos",
  nodosPool: ["MetodoPago", "TarjetaCredito"],
  miembrosPool: [{ texto: "pagar()", de: "MetodoPago" }],
  relacionesEsperadas: [{ de: "TarjetaCredito", a: "MetodoPago", tipo: "herencia" }]
};

function configurarMatchMedia(esCoarse) {
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: esCoarse && (query.includes("pointer: coarse") || query.includes("hover: none")),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }));
}

describe("ui/componentes/diagramas (tap-tap y scroll)", () => {
  let estadoActual;
  let ui;
  let area;

  beforeEach(() => {
    document.body.innerHTML = '<div id="question-area"></div>';
    area = document.getElementById("question-area");
    estadoActual = null;
    ui = crearDiagramasUI({
      obtenerItem: () => preguntaDemo,
      obtenerEstado: () => estadoActual,
      guardarEstado: nuevo => { estadoActual = nuevo; }
    });
  });

  it("en puntero fino coloca el nodo con un solo clic sobre la pieza del pool", () => {
    configurarMatchMedia(false);
    ui.renderDiagrama(preguntaDemo, area);

    const pieza = /** @type {HTMLElement} */ (area.querySelector('#pool-diagrama [data-nodo="MetodoPago"]'));
    expect(pieza).not.toBeNull();

    pieza.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, clientX: 20, clientY: 20 }));
    window.dispatchEvent(new MouseEvent("pointerup", { bubbles: true, clientX: 20, clientY: 20 }));

    expect(estadoActual.nodosColocados).toContain("MetodoPago");
    expect(area.querySelector('.nodo-puesto[data-label="MetodoPago"]')).not.toBeNull();
  });

  it("en entorno táctil (pointer: coarse) usa tap-tap y suma scrollLeft/scrollTop al colocar en el papel", () => {
    configurarMatchMedia(true);
    ui.renderDiagrama(preguntaDemo, area);

    const lienzo = /** @type {HTMLElement} */ (document.getElementById("lienzo-diagrama"));
    const papel = /** @type {HTMLElement} */ (document.getElementById("lienzo-area"));
    // Simulamos rectángulo visible del contenedor y desplazamiento interno por scroll
    lienzo.getBoundingClientRect = () => /** @type {DOMRect} */ ({
      left: 10, top: 20, right: 370, bottom: 440, width: 360, height: 420, x: 10, y: 20, toJSON: () => ({})
    });
    Object.defineProperty(papel, "scrollWidth", { value: 720, configurable: true });
    Object.defineProperty(papel, "scrollHeight", { value: 520, configurable: true });
    lienzo.scrollLeft = 200;
    lienzo.scrollTop = 110;

    const pieza = /** @type {HTMLElement} */ (area.querySelector('#pool-diagrama [data-nodo="MetodoPago"]'));
    // Primer toque: selecciona el chip sin colocarlo todavía
    pieza.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, clientX: 30, clientY: 30 }));
    window.dispatchEvent(new MouseEvent("pointerup", { bubbles: true, clientX: 30, clientY: 30 }));

    expect(estadoActual.nodosColocados).toHaveLength(0);
    expect(pieza.getAttribute("aria-pressed")).toBe("true");
    expect(pieza.classList.contains("pieza-activa")).toBe(true);

    // Segundo toque en el papel en pantalla (clientX=160, clientY=180)
    // Coordenada en papel = (160 - 10) + 200 = 350, (180 - 20) + 110 = 270
    // Posición del nodo = (350 - 56 = 294, 270 - 20 = 250)
    lienzo.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, clientX: 160, clientY: 180 }));
    lienzo.dispatchEvent(new MouseEvent("pointerup", { bubbles: true, clientX: 160, clientY: 180 }));

    expect(estadoActual.nodosColocados).toContain("MetodoPago");
    expect(estadoActual.posiciones.MetodoPago).toEqual({ x: 294, y: 250 });
  });

  it("maneja pointercancel igual que pointerup y limpia el elemento fantasma", () => {
    configurarMatchMedia(true);
    ui.renderDiagrama(preguntaDemo, area);

    const pieza = /** @type {HTMLElement} */ (area.querySelector('#pool-diagrama [data-nodo="TarjetaCredito"]'));
    pieza.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, clientX: 40, clientY: 40 }));
    window.dispatchEvent(new MouseEvent("pointercancel", { bubbles: true, clientX: 40, clientY: 40 }));

    expect(document.getElementById("ghost-diagrama")).toBeNull();
    expect(pieza.getAttribute("aria-pressed")).toBe("true");
  });

  it("alterna entre las pestañas de Nodos y Miembros en el dock compacto", () => {
    configurarMatchMedia(true);
    ui.renderDiagrama(preguntaDemo, area);

    const tabNodos = /** @type {HTMLElement} */ (area.querySelector('[data-tab-pool="nodos"]'));
    const tabMiembros = /** @type {HTMLElement} */ (area.querySelector('[data-tab-pool="miembros"]'));
    const panelNodos = /** @type {HTMLElement} */ (area.querySelector('[data-panel-pool="nodos"]'));
    const panelMiembros = /** @type {HTMLElement} */ (area.querySelector('[data-panel-pool="miembros"]'));

    expect(tabNodos.getAttribute("aria-selected")).toBe("true");
    expect(panelNodos.classList.contains("panel-oculto-movil")).toBe(false);
    expect(panelMiembros.classList.contains("panel-oculto-movil")).toBe(true);

    tabMiembros.click();
    expect(tabMiembros.getAttribute("aria-selected")).toBe("true");
    expect(panelNodos.classList.contains("panel-oculto-movil")).toBe(true);
    expect(panelMiembros.classList.contains("panel-oculto-movil")).toBe(false);
  });
});
