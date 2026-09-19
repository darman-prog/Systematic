Principios SOLID

¿Qué son los principios SOLID?
En 2002 Robert Martin los presentó en el libro Desarrollo ágil de
software: principios, patrones y prácticas.
SOLID es una regla mnemotécnica para cinco principios de
diseño ideados para hacer que los diseños de software sean más
comprensibles, flexibles y fáciles de mantener. Su utilización
debe ir acompañada de un análisis previo, ya que utilizar estos
principios de forma descuidada puede hacer más mal que bien.
El costo de aplicar estos principios en la arquitectura de una
aplicación es que puede llegar a hacerla más complicada de lo
que debería.

S
|     | Single Responsibility |     | Principle | (Principio  |
| --- | --------------------- | --- | --------- | ----------- |
de Responsabilidad Única)
| O   | Open/Closed | Principle | (Principio de  |     |
| --- | ----------- | --------- | -------------- | --- |
Abierto/Cerrado)
L
|     | Liskov Substitution |     | Principle | (Principio de  |
| --- | ------------------- | --- | --------- | -------------- |
Sustitución de Liskov)
I
|     | Interface Segregation |     | Principle | (Principio  |
| --- | --------------------- | --- | --------- | ----------- |
de Segregación de Interfaces)
D
|     | Dependency | Inversion | Principle | (Principio  |
| --- | ---------- | --------- | --------- | ----------- |
de Inversión de Dependencias)

S
ingle Responsibility Principle (Principio de
Responsabilidad Única)
Una clase sólo debe tener una razón para cambiar.
Intenta hacer a cada clase responsable de una única parte de la
funcionalidad proporcionada por el software, y haz que esa
responsabilidad quede totalmente encapsulada por (también puedes
decir “escondida dentro de”) la clase.

O
pen/Closed Principle (Principio de
Abierto/Cerrado)
Las clases deben estar abiertas a la extensión pero cerradas a la
modificación.
Una clase está abierta si puedes extenderla, crear una subclase y hacer lo
que quieras con ella (añadir nuevos métodos o campos, sobrescribir el
comportamiento base, etc.). Algunos lenguajes de programación te
permiten restringir en mayor medida la extensión de una clase con
palabras clave como final .

L
iskov Substitution Principle (Principio de
Sustitución de Liskov)
Al extender una clase, recuerda que debes tener la capacidad de
pasar objetos de las subclases en lugar de objetos de la clase
padre, sin descomponer el código cliente.
Barbara Liskov – Destacada científica estadounidense. Lo definió en 1987
en su trabajo Data abstraction and hierarchy.

I
nterface Segregation Principle (Principio de
Segregación de Interfaces)
No se debe forzar a los clientes a depender de métodos que no
utilizan.
Según el principio de segregación de la interfaz, debes desintegrar las
interfaces “gruesas” hasta crear otras más detalladas y específicas. Los
clientes deben implementar únicamente aquellos métodos que necesitan
de verdad. De lo contrario, un cambio en una interfaz “gruesa”
descompondrá incluso clientes que no utilizan los métodos cambiados.

D
ependency Inversion Principle (Principio de
Inversión de Dependencias)
Las clases de alto nivel no deben depender de clases de bajo nivel.
Ambas deben depender de abstracciones. Las abstracciones no
deben depender de detalles. Los detalles deben depender de
abstracciones.

| • Las  | clases | de     | alto    | nivel    | contienen |       |
| ------ | ------ | ------ | ------- | -------- | --------- | ----- |
| la     | lógica | de     | negocio | compleja |           | que   |
| ordena |        | a las  | clases  | de       | bajo      | nivel |
| que    | hagan  | algo   |         |          |           |       |
| Las    |        | clases |         | de bajo  |           | nivel |
•
| implementan |     |          | operaciones |        | básicas, |        |
| ----------- | --- | -------- | ----------- | ------ | -------- | ------ |
| como        |     | trabajar |             | con un |          | disco, |
| transferir  |     | datos    |             | por    | una      | red,   |
| conectar    |     | con      | una         | base   | de       | datos, |
etc