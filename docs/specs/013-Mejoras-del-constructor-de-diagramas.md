# Mejoras del constructor de diagramas (spec 003)

Documento de trabajo para el agente que implementa los cambios. Aplica a dos archivos: `core/diagramas/diagramas.js` (lógica pura, sin DOM) y `src/ui/componentes/diagramas.js` (lienzo con Pointer Events, función `crearDiagramasUI`). El proyecto usa JS vanilla con módulos ES y no tiene dependencias de UI.

## 0. Reglas de ejecución

- Haz los cambios por fases, en el orden de la sección 8. Después de cada fase el módulo debe seguir funcionando y las pruebas deben pasar.
- El core no debe importar nada del DOM. Toda la lógica nueva de validación, puntuación y posiciones vive en el core y se prueba con `node:test`.
- Mantén el estilo del repo: español en nombres y mensajes, estado inmutable, funciones puras en el core.
- Los cambios de firma del core (sección 2.2 y 1.1) rompen a los llamadores. Actualiza todos los usos en la UI y en cualquier otro módulo que importe `core/index.js`. Busca con grep antes de dar una fase por terminada.
- No cambies el formato de las preguntas del banco (`nodosFijos`, `nodosPool`, `miembrosPool`, `relacionesEsperadas`, `tiposArista`, `subtipo`) salvo lo indicado en 1.5, donde se añade un campo opcional `id` a los miembros.
- No hay CSS en este documento. Donde se pida CSS, se indica el selector y la propiedad, y se debe añadir al archivo de estilos existente.
- Al terminar, entrega una lista de los cambios de firma y de los archivos tocados.

---

## 1. Core: bugs de lógica y puntuación

Archivo: `core/diagramas/diagramas.js`.

### 1.1 El progreso no cuenta los miembros acertados

**Problema.** En `evaluarDiagrama`, `correctas` cuenta solo conexiones, pero `totalEsperado` suma conexiones y miembros. Si el estudiante acierta todo (`ok: true`), `resumenDiagramaAccesible` calcula el porcentaje con `correctas / totalEsperado` y puede mostrar menos de 100 %, y `ratingDiagrama` puede dar "parcial". `planCorreccion` sí suma `miembrosOk`, así que el cálculo es inconsistente entre funciones.

**Cambio.**

- En `evaluarDiagrama` calcula `const aciertos = correctas + miembrosOk;` y devuélvelo en el resultado como `aciertos`. Conserva `correctas` y `miembrosOk` por compatibilidad.
- `resumenDiagramaAccesible` y `planCorreccion` deben usar `res.aciertos`, no recalcularlo.
- Quien llame a `ratingDiagrama` / `ratingDiagramaAccesible` debe pasar `res.aciertos`. Busca esos usos en el quiz y corrígelos.

**Aceptación.** Un diagrama totalmente correcto (conexiones y miembros) devuelve `ok: true`, `progress.porcentaje === 100` y rating `"exito"`.

### 1.2 Los sobrantes no penalizan la nota

**Problema.** Si el estudiante conecta todo con todo, `correctas` llega al 100 % y el rating es "exito" aunque `ok` sea `false`.

**Cambio.**

- Calcula un valor de nota que descuente los sobrantes: `puntaje = max(0, aciertos - sobrantesRel.length) / totalEsperado`, expresado como porcentaje entero. Devuélvelo en el resultado como `porcentaje`.
- `resumenDiagramaAccesible` y los ratings usan ese `porcentaje`. Si `ok` es `false`, el rating nunca puede ser `"exito"` (tope en `"parcial"`).
- Separa los conceptos en el resultado: `sobrantes` pasa a significar solo conexiones de más. Los miembros mal ubicados ya se exponen aparte como `miembrosMal`, que son pendientes y no extras. Revisa quién consume `sobrantes` y ajusta.

**Aceptación.** Un diagrama con todas las conexiones esperadas más cinco sobrantes no obtiene `"exito"`.

### 1.3 Prototipo de `miembros`

