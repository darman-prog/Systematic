import { test, expect } from '@playwright/test';

// Verificación temporal de "Preguntas que más te cuestan". Se borra tras el pase.
const OUT = 'C:/Users/damez/AppData/Local/Temp/opencode/capturas-peor';

test('la fila muestra el enunciado, el tema y la dificultad', async ({ page }) => {
  page.on('dialog', d => d.accept());
  // Sembrar fallos reales en el progreso de BD2 para que aparezca la sección.
  await page.addInitScript(() => {
    const prog = { "P1-001": { ok: 0, fail: 3, box: 1, last: null, lastOk: false, marked: false },
                   "P1-002": { ok: 1, fail: 2, box: 1, last: null, lastOk: false, marked: false } };
    localStorage.setItem("sys.progreso.bd2", JSON.stringify(prog));
  });
  await page.goto('/');
  await page.locator('#materias-list .materia-card').first().click();
  await expect(page.locator('#stats-panel')).toBeVisible();

  const filas = page.locator('.peor-row');
  await expect(filas.first()).toBeVisible();
  const primera = filas.first();
  // El enunciado ya no queda vacío: tiene texto largo.
  const enunciado = await primera.locator('.peor-pregunta').textContent();
  expect((enunciado || '').trim().length).toBeGreaterThan(20);
  // Meta con tema y dificultad como texto (sin fondo de resaltador).
  await expect(primera.locator('.peor-tema')).toBeVisible();
  await expect(primera.locator('.diff')).toBeVisible();
  const bgDif = await primera.locator('.diff').evaluate(el => getComputedStyle(el).backgroundColor);
  expect(bgDif).toBe('rgba(0, 0, 0, 0)');
  // Fallos con icono.
  await expect(primera.locator('.peor-fallos .icono')).toBeVisible();

  await page.screenshot({ path: OUT + '/peor-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  const overflow = await page.evaluate(() => document.scrollingElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await page.screenshot({ path: OUT + '/peor-movil.png', fullPage: true });
});
