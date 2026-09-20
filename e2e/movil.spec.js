import { test, expect } from '@playwright/test';

// Suite móvil: corre en el proyecto "movil" (Pixel 7: 412x915, hasTouch).
// Valida el lienzo de diagramas y las pantallas clave con viewport de teléfono.

async function practicaSoloDiagramas(page, indiceMateria) {
  await page.goto('/');
  await page.locator('#materias-list .materia-card').nth(indiceMateria).click();
  await page.getByRole('button', { name: /Configurar práctica/ }).click();
  await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').click();
  await page.locator('#screen-config [data-clave="tipos"][data-valor="diagrama"]').click();
  // "Ninguno" deja cfg-cantidad en 1; pide explícitamente todas las coincidentes.
  await page.getByRole('button', { name: /Usar todas/ }).click();
  await page.getByRole('button', { name: /Comenzar práctica/ }).click();
  await expect(page.locator('#screen-quiz')).toBeVisible();
}

test('colocar y conectar por toques en el lienzo', async ({ page }) => {
  await practicaSoloDiagramas(page, 0); // BD2 (ER)

  await page.locator('#pool-diagrama .pieza').first().tap();
  await expect(page.locator('#lienzo-diagrama .nodo-puesto')).toHaveCount(1);
  await page.locator('#pool-diagrama .pieza').first().tap();
  await expect(page.locator('#lienzo-diagrama .nodo-puesto')).toHaveCount(2);

  // Tap-tap para conectar.
  await page.locator('#lienzo-diagrama .nodo-puesto').first().tap();
  await page.locator('#lienzo-diagrama .nodo-puesto').nth(1).tap();
  await expect(page.locator('#tipos-diagrama')).toBeVisible();
  await page.locator('#tipos-diagrama [data-arista="1:N"]').tap();
  await expect(page.locator('#lienzo-diagrama .etiqueta-arista')).toHaveCount(1);

  await page.getByRole('button', { name: 'Comprobar', exact: true }).tap();
  await expect(page.locator('#feedback-box')).toBeVisible();
});

test('el papel del lienzo se desplaza con scroll en móvil', async ({ page }) => {
  await practicaSoloDiagramas(page, 0);

  // Coloca todas las entidades del pool (la pregunta barajada puede traer 2 o 3).
  while (await page.locator('#pool-diagrama .pieza').count()) {
    await page.locator('#pool-diagrama .pieza').first().tap();
  }
  const colocados = await page.locator('#lienzo-diagrama .nodo-puesto').count();
  expect(colocados).toBeGreaterThanOrEqual(2);

  // El papel (640px) excede el marco (~380px en teléfono): hay scroll horizontal.
  const lienzo = page.locator('#lienzo-diagrama');
  const info = await lienzo.evaluate(el => ({ sw: el.scrollWidth, cw: el.clientWidth }));
  expect(info.sw).toBeGreaterThan(info.cw);
  const primero = page.locator('#lienzo-diagrama .nodo-puesto').first();
  const xAntes = (await primero.boundingBox()).x;
  await lienzo.evaluate(el => { el.scrollLeft = 200; });
  const xDespues = (await primero.boundingBox()).x;
  expect(xDespues).toBeLessThan(xAntes);
});

test('modal de guardas cabe en el viewport de teléfono', async ({ page }) => {
  await practicaSoloDiagramas(page, 1); // ISW (casos-uso + actividades, barajado)

  const fijos = await page.locator('#lienzo-diagrama .nodo-fijo').count();
  if (fijos === 0) {
    await page.getByRole('button', { name: 'Comprobar', exact: true }).tap();
    await page.locator('#next-btn').tap();
  }
  await expect(page.locator('#lienzo-diagrama .nodo-fijo').first()).toBeVisible();

  await page.locator('#pool-diagrama .pieza').first().tap();
  await page.locator('#lienzo-diagrama .nodo-fijo').first().tap();
  await page.locator('#lienzo-diagrama .nodo-puesto').nth(3).tap();
  await expect(page.locator('#tipos-diagrama')).toBeVisible();
  await page.locator('#tipos-diagrama [data-arista="transición"]').tap();

  const modal = page.locator('.modal-guarda');
  await expect(modal).toBeVisible();
  const caja = await modal.locator('.modal-guarda-contenido').boundingBox();
  const viewport = page.viewportSize();
  expect(caja.x).toBeGreaterThanOrEqual(0);
  expect(caja.y).toBeGreaterThanOrEqual(0);
  expect(caja.x + caja.width).toBeLessThanOrEqual(viewport.width);
  expect(caja.y + caja.height).toBeLessThanOrEqual(viewport.height);

  await modal.locator('[data-guarda="[sí]"]').tap();
  await expect(page.locator('#lienzo-diagrama .etiqueta-arista').first()).toContainText('[sí]');
});

test('sin desbordamiento horizontal en pantallas clave', async ({ page }) => {
  const overflow = () => page.evaluate(() => document.scrollingElement.scrollWidth - window.innerWidth);
  await page.goto('/');
  await page.locator('#materias-list .materia-card').first().click();
  expect(await overflow()).toBeLessThanOrEqual(0);

  await practicaSoloDiagramas(page, 0);
  await page.locator('#pool-diagrama .pieza').first().tap();
  await expect(page.locator('#lienzo-diagrama .nodo-puesto')).toHaveCount(1);
  expect(await overflow()).toBeLessThanOrEqual(0);

  await page.getByRole('button', { name: 'Comprobar', exact: true }).tap();
  await expect(page.locator('#feedback-box')).toBeVisible();
  expect(await overflow()).toBeLessThanOrEqual(0);
});