**Problema.** `asignarMiembro` usa `texto in estado.miembros`, que mira la cadena de prototipos (`"constructor" in {}` es `true`).

**Cambio.**

- Reemplaza por `Object.hasOwn(estado.miembros, clave)`.
- En `crearTablero` crea `miembros` y `posiciones` con `Object.create(null)` o conviértelos a `Map`. Si eliges `Map`, el estado deja de ser JSON-serializable tal cual: en ese caso mantén objetos planos y usa solo `Object.hasOwn`. Prioriza la serialización, porque el estado se guarda con `guardarEstado`.

### 1.4 Nodos nuevos que se solapan

**Problema.** `calcularPosicionParaNuevoNodo` usa `nodosColocados.length`. Si se colocan A, B, C, se quita B y se coloca D, D cae donde ya está C. Además `y: 50` choca con los nodos fijos, que arrancan en `y: 100`, y `x` crece sin límite.

**Cambio.** Elimina `calcularPosicionParaNuevoNodo` y reutiliza una sola función de rejilla que busque el primer hueco libre:

```js
const PASO_REJILLA = 150;
const COLUMNAS_REJILLA = 4;

function posicionLibre(posiciones, paso = PASO_REJILLA, columnas = COLUMNAS_REJILLA) {
  const ocupada = p => Object.values(posiciones).some(
    q => Math.abs(q.x - p.x) < paso / 2 && Math.abs(q.y - p.y) < paso / 2
  );
  for (let i = 0; ; i++) {
    const p = { x: 100 + (i % columnas) * paso, y: 100 + Math.floor(i / columnas) * paso };
    if (!ocupada(p)) return p;
  }
}
```

- `crearTablero` y `colocarNodo` usan `posicionLibre`. `calcularPosicionInicial` se puede eliminar o reducir a una llamada a esta función.
- Considera el ancho del papel: la UI pasa un `maxX`; el core no lo conoce, así que las columnas deben ser configurables (parámetro opcional `columnas`).

**Aceptación.** Colocar A, B, C, quitar B y colocar D produce cuatro posiciones sin solapamiento.

### 1.5 Miembros con texto repetido

**Problema.** Los miembros se indexan por `m.texto`. En UML de clases, `id: int` aparece en varias clases y `miembros[texto]` solo guarda un dueño.

**Cambio.**

- Cada miembro de `miembrosPool` puede traer un `id` opcional. La clave de indexación pasa a ser `m.id ?? m.texto`.
- `crearTablero`, `asignarMiembro`, `quitarMiembrosDelNodo` y `evaluarDiagrama` usan esa clave. `asignarMiembro(estado, clave, nodo)` recibe la clave, no el texto.
- La UI usa `data-miembro` con la clave y muestra `m.texto`. Actualiza `renderDiagrama`, `activarPool`, `colocarMiembro`, `pintarNodos` y las comparaciones `est.miembros[m.texto]`.
- Un helper `claveMiembro(m)` en el core evita repetir la expresión.

**Aceptación.** Dos miembros con el mismo `texto` y distinto `id` se asignan a clases distintas sin pisarse.

---

## 2. Core: invariantes y una sola fuente de verdad

### 2.1 Invariantes que la lógica pura debe proteger

- `validarConexion` debe comprobar que `de` y `a` estén en `estado.nodosColocados` (error `nodo_no_colocado`).
- Debe comprobar que `tipo` esté en los tipos válidos de la pregunta (error `tipo_invalido`). Hoy `CONFIG_SUBTIPO[...].tiposArista` se define y no se usa en el core. La pregunta puede sobrescribir con `pregunta.tiposArista`, así que el estado debe guardar los tipos válidos (ver 2.2).
- `quitarNodo` debe devolver el estado sin cambios si el nodo no está colocado (`if (!estado.nodosColocados.includes(nombre)) return estado;`). Hoy duplica el nodo en `nodosDisponibles`. Al devolver un nodo al pool, respeta el orden original del `nodosPool` de la pregunta (guarda el orden en el estado o reordena al insertar).
- `quitarConexion` debe devolver el estado sin cambios y sin `ultimoCambio` si no eliminó nada (compara longitudes). Hoy anuncia "Conexión eliminada" aunque no hubiera nada.
- `actualizarPosicion` debe ignorar valores no finitos: `if (!Number.isFinite(x) || !Number.isFinite(y)) return estado;`.
- La relación recursiva (A–A) está prohibida en ER por `!dirigido && de === a`. En ER las relaciones recursivas son válidas (por ejemplo Empleado supervisa a Empleado). Pregunta al dueño del proyecto si es intencional; si no lo es, permítela en ER y mantén la prohibición solo donde no tenga sentido. Deja un comentario con la decisión.

