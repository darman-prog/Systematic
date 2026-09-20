# Ingeniería de Software I — Clases 11, 12 y 13

> Fuente: presentación de Verónica Chajín Ortiz (UNAB). Material de estudio para la cátedra.

## 1. Análisis de requerimientos y modelado

### ¿Qué es el modelado?

El análisis de requerimientos produce **modelos** que ayudan a entender el sistema. Según su naturaleza, los modelos pueden ser de distintos tipos:

- **Escenarios**: describen situaciones del mundo real en las que el sistema participa.
- **Clases**: representan entidades y sus relaciones.
- **Comportamiento**: describen cómo el sistema responde a los eventos.

### Tipos de modelos

- **Modelo de comportamiento**: describe cómo el sistema responde a eventos externos.
- **Modelo de estructura**: representa la organización estática de los componentes del sistema.
- **Modelo de interacción**: describe cómo los componentes del sistema interactúan entre sí.

UML aporta la notación visual para expresar todos estos tipos de modelos.

## 2. Modelado basado en escenarios: UML

### ¿Qué es un escenario?

Un escenario es una **historia de cómo el sistema, un actor y los elementos circundantes reaccionan a un evento**. Un escenario bien definido puede referirse a sí mismo como un **caso de uso**.

### Actores y perfiles de usuario

Un **actor** es una persona o sistema externo que interacciona con el sistema. Un **perfil de usuario** describe características, necesidades y comportamientos de un grupo de usuarios. Identificar actores y perfiles de usuario es clave para entender quiénes usarán el sistema y cómo.

## 3. Casos de uso

### ¿Qué es un caso de uso?

Un **caso de uso** es la narración o plantilla que describe una función o rasgo del sistema **desde el punto de vista del usuario**. Sirve como base para construir un modelo de requerimientos más completo. El escritor del caso de uso debe identificar:

- **Actor(es)** involucrados.
- **Descripción** del objetivo.
- **Flujo de eventos** (secuencia de pasos).
- **Resultados esperados**.

### Escenario principal y alternativas

El modelado basado en escenarios se apoya en la narrativa del caso de uso. Cuando la narrativa describe solo la secuencia típica, hablamos de un **escenario principal** (o escenario feliz).

Cada paso del escenario principal debe contemplar las **alternativas**, evaluándolos con preguntas como:

- ¿Qué ocurre si el actor elige otra opción?
- ¿Qué pasa si se presenta un error en un paso intermedio?

Una **excepción** (o **escenario secundario**) describe una situación —ya sea una condición de falla o una alternativa elegida por el actor— que provoca que el sistema exhiba un comportamiento distinto.

> "Esta presentación secuencial no considera interacciones alternativas (la narrativa era fluida y representaba unas cuantas alternativas). Los casos de uso de este tipo se conocen algunas veces como **escenarios principales**."

### Ejemplo

6. El propietario del hogar selecciona "elegir una cámara".
7. El sistema despliega el plano con las plantas de la casa.

## 4. Diagramas de casos de uso UML

Fuente: https://www.lucidchart.com/pages/uml-use-case-diagram

- Los **casos de uso** se representan con una **forma ovalada etiquetada**.
- Los **actores** se dibujan como **figuras de palitos**; su participación en el sistema se modela con una **línea entre el actor y el caso de uso**.
- Para representar el **límite del sistema**, se dibuja un **cuadro alrededor de los casos de uso**.

Los diagramas de casos de uso son ideales para comunicar el **alcance funcional** con clientes y usuarios no técnicos.

### ¿Para qué sirven?

- Visualizar quiénes (actores) interaccionan con el sistema y qué funcionalidades (casos de uso) están disponibles.
- Definir el alcance del sistema de forma clara y visual.
- Servir como punto de partida para el análisis de requerimientos.

## 5. Diagramas de actividades UML

### ¿Qué son?

Los diagramas de actividades pertenecen a los **diagramas de comportamiento (dinámicos)** de UML. Modelan el **flujo de trabajo** y la lógica de un proceso mediante actividades, decisiones y transiciones.

### Componentes

- **Actividad**: representa un trabajo que realiza el sistema.
- **Decisión (rombo)**: representa una bifurcación en el flujo, dependiendo de una condición.
- **Transición**: flecha que conecta actividades, mostrando la dirección del flujo.
- **Nodo inicial**: círculo relleno que marca el punto de partida.
- **Nodo final**: círculo con borde cuadrado que marca el punto final.

### Beneficios

- Visualizar procesos paralelos y flujos complejos de forma entendible para técnicos y no técnicos.
- Identificar puntos críticos, cuellos de botella y posibles mejoras en el proceso.
- Servir como base para la implementación del proceso en el sistema.

Fuente: https://www.lucidchart.com/pages/es/tutorial-diagrama-de-actividades-uml
