// Validador de schema del contenido de las materias (preguntas, glosario y apuntes).
// Sin dependencias del DOM: puede importarse desde los tests.

export const TIPOS = ["multiple", "multi", "vf", "codigo", "dragdrop", "ordenar", "desarrollo", "relacionar", "diagrama"];
export const SUBTIPOS_DIAGRAMA = ["er", "uml-clases", "casos-uso", "actividades"];
export const DIFICULTADES = ["facil", "media", "dificil"];

const esArreglo = v => Array.isArray(v);
const textoNoVacio = v => typeof v === "string" && v.trim().length > 0;

export function validarPregunta(p, idsVistos) {
  if (!p || typeof p !== "object") return ["[?] la pregunta no es un objeto"];
  const errores = [];
  const err = msg => errores.push(`[${p.id || "sin-id"}] ${msg}`);

  if (!textoNoVacio(p.id)) err("id vacío");
  else if (!/^[A-Z0-9]+-\d{2,}$/.test(p.id)) err(`id con formato inesperado: "${p.id}" (se espera PREFIJO-NNN)`);
  else if (idsVistos) {
    if (idsVistos.has(p.id)) err("id duplicado");
    idsVistos.add(p.id);
  }

  if (!textoNoVacio(p.parcial)) err("falta parcial");
  if (!textoNoVacio(p.tema)) err("falta tema");
  if (!DIFICULTADES.includes(p.dificultad)) err(`dificultad inválida: ${p.dificultad}`);
  if (!TIPOS.includes(p.tipo)) err(`tipo inválido: ${p.tipo}`);
  if (!textoNoVacio(p.q)) err("falta enunciado (q)");
  if (!textoNoVacio(p.exp)) err("falta explicación (exp)");
  if (p.real !== undefined && typeof p.real !== "boolean") err("real debe ser booleano");
  if (p.caso !== undefined && !textoNoVacio(p.caso)) err("caso vacío");

  switch (p.tipo) {
    case "multiple":
    case "vf":
    case "codigo": {
      if (!esArreglo(p.options) || p.options.length < 2) err("options debe tener al menos 2 elementos");
      if (!Number.isInteger(p.correct) || !esArreglo(p.options) || p.correct < 0 || p.correct >= p.options.length) {
        err(`correct fuera de rango: ${p.correct}`);
      }
      if (esArreglo(p.options) && new Set(p.options.map(String)).size !== p.options.length) err("options con textos duplicados");
      break;
    }
    case "multi": {
      if (!esArreglo(p.options) || p.options.length < 2) err("options debe tener al menos 2 elementos");
      if (!esArreglo(p.correctos) || p.correctos.length === 0) {
        err("correctos debe tener al menos 1 índice");
      } else {
        const n = esArreglo(p.options) ? p.options.length : 0;
        const fuera = p.correctos.filter(i => !Number.isInteger(i) || i < 0 || i >= n);
        if (fuera.length) err(`correctos fuera de rango: ${fuera.join(", ")}`);
        if (new Set(p.correctos).size !== p.correctos.length) err("correctos con índices repetidos");
      }
      break;
    }
    case "dragdrop": {
      if (!esArreglo(p.piezas) || p.piezas.length === 0) err("piezas vacías");
      if (!esArreglo(p.respuestas) || p.respuestas.length === 0) err("respuestas vacías");
      if (esArreglo(p.piezas) && esArreglo(p.respuestas) && p.piezas.length < p.respuestas.length) {
        err("hay menos piezas que respuestas: no se pueden llenar todos los huecos");
      }
      if (textoNoVacio(p.codigo) && esArreglo(p.respuestas)) {
        const marcas = [...p.codigo.matchAll(/\{(\d)\}/g)].map(m => Number(m[1]));
        const esperadas = p.respuestas.map((_, i) => i + 1);
        const faltan = esperadas.filter(n => !marcas.includes(n));
        const sobran = marcas.filter(n => !esperadas.includes(n));
        const repetidas = [...new Set(marcas.filter((n, i) => marcas.indexOf(n) !== i))];
        if (faltan.length) err(`faltan marcadores {n} en codigo: ${faltan.join(", ")}`);
        if (sobran.length) err(`marcadores {n} sin hueco: ${sobran.join(", ")}`);
        if (repetidas.length) err(`marcadores {n} repetidos: ${repetidas.join(", ")}`);
      }
      break;
    }
    case "ordenar": {
      if (!esArreglo(p.bloques) || p.bloques.length < 2) err("bloques debe tener al menos 2 elementos");
      break;
    }
    case "relacionar": {
      if (!esArreglo(p.pares) || p.pares.length < 2) {
        err("pares debe tener al menos 2 elementos");
      } else {
        p.pares.forEach((par, i) => {
          if (!esArreglo(par) || par.length !== 2 || !textoNoVacio(par[0]) || !textoNoVacio(par[1])) {
            err(`par ${i + 1} inválido (se espera [izquierda, derecha])`);
          }
        });
      }
      break;
    }
    case "desarrollo": {
      if (!textoNoVacio(p.solucion)) err("falta solucion");
      if (p.claves !== undefined && !esArreglo(p.claves)) err("claves debe ser arreglo");
      break;
    }
    case "diagrama": {
      if (!SUBTIPOS_DIAGRAMA.includes(p.subtipo)) err(`subtipo de diagrama inválido: ${p.subtipo}`);
      if (!esArreglo(p.nodosPool) || p.nodosPool.length < 2) err("nodosPool debe tener al menos 2 nodos");
      else if (p.nodosPool.some(n => !textoNoVacio(n))) err("nodosPool con nodos vacíos");
      if (p.nodosFijos !== undefined) {
        if (!esArreglo(p.nodosFijos)) err("nodosFijos debe ser arreglo");
        else {
          const fuera = p.nodosFijos.filter(n => !p.nodosPool.includes(n));
          if (fuera.length) err(`nodosFijos fuera del pool: ${fuera.join(", ")}`);
        }
      }
      if (!esArreglo(p.relacionesEsperadas) || p.relacionesEsperadas.length === 0) {
        err("relacionesEsperadas debe tener al menos 1 relación");
      } else {
        const nodoValido = n => p.nodosPool.includes(n) || (esArreglo(p.nodosFijos) && p.nodosFijos.includes(n));
        p.relacionesEsperadas.forEach((r, i) => {
          if (!r || !textoNoVacio(r.de) || !textoNoVacio(r.a) || !textoNoVacio(r.tipo)) {
            err(`relación ${i + 1} necesita {de, a, tipo}`);
          } else if (!nodoValido(r.de) || !nodoValido(r.a)) {
            err(`relación ${i + 1} usa nodos fuera del pool/fijos`);
          }
          if (r && p.subtipo === "er" && r.de === r.a) err(`relación ${i + 1} con auto-conexión en ER`);
        });
      }
      if (p.tiposArista !== undefined) {
        if (!esArreglo(p.tiposArista) || p.tiposArista.length === 0) err("tiposArista debe tener al menos 1 tipo");
        else {
          const desconocidos = p.relacionesEsperadas && esArreglo(p.relacionesEsperadas)
            ? p.relacionesEsperadas.map(r => r && r.tipo).filter(t => textoNoVacio(t) && !p.tiposArista.includes(t))
            : [];
          if (desconocidos.length) err(`tipos de arista no declarados: ${[...new Set(desconocidos)].join(", ")}`);
        }
      }
      if (p.miembrosPool !== undefined) {
        if (!esArreglo(p.miembrosPool)) err("miembrosPool debe ser arreglo");
        else p.miembrosPool.forEach((m, i) => {
          if (!m || !textoNoVacio(m.texto) || !textoNoVacio(m.de)) {
            err(`miembro ${i + 1} necesita {texto, de}`);
          } else if (!nodoValido(m.de)) {
            err(`miembro "${m.texto}" asignado a un nodo fuera del pool/fijos`);
          }
        });
      }
      break;
    }
  }
  return errores;
}

