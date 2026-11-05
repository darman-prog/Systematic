// Motor de escenarios multi-paso (spec 003 y evolución pedagógica): decisiones con consecuencias,
// modos estudio vs simulacro, autopsias de fallo, variantes y corrección focalizada.
// Puro: el estado es un objeto plano que orquesta app.js y la capa de orquestación.
import { XP_EVENTOS } from "./gamificacion.js";

export function iniciarEscenario(escenario, opciones = {}) {
  // Permite arrancar en modo simulacro a ciegas o estudio guiado con variantes iniciales.
  const modo = opciones.modo === "simulacro" ? "simulacro" : "estudio";
  return {
    escenarioId: escenario.id,
    pasoId: escenario.pasos[0] ? escenario.pasos[0].id : null,
    puntos: 0,
    decisiones: [],
    pendiente: null,
    terminado: false,
    rating: null,
    modo,
    lenteActivo: null,
    varianteIdx: opciones.varianteIdx || 0,
    ordenOpciones: opciones.ordenOpciones || {},
    colaPasos: null,
    modoCorreccion: false
  };
}

export function pasoActual(escenario, estado) {
  return escenario.pasos.find(p => p.id === estado.pasoId) || null;
}

// Obtiene la redacción del paso según la variante activa para evitar memorización visual.
export function narrativaDePaso(paso, estado) {
  if (!paso) return "";
  // Si el paso tiene variantes, rotamos cíclicamente entre la narrativa base y las variantes.
  if (Array.isArray(paso.variantes) && paso.variantes.length > 0) {
    const total = paso.variantes.length + 1;
    const idx = (estado.varianteIdx || 0) % total;
    return idx === 0 ? paso.narrativa : paso.variantes[idx - 1];
  }
  return paso.narrativa;
}

// Obtiene las opciones en el orden permutado configurado para este paso (anti-descarte).
export function opcionesVisiblesDePaso(paso, estado) {
  if (!paso || !Array.isArray(paso.opciones)) return [];
  const orden = estado.ordenOpciones && estado.ordenOpciones[paso.id];
  // Si no hay orden personalizado para el paso, devuelve las opciones tal como vienen en los datos.
  if (!orden || !Array.isArray(orden)) return paso.opciones;
  return orden.map(idx => paso.opciones[idx]).filter(Boolean);
}

// Registra la opción elegida. En modo estudio queda pendiente con feedback; en simulacro avanza de inmediato.
export function decidir(escenario, estado, indiceVisible) {
  if (estado.terminado || estado.pendiente) return estado;
  const paso = pasoActual(escenario, estado);
  if (!paso) return estado;

  // Resuelve el índice real en los datos a partir del índice visible según la permutación del paso.
  const orden = estado.ordenOpciones && estado.ordenOpciones[paso.id];
  const indiceReal = orden && orden[indiceVisible] !== undefined ? orden[indiceVisible] : indiceVisible;
  const opcion = paso.opciones && paso.opciones[indiceReal];
  if (!opcion) return estado;

  const decision = {
    pasoId: paso.id,
    tema: paso.tema || escenario.tema || "",
    texto: opcion.texto,
    feedback: opcion.feedback,
    puntos: opcion.puntos,
    autopsia: opcion.autopsia || null
  };

  const nuevoEstado = Object.assign({}, estado, {
    puntos: estado.puntos + opcion.puntos,
    decisiones: estado.decisiones.concat([decision]),
    pendiente: Object.assign({}, opcion, { autopsia: opcion.autopsia || null })
  });

  // En simulacro no hay pausa de feedback intermedio: avanza de inmediato hacia el próximo paso.
  if (nuevoEstado.modo === "simulacro") {
    return continuar(escenario, nuevoEstado);
  }

  return nuevoEstado;
}

