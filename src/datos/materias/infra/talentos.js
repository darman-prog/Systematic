// Árbol de talentos y ejes del Radar de Especialidades de Infraestructura.
const talentos = {
  ejes: ["Sistemas Linux", "Automatización", "Enrutamiento", "Servicios Red", "Seguridad"],
  ramas: [
    {
      id: "rama-linux-inf",
      nombre: "Administración de Sistemas Linux",
      descripcion: "Opera servidores desde terminal, gestiona permisos y automatiza servicios críticos.",
      nodos: [
        {
          id: "TAL-INF-01",
          nombre: "Operador de Terminal",
          descripcion: "Domina el sistema de archivos, permisos octales y diagnóstico de procesos.",
          eje: "Sistemas Linux",
          puntosRadar: 100,
          titulo: "SysAdmin de Sistemas Linux",
          icono: "terminal",
          misionesRequeridas: [
            "Linux: comandos básicos",
            "Linux: archivos y directorios",
            "Linux: permisos de archivos y directorios"
          ],
          minEstrellas: 1,
          bossId: "INF-ESC-01",
          bossTipo: "escenario",
          bossNombre: "Incidente: El servidor no responde",
          talentoPrevioId: null
        },
        {
          id: "TAL-INF-02",
          nombre: "Ingeniero de Automatización y Servicios",
          descripcion: "Despliega servicios web, acceso remoto por SSH y resolución de nombres.",
          eje: "Automatización",
          puntosRadar: 100,
          titulo: "Ingeniero DevOps Bash & SSH",
          icono: "rayo",
          misionesRequeridas: ["Linux: scripts bash", "Linux: SSH", "Linux: HTTP y servidores"],
          minEstrellas: 1,
          bossId: "INF-ESC-02",
          bossTipo: "escenario",
          bossNombre: "Incidente: No resuelve nombres de dominio",
          talentoPrevioId: "TAL-INF-01"
        }
      ]
    },
    {
      id: "rama-redes-inf",
      nombre: "Redes, Enrutamiento y Conmutación",
      descripcion: "Diseña direccionamiento IP/CIDR, puertas de enlace y segmentación por VLAN.",
      nodos: [
        {
          id: "TAL-INF-03",
          nombre: "Especialista en Ruteo y Subredes",
          descripcion: "Calcula máscaras CIDR y restablece la salida hacia redes externas.",
          eje: "Enrutamiento",
          puntosRadar: 100,
          titulo: "Ingeniero de Enrutamiento IP",
          icono: "escenarios",
          misionesRequeridas: [
            "Redes: direcciones IP y máscaras",
            "Redes: subnetting y CIDR",
            "Redes: gateway y enrutamiento"
          ],
          minEstrellas: 1,
          bossId: "INF-ESC-03",
          bossTipo: "escenario",
          bossNombre: "Incidente: La red local no sale a internet",
          talentoPrevioId: null
        },
        {
          id: "TAL-INF-04",
          nombre: "Arquitecto de Conmutación y DNS",
          descripcion: "Configura enlaces troncales 802.1Q y diagnostica aislamiento entre VLANs.",
          eje: "Servicios Red",
          puntosRadar: 100,
          titulo: "Especialista en VLAN y DNS",
          icono: "chispa",
          misionesRequeridas: ["Redes: switching y VLAN", "Redes: DNS"],
          minEstrellas: 1,
          bossId: "INF-ESC-04",
          bossTipo: "escenario",
          bossNombre: "Incidente: Dos VLAN que no se ven",
          talentoPrevioId: "TAL-INF-03"
        }
      ]
    },
    {
      id: "rama-seguridad-inf",
      nombre: "Ciberseguridad y Respuesta a Incidentes",
      descripcion: "Aplica listas de control de acceso (ACL) y metodologías de troubleshooting.",
      nodos: [
        {
          id: "TAL-INF-05",
          nombre: "Guardián de Perímetro y ACL",
          descripcion: "Bloquea tráfico no autorizado sin interrumpir los servicios legítimos.",
          eje: "Seguridad",
          puntosRadar: 100,
          titulo: "Ingeniero de Seguridad de Red",
          icono: "medalla",
          misionesRequeridas: ["Redes: ACL y seguridad", "Redes: troubleshooting"],
          minEstrellas: 1,
          bossId: "INF-ESC-05",
          bossTipo: "escenario",
          bossNombre: "Incidente: Acceso no autorizado a la red",
          talentoPrevioId: null
        }
      ]
    }
  ]
};

export default talentos;
