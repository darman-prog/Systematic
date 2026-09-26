# Base de Datos 2 — Funciones SQL

> Fuente derivada de `src/datos/bd2/preguntas.js` (categoría Funciones) y `src/datos/bd2/glorario.js` (categoría `funciones`). Material de estudio para la cátedra.

## ¿Qué son las funciones SQL?

Las **funciones SQL** transforman y calculan valores dentro de una consulta. Se clasifican en:

- **Funciones de agregación**: operan sobre un conjunto de filas y devuelven un valor (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`).
- **Funciones escalares**: operan sobre un valor individual y devuelven un valor (`SUBSTR`, `CAST`, `TO_CHAR`, `TO_NUMBER`).

---

## SUBSTR / SUBSTRING

Extrae una **parte de una cadena** indicando la **posición inicial** y la **cantidad de caracteres**.

```sql
SUBSTR('BASE123', 1, 4)  →  'BASE'
SUBSTR('BASE123', 5, 3)  →  '123'
```

- En Oracle se usa `SUBSTR`.
- En MySQL, PostgreSQL y SQL Server se usa `SUBSTRING` (ambos funcionan en la mayoría de motores).

## TO_CHAR

Convierte un **número o fecha a texto** (Oracle). Permite dar formato a fechas y números.

```sql
TO_CHAR(2026)                     →  '2026'
TO_CHAR(SYSDATE, 'YYYY-MM-DD')    →  '2026-09-20'
TO_CHAR(3.14159, 'FM99.99')       →  '3.14'
```

## TO_NUMBER

Convierte **texto a número**; es la inversa de `TO_CHAR`.

```sql
TO_NUMBER('2026')  →  2026
TO_NUMBER('3.14')  →  3.14
```

## CAST

Convierte un **valor de un tipo a otro**. Funciona en la mayoría de motores SQL.

```sql
CAST(2026 AS VARCHAR(10))     →  '2026'
CAST('2026' AS NUMBER)        →  2026
CAST('2026-09-20' AS DATE)    →  20-sep-26
```

## COUNT

Cuenta filas. `COUNT(*)` cuenta **todas** las filas; `COUNT(columna)` **ignora los valores nulos**:

```sql
SELECT COUNT(*) FROM Horas;           -- cuenta todas las filas
SELECT COUNT(ID_Profesor) FROM Horas;  -- ignora filas con ID_Profesor NULL
SELECT COUNT(DISTINCT ID_Profesor) FROM Horas;  -- valores distintos
```

## LISTAGG (Oracle)

Une varias **filas de texto en una sola celda**, separadas por un delimitador. Necesita `GROUP BY` y `WITHIN GROUP (ORDER BY ...)` para ordenar la lista.

```sql
SELECT LISTAGG(nombre, ', ') WITHIN GROUP (ORDER BY nombre)
FROM Profesor
GROUP BY ID_Asignatura;
```

## GROUP_CONCAT (MySQL)

Equivalente de `LISTAGG` en MySQL. Une filas de texto con un separador.

```sql
SELECT GROUP_CONCAT(nombre SEPARATOR ', ')
FROM Profesor
GROUP BY ID_Asignatura;
```

## Consejos rápidos

- `NUMBER` elimina ceros a la izquierda; `VARCHAR2` los conserva. Usa el tipo correcto según el formato del ID.
- `LISTAGG` requiere `GROUP BY` y `WITHIN GROUP (ORDER BY ...)` para ordenar la lista.
- `COUNT(*)` cuenta todas las filas; `COUNT(columna)` ignora los `NULL`.
