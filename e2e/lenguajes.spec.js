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
    await expect(card).toContainText('35 preguntas');
    await expect(card.locator('.competencia-texto')).toContainText('0 de 5');
  });

  test('el mapa de etapas arranca con la primera desbloqueada y el capstone bloqueado', async ({ page }) => {
    await page.goto('/');
    await page.locator('#lenguajes-list .materia-card').first().click();

    await expect(page.locator('#screen-lenguaje')).toBeVisible();
    await expect(page.locator('#lenguaje-nombre')).toHaveText('TypeScript');
    await expect(page.locator('#lenguaje-etapas .etapa')).toHaveCount(5);
    await expect(page.locator('#lenguaje-competencia .competencia-texto')).toContainText('0 de 5');

    // Etapa 1 habilitada; la 5 (capstone) bloqueada.
    await expect(page.locator('#lenguaje-etapas .etapa').first().locator('.etapa-examen')).toBeEnabled();
    await expect(page.locator('#lenguaje-etapas .etapa').nth(4).locator('.etapa-examen')).toBeDisabled();
  });

  test('una prueba inicia una sesión de quiz', async ({ page }) => {
    await page.goto('/');
    await page.locator('#lenguajes-list .materia-card').first().click();
    await page.locator('#lenguaje-etapas .etapa-leccion').first().click();
    await expect(page.locator('#screen-quiz')).toBeVisible();
    await expect(page.locator('#progress')).toContainText('Pregunta 1');
  });

  test('un examen aprobado sube la barra y desbloquea la etapa siguiente', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem('sys.onboarding.v1', 'true');
      // Aprobado vigente de la etapa 1 (version 1, la del roadmap).
      localStorage.setItem('sys.competencia.lenguaje-ts', JSON.stringify({
        fundamentos: { aprobado: true, version: 1, ultimoPct: 1, intentos: 1 }
      }));
    });
    await page.goto('/');
    await expect(page.locator('#lenguajes-list .materia-card .competencia-texto')).toContainText('1 de 5');

    await page.locator('#lenguajes-list .materia-card').first().click();
    await expect(page.locator('#lenguaje-competencia .competencia-texto')).toContainText('1 de 5');
    await expect(page.locator('#lenguaje-etapas .etapa').first()).toHaveClass(/etapa-aprobada/);
    // La etapa 2 queda habilitada por el aprobado de la 1.
    await expect(page.locator('#lenguaje-etapas .etapa').nth(1).locator('.etapa-examen')).toBeEnabled();
    // La 5 sigue bloqueada hasta la 4.
    await expect(page.locator('#lenguaje-etapas .etapa').nth(4).locator('.etapa-examen')).toBeDisabled();
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
    await expect(page.locator('#lenguaje-etapas .etapa').nth(1).locator('.etapa-examen')).toBeDisabled();
  });
});
