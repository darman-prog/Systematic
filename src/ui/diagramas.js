// Lienzo reutilizable del constructor de diagramas (spec 003, H6a ER + H6b subtipos).
// Recibe la pregunta `tipo: "diagrama"`, el estado serializable de core/diagramas.js y
// callbacks ({ guardarEstado, alComprobar }). Funciona con mouse y toque (Pointer Events +
// tap-tap); no lee localStorage ni importa datos de materias.
import { escapar, bloqueCaso } from "./helpers.js";
import {
  CONFIG_SUBTIPO, esDirigido, crearTablero, colocarNodo, quitarNodo,
  asignarMiembro, conectar, quitarConexion
} from "../core/diagramas.js";

const $ = id => document.getElementById(id);

// Opciones:
//   ctx              — sesión del quiz (modo práctica); si no se pasa, usa los getters.
//   obtenerItem      — () => ítem/pregunta actual (por defecto ctx.session.items[idx]).
//   obtenerEstado    — () => estado del tablero (por defecto ctx.session.diagrama).
//   guardarEstado    — callback al mutar el estado (modo casos, sin sesión).
//   areaId           — id del contenedor donde re-renderizar (por defecto "question-area").
//   accionComprobar  — data-action del botón comprobar.
//   accionCancelarTipo — data-action del botón cancelar tipo de relación.
//   mostrarPregunta  — si false, no pinta bloqueCaso ni el enunciado (modo casos).
export function crearDiagramasUI({
  ctx,
  guardarEstado,
  alComprobar,
  obtenerItem,
  obtenerEstado,
  areaId = "question-area",
  accionComprobar = "comprobarDiagrama",
  accionCancelarTipo = "cancelarDiagramaTipo",
  mostrarPregunta = true
} = {}) {
  let dragPid = null;
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

  function centro(el) {
    return { x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2 };
  }

  function guardar(nuevo) {
    if (ctx && ctx.session) ctx.session.diagrama = nuevo;
    if (guardarEstado) guardarEstado(nuevo);
    return nuevo;
  }

  function renderDiagrama(item, area, resultado) {
    const dirigido = esDirigido(item.subtipo);
    let estadoActual = estado();
    if (!estadoActual || estadoActual.preguntaId !== item.id) {
      estadoActual = guardar(crearTablero(item));
    }
    const pool = estadoActual.nodosDisponibles
      .map(n =>
        '<div class="pieza" draggable="true" data-nodo="' + escapar(n) + '" data-origen="pool-diagrama">' +
          escapar(n) +
        "</div>"
      )
      .join("");
    const miembros = Array.isArray(item.miembrosPool) && item.miembrosPool.length
      ? '<p class="text-xs text-slate-400 mb-2">Asigna cada miembro a su clase: toca un miembro y luego la clase.</p>' +
        '<div id="pool-miembros" class="flex flex-wrap gap-2.5 mb-3">' +
        item.miembrosPool.map(m =>
          '<div class="pieza' + (estadoActual.miembros[m.texto] ? " pieza-sel" : "") + '" draggable="true" data-miembro="' + escapar(m.texto) + '" title="' +
            (estadoActual.miembros[m.texto] ? "Asignado a " + escapar(estadoActual.miembros[m.texto]) : "Sin asignar") + '">' +
            escapar(m.texto) +
          "</div>"
        ).join("") +
        "</div>"
      : "";
    const bloqueado = !!(ctx && ctx.session && ctx.session.answers[ctx.session.idx]);
    area.innerHTML =
      (mostrarPregunta
        ? bloqueCaso(item) +
          '<div class="text-base sm:text-lg font-semibold leading-relaxed mb-3">' + escapar(item.q) + "</div>" +
          (item.subtipo === "uml-clases" && !item.diagrama
            ? '<p class="text-xs text-slate-400 mb-3">Lee cada clase y coloca sus atributos y métodos en la clase correcta.</p>'
            : "") +
          (item.subtipo === "actividades"
            ? '<p class="text-xs text-slate-400 mb-3">Los nodos de inicio/fin ya están colocados. Completa acciones y decisiones.</p>'
            : "")
        : "") +
      '<p class="text-xs text-slate-400 mb-2">Arrastra una entidad al lienzo (o tócala para colocarla). Para conectar: toca un nodo y luego el otro.</p>' +
      '<div id="pool-diagrama" class="flex flex-wrap gap-2.5 mt-1 min-h-[44px]">' +
        pool +
      "</div>" +
      miembros +
      '<div id="lienzo-diagrama" class="my-3" tabindex="0" role="group" aria-label="Lienzo del diagrama"><svg id="edges-diagrama"></svg></div>' +
      '<div id="tipos-diagrama" class="flex flex-wrap gap-2.5 mt-2 items-center" hidden>' +
        "<span>Tipo:</span>" +
        tiposDe(item).map(t => '<button class="pieza" data-arista="' + escapar(t) + '">' + escapar(t) + "</button>").join("") +
        '<button class="btn-mini" data-action="' + accionCancelarTipo + '">✕</button>' +
      "</div>" +
      '<p id="hint-diagrama" class="text-xs text-slate-400 mt-2" role="status"></p>' +
      (resultado
        ? '<div class="mt-4"><div class="font-bold mb-2 ' + (resultado.ok ? "text-emerald-300" : "text-rose-300") + '">' +
          (resultado.ok ? "✅ ¡Diagrama correcto!" : "❌ Aún no: revisa el detalle") + "</div>" +
          (resultado.detalle ? '<div class="text-sm text-slate-300">' + escapar(resultado.detalle) + "</div>" : "") + "</div>"
        : "") +
      '<div class="mt-4"><button class="btn btn-primary" id="btn-comprobar-diagrama" data-action="' + accionComprobar + '" ' +
        (bloqueado ? "disabled" : "") + ">Comprobar</button></div>";
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

  function inicioDesdePool(e) {
    const origen = e.currentTarget;
    const etiqueta = origen.dataset.nodo || origen.dataset.miembro;
    const esMiembro = !!origen.dataset.miembro;
    const x0 = e.clientX, y0 = e.clientY;
    let movido = false;
    const ghost = origen.cloneNode(true);
    ghost.id = "ghost-diagrama";
    ghost.style.display = "none";
    document.body.appendChild(ghost);
    const mover = ev => {
      if (Math.hypot(ev.clientX - x0, ev.clientY - y0) > 6) movido = true;
      if (!movido) return;
      ghost.style.display = "block";
      ghost.style.left = ev.clientX - 40 + "px";
      ghost.style.top = ev.clientY - 14 + "px";
    };
    const soltar = ev => {
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerup", soltar);
      ghost.remove();
      if (!movido) {
        if (esMiembro) colocarMiembro(etiqueta);
        else colocarNodoUI(etiqueta);
        return;
      }
      const lienzo = $("lienzo-diagrama");
      if (!lienzo) return;
      const r = lienzo.getBoundingClientRect();
      if (ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom) {
        if (esMiembro) {
          const bajo = document.elementFromPoint(ev.clientX, ev.clientY);
          const nodo = bajo && bajo.closest(".nodo-puesto");
          if (nodo) {
            guardar(asignarMiembro(estado(), etiqueta, nodo.dataset.label));
            renderDiagrama(itemActual(), zona());
            setHint("«" + etiqueta + "» asignado a «" + nodo.dataset.label + "».");
          } else {
            setHint("Suelta el miembro sobre una clase para asignarlo (o tócalo y luego toca la clase).");
          }
        } else {
          colocarNodoUI(etiqueta, ev.clientX - r.left - 52, ev.clientY - r.top - 18);
        }
      }
    };
    window.addEventListener("pointermove", mover);
    window.addEventListener("pointerup", soltar);
  }

  function itemActual() {
    if (obtenerItem) return obtenerItem();
    const session = ctx && ctx.session;
    return session && session.items[session.idx];
  }

  function colocarNodoUI(nombre, x, y) {
    const item = itemActual();
    if (!item) return;
    guardar(colocarNodo(estado(), nombre));
    pintarNodos(item, zona());
    posicionarUltimo(x, y);
    dibujarAristas(item);
    setHint("«" + nombre + "» en el lienzo. Toca un nodo y luego otro para conectarlos.");
  }

  function posicionarUltimo(x, y) {
    if (x === undefined || y === undefined) return;
    const lienzo = $("lienzo-diagrama");
    const nodos = lienzo ? lienzo.querySelectorAll(".nodo-puesto") : [];
    const ultimo = nodos[nodos.length - 1];
    if (!ultimo) return;
    ultimo.style.left = Math.max(4, Math.min(x, lienzo.clientWidth - 110)) + "px";
    ultimo.style.top = Math.max(4, Math.min(y, lienzo.clientHeight - 60)) + "px";
  }

  function colocarMiembro(texto) {
    const item = itemActual();
    if (!item) return;
    const est = estado();
    if (est.miembros[texto]) {
      guardar(asignarMiembro(est, texto, null));
      renderDiagrama(item, zona());
      setHint("«" + texto + "» devuelto al pool. Toca un miembro y luego la clase destino.");
      return;
    }
    dragPid = "miembro:" + texto;
    setHint("«" + texto + "» seleccionado. Toca la clase destino.");
  }

  function quitarNodoUI(nombre) {
    const item = itemActual();
    if (!item) return;
    guardar(quitarNodo(estado(), Array.isArray(item.nodosFijos) ? item.nodosFijos : [], nombre));
    renderDiagrama(item, zona());
    setHint("Nodo retirado.");
  }

  function inicioMoverNodo(e) {
    const n = e.currentTarget;
    if (e.target.closest(".nodo-quitar")) return;
    if (dragPid && dragPid.indexOf("nodo:") === 0) return;
    e.preventDefault();
    e.stopPropagation();
    const lienzo = $("lienzo-diagrama");
    const x0 = e.clientX, y0 = e.clientY;
    const l0 = n.offsetLeft, t0 = n.offsetTop;
    let movido = false;
    try { n.setPointerCapture(e.pointerId); } catch (_) { /* pointer no capturable */ }
    const mover = ev => {
      if (Math.hypot(ev.clientX - x0, ev.clientY - y0) > 6) movido = true;
      if (!movido) return;
      n.style.left = Math.max(0, Math.min(l0 + ev.clientX - x0, lienzo.clientWidth - n.offsetWidth)) + "px";
      n.style.top = Math.max(0, Math.min(t0 + ev.clientY - y0, lienzo.clientHeight - n.offsetHeight)) + "px";
      dibujarAristas(itemActual());
    };
    const soltar = () => {
      n.removeEventListener("pointermove", mover);
      n.removeEventListener("pointerup", soltar);
      n.removeEventListener("pointercancel", soltar);
      if (!movido) toqueNodo(n.dataset.label);
    };
    n.addEventListener("pointermove", mover);
    n.addEventListener("pointerup", soltar);
    n.addEventListener("pointercancel", soltar);
  }

  function toqueNodo(nombre) {
    const item = itemActual();
    if (!item) return;
    if (dragPid && dragPid.indexOf("miembro:") === 0) {
      const texto = dragPid.slice("miembro:".length);
      dragPid = null;
      guardar(asignarMiembro(estado(), texto, nombre));
      renderDiagrama(item, zona());
      setHint("«" + texto + "» asignado a «" + nombre + "».");
      return;
    }
    if (dragPid && dragPid.indexOf("nodo:") === 0) {
      segundoToque(nombre);
      return;
    }
    cancelarSeleccion();
    dragPid = "nodo:" + nombre;
    const el = $("lienzo-diagrama").querySelector('.nodo-puesto[data-label="' + nombre + '"]');
    if (el) {
      el.classList.add("seleccionado");
      el.setAttribute("aria-pressed", "true");
    }
    setHint("«" + nombre + "» seleccionado. Toca otro nodo para conectarlo.");
  }

  function cancelarSeleccion() {
    dragPid = null;
    const prev = document.querySelector("#lienzo-diagrama .seleccionado");
    if (prev) {
      prev.classList.remove("seleccionado");
      prev.setAttribute("aria-pressed", "false");
    }
    const tipos = $("tipos-diagrama");
    if (tipos) tipos.hidden = true;
  }

  function segundoToque(nombre) {
    const item = itemActual();
    if (!item || !dragPid || dragPid.indexOf("nodo:") !== 0) return;
    const primero = dragPid.slice("nodo:".length);
    cancelarSeleccion();
    if (primero === nombre) {
      setHint("Selección cancelada.");
      return;
    }
    const tipos = $("tipos-diagrama");
    if (!tipos) return;
    tipos.dataset.de = primero;
    tipos.dataset.a = nombre;
    tipos.hidden = false;
    setHint("Elige el tipo de relación entre «" + primero + "» y «" + nombre + "».");
  }

  function elegirTipo(tipo) {
    const item = itemActual();
    const tipos = $("tipos-diagrama");
    if (!item || !tipos || tipos.hidden) return;
    const est = estado();
    const dirigido = esDirigido(item.subtipo);
    
    // Para actividades, permitir seleccionar una guarda
    if (item.subtipo === "actividades") {
      mostrarSelectorGuarda(tipos.dataset.de, tipos.dataset.a, tipo, dirigido, item);
    } else {
      guardar(conectar(est, tipos.dataset.de, tipos.dataset.a, tipo, dirigido));
      tipos.hidden = true;
      pintarNodos(item, zona());
      dibujarAristas(item);
      setHint("Relación creada. Pulsa «Comprobar» cuando el diagrama esté listo.");
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
    const modal = document.createElement("div");
    modal.className = "modal-guarda";
    modal.innerHTML =
      '<div class="modal-guarda-contenido">' +
        "<h3>Seleccionar guarda</h3>" +
        "<p>Elige la condición para esta transición:</p>" +
        '<div class="guardas-opciones">' +
          '<button class="btn-guarda" data-guarda="">Sin guarda</button>' +
          guardasDe(item).map(g => '<button class="btn-guarda" data-guarda="' + escapar(g) + '">' + escapar(g) + "</button>").join("") +
        "</div>" +
        '<button class="btn-cancelar" id="cancelar-guarda">Cancelar</button>' +
      "</div>";
    document.body.appendChild(modal);
    
    modal.querySelectorAll(".btn-guarda").forEach(btn => {
      btn.addEventListener("click", () => {
        const guarda = btn.dataset.guarda || undefined;
        const est = estado();
        guardar(conectar(est, de, a, tipo, dirigido, guarda));
        modal.remove();
        const tipos = $("tipos-diagrama");
        if (tipos) tipos.hidden = true;
        pintarNodos(item, zona());
        dibujarAristas(item);
        setHint("Relación creada" + (guarda ? " con guarda " + guarda : "") + ". Pulsa «Comprobar» cuando el diagrama esté listo.");
      });
    });
    
    modal.querySelector("#cancelar-guarda").addEventListener("click", () => {
      modal.remove();
    });
  }

  function pintarNodos(item, area) {
    const est = estado();
    if (!est) return;
    const lienzo = $("lienzo-diagrama");
    const svg = $("edges-diagrama");
    if (!lienzo || !svg) return;
    lienzo.querySelectorAll(".nodo-puesto,.etiqueta-arista").forEach(el => el.remove());
    est.nodosColocados.forEach((nombre, i) => {
      const fijo = Array.isArray(item.nodosFijos) && item.nodosFijos.indexOf(nombre) !== -1;
      const n = document.createElement("div");
      n.className = "nodo-puesto" + (fijo ? " nodo-fijo" : "");
      n.dataset.label = nombre;
      n.style.left = 12 + (i % 3) * 96 + "px";
      n.style.top = 14 + Math.floor(i / 3) * 62 + "px";
      
      // Contenido del nodo
      let contenido = '<span class="nodo-nombre">' + escapar(nombre) + '</span>';
      
      // Mostrar miembros asignados (para UML clases)
      if (Array.isArray(item.miembrosPool) && item.miembrosPool.length > 0) {
        const miembrosNodo = item.miembrosPool
          .filter(m => est.miembros[m.texto] === nombre)
          .map(m => m.texto);
        if (miembrosNodo.length > 0) {
          contenido += '<div class="nodo-miembros">' + 
            miembrosNodo.map(m => '<div class="miembro-item">' + escapar(m) + '</div>').join('') +
            '</div>';
        }
      }
      
      n.innerHTML = contenido;
      n.tabIndex = 0;
      n.setAttribute("role", "button");
      n.setAttribute("aria-pressed", "false");
      n.setAttribute("aria-label", "Nodo " + nombre + ". Enter para seleccionar o conectar, flechas para mover" + (fijo ? "" : ", Supr para quitar") + ".");
      
      if (!fijo) {
        const quitar = document.createElement("button");
        quitar.className = "nodo-quitar";
        quitar.textContent = "✕";
        quitar.setAttribute("aria-label", "Quitar " + nombre);
        quitar.addEventListener("click", ev => {
          ev.stopPropagation();
          quitarNodoUI(nombre);
        });
        n.appendChild(quitar);
      }
      n.addEventListener("pointerdown", e => {
        if (dragPid && dragPid.indexOf("nodo:") === 0) {
          e.preventDefault();
          e.stopPropagation();
          segundoToque(nombre);
          return;
        }
        if (dragPid && dragPid.indexOf("miembro:") === 0) {
          e.preventDefault();
          e.stopPropagation();
          const texto = dragPid.slice("miembro:".length);
          dragPid = null;
          guardar(asignarMiembro(est, texto, nombre));
          pintarNodos(item, area);
          setHint("Miembro asignado a «" + nombre + "».");
          return;
        }
        inicioMoverNodo(e);
      });
      n.addEventListener("keydown", e => {
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
          n.style.left = Math.max(0, n.offsetLeft + dx) + "px";
          n.style.top = Math.max(0, n.offsetTop + dy) + "px";
          dibujarAristas(item);
        }
      });
      lienzo.appendChild(n);
    });
    actualizarPool(item, area);
  }

  function actualizarPool(item, area) {
    const est = estado();
    if (!est) return;
    const pool = $("pool-diagrama");
    if (!pool) return;
    pool.innerHTML = est.nodosDisponibles
      .map(n =>
        '<div class="pieza" draggable="true" data-nodo="' + escapar(n) + '" data-origen="pool-diagrama">' +
          escapar(n) +
        "</div>"
      )
      .join("");
    activarPool(area);
  }

  function dibujarAristas(item) {
    const est = estado();
    const svg = $("edges-diagrama");
    const lienzo = $("lienzo-diagrama");
    if (!svg || !lienzo || !est) return;
    svg.innerHTML = "";
    lienzo.querySelectorAll(".etiqueta-arista").forEach(el => el.remove());
    const dirigido = esDirigido((item || {}).subtipo);
    const mapa = {};
    lienzo.querySelectorAll(".nodo-puesto").forEach(n => { mapa[n.dataset.label] = n; });
    const r = lienzo.getBoundingClientRect();
    svg.setAttribute("width", Math.max(lienzo.clientWidth, 1));
    svg.setAttribute("height", Math.max(lienzo.clientHeight, r.height || 320));
    est.conexiones.forEach(c => {
      const nDe = mapa[c.de];
      const nA = mapa[c.a];
      if (!nDe || !nA) return;
      const c1 = centro(nDe);
      const c2 = centro(nA);
      const linea = document.createElementNS("http://www.w3.org/2000/svg", "line");
      linea.setAttribute("x1", c1.x);
      linea.setAttribute("y1", c1.y);
      linea.setAttribute("x2", c2.x);
      linea.setAttribute("y2", c2.y);
      if (dirigido) linea.setAttribute("marker-end", "url(#flecha-diagrama)");
      svg.appendChild(linea);
      const etiqueta = document.createElement("span");
      etiqueta.className = "etiqueta-arista";
      let textoEtiqueta = c.tipo;
      if (c.guarda) textoEtiqueta += " " + c.guarda;
      etiqueta.textContent = textoEtiqueta + " ✕";
      etiqueta.title = "Quitar relación";
      etiqueta.style.left = (c1.x + c2.x) / 2 + "px";
      etiqueta.style.top = (c1.y + c2.y) / 2 + "px";
      etiqueta.addEventListener("click", () => {
        guardar(quitarConexion(estado(), c.de, c.a, c.tipo, dirigido));
        pintarNodos(item, zona());
        dibujarAristas(item);
        setHint("Relación eliminada.");
      });
      lienzo.appendChild(etiqueta);
    });
  }

  function setHint(texto) {
    const h = $("hint-diagrama");
    if (h) h.textContent = texto;
  }

  function inyectarMarcador() {
    const svg = $("edges-diagrama");
    if (!svg || svg.querySelector("#flecha-diagrama")) return;
    svg.innerHTML =
      '<defs><marker id="flecha-diagrama" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">' +
      '<path d="M0,0 L8,4 L0,8 z" fill="#9BB8C9"></path></marker></defs>';
  }

  function exponerAPI() {
    inyectarMarcador();
  }
  exponerAPI();

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
