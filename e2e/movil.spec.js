import { test, expect } from '@playwright/test';

// Suite móvil (Pixel 7: 412x915, hasTouch): el constructor de diagramas solo se ofrece
// en escritorio. Aquí se valida que el modo no aparece y que las pantallas clave
// no se desbordan en un viewport de teléfono.

async function irAMateria(page, indice) {
  await page.goto('/');
  await page.locator('#materias-list .materia-card').nth(indice).click();
}

test('las entradas al constructor de diagramas no aparecen en móvil', async ({ page }) => {
  await irAMateria(page, 2); // ASW: la materia con más preguntas de diagrama

  // Card "Casos de diagramación" y botón "Casos técnicos" ocultos (seguen en el DOM).
  await expect(page.locator('[data-action="startCasos"]:visible')).toHaveCount(0);
  await expect(page.locator('[data-action="practicarCasos"]:visible')).toHaveCount(0);

  // Chip de diagrama fuera del panel de tipos del home.
  await expect(page.locator('#tipos-panel [data-tipo="diagrama"]')).toHaveCount(0);

  // Configuración: sin chip de diagrama y con aviso de escritorio.
  await page.getByRole('button', { name: /Configurar práctica/ }).click();
  await expect(page.locator('#screen-config [data-clave="tipos"][data-valor="diagrama"]')).toHaveCount(0);
  await expect(page.locator('[data-aviso-diagramas]')).toContainText('solo en escritorio');
});

test('una práctica en móvil nunca monta el lienzo de diagramas', async ({ page }) => {
  await irAMateria(page, 0); // BD2
  await page.getByRole('button', { name: /Configurar práctica/ }).click();
  await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').click();
  await page.locator('#screen-config [data-clave="tipos"][data-valor="multiple"]').click();
  await page.getByRole('button', { name: /Comenzar práctica/ }).click();
  await expect(page.locator('#screen-quiz')).toBeVisible();

  await page.locator('#options-container .option').first().click();
  await expect(page.locator('#feedback-box')).toBeVisible();
  await expect(page.locator('#lienzo-diagrama')).toHaveCount(0);
});

test('sin desbordamiento horizontal en pantallas clave', async ({ page }) => {
  const overflow = () => page.evaluate(() => document.scrollingElement.scrollWidth - window.innerWidth);
  await irAMateria(page, 0);
  expect(await overflow()).toBeLessThanOrEqual(0);

  await page.getByRole('button', { name: /Configurar práctica/ }).click();
  await expect(page.locator('#screen-config')).toBeVisible();
  expect(await overflow()).toBeLessThanOrEqual(0);

  await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').click();
  await page.locator('#screen-config [data-clave="tipos"][data-valor="multiple"]').click();
  await page.getByRole('button', { name: /Comenzar práctica/ }).click();
  await expect(page.locator('#screen-quiz')).toBeVisible();
  await page.locator('#options-container .option').first().click();
  await expect(page.locator('#feedback-box')).toBeVisible();
  expect(await overflow()).toBeLessThanOrEqual(0);
});
