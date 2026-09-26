// Revisión humana del contenido: imprime las preguntas en texto legible para que
// puedas revisarlas sin leer JavaScript, y avisa de problemas de calidad que el
// validador de schema no ve (temas con pocas preguntas, enunciados repetidos,
// opciones duplicadas, explicaciones muy cortas).
//
// No modifica nada. Sale con código 1 si encuentra errores de schema o avisos.
//
//   node scripts/revision-contenido.mjs            → resumen de todas las materias
//   node scripts/revision-contenido.mjs infra      → detalle de una materia
import { MATERIAS } from "../src/core/materias.js";
import { validarTodo } from "./validador.mjs";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const MIN_POR_TEMA = 3;
const MIN_EXP = 60;

const esArreglo = v => Array.isArray(v);
const normalizar = t => String(t == null ? "" : t).toLowerCase().replace(/\s+/g, " ").trim();
const sinHtml = t => String(t == null ? "" : t).replace(/<[^>]*>/g, "");

// Lista de índices correctos según el tipo de pregunta.
export function indicesCorrectos(p) {
  if (p.tipo === "multi") return esArreglo(p.correctos) ? p.correctos : [];
  if (esArreglo(p.options) && Number.isInteger(p.correct)) return [p.correct];
  return [];
}

// Análisis de calidad de una materia. Devuelve avisos con { nivel, id, msg }.
export function analizarMateria(materia) {
  const avisos = [];
  const preguntas = esArreglo(materia.preguntas) ? materia.preguntas : [];
  const add = (nivel, id, msg) => avisos.push({ nivel, id, msg });

  const porTema = new Map();
  for (const p of preguntas) {
    const tema = (p && p.tema) || "(sin tema)";
    if (!porTema.has(tema)) porTema.set(tema, []);
    porTema.get(tema).push(p);
  }

  for (const [tema, lista] of porTema) {
    if (lista.length < MIN_POR_TEMA) {
      add("aviso", lista.map(p => p.id).join(", "), `el tema "${tema}" tiene ${lista.length} pregunta(s) y se esperan al menos ${MIN_POR_TEMA}`);
    }
    // Enunciados repetidos dentro del mismo tema (no aporta, se siente repetido).
    const porEnunciado = new Map();
    for (const p of lista) {
      const clave = normalizar(p.q);
      if (!porEnunciado.has(clave)) porEnunciado.set(clave, []);
      porEnunciado.get(clave).push(p.id);
    }
    for (const [clave, ids] of porEnunciado) {
      if (ids.length > 1) add("aviso", ids.join(", "), `enunciado repetido en "${tema}": "${sinHtml(clave).slice(0, 70)}"`);
    }
    // Respuesta correcta idéntica en varias preguntas del mismo tema.
    const porCorrecta = new Map();
    for (const p of lista) {
      for (const i of indicesCorrectos(p)) {
        const texto = normalizar(p.options[i]);
        if (!texto) continue;
        if (!porCorrecta.has(texto)) porCorrecta.set(texto, []);
        porCorrecta.get(texto).push(p.id);
      }
    }
    for (const [texto, ids] of porCorrecta) {
      if (ids.length >= 3) add("aviso", ids.join(", "), `en "${tema}", ${ids.length} preguntas comparten la misma respuesta correcta ("${texto.slice(0, 50)}")`);
    }
  }

  for (const p of preguntas) {
    if (esArreglo(p.options)) {
      const textos = p.options.map(normalizar);
      if (new Set(textos).size !== textos.length) add("error", p.id, "tiene opciones con texto duplicado");
    }
    if (sinHtml(p.exp).trim().length < MIN_EXP) {
      add("aviso", p.id, `explicación muy corta (${sinHtml(p.exp).trim().length} caracteres); se esperan al menos ${MIN_EXP}`);
    }
  }

  return { avisos, porTema };
}

