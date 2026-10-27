// @vitest-environment jsdom
// Home/dashboard: catálogo real (4 materias + 3 lenguajes), progreso derivado de persistencia,
// búsqueda/filtros locales y cards accionables. Sin red ni localStorage.
import { describe, it, expect, vi } from "vitest";
import { crearHome } from "./home.js";

function montarDom() {
  document.body.innerHTML = `
    <section id="screen-materias" aria-labelledby="home-titulo">
      <h1 id="home-titulo">Systematic</h1>
      <p id="saludo-home"></p>
      <div class="catalogo-barra">
        <label class="sr-only" for="catalog-search">Buscar materias y lenguajes</label>
        <input id="catalog-search" type="search">
        <button type="button" id="catalog-clear" class="hidden">×</button>
        <kbd id="catalog-atajo">Ctrl K</kbd>
        <div class="catalogo-filtros">
          <button class="catalogo-tab is-active" data-filtro="todas" aria-pressed="true">Todas (<span id="filtro-todas-count">7</span>)</button>
          <button class="catalogo-tab" data-filtro="materias" aria-pressed="false">Materias (<span id="filtro-materias-count">4</span>)</button>
          <button class="catalogo-tab" data-filtro="lenguajes" aria-pressed="false">Lenguajes (<span id="filtro-lenguajes-count">3</span>)</button>
          <button class="catalogo-tab" data-filtro="en-curso" aria-pressed="false">En curso (<span id="filtro-curso-count">0</span>)</button>
        </div>
      </div>
      <section id="materias-seccion">
        <span id="materias-count">4 materias</span>
        <div id="materias-list"></div>
      </section>
      <section id="lenguajes-seccion" class="hidden">
        <span id="lenguajes-count">3 lenguajes</span>
        <div id="lenguajes-list"></div>
      </section>
      <p id="catalogo-vacio" class="hidden" role="status">Sin resultados</p>
    </section>`;
}

function montar() {
  montarDom();
  const persistencia = {
    nombre: () => "Ana",
    progreso: id => id === "bd2"
      ? { q1: { ok: 1, fail: 0 }, q2: { ok: 0, fail: 0 } }
      : {},
    historial: id => id === "bd2" ? [{ date: 1 }] : [],
    competencia: id => id === "lenguaje-ts"
      ? { e1: { aprobado: true, version: 1 } }
      : {}
  };
  const etapas = Array.from({ length: 5 }, (_, i) => ({ id: "e" + (i + 1), examen: { version: 1 } }));
  const cargarRoadmap = vi.fn(async () => ({ etapas }));
  const home = crearHome({ persistencia, cargarRoadmap });
  return { home, persistencia, cargarRoadmap };
}

const visibles = selector => [...document.querySelectorAll(selector)]
  .filter(el => !el.classList.contains("hidden"));

