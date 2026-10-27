# Arquitectura de Microservicios — MSc. Feisar Moreno

Fuente: `15 - Arquitectura de Microservicios.pdf` convertido con MarkItDown (`microsoft/markitdown`) y revisado a mano (acentos y diagramas).

## 1. Introducción y definición

- Una aplicación (usualmente grande) se construye como conjunto de servicios independientes especializados; a diferencia del monolito (un solo bloque desplegable), cada componente funciona de forma autónoma.
- Monolito: UI + Business Logic + Data Access + Integration sobre una shared database central. Microservicios: User/Order/Product/Payment services, cada uno con su BD propia (bounded contexts 1–4), comunicados por API Gateway, Event Bus e inter-service communication hacia client apps.

## 2. Cuatro pilares

- Servicios autónomos y acotados: modelados alrededor de un dominio; desplegables sin afectar a otros; reducen coordinación entre equipos.
- Encapsulamiento: ocultan lógica interna; prohibido exponer esquemas de BD; solo contratos de API bien definidos.
- Cultura de automatización: CI/CD esperado; pruebas de contratos e integración; infraestructura como código (IaC) elástica.
- Aislamiento y resiliencia: fallos aislados sin caída total; zero-downtime; evolución tecnológica independiente por servicio.

## 3. Alineación con el negocio

- Ley de Conway: las organizaciones diseñan sistemas que reflejan sus comunicaciones. Para sistemas desacoplados, equipos por capacidades de negocio; evitar silos frontend/backend/DBA.
- Bounded Context (DDD): fronteras explícitas del modelo de dominio; define la responsabilidad exacta de cada microservicio; lenguaje ubicuo sin ambigüedad.
- Regla de las dos pizzas: equipos de 5–9 personas, dueños del ciclo completo (you build it, you run it), máxima velocidad y mínimas reuniones.

## 4. Estructuras de comunicación

- Síncrona (request-response): REST (HTTP/JSON), gRPC. El emisor bloquea esperando respuesta; alto acoplamiento temporal; riesgos de latencia acumulada y fallos en cascada. Ideal para consultas puntuales de baja latencia. Flujo: Servicio A --HTTP REST--> Servicio B --interna--> Servicio C, con responses en cadena.
- Asíncrona (event-driven): brokers Kafka, RabbitMQ, NATS. Producción/consumo desacoplados temporal y espacialmente; tolerante a fallos, con buffering y escalabilidad. Ideal entre dominios y tiempo real. Flujo: Servicio A --publica evento--> Event Broker --consume--> Servicios B y C.

## 5. Datos distribuidos

- Database per microservice: cada servicio es dueño único de su almacenamiento; prohibido compartir una BD relacional. Evita acoplamiento de esquema y permite elegir motor idóneo (relacional, NoSQL, caché).
- Estado local: motores embebidos de alto rendimiento para streams; distinguir almacenes de procesamiento en tiempo real de BD analíticas externas.
- CQRS (separa modelos de lectura optimizada y de escritura) y Event Sourcing (persiste cambios como secuencia inmutable de eventos en vez de actualizar el estado).

## 6. Coordinación de flujos

- Orquestación: un orquestador central coordina paso a paso (comandos directos, responses/estado). Ventaja: estado global visible. Desventaja: riesgo de "monolito distribuido" y punto único de fallo. Ideal para procesos complejos y síncronos.
- Coreografía: cada servicio escucha eventos y reacciona solo vía event bus compartido. Ventaja: máximo desacoplamiento y escalabilidad. Desventaja: difícil rastrear el flujo y los errores. Ideal para sistemas distribuidos por eventos.
- Patrón Saga: transacciones distribuidas como secuencia de transacciones locales: cada servicio ejecuta su transacción atómica local y publica el evento que dispara la siguiente; consistencia eventual en vez de ACID global; si un paso falla, transacciones compensatorias en orden inverso deshacen lo hecho.

## 7. Ventajas

- Coordinación: sin cuellos de botella en equipos grandes; despliegues paralelos; iteración rápida por objetivo de negocio.
- Escalabilidad elástica y localizada: solo el servicio bajo carga; cómputo/memoria eficientes; costos nube optimizados.
- Despliegue independiente y seguro: blast radius mínimo; rollback localizado; Blue-Green y Canary nativos.
- Heterogeneidad (polyglot): lenguaje/framework y motor de datos ideal por servicio (relacional, documentos, grafos); experimentación sin reemplazar el stack.

## 8. Costos y complejidad ("Microservice Tax")

- Tax: alto costo inicial (infra, CI/CD, redes); observabilidad obligatoria (trazas, métricas, logs); gobernanza de APIs.
- Red: llamadas de red en vez de memoria local; latencias, relojes y paquetes perdidos; diseñar para el fallo (circuit breakers, retries).
- Consistencia eventual: se pierde el ACID simple; datos duplicados y vistas desactualizadas; integridad referencial global difícil.
- Feedback extenso: errores difíciles de reproducir en local; integración compleja e incierta; comportamiento emergente difícil de diagnosticar.

## 9. Ecosistema software

- Contenedores (Docker): código + binarios + dependencias aislados; inmutabilidad dev/prod; aislamiento a nivel SO.
- Orquestación/CMS (Kubernetes, ECS): scheduling en clústeres; auto-repair y auto-scaling horizontal (HPA); descubrimiento y balanceo nativos.
- Service Mesh (Istio, Linkerd, sidecar): resiliencia fuera del código; mTLS, circuit breakers, inyección de fallos, trazabilidad transparente.
- Serverless/FaaS (Lambda, Cloud Run): cómputo efímero por eventos; escala a cero y pago por ejecución; sin servidores que gestionar.

## 10. Ecosistema hardware

- Commodity en clúster: servidores estándar baratos en clústeres elásticos en vez de mainframes verticales; tolerancia por redundancia de software.
- Nodos especializados: memoria (cachés Redis, streams Kafka) vs. CPU (algoritmos intensivos); alinear hardware con el perfil del servicio.
- Almacenamiento: SSD/NVMe locales (baja latencia para estado interno) vs. red NAS/EBS (flexibilidad y persistencia fuera del nodo). Trade-off latencia vs. volatilidad.

## 11. Migración

- Strangler Fig: migración gradual; API Gateway/Proxy enruta progresivamente a los nuevos servicios hasta que el monolito desaparece, sin big bang.
- Data Liberation (CDC, ej. Debezium): captura cambios de la BD legacy y publica eventos al broker sin tocar código viejo; alimenta servicios nuevos con datos frescos.
- Ejemplo E-Commerce/reservas: Búsqueda (NoSQL + caché), Reservas (consistencia estricta), Pagos (saga/integración), Notificaciones (eventos asíncronos).

## 12. Conclusiones

1. No empieces con microservicios si no los necesitas (sin escala por componente ni fricción entre equipos, el monolito bien estructurado es más rápido y barato). 2. Modela por dominios (bounded contexts), no por capas tecnológicas (un "servicio de BD" acopla todo). 3. Automatiza la infra antes de multiplicar servicios (sin CI/CD, observabilidad e IaC, decenas de servicios son inmanejables).
