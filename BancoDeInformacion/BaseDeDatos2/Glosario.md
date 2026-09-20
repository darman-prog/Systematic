# Glosario SQL — Base de Datos 2

Glosario estructurado por categorías, alineado con el temario del quiz. Incluye definición y ejemplo de cada término.

---

## DML — Manipulación de datos

| Término | Definición | Ejemplo |
| ------- | ---------- | ------- |
| **INSERT** | Comando DML que agrega filas nuevas a una tabla. Se indica la tabla, las columnas y los valores. | `INSERT INTO Profesor (ID_Profesor, nombre) VALUES ('P003', 'Eva');` |
| **UPDATE** | Comando DML que modifica valores de filas existentes. Siempre debería acompañarse de `WHERE`. | `UPDATE Profesor SET telefono = '555-1234' WHERE ID_Profesor = 'P001';` |
| **DELETE** | Comando DML que borra filas de una tabla conservando su estructura. Admite filtro con `WHERE`. | `DELETE FROM Horas WHERE ID_Profesor = 'P001';` |
| **SET** | Cláusula del `UPDATE` que indica la columna y el nuevo valor. Permite actualizar varias columnas separándolas con comas. | `SET telefono = '555', correo = 'ana@uni.edu'` |
| **VALUES** | Cláusula del `INSERT` con los valores a guardar, en el mismo orden de las columnas indicadas. | `VALUES ('E001', 'Ana')` |
| **WHERE** | Cláusula que filtra las filas afectadas por `SELECT`, `UPDATE` o `DELETE`. Sin ella, la operación afecta toda la tabla. | `WHERE ID_Profesor = 'P001'` |

## DDL — Definición de datos

| Término | Definición | Ejemplo |
| ------- | ---------- | ------- |
| **CREATE TABLE** | Comando DDL que crea una tabla definiendo columnas, tipos y restricciones. | `CREATE TABLE Asignatura (ID_Asignatura VARCHAR2(10) PRIMARY KEY, nombre VARCHAR2(60));` |
| **ALTER TABLE** | Comando DDL que modifica la estructura de una tabla existente: agrega, elimina o cambia columnas y restricciones. | `ALTER TABLE Profesor ADD correo VARCHAR2(50);` |
| **DROP TABLE** | Comando DDL que elimina una tabla por completo, con su estructura y sus datos. | `DROP TABLE Horas;` |
| **ADD COLUMN** | Acción de `ALTER TABLE` que agrega una columna nueva. | `ALTER TABLE Profesor ADD telefono VARCHAR2(20);` |
| **DROP COLUMN** | Acción de `ALTER TABLE` que elimina una columna y sus datos, conservando el resto de la tabla. | `ALTER TABLE Profesor DROP COLUMN correo;` |
| **TRUNCATE** | Vacía una tabla completa de una vez, sin filtros y conservando la estructura. | `TRUNCATE TABLE Horas;` |

## Integridad y relaciones

| Término | Definición | Ejemplo |
| ------- | ---------- | ------- |
| **PRIMARY KEY** | Identifica cada fila de forma única: no admite duplicados ni `NULL`. Puede ser compuesta. | `PRIMARY KEY (ID_Profesor, ID_Asignatura)` |
| **FOREIGN KEY** | Referencia la llave primaria de otra tabla para garantizar la integridad referencial. | `FOREIGN KEY (ID_Profesor) REFERENCES Profesor(ID_Profesor)` |
| **ON DELETE CASCADE** | Regla de una FK que borra los registros hijos al eliminar el padre. | `REFERENCES Profesor(ID_Profesor) ON DELETE CASCADE` |
| **Integridad referencial** | Garantía de que toda FK apunte a un registro existente; evita hijos huérfanos. | Una fila de Horas no puede referenciar un profesor inexistente. |
| **Registro huérfano** | Fila hija que referencia un padre que ya no existe. | Un horario de un profesor borrado sin cascada. |
| **Llave compuesta** | Llave primaria formada por dos o más columnas; la combinación debe ser única. | `PRIMARY KEY (ID_Profesor, ID_Asignatura)` |

## Índices y rendimiento

| Término | Definición | Ejemplo |
| ------- | ---------- | ------- |
| **Índice** | Estructura auxiliar ordenada que acelera las búsquedas por una columna, como el índice de un libro. | `CREATE INDEX idx_horas_profesor ON Horas(ID_Profesor);` |
| **Escaneo completo (full scan)** | Leer la tabla fila por fila; el índice evita este escaneo al buscar por esa columna. | `SELECT * FROM Horas WHERE ID_Profesor = 'P01';` |
| **Costo de escritura** | Trabajo extra en `INSERT`/`UPDATE` porque los índices deben reorganizarse. | Cada nuevo horario actualiza su índice. |
| **Índice único** | Índice que además impide valores duplicados en la columna. | `CREATE UNIQUE INDEX ON Profesor(correo);` |

