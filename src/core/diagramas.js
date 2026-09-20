// Lógica pura del constructor de diagramas (spec 003, H6a ER + H6b subtipos).
// El lienzo vive en src/ui/diagramas.js; aquí solo hay estado, validación y puntuación
// serializables, sin DOM. Las conexiones son dirigidas {de → a, tipo} salvo ER, que compara
// el par sin orden.

export const SUBTIPOS = ["er", "uml-clases", "casos-uso", "actividades"];

export const CONFIG_SUBTIPO = {
  "er": { dirigido: false, tiposArista: ["1:1", "1:N", "N:M"] },
  "uml-clases": { dirigido: true, tiposArista: ["herencia", "asociación", "composición", "agregación"] },
  "casos-uso": { dirigido: true, tiposArista: ["asociación", "include", "extend"] },
  "actividades": { dirigido: true, tiposArista: ["transición"] }
};

// Normaliza un tipo o guarda para comparar sin depender de acentos ni mayúsculas: el
// contenido puede escribir "composicion"/"transicion" y la UI ofrecer "composición"/"transición".
export function normalizarClave(texto) {
  return String(texto == null ? "" : texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Clave canónica de una conexión (guarda/no-guarda viajan dentro de `tipo`).
export function claveArista(de, a, tipo, dirigido) {
  const extremos = dirigido ? [de, a] : [de, a].slice().sort();
  return extremos.join("|") + "|" + normalizarClave(tipo);
}

function claveDe(rel, dirigido) {
  let clave = claveArista(rel.de, rel.a, rel.tipo, dirigido);
  if (rel.guarda) clave += "|" + normalizarClave(rel.guarda);
  return clave;
}

// Estado inicial serializable: nodos y miembros ya colocados, conexiones vacías.
export function crearTablero(pregunta) {
  const nodos = Array.isArray(pregunta.nodosFijos) ? pregunta.nodosFijos.slice() : [];
  const estado = {
    preguntaId: pregunta.id,
    nodosColocados: nodos.slice(),
    nodosDisponibles: Array.isArray(pregunta.nodosPool) ? pregunta.nodosPool.slice() : [],
    miembros: {},
    conexiones: []
  };
  if (Array.isArray(pregunta.miembrosPool)) {
    pregunta.miembrosPool.forEach(m => { estado.miembros[m.texto] = null; });
  }
  return estado;
}

export function colocarNodo(estado, nombre) {
  if (!nombre || estado.nodosColocados.indexOf(nombre) !== -1) return estado;
  if (estado.nodosDisponibles.indexOf(nombre) === -1) return estado;
  return Object.assign({}, estado, {
    nodosColocados: estado.nodosColocados.concat([nombre]),
    nodosDisponibles: estado.nodosDisponibles.filter(n => n !== nombre)
  });
}

export function quitarNodo(estado, fijos, nombre) {
  if (Array.isArray(fijos) && fijos.indexOf(nombre) !== -1) return estado;
  return Object.assign({}, estado, {
    nodosColocados: estado.nodosColocados.filter(n => n !== nombre),
    nodosDisponibles: estado.nodosDisponibles.concat([nombre]),
    miembros: quitarMiembrosDelNodo(estado.miembros, nombre),
    conexiones: estado.conexiones.filter(c => c.de !== nombre && c.a !== nombre)
  });
}

function quitarMiembrosDelNodo(miembros, nombre) {
  const limpio = {};
  Object.keys(miembros).forEach(texto => {
    limpio[texto] = miembros[texto] === nombre ? null : miembros[texto];
  });
  return limpio;
}

export function asignarMiembro(estado, texto, nodo) {
  if (!(texto in estado.miembros)) return estado;
  if (nodo && estado.nodosColocados.indexOf(nodo) === -1) return estado;
  const miembros = Object.assign({}, estado.miembros);
  miembros[texto] = nodo || null;
  return Object.assign({}, estado, { miembros });
}

export function conectar(estado, de, a, tipo, dirigido, guarda) {
  if (!de || !a || !tipo) return estado;
  if (!dirigido && de === a) return estado;
  const nueva = { de, a, tipo };
  if (guarda) nueva.guarda = guarda;
  const clave = claveDe(nueva, dirigido);
  const repetida = estado.conexiones.some(c => claveDe(c, dirigido) === clave);
  if (repetida) return estado;
  return Object.assign({}, estado, { conexiones: estado.conexiones.concat([nueva]) });
}

export function quitarConexion(estado, de, a, tipo, dirigido) {
  const clave = claveArista(de, a, tipo, dirigido);
  return Object.assign({}, estado, {
    conexiones: estado.conexiones.filter(c => claveArista(c.de, c.a, c.tipo, dirigido) !== clave)
  });
}

// Devuelve las relaciones esperadas por defecto cuando faltan en la pregunta.
function relacionesDe(pregunta) {
  return Array.isArray(pregunta.relacionesEsperadas) ? pregunta.relacionesEsperadas : [];
}

// Puntuación: conexiones correctas + miembros bien asignados - sobrantes.
// Devuelve conteos y `detalle` con texto legible (nombres) para el feedback.
export function evaluarDiagrama(pregunta, estado) {
  const dirigido = esDirigido(pregunta.subtipo);
  const esperadas = new Map();
  relacionesDe(pregunta).forEach(r => {
    if (r && r.de && r.a && r.tipo) esperadas.set(claveDe(r, dirigido), r);
  });
  const actuales = new Map();
  (estado.conexiones || []).forEach(c => actuales.set(claveDe(c, dirigido), c));

  const faltantesRel = [...esperadas].filter(([k]) => !actuales.has(k)).map(([, r]) => r);
  const sobrantesRel = [...actuales].filter(([k]) => !esperadas.has(k)).map(([, c]) => c);
  const correctas = [...actuales.keys()].filter(k => esperadas.has(k)).length;

  let miembrosOk = 0;
  const miembrosOkDetalle = [];
  const miembrosMalDetalle = [];
  if (Array.isArray(pregunta.miembrosPool)) {
    pregunta.miembrosPool.forEach(m => {
      if (estado.miembros[m.texto] === m.de) {
        miembrosOk++;
        miembrosOkDetalle.push(m);
      } else {
        miembrosMalDetalle.push(m);
      }
    });
  }
  const miembrosMal = miembrosMalDetalle.length;
  const totalEsperado = esperadas.size + (Array.isArray(pregunta.miembrosPool) ? pregunta.miembrosPool.length : 0);
  const flecha = dirigido ? " → " : " – ";
  const fmtRel = r => r.de + flecha + r.a + " (" + r.tipo + (r.guarda ? " " + r.guarda : "") + ")";
  return {
    correctas,
    sobrantes: sobrantesRel.length + miembrosMal,
    faltantes: faltantesRel.length,
    miembrosOk,
    miembrosMal,
    totalEsperado,
    ok: sobrantesRel.length === 0 && faltantesRel.length === 0 && miembrosMal === 0 && totalEsperado > 0,
    detalle: {
      faltantes: faltantesRel.map(fmtRel),
      sobrantes: sobrantesRel.map(fmtRel),
      miembrosMal: miembrosMalDetalle.map(m => m.texto + " → " + m.de),
      miembrosOk: miembrosOkDetalle.map(m => m.texto + " → " + m.de)
    }
  };
}

// Líneas legibles de feedback para un resultado de evaluarDiagrama (sin DOM).
export function resumenDiagrama(res) {
  const d = res && res.detalle;
  if (!d) return [];
  const lineas = [];
  if (d.faltantes.length) lineas.push("Faltan: " + d.faltantes.join(" · "));
  if (d.sobrantes.length) lineas.push("Sobran: " + d.sobrantes.join(" · "));
  if (d.miembrosMal.length) lineas.push("Miembros por ubicar: " + d.miembrosMal.join(" · "));
  return lineas;
}

export function esDirigido(subtipo) {
  return (CONFIG_SUBTIPO[subtipo] || CONFIG_SUBTIPO.er).dirigido;
}

// Rating del modo de casos (H6c): % sobre el máximo posible.
export function ratingDiagrama(correctas, esperadas) {
  const pct = esperadas > 0 ? Math.round((correctas / esperadas) * 100) : 0;
  return pct >= 80 ? "exito" : pct >= 50 ? "parcial" : "fracaso";
}
