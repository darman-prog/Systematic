# Base de Datos 2 — Consultas y agrupación

> Fuente derivada de `src/datos/bd2/preguntas.js` (categoría Consultas) y `src/datos/bd2/glorario.js` (categoría `consultas`). Material de estudio para la cátedra.

## SELECT

La sentencia `SELECT` **consulta datos** de una o más tablas. Indica las columnas a mostrar y (opcionalmente) condiciones, agrupaciones y ordenamientos.

### Sintaxis básica

```sql
SELECT columna1, columna2, ...
FROM tabla
WHERE condición
GROUP BY columna
HAVING condición_de_grupo
ORDER BY columna [ASC | DESC];
```

### Ejemplo

```sql
SELECT nombre, salario FROM Profesor;
```

## FROM

Indica la **tabla de la que se leen los datos**. Se puede usar un alias para abreviar:

```sql
SELECT P.nombre, H.hora
FROM Profesor P
JOIN Horas H ON P.ID_Profesor = H.ID_Profesor;
```

## JOIN

Une **filas de dos tablas** mediante una condición. El tipo de JOIN determina qué filas aparecen en el resultado.

### INNER JOIN

Devuelve solo las filas que **tienen coincidencia en ambas tablas**:

```sql
SELECT P.nombre, A.nombre
FROM Profesor P
INNER JOIN Horas H ON P.ID_Profesor = H.ID_Profesor
INNER JOIN Asignatura A ON H.ID_Asignatura = A.ID_Asignatura;
```

### LEFT JOIN (o LEFT OUTER JOIN)

Devuelve **todas las filas de la tabla izquierda**, incluso si no tienen coincidencia en la derecha:

```sql
SELECT P.nombre, A.nombre
FROM Profesor P
LEFT JOIN Horas H ON P.ID_Profesor = H.ID_Profesor
LEFT JOIN Asignatura A ON H.ID_Asignatura = A.ID_Asignatura;
```

## ON

La cláusula **ON** define la **condición de unión** entre las llaves de dos tablas. Se usa después de `JOIN` y antes de `WHERE`/`GROUP BY`:

```sql
... JOIN Horas H ON P.ID_Profesor = H.ID_Profesor
```

## WHERE

Filtra **filas individuales** antes de agrupar. Se aplica sobre columnas individuales:

```sql
SELECT * FROM Profesor WHERE salario > 5000;
```

## GROUP BY

**Agrupa filas** por el valor de una o más columnas para luego **resumirlas** con funciones de agregación (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`).

```sql
SELECT ID_Profesor, COUNT(*) AS num_horas
FROM Horas
GROUP BY ID_Profesor;
```

## HAVING

Filtra **grupos** después de agrupar (`GROUP BY`). Mientras `WHERE` filtra filas, `HAVING` filtra grupos:

```sql
SELECT ID_Profesor, COUNT(*) AS num_horas
FROM Horas
GROUP BY ID_Profesor
HAVING COUNT(*) > 3;
```

## ORDER BY

**Ordena el resultado final**. `ASC` (ascendente, por defecto) o `DESC` (descendente):

```sql
SELECT nombre FROM Profesor ORDER BY salario DESC;
```

## DISTINCT

**Elimina filas duplicadas** del resultado:

```sql
SELECT DISTINCT ID_Profesor FROM Horas;
```

## Cláusulas en orden lógico

El orden lógico de ejecución de las cláusulas es:

```
FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY
```

## Consejos rápidos

- Usa `WHERE` para filtrar filas antes de agrupar; `HAVING` para filtrar grupos después.
- Siempre corre un `SELECT` con el mismo `WHERE` antes de un `UPDATE` o `DELETE` para verificar las filas afectadas.
- `DISTINCT` elimina duplicados del resultado; `GROUP BY` agrupa para resumir.
- El orden lógico es `FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY`.
