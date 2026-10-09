// Registro único de acciones (ADR 002/009): los elementos declaran data-action con el
// nombre de la función que ejecutan y sus parámetros en data-*; un único listener
// delegado de click los resuelve desde este mapa. No se publica nada en window.
// Organizado por feature para que cada grupo pueda extraerse con sus dependencias.
export function crearAcciones({
  $, persistencia, home, show, toast, icono, saludoSegunHora, perfilUI, datosPerfil,
  config, alternarPausa, confirm, quiz, resultados, apuntesUI, estudio, glosarioUI,
  clearHistory, comenzarPractica, comenzarSimulacro, exportarDatos, goHome,
  irMaterias, irPerfil, iniciarMision, irMisiones, next, practicarArrastre,
  practicarCasos, practicarDebiles, practicarTipo, practicarVencidas, repetirFalladas,
  repetirMisma, resetProgreso, flashcards, sesiones, clearTimerPregunta,
  startContrarreloj, startSupervivencia, salir, seleccionarMateria, seleccionarLenguaje,
  practicarLeccion, rendirExamen, irLenguaje, startEscenarios, jugarEscenario,
  decidirEscenario, continuarEscenario, startCasos, jugarCaso, comprobarCaso,
  diagramasUI, toggleFiltro, toggleFiltroTodos, cuenta, cuentaUI, auth,
  limpiarCachePerfil, nube, fechaSnapshot, aplicarSnapshot
}) {
  return {
    // ---- Onboarding y perfil ----
    guardarNombreOnboarding: () => {
      const entrada = $("onboarding-nombre");
      const valor = entrada ? entrada.value : "";
      if (!valor.trim()) { if (entrada) entrada.focus(); return; }
      persistencia.guardarNombre(valor);
      persistencia.guardarOnboardingHecho();
      home.renderMaterias();
      show("materias");
      toast(icono("nivel", "icono-sm") + saludoSegunHora(persistencia.nombre()) + ". ¡Vamos a estudiar!");
    },
    saltarOnboarding: () => {
      persistencia.guardarOnboardingHecho();
      home.renderMaterias();
      show("materias");
    },
    toggleNombreEditor: () => {
      const editor = $("nombre-editor");
      if (!editor) return;
      const entrada = $("nombre-input");
      entrada.value = persistencia.nombre();
      editor.classList.toggle("hidden");
      if (!editor.classList.contains("hidden")) entrada.focus();
    },
    guardarNombreAjustes: () => {
      const entrada = $("nombre-input");
      if (!entrada) return;
      persistencia.guardarNombre(entrada.value);
      persistencia.guardarOnboardingHecho();
      $("nombre-editor").classList.add("hidden");
      // El Perfil muestra el mismo nombre: si está a la vista, se repinta en el acto.
      if (!$("screen-perfil")?.classList.contains("hidden")) perfilUI.render(datosPerfil());
      toast(icono("check", "icono-sm") + saludoSegunHora(persistencia.nombre()) + (persistencia.nombre() ? ", " + persistencia.nombre() : ""));
    },
    clearHistory: () => clearHistory(),
    resetProgreso: () => resetProgreso(),
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
    saltarPregunta: () => { quiz.saltarPregunta(); if (sesiones.sesion && sesiones.sesion.modo === "contrarreloj") clearTimerPregunta(); },
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
    // ---- Navegación ----
    goHome: () => goHome(),
    irMaterias: () => irMaterias(),
    irPerfil: () => irPerfil(),
    irMisiones: () => irMisiones(),
    iniciarMision: el => iniciarMision(el.dataset.tema),
    exportarDatos: () => exportarDatos(),
    importarArchivo: () => $("import-file").click(),
    // ---- Lenguajes ----
    seleccionarMateria: el => seleccionarMateria(el.dataset.materia),
    seleccionarLenguaje: el => seleccionarLenguaje(el.dataset.lenguaje),
    practicarLeccion: el => practicarLeccion(el.dataset.etapa, el.dataset.leccion),
    rendirExamen: el => rendirExamen(el.dataset.etapa),
    irLenguaje: () => irLenguaje(),
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
    voltearFlash: () => flashcards.voltearFlash(),
    // ---- Escenarios y casos ----
    startEscenarios: () => startEscenarios(),
    jugarEscenario: el => jugarEscenario(el.dataset.id),
    decidirEscenario: el => decidirEscenario(parseInt(el.dataset.idx, 10)),
    continuarEscenario: () => continuarEscenario(),
    startCasos: () => startCasos(),
    jugarCaso: el => jugarCaso(el.dataset.id),
    comprobarCaso: () => comprobarCaso(),
    cancelarDiagramaTipoCaso: () => diagramasUI.cancelarSeleccion(),
    // ---- Cuenta y nube (ADR 008) ----
    irCuenta: () => {
      const usuario = cuenta.estado();
      cuentaUI.pintar(usuario);
      if (!usuario) auth.renderLogin();
      show("cuenta");
    },
    salirCuenta: async () => {
      cuentaUI.procesando(true);
      const r = await cuenta.salir();
      cuentaUI.procesando(false);
      if (!r.ok) { cuentaUI.aviso(r.mensaje, false); return; }
      cuentaUI.pintar(null);
      auth.renderLogin();
    // Salir solo se ofrece desde el Perfil: al cerrar sesión se vuelve a materias.
    // El caché vive en app.js y se reasigna al iniciar: se limpia por callback.
    limpiarCachePerfil();
    irMaterias();
    },
    subirNube: async () => {
      const usuario = cuenta.estado();
      if (!usuario) return;
      cuentaUI.procesando(true);
      const r = await nube.subir(usuario.uid);
      cuentaUI.procesando(false);
      cuentaUI.aviso(r.ok ? "Progreso subido a la nube." : r.mensaje, r.ok);
    },
    restaurarNube: async () => {
      const usuario = cuenta.estado();
      if (!usuario) return;
      cuentaUI.procesando(true);
      const r = await nube.bajar(usuario.uid);
      cuentaUI.procesando(false);
      if (!r.ok) { cuentaUI.aviso(r.mensaje, false); return; }
      // ADR 008: restaurar pisa el progreso local y por eso se pregunta antes, con la fecha.
      const fecha = fechaSnapshot(r.datos);
      const cuando = fecha ? fecha.toLocaleString() : "una fecha desconocida";
      if (!window.confirm("El respaldo es del " + cuando + ". Se reemplazará tu progreso en este dispositivo. ¿Continuar?")) return;
      aplicarSnapshot(r.datos, persistencia);
      location.reload();
    }
  };
}

// El listener delegado vive junto al mapa que resuelve (ADR 002).
export function instalarDelegacion(mapa) {
  document.addEventListener("click", event => {
    const el = event.target.closest("[data-action]");
    if (!el) return;
    const accion = mapa[el.dataset.action];
    if (accion) accion(el);
  });
}
