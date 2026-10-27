# Evolución de la Arquitectura de Software — De los Monolitos a las Fronteras Distribuidas

Fuente: `14 - Evolución de las Arquitecturas de Software.pdf` (infografías NotebookLM, solo imágenes).
MarkItDown devuelve vacío en este PDF (sin capa de texto); contenido curado a mano desde la revisión visual del docente.
Tema central: del desorden simple a la complejidad estructurada a través de trade-offs.

## 1. Origen y caos: Big Ball of Mud

- Definición: jungla de código espagueti con soluciones rápidas; crecimiento sin regulaciones.
- Síntoma: la información se comparte promiscuamente; tocar una clase tiene efectos impredecibles.
- Impacto: sin despliegue ágil, sin testabilidad, rendimiento estancado.

## 2. Primera separación: Cliente/Servidor

- Sistemas unitarios: hardware + software indivisibles.
- 2-Tier: presentación en escritorio conectada directo a la BD.
- 3-Tier: se introduce el servidor de aplicaciones (presentación, aplicación, datos).
- Impulso: separar interfaces ligeras del procesamiento pesado. Limitación: infra separada pero negocio aún acoplado.

## 3. Estándar N-Tier por capas

- Capas: Presentación (UI/cliente), Negocios (reglas del dominio), Persistencia (abstracción y consultas), Base de Datos (almacenamiento físico). La petición (request) baja en ese orden.
- Principio clave: separación de preocupaciones técnicas; cada capa solo conoce la inmediata inferior.
- Ejemplo E-Commerce: monolítica (UI + lógica + datos juntos: difícil de escalar, poco mantenible) vs. N-Capas (presentación web/app -> negocio compras -> datos/BD: separación clara, escalable, mantenible).
- N-Capas realista (ej. Laravel): presentación sin lógica (Blade/Vue) -> aplicación/negocio (Services, Use Cases, DTOs, JWT/Sanctum) -> Repositories/ORM (Eloquent/Hibernate/Prisma) -> BD; servicios externos (Stripe, SendGrid, Redis, caché) por los costados. Antipatrones: lógica en controllers, queries directas, monolito difícil de escalar.

## 4. Monolito bien estructurado y flexibilidad física

- Modelo C4 nivel 2: Usuario -> Front (HTML/JS/React, HTTPS) -> App monolítica (Laravel/Spring/Node: UI + negocio + datos) -> BD (MySQL/PostgreSQL, SQL); APIs externas (Stripe pagos, SendGrid).
- Despliegues: unidad única (lógica unificada + datos externos, lo común); UI separada (escala la UI aparte); todo-en-uno (on-premise pequeño o BD en memoria).

## 5. Regla de oro: capas de aislamiento

- Capas cerradas: la petición no salta niveles; atraviesa la capa inmediata inferior.
- Absorción de impacto: cambiar una capa no afecta a las demás si los contratos se mantienen (ej. migrar JSF a React sin reescribir el núcleo).
- Abierta vs. cerrada: saltarse capas cerradas (fast-lane) destruye el aislamiento. Una capa de servicios compartidos puede declararse abierta: la superior la usa o la ignora limpiamente, con flexibilidad pragmática.

## 6. Antipatrón Architecture Sinkhole

- Sumidero: peticiones que cruzan todas las capas como pass-through, sin lógica ni transformación.
- Consecuencias: objetos innecesarios, memoria saturada, rendimiento degradado por puro tránsito.
- Regla 80/20: aceptable si solo el 20% son pass-through; si el 80% lo son, N-Tier es el patrón equivocado.

## 7. Punto de inflexión: técnica vs. dominio

- Cortes horizontales (monolito por capas): organiza por roles técnicos (Presentación/Lógica/Datos). Desventaja: un cambio de negocio ("Catálogo") obliga a tocar y redesplegar todas las capas.
- Cortes verticales (monolitos modulares y microservicios): organiza por flujos de trabajo/DDD (Catálogo, Checkout, Pagos, cada uno con su presentación/lógica/datos). Ventaja: el cambio queda encapsulado en una unidad vertical independiente.

## 8. Ruptura del quantum: monolito vs. distribuido

- Quantum arquitectónico: artefacto desplegable independiente con alta cohesión, que comparte BD y ciclo de vida.
- Monolito: Quantum = 1. Todo comparte perfil operativo; no se puede escalar Pagos sin escalar Reportes.
- Distribuida: Quantum = N. Rompe el núcleo central; cada servicio escala, despliega y elige tecnología de forma autónoma.

## 9. Por qué migrar a distribuidos

- Elasticidad: escalar solo lo bajo presión, sin desperdiciar recursos.
- Tolerancia a fallos (MTTR): en monolito un error fatal lo derriba todo; en red distribuida el fallo se aísla en un nodo.
- Velocidad de despliegue: equipos paralelos lanzan sin bloquear el núcleo.
- Radar comparativo: el monolito gana en simplicidad y costo inicial; lo distribuido gana en elasticidad, tolerancia a fallos y velocidad de despliegue.

## 10. Complejidad oculta: 8 falacias de la red

Parte 1: 1. La red es confiable (realidad: timeouts/particiones; usar retry + circuit breaker). 2. La latencia es cero (local nanosegundos vs. REST milisegundos). 3. El ancho de banda es infinito (payloads inflados ahogan la red). 4. La red es segura (cada endpoint es vector de ataque; OAuth/JWT).
Parte 2 (rompe ACID): 5. La topología nunca cambia (contenedores suben/bajan; service discovery). 6. Hay un solo administrador (múltiples equipos; logging distribuido obligatorio). 7. El transporte es gratis (serializar JSON e infra de red disparan costos nube). 8. La red es homogénea (múltiples lenguajes/SO/hardware).

## 11. Matriz de trade-offs y conclusión

| Dimensión | Monolito por capas | Sistema distribuido |
|---|---|---|
| Despliegue y agilidad | Bajo (riesgoso y lento) | Alto (independiente y rápido) |
| Transacciones | Simple (ACID absoluto) | Complejo (consistencia eventual / sagas) |
| Tolerancia a fallos | Baja (caída total) | Alta (aislamiento) |
| Simplicidad y costo inicial | Alta (rápido time-to-market) | Baja (exige madurez DevOps) |

- Cita (Mark Richards & Neal Ford): "No existen respuestas correctas o incorrectas en arquitectura, solo trade-offs". La distribución no es imperativo moral sino respuesta a presión empresarial: adopta complejidad solo cuando el dominio exija su recompensa.
