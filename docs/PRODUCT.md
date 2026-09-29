# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Estudiantes universitarios de ingeniería que estudian individualmente desde móvil o portátil.

## Product Purpose

Systematic convierte material académico de la carrera en sesiones cortas de estudio activo:
preguntas, práctica, apuntes, flashcards y repaso espaciado. El éxito es que el estudiante
entienda sus errores, vuelva a practicar y mantenga constancia sin depender de un backend.

## Positioning

Una herramienta de estudio personal basada en el material real de las materias del estudiante,
con feedback inmediato y progreso local; no inventa un temario genérico ni exige una cuenta.

## Operating Context

Uso individual antes de parciales o durante sesiones breves. El contenido fuente vive en
`BancoDeInformacion/` y las materias publicadas en `src/datos/`. El progreso se guarda en el
navegador y se puede exportar/importar.

## Capabilities and Constraints

- Materias BD2, Ingeniería de Software y Arquitectura de Software.
- Práctica, simulacro, estudio, apuntes, flashcards, glosario y repaso espaciado.
- Sin backend, cuentas ni sincronización.
- El contenido nuevo debe derivarse de los `.md` fuente y validarse antes de publicarse.

## Product Principles

1. Fidelidad académica: cada contenido debe poder rastrearse a material fuente revisable.
2. Gamificación amable: motivar la constancia sin castigar ni generar ansiedad.
3. Feedback útil: cada error explica qué revisar y qué intentar después.
4. Estudio sostenible: sesiones legibles, calmadas y cómodas para los ojos.

## Accessibility & Inclusion

Contraste WCAG AA, foco visible, teclado funcional, feedback que no dependa solo del color y
respeto de `prefers-reduced-motion`.
