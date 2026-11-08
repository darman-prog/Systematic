// Interacción del lienzo de diagramas: eventos de puntero y teclado, selección,
// colocación de piezas y conexión de nodos. La pintura y las plantillas viven aparte.
import { escapar } from "../../helpers.js";
import {
  esDirigidoTipo, crearTablero, colocarNodo, quitarNodo,
  asignarMiembro, validarConexion, conectar, actualizarPosicion,
  claveMiembro
} from "../../../core/index.js";
import { esEntornoTactil, coordenadasEnPapel as coordsEnPapel } from "./geometria.js";
import { ETIQUETA_SUBTIPO, TITULO_POOL_NODOS, guardasDe, renderWorkbench } from "./plantillas.js";

export function crearInteraccion({
  $,
  $area,
  zona,
  estado,
  guardar,
  esBloqueado,
  ui,
  pintura,
  ctx,
  obtenerItem,
  accionComprobar,
  accionCancelarTipo,
  mostrarPregunta
}) {
  const coordenadasEnPapel = (clientX, clientY) => coordsEnPapel($, $area, clientX, clientY);

  function renderDiagrama(item, area) {
    let estadoActual = estado();
    if (!estadoActual || estadoActual.preguntaId !== item.id) {
      estadoActual = guardar(crearTablero(item));
      ui.tabPool = "nodos";
    }
    const bloqueado = esBloqueado();
    const tituloNodos = TITULO_POOL_NODOS[item.subtipo] || "Entidades";
    const subtipoLabel = ETIQUETA_SUBTIPO[item.subtipo] || "Diagrama";
    const totalNodos = (estadoActual.nodosColocados.length + estadoActual.nodosDisponibles.length) || 0;
    const tieneMiembros = Array.isArray(item.miembrosPool) && item.miembrosPool.length > 0;
    if (!tieneMiembros) ui.tabPool = "nodos";
    const asignadosMiembros = tieneMiembros
      ? item.miembrosPool.filter(m => !!estadoActual.miembros[claveMiembro(m)]).length
      : 0;
    area.innerHTML = renderWorkbench({
      item,
      estadoActual,
      bloqueado,
      expandido: ui.expandido,
      tabPool: ui.tabPool,
      seleccion: ui.seleccion,
      tituloNodos,
      subtipoLabel,
      totalNodos,
      tieneMiembros,
      asignadosMiembros,
      mostrarPregunta,
      accionComprobar,
      accionCancelarTipo
    });

    const btnExpandir = $("btn-expandir-lienzo");
    if (btnExpandir) {
      btnExpandir.addEventListener("click", () => {
        ui.expandido = !ui.expandido;
        const wb = area.querySelector(".diagrama-workbench");
        if (wb) wb.classList.toggle("workbench-expandido", ui.expandido);
        btnExpandir.setAttribute("aria-pressed", ui.expandido ? "true" : "false");
        btnExpandir.textContent = ui.expandido ? "Contraer lienzo" : "Ampliar lienzo";
        pintura.programarReposicion();
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
        if (!ui.seleccion || !ui.seleccion.startsWith("colocar:")) return;
        const tgt = /** @type {HTMLElement|null} */ (e.target);
        if (tgt && tgt.closest(".nodo-puesto,.etiqueta-arista")) return;
        const p = coordenadasEnPapel(e.clientX, e.clientY);
        if (!p) return;
        const nombre = ui.seleccion.slice("colocar:".length);
        ui.seleccion = null;
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
    pintura.pintarNodos(item, area);
    pintura.dibujarAristas(item);
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
          ui.tabPool = /** @type {HTMLElement} */ (btn).dataset.tabPool || "nodos";
          sidebar.querySelectorAll("[data-tab-pool]").forEach(b => {
            const activa = /** @type {HTMLElement} */ (b).dataset.tabPool === ui.tabPool;
            b.classList.toggle("diagrama-tab--activa", activa);
            b.setAttribute("aria-selected", activa ? "true" : "false");
          });
          sidebar.querySelectorAll("[data-panel-pool]").forEach(p => {
            const visible = /** @type {HTMLElement} */ (p).dataset.panelPool === ui.tabPool;
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
    ui.seleccion = null;
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
          if (ui.seleccion === "colocar:" + etiqueta) {
            ui.seleccion = null;
            colocarNodoUI(etiqueta);
          } else {
            cancelarSeleccion();
            ui.seleccion = "colocar:" + etiqueta;
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
        ui.seleccion = null;
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
    pintura.pintarNodos(item, zona());
    pintura.dibujarAristas(item);
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
      ui.seleccion = null;
      guardar(asignarMiembro(est, clave, null));
      renderDiagrama(item, zona());
      setHint("«" + clave + "» devuelto al pool. Toca un miembro y luego la clase destino.");
      enfocarPiezaPool("miembro", clave);
      return;
    }
    if (ui.seleccion === "miembro:" + clave) {
      ui.seleccion = null;
      sincronizarObjetivos();
      setHint("Selección de miembro cancelada.");
      return;
    }
    cancelarSeleccion();
    ui.seleccion = "miembro:" + clave;
    sincronizarObjetivos();
    setHint("«" + clave + "» seleccionado. Toca la clase destino en el lienzo.");
  }

  function quitarNodoUI(nombre) {
    const item = itemActual();
    if (!item || esBloqueado()) return;
    ui.seleccion = null;
    guardar(quitarNodo(estado(), Array.isArray(item.nodosFijos) ? item.nodosFijos : [], nombre));
    renderDiagrama(item, zona());
    setHint("Nodo «" + nombre + "» retirado del lienzo.");
    enfocarPiezaPool("nodo", nombre);
  }

  // Resalta visualmente los nodos destino cuando hay un nodo origen o un miembro activo.
  function sincronizarObjetivos() {
    const papel = $area();
    if (papel) {
      const esperandoDestino = Boolean(ui.seleccion && (ui.seleccion.startsWith("nodo:") || ui.seleccion.startsWith("miembro:")));
      const origenNodo = ui.seleccion && ui.seleccion.startsWith("nodo:") ? ui.seleccion.slice("nodo:".length) : null;
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
      const nodoActivo = ui.seleccion && ui.seleccion.startsWith("colocar:") ? ui.seleccion.slice("colocar:".length) : null;
      poolN.querySelectorAll("[data-nodo]").forEach(el => {
        const activa = nodoActivo && /** @type {HTMLElement} */ (el).dataset.nodo === nodoActivo;
        el.classList.toggle("pieza-activa", Boolean(activa));
        el.setAttribute("aria-pressed", activa ? "true" : "false");
      });
    }
    const poolM = $("pool-miembros");
    if (poolM) {
      const claveActiva = ui.seleccion && ui.seleccion.startsWith("miembro:") ? ui.seleccion.slice("miembro:".length) : null;
      poolM.querySelectorAll("[data-miembro]").forEach(el => {
        const activa = claveActiva && /** @type {HTMLElement} */ (el).dataset.miembro === claveActiva;
        el.classList.toggle("pieza-activa", Boolean(activa));
        el.setAttribute("aria-pressed", activa ? "true" : "false");
      });
    }
    const lienzoEl = $("lienzo-diagrama");
    if (lienzoEl) {
      lienzoEl.classList.toggle("lienzo-esperando-colocar", Boolean(ui.seleccion && ui.seleccion.startsWith("colocar:")));
    }
  }

  function inicioMoverNodo(e) {
    if (esBloqueado()) return;
    const n = /** @type {HTMLElement} */ (e.currentTarget);
    const tgt = /** @type {HTMLElement|null} */ (e.target);
    if (tgt && (tgt.closest(".nodo-quitar") || tgt.closest(".miembro-quitar"))) return;
    if (ui.seleccion && ui.seleccion.indexOf("nodo:") === 0) return;
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
      pintura.programarReposicion();
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
        pintura.reposicionarAristas();
      }
    };

    n.addEventListener("pointermove", mover);
    n.addEventListener("pointerup", soltar);
    n.addEventListener("pointercancel", soltar);
  }

  function toqueNodo(nombre) {
    const item = itemActual();
    if (!item || esBloqueado()) return;
    if (ui.seleccion && ui.seleccion.indexOf("miembro:") === 0) {
      const clave = ui.seleccion.slice("miembro:".length);
      asignarMiembroUI(clave, nombre);
      return;
    }
    if (ui.seleccion && ui.seleccion.indexOf("nodo:") === 0) {
      segundoToque(nombre);
      return;
    }
    cancelarSeleccion();
    ui.seleccion = "nodo:" + nombre;
    sincronizarObjetivos();
    setHint("«" + nombre + "» seleccionado. Toca otro nodo iluminado para conectarlo.");
  }

  function cancelarSeleccion() {
    ui.seleccion = null;
    sincronizarObjetivos();
    const tipos = $("tipos-diagrama");
    if (tipos) tipos.hidden = true;
  }

  function segundoToque(nombre) {
    const item = itemActual();
    if (!item || !ui.seleccion || ui.seleccion.indexOf("nodo:") !== 0) return;
    const primero = ui.seleccion.slice("nodo:".length);
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
      pintura.pintarNodos(item, zona());
      pintura.dibujarAristas(item);
      setHint(v.mensajeAccesible + ". Pulsa «Comprobar» cuando el diagrama esté listo.");
      enfocarNodo(de);
    }
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
        pintura.pintarNodos(item, zona());
        pintura.dibujarAristas(item);
        setHint("Relación creada" + (guarda ? " con guarda " + guarda : "") + ". Pulsa «Comprobar» cuando el diagrama esté listo.");
        enfocarNodo(de);
      });
    });

    modal.querySelector("#cancelar-guarda").addEventListener("click", cerrar);
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


  return {
    renderDiagrama,
    activarTipos,
    activarPool,
    enfocarLienzo,
    asignarMiembroUI,
    inicioDesdePool,
    itemActual,
    colocarNodoUI,
    colocarMiembro,
    quitarNodoUI,
    sincronizarObjetivos,
    inicioMoverNodo,
    toqueNodo,
    cancelarSeleccion,
    segundoToque,
    elegirTipo,
    mostrarSelectorGuarda,
    setHint,
    enfocarNodo,
    enfocarPiezaPool
  };
}
