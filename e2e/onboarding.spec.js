import { test, expect } from '@playwright/test';

// Onboarding de primera impresión: esta spec sobreescribe el storageState global
// para empezar con un contexto fresco (sin nombre ni flag en localStorage).
test.use({ storageState: { cookies: [], origins: [] } });

test('la primera visita pide el nombre, saluda y no vuelve a preguntar', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#screen-onboarding')).toBeVisible();
  await expect(page.locator('#screen-materias')).toBeHidden();

  await page.locator('#onboarding-nombre').fill('Diego');
  await page.getByRole('button', { name: '¡Empezar!' }).click();

  await expect(page.locator('#screen-materias')).toBeVisible();
  await expect(page.locator('#saludo-home')).toContainText('Diego');
  await expect(page.locator('#perfil-panel')).toContainText('Perfil de Diego');

  // Recarga: el nombre queda guardado y el onboarding no vuelve a aparecer.
  await page.reload();
  await expect(page.locator('#screen-onboarding')).toBeHidden();
  await expect(page.locator('#saludo-home')).toContainText('Diego');
});

test('se puede continuar sin nombre y el saludo queda neutro', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Continuar sin nombre' }).click();

  await expect(page.locator('#screen-materias')).toBeVisible();
  await expect(page.locator('#saludo-home')).toBeVisible();
  await expect(page.locator('#saludo-home')).not.toContainText(',');
  await expect(page.locator('#perfil-panel')).toContainText('Tu perfil');

  // Recarga: el flag evita repetir el onboarding.
  await page.reload();
  await expect(page.locator('#screen-onboarding')).toBeHidden();
  await expect(page.locator('#screen-materias')).toBeVisible();
});
