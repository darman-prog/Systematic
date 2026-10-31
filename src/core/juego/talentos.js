// Motor puro de árbol de talentos y radar de especialidades: evalúa el desbloqueo por
// misiones y Boss Battles (escenarios/casos) y calcula la geometría SVG del radar.

const REDONDEO = 100;

// Redondea a dos decimales para obtener atributos SVG estables y deterministas en tests.
function redondear(valor) {
  return Math.round(valor * REDONDEO) / REDONDEO;
}

// Verifica si el estudiante superó el incidente culminatorio (Boss Battle) con calificación de éxito.
function bossSuperadoPorNodo(nodo, progresoEscenarios, progresoCasos) {
  if (!nodo.bossId) return true;
  const fuente = nodo.bossTipo === "caso" ? progresoCasos : progresoEscenarios;
  const registro = fuente && fuente[nodo.bossId];
  return Boolean(registro && registro.mejorRating === "exito");
}

// Evalúa cada rama y nodo del árbol determinando si está bloqueado, listo para Boss Battle o desbloqueado.
export function evaluarEstadoTalentos(
  arbol,
  progresoMisiones = {},
  progresoEscenarios = {},
  talentosGuardados = {},
  progresoCasos = {}
) {
  if (!arbol || !Array.isArray(arbol.ramas)) {
    return { ejes: [], ramas: [], totalNodos: 0, totalDesbloqueados: 0 };
  }

  const mapaDesbloqueados = {};
  let totalNodos = 0;
  let totalDesbloqueados = 0;

  // Primera pasada: indexa los talentos ya persistidos para resolver dependencias entre niveles.
  for (const rama of arbol.ramas) {
    for (const nodo of rama.nodos || []) {
      if (talentosGuardados && talentosGuardados[nodo.id]) {
        mapaDesbloqueados[nodo.id] = true;
      }
    }
  }

  const ramasEvaluadas = arbol.ramas.map(rama => {
    const nodos = (rama.nodos || []).map(nodo => {
      totalNodos += 1;
      const minEstrellas = nodo.minEstrellas || 1;
      const requeridas = Array.isArray(nodo.misionesRequeridas) ? nodo.misionesRequeridas : [];

      // Comprueba cada misión temática requerida contra las estrellas obtenidas por el estudiante.
      const detalleMisiones = requeridas.map(tema => {
        const actual = (progresoMisiones && progresoMisiones[tema] && progresoMisiones[tema].estrellas) || 0;
        return {
          tema,
          actual,
          requerido: minEstrellas,
          ok: actual >= minEstrellas
        };
      });

      const misionesOk = detalleMisiones.every(m => m.ok);
      const previoOk = !nodo.talentoPrevioId || Boolean(mapaDesbloqueados[nodo.talentoPrevioId]);
      const requisitosCumplidos = previoOk && misionesOk;
      const bossOk = bossSuperadoPorNodo(nodo, progresoEscenarios, progresoCasos);

      // Un talento queda desbloqueado si ya estaba persistido o si cumple misiones, nodo previo y Boss Battle.
      const desbloqueado = Boolean(mapaDesbloqueados[nodo.id]) || (requisitosCumplidos && bossOk);
      if (desbloqueado) {
        mapaDesbloqueados[nodo.id] = true;
        totalDesbloqueados += 1;
      }

      const estado = desbloqueado
        ? "desbloqueado"
        : requisitosCumplidos
          ? "listo_para_boss"
          : "bloqueado";

      return Object.assign({}, nodo, {
        estado,
        desbloqueado,
        requisitosCumplidos,
        previoOk,
        misionesOk,
        bossOk,
        detalleMisiones,
        fechaDesbloqueo: (talentosGuardados && talentosGuardados[nodo.id] && talentosGuardados[nodo.id].fecha) || null
      });
    });

    return {
      id: rama.id,
      nombre: rama.nombre,
      descripcion: rama.descripcion,
      nodos
    };
  });

  return {
    ejes: Array.isArray(arbol.ejes) ? arbol.ejes.slice() : [],
    ramas: ramasEvaluadas,
    totalNodos,
    totalDesbloqueados
  };
}

// Detecta qué talentos acaban de cumplir todas sus condiciones y aún no estaban guardados en persistencia.
export function detectarNuevosTalentos(
  arbol,
  progresoMisiones = {},
  progresoEscenarios = {},
  talentosGuardados = {},
  progresoCasos = {}
) {
  const evaluado = evaluarEstadoTalentos(
    arbol,
    progresoMisiones,
    progresoEscenarios,
    talentosGuardados,
    progresoCasos
  );
  const nuevos = [];
  for (const rama of evaluado.ramas) {
    for (const nodo of rama.nodos) {
      // Filtra únicamente los nodos desbloqueados que no existían en el registro previo.
      if (nodo.desbloqueado && !(talentosGuardados && talentosGuardados[nodo.id])) {
        nuevos.push(nodo);
      }
    }
  }
  return nuevos;
}

