// Datos de presentación de BD2: colores por tema del banco y palabras clave SQL
// (dialecto Oracle) para el resaltado de código. La UI los consume desde la entrada
// de la materia en src/core/materias.js; una materia sin estos campos usa fallbacks.
const topicColors = {
  "DML": "#9BB8C9",
  "DDL": "#B5A9CF",
  "Integridad": "#C6A0A8",
  "Índices": "#CBBD91",
  "Modelado": "#9FBEA9",
  "Consultas": "#C7A887",
  "Funciones": "#8FBDB9"
};

const sqlKeywords = ["SELECT", "FROM", "WHERE", "JOIN", "ON", "GROUP BY", "ORDER BY", "WITHIN GROUP", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE TABLE", "ALTER TABLE", "ADD", "DROP TABLE", "PRIMARY KEY", "FOREIGN KEY", "REFERENCES", "LISTAGG", "GROUP_CONCAT", "SUBSTR", "SUBSTRING", "CAST", "TO_CHAR", "TO_NUMBER", "VARCHAR2", "NUMBER", "AS", "AND", "OR", "COUNT", "DISTINCT", "INT", "FLOAT", "NULL", "NOT", "CASCADE", "ASC", "HAVING", "SUM", "INTO"];

export { topicColors, sqlKeywords };
