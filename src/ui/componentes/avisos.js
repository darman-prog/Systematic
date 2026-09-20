// Avisos efímeros: toast de mensajes y confeti de celebración.
// Vivían en app.js; se mueven aquí para que la composición root no cargue DOM de celebración.
const $ = id => document.getElementById(id);

export function toast(mensaje) {
  let zona = $("toast-zone");
  if (!zona) {
    zona = document.createElement("div");
    zona.id = "toast-zone";
    document.body.appendChild(zona);
  }
  const el = document.createElement("div");
  el.className = "toast";
  el.setAttribute("role", "status");
  el.innerHTML = mensaje;
  zona.appendChild(el);
  setTimeout(() => el.classList.add("toast-out"), 2800);
  setTimeout(() => el.remove(), 3300);
}

// Confeti breve y discreto (respeta prefers-reduced-motion).
export function confeti() {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let c = $("confeti-canvas");
  if (!c) {
    c = document.createElement("canvas");
    c.id = "confeti-canvas";
    document.body.appendChild(c);
  }
  const dpr = window.devicePixelRatio || 1;
  c.width = window.innerWidth * dpr;
  c.height = window.innerHeight * dpr;
  const lienzo = c.getContext("2d");
  if (!lienzo) return;
  lienzo.setTransform(dpr, 0, 0, dpr, 0, 0);
  const colores = ["#9BB8C9", "#8FBF9F", "#D9BC8A", "#B5A9CF", "#E7E5DE"];
  const partes = Array.from({ length: 60 }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * window.innerHeight * 0.3,
    vy: 120 + Math.random() * 160,
    vx: -40 + Math.random() * 80,
    tam: 4 + Math.random() * 5,
    rot: Math.random() * Math.PI,
    color: colores[Math.floor(Math.random() * colores.length)]
  }));
  const inicio = performance.now();
  function cuadro(t) {
    const dt = (t - inicio) / 1000;
    lienzo.clearRect(0, 0, window.innerWidth, window.innerHeight);
    partes.forEach(p => {
      lienzo.save();
      lienzo.translate(p.x + p.vx * dt, p.y + p.vy * dt);
      lienzo.rotate(p.rot + dt * 3);
      lienzo.fillStyle = p.color;
      lienzo.fillRect(-p.tam / 2, -p.tam / 2, p.tam, p.tam * 0.6);
      lienzo.restore();
    });
    if (dt < 1.6) requestAnimationFrame(cuadro);
    else lienzo.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
  requestAnimationFrame(cuadro);
}