export function validarCasos(casos, { validarDiagramaRef } = {}) {
  if (casos === undefined) return [];
  if (!esArreglo(casos)) return ["[casos] debe ser arreglo"];
  const errores = [];
  const ids = new Set();
  casos.forEach(c => {
    const ref = "[casos] caso \"" + (c && c.id || "?") + "\"";
    if (!c || !textoNoVacio(c.id)) errores.push("[casos] caso sin id");
    else if (ids.has(c.id)) errores.push(ref + " duplicado");
    else ids.add(c.id);
    if (!c || !textoNoVacio(c.titulo)) errores.push(ref + " sin título");
    if (!c || !textoNoVacio(c.tema)) errores.push(ref + " sin tema");
    if (!c || !textoNoVacio(c.caso)) errores.push(ref + " sin narrativa del caso");
    if (!c || !c.finales || !textoNoVacio(c.finales.exito) || !textoNoVacio(c.finales.parcial) || !textoNoVacio(c.finales.fracaso)) {
      errores.push(ref + " con finales incompletos (exito/parcial/fracaso)");
    }
    if (!c || typeof c.diagrama !== "object" || c.diagrama === null) {
      errores.push(ref + " sin diagrama");
    } else if (typeof validarDiagramaRef === "function") {
      validarDiagramaRef(ref, c.diagrama).forEach(e => errores.push(e));
    } else {
      const d = Object.assign({ tipo: "diagrama" }, c.diagrama);
      validarDiagramaCampos(ref, d).forEach(e => errores.push(e));
    }
  });
  return errores;
}

