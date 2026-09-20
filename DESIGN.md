---
name: Systematic
description: Ambiente calmado para estudiar materias de ingeniería con práctica activa.
colors:
  study-bg: "#1A1C22"
  study-surface: "#22252D"
  study-surface-2: "#2B2F38"
  study-text: "#E7E5DE"
  study-muted: "#A9ADB6"
  study-accent: "#9BB8C9"
  study-accent-strong: "#7898B0"
  study-success: "#8FBF9F"
  study-error: "#D99A8B"
  study-warning: "#D9BC8A"
typography:
  headline:
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.15
  display:
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
    fontSize: "clamp(1.75rem, 5vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.15
  body:
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  full: "9999px"
  sm: "8px"
  md: "12px"
  lg: "16px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
---

## Overview

Systematic es una interfaz de estudio operativa: debe priorizar comprensión, continuidad y
feedback sobre intensidad visual. La dirección es **Noche calma**, una superficie carbón cálida
con azul niebla como acento y estados semánticos apagados.

## Colors

No se usa blanco ni negro puros. Las superficies se separan por luminancia sutil; el azul niebla
se reserva para acciones y foco. Salvia, terracota y ámbar aparecen solo en estados semánticos.

## Typography

El cuerpo usa la fuente del sistema (Segoe UI) a 16px con line-height 1.6. Los titulares (h1/h2)
usan **Source Serif 4** self-hosted vía `@fontsource` — solo pesos 600/700 — a través del token
`--fuente-display`; le da carácter de "apuntes académicos" sin cargar más pesos ni CDN. Los
encabezados son claros y sin texto con gradiente.

## Identity

Cada materia tiene acento propio: al seleccionarla, `app.js` fija `--materia-accent` con su color
y lo heredan el botón primario, la barra de progreso y los valores de stats; `theme-color` del
navegador lo acompaña. Las tres materias usan pasteles claros, así que el texto sobre el acento es
siempre `--study-bg` (contraste ~8:1). Fuera de una materia, el acento vuelve al azul niebla.

## Layout

Mobile-first, contenido centrado y respirable, medida de lectura aproximada 65-75ch. Las pantallas
de estudio conservan controles accesibles y los modos de juego no dependen de hover.

## Elevation & Depth

La profundidad viene de superficies tonales, bordes suaves y sombras difusas; no se usan halos
neón ni sombras duras.

## Motion

El movimiento es un sistema, no efectos sueltos: tokens `--mov-rapida` (150ms), `--mov-base`
(280ms), `--mov-enfasis` (460ms) y un único easing (`cubic-bezier(0.22, 1, 0.36, 1)`) definidos
en `tokens.css`. Se admiten pocos momentos y siempre informativos:

- Entrada de pantalla única (fade + 10px) al cambiar de pantalla o de pregunta.
- Acierto: el bloque de feedback y la marca correcta hacen un `pop` breve; el fallo usa `shake`.
- Marcar una pregunta: la estrella hace un `pop`.
- Resultados: el anillo se dibuja de 0 al porcentaje final.
- Perfil: el contador de XP sube con easing; no anima si el usuario pidió menos movimiento.
- Avisos: el toast entra desde la derecha y se desvanece.

Con `prefers-reduced-motion: reduce` todas las animaciones y transiciones quedan neutralizadas por
la regla global de `tokens.css`. Ninguna animación es obligatoria para entender un estado.

## Shapes

Cards y controles usan radios de 8-16px, foco visible y objetivos táctiles de al menos 44px.

## Components

Cards de modo, chips, botones, feedback y tarjetas de pregunta comparten superficies y tokens.
Los estados correcto/incorrecto siempre incluyen texto, icono o estructura además del color.

## Iconography

La iconografía es un set propio de SVG de trazo (`src/ui/iconos.js`): stroke 1.5, viewBox 24,
`currentColor`, tamaño 16/20/22px. Los iconos acompañan siempre texto con el nombre de la
acción; nunca sustituyen etiquetas. No se usan emojis como iconos; solo permanecen los glifos
funcionales del marcador (★/☆) y de selección múltiple (☑/☐).

## Hierarchy & surfaces

- El home jerarquiza: "Configurar práctica" primaria a lo ancho y el resto de modos como filas
  compactas con icono + título + descripción.
- El quiz usa una meta-línea de texto (pregunta · tema · tipo · dificultad) y reserva las pills
  para estado vivo: temporizador, vidas, simulacro/modo.
- Profundidad por superficie tonal y borde: `shadow-xl` solo en overlays y toasts. Hover cambia
  borde/fondo, nunca traslada la card.

## Do's and Don'ts

- Sí: transiciones breves, movimiento suave, confeti discreto al lograr hitos.
- Sí: estados vacíos con una próxima acción clara.
- No: texto con gradiente, saturación alta, flashes, motion obligatorio o gamificación punitiva.
- No: emojis como iconos, halos de color sin offset, cards idénticas en grilla como estructura.