### 2.2 Guardar el subtipo en el estado y derivar la dirección dentro del core

**Problema.** `conectar`, `validarConexion` y `quitarConexion` reciben `dirigido` desde fuera, mientras `evaluarDiagrama` lo calcula con `esDirigidoTipo`. Si el llamador se equivoca, la detección de duplicados y la evaluación discrepan.

**Cambio.**

- `crearTablero` guarda `subtipo` y `tiposArista` (los de la pregunta o los de `CONFIG_SUBTIPO`) en el estado.
- Nuevas firmas, sin el parámetro `dirigido`:
  - `validarConexion(estado, de, a, tipo, guarda)`
  - `conectar(estado, de, a, tipo, guarda)`
  - `quitarConexion(estado, de, a, tipo, guarda)`
- Dentro, `const dirigido = esDirigidoTipo(estado.subtipo, tipo);`.
- `conectar` llama a `validarConexion` una sola vez, y si es válida crea la conexión y usa `v.mensajeAccesible` como mensaje. Elimina la validación duplicada que hoy hace antes de llamar a `validarConexion` solo para el mensaje.
- Extrae un constructor de resultado inválido (`invalida(error, mensaje)`) para no repetir el objeto.

### 2.3 Subtipo desconocido

El fallback `|| CONFIG_SUBTIPO.er` oculta errores del banco de preguntas: un subtipo mal escrito se evalúa como ER sin avisar. Cambia `esDirigido`, `esDirigidoTipo` y `tiposDe` para que lancen un error claro (o un `console.warn` en desarrollo) cuando el subtipo no exista. Deriva `SUBTIPOS` con `Object.keys(CONFIG_SUBTIPO)`. Añade `tiposArista(pregunta)` al core y que la UI lo use en lugar de su propia función `tiposDe`.

### 2.4 Claves de arista sin colisiones

- `claveArista` une con `"|"`, así que un nombre que contenga `|` genera colisiones. Usa `JSON.stringify([extremos[0], extremos[1], normalizarClave(tipo)])` como clave, y haz lo mismo con la guarda en `claveDe`.
- Quita el `.slice()` antes de `.sort()`: `[de, a]` ya es un arreglo nuevo.
- La normalización de la clave debe seguir tratando `tipo` y `guarda` sin importar mayúsculas ni tildes.

---

## 3. Core: accesibilidad, mensajes y duplicación

Archivo: `core/diagramas/diagramas.js`.

- **Plurales.** Hoy salen cadenas como "Faltan 1 conexiones" y "1 miembros por ubicar". Añade un helper `plural(n, uno, varios)` y úsalo en `resumenDiagramaAccesible` (incluido el verbo: "Falta 1 conexión" / "Faltan 2 conexiones").
- **`nombreAccesible`.** Elimina todos los símbolos, así que `+ nombre: String` pasa a `nombre String` y `Cliente_Pedido` a `ClientePedido`. Conserva `_`, `:`, `(`, `)` y `+`/`-` cuando tengan significado en UML, o elimina solo lo que los lectores de pantalla leen mal. Renombra su segundo parámetro de `tipo` a `etiquetaPorDefecto`, porque en el resto del archivo `tipo` significa tipo de conexión.
- **Umbrales duplicados.** `ratingDiagrama` y `ratingDiagramaAccesible` repiten 80/50. Define `UMBRALES = { exito: 80, parcial: 50 }` y haz que la versión accesible llame a la primera.
- **Formato de relación repetido.** La lógica de la flecha y el formato "A → B (tipo guarda)" aparece en cinco sitios. Extrae `formatearRelacion({ de, a, tipo, guarda }, dirigido)` y úsala en `validarConexion`, `conectar`, `quitarConexion`, `fmtRel` y `planCorreccion`.
- **Tres presentaciones de los mismos datos.** `resumenDiagrama`, `resumenDiagramaAccesible` y `planCorreccion` presentan el mismo detalle de tres formas. Mantén `evaluarDiagrama` como fuente de datos y deja los tres como formateadores delgados. No elimines ninguno sin revisar quién lo importa.
- **Sintaxis moderna.** Cambia `Object.assign({}, estado, {...})` por `{ ...estado, ... }` y `indexOf(x) === -1` por `!includes(x)`.
- **Tipos.** Añade `// @ts-check` y `@typedef` para `Estado`, `Relacion`, `Miembro` y `Pregunta`. No migres a TypeScript en esta tarea.

