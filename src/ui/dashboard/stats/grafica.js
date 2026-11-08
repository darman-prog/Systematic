// Gráfica de evolución del panel de estadísticas: canvas, animación y resize.
// El estado de los frames y del observer vive aquí, no en el cableado del panel.
import { pct } from "../../../core/index.js";
import { CFG, nivel, leerTema, conAlfa, reduceMotion, EASE_OUT } from "./plantillas.js";

/** @type {(id: string) => any} */
const $ = id => document.getElementById(id);

/* ═══════════════════════════════════════════════════════════════
 * 4. GRÁFICA (canvas)
 * ═══════════════════════════════════════════════════════════════ */

let rafGrafica = 0, rafResize = 0, roGrafica = null;
const detenerAnimacionGrafica = () => {
  if (rafGrafica) { cancelAnimationFrame(rafGrafica); rafGrafica = 0; }
};
const detenerGrafica = () => {
  detenerAnimacionGrafica();
  if (rafResize) { cancelAnimationFrame(rafResize); rafResize = 0; }
  if (roGrafica) { roGrafica.disconnect(); roGrafica = null; }
};

/** @param hist historial ya ordenado (más reciente primero) */
function dibujarGrafica(hist, sinAnimar) {
  const canvas = $("grafica"), wrap = $("grafica-wrap"), vacia = $("grafica-vacia");
  if (!canvas) return;
  detenerAnimacionGrafica();

  const rondas = hist.slice(0, CFG.puntosGrafica).reverse();
  if (rondas.length < 2) {
    wrap?.classList.add("hidden");
    vacia?.classList.remove("hidden");
    return;
  }
  wrap?.classList.remove("hidden");
  vacia?.classList.add("hidden");

  const datos = rondas.map(pct);
  const promedio = datos.reduce((a, b) => a + b, 0) / datos.length;
  const ultimoDato = datos[datos.length - 1];

  canvas.setAttribute("aria-label",
    `Evolución de tus últimos ${datos.length} resultados. Último: ${ultimoDato}%. Promedio: ${Math.round(promedio)}%.`);
  canvas.setAttribute("aria-describedby", "grafica-resumen");
  const resumen = $("grafica-resumen");
  if (resumen) resumen.textContent = "Resultados del más antiguo al más reciente: " + datos.map(v => v + "%").join(", ") + ".";

  const T = leerTema(canvas);
  const colorNivel = v => T[nivel(v)];

  const dpr = window.devicePixelRatio || 1;
  const ancho = canvas.clientWidth || 600;
  const alto = canvas.clientHeight || 220;
  canvas.width = Math.round(ancho * dpr);
  canvas.height = Math.round(alto * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const pad = { l: 36, r: 24, t: 24, b: 32 };
  const W = ancho - pad.l - pad.r, H = alto - pad.t - pad.b;
  const x = i => pad.l + (i * W) / (datos.length - 1);
  const y = v => pad.t + (1 - v / 100) * H;
  const fmt = d => new Date(d).toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
  const rectRedondo = (rx, ry, rw, rh, r) => {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(rx, ry, rw, rh, r);   // Safari < 16 no lo tiene
    else ctx.rect(rx, ry, rw, rh);
  };

  const trazarCurva = () => {
    ctx.beginPath();
    ctx.moveTo(x(0), y(datos[0]));
    for (let i = 1; i < datos.length - 1; i++) {
      ctx.quadraticCurveTo(x(i), y(datos[i]), (x(i) + x(i + 1)) / 2, (y(datos[i]) + y(datos[i + 1])) / 2);
    }
    ctx.lineTo(x(datos.length - 1), y(ultimoDato));
  };

  const dibujar = progreso => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, ancho, alto);

    // Rejilla
    ctx.font = "10px system-ui, -apple-system, sans-serif";
    ctx.textBaseline = "middle";
    [0, 50, 100].forEach(v => {
      ctx.strokeStyle = T.superficie2;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.l, y(v)); ctx.lineTo(ancho - pad.r, y(v)); ctx.stroke();
      ctx.fillStyle = T.apagado;
      ctx.textAlign = "right";
      ctx.fillText(v + "%", pad.l - 6, y(v));
    });

    // Línea de promedio global
    ctx.strokeStyle = conAlfa(T.acento, 0.3);
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(pad.l, y(promedio)); ctx.lineTo(ancho - pad.r, y(promedio)); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = T.apagado;
    ctx.textAlign = "right";
    ctx.fillText("prom. " + Math.round(promedio) + "%", ancho - pad.r, y(promedio) - 8);

    // Fechas extremas
    ctx.textAlign = "center";
    ctx.fillText(fmt(rondas[0].date), pad.l, alto - 12);
    ctx.fillText(fmt(rondas[rondas.length - 1].date), ancho - pad.r, alto - 12);

    // Revelado progresivo por recorte
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, pad.l + W * progreso + 4, alto);
    ctx.clip();

    // Área bajo la curva
    const base = y(0);
    trazarCurva();
    ctx.lineTo(x(datos.length - 1), base);
    ctx.lineTo(x(0), base);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, y(100), 0, base);
    grad.addColorStop(0, conAlfa(T.acento, 0.22));
    grad.addColorStop(1, conAlfa(T.acento, 0));
    ctx.fillStyle = grad;
    ctx.fill();

    // Línea principal
    trazarCurva();
    ctx.strokeStyle = T.acentoFuerte;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    ctx.stroke();

    // Puntos (con borde para legibilidad)
    datos.forEach((v, i) => {
      ctx.beginPath();
      ctx.arc(x(i), y(v), 4, 0, Math.PI * 2);
      ctx.fillStyle = colorNivel(v);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = T.superficie;
      ctx.stroke();
    });

    // Último punto destacado: halo + etiqueta
    if (progreso >= 1) {
      const last = datos.length - 1;
      ctx.beginPath();
      ctx.arc(x(last), y(ultimoDato), 8, 0, Math.PI * 2);
      ctx.fillStyle = conAlfa(T.acento, 0.15);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x(last), y(ultimoDato), 5, 0, Math.PI * 2);
      ctx.fillStyle = colorNivel(ultimoDato);
      ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = T.superficie; ctx.stroke();

      const label = ultimoDato + "%";
      ctx.font = "bold 11px system-ui, sans-serif";
      const lw = ctx.measureText(label).width + 12;
      const lx = Math.min(x(last) - lw / 2, ancho - pad.r - lw);
      const ly = Math.max(0, y(ultimoDato) - 24);
      ctx.fillStyle = T.superficie3;
      rectRedondo(lx, ly, lw, 18, 4);
      ctx.fill();
      ctx.fillStyle = T.texto;
      ctx.textAlign = "center";
      ctx.fillText(label, lx + lw / 2, ly + 10);
    }
    ctx.restore();
  };

  if (sinAnimar || reduceMotion()) { dibujar(1); return; }
  const t0 = performance.now();
  const DUR = 600;
  const paso = ahora => {
    const t = Math.min(1, (ahora - t0) / DUR);
    dibujar(EASE_OUT(t));
    rafGrafica = t < 1 ? requestAnimationFrame(paso) : 0;
  };
  rafGrafica = requestAnimationFrame(paso);
}


export function observarGrafica(wrap, hist) {
  if (!wrap || hist.length < 2) return;
  let primera = true;
  roGrafica = new ResizeObserver(() => {
    if (primera) { primera = false; return; }
    cancelAnimationFrame(rafResize);
    rafResize = requestAnimationFrame(() => dibujarGrafica(hist, true));
  });
  roGrafica.observe(wrap);
}

export { dibujarGrafica, detenerGrafica };
