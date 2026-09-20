// CLI: valida el schema de datos de todas las materias. Uso: npm run validar
import fs from "node:fs";
import path from "node:path";
import { MATERIAS } from "../src/core/materias.js";
import { validarTodo } from "./validador.mjs";

const baseDir = process.cwd();
const { errores, resumen } = validarTodo(MATERIAS, {
  existeFuente: f => fs.existsSync(path.resolve(baseDir, f))
});

if (errores.length) {
  errores.forEach(e => console.error("✖ " + e));
  console.error(`\n${errores.length} error(es) de validación de datos.`);
  process.exit(1);
}

console.log(`✔ Datos válidos: ${resumen.materias} materias · ${resumen.preguntas} preguntas · ${resumen.terminos} términos de glosario.`);
