// Escenarios multi-paso de Base de Datos 2, derivados de los temas del banco
// (índices, integridad, DDL/DML sobre el esquema Profesor-Horas-Asignatura).
const escenarios = [
  {
    id: "ESC-BD2-01",
    titulo: "El colegio crece y las consultas se arrastran",
    tema: "Caso integral",
    intro: "El sistema de horarios (Profesor, Horas y Asignatura) creció a decenas de miles de registros. Cada fin de periodo, la consulta de horarios por profesor tarda demasiado y los usuarios hablan de volver al papel. Tú lideras la respuesta técnica.",
    pasos: [
      {
        id: "p1",
        narrativa: "Antes de tocar nada, ¿cuál es tu primer movimiento?",
        opciones: [
          { texto: "Medir: identificar las consultas lentas y su plan de ejecución", feedback: "Correcto: sin medir, cualquier índice es una apuesta. El plan de ejecución señala dónde se pierde el tiempo.", puntos: 2, siguiente: "p2" },
          { texto: "Crear de una vez índices en todas las columnas de todas las tablas", feedback: "Cada índice acelera lecturas pero frena INSERT/UPDATE y ocupa disco: indexar todo empeora el otro síntoma que ya tienes.", puntos: 0, siguiente: "p2" },
          { texto: "Reescribir la aplicación completa en otro lenguaje", feedback: "El problema está en el acceso a datos, no en el lenguaje: reescribir no toca el plan de ejecución y consume meses.", puntos: 0, siguiente: "p2" }
        ]
      },
      {
        id: "p2",
        narrativa: "El análisis muestra: el filtro siempre es por ID_Profesor en Horas, y los INSERT nocturnos ya tardan. ¿Qué decides?",
        opciones: [
          { texto: "Crear un índice sobre Horas(ID_Profesor)", feedback: "Justo: un índice por la columna de filtrado real acelera la lectura con un costo de escritura mínimo.", puntos: 2, siguiente: "p3" },
          { texto: "Crear índices sobre todas las columnas de Horas", feedback: "Mejoró la lectura, pero los INSERT nocturnos pagan cada índice extra: la reorganización del índice cuesta trabajo en cada inserción.", puntos: 1, siguiente: "p3" },
          { texto: "Eliminar la clave primaria de Horas para acelerar los INSERT", feedback: "La PK es la integridad de la tabla: sin ella admites duplicados y huérfanos para ganar milisegundos.", puntos: 0, siguiente: "p3" }
        ]
      },
      {
        id: "p3",
        narrativa: "Al auditar descubres que al borrar un profesor quedan filas huérfanas en Horas. ¿Cómo proteges la integridad?",
        opciones: [
          { texto: "ON DELETE CASCADE en la FK de Horas hacia Profesor", feedback: "Efecto dominó correcto: al eliminar la causa (profesor), el sistema limpia la consecuencia (horarios) sin huérfanos.", puntos: 2, siguiente: "p4" },
          { texto: "Borrar los horarios a mano antes de cada borrado", feedback: "Funciona mientras lo recuerdes: la integridad que depende de la memoria humana falla justo cuando hay prisa.", puntos: 1, siguiente: "p4" },
          { texto: "Quitar la clave foránea para no estorbar los borrados", feedback: "Sin FK la base deja de protegerse sola: los huérfanos se multiplicarán silenciosamente.", puntos: 0, siguiente: "p4" }
        ]
      },
      {
        id: "p4",
        narrativa: "El director pide 'borrar la tabla de Horas de una vez' para empezar el semestre en limpio. ¿Qué le explicas y ejecutas?",
        opciones: [
          { texto: "DELETE FROM Horas: vacía las filas y conserva la estructura para recargar", feedback: "Válido si la tabla vuelve a usarse igual: DELETE quita los registros y respeta la estructura y sus reglas.", puntos: 1, siguiente: "p5" },
          { texto: "Explicar la diferencia: si no se necesita la estructura, DROP TABLE Horas; si solo se vacía, TRUNCATE/DELETE", feedback: "Correcto: DROP destruye el mueble, DELETE/TRUNCATE vacían los papeles. La decisión depende de si la estructura sigue siendo útil.", puntos: 2, siguiente: "p5" },
          { texto: "DROP DATABASE para no dejar nada suelto", feedback: "Disparaste con escopeta: perdiste Profesor y Asignatura, que nada tenían que ver con el semestre.", puntos: 0, siguiente: "p5" }
        ]
      },
      {
        id: "p5",
        narrativa: "Todo funciona y llega la petición de guardar también teléfono y correo de cada profesor. ¿Cómo cierras el caso?",
        opciones: [
          { texto: "ALTER TABLE Profesor ADD telefono, correo", feedback: "Evolución limpia: ALTER agrega columnas sin perder datos ni duplicar estructura.", puntos: 2, siguiente: "fin" },
          { texto: "Crear Profesor2 con las columnas nuevas y duplicar los datos", feedback: "Dos tablas de profesores es el inicio de una pesadilla de sincronización: la estructura evoluciona, no se clona.", puntos: 1, siguiente: "fin" },
          { texto: "Guardar teléfonos y correos en una sola columna separada por comas", feedback: "Mezclar tipos en una columna rompe la estructura de datos: imposible filtrar, validar o indexar bien.", puntos: 0, siguiente: "fin" }
        ]
      }
    ],
    finales: {
      exito: "La base respira: índices justificados, integridad protegida y una estructura que evolucionó sin perder calidad.",
      parcial: "Se resolvió a medias: hay mejoras, pero quedaron decisiones que volverán a doler cuando los datos sigan creciendo.",
      fracaso: "La consulta sigue lenta y la integridad frágil: cada arreglo improvisado creó un problema nuevo."
    }
  }
];

export default escenarios;
