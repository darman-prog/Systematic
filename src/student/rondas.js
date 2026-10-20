// Selección de preguntas por modo de ronda. Sin DOM: recibe el banco, el progreso y las
// funciones puras inyectadas; orquestacion/ronda.js se queda con timers, pausa y pantalla.
import { esDebil, vencida, ordenarPrioridad, shuffle, filtrarDiagramas } from "../core/index.js";

export function crearRondas({
  obtenerP,
  filtrar = filtrarDiagramas,
  diagramasDisponibles = () => true,
  rng = Math.random,
  priorizar = lista => ordenarPrioridad(lista, obtenerP, rng)
} = {}) {
  const sinDiagramas = qs => filtrar(qs, diagramasDisponibles());
  const barajar = qs => shuffle(qs, rng);
  const ordenar = qs => priorizar(qs);
  const recorte = (lista, n) => lista.slice(0, Math.min(n, lista.length));

  // Práctica libre: usa las preguntas ya filtradas por la config y respeta el tope elegido.
  function practica({ items, cantidad, priorizando = true }) {
    const qs = sinDiagramas(items || []);
    if (!qs.length) return null;
    const cant = Math.min(parseInt(cantidad, 10) || qs.length, qs.length);
    const lista = priorizando ? ordenar(qs) : barajar(qs);
    return { items: recorte(lista, cant), modo: "practica", conTimer: false };
  }

  // Simulacro: 10 preguntas filtradas, siempre barajadas.
  function simulacro({ items }) {
    const qs = sinDiagramas(items || []);
    if (!qs.length) return null;
    return { items: recorte(barajar(qs), 10), modo: "simulacro", conTimer: true };
  }

  // Contrarreloj: 10 preguntas sin desarrollo. Conserva el comportamiento actual: no filtra
  // diagramas por puntero (esa decisión se puede revisar aparte).
  function contrarreloj({ banco }) {
    const lista = (banco || []).filter(q => q.tipo !== "desarrollo");
    if (!lista.length) return null;
    return { items: recorte(barajar(lista), 10), modo: "contrarreloj", conTimer: false };
  }

  // Supervivencia: todo el banco, barajado; las vidas las maneja la sesión.
  function supervivencia({ banco }) {
    if (!banco || !banco.length) return null;
    return { items: barajar(banco), modo: "supervivencia", conTimer: false };
  }

  function debiles({ banco }) {
    const lista = sinDiagramas((banco || []).filter(q => esDebil(obtenerP(q.id))));
    if (!lista.length) return null;
    return { items: recorte(barajar(lista), 10), modo: "practica", conTimer: false };
  }

  function porTipo({ banco, tipo }) {
    const lista = sinDiagramas((banco || []).filter(q => q.tipo === tipo));
    if (!lista.length) return null;
    return { items: recorte(ordenar(lista), 10), modo: "practica", conTimer: false };
  }

  function arrastre({ banco }) {
    const lista = sinDiagramas((banco || []).filter(q => q.tipo === "dragdrop" || q.tipo === "ordenar"));
    if (!lista.length) return null;
    return { items: recorte(ordenar(lista), 10), modo: "practica", conTimer: false };
  }

  function casos({ banco }) {
    const lista = sinDiagramas((banco || []).filter(q => q.caso));
    if (!lista.length) return null;
    return { items: recorte(ordenar(lista), 10), modo: "practica", conTimer: false };
  }

  function vencidas({ banco }) {
    const lista = sinDiagramas((banco || []).filter(q => vencida(obtenerP(q.id))));
    if (!lista.length) return null;
    return { items: recorte(ordenar(lista), 10), modo: "practica", conTimer: false };
  }

  function mision({ banco, tema }) {
    const lista = sinDiagramas((banco || []).filter(q => q.tema === tema));
    if (!lista.length) return null;
    return { items: recorte(ordenar(lista), 10), modo: "mision", conTimer: false };
  }

  return { practica, simulacro, contrarreloj, supervivencia, debiles, porTipo, arrastre, casos, vencidas, mision };
}
