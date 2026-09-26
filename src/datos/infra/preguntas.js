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
    q: "Completa el comando que muestra el contenido de un fichero de texto:",
    piezas: ["cat", "ls", "echo", "grep"],
    respuestas: ["cat"],
    codigo: "cat {1}",
    exp: "<b>cat</b> concatena y muestra el contenido del fichero. «ls» lista el directorio, «echo» imprime texto por pantalla y «grep» busca patrones dentro de un fichero."
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
  }
];

export default preguntas;