---

## 4. UI: bugs de interacción

Archivo: `src/ui/componentes/diagramas.js`.

### 4.1 El arrastre desde el pool se queda colgado

**Problema.** Las piezas tienen `draggable="true"` y además usan `pointerdown` con listeners en `window`. Con mouse, el navegador inicia su arrastre nativo y dispara `pointercancel`; `pointerup` nunca llega. El ghost y los listeners de `inicioDesdePool` quedan vivos. En táctil pasa lo mismo cuando el navegador empieza a hacer scroll.

**Cambio.**

- Quita `draggable="true"` de las piezas del pool y de los miembros (en `renderDiagrama` y en `actualizarPool`).
- En `inicioDesdePool` añade una función `limpiar` que quite `pointermove`, `pointerup` y `pointercancel` de `window` y elimine el ghost. `soltar` la llama al empezar en lugar de repetir los `removeEventListener`, y `pointercancel` también la llama.
- CSS: añade `touch-action: none` a `.pieza` y a `.nodo-puesto`, y `position: fixed; pointer-events: none` a `#ghost-diagrama`.

**Aceptación.** Un arrastre que el navegador cancela no deja `#ghost-diagrama` en el DOM ni listeners activos en `window`.

### 4.2 `pointercancel` cuenta como tap en `inicioMoverNodo`

**Problema.** `soltar` sirve para `pointerup` y `pointercancel`. Si no hubo movimiento llama a `toqueNodo`, así que un scroll cancelado selecciona el nodo.

**Cambio.** Separa los casos. `pointerup` sin movimiento hace `toqueNodo`; `pointerup` con movimiento guarda la posición. `pointercancel` restaura `left` y `top` a `l0` y `t0`, reposiciona las aristas y no selecciona nada.

### 4.3 El teclado no puede usar el botón ✕ del nodo

**Problema.** El `keydown` del ✕ burbujea al nodo, y su handler hace `preventDefault()` con Enter y Espacio y selecciona el nodo en lugar de dejar pasar el click. Además hay un `role="button"` que contiene un `<button>`, lo que herramientas como axe marcan como control anidado.

**Cambio.** Al inicio del `keydown` del nodo agrega `if (e.target !== n) return;`. Pon `tabindex="-1"` al ✕ y deja `Supr` como vía de teclado, que ya existe. Conserva el `aria-label` del ✕ para táctil y lectores.

### 4.4 Con un nodo seleccionado, el ✕ de otro nodo conecta en vez de borrar

**Problema.** En el `pointerdown` del nodo, los `if (seleccion ...)` van antes del chequeo `.nodo-quitar`, que vive dentro de `inicioMoverNodo`.

**Cambio.** Mueve `if (e.target.closest(".nodo-quitar")) return;` al inicio del handler de `pointerdown` del nodo, antes de cualquier lógica de selección.

### 4.5 El `pointerdown` del nodo duplica `toqueNodo` y lo hace peor

**Problema.** En la rama de miembros solo llama a `pintarNodos`: el pool de miembros sigue diciendo "Sin asignar", no se restaura el foco y el hint cambia respecto al camino por `toqueNodo`.

