---
status: completo
fecha: 2026-10-19
evaluador: Agente Default (Antigravity Harness)
alcance: 18 pantallas + componentes compartidos en viewports de 320px a 480px
referencias:
  - docs/DESIGN.md
  - docs/specs/012-plan-mejoras-ui.md
  - WCAG 2.2 AA (Criterios 2.5.5, 2.5.8, 1.4.4, 1.4.10)
---

# Informe de Auditoría UI / UX para Dispositivos Móviles (Celulares)

Auditoría técnica y visual exhaustiva de **Systematic** en teléfonos móviles inteligentes (smartphones en orientaciones vertical y horizontal). Evalúa media queries, breakpoints, desbordamiento horizontal (`overflow-x`), tamaños de objetivos táctiles (touch targets WCAG 2.2 AA), ergonomía de uso con una sola mano (Thumb Zone) y comportamiento ante el teclado virtual.

---

## 1. Resumen Ejecutivo

### Veredicto Global: **Aprobado Parcial con Mejoras Prioritarias de Ergonomía**

Systematic posee una base visual sólida: su diseño "Noche calma" es descansado para la vista, la paleta evita contrastes agresivos, y estructuralmente **no sufre de desbordamiento horizontal catastrófico** en las pantallas estándar gracias a un diseño centrado en `.app (max-w-3xl)`. El uso de container queries (`@container (max-width: 560px)`) en el panel de estadísticas y la adaptación de flashcards en bloques verticales demuestran un cuidado previo por la respuesta responsive.

Sin embargo, la auditoría revela **tres brechas críticas** que degradan la experiencia en smartphones:
1. **Auto-zoom intrusivo en iOS Safari**: Múltiples campos de entrada y áreas de texto usan tamaños tipográficos de 12px a 14px (`text-xs`, `text-sm`), lo que activa el zoom automático del sistema operativo en iPhone al enfocar, distorsionando la pantalla.
2. **Objetivos táctiles por debajo de la norma WCAG (Touch Target Size < 44px)**: Botones interactivos críticos para la sesión de estudio (como la estrella para marcar preguntas de 28×24px, botones de mover bloques de 32×32px y los botones "Todos/Ninguno" de apenas 16px de alto) resultan difíciles y propensos a toques accidentales.
3. **Dispersión y discontinuidad de Breakpoints**: Conviven consultas dispares (`@media max-width: 480px`, `@media max-width: 640px`, `@container max-width: 560px` y Tailwind `sm: 640px`), generando una "zona muerta" entre 480px y 640px donde ciertos layouts móviles se desactivan prematuramente antes de que el diseño desktop tome el control.

---

## 2. Mapa y Diagnóstico de Media Queries y Breakpoints

### 2.1 Inventario Actual en el Código