describe("ui/dashboard/home", () => {
  it("renderiza solo las 4 materias y 3 lenguajes reales", async () => {
    const { home } = montar();
    await home.renderMaterias();

    const materias = [...document.querySelectorAll("#materias-list .materia-card")];
    const lenguajes = [...document.querySelectorAll("#lenguajes-list .materia-card")];
    expect(materias).toHaveLength(4);
    expect(lenguajes).toHaveLength(3);
    expect(materias.map(c => c.textContent).join(" ")).toContain("Base de Datos 2");
    expect(materias.map(c => c.textContent).join(" ")).toContain("Infraestructura");
    expect(materias.map(c => c.textContent).join(" ")).not.toContain("Sistemas Distribuidos");
    expect(lenguajes.map(c => c.textContent).join(" ")).toContain("Java");
    expect(lenguajes.map(c => c.textContent).join(" ")).not.toContain("Rust");
    expect(document.getElementById("materias-count").textContent).toBe("4 materias");
    expect(document.getElementById("lenguajes-count").textContent).toBe("3 lenguajes");
    expect(document.getElementById("filtro-todas-count").textContent).toBe("7");
    expect(document.getElementById("filtro-curso-count").textContent).toBe("2");
  });

  it("deriva estado y progreso de la persistencia, sin métricas inventadas", async () => {
    const { home } = montar();
    await home.renderMaterias();

    const tarjetas = [...document.querySelectorAll(".materia-card")];
    const bd2 = tarjetas.find(c => c.dataset.materia === "bd2");
    const java = tarjetas.find(c => c.dataset.lenguaje === "lenguaje-java");
    const ts = tarjetas.find(c => c.dataset.lenguaje === "lenguaje-ts");

    // Lote 018: BD2 pasa de 90 a 120 preguntas (temas MongoDB + Neo4j).
    expect(bd2.textContent).toContain("1 de 120 respondidas");
    expect(ts.textContent).toContain("1 de 5 etapas");
    // El estado no ocupa una pill: vive en data-estado para el filtro y se comunica con la barra.
    expect(bd2.dataset.estado).toBe("en-curso");
    expect(java.dataset.estado).toBe("no-iniciado");
    expect(ts.dataset.estado).toBe("en-curso");
    expect(bd2.textContent).not.toContain("En curso");
    expect(java.textContent).not.toContain("No iniciado");
    expect(document.body.textContent).not.toContain("94%");
    expect(document.body.textContent).not.toContain("Dificultad");
  });

  it("busca por nombre o descripción, limpia y muestra el vacío", async () => {
    const { home } = montar();
    await home.renderMaterias();
    const input = document.getElementById("catalog-search");

    input.value = "python";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(visibles("#lenguajes-list .materia-card")).toHaveLength(1);
    expect(document.getElementById("materias-seccion").classList.contains("hidden")).toBe(true);
    expect(document.getElementById("catalogo-vacio").classList.contains("hidden")).toBe(true);

    input.value = "zzz";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(visibles(".materia-card")).toHaveLength(0);
    expect(document.getElementById("materias-seccion").classList.contains("hidden")).toBe(true);
    expect(document.getElementById("lenguajes-seccion").classList.contains("hidden")).toBe(true);
    expect(document.getElementById("catalogo-vacio").classList.contains("hidden")).toBe(false);

    document.getElementById("catalog-clear").click();
    expect(input.value).toBe("");
    expect(visibles(".materia-card")).toHaveLength(7);
    expect(document.getElementById("catalogo-vacio").classList.contains("hidden")).toBe(true);
    expect(document.getElementById("catalog-clear").classList.contains("hidden")).toBe(true);
  });

  it("filtra por tipo y por en curso con aria-pressed", async () => {
    const { home } = montar();
    await home.renderMaterias();
    const materias = document.querySelector('[data-filtro="materias"]');
    const curso = document.querySelector('[data-filtro="en-curso"]');

    materias.click();
    expect(materias.getAttribute("aria-pressed")).toBe("true");
    expect(document.getElementById("lenguajes-seccion").classList.contains("hidden")).toBe(true);
    const materiasVisibles = visibles("#materias-list .materia-card");
    expect(materiasVisibles).toHaveLength(4);
    expect(materiasVisibles.every(c => c.classList.contains("catalogo-entra"))).toBe(true);

    curso.click();
    expect(curso.getAttribute("aria-pressed")).toBe("true");
    const enCursoVisibles = visibles(".materia-card");
    expect(enCursoVisibles).toHaveLength(2);
    expect(enCursoVisibles.every(c => c.classList.contains("catalogo-entra"))).toBe(true);
    expect(document.getElementById("materias-seccion").classList.contains("hidden")).toBe(false);
    expect(document.getElementById("lenguajes-seccion").classList.contains("hidden")).toBe(false);
  });

  it("las cards son botones accionables con los data-* del flujo existente", async () => {
    const { home } = montar();
    await home.renderMaterias();

    const materia = document.querySelector("#materias-list .materia-card");
    const lenguaje = document.querySelector("#lenguajes-list .materia-card");
    expect(materia.tagName).toBe("BUTTON");
    expect(materia.dataset.action).toBe("seleccionarMateria");
    expect(materia.dataset.materia).toBe("bd2");
    expect(lenguaje.tagName).toBe("BUTTON");
    expect(lenguaje.dataset.action).toBe("seleccionarLenguaje");
    expect(lenguaje.dataset.lenguaje).toBe("lenguaje-ts");
  });
});
