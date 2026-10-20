// Coordinador de una respuesta: primero persiste el avance y después delega el XP, la meta
// y los logros a student/session.js. Evita que app.js mezcle ambos servicios.
export function crearRespuesta({
  avance, sesiones,
  alApagarTimer = () => {},
  alPerderVida = () => {}
}) {
  return function registrarRespuesta(id, ok) {
    avance.registrar(id, ok);
    // El bonus de contrarreloj mide contra `sesion.preguntaInicio`; apagar el intervalo
    // conserva ese dato para el servicio.
    if (sesiones.sesion && sesiones.sesion.modo === "contrarreloj") alApagarTimer();
    sesiones.responder(id, ok);
    // La supervivencia pierde vidas dentro del servicio; el badge lo repinta la UI.
    if (sesiones.sesion && sesiones.sesion.modo === "supervivencia") alPerderVida();
  };
}
