// Casos de diagramación de Ingeniería de Software.
// Cada caso es una narrativa + un diagrama de casos de uso o actividades.
const casos = [
  {
    id: "CASO-ISW-01",
    titulo: "Sistema de gestión de tareas",
    tema: "Casos de Uso",
    caso: "Una empresa necesita un sistema para gestionar tareas. Los usuarios pueden registrarse, iniciar sesión, crear tareas, editar tareas y marcar tareas como completadas. Los administradores pueden además eliminar usuarios y ver reportes de productividad.",
    diagrama: {
      subtipo: "casos-uso",
      nodosPool: ["Usuario", "Administrador", "Registrarse", "Iniciar Sesión", "Crear Tarea", "Editar Tarea", "Marcar Completada", "Eliminar Usuario", "Ver Reportes"],
      relacionesEsperadas: [
        { de: "Usuario", a: "Registrarse", tipo: "asociación" },
        { de: "Usuario", a: "Iniciar Sesión", tipo: "asociación" },
        { de: "Usuario", a: "Crear Tarea", tipo: "asociación" },
        { de: "Usuario", a: "Editar Tarea", tipo: "asociación" },
        { de: "Usuario", a: "Marcar Completada", tipo: "asociación" },
        { de: "Administrador", a: "Eliminar Usuario", tipo: "asociación" },
        { de: "Administrador", a: "Ver Reportes", tipo: "asociación" }
      ],
      exp: "Los <b>actores</b> (Usuario y Administrador) se conectan con los <b>casos de uso</b> mediante líneas de <b>asociación</b>. El Usuario tiene acceso a las operaciones básicas de tareas, mientras que el Administrador tiene permisos adicionales para gestionar usuarios y ver reportes."
    },
    finales: {
      exito: "Diagrama correcto: el sistema distingue claramente entre usuarios normales y administradores.",
      parcial: "Diagrama parcial: faltan algunas asociaciones o actores.",
      fracaso: "Diagrama incompleto: no se modelan todos los casos de uso necesarios."
    }
  },
  {
    id: "CASO-ISW-02",
    titulo: "Flujo de aprobación de gastos",
    tema: "Diagramas de Actividad",
    caso: "Una empresa tiene un proceso de aprobación de gastos: un empleado envía la solicitud → el supervisor revisa → si el monto es menor a $1000 se aprueba automáticamente, si es mayor va al director → si se aprueba se procesa el pago, si se rechaza se notifica al empleado.",
    diagrama: {
      subtipo: "actividades",
      nodosPool: ["Enviar Solicitud", "Revisar Supervisor", "¿Monto < $1000?", "Aprobar Automático", "Revisar Director", "Procesar Pago", "Notificar Rechazo"],
      nodosFijos: ["inicio", "fin-aprobado", "fin-rechazado"],
      relacionesEsperadas: [
        { de: "inicio", a: "Enviar Solicitud", tipo: "transición" },
        { de: "Enviar Solicitud", a: "Revisar Supervisor", tipo: "transición" },
        { de: "Revisar Supervisor", a: "¿Monto < $1000?", tipo: "transición" },
        { de: "¿Monto < $1000?", a: "Aprobar Automático", tipo: "transición", guarda: "[sí]" },
        { de: "¿Monto < $1000?", a: "Revisar Director", tipo: "transición", guarda: "[no]" },
        { de: "Aprobar Automático", a: "Procesar Pago", tipo: "transición" },
        { de: "Revisar Director", a: "Procesar Pago", tipo: "transición", guarda: "[aprobado]" },
        { de: "Revisar Director", a: "Notificar Rechazo", tipo: "transición", guarda: "[rechazado]" },
        { de: "Procesar Pago", a: "fin-aprobado", tipo: "transición" },
        { de: "Notificar Rechazo", a: "fin-rechazado", tipo: "transición" }
      ],
      exp: "El flujo muestra un proceso de aprobación con <b>decisiones</b> basadas en el monto. Los nodos de decisión (rombos) tienen salidas con <b>guardas</b> que determinan el camino. El proceso puede terminar en dos estados finales: aprobado o rechazado."
    },
    finales: {
      exito: "Flujo correcto: el proceso de aprobación está completamente modelado con todas las decisiones.",
      parcial: "Flujo parcial: faltan algunas decisiones o guardas.",
      fracaso: "Flujo incompleto: no se modelan todos los caminos posibles."
    }
  }
];

export default casos;
