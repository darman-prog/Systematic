# Subnetting y CIDR

Material propio generado para la materia Infraestructura (no proviene de un manual de la cátedra).

## Notación CIDR

La notación **CIDR** (Classless Inter-Domain Routing) escribe una red como `IP/prefijo`, donde el prefijo indica cuántos bits son de red. Por ejemplo, `192.168.1.0/24` significa que los primeros 24 bits identifican la red.

- `/24` = 255.255.255.0 → 256 direcciones, 254 hosts útiles
- `/25` = 255.255.255.128 → 128 direcciones, 126 hosts
- `/26` = 255.255.255.192 → 64 direcciones, 62 hosts
- `/27` = 255.255.255.224 → 32 direcciones, 30 hosts
- `/28` = 255.255.255.240 → 16 direcciones, 14 hosts
- `/30` = 255.255.255.252 → 4 direcciones, 2 hosts (enlace punto a punto)

## Fórmula de cálculo

Para una subred con `n` bits de host:

- Direcciones totales: `2^n`
- Hosts útiles: `2^n - 2` (se reservan la dirección de red y la de broadcast)

Para saber qué máscara necesito para `h` hosts, busco el menor `n` tal que `2^n - 2 >= h`.

## Subnetting

El subnetting divide una red grande en subredes más pequeñas tomando bits de la parte de host. De una `/24` a una `/26` se toman 2 bits y se obtienen 4 subredes (`.0`, `.64`, `.128`, `.192`).

## VLSM

El **VLSM** (Variable Length Subnet Mask) permite que las subredes de una misma red tengan distinto tamaño, asignando a cada una solo las direcciones que necesita. Para subredes de 60, 30 y 10 hosts:

- 60 hosts → `/26` (62 útiles)
- 30 hosts → `/27` (30 útiles)
- 10 hosts → `/28` (14 útiles)

## Resumen de rutas

El resumen de rutas (supernetting) agrupa subredes contiguas en una sola ruta con prefijo más corto, por ejemplo cuatro `/26` en una `/24`, reduciendo el tamaño de la tabla de enrutamiento.

## Longest prefix match

Cuando varias rutas coinciden con un destino, el router elige la del prefijo más largo (la más específica). Una `/32` (un solo host) prevalece sobre una `/24`.
