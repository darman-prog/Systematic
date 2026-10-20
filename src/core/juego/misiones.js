// Mapa secuencial de misiones (spec 003): cada tema se desbloquea con al menos 1 estrella
// en el anterior. Función pura: la UI decide cómo pintar el estado.
export function estadoMisiones(temas, progresoMisiones) {
  let bloqueado = false;
  return temas.map(tema => {
    const mision = progresoMisiones[tema] || { estrellas: 0, mejorPct: 0 };
    const estado = bloqueado ? "bloqueada" : "disponible";
    if (!mision.estrellas) bloqueado = true;
    return {
      tema,
      estrellas: mision.estrellas || 0,
      mejorPct: mision.mejorPct || 0,
      estado,
      completada: (mision.estrellas || 0) === 3
    };
  });
}
