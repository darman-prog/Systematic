// Banco de preguntas de Infraestructura (Linux).
// Preguntas autocontenidas: todo lo necesario para responder está en el enunciado.
//
// ============================================================================
// BLOQUE LINUX — empieza en INF-001 y termina en INF-059
// Contenido derivado de los manuales de la cátedra (BancoDeInformacion/Infraestructura/*.md),
// convertidos con markitdown y verificados contra el material original.
// ============================================================================
const preguntas = [
  {
    id: "INF-001",
    parcial: "Linux",
    tema: "Linux: máquina virtual e instalación",
    dificultad: "facil",
    tipo: "multiple",
    q: "Para instalar Fedora Server en VirtualBox sobre un procesador de arquitectura x64, ¿qué se debe verificar primero en la BIOS del equipo anfitrión?",
    options: [
      "Que el disco duro tenga al menos 80 GB de espacio",
      "Que esté activada la opción de virtualización del procesador",
      "Que la máquina tenga 4 GB de memoria RAM",
      "Que el adaptador de red esté configurado en modo NAT"
    ],
    correct: 1,
    exp: "<b>Virtualización activada en la BIOS.</b> El manual arranca por verificar que la opción de virtualización del procesador (VT-x/AMD-V) esté activada en la BIOS; sin ella VirtualBox no puede ejecutar un sistema operativo de 64 bits. Lo demás (disco, RAM, NAT) se configura dentro de la máquina virtual, no en la BIOS."
  },
  {
    id: "INF-002",
    parcial: "Linux",
    tema: "Linux: máquina virtual e instalación",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué tamaño de memoria RAM asigna el manual a la máquina virtual de Fedora Server?",
    options: ["256 MB", "512 MB", "1024 MB", "2048 MB"],
    correct: 2,
    exp: "El manual asigna <b>1024 MB</b>, un valor suficiente para una instalación mínima sin entorno gráfico. Aconseja además que la RAM de la máquina anfitriona sea lo bastante grande como para que funcionen bien la máquina real y la virtual a la vez."
  },
  {
    id: "INF-003",
    parcial: "Linux",
    tema: "Linux: máquina virtual e instalación",
    dificultad: "facil",
    tipo: "multiple",
    q: "En VirtualBox, ¿qué formato de disco duro virtual se selecciona en el paso 5 del manual?",
    options: ["VMDK", "VDI", "VHD", "QCOW2"],
    correct: 1,
    exp: "El manual selecciona <b>VDI</b> (Virtual Disk Image), el formato nativo de VirtualBox. VMDK es de VMware, VHD de Hyper-V y QCOW2 de QEMU/KVM."
  },
  {
    id: "INF-004",
    parcial: "Linux",
    tema: "Linux: máquina virtual e instalación",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué tamaño y qué tipo de crecimiento tiene el disco virtual creado en el manual?",
    options: [
      "80 GB con crecimiento dinámico",
      "40 GB de tamaño fijo",
      "80 GB de tamaño fijo",
      "20 GB con crecimiento dinámico"
    ],
    correct: 0,
    exp: "<b>80 GB de crecimiento dinámico.</b> El disco empieza pequeño y se va ajustando durante la instalación según se usa, en lugar de reservar los 80 GB desde el inicio (tamaño fijo). 80 GB es suficiente para la mayoría de los sistemas operativos."
  },
  {
    id: "INF-005",
    parcial: "Linux",
    tema: "Linux: máquina virtual e instalación",
    dificultad: "media",
    tipo: "multiple",
    q: "En el paso 12 del manual se configura la tarjeta de red en modo NAT. ¿Qué significa esto para la máquina virtual?",
    options: [
      "Obtiene una IP en un rango distinto al de la máquina real, asignada dinámicamente por DHCP",
      "Recibe la misma IP que el equipo anfitrón",
      "Queda aislada: no puede comunicarse con el anfitrón ni con internet",
      "Debe configurarse la IP a mano con ifconfig antes de arrancar"
    ],
    correct: 0,
    exp: "<b>NAT (Network Address Translation).</b> La máquina virtual sale a internet a través del anfitrón con una IP en un rango diferente, asignada por DHCP. No recibe la misma IP, no queda aislada y no hace falta configurar la IP a mano."
  },
  {
    id: "INF-006",
    parcial: "Linux",
    tema: "Linux: comandos básicos",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué comando muestra el directorio actual de trabajo en Linux?",
    options: ["pwd", "ls", "who", "arch"],
    correct: 0,
    exp: "<b>pwd</b> (print working directory) imprime la ruta completa del directorio en el que estás parado. «ls» lista el contenido del directorio, «who» muestra los usuarios conectados y «arch» la arquitectura del procesador."
  },
  {
    id: "INF-007",
    parcial: "Linux",
    tema: "Linux: comandos básicos",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué comando muestra la versión del kernel que está usando el sistema?",
    options: ["uname -r", "cat /proc/cpuinfo", "dmidecode -q", "arch"],
    correct: 0,
    exp: "<b>uname -r</b> imprime la versión del kernel. «cat /proc/cpuinfo» muestra información del procesador, «dmidecode -q» el hardware del sistema y «arch» solo la arquitectura (64 o 32 bits)."
  },
  {
    id: "INF-008",
    parcial: "Linux",
    tema: "Linux: comandos básicos",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué comando muestra el menú de ayuda sobre un comando concreto?",
    options: ["help", "man", "info --help", "whatis"],
    correct: 1,
    exp: "<b>man comando</b> abre la página del manual de ese comando (por ejemplo «man rm»). «whatis» solo da una línea descriptiva y «help» es interno del shell, no sirve para cualquier comando."
  },
  {
    id: "INF-009",
    parcial: "Linux",
    tema: "Linux: comandos básicos",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué comando lista también los ficheros ocultos de un directorio?",
    options: ["ls -l", "ls -a", "ls -t", "ls -R"],
    correct: 1,
    exp: "<b>ls -a</b> muestra todos los ficheros, incluidos los ocultos (los que empiezan con punto, como .bashrc). «ls -l» da el formato largo, «ls -t» ordena por fecha y «ls -R» lista subdirectorios de forma recursiva."
  },
  {
    id: "INF-010",
    parcial: "Linux",
    tema: "Linux: comandos básicos",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Cuál de estos comandos apaga el sistema?",
    options: ["init 6", "reboot", "logout", "shutdown -h now"],
    correct: 3,
    exp: "<b>shutdown -h now</b> apaga el sistema (-h = halt). «init 6» y «reboot» lo reinician, y «logout» solo cierra la sesión del usuario actual."
  },
  {
    id: "INF-011",
    parcial: "Linux",
    tema: "Linux: comandos básicos",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué comando reinicia el sistema?",
    options: ["init 0", "halt", "reboot", "shutdown -h now"],
    correct: 2,
    exp: "<b>reboot</b> reinicia el sistema. «init 0» y «shutdown -h now» lo apagan, y «halt» detiene la máquina (apagado sin reinicio)."
  },
  {
    id: "INF-012",
    parcial: "Linux",
    tema: "Linux: comandos básicos",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué comando muestra todos los procesos en ejecución con su identificador (PID)?",
    options: ["ps -A", "top -n 1", "free", "who -u"],
    correct: 0,
    exp: "<b>ps -A</b> lista todos los procesos con su PID. «top» es una vista interactiva en vivo («top -n 1» la limita a una pasada), «free» muestra la memoria y «who -u» los usuarios conectados."
  },
  {
    id: "INF-013",
    parcial: "Linux",
    tema: "Linux: comandos básicos",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué comando muestra el espacio libre en memoria?",
    options: ["df -h", "du /home -h", "free", "uptime"],
    correct: 2,
    exp: "<b>free</b> muestra la memoria total, usada y libre (RAM y swap). «df -h» es espacio en disco, «du -h» el tamaño de directorios y «uptime» cuánto tiempo lleva encendido el sistema."
  },
  {
    id: "INF-014",
    parcial: "Linux",
    tema: "Linux: comandos básicos",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué comando muestra el listado de comandos que se han utilizado en la sesión?",
    options: ["history", "last", "who -u", "ls"],
    correct: 0,
    exp: "<b>history</b> lista los comandos ejecutados en la sesión actual. «last» muestra los accesos al sistema, «who -u» los usuarios conectados y «ls» el contenido del directorio."
  },
  {
    id: "INF-015",
    parcial: "Linux",
    tema: "Linux: comandos básicos",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué comando muestra el contenido de un fichero de texto desde la primera línea?",
    options: ["cat", "head -n 5", "tail", "grep"],
    correct: 0,
    exp: "<b>cat nombrearchivo</b> vuelca el contenido completo del fichero por la salida estándar. «head» y «tail» muestran solo el principio o el final, y «grep» filtra líneas por un patrón."
  },
  {
    id: "INF-016",
    parcial: "Linux",
    tema: "Linux: archivos y directorios",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué comando permite crear dos carpetas al mismo tiempo?",
    options: ["mkdir cp1 cp2", "mkdir -p cp1 cp2", "touch cp1 cp2", "cp cp1 cp2"],
    correct: 0,
    exp: "<b>mkdir</b> acepta varios nombres en una sola línea: «mkdir cp1 cp2» crea las dos. «touch» crea ficheros vacíos, no carpetas, y «cp» copia lo que ya existe."
  },
  {
    id: "INF-017",
    parcial: "Linux",
    tema: "Linux: archivos y directorios",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué comando elimina un directorio especificado y todo su contenido?",
    options: ["rmdir", "rm -r -f -v", "mv", "shred -u"],
    correct: 1,
    exp: "<b>rm -r -f -v</b> borra recursivamente (-r) sin pedir confirmación (-f) y mostrando lo que elimina (-v). «rmdir» solo funciona con directorios vacíos, «mv» mueve o renombra, y «shred -u» borra un fichero de forma segura (no el directorio con todo su contenido de forma sencilla)."
  },
  {
    id: "INF-018",
    parcial: "Linux",
    tema: "Linux: archivos y directorios",
    dificultad: "media",
    tipo: "dragdrop",
    q: "Arrastra el comando que muestra el contenido del fichero tareas.txt:",
    piezas: ["cat", "ls", "echo", "grep"],
    respuestas: ["cat"],
    codigo: "{1} tareas.txt",
    exp: "<b>cat</b> concatena y muestra el contenido del fichero: «cat tareas.txt». «ls» lista el directorio, «echo» imprime texto por pantalla y «grep» busca patrones dentro de un fichero."
  },
  {
    id: "INF-019",
    parcial: "Linux",
    tema: "Linux: usuarios y grupos",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué comando añade un usuario indicando en la misma línea el grupo principal, la carpeta home, si se debe crear dicha carpeta y el intérprete de comandos?",
    options: ["useradd", "usermod", "adduser --home", "passwd"],
    correct: 0,
    exp: "<b>useradd</b> crea el usuario con parámetros como «-g» (grupo principal), «-d» (carpeta home), «-m» (crear la carpeta home) y «-s» (shell). «usermod» modifica un usuario que ya existe y «passwd» solo cambia la contraseña."
  },
  {
    id: "INF-020",
    parcial: "Linux",
    tema: "Linux: usuarios y grupos",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué comando permite añadir un grupo al sistema?",
    options: ["groupadd", "useradd -g", "addgroup", "groupmod"],
    correct: 0,
    exp: "<b>groupadd nombre-grupo</b> crea el grupo. «groupmod» modifica un grupo existente (nombre o GID), y «useradd -g» solo asigna el grupo principal al crear un usuario."
  },
  {
    id: "INF-021",
    parcial: "Linux",
    tema: "Linux: usuarios y grupos",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿En qué archivo se guarda la información de los usuarios del sistema (nombre, UID, GID, carpeta home y shell)?",
    options: ["/etc/passwd", "/etc/shadow", "/etc/group", "/etc/users"],
    correct: 0,
    exp: "<b>/etc/passwd</b> guarda por usuario: nombre de cuenta, campo de clave («x»), UID, GID, nombre, carpeta home y shell. «/etc/shadow» guarda las contraseñas cifradas y «/etc/group» los grupos."
  },
  {
    id: "INF-022",
    parcial: "Linux",
    tema: "Linux: usuarios y grupos",
    dificultad: "media",
    tipo: "multiple",
    q: "¿En qué archivo se guardan las contraseñas cifradas de los usuarios?",
    options: ["/etc/shadow", "/etc/passwd", "/etc/gshadow", "/etc/keys"],
    correct: 0,
    exp: "<b>/etc/shadow</b> guarda las contraseñas cifradas. En /etc/passwd el campo de clave quedó como «x»: las contraseñas reales se movieron a shadow por seguridad."
  },
  {
    id: "INF-023",
    parcial: "Linux",
    tema: "Linux: usuarios y grupos",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué comando permite modificar un usuario cambiando su nombre, carpeta home, intérprete de comandos o los grupos a los que pertenece?",
    options: ["usermod", "useradd", "chpasswd", "userdel"],
    correct: 0,
    exp: "<b>usermod</b> modifica usuarios existentes: «-l» cambia el nombre, «-d» la carpeta home, «-s» el shell y «-g» el grupo principal. «useradd» crea usuarios nuevos."
  },
  {
    id: "INF-024",
    parcial: "Linux",
    tema: "Linux: usuarios y grupos",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué hace el comando «userdel -r nombre-usuario»?",
    options: [
      "Elimina el usuario y también su carpeta home",
      "Elimina solo la carpeta home, conservando la cuenta",
      "Restablece la contraseña del usuario",
      "Renueva los permisos de la cuenta"
    ],
    correct: 0,
    exp: "<b>userdel -r</b> elimina la cuenta y, con «-r», también su carpeta home. Sin la opción «-r» solo se borra la cuenta y la carpeta home queda en disco."
  },
  {
    id: "INF-025",
    parcial: "Linux",
    tema: "Linux: usuarios y grupos",
    dificultad: "media",
    tipo: "multiple",
    q: "Se tiene un usuario «sunombre» cuyo grupo principal es «mycatedra». ¿Qué comando cambia su grupo principal a «sistemas»?",
    options: ["usermod -g sistemas sunombre", "groupmod -g sistemas sunombre", "usermod -l sistemas sunombre", "chgrp sistemas sunombre"],
    correct: 0,
    exp: "<b>usermod -g sistemas sunombre</b> cambia el grupo principal del usuario. «groupmod» modifica grupos (no asigna usuarios), «usermod -l» cambia el nombre de la cuenta y «chgrp» cambia el grupo propietario de un archivo."
  },
  {
    id: "INF-026",
    parcial: "Linux",
    tema: "Linux: permisos de archivos y directorios",
    dificultad: "facil",
    tipo: "multiple",
    q: "En Linux, ¿a qué tres tipos de usuarios se aplican los permisos de un archivo o directorio?",
    options: [
      "Propietario, grupo propietario y resto de usuarios",
      "Administrador, usuarios e invitados",
      "Creador, lectores y ejecutores",
      "Dueño, propietario y público"
    ],
    correct: 0,
    exp: "Los tres niveles son <b>propietario</b> (dueño del archivo), <b>grupo propietario</b> (el grupo al que pertenece el archivo) y <b>otros</b> (el resto de usuarios del sistema). Linux no permite asignar permisos a usuarios o grupos concretos fuera de estos tres niveles."
  },
  {
    id: "INF-027",
    parcial: "Linux",
    tema: "Linux: permisos de archivos y directorios",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué permiso simboliza la letra «r» en un archivo de Linux?",
    options: ["Lectura", "Escritura", "Ejecución", "Propiedad"],
    correct: 0,
    exp: "«r» es <b>lectura</b> (read): permite ver el contenido del archivo, o listar el contenido de un directorio. «w» es escritura y «x» ejecución."
  },
  {
    id: "INF-028",
    parcial: "Linux",
    tema: "Linux: permisos de archivos y directorios",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué permiso simboliza la letra «w» en un archivo de Linux?",
    options: ["Escritura", "Lectura", "Ejecución", "Borrar"],
    correct: 0,
    exp: "«w» es <b>escritura</b> (write): permite modificar el contenido del archivo o, en un directorio, crear y eliminar archivos dentro de él."
  },
  {
    id: "INF-029",
    parcial: "Linux",
    tema: "Linux: permisos de archivos y directorios",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué permiso simboliza la letra «x» en un archivo de Linux?",
    options: ["Ejecución", "Lectura", "Escritura", "Expansión"],
    correct: 0,
    exp: "«x» es <b>ejecución</b> (eXecute): permite ejecutar el archivo como programa. En un directorio, el permiso «x» permite entrar en él con «cd»."
  },
  {
    id: "INF-030",
    parcial: "Linux",
    tema: "Linux: permisos de archivos y directorios",
    dificultad: "media",
    tipo: "multiple",
    q: "En formato octal, ¿qué valor tiene la combinación «rwx»?",
    options: ["7", "6", "5", "8"],
    correct: 0,
    exp: "<b>rwx = 7</b> porque r=4, w=2 y x=1, y 4+2+1=7. Es la combinación de permisos completa: lectura, escritura y ejecución."
  },
  {
    id: "INF-031",
    parcial: "Linux",
    tema: "Linux: permisos de archivos y directorios",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué comando se usa para cambiar los permisos de un archivo o directorio?",
    options: ["chmod", "chown", "chgrp", "chattr"],
    correct: 0,
    exp: "<b>chmod</b> (change mode) cambia los permisos. «chown» cambia el propietario, «chgrp» el grupo propietario y «chattr» atributos extendidos."
  },
  {
    id: "INF-032",
    parcial: "Linux",
    tema: "Linux: permisos de archivos y directorios",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué hace el comando «chmod u+x archivo»?",
    options: [
      "Da permiso de ejecución al propietario del archivo",
      "Quita el permiso de ejecución a todos los usuarios",
      "Da permiso de ejecución a todos los usuarios",
      "Quita el permiso de escritura al grupo"
    ],
    correct: 0,
    exp: "<b>u+x</b> añade (+) el permiso de ejecución (x) al propietario (u). Sin la letra de usuario se afectarían todos los usuarios simultáneamente."
  },
  {
    id: "INF-033",
    parcial: "Linux",
    tema: "Linux: permisos de archivos y directorios",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué comando cambia el usuario propietario de un archivo?",
    options: ["chown", "chgrp", "chmod", "usermod"],
    correct: 0,
    exp: "<b>chown nuevopropietario archivo</b> cambia el propietario. «chgrp» cambia el grupo propietario, «chmod» los permisos y «usermod» datos de la cuenta de usuario."
  },
  {
    id: "INF-034",
    parcial: "Linux",
    tema: "Linux: empaquetamiento y compresión",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué comando agrupa varios archivos o directorios en un solo archivo (empaqueta)?",
    options: ["tar", "zip -r", "gzip", "cp"],
    correct: 0,
    exp: "<b>tar</b> empaqueta: «tar cvf destino.tar carpeta» agrupa sin comprimir. «zip» también agrupa y comprime, «gzip» solo comprime archivos sueltos y «cp» copia."
  },
  {
    id: "INF-035",
    parcial: "Linux",
    tema: "Linux: empaquetamiento y compresión",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué sintaxis de tar crea un archivo empaquetado y comprimido con gzip (.tar.gz)?",
    options: ["tar czvf", "tar cvf", "tar jcvf", "tar xzvf"],
    correct: 0,
    exp: "<b>tar czvf</b> crea (c) y comprime con gzip (z). «tar jcvf» usa bzip2, «tar cvf» solo empaqueta sin comprimir y «tar xzvf» extrae y descomprime un .tar.gz."
  },
  {
    id: "INF-036",
    parcial: "Linux",
    tema: "Linux: empaquetamiento y compresión",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué sintaxis de tar extrae y descomprime un archivo .tar.bz2?",
    options: ["tar jxvf", "tar czvf", "tar tzvf", "tar xvf"],
    correct: 0,
    exp: "<b>tar jxvf</b> extrae (x) y descomprime con bzip2 (j). «tar czvf» y «tar jcvf» crean, «tar tzvf» lista el contenido de un .tar.gz y «tar xvf» extrae sin descomprimir."
  },
  {
    id: "INF-037",
    parcial: "Linux",
    tema: "Linux: empaquetamiento y compresión",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué sintaxis de zip comprime un directorio y pide una contraseña al crear el archivo?",
    options: ["zip -e", "zip -r", "zip -p", "unzip -e"],
    correct: 0,
    exp: "<b>zip -e</b> pide una contraseña al crear el archivo comprimido. «zip -r» es recursivo (necesario para directorios), pero no pide contraseña; «unzip» descomprime."
  },
  {
    id: "INF-038",
    parcial: "Linux",
    tema: "Linux: empaquetamiento y compresión",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué comando descomprime un archivo .zip?",
    options: ["unzip", "gzip -d", "tar -d", "zip -u"],
    correct: 0,
    exp: "<b>unzip archivo.zip</b> descomprime. «gzip -d» descomprime archivos .gz, «zip -u» actualiza un .zip existente y «tar -d» compara diferencias."
  },
  {
    id: "INF-039",
    parcial: "Linux",
    tema: "Linux: scripts bash",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué es un script en Linux?",
    options: [
      "Un archivo que contiene un conjunto de comandos ejecutados de forma secuencial",
      "Un programa compilado en lenguaje C",
      "Un archivo de configuración del sistema",
      "Un comando que solo puede ejecutar root"
    ],
    correct: 0,
    exp: "Un <b>script</b> es un archivo con un conjunto de comandos que se ejecutan desde el primero hasta el último de forma secuencial. Se crea con «touch» o un editor como «nano» y se le agrega la extensión «.sh»."
  },
  {
    id: "INF-040",
    parcial: "Linux",
    tema: "Linux: scripts bash",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué se coloca como primera línea de un script para indicarle al sistema que es un script y qué shell debe usar?",
    options: ["#! /bin/bash", "#!/bin/sh", "# script bash", "#!/usr/bin/env"],
    correct: 0,
    exp: "La primera línea es el <b>shebang</b>: «#! /bin/bash». El «#!» indica al sistema que lo que sigue son instrucciones de comando, y «/bin/bash» indica el shell que ejecutará el script."
  },
  {
    id: "INF-041",
    parcial: "Linux",
    tema: "Linux: scripts bash",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué comando se usa para dar permisos de ejecución a un script?",
    options: ["chmod", "chown", "chgrp", "chattr"],
    correct: 0,
    exp: "<b>chmod</b> da los permisos de ejecución (por ejemplo «chmod 755 script.sh»). Sin el permiso «x» el script no se puede ejecutar, aunque exista."
  },
  {
    id: "INF-042",
    parcial: "Linux",
    tema: "Linux: scripts bash",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Cómo se ejecuta un script que está en el directorio actual?",
    options: ["./script.sh", "bash script.sh", "exec script.sh", "run script.sh"],
    correct: 0,
    exp: "<b>./script.sh</b> lo ejecuta indicando la ruta relativa. El «./» es necesario porque el directorio actual no está en el PATH; «bash script.sh» también funciona pero no requiere el permiso de ejecución."
  },
  {
    id: "INF-043",
    parcial: "Linux",
    tema: "Linux: scripts bash",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué símbolo se usa para agregar comentarios en un script bash?",
    options: ["#", "//", "/*", "--"],
    correct: 0,
    exp: "El símbolo <b>#</b> marca comentarios en bash. Todo lo que sigue en esa línea se ignora al ejecutar el script."
  },
  {
    id: "INF-044",
    parcial: "Linux",
    tema: "Linux: scripts bash",
    dificultad: "media",
    tipo: "multiple",
    q: "En el ejemplo del manual, el script «prueba.sh» crea una carpeta «documentos» en /root, dentro de ella otra llamada «prueba» y un texto «tareas.txt». ¿Qué comando introduce el texto «hola mundo» en ese archivo?",
    options: ["echo 'hola mundo' > /root/documentos/prueba/tareas.txt", "cat 'hola mundo' > tareas.txt", "touch /root/documentos/prueba/tareas.txt", "nano 'hola mundo' tareas.txt"],
    correct: 0,
    exp: "<b>echo 'hola mundo' > archivo</b> escribe el texto en el archivo (el «>» redirige la salida). «touch» solo crea el archivo vacío, «cat» lee y «nano» abre el editor."
  },
  {
    id: "INF-045",
    parcial: "Linux",
    tema: "Linux: SSH",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué paquete se instala en Fedora para disponer del servicio SSH?",
    options: ["openssh-server", "openssh-client", "ssh-service", "sshd-config"],
    correct: 0,
    exp: "<b>dnf -y install openssh-server</b> instala el servidor SSH. El cliente («ssh») suele venir instalado; el servidor es el que acepta conexiones entrantes."
  },
  {
    id: "INF-046",
    parcial: "Linux",
    tema: "Linux: SSH",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿En qué archivo se encuentra la configuración del servicio SSH?",
    options: ["/etc/ssh/sshd_config", "/etc/ssh/ssh_config", "/etc/sshd.conf", "/var/ssh/config"],
    correct: 0,
    exp: "<b>/etc/ssh/sshd_config</b> es el archivo de configuración del demonio SSH (sshd). Ahí se editan opciones como «PermitRootLogin»."
  },
  {
    id: "INF-047",
    parcial: "Linux",
    tema: "Linux: SSH",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué directiva del archivo de configuración de SSH se debe editar para permitir que root inicie sesión por SSH?",
    options: ["PermitRootLogin yes", "RootLogin yes", "AllowRoot yes", "LoginRoot yes"],
    correct: 0,
    exp: "<b>PermitRootLogin yes</b> permite el acceso de root por SSH. La directiva viene comentada por defecto; hay que quitarle el «#» y poner «yes»."
  },
  {
    id: "INF-048",
    parcial: "Linux",
    tema: "Linux: SSH",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué comandos inician el servicio SSH y lo activan para que arranque con el sistema?",
    options: [
      "systemctl start sshd.service y systemctl enable sshd.service",
      "systemctl stop sshd.service y systemctl disable sshd.service",
      "systemctl status sshd.service y systemctl reload sshd.service",
      "systemctl restart sshd.service y systemctl mask sshd.service"
    ],
    correct: 0,
    exp: "<b>systemctl start</b> inicia el servicio y <b>systemctl enable</b> lo activa para los siguientes arranques. «stop» lo frena, «status» lo consulta y «restart» lo reinicia."
  },
  {
    id: "INF-049",
    parcial: "Linux",
    tema: "Linux: SSH",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué comando verifica que el puerto 22 (el de SSH) está activo y escuchando?",
    options: ["netstat -ant | grep 22", "ping 22", "ssh -p 22 localhost", "systemctl port 22"],
    correct: 0,
    exp: "<b>netstat -ant | grep 22</b> filtra las conexiones TCP activas por el puerto 22. «ping» prueba conectividad de red, no puertos, y «systemctl» no tiene subcomando «port»."
  },
  {
    id: "INF-050",
    parcial: "Linux",
    tema: "Linux: arranque y recuperación de root",
    dificultad: "facil",
    tipo: "multiple",
    q: "Para recuperar la contraseña de root desde el ISO de instalación, ¿qué opciones se seleccionan en el menú de arranque?",
    options: [
      "Troubleshooting y luego Rescue a Fedora System",
      "Install Fedora y luego Troubleshooting",
      "Rescue a Fedora System y luego Install Fedora",
      "Boot y luego Recovery Mode"
    ],
    correct: 0,
    exp: "Se arranca desde el ISO, se elige <b>Troubleshooting</b> y luego <b>Rescue a Fedora System</b>. Desde ahí se accede al shell de recuperación."
  },
  {
    id: "INF-051",
    parcial: "Linux",
    tema: "Linux: arranque y recuperación de root",
    dificultad: "media",
    tipo: "multiple",
    q: "En el modo de rescate, ¿qué comando monta la partición del sistema para poder cambiar la contraseña de root?",
    options: ["chroot /mnt/sysroot", "mount /dev/sda1", "passwd /mnt/sysroot", "rescue --chroot"],
    correct: 0,
    exp: "<b>chroot /mnt/sysroot</b> monta la partición del sistema en /mnt/sysroot y permite trabajar sobre ella. Después se ejecuta «passwd» para asignar la nueva contraseña."
  },
  {
    id: "INF-052",
    parcial: "Linux",
    tema: "Linux: arranque y recuperación de root",
    dificultad: "facil",
    tipo: "multiple",
    q: "Una vez dentro del sistema montado en el modo de rescate, ¿qué comando asigna la nueva contraseña de root?",
    options: ["passwd", "chpasswd", "usermod -p", "password"],
    correct: 0,
    exp: "<b>passwd</b> pide la nueva contraseña dos veces y la asigna. Al terminar aparece el aviso de que todos los tokens de autenticación se actualizaron correctamente."
  },
  {
    id: "INF-053",
    parcial: "Linux",
    tema: "Linux: HTTP y servidores",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué paquete instala el servidor web Apache en Fedora?",
    options: ["httpd", "apache2", "nginx", "php-fpm"],
    correct: 0,
    exp: "<b>dnf install httpd</b> instala Apache en Fedora. En Debian/Ubuntu el paquete se llama «apache2», pero en Fedora es «httpd»."
  },
  {
    id: "INF-054",
    parcial: "Linux",
    tema: "Linux: HTTP y servidores",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿En qué puerto escucha el servidor Apache por defecto?",
    options: ["80", "22", "443", "8080"],
    correct: 0,
    exp: "Apache escucha en el <b>puerto 80</b> (HTTP) por defecto. El 22 es SSH, el 443 es HTTPS y el 8080 se usa a menudo como alternativo cuando el 80 está ocupado."
  },
  {
    id: "INF-055",
    parcial: "Linux",
    tema: "Linux: HTTP y servidores",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿En qué directorio se alojan los sitios web que publica Apache en Fedora?",
    options: ["/var/www/html", "/etc/httpd", "/srv/www", "/home/httpd"],
    correct: 0,
    exp: "<b>/var/www/html</b> es el directorio de publicación. Ahí se colocan los archivos del sitio (por ejemplo «phpinfo.php») para que Apache los sirva."
  },
  {
    id: "INF-056",
    parcial: "Linux",
    tema: "Linux: HTTP y servidores",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué comandos de systemctl inician, verifican el estado y reinician el servicio httpd?",
    options: [
      "start, status y restart",
      "enable, start y stop",
      "status, reload y mask",
      "restart, disable y stop"
    ],
    correct: 0,
    exp: "<b>systemctl start httpd.service</b> lo inicia, <b>systemctl status httpd.service</b> verifica que corra y <b>systemctl restart httpd.service</b> lo reinicia para que tome los cambios de configuración."
  },
  {
    id: "INF-057",
    parcial: "Linux",
    tema: "Linux: bases de datos",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué comando inicializa la base de datos PostgreSQL después de instalar el paquete?",
    options: ["postgresql-setup --initdb", "psql --init", "systemctl initdb", "postgres --setup"],
    correct: 0,
    exp: "<b>postgresql-setup --initdb</b> inicializa el clúster de datos de PostgreSQL. Después se inicia el servicio con «systemctl start postgresql.service»."
  },
  {
    id: "INF-058",
    parcial: "Linux",
    tema: "Linux: bases de datos",
    dificultad: "media",
    tipo: "multiple",
    q: "Dentro de la consola psql, ¿qué comando cambia la contraseña de un usuario de PostgreSQL?",
    options: ["ALTER USER usuario WITH PASSWORD 'clave'", "SET PASSWORD usuario = 'clave'", "UPDATE pg_user SET password", "passwd usuario"],
    correct: 0,
    exp: "<b>ALTER USER postgres WITH PASSWORD 'clave';</b> cambia la contraseña dentro de psql. «passwd» es el comando del sistema operativo, no de PostgreSQL."
  },
  {
    id: "INF-059",
    parcial: "Linux",
    tema: "Linux: bases de datos",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué comando de psql se usa para salir de la consola?",
    options: ["\\q", "\\exit", "quit;", "exit"],
    correct: 0,
    exp: "<b>\\q</b> sale de la consola psql. Después se usa «exit» para volver a la consola de Fedora."
  }
];

