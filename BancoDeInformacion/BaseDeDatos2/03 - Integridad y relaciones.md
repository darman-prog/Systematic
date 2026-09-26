# Base de Datos 2 — Integridad y relaciones

> Fuente derivada de `src/datos/bd2/preguntas.js` (categoría Integridad) y `src/datos/bd2/glorario.js` (categoría `integridad`). Material de estudio para la cátedra.

## ¿Qué es la integridad referencial?

La **integridad referencial** es una garantía de que toda **FOREIGN KEY (FK)** apunte a un **registro existente** en la tabla referenciada. Evita que existan **registros huérfanos** (filas hijas que referencian a un padre que ya no existe).

---

## PRIMARY KEY (llave primaria)

Identifica **cada fila de forma única**. No admite **duplicados ni valores nulos**. Puede ser **simple** (una columna) o **compuesta** (dos o más columnas).

### Ejemplo — llave simple

```sql
CREATE TABLE Profesor (
    ID_Profesor VARCHAR2(10) PRIMARY KEY,
    nombre VARCHAR2(60)
);
```

### Ejemplo — llave compuesta

```sql
CREATE TABLE Horas (
    ID_Profesor VARCHAR2(10),
    ID_Asignatura VARCHAR2(10),
    PRIMARY KEY (ID_Profesor, ID_Asignatura)
);
```

## Llave compuesta (composite key)

Una **llave compuesta** (o llave primaria compuesta) es aquella formada por **dos o más columnas**. La combinación de valores en esas columnas debe ser **única** en toda la tabla, aunque cada columna individualmente pueda repetirse.

```sql
PRIMARY KEY (ID_Profesor, ID_Asignatura)
```

## FOREIGN KEY (llave foránea)

La **llave foránea** referencia la **llave primaria de otra tabla**, garantizando que la relación entre ambas tablas sea válida. La columna (o conjunto de columnas) que sirve de FK debe hacer referencia a la PK de la tabla padre.

### Ejemplo

```sql
CREATE TABLE Horas (
    ID_Profesor VARCHAR2(10),
    ID_Asignatura VARCHAR2(10),
    PRIMARY KEY (ID_Profesor, ID_Asignatura),
    FOREIGN KEY (ID_Profesor) REFERENCES Profesor(ID_Profesor)
);
```

## ON DELETE CASCADE

Regla de una FK que **borra los registros hijos** al eliminar el registro padre. Evita registros huérfanos cuando se borra la fila referenciada.

```sql
FOREIGN KEY (ID_Profesor) REFERENCES Profesor(ID_Profesor)
ON DELETE CASCADE
```

Al borrar un profesor, se borran automáticamente todos sus registros en `Horas`.

### Otras acciones de FK

- `ON DELETE SET NULL`: establece la FK a `NULL` cuando se borra el padre.
- `ON DELETE SET DEFAULT`: establece la FK al valor por defecto.
- `ON DELETE RESTRICT`: impide borrar el padre si hay hijos (predeterminado en muchos motores).

## Registro huérfano (orphan record)

Fila hija que **referencia a un padre que ya no existe**. Esto ocurre cuando se elimina el registro padre sin una regla `ON DELETE CASCADE` adecuada.

```sql
-- Si se borra el profesor P001 sin cascade:
-- Las filas en Horas que referenciaban a P001 quedan huérfanas.
```

## Relación Profesor → Asignatura vía tabla puente

Para relaciones **muchos-a-muchos** (un profesor da varias asignaturas y una asignatura la dan varios profesores), el patrón es usar una **tabla intermedia o puente**:

```
Profesor ←→ Horas ←→ Asignatura
```

Pasar por la tabla `Horas` permite asociar múltiples profesores con múltiples asignaturas, registrando además atributos de la relación (por ejemplo, el número de horas).
