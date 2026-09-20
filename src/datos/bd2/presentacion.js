// Datos de presentación de BD2: colores por tema del banco y palabras clave SQL
// (dialecto Oracle) para el resaltado de código. La UI los consume desde la entrada
// de la materia en src/core/materias.js; una materia sin estos campos usa fallbacks.
const topicColors = {
  "DML": "#38bdf8",
  "DDL": "#a78bfa",
  "Integridad": "#f472b6",
  "Índices": "#facc15",
  "Modelado": "#34d399",
  "Consultas": "#fb923c",
  "Funciones": "#22d3ee"
};

const sqlKeywords = ["SELECT", "FROM", "WHERE", "JOIN", "ON", "GROUP BY", "ORDER BY", "WITHIN GROUP", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE TABLE", "ALTER TABLE", "ADD", "DROP TABLE", "PRIMARY KEY", "FOREIGN KEY", "REFERENCES", "LISTAGG", "GROUP_CONCAT", "SUBSTR", "SUBSTRING", "CAST", "TO_CHAR", "TO_NUMBER", "VARCHAR2", "NUMBER", "AS", "AND", "OR", "COUNT", "DISTINCT", "INT", "FLOAT", "NULL", "NOT", "CASCADE", "ASC", "HAVING", "SUM", "INTO"];

export { topicColors, sqlKeywords };