function validarDiagramaCampos(ref, d) {
  const errores = [];
  const err = msg => errores.push(ref + " " + msg);
  if (!SUBTIPOS_DIAGRAMA.includes(d.subtipo)) err(`subtipo de diagrama inválido: ${d.subtipo}`);
  if (!esArreglo(d.nodosPool) || d.nodosPool.length < 2) err("nodosPool debe tener al menos 2 nodos");
  else if (d.nodosPool.some(n => !textoNoVacio(n))) err("nodosPool con nodos vacíos");
  if (!esArreglo(d.relacionesEsperadas) || d.relacionesEsperadas.length === 0) {
    err("relacionesEsperadas debe tener al menos 1 relación");
  } else {
    const nodoValido = n => (esArreglo(d.nodosPool) && d.nodosPool.includes(n)) || (esArreglo(d.nodosFijos) && d.nodosFijos.includes(n));
    d.relacionesEsperadas.forEach((r, i) => {
      if (!r || !textoNoVacio(r.de) || !textoNoVacio(r.a) || !textoNoVacio(r.tipo)) {
        err(`relación ${i + 1} necesita {de, a, tipo}`);
      } else if (!nodoValido(r.de) || !nodoValido(r.a)) {
        err(`relación ${i + 1} usa nodos fuera del pool/fijos`);
      }
      if (r && d.subtipo === "er" && r.de === r.a) err(`relación ${i + 1} con auto-conexión en ER`);
    });
  }
  return errores;
}

export function validarGlosario(g) {
  const errores = [];
  if (!g || typeof g !== "object") return ["[glosario] no es un objeto"];
  if (!esArreglo(g.categorias)) errores.push("[glosario] categorias debe ser arreglo");
  if (!esArreglo(g.terminos)) errores.push("[glosario] terminos debe ser arreglo");
  if (!esArreglo(g.tips)) errores.push("[glosario] tips debe ser arreglo");
  if (!esArreglo(g.categorias) || !esArreglo(g.terminos)) return errores;

  const idsCat = new Set();
  g.categorias.forEach(c => {
    if (!c || !textoNoVacio(c.id)) errores.push("[glosario] categoría sin id");
    else if (idsCat.has(c.id)) errores.push(`[glosario] categoría duplicada: ${c.id}`);
    else idsCat.add(c.id);
    if (!c || !textoNoVacio(c.nombre)) errores.push(`[glosario] categoría sin nombre: ${c && c.id}`);
  });

  g.terminos.forEach(t => {
    const ref = `[glosario] término "${(t && t.termino) || "?"}"`;
    if (!t || !textoNoVacio(t.termino)) errores.push("[glosario] término sin nombre");
    if (!t || !textoNoVacio(t.definicion)) errores.push(`${ref} sin definición`);
    if (idsCat.size && (!t || !idsCat.has(t.categoria))) errores.push(`${ref} con categoría inexistente: ${t && t.categoria}`);
  });
  return errores;
}

export function validarApuntes(apuntes, { existeFuente } = {}) {
  if (apuntes === undefined) return [];
  if (!esArreglo(apuntes)) return ["[apuntes] debe ser arreglo"];
  const errores = [];
  const ids = new Set();
  apuntes.forEach(a => {
    const ref = `[apuntes] apunte "${(a && a.id) || "?"}"`;
    if (!a || !textoNoVacio(a.id)) errores.push("[apuntes] apunte sin id");
    else if (ids.has(a.id)) errores.push(`${ref} duplicado`);
    else ids.add(a.id);
    if (!a || !textoNoVacio(a.tema)) errores.push(`${ref} sin tema`);
    if (!a || !textoNoVacio(a.titulo)) errores.push(`${ref} sin título`);
    if (!a || !textoNoVacio(a.contenido)) errores.push(`${ref} sin contenido`);
    if (!a || !textoNoVacio(a.fuente)) errores.push(`${ref} sin fuente`);
    else if (existeFuente && !existeFuente(a.fuente)) errores.push(`${ref} con fuente inexistente: ${a.fuente}`);
  });
  return errores;
}

