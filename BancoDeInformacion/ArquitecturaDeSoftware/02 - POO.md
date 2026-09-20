# Fundamentos de la POO

> Fuente: presentación de MSc. Fabián Suárez, MSc. Javier Pinzón, MSc. Feisar Moreno (UNAB). Material de estudio para la cátedra.

## ¿Qué es la Programación Orientada a Objetos (POO)?

La Programación orientada a objetos (POO) es un paradigma basado en el concepto de **envolver bloques de información y su comportamiento relacionado**, en lotes especiales llamados **objetos**, que se construyen a partir de un grupo de "planos" definidos por un programador, que se denominan **clases**.

UNIVERSIDAD AUTÓNOMA DE BUCARAMANGA

## Clases y objetos

- Una **clase** es un plano o molde que define cómo serán los objetos de un programa: qué datos tendrán y qué acciones podrán realizar.
- Un **objeto** es una instancia de una clase.

## Pilares de la POO

### Abstracción

La **abstracción** es el modelo de un objeto o fenómeno del mundo real, **limitado a un contexto específico**, que representa todos los datos relevantes a ese contexto con gran precisión y **omite el resto**.

**Ejemplo:** Un avión se modela con la física de vuelo y sistemas en un **simulador de vuelo**, pero solo con **asientos, horarios y precios** en una **aplicación de reserva de vuelos**. El mismo objeto real cambia según para qué lo necesites.

### Encapsulación

La **encapsulación** es la capacidad que tiene un objeto de **esconder partes de su estado y comportamiento** de otros objetos, **exponiendo únicamente una interfaz limitada** al resto del programa. Así se protegen los datos internos de accesos no deseados y se reduce el acoplamiento entre componentes.

### Herencia

La **herencia** es la capacidad de **crear nuevas clases sobre otras existentes**. La principal ventaja de la herencia es la **reutilización de código**: si quieres crear una clase ligeramente diferente a una ya existente, no hay necesidad de duplicar el código.

En los lenguajes orientados a objetos, la herencia se materializa mediante palabras clave de unión como `extends`, `:` o el nombre del padre entre paréntesis, con llamadas al constructor superior tipo `super()` o `base()`, y con la **sobrescritura de métodos** (si `Vehiculo` tiene un método `encender()`, la subclase `Cisterna` puede cambiar o ampliar ese comportamiento).

### Polimorfismo

El **polimorfismo** permite que objetos de clases distintas puedan tratarse de forma **uniforme** a través de una misma interfaz o clase base. El código cliente puede operar sobre una abstracción (por ejemplo, una interfaz `Forma`) y el objeto concreto decide en tiempo de ejecución cómo responder a cada mensaje.

## Relaciones entre objetos

La forma en que los objetos y clases se relacionan define la estructura y el acoplamiento del sistema. Las relaciones, de más débil a más fuerte, son:

### Dependencia

La **dependencia** es el tipo de relación **más básica y débil** entre clases. Existe una dependencia entre dos clases cuando ciertos cambios en la definición de una clase pueden provocar modificaciones en otra. La dependencia ocurre normalmente cuando utilizas nombres de clases concretas en tu código: especificar tipos en las firmas de un método, instanciar objetos mediante llamadas al constructor, etc.

**Puedes debilitar una dependencia** haciendo que tu código dependa de **interfaces o clases abstractas** en lugar de clases concretas. Si un método recibe `Sausage` concreta, existe una dependencia fuerte; si recibe la interfaz `Food`, la dependencia se debilita.

### Asociación

La **asociación** es una relación en la que un objeto **utiliza o interactúa con otro** de forma permanente. En diagramas UML, la relación de asociación se muestra mediante una **flecha simple** desde un objeto y apuntando hacia el objeto que utiliza. Es totalmente normal tener una asociación **bidireccional**: en ese caso, la flecha tiene una punta en cada extremo. Puedes ver la asociación como un tipo especializado de dependencia en la que el objeto siempre tiene acceso a los objetos con los que interactúa, mientras que la dependencia simple no establece un vínculo permanente entre los objetos.

### Agregación

La **agregación** es un tipo especializado de asociación que representa relaciones **"uno a muchos", "muchos a muchos" o "todo a parte"** entre múltiples objetos. Normalmente, con la agregación, un objeto **tiene** un grupo de otros objetos y sirve como contenedor o colección. El componente **puede existir sin el contenedor** y puede vincularse a varios contenedores al mismo tiempo.

### Composición

La **composición** es un tipo específico de agregación en el que el componente **solo puede existir como parte del contenedor** (relación de **"vivir o morir"**). En UML, la relación de composición se representa igual que la de agregación, pero con un **diamante relleno** en la base de la flecha. Si el contenedor desaparece, los componentes también desaparecen.

### Implementación

La **implementación** es una relación en la que una clase A **define los métodos declarados en la interfaz B**. Los objetos de A pueden tratarse como B. La clase A depende de B.

### Herencia (relación entre clases)

La **herencia** es una relación en la que la clase A **hereda la interfaz y la implementación** de la clase B, pero puede extenderlas. El objeto A puede tratarse como B. La clase A depende de B.

## En resumen

| Relación | ¿Conoce A? | ¿Consiste en B? | ¿Gestiona el ciclo de vida? |
|---|---|---|---|
| **Dependencia** | No (solo referencia) | No | No |
| **Asociación** | Sí (tiene acceso permanente) | No | No |
| **Agregación** | Sí | Sí | No |
| **Composición** | Sí | Sí | Sí (vivir o morir) |
| **Implementación** | Sí (define la interfaz) | No | No |
| **Herencia** | Sí (hereda) | No | No |
