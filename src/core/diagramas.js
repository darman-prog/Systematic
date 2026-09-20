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

// Clave canónica de una conexión (guarda/no-guarda viajan dentro de `tipo`).
export function claveArista(de, a, tipo, dirigido) {
  const extremos = dirigido ? [de, a] : [de, a].slice().sort();
  return extremos.join("|") + "|" + tipo;
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

export function conectar(estado, de, a, tipo, dirigido) {
  if (!de || !a || !tipo) return estado;
  if (!dirigido && de === a) return estado;
  const nueva = { de, a, tipo };
  const clave = claveArista(de, a, tipo, dirigido);
  const repetida = estado.conexiones.some(c => claveArista(c.de, c.a, c.tipo, dirigido) === clave);
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
export function evaluarDiagrama(pregunta, estado) {
  const dirigido = esDirigido(pregunta.subtipo);
  const esperadas = new Set(relacionesDe(pregunta).map(r => claveArista(r.de, r.a, r.tipo, dirigido)));
  const actuales = new Set(estado.conexiones.map(c => claveArista(c.de, c.a, c.tipo, dirigido)));
  const correctas = [...actuales].filter(k => esperadas.has(k));
  const sobrantes = [...actuales].filter(k => !esperadas.has(k));
  const faltantes = [...esperadas].filter(k => !actuales.has(k));
  let miembrosOk = 0;
  let miembrosMal = 0;
  if (Array.isArray(pregunta.miembrosPool)) {
    pregunta.miembrosPool.forEach(m => {
      if (estado.miembros[m.texto] === m.de) miembrosOk++;
      else miembrosMal++;
    });
  }
  const totalEsperado = esperadas.size + (Array.isArray(pregunta.miembrosPool) ? pregunta.miembrosPool.length : 0);
  return {
    correctas: correctas.length,
    sobrantes: sobrantes.length + miembrosMal,
    faltantes: faltantes.length,
    miembrosOk,
    totalEsperado,
    ok: sobrantes.length === 0 && faltantes.length === 0 && miembrosMal === 0 && totalEsperado > 0
  };
}

export function esDirigido(subtipo) {
  return (CONFIG_SUBTIPO[subtipo] || CONFIG_SUBTIPO.er).dirigido;
}

// Rating del modo de casos (H6c): % sobre el máximo posible.
export function ratingDiagrama(correctas, esperadas) {
  const pct = esperadas > 0 ? Math.round((correctas / esperadas) * 100) : 0;
  return pct >= 80 ? "exito" : pct >= 50 ? "parcial" : "fracaso";
}
