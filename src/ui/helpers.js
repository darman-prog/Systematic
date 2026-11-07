// Helpers de render compartidos entre los módulos de src/ui/.
// Solo produce HTML string a partir de los parámetros recibidos; sin estado global,
// sin localStorage y sin imports de src/datos/ (los datos llegan como parámetros).

export const TIPO_LABELS = {
  multiple: "Opción múltiple",
  multi: "Selección múltiple",
  vf: "Verdadero / Falso",
  codigo: "Lee el código",
  dragdrop: "Arrastrar piezas",
  ordenar: "Ordenar bloques",
  desarrollo: "Desarrollo",
  relacionar: "Relacionar columnas",
  diagrama: "Construir diagrama"
};

export const DIF_LABELS = { facil: "Fácil", media: "Media", dificil: "Difícil" };

export const TIPOS = ["multiple", "multi", "vf", "codigo", "dragdrop", "ordenar", "desarrollo", "relacionar", "diagrama"];

// Reemplaza el marcador @ por el nombre del estudiante; sin nombre, limpia el marcador.
export function conNombre(nombre, texto) {
  return nombre ? texto.replace("@", nombre) : texto.replace(" @", "").replace("@", "");
}

export function escapar(texto) {
  // Escapa los caracteres que rompen el HTML y los atributos entre comillas dobles.
  // La comilla simple se deja cruda: resaltarSQL() la usa para marcar strings de SQL.
  return String(texto).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function escaparRegex(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Contenido por materia (colores de tema, palabras clave SQL) llega vía la entrada de la
// materia activa (src/core/registro/materias.js); fallback genérico solo cuando el campo falta.
const COLOR_TEMA_FALLBACK = "#3b82f6";

export function colorTema(materia, tema) {
  return (materia && materia.topicColors && materia.topicColors[tema]) || COLOR_TEMA_FALLBACK;
}

export function sqlKeywordsDe(materia) {
  return (materia && materia.sqlKeywords) || [];
}

export function resaltarSQL(sql, keywords) {
  let base = escapar(sql).replace(/'([^']*)'/g, "<span class=\"str\">'$1'</span>");
  const lista = Array.isArray(keywords) ? keywords : [];
  if (!lista.length) return base;
  const patron = new RegExp("\\b(" + lista.slice().sort((a, b) => b.length - a.length).map(escaparRegex).join("|") + ")\\b", "g");
  return base.replace(patron, m => '<span class="kw">' + m + '</span>');
}

export function animar(el) {
  if (!el || !el.classList) return;
  el.classList.remove("anim-in");
  void el.offsetWidth;
  el.classList.add("anim-in");
}

export function bloqueCaso(item) {
  return item.caso
    ? '<div class="bg-amber-950/50 border-l-4 border-amber-500 rounded-xl p-3.5 text-xs sm:text-sm text-amber-100 leading-relaxed mb-4"><b>Caso técnico:</b> ' + escapar(item.caso) + '</div>'
    : "";
}

export function tablaDatos(datos) {
  return datos.map(d =>
    '<div class="my-3"><p class="text-xs font-bold text-slate-400 mb-1 font-mono">' + d.tabla + '</p>' +
      '<div class="overflow-x-auto rounded-xl border border-slate-700"><table class="w-full text-xs">' +
        '<thead><tr class="bg-slate-800">' + d.columnas.map(c => '<th class="px-3 py-1.5 text-left font-mono font-bold text-slate-300">' + c + '</th>').join("") + '</tr></thead>' +
        '<tbody>' + d.filas.map(f => '<tr class="border-t border-slate-800">' + f.map(v => '<td class="px-3 py-1.5 font-mono">' + escapar(v) + '</td>').join("") + '</tr>').join("") + '</tbody>' +
      '</table></div></div>'
  ).join("");
}

function tarjetaER(titulo, filas) {
  return '<div class="er-card">' +
    '<div class="er-head">' + titulo + '</div>' +
    filas.map(f => {
      const clase = f[0] === "PK" ? "er-pk" : f[0] === "PK·FK" ? "er-pkfk" : "er-fk";
      return '<div class="er-row"><span class="' + clase + '">' + (f[0] || "") + '</span><span class="font-mono">' + f[1] + '</span></div>';
    }).join("") +
  '</div>';
}

export function diagramaER() {
  const flecha = '<div class="text-slate-500 text-xl font-bold text-center px-2"><span class="md:hidden">↓</span><span class="hidden md:inline">→</span></div>';
  return '<div class="my-5">' +
    '<p class="text-xs uppercase tracking-wide text-slate-400 mb-2 font-bold">Esquema de referencia</p>' +
    '<div class="flex flex-col md:flex-row items-stretch md:items-center gap-2">' +
      tarjetaER("Profesor", [["PK", "ID_Profesor"], ["", "nombre"]]) +
      flecha +
      tarjetaER("Horas (tabla puente)", [["PK·FK", "ID_Profesor"], ["PK·FK", "ID_Asignatura"]]) +
      flecha +
      tarjetaER("Asignatura", [["PK", "ID_Asignatura"], ["", "nombre"]]) +
    '</div>' +
    '<p class="text-xs text-slate-500 mt-2">Profesor 1 → N Horas N ← 1 Asignatura (relación muchos a muchos resuelta por la tabla puente)</p>' +
  '</div>';
}

// Respuesta revelada de un ítem, compartida por modo estudio y flashcards.
export function respuestaEstudio(item, keywords) {
  if (item.tipo === "diagrama") return '<div class="study-exp">Arma el diagrama en el lienzo y pulsa Comprobar; en la práctica recibirás el detalle por elemento.</div>';
  if (item.tipo === "dragdrop") return '<div class="study-answer">' + escapar(item.respuestas.join("  |  ")) + '</div>';
  if (item.tipo === "relacionar") return '<ul class="flex flex-col gap-1 text-xs sm:text-sm bg-emerald-900/40 border border-emerald-700 rounded-xl p-3 mb-3">' + item.pares.map(p => "<li><b>" + escapar(p[0]) + "</b> → " + escapar(p[1]) + "</li>").join("") + '</ul>';
  if (item.tipo === "ordenar") return '<ol class="list-decimal list-inside flex flex-col gap-1 font-mono text-xs sm:text-sm bg-emerald-900/40 border border-emerald-700 rounded-xl p-3 mb-3">' + item.bloques.map(b => '<li>' + escapar(b) + '</li>').join("") + '</ol>';
  if (item.tipo === "desarrollo") return '<pre class="code-block mb-3">' + resaltarSQL(item.solucion, keywords) + '</pre>';
  if (item.tipo === "multi") {
    return '<div class="flex flex-col gap-2 mb-3">' + item.options.map((o, j) => {
      const esOk = item.correctos.indexOf(j) !== -1;
      return '<div class="study-option' + (esOk ? " study-option-ok" : "") + '">' + (esOk ? "✔ " : "✗ ") + escapar(o) + '</div>';
    }).join("") + '</div>';
  }
  return '<div class="flex flex-col gap-2 mb-3">' + item.options.map((o, j) => '<div class="study-option' + (j === item.correct ? " study-option-ok" : "") + '">' + escapar(o) + '</div>').join("") + '</div>';
}

// Saludo por hora del día (onboarding): días 6-12, tardes 12-19, noches el resto.
// Sin nombre devuelve el saludo a secas; es puro para poder testearlo con fecha fija.
export function saludoSegunHora(nombre, fecha = new Date()) {
  const h = fecha.getHours();
  const tramo = h >= 6 && h < 12 ? "Buenos días" : h >= 12 && h < 19 ? "Buenas tardes" : "Buenas noches";
  const quien = String(nombre || "").trim();
  return quien ? tramo + ", " + quien : tramo;
}

// Formatea una línea del plan ("Crea: A → B (herencia)" o "Ubica: m1 → A") en chips visuales
// conservando el texto completo para lectores de pantalla y pruebas.
function formatearPasoCorreccion(item, esMiembro = false) {
  const mPrefijo = /^(Crea:\s*|Elimina:\s*|Ubica:\s*)(.*)$/.exec(String(item || ""));
  const prefijo = mPrefijo ? mPrefijo[1] : "";
  const cuerpo = mPrefijo ? mPrefijo[2] : String(item || "");

  if (esMiembro) {
    const partes = cuerpo.split(/\s*→\s*/);
    if (partes.length === 2) {
      return (
        '<span class="sr-only">' + escapar(prefijo) + "</span>" +
        '<code class="corr-chip corr-chip--miembro">' + escapar(partes[0]) + "</code>" +
        '<span class="corr-flecha" aria-hidden="true">→</span>' +
        '<span class="corr-chip corr-chip--nodo">' + escapar(partes[1]) + "</span>"
      );
    }
  }

  const mRel = /^(.+?)\s*(→|–)\s*(.+?)\s*\(([^)]+)\)$/.exec(cuerpo);
  if (mRel) {
    return (
      '<span class="sr-only">' + escapar(prefijo) + "</span>" +
      '<span class="corr-chip corr-chip--nodo">' + escapar(mRel[1]) + "</span>" +
      '<span class="corr-flecha" aria-hidden="true">' + escapar(mRel[2]) + "</span>" +
      '<span class="corr-chip corr-chip--nodo">' + escapar(mRel[3]) + "</span>" +
      '<span class="corr-chip corr-chip--tipo">(' + escapar(mRel[4]) + ")</span>"
    );
  }

  return escapar(item);
}

