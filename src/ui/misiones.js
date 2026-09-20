// Render del mapa de misiones por tema (spec 003): nodos secuenciales con estrellas.
// Funciones puras de render: reciben datos y callbacks; no leen localStorage.

const $ = id => document.getElementById(id);

// Estado de cada nodo del camino: la primera misión siempre está disponible; las demás se
// desbloquean con al menos 1 estrella en la anterior.
export function estadoMisiones(temas, progresoMisiones) {
  let bloqueado = false;
  return temas.map(tema => {
    const mision = progresoMisiones[tema] || { estrellas: 0, mejorPct: 0 };
    const estado = bloqueado ? "bloqueada" : "disponible";
    if (!mision.estrellas) bloqueado = true;
    return { tema, estrellas: mision.estrellas || 0, mejorPct: mision.mejorPct || 0, estado };
  });
}

export function pintarMisiones(nodos) {
  const cont = $("misiones-lista");
  if (!cont) return;
  cont.innerHTML = nodos.map((n, i) => {
    const estrellas = "★".repeat(n.estrellas) + "☆".repeat(3 - n.estrellas);
    const disponible = n.estado === "disponible";
    const icono = n.estado === "bloqueada" ? "🔒" : n.estrellas === 3 ? "🏅" : "📍";
    return '<button class="mision-nodo' + (disponible ? " mision-disponible" : "") + (n.estado === "bloqueada" ? " mision-bloqueada" : "") + '"' +
      (disponible ? ' data-action="iniciarMision" data-tema="' + n.tema + '"' : " disabled") + '>' +
      '<span class="mision-num">' + (i + 1) + '</span>' +
      '<span class="flex-1 min-w-0 text-left"><span class="font-bold">' + n.tema + '</span>' +
      '<span class="text-xs text-slate-400 block">' + (n.mejorPct ? "Mejor precisión: " + n.mejorPct + "%" : "Sin intentos") + '</span></span>' +
      '<span class="mision-estrellas">' + estrellas + '</span>' +
      '<span class="text-xl">' + icono + '</span>' +
    '</button>';
  }).join("") || '<p class="text-sm text-slate-400">Esta materia aún no tiene temas para misiones.</p>';
}
