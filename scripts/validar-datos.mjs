// CLI: valida el schema de datos de todos los tracks. Uso: npm run validar
// Carga el contenido bajo demanda (spec 012) y verifica que el conteo declarado en
// metadata coincida con el contenido real: si diverge, el build se bloquea.
import fs from "node:fs";
import path from "node:path";
import { MATERIAS, LENGUAJES, cargarContenido } from "../src/core/index.js";
import { validarTodo, validarRoadmap } from "./validador.mjs";

const baseDir = process.cwd();
const CLAVES_CONTEO = ["preguntas", "terminos", "apuntes", "escenarios", "casos", "etapas"];

async function cargarTrack(track) {
  const contenido = await cargarContenido(track);
  const real = {
    preguntas: contenido.preguntas.length,
    terminos: contenido.glosario?.terminos?.length ?? 0,
    apuntes: contenido.apuntes.length,
    escenarios: contenido.escenarios.length,
    casos: contenido.casos.length,
    etapas: contenido.roadmap?.etapas?.length ?? 0,
  };
  const declarado = track.conteo || {};
  for (const k of CLAVES_CONTEO) {
    if (declarado[k] !== undefined && declarado[k] !== real[k]) {
      console.error(`✖ [${track.id}] conteo de ${k}: declara ${declarado[k]}, tiene ${real[k]}.`);
      process.exit(1);
    }
  }
  return { ...track, ...contenido };
}

const materias = [];
for (const m of MATERIAS) materias.push(await cargarTrack(m));
const lenguajes = [];
for (const l of LENGUAJES) lenguajes.push(await cargarTrack(l));

// idsVistos compartido: los ids de pregunta deben ser únicos en todos los tracks.
const { errores, resumen } = validarTodo([...materias, ...lenguajes], {
  existeFuente: f => fs.existsSync(path.resolve(baseDir, f))
});

// El roadmap de cada lenguaje debe referenciar preguntas que existan en su banco y
// declarar el mismo id que el track.
for (const l of lenguajes) {
  if (!l.roadmap) {
    errores.push(`[${l.id}] el track de lenguaje no declara roadmap`);
    continue;
  }
  if (l.roadmap.lenguaje !== l.id) {
    errores.push(`[${l.id}] el roadmap declara lenguaje "${l.roadmap.lenguaje}"`);
  }
  const idsBanco = new Set(l.preguntas.map(p => p.id));
  errores.push(...validarRoadmap(l.roadmap, { idsBanco }).map(e => `[${l.id}] ${e}`));
}

if (errores.length) {
  errores.forEach(e => console.error("✖ " + e));
  console.error(`\n${errores.length} error(es) de validación de datos.`);
  process.exit(1);
}

const nLenguajes = lenguajes.length;
const nMaterias = resumen.materias - nLenguajes;
console.log(
  `✔ Datos válidos: ${nMaterias} materias` +
  (nLenguajes ? ` · ${nLenguajes} lenguaje(s)` : "") +
  ` · ${resumen.preguntas} preguntas · ${resumen.terminos} términos de glosario.`
);
