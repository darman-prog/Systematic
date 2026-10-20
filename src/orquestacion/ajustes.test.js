import { describe, it, expect, vi } from "vitest";
import { crearAjustes } from "./ajustes.js";

function montar(over = {}) {
  const confirm = { pedirConfirmacion: vi.fn(async () => true) };
  const avance = { borrarHistorial: vi.fn(), reiniciar: vi.fn(), progreso: {}, historial: () => [], actividad: () => ({}), meta: () => 20 };
  const track = { materia: { id: "bd2", nombre: "BD2" }, lenguaje: null };
  const persistencia = { nombre: () => "Ana", competencia: () => ({}) };
  const renderStats = vi.fn();
  const renderHistory = vi.fn();
  const irHome = vi.fn();
  const refrescarLenguaje = vi.fn();
  const descargar = vi.fn();
  const $ = vi.fn(() => ({ click: vi.fn() }));
  const ajustes = crearAjustes({
    $, persistencia, track, avance, confirm,
    renderStats, renderHistory, irHome, refrescarLenguaje, descargar,
    ...over
  });
  return { ajustes, confirm, avance, track, persistencia, renderStats, renderHistory, irHome, descargar, $ };
}

describe("ajustes", () => {
  it("borra el historial solo si se confirma", async () => {
    const { ajustes, avance, renderStats, renderHistory } = montar();
    ajustes.clearHistory();
    await Promise.resolve();
    expect(avance.borrarHistorial).toHaveBeenCalled();
    expect(renderHistory).toHaveBeenCalled();
    expect(renderStats).toHaveBeenCalled();
  });

  it("no borra el historial si se cancela", async () => {
    const { ajustes, avance } = montar({
      confirm: { pedirConfirmacion: vi.fn(async () => false) }
    });
    ajustes.clearHistory();
    await Promise.resolve();
    expect(avance.borrarHistorial).not.toHaveBeenCalled();
  });

  it("reinicia el progreso solo si se confirma", async () => {
    const { ajustes, avance, renderStats, renderHistory } = montar();
    ajustes.resetProgreso();
    await Promise.resolve();
    expect(avance.reiniciar).toHaveBeenCalled();
    expect(renderStats).toHaveBeenCalled();
    expect(renderHistory).toHaveBeenCalled();
  });

  it("exporta el track activo con nombre de archivo", () => {
    const { ajustes, descargar } = montar();
    ajustes.exportarDatos();
    expect(descargar).toHaveBeenCalledTimes(1);
    const [datos, nombre] = descargar.mock.calls[0];
    expect(datos).toMatchObject({ app: "systematic", version: 2, materia: "bd2" });
    expect(nombre).toMatch(/^systematic-bd2-\d{4}-\d{2}-\d{2}\.json$/);
  });

  it("no exporta sin track activo", () => {
    const { ajustes, descargar } = montar({
      track: { materia: null, lenguaje: null }
    });
    ajustes.exportarDatos();
    expect(descargar).not.toHaveBeenCalled();
  });

  it("expone las acciones de la delegación", () => {
    const { ajustes, $ } = montar();
    expect(typeof ajustes.acciones.exportarDatos).toBe("function");
    expect(typeof ajustes.acciones.importarArchivo).toBe("function");
    ajustes.acciones.importarArchivo();
    expect($).toHaveBeenCalledWith("import-file");
  });
});
