// Casos de diagramación de Arquitectura de Software.
// Cada caso es una narrativa + un diagrama UML de clases.
const casos = [
  {
    id: "CASO-ASW-01",
    titulo: "Sistema de pagos con múltiples métodos",
    tema: "Patrones de Diseño",
    caso: "Un comercio electrónico necesita soportar múltiples métodos de pago: tarjeta de crédito, PayPal y transferencia bancaria. Todos los métodos de pago deben implementar una interfaz común con métodos pagar() y validar(). Cada método tiene su propia lógica de validación y procesamiento.",
    diagrama: {
      subtipo: "uml-clases",
      nodosPool: ["MetodoPago", "TarjetaCredito", "PayPal", "Transferencia"],
      miembrosPool: [
        { texto: "pagar()", de: "MetodoPago" },
        { texto: "validar()", de: "MetodoPago" },
        { texto: "numeroTarjeta", de: "TarjetaCredito" },
        { texto: "email", de: "PayPal" },
        { texto: "cuentaBancaria", de: "Transferencia" }
      ],
      relacionesEsperadas: [
        { de: "TarjetaCredito", a: "MetodoPago", tipo: "herencia" },
        { de: "PayPal", a: "MetodoPago", tipo: "herencia" },
        { de: "Transferencia", a: "MetodoPago", tipo: "herencia" }
      ],
      exp: "Este es un ejemplo del patrón <b>Strategy</b>: una interfaz común (MetodoPago) con múltiples implementaciones concretas. Cada subclase <b>hereda</b> de MetodoPago y sobrescribe los métodos pagar() y validar() con su lógica específica. El sistema puede agregar nuevos métodos de pago sin modificar el código existente (principio Abierto/Cerrado de SOLID)."
    },
    finales: {
      exito: "Diagrama correcto: el sistema soporta múltiples métodos de pago mediante herencia.",
      parcial: "Diagrama parcial: faltan algunas subclases o miembros.",
      fracaso: "Diagrama incompleto: no se modela correctamente la jerarquía de herencia."
    }
  },
  {
    id: "CASO-ASW-02",
    titulo: "Sistema de notificaciones",
    tema: "Patrones de Diseño",
    caso: "Una aplicación necesita enviar notificaciones por múltiples canales: email, SMS y push. El sistema debe poder enviar notificaciones por un canal específico o por todos simultáneamente. Cada canal tiene su propia implementación de envío.",
    diagrama: {
      subtipo: "uml-clases",
      nodosPool: ["Notificador", "Email", "SMS", "Push"],
      miembrosPool: [
        { texto: "enviar()", de: "Notificador" },
        { texto: "destinatario", de: "Email" },
        { texto: "telefono", de: "SMS" },
        { texto: "tokenDispositivo", de: "Push" }
      ],
      relacionesEsperadas: [
        { de: "Email", a: "Notificador", tipo: "herencia" },
        { de: "SMS", a: "Notificador", tipo: "herencia" },
        { de: "Push", a: "Notificador", tipo: "herencia" }
      ],
      exp: "Otro ejemplo del patrón <b>Strategy</b>: una clase base Notificador con método enviar(), y tres implementaciones concretas (Email, SMS, Push). Cada canal tiene sus propios atributos específicos (destinatario, telefono, tokenDispositivo) y sobrescribe el método enviar() con su lógica de envío."
    },
    finales: {
      exito: "Diagrama correcto: el sistema soporta múltiples canales de notificación.",
      parcial: "Diagrama parcial: faltan algunos canales o miembros.",
      fracaso: "Diagrama incompleto: no se modela la jerarquía de notificaciones."
    }
  }
];

export default casos;
