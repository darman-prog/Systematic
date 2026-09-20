# Patrones de Diseño — Parte 2

## Patrón Composite (estructural)

Permite **componer objetos en estructuras de árbol** y luego trabajar con estas estructuras como si fueran objetos individuales.

### Cuándo aplicarlo

Es una solución adecuada cuando el modelo de dominio se puede representar como una **estructura jerárquica** (un árbol de partes y todos): un sistema de archivos, un menú de navegación, o la interfaz de usuario de una aplicación.

### Motivación

Imagina que estás construyendo un sistema de archivos y necesitas calcular el tamaño total de una carpeta. Tienes dos tipos de elementos:

- **Archivos**: PDF, imágenes, etc.
- **Carpetas**: pueden estar vacías o contener archivos y otras carpetas.

Si intentas calcular el tamaño total **sin** el patrón, tendrías que **comprobar constantemente el tipo de cada elemento** mediante bucles `if/isinstance`: ¿es un archivo o es una carpeta? Si es una carpeta, recorres sus elementos y vuelves a preguntar.

### Solución

El patrón propone tratar a los elementos simples (**Leaves**) y a los elementos compuestos (**Composite**) mediante una **interfaz común**.

De esta forma, el contenedor no necesita saber exactamente qué tiene dentro: simplemente recorre a sus hijos y les pide a todos ejecutar la misma operación. Si un hijo es un archivo, devuelve su tamaño; si es una carpeta, se calcula recursivamente el tamaño de sus elementos internos.

## Patrón Proxy (estructural)

El Proxy es un patrón de diseño estructural que proporciona un **sustituto o intermediario** para otro objeto. Un objeto proxy **controla el acceso** al objeto original, permitiendo realizar tareas adicionales (**validación, almacenamiento en caché, registro de logs o carga diferida**) antes o después de delegarle la petición.

### Motivación

Imagina que tienes un objeto que **consume muchos recursos** (por ejemplo, una consulta pesada a una base de datos o la descarga de un archivo grande de red).

Si creas e inicializas ese objeto **inmediatamente al arrancar la aplicación**:

- **Desperdiciarás memoria y recursos** si el usuario finalmente no utiliza esa funcionalidad.
- **No tendrás un lugar limpio** para verificar permisos de acceso, aplicar caché o registrar auditorías antes de ejecutar la operación costosa.

### Solución

El patrón propone **crear una nueva clase (el Proxy)** que implemente la **misma interfaz** que el objeto real.

El cliente interactúa con el Proxy **como si fuera el objeto real**. El Proxy **intercepta las llamadas**, ejecuta la lógica adicional (control de acceso, verificación de caché, etc.) y, **solo cuando es necesario**, le pasa la petición al Objeto Real.

## Patrón Template Method (comportamiento)

El Template Method es un patrón de diseño de comportamiento que **define el esqueleto de un algoritmo** en un método de una clase base, **delegando la implementación de algunos pasos específicos a subclases**.

Permite que las subclases **redeflan ciertos pasos de un algoritmo sin cambiar la estructura general** del mismo.

### Motivación

El flujo general para todos los archivos es casi idéntico:

1. Abrir el archivo.
2. Extraer los datos (varía según el formato).
3. Analizar los datos.
4. Generar un reporte.
5. Cerrar el archivo.

Imagina que estás construyendo un sistema de procesamiento de datos que lee documentos para extraer información. Tienes procesadores para archivos **PDF, DOCX y CSV**.

Este patrón evita tener que **duplicar el código repetitivo** (abrir, analizar, reportar, cerrar) en cada una de las clases.

### Solución

El patrón propone mover el algoritmo completo a un **método plantilla** dentro de una clase base abstracta. Este método plantilla llama a una serie de pasos en orden: algunos con **implementación predeterminada** en la clase base, mientras que otros (los pasos específicos del formato) son **métodos abstractos** que las subclases deben o pueden sobrescribir.

## Patrón Chain of Responsibility (comportamiento)

Chain of Responsibility es un patrón de diseño de comportamiento que permite **pasar peticiones a lo largo de una cadena de manejadores (handlers)**.

Al recibir una petición, cada manejador decide si la procesa o si la pasa al **siguiente manejador** de la cadena.

### Motivación

Imagina que estás desarrollando un sistema de solicitudes (por ejemplo, procesamiento de pedidos en una tienda en línea o un middleware para un servidor web). Antes de procesar la solicitud, se deben ejecutar varias verificaciones en orden:

- ¿El usuario está autenticado?
- ¿El usuario tiene permisos de administrador?
- ¿El formato de los datos recibidos es válido?
- ¿Hay suficiente stock en el inventario?

Si intentas poner todas estas validaciones en una sola clase o función, terminarás con un **bloque enorme de if/else muy frágil y acoplado**. Además, si más adelante se requiere cambiar el orden de las validaciones o añadir una nueva, será necesario modificar todo el código existente.

### Solución

El patrón propone **transformar cada verificación o comportamiento en un manejador independiente** que implementa una interfaz común.

Cada manejador **guarda una referencia al siguiente manejador** de la lista. Cuando llega una petición:

1. El manejador actual la **evalúa**.
2. Si puede (o debe) procesarla, lo hace.
3. **Decisiona si corta el flujo o llama al siguiente manejador** de la cadena.

## Patrón Iterator (comportamiento)

El Iterator es un patrón de diseño de comportamiento que permite **recorrer los elementos de una colección de forma secuencial sin exponer su estructura o representación interna**.

### Motivación

Si el código cliente necesita recorrer estas estructuras, tendría que **conocer exactamente cómo están organizadas por dentro**:

- Para una lista: usar un índice numérico (`lista[i]`).
- Para un árbol: aplicar un algoritmo de búsqueda en profundidad (DFS) o en anchura (BFS).
- Para un grafo: gestionar nodos visitados y aristas.

Las colecciones de datos pueden ser simples listas indexadas, pero también estructuras más complejas como árboles, grafos, tablas hash o listas enlazadas. Esto **acopla fuertemente** el código cliente a la estructura interna de la colección: si se cambia la forma en la que se almacenan los datos, se rompe el código que recorre dicha colección.

### Solución

El patrón propone **extraer el comportamiento de recorrido de la colección y colocarlo dentro de un objeto independiente llamado Iterador**.

El iterador **encapsula los detalles del recorrido** (posición actual, cómo avanzar al siguiente elemento, si quedan elementos pendientes) y expone una **interfaz estándar unificada** para el cliente.
