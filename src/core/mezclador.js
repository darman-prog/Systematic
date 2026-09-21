/**
 * mezclador.js
 * Orquesta N materias en UNA llamada. El caller nunca cambia al añadir materias.
 * Garantía anti-repetición: ciclo (baraja) por materia + cooldown global suave.
 */
import { CONFIG, calcularScore, muestrearPonderado } from "./questionSelector.js";

/* Store por defecto en memoria; se puede inyectar uno de localStorage */
const memoria = () => { let s = null; return { cargar: () => s, guardar: v => { s = v; } }; };

export const storeLocalStorage = (clave = "mezclador") => ({
  cargar: () => { try { return JSON.parse(localStorage.getItem(clave)); } catch { return null; } },
  guardar: v => localStorage.setItem(clave, JSON.stringify(v)),
});

export function crearMezclador({ registro, obtenerP, store = memoria(), config = {} }) {
  const cfg = { ...CONFIG, ...config };
  const estado = store.cargar() || { ciclos: {}, recientes: [] };
  const guardar = () => store.guardar(estado);

  /* Pool elegible de una materia: excluye sesión + ciclo actual.
     Si el ciclo se agotó, abre ciclo nuevo (único momento en que "reinicia"). */
  function elegiblesDe(materia, sesionIds) {
    const vistos = estado.ciclos[materia.id] || [];
    let pool = materia.preguntas.filter(p => !sesionIds.includes(p.id) && !vistos.includes(p.id));
    if (pool.length === 0) {
      estado.ciclos[materia.id] = [];
      pool = materia.preguntas.filter(p => !sesionIds.includes(p.id));
    }
    return pool;
  }

  /* Reparto de cuotas por método del resto mayor (suman exactamente `total`) */
  function repartir(total, fracciones) {
    const exactos = fracciones.map(f => f * total);
    const base = exactos.map(Math.floor);
    let sobrante = total - base.reduce((a, b) => a + b, 0);
    const orden = exactos.map((v, i) => [v - base[i], i]).sort((a, b) => b[0] - a[0]);
    for (let k = 0; k < sobrante; k++) base[orden[k % orden.length][1]]++;
    return base;
  }

  function siguienteRonda({ tamaño = 10, pesos = {}, modos = {}, sesionIds = [], filtros } = {}) {
    const materias = registro.filter(m => m.preguntas.length);
    if (!materias.length) return [];

    const pesoDe = m => pesos[m.id] ?? 1;
    const totalPeso = materias.reduce((s, m) => s + pesoDe(m), 0);
    const cuotas = repartir(tamaño, materias.map(m => pesoDe(m) / totalPeso));

    const ronda = [];
    materias.forEach((m, i) => {
      let n = cuotas[i];
      if (n <= 0) return;
      let pool = elegiblesDe(m, sesionIds);
      if (filtros) pool = pool.filter(filtros);
      n = Math.min(n, pool.length);
      if (n <= 0) return;

      const ctx = {
        obtenerP,
        historialIds: estado.recientes,
        historialBanco: m.preguntas,
        config: cfg,
        modo: modos[m.id] || "mixto",
      };
      const scores = pool.map(p => calcularScore(p, ctx));
      const sel = muestrearPonderado(pool, scores, n, Math.random);

      ronda.push(...sel);
      estado.ciclos[m.id] = [...(estado.ciclos[m.id] || []), ...sel.map(p => p.id)];
    });

    // Barajar para intercalar materias (que no salgan bloqueadas por materia)
    const final = ronda.sort(() => Math.random() - 0.5);

    // Cooldown global suave (preferencia, no exclusión dura)
    estado.recientes = [...estado.recientes, ...final.map(p => p.id)].slice(-cfg.cooldown * 2);
    guardar();
    return final;
  }

  return {
    siguienteRonda,
    estado: () => estado,                                   // para stats/cobertura
    reiniciarCiclo: id => { estado.ciclos[id] = []; guardar(); },
  };
}