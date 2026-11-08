// Geometría del lienzo de diagramas: detección de entorno táctil, conversión de
// coordenadas de pantalla a papel y punto de borde de un nodo. Sin estado ni DOM global:
// los accesos al documento se inyectan para poder probar el módulo aislado.
export function esEntornoTactil() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse), (hover: none)").matches;
}

// Convierte coordenadas del puntero a coordenadas internas del papel sumando el desplazamiento de scroll del lienzo.
export function coordenadasEnPapel($, $area, clientX, clientY) {
  const lienzo = $("lienzo-diagrama");
  const papel = $area();
  if (!lienzo || !papel) return null;
  const rLienzo = lienzo.getBoundingClientRect();
  if (rLienzo.width > 0 && rLienzo.height > 0) {
    if (clientX < rLienzo.left || clientX > rLienzo.right || clientY < rLienzo.top || clientY > rLienzo.bottom) {
      return null;
    }
  }
  return {
    x: (clientX - rLienzo.left) + (lienzo.scrollLeft || 0),
    y: (clientY - rLienzo.top) + (lienzo.scrollTop || 0)
  };
}

// Calcula el punto donde el segmento desde el centro del nodo hacia (destX, destY)
// cruza el borde exterior del rectángulo del nodo, para que la punta de flecha no quede tapada.
export function puntoBordeNodo(el, destX, destY, dxNorm = 0, dyNorm = 0) {
  const cx = el.offsetLeft + el.offsetWidth / 2 + dxNorm;
  const cy = el.offsetTop + el.offsetHeight / 2 + dyNorm;
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  // En entornos sin layout real (p. ej. JSDOM), offsetWidth es 0 y devolvemos el centro.
  if (!w || !h) return { x: cx, y: cy };
  const dx = destX - cx;
  const dy = destY - cy;
  if (Math.hypot(dx, dy) < 1) return { x: cx, y: cy };
  const hw = w / 2 + 4;
  const hh = h / 2 + 4;
  const tx = Math.abs(dx) > 0.001 ? hw / Math.abs(dx) : Infinity;
  const ty = Math.abs(dy) > 0.001 ? hh / Math.abs(dy) : Infinity;
  const t = Math.min(tx, ty);
  // Si los nodos están superpuestos, evitamos invertir el segmento.
  if (t >= 1) return { x: cx, y: cy };
  return { x: Math.round(cx + dx * t), y: Math.round(cy + dy * t) };
}
