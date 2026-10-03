import { describe, it, expect } from "vitest";
import {
  umbralDeExamen,
  apruebaExamen,
  barraDeCompetencia,
  etapaDesbloqueada,
  registrarExamen,
} from "./competencia.js";

const etapas = [
  { id: "fundamentos", examen: { preguntas: ["TS-031", "TS-032"] } },
  { id: "funciones", examen: { preguntas: ["TS-033", "TS-034", "TS-035"] } },
  { id: "tipos", examen: { preguntas: Array.from({ length: 12 }, (_, i) => "T-" + i) } },
  { id: "asincronia", examen: { preguntas: ["A-1"] } },
  { id: "auditoria", examen: { preguntas: ["AU-1", "AU-2"] } },
];

describe("Competencia (dominio)", () => {
  describe("umbralDeExamen", () => {
    it("redondea hacia arriba con Math.ceil (evita coma flotante)", () => {
      // 12 preguntas al 80% = 9.6 → exige 10
      expect(umbralDeExamen(12, 0.8)).toBe(10);
      expect(umbralDeExamen(2, 0.8)).toBe(2);
      expect(umbralDeExamen(10, 0.8)).toBe(8);
    });

    it("devuelve 0 para totales inválidos", () => {
      expect(umbralDeExamen(0)).toBe(0);
      expect(umbralDeExamen(-5)).toBe(0);
      expect(umbralDeExamen(NaN)).toBe(0);
    });
  });

  describe("apruebaExamen", () => {
    it("aprueba cuando los aciertos alcanzan el umbral", () => {
      expect(apruebaExamen(10, 12, 0.8)).toBe(true); // justo en el umbral
      expect(apruebaExamen(8, 12, 0.8)).toBe(false); // 8 < 10
    });

    it("maneja edge cases", () => {
      expect(apruebaExamen(0, 10)).toBe(false);
      expect(apruebaExamen(-1, 10)).toBe(false);
      expect(apruebaExamen(5, 0)).toBe(false);
    });
  });

  describe("barraDeCompetencia", () => {
    it("calcula aprobadas / total", () => {
      const resultados = {
        fundamentos: { aprobado: true },
        funciones: { aprobado: true },
        tipos: { aprobado: false },
      };
      const barra = barraDeCompetencia(etapas, resultados);
      expect(barra.aprobadas).toBe(2);
      expect(barra.total).toBe(5);
      expect(barra.pct).toBeCloseTo(0.4);
    });

    it("barra vacía sin resultados", () => {
      const barra = barraDeCompetencia(etapas, {});
      expect(barra.aprobadas).toBe(0);
      expect(barra.pct).toBe(0);
    });

    it("barra vacía sin etapas", () => {
      const barra = barraDeCompetencia([], {});
      expect(barra.total).toBe(0);
    });
  });

  describe("etapaDesbloqueada", () => {
    it("la primera siempre está desbloqueada", () => {
      expect(etapaDesbloqueada(etapas, 0, {})).toBe(true);
    });

    it("bbloquea la etapa 5 (capstone) hasta aprobar la 4", () => {
      const resultados = {
        fundamentos: { aprobado: true },
        funciones: { aprobado: true },
        tipos: { aprobado: true },
        asincronia: { aprobado: false },
      };
      expect(etapaDesbloqueada(etapas, 4, resultados)).toBe(false);
      resultados.asincronia = { aprobado: true };
      expect(etapaDesbloqueada(etapas, 4, resultados)).toBe(true);
    });

    it("índice fuera de rango devuelve false", () => {
      expect(etapaDesbloqueada(etapas, 99, {})).toBe(false);
      expect(etapaDesbloqueada(etapas, -1, {})).toBe(false);
    });
  });

  describe("registrarExamen", () => {
    it("aprueba y registra con la versión del examen", () => {
      const etapas0 = [etapas[0]]; // 2 preguntas
      const resultados = registrarExamen({
        etapa: etapas0[0],
        resultados: {},
        aciertos: 2,
        versionExamen: 1,
      });
      expect(resultados.fundamentos.aprobado).toBe(true);
      expect(resultados.fundamentos.version).toBe(1);
      expect(resultados.fundamentos.intentos).toBe(1);
      expect(resultados.fundamentos.ultimoPct).toBe(1);
    });

    it("no aprueba y cuenta el intento", () => {
      const resultados = registrarExamen({
        etapa: etapas[0], // 2 preguntas
        resultados: {},
        aciertos: 1,
        versionExamen: 1,
      });
      expect(resultados.fundamentos.aprobado).toBe(false);
      expect(resultados.fundamentos.intentos).toBe(1);
      expect(resultados.fundamentos.ultimoPct).toBeCloseTo(0.5);
    });

    it("invalida un aprobado anterior si la versión del examen cambió", () => {
      const resultadosV1 = registrarExamen({
        etapa: etapas[0],
        resultados: {},
        aciertos: 2,
        versionExamen: 1,
      });
      expect(resultadosV1.fundamentos.aprobado).toBe(true);

      // Cambia la versión del examen: el aprobado se invalida aunque vuelva a aprobar.
      const resultadosV2 = registrarExamen({
        etapa: etapas[0],
        resultados: resultadosV1,
        aciertos: 2,
        versionExamen: 2,
      });
      expect(resultadosV2.fundamentos.aprobado).toBe(true); // aprobó de nuevo con v2
      expect(resultadosV2.fundamentos.version).toBe(2);
      expect(resultadosV2.fundamentos.intentos).toBe(2);
    });

    it("acumula intentos", () => {
      let r = {};
      r = registrarExamen({ etapa: etapas[0], resultados: r, aciertos: 0, versionExamen: 1 });
      r = registrarExamen({ etapa: etapas[0], resultados: r, aciertos: 1, versionExamen: 1 });
      r = registrarExamen({ etapa: etapas[0], resultados: r, aciertos: 2, versionExamen: 1 });
      expect(r.fundamentos.intentos).toBe(3);
      expect(r.fundamentos.aprobado).toBe(true);
    });
  });
});
