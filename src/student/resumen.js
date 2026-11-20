// Resumen del home: continuidad del último track, cobertura de materias, precisión
// global, tendencia semanal, racha y preguntas débiles. Solo lee persistencia.
import { fechaISO, esDebil } from "../core/index.js";

function esObjeto(valor) {
  return valor !== null && typeof valor === "object" && !Array.isArray(valor);
}

// Los registros de progreso pueden venir de importaciones viejas: se normalizan a número
// y se ignoran los que no tengan intentos para no contar preguntas "tocadas" sin respuesta.
function intentosDe(registro) {
  if (!esObjeto(registro)) return { ok: 0, fail: 0 };
  return {
    ok: Number(registro.ok) || 0,
    fail: Number(registro.fail) || 0
  };
}

// Convierte una fecha ISO (YYYY-MM-DD) al mediodía local: comparar fechas sin hora evita
// que el cambio de horario mueva un día completo.
function msDeFecha(fecha) {
  return new Date(String(fecha) + "T12:00:00").getTime();
}

export function crearResumen({
  persistencia,
  materias = [],
  lenguajes = [],
  racha = () => 0,
  hoy = () => fechaISO(new Date())
}) {
  // El tipo se normaliza aquí: el resumen lo usa para el CTA y un registro sin `tipo`
  // no debe convertirse en materia por accidente.
  const tracks = [
    ...materias.map(track => ({ ...track, tipo: track.tipo || "materia" })),
    ...lenguajes.map(track => ({ ...track, tipo: track.tipo || "lenguaje" }))
  ];

  function progresoDe(id) {
    const progreso = persistencia.progreso(id);
    return esObjeto(progreso) ? progreso : {};
  }

  function actividadDe(id) {
    const actividad = persistencia.actividad(id);
    return esObjeto(actividad) ? actividad : {};
  }

  function historialDe(id) {
    const historial = persistencia.historial(id);
    return Array.isArray(historial) ? historial : [];
  }

  // Métricas de un solo track: preguntas únicas respondidas (topadas a su total) y
  // precisión sobre sus intentos. No agrega otras materias ni lenguajes.
  function metricasDeTrack(track) {
    const progreso = progresoDe(track.id);
    const total = Number(track.conteo?.preguntas) || 0;
    let respondidas = 0;
    let ok = 0;
    let fail = 0;

    for (const registro of Object.values(progreso)) {
      const intentos = intentosDe(registro);
      if (intentos.ok + intentos.fail > 0) respondidas += 1;
      ok += intentos.ok;
      fail += intentos.fail;
    }

    // Un progreso importado con ids ajenos no debe inflar la cobertura del track.
    const tope = total > 0 ? Math.min(respondidas, total) : respondidas;
    const intentos = ok + fail;
    return {
      preguntas: {
        respondidas: tope,
        total,
        pct: total > 0 ? Math.round((tope / total) * 100) : 0
      },
      // Sin intentos no hay precisión: null evita mostrar un 0% engañoso.
      precision: intentos > 0 ? { pct: Math.round((ok / intentos) * 100), intentos } : null
    };
  }

  // Cobertura de las 4 materias (489 preguntas), como el KPI del prototipo. Los lenguajes
  // avanzan por etapas y no se mezclan en este total.
  function metricasDeMaterias() {
    let respondidas = 0;
    let total = 0;
    for (const track of tracks.filter(t => t.tipo === "materia")) {
      const metricas = metricasDeTrack(track);
      respondidas += metricas.preguntas.respondidas;
      total += metricas.preguntas.total;
    }
    return {
      respondidas,
      total,
      pct: total > 0 ? Math.round((respondidas / total) * 100) : 0
    };
  }

  // Precisión global: suma los intentos de todos los tracks. Es el KPI "Precisión · N intentos".
  function precisionGlobal() {
    let ok = 0;
    let fail = 0;
    for (const track of tracks) {
      for (const registro of Object.values(progresoDe(track.id))) {
        const intentos = intentosDe(registro);
        ok += intentos.ok;
        fail += intentos.fail;
      }
    }
    const intentos = ok + fail;
    return intentos > 0 ? { pct: Math.round((ok / intentos) * 100), intentos } : null;
  }

  // Tendencia de las rondas cerradas: compara el promedio de la última semana con la
  // anterior. Si falta una de las dos semanas, no hay comparación posible.
  function tendenciaSemanal() {
    const referencia = msDeFecha(hoy());
    const desde7 = referencia - 7 * 86400000;
    const desde14 = referencia - 14 * 86400000;
    const actual = { score: 0, total: 0 };
    const previa = { score: 0, total: 0 };

    for (const track of tracks) {
      for (const intento of historialDe(track.id)) {
        if (!esObjeto(intento)) continue;
        const fecha = typeof intento.date === "number"
          ? intento.date
          : typeof intento.date === "string" ? Date.parse(intento.date) : NaN;
        if (!Number.isFinite(fecha) || fecha < desde14 || fecha > referencia + 86400000) continue;

        const score = Number(intento.score);
        const total = Number(intento.total);
        if (!(total > 0) || !Number.isFinite(score)) continue;

        const destino = fecha >= desde7 ? actual : previa;
        destino.score += score;
        destino.total += total;
      }
    }

    if (!actual.total || !previa.total) return null;
    const delta = Math.round((actual.score / actual.total - previa.score / previa.total) * 100);
    return delta === 0 ? null : { delta, sube: delta > 0 };
  }

  // Última fecha con actividad del track; si nunca respondió, cae al último intento
  // guardado en el historial (los exámenes de lenguaje también lo registran).
  function ultimaFechaDe(track) {
    const dias = Object.keys(actividadDe(track.id))
      .filter(dia => /^\d{4}-\d{2}-\d{2}$/.test(dia))
      .sort();
    if (dias.length) return dias[dias.length - 1];

    const fechas = historialDe(track.id)
      .map(intento => {
        const valor = intento && intento.date;
        if (typeof valor === "number") return valor;
        return typeof valor === "string" ? Date.parse(valor) : NaN;
      })
      .filter(Number.isFinite);

    return fechas.length ? fechaISO(new Date(Math.max(...fechas))) : null;
  }

  // Diferencia en días entre dos fechas ISO usando UTC: evita que el horario de verano
  // convierta 24 horas en 23 o 25 y muestre "ayer" cuando fue "hoy".
  function diasDesde(fecha) {
    const partes = String(fecha || "").split("-").map(Number);
    const hoyPartes = String(hoy()).split("-").map(Number);
    if (partes.length !== 3 || hoyPartes.length !== 3) return 0;
    if (!partes.every(Number.isFinite) || !hoyPartes.every(Number.isFinite)) return 0;

    const desde = Date.UTC(partes[0], partes[1] - 1, partes[2]);
    const hasta = Date.UTC(hoyPartes[0], hoyPartes[1] - 1, hoyPartes[2]);
    return Math.max(0, Math.round((hasta - desde) / 86400000));
  }

  // Devuelve el track con la última fecha. El primero del registro gana el empate:
  // materias antes que lenguajes, con un orden estable entre renders.
  function ultimoTrack() {
    let mejor = null;
    for (const track of tracks) {
      const fecha = ultimaFechaDe(track);
      if (!fecha) continue;
      if (!mejor || fecha > mejor.fecha) {
        mejor = { track, fecha };
      }
    }
    return mejor;
  }

  function continuidad(mejor) {
    const metricas = metricasDeTrack(mejor.track);
    return {
      tipo: mejor.track.tipo,
      id: mejor.track.id,
      nombre: mejor.track.nombre,
      dias: diasDesde(mejor.fecha),
      // "Pregunta 34 de 145" = la siguiente pregunta después de las 33 respondidas.
      pregunta: metricas.preguntas.total > 0
        ? Math.min(metricas.preguntas.respondidas + 1, metricas.preguntas.total)
        : null,
      ...metricas
    };
  }

  // Preguntas débiles de todos los tracks; el enlace de repaso apunta al track con más
  // pendientes para que "Seguir con débiles" tenga material. Empate: primero del registro.
  function repasoDebil() {
    let total = 0;
    let mejor = null;
    for (const track of tracks) {
      const debiles = Object.values(progresoDe(track.id))
        .filter(registro => esObjeto(registro) && esDebil(registro)).length;
      if (!debiles) continue;
      total += debiles;
      if (!mejor || debiles > mejor.debiles) mejor = { track, debiles };
    }
    if (!mejor) return null;
    return {
      total,
      tipo: mejor.track.tipo,
      id: mejor.track.id,
      nombre: mejor.track.nombre
    };
  }

  function rachaActual() {
    const n = Number(racha());
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  }

  return {
    // El home muestra un solo contexto de continuidad y tres KPI del prototipo.
    actual: () => {
      const mejor = ultimoTrack();
      return {
        continuar: mejor ? continuidad(mejor) : null,
        materias: metricasDeMaterias(),
        precision: precisionGlobal(),
        tendencia: tendenciaSemanal(),
        racha: rachaActual(),
        repaso: repasoDebil()
      };
    }
  };
}
