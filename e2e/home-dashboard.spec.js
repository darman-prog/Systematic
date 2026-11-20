import { test, expect } from "@playwright/test";

// Home de materias y lenguajes: resumen del prototipo, continuidad, búsqueda y responsive.
// La persistencia se siembra antes de cargar la app para no depender de un quiz completo.

async function abrirHome(page, sembrar) {
  await page.addInitScript(datos => {
    localStorage.clear();
    localStorage.setItem("sys.onboarding.v1", "true");
    // La app guarda el nombre como JSON; un string crudo haría que leerJSON lo descarte.
    localStorage.setItem("sys.nombre", JSON.stringify("Ana"));
    if (!datos) return;
    Object.entries(datos).forEach(([clave, valor]) => {
      localStorage.setItem(clave, JSON.stringify(valor));
    });
  }, sembrar || null);
  await page.goto("/");
  await expect(page.locator("#screen-materias")).toBeVisible();
}

function fechaLocalHoy() {
  const hoy = new Date();
  return hoy.getFullYear() + "-" +
    String(hoy.getMonth() + 1).padStart(2, "0") + "-" +
    String(hoy.getDate()).padStart(2, "0");
}

function haceDias(dias) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - dias);
  return fecha.getTime();
}

test("home limpio: saludo con nombre, resumen en cero y sin CTA", async ({ page }) => {
  await abrirHome(page);

  await expect(page.locator("#saludo-home")).toContainText("Ana");
  await expect(page.locator("#home-resumen")).toBeVisible();
  await expect(page.locator("#resumen-materias")).toContainText("0");
  await expect(page.locator("#resumen-materias")).toContainText("489");
  await expect(page.locator("#resumen-precision")).toContainText("—");
  await expect(page.locator("#resumen-precision")).toContainText("Sin intentos");
  await expect(page.locator("#resumen-racha")).toContainText("0");
  await expect(page.locator("#resumen-racha")).toContainText("días");
  await expect(page.locator("#catalogo-resultado")).toHaveText("Mostrando 7 de 7");
  await expect(page.locator('.resumen-continuar [data-action="seleccionarMateria"]')).toHaveCount(0);
  await expect(page.locator('.resumen-continuar [data-action="seleccionarLenguaje"]')).toHaveCount(0);
});

test("home con progreso: continuidad, materias, precisión, racha y repaso", async ({ page }) => {
  const hoy = fechaLocalHoy();
  await abrirHome(page, {
    "sys.progreso.bd2": {
      q1: { ok: 1, fail: 0, lastOk: true },
      q2: { ok: 0, fail: 1, lastOk: false, box: 1 }
    },
    "sys.actividad.bd2": { [hoy]: 2 },
    "sys.historial.bd2": [
      { date: haceDias(1), score: 8, total: 10 },
      { date: haceDias(9), score: 6, total: 10 }
    ]
  });

  const continuar = page.locator(".resumen-continuar");
  await expect(continuar).toContainText("Continuá donde te quedaste");
  await expect(continuar).toContainText("Base de Datos 2");
  await expect(continuar).toContainText("Pregunta 3 de 120");
  await expect(continuar).toContainText("2 respondidas · 2% completado");
  await expect(continuar).toContainText("hoy");

  await expect(page.locator("#resumen-materias")).toContainText("2");
  await expect(page.locator("#resumen-materias")).toContainText("489");
  await expect(page.locator("#resumen-precision")).toContainText("50%");
  await expect(page.locator("#resumen-precision")).toContainText("2 intentos");
  await expect(page.locator("#resumen-precision")).toContainText("▲ 20% esta semana");
  await expect(page.locator("#resumen-racha")).toContainText("1");
  await expect(page.locator("#resumen-racha")).toContainText("día");
  await expect(page.locator("#resumen-racha")).toContainText("Repasar 1 pregunta");

  await continuar.locator('[data-action="seleccionarMateria"]').click();
  await expect(page.locator("#screen-start")).toBeVisible();
  await expect(page.locator("#materia-nombre")).toHaveText("Base de Datos 2");
});

test("home con actividad de lenguaje: continuidad y racha incluyen el lenguaje", async ({ page }) => {
  const hoy = fechaLocalHoy();
  await abrirHome(page, {
    "sys.actividad.lenguaje-ts": { [hoy]: 1 }
  });

  const continuar = page.locator(".resumen-continuar");
  await expect(continuar).toContainText("TypeScript");
  await expect(continuar).toContainText("Pregunta 1 de 100");
  await expect(continuar).toContainText("hoy");
  await expect(page.locator("#resumen-materias")).toContainText("0");
  await expect(page.locator("#resumen-racha")).toContainText("1");

  const cta = continuar.locator('[data-action="seleccionarLenguaje"]');
  await expect(cta).toHaveCount(1);
  await cta.click();
  await expect(page.locator("#screen-lenguaje")).toBeVisible();
  await expect(page.locator("#lenguaje-nombre")).toHaveText("TypeScript");
});

test("búsqueda sin resultados: limpia o vuelve a todas", async ({ page }) => {
  await abrirHome(page);

  await page.locator("#catalog-search").fill("zzz");
  await expect(page.locator("#catalogo-vacio")).toBeVisible();
  await expect(page.locator("#catalogo-vacio")).toContainText("No encontramos resultados");
  await expect(page.locator('#catalogo-vacio [data-vacio="busqueda"]')).toBeVisible();

  await page.locator('#catalogo-vacio [data-vacio="busqueda"]').click();
  await expect(page.locator("#catalog-search")).toHaveValue("");
  await expect(page.locator("#catalogo-vacio")).toBeHidden();
  await expect(page.locator("#materias-list .materia-card")).toHaveCount(4);
  await expect(page.locator("#catalogo-resultado")).toHaveText("Mostrando 7 de 7");

  // Sin actividad, "En curso" no tiene resultados y ofrece volver a todas.
  await page.getByRole("button", { name: /En curso \(0\)/ }).click();
  await expect(page.locator("#catalogo-vacio")).toBeVisible();
  await expect(page.locator('#catalogo-vacio [data-vacio="filtro"]')).toBeVisible();
  await page.locator('#catalogo-vacio [data-vacio="filtro"]').click();
  await expect(page.getByRole("button", { name: /Todas \(7\)/ })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#catalogo-vacio")).toBeHidden();
});

test("home sin overflow horizontal en 360, 390, 768, 1280 y 1440", async ({ page }) => {
  await abrirHome(page);
  for (const viewport of [
    { width: 360, height: 740 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1280, height: 800 },
    { width: 1440, height: 900 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.locator("#screen-materias")).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, `overflow en ${viewport.width}x${viewport.height}`).toBeLessThanOrEqual(0);
  }
});