// Avanza al siguiente paso de la historia o de la cola de corrección, o cierra con el rating final.
export function continuar(escenario, estado) {
  if (estado.terminado || !estado.pendiente) return estado;

  // Si estamos en una ronda de corrección, consumimos la cola de pasos fallados.
  if (Array.isArray(estado.colaPasos)) {
    if (estado.colaPasos.length > 0) {
      const [siguientePasoId, ...restoCola] = estado.colaPasos;
      return Object.assign({}, estado, {
        pasoId: siguientePasoId,
        colaPasos: restoCola,
        pendiente: null
      });
    }
    // Fin de la cola de corrección: consolida el rating sobre todas las decisiones registradas.
    return Object.assign({}, estado, {
      pendiente: null,
      terminado: true,
      rating: ratingDe(estado.puntos, estado.decisiones.length)
    });
  }

  // Flujo normal: comprueba si la opción elegida conduce al cierre o al siguiente nodo.
  if (estado.pendiente.siguiente === "fin") {
    return Object.assign({}, estado, {
      pendiente: null,
      terminado: true,
      rating: ratingDe(estado.puntos, estado.decisiones.length)
    });
  }

  return Object.assign({}, estado, { pasoId: estado.pendiente.siguiente, pendiente: null });
}

// Alterna el lente de análisis activo (negocio, calidad, sintoma). Si ya estaba activo, lo desactiva.
export function cambiarLente(estado, lente) {
  return Object.assign({}, estado, {
    lenteActivo: estado.lenteActivo === lente ? null : lente
  });
}

// Rota al siguiente enunciado alternativo del paso para ver otra forma de expresar la idea.
export function alternarVariante(estado) {
  return Object.assign({}, estado, {
    varianteIdx: (estado.varianteIdx || 0) + 1
  });
}

// Inicia una ronda de corrección repitiendo únicamente los pasos fallados (< 2 puntos).
export function iniciarCorreccion(escenario, estadoPrevio) {
  const falladas = (estadoPrevio.decisiones || []).filter(d => d.puntos < 2);
  // Si no hubo fallos, no hay nada que corregir.
  if (!falladas.length) return estadoPrevio;

  const pasosARepetir = [...new Set(falladas.map(d => d.pasoId))];
  const decisionesBuenas = (estadoPrevio.decisiones || []).filter(d => d.puntos === 2);
  const puntosBase = decisionesBuenas.reduce((acc, d) => acc + d.puntos, 0);

  // Permuta cíclicamente las opciones de cada paso fallado para impedir el acierto por descarte visual.
  const nuevosOrdenes = Object.assign({}, estadoPrevio.ordenOpciones);
  pasosARepetir.forEach(pasoId => {
    const paso = escenario.pasos.find(p => p.id === pasoId);
    if (!paso || !Array.isArray(paso.opciones)) return;
    const n = paso.opciones.length;
    // Desplaza cíclicamente en 1 posición para garantizar que la opción correcta cambie de lugar.
    nuevosOrdenes[pasoId] = Array.from({ length: n }, (_, i) => (i + 1) % n);
  });

  return {
    escenarioId: escenario.id,
    pasoId: pasosARepetir[0],
    colaPasos: pasosARepetir.slice(1),
    puntos: puntosBase,
    decisiones: decisionesBuenas,
    pendiente: null,
    terminado: false,
    rating: null,
    modo: "estudio",
    modoCorreccion: true,
    lenteActivo: null,
    varianteIdx: (estadoPrevio.varianteIdx || 0) + 1,
    ordenOpciones: nuevosOrdenes
  };
}

// Extrae la lista de temas únicos correspondientes a decisiones falladas para alimentar el puente pedagógico.
export function temasDebilesDeEscenario(estado) {
  const falladas = (estado.decisiones || []).filter(d => d.puntos < 2 && d.tema);
  return [...new Set(falladas.map(d => d.tema))];
}

// Rating por calidad: % de puntos sobre el máximo posible (2 por decisión).
export function ratingDe(puntos, decisiones) {
  const max = decisiones * 2;
  const pct = max ? Math.round((puntos / max) * 100) : 0;
  return pct >= 70 ? "exito" : pct >= 40 ? "parcial" : "fracaso";
}

export function xpDeEscenario(estado) {
  return estado.decisiones.filter(d => d.puntos === 2).length * XP_EVENTOS.escenaCorrecta;
}
