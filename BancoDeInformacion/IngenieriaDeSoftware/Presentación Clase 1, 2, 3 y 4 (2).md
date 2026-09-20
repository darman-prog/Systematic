# Ingeniería de Software I — Clases 1 a 4

> Fuente: presentación de Verónica Chajín Ortiz (UNAB). Material de estudio para la cátedra.

## 1. ¿Qué es el software?

El software no es solo el programa. Según la definición de clase, está compuesto por tres elementos que trabajan juntos:

- **Instrucciones** (programa de cómputo) que, al ejecutarse, proporcionan las características, función y desempeño buscados.
- **Estructuras de datos** que permiten a los programas manipular adecuadamente la información.
- **Información descriptiva** (en papel o en formas virtuales) que describe la operación y el uso de los programas.

### El software como producto y como vehículo

El software es **un producto y, al mismo tiempo, el vehículo para entregar un producto**. Es un **transformador de información**: produce, administra, adquiere, modifica, despliega o transmite información.

## 2. Características del software

- Se **desarrolla o modifica con intelecto**; no se manufactura en el sentido clásico. A diferencia del hardware, los errores se corrigen con relativa facilidad.
- **No se desgasta, pero sí se deteriora**. El software no sufre la curva de fallas del hardware (curva de bañera). Sin embargo, al ser dinámico, cada cambio puede introducir errores que generan picos súbitos en la curva real; los métodos de la ingeniería de software buscan reducir la magnitud de esos picos y la pendiente de la curva.
- La mayor parte del software se construye **para un uso particular**, por lo que la reutilización de código (librerías de componentes y plantillas) y los conjuntos de componentes estándar son clave.

## 3. Categorías del software

- **Software de sistemas**: conjunto de programas que dan servicio a otros programas (compiladores, editores y herramientas para administrar archivos, componentes de SO, controladores). Tiene gran interacción con el hardware y recursos compartidos.
- **Software de aplicación**: programas que resuelven una necesidad específica de negocio (procesos comerciales, de marketing, de venta, manufacturas, toma de decisiones).
- **Software de ingeniería y ciencias**: algoritmos numéricos para dominios como la biología molecular, la NASA, la astronomía o la sísmica. Evoluciona hacia el software de sistemas.
- **Software incrustado**: reside dentro de un producto o sistema y se usa para implementar y controlar características y funciones para el usuario final (electrodomésticos, automóviles).
- **Software de línea de productos**: proporciona una capacidad específica para muchos consumidores en un mercado limitado o masivo (control de inventario, procesadores de texto, entretenimiento).
- **Software de Inteligencia Artificial**: algoritmos no numéricos para resolver problemas complejos (robótica, sistemas expertos, reconocimiento de patrones imagen/voz, redes neuronales artificiales, juegos).
- **Aplicaciones Web y Apps**: centradas en redes. Tuvieron gran auge con la Web 2.0; la evolución del uso y la interacción de las personas en internet da lugar a la Web 3.0 (Web Semántica) y la Web 4.0 propone un nuevo modelo de interacción más completo y personalizado.

## 4. La crisis del software

La crisis del software se refiere a los retos actuales: el creciente tamaño y complejidad de los sistemas, los plazos cada vez más ajustados y la brecha entre lo que se promete y lo que se entrega. Algunas cifras de contexto:

- Un estudio de **The Standish Group** muestra que la mayoría de los proyectos grandes de software se retrasan, se van de presupuesto o no cumplen los objetivos.
- Un estudio de **Geneca** revela que las empresas pierden miles de millones anuales por proyectos mal gestionados.

Fuente: https://www.geneca.com/case-studies/ | https://standishgroup.myshopify.com/

## 5. El proceso del software

### ¿Qué es un proceso de software?

Un proceso combina **actividades, acciones y tareas** para crear un producto. Un punto central de la clase: un proceso **NO es una prescripción rígida** de cómo elaborar software. Es un **enfoque adaptable** que permite que las personas del equipo busquen y elijan el conjunto apropiado de acciones y tareas.

### Estructura del proceso: cinco actividades

