import { describe, it, expect, vi } from "vitest";
import { crearEscenarios } from "./escenarios.js";

const ESCENARIO_MOCK = {
  id: "ESC-TEST-01",
  titulo: "Escenario de Prueba",
  tema: "Arquitectura",
  intro: "Intro",
  pasos: [
    {
      id: "p1",
      tema: "Hexagonal",
      narrativa: "Paso 1",
      variantes: ["Variante 1"],
      lentes: { negocio: "Lente negocio", calidad: "Lente calidad" },
      opciones: [
        { texto: "Opción A", feedback: "Bien", puntos: 2, siguiente: "p2" },
        { texto: "Opción B", feedback: "Mal", puntos: 0, siguiente: "p2", autopsia: { incidente: "I", trampa: "T", principio: "P" } }
      ]
    },
    {
      id: "p2",
      tema: "Microservicios",
      narrativa: "Paso 2",
      opciones: [
        { texto: "Opción Fin", feedback: "Cierre", puntos: 2, siguiente: "fin" }
      ]
    }
  ],
  finales: { exito: "Éxito", parcial: "Parcial", fracaso: "Fracaso" }
};

function montar({ registros = {} } = {}) {
  const store = Object.assign({}, registros);
  const persistencia = {
    escenarios: vi.fn(() => store),
    guardarEscenarios: vi.fn(r => Object.assign(store, r))
  };
  const gamificacion = {
    sumarXp: vi.fn(),
    revisarLogros: vi.fn()
  };
  const show = vi.fn();
  const pintarLista = vi.fn();
  const pintar = vi.fn();
  const alFinalizar = vi.fn();
  const elements = { "escenario-titulo": { textContent: "" } };
  const $ = vi.fn(id => elements[id] || { textContent: "" });

  const track = {
    materia: {
      escenarios: [ESCENARIO_MOCK]
    }
  };

  const ctl = crearEscenarios({
    $, track, persistencia, gamificacion, show,
    alFinalizar, pintarLista, pintar
  });

  return { ctl, persistencia, gamificacion, show, pintarLista, pintar, alFinalizar, elements };
}

describe("orquestación de escenarios", () => {
  it("start() muestra la pantalla de lista y la dibuja con los registros existentes", () => {
    const { ctl, show, pintarLista } = montar({ registros: { "ESC-TEST-01": { mejorRating: "exito" } } });
    ctl.start();
    expect(show).toHaveBeenCalledWith("escenarios");
    expect(pintarLista).toHaveBeenCalledWith([ESCENARIO_MOCK], { "ESC-TEST-01": { mejorRating: "exito" } });
  });

  it("jugar() inicia en modo estudio, actualiza el título del DOM y renderiza", () => {
    const { ctl, show, pintar, elements } = montar();
    ctl.jugar("ESC-TEST-01", "estudio");
    expect(elements["escenario-titulo"].textContent).toBe("Escenario de Prueba");
    expect(show).toHaveBeenCalledWith("escenario");
    expect(pintar).toHaveBeenCalledWith(ESCENARIO_MOCK, expect.objectContaining({
      escenarioId: "ESC-TEST-01",
      modo: "estudio",
      pasoId: "p1"
    }));
  });

  it("flujo completo de estudio: decidir, continuar y registrar fin", () => {
    const { ctl, pintar, gamificacion, persistencia, alFinalizar } = montar();
    ctl.jugar("ESC-TEST-01", "estudio");

    // Decidir paso 1 (opción 0 = 2 pts)
    ctl.decidir(0);
    expect(pintar).toHaveBeenLastCalledWith(ESCENARIO_MOCK, expect.objectContaining({
      puntos: 2,
      pendiente: expect.objectContaining({ texto: "Opción A" })
    }));

    // Continuar a paso 2
    ctl.continuar();
    expect(pintar).toHaveBeenLastCalledWith(ESCENARIO_MOCK, expect.objectContaining({
      pasoId: "p2",
      pendiente: null
    }));

    // Decidir paso 2 (opción 0 = fin)
    ctl.decidir(0);
    ctl.continuar();
    expect(pintar).toHaveBeenLastCalledWith(ESCENARIO_MOCK, expect.objectContaining({
      terminado: true,
      rating: "exito"
    }));

    // Verifica que se otorgó XP y se sincronizó el fin de la partida
    expect(gamificacion.sumarXp).toHaveBeenCalledWith(30);
    expect(persistencia.guardarEscenarios).toHaveBeenCalled();
    expect(alFinalizar).toHaveBeenCalled();
  });

  it("modo simulacro avanza de inmediato sin pausar y cierra en el último paso", () => {
    const { ctl, pintar, gamificacion } = montar();
    ctl.jugar("ESC-TEST-01", "simulacro");

    // Al decidir paso 1 en simulacro, avanza a p2 de inmediato sin pendiente
    ctl.decidir(0);
    expect(pintar).toHaveBeenLastCalledWith(ESCENARIO_MOCK, expect.objectContaining({
      pasoId: "p2",
      pendiente: null,
      terminado: false
    }));

    // Al decidir paso 2, concluye la partida de inmediato
    ctl.decidir(0);
    expect(pintar).toHaveBeenLastCalledWith(ESCENARIO_MOCK, expect.objectContaining({
      terminado: true,
      rating: "exito"
    }));
    expect(gamificacion.sumarXp).toHaveBeenCalled();
  });

  it("cambiarLente, alternarVariante y corregir delegan al motor y repintan", () => {
    const { ctl, pintar } = montar();
    ctl.jugar("ESC-TEST-01", "estudio");

    ctl.cambiarLente("negocio");
    expect(pintar).toHaveBeenLastCalledWith(ESCENARIO_MOCK, expect.objectContaining({
      lenteActivo: "negocio"
    }));

    ctl.alternarVariante();
    expect(pintar).toHaveBeenLastCalledWith(ESCENARIO_MOCK, expect.objectContaining({
      varianteIdx: 1
    }));

    // Jugamos fallando p1
    ctl.decidir(1);
    ctl.continuar();
    ctl.decidir(0);
    ctl.continuar();

    // Invocar corrección
    ctl.corregir();
    expect(pintar).toHaveBeenLastCalledWith(ESCENARIO_MOCK, expect.objectContaining({
      modoCorreccion: true,
      pasoId: "p1"
    }));
  });

  it("expone mapa de acciones delegadas para la UI", () => {
    const { ctl, show } = montar();
    ctl.acciones.startEscenarios();
    expect(show).toHaveBeenCalledWith("escenarios");

    ctl.acciones.jugarEscenario({ dataset: { id: "ESC-TEST-01", modo: "simulacro" } });
    expect(show).toHaveBeenCalledWith("escenario");

    ctl.acciones.cambiarLenteEscenario({ dataset: { lente: "calidad" } });
    ctl.acciones.alternarVarianteEscenario();
    ctl.acciones.decidirEscenario({ dataset: { idx: "0" } });
    ctl.acciones.continuarEscenario();
    ctl.acciones.corregirEscenario();
  });
});
