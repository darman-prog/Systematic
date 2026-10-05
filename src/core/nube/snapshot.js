// Snapshot de nube (ADR 008): copia completa y serializable del estado local para respaldarlo
// por usuario. Puro: recibe la persistencia por parámetro y no toca DOM ni red.
export const FORMATO_NUBE = "nube-1";

const esObjeto = v => !!v && typeof v === "object" && !Array.isArray(v);

// Construye el snapshot de todas las materias y lenguajes registrados, más lo global.
export function construirSnapshot({ persistencia, materias, lenguajes, ahora = new Date() }) {
  const materiasDatos = {};
  for (const m of materias) {
    materiasDatos[m.id] = {
      progreso: persistencia.progreso(m.id),
      historial: persistencia.historial(m.id),
      actividad: persistencia.actividad(m.id),
      meta: persistencia.meta(m.id),
      misiones: persistencia.misiones(m.id)
    };
  }
  const lenguajesDatos = {};
  for (const l of lenguajes) {
    lenguajesDatos[l.id] = { competencia: persistencia.competencia(l.id) };
  }
  return {
    app: "systematic",
    formato: FORMATO_NUBE,
    exportado: ahora.toISOString(),
    nombre: persistencia.nombre(),
    global: {
      xp: persistencia.xp(),
      xpEventos: persistencia.xpEventos(),
      logros: persistencia.logros(),
      escenarios: persistencia.escenarios(),
      casos: persistencia.casos(),
      onboarding: persistencia.onboardingHecho()
    },
    materias: materiasDatos,
    lenguajes: lenguajesDatos
  };
}

// Cada etapa de competencia guarda { aprobado: bool, version: int } (misma forma que valida
// el import de archivo en app.js).
function competenciaValida(competencia) {
  return esObjeto(competencia) && Object.values(competencia).every(r =>
    esObjeto(r) && typeof r.aprobado === "boolean" && Number.isInteger(r.version));
}

function materiaValida(datos) {
  return esObjeto(datos) &&
    esObjeto(datos.progreso) &&
    Array.isArray(datos.historial) &&
    esObjeto(datos.actividad) &&
    Number.isInteger(datos.meta) && datos.meta > 0 &&
    esObjeto(datos.misiones);
}

function globalValida(g) {
  return esObjeto(g) &&
    typeof g.xp === "number" &&
    esObjeto(g.xpEventos) && esObjeto(g.logros) && esObjeto(g.escenarios) && esObjeto(g.casos) &&
    typeof g.onboarding === "boolean";
}

// Valida la forma del snapshot remoto antes de aplicarlo: nunca confiar en lo que llega por red.
export function validarSnapshot(datos) {
  if (!esObjeto(datos) || datos.app !== "systematic" || datos.formato !== FORMATO_NUBE) {
    return { ok: false, error: "formato" };
  }
  if (!esObjeto(datos.materias) || !esObjeto(datos.lenguajes)) return { ok: false, error: "formato" };
  if (!globalValida(datos.global)) return { ok: false, error: "global" };
  if (typeof datos.nombre !== "string") return { ok: false, error: "nombre" };
  if (!Object.values(datos.materias).every(materiaValida)) return { ok: false, error: "materias" };
  if (!Object.values(datos.lenguajes).every(l => esObjeto(l) && competenciaValida(l.competencia))) {
    return { ok: false, error: "lenguajes" };
  }
  return { ok: true, datos };
}

// Fecha del respaldo para el diálogo de conflictos; null si no es una fecha válida.
// Ojo: new Date(null) es epoch, no inválida; por eso se exige string antes de parsear.
export function fechaSnapshot(datos) {
  if (!datos || typeof datos.exportado !== "string") return null;
  const fecha = new Date(datos.exportado);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
}