// Impresión legible de una pregunta.
export function formatearPregunta(p, i) {
  const lineas = [];
  const cab = `[${i}] ${p.id} · ${p.parcial} · ${p.tema} · ${p.dificultad} · ${p.tipo}`;
  lineas.push(cab, `- ${sinHtml(p.q)}`);

  const correctos = new Set(indicesCorrectos(p));
  if (esArreglo(p.options)) {
    p.options.forEach((o, j) => lineas.push(`    ${correctos.has(j) ? "*" : " "} ${String(o).replace(/\n/g, " ")}`));
  }
  if (esArreglo(p.piezas)) lineas.push(`    piezas: ${p.piezas.join(" | ")}`);
  if (esArreglo(p.respuestas)) lineas.push(`    respuestas: ${p.respuestas.join(" | ")}`);
  if (p.codigo) lineas.push(`    código: ${String(p.codigo).replace(/\n/g, " ⏎ ")}`);
  if (esArreglo(p.bloques)) lineas.push(`    bloques: ${p.bloques.join(" → ")}`);
  if (esArreglo(p.pares)) p.pares.forEach(par => lineas.push(`    par: ${par[0]}  ↔  ${par[1]}`));
  if (p.solucion) lineas.push(`    solución: ${sinHtml(p.solucion).replace(/\n/g, " ")}`);
  if (esArreglo(p.claves)) lineas.push(`    claves: ${p.claves.join(", ")}`);
  if (p.subtipo) lineas.push(`    subtipo: ${p.subtipo}`);
  if (esArreglo(p.nodosPool)) lineas.push(`    nodos: ${p.nodosPool.join(", ")}`);
  if (esArreglo(p.relacionesEsperadas)) {
    p.relacionesEsperadas.forEach(r => lineas.push(`    relación: ${r.de} → ${r.a} [${r.tipo}]${r.guarda ? ` (${r.guarda})` : ""}`));
  }
  lineas.push(`    exp: ${sinHtml(p.exp)}`, "");
  return lineas.join("\n");
}

function imprimirResumen(materias) {
  console.log("Resumen por materia");
  for (const m of materias) {
    const analisis = analizarMateria(m);
    const temas = analisis.porTema.size;
    const avisos = analisis.avisos.length;
    const terms = m.glosario && esArreglo(m.glosario.terminos) ? m.glosario.terminos.length : 0;
    console.log(
      `  ${m.id.padEnd(6)} ${String(m.preguntas.length).padStart(4)} preguntas · ${String(temas).padStart(2)} temas · ` +
      `${String(terms).padStart(3)} términos · ${avisos ? avisos + " aviso(s)" : "sin avisos"}`
    );
  }
}

function imprimirMateria(m) {
  console.log(`\n=== ${m.id.toUpperCase()} · ${m.nombre} · ${m.preguntas.length} preguntas ===\n`);
  for (const [tema, lista] of analizarMateria(m).porTema) {
    console.log(`\n--- ${tema} (${lista.length}) ---`);
    lista.forEach((p, i) => console.log(formatearPregunta(p, i + 1)));
  }
  const analisis = analizarMateria(m);
  if (analisis.avisos.length) {
    console.log(`\nAvisos (${analisis.avisos.length}):`);
    analisis.avisos.forEach(a => console.log(`  [${a.nivel}] ${a.id}: ${a.msg}`));
  } else {
    console.log("\nSin avisos de calidad.");
  }
}

function main() {
  const baseDir = process.cwd();
  const { errores, resumen } = validarTodo(MATERIAS, {
    existeFuente: f => fs.existsSync(path.resolve(baseDir, f))
  });
  if (errores.length) {
    console.error(`✖ ${errores.length} error(es) de schema:`);
    errores.forEach(e => console.error("  " + e));
  }

  const solo = process.argv[2];
  if (solo) {
    const m = MATERIAS.find(x => x.id === solo);
    if (!m) {
      console.error(`✖ no existe la materia "${solo}". Disponibles: ${MATERIAS.map(x => x.id).join(", ")}`);
      process.exit(1);
    }
    imprimirMateria(m);
  } else {
    imprimirResumen(MATERIAS);
    console.log(`\nTotal: ${resumen.materias} materias · ${resumen.preguntas} preguntas · ${resumen.terminos} términos.`);
    console.log("Detalle de una materia: node scripts/revision-contenido.mjs <id>");
  }

  const avisos = MATERIAS.flatMap(m => analizarMateria(m).avisos);
  if (avisos.length) {
    console.log(`\n${avisos.length} aviso(s) de calidad en total.`);
  }
  process.exit(errores.length ? 1 : 0);
}

const invocado = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invocado) main();

export { imprimirResumen, imprimirMateria, MIN_POR_TEMA, MIN_EXP };
