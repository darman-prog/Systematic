# Base de Datos 2 — DML: Manipulación de datos

> Fuente derivada de `src/datos/bd2/preguntas.js` (categoría DML) y `src/datos/bd2/glorario.js` (categoría `dml`). Material de estudio para la cátedra.

## ¿Qué es el DML?

El **DML (Data Manipulation Language — Lenguaje de Manipulación de Datos)** es el subconjunto de SQL que permite **insertar, modificar y eliminar** filas en las tablas de una base de datos. Los comandos DML son: `INSERT`, `UPDATE` y `DELETE`.

Los comandos DML operan sobre los **datos** (no sobre la estructura de la tabla; para estructura se usa DDL). Todas las operaciones DML pueden filtrarse con la cláusula `WHERE`, que sin ella afecta **toda la tabla**.

---

## INSERT

Comando DML que **agrega filas nuevas** a una tabla. Se indica la tabla, las columnas y los valores.

### Sintaxis

```sql
INSERT INTO tabla (columna1, columna2, ...)
VALUES (valor1, valor2, ...);
```

### Ejemplo

```sql
INSERT INTO Profesor (ID_Profesor, nombre)
VALUES ('P003', 'Eva');
```

### Cláusula VALUES

La cláusula `VALUES` indica los **valores a guardar**, en el mismo orden de las columnas indicadas. Cada fila insertada requiere un conjunto de valores.

## UPDATE

Comando DML que **modifica valores de filas existentes**. Siempre debería acompañarse de `WHERE` para limitar las filas afectadas.

### Sintaxis

```sql
UPDATE tabla
SET columna1 = valor1, columna2 = valor2, ...
WHERE condición;
```

### Ejemplo

```sql
UPDATE Profesor
SET telefono = '555-1234'
WHERE ID_Profesor = 'P001';
```

### Cláusula SET

La cláusula `SET` indica la **columna y el nuevo valor**. Permite actualizar varias columnas separándolas con comas.

```sql
SET telefono = '555', correo = 'ana@uni.edu'
```

### Cláusula WHERE

La cláusula `WHERE` filtra las filas afectadas por `UPDATE`. **Sin ella, la operación modifica todas las filas** de la tabla. Siempre se recomienda correr un `SELECT` con el mismo `WHERE` antes de hacer el `UPDATE` o `DELETE` para verificar qué filas se tocarán.

## DELETE

Comando DML que **borra filas** de una tabla, conservando su estructura. Admite filtro con `WHERE`.

### Sintaxis

```sql
DELETE FROM tabla
WHERE condición;
```

### Ejemplo

```sql
DELETE FROM Horas
WHERE ID_Profesor = 'P001';
```

### Precauciones

- **Siempre usa `WHERE`** en producción. Un `DELETE` sin `WHERE` borra **todas** las filas de la tabla.
- `DELETE` conserva la estructura de la tabla (a diferencia de `DROP` que la elimina por completo, o de `TRUNCATE` que vacía sin filtros).

## Consejos rápidos

- Antes de un `UPDATE` o `DELETE`, corre un `SELECT` con el mismo `WHERE` para ver qué filas tocarás.
- `INSERT` agrega filas; `UPDATE` modifica; `DELETE` elimina. Todos son DML.
- La cláusula `WHERE` filtra antes de la operación; `HAVING` filtra después de agrupar (`GROUP BY`).
