// Carga bajo demanda del contenido de cada track (spec 012). Es el único módulo que conoce
// las rutas de src/datos/ y los chunks; core/registro/materias.js queda como metadata.
const CARGADORES = {
  bd2: () => import("../datos/materias/bd2/index.js"),
  isw: () => import("../datos/materias/isw/index.js"),
  asw: () => import("../datos/materias/asw/index.js"),
  infra: () => import("../datos/materias/infra/index.js"),
  "lenguaje-ts": () => import("../datos/lenguajes/ts/index.js"),
  "lenguaje-java": () => import("../datos/lenguajes/java/index.js"),
  "lenguaje-python": () => import("../datos/lenguajes/python/index.js")
};

const ROADMAPS = {
  "lenguaje-ts": () => import("../datos/lenguajes/ts/roadmap.js").then(m => m.default),
  "lenguaje-java": () => import("../datos/lenguajes/java/roadmap.js").then(m => m.default),
  "lenguaje-python": () => import("../datos/lenguajes/python/roadmap.js").then(m => m.default)
};

// Presentación que acompaña al contenido: colores por tema y keywords de SQL/código.
const PRESENTACION = {
  bd2: async () => {
    const m = await import("../datos/materias/bd2/presentacion.js");
    return { topicColors: m.topicColors, sqlKeywords: m.sqlKeywords };
  },
  "lenguaje-ts": async () => {
    const m = await import("../datos/lenguajes/ts/presentacion.js");
    return { sqlKeywords: m.tsKeywords };
  },
  "lenguaje-java": async () => {
    const m = await import("../datos/lenguajes/java/presentacion.js");
    return { sqlKeywords: m.javaKeywords };
  },
  "lenguaje-python": async () => {
    const m = await import("../datos/lenguajes/python/presentacion.js");
    return { sqlKeywords: m.pythonKeywords };
  }
};

export async function cargarContenido(track) {
  const cargar = CARGADORES[track.id];
  if (!cargar) throw new Error("Track sin cargador: " + track.id);
  const mod = await cargar();
  const presentacion = PRESENTACION[track.id] ? await PRESENTACION[track.id]() : null;
  return {
    preguntas: mod.preguntas ?? [],
    glosario: mod.glosario ?? { categorias: [], terminos: [], tips: [] },
    apuntes: mod.apuntes ?? [],
    escenarios: mod.escenarios ?? [],
    casos: mod.casos ?? [],
    // Solo los tracks de lenguaje declaran roadmap (spec 011).
    roadmap: mod.roadmap ?? null,
    ...(presentacion || {})
  };
}

// Solo el roadmap (chunk chico) para calcular la barra del home sin cargar las preguntas.
export function cargarRoadmap(track) {
  const cargar = ROADMAPS[track.id];
  return cargar ? cargar() : Promise.resolve(null);
}
