# ADR 005 — Subtipo de diagrama «red» aplazado

- **Estado**: aceptado
- **Fecha**: 2026-09-26
- **Decisor**: build (con revisión del usuario)

## Contexto

La materia Infraestructura incluye contenido de redes Cisco (subnetting, rutas, gateway, DNS,
VLAN, ACL). El motor de diagramas (`src/core/diagramas.js`) solo ofrece 4 subtipos: `er`,
`uml-clases`, `casos-uso` y `actividades`. Los casos de diagramación exigen un diagrama
(`scripts/validador.mjs:121`), así que sin un subtipo de red no es posible armar casos de topología
en el lienzo.

Agregar el subtipo `red` implicaría: modelo de nodos (router, switch, PC), tipos de arista
(enlace, trunk), etiquetas, revisión de a11y del lienzo y tests del motor. Es trabajo de varias
sesiones, no de esta feature.

## Decisión

No agregar el subtipo `red` ahora. La materia Infraestructura se apoya en los motores existentes:
preguntas de los 8 tipos soportados, escenarios narrativos de troubleshooting, misiones por tema,
glosario y apuntes. `casos` queda vacío (`casos: []`) y el constructor de diagramas no aparece.

## Consecuencias

- **Positivas**: la materia se entrega completa con los motores actuales; cero riesgo de regresión
  en el lienzo; el contenido de redes se evalúa con preguntas y escenarios, que son suficientes para
  el parcial.
- **Negativas**: no hay casos de topología interactivos (arrastrar routers y conectar enlaces). El
  subtipo `red` queda como deuda conocida con alcance estimado.
- **Riesgo**: si el usuario quiere casos de topología, habrá que estimar el subtipo `red` por
  separado.

## Alternativas consideradas

1. **Simulador de consola propio** (escribir comandos `show ip route`, `ipconfig` y validar la
   salida): rechazado por costo — es un motor nuevo completo, fuera del alcance de esta feature.
2. **Reusar el subtipo `er` para redes**: rechazado por semántica incorrecta — las entidades y las
   relaciones 1:N no representan routers y enlaces.
3. **Esperar los manuales de redes de la cátedra**: descartado por el usuario (no existen).
4. **Generar el contenido de redes sin fuente** (elegido para las preguntas): aceptado con revisión
   humana por lote, registrado en el spec 005.
