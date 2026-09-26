# Base de Datos 2 — Modelado y tipos de datos

> Fuente derivada de `src/datos/bd2/preguntas.js` (categoría Modelado) y `src/datos/bd2/glorario.js` (categoría `modelado`). Material de estudio para la cátedia.

## Tipos de datos numéricos

### NUMBER / INT

Los tipos **NUMBER** (Oracle) e **INT** (otros motores) son adecuados para **identificadores secuenciales** sin letras ni ceros a la izquierda. Almacenan números enteros o decimales con precisión.

### Usos típicos

```sql
salario NUMBER(10, 2)    -- número con 2 decimales
cantidad INT             -- entero
```

### Característica clave

Los tipos numéricos **eliminan los ceros a la izquierda** al almacenar. Si necesitas preservarlos (por ejemplo, un código `00123`), usa un tipo de texto.

## Tipos de datos de texto

### VARCHAR2 / VARCHAR

Texto de **longitud variable**; es el tipo adecuado para **IDs con letras, guiones o ceros iniciales**. A diferencia de `NUMBER`, **conserva los ceros a la izquierda** y acepta caracteres alfanuméricos.

```sql
ID_Profesor VARCHAR2(10)    -- conserva 'A-001', '00312'
nombre VARCHAR2(60)
```

### Ceros a la izquierda

Formato como `'00123'` que `NUMBER` **elimina** (almacena como `123`). `VARCHAR2` **lo conserva**. Esto importa para:

- Códigos de identificación (cédulas, facturas, IDs).
- Claves que combinan letras y números.

| Valor | NUMBER | VARCHAR2 |
|---|---|---|
| `'00312'` | `312` (cero inicial perdido) | `'00312'` (conservado) |
| `'A-001'` | No admite letras | `'A-001'` |

## Identificador (ID)

Un **identificador** es el campo que identifica de forma única un registro. Su tipo de dato depende del **formato del valor**:

- **`NUMBER`**: IDs puramente numéricos secuenciales (`1, 2, 3...`).
- **`VARCHAR2`**: IDs con letras, guiones, o ceros a la izquierda (`'P001'`, `'A-001'`, `'00312'`).

### Principio

> **IDs con letras o ceros a la izquierda → `VARCHAR2`; IDs puramente numéricos → `NUMBER`.**

### Ejemplos

```sql
CREATE TABLE Profesor (
    ID_Profesor VARCHAR2(10)  -- 'P001' contiene letra → VARCHAR2
);

CREATE TABLE Horas (
    ID_Hora NUMBER              -- secuencial → NUMBER
);
```

## Modelado de entidades y relaciones

El **modelado** es el proceso de diseñar la estructura de la base de datos antes de crear las tablas. Incluye:

1. **Identificar entidades**: objetos o conceptos del dominio (Profesor, Asignatura, Horas).
2. **Identificar atributos**: características de cada entidad (nombre, salario, etc.).
3. **Definir claves primarias**: columnas que identifican de forma única cada fila.
4. **Establecer relaciones**: uno-a-uno, uno-a-muchos, muchos-a-muchos.
5. **Aplicar reglas de integridad**: PK, FK, UNIQUE, NOT NULL, CHECK.

### Relación de ejemplo: Profesor → Asignatura

```
Profesor (1)  ←→  Horas (n)  ←→  Asignatura (n)
```

La tabla puente `Horas` resuelve la relación **muchos-a-muchos**, ya que un profesor puede dar varias asignaturas y una asignatura puede ser dada por varios profesores.
