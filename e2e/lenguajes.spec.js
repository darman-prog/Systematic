import { test, expect } from '@playwright/test';

// Recorrido del track de lenguajes (spec 011): home con competencia, mapa de etapas con
// gate, y el examen que mueve la barra. Se siembra la competencia en localStorage para
// no depender de responder todas las preguntas del examen.
test.describe('Lenguajes — TypeScript', () => {
  test('el home lista el lenguaje con su barra de competencia', async ({ page }) => {
    await page.goto('/');
    const seccion = page.locator('#lenguajes-seccion');
    await expect(seccion).toBeVisible();
    const card = page.locator('#lenguajes-list .materia-card').first();
    await expect(card).toContainText('TypeScript');
    await expect(card).toContainText('100 preguntas');
    await expect(card.locator('.competencia-texto')).toContainText('0 de 5');
  });

  test('el mapa de etapas arranca con la primera desbloqueada y el capstone bloqueado', async ({ page }) => {
    await page.goto('/');
    await page.locator('#lenguajes-list .materia-card').first().click();

    await expect(page.locator('#screen-lenguaje')).toBeVisible();
    await expect(page.locator('#lenguaje-nombre')).toHaveText('TypeScript');
    await expect(page.locator('#lenguaje-etapas .etapa-card')).toHaveCount(5);
    await expect(page.locator('#lenguaje-competencia .competencia-texto')).toContainText('0 de 5');

    // Etapa 1 habilitada; la 5 (capstone) bloqueada.
    await expect(page.locator('#lenguaje-etapas .etapa-card').first().locator('.btn-examen')).toBeEnabled();
    await expect(page.locator('#lenguaje-etapas .etapa-card').nth(4).locator('.btn-examen')).toBeDisabled();
  });

  test('una prueba inicia una sesión de quiz', async ({ page }) => {
    await page.goto('/');
    await page.locator('#lenguajes-list .materia-card').first().click();
    await page.locator('#lenguaje-etapas .btn-leccion').first().click();
    await expect(page.locator('#screen-quiz')).toBeVisible();
    await expect(page.locator('#progress')).toContainText('Pregunta 1');
  });

  test('una prueba completada no mueve la barra ni crea competencia', async ({ page }) => {
    await page.on('dialog', d => d.accept());
    await page.goto('/');
    await page.locator('#lenguajes-list .materia-card').first().click();
    await page.locator('#lenguaje-etapas .btn-leccion').first().click();
    await expect(page.locator('#screen-quiz')).toBeVisible();
    // Responder hasta que aparezca el resumen: la lección puede crecer con el contenido.
    for (let i = 0; i < 12; i++) {
      if (await page.locator('#screen-results').isVisible()) break;
      await page.locator('#options-container .option').first().click();
      await page.locator('#next-btn').click();
    }
    await expect(page.locator('#screen-results')).toBeVisible();

    // Criterio 2: la prueba no crea competencia.
    expect(await page.evaluate(() => localStorage.getItem('sys.competencia.lenguaje-ts'))).toBeNull();
    // El retorno de una sesión de lenguaje es al mapa de etapas, no al inicio de materia.
    await page.getByRole('button', { name: '← Etapas' }).click();
    await expect(page.locator('#screen-lenguaje')).toBeVisible();
    await expect(page.locator('#lenguaje-competencia .competencia-texto')).toContainText('0 de 5');
  });

  test('un examen aprobado sube la barra y desbloquea la etapa siguiente', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem('sys.onboarding.v1', 'true');
      // Aprobado vigente de la etapa 1 (version 2, la del roadmap).
      localStorage.setItem('sys.competencia.lenguaje-ts', JSON.stringify({
        fundamentos: { aprobado: true, version: 2, ultimoPct: 1, intentos: 1 }
      }));
    });
    await page.goto('/');
    await expect(page.locator('#lenguajes-list .materia-card[data-lenguaje="lenguaje-ts"] .competencia-texto')).toContainText('1 de 5');

    await page.locator('#lenguajes-list .materia-card').first().click();
    await expect(page.locator('#lenguaje-competencia .competencia-texto')).toContainText('1 de 5');
    await expect(page.locator('#lenguaje-etapas .etapa-card').first()).toHaveClass(/is-aprobada/);
    // La etapa 2 queda habilitada por el aprobado de la 1.
    await expect(page.locator('#lenguaje-etapas .etapa-card').nth(1).locator('.btn-examen')).toBeEnabled();
    // La 5 sigue bloqueada hasta la 4.
    await expect(page.locator('#lenguaje-etapas .etapa-card').nth(4).locator('.btn-examen')).toBeDisabled();
  });

  test('un aprobado de versión vieja no desbloquea (reconciliación con el roadmap)', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem('sys.onboarding.v1', 'true');
      localStorage.setItem('sys.competencia.lenguaje-ts', JSON.stringify({
        fundamentos: { aprobado: true, version: 99, ultimoPct: 1, intentos: 1 }
      }));
    });
    await page.goto('/');
    await page.locator('#lenguajes-list .materia-card').first().click();
    // Dentro, la versión vieja no vale: la barra queda en 0 y la etapa 2 bloqueada.
    await expect(page.locator('#lenguaje-competencia .competencia-texto')).toContainText('0 de 5');
    await expect(page.locator('#lenguaje-etapas .etapa-card').nth(1).locator('.btn-examen')).toBeDisabled();
  });

  test('exporta e importa la competencia del lenguaje', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem('sys.onboarding.v1', 'true');
    });
    await page.on('dialog', d => d.accept());
    await page.goto('/');
    await page.locator('#lenguajes-list .materia-card').first().click();
    await expect(page.locator('#lenguaje-competencia .competencia-texto')).toContainText('0 de 5');

    // Importar un archivo de competencia con la etapa 1 aprobada.
    const archivo = {
      app: 'systematic', version: 2, lenguaje: 'lenguaje-ts',
      competencia: { fundamentos: { aprobado: true, version: 2, ultimoPct: 1, intentos: 1 } },
    };
    await page.locator('#import-file').setInputFiles({
      name: 'competencia.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(archivo)),
    });
    await expect(page.locator('#lenguaje-competencia .competencia-texto')).toContainText('1 de 5');
    await expect(page.locator('#lenguaje-etapas .etapa-card').nth(1).locator('.btn-examen')).toBeEnabled();

    // Exportar: el nombre del archivo identifica el lenguaje.
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Exportar competencia' }).click(),
    ]);
    expect(download.suggestedFilename()).toContain('lenguaje-ts');
  });

  test('el home lista también Java y Python, y Java abre su mapa de etapas', async ({ page }) => {
    await page.goto('/');
    const java = page.locator('#lenguajes-list .materia-card[data-lenguaje="lenguaje-java"]');
    const python = page.locator('#lenguajes-list .materia-card[data-lenguaje="lenguaje-python"]');
    await expect(java).toContainText('Java');
    await expect(java).toContainText('100 preguntas');
    await expect(python).toContainText('Python');
    await expect(python).toContainText('100 preguntas');

    await java.click();
    await expect(page.locator('#screen-lenguaje')).toBeVisible();
    await expect(page.locator('#lenguaje-nombre')).toHaveText('Java');
    await expect(page.locator('#lenguaje-etapas .etapa-card')).toHaveCount(5);
  });
});
