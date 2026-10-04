// Track activo (materia o lenguaje): contenido cargado, competencia y filtros de práctica.
// Solo guarda estado y reglas del track; la presentación (acento, portada, navegación) la hace
// quien llama, y el progreso/XP siguen en la capa student/app. Dependencias inyectadas
// (persistencia para competencia, helpers puros del filtrado) para testear sin DOM.
import { getMateria, getLenguaje, cargarContenido } from "../core/index.js";

export function crearTrack({ persistencia, TIPOS, esDebil, obtenerP, filtrarDiagramas, diagramasDisponibles }) {
  let materia = null;
  let banco = [];
  let glosario = { categorias: [], terminos: [], tips: [] };
  let lenguaje = null;
  let lenguajeContenido = null;
  let competencia = {};
  const filtros = { parciales: new Set(), temas: new Set(), dificultades: new Set(), tipos: new Set(), soloDebiles: false, soloMarcadas: false, priorizar: true };

  // El constructor de diagramas no se ofrece en táctil: se filtra en todas las rutas de sesión.
  const sinDiagramasEnTactil = qs => filtrarDiagramas(qs, diagramasDisponibles());

  function limpiarLenguaje() {
    lenguaje = null;
    lenguajeContenido = null;
  }

  function inicializarFiltros() {
    filtros.parciales = new Set(banco.map(q => q.parcial));
    filtros.temas = new Set(banco.map(q => q.tema));
    filtros.dificultades = new Set(["facil", "media", "dificil"]);
    filtros.tipos = new Set(TIPOS);
  }

  // Carga el contenido del track bajo demanda (spec 012) y deja el estado listo; devuelve false
  // si el id no existe. La presentación (acento, portada, navegación) la hace quien llama.
  async function seleccionarMateria(id) {
    const m = getMateria(id);
    if (!m) return false;
    // Al entrar a una materia, el track de lenguaje deja de estar activo (export/import).
    limpiarLenguaje();
    const contenido = await cargarContenido(m);
    materia = { ...m, ...contenido };
    banco = contenido.preguntas;
    glosario = contenido.glosario;
    inicializarFiltros();
    return true;
  }

  async function seleccionarLenguaje(id) {
    const l = getLenguaje(id);
    if (!l) return false;
    lenguaje = l;
    lenguajeContenido = await cargarContenido(l);
    competencia = persistencia.competencia(l.id);
    // El track de lenguaje actúa como "materia" activa para el motor de quiz y resultados.
    // No toca sys.progreso.<materia>: el progreso del lenguaje vive aparte (app.js).
    materia = { ...l, ...lenguajeContenido };
    banco = lenguajeContenido.preguntas;
    glosario = lenguajeContenido.glosario;
    inicializarFiltros();
    return true;
  }

  // Las opciones salen de los checkboxes de la config; app.js las lee del DOM y las guarda acá.
  function setOpciones(o) {
    if (o.soloDebiles !== undefined) filtros.soloDebiles = o.soloDebiles;
    if (o.soloMarcadas !== undefined) filtros.soloMarcadas = o.soloMarcadas;
    if (o.priorizar !== undefined) filtros.priorizar = o.priorizar;
  }

  function valoresDe(clave) {
    if (clave === "parciales") return [...new Set(banco.map(q => q.parcial))];
    if (clave === "temas") return [...new Set(banco.map(q => q.tema))];
    if (clave === "dificultades") return ["facil", "media", "dificil"];
    return TIPOS;
  }

  function contarPor(clave, valor) {
    if (clave === "parciales") return banco.filter(q => q.parcial === valor).length;
    if (clave === "temas") return banco.filter(q => q.tema === valor).length;
    if (clave === "dificultades") return banco.filter(q => q.dificultad === valor).length;
    return banco.filter(q => q.tipo === valor).length;
  }

  function preguntasFiltradas() {
    return sinDiagramasEnTactil(banco.filter(q =>
      filtros.parciales.has(q.parcial) &&
      filtros.temas.has(q.tema) &&
      filtros.dificultades.has(q.dificultad) &&
      filtros.tipos.has(q.tipo) &&
      (!filtros.soloDebiles || esDebil(obtenerP(q.id))) &&
      (!filtros.soloMarcadas || obtenerP(q.id).marked)
    ));
  }

  function toggleFiltro(clave, valor) {
    if (filtros[clave].has(valor)) filtros[clave].delete(valor);
    else filtros[clave].add(valor);
  }

  function toggleFiltroTodos(clave, activar) {
    filtros[clave] = activar ? new Set(valoresDe(clave)) : new Set();
  }

  function itemsDeIds(ids) {
    const porId = new Map((lenguajeContenido?.preguntas || []).map(p => [p.id, p]));
    return ids.map(id => porId.get(id)).filter(Boolean);
  }

  // Reemplaza la competencia vigente del lenguaje activo (import de archivo o aprobado de examen).
  function setCompetencia(nuevo) {
    competencia = nuevo;
  }

  return {
    get materia() { return materia; },
    get banco() { return banco; },
    get glosario() { return glosario; },
    get lenguaje() { return lenguaje; },
    get lenguajeContenido() { return lenguajeContenido; },
    get competencia() { return competencia; },
    get filtros() { return filtros; },
    seleccionarMateria,
    seleccionarLenguaje,
    limpiarLenguaje,
    inicializarFiltros,
    setOpciones,
    valoresDe,
    contarPor,
    preguntasFiltradas,
    toggleFiltro,
    toggleFiltroTodos,
    itemsDeIds,
    setCompetencia
  };
}
