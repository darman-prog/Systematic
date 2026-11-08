import js from "@eslint/js";
import globals from "globals";

// Reglas de errores reales, sin estilo: el objetivo es que CI detecte imports muertos,
// variables sin usar y globals inexistentes sin generar ruido de formato.
export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "docs/**",
      "BancoDeInformacion/**",
      "e2e/.auth/**"
    ]
  },
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser
    }
  },
  // Límites de capas (ADR 011/014): el dominio no conoce UI, servicios ni contenido;
  // student no conoce UI/orquestación; ui no conoce servicios/estado global; datos no
  // importa código. Los tests quedan fuera para poder usar fixtures de otras capas.
  {
    files: ["src/core/**/*.js"],
    ignores: ["src/core/**/*.test.js"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          group: ["**/ui/**", "**/student/**", "**/orquestacion/**", "**/datos/**"],
          message: "core es dominio puro: no importa ui, student, orquestacion ni datos (ADR 011)."
        }]
      }],
      "no-restricted-syntax": ["error", {
        selector: "ImportExpression",
        message: "core es dominio puro: no usa imports dinámicos."
      }]
    }
  },
  {
    files: ["src/student/**/*.js"],
    ignores: ["src/student/**/*.test.js", "src/student/contenido.js"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          group: ["**/ui/**", "**/orquestacion/**", "**/datos/**"],
          message: "student no importa ui, orquestacion ni datos; el contenido solo entra por contenido.js."
        }]
      }],
      "no-restricted-syntax": ["error", {
        selector: "ImportExpression[source.value=/ui|orquestacion|datos/]",
        message: "student no importa dinámicamente ui, orquestacion ni datos; el contenido solo entra por contenido.js."
      }]
    }
  },
  {
    // Único módulo de student que conoce las rutas de src/datos/ (ADR 011).
    files: ["src/student/contenido.js"],
    rules: { "no-restricted-imports": "off", "no-restricted-syntax": "off" }
  },
  {
    files: ["src/ui/**/*.js"],
    ignores: ["src/ui/**/*.test.js"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          group: ["**/student/**", "**/orquestacion/**", "**/datos/**"],
          message: "ui recibe estado por parámetro: no importa student, orquestacion ni datos."
        }]
      }],
      "no-restricted-syntax": ["error", {
        selector: "ImportExpression",
        message: "ui recibe estado por parámetro: no usa imports dinámicos."
      }]
    }
  },
  {
    files: ["src/datos/**/*.js"],
    ignores: ["src/datos/**/*.test.js"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          group: ["**/core/**", "**/student/**", "**/ui/**", "**/orquestacion/**"],
          message: "datos solo contiene contenido: no importa código de la app."
        }]
      }],
      "no-restricted-syntax": ["error", {
        selector: "ImportExpression",
        message: "datos solo contiene contenido: no usa imports dinámicos."
      }]
    }
  },
  {
    files: ["scripts/**/*.{js,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node
    }
  },
  {
    // Los callbacks de page.evaluate corren en el navegador; el archivo, en Node.
    files: ["e2e/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node, ...globals.browser }
    }
  },
  {
    files: ["*.config.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node
    }
  },
  {
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-console": "off"
    }
  }
];
