import { test, expect } from '@playwright/test';

// Primera impresión (contexto fresco): con Firebase configurado, el acceso es la primera
// pantalla; "Continuar sin cuenta" deriva al onboarding local por nombre.
test.use({ storageState: { cookies: [], origins: [] } });

test('la primera visita muestra el acceso; sin cuenta deriva al onboarding', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#screen-cuenta')).toBeVisible();
  await expect(page.locator('#auth-root')).toContainText('Bienvenido');

  await page.getByRole('button', { name: 'Continuar sin cuenta' }).click();
  await expect(page.locator('#screen-onboarding')).toBeVisible();

  await page.locator('#onboarding-nombre').fill('Diego');
  await page.getByRole('button', { name: '¡Empezar!' }).click();

  await expect(page.locator('#screen-materias')).toBeVisible();
  await expect(page.locator('#saludo-home')).toContainText('Diego');
  await expect(page.locator('#perfil-panel')).toContainText('Perfil de Diego');

  // Recarga: el invitado con identidad local entra directo (ni acceso ni onboarding).
  await page.reload();
  await expect(page.locator('#screen-materias')).toBeVisible();
  await expect(page.locator('#screen-onboarding')).toBeHidden();
  await expect(page.locator('#screen-cuenta')).toBeHidden();
});

test('se puede continuar sin nombre y el saludo queda neutro', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#screen-cuenta')).toBeVisible();
  await page.getByRole('button', { name: 'Continuar sin cuenta' }).click();
  await page.getByRole('button', { name: 'Continuar sin nombre' }).click();

  await expect(page.locator('#screen-materias')).toBeVisible();
  await expect(page.locator('#saludo-home')).toBeVisible();
  await expect(page.locator('#saludo-home')).not.toContainText(',');
  await expect(page.locator('#perfil-panel')).toContainText('Tu perfil');

  // Recarga: el flag evita repetir el onboarding y el acceso.
  await page.reload();
  await expect(page.locator('#screen-materias')).toBeVisible();
});

test('el nombre se puede cambiar desde ajustes y viaja al saludo', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#screen-cuenta')).toBeVisible();
  await page.getByRole('button', { name: 'Continuar sin cuenta' }).click();
  await page.getByRole('button', { name: 'Continuar sin nombre' }).click();
  await page.locator('#materias-list .materia-card').first().click();

  // Editor de nombre en ajustes (pantalla de la materia).
  await page.locator('[data-action="toggleNombreEditor"]').click();
  await expect(page.locator('#nombre-editor')).toBeVisible();
  await page.locator('#nombre-input').fill('Ana');
  await page.locator('[data-action="guardarNombreAjustes"]').click();
  await expect(page.locator('#nombre-editor')).toBeHidden();

  // El saludo del home usa el nuevo nombre.
  await page.locator('#screen-start [data-action="irMaterias"]').click();
  await expect(page.locator('#saludo-home')).toContainText('Ana');
  await expect(page.locator('#perfil-panel')).toContainText('Perfil de Ana');
});
