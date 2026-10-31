// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { evaluarEstadoTalentos } from "../../core/index.js";
import { renderizarRadar } from "./radar.js";
import { pintarTalentos } from "../dashboard/talentos.js";

const ARBOL = {
  ejes: ["Modelado", "Integridad", "Optimización", "Consultas SQL", "NoSQL"],
  ramas: [
    {
      id: "r1",
      nombre: "Arquitectura Relacional",
      descripcion: "Modelado y llaves.",
      nodos: [
        {
          id: "TAL-1",
          nombre: "Arquitecto de Esquemas",
          descripcion: "Diseña esquemas ER.",
          eje: "Modelado",
          puntosRadar: 100,
          titulo: "Arquitecto ER",
          misionesRequeridas: ["Modelado"],
          minEstrellas: 2,
          bossId: "ESC-BD2-01",
          bossTipo: "escenario",
          bossNombre: "Incidente de Horarios"
        }
      ]
    }
  ]
};

describe("ui/componentes/radar y ui/dashboard/talentos", () => {
  it("renderizarRadar dibuja el SVG accesible y la lista de ejes", () => {
    const ev = evaluarEstadoTalentos(ARBOL, {}, {}, { "TAL-1": { fecha: 1 } });
    const html = renderizarRadar(ev, { materia: { nombre: "Base de Datos 2" } });
    expect(html).toContain("<svg");
    expect(html).toContain("Radar de Especialidades");
    expect(html).toContain("Modelado");
    expect(html).toContain("100%");
  });

  it("pintarTalentos muestra misiones pendientes con botón para practicar", () => {
    document.body.innerHTML = '<div id="talentos-vista"></div>';
    const ev = evaluarEstadoTalentos(ARBOL, {}, {}, {});
    pintarTalentos({ arbolEvaluado: ev, materia: { nombre: "BD2" }, tituloActivo: "" });

    const vista = document.querySelector("#talentos-vista");
    expect(vista?.textContent).toContain("Arquitecto de Esquemas");
    const btnMision = vista?.querySelector('[data-action="iniciarMision"]');
    expect(btnMision).toBeTruthy();
    expect(btnMision?.getAttribute("data-tema")).toBe("Modelado");
  });

  it("pintarTalentos ofrece botón afrontarBoss cuando el nodo está listo_para_boss", () => {
    document.body.innerHTML = '<div id="talentos-vista"></div>';
    const ev = evaluarEstadoTalentos(ARBOL, { Modelado: { estrellas: 2, mejorPct: 80 } }, {}, {});
    pintarTalentos({ arbolEvaluado: ev, materia: { nombre: "BD2" }, tituloActivo: "" });

    const btnBoss = document.querySelector('[data-action="afrontarBoss"]');
    expect(btnBoss).toBeTruthy();
    expect(btnBoss?.getAttribute("data-boss-id")).toBe("ESC-BD2-01");
    expect(btnBoss?.textContent).toContain("Afrontar Incidente de Horarios");
  });

  it("pintarTalentos permite equipar el título cuando el talento está desbloqueado", () => {
    document.body.innerHTML = '<div id="talentos-vista"></div>';
    const ev = evaluarEstadoTalentos(ARBOL, {}, {}, { "TAL-1": { fecha: 1 } });
    pintarTalentos({ arbolEvaluado: ev, materia: { nombre: "BD2" }, tituloActivo: "" });

    const btnEquipar = document.querySelector('[data-action="equiparTitulo"]');
    expect(btnEquipar).toBeTruthy();
    expect(btnEquipar?.getAttribute("data-titulo")).toBe("Arquitecto ER");
  });
});