// Renderiza el plan de corrección (core/diagramas/diagramas.js → planCorreccion) como un tablero
// de diagnóstico por columnas (qué falta crear, qué sobra y qué miembros ubicar).
export function seccionesCorreccion(plan) {
  const partes = [];
  if (plan.aciertos && plan.aciertos.correctas < plan.aciertos.total) {
    const pct = plan.aciertos.total > 0 ? Math.round((plan.aciertos.correctas / plan.aciertos.total) * 100) : 0;
    partes.push(
      '<div class="corr-progreso">' +
        '<div class="corr-progreso-top">' +
          '<p class="text-sm m-0">Acertaste <b>' + plan.aciertos.correctas + " de " + plan.aciertos.total + "</b> elementos.</p>" +
          '<span class="corr-progreso-pct">' + pct + "% completado</span>" +
        "</div>" +
        '<div class="corr-progreso-barra"><div class="corr-progreso-fill" style="width:' + pct + '%"></div></div>' +
      "</div>"
    );
  }

  const tarjetas = [];
  const crearTarjeta = (titulo, subtitulo, variante, items, esMiembro = false) => {
    if (!items || !items.length) return;
    tarjetas.push(
      '<div class="corr-card corr-card--' + variante + '">' +
        '<div class="corr-card-head">' +
          '<div>' +
            '<p class="corr-card-titulo">' + titulo + "</p>" +
            '<p class="corr-card-sub">' + subtitulo + "</p>" +
          "</div>" +
          '<span class="corr-card-badge">' + items.length + "</span>" +
        "</div>" +
        '<ol class="corr-lista">' +
          items.map(i => '<li class="corr-item">' + formatearPasoCorreccion(i, esMiembro) + "</li>").join("") +
        "</ol>" +
      "</div>"
    );
  };

  crearTarjeta("Falta crear", "Relaciones esperadas que aún no están", "crear", plan.porCrear, false);
  crearTarjeta("Elimina", "Relaciones incorrectas o con tipo equivocado", "quitar", plan.porQuitar, false);
  crearTarjeta("Ubica", "Atributos o métodos en su clase correcta", "mover", plan.porMover, true);

  if (tarjetas.length) {
    partes.push('<div class="corr-grid">' + tarjetas.join("") + "</div>");
  }
  return partes.join("");
}
