import { test, expect } from '@playwright/test';

// Suite móvil y táctil (hasTouch): valida que el constructor de diagramas y los casos
// estén disponibles y operables con tap-tap en celulares (360×740), tablets (768×1024)
// y portátiles táctiles (~1280×800), respetando hit-areas ≥ 44×44 y scroll del lienzo.

async function irAMateria(page, indice) {
  await page.goto('/');
  await page.locator('#materias-list .materia-card').nth(indice).tap();
  // El contenido se carga bajo demanda (spec 012): esperar la portada antes de evaluar
  // visibilidad, o los asserts corren con la pantalla aún oculta.
  await expect(page.locator('#screen-start')).toBeVisible();
}

test('constructor de diagramas visible y funcional con tap-tap en 360x740, 768x1024 y portátil táctil 1280x800', async ({ page }) => {
  const viewports = [
    { width: 360, height: 740 },
    { width: 768, height: 1024 },
    { width: 1280, height: 800 }
  ];

  for (const vp of viewports) {
    await page.setViewportSize(vp);
    await irAMateria(page, 2); // ASW: materia con casos y preguntas de diagramación

    // Entradas de casos y chip de diagrama disponibles en todos los tamaños táctiles
    await expect(page.locator('[data-action="startCasos"]')).toBeVisible();
    await expect(page.locator('#tipos-panel [data-tipo="diagrama"]')).toBeVisible();

    const sinDesbordeHome = await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth
    );
    expect(sinDesbordeHome).toBe(true);

    // Abrir un caso de diagramación con tap()
    await page.locator('[data-action="startCasos"]').tap();
    await expect(page.locator('#screen-casos')).toBeVisible();
    await page.locator('#casos-lista [data-action="elegirCaso"]').first().tap();
    await expect(page.locator('#lienzo-diagrama')).toBeVisible();

    const sinDesbordeCaso = await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth
    );
    expect(sinDesbordeCaso).toBe(true);

    // Flujo tap-tap: tocar pieza en el pool la selecciona y tocar el papel la coloca
    const primeraPieza = page.locator('#pool-diagrama .pieza').first();
    const nombreNodo = await primeraPieza.getAttribute('data-nodo');
    await primeraPieza.tap();
    await expect(primeraPieza).toHaveAttribute('aria-pressed', 'true');

    await page.locator('#lienzo-diagrama').tap({ position: { x: 140, y: 140 } });
    await expect(page.locator(`#lienzo-area .nodo-puesto[data-label="${nombreNodo}"]`)).toBeVisible();
  }
});

