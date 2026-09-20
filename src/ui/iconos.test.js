import { describe, it, expect } from "vitest";
import { icono, existeIcono, NOMBRES_ICONO } from "./iconos.js";
import { LOGROS } from "../core/gamificacion.js";
import { MATERIAS } from "../core/materias.js";

describe("iconos", () => {
  it("expone un set base y resuelve alias", () => {
    expect(NOMBRES_ICONO.length).toBeGreaterThan(20);
    expect(existeIcono("corazon")).toBe(true);
    expect(icono("corazon")).toBe(icono("supervivencia"));
  });

  it("devuelve SVG con la clase icono y vacío para claves desconocidas", () => {
    const svg = icono("check", "icono-sm");
    expect(svg).toContain('class="icono icono-sm"');
    expect(svg).toContain("currentColor");
    expect(icono("no-existe")).toBe("");
    expect(existeIcono("no-existe")).toBe(false);
  });

  it("cada logro y materia apunta a un icono existente", () => {
    LOGROS.forEach(l => expect(existeIcono(l.icono), "logro " + l.id).toBe(true));
    MATERIAS.forEach(m => expect(existeIcono(m.icono), "materia " + m.id).toBe(true));
  });
});
