// Acciones de configuración, quiz, ronda, estudio, flashcards y glosario.
export function accionesPractica({
  config, alternarPausa, confirm, quiz, resultados, apuntesUI, estudio, glosarioUI,
  flashcards, sesiones, clearTimerPregunta, next, salir,
  comenzarPractica, comenzarSimulacro, startContrarreloj, startSupervivencia,
  practicarArrastre, practicarCasos, practicarDebiles, practicarTipo, practicarVencidas,
  repetirFalladas, repetirMisma, toggleFiltro, toggleFiltroTodos
}) {
  return {
    // ---- Config ----
    actualizarResumen: () => config.actualizarResumen(),
    comenzarPractica: () => comenzarPractica(),
    comenzarSimulacro: () => comenzarSimulacro(),
    irConfig: () => config.irConfig(),
    usarTodas: () => config.usarTodas(),
    toggleFiltro: el => toggleFiltro(el.dataset.clave, el.dataset.valor),
    toggleFiltroTodos: el => toggleFiltroTodos(el.dataset.clave, el.dataset.activar === "true"),
    // ---- Quiz y sesión ----
    alternarPausa: () => alternarPausa(),
    cancelarConfirm: () => confirm.cerrarConfirm(false),
    confirmarConfirm: () => confirm.cerrarConfirm(true),
    autoevaluarDev: el => quiz.autoevaluarDev(el.dataset.ok === "true"),
    autoevaluarResultado: el => resultados.autoevaluarResultado(el.dataset.id, el.dataset.ok === "true"),
    clickMatchDer: el => quiz.clickMatchDer(parseInt(el.dataset.idx, 10)),
    clickMatchIzq: el => quiz.clickMatchIzq(parseInt(el.dataset.i, 10)),
    comprobarMulti: () => quiz.comprobarMulti(),
    comprobarOrden: () => quiz.comprobarOrden(),
    comprobarDiagrama: () => quiz.comprobarDiagrama(),
    cancelarDiagramaTipo: () => quiz.cancelarDiagramaTipo(),
    moverBloque: el => quiz.moverBloque(parseInt(el.dataset.i, 10), parseInt(el.dataset.dir, 10)),
    toggleMulti: el => quiz.toggleMulti(parseInt(el.dataset.idx, 10)),
    toggleMarcadaActual: () => quiz.toggleMarcadaActual(),
    revelarSolucion: () => quiz.revelarSolucion(),
    next: () => next(),
    salir: () => salir(),
    saltarPregunta: () => {
      quiz.saltarPregunta();
      if (sesiones.sesion && sesiones.sesion.modo === "contrarreloj") clearTimerPregunta();
    },
    startContrarreloj: () => startContrarreloj(),
    startSupervivencia: () => startSupervivencia(),
    practicarArrastre: () => practicarArrastre(),
    practicarCasos: () => practicarCasos(),
    practicarDebiles: () => practicarDebiles(),
    practicarTipo: el => practicarTipo(el.dataset.tipo),
    practicarVencidas: () => practicarVencidas(),
    repetirFalladas: () => repetirFalladas(),
    repetirMisma: () => repetirMisma(),
    pintarResultados: el => resultados.pintarResultados(el.dataset.verTodas === "true"),
    // ---- Estudio y referencia ----
    startApuntes: () => apuntesUI.startApuntes(),
    cambiarApunteTema: el => apuntesUI.cambiarApunteTema(el.dataset.tema),
    startStudy: () => estudio.startStudy(),
    cambiarEstudioTipo: el => estudio.cambiarEstudioTipo(el.dataset.tipo),
    toggleMarcadaEstudio: el => estudio.toggleMarcadaEstudio(el.dataset.id),
    toggleStudy: el => estudio.toggleStudy(el),
    startGlosario: () => glosarioUI.startGlosario(),
    cambiarGlosarioCat: el => glosarioUI.cambiarGlosarioCat(el.dataset.id),
    startFlashcards: () => flashcards.startFlashcards(),
    responderFlash: el => flashcards.responderFlash(el.dataset.ok === "true"),
    saltarFlash: () => flashcards.saltarFlash(),
    voltearFlash: () => flashcards.voltearFlash()
  };
}