test('hit-area >= 44x44 y coordenadas exactas al colocar pieza con el papel scrolleado', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await irAMateria(page, 2); // ASW

  await page.locator('[data-action="startCasos"]').tap();
  await page.locator('#casos-lista [data-action="elegirCaso"]').first().tap();
  await expect(page.locator('#lienzo-diagrama')).toBeVisible();

  // Validar hit-area >= 44x44 en piezas del pool y botones del constructor
  const piezaBox = await page.locator('#pool-diagrama .pieza').first().boundingBox();
  expect(piezaBox.width).toBeGreaterThanOrEqual(44);
  expect(piezaBox.height).toBeGreaterThanOrEqual(44);

  const btnExpandirBox = await page.locator('#btn-expandir-lienzo').boundingBox();
  expect(btnExpandirBox.width).toBeGreaterThanOrEqual(44);
  expect(btnExpandirBox.height).toBeGreaterThanOrEqual(44);

  // Scrollear internamente el papel antes de colocar una pieza
  await page.locator('#lienzo-diagrama').evaluate(el => {
    el.scrollLeft = 200;
    el.scrollTop = 110;
  });
  const scrollActual = await page.locator('#lienzo-diagrama').evaluate(el => ({
    left: el.scrollLeft,
    top: el.scrollTop
  }));
  expect(scrollActual.left).toBeGreaterThan(120);
  expect(scrollActual.top).toBeGreaterThan(60);

  // Seleccionar pieza con tap() y tocar en (150, 160) dentro del visor del lienzo
  const pieza = page.locator('#pool-diagrama .pieza').first();
  const nombre = await pieza.getAttribute('data-nodo');
  await pieza.tap();
  await expect(pieza).toHaveAttribute('aria-pressed', 'true');

  const puntoToque = { x: 150, y: 160 };
  await page.locator('#lienzo-diagrama').tap({ position: puntoToque });

  const nodo = page.locator(`#lienzo-area .nodo-puesto[data-label="${nombre}"]`);
  await expect(nodo).toBeVisible();

  // Confirmar que las coordenadas internas del nodo sumaron scrollLeft y scrollTop
  const posNodo = await nodo.evaluate(el => {
    const htmlEl = /** @type {HTMLElement} */ (el);
    return { left: htmlEl.offsetLeft, top: htmlEl.offsetTop };
  });
  expect(posNodo.left).toBeGreaterThanOrEqual(scrollActual.left + puntoToque.x - 65);
  expect(posNodo.left).toBeLessThanOrEqual(scrollActual.left + puntoToque.x - 45);
  expect(posNodo.top).toBeGreaterThanOrEqual(scrollActual.top + puntoToque.y - 30);
  expect(posNodo.top).toBeLessThanOrEqual(scrollActual.top + puntoToque.y - 10);

  // Validar hit-area >= 44x44 en el nodo colocado y en su botón de quitar
  const nodoBox = await nodo.boundingBox();
  expect(nodoBox.width).toBeGreaterThanOrEqual(44);
  expect(nodoBox.height).toBeGreaterThanOrEqual(44);

  const quitarBox = await nodo.locator('.nodo-quitar').boundingBox();
  expect(quitarBox.width).toBeGreaterThanOrEqual(44);
  expect(quitarBox.height).toBeGreaterThanOrEqual(44);

  const sinDesborde = await page.evaluate(
    () => document.documentElement.scrollWidth <= document.documentElement.clientWidth
  );
  expect(sinDesborde).toBe(true);
});

test('sin desbordamiento horizontal en pantallas clave', async ({ page }) => {
  const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await irAMateria(page, 0);
  expect(await overflow()).toBeLessThanOrEqual(0);

  await page.getByRole('button', { name: /Configurar práctica/ }).tap();
  await expect(page.locator('#screen-config')).toBeVisible();
  expect(await overflow()).toBeLessThanOrEqual(0);

  await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').tap();
  await page.locator('#screen-config [data-clave="tipos"][data-valor="multiple"]').tap();
  await page.getByRole('button', { name: /Comenzar práctica/ }).tap();
  await expect(page.locator('#screen-quiz')).toBeVisible();
  await page.locator('#options-container .option').first().tap();
  await expect(page.locator('#feedback-box')).toBeVisible();
  expect(await overflow()).toBeLessThanOrEqual(0);
});

// Validación de ergonomía táctil y prevención de zoom iOS en móviles (Auditoría 2026-10)
test('accesibilidad táctil y prevención de zoom iOS en móvil', async ({ page }) => {
  await irAMateria(page, 0);

  // Configuración: validar que el input de cantidad tenga al menos 16px para evitar auto-zoom iOS
  await page.getByRole('button', { name: /Configurar práctica/ }).tap();
  await expect(page.locator('#screen-config')).toBeVisible();
  const inputFont = await page.locator('#cfg-cantidad').evaluate(el => window.getComputedStyle(el).fontSize);
  expect(inputFont).toBe('16px');

  // Iniciar práctica
  await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').tap();
  await page.locator('#screen-config [data-clave="tipos"][data-valor="multiple"]').tap();
  await page.getByRole('button', { name: /Comenzar práctica/ }).tap();
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
    await page.getByRole('button', { name: /Comenzar/ }).tap();
  }
  await expect(page.locator('#screen-materias')).toBeVisible();

  // Abrir perfil desde materias
  await page.locator('#screen-materias [data-action="irPerfil"]').tap();
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
