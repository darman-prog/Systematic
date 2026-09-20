# Principios SOLID

## ¿Qué son los principios SOLID?

En **2002**, **Robert Martin** los presentó en el libro *Desarrollo ágil de software: principios, patrones y prácticas*.

**SOLID** es una regla mnemotécnica para cinco principios de diseño ideados para hacer que los diseños de software sean más **comprensibles, flexibles y fáciles de mantener**. Su utilización debe ir acompañada de un **análisis previo**, ya que utilizar estos principios de forma descuidada puede hacer más mal que bien. El costo de aplicar estos principios en la arquitectura de una aplicación es que puede llegar a hacerla **más complicada de lo que debería**.

| Letra | Nombre en inglés | Principio en español |
|-------|-------------------|---------------------|
| S | Single Responsibility | Principio de Responsabilidad Única |
| O | Open/Closed | Principio de Abierto/Cerrado |
| L | Liskov Substitution | Principio de Sustitución de Liskov |
| I | Interface Segregation | Principio de Segregación de Interfaces |
| D | Dependency Inversion | Principio de Inversión de Dependencias |

## S — Single Responsibility Principle (Principio de Responsabilidad Única)

**Una clase sólo debe tener una razón para cambiar.**

Intenta hacer a cada clase responsable de una única parte de la funcionalidad proporcionada por el software, y haz que esa responsabilidad quede totalmente encapsulada por la clase (también puedes decir "escondida dentro de" la clase). Si una clase tiene múltiples responsabilidades, un cambio en una de ellas puede requerir modificar la clase y, potencialmente, romper las otras responsabilidades. La responsabilidad única hace al código más estable y reutilizable.

## O — Open/Closed Principle (Principio de Abierto/Cerrado)

**Las clases deben estar abiertas a la extensión pero cerradas a la modificación.**

Una clase está abierta si puedes extenderla: crear una subclase y hacer lo que quieras con ella (añadir nuevos métodos o campos, sobrescribir el comportamiento base, etc.). Algunos lenguajes de programación te permiten restringir en mayor medida la extensión de una clase con palabras clave como `final`. La idea es que, una vez que una clase está funcionando y probada, no debas modificar su código interno, sino extenderla mediante herencia, decoradores o composición.

## L — Liskov Substitution Principle (Principio de Sustitución de Liskov)

**Al extender una clase, debes poder pasar objetos de las subclases en lugar de objetos de la clase padre, sin descomponer el código cliente.**

Si una subclase no puede reemplazar a su clase padre en todas las situaciones, entonces violarás este principio. **Barbara Liskov**, destacada científica estadounidense, lo definió en 1987 en su trabajo *Data abstraction and hierarchy*. En la práctica, esto significa que las subclases no deben forzar condiciones imposibles, cambiar precondiciones o postcondiciones de forma incompatible, ni lanzar excepciones que el cliente no espera.

## I — Interface Segregation Principle (Principio de Segregación de Interfaces)

**No se debe forzar a los clientes a depender de métodos que no utilizan.**

Según el principio de segregación de la interfaz, debes **desintegrar las interfaces "gruesas"** hasta crear otras más detalladas y específicas. Los clientes deben implementar únicamente aquellos métodos que necesitan de verdad. De lo contrario, un cambio en una interfaz "gruesa" descompondrá incluso clientes que no utilizan los métodos cambiados. En otras palabras: es mejor tener varias interfaces pequeñas y específicas que una grande y general, evitando así el "fiero de caballo".

## D — Dependency Inversion Principle (Principio de Inversión de Dependencias)

**Las clases de alto nivel no deben depender de clases de bajo nivel. Ambas deben depender de abstracciones.** Las abstracciones no deben depender de detalles. Los detalles deben depender de abstracciones.

En la práctica:

- Las clases de **alto nivel** contienen la **lógica de negocio compleja** que ordena "hacer algo"; no deben conocer directamente las clases de bajo nivel.
- Las clases de **bajo nivel** implementan **operaciones básicas** (trabajar con disco, red, base de datos) y son los "detalles" que la lógica de negocio necesita.
- La solución: ambas dependen de **abstracciones** (interfaces o clases abstractas). La lógica de negocio define qué necesita (una abstracción), y los detalles de bajo nivel la implementan. Así, los detalles pueden cambiar (cambio de base de datos, de framework) sin tocar la lógica de negocio.
