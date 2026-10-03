import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    outDir: 'dist',
    // El contenido de datos va en chunks por track (spec 012); el chunk de la app
    // queda por debajo de este umbral. Vite avisa solo por consola, no falla.
    chunkSizeWarningLimit: 250,
    rollupOptions: {
      output: {
        // Separa el vendor (marked, dompurify) del código de la app: cambia menos
        // y se cachea aparte. El resto (app + datos por track) lo particiona Vite.
        manualChunks(id) {
          if (id.includes("node_modules")) return "vendor";
        }
      }
    }
  },
  test: {
    // Solo unitarios del core y de scripts; los E2E de Playwright viven en e2e/ (npm run e2e).
    include: ['src/**/*.test.{js,ts}', 'scripts/*.test.{js,ts}']
  }
});
