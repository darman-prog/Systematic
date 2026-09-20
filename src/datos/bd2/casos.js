// Casos de diagramación de Base de Datos 2.
// Cada caso es una narrativa + un diagrama ER a construir.
const casos = [
  {
    id: "CASO-BD2-01",
    titulo: "Sistema de reservas de hotel",
    tema: "Modelado",
    caso: "Un hotel necesita un sistema para gestionar reservas. Los huéspedes se registran con sus datos personales. Cada habitación tiene un número, tipo (individual/doble/suite) y precio por noche. Una reserva vincula un huésped con una o más habitaciones para un período específico (fecha entrada, fecha salida).",
    diagrama: {
      subtipo: "er",
      nodosPool: ["Huesped", "Habitacion", "Reserva"],
      relacionesEsperadas: [
        { de: "Huesped", a: "Reserva", tipo: "1:N" },
        { de: "Reserva", a: "Habitacion", tipo: "N:M" }
      ],
      exp: "Un <b>huésped</b> puede hacer muchas <b>reservas</b> (1:N), pero cada reserva pertenece a un solo huésped. Una <b>reserva</b> puede incluir varias <b>habitaciones</b> y una habitación puede estar en varias reservas (N:M), lo que requiere una entidad intermedia o una relación muchos-a-muchos directa."
    },
    finales: {
      exito: "Modelo correcto: el hotel puede gestionar reservas de múltiples huéspedes con habitaciones compartidas.",
      parcial: "Modelo parcial: falta alguna relación o cardinalidad incorrecta.",
      fracaso: "Modelo incompleto: el sistema no puede gestionar las reservas correctamente."
    }
  },
  {
    id: "CASO-BD2-02",
    titulo: "Biblioteca universitaria",
    tema: "Modelado",
    caso: "Una biblioteca quiere digitalizar su catálogo. Los libros tienen ISBN, título, autor y año. Los estudiantes tienen matrícula, nombre y carrera. Un estudiante puede prestar varios libros y un libro puede ser prestado a varios estudiantes (en diferentes momentos). Cada préstamo registra fecha de préstamo y fecha de devolución.",
    diagrama: {
      subtipo: "er",
      nodosPool: ["Libro", "Estudiante", "Prestamo"],
      relacionesEsperadas: [
        { de: "Estudiante", a: "Prestamo", tipo: "1:N" },
        { de: "Libro", a: "Prestamo", tipo: "1:N" }
      ],
      exp: "Un <b>estudiante</b> puede tener muchos <b>préstamos</b> (1:N). Un <b>libro</b> puede estar en muchos <b>préstamos</b> (1:N), pero cada préstamo es de un solo libro y un solo estudiante. La entidad <b>Préstamo</b> resuelve la relación N:M original entre Libro y Estudiante, y almacena las fechas."
    },
    finales: {
      exito: "Modelo correcto: la biblioteca puede rastrear qué estudiante tiene qué libro y cuándo devolverlo.",
      parcial: "Modelo parcial: falta la entidad de préstamo o las cardinalidades son incorrectas.",
      fracaso: "Modelo incompleto: no se puede rastrear los préstamos correctamente."
    }
  }
];

export default casos;
