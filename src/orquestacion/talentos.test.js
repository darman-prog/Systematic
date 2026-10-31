import { describe, it, expect, vi } from "vitest";
import { crearTalentos } from "./talentos.js";

const ARBOL = {
  ejes: ["Modelado", "Integridad", "Optimización", "Consultas SQL", "NoSQL"],
  ramas: [
    {
      id: "r1",
      nombre: "Rama 1",
      descripcion: "Desc",
      nodos: [
        {
          id: "TAL-01",
          nombre: "Arquitecto ER",
          descripcion: "Desc",
          eje: "Modelado",
          puntosRadar: 100,
          titulo: "Arquitecto de Esquemas ER",
          misionesRequeridas: ["Modelado"],
          minEstrellas: 1,
          bossId: "ESC-BD2-01",
          bossTipo: "escenario"
        }
      ]
    }
  ]
};

function montar({ misiones = {}, escenarios = {}, casos = {}, talentos = {}, titulo = "" } = {}) {
  const storeTalentos = Object.assign({}, talentos);
  let tituloActual = titulo;
  const persistencia = {
    misiones: vi.fn(() => misiones),
    escenarios: vi.fn(() => escenarios),
    casos: vi.fn(() => casos),
    talentos: vi.fn(() => storeTalentos),
    guardarTalento: vi.fn((matId, id, reg) => { storeTalentos[id] = reg; }),
    tituloActivo: vi.fn(() => tituloActual),
    guardarTituloActivo: vi.fn(t => { tituloActual = t; })
  };
  const gamificacion = { sumarXp: vi.fn() };
  const escCtl = { jugar: vi.fn() };
  const casCtl = { jugar: vi.fn() };
  const show = vi.fn();
  const pintar = vi.fn();
  const alDesbloquear = vi.fn();
  const alEquiparTitulo = vi.fn();

  const ctl = crearTalentos({
    persistencia,
    track: { materia: { id: "bd2", nombre: "BD2", talentos: ARBOL } },
    gamificacion,
    sesiones: { limpiar: vi.fn() },
    show,
    clearTimer: vi.fn(),
    clearTimerPregunta: vi.fn(),
    escenarios: escCtl,
    casos: casCtl,
    alDesbloquear,
    alEquiparTitulo,
    pintar,
    ahora: () => 1700000000000
  });

  return { ctl, persistencia, gamificacion, escCtl, casCtl, show, pintar, alDesbloquear, alEquiparTitulo };
}

describe("orquestacion/talentos", () => {
  it("sincroniza, otorga XP y equipa el primer título al cumplir requisitos y Boss Battle", () => {
    const { ctl, persistencia, gamificacion, alDesbloquear } = montar({
      misiones: { Modelado: { estrellas: 2, mejorPct: 80 } },
      escenarios: { "ESC-BD2-01": { mejorRating: "exito", jugadas: 1 } }
    });

    const nuevos = ctl.sincronizarDesbloqueos();
    expect(nuevos).toHaveLength(1);
    expect(persistencia.guardarTalento).toHaveBeenCalledWith("bd2", "TAL-01", { fecha: 1700000000000 });
    expect(persistencia.guardarTituloActivo).toHaveBeenCalledWith("Arquitecto de Esquemas ER");
    expect(gamificacion.sumarXp).toHaveBeenCalledWith(100);
    expect(alDesbloquear).toHaveBeenCalledWith(expect.objectContaining({ id: "TAL-01" }));
  });

  it("navega a la pantalla de talentos y renderiza el estado", () => {
    const { ctl, show, pintar } = montar();
    ctl.ir();
    expect(show).toHaveBeenCalledWith("talentos");
    expect(pintar).toHaveBeenCalled();
  });

  it("redirige al escenario o caso correspondiente al afrontar Boss Battle", () => {
    const { ctl, escCtl, casCtl } = montar();
    ctl.afrontarBoss({ bossId: "ESC-BD2-01", bossTipo: "escenario" });
    expect(escCtl.jugar).toHaveBeenCalledWith("ESC-BD2-01");

    ctl.afrontarBoss({ bossId: "CASO-BD2-01", bossTipo: "caso" });
    expect(casCtl.jugar).toHaveBeenCalledWith("CASO-BD2-01");
  });
});