export function validarEscenarios(escenarios) {
  if (escenarios === undefined) return [];
  if (!esArreglo(escenarios)) return ["[escenarios] debe ser arreglo"];
  const errores = [];
  const ids = new Set();
  escenarios.forEach(e => {
    const ref = "[escenarios] escenario \"" + (e && e.id || "?") + "\"";
    if (!e || !textoNoVacio(e.id)) errores.push("[escenarios] escenario sin id");
    else if (ids.has(e.id)) errores.push(ref + " duplicado");
    else ids.add(e.id);
    if (!e || !textoNoVacio(e.titulo)) errores.push(ref + " sin título");
    if (!e || !textoNoVacio(e.tema)) errores.push(ref + " sin tema");
    if (!e || !textoNoVacio(e.intro)) errores.push(ref + " sin intro");
    if (!e || !esArreglo(e.pasos) || e.pasos.length < 2) {
      errores.push(ref + " debe tener al menos 2 pasos");
    } else {
      const idsPasos = new Set(e.pasos.map(p => p.id));
      e.pasos.forEach(p => {
        if (!p || !textoNoVacio(p.id)) errores.push(ref + " con paso sin id");
        if (!p || !textoNoVacio(p.narrativa)) errores.push(ref + " paso \"" + (p && p.id || "?") + "\" sin narrativa");
        if (!p || !esArreglo(p.opciones) || p.opciones.length < 2) {
          errores.push(ref + " paso \"" + (p && p.id || "?") + "\" necesita al menos 2 opciones");
        } else {
          p.opciones.forEach((o, i) => {
            const refO = ref + " opción " + i + " del paso \"" + (p && p.id || "?") + "\"";
            if (!o || !textoNoVacio(o.texto)) errores.push(refO + " sin texto");
            if (!o || !textoNoVacio(o.feedback)) errores.push(refO + " sin feedback");
            if (!o || !textoNoVacio(o.siguiente)) errores.push(refO + " sin siguiente");
            else if (o.siguiente !== "fin" && !idsPasos.has(o.siguiente)) errores.push(refO + " apunta a un paso inexistente: " + o.siguiente);
            if (!o || !Number.isInteger(o.puntos) || o.puntos < 0 || o.puntos > 2) errores.push(refO + " con puntos inválidos");
          });
        }
      });
    }
    if (!e || !e.finales || !textoNoVacio(e.finales.exito) || !textoNoVacio(e.finales.parcial) || !textoNoVacio(e.finales.fracaso)) {
      errores.push(ref + " con finales incompletos (exito/parcial/fracaso)");
    }
  });
  return errores;
}

export function validarMateria(m, { existeFuente, idsVistos } = {}) {
  if (!m || !textoNoVacio(m.id)) return ["[materia] sin id"];
  const errores = [];
  if (!textoNoVacio(m.nombre)) errores.push(`[${m.id}] sin nombre`);
  (m.preguntas || []).forEach(p => errores.push(...validarPregunta(p, idsVistos)));
  errores.push(...validarGlosario(m.glosario).map(e => `[${m.id}] ${e}`));
  errores.push(...validarApuntes(m.apuntes, { existeFuente }).map(e => `[${m.id}] ${e}`));
  errores.push(...validarEscenarios(m.escenarios).map(e => `[${m.id}] ${e}`));
  errores.push(...validarCasos(m.casos).map(e => `[${m.id}] ${e}`));
  return errores;
}

export function validarTodo(materias, { existeFuente } = {}) {
  const errores = [];
  const idsVistos = new Set();
  const resumen = { materias: 0, preguntas: 0, terminos: 0 };
  (materias || []).forEach(m => {
    errores.push(...validarMateria(m, { existeFuente, idsVistos }));
    resumen.materias += 1;
    resumen.preguntas += (m.preguntas || []).length;
    resumen.terminos += m.glosario && esArreglo(m.glosario.terminos) ? m.glosario.terminos.length : 0;
  });
  return { errores, resumen };
}
