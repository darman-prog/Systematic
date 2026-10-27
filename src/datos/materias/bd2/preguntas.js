const preguntas = [
  {
    id: "P1-001",
    parcial: "Parcial 1",
    tema: "Integridad",
    dificultad: "media",
    tipo: "multiple",
    q: "Si necesitas borrar un registro de la tabla 'Profesor' y quieres que automáticamente se borren sus registros vinculados en la tabla 'Horas', ¿qué regla debes usar?",
    options: ["ON DELETE CASCADE", "DROP TABLE CASCADE", "ALTER DELETE CASCADE"],
    correct: 0,
    exp: "<b>ON DELETE CASCADE</b> funciona como un efecto dominó: si eliminas al profesor (la causa), el sistema limpia en automático sus horarios (la consecuencia) para que no queden datos huérfanos.",
    ref: "InfoQuiz.md#integridad-y-relaciones"
  },
  {
    id: "P1-002",
    parcial: "Parcial 1",
    tema: "DDL",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Cuál es la diferencia conceptual principal entre los comandos DROP y DELETE?",
    options: [
      "DROP borra solo filas de datos; DELETE borra la base de datos entera.",
      "DROP elimina la estructura completa de la tabla (el mueble); DELETE borra los registros internos (los papeles).",
      "Ambos comandos hacen exactamente lo mismo."
    ],
    correct: 1,
    exp: "<b>DROP</b> destruye la tabla por completo con sus columnas y reglas. <b>DELETE</b> solo vacía el contenido de las filas, conservando la estructura.",
    ref: "InfoQuiz.md#explicacion-intuitiva-de-los-conceptos"
  },
  {
    id: "P1-003",
    parcial: "Parcial 1",
    tema: "Índices",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuál de las siguientes afirmaciones sobre los ÍNDICES en bases de datos es FALSA?",
    options: [
      "Aceleran las consultas de búsqueda (SELECT).",
      "Mejoran la velocidad de los procesos de inserción (INSERT) y actualización (UPDATE).",
      "Ocupan espacio adicional en el disco duro."
    ],
    correct: 1,
    exp: "<b>Es FALSA</b> porque los índices alentan los <code>INSERT</code> y <code>UPDATE</code>. Cada vez que agregas datos nuevos, la base de datos debe reorganizar el índice, lo que requiere trabajo extra.",
    ref: "InfoQuiz.md#indices"
  },
  {
    id: "P1-004",
    parcial: "Parcial 1",
    tema: "Índices",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Cuál es una afirmación VERDADERA sobre el uso de Índices?",
    options: [
      "Es buena práctica crear índices para todas las columnas de todas las tablas.",
      "Permiten encontrar datos rápidamente sin necesidad de escanear toda la tabla fila por fila.",
      "Los índices evitan que se borren datos por accidente."
    ],
    correct: 1,
    exp: "Un índice funciona exactamente como el índice de un libro: te dice la página exacta del dato para no tener que leer el libro completo desde la página 1.",
    ref: "InfoQuiz.md#indices"
  },
  {
    id: "P1-005",
    parcial: "Parcial 1",
    tema: "DDL",
    dificultad: "media",
    tipo: "multiple",
    q: "Para definir que la columna 'ID_Profesor' sea la clave principal durante la creación de la tabla, ¿qué sintaxis usas?",
    options: [
      "PRIMARY KEY (ID_Profesor)",
      "KEY ID_Profesor PRIMARY",
      "SET ID_Profesor AS MAIN_KEY"
    ],
    correct: 0,
    exp: "La sintaxis estándar en SQL para definir la clave primaria al final de un <code>CREATE TABLE</code> es declarar la restricción con <b>PRIMARY KEY (nombre_columna)</b>.",
    ref: "InfoQuiz.md#funciones-tecnicas-clave"
  },
  {
    id: "P1-006",
    parcial: "Parcial 1",
    tema: "Consultas",
    dificultad: "dificil",
    tipo: "multiple",
    diagrama: true,
    q: "Quieres listar el código del profesor, su nombre y, en una sola celda, la lista de materias que dicta. ¿Qué tipo de función requieres para agrupar ese texto?",
    options: [
      "Una función de agregación de texto como LISTAGG() o GROUP_CONCAT().",
      "Un comando ALTER TABLE concatenado.",
      "Simplemente un SELECT * FROM Profesor."
    ],
    correct: 0,
    exp: "Cuando necesitas 'empaquetar' múltiples filas de texto (las materias) en una sola línea por profesor, se usan funciones de aglomeración de cadenas como <b>LISTAGG()</b> (Oracle) o <b>GROUP_CONCAT()</b> (MySQL).",
    ref: "InfoQuiz.md#el-reto-de-codigo-relaciones-y-agrupacion"
  },
  {
    id: "P1-007",
    parcial: "Parcial 1",
    tema: "Funciones",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué comando en SQL permite extraer una cantidad específica de caracteres dentro de una cadena de texto?",
    options: ["EXTRACT_CHAR()", "SUBSTR() o SUBSTRING()", "GET_TEXT()"],
    correct: 1,
    exp: "La función <code>SUBSTR(cadena, inicio, longitud)</code> permite recortar pedazos de texto, como extraer los primeros 3 caracteres de un código.",
    ref: "InfoQuiz.md#funciones-tecnicas-clave"
  },
  {
    id: "P1-008",
    parcial: "Parcial 1",
    tema: "Funciones",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué función se utiliza para transformar un tipo de dato numérico a formato de texto/carácter?",
    options: ["TO_CHAR() / CAST(columna AS VARCHAR)", "CONVERT_NUMBER()", "NUM_TO_TEXT()"],
    correct: 0,
    exp: "<b>TO_CHAR()</b> (o <code>CAST</code>) toma un valor numérico (como 100) y lo convierte en una cadena de texto ('100') para poder aplicarle formatos o concatenaciones.",
    ref: "InfoQuiz.md#funciones-tecnicas-clave"
  },
  {
    id: "P1-009",
    parcial: "Parcial 1",
    tema: "Modelado",
    dificultad: "media",
    tipo: "multiple",
    q: "Por buenas prácticas de diseño, ¿por qué es preferible definir un 'ID de identificación' como VARCHAR2 en lugar de NUMBER?",
    options: [
      "Porque los números ocupan demasiado espacio en disco.",
      "Porque los IDs pueden contener letras, guiones o ceros a la izquierda (ej: '00123') que un tipo NUMBER eliminaría.",
      "No hay diferencia, NUMBER siempre es mejor."
    ],
    correct: 1,
    exp: "Si defines un ID como número, el valor '007' se guardará como '7'. Usar <b>VARCHAR2</b> conserva la longitud fija, los ceros iniciales y permite códigos alfanuméricos.",
    ref: "InfoQuiz.md#buenas-practicas-para-ids"
  },
  {
    id: "P1-010",
    parcial: "Parcial 1",
    tema: "DDL",
    dificultad: "facil",
    tipo: "multiple",
    q: "Si quieres modificar una tabla existente para agregarle una columna nueva de datos, ¿qué tipo de comando SQL debes usar?",
    options: [
      "UPDATE (Lenguaje DML)",
      "ALTER TABLE (Lenguaje DDL)",
      "INSERT INTO (Lenguaje DML)"
    ],
    correct: 1,
    exp: "<b>ALTER TABLE</b> modifica la estructura de la base de datos (agrega o quita columnas). <code>UPDATE</code> e <code>INSERT</code> solo cambian los datos que viven dentro de esas columnas.",
    ref: "InfoQuiz.md#temario-a-estudiar"
  },
  {
    id: "P1-011",
    parcial: "Parcial 1",
    tema: "DML",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué comando DML se utiliza para insertar un registro nuevo en una tabla?",
    options: ["INSERT INTO", "UPDATE", "ALTER TABLE"],
    correct: 0,
    exp: "<b>INSERT INTO</b> agrega filas nuevas. <code>UPDATE</code> modifica filas existentes y <code>ALTER TABLE</code> es DDL, porque cambia la estructura.",
    ref: "InfoQuiz.md#comandos-generales"
  },
  {
    id: "P1-012",
    parcial: "Parcial 1",
    tema: "DML",
    dificultad: "facil",
    tipo: "multiple",
    q: "Necesitas cambiar el número de teléfono de un profesor que ya existe en la tabla. ¿Qué comando usas?",
    options: ["UPDATE ... SET", "INSERT INTO", "CREATE TABLE"],
    correct: 0,
    exp: "<b>UPDATE ... SET</b> cambia valores de filas existentes. Recuerda acompañarlo siempre de la cláusula <code>WHERE</code> para no afectar a todos los registros.",
    ref: "InfoQuiz.md#comandos-generales"
  },
  {
    id: "P1-013",
    parcial: "Parcial 1",
    tema: "DML",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué ocurre si ejecutas UPDATE Profesor SET telefono = '000' sin cláusula WHERE?",
    options: [
      "Se actualizan TODAS las filas de la tabla.",
      "Se actualiza únicamente la primera fila.",
      "Da error de sintaxis y no cambia nada."
    ],
    correct: 0,
    exp: "Sin <code>WHERE</code>, el motor aplica el cambio a <b>todas</b> las filas. Regla de oro: antes de ejecutar un <code>UPDATE</code> o <code>DELETE</code>, verifica el filtro.",
    ref: "InfoQuiz.md#comandos-generales"
  },
  {
    id: "P1-014",
    parcial: "Parcial 1",
    tema: "Consultas",
    dificultad: "media",
    tipo: "multiple",
    diagrama: true,
    q: "Debes mostrar el código del profesor, su nombre y sus materias. ¿Qué entidades debes unir?",
    options: [
      "Profesor, Horas y Asignatura.",
      "Solo Profesor y Asignatura.",
      "Profesor y Horas únicamente."
    ],
    correct: 0,
    exp: "<b>Horas</b> es la tabla puente entre Profesor y Asignatura. Sin unir las tres entidades no hay forma de llegar desde el docente hasta las materias que dicta.",
    ref: "InfoQuiz.md#el-reto-de-codigo-relaciones-y-agrupacion"
  },
  {
    id: "P1-015",
    parcial: "Parcial 1",
    tema: "Integridad",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué garantiza una PRIMARY KEY sobre una columna?",
    options: [
      "Valores únicos y no nulos que identifican cada fila.",
      "Permite duplicados siempre que sean números.",
      "Ordena automáticamente la tabla por esa columna."
    ],
    correct: 0,
    exp: "La llave primaria identifica cada fila de forma única: no admite duplicados ni valores <code>NULL</code>, lo que la hace el ancla de las relaciones.",
    ref: "InfoQuiz.md#funciones-tecnicas-clave"
  },
  {
    id: "P1-016",
    parcial: "Parcial 1",
    tema: "Integridad",
    dificultad: "media",
    tipo: "multiple",
    diagrama: true,
    q: "En la tabla Horas, la columna ID_Profesor apunta a la tabla Profesor. ¿Cómo se llama esa relación?",
    options: [
      "Llave foránea (FOREIGN KEY).",
      "Llave primaria (PRIMARY KEY).",
      "Índice único."
    ],
    correct: 0,
    exp: "Una <b>FOREIGN KEY</b> referencia la PRIMARY KEY de otra tabla y garantiza la integridad referencial: no puede existir un horario de un profesor que no esté registrado.",
    ref: "InfoQuiz.md#el-reto-de-codigo-relaciones-y-agrupacion"
  },
  {
    id: "P1-017",
    parcial: "Parcial 1",
    tema: "Funciones",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué devuelve SUBSTR('INGENIERIA', 1, 4)?",
    options: ["'INGE'", "'NIER'", "'INGENIERIA'"],
    correct: 0,
    exp: "<code>SUBSTR(cadena, inicio, longitud)</code>: desde la posición 1 toma 4 caracteres, es decir, <b>'INGE'</b>.",
    ref: "InfoQuiz.md#funciones-tecnicas-clave"
  },
  {
    id: "P1-018",
    parcial: "Parcial 1",
    tema: "Funciones",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuál expresión convierte el número 2026 en el texto '2026'?",
    options: ["CAST(2026 AS VARCHAR)", "TO_NUMBER('2026')", "INT(2026)"],
    correct: 0,
    exp: "<code>CAST(columna AS VARCHAR)</code>, o <code>TO_CHAR()</code> en Oracle, convierte un número a texto. <code>TO_NUMBER</code> hace lo contrario.",
    ref: "InfoQuiz.md#funciones-tecnicas-clave"
  },
  {
    id: "P1-019",
    parcial: "Parcial 1",
    tema: "DDL",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué ocurre al ejecutar DROP TABLE Horas?",
    options: [
      "Se elimina la tabla completa con su estructura y sus datos.",
      "Solo se vacían los datos y la estructura permanece.",
      "La tabla se renombra a Horas_old."
    ],
    correct: 0,
    exp: "<b>DROP</b> elimina estructura y datos por completo. Si solo quieres borrar las filas conservando la tabla, se usa <code>DELETE</code> (o <code>TRUNCATE</code>).",
    ref: "InfoQuiz.md#temario-a-estudiar"
  },
  {
    id: "P1-020",
    parcial: "Parcial 1",
    tema: "DDL",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿A qué categoría SQL pertenece el comando ALTER TABLE?",
    options: [
      "DDL (definición de datos).",
      "DML (manipulación de datos).",
      "DCL (control de datos)."
    ],
    correct: 0,
    exp: "<b>ALTER</b> es DDL porque modifica la <i>estructura</i> (columnas, restricciones), no los datos. DML es para el contenido: <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>.",
    ref: "InfoQuiz.md#temario-a-estudiar"
  },
  {
    id: "P1-021",
    parcial: "Parcial 1",
    tema: "Consultas",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cómo quedan las materias al usar LISTAGG() o GROUP_CONCAT()?",
    options: [
      "En una sola celda, separadas por comas.",
      "En filas repetidas, una por materia.",
      "En columnas separadas, una por materia."
    ],
    correct: 0,
    exp: "Estas funciones <b>empaquetan</b> varias filas de texto en una sola columna, normalmente separadas por comas, agrupadas por profesor con <code>GROUP BY</code>.",
    ref: "InfoQuiz.md#explicacion-intuitiva-de-los-conceptos"
  },
  {
    id: "P1-022",
    parcial: "Parcial 1",
    tema: "Modelado",
    dificultad: "facil",
    tipo: "multiple",
    q: "Quieres guardar el código '00123' exactamente con sus ceros a la izquierda. ¿Qué tipo de dato usas?",
    options: ["VARCHAR2", "NUMBER", "FLOAT"],
    correct: 0,
    exp: "<b>NUMBER</b> guardaría 123 y perdería los ceros iniciales. <b>VARCHAR2</b> conserva el formato exacto del código.",
    ref: "InfoQuiz.md#buenas-practicas-para-ids"
  },
  {
    id: "P1-023",
    parcial: "Parcial 1",
    tema: "DML",
    dificultad: "facil",
    tipo: "codigo",
    q: "Observa la sentencia. ¿Qué hace exactamente?",
    codigo: "DELETE FROM Profesor WHERE ID_Profesor = 'P001';",
    options: [
      "Borra únicamente el profesor con ID 'P001'.",
      "Borra toda la tabla Profesor.",
      "Elimina la columna ID_Profesor de la tabla."
    ],
    correct: 0,
    exp: "<code>DELETE</code> borra filas y el <code>WHERE</code> limita el borrado al profesor 'P001'. Sin el filtro, borraría todos los registros.",
    ref: "InfoQuiz.md#comandos-generales"
  },
  {
    id: "P1-024",
    parcial: "Parcial 1",
    tema: "DDL",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué efecto tiene esta sentencia sobre la tabla?",
    codigo: "ALTER TABLE Profesor ADD correo VARCHAR2(50);",
    options: [
      "Agrega una columna nueva llamada correo.",
      "Borra la columna correo.",
      "Cambia el tipo de dato de todas las columnas."
    ],
    correct: 0,
    exp: "<code>ALTER TABLE ... ADD</code> modifica la estructura agregando la columna <b>correo</b> de tipo <code>VARCHAR2(50)</code>, sin tocar los datos existentes.",
    ref: "InfoQuiz.md#temario-a-estudiar"
  },
  {
    id: "P1-025",
    parcial: "Parcial 1",
    tema: "Consultas",
    dificultad: "dificil",
    tipo: "codigo",
    diagrama: true,
    q: "¿Qué logra esta consulta sobre las tablas Profesor, Horas y Asignatura?",
    codigo: "SELECT P.nombre,\n       LISTAGG(A.nombre, ', ') WITHIN GROUP (ORDER BY A.nombre) AS materias\nFROM Profesor P\nJOIN Horas H ON P.ID_Profesor = H.ID_Profesor\nJOIN Asignatura A ON H.ID_Asignatura = A.ID_Asignatura\nGROUP BY P.nombre;",
    options: [
      "Muestra cada profesor con todas sus materias en una sola columna separadas por comas.",
      "Cuenta cuántas materias tiene cada profesor.",
      "Elimina las materias duplicadas de la tabla Asignatura."
    ],
    correct: 0,
    exp: "Los <code>JOIN</code> conectan Profesor con Asignatura a través de la tabla puente Horas, y <b>LISTAGG</b> empaqueta las materias en una sola celda, agrupando por profesor.",
    ref: "InfoQuiz.md#el-reto-de-codigo-relaciones-y-agrupacion"
  },
  {
    id: "P1-026",
    parcial: "Parcial 1",
    tema: "Funciones",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Cuál es el resultado de la columna 'prefijo' para el código 'BASE123'?",
    codigo: "SELECT SUBSTR(codigo, 1, 4) AS prefijo\nFROM Estudiante;",
    options: ["'BASE'", "'123'", "'BASE123'"],
    correct: 0,
    exp: "<code>SUBSTR(codigo, 1, 4)</code> toma 4 caracteres desde la posición 1: <b>'BASE'</b>. Para obtener '123' se usaría <code>SUBSTR(codigo, 5, 3)</code>.",
    ref: "InfoQuiz.md#funciones-tecnicas-clave"
  },
  {
    id: "P1-027",
    parcial: "Parcial 1",
    tema: "DDL",
    dificultad: "facil",
    tipo: "vf",
    q: "El comando DELETE elimina la estructura de la tabla además de sus filas.",
    options: ["Verdadero", "Falso"],
    correct: 1,
    exp: "<b>Falso.</b> <code>DELETE</code> solo borra filas; la estructura y columnas permanecen. Para eliminar la estructura completa se usa <code>DROP TABLE</code>.",
    ref: "InfoQuiz.md#explicacion-intuitiva-de-los-conceptos"
  },
  {
    id: "P1-028",
    parcial: "Parcial 1",
    tema: "Índices",
    dificultad: "media",
    tipo: "vf",
    q: "Un índice acelera las consultas SELECT, pero puede ralentizar los INSERT y UPDATE.",
    options: ["Verdadero", "Falso"],
    correct: 0,
    exp: "<b>Verdadero.</b> El índice acelera la búsqueda porque evita escanear toda la tabla, pero cada <code>INSERT</code> o <code>UPDATE</code> obliga a reorganizarlo.",
    ref: "InfoQuiz.md#indices"
  },
  {
    id: "P1-029",
    parcial: "Parcial 1",
    tema: "Integridad",
    dificultad: "media",
    tipo: "vf",
    q: "ON DELETE CASCADE elimina automáticamente los registros hijos cuando se borra el registro padre.",
    options: ["Verdadero", "Falso"],
    correct: 0,
    exp: "<b>Verdadero.</b> Es el efecto dominó: al borrar el registro padre, los hijos que lo referencian se eliminan para no quedar huérfanos.",
    ref: "InfoQuiz.md#integridad-y-relaciones"
  },
  {
    id: "P1-030",
    parcial: "Parcial 1",
    tema: "Modelado",
    dificultad: "facil",
    tipo: "vf",
    q: "Definir un ID como NUMBER conserva los ceros a la izquierda, como en '00123'.",
    options: ["Verdadero", "Falso"],
    correct: 1,
    exp: "<b>Falso.</b> <code>NUMBER</code> guarda 123 y pierde los ceros iniciales. Para conservarlos se usa <code>VARCHAR2</code>.",
    ref: "InfoQuiz.md#buenas-practicas-para-ids"
  },
  {
    id: "P1-031",
    parcial: "Parcial 1",
    tema: "DDL",
    dificultad: "facil",
    tipo: "vf",
    q: "ALTER TABLE sirve para modificar la estructura de una tabla existente (por ejemplo, agregar una columna).",
    options: ["Verdadero", "Falso"],
    correct: 0,
    exp: "<b>Verdadero.</b> <code>ALTER TABLE</code> es DDL y trabaja sobre el 'mueble': agrega, elimina o modifica columnas y restricciones.",
    ref: "InfoQuiz.md#temario-a-estudiar"
  },
  {
    id: "P1-032",
    parcial: "Parcial 1",
    tema: "Consultas",
    dificultad: "dificil",
    tipo: "dragdrop",
    diagrama: true,
    q: "Completa la consulta que muestra cada profesor con sus materias en una sola celda:",
    codigo: "SELECT P.nombre,\n       {1}(A.nombre, ', ') {2} (ORDER BY A.nombre) AS materias\nFROM Profesor P\nJOIN Horas H ON P.ID_Profesor = H.ID_Profesor\nJOIN Asignatura A ON H.ID_Asignatura = A.ID_Asignatura\n{3} P.nombre;",
    respuestas: ["LISTAGG", "WITHIN GROUP", "GROUP BY"],
    piezas: ["WITHIN GROUP", "GROUP BY", "COUNT", "LISTAGG", "ORDER BY"],
    exp: "<b>LISTAGG</b> empaqueta el texto, <b>WITHIN GROUP (ORDER BY ...)</b> define el orden dentro de la lista y <b>GROUP BY</b> agrupa el resultado por profesor.",
    ref: "InfoQuiz.md#el-reto-de-codigo-relaciones-y-agrupacion"
  },
  {
    id: "P1-033",
    parcial: "Parcial 1",
    tema: "DML",
    dificultad: "media",
    tipo: "dragdrop",
    q: "Completa la sentencia que actualiza el teléfono de un solo profesor:",
    codigo: "UPDATE Profesor\n{1} telefono = '555-0000'\n{2} ID_Profesor = 'P001';",
    respuestas: ["SET", "WHERE"],
    piezas: ["WHERE", "VALUES", "SET", "INTO"],
    exp: "<b>SET</b> indica la columna y el nuevo valor; <b>WHERE</b> limita la actualización a un único registro. Sin WHERE se actualizarían todos.",
    ref: "InfoQuiz.md#comandos-generales"
  },
  {
    id: "P1-034",
    parcial: "Parcial 1",
    tema: "Consultas",
    dificultad: "dificil",
    tipo: "dragdrop",
    diagrama: true,
    q: "Completa la consulta que une Profesor, Horas y Asignatura:",
    codigo: "SELECT P.nombre, A.nombre\n{1} Profesor P\n{2} Horas H {3} P.ID_Profesor = H.ID_Profesor\n{4} Asignatura A {5} H.ID_Asignatura = A.ID_Asignatura;",
    respuestas: ["FROM", "JOIN", "ON", "JOIN", "ON"],
    piezas: ["JOIN", "ON", "FROM", "JOIN", "ON", "WHERE", "GROUP BY"],
    exp: "<b>FROM</b> define la primera tabla; cada <b>JOIN</b> une otra tabla y cada <b>ON</b> indica la condición de unión entre las llaves.",
    ref: "InfoQuiz.md#el-reto-de-codigo-relaciones-y-agrupacion"
  },
  {
    id: "P1-035",
    parcial: "Parcial 1",
    tema: "Consultas",
    dificultad: "dificil",
    tipo: "ordenar",
    diagrama: true,
    q: "Ordena los bloques para formar la consulta que muestra cada profesor con todas sus materias en una sola columna:",
    bloques: [
      "SELECT P.nombre,",
      "       LISTAGG(A.nombre, ', ') WITHIN GROUP (ORDER BY A.nombre) AS materias",
      "FROM Profesor P",
      "JOIN Horas H ON P.ID_Profesor = H.ID_Profesor",
      "JOIN Asignatura A ON H.ID_Asignatura = A.ID_Asignatura",
      "GROUP BY P.nombre;"
    ],
    exp: "El orden lógico es <b>SELECT</b> (qué columnas), <b>FROM</b> (tabla base), los <b>JOIN</b> con sus <b>ON</b> (unir tablas) y <b>GROUP BY</b> (agrupar por profesor).",
    ref: "InfoQuiz.md#el-reto-de-codigo-relaciones-y-agrupacion"
  },
  {
    id: "P1-036",
    parcial: "Parcial 1",
    tema: "DDL",
    dificultad: "media",
    tipo: "ordenar",
    q: "Ordena los bloques para crear la tabla puente Horas con llave primaria compuesta y llaves foráneas:",
    bloques: [
      "CREATE TABLE Horas (",
      "  ID_Profesor VARCHAR2(10) REFERENCES Profesor(ID_Profesor),",
      "  ID_Asignatura VARCHAR2(10) REFERENCES Asignatura(ID_Asignatura),",
      "  PRIMARY KEY (ID_Profesor, ID_Asignatura)",
      ");"
    ],
    exp: "Primero se abre el <code>CREATE TABLE</code>, luego las columnas con sus <b>REFERENCES</b> (llaves foráneas) y al final la restricción <b>PRIMARY KEY</b> compuesta, que usa las dos columnas para evitar horarios duplicados.",
    ref: "InfoQuiz.md#funciones-tecnicas-clave"
  },
  {
    id: "P1-037",
    parcial: "Parcial 1",
    tema: "Consultas",
    dificultad: "dificil",
    tipo: "desarrollo",
    diagrama: true,
    q: "Escribe la consulta que muestre el código del profesor, su nombre y la lista de materias que dicta en una sola columna.",
    solucion: "SELECT P.ID_Profesor, P.nombre,\n       LISTAGG(A.nombre, ', ') WITHIN GROUP (ORDER BY A.nombre) AS materias\nFROM Profesor P\nJOIN Horas H ON P.ID_Profesor = H.ID_Profesor\nJOIN Asignatura A ON H.ID_Asignatura = A.ID_Asignatura\nGROUP BY P.ID_Profesor, P.nombre;",
    claves: ["SELECT", "LISTAGG", "WITHIN GROUP", "JOIN", "GROUP BY"],
    exp: "Se necesitan los <b>JOIN</b> con la tabla puente <b>Horas</b> para llegar de Profesor a Asignatura, y <b>LISTAGG</b> con <b>GROUP BY</b> para empaquetar las materias en una sola celda.",
    ref: "InfoQuiz.md#el-reto-de-codigo-relaciones-y-agrupacion"
  },
  {
    id: "P1-038",
    parcial: "Parcial 1",
    tema: "DDL",
    dificultad: "media",
    tipo: "desarrollo",
    q: "Escribe la sentencia para crear la tabla Horas con llave primaria compuesta y llaves foráneas hacia Profesor y Asignatura.",
    solucion: "CREATE TABLE Horas (\n  ID_Profesor VARCHAR2(10) REFERENCES Profesor(ID_Profesor),\n  ID_Asignatura VARCHAR2(10) REFERENCES Asignatura(ID_Asignatura),\n  PRIMARY KEY (ID_Profesor, ID_Asignatura)\n);",
    claves: ["CREATE TABLE", "REFERENCES", "PRIMARY KEY"],
    exp: "La llave primaria compuesta se declara con <b>PRIMARY KEY (col1, col2)</b> y cada clave foránea con <b>REFERENCES tabla(columna)</b>.",
    ref: "InfoQuiz.md#funciones-tecnicas-clave"
  },
  {
    id: "P1-039",
    parcial: "Parcial 1",
    tema: "DML",
    dificultad: "facil",
    tipo: "dragdrop",
    q: "Completa la sentencia que inserta una estudiante nueva:",
    codigo: "INSERT {1} Estudiante (ID_Estudiante, nombre)\n{2} ('E001', 'Ana');",
    respuestas: ["INTO", "VALUES"],
    piezas: ["VALUES", "INTO", "SET", "WHERE"],
    exp: "<b>INSERT INTO</b> indica la tabla destino y <b>VALUES</b> los datos que se guardarán en las columnas indicadas.",
    ref: "InfoQuiz.md#comandos-generales"
  },
  {
    id: "P1-040",
    parcial: "Parcial 1",
    tema: "DDL",
    dificultad: "dificil",
    tipo: "dragdrop",
    q: "Completa la definición de la tabla Horas con su llave primaria compuesta y sus llaves foráneas:",
    codigo: "CREATE TABLE Horas (\n  ID_Profesor VARCHAR2(10),\n  ID_Asignatura VARCHAR2(10),\n  {1} (ID_Profesor, ID_Asignatura),\n  {2} (ID_Profesor) {3} Profesor(ID_Profesor),\n  {4} (ID_Asignatura) {5} Asignatura(ID_Asignatura)\n);",
    respuestas: ["PRIMARY KEY", "FOREIGN KEY", "REFERENCES", "FOREIGN KEY", "REFERENCES"],
    piezas: ["FOREIGN KEY", "REFERENCES", "PRIMARY KEY", "FOREIGN KEY", "REFERENCES", "CHECK", "DEFAULT"],
    exp: "La <b>PRIMARY KEY</b> compuesta usa las dos columnas para que no se repita un horario. Cada <b>FOREIGN KEY ... REFERENCES tabla(columna)</b> conecta con la tabla padre.",
    ref: "InfoQuiz.md#funciones-tecnicas-clave"
  },
  {
    id: "P1-041",
    parcial: "Parcial 1",
    tema: "Consultas",
    dificultad: "media",
    tipo: "dragdrop",
    caso: "El área de nómina quiere listar los profesores que ganan más de 3000, ordenados alfabéticamente.",
    q: "Completa la consulta del caso:",
    codigo: "SELECT nombre, salario\n{1} Profesor\n{2} salario {3} 3000\n{4} nombre {5};",
    respuestas: ["FROM", "WHERE", ">", "ORDER BY", "ASC"],
    piezas: ["ORDER BY", "WHERE", "FROM", ">", "ASC", "GROUP BY", "="],
    exp: "<b>FROM</b> indica la tabla, <b>WHERE salario > 3000</b> filtra las filas y <b>ORDER BY nombre ASC</b> ordena de la A a la Z.",
    ref: "InfoQuiz.md#comandos-generales"
  },
  {
    id: "P1-042",
    parcial: "Parcial 1",
    tema: "Consultas",
    dificultad: "media",
    tipo: "dragdrop",
    diagrama: true,
    q: "Completa la consulta que cuenta cuántos horarios tiene cada profesor:",
    codigo: "SELECT ID_Profesor, {1}(*) AS total_horarios\nFROM Horas\n{2} ID_Profesor;",
    respuestas: ["COUNT", "GROUP BY"],
    piezas: ["GROUP BY", "COUNT", "ORDER BY", "SUM", "WHERE"],
    exp: "<b>COUNT(*)</b> cuenta las filas y <b>GROUP BY ID_Profesor</b> hace una cuenta separada por cada profesor.",
    ref: "InfoQuiz.md#comandos-generales"
  },
  {
    id: "P1-043",
    parcial: "Parcial 1",
    tema: "Integridad",
    dificultad: "media",
    tipo: "dragdrop",
    diagrama: true,
    caso: "Al borrar un profesor, sus horarios deben eliminarse automáticamente para no quedar huérfanos.",
    q: "Completa la clave foránea del caso:",
    codigo: "CREATE TABLE Horas (\n  ID_Profesor VARCHAR2(10) REFERENCES Profesor(ID_Profesor)\n    {1} DELETE {2},\n  ID_Asignatura VARCHAR2(10) REFERENCES Asignatura(ID_Asignatura)\n);",
    respuestas: ["ON", "CASCADE"],
    piezas: ["ON", "CASCADE", "SET NULL", "RESTRICT", "UPDATE"],
    exp: "La cláusula <b>ON DELETE CASCADE</b> se escribe a continuación de la llave foránea: al borrar el profesor, sus horarios se eliminan en efecto dominó.",
    ref: "InfoQuiz.md#integridad-y-relaciones"
  },
  {
    id: "P1-044",
    parcial: "Parcial 1",
    tema: "Consultas",
    dificultad: "media",
    tipo: "dragdrop",
    diagrama: true,
    q: "Completa la consulta que muestra el nombre del profesor y el código de asignatura de cada horario:",
    codigo: "SELECT P.nombre, H.ID_Asignatura\n{1} Horas H\n{2} Profesor P {3} H.ID_Profesor = P.ID_Profesor;",
    respuestas: ["FROM", "JOIN", "ON"],
    piezas: ["JOIN", "ON", "FROM", "WHERE", "GROUP BY"],
    exp: "<b>FROM Horas H</b> parte de la tabla de horarios, <b>JOIN Profesor P</b> une la tabla de profesores y <b>ON</b> define la condición de unión.",
    ref: "InfoQuiz.md#el-reto-de-codigo-relaciones-y-agrupacion"
  },
  {
    id: "P1-045",
    parcial: "Parcial 1",
    tema: "DML",
    dificultad: "facil",
    tipo: "relacionar",
    q: "Relaciona cada comando con lo que hace:",
    pares: [
      ["INSERT INTO", "Agrega filas nuevas a una tabla"],
      ["UPDATE ... SET", "Modifica valores de filas existentes"],
      ["DELETE FROM", "Borra filas conservando la estructura"],
      ["ALTER TABLE", "Modifica la estructura de la tabla"]
    ],
    exp: "<b>INSERT</b>, <b>UPDATE</b> y <b>DELETE</b> son DML (manipulan datos); <b>ALTER</b> es DDL (cambia la estructura).",
    ref: "InfoQuiz.md#comandos-generales"
  },
  {
    id: "P1-046",
    parcial: "Parcial 1",
    tema: "Funciones",
    dificultad: "media",
    tipo: "relacionar",
    q: "Relaciona cada expresión con su resultado:",
    pares: [
      ["SUBSTR('BASE123', 1, 4)", "'BASE'"],
      ["CAST(2026 AS VARCHAR)", "'2026'"],
      ["LISTAGG(A.nombre, ', ')", "Varias materias en una sola celda"],
      ["COUNT(*)", "Número total de filas"]
    ],
    exp: "<b>SUBSTR</b> recorta texto, <b>CAST/TO_CHAR</b> convierte número a texto, <b>LISTAGG</b> empaqueta filas y <b>COUNT</b> cuenta.",
    ref: "InfoQuiz.md#funciones-tecnicas-clave"
  },
  {
    id: "P1-047",
    parcial: "Parcial 1",
    tema: "Integridad",
    dificultad: "media",
    tipo: "relacionar",
    diagrama: true,
    q: "Relaciona cada concepto con su comportamiento:",
    pares: [
      ["PRIMARY KEY", "Identifica cada fila de forma única"],
      ["FOREIGN KEY", "Referencia la llave primaria de otra tabla"],
      ["ON DELETE CASCADE", "Borra los registros hijos al borrar el padre"],
      ["DROP TABLE", "Elimina la tabla con su estructura y datos"]
    ],
    exp: "Las llaves garantizan la integridad; <b>CASCADE</b> propaga el borrado y <b>DROP</b> destruye la estructura completa.",
    ref: "InfoQuiz.md#integridad-y-relaciones"
  },
  {
    id: "P1-048",
    parcial: "Parcial 1",
    tema: "Modelado",
    dificultad: "facil",
    tipo: "relacionar",
    q: "Relaciona cada elemento con el caso en el que se usa:",
    pares: [
      ["NUMBER", "Datos puramente matemáticos y secuenciales"],
      ["VARCHAR2", "IDs con letras o ceros a la izquierda"],
      ["Índice", "Acelera SELECT y ralentiza INSERT/UPDATE"],
      ["DELETE", "Vacía filas sin borrar la estructura"]
    ],
    exp: "Elige el tipo según el dato: <b>VARCHAR2</b> conserva formatos; el <b>índice</b> acelera lecturas a costa de las escrituras.",
    ref: "InfoQuiz.md#buenas-practicas-para-ids"
  },
  {
    id: "P1-049",
    parcial: "Parcial 1",
    tema: "Funciones",
    dificultad: "media",
    tipo: "codigo",
    caso: "En el código de matrícula, los primeros 3 caracteres indican la carrera y los últimos 3 el número del estudiante.",
    datos: [
      { tabla: "Estudiante", columnas: ["codigo", "nombre"], filas: [["ING123", "Ana"], ["DER456", "Luis"]] }
    ],
    q: "¿Qué devuelve la columna 'carrera' en la primera fila?",
    codigo: "SELECT SUBSTR(codigo, 1, 3) AS carrera\nFROM Estudiante;",
    options: ["'ING'", "'123'", "'ING123'"],
    correct: 0,
    exp: "<code>SUBSTR(codigo, 1, 3)</code> toma los primeros 3 caracteres de 'ING123', es decir <b>'ING'</b>.",
    ref: "InfoQuiz.md#funciones-tecnicas-clave"
  },
  {
    id: "P1-050",
    parcial: "Parcial 1",
    tema: "Consultas",
    dificultad: "media",
    tipo: "codigo",
    caso: "El área académica quiere saber cuántos horarios tiene asignados el profesor P01.",
    datos: [
      { tabla: "Horas", columnas: ["ID_Profesor", "ID_Asignatura"], filas: [["P01", "A1"], ["P01", "A2"], ["P02", "A1"]] }
    ],
    q: "¿Cuál es el resultado de la consulta?",
    codigo: "SELECT COUNT(*) AS total\nFROM Horas\nWHERE ID_Profesor = 'P01';",
    options: ["2", "3", "1"],
    correct: 0,
    exp: "El <code>WHERE</code> deja solo las filas de P01 (dos) y <b>COUNT(*)</b> las cuenta: <b>2</b>.",
    ref: "InfoQuiz.md#comandos-generales"
  },
  {
    id: "P1-051",
    parcial: "Parcial 1",
    tema: "Consultas",
    dificultad: "dificil",
    tipo: "codigo",
    diagrama: true,
    caso: "Se listarán los profesores con la asignatura que dictan, ordenados por nombre.",
    datos: [
      { tabla: "Profesor", columnas: ["ID_Profesor", "nombre"], filas: [["P01", "Ana"], ["P02", "Luis"]] },
      { tabla: "Horas", columnas: ["ID_Profesor", "ID_Asignatura"], filas: [["P01", "A1"], ["P02", "A2"]] },
      { tabla: "Asignatura", columnas: ["ID_Asignatura", "nombre"], filas: [["A1", "Bases de Datos 2"], ["A2", "Cálculo"]] }
    ],
    q: "¿Cuál es la primera fila del resultado?",
    codigo: "SELECT P.nombre AS profesor, A.nombre AS asignatura\nFROM Profesor P\nJOIN Horas H ON P.ID_Profesor = H.ID_Profesor\nJOIN Asignatura A ON H.ID_Asignatura = A.ID_Asignatura\nORDER BY P.nombre;",
    options: ["Ana — Bases de Datos 2", "Luis — Cálculo", "Ana — Cálculo"],
    correct: 0,
    exp: "Los <b>JOIN</b> relacionan las tres tablas: P01 (Ana) dicta A1 (Bases de Datos 2). Al ordenar por nombre, Ana aparece primero.",
    ref: "InfoQuiz.md#el-reto-de-codigo-relaciones-y-agrupacion"
  },
  {
    id: "P1-052",
    parcial: "Parcial 1",
    tema: "Integridad",
    dificultad: "media",
    tipo: "multiple",
    diagrama: true,
    caso: "Al borrar un profesor desde la aplicación, los horarios que tenía asignados quedan huérfanos y rompen los reportes.",
    q: "¿Qué cambio corrige la causa del problema?",
    options: [
      "Definir la llave foránea de Horas con ON DELETE CASCADE.",
      "Crear un índice sobre ID_Profesor en Horas.",
      "Cambiar ID_Profesor a tipo NUMBER."
    ],
    correct: 0,
    exp: "El problema es de integridad referencial: sin <b>ON DELETE CASCADE</b> los hijos quedan huérfanos. El índice ayuda a buscar, pero no evita registros huérfanos.",
    ref: "InfoQuiz.md#integridad-y-relaciones"
  },
  {
    id: "P1-053",
    parcial: "Parcial 1",
    tema: "Modelado",
    dificultad: "media",
    tipo: "multiple",
    caso: "El código de estudiante '00312' se guardó como 312 y ya no coincide con los reportes de la oficina.",
    q: "¿Qué cambio de diseño lo soluciona?",
    options: [
      "Definir el código como VARCHAR2.",
      "Definir el código como NUMBER de más dígitos.",
      "Agregar una PRIMARY KEY sobre nombre."
    ],
    correct: 0,
    exp: "El tipo <b>NUMBER</b> eliminó los ceros a la izquierda. Con <b>VARCHAR2</b> el código conserva el formato exacto '00312'.",
    ref: "InfoQuiz.md#buenas-practicas-para-ids"
  },
  {
    id: "P1-054",
    parcial: "Parcial 1",
    tema: "DML",
    dificultad: "facil",
    tipo: "multiple",
    q: "Al insertar un registro, ¿qué debe coincidir obligatoriamente con la definición de la tabla?",
    options: [
      "El número y el tipo de los valores con las columnas declaradas.",
      "El orden alfabético de las columnas.",
      "El nombre del usuario que ejecuta el INSERT."
    ],
    correct: 0,
    exp: "En <code>INSERT INTO tabla (columnas) VALUES (valores)</code> cada valor debe corresponder al tipo de su columna. Si omites columnas, se llenan con su valor por defecto o <code>NULL</code>.",
    ref: "InfoQuiz.md#comandos-generales"
  },
  {
    id: "P1-055",
    parcial: "Parcial 1",
    tema: "DML",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuál es la diferencia principal entre DELETE y TRUNCATE?",
    options: [
      "DELETE borra filas y admite WHERE; TRUNCATE vacía la tabla completa de una sola vez y no permite filtrar.",
      "TRUNCATE borra una fila a la vez y DELETE borra toda la tabla.",
      "Son exactamente sinónimos."
    ],
    correct: 0,
    exp: "<code>DELETE</code> permite filtrar con <code>WHERE</code> y registra cada borrado; <code>TRUNCATE</code> vacía la tabla completa rápidamente y no acepta filtros de filas.",
    ref: "InfoQuiz.md#comandos-generales"
  },
  {
    id: "P1-056",
    parcial: "Parcial 1",
    tema: "DDL",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué comando usarías para eliminar únicamente la tabla 'Horas' de la base de datos?",
    options: ["DROP TABLE Horas;", "DELETE TABLE Horas;", "DROP COLUMN Horas;"],
    correct: 0,
    exp: "<b>DROP TABLE</b> elimina la tabla completa (estructura y datos). <code>DELETE TABLE</code> no existe en SQL estándar y <code>DROP COLUMN</code> solo aplica a columnas.",
    ref: "InfoQuiz.md#temario-a-estudiar"
  },
  {
    id: "P1-057",
    parcial: "Parcial 1",
    tema: "Índices",
    dificultad: "facil",
    tipo: "vf",
    q: "Un índice acelera las búsquedas por esa columna, pero ocupa espacio adicional en disco.",
    options: ["Verdadero", "Falso"],
    correct: 0,
    exp: "<b>Verdadero.</b> El índice guarda una estructura ordenada que acelera el <code>SELECT</code>, a cambio de espacio en disco y más trabajo en cada <code>INSERT</code>/<code>UPDATE</code>.",
    ref: "InfoQuiz.md#indices"
  },
  {
    id: "P1-058",
    parcial: "Parcial 1",
    tema: "DML",
    dificultad: "facil",
    tipo: "vf",
    q: "En un UPDATE, la cláusula WHERE es opcional; si se omite, se actualizan todas las filas.",
    options: ["Verdadero", "Falso"],
    correct: 0,
    exp: "<b>Verdadero.</b> Sintácticamente el <code>WHERE</code> es opcional, pero sin él se actualiza toda la tabla; por eso se recomienda usarlo siempre.",
    ref: "InfoQuiz.md#comandos-generales"
  },
  {
    id: "P1-059",
    parcial: "Parcial 1",
    tema: "Modelado",
    dificultad: "facil",
    tipo: "vf",
    q: "Un identificador que contiene letras (como 'A-001') debe declararse como VARCHAR2.",
    options: ["Verdadero", "Falso"],
    correct: 0,
    exp: "<b>Verdadero.</b> <code>NUMBER</code> solo admite valores numéricos; para letras, guiones o símbolos se usa <code>VARCHAR2</code>.",
    ref: "InfoQuiz.md#buenas-practicas-para-ids"
  },
  {
    id: "P1-060",
    parcial: "Parcial 1",
    tema: "DML",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué hace exactamente esta sentencia?",
    codigo: "INSERT INTO Profesor (ID_Profesor, nombre)\nVALUES ('P003', 'Eva');",
    options: [
      "Agrega un profesor nuevo con ID 'P003' y nombre 'Eva'.",
      "Modifica el profesor 'P003'.",
      "Consulta el profesor 'P003'."
    ],
    correct: 0,
    exp: "<code>INSERT INTO</code> agrega una fila nueva con los valores indicados, en el mismo orden en que se listan las columnas.",
    ref: "InfoQuiz.md#comandos-generales"
  },
  {
    id: "P1-061",
    parcial: "Parcial 1",
    tema: "Consultas",
    dificultad: "media",
    tipo: "codigo",
    caso: "Se quiere saber cuántos profesores hay registrados en total.",
    datos: [
      { tabla: "Profesor", columnas: ["ID_Profesor", "nombre"], filas: [["P01", "Ana"], ["P02", "Luis"], ["P03", "Eva"]] }
    ],
    q: "¿Cuál es el resultado de la columna 'total'?",
    codigo: "SELECT COUNT(*) AS total\nFROM Profesor;",
    options: ["3", "2", "1"],
    correct: 0,
    exp: "<b>COUNT(*)</b> cuenta todas las filas de la tabla: hay 3 profesores registrados.",
    ref: "InfoQuiz.md#comandos-generales"
  },
  {
    id: "P1-062",
    parcial: "Parcial 1",
    tema: "DDL",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué efecto tiene esta sentencia?",
    codigo: "ALTER TABLE Profesor DROP COLUMN correo;",
    options: [
      "Elimina la columna correo de la tabla Profesor.",
      "Elimina la tabla Profesor completa.",
      "Vacía los datos de correo pero deja la columna."
    ],
    correct: 0,
    exp: "<code>ALTER TABLE ... DROP COLUMN</code> es DDL: elimina la columna y todo su contenido, conservando el resto de la tabla.",
    ref: "InfoQuiz.md#temario-a-estudiar"
  },
  {
    id: "P1-063",
    parcial: "Parcial 1",
    tema: "Funciones",
    dificultad: "media",
    tipo: "codigo",
    q: "¿Qué devuelve la columna 'resto'?",
    codigo: "SELECT SUBSTR('BASE123', 4) AS resto\nFROM dual;",
    options: ["'E123'", "'BASE'", "'123'"],
    correct: 0,
    exp: "<code>SUBSTR</code> con dos argumentos toma desde la posición indicada hasta el final: desde la posición 4 de 'BASE123' queda <b>'E123'</b>.",
    ref: "InfoQuiz.md#funciones-tecnicas-clave"
  },
  {
    id: "P1-064",
    parcial: "Parcial 1",
    tema: "DML",
    dificultad: "media",
    tipo: "dragdrop",
    q: "Completa la sentencia que borra todos los horarios de un profesor:",
    codigo: "DELETE {1} Horas\n{2} ID_Profesor = 'P001';",
    respuestas: ["FROM", "WHERE"],
    piezas: ["FROM", "WHERE", "INTO", "SET", "VALUES"],
    exp: "En <b>DELETE FROM tabla</b> el <b>WHERE</b> limita el borrado; sin él se borrarían todos los horarios.",
    ref: "InfoQuiz.md#comandos-generales"
  },
  {
    id: "P1-065",
    parcial: "Parcial 1",
    tema: "DDL",
    dificultad: "media",
    tipo: "dragdrop",
    caso: "Necesitas guardar el correo de los profesores, pero esa columna no existe todavía.",
    q: "Completa la sentencia del caso:",
    codigo: "ALTER TABLE Profesor\n{1} correo {2}(50);",
    respuestas: ["ADD", "VARCHAR2"],
    piezas: ["ADD", "VARCHAR2", "DROP", "NUMBER", "MODIFY"],
    exp: "<b>ALTER TABLE ... ADD</b> agrega una columna nueva y <b>VARCHAR2(50)</b> define su tipo como texto de hasta 50 caracteres.",
    ref: "InfoQuiz.md#temario-a-estudiar"
  },
  {
    id: "P1-066",
    parcial: "Parcial 1",
    tema: "DML",
    dificultad: "media",
    tipo: "ordenar",
    q: "Ordena los bloques para actualizar el teléfono y el correo de un profesor específico:",
    bloques: [
      "UPDATE Profesor",
      "SET telefono = '555-1234',",
      "    correo = 'ana@uni.edu'",
      "WHERE ID_Profesor = 'P001';"
    ],
    exp: "Primero <b>UPDATE</b> con la tabla, luego <b>SET</b> con las columnas separadas por comas y al final <b>WHERE</b> para afectar solo al profesor indicado.",
    ref: "InfoQuiz.md#comandos-generales"
  },
  {
    id: "P1-067",
    parcial: "Parcial 1",
    tema: "Consultas",
    dificultad: "media",
    tipo: "ordenar",
    diagrama: true,
    q: "Ordena los bloques para listar los profesores que tienen al menos un horario, sin repetirlos y ordenados por código:",
    bloques: [
      "SELECT DISTINCT ID_Profesor",
      "FROM Horas",
      "ORDER BY ID_Profesor;"
    ],
    exp: "<b>SELECT DISTINCT</b> elimina duplicados, <b>FROM</b> indica la tabla y <b>ORDER BY</b> ordena el resultado final.",
    ref: "InfoQuiz.md#comandos-generales"
  },
  {
    id: "P1-068",
    parcial: "Parcial 1",
    tema: "Consultas",
    dificultad: "dificil",
    tipo: "relacionar",
    q: "Relaciona cada cláusula con el momento en que actúa:",
    pares: [
      ["WHERE", "Filtra filas antes de agrupar"],
      ["GROUP BY", "Agrupa filas para resumirlas por columna"],
      ["HAVING", "Filtra grupos después de agrupar"],
      ["ORDER BY", "Ordena el resultado final"]
    ],
    exp: "El orden lógico es <b>WHERE → GROUP BY → HAVING → ORDER BY</b>: primero se filtran filas, luego se agrupan, se filtran grupos y por último se ordena.",
    ref: "InfoQuiz.md#comandos-generales"
  },
  {
    id: "P1-069",
    parcial: "Parcial 1",
    tema: "Funciones",
    dificultad: "media",
    tipo: "relacionar",
    q: "Relaciona cada función con su propósito:",
    pares: [
      ["SUBSTR", "Recorta parte de una cadena de texto"],
      ["TO_CHAR / CAST", "Convierte un número a texto"],
      ["LISTAGG / GROUP_CONCAT", "Une varias filas de texto en una sola"],
      ["COUNT", "Cuenta filas"]
    ],
    exp: "<b>SUBSTR</b> recorta, <b>TO_CHAR</b> convierte tipos, <b>LISTAGG</b> empaqueta texto y <b>COUNT</b> cuenta registros.",
    ref: "InfoQuiz.md#funciones-tecnicas-clave"
  },
  {
    id: "P1-070",
    parcial: "Parcial 1",
    tema: "Índices",
    dificultad: "media",
    tipo: "multiple",
    caso: "Una consulta que filtra por ID_Profesor tarda mucho porque recorre toda la tabla Horas fila por fila.",
    q: "¿Qué acción mejora el tiempo de búsqueda?",
    options: [
      "Crear un índice sobre ID_Profesor en la tabla Horas.",
      "Cambiar ID_Profesor a tipo NUMBER.",
      "Duplicar la tabla Horas."
    ],
    correct: 0,
    exp: "El índice evita el escaneo completo de la tabla: la base de datos salta directo a las filas buscadas. El costo es más trabajo en cada escritura.",
    ref: "InfoQuiz.md#indices"
  },
  {
    id: "P1-071",
    parcial: "Parcial 1",
    tema: "DDL",
    dificultad: "media",
    tipo: "multiple",
    caso: "Necesitas guardar el correo de los profesores, pero la tabla solo tiene ID_Profesor y nombre.",
    q: "¿Qué comandos necesitas, en ese orden?",
    options: [
      "ALTER TABLE Profesor ADD correo VARCHAR2(50); y luego UPDATE para llenar los correos.",
      "UPDATE Profesor SET correo = '...' sobre una columna que no existe.",
      "DROP TABLE Profesor y volver a crearla desde cero."
    ],
    correct: 0,
    exp: "Primero se cambia la <i>estructura</i> con <b>ALTER TABLE ADD</b> (DDL) y después se llenan los <i>datos</i> con <b>UPDATE</b> (DML).",
    ref: "InfoQuiz.md#temario-a-estudiar"
  },
  {
    id: "P1-072",
    parcial: "Parcial 1",
    tema: "Consultas",
    dificultad: "dificil",
    tipo: "codigo",
    caso: "Se quiere ver cuántas asignaturas dicta cada profesor.",
    datos: [
      { tabla: "Horas", columnas: ["ID_Profesor", "ID_Asignatura"], filas: [["P01", "A1"], ["P01", "A2"], ["P02", "A1"]] }
    ],
    q: "¿Qué total muestra la consulta para cada profesor?",
    codigo: "SELECT ID_Profesor, COUNT(*) AS total\nFROM Horas\nGROUP BY ID_Profesor\nORDER BY ID_Profesor;",
    options: [
      "P01 → 2 y P02 → 1",
      "P01 → 1 y P02 → 2",
      "Una sola fila con total 3"
    ],
    correct: 0,
    exp: "<b>GROUP BY ID_Profesor</b> agrupa por profesor y <b>COUNT(*)</b> cuenta por grupo: P01 tiene 2 asignaturas y P02 tiene 1.",
    ref: "InfoQuiz.md#comandos-generales"
  },
  {
    id: "P1-073",
    parcial: "Parcial 1",
    tema: "Consultas",
    dificultad: "dificil",
    tipo: "desarrollo",
    diagrama: true,
    q: "Escribe la consulta que muestre cada código de asignatura y cuántos profesores la dictan, ordenado por código.",
    solucion: "SELECT ID_Asignatura, COUNT(*) AS total_profesores\nFROM Horas\nGROUP BY ID_Asignatura\nORDER BY ID_Asignatura;",
    claves: ["SELECT", "COUNT", "GROUP BY", "ORDER BY"],
    exp: "Se agrupa la tabla puente <b>Horas</b> por asignatura, se cuenta con <b>COUNT</b> y se ordena el resultado con <b>ORDER BY</b>.",
    ref: "InfoQuiz.md#el-reto-de-codigo-relaciones-y-agrupacion"
  },
  {
    id: "P1-074",
    parcial: "Parcial 1",
    tema: "Integridad",
    dificultad: "media",
    tipo: "multiple",
    q: "Si intentas borrar un profesor que tiene horarios asociados y la llave foránea no tiene ON DELETE CASCADE, ¿qué ocurre?",
    options: [
      "La base de datos rechaza el borrado para proteger la integridad referencial.",
      "Se borra el profesor y los horarios quedan huérfanos automáticamente.",
      "Se borran primero todos los horarios."
    ],
    correct: 0,
    exp: "Sin cascada, el motor impide el borrado del padre para no dejar hijos huérfanos: así garantiza la <b>integridad referencial</b>.",
    ref: "InfoQuiz.md#integridad-y-relaciones"
  },
  {
    id: "P1-075",
    parcial: "Parcial 1",
    tema: "Integridad",
    dificultad: "media",
    tipo: "vf",
    q: "Una llave foránea puede apuntar a cualquier columna de otra tabla, aunque no sea única.",
    options: ["Verdadero", "Falso"],
    correct: 1,
    exp: "<b>Falso.</b> Una FK debe referenciar la llave primaria (o una columna única) de la tabla padre; de lo contrario no puede garantizar la integridad referencial.",
    ref: "InfoQuiz.md#integridad-y-relaciones"
  },
  {
    id: "P1-076",
    parcial: "Parcial 1",
    tema: "Funciones",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué devuelve SUBSTR('BD2026', 3, 2)?",
    options: ["'20'", "'BD'", "'2026'"],
    correct: 0,
    exp: "<code>SUBSTR('BD2026', 3, 2)</code> toma 2 caracteres desde la posición 3: <b>'20'</b>.",
    ref: "InfoQuiz.md#funciones-tecnicas-clave"
  },
  {
    id: "P1-077",
    parcial: "Parcial 1",
    tema: "Modelado",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué tipo usarías para un número de recibo secuencial que nunca tendrá letras ni ceros a la izquierda?",
    options: ["NUMBER / INT", "VARCHAR2", "FLOAT"],
    correct: 0,
    exp: "Si el identificador es puramente numérico y autoincremental, <b>NUMBER</b> es adecuado. <b>VARCHAR2</b> se reserva para códigos con formato (letras o ceros iniciales).",
    ref: "InfoQuiz.md#buenas-practicas-para-ids"
  },
  {
    id: "PR-01",
    parcial: "Parcial 1",
    tema: "Consultas",
    dificultad: "facil",
    tipo: "multiple",
    real: true,
    q: "Una consulta en una base de datos es:",
    options: [
      "Ninguna de las anteriores",
      "Una manera de seleccionar información de una o más tablas, visualizada como otra tabla",
      "Una presentación de los datos en la vista de impresión",
      "Una pantalla de introducción, consulta o modificación de datos en una o varias tablas"
    ],
    correct: 1,
    exp: "Una <b>consulta</b> (SELECT) toma datos de una o más tablas y los devuelve <i>como una tabla nueva</i>. La pantalla de introducción describe un formulario y la presentación en vista de impresión describe un reporte.",
    ref: "CapturasInfo (quiz real P1)"
  },
  {
    id: "PR-02",
    parcial: "Parcial 1",
    tema: "Consultas",
    dificultad: "dificil",
    tipo: "desarrollo",
    real: true,
    q: "Escriba una consulta SQL para listar las asignaturas asignadas a cada profesor.",
    datos: [
      { tabla: "Profesor", columnas: ["clv_profesor (PK)", "cod_profesor", "nom_profesor", "clv_area (FK)"], filas: [] },
      { tabla: "Impartir", columnas: ["clv_profesor (FK)", "clv_asign (FK)", "Horas_Total", "Horas_Prac"], filas: [] },
      { tabla: "Asignatura", columnas: ["clv_asign (PK)", "cod_asign", "nom_asign", "Horas_Total", "Horas_Prac", "clv_area (FK)", "clv_titulo (FK)"], filas: [] }
    ],
    solucion: "SELECT P.clv_profesor, P.nom_profesor, A.clv_asign, A.nom_asign\nFROM Profesor P\nJOIN Impartir I ON P.clv_profesor = I.clv_profesor\nJOIN Asignatura A ON I.clv_asign = A.clv_asign;",
    claves: ["SELECT", "FROM", "JOIN", "ON", "Impartir"],
    exp: "Profesor y Asignatura no se tocan directamente: se unen a través de la tabla relación <b>Impartir</b>. Cada <code>JOIN</code> necesita su condición <code>ON</code> entre las claves.",
    ref: "CapturasInfo (quiz real P2)"
  },
  {
    id: "PR-03",
    parcial: "Parcial 1",
    tema: "DML",
    dificultad: "media",
    tipo: "multiple",
    real: true,
    q: "Seleccione la sentencia correcta para actualizar la descripción a UN registro en la tabla RECURSOS:  create table RECURSOS ( recurso VARCHAR2(5) not null, descripcion VARCHAR2(40) not null );",
    options: [
      "UPDATE descripcion = 'Nueva descripcion' WHERE recurso = 'R121';",
      "UPDATE recursos.descripcion = 'Nueva descripcion' WHERE recurso = 'R121';",
      "UPDATE recursos SET descripcion = 'Nueva descripcion';",
      "UPDATE recursos SET descripcion = 'Nueva descripcion' WHERE recurso = 'R121';"
    ],
    correct: 3,
    exp: "La forma completa es <code>UPDATE tabla SET columna = valor WHERE condición</code>. Las dos primeras omiten la tabla o el <code>SET</code>; la tercera no tiene <code>WHERE</code> y actualizaría <b>todos</b> los registros cuando piden solo UNO.",
    ref: "CapturasInfo (quiz real P3)"
  },
  {
    id: "PR-04",
    parcial: "Parcial 1",
    tema: "Modelado",
    dificultad: "media",
    tipo: "relacionar",
    real: true,
    q: "Para el diagrama relacional, defina el tipo de dato (VARCHAR2, NUMBER, DATE) para los campos de la tabla Asignatura. Aplique las buenas prácticas: los campos CLV hacen referencia a claves o identificadores.",
    datos: [
      { tabla: "Asignatura", columnas: ["clv_asign (PK)", "cod_asign", "nom_asign", "Horas_Total", "Horas_Prac", "clv_area (FK)", "clv_titulo (FK)"], filas: [] }
    ],
    pares: [
      ["CLV_ASIGN", "VARCHAR2"],
      ["CLV_AREA", "VARCHAR2"],
      ["CLV_TITULO", "VARCHAR2"],
      ["COD_ASIGN", "VARCHAR2"],
      ["NOMB_ASIGN", "VARCHAR2"],
      ["HORAS_TOTAL", "NUMBER"],
      ["HORAS_PRAC", "NUMBER"]
    ],
    exp: "Regla de diseño: los identificadores <b>CLV</b> y los códigos alfanuméricos van en <code>VARCHAR2</code> (conservan ceros y formato); los nombres en <code>VARCHAR2</code>; las horas, que se suman, en <code>NUMBER</code>. Cualquier campo que espere VARCHAR2 acepta cualquiera de las opciones VARCHAR2: lo que se evalúa es el tipo base, no la posición.",
    ref: "CapturasInfo (quiz real P4)"
  },
  {
    id: "PR-05",
    parcial: "Parcial 1",
    tema: "DDL",
    dificultad: "dificil",
    tipo: "multiple",
    real: true,
    q: "Seleccione la forma correcta para crear la tabla TITULACION",
    options: [
      "CREATE TABLE TITULACION ( cvl_titulo DATE, Cod_titulo NUMBER(3), Nom_titulo NUMBER, CONSTRAINT KEY PRIMARY (cvl_titulo) );",
      "CREATE TABLE TITULACION ( cvl_titulo NUMBER(3), Cod_titulo NUMBER(3), Nom_titulo VARCHAR2(40), CONSTRAINT PRIMARY KEY (cvl_titulo) );",
      "CREATE TABLE TITULACION ( cvl_titulo NUMBER(3), Cod_titulo NUMBER(3), Nom_titulo VARCHAR2(40), CONSTRAINT TITULACION_PK PRIMARY FOREING KEY (cvl_titulo) );",
      "CREATE TABLE TITULACION ( cvl_titulo NUMBER(3), Cod_titulo NUMBER(3), Nom_titulo VARCHAR2(40), CONSTRAINT TITULACION_PK PRIMARY KEY (cvl_titulo) );"
    ],
    correct: 3,
    exp: "La restricción se declara con <code>CONSTRAINT nombre_restriccion PRIMARY KEY (columna)</code>. 'KEY PRIMARY' está invertido; 'CONSTRAINT PRIMARY KEY' queda sin nombre de restricción; 'PRIMARY FOREING KEY' no existe y DATE/NUMBER para el título son tipos equivocados.",
    ref: "CapturasInfo (quiz real P5)"
  },
  {
    id: "PR-06",
    parcial: "Parcial 1",
    tema: "Índices",
    dificultad: "facil",
    tipo: "multiple",
    real: true,
    q: "Seleccione el comando para crear un índice en la base de datos:",
    options: ["CREATE INDEXES", "CREATE TABLE", "CREATE CONSTRAINT", "CREATE INDEX"],
    correct: 3,
    exp: "El comando es <code>CREATE INDEX nombre ON tabla(columna);</code> — en <b>singular</b>. CREATE TABLE crea tablas y CONSTRAINT es una cláusula dentro de CREATE/ALTER, no un comando propio.",
    ref: "CapturasInfo (quiz real P6)"
  },
  {
    id: "PR-07",
    parcial: "Parcial 1",
    tema: "Índices",
    dificultad: "media",
    tipo: "multi",
    real: true,
    q: "Las siguientes afirmaciones sobre los índices son ciertas: (seleccione una o más de una)",
    options: [
      "Para crear un índice ordinario al mismo tiempo que creamos la tabla se usa la opción INDEX",
      "Después de crear la tabla no se pueden crear índices en una tabla",
      "El índice tiene un funcionamiento similar al índice de un libro, guardando parejas de elementos: el elemento que se desea indexar y su posición en la base de datos",
      "Un índice que no es primario permite valores duplicados"
    ],
    correctos: [0, 2, 3],
    exp: "La falsa es la segunda: después de crear la tabla SÍ se pueden crear índices con <code>CREATE INDEX</code>. Las demás son correctas: opción INDEX en el CREATE TABLE, parejas (valor, posición) como el índice de un libro y índice no primario admite duplicados.",
    ref: "CapturasInfo (quiz real P7)"
  },
  {
    id: "PR-08",
    parcial: "Parcial 1",
    tema: "DML",
    dificultad: "facil",
    tipo: "relacionar",
    real: true,
    q: "Seleccione el uso de cada comando SQL:",
    pares: [
      ["Borrar una tabla", "DROP TABLE"],
      ["Modificar estructura de una tabla", "ALTER TABLE"],
      ["Insertar datos", "INSERT"],
      ["Actualizar datos", "UPDATE"],
      ["Seleccionar datos", "SELECT"],
      ["Eliminar datos", "DELETE"]
    ],
    exp: "<b>DROP/ALTER TABLE</b> son DDL (manejan la estructura); <b>INSERT, UPDATE, SELECT y DELETE</b> son DML (manejan los datos). DROP borra el mueble, DELETE borra solo el contenido.",
    ref: "CapturasInfo (quiz real P8)"
  },
  {
    id: "PR-09",
    parcial: "Parcial 1",
    tema: "Funciones",
    dificultad: "media",
    tipo: "relacionar",
    real: true,
    q: "Indique el uso de las siguientes funciones:",
    pares: [
      ["Poner en mayúscula una palabra", "UPPER"],
      ["Añade a la fecha el número de meses indicado", "ADD_MONTHS"],
      ["Redondear o quitar decimales de un número", "ROUND"],
      ["Obtener la posición de un carácter dentro de una cadena", "INSTR"],
      ["Devuelve la cantidad de caracteres de un texto", "LENGTH"],
      ["Permite convertir una fecha o un número a texto", "TO_CHAR"]
    ],
    exp: "<code>UPPER</code> → mayúsculas · <code>ADD_MONTHS(fecha, n)</code> → sumar meses · <code>ROUND</code> → redondear · <code>INSTR</code> → posición de un carácter · <code>LENGTH</code> → conteo de caracteres · <code>TO_CHAR</code> → conversión a texto.",
    ref: "CapturasInfo (quiz real P9)"
  },
  {
    id: "PR-10",
    parcial: "Parcial 1",
    tema: "Índices",
    dificultad: "dificil",
    tipo: "multi",
    real: true,
    q: "Seleccione todas las opciones que apliquen sobre recomendaciones para crear índices (seleccione una o más de una):",
    options: [
      "Crear índices y evaluar el costo de la consulta; si el costo es más alto, más lenta será una consulta",
      "No crees un índice que se va a usar muy poco. Ejemplo del informe que se saca una vez al año",
      "Simplifica los índices duplicados porque contengan la parte izquierda común",
      "Elimina los índices que no se usan que no sean de maestros",
      "Crea muchos índices complejos"
    ],
    correctos: [0, 1, 2, 3],
    exp: "Las cuatro primeras son correctas: evaluar el costo de cada índice, evitar índices poco usados, simplificar índices duplicados con prefijo común y eliminar índices no utilizados salvo los de tablas maestras. La opción e es falsa: acumular muchos índices complejos castiga las escrituras.",
    ref: "CapturasInfo (quiz real P10)"
  },
  {
    id: "P1-078",
    parcial: "Parcial 1",
    tema: "Modelado",
    dificultad: "media",
    tipo: "diagrama",
    subtipo: "er",
    q: "El colegio necesita su modelo ER: el sistema maneja Estudiante, Curso y la matrícula que los une. Una relación muchos-a-muchos entre Estudiante y Curso se resuelve con una tabla puente (la matrícula). Coloca las 3 entidades y conecta las relaciones correctas.",
    nodosPool: ["Estudiante", "Curso", "Matricula"],
    relacionesEsperadas: [
      { de: "Estudiante", a: "Matricula", tipo: "1:N" },
      { de: "Curso", a: "Matricula", tipo: "1:N" }
    ],
    exp: "La matrícula es la <b>entidad puente</b>: cada Estudiante tiene muchas Matrículas (1:N) y cada Curso tiene muchas Matrículas (1:N), resolviendo el N:M original. Una relación directa Estudiante—Curso dejaría el modelo sin la tabla que guarda cada inscripción."
  },
  {
    id: "P1-079",
    parcial: "Parcial 1",
    tema: "Modelado",
    dificultad: "facil",
    tipo: "diagrama",
    subtipo: "er",
    q: "Cada profesor dicta varios horarios y cada horario pertenece a un solo profesor. Coloca ambas entidades y su relación.",
    nodosPool: ["Profesor", "Horario"],
    relacionesEsperadas: [
      { de: "Profesor", a: "Horario", tipo: "1:N" }
    ],
    exp: "Un profesor dicta <b>varias</b> filas de horario y cada fila pertenece a <b>un</b> profesor: <b>1:N</b>. Si la relación fuera 1:1, cada profesor solo podría tener un horario."
  },
  {
    id: "P1-080",
    parcial: "Parcial 1",
    tema: "Modelado",
    dificultad: "dificil",
    tipo: "diagrama",
    subtipo: "er",
    q: "Profesor y Asignatura tienen una relación muchos-a-muchos real: un profesor dicta varias asignaturas y cada asignatura la dictan varios profesores. Agrega la tabla puente Horas y conéctala como corresponda con Profesor y Asignatura.",
    nodosPool: ["Profesor", "Horas", "Asignatura"],
    relacionesEsperadas: [
      { de: "Profesor", a: "Horas", tipo: "1:N" },
      { de: "Asignatura", a: "Horas", tipo: "1:N" }
    ],
    exp: "La relación Profesor—Asignatura es <b>N:M</b>, así que se resuelve con la puente <b>Horas</b>: cada puente apunta 1:N a sus dos padres. Conectar Profesor—Asignatura directo como 1:N perdería las combinaciones reales."
  },
  // Lote 018: MongoDB documental (fuentes oficiales: mongodb.com/docs/manual —
  // CRUD, data-modeling y aggregation). NoSQL frente al modelo relacional de BD2.
  {
    id: "P1-081",
    parcial: "Parcial 1",
    tema: "MongoDB",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Cómo se organiza la información en MongoDB frente a las tablas relacionales?",
    options: [
      "En documentos (parecidos a JSON) agrupados en colecciones, sin esquema fijo obligatorio",
      "En tablas con filas y columnas de esquema rígido, igual que Oracle",
      "En archivos de texto plano sin ningún tipo de consulta"
    ],
    correct: 0,
    exp: "MongoDB es <b>documental</b>: guarda <b>documentos BSON</b> en <b>colecciones</b>. Dos documentos de la misma colección pueden tener campos distintos: <b>esquema flexible</b>.",
    ref: "https://www.mongodb.com/docs/manual/core/document/"
  },
  {
    id: "P1-082",
    parcial: "Parcial 1",
    tema: "MongoDB",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué hacen db.coleccion.insertOne() y db.coleccion.insertMany()?",
    options: [
      "Insertan un documento o varios documentos en una colección (creándola si no existe)",
      "Crean índices sobre la colección",
      "Eliminan documentos que cumplan un filtro"
    ],
    correct: 0,
    exp: "<b>Create</b> del CRUD: <code>insertOne({...})</code> para uno, <code>insertMany([{...}, {...}])</code> para varios. Si la colección no existe, MongoDB <b>la crea sola</b>.",
    ref: "https://www.mongodb.com/docs/manual/crud/"
  },
  {
    id: "P1-083",
    parcial: "Parcial 1",
    tema: "MongoDB",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué devuelve db.usuarios.find({ edad: { $gt: 25 } })?",
    options: [
      "Todos los documentos de usuarios con edad mayor a 25",
      "Solo el primer usuario de la colección sin importar la edad",
      "Un error porque $gt no existe en MongoDB"
    ],
    correct: 0,
    exp: "<b>Read</b> del CRUD: <code>find(filtro)</code> con operadores como <code>$gt</code> (mayor que). Equivale al <code>WHERE edad > 25</code> de SQL.",
    ref: "https://www.mongodb.com/docs/manual/tutorial/query-documents/"
  },
  {
    id: "P1-084",
    parcial: "Parcial 1",
    tema: "MongoDB",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué hace db.usuarios.updateOne({ nombre: 'Ana' }, { $set: { edad: 26 } })?",
    options: [
      "Actualiza la edad a 26 en el primer documento con nombre Ana, sin tocar los demás campos",
      "Reemplaza toda la colección por un solo documento",
      "Crea una tabla nueva llamada usuarios"
    ],
    correct: 0,
    exp: "<b>Update</b> del CRUD: el primer objeto es el <b>filtro</b> y <code>$set</code> cambia <b>solo</b> los campos indicados. Sin <code>$set</code> reemplazarías el documento entero.",
    ref: "https://www.mongodb.com/docs/manual/crud/"
  },
  {
    id: "P1-085",
    parcial: "Parcial 1",
    tema: "MongoDB",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué diferencia a deleteOne() de deleteMany()?",
    options: [
      "deleteOne borra el primer documento del filtro y deleteMany borra todos los que cumplan el filtro",
      "deleteOne borra la colección y deleteMany borra la base entera",
      "Son alias del mismo comando sin diferencia"
    ],
    correct: 0,
    exp: "<b>Delete</b> del CRUD: <code>deleteOne({nombre:'Ana'})</code> borra <b>uno</b>; <code>deleteMany({})</code> con filtro vacío <b>vacía la colección</b> (como DELETE sin WHERE, pero la colección sigue existiendo)."
  },
  {
    id: "P1-086",
    parcial: "Parcial 1",
    tema: "MongoDB",
    dificultad: "media",
    tipo: "multiple",
    q: "En MongoDB puedes embeber (anidar) documentos o referenciarlos por _id. ¿Cuándo conviene EMBEBER?",
    options: [
      "Cuando los datos se acceden juntos y pertenecen al mismo contexto (ej. dirección dentro del usuario)",
      "Cuando dos colecciones gigantes se consultan siempre por separado",
      "Nunca: embeber está prohibido en MongoDB"
    ],
    correct: 0,
    exp: "Principio de oro del modelado: <b>lo que se accede junto, se guarda junto</b>. Embeber evita joins y devuelve todo en <b>una sola lectura</b>.",
    ref: "https://www.mongodb.com/docs/manual/data-modeling/"
  },
  {
    id: "P1-087",
    parcial: "Parcial 1",
    tema: "MongoDB",
    dificultad: "dificil",
    tipo: "multiple",
    q: "¿Cuándo conviene REFERENCIAR (guardar _id) en vez de embeber?",
    options: [
      "Cuando el dato embebido crece sin límite, se comparte entre muchos documentos o necesita consistencia independiente",
      "Siempre: referenciar es más rápido en todos los casos",
      "Cuando los documentos son pequeños y se leen juntos"
    ],
    correct: 0,
    exp: "Referencia cuando hay <b>arreglos unbounded</b> (miles de reseñas), <b>muchos-a-muchos</b> o el dato vive solo. Es el equivalente documental a la tabla puente N:M.",
    ref: "https://www.mongodb.com/docs/manual/data-modeling/"
  },
  {
    id: "P1-088",
    parcial: "Parcial 1",
    tema: "MongoDB",
    dificultad: "media",
    tipo: "vf",
    q: "En MongoDB los documentos de una misma colección pueden tener campos y tipos de dato distintos entre sí.",
    options: ["Verdadero", "Falso"],
    correct: 0,
    exp: "<b>Verdadero</b>: esquema flexible y datos polimórficos. Un catálogo puede guardar zapatos (con talla) y libros (con autor) en la <b>misma colección</b>, cosa imposible en una tabla rígida.",
    ref: "https://www.mongodb.com/docs/manual/data-modeling/"
  },
  {
    id: "P1-089",
    parcial: "Parcial 1",
    tema: "MongoDB",
    dificultad: "dificil",
    tipo: "multiple",
    q: "¿Qué garantía de atomicidad ofrecen las escrituras en MongoDB?",
    options: [
      "Toda escritura es atómica a nivel de un solo documento (aunque toque varios campos o arreglos anidados)",
      "Toda escritura es atómica en toda la base de datos como en Oracle",
      "Ninguna: dos escrituras concurrentes siempre se mezclan"
    ],
    correct: 0,
    exp: "Atomicidad <b>por documento</b>: embeber lo que cambia junto te da transacciones gratis. Para varios documentos existen <b>transacciones multi-documento</b>, pero cuestan rendimiento.",
    ref: "https://www.mongodb.com/docs/manual/core/write-operations-atomicity/"
  },
  {
    id: "P1-090",
    parcial: "Parcial 1",
    tema: "MongoDB",
    dificultad: "dificil",
    tipo: "multiple",
    q: "¿Qué hace un pipeline de agregación como db.ventas.aggregate([ { $match: { anio: 2026 } }, { $group: { _id: '$sucursal', total: { $sum: '$monto' } } } ])?",
    options: [
      "Filtra las ventas de 2026 y luego agrupa por sucursal sumando los montos (como WHERE + GROUP BY)",
      "Crea dos colecciones nuevas llamadas match y group",
      "Elimina las ventas anteriores a 2026"
    ],
    correct: 0,
    exp: "Agregación = <b>etapas en tubería</b>: <code>$match</code> filtra (WHERE) y <code>$group</code> agrupa y calcula (GROUP BY + SUM). Potente para reportes sin mover datos al código.",
    ref: "https://www.mongodb.com/docs/manual/aggregation/"
  },
  {
    id: "P1-091",
    parcial: "Parcial 1",
    tema: "MongoDB",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Para qué sirven los índices en MongoDB?",
    options: [
      "Para acelerar las lecturas (find, filtros, ordenamientos) a cambio de espacio en disco y escrituras algo más lentas",
      "Para impedir que se borren documentos por accidente",
      "Para crear copias de seguridad automáticas"
    ],
    correct: 0,
    exp: "Igual que en relacional: el índice es el <b>índice del libro</b> (búsquedas rápidas), pero cada <code>insert/update</code> debe <b>reorganizarlo</b>. Se crean con <code>createIndex()</code>.",
    ref: "https://www.mongodb.com/docs/manual/indexes/"
  },
  {
    id: "P1-092",
    parcial: "Parcial 1",
    tema: "MongoDB",
    dificultad: "dificil",
    tipo: "multiple",
    q: "Vienes de SQL y necesitas el equivalente a un JOIN entre pedidos y clientes. ¿Qué usas en MongoDB y qué prefiere el modelado documental?",
    options: [
      "La etapa $lookup hace el join, pero el modelado prefiere embeber los datos que se leen juntos para evitarlo",
      "Los JOIN no existen ni hay alternativa: hay que migrar a Oracle",
      "$lookup reemplaza al WHERE y siempre es más rápido que embeber"
    ],
    correct: 0,
    exp: "<code>$lookup</code> = <b>JOIN de emergencia</b>. Funciona, pero si lo usas en cada consulta tu modelo pide a gritos <b>embeber</b>. Diseña por patrones de acceso, no por normalización.",
    ref: "https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/"
  },
  {
    id: "P1-093",
    parcial: "Parcial 1",
    tema: "MongoDB",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué es un replica set en MongoDB?",
    options: [
      "Un conjunto de nodos con los mismos datos (primario + secundarios) que da alta disponibilidad: si cae el primario, uno secundario toma su lugar",
      "Una copia de seguridad manual en un archivo .bak",
      "Un tipo de índice compuesto por varias columnas"
    ],
    correct: 0,
    exp: "Replica set = <b>redundancia automática</b>. Escrituras al primario, lecturas replicadas, <b>failover</b> sin intervención. Disponibilidad, no escalado de escritura (eso es sharding)."
  },
  {
    id: "P1-094",
    parcial: "Parcial 1",
    tema: "MongoDB",
    dificultad: "dificil",
    tipo: "multiple",
    q: "¿Qué es el sharding y cuándo lo necesitas?",
    options: [
      "Particionar los datos en fragmentos (shards) repartidos entre servidores cuando el volumen o el tráfico superan a un solo nodo",
      "Fragmentar los documentos para que ocupen menos espacio en disco",
      "Dividir la base en dos: una relacional y una documental"
    ],
    correct: 0,
    exp: "Sharding = <b>escalado horizontal</b>: la shard key decide qué fragmento guarda cada dato. Potente pero con costo operativo; primero agota <b>índices y replica sets</b>."
  },
  {
    id: "P1-095",
    parcial: "Parcial 1",
    tema: "MongoDB",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué es el _id y el ObjectId en un documento MongoDB?",
    options: [
      "La clave primaria obligatoria del documento; el ObjectId es su valor por defecto: un identificador único de 12 bytes con marca de tiempo",
      "Un comentario opcional que describe el documento",
      "La contraseña de acceso a la colección"
    ],
    correct: 0,
    exp: "Todo documento tiene <b>_id único</b> (como el PRIMARY KEY). El <b>ObjectId</b> se genera solo, es globalmente único y hasta dice <b>cuándo</b> se creó el documento."
  },
  // Lote 018: Neo4j y Cypher (fuentes oficiales: neo4j.com/docs — Cypher Manual y
  // Getting Started). Grafos frente al modelo relacional y documental de BD2.
  {
    id: "P1-096",
    parcial: "Parcial 1",
    tema: "Neo4j",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿De qué está hecho un grafo en Neo4j?",
    options: [
      "De nodos (entidades), relaciones (conexiones con dirección y tipo) y propiedades (datos en ambos)",
      "De tablas, filas y columnas como en Oracle",
      "De documentos JSON sueltos sin conexión entre sí"
    ],
    correct: 0,
    exp: "Tres ciudadanos de primera clase: <b>nodos, relaciones y propiedades</b>. A diferencia del relacional, la <b>relación es un dato</b>, no un JOIN que se calcula cada vez.",
    ref: "https://neo4j.com/docs/getting-started/cypher-intro/"
  },
  {
    id: "P1-097",
    parcial: "Parcial 1",
    tema: "Neo4j",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Por qué la sintaxis de Cypher se describe como «ASCII-art»?",
    options: [
      "Porque los dibujos en el código no hacen nada y son decorativos",
      "Porque los paréntesis representan nodos (o) y los corchetes con flecha representan relaciones: (:Ana)-[:CONOCE_A]->(:Luis) se lee como el dibujo del grafo",
      "Porque solo acepta caracteres de arte ASCII y no letras normales"
    ],
    correct: 1,
    exp: "Cypher <b>se ve como el grafo</b>: <code>()</code> son círculos (nodos) y <code>-[]-></code> son flechas (relaciones). Lo que dibujas es lo que consultas.",
    ref: "https://neo4j.com/docs/getting-started/cypher-intro/"
  },
  {
    id: "P1-098",
    parcial: "Parcial 1",
    tema: "Neo4j",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué hace MATCH (p:Persona) RETURN p en Cypher?",
    options: [
      "Busca el patrón (todos los nodos con etiqueta Persona) y devuelve los encontrados",
      "Crea una persona nueva y la devuelve",
      "Borra todas las personas de la base de datos"
    ],
    correct: 0,
    exp: "<code>MATCH</code> = <b>describe el patrón a buscar</b> (como el WHERE que dibuja); <code>RETURN</code> = <b>qué devolver</b> (como el SELECT). Leer en Cypher siempre es MATCH + RETURN.",
    ref: "https://neo4j.com/docs/cypher-manual/current/clauses/match/"
  },
  {
    id: "P1-099",
    parcial: "Parcial 1",
    tema: "Neo4j",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué hace CREATE (s:Persona {nombre:'Ana'})-[r:CONOCE_A]->(l:Persona {nombre:'Luis'})?",
    options: [
      "Crea dos nodos Persona con sus nombres y una relación CONOCE_A entre ellos, devolviéndolos con RETURN",
      "Solo consulta si Ana conoce a Luis sin crear nada",
      "Crea una tabla Persona con dos filas"
    ],
    correct: 0,
    exp: "<code>CREATE</code> = <b>escribe el patrón</b> tal cual lo dibujas: nodos con propiedades entre llaves y relación dirigida. Un solo comando crea el mini-grafo completo."
  },
  {
    id: "P1-100",
    parcial: "Parcial 1",
    tema: "Neo4j",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué son las etiquetas (labels) como :Persona o :Empresa en Neo4j?",
    options: [
      "Etiquetas que agrupan nodos por tipo, como las tablas agrupan filas: permiten filtrar y optimizan la consulta",
      "Comentarios que el motor ignora por completo",
      "Contraseñas de acceso a cada nodo"
    ],
    correct: 0,
    exp: "El label es el <b>«tabla» del grafo</b>: <code>(p:Persona)</code> equivale a buscar en la tabla Persona. Sin label, Cypher revisa <b>todos los nodos</b> (lento en grafos grandes)."
  },
  {
    id: "P1-101",
    parcial: "Parcial 1",
    tema: "Neo4j",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué significan (a)-[:LE_GUSTA]->(b), (a)<-[:LE_GUSTA]-(b) y (a)-[:LE_GUSTA]-(b)?",
    options: [
      "Son tres consultas idénticas sin diferencia",
      "Relación de izquierda a derecha, de derecha a izquierda, y sin dirección (se recorre en ambos sentidos, útil si no conoces la dirección)",
      "La tercera es un error de sintaxis porque toda relación debe llevar flecha"
    ],
    correct: 1,
    exp: "Las relaciones <b>siempre tienen dirección guardada</b>, pero al consultar puedes omitirla. Ojo: sin dirección Cypher recorre <b>ambos sentidos</b> (doble trabajo).",
    ref: "https://neo4j.com/docs/getting-started/cypher-intro/"
  },
  {
    id: "P1-102",
    parcial: "Parcial 1",
    tema: "Neo4j",
    dificultad: "media",
    tipo: "multiple",
    q: "En MATCH (p:Persona)-[r:LE_GUSTA]->(t:Tecnologia) RETURN p, r, t, ¿qué son p, r y t?",
    options: [
      "Variables que enlazan los nodos y la relación para reutilizarlos en el resto de la consulta (aquí, en el RETURN)",
      "Los nombres reales guardados en la base de datos",
      "Tipos de dato como VARCHAR2 o NUMBER"
    ],
    correct: 0,
    exp: "Las variables son <b>amarres temporales</b>: nombras lo que matcheas para usarlo después (filtrar, devolver, seguir navegando). Minúsculas por convención."
  },
  {
    id: "P1-103",
    parcial: "Parcial 1",
    tema: "Neo4j",
    dificultad: "media",
    tipo: "vf",
    q: "En Cypher el tipo de relación siempre lleva dos puntos delante (:LE_GUSTA); sin los dos puntos, [LE_GUSTA] sería una variable de relación, no un tipo.",
    options: ["Verdadero", "Falso"],
    correct: 0,
    exp: "<b>Verdadero</b>. El <code>:</code> distingue tipo de variable. Sin dos puntos, Cypher buscaría <b>todos</b> los tipos de relación (caro y probablemente no lo que quieres).",
    ref: "https://neo4j.com/docs/getting-started/cypher-intro/"
  },
  {
    id: "P1-104",
    parcial: "Parcial 1",
    tema: "Neo4j",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Dónde pueden vivir las propiedades en Neo4j?",
    options: [
      "Solo en los nodos, como las columnas de una tabla",
      "Tanto en nodos como en relaciones (ej. desde: 2020 en un CONOCE_A)",
      "En ningún lado: los grafos no guardan datos, solo conexiones"
    ],
    correct: 1,
    exp: "Ventaja del grafo: la <b>relación también guarda datos</b> (fecha, peso, rol). En relacional ese dato pediría una tabla puente; aquí viaja en la flecha."
  },
  {
    id: "P1-105",
    parcial: "Parcial 1",
    tema: "Neo4j",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué hace MATCH (p:Persona) WHERE p.edad > 30 RETURN p.nombre?",
    options: [
      "Filtra las personas mayores de 30 y devuelve solo sus nombres",
      "Borra las personas menores de 30",
      "Crea una persona de 30 años llamada nombre"
    ],
    correct: 0,
    exp: "<code>WHERE</code> filtra el patrón (como en SQL) y <code>RETURN p.nombre</code> proyecta <b>solo la propiedad</b>, no el nodo entero. Menos datos viajando = más rápido."
  },
  {
    id: "P1-106",
    parcial: "Parcial 1",
    tema: "Neo4j",
    dificultad: "dificil",
    tipo: "multiple",
    q: "¿Cómo borras un nodo que tiene relaciones en Cypher?",
    options: [
      "Con DELETE directo, que borra nodo y relaciones automáticamente",
      "Con DETACH DELETE, que primero suelta sus relaciones y luego borra el nodo",
      "Los nodos con relaciones no se pueden borrar nunca"
    ],
    correct: 1,
    exp: "<code>DELETE</code> solo borra nodos <b>sueltos</b> (protege contra borrados accidentales). <code>DETACH DELETE</code> = <b>suelta las flechas y borra</b>. Piensa en el ON DELETE CASCADE, pero explícito."
  },
  {
    id: "P1-107",
    parcial: "Parcial 1",
    tema: "Neo4j",
    dificultad: "dificil",
    tipo: "multiple",
    q: "¿Qué hace MERGE (p:Persona {nombre:'Ana'})?",
    options: [
      "Busca el patrón y lo crea solo si no existe (el «obtén-o-crea» del grafo, ideal para cargas sin duplicados)",
      "Fusiona dos bases de datos en una sola",
      "Mezcla todas las personas en un único nodo"
    ],
    correct: 0,
    exp: "<code>MERGE</code> = <b>MATCH + CREATE condicional</b>. Cargas el mismo script diez veces y sigues con una sola Ana. El mejor amigo de las importaciones idempotentes."
  },
  {
    id: "P1-108",
    parcial: "Parcial 1",
    tema: "Neo4j",
    dificultad: "dificil",
    tipo: "multiple",
    q: "¿Qué expresa MATCH (a:Persona)-[:CONOCE_A*2..3]->(b:Persona) y por qué es difícil en SQL?",
    options: [
      "Los conocidos a 2 o 3 saltos de distancia; en SQL pediría joins recursivos costosos, en el grafo es navegación nativa",
      "Un error de sintaxis: Cypher no acepta asteriscos",
      "Una multiplicación de dos columnas numéricas"
    ],
    correct: 0,
    exp: "Caminos de <b>longitud variable</b> (<code>*2..3</code>): amigos de amigos (de amigos). El grafo <b>salta flechas</b>; el relacional tendría que auto-joinear la tabla N veces.",
    ref: "https://neo4j.com/docs/cypher-manual/current/patterns/variable-length-paths/"
  },
  {
    id: "P1-109",
    parcial: "Parcial 1",
    tema: "Neo4j",
    dificultad: "dificil",
    tipo: "multiple",
    q: "¿Para qué sirve shortestPath() en Cypher?",
    options: [
      "Para calcular el camino más corto entre dos nodos (ej. grados de separación o ruta mínima), recorriendo relaciones",
      "Para acortar los nombres largos de los nodos",
      "Para comprimir la base de datos y que pese menos"
    ],
    correct: 0,
    exp: "<code>MATCH p = shortestPath((a)-[*]-(b))</code>: el motor <b>explora el grafo</b> hasta conectar ambos. Recomendaciones, rutas, fraude: el pan de cada día de Neo4j.",
    ref: "https://neo4j.com/docs/cypher-manual/current/patterns/shortest-paths/"
  },
  {
    id: "P1-110",
    parcial: "Parcial 1",
    tema: "Neo4j",
    dificultad: "media",
    tipo: "multiple",
    q: "En el modelo relacional las relaciones se implican con claves foráneas y JOINs. ¿Qué cambia en el modelo de grafos?",
    options: [
      "Nada: los grafos también necesitan JOINs para cada consulta",
      "Las relaciones son ciudadanos de primera clase: existen físicamente y se recorren sin calcular JOINs, por eso los grafos brillan en datos muy conectados",
      "Los grafos no pueden guardar relaciones, solo nodos sueltos"
    ],
    correct: 1,
    exp: "En grafos la relación <b>ya está materializada</b>: seguir una flecha es O(1), no un JOIN. Regla práctica: <b>pocas conexiones → relacional/documental; red densa → grafo</b>."
  }
];
export default preguntas;