// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { crearFlashcardsUI } from "./flashcards.js";

const bancoDemo = [
  {
    id: "F-01",
    parcial: "Parcial 1",
    tema: "POO",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué pilar esconde el estado interno?",
    options: ["Herencia", "Encapsulación", "Polimorfismo"],
    correct: 1,
    exp: "Exponer solo una interfaz pública controlada."
  },
  {
    id: "F-02",
    parcial: "Parcial 1",
    tema: "SOLID",
    dificultad: "media",
    tipo: "vf",
    q: "OCP propone abrir a extensión y cerrar a modificación.",
    options: ["Verdadero", "Falso"],
    correct: 0,
    exp: "Permite extender comportamiento sin editar código probado."
  },
  {
    id: "F-03",
    parcial: "Parcial 1",
    tema: "SOLID",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué significa la D en SOLID?",
    options: ["Inversión de dependencias", "Duplicación de datos", "Diseño directo"],
    correct: 0,
    exp: "Depender de abstracciones y no de concreciones."
  }
];

const bancoOrdenar = [
  {
    id: "F-ORD-1",
    parcial: "Parcial 1",
    tema: "Patrones",
    dificultad: "media",
    tipo: "ordenar",
    q: "Ordena los pasos del flujo:",
    bloques: ["Abrir", "Procesar", "Cerrar"],
    exp: "Primero se abre, luego se procesa y al final se cierra."
  }
];

beforeEach(() => {
  document.body.innerHTML = '<div id="flash-area"></div>';
});

describe("crearFlashcardsUI", () => {
  it("renderiza el mazo apilado físico, voltea en sitio y descarta lateralmente al responder", () => {
    const registrarRespuesta = vi.fn();
    const ui = crearFlashcardsUI({
      ctx: { materia: { id: "asw" }, banco: bancoDemo },
      obtenerP: () => ({ seen: 0, ok: 0, marked: false }),
      registrarRespuesta,
      mostrarPantalla: vi.fn()
    });

    ui.startFlashcards();

    expect(document.querySelector(".flash-deck-stack").getAttribute("data-pila")).toBe("2");
    expect(document.querySelectorAll(".flash-card-under")).toHaveLength(2);
    expect(document.querySelector(".flash-card-inner").classList.contains("flipped")).toBe(false);

    // Volteo bidireccional preservando el nodo para animar el giro 3D.
    const innerInicial = document.querySelector(".flash-card-inner");
    ui.voltearFlash();
    expect(document.querySelector(".flash-card-inner")).toBe(innerInicial);
    expect(innerInicial.classList.contains("flipped")).toBe(true);
    ui.voltearFlash();
    expect(innerInicial.classList.contains("flipped")).toBe(false);
    ui.voltearFlash();

    // Al responder 'Sabía', avanza a la tarjeta 2, muestra la saliente verde y baja la pila a 1.
    ui.responderFlash(true);
    expect(registrarRespuesta).toHaveBeenCalledTimes(1);
    expect(document.getElementById("flash-area").textContent).toContain("Tarjeta 2 de 3");
    expect(document.querySelector(".flash-card-discard.flash-discard--ok")).not.toBeNull();
    expect(document.querySelectorAll(".flash-card-under")).toHaveLength(1);
    expect(document.querySelector(".flash-deck-stack").getAttribute("data-pila")).toBe("1");

    // Retroceder a la tarjeta 1 y volver a responder no duplica llamadas ni infla aciertos.
    ui.anteriorFlash();
    expect(document.getElementById("flash-area").textContent).toContain("Tarjeta 1 de 3");
    ui.voltearFlash();
    ui.responderFlash(true);
    expect(registrarRespuesta).toHaveBeenCalledTimes(1);
    expect(document.querySelector(".flash-score-pill--ok").textContent.trim()).toBe("1");
  });

  it("filtra el mazo por tema, soporta atajos y permite repasar solo las falladas", () => {
    const ui = crearFlashcardsUI({
      ctx: { materia: { id: "asw" }, banco: bancoDemo },
      obtenerP: () => ({ seen: 0, ok: 0, marked: false }),
      registrarRespuesta: vi.fn(),
      mostrarPantalla: vi.fn()
    });

    ui.startFlashcards();
    ui.cambiarFlashTema("SOLID");
    expect(document.getElementById("flash-area").textContent).toContain("Tarjeta 1 de 2");

    // Primera tarjeta: Espacio voltea y ArrowRight marca 'Sabía'.
    ui.manejarTecla({ key: " ", preventDefault: vi.fn() });
    expect(document.querySelector(".flash-card-inner").classList.contains("flipped")).toBe(true);
    ui.manejarTecla({ key: "ArrowRight", preventDefault: vi.fn() });

    // Segunda tarjeta: Espacio voltea y ArrowLeft marca 'No sabía' y cierra la ronda.
    ui.manejarTecla({ key: " ", preventDefault: vi.fn() });
    ui.manejarTecla({ key: "ArrowLeft", preventDefault: vi.fn() });

    const resumen = document.getElementById("flash-area").textContent;
    expect(resumen).toContain("Ronda de flashcards terminada");
    expect(resumen).toContain("Repasar las que fallé (1)");

    // Repasar falladas arma una nueva ronda solo con la tarjeta fallada.
    ui.repasarFalladasFlash();
    expect(document.getElementById("flash-area").textContent).toContain("Tarjeta 1 de 1");
    expect(document.querySelector(".flash-deck-stack").getAttribute("data-pila")).toBe("0");
  });

  it("permite reordenar bloques con teclado en tarjetas de tipo ordenar y valida al voltear", () => {
    const ui = crearFlashcardsUI({
      ctx: { materia: { id: "asw" }, banco: bancoOrdenar },
      obtenerP: () => ({ seen: 0, ok: 0, marked: false }),
      registrarRespuesta: vi.fn(),
      mostrarPantalla: vi.fn()
    });

    ui.startFlashcards();
    const items = () => [...document.querySelectorAll(".flash-order-item")];
    expect(items()).toHaveLength(3);

    // Mueve el segundo bloque hacia arriba usando ArrowUp.
    const segundoTexto = items()[1].dataset.bloqueTexto;
    items()[1].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    expect(items()[0].dataset.bloqueTexto).toBe(segundoTexto);

    // Alinea los bloques en el orden correcto ["Abrir", "Procesar", "Cerrar"] mediante teclado.
    const objetivo = ["Abrir", "Procesar", "Cerrar"];
    objetivo.forEach((texto, posDeseada) => {
      let idxActual = items().findIndex(li => li.dataset.bloqueTexto === texto);
      while (idxActual > posDeseada) {
        items()[idxActual].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
        idxActual--;
      }
    });

    ui.voltearFlash();
    const feedback = document.querySelector(".flash-order-check");
    expect(feedback.classList.contains("is-ok")).toBe(true);
    expect(feedback.textContent).toContain("Tu orden coincide con la respuesta.");
  });
});
