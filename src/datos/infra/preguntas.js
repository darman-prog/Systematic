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
  }
];

export default preguntas;
