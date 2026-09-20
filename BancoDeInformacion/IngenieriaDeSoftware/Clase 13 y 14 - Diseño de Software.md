# Ingeniería de Software I — Clase 13 y 14: Diseño de Software

> Fuente: presentación de Verónica Chajín Ortiz (UNAB). Material de estudio para la cátedia.

## 1. ¿Qué es el diseño de software?

Es la etapa donde se combinan **creatividad y conocimiento técnico**. El diseño de software reúne principios, conceptos y prácticas que permiten **transformar los requerimientos en un sistema de alta calidad**, es decir, en **modelos de solución**.

El diseño transforma los requerimientos en modelos de solución que describen:

- La arquitectura del software.
- El diseño de componentes y módulos.
- El diseño de datos y clases.
- El diseño de interfaces.

### ¿Quién realiza el diseño?

Los **ingenieros de software** realizan las tareas de diseño. El diseñador debe ser quien entiende tanto el problema como las limitaciones del entorno en el que se implementará la solución.

## 2. ¿Por qué es importante el diseño?

- El diseño determina la calidad fundamental del software.
- Un buen diseño facilita el mantenimiento, la prueba y la evolución del sistema.
- Permite anticipar problemas antes de la implementación.
- Facilita la comunicación entre los miembros del equipo.

## 3. Pasos del diseño de software

1. **Definir el alcance**: clarificar qué debe hacer el sistema y qué queda fuera.
2. **Identificar restricciones**: considerar limitaciones técnicas, de tiempo, presupuesto y calidad.
3. **Seleccionar arquitectura**: elegir el patrón arquitectónico adecuado (capas, cliente-servidor, microservicios, etc.).
4. **Diseñar componentes**: descomponer el sistema en componentes y módulos cohesionados.
5. **Diseñar datos**: definir estructuras de datos, clases y bases de datos.
6. **Diseñar interfaces**: planificar la interacción entre componentes e interfaces de usuario.
7. **Revisar y refinar**: iterar sobre el diseño para mejorar la calidad.

## 4. Evaluación del diseño

El equipo evalúa el modelo para verificar:

- **Errores**: inconsistencias o fallas en la lógica del diseño.
- **Omisiones**: aspectos que no están cubiertos por el diseño.
- **Cumplimiento de restricciones de costo y tiempo**: el diseño es viable dentro de los límites.
- **Viabilidad técnica**: el diseño se puede implementar con la tecnología disponible.

## 5. Conceptos clave: diversificación y convergencia

- **Diversificación**: generar **múltiples alternativas de diseño** antes de comprometerse con una solución.
- **Convergencia**: evaluar las alternativas y **seleccionar la mejor solución** según los requerimientos funcionales y no funcionales.

## 6. Elementos del modelo de diseño

1. **Diseño de datos / clases**: una **clase** es una plantilla o molde que define cómo serán los objetos de un programa: qué **datos tendrán** (atributos, por ejemplo `nombre`, `edad`, `raza`) y qué **acciones podrán realizar** (métodos, por ejemplo `ladrar()`, `comer()`, `dormir()`).
2. **Diseño arquitectónico**: definición de la estructura de alto nivel del sistema.
3. **Diseño de interfaces**: cómo los componentes y usuarios interactúan con el sistema.
4. **Diseño de componentes**: desglose en módulos reutilizables y cohesionados.

> El modelo de diseño deriva del modelo de requerimientos.

## 7. Deuda técnica

Ocurre cuando se elige una **solución rápida** en lugar de una mejor solución de diseño.

### Consecuencias

- Mayor esfuerzo de mantenimiento.
- Código difícil de modificar.
- Incremento del costo del proyecto.

Como con una deuda financiera, **aplazar el pago implica intereses**: cuanto más tiempo convive el sistema con la solución improvisada, más cuesta corregirlo. Cada modificación futura sobre el código demalo acumula intereses.

## 8. Cómo manejar la deuda técnica

- **Identificar**: reconocer dónde y por qué se acumuló.
- **Cuantificar**: estimar el esfuerzo de refactorizar.
- **Priorizar**: abordar las áreas con mayor impacto o riesgo.
- **Refactorizar**: mejorar gradualmente el diseño sin cambiar el comportamiento.
- **Prevenir**: establecer prácticas (pruebas, revisiones, estándares) que eviten nueva deuda.

## 9. Ideas finales

El diseño es el **cimiento del software**. Sin un buen diseño:

- El sistema puede ser **inestable**.
- Es **difícil de probar**.
- Es **difícil de mantener**.

Un buen diseño permite software de **calidad, mantenible y escalable**.
