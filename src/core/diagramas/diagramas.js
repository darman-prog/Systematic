// Lógica pura del constructor de diagramas (spec 003, H6a ER + H6b subtipos).
// El lienzo vive en src/ui/componentes/diagramas.js; aquí solo hay estado, validación y
// puntuación serializables, sin DOM. Las conexiones son dirigidas {de → a, tipo} salvo ER
// y los tipos declarados en tiposNoDirigidos, que comparan el par sin orden.

export const SUBTIPOS = ["er", "uml-clases", "casos-uso", "actividades"];

export const CONFIG_SUBTIPO = {
  "er": { dirigido: false, tiposArista: ["1:1", "1:N", "N:M"] },
  "uml-clases": { dirigido: true, tiposNoDirigidos: ["asociación"], tiposArista: ["herencia", "asociación", "composición", "agregación"] },
  "casos-uso": { dirigido: true, tiposNoDirigidos: ["asociación"], tiposArista: ["asociación", "include", "extend"] },
  "actividades": { dirigido: true, tiposArista: ["transición"] }
};

export function normalizarClave(texto) {
  return String(texto == null ? "" : texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function nombreAccesible(nombre, tipo = "nodo") {
  const limpio = String(nombre || "")
    .replace(/[^\p{L}\p{N}\s\-]/gu, "")
    .trim();
  if (!limpio) return tipo + " sin nombre";
  return limpio;
}

export function claveArista(de, a, tipo, dirigido) {
  const extremos = dirigido ? [de, a] : [de, a].slice().sort();
  return extremos.join("|") + "|" + normalizarClave(tipo);
}

function claveDe(rel, dirigido) {
  let clave = claveArista(rel.de, rel.a, rel.tipo, dirigido);
  if (rel.guarda) clave += "|" + normalizarClave(rel.guarda);
  return clave;
}

export function esDirigido(subtipo) {
  return (CONFIG_SUBTIPO[subtipo] || CONFIG_SUBTIPO.er).dirigido;
}

export function esDirigidoTipo(subtipo, tipo) {
  const cfg = CONFIG_SUBTIPO[subtipo] || CONFIG_SUBTIPO.er;
  if (!cfg.dirigido) return false;
  const sinDireccion = cfg.tiposNoDirigidos || [];
  return !sinDireccion.some(t => normalizarClave(t) === normalizarClave(tipo));
}

function calcularPosicionInicial(index, total) {
  const espaciado = 150;
  const columnas = Math.max(2, Math.ceil(Math.sqrt(total)));
  const fila = Math.floor(index / columnas);
  const columna = index % columnas;
  return {
    x: 100 + columna * espaciado,
    y: 100 + fila * espaciado
  };
}

function calcularPosicionParaNuevoNodo(estado) {
  const cantidad = estado.nodosColocados.length;
  const baseX = 50;
  const baseY = 50;
  const offsetHorizontal = 120;
  return {
    x: baseX + (cantidad * offsetHorizontal),
    y: baseY
  };
}

export function crearTablero(pregunta) {
  const nodos = Array.isArray(pregunta.nodosFijos) ? pregunta.nodosFijos.slice() : [];
  const estado = {
    preguntaId: pregunta.id,
    nodosColocados: nodos.slice(),
    nodosDisponibles: Array.isArray(pregunta.nodosPool) ? pregunta.nodosPool.slice() : [],
    miembros: {},
    conexiones: [],
    posiciones: {},
    ultimoCambio: null
  };
  nodos.forEach((nombre, index) => {
    estado.posiciones[nombre] = calcularPosicionInicial(index, nodos.length);
  });
  if (Array.isArray(pregunta.miembrosPool)) {
    pregunta.miembrosPool.forEach(m => { estado.miembros[m.texto] = null; });
  }
  return estado;
}

export function colocarNodo(estado, nombre) {
  if (!nombre || estado.nodosColocados.indexOf(nombre) !== -1) return estado;
  if (estado.nodosDisponibles.indexOf(nombre) === -1) return estado;
  const nuevasPosiciones = Object.assign({}, estado.posiciones);
  if (!nuevasPosiciones[nombre]) {
    nuevasPosiciones[nombre] = calcularPosicionParaNuevoNodo(estado);
  }
  return Object.assign({}, estado, {
    nodosColocados: estado.nodosColocados.concat([nombre]),
    nodosDisponibles: estado.nodosDisponibles.filter(n => n !== nombre),
    posiciones: nuevasPosiciones,
    ultimoCambio: {
      tipo: "nodo_colocado",
      nodo: nombre,
      mensaje: "Nodo " + nombreAccesible(nombre, "nodo") + " colocado en el diagrama"
    }
  });
}

export function quitarNodo(estado, fijos, nombre) {
  if (Array.isArray(fijos) && fijos.indexOf(nombre) !== -1) return estado;
  const nuevasPosiciones = Object.assign({}, estado.posiciones);
  delete nuevasPosiciones[nombre];
  return Object.assign({}, estado, {
    nodosColocados: estado.nodosColocados.filter(n => n !== nombre),
    nodosDisponibles: estado.nodosDisponibles.concat([nombre]),
    miembros: quitarMiembrosDelNodo(estado.miembros, nombre),
    conexiones: estado.conexiones.filter(c => c.de !== nombre && c.a !== nombre),
    posiciones: nuevasPosiciones,
    ultimoCambio: {
      tipo: "nodo_quitado",
      nodo: nombre,
      mensaje: "Nodo " + nombreAccesible(nombre, "nodo") + " retirado del diagrama"
    }
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
  const mensaje = nodo
    ? "Miembro " + nombreAccesible(texto, "miembro") + " asignado a " + nombreAccesible(nodo, "nodo")
    : "Miembro " + nombreAccesible(texto, "miembro") + " desasignado";
  return Object.assign({}, estado, {
    miembros,
    ultimoCambio: {
      tipo: "miembro_asignado",
      miembro: texto,
      nodo: nodo,
      mensaje
    }
  });
}

export function validarConexion(estado, de, a, tipo, dirigido, guarda) {
  const resultado = { valida: true, error: null, mensajeAccesible: null };
  if (!de || !a || !tipo) {
    resultado.valida = false;
    resultado.error = "datos_incompletos";
    resultado.mensajeAccesible = "No se puede crear la conexión: faltan datos";
    return resultado;
  }
  if (!dirigido && de === a) {
    resultado.valida = false;
    resultado.error = "auto_conexion_no_dirigida";
    resultado.mensajeAccesible = "No se puede conectar " + nombreAccesible(de, "nodo") + " consigo mismo en diagramas no dirigidos";
    return resultado;
  }
  const nueva = { de, a, tipo };
  if (guarda) nueva.guarda = guarda;
  const clave = claveDe(nueva, dirigido);
  const repetida = estado.conexiones.some(c => claveDe(c, dirigido) === clave);
  if (repetida) {
    resultado.valida = false;
    resultado.error = "conexion_duplicada";
    const flecha = dirigido ? " → " : " – ";
    resultado.mensajeAccesible = "La conexión " + nombreAccesible(de) + flecha + nombreAccesible(a) + " (" + tipo + ") ya existe";
    return resultado;
  }
  const flecha = dirigido ? " → " : " – ";
  resultado.mensajeAccesible = "Conexión creada: " + nombreAccesible(de) + flecha + nombreAccesible(a) + " (" + tipo + ")";
  return resultado;
}

export function conectar(estado, de, a, tipo, dirigido, guarda) {
  if (!de || !a || !tipo) return estado;
  if (!dirigido && de === a) return estado;
  const nueva = { de, a, tipo };
  if (guarda) nueva.guarda = guarda;
  const clave = claveDe(nueva, dirigido);
  const repetida = estado.conexiones.some(c => claveDe(c, dirigido) === clave);
  if (repetida) return estado;
  return Object.assign({}, estado, {
    conexiones: estado.conexiones.concat([nueva]),
    ultimoCambio: {
      tipo: "conexion_creada",
      datos: nueva,
      mensaje: validarConexion(estado, de, a, tipo, dirigido, guarda).mensajeAccesible
    }
  });
}

// Quita la conexión que coincida con de/a/tipo (y guarda, si se pasa). Sin guarda,
// elimina solo la conexión sin guarda del par — no toca las paralelas con guarda distinta.
export function quitarConexion(estado, de, a, tipo, dirigido, guarda) {
  const objetivo = { de, a, tipo };
  if (guarda) objetivo.guarda = guarda;
  const clave = claveDe(objetivo, dirigido);
  const flecha = dirigido ? " → " : " – ";
  return Object.assign({}, estado, {
    conexiones: estado.conexiones.filter(c => claveDe(c, dirigido) !== clave),
    ultimoCambio: {
      tipo: "conexion_quitada",
      mensaje: "Conexión eliminada: " + nombreAccesible(de) + flecha + nombreAccesible(a) + " (" + tipo + ")"
    }
  });
}

export function actualizarPosicion(estado, nombre, x, y) {
  if (estado.nodosColocados.indexOf(nombre) === -1) return estado;
  const nuevasPosiciones = Object.assign({}, estado.posiciones, {
    [nombre]: { x: Math.round(x), y: Math.round(y) }
  });
  return Object.assign({}, estado, {
    posiciones: nuevasPosiciones,
    ultimoCambio: {
      tipo: "nodo_movido",
      nodo: nombre,
      posicion: { x: Math.round(x), y: Math.round(y) },
      mensaje: "Nodo " + nombreAccesible(nombre, "nodo") + " movido a posición (" + Math.round(x) + ", " + Math.round(y) + ")"
    }
  });
}

function relacionesDe(pregunta) {
  return Array.isArray(pregunta.relacionesEsperadas) ? pregunta.relacionesEsperadas : [];
}

export function evaluarDiagrama(pregunta, estado) {
  const esperadas = new Map();
  relacionesDe(pregunta).forEach(r => {
    if (r && r.de && r.a && r.tipo) {
      esperadas.set(claveDe(r, esDirigidoTipo(pregunta.subtipo, r.tipo)), r);
    }
  });
  const actuales = new Map();
  (estado.conexiones || []).forEach(c => {
    actuales.set(claveDe(c, esDirigidoTipo(pregunta.subtipo, c.tipo)), c);
  });

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

  const fmtRel = r => {
    const flecha = esDirigidoTipo(pregunta.subtipo, r.tipo) ? " → " : " – ";
    return nombreAccesible(r.de, "nodo") + flecha + nombreAccesible(r.a, "nodo") +
      " (" + r.tipo + (r.guarda ? " " + r.guarda : "") + ")";
  };

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
      miembrosMal: miembrosMalDetalle.map(m => nombreAccesible(m.texto, "miembro") + " → " + nombreAccesible(m.de, "nodo")),
      miembrosOk: miembrosOkDetalle.map(m => nombreAccesible(m.texto, "miembro") + " → " + nombreAccesible(m.de, "nodo"))
    }
  };
}

export function resumenDiagrama(res) {
  const d = res && res.detalle;
  if (!d) return [];
  const lineas = [];
  if (d.faltantes.length) lineas.push("Faltan: " + d.faltantes.join(" · "));
  if (d.sobrantes.length) lineas.push("Sobran: " + d.sobrantes.join(" · "));
  if (d.miembrosMal.length) lineas.push("Miembros por ubicar: " + d.miembrosMal.join(" · "));
  return lineas;
}

// Convierte el resultado de evaluarDiagrama en un plan de corrección accionable: cuántos
// aciertos hay, qué conexiones crear, cuáles eliminar y qué miembros reubicar, en ese orden.
// El detalle ya trae los pares formateados ("A → B (tipo guarda)"); aquí solo se les da
// el verbo de acción para que el estudiante sepa exactamente qué hacer con cada error.
export function planCorreccion(res) {
  const d = res && res.detalle;
  const total = (res && res.totalEsperado) || 0;
  const correctas = ((res && res.correctas) || 0) + ((res && res.miembrosOk) || 0);
  return {
    aciertos: total > 0 ? { correctas, total } : null,
    porCrear: (d ? d.faltantes : []).map(x => "Crea: " + x),
    porQuitar: (d ? d.sobrantes : []).map(x => "Elimina: " + x),
    porMover: (d ? d.miembrosMal : []).map(x => "Ubica: " + x)
  };
}

export function resumenDiagramaAccesible(res) {
  const d = res && res.detalle;
  if (!d) return { announcements: [], summary: "", progress: { correctas: 0, total: 0, porcentaje: 0 } };
  const announcements = [];
  const summary = [];
  if (res.ok) {
    announcements.push({ text: "¡Diagrama completo correctamente!", priority: "assertive" });
    summary.push("Diagrama correcto");
  } else {
    if (d.faltantes.length) {
      announcements.push({ text: "Faltan " + d.faltantes.length + " conexiones: " + d.faltantes.join(", "), priority: "polite" });
      summary.push(d.faltantes.length + " conexiones faltantes");
    }
    if (d.sobrantes.length) {
      announcements.push({ text: "Hay " + d.sobrantes.length + " conexiones sobrantes: " + d.sobrantes.join(", "), priority: "polite" });
      summary.push(d.sobrantes.length + " conexiones sobrantes");
    }
    if (d.miembrosMal.length) {
      announcements.push({ text: d.miembrosMal.length + " miembros por ubicar: " + d.miembrosMal.join(", "), priority: "polite" });
      summary.push(d.miembrosMal.length + " miembros mal ubicados");
    }
  }
  return {
    announcements,
    summary: summary.join(". "),
    progress: {
      correctas: res.correctas,
      total: res.totalEsperado,
      porcentaje: res.totalEsperado > 0 ? Math.round((res.correctas / res.totalEsperado) * 100) : 0
    }
  };
}

export function ratingDiagrama(correctas, esperadas) {
  const pct = esperadas > 0 ? Math.round((correctas / esperadas) * 100) : 0;
  return pct >= 80 ? "exito" : pct >= 50 ? "parcial" : "fracaso";
}

export function ratingDiagramaAccesible(correctas, esperadas) {
  const pct = esperadas > 0 ? Math.round((correctas / esperadas) * 100) : 0;
  let nivel, mensaje, accesible;
  if (pct >= 80) {
    nivel = "exito";
    mensaje = "¡Excelente trabajo!";
    accesible = "Has completado el " + pct + "% del diagrama. ¡Excelente trabajo!";
  } else if (pct >= 50) {
    nivel = "parcial";
    mensaje = "Buen intento, sigue practicando";
    accesible = "Has completado el " + pct + "% del diagrama. Buen intento, sigue practicando.";
  } else {
    nivel = "fracaso";
    mensaje = "Necesitas repasar los conceptos";
    accesible = "Has completado el " + pct + "% del diagrama. Necesitas repasar los conceptos.";
  }
  return {
    nivel,
    porcentaje: pct,
    mensaje,
    accesible,
    progreso: correctas + " de " + esperadas + " elementos correctos"
  };
}
