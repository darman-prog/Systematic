# Arquitectura Hexagonal — MSc. Feisar Moreno

Fuente: `13 - Arquitectura Hexagonal.pdf` convertido con MarkItDown (`microsoft/markitdown`) y revisado a mano.
Las imágenes de diagramas se transcriben como listas/tablas (el PDF original es visual).

## 1. Limitaciones de la Arquitectura N-Tier

- Esquema unidimensional: Presentación -> Negocio -> Persistencia/BD.
- Fuga de abstracción: las entidades de dominio terminan decoradas con anotaciones de base de datos (`@Entity`, `@Table`, `@Column`) y tipos SQL.
- Dependencia transitiva: el negocio depende conceptualmente de la base de datos subyacente.
- Costo de cambio elevado: un cambio en reglas de negocio propaga cambios técnicos en la UI y en tablas.
- Dificultad para pruebas aisladas: probar el negocio exige levantar bases relacionales completas.

## 2. Paradigma Hexagonal (I) — Núcleo interior vs. exterior simétrico

Núcleo interior:

- Soberanía del dominio: solo reglas de negocio puras, entidades y casos de uso.
- Agnósticismo tecnológico: sin frameworks web, drivers de BD, librerías UI ni protocolos de red.
- Regla: el código interior nunca depende del exterior ni filtra detalles técnicos.
- Lenguaje ubicuo: refleja el problema del negocio, no la infraestructura.

Exterior simétrico:

- Tratamiento simétrico: navegador, script batch y prueba unitaria son idénticos para el núcleo.
- Dispositivos periféricos: BD, colas, APIs de terceros y pantallas pertenecen al exterior.
- Puertos como fronteras: el interior solo habla con el exterior vía puertos funcionales.
- Intercambiabilidad total: cambiar de motor de BD o de protocolo no altera el dominio.

## 3. Paradigma Hexagonal (II) — Núcleo, puertos, adaptadores

- Núcleo (Inside): lógica de negocio pura. No conoce frameworks, BD ni protocolos.
- Puertos (Ports): frontera del hexágono. Contratos/interfaces puras definidas por el propósito del negocio, no por la tecnología.
- Adaptadores (Adapters): traductores tecnológicos entre el entorno externo y el dominio.
- Resumen: aislar el núcleo en el interior y rodearlo de puertos (contratos) y adaptadores (traductores).

Diagrama transcrito (primarios a la izquierda, secundarios a la derecha):

- Primarios (driving): REST Controller/HTTP, Test Harness (JUnit/FIT), CLI/Batch -> Puerto Primario 1/2 -> Núcleo (casos de uso, entidades, reglas).
- Secundarios (driven): Puerto Secundario 1/2 -> Base SQL/JPA (PostgreSQL/Oracle), Mock In-Memory (pruebas), Message Broker/API ext. (Kafka/RabbitMQ/Stripe).

## 4. La frontera de persistencia (DIP + DI)

- Inversión de dependencias: módulos de alto nivel y de bajo nivel dependen de abstracciones.
- Inversión de flechas: la ejecución va hacia la BD, pero la dependencia de código apunta al dominio.
- Inyección de dependencias (DI): en ejecución se inyecta el adaptador concreto por constructor.
- Ejemplo: `DiscounterApp.calculateDiscount(amt)` usa la interfaz `RateRepository.getRate(amt)`; la implementan `SqlRateRepository` (JDBC/JPA) y `MockRateRepository` (memoria).

## 5. Patrón Adapter (I–II)

- Adapter estructural: permite colaborar a objetos con interfaces incompatibles (como un adaptador físico de enchufe).
- Ejemplo motivador: tu sistema habla JSON pero la librería de terceros solo acepta XML o cambió nombres de métodos; no puedes modificarla ni reescribir tu sistema.
- Solución: clase Adaptador que envuelve al Adaptee, implementa la interfaz que el cliente espera, traduce la llamada/datos y delega el trabajo real.
- Diagrama UML: `Client --Use--> Target (abstract, +method())`; `Adapter` hereda de `Target` y agrega `Adaptee (+specificMethod())`.

