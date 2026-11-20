import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  // Un reintento en CI cubre flakes de layout; el test móvil además usa expect.poll.
  retries: process.env.CI ? 1 : 0,
  // En local corta al primer fallo y usa un punto por test; CI conserva todos los fallos.
  maxFailures: process.env.CI ? 0 : 1,
  reporter: 'dot',
  use: {
    baseURL: 'http://localhost:4173',
    // La mayoría de tests necesitan un visitante que ya pasó el onboarding; la spec
    // de onboarding sobreescribe con un contexto fresco (sin localStorage).
    storageState: 'e2e/.auth/visitante.json'
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    // Opt-in local: con PW_REUSE=1 se reutiliza un preview ya levantado y se evita el build.
    // No se activa por defecto para no testear un `dist` viejo si cambió el código.
    reuseExistingServer: !process.env.CI && process.env.PW_REUSE === '1',
    timeout: 120000
  },
  projects: [
    { name: 'chromium', testIgnore: /movil\.spec\.js/, use: { ...devices['Desktop Chrome'] } },
    // Móvil: viewport de teléfono con eventos táctiles reales.
    { name: 'movil', testMatch: /movil\.spec\.js/, use: { ...devices['Pixel 7'] } }
  ]
});
