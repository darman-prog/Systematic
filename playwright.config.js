import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:4173'
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: false,
    timeout: 60000
  },
  projects: [
    { name: 'chromium', testIgnore: /movil\.spec\.js/, use: { ...devices['Desktop Chrome'] } },
    // Móvil: viewport de teléfono con eventos táctiles reales.
    { name: 'movil', testMatch: /movil\.spec\.js/, use: { ...devices['Pixel 7'] } }
  ]
});
