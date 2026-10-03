import { describe, it, expect } from "vitest";
import {
  umbralDeExamen,
  apruebaExamen,
  aprobadoVigente,
  barraDeCompetencia,
  etapaDesbloqueada,
  registrarExamen,
} from "./competencia.js";

const examen = (version, preguntas, umbral = 0.8) => ({ version, umbral, preguntas });

const etapas = [
  { id: "fundamentos", examen: examen(1, ["TS-031", "TS-032"]) },
  { id: "funciones", examen: examen(1, ["TS-033", "TS-034", "TS-035"]) },
  { id: "tipos", examen: examen(1, Array.from({ length: 12 }, (_, i) => "T-" + i)) },
  { id: "asincronia", examen: examen(1, ["A-1"]) },
  { id: "auditoria", examen: examen(1, ["AU-1", "AU-2"]) },
];

describe("Competencia (dominio)", () => {
  describe("umbralDeExamen", () => {
    it("redondea hacia arriba (12 preguntas al 80% exige 10)", () => {
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

  describe("aprobadoVigente", () => {
    it("cuenta un aprobado con la versión del roadmap", () => {
      expect(aprobadoVigente(etapas[0], { fundamentos: { aprobado: true, version: 1 } })).toBe(true);
    });

    it("no cuenta un aprobado sin aprobar", () => {
      expect(aprobadoVigente(etapas[0], { fundamentos: { aprobado: false, version: 1 } })).toBe(false);
      expect(aprobadoVigente(etapas[0], {})).toBe(false);
    });

    it("no cuenta un aprobado de una versión vieja del examen", () => {
      // El roadmap ya está en v2, pero el estudiante aprobó la v1.
      const etapaV2 = { id: "fundamentos", examen: examen(2, ["TS-031", "TS-032"]) };
      expect(aprobadoVigente(etapaV2, { fundamentos: { aprobado: true, version: 1 } })).toBe(false);
    });
  });

  describe("barraDeCompetencia", () => {
    it("calcula aprobadas / total", () => {
      const resultados = {
        fundamentos: { aprobado: true, version: 1 },
        funciones: { aprobado: true, version: 1 },
        tipos: { aprobado: false, version: 1 },
      };
      const barra = barraDeCompetencia(etapas, resultados);
      expect(barra.aprobadas).toBe(2);
      expect(barra.total).toBe(5);
      expect(barra.pct).toBeCloseTo(0.4);
    });

    it("barra vacía sin resultados ni etapas", () => {
      expect(barraDeCompetencia(etapas, {}).aprobadas).toBe(0);
      expect(barraDeCompetencia([], {}).total).toBe(0);
    });

    it("no cuenta un aprobado de versión vieja", () => {
      const etapasV2 = etapas.map((e, i) =>
        i === 0 ? { ...e, examen: examen(2, e.examen.preguntas) } : e
      );
      const resultados = { fundamentos: { aprobado: true, version: 1 } };
      expect(barraDeCompetencia(etapasV2, resultados).aprobadas).toBe(0);
    });
  });

  describe("etapaDesbloqueada", () => {
    it("la primera siempre está desbloqueada", () => {
      expect(etapaDesbloqueada(etapas, 0, {})).toBe(true);
    });

    it("bloquea el capstone (etapa 5) hasta aprobar la 4", () => {
      const resultados = {
        fundamentos: { aprobado: true, version: 1 },
        funciones: { aprobado: true, version: 1 },
        tipos: { aprobado: true, version: 1 },
        asincronia: { aprobado: false, version: 1 },
      };
      expect(etapaDesbloqueada(etapas, 4, resultados)).toBe(false);
      resultados.asincronia = { aprobado: true, version: 1 };
      expect(etapaDesbloqueada(etapas, 4, resultados)).toBe(true);
    });

    it("no desbloquea con un aprobado de versión vieja", () => {
      const etapasV2 = etapas.map((e, i) =>
        i === 0 ? { ...e, examen: examen(2, e.examen.preguntas) } : e
      );
      expect(etapaDesbloqueada(etapasV2, 1, { fundamentos: { aprobado: true, version: 1 } })).toBe(false);
    });

    it("índice fuera de rango devuelve false", () => {
      expect(etapaDesbloqueada(etapas, 99, {})).toBe(false);
      expect(etapaDesbloqueada(etapas, -1, {})).toBe(false);
    });
  });

  describe("registrarExamen", () => {
    it("aprueba y registra con la versión del roadmap", () => {
      const resultados = registrarExamen({ etapa: etapas[0], resultados: {}, aciertos: 2 });
      expect(resultados.fundamentos.aprobado).toBe(true);
      expect(resultados.fundamentos.version).toBe(1);
      expect(resultados.fundamentos.intentos).toBe(1);
      expect(resultados.fundamentos.ultimoPct).toBe(1);
    });

    it("no aprueba y cuenta el intento", () => {
      const resultados = registrarExamen({ etapa: etapas[0], resultados: {}, aciertos: 1 });
      expect(resultados.fundamentos.aprobado).toBe(false);
      expect(resultados.fundamentos.intentos).toBe(1);
      expect(resultados.fundamentos.ultimoPct).toBeCloseTo(0.5);
    });

    it("usa el umbral declarado en el examen", () => {
      // 4 preguntas con umbral 0.5 → exige 2; con 0.8 exigiría 4.
      const etapa = { id: "x", examen: examen(1, ["a", "b", "c", "d"], 0.5) };
      expect(registrarExamen({ etapa, resultados: {}, aciertos: 2 }).x.aprobado).toBe(true);
    });

    it("reprobar con una versión nueva invalida el aprobado anterior", () => {
      const v1 = { id: "fund", examen: examen(1, ["a", "b"]) };
      const v2 = { id: "fund", examen: examen(2, ["a", "b"]) };
      const r1 = registrarExamen({ etapa: v1, resultados: {}, aciertos: 2 });
      expect(r1.fund.aprobado).toBe(true);

      // El roadmap cambió a v2 y el estudiante reprueba: el aprobado viejo se invalida.
      const r2 = registrarExamen({ etapa: v2, resultados: r1, aciertos: 0 });
      expect(r2.fund.aprobado).toBe(false);
      expect(r2.fund.version).toBe(2);
      expect(r2.fund.intentos).toBe(2);
    });

    it("aprobar con una versión nueva deja el aprobado vigente", () => {
      const v1 = { id: "fund", examen: examen(1, ["a", "b"]) };
      const v2 = { id: "fund", examen: examen(2, ["a", "b"]) };
      const r1 = registrarExamen({ etapa: v1, resultados: {}, aciertos: 2 });
      const r2 = registrarExamen({ etapa: v2, resultados: r1, aciertos: 2 });
      expect(r2.fund.aprobado).toBe(true);
      expect(r2.fund.version).toBe(2);
    });

    it("acumula intentos y mantiene el aprobado en reintentos", () => {
      let r = {};
      r = registrarExamen({ etapa: etapas[0], resultados: r, aciertos: 0 });
      r = registrarExamen({ etapa: etapas[0], resultados: r, aciertos: 1 });
      r = registrarExamen({ etapa: etapas[0], resultados: r, aciertos: 2 });
      expect(r.fundamentos.intentos).toBe(3);
      expect(r.fundamentos.aprobado).toBe(true);
      // Reintento posterior reprobado no revoca el aprobado (sin castigo).
      r = registrarExamen({ etapa: etapas[0], resultados: r, aciertos: 0 });
      expect(r.fundamentos.aprobado).toBe(true);
      expect(r.fundamentos.intentos).toBe(4);
    });
  });
});
