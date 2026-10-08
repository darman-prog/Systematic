import { test, expect } from '@playwright/test';

// Perfil sin Firebase real: identidad, cuenta deshabilitada, datos locales y peligro.
// Usa el visitante semillado (onboarding hecho, sin sesión ni claves de nube).
test.describe('Perfil', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('sys.onboarding.v1', 'true');
      localStorage.setItem('sys.nombre', JSON.stringify('Auditor'));
    });
    await page.reload();
  });

  test('materias → perfil → volver, con los 4 bloques', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));

    await expect(page.locator('#screen-materias')).toBeVisible();
    await page.getByRole('button', { name: 'Ver mi perfil' }).click();
    await expect(page.locator('#screen-perfil')).toBeVisible();

    // Identidad con el nombre local y la gamificación.
    await expect(page.locator('#perfil-identidad')).toContainText('Perfil de Auditor');
    await expect(page.locator('#perfil-identidad')).toContainText('XP');

    // Cuenta: sin duplicar nube/salir. Con Firebase es invitado (Iniciar sesión);
    // sin claves es texto local (Sin cuenta). Ambos valen en local.
    await expect(page.locator('#perfil-cuenta')).toContainText(/Sin cuenta|invitado/);
    await expect(page.locator('#screen-perfil [data-action="subirNube"]')).toHaveCount(0);
    await expect(page.locator('#screen-perfil [data-action="salirCuenta"]')).toHaveCount(0);

    // Datos locales y zona de peligro presentes en el Perfil.
    await expect(page.locator('#screen-perfil [data-action="toggleNombreEditor"]')).toBeVisible();
    await expect(page.locator('#screen-perfil [data-action="exportarDatos"]')).toBeVisible();
    await expect(page.locator('#screen-perfil [data-action="importarArchivo"]')).toBeVisible();
    await expect(page.locator('#screen-perfil [data-action="clearHistory"]')).toBeVisible();
    await expect(page.locator('#screen-perfil [data-action="resetProgreso"]')).toBeVisible();

    // El footer de la materia quedó limpio: sin editor ni exportar/importar ni peligro.
    await page.locator('#screen-perfil [data-action="irMaterias"]').click();
    await expect(page.locator('#screen-materias')).toBeVisible();
    await page.locator('#materias-list .materia-card').first().click();
    await expect(page.locator('#screen-start')).toBeVisible();
    await expect(page.locator('#screen-start [data-action="toggleNombreEditor"]')).toHaveCount(0);
    await expect(page.locator('#screen-start [data-action="exportarDatos"]')).toHaveCount(0);
    await expect(page.locator('#screen-start [data-action="clearHistory"]')).toHaveCount(0);
    expect(errores).toEqual([]);
  });

  test('cancelar la confirmación frena la zona de peligro', async ({ page }) => {
    page.on('dialog', d => d.dismiss());
    await page.evaluate(() => {
      localStorage.setItem('sys.historial.bd2', JSON.stringify([{ date: Date.now(), score: 8, total: 10, modo: 'practica' }]));
    });
    await page.reload();
    await page.locator('#materias-list .materia-card').first().click();
    await page.locator('#screen-start [data-action="irMaterias"]').click();
    await page.getByRole('button', { name: 'Ver mi perfil' }).click();
    await page.getByRole('button', { name: /Borrar historial/ }).click();
    const historial = await page.evaluate(() => JSON.parse(localStorage.getItem('sys.historial.bd2') || '[]'));
    expect(historial.length).toBe(1);
  });
});
