// Glosario de Infraestructura (Linux + Redes).
// Términos derivados de los manuales de la cátedra (Linux) y de material propio (Redes).
const glosario = {
  categorias: [
    { id: "linux-sistema", nombre: "Sistema y comandos Linux", corto: "Sistema", color: "#7FC8B0" },
    { id: "linux-permisos", nombre: "Permisos y usuarios", corto: "Permisos", color: "#8FB3D9" },
    { id: "linux-servicios", nombre: "Servicios Linux", corto: "Servicios", color: "#A094BA" },
    { id: "redes-ip", nombre: "IP y subnetting", corto: "IP", color: "#FA9B9B" },
    { id: "redes-routing", nombre: "Rutas y DNS", corto: "Rutas", color: "#F4B860" },
    { id: "redes-switching", nombre: "Switching y seguridad", corto: "Switching", color: "#9FBEA9" }
  ],
  terminos: [
    {
      termino: "Shell (intérprete de comandos)",
      categoria: "linux-sistema",
      definicion: "Interfaz entre el usuario y el sistema operativo que lee la línea de comandos, interpreta su significado, ejecuta el comando y muestra el resultado.",
      ejemplo: "La shell bash es la más común en Linux; el símbolo «#» indica sesión de root y «$» de usuario limitado."
    },
    {
      termino: "pwd",
      categoria: "linux-sistema",
      definicion: "Comando que muestra el directorio actual de trabajo (print working directory).",
      ejemplo: "«pwd» devuelve /home/usuario cuando estás en tu carpeta personal."
    },
    {
      termino: "ls",
      categoria: "linux-sistema",
      definicion: "Comando que lista los ficheros de un directorio. Con «-l» da el formato largo y con «-a» muestra los ocultos.",
      ejemplo: "«ls -l» muestra permisos, propietario, tamaño y fecha de cada fichero."
    },
    {
      termino: "mkdir / rmdir",
      categoria: "linux-sistema",
      definicion: "«mkdir» crea directorios y «rmdir» los elimina, pero solo si están vacíos.",
      ejemplo: "Para borrar un directorio con contenido se usa «rm -r -f»."
    },
    {
      termino: "tar",
      categoria: "linux-sistema",
      definicion: "Comando que empaqueta varios archivos o directorios en uno solo. Con «z» comprime con gzip y con «j» con bzip2.",
      ejemplo: "«tar czvf backup.tar.gz /var/www» crea un archivo comprimido con el contenido de /var/www."
    },
    {
      termino: "chmod simbólico",
      categoria: "linux-sistema",
      definicion: "Forma de cambiar permisos indicando usuario (u), grupo (g) u otros (o) y la operación (+, -, =).",
      ejemplo: "«chmod u+x script.sh» da permiso de ejecución al propietario."
    },
    {
      termino: "Permisos en octal",
      categoria: "linux-sistema",
      definicion: "Representación numérica de los permisos: r=4, w=2, x=1. Cada grupo de tres bits da un dígito de 0 a 7.",
      ejemplo: "«chmod 755 archivo» equivale a rwxr-xr-x."
    },
    {
      termino: "useradd",
      categoria: "linux-sistema",
      definicion: "Comando que crea un usuario indicando grupo principal (-g), carpeta home (-d), si se crea (-m) y shell (-s).",
      ejemplo: "«useradd -g mycatedra -d /home/pepe -m -s /bin/bash pepe»."
    },
    {
      termino: "Propietario, grupo y otros",
      categoria: "linux-permisos",
      definicion: "Los tres niveles a los que se aplican los permisos de un archivo: el propietario, el grupo propietario y el resto de usuarios.",
      ejemplo: "En «-rw-r--r--» el propietario lee y escribe, el grupo y otros solo leen."
    },
    {
      termino: "rwx",
      categoria: "linux-permisos",
      definicion: "Las tres letras de permiso: r (lectura), w (escritura) y x (ejecución). En un directorio, x permite entrar con «cd».",
      ejemplo: "«rwxr-xr-x» = propietario todo, grupo y otros leen y ejecutan."
    },
    {
      termino: "chmod",
      categoria: "linux-permisos",
      definicion: "Comando que cambia los permisos de un archivo o directorio, en modo simbólico u octal.",
      ejemplo: "«chmod 600 archivo» deja solo lectura y escritura para el propietario."
    },
    {
      termino: "chown / chgrp",
      categoria: "linux-permisos",
      definicion: "«chown» cambia el usuario propietario de un archivo y «chgrp» el grupo propietario.",
      ejemplo: "«chown pepe archivo» y «chgrp mycatedra archivo»."
    },
    {
      termino: "/etc/passwd",
      categoria: "linux-permisos",
      definicion: "Archivo que guarda la información de los usuarios: nombre, campo de clave (x), UID, GID, nombre, carpeta home y shell.",
      ejemplo: "«cat /etc/passwd» muestra una línea por usuario."
    },
    {
      termino: "/etc/shadow",
      categoria: "linux-permisos",
      definicion: "Archivo que guarda las contraseñas cifradas de los usuarios, con permisos restringidos.",
      ejemplo: "El campo de clave en /etc/passwd quedó como «x»: la contraseña real está en shadow."
    },
    {
      termino: "SUID, SGID y sticky bit",
      categoria: "linux-permisos",
      definicion: "Permisos especiales: SUID ejecuta el archivo como su propietario, SGID como su grupo, y sticky bit protege los ficheros de un directorio compartido.",
      ejemplo: "«chmod 4755» activa SUID; «chmod 1777 /tmp» activa sticky bit."
    },
    {
      termino: "systemctl",
      categoria: "linux-servicios",
      definicion: "Comando que gestiona los servicios del sistema: los inicia, los activa para el arranque, los reinicia y consulta su estado.",
      ejemplo: "«systemctl start httpd.service», «systemctl enable sshd.service», «systemctl status postgresql.service»."
    },
    {
      termino: "SSH",
      categoria: "linux-servicios",
      definicion: "Protocolo que facilita comunicaciones seguras entre dos sistemas con arquitectura cliente/servidor, encriptando la sesión.",
      ejemplo: "«ssh usuario@192.168.1.10» abre una sesión remota; el servidor se instala con «dnf install openssh-server»."
    },
    {
      termino: "Apache (httpd)",
      categoria: "linux-servicios",
      definicion: "Servidor web HTTP de código abierto que implementa HTTP/1.1 y la noción de sitio virtual. En Fedora el paquete se llama httpd.",
      ejemplo: "«dnf install httpd php» instala el servidor y el módulo de PHP."
    },
    {
      termino: "Puerto",
      categoria: "linux-servicios",
      definicion: "Número que identifica un servicio dentro de un host. HTTP usa el 80, HTTPS el 443, SSH el 22 y PostgreSQL el 5432.",
      ejemplo: "«netstat -ant | grep 22» verifica que SSH escucha en su puerto."
    },
    {
      termino: "/var/www/html",
      categoria: "linux-servicios",
      definicion: "Directorio de publicación de Apache en Fedora: los archivos que se colocan ahí se sirven como sitio web.",
      ejemplo: "«nano /var/www/html/phpinfo.php» crea un archivo de prueba accesible desde el navegador."
    },
    {
      termino: "/etc/resolv.conf",
      categoria: "linux-servicios",
      definicion: "Archivo de Linux que define los servidores DNS del sistema con líneas «nameserver».",
      ejemplo: "«nameserver 8.8.8.8» configura el DNS de Google."
    },
    {
      termino: "chroot",
      categoria: "linux-servicios",
      definicion: "Comando que cambia la raíz aparente de un proceso, usado en modo de rescate para trabajar sobre la partición del sistema.",
      ejemplo: "«chroot /mnt/sysroot» monta la partición y permite cambiar la contraseña de root con «passwd»."
    },
    {
      termino: "PostgreSQL",
      categoria: "linux-servicios",
      definicion: "Motor de bases de datos relacional de código abierto. Se inicializa con «postgresql-setup --initdb» y se administra con «psql».",
      ejemplo: "«su postgres» y «psql» abren la consola; «\\q» sale de ella."
    },
    {
      termino: "Dirección IPv4",
      categoria: "redes-ip",
      definicion: "Identificador de 32 bits de un host en una red, escrito como cuatro octetos separados por puntos.",
      ejemplo: "192.168.1.10 es una dirección IPv4 privada."
    },
    {
      termino: "Máscara de subred",
      categoria: "redes-ip",
      definicion: "Valor de 32 bits que indica qué parte de la dirección IP es de red y cuál de host.",
      ejemplo: "255.255.255.0 equivale a /24: los tres primeros octetos son de red."
    },
    {
      termino: "CIDR",
      categoria: "redes-ip",
      definicion: "Notación que escribe una red como IP/prefijo, donde el prefijo es el número de bits de red.",
      ejemplo: "192.168.1.0/24 = 255.255.255.0."
    },
    {
      termino: "Subnetting",
      categoria: "redes-ip",
      definicion: "División de una red grande en subredes más pequeñas tomando bits de la parte de host.",
      ejemplo: "De una /24 a /26 se toman 2 bits y se obtienen 4 subredes."
    },
    {
      termino: "VLSM",
      categoria: "redes-ip",
      definicion: "Subnetting de longitud variable: cada subred recibe solo las direcciones que necesita, con máscaras distintas.",
      ejemplo: "Subredes de 60, 30 y 10 hosts usan /26, /27 y /28."
    },
    {
      termino: "Broadcast",
      categoria: "redes-ip",
      definicion: "Última dirección de una subred, usada para enviar un paquete a todos los hosts de esa subred.",
      ejemplo: "En 192.168.1.0/24 el broadcast es 192.168.1.255."
    },
    {
      termino: "Direcciones privadas (RFC 1918)",
      categoria: "redes-ip",
      definicion: "Rangos reservados para redes locales que no se enrutan por internet: 10.0.0.0/8, 172.16.0.0/12 y 192.168.0.0/16.",
      ejemplo: "192.168.1.10 es privada; 8.8.8.8 es pública."
    },
    {
      termino: "Longest prefix match",
      categoria: "redes-ip",
      definicion: "Regla de enrutamiento: cuando varias rutas coinciden, se elige la del prefijo más largo (la más específica).",
      ejemplo: "Una /32 prevalece sobre una /24 para el mismo destino."
    },
    {
      termino: "Gateway por defecto",
      categoria: "redes-routing",
      definicion: "Interfaz del router en la red local del host. Todo paquete con destino fuera de la subred se envía ahí.",
      ejemplo: "En 192.168.1.0/24 el gateway suele ser 192.168.1.1."
    },
    {
      termino: "Tabla de enrutamiento",
      categoria: "redes-routing",
      definicion: "Conjunto de rutas que el router usa para decidir a dónde enviar cada paquete.",
      ejemplo: "«ip route» en Linux y «show ip route» en Cisco IOS."
    },
    {
      termino: "Ruta estática",
      categoria: "redes-routing",
      definicion: "Ruta configurada a mano por el administrador, a diferencia de las rutas dinámicas que se aprenden con protocolos.",
      ejemplo: "«ip route add 10.0.0.0/8 via 192.168.1.1»."
    },
    {
      termino: "Next-hop",
      categoria: "redes-routing",
      definicion: "IP del siguiente router al que se entrega el paquete para llegar al destino.",
      ejemplo: "Cada router reenvía al siguiente next-hop hasta completar la ruta."
    },
    {
      termino: "DNS",
      categoria: "redes-routing",
      definicion: "Sistema que traduce nombres de dominio a direcciones IP.",
      ejemplo: "«nslookup www.ejemplo.com» devuelve la IP asociada."
    },
    {
      termino: "Registros A, CNAME, MX, NS",
      categoria: "redes-routing",
      definicion: "Tipos de registro DNS: A asocia nombre con IPv4, CNAME crea un alias, MX indica el servidor de correo y NS el servidor de nombres.",
      ejemplo: "Un registro A de www.ejemplo.com apunta a 203.0.113.10."
    },
    {
      termino: "NAT / PAT",
      categoria: "redes-routing",
      definicion: "Traducción de direcciones: NAT cambia IP privadas por una pública; PAT usa el puerto para distinguir varios equipos.",
      ejemplo: "El router de casa hace PAT: todos los equipos salen con la misma IP pública."
    },
    {
      termino: "Switch",
      categoria: "redes-switching",
      definicion: "Dispositivo de capa 2 que reenvía tramas solo al puerto de destino, aprendiendo direcciones MAC.",
      ejemplo: "A diferencia del hub, el switch no repite la trama a todos los puertos."
    },
    {
      termino: "VLAN",
      categoria: "redes-switching",
      definicion: "Red lógica independiente creada dentro de un mismo switch físico.",
      ejemplo: "Los puertos de la VLAN 10 no ven el tráfico de la VLAN 20."
    },
    {
      termino: "Trunk (802.1Q)",
      categoria: "redes-switching",
      definicion: "Enlace entre switches que transporta el tráfico de varias VLAN a la vez, etiquetando cada trama.",
      ejemplo: "Un puerto trunk conecta dos switches; un puerto access pertenece a una sola VLAN."
    },
    {
      termino: "STP",
      categoria: "redes-switching",
      definicion: "Protocolo que evita bucles entre switches bloqueando puertos redundantes y manteniendo una sola ruta activa.",
      ejemplo: "Si cae el enlace activo, STP despierta los puertos bloqueados."
    },
    {
      termino: "ARP",
      categoria: "redes-switching",
      definicion: "Protocolo que descubre la dirección MAC que corresponde a una IP de la red local.",
      ejemplo: "«arp -a» muestra la tabla ARP del equipo."
    },
    {
      termino: "ACL",
      categoria: "redes-switching",
      definicion: "Lista de reglas que permite o deniega tráfico según criterios como IP, protocolo o puerto.",
      ejemplo: "Una ACL estándar filtra solo por IP de origen; una extendida también por destino y puerto."
    },
    {
      termino: "Wildcard mask",
      categoria: "redes-switching",
      definicion: "Máscara invertida usada en ACL de Cisco: 0 = el bit debe coincidir, 1 = no importa.",
      ejemplo: "0.0.0.255 coincide con cualquier host de una /24."
    }
  ],
  tips: [
    "En Linux, el símbolo «#» en el prompt indica sesión de root y «$» de usuario limitado.",
    "Para detener un ping en Linux se usa Ctrl + C.",
    "«man comando» abre la ayuda de cualquier comando; «history» lista los usados.",
    "En subnetting, la fórmula clave es: hosts útiles = 2^n - 2, donde n son los bits de host.",
    "Antes de diagnosticar una red, empieza por lo físico: cable y luces del puerto.",
    "«ip route» muestra las rutas en Linux; «show ip route» en Cisco IOS."
  ]
};

export default glosario;
