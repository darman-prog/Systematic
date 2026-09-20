# Patrones de Diseño

## ¿Qué son los patrones de diseño?

Los **patrones de diseño** son soluciones habituales a problemas que ocurren con frecuencia en el diseño de software. Son como **planos prefabricados** que se pueden personalizar para resolver un problema de diseño recurrente en el código.

No se puede elegir un patrón y copiarlo en el programa como si se tratara de funciones o bibliotecas ya preparadas. El patrón no es una porción específica de código, sino un **concepto general** para resolver un problema particular. Puedes seguir los detalles del patrón e implementar una solución que encaje con las realidades de tu propio programa.

## ¿Por qué deberías aprender sobre patrones?

- **Soluciones comprobadas** a problemas habituales en el diseño de software.
- Los patrones de diseño definen un **lenguaje común** que puede utilizarse para comunicar ideas de diseño de forma más eficiente.

## Clasificación de los patrones

Los patrones de diseño se clasifican en tres categorías:

- **Creacionales**: se encargan de crear objetos de manera adecuada según la situación (Singleton, Factory, Builder, Prototype).
- **Estructurales**: se ocupan de cómo las clases y objetos se relacionan entre sí (Adapter, Bridge, Composite, Decorator, Proxy).
- **De comportamiento**: definen cómo interactúan los objetos y cómo se reparten el trabajo (Chain of Responsibility, Command, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor).

## Patrón Prototype (creacional)

Permite **copiar o clonar objetos existentes sin que el código dependa de sus clases concretas**.

Imagina que tienes un objeto complejo (por ejemplo, un personaje de un juego con equipamiento, atributos y estado) y quieres crear una copia exacta.

Es ideal cuando la creación de un objeto desde cero es **costosa en recursos** (cálculos pesados, consultas a base de datos, llamadas a API) o cuando se quiere evitar una subclase para cada tipo de objeto.

### Problema al clonar desde fuera

Si intentas clonarlo manualmente desde fuera:

- **Necesitas conocer todos sus atributos privados** para copiar sus valores.
- Tu código queda **estrechamente acoplado** a la clase concreta del objeto.
- Adicionalmente, si el proceso de inicialización del objeto toma tiempo, **ejecutar de nuevo el constructor** con todos sus pasos puede resultar ineficiente.

### Solución

En lugar de crear un objeto nuevo desde cero y copiar sus atributos externamente, **el propio objeto se encarga de clonarse a sí mismo**. El objeto original actúa como un "prototipo".

En **Python**, la librería estándar facilita enormemente este patrón gracias al módulo nativo `copy`, en particular con `copy.deepcopy()` para realizar copias profundas de objetos complejos.

## Patrón Bridge (estructural)

El patrón Bridge es un patrón de diseño **estructural** cuyo objetivo principal es **desacoplar una abstracción de su implementación**, de modo que ambas puedan variar de forma independiente sin afectarse mutuamente.

### Motivación

Imagina que estás construyendo un sistema donde tienes **formas geométricas** (`Circulo`, `Cuadrado`) y quieres dibujarlas en **diferentes plataformas renderizadoras** (`Vector`, `Raster`).

Suele aplicarse para evitar la **"explosión de clases"** que ocurre cuando se usa herencia para combinar múltiples dimensiones de variabilidad.

Si usas herencia directa para cubrir todas las combinaciones, terminarás con un **crecimiento exponencial de clases**: `CirculoVector`, `CirculoRaster`, `CuadradoVector`, `CuadradoRaster`. Si luego agregas una nueva forma (`Triangulo`) o un nuevo motor (`3D`), el número de clases se dispara.

### Solución

El patrón sugiere **cambiar la herencia por composición**, dividiendo las clases en dos jerarquías independientes:

- **Abstracción**: la capa de alto nivel que interactúa con el cliente (por ejemplo, `Forma`). Contiene una **referencia hacia la implementación**.
- **Implementación**: la capa de bajo nivel que realiza el trabajo específico (por ejemplo, `Renderizador`).
