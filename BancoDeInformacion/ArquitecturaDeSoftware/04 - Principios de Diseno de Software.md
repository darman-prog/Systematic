Principios de
Diseño de
Software

Caracteristicas Del Buen Diseño
Extensibilidad
Reutilización de código
| El cambio | es lo único | constante | en la vida | de un |
| --------- | ----------- | --------- | ---------- | ----- |
La reutilización de código es una de
programador.
•
las formas más habituales Lanzaste un videojuego para Windows, pero ahora la
de reducir costos de desarrollo. El  gentedemandaunaversiónMacOS.
| • Creaste | un framework | GUI con botones | cuadrados, | pero |
| --------- | ------------ | --------------- | ---------- | ---- |
propósito es obvio: en lugar
mesesdespuéslosbotonesredondossontendencia.
de desarrollar algo una y otra vez
| • Diseñaste | una espectacular | arquitectura | para un | sitio web |
| ----------- | ---------------- | ------------ | ------- | --------- |
desde el principio, ¿por qué
| de comercio | electrónico, | pero poco | después | los clientes |
| ----------- | ------------ | --------- | ------- | ------------ |
no reutilizar el código existente en
| piden | una función | que les permita | aceptar pedidos | por |
| ----- | ----------- | --------------- | --------------- | --- |
nuevos proyectos? teléfono.

Principios de Diseño de Software
| ¿Qué es un buen | diseño       | de software?  |       |
| --------------- | ------------ | ------------- | ----- |
| ¿Cómo medimos   | su calidad?  |               |       |
| ¿Qué prácticas  | debemos      | llevar a cabo | para  |
lograrlo?
| ¿Cómo podemos     | hacer   | nuestra arquitectura |     |
| ----------------- | ------- | -------------------- | --- |
| flexible, estable | y fácil | de comprender?       |     |

1er PRINCIPIO. Encapsula lo que varía
Identifica los aspectos de tu aplicación que
varían y sepáralos de los que se mantienen
inalterables
Encapsulación a nivel del método Encapsulación a nivel de la clase

Encapsulación a nivel del método

Encapsulación a nivel del método

Encapsulación a nivel de la clase

Encapsulación a nivel de la clase

2do PRINCIPIO. Programa a una
interfaz, no a una implementación
Programa a una interfaz, no a una
implementación. Depende de abstracciones, no
de clases concretas.

Entendamos que es una interface
Una interface es como las reglas de un juego. Dice qué acciones debe poder hacer un personaje, pero
no dice cómolas hace.

Iniciemos
programando
esta relación

¿Por qué es mejor así?
| Porque ahora Cat |     | no depende de  |
| ---------------- | --- | -------------- |
Sausage, sino de la interfaz Food.
Eso significa que mañana puedes crear:
| public | class   | Fish implements |
| ------ | ------- | --------------- |
| Food   | { ... } |                 |
| public | class   | Meat implements |
| Food   | { ... } |                 |
Y el gato podrá comerlos sin modificar
la clase Cat.

Ejercicio en
clase –
Empresa de
Software

Ejercicio en
clase –
Empresa de
Software

Ejercicio en
clase –
Empresa de
Software

3er PRINCIPIO. Favorece la
composición sobre la herencia