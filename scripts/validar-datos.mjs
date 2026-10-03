// CLI: valida el schema de datos de todas las tracks. Uso: npm run validar
// Carga el contenido bajo demanda (spec 012) y verifica que el conteo declarado
// en metadata coincida con el contenido real: si diverge, el build se bloquea.
import fs from "node:fs";
import path from "node:path";
import { MATERIAS, cargarContenido } from "../src/core/materias.js";
import { validarTodo } from "./validador.mjs";

const baseDir = process.cwd();

const cargadas = [];
for (const m of MATERIAS) {
  const contenido = await cargarContenido(m);
  const real = {
    preguntas: contenido.preguntas.length,
    terminos: contenido.glosario?.terminos?.length ?? 0,
    apuntes: contenido.apuntes.length,
    escenarios: contenido.escenarios.length,
    casos: contenido.casos.length,
  };
  const declarado = m.conteo || {};
  for (const k of ["preguntas", "terminos", "apuntes", "escenarios", "casos"]) {
    if (declarado[k] !== undefined && declarado[k] !== real[k]) {
      console.error(`✖ [${m.id}] conteo de ${k}: declara ${declarado[k]}, tiene ${real[k]}.`);
      process.exit(1);
    }
  }
  cargadas.push({ ...m, ...contenido });
}

const { errores, resumen } = validarTodo(cargadas, {
  existeFuente: f => fs.existsSync(path.resolve(baseDir, f))
});

if (errores.length) {
  errores.forEach(e => console.error("✖ " + e));
  console.error(`\n${errores.length} error(es) de validación de datos.`);
  process.exit(1);
}

console.log(`✔ Datos válidos: ${resumen.materias} materias · ${resumen.preguntas} preguntas · ${resumen.terminos} términos de glosario.`);
