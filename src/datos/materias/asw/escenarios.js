// Escenarios multi-paso de Arquitectura de Software con metodología pedagógica:
// Multi-Lente (Negocio, Calidad SEI, Síntoma Técnico), Variantes de enunciado,
// Autopsia de fallos (Incidente, Trampa Mental, Regla de Examen) y Puente temático.
const escenarios = [
  {
    id: "ESC-ASW-01",
    titulo: "Reportes lentos en la app de streaming",
    tema: "Patrones de Diseño y Principios",
    intro: "La app de streaming genera reportes analíticos de consumo. Cada reporte repite el mismo esqueleto de ejecución, las consultas a la base de datos saturan los pools de conexiones y los filtros de validación se apilan en condicionales inestables. El equipo te pide rediseñar el módulo aplicando patrones GoF y principios SOLID.",
    pasos: [
      {
        id: "p1",
        tema: "Patrones de Comportamiento",
        narrativa: "Cada reporte repite la secuencia invariable 'obtener datos, calcular métricas, formatear salida', variando únicamente el algoritmo de cálculo y el formato final. ¿Qué patrón arquitectónico aplicas?",
        variantes: [
          "El proceso de generación de reportes duplica la estructura del flujo de control en 6 clases diferentes, cambiando solo detalles específicos de agregación. ¿Cómo unificas el invariante?",
          "El equipo necesita asegurar que ningún reporte omita el paso obligatorio de auditoría previa al formateo, permitiendo a la vez algoritmos personalizados. ¿Qué estructura recomiendas?"
        ],
        lentes: {
          negocio: "Cada cambio en la política de auditoría de reportes obliga a editar 14 archivos distintos, retrasando entregas comerciales.",
          calidad: "Reusabilidad y Mantenibilidad: encapsular el algoritmo invariante en un componente reutilizable y delegar pasos variantes.",
          sintoma: "Código duplicado con 'Copy-Paste programming'; métodos de 300 líneas con 90% de coincidencia estructural."
        },
        opciones: [
          {
            texto: "Template Method: definir el esqueleto del algoritmo en un método plantilla de la clase base y diferir los pasos variables a subclases concretas.",
            feedback: "Correcto: El esqueleto común vive en un único lugar; las subclases solo redefinen los ganchos o métodos primitivos variables sin alterar la estructura del algoritmo.",
            puntos: 2,
            siguiente: "p2"
          },
          {
            texto: "Copiar la clase del primer reporte y ajustar los cálculos específicos en cada nueva copia.",
            feedback: "Incorrecto: Duplicación masiva de código y violación severa de DRY.",
            puntos: 0,
            siguiente: "p2",
            autopsia: {
              incidente: "Se actualizó una regla de seguridad en el esqueleto y 3 reportes copiados no recibieron el parche, exponiendo datos de clientes.",
              trampa: "Parece el camino más rápido para entregar el requerimiento en el sprint sin pensar en abstracciones.",
              principio: "Principio DRY (Don't Repeat Yourself) y encapsulación del algoritmo: el invariante debe existir en un único lugar."
            }
          },
          {
            texto: "Un método monolítico con banderas booleanas (flags) para bifurcar la ejecución según el tipo de reporte.",
            feedback: "Parcial: Evita duplicar archivos pero acumula complejidad ciclomática inmanejable.",
            puntos: 1,
            siguiente: "p2",
            autopsia: {
              incidente: "Un nuevo flag introducido para reportes ejecutivos rompió silenciosamente el formato de los reportes diarios de facturación.",
              trampa: "Evita crear nuevas clases a cambio de agregar condicionales rápidos dentro del mismo método.",
              principio: "Principio Abierto/Cerrado (OCP): el código debe estar abierto a extensión mediante polimorfismo, no modificado con condicionales."
            }
          }
        ]
      },
      {
        id: "p2",
        tema: "Patrones Estructurales",
        narrativa: "Las consultas a la base de datos para generar los reportes consumen tiempo excesivo y los mismos bloques de datos históricos se solicitan decenas de veces por hora. ¿Cómo optimizas el acceso sin modificar el cliente?",
        variantes: [
          "El servicio de datos de reproducciones satura el pool de conexiones relacionales por lecturas repetitivas idénticas. ¿Qué patrón permite interponer caché de forma transparente?",
          "El cliente de reportes depende de una interfaz 'IServicioMetricas'. Necesitas cachear respuestas costosas sin que el cliente se entere del cambio técnico."
        ],
        lentes: {
          negocio: "Los usuarios abandonan el panel administrativo porque la carga de reportes tarda más de 25 segundos durante horas pico.",
          calidad: "Rendimiento y Transparencia: reducir latencia y carga de I/O preservando el contrato de la interfaz (LSP).",
          sintoma: "Consultas SQL repetitivas ejecutadas contra la réplica principal para obtener exactamente el mismo dataset inmutable."
        },
        opciones: [
          {
            texto: "Proxy de Caché: implementar la misma interfaz del servicio de datos, interceptar las peticiones y responder desde memoria si los datos ya fueron consultados.",
            feedback: "Correcto: El proxy controla el acceso al recurso costoso de forma transparente para el cliente, respetando el principio de sustitución de Liskov.",
            puntos: 2,
            siguiente: "p3"
          },
          {
            texto: "Implementar el patrón Prototype para clonar en memoria objetos de reporte previamente calculados.",
            feedback: "Parcial: Prototype clona estructuras en memoria pero no gestiona la clave de búsqueda, expiración ni intercepción de las consultas.",
            puntos: 1,
            siguiente: "p3",
            autopsia: {
              incidente: "La memoria del servidor colapsó por retener clones de reportes completos sin política de desalojo ni control de acceso.",
              trampa: "Confundir la clonación de instancias de objetos con una estrategia de caché de acceso a datos.",
              principio: "El patrón Prototype resuelve el costo de instanciación de objetos complejos, no el control de acceso a un subsistema I/O costoso."
            }
          },
          {
            texto: "Almacenar los resultados de las consultas en un diccionario estático global accesible desde cualquier capa de la aplicación.",
            feedback: "Incorrecto: Introduce estado mutable global sin control de concurrencia ni encapsulación.",
            puntos: 0,
            siguiente: "p3",
            autopsia: {
              incidente: "Condiciones de carrera (race conditions) corrompieron el diccionario global bajo concurrencia, congelando el proceso web completo.",
              trampa: "Usar variables globales como atajo sin considerar concurrencia, invalidación ni acoplamiento.",
              principio: "Encapsulación y Single Responsibility: el ciclo de vida de la caché debe gestionarse en un componente acotado con interfaces claras."
            }
          }
        ]
      },
      {
        id: "p3",
        tema: "Patrones Estructurales",
        narrativa: "El reporte final mezcla elementos simples (un párrafo de texto o una métrica KPI) y colecciones complejas (tablas anidadas y gráficos con subsecciones). ¿Cómo modelas la estructura jerárquica?",
        variantes: [
          "El generador de documentos debe tratar elementos individuales y grupos anidados de elementos bajo un contrato común y uniforme. ¿Qué patrón seleccionas?",
          "Se requiere recorrer y renderizar un árbol de componentes visuales de reporte sin que el cliente deba verificar con 'instanceof' si un nodo es hoja o sección."
        ],
        lentes: {
          negocio: "Finanzas pide reorganizar la disposición del reporte con nuevas subsecciones y el equipo tarda 2 semanas en reescribir el parser.",
          calidad: "Extensibilidad y Polimorfismo: tratamiento uniforme de objetos compuestos y objetos hoja.",
          sintoma: "Múltiples comprobaciones de tipo 'if (nodo instanceof SubSeccion)' dispersas en el motor de renderizado."
        },
        opciones: [
          {
            texto: "Composite: definir una interfaz común para elementos hoja y nodos compuestos, permitiendo que los clientes traten jerarquías y elementos individuales de forma uniforme.",
            feedback: "Correcto: El cliente invoca render() sobre la raíz y la llamada se propaga recursivamente por todo el árbol sin distinguir hojas de contenedores.",
            puntos: 2,
            siguiente: "p4"
          },
          {
            texto: "Una jerarquía rígida de herencia donde una Sección nunca puede contener otra Sección, forzando un modelo plano de 2 niveles.",
            feedback: "Incorrecto: Restringe los requerimientos del dominio y traslada la complejidad de anidamiento a lógica artificial en el cliente.",
            puntos: 0,
            siguiente: "p4",
            autopsia: {
              incidente: "Marketing solicitó sub-desgloses por región dentro de cada categoría y el sistema fue incapaz de representarlo sin rehacer la arquitectura.",
              trampa: "Aplanar artificialmente una jerarquía para evitar manejar recursividad en el código.",
              principio: "El diseño debe reflejar la naturaleza intrínseca del dominio: estructuras recursivas requieren abstracciones componibles."
            }
          },
          {
            texto: "Concatenar strings en un único método formateador con acumuladores de texto y bucles anidados.",
            feedback: "Parcial: Funciona para estructuras estáticas pero es extremadamente frágil ante cambios de diseño.",
            puntos: 1,
            siguiente: "p4",
            autopsia: {
              incidente: "Un cambio en la indentación de una tabla desalineó todas las gráficas y generó reportes PDF ilegibles en producción.",
              trampa: "Resolver problemas estructurales mediante manipulación directa de cadenas de caracteres.",
              principio: "Separación de conceptos (SoC): la representación de la estructura del documento debe estar separada de su serialización física."
            }
          }
        ]
      },
      {
        id: "p4",
        tema: "Patrones de Comportamiento",
        narrativa: "Antes de emitir el reporte, se aplican múltiples pasos de saneamiento, validación tributaria y filtrado de datos confidenciales. Las reglas cambian con frecuencia y su orden debe ser configurable. ¿Qué patrón arquitectónico eliges?",
        variantes: [
          "Un pipeline de filtros debe procesar la información de forma secuencial; cada filtro decide si procesa, transforma o detiene el flujo. ¿Qué patrón aplicas?",
          "Se necesita agregar o retirar filtros de validación de reportes mediante configuración dinámica sin modificar las clases de los filtros existentes."
        ],
        lentes: {
          negocio: "Cumplimiento legal exige incorporar un filtro de anonimización de datos (GDPR) sin detener la generación de reportes existentes.",
          calidad: "Desacoplamiento y Flexibilidad: desacoplar el emisor de la petición de sus posibles receptores encadenados.",
          sintoma: "Un switch-case gigante de 500 líneas donde se invocan métodos estáticos de validación en orden cableado."
        },
        opciones: [
          {
            texto: "Chain of Responsibility: encadenar los objetos receptores de validación para que cada uno procese o delegue al siguiente según corresponda.",
            feedback: "Correcto: Configurar, reordenar o añadir nuevos filtros es puramente ensamblado de objetos sin alterar el código de los filtros existentes.",
            puntos: 2,
            siguiente: "p5"
          },
          {
            texto: "Un método centralizado con un switch-case que evalúa todas las validaciones secuencialmente mediante flags de configuración.",
            feedback: "Incorrecto: Viola OCP y genera un método Dios altamente propenso a errores colaterales.",
            puntos: 0,
            siguiente: "p5",
            autopsia: {
              incidente: "Al agregar la validación tributaria en el switch central, se alteró accidentalmente una condición de salida que omitió el filtro de privacidad.",
              trampa: "Centralizar todas las reglas en un solo método condicional creyendo que facilita la lectura lineal.",
              principio: "Principio Abierto/Cerrado: cada nueva regla de validación debe ser una nueva clase, no un nuevo 'case' en un método central."
            }
          },
          {
            texto: "Duplicar la cadena de validación dentro de cada subclase de reporte para que cada una gestione sus propios filtros.",
            feedback: "Parcial: Permite especializar filtros por reporte pero duplica la lógica de validaciones transversales obligatorias.",
            puntos: 1,
            siguiente: "p5",
            autopsia: {
              incidente: "Un filtro crítico de seguridad se actualizó en el reporte de reproducciones pero se olvidó en el reporte de descargas.",
              trampa: "Priorizar la autonomía de cada subclase a costa de fragmentar y duplicar políticas corporativas obligatorias.",
              principio: "Reutilización de políticas transversales mediante composición: no duplicar pipelines idénticos."
            }
          }
        ]
      },
      {
        id: "p5",
        tema: "Principios de Diseño",
        narrativa: "Al culminar el rediseño del sistema de reportes, el comité de arquitectura te solicita formular la directriz de diseño que guiará las futuras extensiones del módulo. ¿Cuál es la regla fundamental?",
        variantes: [
          "¿Cuál es el principio arquitectónico transversal que sostiene la flexibilidad de Template Method, Proxy, Composite y Chain of Responsibility?",
          "Para evitar que el módulo de reportes vuelva a degenerar en código espagueti con el tiempo, ¿qué directriz de diseño debe quedar plasmada en la documentación?"
        ],
        lentes: {
          negocio: "Garantizar que el costo de mantenimiento y el tiempo de salida al mercado (time-to-market) se mantengan constantes a medida que crece el sistema.",
          calidad: "Robustez y Estabilidad: minimizar el acoplamiento y maximizar la cohesión del diseño global.",
          sintoma: "Sistemas frágiles donde cualquier nuevo requerimiento desencadena errores en cascada en módulos no relacionados."
        },
        opciones: [
          {
            texto: "Programar contra interfaces, no contra implementaciones concretas, y encapsular aquello que varía separándolo de lo que permanece inalterable.",
            feedback: "Correcto: Es la piedra angular del diseño orientado a objetos: desacopla el cliente de los detalles técnicos y permite evolución sin fricción.",
            puntos: 2,
            siguiente: "fin"
          },
          {
            texto: "Reutilizar código prioritariamente mediante herencia profunda de superclases compartidas para concentrar utilidades comunes.",
            feedback: "Incorrecto: Antipatrón de herencia forzada; genera acoplamiento frágil y jerarquías rígidas imposibles de refactorizar.",
            puntos: 0,
            siguiente: "fin",
            autopsia: {
              incidente: "Un cambio en la superclase base para soportar reportes móviles rompió el cálculo de comisiones en todos los reportes de escritorio.",
              trampa: "Creer que la herencia es la forma primaria de reutilización, olvidando que la composición ofrece mayor flexibilidad en tiempo de ejecución.",
              principio: "Composición sobre herencia (Favor composition over inheritance) y desacoplamiento estructural."
            }
          },
          {
            texto: "Priorizar la optimización temprana de algoritmos y consumo de CPU antes de definir interfaces o divisiones modulares.",
            feedback: "Parcial: Optimizar a ciegas sin una arquitectura desacoplada crea código prematuramente complejo y difícil de mantener.",
            puntos: 1,
            siguiente: "fin",
            autopsia: {
              incidente: "Se implementó un algoritmo altamente optimizado en ensamblador inline que impedía migrar el sistema a la nube de 64 bits.",
              trampa: "La fascinación técnica por la velocidad bruta en micro-benchmarks por encima de la claridad y mantenibilidad del software.",
              principio: "Regla de Donald Knuth: 'La optimización prematura es la raíz de todos los males'. Diseña con arquitectura limpia y optimiza con métricas."
            }
          }
        ]
      }
    ],
    finales: {
      exito: "Diseño ejemplar: aplicaste patrones de comportamiento y estructurales respetando SOLID. El esqueleto es limpio, la caché es transparente y agregar nuevos reportes toma horas sin alterar el código existente.",
      parcial: "El módulo mejoró la estructura base, pero algunos atajos condicionales o supuestos de herencia acumularon deuda técnica que encarecerá futuros requerimientos.",
      fracaso: "El rediseño fracasó: duplicación de código, variables globales y herencia frágil garantizaron que cualquier cambio futuro rompa reportes en producción."
    }
  },
  {
    id: "ESC-ASW-02",
    titulo: "Evolución Arquitectónica: De Monolito N-Tier a Servicios Resilientes",
    tema: "Estilos Arquitectónicos y Sistemas Distribuidos",
    intro: "Una plataforma de reservas y cobros procesa 30.000 operaciones por minuto en picos. El sistema actual es un monolito N-Tier desplegado en 3 capas físicas. El negocio reporta que caídas en la pasarela externa de cobros bloquean las consultas de reservas, y que actualizar el esquema relacional exige detener el sistema. El comité de arquitectura te encarga liderar la modernización hacia una arquitectura limpia y desacoplada.",
    pasos: [
      {
        id: "p1",
        tema: "Arquitectura Hexagonal",
        narrativa: "En el backend actual, las entidades de dominio tienen anotaciones del ORM (@Entity, @Table) y los servicios de negocio ejecutan consultas SQL nativas. Negocio exige poder cambiar de base de datos relacional a un esquema políglota sin afectar las reglas de negocio. ¿Cómo aíslas el núcleo?",
        variantes: [
          "El modelo de dominio sufre de fuga de abstracción técnica: cambiar de JPA/Hibernate a un almacén de documentos obliga a modificar las reglas de comisiones. ¿Cómo aplicas Inversión de Dependencias?",
          "Se requiere probar las reglas de reservas en pruebas unitarias puras en memoria sin necesidad de levantar bases de datos relacionales ni contenedores Docker. ¿Cómo estructuras las capas?"
        ],
        lentes: {
          negocio: "Una actualización mayor del motor de base de datos demoró 3 meses debido al acoplamiento de las reglas financieras con tipos SQL.",
          calidad: "Testabilidad e Independencia Tecnológica: el dominio debe ser agnóstico a bases de datos, frameworks web y protocolos de transporte.",
          sintoma: "Clases de negocio importando paquetes 'javax.persistence.*' o ejecutando llamadas 'entityManager.createNativeQuery()'."
        },
        opciones: [
          {
            texto: "Arquitectura Hexagonal: definir Puertos Secundarios (interfaces en el dominio) para operaciones de persistencia y colocar el ORM en Adaptadores externos de infraestructura, con modelos de datos independientes.",
            feedback: "Correcto: Aplica Inversión de Dependencias (DIP). El dominio es soberano y agnóstico a la tecnología; cambiar de motor relacional a NoSQL solo requiere crear un nuevo adaptador sin tocar una sola regla de negocio.",
            puntos: 2,
            siguiente: "p2"
          },
          {
            texto: "Mantener N-Tier agregando una capa de DTOs entre la capa de negocio y la capa de acceso a datos (DAO), usando interfaces en los DAOs pero conservando las entidades anotadas del ORM.",
            feedback: "Parcial: Los DTOs aíslan la transferencia de datos, pero la fuga de abstracción persiste: el dominio sigue atado al ciclo de vida del ORM y a tipos SQL.",
            puntos: 1,
            siguiente: "p2",
            autopsia: {
              incidente: "Una migración de versión del ORM modificó el comportamiento de carga diferida (lazy loading), disparando excepciones en producción durante el cálculo de reservas.",
              trampa: "Creer que agregar DTOs soluciona la dependencia conceptual cuando las entidades de negocio siguen decoradas con anotaciones de base de datos.",
              principio: "Regla de Dependencia de Clean Architecture / Hexagonal: el núcleo interno no debe conocer frameworks ni librerías de infraestructura externa."
            }
          },
          {
            texto: "Inyectar el contexto de persistencia (EntityManager/DbContext) directamente en los casos de uso para aprovechar transacciones programáticas y consultas dinámicas optimizadas.",
            feedback: "Incorrecto: Acoplamiento extremo que destruye la soberanía del dominio y anula las pruebas unitarias en memoria.",
            puntos: 0,
            siguiente: "p2",
            autopsia: {
              incidente: "Fue imposible realizar pruebas unitarias del cálculo de tarifas sin levantar una base de datos Oracle completa, ralentizando el pipeline de CI/CD a 45 minutos por commit.",
              trampa: "Aprovechar facilidades del framework a corto plazo sin considerar el acoplamiento y el costo a largo plazo.",
              principio: "Inversión de Dependencias (DIP): los módulos de alto nivel (negocio) no deben depender de módulos de bajo nivel (persistencia); ambos deben depender de abstracciones."
            }
          }
        ]
      },
      {
        id: "p2",
        tema: "Microservicios",
        narrativa: "El equipo divide el sistema en dos servicios autónomos: Reservas y Facturación, cada uno con su propia base de datos (Database per service). Al confirmar una reserva, se debe emitir la factura. Si la facturación falla, la reserva no puede quedar activa. ¿Cómo gestionas la transacción entre ambos?",
        variantes: [
          "En un sistema distribuido con dos bases de datos independientes, ¿cómo garantizas la consistencia de negocio entre Reservas y Cobros sin bloquear recursos de red?",
          "El negocio necesita asegurar que nunca exista una reserva confirmada sin pago exitoso, manteniendo la capacidad de escalar ambos servicios de forma independiente."
        ],
        lentes: {
          negocio: "Durante una caída bancaria, miles de reservas quedaron en estado indeterminado, provocando sobreventa de asientos y quejas masivas.",
          calidad: "Consistencia y Disponibilidad: aplicar el Teorema CAP eligiendo consistencia eventual para preservar alta disponibilidad sin bloqueos globales.",
          sintoma: "Intentos de ejecutar transacciones distribuidas XA que bloquean conexiones de base de datos cuando hay latencia en la red."
        },
        opciones: [
          {
            texto: "Patrón Saga con consistencia eventual: el servicio de Reservas crea la reserva en estado 'Pendiente' y publica un evento; Facturación cobra y emite evento de éxito; ante fallo, Facturación dispara un evento compensatorio que cancela la reserva.",
            feedback: "Correcto: Preserva la autonomía de los servicios y la escalabilidad elástica. Acepta consistencia eventual a cambio de eliminar bloqueos globales.",
            puntos: 2,
            siguiente: "p3"
          },
          {
            texto: "Coordinador de transacciones distribuidas Two-Phase Commit (2PC / protocolo XA) sobre la red para asegurar atomicidad estricta (ACID) entre ambas bases de datos.",
            feedback: "Parcial: Garantiza consistencia fuerte, pero introduce acoplamiento temporal extremo, alta latencia por network hops y riesgo de bloqueo de tablas si un nodo cae durante la preparación.",
            puntos: 1,
            siguiente: "p3",
            autopsia: {
              incidente: "Un microcorte de red dejó al coordinador 2PC en limbo, bloqueando las filas de reservas durante 40 minutos y denegando el servicio a todos los usuarios.",
              trampa: "Intentar forzar garantías transaccionales ACID de bases de datos centralizadas en entornos de red distribuidos.",
              principio: "En sistemas distribuidos, el teorema CAP y las falacias de la computación en red desaconsejan el 2PC síncrono en favor de transacciones compensatorias (Sagas)."
            }
          },
          {
            texto: "Configurar un pool de conexiones compartido donde el servicio de Facturación tiene permisos de escritura directa sobre la tabla de reservas para hacer un rollback sincrónico en caso de error.",
            feedback: "Incorrecto: Viola frontalmente el principio de Bounded Context y 'Database per Service', creando un monolito distribuido acoplado por esquema.",
            puntos: 0,
            siguiente: "p3",
            autopsia: {
              incidente: "Una migración del esquema de reservas rompió en tiempo de ejecución las consultas SQL del servicio de facturación sin que nadie lo detectara en staging.",
              trampa: "Compartir tablas relacionales para evitar el esfuerzo de diseñar comunicación asíncrona por eventos.",
              principio: "Database per service: ningún servicio debe acceder directamente al almacenamiento de otro; la comunicación debe ser exclusivamente a través de APIs públicas o contratos de eventos."
            }
          }
        ]
      },
      {
        id: "p3",
        tema: "Microservicios",
        narrativa: "Durante campañas de alta demanda, el servicio de Checkout colapsa porque realiza llamadas síncronas HTTP/REST en cadena a 4 servicios internos (Catálogo, Precios, Inventario, Notificaciones). ¿Qué táctica de resiliencia y desacoplamiento implementas?",
        variantes: [
          "El flujo de compra sufre de fallos en cascada: la degradación en el servicio de notificaciones agota los hilos de ejecución del checkout. ¿Cómo eliminas el acoplamiento temporal?",
          "Se requiere reducir la latencia de respuesta del checkout a menos de 200ms en el percentil 99, eliminando las dependencias síncronas bloqueantes."
        ],
        lentes: {
          negocio: "Durante el CyberDay se perdieron 120.000 USD en ventas porque la pasarela de notificaciones por SMS se ralentizó y paralizó el botón de pago.",
          calidad: "Disponibilidad y Tolerancia a Fallos: minimizar el radio de impacto (blast radius) y desacoplar temporalmente los servicios.",
          sintoma: "Trazas de ejecución con 6 llamadas HTTP anidadas secuencialmente; excepciones de 'SocketTimeoutException' propagándose hacia el usuario."
        },
        opciones: [
          {
            texto: "Comunicación asíncrona por eventos (Event-Driven con Kafka/RabbitMQ) para efectos secundarios (Notificaciones) y replicación de lectura local (CQRS) en Checkout para precios e inventario.",
            feedback: "Correcto: Elimina el acoplamiento temporal y la latencia acumulada. Si el servicio de notificaciones se degrada, el checkout sigue operando sin interrupción.",
            puntos: 2,
            siguiente: "p4"
          },
          {
            texto: "Mantener la cadena síncrona REST pero envolver cada llamada con Circuit Breaker, Bulkhead y políticas de Reintento exponencial en el cliente HTTP.",
            feedback: "Parcial: Evita que un servicio caído tire a los demás, pero no soluciona el problema de fondo: la latencia acumulada y el consumo de threads en el checkout durante picos de tráfico.",
            puntos: 1,
            siguiente: "p4",
            autopsia: {
              incidente: "Bajo 30.000 RPS, los reintentos exponenciales generaron una tormenta de peticiones (retry storm) que terminó saturando por completo la red interna.",
              trampa: "Tratar de parchar dependencias síncronas excesivas con resiliencia de cliente en lugar de desacoplar la arquitectura del flujo.",
              principio: "Táctica de desacoplamiento temporal: las operaciones que no forman parte de la respuesta inmediata obligatoria deben ser asíncronas."
            }
          },
          {
            texto: "Aumentar el timeout HTTP global a 30 segundos y configurar un API Gateway centralizado para que encadene las 4 peticiones en paralelo en un único socket bloqueante.",
            feedback: "Incorrecto: Agrava catastróficamente el problema al saturar los recursos de hilos y sockets del punto central de entrada.",
            puntos: 0,
            siguiente: "p4",
            autopsia: {
              incidente: "El API Gateway consumió el 100% de sus conexiones en espera pasiva de respuestas lentas, derribando todos los servicios de la empresa simultáneamente.",
              trampa: "Aumentar timeouts creyendo que otorgar más tiempo resuelve la contención de recursos concurrentes.",
              principio: "Prevención de fallos en cascada: los timeouts deben ser agresivamente cortos y combinados con aislamiento de hilos (Bulkheads) o mensajería asíncrona."
            }
          }
        ]
      },
      {
        id: "p4",
        tema: "Evolución de arquitecturas",
        narrativa: "El flujo de cancelación de una reserva involucra 6 pasos: revertir cargos bancarios, devolver cupo de inventario, penalizaciones, puntos de fidelidad, emitir nota de crédito y notificar. Las reglas de negocio cambian mensualmente y Auditoría exige trazabilidad exacta de en qué paso falló cada operación. ¿Cómo coordinas la Saga?",
        variantes: [
          "Para un proceso distribuido complejo de compensación financiera con múltiples bifurcaciones condicionales y estricta auditoría, ¿orquestación o coreografía?",
          "El equipo necesita visualizar en tiempo real el estado de cada transacción de cancelación y modificar el orden de compensación sin desplegar 6 microservicios distintos."
        ],
        lentes: {
          negocio: "Auditoría emitió una advertencia regulatoria porque cuando fallaba una cancelación parcial, nadie podía rastrear con certeza si el dinero había retornado al cliente.",
          calidad: "Observabilidad y Mantenibilidad: centralizar la lógica de control del flujo sin fragmentar las reglas de negocio entre múltiples servicios.",
          sintoma: "Servicios escuchando 15 eventos distintos y emitiendo contra-eventos en cadena sin que exista un diagrama claro del flujo completo."
        },
        opciones: [
          {
            texto: "Saga Orquestada: un servicio orquestador maneja la máquina de estados centralizada, invoca comandos y gestiona explícitamente el árbol de compensaciones y auditoría.",
            feedback: "Correcto: Para flujos complejos con muchas compensaciones y alta necesidad de auditoría, la orquestación evita la fragmentación de la lógica y hace el flujo visible.",
            puntos: 2,
            siguiente: "fin"
          },
          {
            texto: "Saga Coreografiada: cada servicio escucha eventos de dominio del anterior y reacciona publicando su propio evento de compensación sin ningún componente central.",
            feedback: "Parcial: Máximo desacoplamiento inicial, pero ante 6 pasos con compensaciones complejas genera 'pesadilla de observabilidad', dependencias cíclicas invisibles y dificultad extrema para auditar el estado.",
            puntos: 1,
            siguiente: "fin",
            autopsia: {
              incidente: "Un evento de compensación se perdió por un bug en un listener y la reserva se canceló pero el dinero nunca se reembolsó, sin dejar rastro en logs.",
              trampa: "Elegir coreografía por la idea de 'cero centralización', subestimando la complejidad de depurar y auditar flujos largos en producción.",
              principio: "Regla arquitectónica de Sagas: Coreografía para flujos cortos y simples (2-3 pasos); Orquestación para flujos largos, ramificados o que exigen auditoría regulatoria."
            }
          },
          {
            texto: "Canalizar todas las compensaciones a través de un procedimiento almacenado (Stored Procedure) central en la base de datos de auditoría que ejecute scripts remotos.",
            feedback: "Incorrecto: Acoplamiento extremo en la base de datos que destruye la autonomía de los servicios y crea un Single Point of Failure.",
            puntos: 0,
            siguiente: "fin",
            autopsia: {
              incidente: "El procedimiento almacenado bloqueó las tablas de auditoría por concurrencia y paralizó las cancelaciones de reservas en toda la aplicación.",
              trampa: "Delegar orquestación de negocio a la base de datos relacional para evitar programar un servicio de aplicación.",
              principio: "Smart endpoints, dumb pipes: la lógica de orquestación pertenece a la capa de aplicación, no a procedimientos almacenados en la base de datos."
            }
          }
        ]
      }
    ],
    finales: {
      exito: "Arquitectura de nivel de producción: dominio hexagonal protegido, consistencia eventual resiliente con Sagas orquestadas y alta disponibilidad desacoplada por eventos.",
      parcial: "El sistema desacopló componentes pero arrastra penalizaciones de rendimiento y complejidad operativa por trade-offs no compensados.",
      fracaso: "El diseño resultó en un monolito distribuido: la peor combinación posible de acoplamiento de monolito con la latencia e inestabilidad de microservicios."
    }
  },
  {
    id: "ESC-ASW-03",
    titulo: "Dilema de Escala: Monolito Modular vs. Microservicios",
    tema: "Estilos Arquitectónicos y Estrategias de Migración",
    intro: "Una fintech en rápido crecimiento cuenta con un equipo de 7 desarrolladores (Regla de las Dos Pizzas). Su sistema actual es un monolito acoplado donde cualquier cambio en Facturación rompe Usuarios. Una parte del equipo presiona para reescribir todo inmediatamente en 10 microservicios sobre Kubernetes; otra prefiere no tocar nada. Eres el arquitecto consultor y debes definir el rumbo técnico sin comprometer el presupuesto ni la velocidad de entrega.",
    pasos: [
      {
        id: "p1",
        tema: "Evolución de arquitecturas",
        narrativa: "El equipo debate la arquitectura base. Con solo 7 desarrolladores, ¿qué estructura eliges para ordenar el código sin asumir una carga operativa inmanejable?",
        variantes: [
          "Una startup con equipo reducido necesita ordenar un código espagueti pero no cuenta con ingenieros dedicados a DevOps o infraestructura de red. ¿Qué estilo arquitectónico adoptas?",
          "El negocio exige entregar funcionalidades semanalmente. Dividir el sistema en microservicios múltiples amenaza con consumir más tiempo en despliegues que en código de valor. ¿Cómo respondes?"
        ],
        lentes: {
          negocio: "El presupuesto de operaciones en la nube y el runway financiero son limitados; no hay margen para contratar especialistas en Kubernetes o Service Mesh.",
          calidad: "Modularidad y Costo Operativo: maximizar la cohesión del código minimizando el impuesto de infraestructura distribuida (Microservice Tax).",
          sintoma: "Miedo a tocar el código por falta de fronteras claras, mezclado con entusiasmo acrítico por modas tecnológicas complejas."
        },
        opciones: [
          {
            texto: "Monolito Modular: delimitar Bounded Contexts en paquetes independientes dentro del mismo repositorio/proceso, restringiendo la interacción a interfaces públicas de módulo y prohibiendo consultas SQL cruzadas.",
            feedback: "Correcto: Evita el 'Microservice Tax' inicial (redes, CI/CD distribuido, K8s). Permite alta velocidad de entrega mientras el equipo aprende los límites reales del dominio.",
            puntos: 2,
            siguiente: "p2"
          },
          {
            texto: "Descomposición inmediata en 10 Microservicios desplegados en Kubernetes, cada uno con su propio repositorio y pipeline de CI/CD.",
            feedback: "Parcial: Patrón válido para organizaciones maduras, pero introduce sobrecarga operativa excesiva para 7 ingenieros, consumiendo más tiempo en infraestructura que en producto.",
            puntos: 1,
            siguiente: "p2",
            autopsia: {
              incidente: "El equipo pasó 4 meses depurando mTLS, balanceadores y despliegues fallidos en K8s; se agotó el presupuesto antes de lanzar la versión solicitada por los inversores.",
              trampa: "Pensar que adoptar microservicios soluciona mágicamente problemas de desorganización de código interno.",
              principio: "Ley de Conway y Microservice Tax: no construyas una arquitectura distribuida si la estructura y tamaño de tu organización no pueden sostener su costo operativo."
            }
          },
          {
            texto: "Dividir la aplicación en contenedores de microservicios independientes, pero manteniendo una única base de datos relacional compartida donde todos leen y escriben directamente.",
            feedback: "Incorrecto: Antipatrón 'Monolito Distribuido'. Combina la latencia y fallas de red de microservicios con el acoplamiento rígido de esquema del monolito.",
            puntos: 0,
            siguiente: "p2",
            autopsia: {
              incidente: "Una modificación de tipo de dato en la tabla 'usuarios' por el microservicio de login rompió silenciosamente el microservicio de pagos en producción.",
              trampa: "Intentar obtener la 'modernidad visual' de microservicios sin pagar el costo de desacoplar los datos ni la consistencia.",
              principio: "Autonomía de servicios: si dos servicios comparten la misma base de datos relacional sin contratos de API, no son microservicios; son un monolito distribuido frágil."
            }
          }
        ]
      },
      {
        id: "p2",
        tema: "Estilos de arquitectura",
        narrativa: "Dentro del Monolito Modular, el módulo de Facturación requiere notificar al módulo de Auditoría y consultar el estado crediticio de un Usuario. ¿Cómo comunicas estos módulos sin romper sus fronteras?",
        variantes: [
          "Se necesita que los módulos de un monolito colaboren manteniendo fronteras estrictas de encapsulamiento y excelente rendimiento en memoria. ¿Cómo diseñas la interacción?",
          "El módulo de Facturación no debe conocer la estructura interna de tablas ni entidades del módulo de Usuarios. ¿Qué mecanismo de comunicación en proceso utilizas?"
        ],
        lentes: {
          negocio: "Finanzas necesita agregar nuevos pasos de auditoría fiscal sin que el equipo de facturación deba modificar o recompilar sus servicios centrales.",
          calidad: "Bajo Acoplamiento y Rendimiento: comunicación eficiente en el mismo espacio de memoria sin penalizaciones de serialización de red.",
          sintoma: "Servicios de un paquete importando clases 'internal' o repositorios de otro paquete para hacer JOINs transversales."
        },
        opciones: [
          {
            texto: "Eventos de Dominio en memoria (Application Event Bus síncrono/asíncrono en proceso) para notificaciones y Fachadas/Servicios de Aplicación públicos para lecturas, sin exponer entidades internas.",
            feedback: "Correcto: Comunicación desacoplada en memoria sin costo de red. Si mañana un módulo se extrae a un microservicio, solo se cambia el dispatcher en memoria por un broker (RabbitMQ/Kafka).",
            puntos: 2,
            siguiente: "p3"
          },
          {
            texto: "Hacer llamadas HTTP REST sobre localhost (127.0.0.1) entre los controladores de cada módulo dentro del mismo servidor.",
            feedback: "Parcial: Añade serialización JSON, consumo de sockets de red y riesgo de timeouts locales sin aportar beneficios reales de autonomía ni escalabilidad.",
            puntos: 1,
            siguiente: "p3",
            autopsia: {
              incidente: "El servidor agotó su pool de sockets TCP efímeros (TCP port exhaustion) debido a miles de llamadas HTTP internas sobre localhost bajo alta concurrencia.",
              trampa: "Simular microservicios mediante llamadas de red dentro de una misma máquina en lugar de usar abstracciones en memoria.",
              principio: "No pagues el costo de la red si estás en el mismo proceso: usa contratos de interfaz y eventos de aplicación en memoria."
            }
          },
          {
            texto: "Inyectar directamente los repositorios y entidades ORM de Usuarios dentro del servicio de Facturación para ejecutar JOINs directos en la base de datos.",
            feedback: "Incorrecto: Rompe la encapsulación del módulo. Cualquier migración o cambio en la tabla de Usuarios romperá la lógica interna de Facturación en tiempo de ejecución.",
            puntos: 0,
            siguiente: "p3",
            autopsia: {
              incidente: "Un desarrollador renombró una columna en el módulo de usuarios y causó una falla general de facturación que impidió cobrar suscripciones durante 8 horas.",
              trampa: "La comodidad de los JOINs relacionales rápidos por encima del diseño de límites modulares limpios.",
              principio: "Bounded Context de DDD: ningún módulo debe compartir entidades de dominio ni persistencia con otro; cada contexto protege su propio modelo."
            }
          }
        ]
      },
      {
        id: "p3",
        tema: "Microservicios",
        narrativa: "Dentro del módulo de Facturación, al confirmar un cobro se deben actualizar saldos contables y emitir eventos a otros módulos. ¿Cómo aseguras que el evento se publique si y solo si la base de datos confirmó la transacción?",
        variantes: [
          "¿Cómo evitas la inconsistencia donde el cobro bancario se guarda en base de datos pero la publicación del evento falla por caída del broker?",
          "Se requiere garantizar entrega de eventos al menos una vez (At-least-once delivery) sin recurrir a transacciones 2PC sobre el broker de mensajería."
        ],
        lentes: {
          negocio: "Discrepancia contable: se cobraron 450 transacciones a usuarios que nunca recibieron sus comprobantes porque el servidor se reinició tras el INSERT.",
          calidad: "Consistencia y Resiliencia: garantizar atomicidad entre la persistencia local y la emisión de mensajes al bus.",
          sintoma: "Código con 'db.commit()' seguido inmediatamente de 'eventBus.publish()', sin manejo de fallos si la segunda línea falla."
        },
        opciones: [
          {
            texto: "Patrón Transactional Outbox: guardar el evento en una tabla 'outbox' dentro de la misma transacción de base de datos local y publicarlo al bus mediante un proceso en segundo plano (CDC o relay).",
            feedback: "Correcto: Garantiza que el evento jamás se pierda si la base de datos confirma, logrando consistencia eventual sólida sin transacciones distribuidas.",
            puntos: 2,
            siguiente: "p4"
          },
          {
            texto: "Publicar primero el evento al bus de mensajes y, únicamente si el broker responde éxito, proceder a guardar la transacción en la base de datos local.",
            feedback: "Incorrecto: Si la base de datos falla al guardar (ej. violación de unicidad), el evento ya fue emitido y otros servicios procesarán una transacción inexistente.",
            puntos: 0,
            siguiente: "p4",
            autopsia: {
              incidente: "El broker aceptó el evento, el servicio de envíos despachó el producto, pero la base de datos local rechazó el pago por saldo insuficiente: pérdida neta de mercancía.",
              trampa: "Invertir el orden de las operaciones creyendo que el broker es la fuente de verdad primaria.",
              principio: "Atomicidad y Dual-Write: no se puede coordinar la escritura atómica en dos sistemas heterogéneos sin un patrón como Outbox."
            }
          },
          {
            texto: "Envolver la llamada al broker en un bloque try/catch con 3 reintentos inmediatos en el hilo web antes de retornar la respuesta HTTP.",
            feedback: "Parcial: Ayuda ante parpadeos de red menores, pero si el broker está caído durante 10 segundos satura los hilos web y finalmente pierde eventos.",
            puntos: 1,
            siguiente: "p4",
            autopsia: {
              incidente: "Durante un reinicio programado de RabbitMQ, los hilos de checkout se bloquearon esperando los reintentos síncronos y colapsaron la API pública.",
              trampa: "Confiar en reintentos síncronos para resolver fallos de infraestructura sin almacenamiento persistente intermedio.",
              principio: "Tolerancia a fallos: los mensajes salientes deben persistirse durablemente antes de delegar en canales de red volátiles."
            }
          }
        ]
      },
      {
        id: "p4",
        tema: "Microservicios",
        narrativa: "Seis meses después, la generación masiva de reportes tributarios y procesamiento de archivos satura la CPU al 95% durante 4 horas al día, degradando los tiempos de respuesta del Checkout. ¿Cuál es el criterio arquitectónico de extracción?",
        variantes: [
          "Un componente de cómputo intensivo perjudica el rendimiento de las operaciones transaccionales críticas. ¿Bajo qué criterio justificas extraer tu primer microservicio?",
          "El monolito modular muestra cuellos de botella focalizados en una sola capacidad de negocio. ¿Cómo escalas esa capacidad sin descomponer el sistema completo?"
        ],
        lentes: {
          negocio: "Los usuarios no pueden pagar durante las mañanas porque la generación interna de reportes para Hacienda agota el servidor web.",
          calidad: "Escalabilidad Divergente y Blast Radius: desacoplar procesos CPU-bound de los flujos I/O transaccionales de alta concurrencia.",
          sintoma: "Procesos batch ejecutándose en los mismos servidores de aplicación que reciben las peticiones web de los clientes."
        },
        opciones: [
          {
            texto: "Extracción selectiva por escalabilidad divergente: aislar exclusivamente el módulo de Reportes en un servicio/worker independiente comunicado por colas de mensajería, conservando el resto en el monolito.",
            feedback: "Correcto: Se extrae solo el componente que justifica el costo distribuido por requerimientos de hardware (CPU-bound) y aislamiento de fallos (blast radius).",
            puntos: 2,
            siguiente: "p5"
          },
          {
            texto: "Escalar verticalmente la instancia del monolito aumentando vCPU y RAM al doble para soportar la carga pico durante esas 4 horas.",
            feedback: "Parcial: Solución rápida y simple a corto plazo, pero costosa económicamente y no resuelve el riesgo de que un reporte corrupto tumbe la aplicación entera.",
            puntos: 1,
            siguiente: "p5",
            autopsia: {
              incidente: "La factura mensual de la nube se triplicó y aun así un reporte mal estructurado consumió toda la memoria RAM, provocando un OutOfMemoryError en toda la app.",
              trampa: "Escalar verticalmente indefinidamente para evitar tomar decisiones de diseño y descomposición selectiva.",
              principio: "Límite del escalado vertical: cuando las cargas de trabajo tienen requerimientos de hardware radicalmente divergentes, la separación física es mandatoria."
            }
          },
          {
            texto: "Aprovechar la situación para descomponer simultáneamente los 8 módulos restantes del monolito en microservicios independientes.",
            feedback: "Incorrecto: Violación de YAGNI. Descomponer módulos que no tienen problemas de escala introduce complejidad operativa innecesaria y alto riesgo de atraso en el negocio.",
            puntos: 0,
            siguiente: "p5",
            autopsia: {
              incidente: "El proyecto de refactorización total consumió 8 meses, no entregó valor y el sistema resultante tuvo peor latencia que el monolito original.",
              trampa: "El sesgo de 'todo o nada': creer que si se extrae un servicio, hay que descomponer obligatoriamente todo el sistema.",
              principio: "Principio YAGNI (You Aren't Gonna Need It) y evolución arquitectónica pragmática: descompón solo por necesidad probada de escala o autonomía de equipo."
            }
          }
        ]
      },
      {
        id: "p5",
        tema: "Evolución de arquitecturas",
        narrativa: "Al separar el procesador de reportes y pagos hacia el nuevo servicio independiente, el negocio exige cero tiempo de inactividad (zero downtime) y una transición gradual sin riesgo de corte abrupto. ¿Qué patrón de migración aplicas?",
        variantes: [
          "¿Cómo reemplazas un módulo monolítico legacy por un nuevo servicio en producción de forma incremental y segura sin detener la operación?",
          "El negocio no permite ventanas de mantenimiento con apagado de servidores. ¿Qué estrategia garantiza que el tráfico migre de forma controlada con capacidad de rollback inmediato?"
        ],
        lentes: {
          negocio: "La empresa pierde 5.000 USD por cada minuto de inactividad; no se admiten 'ventanas de corte' nocturnas ni caídas de servicio.",
          calidad: "Disponibilidad Continua y Reversibilidad: despliegues incrementales con desvío progresivo de tráfico y rollback sin costo.",
          sintoma: "Planes de migración basados en 'apagar el sistema viejo un domingo a las 3 AM y rezar para que el nuevo levante el lunes a las 7 AM'."
        },
        opciones: [
          {
            texto: "Patrón Strangler Fig (Higo Estrangulador): interponer un API Gateway o Proxy inverso que intercepte el tráfico y desvíe progresivamente las rutas hacia el nuevo servicio hasta apagar el código obsoleto en el monolito.",
            feedback: "Correcto: Permite entregas incrementales, pruebas en producción (canary releases) y rollback seguro sin cortes abruptos de servicio.",
            puntos: 2,
            siguiente: "fin"
          },
          {
            texto: "Migración Big Bang: congelar despliegues, apagar el monolito durante un fin de semana, migrar datos y levantar ambos sistemas simultáneamente el lunes por la mañana.",
            feedback: "Parcial: Puede funcionar en sistemas con ventanas de mantenimiento permitidas, pero presenta un riesgo inaceptable ante imprevistos, con rollback traumático.",
            puntos: 1,
            siguiente: "fin",
            autopsia: {
              incidente: "Surgió una incompatibilidad de datos el lunes a las 6:30 AM; revertir el corte tardó 14 horas y el negocio estuvo paralizado un día laboral completo.",
              trampa: "La ilusión de que un plan detallado de fin de semana puede prever todas las variables de un corte masivo simultáneo.",
              principio: "Principio de reversibilidad: cualquier cambio arquitectónico mayor debe ser desplegable de forma incremental con capacidad de rollback inmediato."
            }
          },
          {
            texto: "Replicación bidireccional maestro-maestro en tiempo real entre las bases de datos de ambos sistemas, permitiendo que ambos atiendan peticiones concurrentemente sobre las mismas tablas sin árbitro.",
            feedback: "Incorrecto: Genera conflictos de concurrencia irresolubles, riesgo de inconsistencia de datos (split-brain) y escrituras fantasmas.",
            puntos: 0,
            siguiente: "fin",
            autopsia: {
              incidente: "Dos clientes reservaron el mismo asiento al mismo milisegundo en bases de datos distintas, generando sobreventa y colapso de integridad en auditoría.",
              trampa: "Creer que la replicación de datos bidireccional sobre la red puede sustituir la propiedad unificada de los datos.",
              principio: "Single Source of Truth: en cualquier momento, un dato debe tener un único dueño (single master) con autoridad para validar escrituras."
            }
          }
        ]
      }
    ],
    finales: {
      exito: "Evolución arquitectónica ejemplar: evitaste el Microservice Tax al inicio, garantizaste modularidad con eventos en memoria, implementaste Transactional Outbox y migraste componentes críticos mediante Strangler Fig sin caídas.",
      parcial: "El sistema opera, pero asumió costos innecesarios: o sobrecargaste al equipo con DevOps prematuro o pagaste sobrecostos de nube por demorar la extracción de cuellos de botella.",
      fracaso: "Colapso arquitectónico: el equipo cayó en un 'monolito distribuido', intentó escrituras duales sin Outbox o ejecutó una migración Big Bang que paralizó la operación."
    }
  }
];

export default escenarios;
