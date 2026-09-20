# Principios de Diseño de Software

## Características del buen diseño

Un buen diseño de software debe tener, entre otras:

- **Extensibilidad**: capacidad para agregar nuevas funcionalidades sin reescribir el sistema.
- **Reutilización de código**: poder usar componentes existentes en nuevos contextos, reduciendo costos de desarrollo.

## El cambio es lo único constante

**El cambio es lo único constante** en la vida de un programador. Piensa en estos ejemplos:

- **Lanzaste un videojuego para Windows, pero ahora la gente pide una versión MacOS.**
- **Creaste un framework GUI con botones cuadrados, pero meses después los botones redondos son tendencia.**
- **Diseñaste una arquitectura espectacular para un sitio de comercio electrónico, pero los clientes piden una función para aceptar pedidos por teléfono.**

La **reutilización de código** es una de las formas más habituales de reducir costos de desarrollo: en lugar de desarrollar algo una y otra vez, debes poder **reutilizar el código existente en nuevos proyectos**.

## ¿Qué es un buen diseño de software?

- **¿Qué es un buen diseño de software?**
- **¿Cómo medimos su calidad?**
- **¿Qué prácticas debemos llevar a cabo para lograrlo?**
- **¿Cómo podemos hacer nuestra arquitectura flexible, estable y de fácil comprensión?**

Responder a estas preguntas es lo que orienta la aplicación de los principios de diseño.

---

## 1.º principio: Encapsula lo que varía

**Identifica los aspectos de tu aplicación que varían y sepáralos de los que se mantienen inalterables.**

Esta separación puede hacerse a nivel de **método** o a nivel de **clase**, aislando así las partes volátiles para que los cambios no contaminen el resto del sistema.

- **Encapsulación a nivel del método**: extraer el comportamiento que cambia a un método separado, de modo que el algoritmo general permanezca estable.
- **Encapsulación a nivel de la clase**: aislar lo que varía en una o unas pocas clases, permitiendo cambiar la estrategia sin tocar las clases cliente.

## 2.º principio: Programa a una interfaz, no a una implementación

**Depende de abstracciones, no de clases concretas.**

Una interface es como **las reglas de un juego**: dice qué acciones debe poder hacer un personaje, pero no dice cómo las hace. Programar a la interfaz permite que el código cliente no dependa de la implementación concreta, facilitando el cambio futuro.

**Ejemplo clásico:**

Si la clase `Cat` depende directamente de `Sausage`, está **estrechamente acoplada** a un alimento concreto. Si en cambio depende de la **interfaz `Food`**, mañana puedes crear:

```java
public class Fish implements Food { ... }
public class Meat implements Food { ... }
```

Y el gato podrá comerlos **sin modificar la clase `Cat`**.

**¿Por qué es mejor así?**

Ahora `Cat` no depende de `Sausage` en particular, sino de la abstracción `Food`. Cualquier comida que implemente `Food` funciona. Esto es **polimorfismo** aplicado a través de interfaces.

## 3.º principio: Favorece la composición sobre la herencia

**Ante la duda, es preferible componer objetos** (componer comportamientos mediante delegación) en lugar de construir jerarquías de herencia profundas y rígidas.

La **composición** permite:

- Cambiar el comportamiento en tiempo de ejecución.
- Combinar responsabilidades de forma flexible.
- Evitar la fragilidad de las jerarquías de herencia (donde un cambio en la clase padre puede romper a todas las subclases).

La **herencia** sigue siendo útil para expresar "es-un" (un `Perro` es un `Animal`), pero para compartir comportamiento reutilizable ("tiene-un"), la composición es la opción más segura.