1. **Comunicación**: comunicarse con el cliente y los involucrados; entender los objetivos del proyecto; reunir los requerimientos que ayuden a lograr ese objetivo.
2. **Planeación**: tareas técnicas, riesgos, recursos, productos, programación de actividades.
3. **Modelado**: arquitectura del software, análisis y diseño.
4. **Construcción**: generación de código, pruebas y detección de errores.
5. **Despliegue**: producto final entregable, evaluación del cliente y realimentación.

### Actividades sombrilla

Paralelamente a las cinco actividades, el proceso incluye **actividades sombrilla** que aplican durante todo el proyecto:

- Seguimiento y control del proyecto.
- Administración de riesgos.
- Aseguramiento de la calidad.
- Administración de la configuración.
- Revisiones técnicas.

## 6. Flujos de proceso

La forma en que se ejecutan las actividades define el flujo:

- **Lineal**: actividades estructurales en secuencia. Comienza por la comunicación y finaliza en el despliegue.
- **Iterativo**: repite una o más actividades antes de pasar a la siguiente.
- **Evolutivo**: se realizan las actividades en forma circular; cada circuito lleva a una versión más completa del software.
- **Paralelo**: ejecuta una o más actividades en paralelo con otras. Ejemplo: el modelado de un aspecto del software puede ejecutarse en paralelo con la construcción de otro aspecto.

## 7. Modelos de proceso

### Modelos prescriptivos

- **Modelo de Cascada (ciclo de vida clásico)**: el trabajo fluye en forma lineal; enfoque sistemático y secuencial. Funciona con **requerimientos bien definidos** y **estabilidad razonable**; paradigma más antiguo de la ingeniería del software.
- **Modelo en V**: variante del modelo de cascara que relaciona las acciones de aseguramiento de la calidad con aquellas asociadas a la comunicación, modelado y construcción temprana.

### Modelo incremental

Ejecuta una serie de avances llamados **incrementos**. En forma progresiva dan más funcionalidad al cliente conforme se le entrega cada incremento. Combina el proceso lineal con el paralelo. Cada entrega es un **producto operable**.

Ejemplo: un procesador de textos. El primer incremento es el producto fundamental: requerimientos básicos sin características que den valor agregado. Es útil cuando **no se cuenta con personal suficiente** para la implementación completa en el plazo establecido por el negocio.

### Modelos evolutivos

El software cambia en el tiempo y "evoluciona". Los procesos **iterativos**: cada iteración genera una versión final más completa del software. Productos del trabajo, aseguramiento de la calidad y mecanismos de control del cambio son características de los modelos evolutivos.

- **Prototipo**: aplica cuando el cliente tiene una necesidad real pero ignora los detalles. Algunos prototipos se construyen para ser desechados (throwaway), otros evolucionan hacia el modelo real.

## 8. El Proceso Unificado (PU / RUP)

El **Proceso Unificado** es un marco de trabajo "extensible" impulsado por **UML** (Lenguaje Unificado de Modelado). UML nació en **1990** de la unificación de los métodos individuales de análisis y diseño orientado a objetos de **James Rumbaugh**, **Grady Booch** e **Ivar Jacobson** (1995). RUP (Rational Unified Process) es su versión desarrollada por **Rational Corporation**.

### Fases del Proceso Unificado

1. **Concepción**: se identifican los requerimientos del negocio, se propone una arquitectura aproximada para el sistema y se desarrolla un plan para la naturaleza iterativa e incremental del proyecto.
2. **Elaboración**: incluye las actividades de comunicación y modelado del modelo general del proceso. Mejora y amplía los casos de uso preliminares y aumenta la representación de la arquitectura para incluir cinco puntos de vista: casos de uso, requerimientos, diseño, implementación y despliegue. En ciertos casos crea una "línea de base de la arquitectura ejecutable".
3. **Construcción**: con el modelo de arquitectura como entrada, desarrolla o adquiere los componentes del software que hacen operativo cada caso de uso. Se completan los modelos de requerimientos y diseño.
4. **Transición**: incluye las últimas etapas de construcción y la primera parte de despliegue (entrega y retroalimentación). Se da el software a los usuarios finales para pruebas beta; reportan defectos y cambios necesarios. El equipo genera información de apoyo (manuales de usuario, guías de solución de problemas, procedimientos de instalación). Al finalizar, el software incrementado se convierte en un producto utilizable que se lanza.
5. **Producción**: coincide con la actividad de despliegue del proceso general. Durante esta fase, se vigila el uso del software, se brinda apoyo al ambiente de operación e infraestructura y se reportan defectos y solicitudes de cambio. Es probable que simultáneamente se trabaje en el siguiente incremento del software.