**Cambio.** Extrae `asignarMiembroUI(clave, nodo)` que haga lo mismo que hoy hace `toqueNodo` (guardar, volver a renderizar, hint, devolver el foco al pool) y úsala desde `toqueNodo`, desde `pointerdown` y desde `soltar` en `inicioDesdePool`. El `pointerdown` del nodo debe delegar en `toqueNodo` o en `segundoToque` sin duplicar lógica.

### 4.6 El hint dice "Relación creada" aunque no se creó nada

**Problema.** `elegirTipo` y el selector de guarda muestran "Relación creada..." siempre, incluso si `conectar` rechazó la conexión (duplicada o auto-conexión).

**Cambio** (usa las firmas nuevas del core, 2.2):

```js
const v = validarConexion(estado(), de, a, tipo, guarda);
if (!v.valida) { setHint(v.mensajeAccesible); return; }
guardar(conectar(estado(), de, a, tipo, guarda));
setHint(v.mensajeAccesible + " Pulsa «Comprobar» cuando el diagrama esté listo.");
```

Si la conexión es inválida, no ocultes el selector de tipos ni el modal de guarda sin avisar: deja el hint y mantén la selección para que el estudiante corrija.

### 4.7 El lienzo sigue editable después de "Comprobar"

**Problema.** Solo se deshabilita el botón. El estudiante puede seguir moviendo y borrando después de calificado.

**Cambio.** Calcula `soloLectura` (hoy `bloqueado` en `renderDiagrama`) y pásalo a `pintarNodos` y `dibujarAristas`. En modo solo lectura no se registran handlers de arrastre, teclado ni borrado, los nodos y etiquetas llevan `aria-disabled="true"`, el pool se oculta o se deshabilita y no se muestra el ✕. Verifica antes cómo bloquea el quiz otros controles, para no duplicar la lógica.

### 4.8 Selectores sin escapar y objetos como mapas

- `toqueNodo` usa `'.nodo-puesto[data-label="' + nombre + '"]'`, que rompe con comillas en el nombre. Usa el mismo patrón `Array.from(...).find(n => n.dataset.label === nombre)` que ya tiene `enfocarNodo`, o `CSS.escape`.
- `mapa` en `dibujarAristas` es un objeto `{}` indexado por etiqueta: cámbialo a `Map`.

### 4.9 El `aria-label` del nodo oculta sus miembros

Un `role="button"` con `aria-label` reemplaza su contenido, así que un lector de pantalla nunca lee los atributos y métodos asignados a la clase. Añade los miembros al `aria-label` (por ejemplo "Nodo Cliente, con 3 miembros: ...") o enlázalos con `aria-describedby` a un elemento oculto.

---

## 5. UI: rendimiento

### 5.1 Reposicionar aristas sin recrear el DOM

**Problema.** `dibujarAristas` vacía el SVG y recrea todas las líneas y botones de etiqueta en cada `pointermove` y en cada pulsación de flecha. Durante el arrastre solo cambian coordenadas.

**Cambio.**

- `dibujarAristas` (render completo) guarda referencias en `aristasDom = [{ linea, etiqueta, nDe, nA }]`.
- Nueva función `reposicionarAristas()` que solo actualiza `x1/y1/x2/y2` de las líneas y `left/top` de las etiquetas.
- Programación con `requestAnimationFrame` (cancelando el frame pendiente):

```js
let raf = 0;
const programarReposicion = () => {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(reposicionarAristas);
};
```

- `mover` de `inicioMoverNodo` y el handler de flechas del teclado llaman a `programarReposicion()` en lugar de `dibujarAristas(...)`.
- Mueve el `<defs>` del marcador al template de `renderDiagrama` y elimina `inyectarMarcador`: su guarda `svg.querySelector("#flecha-diagrama")` nunca se cumple porque el SVG se vacía justo antes.

### 5.2 Debounce al guardar con flechas

