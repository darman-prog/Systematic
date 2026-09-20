import { test, expect } from '@playwright/test';
import bd2Preguntas from '../src/datos/bd2/preguntas.js';
import iswPreguntas from '../src/datos/isw/preguntas.js';
import aswPreguntas from '../src/datos/asw/preguntas.js';

test.describe('Systematic — smoke', () => {
  test('el home lista 3 materias con su estado de contenido', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Systematic' })).toBeVisible();
    const cards = page.locator('#materias-list .materia-card');
    await expect(cards).toHaveCount(3);
    await expect(cards.nth(0)).toContainText('Base de Datos 2');
    await expect(cards.nth(0)).toContainText(bd2Preguntas.length + ' preguntas');
    await expect(cards.nth(1)).toContainText('Ingeniería de Software');
    await expect(cards.nth(1)).toContainText(iswPreguntas.length + ' preguntas');
    await expect(cards.nth(1)).not.toContainText('Contenido en preparación');
    await expect(cards.nth(2)).toContainText('Arquitectura de Software');
    await expect(cards.nth(2)).toContainText(aswPreguntas.length + ' preguntas');
    await expect(cards.nth(2)).not.toContainText('Contenido en preparación');
  });

  test('seleccionar BD2 muestra estadísticas y permite practicar', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));
    await page.goto('/');
    await page.locator('#materias-list .materia-card').first().click();
    await expect(page.locator('#screen-start')).toBeVisible();
    await expect(page.locator('#stat-total')).toHaveText(String(bd2Preguntas.length));
    await page.getByRole('button', { name: /Configurar práctica/ }).click();
    await expect(page.locator('#screen-config')).toBeVisible();
    await page.locator('#screen-config').getByRole('button', { name: '← Inicio' }).click();
    // Práctica determinista: solo preguntas de opción múltiple (siempre usan #options-container).
    await page.locator('#tipos-panel .chip', { hasText: 'Opción múltiple' }).click();
    await expect(page.locator('#screen-quiz')).toBeVisible();
    await expect(page.locator('#progress')).toContainText('Pregunta 1');
    await page.locator('#options-container .option').first().click();
    await expect(page.locator('#feedback-box')).toBeVisible();
    await expect(page.locator('#next-btn')).toBeVisible();
    expect(errores).toEqual([]);
  });

  test('modo estudio, flashcards y glosario cargan', async ({ page }) => {
    await page.goto('/');
    await page.locator('#materias-list .materia-card').first().click();
    await page.getByRole('button', { name: /Modo Estudio/ }).click();
    await expect(page.locator('#study-list .study-item').first()).toBeVisible();
    await page.locator('#screen-study').getByRole('button', { name: '← Inicio' }).click();

    await page.getByRole('button', { name: /Flashcards/ }).click();
    await expect(page.locator('.flash-card')).toBeVisible();
    await page.getByRole('button', { name: 'Voltear' }).click();
    await expect(page.getByRole('button', { name: 'Sabía', exact: true })).toBeVisible();
    await page.locator('#screen-flashcards').getByRole('button', { name: '← Inicio' }).click();

    await page.getByRole('button', { name: /Glosario/ }).first().click();
    await page.locator('#glosario-search').fill('INSERT');
    await expect(page.locator('#glosario-list .glosario-item').first()).toBeVisible();
    await expect(page.locator('#glosario-count')).toContainText('término');
  });

  test('apuntes: botón presente y estado vacío sin contenido', async ({ page }) => {
    await page.goto('/');
    await page.locator('#materias-list .materia-card').first().click();
    await page.getByRole('button', { name: /Apuntes/ }).click();
    await expect(page.locator('#screen-apuntes')).toBeVisible();
    await expect(page.locator('#apuntes-list')).toContainText('Aún no hay apuntes');
    await expect(page.locator('#apuntes-count')).toContainText('0 apunte(s)');
  });

  test('contrarreloj y supervivencia inician con sus indicadores', async ({ page }) => {
    await page.on('dialog', d => d.accept());
    await page.goto('/');
    await page.locator('#materias-list .materia-card').first().click();
    await page.locator('#screen-start').getByRole('button', { name: /Contrarreloj/ }).click();
    await expect(page.locator('#screen-quiz')).toBeVisible();
    await expect(page.locator('#modo-badge')).toContainText('Contrarreloj');
    await expect(page.locator('#timer-pregunta')).toBeVisible();
    // El lienzo ER puede aparecer en cualquier posición del banco barajado.
    if (await page.locator('#lienzo-diagrama').count()) {
      await expect(page.locator('#pool-diagrama .pieza').first()).toBeVisible();
    }
    await page.locator('#screen-quiz').getByRole('button', { name: 'Salir de la ronda' }).click();
    await expect(page.locator('#screen-start')).toBeVisible();
    await page.locator('#screen-start').getByRole('button', { name: /Supervivencia/ }).click();
    await expect(page.locator('#screen-quiz')).toBeVisible();
    await expect(page.locator('#modo-badge')).toContainText('Supervivencia');
    await expect(page.locator('#vidas-badge')).toContainText('combo');
    await expect(page.locator('#vidas-badge .icono')).not.toHaveCount(0);
  });

  test('misiones: mapa con nodos secuenciales y misión jugable', async ({ page }) => {
    await page.on('dialog', d => d.accept());
    await page.goto('/');
    await page.locator('#materias-list .materia-card').first().click();
    await page.getByRole('button', { name: /Misiones/ }).click();
    await expect(page.locator('#screen-misiones')).toBeVisible();
    const nodos = page.locator('#misiones-lista .mision-nodo');
    await expect(nodos.first()).toBeVisible();
    await expect(page.locator('#misiones-lista .mision-disponible')).toHaveCount(1);
    await page.locator('#misiones-lista .mision-disponible').first().click();
    await expect(page.locator('#screen-quiz')).toBeVisible();
    await page.locator('#screen-quiz').getByRole('button', { name: 'Salir de la ronda' }).click();
    await expect(page.locator('#screen-start')).toBeVisible();
  });

  test('escenarios: lista, decisiones y pantalla de juego', async ({ page }) => {
    await page.goto('/');
    await page.locator('#materias-list .materia-card').first().click();
    await page.locator('#screen-start').getByRole('button', { name: /Escenarios/ }).click();
    await expect(page.locator('#screen-escenarios')).toBeVisible();
    await expect(page.locator('#escenarios-lista .apunte-card').first()).toBeVisible();
    await page.getByRole('button', { name: /Jugar escenario/ }).first().click();
    await expect(page.locator('#screen-escenario')).toBeVisible();
    await page.locator('#escenario-escena .option').first().click();
    await expect(page.locator('#escenario-escena')).toContainText('Continuar');
    await page.getByRole('button', { name: 'Continuar' }).click();
    await expect(page.locator('#escenario-escena')).toBeVisible();
  });

  test('constructor ER: filtra chip, coloca, conecta, comprueba y valida en el validador del banco', async ({ page }) => {
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));
    await page.on('dialog', d => d.accept());
    await page.goto('/');
    await page.locator('#materias-list .materia-card').first().click();
    await page.getByRole('button', { name: /Configurar práctica/ }).click();
    // Clic en la pestaña "Ninguno" de tipos para aislar solo el tipo diagrama.
    await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').click();
    await page.locator('#screen-config [data-clave="tipos"][data-valor="diagrama"]').click();
    await expect(page.locator('#cfg-resumen')).toContainText('3 preguntas coinciden');
    await page.getByRole('button', { name: /Comenzar práctica/ }).click();
    await expect(page.locator('#screen-quiz')).toBeVisible();
    await expect(page.locator('#progress')).toContainText('Pregunta 1 de 1');
    if (errores.length > 0) {
      throw new Error('Errores de JavaScript: ' + errores.join('; '));
    }
    if (await page.locator('#lienzo-diagrama').count() === 0) {
      throw new Error('El lienzo del constructor ER no se montó en la pregunta de diagrama');
    }
    await expect(page.locator('#lienzo-diagrama')).toBeVisible();
    // Coloca las entidades del pool por tap y verifica que se coloquen en el lienzo.
    const piezasPool = page.locator('#pool-diagrama .pieza');
    const numPiezas = await piezasPool.count();
    expect(numPiezas).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < numPiezas; i++) {
      await piezasPool.first().click();
    }
    await expect(page.locator('#lienzo-diagrama .nodo-puesto')).toHaveCount(numPiezas);
    // Conecta la primera con la segunda y elige cardinalidad 1:N.
    await page.locator('#lienzo-diagrama .nodo-puesto').first().click();
    await page.locator('#lienzo-diagrama .nodo-puesto').nth(1).click();
    await expect(page.locator('#tipos-diagrama')).toBeVisible();
    await page.locator('#tipos-diagrama [data-arista="1:N"]').click();
    await expect(page.locator('#lienzo-diagrama .etiqueta-arista').first()).toContainText('1:N');
    // Comprueba y verifica feedback (éxito o detalle de faltantes, según las entidades).
    await page.getByRole('button', { name: 'Comprobar', exact: true }).click();
    await expect(page.locator('#feedback-box')).toBeVisible();
    await expect(page.locator('#next-btn')).toBeVisible();
  });

  test('lienzo de diagrama operable solo con teclado', async ({ page }) => {
    await page.goto('/');
    await page.locator('#materias-list .materia-card').first().click(); // BD2
    await page.getByRole('button', { name: /Configurar práctica/ }).click();
    await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').click();
    await page.locator('#screen-config [data-clave="tipos"][data-valor="diagrama"]').click();
    await page.getByRole('button', { name: /Comenzar práctica/ }).click();
    await expect(page.locator('#screen-quiz')).toBeVisible();

    // Coloca dos nodos con Enter desde el pool.
    await page.locator('#pool-diagrama .pieza').first().focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#lienzo-diagrama .nodo-puesto')).toHaveCount(1);
    // El foco se restaura sobre el nodo recién colocado (no se pierde al re-render).
    await expect(page.locator('#lienzo-diagrama .nodo-puesto').first()).toBeFocused();
    await page.locator('#pool-diagrama .pieza').first().focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#lienzo-diagrama .nodo-puesto')).toHaveCount(2);

    // Selecciona el primero y conecta con el segundo con Enter.
    await page.locator('#lienzo-diagrama .nodo-puesto').first().focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#lienzo-diagrama .nodo-puesto').first()).toHaveAttribute('aria-pressed', 'true');
    await page.locator('#lienzo-diagrama .nodo-puesto').nth(1).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#tipos-diagrama')).toBeVisible();

    // Elige el tipo de relación con Enter.
    await page.locator('#tipos-diagrama [data-arista]').first().focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#lienzo-diagrama .etiqueta-arista')).toHaveCount(1);

    // Borra la conexión operando su etiqueta (botón) con teclado.
    await page.locator('#lienzo-diagrama .etiqueta-arista').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#lienzo-diagrama .etiqueta-arista')).toHaveCount(0);

    // Escape deselecciona.
    await page.locator('#lienzo-diagrama .nodo-puesto').first().focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Escape');
    await expect(page.locator('#lienzo-diagrama .nodo-puesto.seleccionado')).toHaveCount(0);

    // Supr retira el nodo y el foco cae en la pieza devuelta al pool.
    await page.locator('#lienzo-diagrama .nodo-puesto').first().focus();
    await page.keyboard.press('Delete');
    await expect(page.locator('#lienzo-diagrama .nodo-puesto')).toHaveCount(1);
    const focoEnPool = await page.evaluate(() => !!document.activeElement && document.activeElement.classList.contains('pieza'));
    expect(focoEnPool).toBe(true);
  });

  test('constructor UML con miembros: ASW muestra preguntas de diagrama de clases', async ({ page }) => {
    await page.goto('/');
    await page.locator('#materias-list .materia-card').nth(2).click(); // ASW
    await page.getByRole('button', { name: /Configurar práctica/ }).click();
    await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').click();
    await page.locator('#screen-config [data-clave="tipos"][data-valor="diagrama"]').click();
    await expect(page.locator('#cfg-resumen')).toContainText('3 preguntas coinciden');
    await page.getByRole('button', { name: /Comenzar práctica/ }).click();
    await expect(page.locator('#screen-quiz')).toBeVisible();
    await expect(page.locator('#lienzo-diagrama')).toBeVisible();
    // Verifica que hay miembros en el pool (para UML clases)
    const miembrosPool = page.locator('#pool-miembros .pieza');
    const numMiembros = await miembrosPool.count();
    // Coloca dos nodos (la conexión dirigida requiere un par).
    await page.locator('#pool-diagrama .pieza').first().click();
    await expect(page.locator('#lienzo-diagrama .nodo-puesto')).toHaveCount(1);
    if (numMiembros > 0) {
      // Asigna un miembro al nodo
      await miembrosPool.first().click();
      await page.locator('#lienzo-diagrama .nodo-puesto').first().click();
      await expect(page.locator('#lienzo-diagrama .nodo-miembros')).toBeVisible();
    }
    await page.locator('#pool-diagrama .pieza').first().click();
    await expect(page.locator('#lienzo-diagrama .nodo-puesto')).toHaveCount(2);
    await page.locator('#lienzo-diagrama .nodo-puesto').first().click();
    await page.locator('#lienzo-diagrama .nodo-puesto').nth(1).click();
    await page.locator('#tipos-diagrama [data-arista="herencia"]').click();
    await expect(page.locator('#edges-diagrama line[marker-end="url(#flecha-diagrama)"]')).toHaveCount(1);
    // Comprueba: no debe romper y debe mostrar detalle legible (nombres, no "[object Object]").
    await page.getByRole('button', { name: 'Comprobar', exact: true }).click();
    await expect(page.locator('#feedback-box')).toBeVisible();
    await expect(page.locator('#feedback-box')).not.toContainText('[object Object]');
    await expect(page.locator('#next-btn')).toBeVisible();
  });

  test('casos de diagramación: lista y juego', async ({ page }) => {
    await page.goto('/');
    await page.locator('#materias-list .materia-card').first().click(); // BD2
    await page.locator('[data-action="startCasos"]').first().click();
    await expect(page.locator('#screen-casos')).toBeVisible();
    await expect(page.locator('#casos-lista .apunte-card').first()).toBeVisible();
    await page.getByRole('button', { name: /Jugar caso/ }).first().click();
    await expect(page.locator('#screen-caso')).toBeVisible();
    await expect(page.locator('#lienzo-diagrama')).toBeVisible();

    // Coloca dos nodos del pool en el lienzo.
    await page.locator('#pool-diagrama .pieza').first().click();
    await page.locator('#pool-diagrama .pieza').first().click();
    await expect(page.locator('#lienzo-diagrama .nodo-puesto')).toHaveCount(2);

    // Conecta el primero con el segundo eligiendo un tipo de relación.
    await page.locator('#lienzo-diagrama .nodo-puesto').first().click();
    await page.locator('#lienzo-diagrama .nodo-puesto').nth(1).click();
    await expect(page.locator('#tipos-diagrama')).toBeVisible();
    await page.locator('#tipos-diagrama .pieza').first().click();
    await expect(page.locator('#lienzo-diagrama .etiqueta-arista')).toHaveCount(1);

    // Comprueba y verifica que se muestra el resultado del caso.
    await page.locator('[data-action="comprobarCaso"]').click();
    await expect(page.locator('#caso-escena').getByText(/¡Éxito!|Resultado parcial|Fracaso/)).toBeVisible();
    await expect(page.locator('#caso-escena [data-action="startCasos"]')).toBeVisible();
  });

  test('las posiciones de nodos persisten al recomprobar la pregunta', async ({ page }) => {
    await page.goto('/');
    await page.locator('#materias-list .materia-card').first().click(); // BD2 (ER)
    await page.getByRole('button', { name: /Configurar práctica/ }).click();
    await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').click();
    await page.locator('#screen-config [data-clave="tipos"][data-valor="diagrama"]').click();
    await page.getByRole('button', { name: /Comenzar práctica/ }).click();
    await expect(page.locator('#screen-quiz')).toBeVisible();

    await page.locator('#pool-diagrama .pieza').first().click();
    const nodo = page.locator('#lienzo-diagrama .nodo-puesto').first();
    await expect(nodo).toHaveCount(1);
    await nodo.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    const antes = await nodo.evaluate(el => el.style.left);
    expect(antes).not.toBe('');

    // Comprobar re-renderiza el lienzo con el resultado; la posición se conserva.
    await page.getByRole('button', { name: 'Comprobar', exact: true }).click();
    await expect(page.locator('#feedback-box')).toBeVisible();
    const despues = await page.locator('#lienzo-diagrama .nodo-puesto').first().evaluate(el => el.style.left);
    expect(despues).toBe(antes);
  });

  test('modal de guardas operable en actividades (ISW)', async ({ page }) => {
    await page.goto('/');
    await page.locator('#materias-list .materia-card').nth(1).click(); // ISW
    await page.getByRole('button', { name: /Configurar práctica/ }).click();
    await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').click();
    await page.locator('#screen-config [data-clave="tipos"][data-valor="diagrama"]').click();
    await page.getByRole('button', { name: /Comenzar práctica/ }).click();
    await expect(page.locator('#screen-quiz')).toBeVisible();

    // El banco va barajado: la primera puede ser casos-uso o actividades; llegar a actividades.
    const fijos = await page.locator('#lienzo-diagrama .nodo-fijo').count();
    if (fijos === 0) {
      await page.getByRole('button', { name: 'Comprobar', exact: true }).click();
      await page.locator('#next-btn').click();
    }
    await expect(page.locator('#lienzo-diagrama .nodo-fijo').first()).toBeVisible();

    // Conecta un nodo fijo con una pieza recién colocada y elige la transición.
    await page.locator('#pool-diagrama .pieza').first().click();
    await page.locator('#lienzo-diagrama .nodo-fijo').first().click();
    await page.locator('#lienzo-diagrama .nodo-puesto').nth(3).click();
    await expect(page.locator('#tipos-diagrama')).toBeVisible();
    await page.locator('#tipos-diagrama [data-arista="transición"]').click();

    // El diálogo toma el foco y se cierra con Escape devolviéndolo.
    const modal = page.locator('.modal-guarda');
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal.locator('.btn-guarda').first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(modal).toHaveCount(0);

    // Reabre y confirma con la guarda [sí]: la etiqueta la muestra.
    await page.locator('#tipos-diagrama [data-arista="transición"]').click();
    await expect(modal).toBeVisible();
    await modal.locator('[data-guarda="[sí]"]').click();
    await expect(page.locator('#lienzo-diagrama .etiqueta-arista').first()).toContainText('[sí]');
  });

  test('regresar a materias y entrar a una materia con contenido', async ({ page }) => {
    await page.goto('/');
    await page.locator('#materias-list .materia-card').first().click();
    await page.getByRole('button', { name: '← Materias' }).click();
    await expect(page.locator('#screen-materias')).toBeVisible();
    await page.locator('#materias-list .materia-card').nth(1).click();
    await expect(page.locator('#materia-nombre')).toHaveText('Ingeniería de Software');
    const total = await page.locator('#stat-total').textContent();
    expect(parseInt(total, 10)).toBeGreaterThan(0);
    await page.getByRole('button', { name: /Apuntes/ }).click();
    await expect(page.locator('#screen-apuntes')).toBeVisible();
    await expect(page.locator('#apuntes-list .apunte-card').first()).toBeVisible();
    await expect(page.locator('#apuntes-filtros .chip')).not.toHaveCount(0);
  });

  test('migra el progreso legacy quizBD2.* a sys.*.bd2', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      localStorage.setItem('quizBD2.progreso', JSON.stringify({ 'P1-001': { ok: 3, fail: 1, box: 2, marked: true } }));
      localStorage.setItem('quizBD2.meta', '30');
    });
    await page.goto('/');
    await page.locator('#materias-list .materia-card').first().click();
    const almacenado = await page.evaluate(() => ({
      progreso: JSON.parse(localStorage.getItem('sys.progreso.bd2') || 'null'),
      meta: localStorage.getItem('sys.meta.bd2'),
      flag: localStorage.getItem('sys.migracion.v1')
    }));
    expect(almacenado.progreso['P1-001'].ok).toBe(3);
    expect(almacenado.meta).toBe('30');
    expect(almacenado.flag).toBeTruthy();
  });
});
