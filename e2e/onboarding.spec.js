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
  await page.getByRole('button', { name: 'Ver mi perfil' }).click();
  await expect(page.locator('#screen-perfil')).toBeVisible();
  await expect(page.locator('#perfil-identidad')).toContainText('Perfil de Diego');

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
  await page.getByRole('button', { name: 'Ver mi perfil' }).click();
  await expect(page.locator('#screen-perfil')).toBeVisible();
  await expect(page.locator('#perfil-identidad')).toContainText('Tu perfil');

  // Recarga: el flag evita repetir el onboarding y el acceso.
  await page.reload();
  await expect(page.locator('#screen-materias')).toBeVisible();
});

test('el nombre se puede cambiar desde el perfil y viaja al saludo', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#screen-cuenta')).toBeVisible();
  await page.getByRole('button', { name: 'Continuar sin cuenta' }).click();
  await page.getByRole('button', { name: 'Continuar sin nombre' }).click();
  await page.getByRole('button', { name: 'Ver mi perfil' }).click();
  await expect(page.locator('#screen-perfil')).toBeVisible();

  // Editor de nombre en el Perfil.
  await page.locator('#screen-perfil [data-action="toggleNombreEditor"]').click();
  await expect(page.locator('#nombre-editor')).toBeVisible();
  await page.locator('#nombre-input').fill('Ana');
  await page.locator('#screen-perfil [data-action="guardarNombreAjustes"]').click();
  await expect(page.locator('#nombre-editor')).toBeHidden();

  // El saludo del home usa el nuevo nombre.
  await page.locator('#screen-perfil [data-action="irMaterias"]').click();
  await expect(page.locator('#saludo-home')).toContainText('Ana');
  await page.getByRole('button', { name: 'Ver mi perfil' }).click();
  await expect(page.locator('#screen-perfil')).toBeVisible();
  await expect(page.locator('#perfil-identidad')).toContainText('Perfil de Ana');
});

test('login y registro comparten el shell y se puede cambiar de vista', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#screen-cuenta')).toHaveClass(/acceso-libre/);
  await expect(page.locator('#auth-root')).toContainText('Bienvenido');

  await page.getByRole('button', { name: 'Crea una' }).click();
  await expect(page.locator('#auth-root')).toContainText('Comienza tu estudio');
  await expect(page.locator('#reg-pass2')).toBeVisible();
  await expect(page.locator('#reg-pass-hint')).toContainText('Mín. 8 caracteres');
  await expect(page.locator('#auth-root')).not.toContainText('Términos de servicio');

  await page.getByRole('button', { name: 'Inicia sesión' }).click();
  await expect(page.locator('#auth-root')).toContainText('Bienvenido');
  await expect(page.locator('#login-email')).toBeVisible();
});

test('el dashboard muestra el catálogo real y filtra', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Continuar sin cuenta' }).click();
  await page.getByRole('button', { name: 'Continuar sin nombre' }).click();

  await expect(page.locator('#screen-materias')).toBeVisible();
  await expect(page.locator('#screen-materias [data-action="irPerfil"] svg')).toHaveCount(1);
  await expect(page.locator('.app')).toHaveClass(/app-dashboard/);
  await expect(page.locator('#materias-list .materia-card')).toHaveCount(4);
  await expect(page.locator('#lenguajes-list .materia-card')).toHaveCount(3);
  await expect(page.locator('#materias-list')).toContainText('Base de Datos 2');
  await expect(page.locator('#materias-list')).not.toContainText('Sistemas Distribuidos');
  await expect(page.locator('#lenguajes-list')).toContainText('Java');
  await expect(page.locator('#lenguajes-list')).not.toContainText('Rust');
  await expect(page.locator('#filtro-todas-count')).toHaveText('7');

  await page.locator('#catalog-search').fill('Python');
  await expect(page.locator('#lenguajes-list .materia-card:not(.hidden)')).toHaveCount(1);
  await expect(page.locator('#materias-seccion')).toBeHidden();

  await page.locator('#catalog-search').fill('zzz');
  await expect(page.locator('#catalogo-vacio')).toBeVisible();
  await page.locator('#catalog-search').fill('');
  await page.getByRole('button', { name: /Materias \(4\)/ }).click();
  await expect(page.locator('#materias-seccion')).toBeVisible();
  await expect(page.locator('#lenguajes-seccion')).toBeHidden();
  await expect(page.getByRole('button', { name: /Materias \(4\)/ })).toHaveAttribute('aria-pressed', 'true');
});

test('el registro no scrollea en portátiles', async ({ page }) => {
  for (const [width, height] of [[1366, 768], [1280, 720]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await page.getByRole('button', { name: 'Crea una' }).click();
    const medidas = await page.evaluate(() => ({
      scroll: document.documentElement.scrollHeight,
      inner: window.innerHeight
    }));
    expect(medidas.scroll, `${width}x${height}`).toBeLessThanOrEqual(medidas.inner + 1);
  }
});
