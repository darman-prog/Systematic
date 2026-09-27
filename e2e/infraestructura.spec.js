import { test, expect } from '@playwright/test';
import infraPreguntas from '../src/datos/infra/preguntas.js';
import infraGlosario from '../src/datos/infra/glosario.js';
import infraApuntes from '../src/datos/infra/apuntes.js';
import infraEscenarios from '../src/datos/infra/escenarios.js';

// La materia Infraestructura usa los motores existentes: práctica, misiones,
// glosario, apuntes y escenarios. No tiene preguntas de diagrama, así que el
// constructor de lienzo nunca debe aparecer.
test.describe('Infraestructura', () => {
  test('aparece en el home como cuarta materia y carga su portada', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('#materias-list .materia-card').nth(3);
    await expect(card).toContainText('Infraestructura');
    await expect(card).toContainText(infraPreguntas.length + ' preguntas');

    await card.click();
    await expect(page.locator('#screen-start').locator('h1')).toContainText('Infraestructura');
    await expect(page.locator('#stats-panel')).toContainText(String(infraPreguntas.length));
  });

  test('una práctica responde una pregunta multiple y no monta el lienzo', async ({ page }) => {
    await page.goto('/');
    await page.locator('#materias-list .materia-card').nth(3).click();

    await page.getByRole('button', { name: /Configurar práctica/ }).click();
    await expect(page.locator('#screen-config')).toBeVisible();
    // Filtrar por tipo multiple: ahora el banco mezcla tipos y el orden es aleatorio.
    await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').click();
    await page.locator('#screen-config [data-clave="tipos"][data-valor="multiple"]').click();
    await page.getByRole('button', { name: /Comenzar práctica/ }).click();

    await expect(page.locator('#screen-quiz')).toBeVisible();
    await page.locator('#options-container .option').first().click();
    await expect(page.locator('#feedback-box')).toBeVisible();
    await expect(page.locator('#lienzo-diagrama')).toHaveCount(0);
  });

  test('las misiones se generan a partir de los temas del banco', async ({ page }) => {
    await page.goto('/');
    await page.locator('#materias-list .materia-card').nth(3).click();
    await page.getByRole('button', { name: /Misiones/ }).click();

    await expect(page.locator('#screen-misiones')).toBeVisible();
    // 18 temas → 18 nodos de misión
    await expect(page.locator('#misiones-lista .mision-nodo')).toHaveCount(18);
    await expect(page.locator('#misiones-lista .mision-disponible')).toHaveCount(1);
  });

  test('el glosario carga los términos y las categorías', async ({ page }) => {
    await page.goto('/');
    await page.locator('#materias-list .materia-card').nth(3).click();
    await page.getByRole('button', { name: /Glosario/ }).first().click();

    await expect(page.locator('#glosario-list')).toBeVisible();
    await expect(page.locator('#glosario-list .glosario-item')).toHaveCount(infraGlosario.terminos.length);
    // Cada categoría del glosario aparece como filtro, más el chip "Todas"
    await expect(page.locator('#glosario-filtros .chip')).toHaveCount(infraGlosario.categorias.length + 1);
  });

  test('los apuntes cargan con su contenido', async ({ page }) => {
    await page.goto('/');
    await page.locator('#materias-list .materia-card').nth(3).click();
    await page.locator('[data-action="startApuntes"]').click();

    await expect(page.locator('#screen-apuntes')).toBeVisible();
    await expect(page.locator('#apuntes-list .apunte-card')).toHaveCount(infraApuntes.length);
    await expect(page.locator('#apuntes-list .apunte-card').first()).toContainText(infraApuntes[0].titulo);
  });

  test('los escenarios cargan y se puede jugar uno', async ({ page }) => {
    await page.goto('/');
    await page.locator('#materias-list .materia-card').nth(3).click();
    await page.getByRole('button', { name: /Escenarios/ }).click();

    await expect(page.locator('#screen-escenarios')).toBeVisible();
    await expect(page.locator('#escenarios-lista .apunte-card')).toHaveCount(infraEscenarios.length);

    await page.getByRole('button', { name: /Jugar escenario/ }).first().click();
    await expect(page.locator('#screen-escenario')).toBeVisible();
    await page.locator('#escenario-escena .option').first().click();
    await expect(page.locator('#escenario-escena')).toContainText('Continuar');
  });

  test('los casos de diagramación muestran el estado vacío sin romperse', async ({ page }) => {
    await page.goto('/');
    await page.locator('#materias-list .materia-card').nth(3).click();
    await page.locator('[data-action="startCasos"]').first().click();

    await expect(page.locator('#screen-casos')).toBeVisible();
    // casos: [] → estado vacío, no error
    await expect(page.locator('#casos-lista')).toContainText('Aún no hay casos');
    await expect(page.locator('#lienzo-diagrama')).toHaveCount(0);
  });
});
