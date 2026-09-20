// Apuntes curados de Ingeniería de Software (markdown revisado).
// Fuente: .md de BancoDeInformacion/IngenieriaDeSoftware/. Se completa por lotes revisados.
const apuntes = [
  {
    id: "AP-ISW-01",
    tema: "Software y sus categorías",
    titulo: "Qué es el software y cómo se clasifica",
    fuente: "BancoDeInformacion/IngenieriaDeSoftware/Presentación Clase 1, 2, 3 y 4 (2).md",
    contenido: `## ¿Qué es el software?

El software no es solo el programa: según la definición de clase, está compuesto por tres elementos que trabajan juntos:

- **Instrucciones** (programa de cómputo) que, al ejecutarse, proporcionan la función, las características y el desempeño buscados.
- **Estructuras de datos** que permiten a los programas manipular adecuadamente la información.
- **Información descriptiva** (en papel o virtual) que describe la operación y el uso de los programas.

Además, el software es **un producto y, a la vez, el vehículo para entregar un producto**: actúa como transformador de información, ya que produce, administra, adquiere, modifica, despliega o transmite información.

## Características que lo diferencian del hardware

- Se **desarrolla o modifica con intelecto**; no se manufactura en el sentido clásico. Por eso, a diferencia del hardware, los errores se corrigen con relativa facilidad.
- **No se desgasta, pero sí se deteriora**: no sufre la curva de fallas del hardware (curva de bañera). Sin embargo, al ser dinámico, cada cambio puede introducir errores que generan picos súbitos en la curva real; los métodos de la ingeniería de software buscan reducir la magnitud de esos picos.
- La mayor parte del software se construye **para un uso particular**, por lo que la reutilización de código (librerías de componentes y plantillas) y los conjuntos de componentes estándar son clave.

## Categorías del software

- **Software de sistemas**: da servicio a otros programas (compiladores, editores, administradores de archivos, componentes del SO, controladores). Tiene gran interacción con el hardware y recursos compartidos.
- **Software de aplicación**: resuelve necesidades específicas de negocio (procesos comerciales, marketing, ventas, manufactura, toma de decisiones).
- **Software de ingeniería y ciencias**: algoritmos numéricos para dominios como astronomía, biología molecular o sísmica.
- **Software incrustado**: reside dentro de un producto para controlar sus funciones (electrodomésticos, automóviles).
- **Software de línea de productos**: capacidad específica para muchos consumidores (control de inventario, procesadores de texto, entretenimiento).
- **Software de Inteligencia Artificial**: algoritmos no numéricos para problemas complejos (robótica, sistemas expertos, reconocimiento de patrones, redes neuronales).
- **Aplicaciones Web y Apps**: centradas en redes; evolucionaron con la Web 2.0 hacia la Web Semántica (3.0) y una Web 4.0 más personalizada.`
  },
  {
    id: "AP-ISW-02",
    tema: "Proceso del software",
    titulo: "Estructura y flujos del proceso de software",
    fuente: "BancoDeInformacion/IngenieriaDeSoftware/Presentación Clase 1, 2, 3 y 4 (2).md",
    contenido: `## ¿Qué es un proceso de software?

Un proceso combina **actividades, acciones y tareas** para crear un producto. Un punto central de la clase: un proceso **NO es una prescripción rígida** de cómo elaborar software. Es un **enfoque adaptable** que permite al equipo buscar y elegir el conjunto apropiado de acciones y tareas según el proyecto.

## Estructura del proceso: cinco actividades

1. **Comunicación**: hablar con el cliente y los involucrados, entender los objetivos del proyecto y reunir los requerimientos que ayuden a lograrlos.
2. **Planeación**: definir tareas técnicas, riesgos, recursos, productos y la programación de actividades.
3. **Modelado**: análisis y diseño, incluyendo la arquitectura del software.
4. **Construcción**: generación de código y pruebas para la detección de errores.
5. **Despliegue**: entrega del producto final, evaluación del cliente y realimentación.

## Actividades sombrilla

Paralelamente a las cinco actividades, el proceso incluye **actividades sombrilla** que aplican durante todo el proyecto:

- Seguimiento y control del proyecto.
- Administración de riesgos.
- Aseguramiento de la calidad.
- Administración de la configuración.
- Revisiones técnicas.

## Flujos de proceso

La forma en que se ejecutan las actividades define el flujo:

- **Lineal**: actividades en secuencia, desde la comunicación hasta el despliegue.
- **Iterativo**: se repite una o más actividades antes de pasar a la siguiente.
- **Evolutivo**: las actividades se realizan en forma circular; cada circuito produce una versión más completa del software.
- **Paralelo**: una o más actividades se ejecutan al mismo tiempo que otras; por ejemplo, el modelado de un aspecto del software puede avanzar en paralelo con la construcción de otro.

Elegir el flujo adecuado depende de la estabilidad de los requerimientos, el equipo y el negocio.`
  },
  {
    id: "AP-ISW-03",
    tema: "Modelos de proceso",
    titulo: "Cascada, incremental, evolutivo y Proceso Unificado",
    fuente: "BancoDeInformacion/IngenieriaDeSoftware/Presentación Clase 1, 2, 3 y 4 (2).md",
    contenido: `## Modelos prescriptivos

- **Modelo de Cascada (ciclo de vida clásico)**: es el paradigma más antiguo de la ingeniería de software. El trabajo fluye en forma lineal, con un enfoque sistemático y secuencial. Funciona bien cuando los **requerimientos están bien definidos** y hay estabilidad razonable, o en adaptaciones y mejoras bien definidas sobre un software existente.
- **Modelo en V**: variante de la cascada que relaciona las acciones de aseguramiento de la calidad con las actividades tempranas de comunicación, modelado y construcción.

## Modelo incremental

Ejecuta una serie de avances llamados **incrementos** que, de forma progresiva, entregan más funcionalidad al cliente. Combina el flujo lineal con el paralelo y cada entrega es un **producto operable**. Ejemplo clásico: un procesador de textos cuyo primer incremento contiene los requerimientos básicos, sin características de valor agregado. Es útil cuando **no se cuenta con personal suficiente** para implementar todo dentro del plazo que exige el negocio.

## Modelos evolutivos

El software cambia en el tiempo, "evoluciona": cada iteración genera una versión final más completa. El **prototipo** aplica cuando el cliente tiene una necesidad real pero **ignora los detalles** de lo que quiere; algunos prototipos se construyen para ser desechados y otros evolucionan hacia el producto real.

## Proceso Unificado (PU / RUP) y UML

El **Proceso Unificado** es un marco de trabajo "extensible" impulsado por **UML** (Lenguaje Unificado de Modelado). UML nació de la unificación de los métodos de análisis y diseño orientado a objetos de **James Rumbaugh, Grady Booch e Ivar Jacobson**. RUP (Rational Unified Process) es su versión desarrollada por Rational Corporation.

Sus fases son:

1. **Concepción**: requerimientos del negocio, arquitectura aproximada y plan iterativo-incremental.
2. **Elaboración**: mejora los casos de uso preliminares y amplía la arquitectura con cinco vistas (casos de uso, requerimientos, diseño, implementación y despliegue); puede crear una "línea de base de la arquitectura ejecutable".
3. **Construcción**: desarrolla o adquiere los componentes que hacen operativos los casos de uso.
4. **Transición**: pruebas beta con usuarios finales, reporte de defectos y generación de manuales e información de apoyo.
5. **Producción**: vigilancia del uso, soporte del ambiente de operación y evaluación de cambios.`
  },
  {
    id: "AP-ISW-04",
    tema: "Scrum",
    titulo: "Desarrollo ágil y metodología Scrum",
    fuente: "BancoDeInformacion/IngenieriaDeSoftware/Presentación Clase 1, 2, 3 y 4 (2).md",
    contenido: `## El Manifiesto Ágil

Redactado por Kent Beck y otros dieciséis desarrolladores, el Manifiesto Ágil declara cuatro valoraciones:

- **Los individuos y sus interacciones** sobre los procesos y las herramientas.
- **El software que funciona** más que la documentación exhaustiva.
- **La colaboración con el cliente** por encima de la negociación contractual.
- **Responder al cambio** mejor que apegarse a un plan.

## La metodología Scrum

Su nombre proviene de una **jugada de Rugby**. Se usa para guiar actividades de desarrollo dentro de un proceso que incorpora actividades estructurales (requerimientos, análisis, diseño, evolución y entrega); dentro de cada una, las tareas ocurren con un patrón llamado **Sprint**. Scrum acentúa patrones eficaces para proyectos con **plazos muy cortos, requerimientos cambiantes y negocios críticos**.

## Acciones de desarrollo

- **Retraso (backlog)**: lista priorizada de requerimientos o características que dan valor de negocio al cliente. Se pueden agregar aspectos en cualquier momento y el gerente del proyecto la evalúa y actualiza prioridades según se requiera.
- **Sprints**: unidades de trabajo para alcanzar un requerimiento del retraso, ajustadas a una **caja de tiempo predefinida (30 días)**. Durante el sprint **no se introducen cambios**, lo que da al equipo un ambiente de corto plazo pero estable.
- **Reuniones Scrum (daily)**: breves, de **15 minutos diarios**, dirigidas por el **maestro Scrum (Scrum master)** y centradas en tres preguntas: ¿qué hiciste desde la última reunión?, ¿qué obstáculos encuentras?, ¿qué planeas hacer hasta la siguiente?
- **Demostraciones preliminares**: se entrega el incremento al cliente para que la funcionalidad implementada se demuestre y evalúe.

La guía de Scrum 2020 actualizó detalles del daily, pero su esencia sigue siendo inspeccionar el progreso y adaptar el plan del día.`
  },
  {
    id: "AP-ISW-05",
    tema: "Metodologías ágiles",
    titulo: "Ágil vs. clásico, XP y Kanban",
    fuente: "BancoDeInformacion/IngenieriaDeSoftware/Presentación Clases 5, 6 y 7.md",
    contenido: `## Ágil frente a clásico

El enfoque clásico asume que los requerimientos se congelan al inicio; el ágil acepta que el cambio es constante. La diferencia clave se ve en el **costo del cambio**: en el enfoque convencional el costo crece fuertemente con el tiempo del proyecto, mientras que los métodos ágiles buscan mantenerlo bajo mediante entregas cortas y feedback continuo. La pregunta que guían las metodologías ágiles es cómo **controlar "lo imprevisible"**.

## Metodologías ágiles más utilizadas

- **Extreme Programming (XP)**: propuesta por Kent Beck; su flujo de proceso se apoya en prácticas de ingeniería muy disciplinadas y ciclos cortos de desarrollo.
- **Scrum**: organiza el trabajo en sprints con un backlog priorizado (vista en clase anterior).
- **Kanban**: visualiza el flujo de trabajo y limita el trabajo en curso.
- **Agile Inception** y **Design Sprint** (la metodología de Google) para arranques y descubrimiento rápido de soluciones.

## Kanban

Kanban se originó en **Toyota** como un conjunto de prácticas de **ingeniería industrial**; fue **David Anderson** quien lo adaptó al desarrollo de software. Sus aspectos clave:

- Los miembros del equipo **gestionan el trabajo** y tienen la **libertad de organizarse por sí mismos** para completarlo.
- Las **políticas evolucionan** según sea necesario para mejorar los resultados.
- El trabajo fluye visualmente por un tablero con estados (flujo del proceso Kanban), lo que hace visible el avance y los cuellos de botella.

## ¿Cuándo elegir cada enfoque?

El enfoque clásico encaja en contextos estables y con requerimientos bien definidos; los ágiles brillan cuando los requerimientos cambian, el cliente puede participar con frecuencia y el negocio necesita valor temprano. En la práctica, muchos equipos combinan prácticas de Scrum (ceremonias) con Kanban (tablero y límites de trabajo en curso).`
  },
  {
    id: "AP-ISW-06",
    tema: "Historias de usuario",
    titulo: "Gestión ágil, workflow e historias de usuario",
    fuente: "BancoDeInformacion/IngenieriaDeSoftware/Presentación Clases 8 y 9.md",
    contenido: `## El reto de entender qué se necesita

La frase que resume la clase: **"Hacer software es fácil… lo difícil es entender lo que se requiere que haga"**. De ahí la importancia de la ingeniería de requerimientos y del modelado para comprender los requerimientos antes de construir.

## Gestión ágil de proyectos

La gestión ágil de proyectos es una forma **iterativa** de gestionar proyectos de desarrollo de software, basada en **entregas continuas** e **integrar el feedback del cliente con cada iteración**.

## Workflow: flujos de trabajo ágiles

El workflow define los estados por los que pasa una tarea. Un flujo de trabajo bien realizado permite responder preguntas como:

- ¿Qué trabajo ha finalizado el equipo?
- ¿El backlog está aumentando o sigue el ritmo del equipo?
- ¿Cuántos elementos hay en cada estado?
- ¿Hay cuellos de botella que ralenticen al equipo?
- ¿Cuánto tarda una tarea media en completarse?
- ¿Cuántos elementos no pasaron los estándares de calidad a la primera?

## Historias, epics e iniciativas

Una **historia de usuario** es una explicación general e informal de una función de software, escrita **desde la perspectiva del usuario final**. Su propósito es articular cómo esa función **proporcionará valor al cliente**. Es la **unidad de trabajo más pequeña** de un marco ágil: un objetivo final, no una función, expresado desde la perspectiva del usuario.

Las historias son también los componentes básicos de estructuras mayores: los **epics** son grandes elementos de trabajo divididos en un conjunto de historias, y varios epics constituyen una **iniciativa**.

Este vocabulario (junto con *merge* y *backlog*) forma parte del glosario mínimo que el equipo ágil debe dominar para planear, estimar y hacer seguimiento del trabajo.`
  },
  {
    id: "AP-ISW-07",
    tema: "UML y casos de uso",
    titulo: "Modelado de requerimientos: casos de uso y diagramas UML",
    fuente: "BancoDeInformacion/IngenieriaDeSoftware/Presentación Clases 11, 12 y 13 (2).md",
    contenido: `## Análisis de requerimientos y modelado

El análisis de requerimientos produce **modelos** que ayudan a entender el sistema. Según su naturaleza, los modelos pueden ser de distintos tipos (escenarios, clases, comportamiento), y UML aporta la notación visual para expresarlos.

## Modelado basado en escenarios: casos de uso

Un **caso de uso** es la narración o plantilla que describe una función o rasgo del sistema **desde el punto de vista del usuario**; sirve de base para construir un modelo de requerimientos más completo. En el modelado se identifican **actores y perfiles de usuario**, y cada caso de uso debe definir qué contiene: actor, descripción, flujo de eventos y resultados.

Cuando la narrativa describe solo la secuencia típica, hablamos de un **escenario principal**. Cada paso del escenario principal debe evaluarse considerando **alternativas** y condiciones de falla: una **excepción o escenario secundario** describe una situación (una condición de falla o una alternativa elegida por el actor) que provoca que el sistema exhiba un comportamiento distinto.

## Diagramas de casos de uso UML

- Los casos de uso se representan con una **forma ovalada etiquetada**.
- Los **actores** se dibujan como **figuras de palitos**; su participación se modela con una línea entre el actor y el caso de uso.
- El **límite del sistema** se representa con un cuadro alrededor de los casos de uso.

Son ideales para comunicar el alcance funcional con clientes y usuarios no técnicos.

## Diagramas de actividades

Los diagramas de actividades pertenecen a los **diagramas de comportamiento (dinámicos)** de UML. Modelan el flujo de trabajo y la lógica de un proceso mediante actividades, decisiones y transiciones; entre sus beneficios está visualizar procesos paralelos y flujos complejos de forma entendible para técnicos y no técnicos.`
  },
  {
    id: "AP-ISW-08",
    tema: "Diseño de software",
    titulo: "Diseño de software y deuda técnica",
    fuente: "BancoDeInformacion/IngenieriaDeSoftware/Clase 13 y 14 - Diseño de Software.md",
    contenido: `## ¿Qué es el diseño de software?

Es la etapa donde se combinan **creatividad y conocimiento técnico**. El diseño reúne principios, conceptos y prácticas que permiten **transformar los requerimientos en un sistema de alta calidad**, es decir, en **modelos de solución**. Lo realizan los **ingenieros de software**.

## Evaluación del diseño

El equipo evalúa el modelo para verificar:

- Errores, inconsistencias y omisiones.
- Cumplimiento de restricciones de costo y tiempo.
- Viabilidad técnica.

## Conceptos clave: diversificación y convergencia

- **Diversificación**: generar múltiples alternativas de diseño.
- **Convergencia**: evaluar las alternativas y seleccionar la mejor solución según los requerimientos funcionales y no funcionales.

## Elementos del modelo de diseño

1. **Diseño de datos / clases**: una clase es una plantilla o molde que define cómo serán los objetos: qué **datos tendrán** (atributos, por ejemplo nombre, edad, raza) y qué **acciones podrán realizar** (métodos, por ejemplo ladrar(), comer(), dormir()).
2. **Diseño arquitectónico**.
3. **Diseño de interfaces**.
4. **Diseño de componentes**.

El modelo de diseño deriva del modelo de requerimientos.

## Deuda técnica

Ocurre cuando se elige una **solución rápida** en lugar de una **mejor solución de diseño**. Sus consecuencias:

- Mayor esfuerzo de mantenimiento.
- Código difícil de modificar.
- Incremento del costo del proyecto.

Como con una deuda financiera, aplazar el pago implica intereses: cuanto más tiempo convive el sistema con la solución improvisada, más cuesta corregirla.

## Ideas finales

El diseño es el **cimiento del software**. Sin un buen diseño, el sistema puede ser **inestable, difícil de probar y difícil de mantener**. Un buen diseño permite software de calidad, **mantenible y escalable**.`
  },
  {
    id: "AP-ISW-09",
    tema: "Interesados del proyecto",
    titulo: "Análisis de interesados: el caso ERP de Naibe",
    fuente: "BancoDeInformacion/IngenieriaDeSoftware/Guión de Interesados.md",
    contenido: `## El caso

La multinacional **Naibe Incorporated** decide reemplazar el ERP de planeación estratégica usado 18 años en Colombia por un software de clase mundial (JDE). Motivos: contar con **una sola plataforma mundial** (reportes e interfaces corporativas, consolidación de aplicaciones), manejar **información estructurada** y mejorar la **mantenibilidad** (soporte corporativo vs. local, evitar emuladores). El contratista **Pepesoft** ejecuta la tercera implementación para la multinacional y asume responsabilidades como *blueprinting* (levantar y documentar procesos), parametrización, instalación, entrenamiento de usuarios clave (KUs), ajustes según pruebas, apoyo en cargue de datos, transición entre sistemas (*cutover*), soporte del primer mes y soporte de tercer nivel.

## VOC: la voz de los interesados

El **guión de interesados** usa la técnica **VOC (Voice of Customers)**: cada personaje describe su percepción del proyecto y esa información alimenta el análisis de interesados y otros entregables como el Acta de Constitución.

- **Diego Sin Miedo** (gerente de proyecto interno): percibe que el proyecto no está alineado con el negocio; lo ven como "de TI"; le preocupan la resistencia al cambio, la barrera del idioma y es responsable de pruebas, entrenamiento y migración de datos.
- **Andrew Belt** (gerente del país): exige lecciones aprendidas de otras implementaciones y, si falla, responsabiliza a TI.
- **Herman Monster** (gerente regional de TI): se compromete con tiempo y costos; teme un atraso a marzo que chocaría con el cierre del trimestre y con la PMO de TI.
- **Al Good** (analista de negocios): conoce el sistema anterior, no habla bien inglés y duda de la integración del software.
- **Papa Jeff** (arquitecto empresarial): dedicación parcial; cuestiona módulos y desarrollos muy particulares.
- **Lucho Chávez** (gerente financiero): delega en el usuario financiero y se aleja del proyecto.
- **Yolohago Cuentas** (usuario financiero): se siente confundida y sobrecargada.

Lecciones: identificar interesados, sus intereses y riesgos (idioma, resistencia, dependencias) es tan crítico como la técnica.`
  }
];

export default apuntes;
