// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderStats, renderHistory } from "./stats.js";

const banco = [
  { id: "q1", tema: "SQL", parcial: "Parcial 1", dificultad: "facil", tipo: "multiple" },
  { id: "q2", tema: "NoSQL", parcial: "Parcial 1", dificultad: "media", tipo: "multiple" }
];

const progreso = {
  q1: { ok: 2, fail: 0, box: 3, last: Date.now(), lastOk: true, marked: false },
  q2: { ok: 0, fail: 1, box: 1, last: Date.now(), lastOk: false, marked: false }
};

beforeEach(() => {
  document.body.innerHTML = `
    <div id="stats-panel"></div>
    <div id="stat-total"></div>
    <div id="stat-parciales"></div>
    <div id="stat-parciales-txt"></div>
    <div id="stat-temas"></div>
    <div id="history-section"></div>
  `;
});

describe("panel de estadísticas", () => {
  it("renderiza el hero, los KPIs y los contadores del encabezado", () => {
    renderStats({
      materia: { id: "bd2", nombre: "Base de Datos 2", topicColors: {} },
      banco,
      obtenerP: id => progreso[id],
      historial: [{ date: new Date().toISOString(), score: 8, total: 10, modo: "practica" }],
      actividad: {},
      meta: 20
    });

    const panel = document.getElementById("stats-panel");
    expect(panel.textContent).toContain("Precisión global");
    expect(panel.textContent).toContain("Preguntas respondidas");
    expect(document.getElementById("stat-total").textContent).toBe("2");
    expect(panel.querySelector("#meta-input")).not.toBeNull();
  });

  it("notifica el cambio de meta con un número normalizado", () => {
    const onCambiarMeta = vi.fn();
    renderStats({
      materia: { id: "bd2", nombre: "Base de Datos 2", topicColors: {} },
      banco,
      obtenerP: id => progreso[id],
      historial: [],
      actividad: {},
      meta: 20,
      onCambiarMeta
    });

    const input = /** @type {HTMLInputElement} */ (document.getElementById("meta-input"));
    input.value = "35";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    expect(onCambiarMeta).toHaveBeenCalledWith(35);
  });

  it("pinta el historial y su estado vacío", () => {
    renderHistory(
      [
        { date: new Date().toISOString(), score: 8, total: 10, modo: "practica" },
        { date: new Date().toISOString(), score: 6, total: 10, modo: "simulacro" }
      ],
      null,
      "Ana"
    );
    expect(document.querySelectorAll("#history-section .history-row")).toHaveLength(2);

    renderHistory([], null, "Ana");
    expect(document.getElementById("history-section").textContent).toContain("Ana, aún no hay intentos registrados.");
  });
});
