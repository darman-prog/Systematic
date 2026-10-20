// Atajos globales del shell: teclado del quiz, auto-pausa al ocultar la pestaña y
// listeners de inputs estáticos fuera de la delegación de click.
export function instalarAtajos({
  $, sesiones, quiz, next, alternarPausa, config, estudio, apuntesUI, glosarioUI, importarDatos
}) {
  function onKeydown(e) {
    const s = sesiones.sesion;
    if ($("screen-quiz").classList.contains("hidden") || !s) return;
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
    const item = s.items[s.idx];
    const answered = !!s.answers[s.idx];
    if (answered) {
      if (e.key === "Enter") next();
      return;
    }
    if (item.tipo === "multi") {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= item.options.length) quiz.toggleMulti(n - 1);
      return;
    }
    if (!["multiple", "vf", "codigo"].includes(item.tipo)) return;
    if (item.tipo === "vf") {
      const k = e.key.toLowerCase();
      if (k === "v" || k === "f") {
        const j = item.options.findIndex(o => (/^verdad/i.test(o) ? "v" : "f") === k);
        if (j >= 0) quiz.responderOpcion(j);
        return;
      }
    }
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= item.options.length) quiz.responderOpcion(n - 1);
  }

  function onVisibility() {
    const s = sesiones.sesion;
    if (document.hidden && s && s.modo === "simulacro" && !s.pausado && !s.finalizada) {
      alternarPausa();
    }
  }

  document.addEventListener("keydown", onKeydown);
  document.addEventListener("visibilitychange", onVisibility);

  ["cfg-priorizar", "cfg-solo-debiles", "cfg-solo-marcadas"].forEach(id =>
    $(id).addEventListener("change", () => config.actualizarResumen())
  );
  $("import-file").addEventListener("change", e => importarDatos(e.target));
  $("study-search").addEventListener("input", e => estudio.renderStudy(e.target.value));
  $("apuntes-search").addEventListener("input", e => apuntesUI.renderApuntes(e.target.value));
  $("glosario-search").addEventListener("input", e => glosarioUI.renderGlosario(e.target.value));

  return () => {
    document.removeEventListener("keydown", onKeydown);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
