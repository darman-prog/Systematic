# Base de Datos 2 — Índices y rendimiento

> Fuente derivada de `src/datos/bd2/preguntas.js` (categoría Índices) y `src/datos/bd2/glorario.js` (categoría `indices`). Material de estudio para la cátedra.

## ¿Qué es un índice?

Un **índice** es una **estructura auxiliar ordenada** que acelera las búsquedas por una columna, al igual que un índice de un libro. Permite localizar filas rápidamente sin recorrer tabla completa.

### Sintaxis

```sql
CREATE INDEX idx_horas_profesor ON Horas(ID_Profesor);
```

### Cuándo usar índices

- Columnas usadas frecuentemente en cláusulas `WHERE`, `JOIN`, `ORDER BY` o `GROUP BY`.
- Columnas que retornan un subconjunto pequeño de filas (alta selectividad).

### Costos del índice

- Cada `INSERT`, `UPDATE` o `DELETE` en una columna indexada **requiere reorganizar el índice**, lo que incrementa el costo de escritura.
- Un índice acelera los `SELECT`, pero **cada modificación posterior lo actualiza**.
- Tener demasiados índices ralentiza las escrituras y consumen espacio.

## Escaneo completo (full scan)

Cuando **no existe un índice** sobre la columna buscada, la base de datos debe leer la tabla **fila por fila**. Este es el "full scan" o "table scan" — el peor caso para el rendimiento en tablas grandes.

```sql
-- Sin índice sobre ID_Profesor, se hace full scan:
SELECT * FROM Horas WHERE ID_Profesor = 'P01';
```

Con un índice, la base de datos salta directamente a las filas coincidentes sin leer todo.

## Índice único

Un **índice único** acelera la búsqueda **y además impide valores duplicados** en la columna indexada. Es útil para garantizar unicidad en campos que no son PRIMARY KEY (como un correo electrónico).

```sql
CREATE UNIQUE INDEX idx_profesor_correo ON Profesor(correo);
```

### Índices compuestos

Un índice puede cubrir **varias columnas** juntas. El orden de las columnas es crítico: el índice sirve para filtros que usan el **prefijo de columnas** (las primeras posiciones).

```sql
CREATE INDEX idx_horas_combinado ON Horas(ID_Profesor, ID_Asignatura);
-- Sirve para WHERE ID_Profesor = ?
-- Sirve para WHERE ID_Profesor = ? AND ID_Asignatura = ?
-- NO sirve para WHERE ID_Asignatura = ? (sin ID_Profesor)
```

## Funciones de rendimiento

| Función | Uso |
|---|---|
| `COUNT(*)` | Cuenta **todas** las filas (incluye `NULL`). |
| `COUNT(columna)` | Cuenta filas no nulas de esa columna (ignora `NULL`). |
| `COUNT(DISTINCT columna)` | Cuenta valores distintos (elimina duplicados). |

## Consejos rápidos

- Un índice acelera `SELECT`, pero cada `INSERT`/`UPDATE`/`DELETE` lo reorganiza → equilibra lecturas vs. escrituras.
- `DROP` elimina estructura y datos; `DELETE` solo borra filas; `TRUNCATE` vacía sin filtros.
- No sobre-indexes: en sistemas de escritura intensa, demasiados índices ralentizan el sistema.