Las flechas del teclado llaman a `guardar(actualizarPosicion(...))` en cada pulsación, y con auto-repeat son muchas escrituras si `guardarEstado` persiste. Mueve el DOM al instante y guarda con debounce corto (por ejemplo 300 ms), con guardado inmediato al soltar la tecla (`keyup`) o al perder el foco.

### 5.3 Anuncios de movimiento

`actualizarPosicion` genera un mensaje por cada llamada. No anuncies movimientos intermedios en la región `aria-live`: el hint solo se actualiza en eventos discretos (colocar, conectar, borrar, asignar), no en cada movimiento de teclado o arrastre.

---

## 6. UI: foco, accesibilidad y estructura

### 6.1 Foco y región en vivo

- **Región `aria-live` persistente.** `#hint-diagrama` se destruye y recrea en cada `renderDiagrama`, y varios lectores no anuncian texto escrito en una región recién insertada. Ponla fuera del área que se re-renderiza, o créala una vez. El mismo texto repetido (por ejemplo "Selección cancelada.") tampoco se vuelve a anunciar: alterna un carácter invisible o vacía y reescribe en el siguiente frame.
- **Foco tras elegir tipo.** `segundoToque` muestra los tipos pero el foco se queda en el nodo. Mueve el foco al primer botón de tipo.
- **Foco tras crear o borrar una relación.** `pintarNodos` destruye los nodos y el foco cae a `body`. Devuélvelo al nodo `de` al crear, y al nodo extremo de la relación al borrar desde su etiqueta.
- **Actividades con un solo tipo.** `tiposDe(item).length === 1` (caso "transición"): salta el paso de elegir tipo y abre directo el selector de guarda.
- **Pool de miembros.** `pieza-sel` significa "ya asignado", así que la selección actual no se ve. Usa `aria-pressed` y una clase distinta (por ejemplo `pieza-activa`) para el miembro seleccionado.
- **Modal de guarda.** Usa `aria-labelledby` apuntando al `<h3>` en lugar de `aria-label` con texto armado.

### 6.2 Resize

El SVG toma su tamaño al dibujar, así que al rotar el móvil las aristas quedan desfasadas. Añade un `ResizeObserver` sobre `#lienzo-area` que llame a `programarReposicion()` y vuelva a clampear los nodos al nuevo tamaño. Si el área se pinta oculta (`clientWidth === 0`), `pintarNodos` clampa todo a `x: 4`: no clampes mientras el ancho sea 0 y reintenta cuando el observer detecte tamaño. Desconecta el observer al cambiar de pregunta.

### 6.3 Estructura del módulo

- **`refrescar({ foco })`.** El par `pintarNodos(item, zona()); dibujarAristas(item);` se repite al menos cinco veces. Crea `refrescar()` que haga ambas cosas y restaure el foco indicado, y reemplaza los usos.
- **`item` o `itemActual()`, no ambos.** Usa solo `itemActual()` y quita los parámetros `item` y `area` de las funciones internas (algunos ya no se usan: `_area` en `activarPool`, `item` en `actualizarPool`).
- **Constantes mágicas.** `110` y `60` aparecen en `colocarNodoUI` y `pintarNodos`, mientras el arrastre usa `offsetWidth` y `offsetHeight`. Los nodos UML con miembros son más altos que 60. Extrae `clampAlPapel(x, y, el)` que use el tamaño real del elemento y úsala en todos los sitios.
- **IDs globales.** `lienzo-diagrama`, `pool-diagrama`, `pool-miembros`, `edges-diagrama`, `tipos-diagrama`, `hint-diagrama`, `lienzo-area` contradicen el "reutilizable" del comentario inicial: dos lienzos en la página chocarían. Busca todo con `zona().querySelector(...)` y usa clases o `data-*` en lugar de IDs. `areaId` ya es configurable; el resto no. Mantén compatibilidad con el CSS existente actualizando los selectores.
- **Estado en el DOM.** `tipos.dataset.de` y `tipos.dataset.a` guardan la conexión pendiente. Reemplázalo por una variable `conexionPendiente` en el closure.
- **Mensajes del core.** El core ya genera `estado.ultimoCambio.mensaje` accesibles y la UI los ignora con textos propios. Úsalos cuando existan para no tener dos fuentes de texto.
- **Eventos.** Cada render re-registra listeners por elemento. Pasa a delegación de eventos en `#lienzo-area` y en el pool.
- **Estado en render.** `renderDiagrama` llama a `guardar(crearTablero(item))` si el estado no coincide con la pregunta. Funciona, pero persiste durante el render. Inicializa el estado antes de renderizar (por ejemplo en un `prepararPregunta(item)` que llame a `renderDiagrama`).
- **Estilo.** Convierte las concatenaciones de HTML a template literals, arregla la indentación de `colocarNodoUI` y quita los `✅` de los comentarios. Mantén la función `escapar` en todo texto que provenga de preguntas.

