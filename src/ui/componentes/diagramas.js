// Lienzo reutilizable del constructor de diagramas (spec 003 + spec 013 workbench UI).
// Recibe la pregunta `tipo: "diagrama"`, el estado serializable de core/diagramas/diagramas.js y
// callbacks ({ guardarEstado }). Funciona con mouse, toque y teclado (Pointer Events + tap-tap).
import { escapar, bloqueCaso } from "../helpers.js";
import { icono } from "../iconos.js";
import {
  CONFIG_SUBTIPO, esDirigidoTipo, crearTablero, colocarNodo, quitarNodo,
  asignarMiembro, validarConexion, conectar, quitarConexion, actualizarPosicion,
  claveMiembro, normalizarClave
} from "../../core/index.js";

/** @type {(id: string) => any} */
const $ = id => document.getElementById(id);
const $area = () => document.getElementById("lienzo-area");

const ETIQUETA_SUBTIPO = {
  "er": "Modelo Entidad-Relación",
  "uml-clases": "UML · Diagrama de Clases",
  "casos-uso": "UML · Casos de Uso",
  "actividades": "UML · Diagrama de Actividades"
};

const TITULO_POOL_NODOS = {
  "er": "Entidades",
  "uml-clases": "Clases e interfaces",
  "casos-uso": "Actores y casos",
  "actividades": "Acciones y decisiones"
};

// Detecta puntero grueso o ausencia de hover (celulares, tablets y pantallas táctiles) sin depender del ancho de pantalla.
function esEntornoTactil() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse), (hover: none)").matches;
}

// Convierte coordenadas del puntero a coordenadas internas del papel sumando el desplazamiento de scroll del lienzo.
function coordenadasEnPapel(clientX, clientY) {
  const lienzo = $("lienzo-diagrama");
  const papel = $area();
  if (!lienzo || !papel) return null;
  const rLienzo = lienzo.getBoundingClientRect();
  if (rLienzo.width > 0 && rLienzo.height > 0) {
    if (clientX < rLienzo.left || clientX > rLienzo.right || clientY < rLienzo.top || clientY > rLienzo.bottom) {
      return null;
    }
  }
  return {
    x: (clientX - rLienzo.left) + (lienzo.scrollLeft || 0),
    y: (clientY - rLienzo.top) + (lienzo.scrollTop || 0)
  };
}

// Calcula el punto donde el segmento desde el centro del nodo hacia (destX, destY)
// cruza el borde exterior del rectángulo del nodo, para que la punta de flecha no quede tapada.
function puntoBordeNodo(el, destX, destY, dxNorm = 0, dyNorm = 0) {
  const cx = el.offsetLeft + el.offsetWidth / 2 + dxNorm;
  const cy = el.offsetTop + el.offsetHeight / 2 + dyNorm;
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  // En entornos sin layout real (p. ej. JSDOM), offsetWidth es 0 y devolvemos el centro.
  if (!w || !h) return { x: cx, y: cy };
  const dx = destX - cx;
  const dy = destY - cy;
  if (Math.hypot(dx, dy) < 1) return { x: cx, y: cy };
  const hw = w / 2 + 4;
  const hh = h / 2 + 4;
  const tx = Math.abs(dx) > 0.001 ? hw / Math.abs(dx) : Infinity;
  const ty = Math.abs(dy) > 0.001 ? hh / Math.abs(dy) : Infinity;
  const t = Math.min(tx, ty);
  // Si los nodos están superpuestos, evitamos invertir el segmento.
  if (t >= 1) return { x: cx, y: cy };
  return { x: Math.round(cx + dx * t), y: Math.round(cy + dy * t) };
}

/**
 * @param {{
 *   ctx?: any,
 *   guardarEstado?: (estado: any) => void,
 *   obtenerItem?: () => any,
 *   obtenerEstado?: () => any,
 *   areaId?: string,
 *   accionComprobar?: string,
 *   accionCancelarTipo?: string,
 *   mostrarPregunta?: boolean
 * }} [opciones]
 */