## 6. Rol del patrón Adapter en la hexagonal

- Traduce señales técnicas externas a llamadas de métodos del puerto.
- Si una API/framework cambia de versión, solo se toca el adaptador.
- Evita que JSON, XML o `ResultSet` penetren el negocio.
- Primarios (Driving/Inbound): HTTP/eventos/consola -> comandos de dominio. Ej.: Controlador REST extrae JSON, valida y llama al dominio.
- Secundarios (Driven/Outbound): dominio -> infraestructura. Ej.: adaptador Hibernate traduce objetos a SQL y mapea resultados.

## 7. Patrón Repository (I–II)

- Capa de abstracción entre dominio y acceso a datos (SQL, NoSQL, APIs, memoria). La app trata la BD como colección en memoria de objetos de dominio.
- Sin él: alto acoplamiento (cambiar motor/ORM obliga a tocar toda la app) y pruebas imposibles sin BD real.
- Solución: interfaz abstracta con CRUD/búsqueda orientada a dominio (`guardar`, `obtener_por_id`, `eliminar`); implementaciones concretas (`RepositorioUsuarioSQL`, `RepositorioUsuarioMemoria`). El negocio solo depende de la interfaz.
- Diagrama UML: `Client --Use--> UserRepository (+save, +getById, +getAll)`; `SQLRepository (dbConection)` y `TestRepository (data: dict)` la implementan.

## 8. Rol del patrón Repository en la hexagonal

- Media entre dominio y mapeo de datos como colección en memoria.
- La interfaz es un puerto secundario dentro del núcleo; la implementación es un adaptador secundario en infraestructura.
- El dominio no conoce persistencia; para tests se inyecta el repositorio en memoria.

## 9. Dirección de las comunicaciones

- Primarios/Driving (izquierda/arriba): actores externos despiertan a la app. Adaptadores: REST/gRPC, CLI, JUnit, RabbitMQ (consumidor).
- Secundarios/Driven (derecha/abajo): la app invoca al exterior para persistir/consultar. Adaptadores: SQL/JPA/Hibernate, mock en memoria, HTTP Client (Stripe/PayPal), Kafka (publicador).

## 10. La frontera del hexágono — error tradicional vs. solución

- Error: casos de uso acoplados a la UI ("clic en guardar -> guarda en ORDERS"). Consecuencias: specs rígidas y frágiles, lógica no reutilizable por API o batch.
- Solución: casos de uso sobre el puerto ("calcula el descuento dado un monto válido"), agnóstico al origen (form, JSON, CSV), con precondiciones, reglas y postcondiciones.
- Ventajas: specs ejecutables (cada caso se valida con test), longevidad (sobrevive a rediseños UI/nube), desarrollo paralelo contra contratos.

## 11. Mapeo de una interacción (cálculo de descuento, extremo a extremo)

1. Cliente: `HTTP POST {amount: 500}`. 2. Adaptador primario: REST Controller valida y parsea. 3. Núcleo: `DiscounterApp` aplica `amt * rate` (solo conoce `RateRepository`). 4. Adaptador secundario: `SqlRateRepo`/Mock obtiene `rate`. 5. Infraestructura: PostgreSQL o memoria almacena.

## 12. Cuándo adoptar (y cuándo no)

- Adoptar: dominio con reglas cambiantes/complejas; necesidad de regresión rápida sin infra; múltiples canales (REST/CLI/eventos) o almacenamiento diverso; vida media/larga con evolución tecnológica.
- No adoptar: CRUD simples, prototipos rápidos (la abstracción cuesta más que el beneficio), sobrecarga de clases/DTOs/configuración.
- Principios: el dominio es soberano (nunca conoce BD/red/frameworks); los puertos son contratos funcionales (diseñados por propósito de negocio, no por tecnología).
