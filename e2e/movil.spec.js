import { test, expect } from '@playwright/test';

// Suite móvil (Pixel 7: 412x915, hasTouch): el constructor de diagramas solo se ofrece
// en escritorio. Aquí se valida que el modo no aparece y que las pantallas clave
// no se desbordan en un viewport de teléfono.

async function irAMateria(page, indice) {
  await page.goto('/');
  await page.locator('#materias-list .materia-card').nth(indice).click();
  // El contenido se carga bajo demanda (spec 012): esperar la portada antes de evaluar
  // visibilidad, o los asserts corren con la pantalla aún oculta.
  await expect(page.locator('#screen-start')).toBeVisible();
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

// Validación de ergonomía táctil y prevención de auto-zoom en móviles (Auditoría 2026-10)
test('accesibilidad táctil y prevención de zoom iOS en móvil', async ({ page }) => {
  await irAMateria(page, 0);

  // Configuración: validar que el input de cantidad tenga al menos 16px para evitar auto-zoom iOS
  await page.getByRole('button', { name: /Configurar práctica/ }).click();
  await expect(page.locator('#screen-config')).toBeVisible();
  const inputFont = await page.locator('#cfg-cantidad').evaluate(el => window.getComputedStyle(el).fontSize);
  expect(inputFont).toBe('16px');

  // Iniciar práctica
  await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').click();
  await page.locator('#screen-config [data-clave="tipos"][data-valor="multiple"]').click();
  await page.getByRole('button', { name: /Comenzar práctica/ }).click();
  await expect(page.locator('#screen-quiz')).toBeVisible();

  // Estrella de marcar con área táctil accesible (mínimo 44px de alto y ancho, WCAG 2.5.8)
  const starBox = await page.locator('#star-btn').boundingBox();
  expect(starBox.width).toBeGreaterThanOrEqual(44);
  expect(starBox.height).toBeGreaterThanOrEqual(44);

  // Atajos de teclado físico ocultos en vista móvil
  await expect(page.locator('#screen-quiz p:has-text("Atajos:")')).toBeHidden();
});

test('pantalla de perfil compacta sin espacio vertical excesivo en móvil', async ({ page }) => {
  await page.goto('/');
  // Saltar onboarding inicial si aparece en navegador limpio
  if (await page.locator('#screen-onboarding:visible').count() > 0) {
    await page.locator('#onboarding-nombre').fill('Estudiante');
    await page.getByRole('button', { name: /Comenzar/ }).click();
  }
  await expect(page.locator('#screen-materias')).toBeVisible();

  // Abrir perfil desde materias
  await page.locator('#screen-materias [data-action="irPerfil"]').click();
  await expect(page.locator('#screen-perfil')).toBeVisible();
  // Las fuentes cambian el alto del subtítulo: se espera antes de medir el gap.
  await page.evaluate(() => document.fonts.ready);

  // Medir distancia vertical entre el subtítulo de la cabecera y el botón ← Materias
  const subBox = await page.locator('#screen-perfil .perfil-head .perfil-sub').boundingBox();
  const btnBox = await page.locator('#screen-perfil [data-action="irMaterias"]').boundingBox();

  expect(subBox).not.toBeNull();
  expect(btnBox).not.toBeNull();

  // La distancia vertical (gap) debe ser compacta (menor a 30px), evitando el vacío de flex-basis
  const distanciaVertical = btnBox.y - (subBox.y + subBox.height);
  expect(distanciaVertical).toBeGreaterThanOrEqual(0);
  await expect.poll(async () => {
    const sub = await page.locator('#screen-perfil .perfil-head .perfil-sub').boundingBox();
    const btn = await page.locator('#screen-perfil [data-action="irMaterias"]').boundingBox();
    return sub && btn ? btn.y - (sub.y + sub.height) : Infinity;
  }, { timeout: 5000 }).toBeLessThanOrEqual(30);
});
