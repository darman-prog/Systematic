# Fundamentos del desarrollo de software (ASW-1)

Material fuente del lote ASW-1 (25 preguntas: ASW-061–ASW-085). Redactado con citas;
cada afirmación verificable remite a su fuente entre corchetes.

## 1. Tipos de sistemas

- **Sistema monolítico**: una sola unidad desplegable, un proceso, una base de datos;
  escala verticalmente. Rápido a escala pequeña; su modo de fallo es la contienda de
  releases [archtin.com, tabla comparativa].
- **Cliente-servidor**: dos niveles; el servidor guarda el estado autoritativo y el
  cliente lo consume. Riesgo: cliente charlatán (demasiadas idas) o con exceso de
  confianza [archtin.com].
- **Sistemas distribuidos**: varios nodos/servicios por red, dominios de fallo
  independientes, escalado horizontal. Exigen pensar comunicación, persistencia
  políglota, consistencia eventual y transacciones entre bases [AWS cloud-design-patterns].
- **Sistemas de tiempo real**: responden dentro de un plazo garantizado (p. ej. control
  industrial); lo crítico es el plazo, no la velocidad promedio.
- **Sistemas embebidos y de escritorio/móvil**: acoplados a hardware o a un SO concreto;
  cambian por compatibilidad de plataforma, no por despliegue continuo.

## 2. Estilos de arquitectura

- **Capas (N-tier)**: presentación, negocio, datos en una unidad. Familiar; su fallo es
  poner límites técnicos en vez de límites de dominio [archtin.com; ruchitsuthar.com 2026-06-03].
- **Monolito modular**: un despliegue con límites internos por dominio; paso intermedio
  reversible hacia servicios. Falla si las reglas se erosionan sin enforcement [idem].
- **Microservicios**: servicios finos por dominio con base propia, despliegue
  independiente y escalado horizontal. Gana autonomía y agilidad; cuesta complejidad
  distribuida (red, consistencia eventual, transacciones saga) [AWS; archtin.com].
- **SOA**: servicios gruesos integrados por orquestación (ESB); patrón empresarial
  clásico. Riesgo: cuello de botella en el bus [archtin.com].
- **Event-driven**: productores y consumidores desacoplados por un broker; ideal para
  carga en ráfagas. Riesgo: flujo de control invisible [archtin.com; AWS pub-sub].
- **Serverless/FaaS**: funciones y servicios gestionados bajo demanda; brilla en trabajo
  esporádico y disparado por eventos. Riesgo: arranques en frío y costo a escala [idem].
- **Hexagonal (puertos y adaptadores, Cockburn 2005)**: la lógica de negocio al centro
  define puertos (interfaces); BD, HTTP y colas son adaptadores. Dependencias hacia
  adentro: testeable sin infraestructura, a cambio de indirección [AWS; archtin.com].
- **CQRS + event sourcing**: separar lectura de escritura; los cambios se guardan como
  eventos inmutables y el estado se reconstruye reproduciéndolos (auditoría y
  trazabilidad total) [AWS].
- **Strangler fig**: migración por estrangulamiento — rodear el legado con servicios
  nuevos hasta reemplazarlo, en vez de reescribir de golpe [ruchitsuthar.com].
- Regla práctica: preferir lo reversible (un monolito modular puede volverse servicios;
  40 microservicios prematuros rara vez vuelven a algo) y mezclar a propósito
  (núcleo modular + flujos event-driven + hexagonal por dentro) [archtin.com].

## 3. API REST

- **REST** (Fielding): estilo sobre HTTP con recursos identificables, verbos con
  semántica, respuestas auto-descriptivas e hipermedia.
- **Recurso + URI**: cada cosa (pedido #42) tiene dirección propia; nada de un único
  endpoint para todo.
- **Verbos**: GET es seguro (no cambia nada → cacheable y repetible); POST crea;
  PUT reemplaza; DELETE elimina. Usar POST para todo es tunelización, no REST.
- **Códigos de estado**: 200 OK, 201 creado, 400 petición mala, 404 no existe, 500
  falló el servidor. Comunican el resultado sin leer el cuerpo.
- **Modelo de madurez de Richardson** (Leonard Richardson, vía martinfowler.com,
  2010-03-18): Nivel 0 un solo endpoint (RPC por HTTP); Nivel 1 recursos; Nivel 2
  verbos HTTP; Nivel 3 controles hipermedia (HATEOAS: la respuesta dice qué se puede
  hacer después). Fielding exige el nivel 3 para hablar de REST de verdad.
- **Stateless**: cada petición lleva su contexto (p. ej. token); el servidor no guarda
  sesión de cliente → escala horizontal sin afinidad.

## 4. MVC y variantes

- **MVC**: Modelo (datos y reglas), Vista (lo que se ve), Controlador (recibe la
  entrada y coordina). Nació en Smalltalk (Xerox PARC); en web el controlador suele
  devolver una vista o, con `@RestController`, el cuerpo de la respuesta directo
  [spring-guides/tut-rest].
- **MVP**: el Presentador media toda la lógica y la vista es pasiva; muy testeable,
  típico en Android clásico.
- **MVVM**: la Vista se enlaza (binding bidireccional) a un ViewModel con el estado
  presentable; típico en WPF, SwiftUI y frontend reactivo.
- **Cuándo cada una**: MVC para request/response clásico y APIs; MVP cuando la vista
  debe ser tonta y todo testeable; MVVM cuando hay binding declarativo disponible.
- **Error común**: lógica de negocio en el controlador (o en el `EmployeeController`
  que hace de todo) → controladores gordos; la regla va al modelo/servicio y el
  controlador solo traduce HTTP ↔ dominio [spring-guides/tut-rest].
