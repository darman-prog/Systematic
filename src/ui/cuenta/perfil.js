// Pantalla Perfil: identidad, cuenta, datos locales y zona de peligro (ADR 001/008).
// Solo UI: recibe estado por parámetro y no toca localStorage ni la nube.
// Los botones usan data-action del mapa ACCIONES de app.js, así que funcionan
// en cualquier pantalla sin recablear.
import { escapar } from "../helpers.js";
import { icono } from "../iconos.js";

// Pluraliza una etiqueta según la cantidad (1 día / 2 días).
const plural = (n, uno, varios) => (n === 1 ? uno : varios);

export function crearPerfil() {
  /** @type {(id: string) => any} */
  const $ = id => document.getElementById(id);

  // Pinta la credencial de estudiante: anillo de nivel, barra de XP y tarjetas de métricas.
  function pintarIdentidad(cont, { nombre, perfil, tituloActivo }) {
    const p = perfil || { nivel: 1, xp: 0, pct: 0, faltante: 0, racha: 0, insignias: 0 };
    // Porcentaje acotado entre 0 y 100 para la barra de avance.
    const pct = Math.max(0, Math.min(100, Math.round(p.pct || 0)));
    const titulo = nombre ? `Perfil de ${escapar(nombre)}` : "Tu perfil";

    // Título técnico obtenido al completar ramas del árbol de talentos.
    const insigniaEspecialidad = tituloActivo
      ? `<div class="perfil-titulo-especialidad">${icono("medalla", "icono-xs")} <span>${escapar(tituloActivo)}</span></div>`
      : "";

    // Mensaje de proximidad al siguiente nivel para la barra de progreso.
    const textoFaltan = p.faltante
      ? `Faltan ${p.faltante} XP para el nivel ${p.nivel + 1}`
      : "Nivel máximo: sigue sumando racha y logros.";

    cont.innerHTML = `
      <div class="perfil-card perfil-card--hero">
        <div class="perfil-hero-principal">
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
            <h2 class="perfil-nombre">${titulo}</h2>
            ${insigniaEspecialidad}
            <div class="perfil-progreso-wrap">
              <div class="perfil-progreso-meta">
                <span class="perfil-faltan">${textoFaltan}</span>
                <span class="perfil-progreso-pct">${pct}%</span>
              </div>
              <div class="perfil-barra" role="presentation">
                <div class="perfil-barra-relleno" style="width: ${pct}%"></div>
              </div>
            </div>
          </div>
        </div>

        <ul class="perfil-chips perfil-stats-grid">
          <li class="perfil-chip perfil-stat-card">
            <div class="perfil-stat-icono perfil-stat-icono--xp" aria-hidden="true">
              ${icono("chispa", "icono-sm")}
            </div>
            <div class="perfil-stat-datos">
              <span class="perfil-stat-valor"><b>${p.xp}</b> <span class="perfil-stat-unit">XP</span></span>
              <span class="perfil-stat-label">Puntaje total</span>
            </div>
          </li>
          <li class="perfil-chip perfil-chip--racha perfil-stat-card">
            <div class="perfil-stat-icono perfil-stat-icono--racha" aria-hidden="true">
              ${icono("llama", "icono-sm")}
            </div>
            <div class="perfil-stat-datos">
              <span class="perfil-stat-valor"><b>${p.racha}</b> <span class="perfil-stat-unit">${plural(p.racha, "día", "días")}</span></span>
              <span class="perfil-stat-label">Racha activa</span>
            </div>
          </li>
          <li class="perfil-chip perfil-chip--logros perfil-stat-card">
            <div class="perfil-stat-icono perfil-stat-icono--logros" aria-hidden="true">
              ${icono("medalla", "icono-sm")}
            </div>
            <div class="perfil-stat-datos">
              <span class="perfil-stat-valor"><b>${p.insignias}</b> <span class="perfil-stat-unit">${plural(p.insignias, "logro", "logros")}</span></span>
              <span class="perfil-stat-label">Desbloqueados</span>
            </div>
          </li>
        </ul>
      </div>`;
  }

  // Pinta la cuenta con indicador de estado de sesión y acciones en la nube.
  function pintarCuenta(cont, { email, cuentaEstado }) {
    if (cuentaEstado === "sesion") {
      cont.innerHTML = `
        <div class="perfil-sesion-info">
          <div class="perfil-sesion-badge">
            <span class="perfil-sesion-dot" aria-hidden="true"></span>
            <span class="perfil-sesion-texto">Sesión activa como <b>${escapar(email || "")}</b></span>
          </div>
          <p class="subtitle perfil-cuenta-sub">Tu progreso se sincroniza con Firestore para respaldarlo o llevarlo a otro dispositivo.</p>
        </div>
        <div class="flex gap-2 flex-wrap mt-3">
          <button class="btn btn-primary btn-sm" data-action="subirNube">Subir progreso a la nube</button>
          <button class="btn btn-secondary btn-sm" data-action="restaurarNube">Restaurar de la nube</button>
          <button class="btn btn-ghost btn-sm" data-action="salirCuenta">Cerrar sesión</button>
        </div>`;
      return;
    }
    if (cuentaEstado === "invitado") {
      cont.innerHTML = `
        <div class="perfil-sesion-info">
          <div class="perfil-sesion-badge perfil-sesion-badge--invitado">
            <span class="perfil-sesion-dot perfil-sesion-dot--invitado" aria-hidden="true"></span>
            <span class="perfil-sesion-texto">Modo invitado: guardado localmente</span>
          </div>
          <p class="subtitle perfil-cuenta-sub">Estás estudiando como invitado: tu progreso vive solo en este navegador. Inicia sesión para respaldarlo en la nube.</p>
        </div>
        <div class="flex gap-2 flex-wrap mt-3">
          <button class="btn btn-primary btn-sm" data-action="irCuenta">Iniciar sesión</button>
        </div>`;
      return;
    }
    // Sin Firebase la cuenta se deshabilita y la app sigue 100% local (ADR 008).
    cont.innerHTML = `
      <div class="perfil-sesion-info">
        <p class="subtitle perfil-cuenta-sub">Sin cuenta en este dispositivo: la sincronización en la nube no está activada, así que tu progreso vive solo en este navegador. Puedes exportarlo al lado para llevarlo a otro dispositivo.</p>
      </div>`;
  }

  function render({ nombre = "", email = null, cuentaEstado = "no-disponible", perfil = null, tituloActivo = "" } = {}) {
    const identidad = $("perfil-identidad");
    const cuenta = $("perfil-cuenta");
    if (identidad) pintarIdentidad(identidad, { nombre, perfil, tituloActivo });
    if (cuenta) pintarCuenta(cuenta, { email, cuentaEstado });
  }

  return { render };
}
