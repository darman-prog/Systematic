import { describe, it, expect, vi } from "vitest";
import { crearRespuesta } from "./quiz.js";

function montar(over = {}) {
  const avance = { registrar: vi.fn() };
  const sesiones = { sesion: { modo: "practica" }, responder: vi.fn() };
  const alApagarTimer = vi.fn();
  const alPerderVida = vi.fn();
  const registrar = crearRespuesta({ avance, sesiones, alApagarTimer, alPerderVida, ...over });
  return { registrar, avance, sesiones, alApagarTimer, alPerderVida };
}

describe("crearRespuesta", () => {
  it("persiste el avance y delega la sesión", () => {
    const { registrar, avance, sesiones } = montar();
    registrar("q1", true);
    expect(avance.registrar).toHaveBeenCalledWith("q1", true);
    expect(sesiones.responder).toHaveBeenCalledWith("q1", true);
  });

  it("apaga el timer de contrarreloj", () => {
    const { registrar, sesiones, alApagarTimer } = montar();
    sesiones.sesion = { modo: "contrarreloj" };
    registrar("q1", true);
    expect(alApagarTimer).toHaveBeenCalled();
  });

  it("repinta vidas en supervivencia", () => {
    const { registrar, sesiones, alPerderVida } = montar();
    sesiones.sesion = { modo: "supervivencia" };
    registrar("q1", false);
    expect(alPerderVida).toHaveBeenCalled();
  });

  it("no dispara callbacks de modo en practica", () => {
    const { registrar, alApagarTimer, alPerderVida } = montar();
    registrar("q1", true);
    expect(alApagarTimer).not.toHaveBeenCalled();
    expect(alPerderVida).not.toHaveBeenCalled();
  });
});
