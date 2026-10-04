// Escenarios multi-paso de Ingeniería de Software, derivados del caso ERP Naibe/Pepesoft
// (BancoDeInformacion/IngenieriaDeSoftware/Guión de Interesados.md).
const escenarios = [
  {
    id: "ESC-ISW-01",
    titulo: "El ERP de Naibe Colombia",
    tema: "Caso integral",
    intro: "Naibe Colombia reemplaza su ERP de 18 años por JDE, la 3ª implementación del contratista Pepesoft. La fecha de enero ya se movió a febrero, no todos los consultores hablan español y medio proyecto se siente 'de TI'. Eres el gerente de proyecto interno: comienza tu semana.",
    pasos: [
      {
        id: "p1",
        narrativa: "Andrew Belt (gerente del país) sugiere sacar personas del proyecto por una reorganización, y Herman Monster (TI regional) teme atrasarse a marzo. ¿Dónde pones la primera energía?",
        opciones: [
          { texto: "Acta y plan de comunicación: roles, responsables y un tablero único de estado para ambos", feedback: "Correcto: sin un frente único de información, cada interesado improvisa su propia versión del proyecto.", puntos: 2, siguiente: "p2" },
          { texto: "Dejar que TI y el país lo resuelvan entre ellos: tu foco es el software", feedback: "El proyecto se percibe ya como 'de TI': alejarte del conflicto organiza-política refuerza exactamente ese error.", puntos: 0, siguiente: "p2" },
          { texto: "Prometer la fecha de enero para calmar a ambos", feedback: "La fecha de enero ya se descartó: prometerla genera un compromiso que nadie podrá cumplir.", puntos: 0, siguiente: "p2" }
        ]
      },
      {
        id: "p2",
        narrativa: "En las entrevistas (VOC) aparece que la gente siente que el proyecto 'es para ponerles control' y que es de TI, no del negocio. ¿Cómo respondes?",
        opciones: [
          { texto: "Reencuadrarlo como proyecto de negocio: beneficios por área y usuarios claves visibles", feedback: "Correcto: el acta de constitución gana legitimidad cuando cada área ve su beneficio, no un control organizacional.", puntos: 2, siguiente: "p3" },
          { texto: "Enviar un correo corporativo exigiendo compromiso", feedback: "La resistencia descrita es cultural, no de disciplina: un exhorto por correo la endurece.", puntos: 1, siguiente: "p3" },
          { texto: "Ignorarlo: la resistencia se disolverá sola con el entrenamiento", feedback: "Sin gestionar la percepción, el entrenamiento llegará a usuarios que ya decidieron que el sistema es el enemigo.", puntos: 0, siguiente: "p3" }
        ]
      },
      {
        id: "p3",
        narrativa: "Al Good, el analista que conoce a fondo el sistema viejo, apenas participa: no se expresa en inglés y duda de la integración del software. ¿Qué haces con este interesado clave?",
        opciones: [
          { texto: "Documentación y sesiones en español, y canalizar sus hallazgos al blueprinting", feedback: "Correcto: su conocimiento del sistema anterior es oro para el blueprinting; la barrera del idioma no puede costar esa voz.", puntos: 2, siguiente: "p4" },
          { texto: "Pedirle que aprenda inglés antes del cutover", feedback: "El proyecto no puede esperar su inglés: adaptar el canal es más barato que perder al que conoce el sistema viejo.", puntos: 0, siguiente: "p4" },
          { texto: "Reemplazarlo por alguien bilingüe aunque no conozca el sistema viejo", feedback: "Ganas idioma y pierdes memoria institucional: los hallazgos de integración que detecta nadie más los ve venir.", puntos: 1, siguiente: "p4" }
        ]
      },
      {
        id: "p4",
        narrativa: "Yolohago Cuentas (usuario financiera delegada) confunde las instrucciones y acumula su operación diaria. El entrenamiento de los KUs se acerca. ¿Cómo preparas migración y entrenamiento?",
        opciones: [
          { texto: "Plantillas de cargue de datos y sesiones prácticas con ella y los KUs, apoyadas por Pepesoft", feedback: "Correcto: es responsable de pruebas, entrenamiento y migración; plantillas + práctica convierten la confusión en autonomía.", puntos: 2, siguiente: "p5" },
          { texto: "Enviarle el manual en noruego para que se familiarice", feedback: "La documentación debe ajustarse al español y adaptarla es tarea de los KUs: enviarla en noruego agrava la barrera.", puntos: 0, siguiente: "p5" },
          { texto: "Delegar todo en los consultores extranjeros", feedback: "Pepesoft guía, pero la operación queda en Naibe: delegar la transferencia de conocimiento es no hacerlo.", puntos: 1, siguiente: "p5" }
        ]
      },
      {
        id: "p5",
        narrativa: "Llega la decisión del cutover: ¿cómo salen a producción en febrero?",
        opciones: [
          { texto: "Plan de transición guiado por Pepesoft, con pruebas del blueprinting y soporte el primer mes", feedback: "Correcto: cutover guiado + soporte de operación son responsabilidades contratadas del proveedor; úsalas.", puntos: 2, siguiente: "fin" },
          { texto: "Apagar el sistema viejo un viernes y resolver el lunes", feedback: "El cierre del primer trimestre y un sistema en noruego esperando: el lunes sería histórico, en el mal sentido.", puntos: 0, siguiente: "fin" },
          { texto: "Operar ambos sistemas en paralelo indefinidamente, sin fecha de corte", feedback: "El paralelo eterno duplica carga y nunca fuerza el ajuste: sin cutover no hay transición.", puntos: 1, siguiente: "fin" }
        ]
      }
    ],
    finales: {
      exito: "El proyecto respira negocio: interesados alineados, usuarios claves entrenados y un cutover con red. Naibe Colombia sale a operación con control.",
      parcial: "Salen a producción, pero con resistencia y confusión residual: la comunicación y el entrenamiento seguirán cobrando factura.",
      fracaso: "El proyecto queda percibido como un impuesto de TI: resistencia, datos mal cargados y un cutover caótico en marzo, justo con el cierre del trimestre."
    }
  }
];

export default escenarios;