## Funciones SQL

| Término | Definición | Ejemplo |
| ------- | ---------- | ------- |
| **SUBSTR / SUBSTRING** | Extrae parte de una cadena indicando posición inicial y cantidad de caracteres. | `SUBSTR('BASE123', 1, 4) → 'BASE'` |
| **TO_CHAR** | Convierte un número o fecha a texto (Oracle). | `TO_CHAR(2026) → '2026'` |
| **CAST** | Convierte un valor de un tipo a otro. | `CAST(2026 AS VARCHAR)` |
| **TO_NUMBER** | Convierte texto a número; inversa de `TO_CHAR`. | `TO_NUMBER('2026') → 2026` |
| **LISTAGG** | Une varias filas de texto en una sola celda, separadas por un delimitador (Oracle). | `LISTAGG(A.nombre, ', ') WITHIN GROUP (ORDER BY A.nombre)` |
| **GROUP_CONCAT** | Equivalente de `LISTAGG` en MySQL. | `GROUP_CONCAT(A.nombre SEPARATOR ', ')` |
| **COUNT** | Cuenta filas. `COUNT(*)` cuenta todas; `COUNT(columna)` ignora los `NULL`. | `SELECT COUNT(*) FROM Horas;` |

## Modelado y tipos de datos

| Término | Definición | Ejemplo |
| ------- | ---------- | ------- |
| **NUMBER / INT** | Tipos numéricos, adecuados para identificadores secuenciales sin letras ni ceros a la izquierda. | `salario NUMBER(10, 2)` |
| **VARCHAR2 / VARCHAR** | Texto de longitud variable; adecuado para IDs con letras, guiones o ceros iniciales. | `ID_Profesor VARCHAR2(10)` |
| **Identificador (ID)** | Campo que identifica de forma única un registro; su tipo depende del formato del dato. | `NUMBER` para recibos; `VARCHAR2` para 'A-001'. |
| **Ceros a la izquierda** | Formato como '00123' que `NUMBER` elimina; `VARCHAR2` lo conserva. | `VARCHAR2` conserva '00312'. |
| **Tipo de dato** | Clase de valor que admite una columna (número, texto, fecha...). | `nombre VARCHAR2(60), salario NUMBER(10,2)` |

## Consultas y agrupación

| Término | Definición | Ejemplo |
| ------- | ---------- | ------- |
| **SELECT** | Consulta datos; indica las columnas a mostrar. | `SELECT nombre, salario FROM Profesor;` |
| **FROM** | Indica la tabla de la que se leen los datos. | `FROM Profesor P` |
| **JOIN** | Une filas de dos tablas mediante una condición. | `JOIN Horas H ON P.ID_Profesor = H.ID_Profesor` |
| **ON** | Condición de unión entre las llaves de dos tablas. | `ON H.ID_Asignatura = A.ID_Asignatura` |
| **GROUP BY** | Agrupa filas por columnas para resumirlas con funciones de agregación. | `GROUP BY P.nombre` |
| **ORDER BY** | Ordena el resultado final (`ASC` o `DESC`). | `ORDER BY nombre ASC` |
| **DISTINCT** | Elimina filas duplicadas del resultado. | `SELECT DISTINCT ID_Profesor FROM Horas;` |
| **HAVING** | Filtra grupos después de agrupar; `WHERE` filtra filas antes. | `HAVING COUNT(*) > 1` |

---

## Tips rápidos

- Antes de un `UPDATE` o `DELETE`, corre un `SELECT` con el mismo `WHERE` para ver qué filas tocarás.
- IDs con letras o ceros a la izquierda → `VARCHAR2`; IDs puramente numéricos → `NUMBER`.
- `LISTAGG` necesita `GROUP BY` y `WITHIN GROUP (ORDER BY ...)` para ordenar la lista.
- Un índice acelera `SELECT`, pero cada `INSERT`/`UPDATE` lo reorganiza.
- `DROP` elimina estructura y datos; `DELETE` solo filas.
- Para Profesor → Asignatura, pasa por la tabla puente `Horas`.
- El orden lógico de cláusulas es `WHERE → GROUP BY → HAVING → ORDER BY`.
