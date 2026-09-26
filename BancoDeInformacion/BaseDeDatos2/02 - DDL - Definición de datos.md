# Base de Datos 2 — DDL: Definición de datos

> Fuente derivada de `src/datos/bd2/preguntas.js` (categoría DDL) y `src/datos/bd2/glorario.js` (categoría `ddl`). Material de estudio para la cátedra.

## ¿Qué es el DDL?

El **DDL (Data Definition Language — Lenguaje de Definición de Datos)** es el subconjunto de SQL que permite **definir y modificar la estructura** de las tablas y otros objetos de la base de datos. Los comandos DDL son: `CREATE TABLE`, `ALTER TABLE` y `DROP TABLE`.

A diferencia del DML (`INSERT`, `UPDATE`, `DELETE`), el DDL **no afecta los datos directamente** (aunque `DROP TABLE` y `TRUNCATE` sí eliminan datos al borrar la tabla o vaciarla).

---

## CREATE TABLE

Comando DDL que **crea una tabla** definiendo columnas, tipos de datos y restricciones.

### Sintaxis

```sql
CREATE TABLE nombre_tabla (
    columna1 tipo_de_dato [restricción],
    columna2 tipo_de_dato [restricción],
    ...
    [restricciones_de_tabla]
);
```

### Ejemplo

```sql
CREATE TABLE Asignatura (
    ID_Asignatura VARCHAR2(10) PRIMARY KEY,
    nombre VARCHAR2(60)
);
```

### Restricciones comunes

- `PRIMARY KEY`: identifica cada fila de forma única.
- `NOT NULL`: la columna no admite valores nulos.
- `UNIQUE`: impide valores duplicados.
- `CHECK`: valida que los valores cumplan una condición.
- `DEFAULT`: valor por defecto si no se especifica.
- `FOREIGN KEY`: referencia la PK de otra tabla (integridad referencial).

## ALTER TABLE

Comando DDL que **modifica la estructura de una tabla existente**: agrega, elimina o cambia columnas y restricciones.

### Sintaxis general

```sql
ALTER TABLE tabla [acción];
```

Las acciones más comunes son:

### ADD COLUMN (añadir columna)

```sql
ALTER TABLE Profesor ADD correo VARCHAR2(50);
```

### DROP COLUMN (eliminar columna)

```sql
ALTER TABLE Profesor DROP COLUMN correo;
```

> **Nota**: `DROP COLUMN` elimina la columna y **todos sus datos**, conservando el resto de la tabla. En Oracle, `DROP COLUMN` es irreversible sin `FLASHBACK`.

### Modificar columna (cambiar tipo o restricción)

```sql
ALTER TABLE Profesor MODIFY nombre VARCHAR2(100);
ALTER TABLE Profesor MODIFY telefono NOT NULL;
```

## DROP TABLE

Comando DDL que **elimina una tabla por completo**, con su estructura y sus datos.

```sql
DROP TABLE Horas;
```

> `DROP` borra la estructura y los datos. `DELETE` solo borra filas (conserva la tabla). `TRUNCATE` vacía sin filtros (conserva la estructura).

## TRUNCATE

Comando que **vacía una tabla completa de una vez**, sin filtros, **conservando su estructura**.

```sql
TRUNCATE TABLE Horas;
```

### Diferencias clave: DROP vs DELETE vs TRUNCATE

| Comando | Elimina estructura | Elimina datos | Filtra con WHERE | Reversible |
|---|---|---|---|---|
| `DROP TABLE` | Sí | Sí | No | No |
| `DELETE` | No | Sí | Sí | Sí (si hay rollback/commit pendiente) |
| `TRUNCATE` | No | Sí (todos) | No | No (commit implícito) |
