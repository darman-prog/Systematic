// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { crearDashboard } from "./dashboard.js";

function montar(over = {}) {
  const elements = {
    "btn-etapas": { classList: { toggle: vi.fn() } },
    continuidad: { innerHTML: "" }
  };
  const ui = {
    pintarPortada: vi.fn(),
    aplicarAcento: vi.fn(),
    pintarTiposPanel: vi.fn(),
    pintarContinuidad: vi.fn(),
    renderStats: vi.fn(),
    renderHistory: vi.fn()
  };
  const track = {
    materia: { id: "bd2", nombre: "BD2" },
    banco: [],
    lenguaje: null,
    seleccionarMateria: vi.fn(async () => true),
    seleccionarLenguaje: vi.fn(async () => true),
    limpiarLenguaje: vi.fn(),
    ...over.track
  };
  const avance = {
    obtenerP: vi.fn(() => ({ ok: 0, fail: 0, box: 1, last: null, lastOk: null, marked: false })),
    historial: vi.fn(() => []),
    actividad: vi.fn(() => ({})),
    meta: vi.fn(() => 20),
    cambiarMeta: vi.fn(),
    ...over.avance
  };
  const deps = {
    $: id => elements[id] || null,
    persistencia: { nombre: () => "Ana", migrarLegacy: vi.fn() },
    track,
    avance,
    home: { renderMaterias: vi.fn() },
    show: vi.fn(),
    config: { renderConfig: vi.fn() },
    sesiones: { limpiar: vi.fn() },
    apuntesUI: { resetTema: vi.fn() },
    lenguaje: { pintar: vi.fn() },
    glosarioUI: { renderTip: vi.fn() },
    clearTimer: vi.fn(),
    alCambiarTrack: vi.fn(),
    diagramasDisponibles: () => true,
    ui,
    hoy: () => "2026-10-20",
    ...over.deps
  };
  const dashboard = crearDashboard(deps);
  return { dashboard, deps, ui, track, avance, elements };
}

describe("dashboard", () => {
  beforeEach(() => { document.head.innerHTML = ""; });

  it("goHome pinta portada, continuidad, stats, historial, tipos y glosario", () => {
    const { dashboard, deps, ui, elements } = montar();
    dashboard.goHome();
    expect(ui.pintarPortada).toHaveBeenCalled();
    expect(deps.show).toHaveBeenCalledWith("start");
    expect(ui.renderStats).toHaveBeenCalled();
    expect(ui.renderHistory).toHaveBeenCalled();
    expect(ui.pintarTiposPanel).toHaveBeenCalledWith(deps.$, deps.track, deps.diagramasDisponibles);
    expect(deps.glosarioUI.renderTip).toHaveBeenCalled();
    expect(elements["btn-etapas"].classList.toggle).toHaveBeenCalledWith("hidden", true);
  });

  it("renderContinuidad calcula hoy, ayer y hace N dias", () => {
    const { dashboard, ui, avance, track } = montar();
    track.banco = [{ id: "q1" }];
    avance.obtenerP = () => ({ ok: 0, fail: 1, box: 1, last: null, lastOk: false, marked: false });
    avance.actividad = () => ({ "2026-10-20": 2 });

    dashboard.renderContinuidad();
    expect(ui.pintarContinuidad).toHaveBeenLastCalledWith(expect.anything(), { cuando: "hoy", debiles: 1 });

    avance.actividad = () => ({ "2026-10-19": 2 });
    dashboard.renderContinuidad();
    expect(ui.pintarContinuidad).toHaveBeenLastCalledWith(expect.anything(), { cuando: "ayer", debiles: 1 });

    avance.actividad = () => ({ "2026-10-17": 2 });
    dashboard.renderContinuidad();
    expect(ui.pintarContinuidad).toHaveBeenLastCalledWith(expect.anything(), { cuando: "hace 3 días", debiles: 1 });
  });

  it("renderContinuidad limpia el slot sin actividad", () => {
    const { dashboard, ui, elements } = montar();
    dashboard.renderContinuidad();
    expect(elements.continuidad.innerHTML).toBe("");
    expect(ui.pintarContinuidad).not.toHaveBeenCalled();
  });

  it("renderStats delega datos y refresca al cambiar la meta", () => {
    const { dashboard, ui, avance, track } = montar();
    dashboard.renderStats();
    const llamada = ui.renderStats.mock.calls[0][0];
    expect(llamada.materia).toBe(track.materia);
    expect(llamada.obtenerP).toBe(avance.obtenerP);
    llamada.onCambiarMeta(30);
    expect(avance.cambiarMeta).toHaveBeenCalledWith(30);
    expect(ui.renderStats).toHaveBeenCalledTimes(2);
  });

  it("seleccionarMateria actualiza acento, migra, recarga y vuelve al home", async () => {
    const { dashboard, deps, ui } = montar();
    await dashboard.seleccionarMateria("bd2");
    expect(ui.aplicarAcento).toHaveBeenCalledWith(deps.track.materia);
    expect(deps.persistencia.migrarLegacy).toHaveBeenCalledWith("bd2");
    expect(deps.alCambiarTrack).toHaveBeenCalledWith("bd2");
    expect(deps.config.renderConfig).toHaveBeenCalled();
    expect(ui.pintarPortada).toHaveBeenCalled();
    expect(deps.show).toHaveBeenCalledWith("start");
  });

  it("seleccionarMateria no hace nada si el track falla", async () => {
    const { dashboard, deps, ui } = montar({
      track: { seleccionarMateria: vi.fn(async () => false) }
    });
    await dashboard.seleccionarMateria("bd2");
    expect(ui.aplicarAcento).not.toHaveBeenCalled();
    expect(deps.show).not.toHaveBeenCalled();
  });

  it("seleccionarLenguaje recarga progreso, resetea apuntes y pinta el lenguaje", async () => {
    const { dashboard, deps, ui, track } = montar();
    track.lenguaje = { id: "lenguaje-ts" };
    await dashboard.seleccionarLenguaje("lenguaje-ts");
    expect(deps.alCambiarTrack).toHaveBeenCalledWith("lenguaje-ts");
    expect(deps.apuntesUI.resetTema).toHaveBeenCalled();
    expect(ui.aplicarAcento).toHaveBeenCalledWith(track.lenguaje);
    expect(ui.pintarPortada).toHaveBeenCalled();
    expect(deps.lenguaje.pintar).toHaveBeenCalled();
    expect(deps.show).toHaveBeenCalledWith("lenguaje");
  });

  it("irMaterias limpia timers, sesion y lenguaje", () => {
    const { dashboard, deps, ui } = montar();
    dashboard.irMaterias();
    expect(deps.clearTimer).toHaveBeenCalled();
    expect(deps.sesiones.limpiar).toHaveBeenCalled();
    expect(deps.track.limpiarLenguaje).toHaveBeenCalled();
    expect(ui.aplicarAcento).toHaveBeenCalledWith(null);
    expect(deps.show).toHaveBeenCalledWith("materias");
    expect(deps.home.renderMaterias).toHaveBeenCalled();
  });
});
