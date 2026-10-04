// Motor de escenarios multi-paso (spec 003): decisiones con consecuencias y final con rating.
// Puro: el estado es un objeto plano que orquesta app.js.
import { XP_EVENTOS } from "./gamificacion.js";

export function iniciarEscenario(escenario) {
  return {
    escenarioId: escenario.id,
    pasoId: escenario.pasos[0].id,
    puntos: 0,
    decisiones: [],
    pendiente: null,
    terminado: false,
    rating: null
  };
}

export function pasoActual(escenario, estado) {
  return escenario.pasos.find(p => p.id === estado.pasoId) || null;
}

// Registra la opción elegida sin avanzar: queda pendiente hasta que el usuario continúe.
export function decidir(escenario, estado, indice) {
  if (estado.terminado || estado.pendiente) return estado;
  const paso = pasoActual(escenario, estado);
  const opcion = paso && paso.opciones[indice];
  if (!opcion) return estado;
  return Object.assign({}, estado, {
    puntos: estado.puntos + opcion.puntos,
    decisiones: estado.decisiones.concat([
      { pasoId: paso.id, texto: opcion.texto, feedback: opcion.feedback, puntos: opcion.puntos }
    ]),
    pendiente: opcion
  });
}

// Avanza al siguiente paso o cierra el escenario con su rating final.
export function continuar(escenario, estado) {
  if (estado.terminado || !estado.pendiente) return estado;
  if (estado.pendiente.siguiente === "fin") {
    return Object.assign({}, estado, {
      pendiente: null,
      terminado: true,
      rating: ratingDe(estado.puntos, estado.decisiones.length)
    });
  }
  return Object.assign({}, estado, { pasoId: estado.pendiente.siguiente, pendiente: null });
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
