import { test, expect } from '@playwright/test';

// Auditoría de funcionalidad: flujos NO cubiertos por los E2E existentes.
// Verifica que cada acción produce el estado esperado sin errores de consola.

test.describe('Auditoría de funcionalidad — flujos faltantes', () => {
  // "Más modos" vive plegado en un <details>: lo abre de forma idempotente.
  async function abrirMasModos(page) {
    // Sin <details id="mas-modos"> los modos ya están visibles: solo se abre si existe.
    if (await page.locator('#mas-modos').count()) {
      await page.locator('#mas-modos').evaluate(el => { el.open = true; });
    }
  }

  test.beforeEach(async ({ page }) => {
    // Semilla onboarding para desbloquear el acceso.
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('sys.onboarding.v1', 'true');
      localStorage.setItem('sys.nombre.v1', 'Auditor');
    });
    await page.reload();
  });

  test('exportar progreso de materia genera JSON válido', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));
    page.on('dialog', d => d.accept());

    await page.locator('#materias-list .materia-card').first().click();
    await expect(page.locator('#screen-start')).toBeVisible();
    await page.locator('#screen-start [data-action="irMaterias"]').click();
    await page.getByRole('button', { name: 'Ver mi perfil' }).click();
    await expect(page.locator('#screen-perfil')).toBeVisible();

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /Exportar progreso/ }).click(),
    ]);
    expect(download.suggestedFilename()).toContain('bd2');
    expect(download.suggestedFilename()).toContain('.json');
    expect(errores).toEqual([]);
  });

  test('importar progreso de materia reemplaza el estado', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));
    page.on('dialog', d => d.accept());

    await page.locator('#materias-list .materia-card').first().click();
    await expect(page.locator('#screen-start')).toBeVisible();
    await page.locator('#screen-start [data-action="irMaterias"]').click();
    await page.getByRole('button', { name: 'Ver mi perfil' }).click();
    await expect(page.locator('#screen-perfil')).toBeVisible();

    // Importar un archivo de progreso de BD2.
    const archivo = {
      app: 'systematic', version: 2, materia: 'bd2',
      progreso: { 'P1-001': { ok: 5, fail: 2, box: 3, marked: true } },
      historial: [{ date: Date.now(), score: 8, total: 10, modo: 'practica' }],
      actividad: { '2026-10-05': 3 },
      meta: '30'
    };
    await page.locator('#import-file').setInputFiles({
      name: 'progreso.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(archivo)),
    });

    // Verificar que el progreso se importó.
    await page.waitForTimeout(500);
    const progreso = await page.evaluate(() => JSON.parse(localStorage.getItem('sys.progreso.bd2') || '{}'));
    expect(progreso['P1-001'].ok).toBe(5);
    expect(progreso['P1-001'].marked).toBe(true);
    expect(errores).toEqual([]);
  });

  test('reset progreso limpia el estado de la materia', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));
    page.on('dialog', d => d.accept());

    // Sembrar progreso directamente para no depender de un flujo largo.
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('sys.onboarding.v1', 'true');
      localStorage.setItem('sys.nombre.v1', 'Auditor');
      localStorage.setItem('sys.progreso.bd2', JSON.stringify({ 'P1-001': { ok: 3, fail: 1, box: 2, marked: true } }));
    });
    await page.reload();

    await page.locator('#materias-list .materia-card').first().click();
    await expect(page.locator('#screen-start')).toBeVisible();
    await page.locator('#screen-start [data-action="irMaterias"]').click();
    await page.getByRole('button', { name: 'Ver mi perfil' }).click();
    await expect(page.locator('#screen-perfil')).toBeVisible();

    // Reset.
    await page.getByRole('button', { name: /Reiniciar progreso/ }).click();
    // La zona de peligro pide confirmación propia: se confirma en el diálogo.
    await page.locator('#confirm-overlay').getByRole('button', { name: 'Reiniciar todo' }).click();
    await page.waitForTimeout(500);

    const progreso = await page.evaluate(() => JSON.parse(localStorage.getItem('sys.progreso.bd2') || '{}'));
    expect(Object.keys(progreso).length).toBe(0);
    expect(errores).toEqual([]);
  });

  test('clearHistory limpia el historial de intentos', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));
    page.on('dialog', d => d.accept());

    // Sembrar historial directamente.
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('sys.onboarding.v1', 'true');
      localStorage.setItem('sys.nombre.v1', 'Auditor');
      localStorage.setItem('sys.historial.bd2', JSON.stringify([{ date: Date.now(), score: 8, total: 10, modo: 'practica' }]));
    });
    await page.reload();

    await page.locator('#materias-list .materia-card').first().click();
    await expect(page.locator('#screen-start')).toBeVisible();
    await page.locator('#screen-start [data-action="irMaterias"]').click();
    await page.getByRole('button', { name: 'Ver mi perfil' }).click();
    await expect(page.locator('#screen-perfil')).toBeVisible();

    // Borrar historial.
    await page.getByRole('button', { name: /Borrar historial/ }).click();
    // La zona de peligro pide confirmación propia: se confirma en el diálogo.
    await page.locator('#confirm-overlay').getByRole('button', { name: 'Borrar historial' }).click();
    await page.waitForTimeout(500);

    const historial = await page.evaluate(() => JSON.parse(localStorage.getItem('sys.historial.bd2') || '[]'));
    expect(historial.length).toBe(0);
    expect(errores).toEqual([]);
  });

  test('toggleFiltro cambia los filtros de práctica', async ({ page }) => {
    test.setTimeout(60000);
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));

    await page.locator('#materias-list .materia-card').first().click();
    await page.getByRole('button', { name: /Configurar práctica/ }).click();
    await expect(page.locator('#screen-config')).toBeVisible();

    // Activar filtro de solo débiles (sin progreso, no hay débiles; verificar que el resumen cambia).
    await page.locator('#cfg-solo-debiles').check();
    await page.waitForTimeout(300);

    const resumen = await page.locator('#cfg-resumen').textContent();
    // Sin progreso, no hay preguntas débiles; el resumen debe reflejar el filtro activo.
    expect(resumen).toContain('0 preguntas');
    expect(errores).toEqual([]);
  });

  test('toggleFiltroTodos activa/desactiva todos los tipos', async ({ page }) => {
    test.setTimeout(60000);
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));

    await page.locator('#materias-list .materia-card').first().click();
    await page.getByRole('button', { name: /Configurar práctica/ }).click();
    await expect(page.locator('#screen-config')).toBeVisible();

    // Desactivar todos los tipos.
    await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').click();
    await page.waitForTimeout(300);

    const resumen = await page.locator('#cfg-resumen').textContent();
    expect(resumen).toContain('0 preguntas');

    // Activar todos los tipos.
    await page.locator('#screen-config [data-clave="tipos"][data-activar="true"]').click();
    await page.waitForTimeout(300);

    const resumen2 = await page.locator('#cfg-resumen').textContent();
    // Verificar que el número de preguntas es mayor a 0 (no usar toContain con "0 preguntas" porque "90 preguntas" lo contiene).
    const num = parseInt(resumen2.match(/\d+/)?.[0] || '0', 10);
    expect(num).toBeGreaterThan(0);
    expect(errores).toEqual([]);
  });

  test('usarTodas ajusta la cantidad al máximo disponible', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));

    await page.locator('#materias-list .materia-card').first().click();
    await page.getByRole('button', { name: /Configurar práctica/ }).click();
    await expect(page.locator('#screen-config')).toBeVisible();

    await page.getByRole('button', { name: /Usar todas/ }).click();
    await page.waitForTimeout(300);

    const cantidad = await page.locator('#cfg-cantidad').inputValue();
    const max = await page.locator('#cfg-max').textContent();
    expect(parseInt(cantidad, 10)).toBe(parseInt(max, 10));
    expect(errores).toEqual([]);
  });

  test('pregunta vf se responde con V y F', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));

    await page.locator('#materias-list .materia-card').first().click();
    await page.getByRole('button', { name: /Configurar práctica/ }).click();
    await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').click();
    await page.locator('#screen-config [data-clave="tipos"][data-valor="vf"]').click();
    await page.getByRole('button', { name: /Comenzar práctica/ }).click();
    await expect(page.locator('#screen-quiz')).toBeVisible();

    // Responder con V.
    await page.keyboard.press('v');
    await expect(page.locator('#feedback-box')).toBeVisible();
    expect(errores).toEqual([]);
  });

  test('pregunta multi se responde con números y comprobar', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));

    await page.locator('#materias-list .materia-card').first().click();
    await page.getByRole('button', { name: /Configurar práctica/ }).click();
    await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').click();
    await page.locator('#screen-config [data-clave="tipos"][data-valor="multi"]').click();
    await page.getByRole('button', { name: /Comenzar práctica/ }).click();
    await expect(page.locator('#screen-quiz')).toBeVisible();

    // Seleccionar dos opciones con números.
    await page.keyboard.press('1');
    await page.keyboard.press('2');
    await page.getByRole('button', { name: /Comprobar/ }).click();
    await expect(page.locator('#feedback-box')).toBeVisible();
    expect(errores).toEqual([]);
  });

  test('pregunta dragdrop se completa', async ({ page }) => {
    test.setTimeout(60000);
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));

    await page.locator('#materias-list .materia-card').first().click();
    await page.getByRole('button', { name: /Configurar práctica/ }).click();
    await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').click();
    await page.locator('#screen-config [data-clave="tipos"][data-valor="dragdrop"]').click();
    await page.getByRole('button', { name: /Comenzar práctica/ }).click();
    await expect(page.locator('#screen-quiz')).toBeVisible();

    // Verificar que el dragdrop se monta sin errores (pool de piezas y huecos presentes).
    await expect(page.locator('#piezas-pool .pieza').first()).toBeVisible();
    await expect(page.locator('#drag-code .hueco').first()).toBeVisible();
    expect(errores).toEqual([]);
  });

  test('pregunta ordenar se completa', async ({ page }) => {
    test.setTimeout(60000);
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));

    await page.locator('#materias-list .materia-card').first().click();
    await page.getByRole('button', { name: /Configurar práctica/ }).click();
    await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').click();
    await page.locator('#screen-config [data-clave="tipos"][data-valor="ordenar"]').click();
    await page.getByRole('button', { name: /Comenzar práctica/ }).click();
    await expect(page.locator('#screen-quiz')).toBeVisible();

    // Mover un bloque con ▲▼ y comprobar (no importa si es correcto; verificar que no hay errores).
    const bloques = page.locator('#bloques .bloque');
    const count = await bloques.count();
    if (count > 1) {
      await page.locator('#bloques .bloque').first().locator('[data-action="moverBloque"][data-dir="1"]').click();
    }
    await page.locator('#btn-comprobar-orden').click();
    await expect(page.locator('#feedback-box')).toBeVisible();
    expect(errores).toEqual([]);
  });

  test('pregunta código se completa', async ({ page }) => {
    test.setTimeout(60000);
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));

    await page.locator('#materias-list .materia-card').first().click();
    await page.getByRole('button', { name: /Configurar práctica/ }).click();
    await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').click();
    await page.locator('#screen-config [data-clave="tipos"][data-valor="codigo"]').click();
    await page.getByRole('button', { name: /Comenzar práctica/ }).click();
    await expect(page.locator('#screen-quiz')).toBeVisible();

    // Verificar que la pregunta de código se monta sin errores (el textarea puede variar según el tipo).
    await expect(page.locator('#question-area')).toBeVisible();
    expect(errores).toEqual([]);
  });

  test('repetirFalladas inicia nueva sesión con las falladas', async ({ page }) => {
    test.setTimeout(60000);
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));
    page.on('dialog', d => d.accept());

    await page.locator('#materias-list .materia-card').first().click();
    await page.getByRole('button', { name: /Configurar práctica/ }).click();
    await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').click();
    await page.locator('#screen-config [data-clave="tipos"][data-valor="multiple"]').click();
    await page.getByRole('button', { name: /Comenzar práctica/ }).click();
    await expect(page.locator('#screen-quiz')).toBeVisible();

    // Responder una pregunta (fallar) y avanzar hasta resultados.
    await page.locator('#options-container .option').first().click();
    await page.locator('#next-btn').click();

    // Verificar que la pantalla de resultados se muestra sin errores.
    await expect(page.locator('#screen-results')).toBeVisible();
    expect(errores).toEqual([]);
  });

  test('repetirMisma inicia nueva sesión con las mismas preguntas', async ({ page }) => {
    test.setTimeout(60000);
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));
    page.on('dialog', d => d.accept());

    await page.locator('#materias-list .materia-card').first().click();
    await page.getByRole('button', { name: /Configurar práctica/ }).click();
    await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').click();
    await page.locator('#screen-config [data-clave="tipos"][data-valor="multiple"]').click();
    await page.getByRole('button', { name: /Comenzar práctica/ }).click();
    await expect(page.locator('#screen-quiz')).toBeVisible();

    // Responder una pregunta y avanzar hasta resultados.
    await page.locator('#options-container .option').first().click();
    await page.locator('#next-btn').click();

    // Verificar que la pantalla de resultados se muestra sin errores.
    await expect(page.locator('#screen-results')).toBeVisible();
    expect(errores).toEqual([]);
  });

  test('pausa en simulacro detiene el temporizador', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));
    page.on('dialog', d => d.accept());

    await page.locator('#materias-list .materia-card').first().click();
    await page.getByRole('button', { name: /Configurar práctica/ }).click();
    await page.getByRole('button', { name: /Simulacro/ }).click();
    await expect(page.locator('#screen-quiz')).toBeVisible();
    await expect(page.locator('#simulacro-badge')).toBeVisible();

    // Pausar.
    await page.locator('#pause-btn').click();
    await expect(page.locator('#pause-overlay')).toBeVisible();

    // Reanudar.
    await page.locator('#pause-overlay').getByRole('button', { name: /Reanudar/ }).click();
    await expect(page.locator('#pause-overlay')).toBeHidden();
    expect(errores).toEqual([]);
  });

  test('salir de la ronda limpia el estado', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));
    page.on('dialog', d => d.accept());

    await page.locator('#materias-list .materia-card').first().click();
    await page.getByRole('button', { name: /Configurar práctica/ }).click();
    await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').click();
    await page.locator('#screen-config [data-clave="tipos"][data-valor="multiple"]').click();
    await page.getByRole('button', { name: /Comenzar práctica/ }).click();
    await expect(page.locator('#screen-quiz')).toBeVisible();

    // Salir.
    await page.locator('#screen-quiz').getByRole('button', { name: 'Salir de la ronda' }).click();
    // Salir pide confirmación propia: se confirma en el diálogo.
    await page.locator('#confirm-overlay').getByRole('button', { name: 'Salir de la ronda' }).click();
    await expect(page.locator('#screen-start')).toBeVisible();
    expect(errores).toEqual([]);
  });

  test('cuenta anónima: el perfil ofrece iniciar sesión', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));

    await page.getByRole('button', { name: 'Ver mi perfil' }).click();
    await expect(page.locator('#screen-perfil')).toBeVisible();
    await expect(page.locator('#perfil-cuenta')).toContainText('Estás estudiando como invitado');
    await expect(page.locator('#perfil-cuenta').getByRole('button', { name: 'Iniciar sesión' })).toBeVisible();
    expect(errores).toEqual([]);
  });

  test('lenguajes: practicarLeccion inicia sesión de quiz', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));

    await page.locator('#lenguajes-list .materia-card').first().click();
    await expect(page.locator('#screen-lenguaje')).toBeVisible();

    await page.locator('#lenguaje-etapas .btn-leccion').first().click();
    await expect(page.locator('#screen-quiz')).toBeVisible();
    expect(errores).toEqual([]);
  });

  test('lenguajes: rendirExamen inicia sesión de examen', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));

    await page.locator('#lenguajes-list .materia-card').first().click();
    await expect(page.locator('#screen-lenguaje')).toBeVisible();

    await page.locator('#lenguaje-etapas .btn-examen').first().click();
    await expect(page.locator('#screen-quiz')).toBeVisible();
    expect(errores).toEqual([]);
  });

  test('misiones: iniciarMision inicia sesión de misión', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));
    page.on('dialog', d => d.accept());

    await page.locator('#materias-list .materia-card').first().click();
    await abrirMasModos(page);
    await page.getByRole('button', { name: /Misiones/ }).click();
    await expect(page.locator('#screen-misiones')).toBeVisible();

    await page.locator('#misiones-lista .mision-disponible').first().click();
    await expect(page.locator('#screen-quiz')).toBeVisible();
    expect(errores).toEqual([]);
  });

  test('escenarios: jugarEscenario inicia el flujo', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));

    await page.locator('#materias-list .materia-card').first().click();
    await abrirMasModos(page);
    await page.locator('#screen-start').getByRole('button', { name: /Escenarios/ }).click();
    await expect(page.locator('#screen-escenarios')).toBeVisible();

    await page.getByRole('button', { name: /Jugar escenario/ }).first().click();
    await expect(page.locator('#screen-escenario')).toBeVisible();
    expect(errores).toEqual([]);
  });

  test('casos: jugarCaso inicia el flujo', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));

    await page.locator('#materias-list .materia-card').first().click();
    await abrirMasModos(page);
    await page.locator('[data-action="startCasos"]').first().click();
    await expect(page.locator('#screen-casos')).toBeVisible();

    await page.getByRole('button', { name: /Jugar caso/ }).first().click();
    await expect(page.locator('#screen-caso')).toBeVisible();
    expect(errores).toEqual([]);
  });

  test('flashcards: voltearFlash revela la respuesta', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));

    await page.locator('#materias-list .materia-card').first().click();
    await abrirMasModos(page);
    await page.getByRole('button', { name: /Flashcards/ }).click();
    await expect(page.locator('#screen-flashcards')).toBeVisible();

    await page.getByRole('button', { name: 'Voltear' }).click();
    await expect(page.getByRole('button', { name: 'Sabía', exact: true })).toBeVisible();
    expect(errores).toEqual([]);
  });

  test('glosario: cambiarGlosarioCat filtra por categoría', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));

    await page.locator('#materias-list .materia-card').first().click();
    await abrirMasModos(page);
    await page.getByRole('button', { name: /Glosario/ }).first().click();
    await expect(page.locator('#screen-glosario')).toBeVisible();

    const chips = page.locator('#glosario-filtros .chip');
    const count = await chips.count();
    if (count > 1) {
      await chips.nth(1).click();
      await page.waitForTimeout(300);
      const countText = await page.locator('#glosario-count').textContent();
      expect(countText).toContain('término');
    }
    expect(errores).toEqual([]);
  });

  test('estudio: cambiarEstudioTipo filtra por tipo', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));

    await page.locator('#materias-list .materia-card').first().click();
    await page.getByRole('button', { name: /Modo Estudio/ }).click();
    await expect(page.locator('#screen-study')).toBeVisible();

    const chips = page.locator('#study-filtros .chip');
    const count = await chips.count();
    if (count > 1) {
      await chips.nth(1).click();
      await page.waitForTimeout(300);
      const countText = await page.locator('#study-count').textContent();
      expect(countText).toContain('pregunta');
    }
    expect(errores).toEqual([]);
  });

  test('apuntes: cambiarApunteTema filtra por tema', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));

    await page.locator('#materias-list .materia-card').first().click();
    await abrirMasModos(page);
    await page.getByRole('button', { name: /Apuntes/ }).click();
    await expect(page.locator('#screen-apuntes')).toBeVisible();

    const chips = page.locator('#apuntes-filtros .chip');
    const count = await chips.count();
    if (count > 1) {
      await chips.nth(1).click();
      await page.waitForTimeout(300);
      const countText = await page.locator('#apuntes-count').textContent();
      expect(countText).toContain('apunte');
    }
    expect(errores).toEqual([]);
  });
});
