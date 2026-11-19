// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { crearGlosarioUI } from "./glosario.js";

const glosarioDemo = {
  categorias: [
    { id: "dml", corto: "DML", nombre: "Manipulación de datos", color: "#38bdf8" },
    { id: "ddl", corto: "DDL", nombre: "Definición de esquema", color: "#34d399" }
  ],
  terminos: [
    {
      termino: "SELECT",
      categoria: "dml",
      definicion: "Consulta filas de una o más tablas.",
      ejemplo: "SELECT nombre FROM clientes;"
    },
    {
      termino: "INSERT",
      categoria: "dml",
      definicion: "Inserta nuevas filas en una tabla.",
      ejemplo: "INSERT INTO clientes VALUES (1, 'Ana');"
    },
    {
      termino: "CREATE TABLE",
      categoria: "ddl",
      definicion: "Define una tabla nueva con sus columnas y restricciones."
    }
  ],
  tips: ["Usa siempre WHERE antes de un DELETE."]
};

function montarDOM() {
  document.body.innerHTML = `
    <input id="glosario-search" type="search" />
    <div id="glosario-filtros"></div>
    <div id="glosario-letras"></div>
    <p id="glosario-count"></p>
    <div id="glosario-list" class="glosario-grid"></div>
  `;
}

beforeEach(() => {
  montarDOM();
});

describe("crearGlosarioUI", () => {
  it("renderiza todos los términos con jerarquía término -> categoría -> definición y ejemplo", () => {
    const mostrarPantalla = vi.fn();
    const ui = crearGlosarioUI({
      ctx: { materia: { id: "bd2", keywords: ["SELECT", "INSERT"] }, glosario: glosarioDemo },
      mostrarPantalla
    });

    ui.startGlosario();

    expect(mostrarPantalla).toHaveBeenCalledWith("glosario");
    const items = document.querySelectorAll("#glosario-list .glosario-item");
    expect(items).toHaveLength(3);
    expect(document.getElementById("glosario-count").textContent).toBe("3 término(s)");
    expect(items[0].querySelector(".glosario-termino").textContent).toBe("SELECT");
    expect(items[0].querySelector(".glosario-cat-badge").textContent).toBe("Manipulación de datos");
    expect(items[0].querySelector(".glosario-ejemplo-label").textContent).toBe("Ejemplo");
    // El término sin ejemplo no debe renderizar bloque de ejemplo vacío.
    expect(items[2].querySelector(".glosario-ejemplo")).toBeNull();
  });

  it("filtra por categoría y por letra inicial y permite limpiar filtros en estado vacío", () => {
    const ui = crearGlosarioUI({
      ctx: { materia: { id: "bd2" }, glosario: glosarioDemo },
      mostrarPantalla: vi.fn()
    });

    ui.startGlosario();
    ui.cambiarGlosarioCat("dml");
    expect(document.querySelectorAll("#glosario-list .glosario-item")).toHaveLength(2);

    ui.cambiarGlosarioLetra("I");
    expect(document.querySelectorAll("#glosario-list .glosario-item")).toHaveLength(1);
    expect(document.querySelector(".glosario-termino").textContent).toBe("INSERT");

    // Búsqueda sin coincidencias muestra estado vacío con botón de recuperación.
    document.getElementById("glosario-search").value = "inexistente";
    ui.renderGlosario("inexistente");
    expect(document.querySelectorAll("#glosario-list .glosario-item")).toHaveLength(0);
    expect(document.querySelector(".glosario-empty button")).not.toBeNull();

    ui.limpiarGlosarioFiltros();
    expect(document.querySelectorAll("#glosario-list .glosario-item")).toHaveLength(3);
  });
});