## 9. UML — Lenguaje Unificado de Modelado

- **Lenguaje de visualización, especificación y documentación de software**.
- Basado en **trece tipos de diagramas**, cada uno con sus objetivos, destinatarios y contexto de uso.
- Se usa como herramienta de comunicación entre humanos y como herramienta de desarrollo.

Fuente: https://www.ibm.com/docs/es/engineering-lifecycle-management-suite/lifecycle-management/7.0.2

Herramienta recomendada: **StarUML** — https://www.staruml.io/ — Video tutorial: https://www.youtube.com/watch?v=simQnYluW-Q

### Diagramas estructurales (estáticos)

- Diagramas de casos de uso.
- Diagramas de objetos.
- Diagrama de clases.
- Diagrama de paquetes.
- Diagrama de despliegue.
- Diagrama de estructuras compuestas.

### Diagramas de comportamiento (dinámicos)

- Diagrama de secuencia.
- Diagrama de comunicación (colaboración).
- Diagrama de máquina de estados.
- Diagrama de actividades.
- Diagrama de visión global de la interacción.
- Diagrama de tiempos.

## 10. Desarrollo ágil y Scrum

### El Manifiesto Ágil

Redactado por **Kent Beck** y **16 prestigiosos desarrolladores**. "Estamos descubriendo formas mejores de desarrollar software, por medio de hacerlo y de dar ayuda a otros para que lo hagan." Ese trabajo nos ha hecho valorar:

- **Los individuos y sus interacciones**, sobre los procesos y las herramientas.
- **El software que funciona**, más que la documentación exhaustiva.
- **La colaboración con el cliente**, y no tanto la negociación del contrato.
- **Responder al cambio**, mejor que apegarse a un plan.

### Metodología Scrum

Su nombre proviene de una jugada de **Rugby**. Se utiliza para guiar actividades de desarrollo dentro de un proceso. Incorpora actividades estructurales: requerimientos, análisis, diseño, evolución y entrega. Dentro de cada actividad estructural, las tareas ocurren con un patrón del proceso llamado **Sprint**. El trabajo realizado dentro de un sprint se adapta al problema y se define en tiempo real por el equipo.

Scrum acentúa patrones de proceso que han demostrado ser eficaces para proyectos con **plazos de entrega muy cortos, requerimientos cambiantes y negocios críticos**.

Fuente: https://www.scrum.org/resources/blog/daily-scrum-en-la-guia-scrum-2020

### Acciones de desarrollo

- **Retraso (backlog)**: lista priorizada de requerimientos o características del proyecto que dan al cliente un valor del negocio. Se agregan otros aspectos en cualquier momento (introducen cambios); el gerente del proyecto evalúa el retraso y actualiza las prioridades según se requiera.

- **Sprints**: unidades de trabajo que se necesitan para alcanzar un requerimiento definido en un retraso. Se ajustan en una **caja de tiempo predefinida (30 días)**. Durante el sprint **no se introducen cambios**, permitiendo al equipo trabajar en un ambiente de corto plazo pero estable.

- **Reuniones Scrum (daily)**: breves (15 minutos), a diario. Tres preguntas clave:
  1. ¿Qué hiciste desde la última reunión del equipo?
  2. ¿Qué obstáculos estás encontrando?
  3. ¿Qué planeas hacer mientras llega la siguiente reunión?

  La junta la dirige un líder del equipo llamado **maestro Scrum** o **Scrum master**.

- **Demostraciones preliminares**: se entrega el incremento de software al cliente de modo que la funcionalidad que se vaya implementando pueda demostrarse y ser evaluada.

La guía de Scrum 2020 actualizó detalles del daily, pero su esencia sigue siendo inspeccionar el progreso y adaptar el plan del día.

### Beneficios del Daily Scrum

Fuente: https://donetonic.com/es/que-es-el-daily-scrum-meeting/