// ============================================================================
// BLOQUE LINUX — termina en INF-059
// ============================================================================

// ============================================================================
// BLOQUE REDES — empieza en INF-060 y termina en INF-099
// Contenido generado (no hay manual de redes en la cátedra): subnetting, rutas,
// gateway y DNS. Revisar cada lote antes de commitear.
// ============================================================================
const preguntasRedes = [
  {
    id: "INF-060",
    parcial: "Redes",
    tema: "Redes: direcciones IP y máscaras",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Cuántas direcciones de host útiles tiene una red /24?",
    options: ["254", "255", "256", "253"],
    correct: 0,
    exp: "Una /24 tiene 256 direcciones en total; se reservan la primera (dirección de red) y la última (broadcast), quedan <b>254 hosts útiles</b>."
  },
  {
    id: "INF-061",
    parcial: "Redes",
    tema: "Redes: direcciones IP y máscaras",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué máscara de subred corresponde a la notación /24?",
    options: ["255.255.255.0", "255.255.0.0", "255.255.255.128", "255.0.0.0"],
    correct: 0,
    exp: "<b>/24 = 255.255.255.0</b>: los primeros 24 bits (tres octetos) son de red y el último octeto es de host."
  },
  {
    id: "INF-062",
    parcial: "Redes",
    tema: "Redes: direcciones IP y máscaras",
    dificultad: "media",
    tipo: "multiple",
    q: "En una red /24 como 192.168.1.0, ¿qué direcciones se reservan y no se asignan a hosts?",
    options: [
      "La .0 (red) y la .255 (broadcast)",
      "La .1 (gateway) y la .254 (último host)",
      "La .128 (mitad) y la .255 (broadcast)",
      "Ninguna: todas se pueden asignar"
    ],
    correct: 0,
    exp: "Se reservan la <b>dirección de red</b> (192.168.1.0) y la <b>dirección de broadcast</b> (192.168.1.255). Los hosts van de la .1 a la .254."
  },
  {
    id: "INF-063",
    parcial: "Redes",
    tema: "Redes: direcciones IP y máscaras",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuál de estas direcciones IPv4 es privada (RFC 1918)?",
    options: ["192.168.1.10", "8.8.8.8", "172.32.0.1", "203.0.113.5"],
    correct: 0,
    exp: "<b>192.168.1.10</b> es privada (rango 192.168.0.0/16). 8.8.8.8 es pública (DNS de Google), 172.32.0.1 es pública (el rango privado es 172.16.0.0/12) y 203.0.113.5 es pública."
  },
  {
    id: "INF-064",
    parcial: "Redes",
    tema: "Redes: direcciones IP y máscaras",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué es la dirección de broadcast de una subred?",
    options: [
      "La última dirección de la subred, usada para enviar un paquete a todos los hosts de esa subred",
      "La primera dirección de la subred, que identifica a la red",
      "La dirección del router que conecta con otras redes",
      "Una dirección que se asigna a un solo host de forma fija"
    ],
    correct: 0,
    exp: "El <b>broadcast</b> es la última dirección de la subred (por ejemplo .255 en una /24). Un paquete enviado ahí lo reciben todos los hosts de la subred."
  },
  {
    id: "INF-065",
    parcial: "Redes",
    tema: "Redes: direcciones IP y máscaras",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Cuántos bits tiene una dirección IPv4?",
    options: ["32", "16", "64", "128"],
    correct: 0,
    exp: "Una dirección IPv4 tiene <b>32 bits</b>, escritos como cuatro octetos separados por puntos (por ejemplo 192.168.1.10). IPv6 usa 128 bits."
  },
  {
    id: "INF-066",
    parcial: "Redes",
    tema: "Redes: subnetting y CIDR",
    dificultad: "facil",
    tipo: "multiple",
    q: "En la notación 192.168.1.0/26, ¿qué indica el número 26?",
    options: [
      "Que los primeros 26 bits de la dirección identifican la red",
      "Que la subred tiene 26 hosts útiles",
      "Que la máscara es 255.255.255.26",
      "Que es una red de clase B"
    ],
    correct: 0,
    exp: "El <b>/26</b> es la longitud del prefijo: los primeros 26 bits son de red y los 6 restantes son de host. No es el número de hosts ni un octeto de la máscara."
  },
  {
    id: "INF-067",
    parcial: "Redes",
    tema: "Redes: subnetting y CIDR",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuántos hosts útiles tiene una subred /26?",
    options: ["62", "64", "30", "126"],
    correct: 0,
    exp: "Una /26 deja 6 bits de host: 2^6 = 64 direcciones, menos la de red y la de broadcast = <b>62 hosts útiles</b>."
  },
  {
    id: "INF-068",
    parcial: "Redes",
    tema: "Redes: subnetting y CIDR",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuál es la máscara de subred de una /26?",
    options: ["255.255.255.192", "255.255.255.128", "255.255.255.224", "255.255.255.240"],
    correct: 0,
    exp: "<b>/26 = 255.255.255.192</b>: 26 bits de red = 11111111.11111111.11111111.11000000. La /25 es .128, la /27 es .224 y la /28 es .240."
  },
  {
    id: "INF-069",
    parcial: "Redes",
    tema: "Redes: subnetting y CIDR",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuántas subredes /26 se pueden crear a partir de una red /24?",
    options: ["4", "2", "8", "16"],
    correct: 0,
    exp: "De /24 a /26 se toman 2 bits de la parte de host: 2^2 = <b>4 subredes</b> (.0, .64, .128 y .192)."
  },
  {
    id: "INF-070",
    parcial: "Redes",
    tema: "Redes: subnetting y CIDR",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuál es el rango de direcciones de host de la subred 192.168.10.64/27?",
    options: [
      "192.168.10.65 a 192.168.10.94",
      "192.168.10.64 a 192.168.10.95",
      "192.168.10.65 a 192.168.10.95",
      "192.168.10.64 a 192.168.10.96"
    ],
    correct: 0,
    exp: "Una /27 tiene bloques de 32: red .64, broadcast .95. Los hosts van de <b>.65 a .94</b>."
  },
  {
    id: "INF-071",
    parcial: "Redes",
    tema: "Redes: subnetting y CIDR",
    dificultad: "dificil",
    tipo: "multiple",
    q: "Con VLSM, de la red 192.168.10.0/24 hay que crear subredes de 60, 30 y 10 hosts. ¿Qué máscara se asigna a la subred de 60 hosts?",
    options: ["/26", "/27", "/28", "/25"],
    correct: 0,
    exp: "Para 60 hosts se necesitan 6 bits de host (2^6 - 2 = 62 ≥ 60), es decir <b>/26</b>. La /27 da 30 hosts (insuficiente) y la /25 desperdicia direcciones."
  },
  {
    id: "INF-072",
    parcial: "Redes",
    tema: "Redes: subnetting y CIDR",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué es el resumen de rutas (route summarization / supernetting)?",
    options: [
      "Agrupar varias subredes contiguas en una sola ruta con un prefijo más corto",
      "Dividir una red grande en subredes más pequeñas",
      "Eliminar rutas de la tabla de enrutamiento",
      "Asignar la misma IP a varios routers"
    ],
    correct: 0,
    exp: "El <b>resumen de rutas</b> agrupa subredes contiguas (por ejemplo cuatro /26) en una sola ruta /24, reduciendo el tamaño de la tabla de enrutamiento."
  },
  {
    id: "INF-073",
    parcial: "Redes",
    tema: "Redes: subnetting y CIDR",
    dificultad: "dificil",
    tipo: "multiple",
    q: "Si en la tabla de enrutamiento coinciden una ruta /24 y una /32 para el mismo destino, ¿cuál se elige?",
    options: [
      "La /32, porque es la más específica (longest prefix match)",
      "La /24, porque es más corta y rápida",
      "La que se configuró primero",
      "Se reparte el tráfico entre las dos"
    ],
    correct: 0,
    exp: "El router aplica <b>longest prefix match</b>: gana la ruta con el prefijo más largo (más específica). Una /32 identifica un solo host y prevalece sobre la /24."
  },
  {
    id: "INF-074",
    parcial: "Redes",
    tema: "Redes: subnetting y CIDR",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cuántos hosts útiles tiene una subred /30?",
    options: ["2", "4", "6", "0"],
    correct: 0,
    exp: "Una /30 deja 2 bits de host: 2^2 = 4 direcciones, menos red y broadcast = <b>2 hosts útiles</b>. Es el tamaño típico de un enlace punto a punto."
  },
  {
    id: "INF-075",
    parcial: "Redes",
    tema: "Redes: gateway y enrutamiento",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué es el gateway por defecto de un host?",
    options: [
      "La IP del router que usa para enviar paquetes fuera de su red local",
      "La dirección de broadcast de la subred",
      "El servidor DNS de la red",
      "La IP del switch al que está conectado"
    ],
    correct: 0,
    exp: "El <b>gateway por defecto</b> es la interfaz del router en la red local. Todo paquete con destino fuera de la subred se envía ahí."
  },
  {
    id: "INF-076",
    parcial: "Redes",
    tema: "Redes: gateway y enrutamiento",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué comando muestra la tabla de enrutamiento en Linux?",
    options: ["ip route", "ifconfig", "netstat -a", "traceroute"],
    correct: 0,
    exp: "<b>ip route</b> muestra las rutas (destino, gateway e interfaz). «ifconfig» muestra las interfaces, «netstat -a» las conexiones y «traceroute» la ruta de un paquete."
  },
  {
    id: "INF-077",
    parcial: "Redes",
    tema: "Redes: gateway y enrutamiento",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué es una ruta estática?",
    options: [
      "Una ruta configurada a mano por el administrador",
      "Una ruta que el router aprende automáticamente de otro router",
      "Una ruta que cambia según la carga de la red",
      "Una ruta temporal que se borra al reiniciar"
    ],
    correct: 0,
    exp: "Una <b>ruta estática</b> se configura a mano (por ejemplo «ip route 10.0.0.0 255.0.0.0 192.168.1.1»). Las dinámicas se aprenden con protocolos como OSPF o RIP."
  },
  {
    id: "INF-078",
    parcial: "Redes",
    tema: "Redes: gateway y enrutamiento",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué es el next-hop en una ruta de enrutamiento?",
    options: [
      "La IP del siguiente router al que se envía el paquete para llegar al destino",
      "El último router antes de llegar al host de destino",
      "El número de saltos que faltan para llegar al destino",
      "La interfaz por la que sale el paquete del host"
    ],
    correct: 0,
    exp: "El <b>next-hop</b> es la dirección del siguiente salto: el router al que se entrega el paquete. El router reenvía al siguiente next-hop hasta llegar al destino."
  },
  {
    id: "INF-079",
    parcial: "Redes",
    tema: "Redes: gateway y enrutamiento",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué comando de Cisco IOS muestra la tabla de enrutamiento de un router?",
    options: ["show ip route", "show interfaces", "show running-config", "show arp"],
    correct: 0,
    exp: "<b>show ip route</b> muestra la tabla de enrutamiento. «show interfaces» el estado de las interfaces, «show running-config» la configuración y «show arp» la tabla ARP."
  },
  {
    id: "INF-080",
    parcial: "Redes",
    tema: "Redes: DNS",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué función cumple el servicio DNS en una red?",
    options: [
      "Traducir nombres de dominio (como www.ejemplo.com) a direcciones IP",
      "Asignar direcciones IP automáticamente a los equipos",
      "Cifrar el tráfico entre el cliente y el servidor",
      "Filtrar el tráfico no autorizado"
    ],
    correct: 0,
    exp: "El <b>DNS</b> (Domain Name System) traduce nombres a IP: en vez de recordar 192.168.1.10, usas «servidor». El DHCP es el que asigna IPs automáticamente."
  },
  {
    id: "INF-081",
    parcial: "Redes",
    tema: "Redes: DNS",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿En qué archivo de Linux se configuran los servidores DNS?",
    options: ["/etc/resolv.conf", "/etc/hosts", "/etc/dns.conf", "/etc/network/dns"],
    correct: 0,
    exp: "<b>/etc/resolv.conf</b> define los servidores DNS (líneas «nameserver 8.8.8.8»). En Windows la configuración se ve con «ipconfig /all»."
  },
  {
    id: "INF-082",
    parcial: "Redes",
    tema: "Redes: DNS",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué registro DNS asocia un nombre de dominio con una dirección IPv4?",
    options: ["Registro A", "Registro CNAME", "Registro MX", "Registro NS"],
    correct: 0,
    exp: "El registro <b>A</b> (address) asocia un nombre con una IPv4. El CNAME crea un alias, el MX indica el servidor de correo y el NS el servidor de nombres autoritativo."
  },
  {
    id: "INF-083",
    parcial: "Redes",
    tema: "Redes: DNS",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué comando de Linux resuelve un nombre de dominio contra el servidor DNS?",
    options: ["nslookup", "ip route", "ping -r", "netstat -rn"],
    correct: 0,
    exp: "<b>nslookup</b> (también «host» o «dig») consulta el servidor DNS. «ip route» muestra rutas, «ping» prueba conectividad y «netstat -rn» la tabla de rutas."
  },
  {
    id: "INF-084",
    parcial: "Redes",
    tema: "Redes: DNS",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué ventaja tiene la caché DNS de un host?",
    options: [
      "Evita volver a consultar el servidor DNS para nombres ya resueltos recientemente",
      "Asigna direcciones IP automáticamente",
      "Cifra las consultas DNS",
      "Bloquea el acceso a dominios desconocidos"
    ],
    correct: 0,
    exp: "La <b>caché DNS</b> guarda las resoluciones recientes (con su TTL) para no repetir la consulta al servidor, acelerando la navegación y reduciendo tráfico."
  },
  {
    id: "INF-085",
    parcial: "Redes",
    tema: "Redes: switching y VLAN",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Cuál es la diferencia principal entre un switch y un hub?",
    options: [
      "El switch envía las tramas solo al puerto del destino; el hub las repite a todos los puertos",
      "El switch solo funciona con fibra óptica y el hub con cobre",
      "El hub tiene más puertos que el switch",
      "El switch no permite crear VLAN y el hub sí"
    ],
    correct: 0,
    exp: "El <b>switch</b> aprende las direcciones MAC y reenvía la trama solo al puerto de destino. El <b>hub</b> repite la trama a todos los puertos, generando colisiones y tráfico innecesario."
  },
  {
    id: "INF-086",
    parcial: "Redes",
    tema: "Redes: switching y VLAN",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué es una VLAN?",
    options: [
      "Una red lógica independiente creada dentro de un mismo switch físico",
      "Un tipo de cable de red",
      "Un protocolo de enrutamiento",
      "Una dirección IP reservada para el administrador"
    ],
    correct: 0,
    exp: "Una <b>VLAN</b> (Virtual LAN) divide un switch físico en varias redes lógicas independientes: los puertos de una VLAN no ven el tráfico de otra, aunque estén en el mismo equipo."
  },
  {
    id: "INF-087",
    parcial: "Redes",
    tema: "Redes: switching y VLAN",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué es un enlace trunk entre dos switches?",
    options: [
      "Un puerto que transporta el tráfico de varias VLAN a la vez",
      "El cable que conecta el switch con el router",
      "Un puerto reservado para la administración del switch",
      "Un enlace de respaldo que solo se usa si cae el principal"
    ],
    correct: 0,
    exp: "Un <b>trunk</b> (normalmente con etiquetado 802.1Q) lleva el tráfico de varias VLAN por un mismo puerto. Un puerto de acceso (access) pertenece a una sola VLAN."
  },
  {
    id: "INF-088",
    parcial: "Redes",
    tema: "Redes: switching y VLAN",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Para qué se usa el protocolo STP en una red con switches?",
    options: [
      "Evitar bucles (loops) entre switches bloqueando puertos redundantes",
      "Cifrar el tráfico entre switches",
      "Asignar VLAN automáticamente a cada puerto",
      "Aumentar el ancho de banda entre switches"
    ],
    correct: 0,
    exp: "<b>STP</b> (Spanning Tree Protocol) detecta rutas redundantes y bloquea los puertos que formarían un bucle, manteniendo una sola ruta activa. Si cae el enlace activo, despierta los bloqueados."
  },
  {
    id: "INF-089",
    parcial: "Redes",
    tema: "Redes: switching y VLAN",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Cómo aprende un switch la dirección MAC de los equipos conectados?",
    options: [
      "Observando el origen de las tramas que recibe por cada puerto",
      "Consultando al servidor DHCP",
      "Enviando una petición ARP a todos los puertos",
      "Leyendo la configuración del router"
    ],
    correct: 0,
    exp: "El switch mantiene una <b>tabla MAC</b> que asocia cada dirección MAC con el puerto por donde llegó. Si la tabla se llena o expira, inunda la trama por todos los puertos."
  },
  {
    id: "INF-090",
    parcial: "Redes",
    tema: "Redes: ACL y seguridad",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué es una ACL en un router?",
    options: [
      "Una lista de reglas que permite o deniega tráfico según criterios como IP o puerto",
      "Un protocolo para asignar direcciones IP",
      "Un tipo de cable blindado",
      "Una tabla de direcciones MAC"
    ],
    correct: 0,
    exp: "Una <b>ACL</b> (Access Control List) filtra el tráfico: cada regla «permit» o «deny» evalúa origen, destino, protocolo y puerto. Se aplica sobre una interfaz, en entrada o salida."
  },
  {
    id: "INF-091",
    parcial: "Redes",
    tema: "Redes: ACL y seguridad",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué tipo de ACL filtra únicamente por la dirección IP de origen?",
    options: ["ACL estándar", "ACL extendida", "ACL con nombre", "ACL dinámica"],
    correct: 0,
    exp: "Una <b>ACL estándar</b> solo mira la IP de origen (numeradas 1-99). Una <b>extendida</b> también filtra destino, protocolo y puerto (100-199)."
  },
  {
    id: "INF-092",
    parcial: "Redes",
    tema: "Redes: ACL y seguridad",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué es una wildcard mask en una ACL de Cisco?",
    options: [
      "Una máscara invertida que indica qué bits de la IP deben coincidir (0) y cuáles no (1)",
      "Una máscara de subred normal escrita al revés",
      "Una clave de acceso al router",
      "Un tipo de cifrado para las reglas"
    ],
    correct:  0,
    exp: "La <b>wildcard mask</b> es la inversa de la máscara de subred: 0 = el bit debe coincidir, 1 = no importa. Por ejemplo 0.0.0.255 coincide con cualquier host de la subred /24."
  },
  {
    id: "INF-093",
    parcial: "Redes",
    tema: "Redes: ACL y seguridad",
    dificultad: "dificil",
    tipo: "multiple",
    q: "¿Qué hace el orden de las reglas en una ACL?",
    options: [
      "Se evalúan de arriba abajo y la primera regla que coincide decide; el resto no se evalúa",
      "Se evalúan todas y se aplica la más restrictiva",
      "Se ordenan automáticamente por número de puerto",
      "No importa: el router elige la más adecuada"
    ],
    correct: 0,
    exp: "Las ACL se evalúan <b>en orden, de arriba abajo</b>. La primera regla que coincide decide (permit o deny) y el resto se ignora. Al final hay un «deny implícito» que bloquea todo lo no permitido."
  },
  {
    id: "INF-094",
    parcial: "Redes",
    tema: "Redes: ACL y seguridad",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué es NAT/PAT en un router?",
    options: [
      "Traducir direcciones IP privadas a una IP pública (o a un puerto) para salir a internet",
      "Asignar direcciones IP a los equipos de la red",
      "Crear VLAN de forma automática",
      "Cifrar el tráfico que pasa por el router"
    ],
    correct: 0,
    exp: "<b>NAT</b> (Network Address Translation) traduce IP privadas a una IP pública. <b>PAT</b> (Port Address Translation) usa el puerto para distinguir varios equipos internos que comparten la misma IP pública."
  },
  {
    id: "INF-095",
    parcial: "Redes",
    tema: "Redes: troubleshooting",
    dificultad: "facil",
    tipo: "multiple",
    q: "Un equipo tiene IP 192.168.1.50/24 y gateway 192.168.1.1, pero no llega a internet. ¿Qué se comprueba primero?",
    options: [
      "Hacer ping al gateway (192.168.1.1)",
      "Reiniciar el servidor DNS",
      "Cambiar la máscara de subred",
      "Configurar una VLAN nueva"
    ],
    correct: 0,
    exp: "Lo primero es comprobar la <b>conectividad local</b>: «ping 192.168.1.1» verifica que el host llega a su gateway. Si eso falla, el problema es local (cable, IP, máscara); si pasa, sigue hacia afuera."
  },
  {
    id: "INF-096",
    parcial: "Redes",
    tema: "Redes: troubleshooting",
    dificultad: "media",
    tipo: "multiple",
    q: "Un equipo no resuelve nombres de dominio, pero sí hace ping a una IP pública (8.8.8.8). ¿Cuál es la causa más probable?",
    options: [
      "El servidor DNS está mal configurado o no responde",
      "La dirección IP del equipo está duplicada",
      "El gateway está apagado",
      "El cable de red está desconectado"
    ],
    correct: 0,
    exp: "Si el ping a la IP funciona, la conectividad y el gateway están bien; el problema es la <b>resolución de nombres</b>: revisar /etc/resolv.conf o la configuración DNS del adaptador."
  },
  {
    id: "INF-097",
    parcial: "Redes",
    tema: "Redes: troubleshooting",
    dificultad: "media",
    tipo: "multiple",
    q: "¿Qué comando muestra la ruta que siguen los paquetes hasta un destino, salto a salto?",
    options: ["traceroute", "ping -a", "ifconfig", "nslookup"],
    correct: 0,
    exp: "<b>traceroute</b> («tracert» en Windows) muestra cada router por el que pasa el paquete, útil para ver dónde se corta la ruta. «ping» solo dice si llega o no."
  },
  {
    id: "INF-098",
    parcial: "Redes",
    tema: "Redes: troubleshooting",
    dificultad: "dificil",
    tipo: "multiple",
    q: "¿Qué protocolo usa un equipo para descubrir la dirección MAC que corresponde a una IP de su red local?",
    options: ["ARP", "DNS", "DHCP", "ICMP"],
    correct: 0,
    exp: "<b>ARP</b> (Address Resolution Protocol) pregunta por broadcast «¿quién tiene esta IP?» y el dueño responde con su MAC. El resultado se guarda en la tabla ARP del equipo. DHCP asigna IPs y DNS resuelve nombres."
  },
  {
    id: "INF-099",
    parcial: "Redes",
    tema: "Redes: troubleshooting",
    dificultad: "facil",
    tipo: "multiple",
    q: "¿Qué se puede comprobar a simple vista ante un equipo que no tiene red?",
    options: [
      "Que el cable esté conectado y las luces del puerto estén activas",
      "Que la tabla ARP esté vacía",
      "Que el DNS sea 8.8.8.8",
      "Que la máscara sea 255.255.255.0"
    ],
    correct: 0,
    exp: "Lo primero es lo físico: <b>cable conectado y luces del puerto</b> (enlace). Sin capa física no hay red, así que se descarta todo lo demás."
  }
];

export default [...preguntas, ...preguntasRedes];

// ============================================================================
// BLOQUE REDES — termina en INF-099
// ============================================================================