// Devuelve la lista de títulos profesionales que el estudiante ya desbloqueó y puede equipar en su perfil.
export function titulosDisponibles(arbolEvaluado) {
  if (!arbolEvaluado || !Array.isArray(arbolEvaluado.ramas)) return [];
  const lista = [];
  for (const rama of arbolEvaluado.ramas) {
    for (const nodo of rama.nodos || []) {
      if (nodo.desbloqueado && nodo.titulo) {
        lista.push({
          id: nodo.id,
          titulo: nodo.titulo,
          nombreTalento: nodo.nombre,
          eje: nodo.eje
        });
      }
    }
  }
  return lista;
}

// Calcula las coordenadas polares y cartesianas del Radar de Especialidades para renderizar en SVG.
export function calcularPoligonoRadar(arbolEvaluado, opciones = {}) {
  const centro = opciones.centro || 130;
  const radioMax = opciones.radioMax || 86;
  const radioEtiqueta = opciones.radioEtiqueta || (radioMax + 24);
  // Mantiene un radio visual mínimo del 12% para que el polígono sea perceptible incluso en 0%.
  const minRatioVisual = opciones.minRatioVisual !== undefined ? opciones.minRatioVisual : 0.12;

  const ejesNombres = (arbolEvaluado && Array.isArray(arbolEvaluado.ejes)) ? arbolEvaluado.ejes : [];
  const totalEjes = ejesNombres.length;

  if (totalEjes < 3) {
    return { ejes: [], points: "", niveles: [], resumenPct: 0 };
  }

  // Acumula los puntos obtenidos y posibles por cada eje temático del árbol.
  const obtenidoPorEje = {};
  const maximoPorEje = {};
  for (const nombre of ejesNombres) {
    obtenidoPorEje[nombre] = 0;
    maximoPorEje[nombre] = 0;
  }

  for (const rama of (arbolEvaluado && arbolEvaluado.ramas) || []) {
    for (const nodo of rama.nodos || []) {
      const puntos = Number(nodo.puntosRadar) || 0;
      if (nodo.eje && maximoPorEje[nodo.eje] !== undefined) {
        maximoPorEje[nodo.eje] += puntos;
        if (nodo.desbloqueado) {
          obtenidoPorEje[nodo.eje] += puntos;
        }
      }
    }
  }

  let sumaPct = 0;
  const vertices = ejesNombres.map((eje, i) => {
    const max = maximoPorEje[eje] || 100;
    const obt = obtenidoPorEje[eje] || 0;
    const pct = Math.min(100, Math.max(0, Math.round((obt / max) * 100)));
    sumaPct += pct;

    // Empieza en -90 grados (arriba) y reparte los vértices en sentido horario.
    const angulo = -Math.PI / 2 + (2 * Math.PI * i) / totalEjes;
    const cos = Math.cos(angulo);
    const sin = Math.sin(angulo);

    const ratio = Math.max(minRatioVisual, pct / 100);
    const r = radioMax * ratio;

    return {
      eje,
      pct,
      puntosObtenidos: obt,
      puntosMaximos: max,
      x: redondear(centro + r * cos),
      y: redondear(centro + r * sin),
      xMax: redondear(centro + radioMax * cos),
      yMax: redondear(centro + radioMax * sin),
      xLabel: redondear(centro + radioEtiqueta * cos),
      yLabel: redondear(centro + radioEtiqueta * sin)
    };
  });

  const points = vertices.map(v => v.x + "," + v.y).join(" ");

  // Construye las mallas concéntricas de referencia al 33%, 66% y 100% del radio.
  const niveles = [0.33, 0.66, 1].map(escala => {
    const pts = ejesNombres.map((_, i) => {
      const angulo = -Math.PI / 2 + (2 * Math.PI * i) / totalEjes;
      const rx = redondear(centro + radioMax * escala * Math.cos(angulo));
      const ry = redondear(centro + radioMax * escala * Math.sin(angulo));
      return rx + "," + ry;
    }).join(" ");
    return { escala: Math.round(escala * 100), points: pts };
  });

  return {
    ejes: vertices,
    points,
    niveles,
    resumenPct: Math.round(sumaPct / totalEjes)
  };
}
