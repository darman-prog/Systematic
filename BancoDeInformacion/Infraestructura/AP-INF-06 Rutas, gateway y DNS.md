# Rutas, gateway y DNS

Material propio generado para la materia Infraestructura (no proviene de un manual de la cátedra).

## Gateway por defecto

El **gateway por defecto** es la interfaz del router en la red local del host. Todo paquete con destino fuera de la subred se envía a esa dirección. Sin gateway no hay salida a otras redes ni a internet.

## Tabla de enrutamiento

La **tabla de enrutamiento** guarda las rutas conocidas: destino, máscara, gateway (next-hop) e interfaz. En Linux se consulta con `ip route`; en Cisco IOS con `show ip route`.

## Ruta estática

Una **ruta estática** se configura a mano. En Linux:

```
ip route add 10.0.0.0/8 via 192.168.1.1
```

Las rutas dinámicas se aprenden con protocolos como OSPF o RIP.

## Next-hop

El **next-hop** es la IP del siguiente router al que se entrega el paquete. Cada router reenvía al siguiente next-hop hasta llegar al destino.

## DNS

El **DNS** (Domain Name System) traduce nombres de dominio a direcciones IP. En Linux se configura en `/etc/resolv.conf` con líneas `nameserver`. Los registros principales:

- **A**: nombre → IPv4
- **CNAME**: alias de otro nombre
- **MX**: servidor de correo del dominio
- **NS**: servidor de nombres autoritativo

## Resolución y caché

Para resolver un nombre se consulta al servidor DNS (con `nslookup`, `host` o `dig`). El resultado se guarda en la caché DNS durante el TTL configurado, evitando repetir la consulta.

## NAT / PAT

El **NAT** traduce direcciones IP privadas a una IP pública para salir a internet. El **PAT** usa el puerto para distinguir varios equipos internos que comparten la misma IP pública.