export function crearDiagramasUI({
  ctx,
  guardarEstado,
  obtenerItem,
  obtenerEstado,
  areaId = "question-area",
  accionComprobar = "comprobarDiagrama",
  accionCancelarTipo = "cancelarDiagramaTipo",
  mostrarPregunta = true
} = {}) {
  let seleccion = null;
  let expandido = false;
  let tabPool = "nodos";
  /** @type {Array<{ linea: SVGLineElement, etiqueta: HTMLElement, nDe: HTMLElement, nA: HTMLElement, offset: number }>} */
  let aristasDom = [];
  let raf = 0;
  const zona = () => $(areaId);

  function tiposDe(pregunta) {
    if (Array.isArray(pregunta.tiposArista) && pregunta.tiposArista.length) return pregunta.tiposArista;
    const cfg = CONFIG_SUBTIPO[pregunta.subtipo] || CONFIG_SUBTIPO.er;
    return cfg.tiposArista;
  }

  function estado() {
    if (obtenerEstado) return obtenerEstado();
    return ctx && ctx.session && ctx.session.diagrama;
  }

  function guardar(nuevo) {
    if (ctx && ctx.session) ctx.session.diagrama = nuevo;
    if (guardarEstado) guardarEstado(nuevo);
    return nuevo;
  }

  function esBloqueado() {
    return !!(ctx && ctx.session && ctx.session.answers && ctx.session.answers[ctx.session.idx]);
  }

  function renderPoolNodosHtml(estadoActual) {
    if (!estadoActual.nodosDisponibles.length) {
      return '<span class="diagrama-pool-vacio">Todas las piezas están en el lienzo</span>';
    }
    return estadoActual.nodosDisponibles
      .map(n => {
        const activa = seleccion === "colocar:" + n;
        return (
          '<div class="pieza pieza-nodo' + (activa ? " pieza-activa" : "") + '" data-nodo="' + escapar(n) + '" data-origen="pool-diagrama" aria-pressed="' + (activa ? "true" : "false") + '">' +
            '<span>' + escapar(n) + "</span>" +
          "</div>"
        );
      })
      .join("");
  }

  function renderPoolMiembrosHtml(item, estadoActual) {
    if (!Array.isArray(item.miembrosPool) || !item.miembrosPool.length) return "";
    const asignados = item.miembrosPool.filter(m => !!estadoActual.miembros[claveMiembro(m)]).length;
    const ocultoMovil = tabPool !== "miembros" ? " panel-oculto-movil" : "";
    return (
      '<div class="diagrama-panel diagrama-panel--con-tabs' + ocultoMovil + '" data-panel-pool="miembros">' +
        '<div class="diagrama-panel-head">' +
          '<span class="diagrama-panel-titulo">Miembros</span>' +
          '<span class="diagrama-contador" id="contador-miembros">' + asignados + "/" + item.miembrosPool.length + "</span>" +
        "</div>" +
        '<p class="diagrama-panel-sub">Toca un miembro y luego la clase destino:</p>' +
        '<div id="pool-miembros" class="diagrama-pool">' +
          item.miembrosPool.map(m => {
            const clave = claveMiembro(m);
            const dueno = estadoActual.miembros[clave];
            const activa = seleccion === "miembro:" + clave;
            const clases = "pieza pieza-miembro" + (dueno ? " pieza-sel" : "") + (activa ? " pieza-activa" : "");
            return (
              '<div class="' + clases + '" data-miembro="' + escapar(clave) + '" aria-pressed="' + (activa ? "true" : "false") + '" title="' +
                (dueno ? "Asignado a " + escapar(dueno) + " (toca para desasignar)" : "Sin asignar") + '">' +
                '<span>' + escapar(m.texto) + "</span>" +
                (dueno ? '<span class="pieza-dueno">→ ' + escapar(dueno) + "</span>" : "") +
              "</div>"
            );
          }).join("") +
        "</div>" +
      "</div>"
    );
  }

  function renderDiagrama(item, area) {
    let estadoActual = estado();
    if (!estadoActual || estadoActual.preguntaId !== item.id) {
      estadoActual = guardar(crearTablero(item));
      tabPool = "nodos";
    }
    const bloqueado = esBloqueado();
    const tituloNodos = TITULO_POOL_NODOS[item.subtipo] || "Entidades";
    const subtipoLabel = ETIQUETA_SUBTIPO[item.subtipo] || "Diagrama";
    const totalNodos = (estadoActual.nodosColocados.length + estadoActual.nodosDisponibles.length) || 0;
    const tieneMiembros = Array.isArray(item.miembrosPool) && item.miembrosPool.length > 0;
    if (!tieneMiembros) tabPool = "nodos";
    const asignadosMiembros = tieneMiembros
      ? item.miembrosPool.filter(m => !!estadoActual.miembros[claveMiembro(m)]).length
      : 0;
    const tabsMovilHtml = tieneMiembros
      ? '<div class="diagrama-tabs-movil" role="tablist" aria-label="Bandejas de piezas">' +
          '<button type="button" role="tab" class="diagrama-tab' + (tabPool === "nodos" ? " diagrama-tab--activa" : "") + '" data-tab-pool="nodos" aria-selected="' + (tabPool === "nodos" ? "true" : "false") + '">' +
            '<span>' + escapar(tituloNodos) + "</span>" +
            '<span class="diagrama-contador" id="contador-nodos-tab">' + estadoActual.nodosColocados.length + "/" + totalNodos + "</span>" +
          "</button>" +
          '<button type="button" role="tab" class="diagrama-tab' + (tabPool === "miembros" ? " diagrama-tab--activa" : "") + '" data-tab-pool="miembros" aria-selected="' + (tabPool === "miembros" ? "true" : "false") + '">' +
            '<span>Miembros</span>' +
            '<span class="diagrama-contador" id="contador-miembros-tab">' + asignadosMiembros + "/" + item.miembrosPool.length + "</span>" +
          "</button>" +
        "</div>"
      : "";
    const clasesPanelNodos = "diagrama-panel" +
      (tieneMiembros ? " diagrama-panel--con-tabs" : "") +
      (tieneMiembros && tabPool !== "nodos" ? " panel-oculto-movil" : "");

    area.innerHTML =
      (mostrarPregunta
        ? bloqueCaso(item) +
          '<div class="text-base sm:text-lg font-semibold leading-relaxed mb-3">' + escapar(item.q) + "</div>"
        : "") +
      '<div class="diagrama-workbench' + (expandido ? " workbench-expandido" : "") + '">' +
        '<aside class="diagrama-sidebar" aria-label="Piezas del diagrama">' +
          tabsMovilHtml +
          '<div class="' + clasesPanelNodos + '" data-panel-pool="nodos">' +
            '<div class="diagrama-panel-head">' +
              '<span class="diagrama-panel-titulo">' + escapar(tituloNodos) + "</span>" +
              '<span class="diagrama-contador" id="contador-nodos">' + estadoActual.nodosColocados.length + "/" + totalNodos + "</span>" +
            "</div>" +
            '<p class="diagrama-panel-sub">Arrastra al lienzo o toca para colocar:</p>' +
            '<div id="pool-diagrama" class="diagrama-pool">' +
              renderPoolNodosHtml(estadoActual) +
            "</div>" +
          "</div>" +
          renderPoolMiembrosHtml(item, estadoActual) +
          '<div class="diagrama-guia">' +
            "<span><b>Conectar:</b> toca un nodo y luego el destino.</span>" +
            "<span><b>Mover:</b> arrastra el nodo o usa las flechas.</span>" +
            "<span><b>Quitar:</b> pulsa × sobre el nodo o la relación.</span>" +
          "</div>" +
        "</aside>" +
        '<div class="diagrama-main">' +
          '<div class="lienzo-toolbar">' +
            '<div class="lienzo-toolbar-info">' +
              '<span class="lienzo-subtipo-badge">' + escapar(subtipoLabel) + "</span>" +
              '<span class="lienzo-metricas" id="metricas-lienzo">' +
                estadoActual.nodosColocados.length + " en lienzo · " + estadoActual.conexiones.length + " relaciones" +
              "</span>" +
            "</div>" +
            '<button type="button" class="btn-expandir-lienzo" id="btn-expandir-lienzo" aria-pressed="' + (expandido ? "true" : "false") + '">' +
              (expandido ? "Contraer lienzo" : "Ampliar lienzo") +
            "</button>" +
          "</div>" +
          '<div id="tipos-diagrama" class="flex flex-wrap gap-2 items-center" hidden>' +
            '<span class="tipos-etiqueta" id="tipos-etiqueta-texto">Tipo de relación:</span>' +
            tiposDe(item).map(t => '<button type="button" class="pieza" data-arista="' + escapar(t) + '">' + escapar(t) + "</button>").join("") +
            '<button type="button" class="btn-mini" data-action="' + accionCancelarTipo + '" aria-label="Cancelar selección">' + icono("cruz", "icono-sm") + "</button>" +
          "</div>" +
          '<div id="lienzo-diagrama" tabindex="0" role="group" aria-label="Lienzo del diagrama, desliza para desplazarte">' +
            '<div id="lienzo-area">' +
              '<svg id="edges-diagrama">' +
                '<defs><marker id="flecha-diagrama" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">' +
                '<path d="M0,0 L8,4 L0,8 z" class="flecha-punta"></path></marker></defs>' +
              "</svg>" +
            "</div>" +
          "</div>" +
          '<div class="lienzo-footer">' +
            '<p id="hint-diagrama" class="lienzo-hint" role="status" aria-live="polite"></p>' +
            '<button class="btn btn-primary" id="btn-comprobar-diagrama" data-action="' + accionComprobar + '" ' +
              (bloqueado ? "disabled" : "") + ">Comprobar</button>" +
          "</div>" +
        "</div>" +
      "</div>";

    const btnExpandir = $("btn-expandir-lienzo");
    if (btnExpandir) {
      btnExpandir.addEventListener("click", () => {
        expandido = !expandido;
        const wb = area.querySelector(".diagrama-workbench");
        if (wb) wb.classList.toggle("workbench-expandido", expandido);
        btnExpandir.setAttribute("aria-pressed", expandido ? "true" : "false");
        btnExpandir.textContent = expandido ? "Contraer lienzo" : "Ampliar lienzo";
        programarReposicion();
      });
    }

    // Segundo paso del flujo tap-tap: si hay una entidad seleccionada para colocar, tocar el fondo del papel la ubica allí.
    const lienzoEl = $("lienzo-diagrama");
    if (lienzoEl && !bloqueado) {
      let tapX0 = 0, tapY0 = 0, tapActivo = false;
      lienzoEl.addEventListener("pointerdown", e => {
        const tgt = /** @type {HTMLElement|null} */ (e.target);
        if (tgt && tgt.closest(".nodo-puesto,.etiqueta-arista")) return;
        tapX0 = e.clientX;
        tapY0 = e.clientY;
        tapActivo = true;
      });
      const ubicarEnToque = e => {
        if (!seleccion || !seleccion.startsWith("colocar:")) return;
        const tgt = /** @type {HTMLElement|null} */ (e.target);
        if (tgt && tgt.closest(".nodo-puesto,.etiqueta-arista")) return;
        const p = coordenadasEnPapel(e.clientX, e.clientY);
        if (!p) return;
        const nombre = seleccion.slice("colocar:".length);
        seleccion = null;
        colocarNodoUI(nombre, p.x - 56, p.y - 20);
      };
      lienzoEl.addEventListener("pointerup", e => {
        if (!tapActivo) return;
        tapActivo = false;
        if (Math.hypot(e.clientX - tapX0, e.clientY - tapY0) > 10) return;
        ubicarEnToque(e);
      });
      lienzoEl.addEventListener("pointercancel", () => { tapActivo = false; });
      lienzoEl.addEventListener("click", ubicarEnToque);
    }

    activarPool(area);
    activarTipos();
    pintarNodos(item, area);
    dibujarAristas(item);
  }

  function activarTipos() {
    const tipos = $("tipos-diagrama");
    if (!tipos) return;
    tipos.querySelectorAll("[data-arista]").forEach(btn => {
      btn.addEventListener("click", () => elegirTipo(btn.dataset.arista));
    });
  }

  function activarPool(area) {
    const sidebar = area && area.querySelector(".diagrama-sidebar");
    if (sidebar) {
      sidebar.querySelectorAll("[data-tab-pool]").forEach(btn => {
        if (/** @type {any} */ (btn)._tabBound) return;
        /** @type {any} */ (btn)._tabBound = true;
        btn.addEventListener("click", () => {
          tabPool = /** @type {HTMLElement} */ (btn).dataset.tabPool || "nodos";
          sidebar.querySelectorAll("[data-tab-pool]").forEach(b => {
            const activa = /** @type {HTMLElement} */ (b).dataset.tabPool === tabPool;
            b.classList.toggle("diagrama-tab--activa", activa);
            b.setAttribute("aria-selected", activa ? "true" : "false");
          });
          sidebar.querySelectorAll("[data-panel-pool]").forEach(p => {
            const visible = /** @type {HTMLElement} */ (p).dataset.panelPool === tabPool;
            p.classList.toggle("panel-oculto-movil", !visible);
          });
        });
      });
    }
    if (esBloqueado()) return;
    const cont = $("pool-diagrama");
    if (cont) cont.querySelectorAll("[data-nodo]").forEach(n => {
      n.addEventListener("pointerdown", inicioDesdePool);
      n.tabIndex = 0;
      n.setAttribute("role", "button");
      n.setAttribute("aria-label", "Colocar " + n.dataset.nodo + " en el lienzo");
      n.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          colocarNodoUI(n.dataset.nodo);
        }
      });
    });
    const miembros = $("pool-miembros");
    if (miembros) miembros.querySelectorAll("[data-miembro]").forEach(m => {
      m.addEventListener("pointerdown", inicioDesdePool);
      m.tabIndex = 0;
      m.setAttribute("role", "button");
      m.setAttribute("aria-label", "Miembro " + m.dataset.miembro + ". Enter para seleccionar y luego elegir la clase");
      m.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          colocarMiembro(m.dataset.miembro);
        }
      });
    });
  }

  // Lleva el foco a un control real del lienzo (WCAG 2.4.3) tras montar o cambiar de pregunta.
  function enfocarLienzo() {
    const primera = $("pool-diagrama") && $("pool-diagrama").querySelector(".pieza");
    const destino = primera || $("lienzo-diagrama") || $("btn-comprobar-diagrama");
    if (destino && typeof destino.focus === "function") destino.focus({ preventScroll: true });
  }

  function asignarMiembroUI(clave, nombreNodo) {
    const item = itemActual();
    if (!item) return;
    seleccion = null;
    guardar(asignarMiembro(estado(), clave, nombreNodo));
    renderDiagrama(item, zona());
    setHint("«" + clave + "» asignado a «" + nombreNodo + "».");
    enfocarPiezaPool("miembro", clave);
  }

  function inicioDesdePool(e) {
    if (esBloqueado()) return;
    const origen = /** @type {HTMLElement} */ (e.currentTarget);
    const etiqueta = origen.dataset.nodo || origen.dataset.miembro;
    const esMiembro = !!origen.dataset.miembro;
    const sobreDedo = e.pointerType === "touch";
    const x0 = e.clientX, y0 = e.clientY;
    let movido = false;
    const ghost = /** @type {HTMLElement} */ (origen.cloneNode(true));
    ghost.id = "ghost-diagrama";
    ghost.style.display = "none";
    document.body.appendChild(ghost);

    try { origen.setPointerCapture(e.pointerId); } catch { /* entornos sin captura */ }

    const mover = ev => {
      if (Math.hypot(ev.clientX - x0, ev.clientY - y0) > 6) movido = true;
      if (!movido) return;
      ghost.style.display = "block";
      ghost.style.left = ev.clientX - 40 + "px";
      ghost.style.top = (sobreDedo ? ev.clientY - 64 : ev.clientY - 14) + "px";
    };

    // Limpia siempre captura, listeners y elemento fantasma tanto en pointerup como en pointercancel.
    const limpiar = () => {
      try { origen.releasePointerCapture(e.pointerId); } catch { /* ignorar */ }
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerup", soltar);
      window.removeEventListener("pointercancel", soltar);
      ghost.remove();
    };

    const soltar = ev => {
      limpiar();
      if (!movido) {
        if (esMiembro) {
          colocarMiembro(etiqueta);
          return;
        }
        // En entorno táctil, tocar un chip lo selecciona para colocarlo al tocar el papel (tap-tap).
        if (esEntornoTactil() || sobreDedo) {
          if (seleccion === "colocar:" + etiqueta) {
            seleccion = null;
            colocarNodoUI(etiqueta);
          } else {
            cancelarSeleccion();
            seleccion = "colocar:" + etiqueta;
            sincronizarObjetivos();
            setHint("«" + etiqueta + "» seleccionada. Toca el punto del lienzo donde quieras colocarla.");
          }
        } else {
          colocarNodoUI(etiqueta);
        }
        return;
      }
      const p = coordenadasEnPapel(ev.clientX, ev.clientY);
      if (!p) return;
      if (esMiembro) {
        const bajo = document.elementFromPoint(ev.clientX, ev.clientY);
        const nodo = bajo && /** @type {HTMLElement|null} */ (bajo.closest(".nodo-puesto"));
        if (nodo) {
          asignarMiembroUI(etiqueta, nodo.dataset.label);
        } else {
          setHint("Suelta el miembro sobre una clase para asignarlo (o tócalo y luego toca la clase).");
        }
      } else {
        seleccion = null;
        colocarNodoUI(etiqueta, p.x - 56, p.y - 20);
      }
    };

    window.addEventListener("pointermove", mover);
    window.addEventListener("pointerup", soltar);
    window.addEventListener("pointercancel", soltar);
  }

  function itemActual() {
    if (obtenerItem) return obtenerItem();
    const session = ctx && ctx.session;
    return session && session.items[session.idx];
  }

  function colocarNodoUI(nombre, x, y) {
    const item = itemActual();
    if (!item || esBloqueado()) return;

    let nuevoEstado = colocarNodo(estado(), nombre);

    if (x !== undefined && y !== undefined) {
      const papel = $area();
      const anchoPapel = papel ? Math.max(papel.scrollWidth || 0, papel.clientWidth || 0) : 0;
      const altoPapel = papel ? Math.max(papel.scrollHeight || 0, papel.clientHeight || 0) : 0;
      if (anchoPapel > 0 && altoPapel > 0) {
        const maxX = Math.max(4, anchoPapel - 130);
        const maxY = Math.max(4, altoPapel - 64);
        const xAjustada = Math.max(8, Math.min(x, maxX));
        const yAjustada = Math.max(8, Math.min(y, maxY));
        nuevoEstado = actualizarPosicion(nuevoEstado, nombre, xAjustada, yAjustada);
      } else {
        nuevoEstado = actualizarPosicion(nuevoEstado, nombre, Math.max(8, x), Math.max(8, y));
      }
    }

    guardar(nuevoEstado);
    pintarNodos(item, zona());
    dibujarAristas(item);
    setHint("«" + nombre + "» en el lienzo. Toca un nodo y luego otro para conectarlos.");
    enfocarNodo(nombre);
    if (x === undefined || y === undefined) {
      const zonaEl = zona();
      const nuevo = zonaEl && Array.from(zonaEl.querySelectorAll(".nodo-puesto")).find(n => /** @type {HTMLElement} */ (n).dataset.label === nombre);
      if (nuevo && nuevo.scrollIntoView) nuevo.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }

  function colocarMiembro(clave) {
    const item = itemActual();
    if (!item || esBloqueado()) return;
    const est = estado();
    if (est.miembros[clave]) {
      seleccion = null;
      guardar(asignarMiembro(est, clave, null));
      renderDiagrama(item, zona());
      setHint("«" + clave + "» devuelto al pool. Toca un miembro y luego la clase destino.");
      enfocarPiezaPool("miembro", clave);
      return;
    }
    if (seleccion === "miembro:" + clave) {
      seleccion = null;
      sincronizarObjetivos();
      setHint("Selección de miembro cancelada.");
      return;
    }
    cancelarSeleccion();
    seleccion = "miembro:" + clave;
    sincronizarObjetivos();
    setHint("«" + clave + "» seleccionado. Toca la clase destino en el lienzo.");
  }

  function quitarNodoUI(nombre) {
    const item = itemActual();
    if (!item || esBloqueado()) return;
    seleccion = null;
    guardar(quitarNodo(estado(), Array.isArray(item.nodosFijos) ? item.nodosFijos : [], nombre));
    renderDiagrama(item, zona());
    setHint("Nodo «" + nombre + "» retirado del lienzo.");
    enfocarPiezaPool("nodo", nombre);
  }

  // Resalta visualmente los nodos destino cuando hay un nodo origen o un miembro activo.
  function sincronizarObjetivos() {
    const papel = $area();
    if (papel) {
      const esperandoDestino = Boolean(seleccion && (seleccion.startsWith("nodo:") || seleccion.startsWith("miembro:")));
      const origenNodo = seleccion && seleccion.startsWith("nodo:") ? seleccion.slice("nodo:".length) : null;
      papel.querySelectorAll(".nodo-puesto").forEach(el => {
        const label = /** @type {HTMLElement} */ (el).dataset.label;
        const esOrigen = origenNodo && label === origenNodo;
        el.classList.toggle("seleccionado", Boolean(esOrigen));
        el.setAttribute("aria-pressed", esOrigen ? "true" : "false");
        el.classList.toggle("nodo-objetivo", esperandoDestino && !esOrigen);
      });
    }
    const poolN = $("pool-diagrama");
    if (poolN) {
      const nodoActivo = seleccion && seleccion.startsWith("colocar:") ? seleccion.slice("colocar:".length) : null;
      poolN.querySelectorAll("[data-nodo]").forEach(el => {
        const activa = nodoActivo && /** @type {HTMLElement} */ (el).dataset.nodo === nodoActivo;
        el.classList.toggle("pieza-activa", Boolean(activa));
        el.setAttribute("aria-pressed", activa ? "true" : "false");
      });
    }
    const poolM = $("pool-miembros");
    if (poolM) {
      const claveActiva = seleccion && seleccion.startsWith("miembro:") ? seleccion.slice("miembro:".length) : null;
      poolM.querySelectorAll("[data-miembro]").forEach(el => {
        const activa = claveActiva && /** @type {HTMLElement} */ (el).dataset.miembro === claveActiva;
        el.classList.toggle("pieza-activa", Boolean(activa));
        el.setAttribute("aria-pressed", activa ? "true" : "false");
      });
    }
    const lienzoEl = $("lienzo-diagrama");
    if (lienzoEl) {
      lienzoEl.classList.toggle("lienzo-esperando-colocar", Boolean(seleccion && seleccion.startsWith("colocar:")));
    }
  }

  function inicioMoverNodo(e) {
    if (esBloqueado()) return;
    const n = /** @type {HTMLElement} */ (e.currentTarget);
    const tgt = /** @type {HTMLElement|null} */ (e.target);
    if (tgt && (tgt.closest(".nodo-quitar") || tgt.closest(".miembro-quitar"))) return;
    if (seleccion && seleccion.indexOf("nodo:") === 0) return;
    e.preventDefault();
    e.stopPropagation();

    const lienzo = $("lienzo-diagrama");
    const papel = $area();
    if (!papel || !lienzo) return;
    const x0 = e.clientX, y0 = e.clientY;
    const scrollX0 = lienzo.scrollLeft || 0, scrollY0 = lienzo.scrollTop || 0;
    const l0 = n.offsetLeft, t0 = n.offsetTop;
    let movido = false;

    try { n.setPointerCapture(e.pointerId); } catch { /* pointer no capturable */ }

    const mover = ev => {
      if (Math.hypot(ev.clientX - x0, ev.clientY - y0) > 6) {
        movido = true;
        n.classList.add("arrastrando");
      }
      if (!movido) return;

      const rMarco = lienzo.getBoundingClientRect();
      const margen = 48;
      let dx = 0, dy = 0;
      if (ev.clientY < rMarco.top + margen) dy = -10;
      else if (ev.clientY > rMarco.bottom - margen) dy = 10;
      if (ev.clientX < rMarco.left + margen) dx = -10;
      else if (ev.clientX > rMarco.right - margen) dx = 10;
      if (dx || dy) {
        lienzo.scrollLeft += dx;
        lienzo.scrollTop += dy;
      }

      const anchoPapel = Math.max(papel.scrollWidth || 0, papel.clientWidth || 0);
      const altoPapel = Math.max(papel.scrollHeight || 0, papel.clientHeight || 0);
      const maxX = Math.max(0, anchoPapel - n.offsetWidth);
      const maxY = Math.max(0, altoPapel - n.offsetHeight);
      const dxScroll = (lienzo.scrollLeft || 0) - scrollX0;
      const dyScroll = (lienzo.scrollTop || 0) - scrollY0;
      const nuevoX = Math.max(0, Math.min(l0 + (ev.clientX - x0) + dxScroll, maxX));
      const nuevoY = Math.max(0, Math.min(t0 + (ev.clientY - y0) + dyScroll, maxY));
      n.style.left = nuevoX + "px";
      n.style.top = nuevoY + "px";
      programarReposicion();
    };

    const limpiar = () => {
      try { n.releasePointerCapture(e.pointerId); } catch { /* ignorar */ }
      n.classList.remove("arrastrando");
      n.removeEventListener("pointermove", mover);
      n.removeEventListener("pointerup", soltar);
      n.removeEventListener("pointercancel", soltar);
    };

    const soltar = () => {
      limpiar();
      if (!movido) {
        toqueNodo(n.dataset.label);
      } else {
        const nuevaX = parseInt(n.style.left, 10);
        const nuevaY = parseInt(n.style.top, 10);
        guardar(actualizarPosicion(estado(), n.dataset.label, nuevaX, nuevaY));
        reposicionarAristas();
      }
    };

    n.addEventListener("pointermove", mover);
    n.addEventListener("pointerup", soltar);
    n.addEventListener("pointercancel", soltar);
  }

  function toqueNodo(nombre) {
    const item = itemActual();
    if (!item || esBloqueado()) return;
    if (seleccion && seleccion.indexOf("miembro:") === 0) {
      const clave = seleccion.slice("miembro:".length);
      asignarMiembroUI(clave, nombre);
      return;
    }
    if (seleccion && seleccion.indexOf("nodo:") === 0) {
      segundoToque(nombre);
      return;
    }
    cancelarSeleccion();
    seleccion = "nodo:" + nombre;
    sincronizarObjetivos();
    setHint("«" + nombre + "» seleccionado. Toca otro nodo iluminado para conectarlo.");
  }

  function cancelarSeleccion() {
    seleccion = null;
    sincronizarObjetivos();
    const tipos = $("tipos-diagrama");
    if (tipos) tipos.hidden = true;
  }

  function segundoToque(nombre) {
    const item = itemActual();
    if (!item || !seleccion || seleccion.indexOf("nodo:") !== 0) return;
    const primero = seleccion.slice("nodo:".length);
    cancelarSeleccion();
    if (primero === nombre) {
      setHint("Selección cancelada.");
      return;
    }
    const tipos = $("tipos-diagrama");
    if (!tipos) return;
    tipos.dataset.de = primero;
    tipos.dataset.a = nombre;
    const etiquetaTexto = $("tipos-etiqueta-texto");
    if (etiquetaTexto) {
      etiquetaTexto.textContent = "Conectar «" + primero + "» con «" + nombre + "»:";
    }
    tipos.hidden = false;
    const primerBtn = /** @type {HTMLElement|null} */ (tipos.querySelector("[data-arista]"));
    if (primerBtn) primerBtn.focus({ preventScroll: true });
    setHint("Elige el tipo de relación entre «" + primero + "» y «" + nombre + "».");
  }

  function elegirTipo(tipo) {
    const item = itemActual();
    const tipos = $("tipos-diagrama");
    if (!item || !tipos || tipos.hidden) return;
    const est = estado();
    const de = tipos.dataset.de;
    const a = tipos.dataset.a;
    const dirigido = esDirigidoTipo(item.subtipo, tipo);

    if (item.subtipo === "actividades") {
      mostrarSelectorGuarda(de, a, tipo, dirigido, item);
    } else {
      const v = validarConexion(est, de, a, tipo, dirigido);
      if (!v.valida) {
        setHint(v.mensajeAccesible);
        return;
      }
      guardar(conectar(est, de, a, tipo, dirigido));
      tipos.hidden = true;
      pintarNodos(item, zona());
      dibujarAristas(item);
      setHint(v.mensajeAccesible + ". Pulsa «Comprobar» cuando el diagrama esté listo.");
      enfocarNodo(de);
    }
  }

  function guardasDe(item) {
    const declaradas = (item.relacionesEsperadas || [])
      .map(r => r && r.guarda)
      .filter(g => typeof g === "string" && g.trim().length);
    const unicas = [...new Set(declaradas)];
    return unicas.length ? unicas : ["[sí]", "[no]", "[verdadero]", "[falso]"];
  }

  function mostrarSelectorGuarda(de, a, tipo, dirigido, item) {
    const focoPrevio = document.activeElement;
    const modal = document.createElement("div");
    modal.className = "modal-guarda";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "titulo-modal-guarda");
    modal.innerHTML =
      '<div class="modal-guarda-contenido">' +
        '<h3 id="titulo-modal-guarda">Seleccionar guarda</h3>' +
        "<p>Elige la condición para la transición <b>" + escapar(de) + " → " + escapar(a) + "</b>:</p>" +
        '<div class="guardas-opciones">' +
          '<button type="button" class="btn-guarda" data-guarda="">Sin guarda</button>' +
          guardasDe(item).map(g => '<button type="button" class="btn-guarda" data-guarda="' + escapar(g) + '">' + escapar(g) + "</button>").join("") +
        "</div>" +
        '<button type="button" class="btn-cancelar" id="cancelar-guarda">Cancelar</button>' +
      "</div>";
    document.body.appendChild(modal);

    const cerrar = () => {
      modal.remove();
      if (focoPrevio && typeof /** @type {HTMLElement} */ (focoPrevio).focus === "function") {
        /** @type {HTMLElement} */ (focoPrevio).focus({ preventScroll: true });
      }
    };
    const primero = /** @type {HTMLElement|null} */ (modal.querySelector(".btn-guarda"));
    if (primero) primero.focus();

    modal.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        e.preventDefault();
        cerrar();
        return;
      }
      if (e.key !== "Tab") return;
      const botones = /** @type {HTMLButtonElement[]} */ (Array.from(modal.querySelectorAll("button")));
      const idx = botones.indexOf(/** @type {HTMLButtonElement} */ (document.activeElement));
      if (e.shiftKey && idx <= 0) {
        e.preventDefault();
        botones[botones.length - 1].focus();
      } else if (!e.shiftKey && idx === botones.length - 1) {
        e.preventDefault();
        botones[0].focus();
      }
    });
    modal.addEventListener("pointerdown", e => { if (e.target === modal) cerrar(); });

    /** @type {NodeListOf<HTMLElement>} */ (modal.querySelectorAll(".btn-guarda")).forEach(btn => {
      btn.addEventListener("click", () => {
        const guarda = btn.dataset.guarda || undefined;
        const est = estado();
        const v = validarConexion(est, de, a, tipo, dirigido, guarda);
        if (!v.valida) {
          setHint(v.mensajeAccesible);
          return;
        }
        guardar(conectar(est, de, a, tipo, dirigido, guarda));
        cerrar();
        const tipos = $("tipos-diagrama");
        if (tipos) tipos.hidden = true;
        pintarNodos(item, zona());
        dibujarAristas(item);
        setHint("Relación creada" + (guarda ? " con guarda " + guarda : "") + ". Pulsa «Comprobar» cuando el diagrama esté listo.");
        enfocarNodo(de);
      });
    });

    modal.querySelector("#cancelar-guarda").addEventListener("click", cerrar);
  }

  function actualizarContadores(item, est) {
    const total = est.nodosColocados.length + est.nodosDisponibles.length;
    const textoNodos = est.nodosColocados.length + "/" + total;
    const cNodos = $("contador-nodos");
    if (cNodos) cNodos.textContent = textoNodos;
    const cNodosTab = $("contador-nodos-tab");
    if (cNodosTab) cNodosTab.textContent = textoNodos;

    if (Array.isArray(item.miembrosPool)) {
      const asignados = item.miembrosPool.filter(m => !!est.miembros[claveMiembro(m)]).length;
      const textoMiembros = asignados + "/" + item.miembrosPool.length;
      const cMiembros = $("contador-miembros");
      if (cMiembros) cMiembros.textContent = textoMiembros;
      const cMiembrosTab = $("contador-miembros-tab");
      if (cMiembrosTab) cMiembrosTab.textContent = textoMiembros;
    }
    const metricas = $("metricas-lienzo");
    if (metricas) {
      metricas.textContent = est.nodosColocados.length + " en lienzo · " + est.conexiones.length + " relaciones";
    }
  }

  function pintarNodos(item, area) {
    const est = estado();
    if (!est) return;
    const papel = $area();
    if (!papel) return;
    const bloqueado = esBloqueado();
    papel.querySelectorAll(".nodo-puesto,.etiqueta-arista,.lienzo-vacio").forEach(el => el.remove());

    if (est.nodosColocados.length === 0) {
      const vacio = document.createElement("div");
      vacio.className = "lienzo-vacio";
      vacio.setAttribute("aria-hidden", "true");
      vacio.innerHTML =
        '<div class="lienzo-vacio-caja">' +
          '<div class="lienzo-vacio-titulo">Lienzo vacío</div>' +
          '<div class="lienzo-vacio-sub">Toca o arrastra las piezas del panel izquierdo para colocarlas aquí y conectar sus relaciones.</div>' +
        "</div>";
      papel.appendChild(vacio);
    }

    est.nodosColocados.forEach(nombre => {
      const fijo = Array.isArray(item.nodosFijos) && item.nodosFijos.indexOf(nombre) !== -1;
      const n = document.createElement("div");
      n.className = "nodo-puesto" + (fijo ? " nodo-fijo" : "");
      n.dataset.label = nombre;

      const pos = est.posiciones[nombre] || { x: 60, y: 60 };
      const anchoPapel = Math.max(papel.scrollWidth || 0, papel.clientWidth || 0);
      const altoPapel = Math.max(papel.scrollHeight || 0, papel.clientHeight || 0);
      if (anchoPapel > 0 && altoPapel > 0) {
        const maxX = Math.max(8, anchoPapel - 130);
        const maxY = Math.max(8, altoPapel - 64);
        n.style.left = Math.max(8, Math.min(pos.x, maxX)) + "px";
        n.style.top = Math.max(8, Math.min(pos.y, maxY)) + "px";
      } else {
        n.style.left = Math.max(4, pos.x) + "px";
        n.style.top = Math.max(4, pos.y) + "px";
      }

      let contenido = '<span class="nodo-nombre">' + escapar(nombre) + "</span>";
      const miembrosDelNodo = [];

      if (Array.isArray(item.miembrosPool) && item.miembrosPool.length > 0) {
        const asignados = item.miembrosPool.filter(m => est.miembros[claveMiembro(m)] === nombre);
        if (asignados.length > 0) {
          contenido += '<div class="nodo-miembros">' +
            asignados.map(m => {
              const clave = claveMiembro(m);
              miembrosDelNodo.push(m.texto);
              return (
                '<div class="miembro-item">' +
                  '<span>' + escapar(m.texto) + "</span>" +
                  (!bloqueado
                    ? '<button type="button" class="miembro-quitar" tabindex="-1" data-desasignar="' + escapar(clave) + '" title="Desasignar ' + escapar(m.texto) + '" aria-label="Desasignar ' + escapar(m.texto) + '">×</button>'
                    : "") +
                "</div>"
              );
            }).join("") +
          "</div>";
        }
      }

      n.innerHTML = contenido;
      n.tabIndex = 0;
      n.setAttribute("role", "button");
      n.setAttribute("aria-pressed", "false");
      if (bloqueado) n.setAttribute("aria-disabled", "true");

      const descMiembros = miembrosDelNodo.length
        ? ", con " + miembrosDelNodo.length + (miembrosDelNodo.length === 1 ? " miembro: " : " miembros: ") + miembrosDelNodo.join(", ")
        : "";
      n.setAttribute(
        "aria-label",
        "Nodo " + nombre + descMiembros + ". Enter para seleccionar o conectar, flechas para mover" + (fijo ? "" : ", Supr para quitar") + "."
      );

      // Permitir desasignar un miembro directamente desde la tarjeta de la clase.
      n.querySelectorAll(".miembro-quitar").forEach(btn => {
        btn.addEventListener("click", ev => {
          ev.stopPropagation();
          const clave = /** @type {HTMLElement} */ (btn).dataset.desasignar;
          if (!clave || esBloqueado()) return;
          guardar(asignarMiembro(estado(), clave, null));
          renderDiagrama(item, zona());
          setHint("Miembro «" + clave + "» desasignado.");
        });
      });

      if (!fijo && !bloqueado) {
        const quitar = document.createElement("button");
        quitar.type = "button";
        quitar.className = "nodo-quitar";
        quitar.tabIndex = -1;
        quitar.innerHTML = icono("cruz", "icono-sm");
        quitar.setAttribute("aria-label", "Quitar " + nombre);
        quitar.addEventListener("click", ev => {
          ev.stopPropagation();
          quitarNodoUI(nombre);
        });
        n.appendChild(quitar);
      }

      if (!bloqueado) {
        n.addEventListener("pointerdown", e => {
          const tgt = /** @type {HTMLElement|null} */ (e.target);
          if (tgt && (tgt.closest(".nodo-quitar") || tgt.closest(".miembro-quitar"))) return;
          if (seleccion && seleccion.indexOf("nodo:") === 0) {
            e.preventDefault();
            e.stopPropagation();
            segundoToque(nombre);
            return;
          }
          if (seleccion && seleccion.indexOf("miembro:") === 0) {
            e.preventDefault();
            e.stopPropagation();
            const clave = seleccion.slice("miembro:".length);
            asignarMiembroUI(clave, nombre);
            return;
          }
          inicioMoverNodo(e);
        });

        n.addEventListener("keydown", e => {
          if (e.target !== n) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toqueNodo(nombre);
            return;
          }
          if (e.key === "Escape") {
            e.preventDefault();
            cancelarSeleccion();
            setHint("Selección cancelada.");
            return;
          }
          if (!fijo && (e.key === "Delete" || e.key === "Backspace")) {
            e.preventDefault();
            quitarNodoUI(nombre);
            return;
          }
          const paso = 12;
          const deltas = { ArrowLeft: [-paso, 0], ArrowRight: [paso, 0], ArrowUp: [0, -paso], ArrowDown: [0, paso] };
          if (deltas[e.key]) {
            e.preventDefault();
            const [dx, dy] = deltas[e.key];
            const anchoPapel = Math.max(papel.scrollWidth || 0, papel.clientWidth || 0);
            const altoPapel = Math.max(papel.scrollHeight || 0, papel.clientHeight || 0);
            const maxX = anchoPapel > 0 ? Math.max(0, anchoPapel - n.offsetWidth) : Infinity;
            const maxY = altoPapel > 0 ? Math.max(0, altoPapel - n.offsetHeight) : Infinity;
            const nuevoX = Math.max(0, Math.min(n.offsetLeft + dx, maxX));
            const nuevoY = Math.max(0, Math.min(n.offsetTop + dy, maxY));
            n.style.left = nuevoX + "px";
            n.style.top = nuevoY + "px";
            programarReposicion();
            guardar(actualizarPosicion(estado(), nombre, nuevoX, nuevoY));
          }
        });
      }
      papel.appendChild(n);
    });
    actualizarPool(item, area);
    actualizarContadores(item, est);
    sincronizarObjetivos();
  }

  function actualizarPool(item, area) {
    const est = estado();
    if (!est) return;
    const pool = $("pool-diagrama");
    if (pool) {
      pool.innerHTML = renderPoolNodosHtml(est);
    }
    activarPool(area);
  }

  function reposicionarAristas() {
    aristasDom.forEach(({ linea, etiqueta, nDe, nA, offset }) => {
      const c1 = { x: nDe.offsetLeft + nDe.offsetWidth / 2, y: nDe.offsetTop + nDe.offsetHeight / 2 };
      const c2 = { x: nA.offsetLeft + nA.offsetWidth / 2, y: nA.offsetTop + nA.offsetHeight / 2 };
      const dx = c2.x - c1.x;
      const dy = c2.y - c1.y;
      const dist = Math.hypot(dx, dy) || 1;
      // Vector normal unitario para separar aristas paralelas entre los mismos dos nodos.
      const nx = (-dy / dist) * offset;
      const ny = (dx / dist) * offset;
      const p1 = puntoBordeNodo(nDe, c2.x + nx, c2.y + ny, nx, ny);
      const p2 = puntoBordeNodo(nA, c1.x + nx, c1.y + ny, nx, ny);
      linea.setAttribute("x1", String(p1.x));
      linea.setAttribute("y1", String(p1.y));
      linea.setAttribute("x2", String(p2.x));
      linea.setAttribute("y2", String(p2.y));
      etiqueta.style.left = (p1.x + p2.x) / 2 + "px";
      etiqueta.style.top = (p1.y + p2.y) / 2 + "px";
    });
  }

  function programarReposicion() {
    if (typeof requestAnimationFrame !== "function") {
      reposicionarAristas();
      return;
    }
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(reposicionarAristas);
  }

  function dibujarAristas(item) {
    const est = estado();
    const svg = $("edges-diagrama");
    const papel = $area();
    if (!svg || !papel || !est) return;
    const bloqueado = esBloqueado();
    svg.querySelectorAll("line").forEach(el => el.remove());
    inyectarMarcador();
    papel.querySelectorAll(".etiqueta-arista").forEach(el => el.remove());
    aristasDom = [];

    const mapa = new Map();
    /** @type {NodeListOf<HTMLElement>} */ (papel.querySelectorAll(".nodo-puesto")).forEach(n => {
      mapa.set(n.dataset.label, n);
    });
    const r = papel.getBoundingClientRect();
    const anchoSvg = Math.max(papel.scrollWidth || 0, papel.clientWidth || 0, 1);
    const altoSvg = Math.max(papel.scrollHeight || 0, papel.clientHeight || 0, r.height || 520);
    svg.setAttribute("width", String(anchoSvg));
    svg.setAttribute("height", String(altoSvg));

    // Agrupamos por par de nodos sin orden para desplazar lateralmente relaciones paralelas.
    const conteoPar = new Map();
    est.conexiones.forEach(c => {
      const clavePar = [c.de, c.a].sort().join("::");
      conteoPar.set(clavePar, (conteoPar.get(clavePar) || 0) + 1);
    });
    const indicePar = new Map();

    est.conexiones.forEach(c => {
      const nDe = mapa.get(c.de);
      const nA = mapa.get(c.a);
      if (!nDe || !nA) return;
      const clavePar = [c.de, c.a].sort().join("::");
      const totalPar = conteoPar.get(clavePar) || 1;
      const idxActual = indicePar.get(clavePar) || 0;
      indicePar.set(clavePar, idxActual + 1);
      const offset = totalPar > 1 ? (idxActual - (totalPar - 1) / 2) * 26 : 0;

      const dirigidoTipo = esDirigidoTipo((item || {}).subtipo, c.tipo);
      const linea = document.createElementNS("http://www.w3.org/2000/svg", "line");
      const tipoNorm = normalizarClave(c.tipo);
      if (tipoNorm === "include" || tipoNorm === "extend") {
        linea.setAttribute("class", "arista-punteada");
      }
      if (dirigidoTipo) linea.setAttribute("marker-end", "url(#flecha-diagrama)");
      svg.appendChild(linea);

      const etiqueta = document.createElement("button");
      etiqueta.type = "button";
      etiqueta.className = "etiqueta-arista";
      let textoEtiqueta = c.tipo;
      if (c.guarda) textoEtiqueta += " " + c.guarda;
      etiqueta.innerHTML = escapar(textoEtiqueta) + (bloqueado ? "" : icono("cruz", "icono-sm"));
      etiqueta.setAttribute("aria-label", "Quitar relación " + textoEtiqueta + " entre " + c.de + " y " + c.a);
      if (bloqueado) {
        etiqueta.disabled = true;
        etiqueta.setAttribute("aria-disabled", "true");
      } else {
        etiqueta.addEventListener("click", () => {
          guardar(quitarConexion(estado(), c.de, c.a, c.tipo, dirigidoTipo, c.guarda));
          pintarNodos(item, zona());
          dibujarAristas(item);
          setHint("Relación eliminada.");
          enfocarNodo(c.de);
        });
      }
      papel.appendChild(etiqueta);
      aristasDom.push({ linea, etiqueta, nDe, nA, offset });
    });

    reposicionarAristas();
    actualizarContadores(item, est);
  }

  function setHint(texto) {
    const h = $("hint-diagrama");
    if (h) h.textContent = texto;
  }

  function enfocarNodo(nombre) {
    const zonaEl = zona();
    if (!zonaEl) return;
    const destino = Array.from(zonaEl.querySelectorAll(".nodo-puesto")).find(n => n.dataset.label === nombre);
    if (destino) destino.focus({ preventScroll: true });
  }

  function enfocarPiezaPool(atributo, valor) {
    const zonaEl = zona();
    if (!zonaEl) return;
    const destino = Array.from(zonaEl.querySelectorAll(".pieza")).find(p => p.dataset[atributo] === valor);
    if (destino) destino.focus({ preventScroll: true });
  }

  function inyectarMarcador() {
    const svg = $("edges-diagrama");
    if (!svg || svg.querySelector("#flecha-diagrama")) return;
    svg.insertAdjacentHTML(
      "afterbegin",
      '<defs><marker id="flecha-diagrama" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">' +
      '<path d="M0,0 L8,4 L0,8 z" class="flecha-punta"></path></marker></defs>'
    );
  }

  return {
    renderDiagrama,
    pintarNodos,
    dibujarAristas,
    elegirTipo,
    cancelarSeleccion,
    colocarMiembro,
    colocarNodoUI,
    quitarNodoUI,
    enfocarLienzo
  };
}
