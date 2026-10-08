# 12 - Modelo N-Tier: Arquitectura Multicapa y N-Tier

Fuente: `12 - Modelo N-Tier.pdf` (material de clase de Arquitectura de Software).

## Capas (Layers) vs. Niveles (Tiers): distinción lógica y física

### Capas (Layers) — Separación lógica

- Organización del **código fuente** para estructurar responsabilidades.
- Ejecución dentro del **mismo proceso o servidor**, sin llamadas de red.

Un único servidor / proceso en memoria:

- Capa de Presentación (UI).
- Capa de Negocio / Lógica.
- Capa de Persistencia / Datos.

### Niveles (Tiers) — Despliegue físico

- Ubicación física y **despliegue de componentes en nodos independientes**.
- Comunicación entre niveles **mediante la red** (introduce latencia).

Ejemplo de 3 niveles:

- Tier 1: Cliente / Web — navegador o app mobile.
- Tier 2: Servidor App — servidor de aplicación.
- Tier 3: Base de Datos — servidor de base de datos (RDBMS).

## Evolución histórica: del cliente-servidor al N-Tier moderno

### Cliente-Servidor (2 niveles) — Cliente pesado

- La interfaz y la **lógica de negocio residían en la máquina del usuario**.
- Conexión **directa a la base de datos** relacional.
- Dificultad extrema para **actualizar la lógica distribuida**.

### Arquitectura Web (3 niveles) — Cliente liviano

- Separación formal: Presentación (HTML/JS) → Servidor de App → Base de Datos.
- **Lógica centralizada en el servidor**.

### Arquitectura N-Tier

- **Nodos especializados** distribuidos en red.
- Inclusión de **balanceadores de carga, BFF, capas de caché distribuida y clusters**.
- **Escalabilidad por componente**.

## Trade-offs del despliegue multinivel

### Ventajas operativas

- **Escalabilidad independiente**: cada nivel físico puede escalar hardware por separado según su demanda de carga.
- **Alta disponibilidad**: la replicación de nodos en un nivel evita puntos únicos de fallo (Single Point of Failure).
- **Seguridad perimetral**: permite aislar la base de datos tras cortafuegos (DMZ) sin exposición pública directa.

### Desventajas y costos

- **Penalización de rendimiento (latencia)**: el tránsito de datos entre servidores distantes por red (network hops) añade tiempo de respuesta.
- **Costo económico elevado**: requiere más infraestructura, servidores físicos/virtuales y licencias.
- **Complejidad de mantenimiento**: demanda equipos de infraestructura y redes para gestionar configuraciones y despliegues.

## Principio de Separación de Responsabilidades (Separation of Concerns – SoC)

| Nivel | Separación |
|---|---|
| Arquitectura | Capas lógicas: Presentación, Negocio y Persistencia. |
| Módulos / Clases | Principio SOLID SRP: cada clase tiene **una sola razón para cambiar**. |
| Lenguaje / Archivos | Desarrollo web: HTML (estructura), CSS (presentación) y JavaScript (comportamiento). |

¿Qué es una "responsabilidad" (concern)? Es una **funcionalidad individual del software**. El principio SoC divide el sistema en particiones independientes para reducir la complejidad y minimizar el solapamiento de código.

### Responsabilidades centrales (Core) vs. transversales (Cross-Cutting)

- **Centrales (Core Concerns)**: funcionalidad del dominio principal que justifica el software (ej. procesar pagos, calcular matrículas, gestionar inventario).
- **Transversales (Cross-Cutting)**: requisitos técnicos presentes en múltiples capas (ej. Logging, Seguridad/Autenticación, Auditoría, Gestión de Caché, Manejo de Excepciones).

### Patologías de código

