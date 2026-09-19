Fundamentos
de la POO
MSc. Fabian Suarez
MSc. Javier Pinzon
MSc. Feisar Moreno

POO - Programación Orientado a Objetos
La Programación orientada a objetos (POO) es un paradigma basado en el
concepto de envolver bloques de información y su comportamiento
relacionado, en lotes especiales llamados objetos, que se construyen a partir de
un grupo de “planos” definidos por un programador, que se denominan clases.
UNIVERSIDAD AUTONOMA DE BUCARAMANGA

Clases

Objetos

Ejercicio
en clase El Guerrero de Coliseo

Ejercicio
en clase
El Sistema de Ascensor Inteligente

Ejercicio
en clase
El Gestor de Suscripciones (Streaming)

Desafio
¿Qué tan buenos Arquitectos son?
Ahora que has diseñado y programado la lógica de tus objetos de
forma manual, utiliza una Inteligencia Artificial para generar el código
de los tres retos en tres lenguajes de programación distintos-
Tu misión: Analiza las diferencias sintácticas y estructurales. Observa
cómo cada lenguaje maneja el encapsulamiento (privacidad de datos) y
la estructura de las clases, y completa un cuadro comparativo
resaltando qué te gustó más de cada uno.

Jerarquías de clase

Jerarquia de clases

Ejercicio
en clase
El Sistema de Cobros
Una tienda departamental necesita organizar sus finanzas. La base
de todo es la Transacción, que registra el monto y la moneda. El
| sistema | debe ramificarse | en tres | formas | de pago | distintas: |
| ------- | ---------------- | ------- | ------ | ------- | ---------- |
1. Los que pagan con Tarjeta, donde se debe validar el número de
| plástico | y la franquicia | (Visa/Mastercard). |     |     |     |
| -------- | --------------- | ------------------ | --- | --- | --- |
2. Los que usan Transferencia, guardando el código del banco y
| el  | número de cuenta | de origen. |     |     |     |
| --- | ---------------- | ---------- | --- | --- | --- |
3. Los que usan Cripto, donde se requiere el hash de la billetera y
| la  | red utilizada (Blockchain). |     |     |     |     |
| --- | --------------------------- | --- | --- | --- | --- |

Ejercicio
El Ecosistema de Transporte
"Smart-Logistics"
en clase

Desafio
¿Qué tan buenos Arquitectos son?
Pide a una IA que implemente en tres lenguajes distintos los ejercicios anteriores.
| Centra | tu análisis | en  | las 'Cosas | Nuevas’: |     |
| ------ | ----------- | --- | ---------- | -------- | --- |
1. Palabras Clave de Unión: Observa cómo cada lenguaje conecta al padre con el
| hijo | (¿Usa | extends, | : o (Padre)?). |     |     |
| ---- | ----- | -------- | -------------- | --- | --- |
2. Llamadas al Constructor Superior: Identifica cómo el hijo le envía datos al padre
| (¿Usa | super(), | base() | o el | nombre | de la clase?). |
| ----- | -------- | ------ | ---- | ------ | -------------- |
3. Sobrescritura de Métodos: Si el Vehiculo tiene un método encender(), ¿cómo
hace el Cisterna para cambiar ese comportamiento o añadirle algo nuevo?

Pilares
de la POO

Abstracción
La Abstracción es el modelo
de un objeto o fenómeno del
mundo real, limitado a un
contexto específico, que
representa
todos los datos relevantes a
Ej. simulador de vuelo
este contexto con gran
y en una aplicación de
reserva de vuelos
precisión,
omitiendo el resto.

La encapsulación es la
capacidad que tiene un objeto
de esconder partes de su
estado y comportamiento de
otros objetos, exponiendo
únicamente una interfaz
limitada al resto del
programa
Encapsulación

Herencia
La herencia es la capacidad de
crear nuevas clases sobre
otras
existentes. La principal ventaja
de la herencia es la
reutilización de código. Si
Ej. simulador de vuelo
quieres crear una clase
y en una aplicación de
reserva de vuelos
ligeramente diferente a una ya
existente, no hay necesidad
de duplicar el código.

Polimorfismo

Relaciones
entre Objetos

Dependencia
La dependencia es el tipo de relación más básica y débil entre clases. Existe una
dependencia entre dos clases cuando ciertos cambios en la definición de una
clase puede provocar modificaciones en otra. La dependencia ocurre
normalmente cuando utilizas nombres de clases concretas en tu código. Por
ejemplo, al especificar tipos en las firmas de un método, al instanciar objetos
mediante llamadas al constructor, etc. Puedes hacer más débil una dependencia
haciendo que tu código dependa de interfaces o clases abstractas en lugar de
clases concretas.

Asociación
La asociación es una relación en la que un objeto utiliza o interactúa con otro. En
diagramas UML, la relación de asociación se muestra mediante una flecha simple
desde un objeto y apuntando hacia el objeto que utiliza. Por cierto, es totalmente
normal tener una asociación bidireccional. En este caso, la flecha tiene una punta en
cada extremo. La asociación puede verse como un tipo especializado de
dependencia, en la que un objeto siempre tiene acceso a los objetos con los que
interactúa, mientras que la dependencia simple no establece un vínculo permanente
entre los objetos.

Ejemplo dependencia y asociación

Agregación
La agregación es un tipo especializado de asociación que representa relaciones
“uno a muchos”, “muchos a muchos” o “todo a parte” entre múltiples objetos.
Normalmente, con la agregación, un objeto “tiene” un grupo de otros
objetos y sirve como contenedor o colección. El componente puede existir
sin el contenedor y puede vincularse a varios contenedores al mismo
tiempo.

Composición
La composición es un tipo específico de agregación en la que un objeto se compone
de una o más instancias del otro. La diferencia entre ésta y otras relaciones está en
que el componente sólo puede existir como parte del contenedor. En UML, la
relación de composición se representa igual que la de agregación, pero con un
diamante relleno en la base de la flecha.
“Vivir o morir”

En resumen…
• Dependencia: La clase A puede verse afectada por cambios en la clase B.
• Asociación: El objeto A conoce el objeto B. La clase A depende de B. •
• Agregación: El objeto A conoce el objeto B y consiste en B. La clase A
depende de B.
• Composición: El objeto A conoce el objeto B, consiste en B y gestiona el ciclo
vital de B. La clase A depende de B.
• Implementación: La clase A define métodos declarados en la interfaz B. Los
objetos A pueden tratarse como B. La clase A depende de B. •
• Herencia: La clase A hereda la interfaz y la implementación de la clase B, pero
puede extenderla. El objeto A puede tratarse como B. La clase A depende de B

Relaciones entre objetos y clases

Gracias!