| Archivo | Regla / Breakpoint | Elementos Afectados | Diagnóstico |
|---|---|---|---|
| [`componentes.css:60`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/estilos/componentes.css#L60) | `@media (min-width: 640px)` | `.brand-title` escala a `--tipo-4xl` | Correcto: preserva título compacto en móvil (`--tipo-3xl`). |
| [`componentes.css:394`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/estilos/componentes.css#L394) | `@media (min-width: 640px)` | `.etapa-lecciones-lista` (grid autofit) | Correcto: 1 columna en móvil, grilla en tablet/desktop. |
| [`componentes.css:510`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/estilos/componentes.css#L510) | `@media (max-width: 480px)` | `.etapas-camino` (nodos y cards) | ⚠️ **Discontinuo**: entre 481px y 639px vuelve a tamaño desktop antes de tiempo. |
| [`componentes.css:783`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/estilos/componentes.css#L783) | `@media (max-width: 480px)` | `.perfil-card--hero` (apilado vertical) | ⚠️ **Discontinuo**: en 481px–639px fuerza 2 columnas con gap grande. |
| [`componentes.css:822`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/estilos/componentes.css#L822) | `@media (max-width: 640px)` | `.materia-card` (wrap y stats) | Correcto: apila stats al ancho completo. |
| [`componentes.css:953`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/estilos/componentes.css#L953) | `@media (min-width: 640px)` | `.results-hero` (padding y margen) | Correcto: sincronizado con el padding de `.card`. |
| [`componentes.css:1041`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/estilos/componentes.css#L1041) | `@media (max-width: 767.5px)` | `.flash-card-inner` (flujo vertical) | Correcto: elimina flip 3D en viewports estrechos para evitar clipping. |
| [`cuenta.css:307`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/estilos/cuenta.css#L307) | `@media (max-width: 480px)` | `.auth-card` (padding 24px 20px) | Aceptable, pero mejor unificado a 640px. |
| [`pantallas.css:339`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/estilos/pantallas.css#L339) | `@container (max-width: 560px)` | `#stats-panel` (KPIs, hero, temas) | Excelente práctica: responde al ancho de su contenedor real. |
| [`lienzo.css:49`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/estilos/lienzo.css#L49) | `@media (max-width: 640px)` | `#lienzo-diagrama`, `.nodo-puesto` | Mitigado por el filtro táctil de JS (`pointer: coarse`). |
| [`app.js`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/app.js) | `matchMedia("(pointer: coarse)")` | Detección táctil para diagramas | Funcional, pero desactiva diagramas en híbridos con touch. |

### 2.2 Diagnóstico de la "Zona Muerta" (481px a 639px)
En smartphones en posición horizontal (ej. iPhone 14 Pro Max landscape: 932×430px; o Galaxy S23 landscape: 740×360px) o teléfonos plegables con pantalla interna (~540px a 600px):
- Las reglas con tope `@media (max-width: 480px)` dejan de aplicar.
- Las utilidades de Tailwind con `sm:` (640px) aún no aplican.
- Como resultado, componentes como el **Hero del Perfil** (`.perfil-card--hero`) intentan desplegar el anillo grande de 6.5rem en una columna lateral y los chips apretados al lado, generando compresión tipográfica innecesaria.
- **Recomendación**: Estandarizar las reglas móviles en `max-width: 639px` (complemento exacto de Tailwind `sm: 640px`).

---

## 3. Matriz de Auditoría Pantalla por Pantalla (18 Vistas)

| # | Pantalla / Módulo | Estado | Hallazgos Principales |
|---|---|:---:|---|
| 1 | `screen-onboarding` | ⚠️ Requiere atención | Input `#onboarding-nombre` usa `stat-input` (12px), causando zoom en iOS Safari. Los 3 pasos colapsan bien a 1 columna. |
| 2 | `screen-materias` (Home) | 🟢 Bueno | Grid de materias y lenguajes fluido (`grid-cols-1 sm:grid-cols-2`). Botón "Ver mi perfil" mide 34px de alto (debería ser 44px). |
| 3 | `screen-start` (Dashboard materia) | 🟢 Bueno | Botón primario de ancho completo muy accesible. Acordeón "Más modos" opera limpio. Botones secundarios de modos rápidos miden 34px. |
| 4 | `screen-config` (Configuración) | 🔴 Crítico | Enlaces "Todos" / "Ninguno" miden solo 16px de alto. Input de cantidad tiene 12px (zoom iOS). Chips de filtro miden 34px de alto. |
| 5 | `screen-quiz` (Práctica de preguntas) | 🔴 Crítico | Estrella de marcar (`#star-btn`) es de 28×24px pegada a "Salir". En tipo `ordenar`, botones ▲/▼ son de 32×32px. En `desarrollo`, textarea tiene 12px font (zoom iOS). Texto de atajos de teclado visible en móvil. |
| 6 | `screen-results` (Resultados de sesión) | 🟢 Bueno | Anillo SVG escala limpiamente. Desglose en tarjetas claras. Botones de acción inferior apilados a ancho completo (`w-full sm:w-auto`). |
| 7 | `screen-study` (Modo Estudio) | ⚠️ Requiere atención | Buscador con 14px font (zoom iOS). Chips de filtros miden 34px de alto. Acordeones y explicaciones legibles sin desborde. |
| 8 | `screen-apuntes` (Apuntes de materia) | 🟢 Bueno | Excelente legibilidad de lectura (ancho máximo contenido, tipografía descansada). Buscador con 14px font. |
| 9 | `screen-lenguaje` (Roadmap TypeScript) | ⚠️ Requiere atención | Camino vertical funcional, pero en viewports de 481-639px pierde el tamaño de nodo optimizado de móvil. |
| 10 | `screen-misiones` (Mapa de Misiones) | 🟢 Bueno | Nodos de misiones de ancho completo con padding táctil amplio (>=48px). Conectores dorados alineados. Botón volver mide 34px. |
| 11 | `screen-escenarios` (Lista escenarios) | 🟢 Bueno | Cards claras y apiladas en columna. Botón "Jugar escenario" mide 32px de alto. |
| 12 | `screen-escenario` (Juego interactivo) | 🟢 Bueno | Opciones de decisión en lista vertical accesible para el pulgar. Feedback de consecuencias claro. |
| 13 | `screen-casos` (Casos de diagramación) | 🟢 Bueno | Oculta adecuadamente las opciones interactivas de diagramas en dispositivos con puntero táctil (`pointer: coarse`). |
| 14 | `screen-caso` (Lienzo interactivo) | 🟢 Bueno | En móvil el acceso está bloqueado por diseño; aviso explicativo presente. |
| 15 | `screen-flashcards` (Tarjetas de estudio) | 🟢 Bueno | Excelente solución en `@media (max-width: 767.5px)`: las tarjetas fluyen en bloque normal evitando fallos de perspectiva 3D. Botón "Saltar" mide 42px. |
| 16 | `screen-glosario` (Glosario interactivo) | ⚠️ Requiere atención | Buscador con 14px font. Chips de categoría con 34px de alto. Términos y acordeones expandibles claros. |
| 17 | `screen-perfil` (Perfil y Estadísticas) | ⚠️ Requiere atención | Hero card apilada y centrada en <=480px, pero desalineada en 481-639px. Botones de meta (`.meta-btn`) miden 40px (aceptable, óptimo 44px). |
| 18 | `screen-cuenta` (Login / Nube) | 🟢 Bueno | Campos de entrada con 16px font explícito (sin zoom iOS). Botón Google y formularios con padding táctil generoso. |
| — | Componentes: Modal Confirmación | 🟢 Bueno | Modal centrado con backdrop blur; botones verticales `w-full` cómodos para ambas manos. |
| — | Componentes: Toasts / Avisos | ⚠️ Requiere atención | `#toast-zone` en `right: 1rem` con `max-width: 20rem` (320px) puede desbordar en pantallas de 320px–360px. |

---

## 4. Catálogo Detallado de Hallazgos por Severidad

### 🔴 Hallazgos Críticos (Bloqueantes / Degeneración de UX)

#### H-01: Auto-zoom intrusivo en iOS Safari por inputs con `font-size < 16px`
- **Ubicación**:
  - [`src/ui/aprendizaje/quiz.js:716`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/ui/aprendizaje/quiz.js#L716): `<textarea id="dev-texto" class="... text-xs sm:text-sm ...">` (12px en móvil).
  - [`src/estilos/entrada.css:43`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/estilos/entrada.css#L43): `.stat-input { @apply ... text-xs; }` (utilizado en `#onboarding-nombre` y `#cfg-cantidad`).
  - [`src/estilos/entrada.css:103`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/estilos/entrada.css#L103): `.search-input { @apply ... text-sm; }` (14px en glosario, estudio y apuntes).
- **Problema**: En iOS (WebKit/Safari), cualquier control de formulario con tamaño de fuente menor a 16px (1rem) provoca que el navegador fuerce un zoom automático centrado en el input al tocarlo. La pantalla queda ampliada, oculta botones laterales y fuerza al estudiante a pellizcar la pantalla para recuperar la vista normal.
- **Solución recomendada**: Asegurar `font-size: 1rem !important` (16px) en todos los inputs, textareas y buscadores en pantallas móviles (`@media (max-width: 639px)`).

#### H-02: Target táctil subdimensionado en botón de marcar pregunta del Quiz (`#star-btn`)
- **Ubicación**:
  - [`index.html:212`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/index.html#L212): `<button class="star-btn" id="star-btn" ...>☆</button>`.
  - [`src/estilos/entrada.css:75`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/estilos/entrada.css#L75): `.star-btn { @apply text-2xl leading-none px-1 ... }`.
- **Problema**: El bounding box real en pantalla móvil es de **28px de ancho × 24px de alto**. Además, está colocado a solo 8px del botón de "Salir de la ronda". Un estudiante que intenta marcar una pregunta mientras estudia en el transporte público o caminando tiene un alto índice de error y riesgo de tocar "Salir".
- **Solución recomendada**: Aplicar un área táctil mínima de 44×44px (`min-width: 44px; min-height: 44px; display: inline-flex; align-items: center; justify-content: center;`) con padding invisible mediante pseudo-elemento o márgenes de aislamiento.

#### H-03: Botones de mover bloque en preguntas de tipo Ordenar (`.btn-mini`)
- **Ubicación**:
  - [`src/ui/aprendizaje/quiz.js:648-649`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/ui/aprendizaje/quiz.js#L648-L649): botones `▲` y `▼`.
  - [`src/estilos/entrada.css:74`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/estilos/entrada.css#L74): `.btn-mini { @apply w-8 h-8 ... }` (32px × 32px).
- **Problema**: Dos botones de 32×32px colocados lado a lado con `gap-1` (4px). En pantallas táctiles, el arrastre manual en móviles es difícil, por lo que estos botones son el medio principal de interacción; su tamaño viola WCAG 2.5.8 (Target Size Minimum).
- **Solución recomendada**: En pantallas móviles, aumentar `.btn-mini` a mínimo 40×40px o 44×44px, con mayor separación táctil.

---

### 🟡 Hallazgos Mayores (Accesibilidad y Usabilidad Ergonómica)

#### H-04: Enlaces de selección masiva en Configuración (`.link-btn` "Todos" / "Ninguno")
- **Ubicación**:
  - [`src/ui/dashboard/config.js:19-20`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/ui/dashboard/config.js#L19-L20): botones `.link-btn`.
  - [`src/estilos/entrada.css:29`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/estilos/entrada.css#L29): `.link-btn { @apply text-xs font-semibold px-1.5 ... }`.
- **Problema**: Miden **44px de ancho pero solo 16px de altura**. Tocar "Todos" o "Ninguno" para filtrar temas o parciales es frustrante en móvil.
- **Solución recomendada**: Incrementar el padding vertical a `padding: 8px 10px;` en móvil, garantizando al menos 36-40px de área efectiva de contacto.

#### H-05: Chips de filtrado (`.chip`) con altura táctil de 34px
- **Ubicación**: [`src/estilos/entrada.css:31`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/estilos/entrada.css#L31): `.chip { @apply ... px-4 py-2 text-xs sm:text-sm; }`.
- **Problema**: Miden 34px de altura. Aunque horizontalmente son amplios (70px a 140px), verticalmente están por debajo de los 44px recomendados por WCAG 2.5.5 / 2.5.8. Al estar agrupados en varias filas (ej. en Modo Estudio o Configuración), el riesgo de tocar el chip de la fila superior/inferior es alto.
- **Solución recomendada**: Aumentar a `py-2.5` o fijar `min-height: 40px` en móvil, con `gap: 0.5rem` entre filas.

#### H-06: Discontinuidad de Breakpoints en Zona Muerta (481px a 639px)
- **Ubicación**:
  - [`src/estilos/componentes.css:510`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/estilos/componentes.css#L510): `@media (max-width: 480px)`.
  - [`src/estilos/componentes.css:783`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/estilos/componentes.css#L783): `@media (max-width: 480px)`.
  - [`src/estilos/cuenta.css:307`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/estilos/cuenta.css#L307): `@media (max-width: 480px)`.
- **Problema**: Al rotar el teléfono a horizontal (landscape) o en dispositivos de ancho intermedio (ej. 500px–600px), el perfil abandona la versión centrada de 1 columna y vuelve a forzar 2 columnas comprimidas con un anillo desproporcionado.
- **Solución recomendada**: Cambiar `@media (max-width: 480px)` por `@media (max-width: 639px)` para sincronizarlo con el breakpoint `sm` de Tailwind.

#### H-07: Flujo de preguntas tipo `relacionar` en móvil
- **Ubicación**: [`src/ui/aprendizaje/quiz.js:300`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/ui/aprendizaje/quiz.js#L300): `<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">`.
- **Problema**: En pantallas menores a 640px se apila toda la columna izquierda y luego toda la columna derecha. Para emparejar pares, el estudiante debe scrollear arriba para elegir el término izquierdo y scrollear abajo para elegir su pareja derecha en cada intento.
- **Solución recomendada**: Ofrecer una grilla de 2 columnas compactas en móvil (`grid-cols-2 gap-2 text-xs`), o numerar/colorear pares de forma sincronizada en vista compacta sin obligar a scroll vertical bidireccional.

---

### 🔵 Hallazgos Menores (Pulido de Craft y Detalles Visuales)

#### H-08: Padding acumulado excesivo en pantallas compactas (320px–360px)
- **Ubicación**:
  - [`index.html:11`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/index.html#L11): `<body class="... p-4 sm:p-6 ...">`.
  - [`src/estilos/entrada.css:20`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/estilos/entrada.css#L20): `.card { @apply ... p-5 sm:p-7 ... }`.
- **Problema**: En un viewport de 320px, 32px de margen exterior + 40px de padding interior de la tarjeta consumen 72px (casi el 23% de la pantalla), dejando únicamente 248px para el contenido.
- **Solución recomendada**: En pantallas estrechas (`@media (max-width: 375px)`), reducir el padding de `.card` a `p-4` (16px) y `body` a `p-3` (12px), ganando 16px de ancho útil.

#### H-09: Texto de atajos de teclado visible en teléfonos
- **Ubicación**: [`index.html:233`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/index.html#L233): `<p class="text-center text-slate-500 text-xs mt-4">Atajos: <b>1</b> <b>2</b> <b>3</b> para responder · <b>Enter</b> para continuar</p>`.
- **Problema**: El mensaje instruye al usuario a usar teclas físicas (1, 2, 3, Enter), las cuales no existen en un teclado en pantalla de teléfono móvil, ocupando espacio vertical y generando confusión.
- **Solución recomendada**: Ocultar el párrafo en pantallas táctiles o móviles con la clase `hidden sm:block`.

#### H-10: Texto explicativo de ordenación con espacio en blanco roto
- **Ubicación**: [`src/ui/aprendizaje/quiz.js:622`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/ui/aprendizaje/quiz.js#L622): `<p class="text-xs text-slate-400 mb-3">Usa    o arrastra los bloques hasta lograr el orden correcto.</p>`.
- **Problema**: Existe una separación vacía de 4 espacios ("Usa    o arrastra"), evidenciando un glifo o texto faltante (originalmente pensado para "Usa ▲/▼ o arrastra").
- **Solución recomendada**: Corregir la redacción a `"Usa los botones ▲/▼ o arrastra los bloques..."`.

#### H-11: Riesgo de desborde en contenedor de Toasts (`#toast-zone`)
- **Ubicación**: [`src/estilos/componentes.css:82-84`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/src/estilos/componentes.css#L82-L84): `#toast-zone { right: 1rem; ... } .toast { max-width: 20rem; }`.
- **Problema**: `20rem` equivale a 320px. Con `right: 1rem` (16px), un aviso de ancho máximo requeriría 336px, desbordando por la izquierda en teléfonos de 320px.
- **Solución recomendada**: Definir `.toast { max-width: min(20rem, calc(100vw - 2rem)); }`.

#### H-12: Meta tag de Viewport sin `viewport-fit=cover`
- **Ubicación**: [`index.html:5`](file:///C:/Users/damez/Downloads/ProyectosSoftware/Systematic/index.html#L5): `<meta name="viewport" content="width=device-width, initial-scale=1.0">`.
- **Problema**: En dispositivos móviles con notch o barras de inicio dinámicas (iOS / Android modernos), el contenido no puede aprovechar de forma segura las variables CSS `env(safe-area-inset-*)`.
- **Solución recomendada**: Agregar `viewport-fit=cover` al meta tag para soportar safe-areas completas si se incorporan barras fijas.

---

## 5. Plan de Acción y Catálogo de Fixes Recomendados

### Paquete 1: Prevención de Zoom iOS y Escala Tipográfica (Crítico)
```css
/* Corrección global en componentes.css o tokens.css */
@media (max-width: 639px) {
  /* Evita auto-zoom en iOS Safari garantizando 16px base en todo input */
  input:not([type="checkbox"]):not([type="radio"]),
  textarea,
  select,
  .search-input,
  .stat-input {
    font-size: 1rem !important; /* 16px */
  }
}
```

### Paquete 2: Objetivos Táctiles Accesibles (WCAG 2.2 AA)
```css
/* Aumento de touch targets en componentes.css */
@media (max-width: 639px) {
  /* Estrella de quiz accesible */
  .star-btn {
    min-width: 44px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }

  /* Botones de ordenación de bloques */
  .bloque .btn-mini {
    width: 2.5rem;   /* 40px */
    height: 2.5rem;  /* 40px */
    font-size: 1rem;
  }

  /* Enlaces de selección en configuración */
  .link-btn {
    min-height: 36px;
    display: inline-flex;
    align-items: center;
    padding: 0.35rem 0.6rem;
  }

  /* Chips con altura táctil ergonómica */
  .chip {
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }

  /* Botones pequeños con altura mínima de 40-44px */
  .btn-sm {
    min-height: 40px;
  }
}
```

### Paquete 3: Unificación de Breakpoints y Zona Muerta
Reemplazar en `src/estilos/componentes.css` y `src/estilos/cuenta.css` todas las ocurrencias de:
`@media (max-width: 480px)` por `@media (max-width: 639px)`.

### Paquete 4: Pulido de Limpieza y UX Móvil
1. Ocultar los atajos de teclado en `index.html`:
   ```html
   <p class="text-center text-slate-500 text-xs mt-4 hidden sm:block">Atajos: <b>1</b> <b>2</b> <b>3</b> para responder · <b>Enter</b> para continuar</p>
   ```
2. Corregir texto roto en `renderOrdenar`:
   ```javascript
   '<p class="text-xs text-slate-400 mb-3">Usa los botones ▲/▼ o arrastra los bloques hasta lograr el orden correcto.</p>'
   ```
3. Blindar toast zone contra desborde en 320px:
   ```css
   .toast { max-width: min(20rem, calc(100vw - 2rem)); }
   ```
4. Mantener la pantalla de `relacionar` en 2 columnas compactas en móvil:
   ```html
   <div class="grid grid-cols-2 gap-2">
   ```
   evitando el desplazamiento vertical ciego entre columnas.

---

## 6. Próximos Pasos

1. Revisión de este informe por parte del usuario.
2. Tras la aprobación, creación de una rama o commits atómicos agrupados por paquete (Paquete 1: Zoom inputs -> Paquete 2: Touch targets -> Paquete 3: Breakpoints -> Paquete 4: Pulido).
3. Verificación final con la suite de tests unitarios (`npx vitest run`) y pruebas Playwright en dispositivos móviles emulados.
