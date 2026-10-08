// Pantalla Perfil: identidad, cuenta, datos locales y zona de peligro (ADR 001/008).
// Solo UI: recibe estado por parámetro y no toca localStorage ni la nube.
// Los botones usan data-action del mapa ACCIONES de app.js, así que funcionan
// en cualquier pantalla sin recablear.
import { escapar } from "../helpers.js";
import { icono } from "../iconos.js";

// Pluraliza una etiqueta según la cantidad (1 día / 2 días).
const plural = (n, uno, varios) => (n === 1 ? uno : varios);

export function crearPerfil() {
  const $ = id => document.getElementById(id);

  // Pinta la identidad con el mismo lenguaje visual del home (anillo + chips).
  function pintarIdentidad(cont, { nombre, email, perfil }) {
    const p = perfil || { nivel: 1, xp: 0, pct: 0, faltante: 0, racha: 0, insignias: 0 };
    const pct = Math.max(0, Math.min(100, Math.round(p.pct || 0)));
    const titulo = nombre ? `Perfil de ${escapar(nombre)}` : "Tu perfil";
    const correo = email ? `<p class="perfil-correo">Sesión: <b>${escapar(email)}</b></p>` : "";
    const faltan = p.faltante
      ? `<p class="perfil-faltan">Faltan ${p.faltante} XP para el nivel ${p.nivel + 1}</p>`
      : `<p class="perfil-faltan">Nivel máximo: sigue sumando racha y logros.</p>`;
    cont.innerHTML = `
      <div class="perfil-card perfil-card--hero">
        <div class="perfil-anillo" role="progressbar" aria-label="Progreso hacia el nivel ${p.nivel + 1}"
             aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}">
          <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            <circle class="anillo-pista" cx="50" cy="50" r="44"/>
            <circle class="anillo-valor" cx="50" cy="50" r="44" pathLength="100" style="--pct:${pct}"/>
          </svg>
          <span class="perfil-num">${p.nivel}</span>
          <span class="perfil-etq">nivel</span>
        </div>
        <div class="perfil-datos">
          <p class="perfil-nombre">${titulo}</p>
          <p class="perfil-xp"><b>${p.xp}</b> XP</p>
          ${correo}
          ${faltan}
          <ul class="perfil-chips">
            <li class="perfil-chip perfil-chip--racha">
              ${icono("llama", "icono-sm")}
              <span><b>${p.racha}</b> ${plural(p.racha, "día", "días")} de racha</span>
            </li>
            <li class="perfil-chip perfil-chip--logros">
              ${icono("medalla", "icono-sm")}
              <span><b>${p.insignias}</b> ${plural(p.insignias, "logro", "logros")}</span>
            </li>
          </ul>
        </div>
      </div>`;
  }

  // Pinta la cuenta según haya nube y sesión; los botones reutilizan las acciones
  // existentes tal cual (mismo data-action y clases que en la pantalla de cuenta).
  function pintarCuenta(cont, { email, cuentaEstado }) {
    if (cuentaEstado === "sesion") {
      cont.innerHTML = `
        <p class="subtitle">Sesión iniciada como <b>${escapar(email || "")}</b>.</p>
        <div class="flex gap-2 flex-wrap">
          <button class="btn btn-primary btn-sm" data-action="subirNube">Subir progreso a la nube</button>
          <button class="btn btn-secondary btn-sm" data-action="restaurarNube">Restaurar de la nube</button>
          <button class="btn btn-ghost btn-sm" data-action="salirCuenta">Cerrar sesión</button>
        </div>`;
      return;
    }
    if (cuentaEstado === "invitado") {
      cont.innerHTML = `
        <p class="subtitle">Estás estudiando como invitado: tu progreso vive solo en este navegador.</p>
        <div class="flex gap-2 flex-wrap">
          <button class="btn btn-primary btn-sm" data-action="irCuenta">Iniciar sesión</button>
        </div>`;
      return;
    }
    // Sin Firebase la cuenta se deshabilita y la app sigue 100% local (ADR 008).
    cont.innerHTML = `
      <p class="subtitle">Sin cuenta en este dispositivo: la sincronización en la nube no está activada, así que tu progreso vive solo en este navegador. Puedes exportarlo abajo para llevarlo a otro dispositivo.</p>`;
  }

  function render({ nombre = "", email = null, cuentaEstado = "no-disponible", perfil = null } = {}) {
    const identidad = $("perfil-identidad");
    const cuenta = $("perfil-cuenta");
    if (identidad) pintarIdentidad(identidad, { nombre, email, perfil });
    if (cuenta) pintarCuenta(cuenta, { email, cuentaEstado });
  }

  return { render };
}
