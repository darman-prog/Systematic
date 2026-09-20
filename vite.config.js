import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    outDir: 'dist'
  },
  test: {
    // Solo unitarios del core y de scripts; los E2E de Playwright viven en e2e/ (npm run e2e).
    include: ['src/**/*.test.{js,ts}', 'scripts/*.test.{js,ts}']
  }
});
