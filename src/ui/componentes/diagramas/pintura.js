// Pintura del lienzo de diagramas: nodos, aristas SVG, contadores y reposicionamiento.
// Recibe las dependencias de interacción por parámetro para que el marcado y el estado
// no vivan en el mismo módulo que los eventos de puntero.
import { escapar } from "../../helpers.js";
import { icono } from "../../iconos.js";
import {
  esDirigidoTipo,
  asignarMiembro,
  quitarConexion,
  actualizarPosicion,
  claveMiembro,
  normalizarClave
} from "../../../core/index.js";
import { puntoBordeNodo } from "./geometria.js";
import { renderPoolNodosHtml } from "./plantillas.js";

/**
 * @param {{
 *   $: (id: string) => any,
 *   $area: () => HTMLElement|null,
 *   zona: () => HTMLElement|null,
 *   estado: () => any,
 *   guardar: (nuevo: any) => any,
 *   esBloqueado: () => boolean,
 *   ui: { aristasDom: any[], raf: number },
 *   interaccion: any
 * }} deps
 */
export function crearPintura({ $, $area, zona, estado, guardar, esBloqueado, ui, interaccion }) {
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
          interaccion.renderDiagrama(item, zona());
          interaccion.setHint("Miembro «" + clave + "» desasignado.");
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
          interaccion.quitarNodoUI(nombre);
        });
        n.appendChild(quitar);
      }

      if (!bloqueado) {
        n.addEventListener("pointerdown", e => {
          const tgt = /** @type {HTMLElement|null} */ (e.target);
          if (tgt && (tgt.closest(".nodo-quitar") || tgt.closest(".miembro-quitar"))) return;
          if (interaccion.seleccionActual() && interaccion.seleccionActual().indexOf("nodo:") === 0) {
            e.preventDefault();
            e.stopPropagation();
            interaccion.segundoToque(nombre);
            return;
          }
          if (interaccion.seleccionActual() && interaccion.seleccionActual().indexOf("miembro:") === 0) {
            e.preventDefault();
            e.stopPropagation();
            const clave = interaccion.seleccionActual().slice("miembro:".length);
            interaccion.asignarMiembroUI(clave, nombre);
            return;
          }
          interaccion.inicioMoverNodo(e);
        });

        n.addEventListener("keydown", e => {
          if (e.target !== n) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            interaccion.toqueNodo(nombre);
            return;
          }
          if (e.key === "Escape") {
            e.preventDefault();
            interaccion.cancelarSeleccion();
            interaccion.setHint("Selección cancelada.");
            return;
          }
          if (!fijo && (e.key === "Delete" || e.key === "Backspace")) {
            e.preventDefault();
            interaccion.quitarNodoUI(nombre);
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
    interaccion.sincronizarObjetivos();
  }

  function actualizarPool(item, area) {
    const est = estado();
    if (!est) return;
    const pool = $("pool-diagrama");
    if (pool) {
      pool.innerHTML = renderPoolNodosHtml(est, interaccion.seleccionActual());
    }
    interaccion.activarPool(area);
  }

  function reposicionarAristas() {
    ui.aristasDom.forEach(({ linea, etiqueta, nDe, nA, offset }) => {
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
    cancelAnimationFrame(ui.raf);
    ui.raf = requestAnimationFrame(reposicionarAristas);
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
    ui.aristasDom = [];

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
          interaccion.setHint("Relación eliminada.");
          interaccion.enfocarNodo(c.de);
        });
      }
      papel.appendChild(etiqueta);
      ui.aristasDom.push({ linea, etiqueta, nDe, nA, offset });
    });

    reposicionarAristas();
    actualizarContadores(item, est);
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
    pintarNodos,
    dibujarAristas,
    actualizarContadores,
    actualizarPool,
    reposicionarAristas,
    programarReposicion
  };
}
