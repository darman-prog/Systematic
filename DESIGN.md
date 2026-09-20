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

Segoe UI se mantiene como fuente local del sistema. El cuerpo usa 16px y line-height 1.6; los
encabezados son claros sin usar texto con gradiente.

## Layout

Mobile-first, contenido centrado y respirable, medida de lectura aproximada 65-75ch. Las pantallas
de estudio conservan controles accesibles y los modos de juego no dependen de hover.

## Elevation & Depth

La profundidad viene de superficies tonales, bordes suaves y sombras difusas; no se usan halos
neón ni sombras duras.

## Shapes

Cards y controles usan radios de 8-16px, foco visible y objetivos táctiles de al menos 44px.

## Components

Cards de modo, chips, botones, feedback y tarjetas de pregunta comparten superficies y tokens.
Los estados correcto/incorrecto siempre incluyen texto, icono o estructura además del color.

## Do's and Don'ts

- Sí: transiciones breves, movimiento suave, confeti discreto al lograr hitos.
- Sí: estados vacíos con una próxima acción clara.
- No: texto con gradiente, saturación alta, flashes, motion obligatorio o gamificación punitiva.
