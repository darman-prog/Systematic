// Apuntes curados de Infraestructura (markdown revisado).
// Fuente: .md de BancoDeInformacion/Infraestructura/. Se completa por lotes revisados.
const apuntes = [
  {
    id: "AP-INF-01",
    tema: "Linux: comandos básicos",
    titulo: "Comandos básicos y archivos en Fedora",
    fuente: "BancoDeInformacion/Infraestructura/03MANUAL COMANDOS BASICOS FEDORA.md",
    contenido: `## Información del sistema

- **arch**: tipo de arquitectura del procesador (64 o 32 bits).
- **uname -r**: versión del kernel en uso.
- **cat /proc/cpuinfo** y **cat /proc/meminfo**: procesador y memoria RAM.
- **date**: fecha del sistema; **cal año**: almanaque del año.
- **man comando**: ayuda sobre un comando.
- **ps -A**: todos los procesos con su PID; **kill -9 PID**: cierra un proceso.
- **free**: memoria libre; **df -h**: espacio en disco; **du -h**: tamaño de directorios.
- **history**: comandos utilizados en la sesión.

## Apagar y reiniciar

- **shutdown -h now** o **init 0**: apagar.
- **reboot** o **init 6**: reiniciar.
- **logout**: cerrar la sesión.

## Archivos y directorios

- **cd** entra a un directorio; **cd ..** retrocede un nivel; **cd** solo vuelve a la raíz.
- **pwd**: directorio actual; **ls** lista; **ls -l** detalles; **ls -a** ocultos.
- **mkdir** crea carpetas (acepta varias a la vez); **rmdir** elimina solo si está vacío.
- **rm -r -f -v** elimina un directorio con todo su contenido.
- **mv** renombra o mueve; **cp** copia.
- **find** busca archivos por nombre, tipo o tamaño.
- **cat** muestra el contenido de un fichero.`
  },
  {
    id: "AP-INF-02",
    tema: "Linux: permisos de archivos y directorios",
    titulo: "Permisos de archivos y directorios",
    fuente: "BancoDeInformacion/Infraestructura/05 MANUAL PERMISOS DE ARCHIVOS Y DIRECTORIOS.md",
    contenido: `## Los tres niveles

Todo archivo y directorio tiene permisos para tres tipos de usuarios:

1. **Propietario** (dueño del archivo)
2. **Grupo propietario** (el grupo al que pertenece el archivo)
3. **Otros** (el resto de usuarios del sistema)

## Las letras rwx

- **r** (read): lectura. En un directorio, permite listar su contenido.
- **w** (write): escritura. En un directorio, permite crear y eliminar archivos dentro.
- **x** (execute): ejecución. En un directorio, permite entrar con «cd».

## Formato octal

Cada letra vale un número: **r = 4, w = 2, x = 1**. La combinación de los tres da un dígito de 0 a 7:

| Permisos | Octal | Significado |
| --- | --- | --- |
| --- | 0 | ningún permiso |
| --x | 1 | solo ejecución |
| -w- | 2 | solo escritura |
| r-- | 4 | solo lectura |
| r-x | 5 | lectura y ejecución |
| rw- | 6 | lectura y escritura |
| rwx | 7 | todos los permisos |

Ejemplos: **600** (rw-------) solo el propietario lee y escribe; **755** (rwxr-xr-x) propietario todo, grupo y otros leen y ejecutan.

## Cambiar permisos y propietario

- **chmod** cambia permisos: «chmod 600 archivo» o «chmod u+x archivo».
- **chown** cambia el propietario; **chgrp** el grupo propietario.
- En modo simbólico: **u** (dueño), **g** (grupo), **o** (otros); **+** añade, **-** quita, **=** asigna.

## Permisos especiales

- **SUID**: el archivo se ejecuta como su propietario.
- **SGID**: se ejecuta como su grupo.
- **Sticky bit**: en directorios compartidos, protege los ficheros de otros usuarios.`
  },
  {
    id: "AP-INF-03",
    tema: "Linux: usuarios y grupos",
    titulo: "Gestión de usuarios y grupos",
    fuente: "BancoDeInformacion/Infraestructura/04 MANUAL GESTION GRUPOS Y USUARIOS_V3.md",
    contenido: `## Crear usuarios y grupos

- **useradd -g <grupo> -d <home> -m -s <shell> <usuario>**: crea un usuario con su grupo principal, carpeta home, la crea (-m) y define su shell.
- **groupadd <grupo>**: crea un grupo.
- **passwd <usuario>**: establece la contraseña (se pide dos veces). Sin nombre de usuario, cambia la de root.
- **su <usuario>**: ingresa como ese usuario; **exit** sale de la sesión.

Nota: sin la opción **-m** no se crea la carpeta home.

## Dónde se guarda la información

- **/etc/passwd**: nombre de cuenta, campo de clave (x), UID, GID, nombre, carpeta home y shell.
- **/etc/shadow**: contraseñas cifradas.
- **/etc/group**: grupos con su GID.

El UID 0 pertenece a root; por debajo de 1000 están reservados para el sistema; por encima de 1000 son los usuarios normales.

## Modificar y eliminar

- **usermod**: cambia nombre (-l), carpeta home (-d), shell (-s) y grupo principal (-g).
- **userdel -r <usuario>**: elimina el usuario y su carpeta home.
- **groupmod**: cambia el nombre (-n) o el GID (-g) de un grupo.
- **groupdel <grupo>**: elimina un grupo (falla si algún usuario lo tiene como grupo principal).

## El intérprete de comandos

La **shell** es la interfaz entre el usuario y el sistema operativo: lee la línea de comandos, la interpreta, ejecuta el comando y muestra el resultado.`
  },
  {
    id: "AP-INF-04",
    tema: "Linux: SSH",
    titulo: "Servicio SSH en Fedora",
    fuente: "BancoDeInformacion/Infraestructura/10 MANUAL DE SSH_V4.md",
    contenido: `## Qué es SSH

**SSH** (Secure Shell) es un protocolo que facilita comunicaciones seguras entre dos sistemas con arquitectura cliente/servidor. A diferencia de FTP o Telnet, **encripta la sesión**, haciendo imposible que alguien obtenga contraseñas sin encriptar.

## Instalación y configuración

1. Instalar el servicio: **dnf -y install openssh-server**.
2. Editar la configuración en **/etc/ssh/sshd_config**. Para permitir el login de root, quitar el comentario de **PermitRootLogin** y poner **yes**.
3. Iniciar el servicio: **systemctl start sshd.service**.
4. Activarlo para el arranque: **systemctl enable sshd.service**.
5. Verificar el puerto: **netstat -ant | grep 22**.
6. Probar con **ssh localhost** (escribir yes, la clave de root y exit).

## Probar desde otro equipo

- Poner el adaptador de Fedora y el cliente en red interna asignando IPs.
- Desactivar firewalld y SELinux en el servidor para la práctica.
- En el cliente Windows usar **PuTTY**: indicar la IP del servidor Fedora y autenticarse con su clave.

## Comandos útiles

- **ssh usuario@ip**: conexión remota.
- **scp**: copia segura de ficheros entre equipos.
- **sftp**: transferencia de ficheros interactiva.`
  },
  {
    id: "AP-INF-05",
    tema: "Redes: subnetting y CIDR",
    titulo: "Subnetting y CIDR",
    fuente: "BancoDeInformacion/Infraestructura/AP-INF-05 Subnetting y CIDR.md",
    contenido: `## Notación CIDR

La notación **CIDR** escribe una red como **IP/prefijo**, donde el prefijo es el número de bits de red:

- /24 = 255.255.255.0 → 254 hosts útiles
- /25 = 255.255.255.128 → 126 hosts
- /26 = 255.255.255.192 → 62 hosts
- /27 = 255.255.255.224 → 30 hosts
- /28 = 255.255.255.240 → 14 hosts
- /30 = 255.255.255.252 → 2 hosts (enlace punto a punto)

## Fórmula clave

Con **n** bits de host:

- Direcciones totales: 2^n
- Hosts útiles: 2^n - 2 (se reservan la dirección de red y la de broadcast)

Para **h** hosts, busco el menor n tal que 2^n - 2 >= h.

## Subnetting y VLSM

El **subnetting** divide una red tomando bits de host: de /24 a /26 se toman 2 bits y salen 4 subredes.

El **VLSM** permite subredes de distinto tamaño: para 60, 30 y 10 hosts se usan /26, /27 y /28.

## Resumen de rutas y longest prefix match

El **resumen de rutas** agrupa subredes contiguas en una ruta con prefijo más corto. Cuando varias rutas coinciden, el router aplica **longest prefix match**: gana la más específica (la de prefijo más largo).`
  },
  {
    id: "AP-INF-06",
    tema: "Redes: gateway y enrutamiento",
    titulo: "Rutas, gateway y DNS",
    fuente: "BancoDeInformacion/Infraestructura/AP-INF-06 Rutas, gateway y DNS.md",
    contenido: `## Gateway por defecto

El **gateway por defecto** es la interfaz del router en la red local. Todo paquete con destino fuera de la subred se envía a esa dirección.

## Tabla de enrutamiento

La **tabla de enrutamiento** guarda las rutas conocidas: destino, máscara, gateway (next-hop) e interfaz.

- En Linux: **ip route**
- En Cisco IOS: **show ip route**

## Ruta estática y next-hop

Una **ruta estática** se configura a mano: «ip route add 10.0.0.0/8 via 192.168.1.1». Las dinámicas se aprenden con OSPF o RIP.

El **next-hop** es la IP del siguiente router al que se entrega el paquete.

## DNS

El **DNS** traduce nombres de dominio a direcciones IP. En Linux se configura en **/etc/resolv.conf** con líneas «nameserver».

Registros principales:

- **A**: nombre → IPv4
- **CNAME**: alias
- **MX**: servidor de correo
- **NS**: servidor de nombres

## NAT / PAT

El **NAT** traduce IP privadas a una IP pública; el **PAT** usa el puerto para distinguir varios equipos que comparten la misma IP pública.`
  }
];

export default apuntes;
