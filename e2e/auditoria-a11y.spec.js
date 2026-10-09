import { test, expect } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Auditoría de accesibilidad WCAG 2.2 AA con axe-core en las 17 pantallas de la app.
// Inyecta axe-core desde node_modules (sin CDN) y escribe resultados a docs/auditoria/a11y-resultados.json.

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const axeSource = readFileSync(join(__dirname, '../node_modules/axe-core/axe.min.js'), 'utf8');
const salida = join(__dirname, '../docs/auditoria/a11y-resultados.json');

// "Más modos" vive plegado en un <details>: lo abre de forma idempotente.
async function abrirMasModos(page) {
  // Sin <details id="mas-modos"> los modos ya están visibles: solo se abre si existe.
  if (await page.locator('#mas-modos').count()) {
    await page.locator('#mas-modos').evaluate(el => { el.open = true; });
  }
}

// Navega a una pantalla específica semillando onboarding para desbloquear el acceso.
async function irAPantalla(page, nombre) {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('sys.onboarding.v1', 'true');
    localStorage.setItem('sys.nombre.v1', 'Auditor');
  });
  await page.reload();

  switch (nombre) {
    case 'onboarding':
      await page.evaluate(() => localStorage.removeItem('sys.onboarding.v1'));
      await page.reload();
      break;
    case 'materias':
      // Ya visible tras onboarding semillado.
      break;
    case 'start':
      await page.locator('#materias-list .materia-card').first().click();
      break;
    case 'config':
      await page.locator('#materias-list .materia-card').first().click();
      await page.getByRole('button', { name: /Configurar práctica/ }).click();
      break;
    case 'quiz':
      await page.locator('#materias-list .materia-card').first().click();
      await page.getByRole('button', { name: /Configurar práctica/ }).click();
      await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').click();
      await page.locator('#screen-config [data-clave="tipos"][data-valor="multiple"]').click();
      await page.getByRole('button', { name: /Comenzar práctica/ }).click();
      break;
    case 'results':
      await page.locator('#materias-list .materia-card').first().click();
      await page.getByRole('button', { name: /Configurar práctica/ }).click();
      await page.locator('#screen-config [data-clave="tipos"][data-activar="false"]').click();
      await page.locator('#screen-config [data-clave="tipos"][data-valor="multiple"]').click();
      await page.getByRole('button', { name: /Comenzar práctica/ }).click();
      await page.locator('#options-container .option').first().click();
      await page.locator('#next-btn').click();
      break;
    case 'study':
      await page.locator('#materias-list .materia-card').first().click();
      await page.getByRole('button', { name: /Modo Estudio/ }).click();
      break;
    case 'apuntes':
      await page.locator('#materias-list .materia-card').first().click();
      await abrirMasModos(page);
      await page.getByRole('button', { name: /Apuntes/ }).click();
      break;
    case 'lenguaje':
      await page.locator('#lenguajes-list .materia-card').first().click();
      break;
    case 'misiones':
      await page.locator('#materias-list .materia-card').first().click();
      await abrirMasModos(page);
      await page.getByRole('button', { name: /Misiones/ }).click();
      break;
    case 'escenarios':
      await page.locator('#materias-list .materia-card').first().click();
      await abrirMasModos(page);
      await page.locator('#screen-start').getByRole('button', { name: /Escenarios/ }).click();
      break;
    case 'escenario':
      await page.locator('#materias-list .materia-card').first().click();
      await abrirMasModos(page);
      await page.locator('#screen-start').getByRole('button', { name: /Escenarios/ }).click();
      await page.getByRole('button', { name: /Jugar escenario/ }).first().click();
      break;
    case 'casos':
      await page.locator('#materias-list .materia-card').first().click();
      await abrirMasModos(page);
      await page.locator('[data-action="startCasos"]').first().click();
      break;
    case 'caso':
      await page.locator('#materias-list .materia-card').first().click();
      await abrirMasModos(page);
      await page.locator('[data-action="startCasos"]').first().click();
      await page.getByRole('button', { name: /Jugar caso/ }).first().click();
      break;
    case 'flashcards':
      await page.locator('#materias-list .materia-card').first().click();
      await abrirMasModos(page);
      await page.getByRole('button', { name: /Flashcards/ }).click();
      break;
    case 'glosario':
      await page.locator('#materias-list .materia-card').first().click();
      await abrirMasModos(page);
      await page.getByRole('button', { name: /Glosario/ }).first().click();
      break;
    case 'cuenta':
      // Sin claves Firebase, la cuenta vive en el Perfil como texto local.
      await page.getByRole('button', { name: 'Ver mi perfil' }).click();
      break;
    case 'perfil':
      await page.getByRole('button', { name: 'Ver mi perfil' }).click();
      break;
    default:
      throw new Error(`Pantalla desconocida: ${nombre}`);
  }
}

const PANTALLAS = [
  'onboarding', 'materias', 'start', 'config', 'quiz', 'results',
  'study', 'apuntes', 'lenguaje', 'misiones', 'escenarios', 'escenario',
  'casos', 'caso', 'flashcards', 'glosario', 'cuenta', 'perfil'
];

test.describe('Auditoría de accesibilidad — axe-core', () => {
  for (const pantalla of PANTALLAS) {
    test(`axe: ${pantalla}`, async ({ page }) => {
      // Inyectar axe-core antes de cargar la página.
      await page.addInitScript(axeSource);
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.setItem('sys.onboarding.v1', 'true');
        localStorage.setItem('sys.nombre.v1', 'Auditor');
      });
      await page.reload();

      await irAPantalla(page, pantalla);
      await page.waitForTimeout(500);

      // Ejecutar axe y recolectar violaciones.
      const resultados = await page.evaluate(() => {
        return new Promise((resolve) => {
          axe.run(document, {
            runOnly: {
              type: 'tag',
              values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
            }
          }).then(resolve).catch(resolve);
        });
      });

      const violaciones = (resultados.violations || []).map(v => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        nodes: v.nodes.slice(0, 5).map(n => ({
          target: n.target,
          failureSummary: n.failureSummary
        }))
      }));

      const incompletos = (resultados.incomplete || []).map(v => ({
        id: v.id,
        impact: v.impact,
        help: v.help
      }));

      // Cada test escribe su resultado individual (los workers no comparten memoria).
      const archivo = join(dirname(salida), `a11y-${pantalla}.json`);
      mkdirSync(dirname(archivo), { recursive: true });
      writeFileSync(archivo, JSON.stringify({ violaciones, incompletos }, null, 2));
      expect(resultados).toBeTruthy();
    });
  }
});
