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

  // Caracterización antes de dividir el módulo: coloca una pieza del pool con el
  // flujo pointerdown + pointerup (puntero fino) y devuelve el nodo montado.
  function colocarPieza(nombre) {
    const pieza = /** @type {HTMLElement} */ (area.querySelector('#pool-diagrama [data-nodo="' + nombre + '"]'));
    pieza.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, clientX: 20, clientY: 20 }));
    window.dispatchEvent(new MouseEvent("pointerup", { bubbles: true, clientX: 20, clientY: 20 }));
    return /** @type {HTMLElement} */ (area.querySelector('.nodo-puesto[data-label="' + nombre + '"]'));
  }

  function tocarNodo(nombre) {
    const nodo = /** @type {HTMLElement} */ (area.querySelector('.nodo-puesto[data-label="' + nombre + '"]'));
    nodo.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, clientX: 40, clientY: 40 }));
    nodo.dispatchEvent(new MouseEvent("pointerup", { bubbles: true, clientX: 40, clientY: 40 }));
  }

  it("conecta dos nodos eligiendo el tipo de relación", () => {
    configurarMatchMedia(false);
    ui.renderDiagrama(preguntaDemo, area);
    colocarPieza("MetodoPago");
    colocarPieza("TarjetaCredito");

    tocarNodo("TarjetaCredito");
    tocarNodo("MetodoPago");
    const tipo = /** @type {HTMLElement} */ (area.querySelector('[data-arista="herencia"]'));
    expect(tipo).not.toBeNull();
    tipo.click();

    expect(estadoActual.conexiones).toEqual([
      { de: "TarjetaCredito", a: "MetodoPago", tipo: "herencia" }
    ]);
    expect(area.querySelectorAll(".etiqueta-arista").length).toBe(1);
  });

  it("asigna un miembro a su clase con tap-tap", () => {
    configurarMatchMedia(false);
    ui.renderDiagrama(preguntaDemo, area);
    colocarPieza("MetodoPago");

    const miembro = /** @type {HTMLElement} */ (area.querySelector('[data-miembro="pagar()"]'));
    miembro.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, clientX: 20, clientY: 20 }));
    window.dispatchEvent(new MouseEvent("pointerup", { bubbles: true, clientX: 20, clientY: 20 }));
    expect(miembro.getAttribute("aria-pressed")).toBe("true");

    tocarNodo("MetodoPago");
    expect(estadoActual.miembros["pagar()"]).toBe("MetodoPago");
    expect(area.querySelector("#contador-miembros").textContent).toBe("1/1");
  });

  it("quita un nodo colocado con el botón × y actualiza contadores", () => {
    configurarMatchMedia(false);
    ui.renderDiagrama(preguntaDemo, area);
    colocarPieza("MetodoPago");
    expect(area.querySelector("#contador-nodos").textContent).toBe("1/2");

    const quitar = /** @type {HTMLElement} */ (area.querySelector('.nodo-puesto[data-label="MetodoPago"] .nodo-quitar'));
    quitar.click();

    expect(estadoActual.nodosColocados).not.toContain("MetodoPago");
    expect(estadoActual.nodosDisponibles).toContain("MetodoPago");
    expect(area.querySelector("#contador-nodos").textContent).toBe("0/2");
  });
});
