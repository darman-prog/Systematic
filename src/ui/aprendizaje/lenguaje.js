// Pantalla del track de lenguaje (spec 011): barra de competencia y mapa de etapas.
import { escapar } from "../helpers.js";
import { icono } from "../iconos.js";
import { estadoVacio } from "../componentes/estados.js";
import { etapaDesbloqueada, aprobadoVigente, umbralDeExamen } from "../../core/index.js";
import { barraCompetencia } from "../componentes/competencia.js";

const $ = id => document.getElementById(id);

export function estadoEtapas(roadmap, competencia) {
  const etapas = roadmap?.etapas || [];
  return etapas.map((etapa, i) => {
    const registro = competencia?.[etapa.id] || null;
    return {
      etapa,
      desbloqueada: etapaDesbloqueada(etapas, i, competencia),
      aprobada: aprobadoVigente(etapa, competencia),
      intentos: registro?.intentos || 0,
      ultimoPct: registro?.ultimoPct ?? null,
    };
  });
}

export function pintarCompetencia(barra, color) {
  const cont = $("lenguaje-competencia");
  if (!cont) return;
  cont.innerHTML = barraCompetencia({ ...barra, color });
}

function obtenerEstadoEtapa(nodo) {
  if (nodo.aprobada) return { texto: "Aprobada", clase: "badge-aprobada" };
  if (!nodo.desbloqueada) return { texto: "Bloqueada", clase: "badge-bloqueada" };
  if (nodo.intentos) return { texto: `Último: ${Math.round((nodo.ultimoPct || 0) * 100)}%`, clase: "badge-intento" };
  return { texto: "Disponible", clase: "badge-disponible" };
}

export function pintarEtapas(nodos, lenguaje) {
  const cont = $("lenguaje-etapas");
  if (!cont) return;

  if (!nodos || !nodos.length) {
    cont.innerHTML = estadoVacio("Este lenguaje todavía no tiene etapas.");
    return;
  }

  const color = lenguaje?.color || "var(--study-accent-strong)";

  const html = nodos.map((nodo, i) => {
    const etapa = nodo.etapa;
    const necesita = umbralDeExamen(etapa.examen.preguntas.length, etapa.examen.umbral);
    const total = etapa.examen.preguntas.length;
    const estado = obtenerEstadoEtapa(nodo);

    // El nodo del camino muestra check si se aprobó, candado si sigue bloqueada y el número
    // en los demás casos.
    const nodoContenido = nodo.aprobada ? icono("check", "icono-sm")
      : !nodo.desbloqueada ? icono("bloqueada", "icono-sm")
      : String(i + 1);
    const actual = nodo.desbloqueada && !nodo.aprobada;
    // El medidor necesita el umbral en porcentaje para marcar dónde se aprueba.
    const umbralPct = total ? Math.round((necesita / total) * 100) : 0;
    const pct = nodo.ultimoPct !== null ? Math.round(nodo.ultimoPct * 100) : null;
    const disabledAttr = nodo.desbloqueada ? "" : "disabled aria-disabled=\"true\" tabindex=\"-1\"";

    // Generar botones de lecciones
    const leccionesHtml = etapa.lecciones.map(lec => `
      <button class="btn-leccion" data-action="practicarLeccion" data-etapa="${etapa.id}" data-leccion="${lec.id}" ${disabledAttr} aria-label="Practicar ${escapar(lec.nombre)}">
        <span class="btn-icono">${icono("practica", "icono-sm")}</span>
        <span class="btn-texto">
          <span class="btn-titulo">${escapar(lec.nombre)}</span>
          <span class="btn-meta">${lec.preguntas.length} preguntas</span>
        </span>
      </button>
    `).join("");

    // Generar botón de examen
    const examenHtml = `
      <button class="btn-examen" data-action="rendirExamen" data-etapa="${etapa.id}" ${disabledAttr} aria-label="Rendir examen de ${escapar(etapa.nombre)}">
        <span class="btn-icono">${icono("medalla", "icono-sm")}</span>
        <span class="btn-texto">
          <span class="btn-titulo">Rendir Examen</span>
          <span class="btn-meta">${total} preguntas · aprueba con ${necesita}</span>
        </span>
      </button>
    `;

    return `
      <li class="etapa-item">
        <span class="etapa-nodo" aria-hidden="true">${nodoContenido}</span>
        <article class="etapa-card ${nodo.aprobada ? "is-aprobada" : ""} ${!nodo.desbloqueada ? "is-bloqueada" : ""} ${actual ? "is-actual" : ""}" ${actual ? 'aria-current="step"' : ""}>
          <header class="etapa-header">
            <div class="etapa-titulos">
              <h3 class="etapa-nombre">${escapar(etapa.nombre)}</h3>
              <span class="etapa-badge ${estado.clase}">${estado.texto}</span>
            </div>
          </header>

          <div class="etapa-body">
            ${pct !== null && !nodo.aprobada ? `
              <div class="etapa-progreso" role="img" aria-label="Último intento ${pct}%, se aprueba con ${umbralPct}%" style="--pct:${pct}%; --umbral:${umbralPct}%">
                <div class="etapa-meter"></div>
                <p class="etapa-progreso-texto">Último intento <strong>${pct}%</strong> · se aprueba con ${umbralPct}%</p>
              </div>` : ""}
            <div class="etapa-lecciones-lista">${leccionesHtml}</div>
          </div>

          <footer class="etapa-footer">${examenHtml}</footer>
        </article>
      </li>
    `;
  }).join("");

  cont.innerHTML = `<ol class="etapas-camino" style="--color-tema: ${color}" role="list" aria-label="Mapa de etapas del lenguaje">${html}</ol>`;
}