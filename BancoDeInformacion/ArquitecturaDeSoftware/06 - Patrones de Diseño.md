Patrones de
Diseño

¿Qué son los patrones de diseño?

Los patrones de diseño son soluciones habituales a problemas que ocurren con
frecuencia en el diseño de software. Son como planos prefabricados que se pueden
personalizar para resolver un problema de diseño recurrente en el código. No se puede
elegir un patrón y copiarlo en el programa como si se tratara de funciones o bibliotecas
ya preparadas.
El patrón no es una porción específica de código, sino un concepto general para
resolver un problema particular. Puedes seguir los detalles del patrón e implementar
una solución que encaje con las realidades de tu propio programa.

¿Por qué deberías aprender sobre
patrones?

● Soluciones comprobadas a problemas habituales en el diseño de

software.

● Los patrones de diseño definen un lenguaje común que puede

utilizarse para comunicar ideas de diseño de forma más eficiente.

Clasificación de los Patrones

Patrón prototype (I)

Prototype es un patrón de diseño creacional que
permite copiar o clonar objetos existentes sin que el
código dependa de sus clases concretas.

Imagina que tienes un objeto complejo (por ejemplo,
un personaje de un juego con equipamiento,
atributos y estado) y quieres crear una copia exacta.

Es ideal cuando la creación de un objeto desde cero
es costosa en recursos (cálculos pesados, consultas a
base de datos, llamadas a API) o cuando se quiere
evitar una subclase para cada tipo de objeto.

Si intentas clonarlo manualmente desde fuera:
● Necesitas conocer todos sus atributos privados

para copiar sus valores.

● Tu código queda estrechamente acoplado a la

clase concreta del objeto.

Adicionalmente, si el proceso de inicialización del
objeto toma tiempo, ejecutar de nuevo el
constructor con todos sus pasos puede resultar
ineficiente.

Patrón prototype (II)

En lugar de crear un objeto nuevo desde cero y copiar sus
atributos externamente, el propio objeto se encarga de
clonarse a sí mismo. El objeto original actúa como un
“prototipo”.

En Python, la librería estándar facilita enormemente este
patrón gracias al módulo nativo copy, específicamente con
copy.deepcopy() para realizar copias profundas de objetos
complejos.

Patrón bridge (I)

Bridge es un patrón de diseño estructural cuyo objetivo
principal es desacoplar una abstracción de su
implementación, de modo que ambas puedan variar
de forma independiente sin afectarse mutuamente.

Imagina que estás construyendo un sistema donde
tienes formas geométricas (Circulo, Cuadrado) y
quieres dibujarlas en diferentes plataformas
renderizadoras (Vector, Raster).

Suele aplicarse para evitar la “explosión de clases” que
ocurre cuando se usa herencia para combinar múltiples
dimensiones de variabilidad.

Si usas herencia directa para cubrir todas las
combinaciones, terminarás con un crecimiento
exponencial de clases: CirculoVector, CirculoRaster,
CuadradoVector, CuadradoRaster.

Si luego agregas una nueva forma (Triangulo) o un
nuevo motor (3D), el número de clases se dispara.

Patrón bridge (II)

El patrón sugiere cambiar la herencia por composición, dividiendo las clases en dos jerarquías independientes:

Abstracción: La capa de alto nivel que interactúa con el cliente (por ejemplo, Forma). Contiene una referencia hacia
la implementación.

Implementación: La capa de bajo nivel que realiza el trabajo específico (por ejemplo, Renderizador).

Patrón memento (I)

Memento es un patrón de diseño de comportamiento
que permite guardar y restaurar el estado anterior de
un objeto sin revelar los detalles de su implementación
interna (respetando el principio de encapsulamiento).

Si el objeto Editor intentara guardar su estado
externamente copiando todos sus datos directos a otra
clase, nos enfrentaremos a dos grandes problemas:

Es el patrón fundamental que se utiliza para
implementar funcionalidades de "Deshacer" (Ctrl+Z).

Violación de encapsulamiento: Se tendrían que hacer
públicos todos los campos y atributos privados del
editor para que otra clase los lea y los guarde.

Imagina que estás desarrollando un editor de texto o
una herramienta de dibujo. Quieres que el usuario
pueda presionar “Deshacer” para regresar al estado
anterior.

Código frágil: Si el objeto Editor cambia sus atributos
internos en el futuro, será necesario modificar todo el
código externo que se encarga de guardar y restaurar
esos datos.

Patrón memento (II)

El patrón distribuye la responsabilidad en 3 actores
principales:

● Originador (Originator): El objeto principal cuyo estado
se quiere guardar (ej. el Editor). Es el único que sabe
cómo crear un Memento con su estado actual y cómo
restaurarse usando un Memento.

● Memento: Un objeto inmutable que actúa como una
copia del estado del Originador en un momento dado.
Nadie más debe leer ni modificar su contenido.

● Cuidador (Caretaker): Se encarga de guardar la lista o
pila de Mementos (el historial) y decidir cuándo pedirle
al Originador que guarde o recupere su estado. No
modifica ni inspecciona el interior de los Mementos.