---

## 7. Pruebas

### 7.1 Core (node:test)

Crea `core/diagramas/diagramas.test.js` con `node:test` y `node:assert/strict`. Casos mínimos:

- ER: `A–B` y `B–A` con el mismo tipo son la misma conexión (la segunda no se añade).
- UML con "asociación": no dirigida (el par sin orden); "herencia": dirigida.
- Diagrama totalmente correcto (conexiones y miembros): `ok: true`, `porcentaje` 100, rating `"exito"`.
- Conectar todo con todo: nunca `"exito"`; `sobrantes` solo cuenta conexiones.
- Colocar A, B, C, quitar B y colocar D no repite posición.
- `quitarNodo` sobre un nodo no colocado devuelve el mismo estado.
- `quitarConexion` sobre una conexión inexistente devuelve el mismo estado.
- Dos miembros con el mismo `texto` y distinto `id` no se pisan.
- `asignarMiembro` con clave `"constructor"` no se acepta si no está en el pool.
- `validarConexion` rechaza: datos incompletos, nodo no colocado, tipo inválido, auto-conexión según la regla decidida en 2.1 y conexión duplicada.
- Nombres con `|` o comillas no generan colisiones de clave.
- Plurales: "Falta 1 conexión" y "Faltan 2 conexiones".

### 7.2 UI (Playwright, si ya está configurado)

Si el repo ya usa Playwright, añade tres flujos: arrastrar una pieza del pool al lienzo, conectar dos nodos con dos taps eligiendo el tipo, y repetir los dos anteriores solo con teclado (Tab, Enter, flechas, Supr). Si no hay Playwright, no lo instales: déjalo como pendiente y menciónalo en el resumen final.

---

## 8. Orden de trabajo sugerido

1. **Core, fase A:** secciones 1.1 a 1.3 y 2.4 (puntuación, prototipo, claves). Pruebas del 7.1 correspondientes.
2. **Core, fase B:** secciones 1.4, 1.5, 2.1 y 2.2 (posiciones, ids de miembros, invariantes, firmas nuevas). Actualiza todos los llamadores en la UI y en el quiz.
3. **Core, fase C:** secciones 2.3 y 3 (subtipo desconocido, plurales, helpers, tipos).
4. **UI, fase A:** secciones 4.1 a 4.9 (bugs de interacción y accesibilidad de los nodos).
5. **UI, fase B:** sección 5 (rendimiento con rAF y debounce).
6. **UI, fase C:** secciones 6.1 y 6.2 (foco, región en vivo, resize).
7. **UI, fase D:** sección 6.3 (refactor estructural). Hazlo al final para no mezclar refactor con correcciones.
8. **CSS:** los cambios indicados (`touch-action`, ghost, `pieza-activa`, selectores sin IDs).

## 9. Entregable final

- Resumen de cambios por fase, con los archivos tocados.
- Lista explícita de cambios de firma del core: `conectar`, `validarConexion` y `quitarConexion` sin `dirigido`, `asignarMiembro` por clave, nuevo `aciertos` y `porcentaje` en el resultado de `evaluarDiagrama`.
- Puntos que quedaron pendientes o requieren decisión (en especial la regla de las relaciones recursivas en ER).
- Resultado de ejecutar las pruebas.
