window.GLOSARIO = {
  categorias: [
    { id: "dml", nombre: "DML — Manipulación de datos", corto: "DML", color: "#38bdf8" },
    { id: "ddl", nombre: "DDL — Definición de datos", corto: "DDL", color: "#a78bfa" },
    { id: "integridad", nombre: "Integridad y relaciones", corto: "Integridad", color: "#f472b6" },
    { id: "indices", nombre: "Índices y rendimiento", corto: "Índices", color: "#facc15" },
    { id: "funciones", nombre: "Funciones SQL", corto: "Funciones", color: "#22d3ee" },
    { id: "modelado", nombre: "Modelado y tipos de datos", corto: "Modelado", color: "#34d399" },
    { id: "consultas", nombre: "Consultas y agrupación", corto: "Consultas", color: "#fb923c" }
  ],
  terminos: [
    {
      termino: "INSERT",
      categoria: "dml",
      definicion: "Comando DML que agrega filas nuevas a una tabla. Se indica la tabla, las columnas y los valores.",
      ejemplo: "INSERT INTO Profesor (ID_Profesor, nombre)\nVALUES ('P003', 'Eva');"
    },
    {
      termino: "UPDATE",
      categoria: "dml",
      definicion: "Comando DML que modifica valores de filas existentes. Siempre debería acompañarse de WHERE.",
      ejemplo: "UPDATE Profesor\nSET telefono = '555-1234'\nWHERE ID_Profesor = 'P001';"
    },
    {
      termino: "DELETE",
      categoria: "dml",
      definicion: "Comando DML que borra filas de una tabla conservando su estructura. Admite filtro con WHERE.",
      ejemplo: "DELETE FROM Horas\nWHERE ID_Profesor = 'P001';"
    },
    {
      termino: "SET",
      categoria: "dml",
      definicion: "Cláusula del UPDATE que indica la columna y el nuevo valor. Se pueden actualizar varias columnas separándolas con comas.",
      ejemplo: "SET telefono = '555', correo = 'ana@uni.edu'"
    },
    {
      termino: "VALUES",
      categoria: "dml",
      definicion: "Cláusula del INSERT que contiene los valores que se guardarán, en el mismo orden de las columnas indicadas.",
      ejemplo: "VALUES ('E001', 'Ana')"
    },
    {
      termino: "WHERE",
      categoria: "dml",
      definicion: "Cláusula que filtra las filas afectadas por SELECT, UPDATE o DELETE. Sin ella, la operación afecta toda la tabla.",
      ejemplo: "WHERE ID_Profesor = 'P001'"
    },
    {
      termino: "CREATE TABLE",
      categoria: "ddl",
      definicion: "Comando DDL que crea una tabla definiendo sus columnas, tipos y restricciones.",
      ejemplo: "CREATE TABLE Asignatura (\n  ID_Asignatura VARCHAR2(10) PRIMARY KEY,\n  nombre VARCHAR2(60)\n);"
    },
    {
      termino: "ALTER TABLE",
      categoria: "ddl",
      definicion: "Comando DDL que modifica la estructura de una tabla existente: agrega, elimina o cambia columnas y restricciones.",
      ejemplo: "ALTER TABLE Profesor ADD correo VARCHAR2(50);"
    },
    {
      termino: "DROP TABLE",
      categoria: "ddl",
      definicion: "Comando DDL que elimina una tabla por completo, con su estructura y sus datos. No es lo mismo que vaciar filas.",
      ejemplo: "DROP TABLE Horas;"
    },
    {
      termino: "ADD COLUMN",
      categoria: "ddl",
      definicion: "Acción de ALTER TABLE que agrega una columna nueva a una tabla existente.",
      ejemplo: "ALTER TABLE Profesor ADD telefono VARCHAR2(20);"
    },
    {
      termino: "DROP COLUMN",
      categoria: "ddl",
      definicion: "Acción de ALTER TABLE que elimina una columna y todos sus datos, conservando el resto de la tabla.",
      ejemplo: "ALTER TABLE Profesor DROP COLUMN correo;"
    },
    {
      termino: "TRUNCATE",
      categoria: "ddl",
      definicion: "Comando que vacía una tabla completa de una sola vez, sin permitir filtros y conservando su estructura.",
      ejemplo: "TRUNCATE TABLE Horas;"
    },
    {
      termino: "PRIMARY KEY",
      categoria: "integridad",
      definicion: "Restricción que identifica cada fila de forma única: no admite duplicados ni valores NULL. Puede ser compuesta.",
      ejemplo: "PRIMARY KEY (ID_Profesor, ID_Asignatura)"
    },
    {
      termino: "FOREIGN KEY",
      categoria: "integridad",
      definicion: "Restricción que referencia la llave primaria de otra tabla para garantizar la integridad referencial.",
      ejemplo: "FOREIGN KEY (ID_Profesor) REFERENCES Profesor(ID_Profesor)"
    },
    {
      termino: "ON DELETE CASCADE",
      categoria: "integridad",
      definicion: "Regla de una llave foránea que borra automáticamente los registros hijos cuando se elimina el registro padre.",
      ejemplo: "REFERENCES Profesor(ID_Profesor) ON DELETE CASCADE"
    },
    {
      termino: "Integridad referencial",
      categoria: "integridad",
      definicion: "Garantía de que una llave foránea siempre apunte a un registro existente: no pueden quedar hijos huérfanos.",
      ejemplo: "Una fila de Horas no puede referenciar un profesor inexistente."
    },
    {
      termino: "Registro huérfano",
      categoria: "integridad",
      definicion: "Fila hija que referencia un registro padre que ya no existe. Es el problema que evitan las llaves foráneas y CASCADE.",
      ejemplo: "Un horario de un profesor que fue borrado sin cascada."
    },
    {
      termino: "Llave compuesta",
      categoria: "integridad",
      definicion: "Llave primaria formada por dos o más columnas; la combinación debe ser única. Muy usada en tablas puente.",
      ejemplo: "PRIMARY KEY (ID_Profesor, ID_Asignatura)"
    },
    {
      termino: "Índice",
      categoria: "indices",
      definicion: "Estructura auxiliar ordenada que acelera las búsquedas por una columna. Funciona como el índice de un libro.",
      ejemplo: "CREATE INDEX idx_horas_profesor ON Horas(ID_Profesor);"
    },
    {
      termino: "Escaneo completo (full scan)",
      categoria: "indices",
      definicion: "Leer la tabla fila por fila para encontrar datos. Un índice evita este escaneo cuando se busca por esa columna.",
      ejemplo: "SELECT * FROM Horas WHERE ID_Profesor = 'P01';"
    },
    {
      termino: "Costo de escritura",
      categoria: "indices",
      definicion: "Trabajo extra que genera cada INSERT o UPDATE cuando la tabla tiene índices, porque estos deben reorganizarse.",
      ejemplo: "Cada nuevo horario obliga a actualizar su índice."
    },
    {
      termino: "Índice único",
      categoria: "indices",
      definicion: "Índice que además impide valores duplicados en la columna, garantizando unicidad.",
      ejemplo: "CREATE UNIQUE INDEX ON Profesor(correo);"
    },
    {
      termino: "SUBSTR / SUBSTRING",
      categoria: "funciones",
      definicion: "Función que extrae una parte de una cadena, indicando posición inicial y cantidad de caracteres.",
      ejemplo: "SUBSTR('BASE123', 1, 4) → 'BASE'"
    },
    {
      termino: "TO_CHAR",
      categoria: "funciones",
      definicion: "Función (Oracle) que convierte un número o fecha a texto para poder concatenarlo o darle formato.",
      ejemplo: "TO_CHAR(2026) → '2026'"
    },
    {
      termino: "CAST",
      categoria: "funciones",
      definicion: "Función estándar que convierte un valor de un tipo a otro, por ejemplo número a texto o texto a número.",
      ejemplo: "CAST(2026 AS VARCHAR)"
    },
    {
      termino: "TO_NUMBER",
      categoria: "funciones",
      definicion: "Función que convierte texto a número. Es la operación inversa de TO_CHAR.",
      ejemplo: "TO_NUMBER('2026') → 2026"
    },
    {
      termino: "LISTAGG",
      categoria: "funciones",
      definicion: "Función de agregación (Oracle) que une varias filas de texto en una sola celda, normalmente separadas por comas.",
      ejemplo: "LISTAGG(A.nombre, ', ') WITHIN GROUP (ORDER BY A.nombre)"
    },
    {
      termino: "GROUP_CONCAT",
      categoria: "funciones",
      definicion: "Equivalente de LISTAGG en MySQL: empaqueta los valores de un grupo en una sola cadena separada por comas.",
      ejemplo: "GROUP_CONCAT(A.nombre SEPARATOR ', ')"
    },
    {
      termino: "COUNT",
      categoria: "funciones",
      definicion: "Función de agregación que cuenta filas. COUNT(*) cuenta todas; COUNT(columna) ignora los NULL.",
      ejemplo: "SELECT COUNT(*) FROM Horas;"
    },
    {
      termino: "NUMBER / INT",
      categoria: "modelado",
      definicion: "Tipos numéricos. Adecuados para identificadores secuenciales sin letras ni ceros a la izquierda.",
      ejemplo: "salario NUMBER(10, 2)"
    },
    {
      termino: "VARCHAR2 / VARCHAR",
      categoria: "modelado",
      definicion: "Tipo de texto de longitud variable. Es el adecuado para IDs con letras, guiones o ceros iniciales.",
      ejemplo: "ID_Profesor VARCHAR2(10)"
    },
    {
      termino: "Identificador (ID)",
      categoria: "modelado",
      definicion: "Campo que identifica de forma única un registro. Su tipo se elige según el formato del dato.",
      ejemplo: "NUMBER para recibos; VARCHAR2 para códigos como 'A-001'."
    },
    {
      termino: "Ceros a la izquierda",
      categoria: "modelado",
      definicion: "Formato como '00123' que el tipo NUMBER elimina (queda 123). Para conservarlo se usa VARCHAR2.",
      ejemplo: "VARCHAR2 conserva '00312' tal cual."
    },
    {
      termino: "Tipo de dato",
      categoria: "modelado",
      definicion: "Clase de valor que admite una columna (número, texto, fecha...). Define qué operaciones y formatos son válidos.",
      ejemplo: "nombre VARCHAR2(60), salario NUMBER(10,2)"
    },
    {
      termino: "SELECT",
      categoria: "consultas",
      definicion: "Comando que consulta datos. Indica las columnas a mostrar y se combina con FROM, WHERE, GROUP BY y ORDER BY.",
      ejemplo: "SELECT nombre, salario FROM Profesor;"
    },
    {
      termino: "FROM",
      categoria: "consultas",
      definicion: "Cláusula que indica la tabla de la que se leen los datos.",
      ejemplo: "FROM Profesor P"
    },
    {
      termino: "JOIN",
      categoria: "consultas",
      definicion: "Operación que une filas de dos tablas a partir de una condición. Con tres entidades se encadenan varios JOIN.",
      ejemplo: "JOIN Horas H ON P.ID_Profesor = H.ID_Profesor"
    },
    {
      termino: "ON",
      categoria: "consultas",
      definicion: "Cláusula del JOIN que define la condición de unión entre las llaves de las dos tablas.",
      ejemplo: "ON H.ID_Asignatura = A.ID_Asignatura"
    },
    {
      termino: "GROUP BY",
      categoria: "consultas",
      definicion: "Cláusula que agrupa filas por una o más columnas para resumirlas con funciones de agregación.",
      ejemplo: "GROUP BY P.nombre"
    },
    {
      termino: "ORDER BY",
      categoria: "consultas",
      definicion: "Cláusula que ordena el resultado final, de forma ascendente (ASC) o descendente (DESC).",
      ejemplo: "ORDER BY nombre ASC"
    },
    {
      termino: "DISTINCT",
      categoria: "consultas",
      definicion: "Modificador del SELECT que elimina filas duplicadas del resultado.",
      ejemplo: "SELECT DISTINCT ID_Profesor FROM Horas;"
    },
    {
      termino: "HAVING",
      categoria: "consultas",
      definicion: "Cláusula que filtra grupos después de agrupar, a diferencia de WHERE que filtra filas antes.",
      ejemplo: "HAVING COUNT(*) > 1"
    }
  ],
  tips: [
    "Antes de ejecutar un UPDATE o DELETE, corre primero un SELECT con el mismo WHERE para ver qué filas vas a tocar.",
    "Si un ID puede tener letras, guiones o ceros a la izquierda, decláralo VARCHAR2; NUMBER los elimina.",
    "LISTAGG necesita GROUP BY, y WITHIN GROUP (ORDER BY ...) para que la lista salga ordenada.",
    "Un índice acelera las búsquedas SELECT, pero cada INSERT/UPDATE lo reorganiza: no indexes todas las columnas.",
    "DROP elimina estructura y datos; DELETE solo borra filas. Elige según lo que necesites conservar.",
    "Para llegar de Profesor a Asignatura pasa por la tabla puente Horas: Profesor → Horas → Asignatura.",
    "ON DELETE CASCADE es efecto dominó: al borrar el padre, sus hijos se eliminan para no quedar huérfanos.",
    "PRIMARY KEY = única y no nula; FOREIGN KEY = referencia a la llave primaria de otra tabla.",
    "GROUP BY se escribe después del FROM/JOIN y antes del ORDER BY.",
    "Si un reporte une tres tablas, revisa que cada JOIN tenga su ON apuntando a las llaves correctas."
  ]
};
