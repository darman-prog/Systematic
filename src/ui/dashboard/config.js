// Config de práctica (pantalla "config"): render de los filtros por parcial/tema/dificultad/tipo
// y el resumen de preguntas que coinciden. Recibe el estado y los helpers por parámetro; no toca
// localStorage ni conoce el estado global (ADR 001/007).
export function crearConfig({ getFiltros, valoresDe, contarPor, leerOpciones, preguntasFiltradas, diagramasDisponibles, TIPO_LABELS, DIF_LABELS, mostrarPantalla }) {
  const $ = id => document.getElementById(id);

  function renderConfig() {
    const filtros = getFiltros();
    const grupos = [
      { clave: "parciales", titulo: "Parcial", etiqueta: v => v },
      { clave: "temas", titulo: "Tema", etiqueta: v => v },
      { clave: "dificultades", titulo: "Dificultad", etiqueta: v => DIF_LABELS[v] || v },
      { clave: "tipos", titulo: "Tipo de pregunta", etiqueta: v => TIPO_LABELS[v] || v }
    ];
    let html = "";
    grupos.forEach(g => {
      const valores = valoresDe(g.clave).filter(v => diagramasDisponibles() || !(g.clave === "tipos" && v === "diagrama"));
      html += '<div class="mb-5"><div class="flex items-center gap-2 mb-2.5"><span class="font-semibold text-sm text-slate-300">' + g.titulo +
        '</span><span class="ml-auto"></span><button class="link-btn" data-action="toggleFiltroTodos" data-clave="' + g.clave + '" data-activar="true">Todos</button>' +
        '<button class="link-btn" data-action="toggleFiltroTodos" data-clave="' + g.clave + '" data-activar="false">Ninguno</button></div><div class="flex flex-wrap gap-2">';
      valores.forEach(v => {
        const activa = filtros[g.clave].has(v);
        html += '<button type="button" class="chip' + (activa ? " chip-on" : "") + '" data-action="toggleFiltro" data-clave="' + g.clave + '" data-valor="' + v + '"' + (g.clave === "tipos" ? ' data-tipo="' + v + '"' : "") + '>' +
          g.etiqueta(v) + ' · ' + contarPor(g.clave, v) + '</button>';
      });
      if (g.clave === "tipos" && !diagramasDisponibles()) {
        html += '<p class="text-xs text-slate-400 mt-2 w-full" data-aviso-diagramas>El constructor de diagramas está disponible solo en escritorio.</p>';
      }
      html += '</div></div>';
    });
    $("config-groups").innerHTML = html;
    actualizarResumen();
  }

  function actualizarResumen() {
    leerOpciones();
    const qs = preguntasFiltradas();
    $("cfg-max").textContent = qs.length;
    const input = $("cfg-cantidad");
    input.max = qs.length || 1;
    const actual = parseInt(input.value, 10);
    if (!actual || actual > qs.length) input.value = qs.length || 1;
    $("cfg-resumen").textContent = qs.length + " preguntas coinciden con los filtros.";
    // Sin coincidencias no hay ronda que arrancar: se bloquean ambas salidas.
    const sinItems = qs.length === 0;
    $("btn-comenzar").disabled = sinItems;
    const btnSimulacro = $("btn-simulacro");
    if (btnSimulacro) btnSimulacro.disabled = sinItems;
  }

  function usarTodas() {
    const qs = preguntasFiltradas();
    $("cfg-cantidad").value = qs.length || 1;
    actualizarResumen();
  }

  function irConfig() {
    renderConfig();
    mostrarPantalla("config");
  }

  return { renderConfig, actualizarResumen, usarTodas, irConfig };
}