- **Dispersión (Scattering)**: la lógica transversal se duplica por múltiples clases. Viola el principio **DRY** (Don't Repeat Yourself).
- **Enredo (Tangling)**: la lógica de infraestructura se mezcla dentro del código de negocio. Viola el principio **SRP**.
- **Solución**: Inyección de Dependencias (DI), Decorator.

## Particionamiento técnico vs. particionamiento por dominio

### Particionamiento técnico (multicapa)

- Agrupa componentes por su **función tecnológica**.
- Riesgo de **Domain Smearing**: la lógica de un concepto de negocio (ej. Checkout) se dispersa a través de todas las capas.

### Particionamiento por dominio

- Agrupa componentes por **áreas funcionales del negocio** (Bounded Contexts).
- Cada módulo encapsula su **propia pila técnica** (UI, lógica y datos): módulo Ventas, módulo Envíos, módulo Clientes.

## Pilares del diseño ortogonal

- **Alta cohesión (High Cohesion)**: grado en que los elementos de un módulo están fuertemente vinculados hacia un propósito único y bien definido.
- **Bajo acoplamiento (Loose Coupling)**: grado de interdependencia entre módulos. Un bajo acoplamiento evita que un cambio en un módulo obligue a modificar otros.
- **Ley de Demeter (Principio del Menor Conocimiento)**: un módulo u objeto no debe conocer los detalles internos de otros objetos. Un método solo debe comunicarse con sus "amigos cercanos".

## Capa de Presentación (UI) y patrones estructurales de interfaz

### Diseño de cliente liviano (Thin Client)

La capa de UI debe limitar su responsabilidad al **renderizado visual y validaciones sintácticas básicas** de entrada. La lógica de negocio debe quedar **totalmente excluida** de la interfaz.

### Model-View-Controller (MVC)

- **Model**: estado y datos.
- **View**: renderizado de interfaz.
- **Controller**: maneja eventos del usuario y actualiza el modelo.

### Model-View-ViewModel (MVVM)

- **ViewModel**: expone datos y comandos.
- Utiliza **vinculación bidireccional (Data Binding)** entre la vista y el ViewModel.

## Capa de Negocio, Persistencia y Motor de Datos

### Capa de Negocio / Aplicación (Business Layer)

- **Núcleo del sistema** (Core Domain).
- Aloja **reglas de negocio, cálculos, decisiones lógicas y validaciones complejas**.
- Orquesta entidades de dominio y **coordina llamadas a la persistencia**.

### Capa de Persistencia y Acceso a Datos (Data Access Layer)

- Encargada del **mapeo e interacción técnica** con el almacenamiento.
- Patrones **DAO (Data Access Object)** y **Repository**.
- Uso de herramientas **ORM (Object-Relational Mapping)** para traducir objetos a SQL.

### Motor de Datos / Almacén (Database Layer)

- Almacenamiento físico relacional (RDBMS como PostgreSQL/MySQL) o no relacional (MongoDB).
- El **desacoplamiento permite cambiar la tecnología de base de datos sin alterar la lógica de negocio**.

## Patrón Backend for Frontend (BFF): fachadas para clientes diversos

### Necesidad

- **El problema del API monolítico**: atender múltiples clientes (Web, iOS, Android, IoT) con un solo API provoca **Over-fetching** (datos innecesarios) o **Under-fetching** (múltiples llamadas consecutivas).
- **Solución BFF**: colocar **fachadas intermedias personalizadas** específicamente para cada tipo de cliente o canal de usuario.
- **Autonomía del Frontend**: permite que los desarrolladores de UI adapten sus propios endpoints sin requerir cambios globales en los servicios centrales del backend.

### Arquitectura BFF

- App Móvil (iOS/Android) → BFF Móvil.
- Sitio Web Desktop → BFF Web.
- Dispositivos IoT / API → BFF Dispositivos.

## Reglas de aislamiento

### Capas cerradas

- Las peticiones deben pasar **obligatoriamente por la capa inmediatamente inferior** (Presentación → Negocio → Persistencia).
- Ventaja: **desacoplamiento total y aislamiento de capas** (Layers of Isolation).

### Capas abiertas

- Permite que capas superiores **se salten capas intermedias** para llamar directamente a niveles más profundos.
- Uso: **reducir latencia** o acceder a servicios compartidos utilitarios. Riesgo: **aumenta el acoplamiento**.

## Ventajas clave de la arquitectura multicapa

### Comprobabilidad (Testability)

- **Aislamiento mediante interfaces**: las capas se comunican mediante abstracciones/interfaces, permitiendo aislar la lógica de negocio durante las pruebas.
- La **Inyección de Dependencias (DI)** permite sustituir la base de datos real por objetos simulados en memoria.
- **Pruebas unitarias aisladas** en memoria sin necesidad de conectar a una base de datos real, enviar peticiones de red o acceder al sistema de archivos.

### Reusabilidad (Reusability)

- **Múltiples interfaces de usuario**: una misma capa de negocio y datos puede servir simultáneamente a la Web, a una App Móvil o una API REST.
- **Estandarización de lógica**: evita la duplicación de código de reglas de negocio en diferentes clientes.
- **Intercambiabilidad de infraestructura**: permite actualizar o cambiar la base de datos sin alterar los servicios de aplicación superiores.

## Desventajas y patologías

### Efecto dominó (Ripple Effect / Change Coupling)

Un cambio simple (ej. agregar un nuevo campo en la aplicación) provoca **modificaciones en cascada** a través de todas las capas técnicas:

1. Base de Datos (agregar columna SQL).
2. Persistencia (actualizar ORM / DAO).
3. Negocio (modificar servicio).
4. Presentación (actualizar vista).

Impacto: reduce drásticamente la **agilidad del equipo** e incrementa la sobrecarga de conversión de datos entre capas.

## Escalado físico (Scale Out) y capas de caché distribuida

- **Servicios sin estado (Stateless)**: la capa de aplicación no guarda estado de sesión local, permitiendo que el Load Balancer distribuya tráfico libremente.
- **Caché distribuida (patrón Cache-Aside)**: intercala Redis o Memcached para absorber lecturas repetitivas antes de saturar la base de datos.
- **Escalado independiente por nivel**: aumenta réplicas de la capa con mayor demanda sin costo innecesario en la base de datos.

Flujo: Clientes / Web / Mobile → Balanceador de Carga (NLB / ALB) → Cluster Servidores App (Stateless Réplicas) → Caché Distribuida (Redis / Memcached) → Base de Datos (Primary / Replica).

## Cuándo mantener y cuándo evolucionar

### Cuándo mantener

- **Proyectos pequeños a medianos**: excelente arquitectura inicial por su simplicidad conceptual y rapidez de desarrollo.
- **Simplicidad de despliegue**: un solo artefacto ejecutable simplifica el mantenimiento y la gestión operacional.
- **Rendimiento**: llamadas directas entre capas en memoria, sin latencia de red ni transacciones distribuidas.

### Cuándo evolucionar

- **Escala y cuellos de botella técnicos**: un componente específico sufre picos de tráfico masivos y es necesario escalar.
- **Complejidad del código y mantenibilidad**: el acoplamiento cruzado provoca que pequeños cambios generen efectos no deseados.
- **Dinámica y tamaño de los equipos**: varios desarrolladores trabajando sobre el mismo repositorio (merge conflicts).
