// Escenarios narrativos de Infraestructura (troubleshooting tipo Packet Tracer).
// Cada escenario es una historia con decisiones: cada opción suma puntos (0-2) y
// lleva a otro paso o al final. El rating final depende de los puntos acumulados.
const escenarios = [
  {
    id: "INF-ESC-01",
    titulo: "El servidor no responde",
    tema: "Redes: troubleshooting",
    intro: "Un equipo de la red 192.168.1.0/24 no puede acceder al servidor web de la cátedra (192.168.1.10). El servidor está encendido y conectado al switch. Empezás a diagnosticar.",
    pasos: [
      {
        id: "p1",
        narrativa: "Llegás al equipo y abrís la terminal. ¿Cuál es el primer comando que ejecutás para diagnosticar la conectividad?",
        opciones: [
          { texto: "ping 192.168.1.1 (el gateway)", siguiente: "p2", puntos: 2, feedback: "Correcto: lo primero es comprobar la conectividad local. Si no llegás al gateway, el problema es local (cable, IP, máscara)." },
          { texto: "ping 8.8.8.8", siguiente: "p2", puntos: 0, feedback: "No es el primer paso: si la conectividad local falla, el ping a internet también fallará y no te dice dónde está el problema." },
          { texto: "nslookup www.ejemplo.com", siguiente: "p2", puntos: 0, feedback: "El DNS resuelve nombres, no diagnostica conectividad. Además, si no tenés red, la consulta DNS tampoco funcionará." }
        ]
      },
      {
        id: "p2",
        narrativa: "El ping al gateway responde. ¿Qué hacés ahora para acercarte al servidor?",
        opciones: [
          { texto: "ping 192.168.1.10", siguiente: "p3", puntos: 2, feedback: "Bien: si el gateway responde, el siguiente paso es probar la conectividad directa con el servidor." },
          { texto: "tracert 192.168.1.10", siguiente: "p3", puntos: 1, feedback: "Válido, pero el ping es más directo para saber si el servidor responde. traceroute te da la ruta, no la causa." },
          { texto: "ifconfig", siguiente: "p3", puntos: 0, feedback: "ifconfig muestra la configuración de red, no la conectividad con el servidor. No avanza el diagnóstico." }
        ]
      },
      {
        id: "p3",
        narrativa: "El ping al servidor no responde, pero el servidor está encendido y conectado. ¿Qué revisás?",
        opciones: [
          { texto: "La IP y la máscara del servidor", siguiente: "p4", puntos: 2, feedback: "Correcto: si el servidor tiene una IP fuera de la subred o una máscara distinta, no responde aunque esté conectado." },
          { texto: "El cable del switch", siguiente: "p4", puntos: 1, feedback: "Posible, pero primero descartá la configuración de red, que es más rápida de verificar." },
          { texto: "El servicio httpd del servidor", siguiente: "p4", puntos: 0, feedback: "El servicio web no afecta al ping: si el servidor responde al ping, el problema es de red, no del servicio." }
        ]
      },
      {
        id: "p4",
        narrativa: "Verificás el servidor: tiene IP 192.168.1.10/24 y el cable está bien conectado. El ping sigue sin responder. ¿Qué puede estar pasando?",
        opciones: [
          { texto: "El firewall del servidor está bloqueando el tráfico", siguiente: "fin", puntos: 2, feedback: "Muy probable: firewalld o una regla ICMP puede estar descartando los pings. Revisá «systemctl status firewalld.service»." },
          { texto: "El servidor no tiene tarjeta de red", siguiente: "fin", puntos: 0, feedback: "Si no tuviera tarjeta de red no tendría IP asignada. La IP está bien, así que la tarjeta existe." },
          { texto: "El switch está apagado", siguiente: "fin", puntos: 0, feedback: "Si el switch estuviera apagado, el gateway tampoco respondería. El problema es específico del servidor." }
        ]
      }
    ],
    finales: {
      exito: "¡Excelente diagnóstico! Identificaste que el problema estaba en el firewall del servidor. Con «systemctl stop firewalld.service» o una regla ICMP, el servidor vuelve a responder.",
      parcial: "Buen trabajo, pero te faltó algún paso clave. Repasá la secuencia: gateway → servidor → configuración → firewall.",
      fracaso: "El diagnóstico no fue efectivo. Recordá: empezá por lo físico y la conectividad local, y avanzá de adentro hacia afuera."
    }
  },
  {
    id: "INF-ESC-02",
    titulo: "No resuelve nombres de dominio",
    tema: "Redes: DNS",
    intro: "Un equipo tiene conexión a internet (hace ping a 8.8.8.8) pero no puede abrir www.ejemplo.com en el navegador. El resto de los equipos de la red sí navegan.",
    pasos: [
      {
        id: "p1",
        narrativa: "El equipo hace ping a 8.8.8.8 y responde. ¿Qué confirma esto?",
        opciones: [
          { texto: "La conectividad y el gateway funcionan; el problema es la resolución de nombres", siguiente: "p2", puntos: 2, feedback: "Exacto: si el ping a la IP funciona, la red está bien y el problema está en el DNS." },
          { texto: "El navegador está roto", siguiente: "p2", puntos: 0, feedback: "El navegador no es el problema: si no resuelve nombres, ningún navegador funcionará, pero la red sí." },
          { texto: "El cable de red está desconectado", siguiente: "p2", puntos: 0, feedback: "Si el cable estuviera desconectado, el ping a 8.8.8.8 tampoco respondería." }
        ]
      },
      {
        id: "p2",
        narrativa: "¿Qué comando usás para probar la resolución de nombres directamente?",
        opciones: [
          { texto: "nslookup www.ejemplo.com", siguiente: "p3", puntos: 2, feedback: "Correcto: nslookup consulta el servidor DNS y te dice si resuelve o no." },
          { texto: "ping www.ejemplo.com", siguiente: "p3", puntos: 1, feedback: "Válido, pero nslookup es más directo para aislar el problema de DNS." },
          { texto: "ip route", siguiente: "p3", puntos: 0, feedback: "ip route muestra las rutas, no la resolución de nombres." }
        ]
      },
      {
        id: "p3",
        narrativa: "nslookup no resuelve. ¿Qué revisás en la configuración del equipo?",
        opciones: [
          { texto: "El archivo /etc/resolv.conf", siguiente: "p4", puntos: 2, feedback: "Bien: /etc/resolv.conf define los servidores DNS. Si está vacío o mal, no hay resolución." },
          { texto: "La tabla ARP", siguiente: "p4", puntos: 0, feedback: "La tabla ARP asocia IPs con MACs en la red local; no tiene que ver con la resolución de nombres." },
          { texto: "El archivo /etc/passwd", siguiente: "p4", puntos: 0, feedback: "/etc/passwd guarda usuarios, no configuración de red." }
        ]
      },
      {
        id: "p4",
        narrativa: "En /etc/resolv.conf no hay ninguna línea «nameserver». ¿Cuál es la solución?",
        opciones: [
          { texto: "Agregar «nameserver 8.8.8.8» y probar de nuevo", siguiente: "fin", puntos: 2, feedback: "Correcto: sin nameserver no hay resolución. Agregá un servidor DNS válido." },
          { texto: "Reiniciar el equipo", siguiente: "fin", puntos: 0, feedback: "Reiniciar no arregla la falta de configuración DNS; el problema volvería." },
          { texto: "Cambiar la dirección IP del equipo", siguiente: "fin", puntos: 0, feedback: "La IP no es el problema: el ping a 8.8.8.8 funciona. El problema es la configuración DNS." }
        ]
      }
    ],
    finales: {
      exito: "¡Perfecto! Identificaste que faltaba la configuración DNS en /etc/resolv.conf. Con un nameserver válido, el equipo vuelve a navegar.",
      parcial: "Llegaste a la solución pero con dudas. Repasá: si el ping a IP funciona y el navegador no, el problema es el DNS.",
      fracaso: "El diagnóstico no fue efectivo. Recordá: conectividad primero (ping a IP), resolución después (nslookup)."
    }
  },
  {
    id: "INF-ESC-03",
    titulo: "La red local no sale a internet",
    tema: "Redes: gateway y enrutamiento",
    intro: "Todos los equipos de la red 192.168.10.0/24 hacen ping entre sí, pero ninguno sale a internet. El router está encendido y tiene dos interfaces: una hacia la red local y otra hacia el proveedor.",
    pasos: [
      {
        id: "p1",
        narrativa: "Los equipos se ven entre sí. ¿Qué descarta esto como causa?",
        opciones: [
          { texto: "El switch y la red local funcionan; el problema está en el router o más allá", siguiente: "p2", puntos: 2, feedback: "Correcto: si los equipos se ven entre sí, la capa local está bien. El problema está en el router o la salida." },
          { texto: "El cable de red de los equipos", siguiente: "p2", puntos: 0, feedback: "Si los equipos se ven entre sí, sus cables y el switch funcionan." },
          { texto: "El servidor DNS", siguiente: "p2", puntos: 0, feedback: "El DNS no afecta a la salida a internet: si el router no enruta, ningún equipo sale, aunque el DNS funcione." }
        ]
      },
      {
        id: "p2",
        narrativa: "Te conectás al router. ¿Qué comando verificás primero?",
        opciones: [
          { texto: "show ip route", siguiente: "p3", puntos: 2, feedback: "Bien: la tabla de enrutamiento te dice si el router conoce la ruta hacia internet." },
          { texto: "show version", siguiente: "p3", puntos: 0, feedback: "show version muestra la versión del IOS, no las rutas." },
          { texto: "show cdp neighbors", siguiente: "p3", puntos: 0, feedback: "CDP muestra vecinos de capa 2, no la tabla de enrutamiento." }
        ]
      },
      {
        id: "p3",
        narrativa: "En la tabla de enrutamiento no hay ruta por defecto (0.0.0.0/0). ¿Qué significa esto?",
        opciones: [
          { texto: "El router no sabe a dónde enviar el tráfico que no es de la red local", siguiente: "p4", puntos: 2, feedback: "Exacto: sin ruta por defecto, el router descarta todo el tráfico hacia redes desconocidas." },
          { texto: "El router está apagado", siguiente: "p4", puntos: 0, feedback: "Si estuviera apagado no podrías conectarte a él. El problema es de configuración." },
          { texto: "La red local está mal configurada", siguiente: "p4", puntos: 0, feedback: "La red local funciona (los equipos se ven). El problema es la falta de ruta en el router." }
        ]
      },
      {
        id: "p4",
        narrativa: "¿Qué comando agrega una ruta por defecto hacia el proveedor (asumimos que la IP del proveedor es 203.0.113.1)?",
        opciones: [
          { texto: "ip route 0.0.0.0 0.0.0.0 203.0.113.1", siguiente: "fin", puntos: 2, feedback: "Correcto: esa ruta por defecto envía todo el tráfico desconocido al proveedor." },
          { texto: "ip route 192.168.10.0 255.255.255.0 203.0.113.1", siguiente: "fin", puntos: 0, feedback: "Esa ruta es para la red local, que ya es directamente conocida. No resuelve la salida a internet." },
          { texto: "ip default-gateway 203.0.113.1", siguiente: "fin", puntos: 0, feedback: "Ese comando es de capa 2 (switches), no de routers. En un router se usa «ip route»." }
        ]
      }
    ],
    finales: {
      exito: "¡Excelente! Agregaste la ruta por defecto y la red vuelve a salir a internet. El problema era la falta de ruta 0.0.0.0/0 en el router.",
      parcial: "Encontraste el problema pero la solución no fue la correcta. Repasá: la ruta por defecto es 0.0.0.0/0 con el next-hop del proveedor.",
      fracaso: "El diagnóstico no fue efectivo. Recordá: si la red local funciona pero no sale, revisá la tabla de enrutamiento del router."
    }
  },
  {
    id: "INF-ESC-04",
    titulo: "Dos VLAN que no se ven",
    tema: "Redes: switching y VLAN",
    intro: "En un switch hay dos VLAN: la 10 (ventas) y la 20 (administración). Los equipos de cada VLAN se ven entre sí, pero ningún equipo de la VLAN 10 puede ver a uno de la VLAN 20. Hay un router conectado al switch.",
    pasos: [
      {
        id: "p1",
        narrativa: "Los equipos de cada VLAN se ven entre sí. ¿Qué confirma esto?",
        opciones: [
          { texto: "El switch y la configuración de VLAN funcionan dentro de cada VLAN", siguiente: "p2", puntos: 2, feedback: "Correcto: si cada VLAN funciona internamente, el problema está en el enrutamiento entre VLAN." },
          { texto: "El switch está apagado", siguiente: "p2", puntos: 0, feedback: "Si el switch estuviera apagado, ninguna VLAN funcionaría." },
          { texto: "Los cables están mal conectados", siguiente: "p2", puntos: 0, feedback: "Si los equipos se ven entre sí, sus cables y puertos están bien." }
        ]
      },
      {
        id: "p2",
        narrativa: "¿Qué se necesita para que dos VLAN se comuniquen?",
        opciones: [
          { texto: "Un router (o un switch de capa 3) que enrute entre las VLAN", siguiente: "p3", puntos: 2, feedback: "Exacto: las VLAN son redes distintas y necesitan un router para comunicarse." },
          { texto: "Un hub entre los dos grupos", siguiente: "p3", puntos: 0, feedback: "Un hub no enruta; además, mezclaría las VLAN en un solo dominio de broadcast." },
          { texto: "Cambiar la IP de los equipos a la misma subred", siguiente: "p3", puntos: 0, feedback: "Eso rompería la segmentación de VLAN. La solución es el enrutamiento, no cambiar las IPs." }
        ]
      },
      {
        id: "p3",
        narrativa: "El router está conectado al switch por un puerto trunk. ¿Qué debe tener ese puerto?",
        opciones: [
          { texto: "Configuración trunk (802.1Q) para transportar el tráfico de ambas VLAN", siguiente: "p4", puntos: 2, feedback: "Correcto: un puerto trunk etiqueta las tramas de cada VLAN para que el router las distinga." },
          { texto: "Configuración access de la VLAN 10", siguiente: "p4", puntos: 0, feedback: "Un puerto access pertenece a una sola VLAN; no podría transportar el tráfico de ambas." },
          { texto: "Deshabilitado, para evitar bucles", siguiente: "p4", puntos: 0, feedback: "Si el puerto está deshabilitado, el router no recibe tráfico y no hay enrutamiento." }
        ]
      },
      {
        id: "p4",
        narrativa: "El puerto trunk está bien, pero las VLAN siguen sin verse. ¿Qué revisás en el router?",
        opciones: [
          { texto: "Que tenga una interfaz (o subinterfaz) para cada VLAN con su IP y máscara", siguiente: "fin", puntos: 2, feedback: "Correcto: el router necesita una interfaz lógica por VLAN (router-on-a-stick) con la IP de cada subred." },
          { texto: "Que el router tenga el puerto apagado", siguiente: "fin", puntos: 0, feedback: "Si el puerto estuviera apagado, tampoco funcionaría el trunk. El problema es la configuración de las interfaces." },
          { texto: "Que el router tenga una sola IP para ambas VLAN", siguiente: "fin", puntos: 0, feedback: "Una sola IP no puede enrutar entre dos subredes distintas. Necesitás una interfaz por VLAN." }
        ]
      }
    ],
    finales: {
      exito: "¡Perfecto! Configuraste las subinterfaces del router para cada VLAN y ahora se ven. El problema era la falta de interfaces lógicas en el router.",
      parcial: "Identificaste el problema pero la solución no fue completa. Repasá: router-on-a-stick necesita una subinterfaz por VLAN.",
      fracaso: "El diagnóstico no fue efectivo. Recordá: las VLAN necesitan un router para comunicarse, y el enlace al router debe ser trunk."
    }
  },
  {
    id: "INF-ESC-05",
    titulo: "Acceso no autorizado a la red",
    tema: "Redes: ACL y seguridad",
    intro: "En la red 192.168.20.0/24 hay un servidor (192.168.20.10) que solo debe ser accesible desde la red de administración (192.168.10.0/24). Cualquier otro equipo debe ser bloqueado. El router conecta ambas redes.",
    pasos: [
      {
        id: "p1",
        narrativa: "¿Qué mecanismo del router permite bloquear tráfico según el origen?",
        opciones: [
          { texto: "Una ACL (Access Control List)", siguiente: "p2", puntos: 2, feedback: "Correcto: una ACL filtra el tráfico según IP de origen, destino, protocolo o puerto." },
          { texto: "Una VLAN", siguiente: "p2", puntos: 0, feedback: "Una VLAN segmenta la red, pero no filtra tráfico entre redes ya enrutadas." },
          { texto: "Un trunk", siguiente: "p2", puntos: 0, feedback: "Un trunk transporta VLAN entre switches; no filtra tráfico." }
        ]
      },
      {
        id: "p2",
        narrativa: "¿Qué tipo de ACL filtra solo por la dirección IP de origen?",
        opciones: [
          { texto: "ACL estándar", siguiente: "p3", puntos: 2, feedback: "Correcto: una ACL estándar (1-99) solo mira la IP de origen." },
          { texto: "ACL extendida", siguiente: "p3", puntos: 1, feedback: "Una extendida también filtra por origen, pero además por destino, protocolo y puerto. Para este caso, la estándar basta." },
          { texto: "ACL dinámica", siguiente: "p3", puntos: 0, feedback: "Una ACL dinámica requiere autenticación del usuario; no es el mecanismo adecuado aquí." }
        ]
      },
      {
        id: "p3",
        narrativa: "Se quiere permitir solo la red 192.168.10.0/24. ¿Qué wildcard mask se usa en la ACL?",
        opciones: [
          { texto: "0.0.0.255", siguiente: "p4", puntos: 2, feedback: "Correcto: 0.0.0.255 coincide con cualquier host de la /24 (los últimos 8 bits no importan)." },
          { texto: "255.255.255.0", siguiente: "p4", puntos: 0, feedback: "Esa es una máscara de subred, no una wildcard. En una ACL se usa la inversa." },
          { texto: "0.0.0.0", siguiente: "p4", puntos: 0, feedback: "0.0.0.0 coincide con una sola IP exacta, no con toda la red." }
        ]
      },
      {
        id: "p4",
        narrativa: "La ACL tiene una regla «permit 192.168.10.0 0.0.0.255». ¿Qué pasa con el tráfico que no coincide?",
        opciones: [
          { texto: "Se bloquea por el deny implícito al final de la ACL", siguiente: "fin", puntos: 2, feedback: "Correcto: al final de toda ACL hay un «deny any» implícito que bloquea lo no permitido." },
          { texto: "Se permite, porque no hay regla que lo bloquee", siguiente: "fin", puntos: 0, feedback: "Falso: el deny implícito bloquea todo lo que no coincide con una regla permit." },
          { texto: "Se registra en un log pero se permite", siguiente: "fin", puntos: 0, feedback: "Sin una regla «log», el tráfico no se registra. Y de todas formas se bloquea." }
        ]
      }
    ],
    finales: {
      exito: "¡Excelente! Configuraste la ACL correctamente: solo la red de administración accede al servidor y el resto se bloquea por el deny implícito.",
      parcial: "Llegaste a la solución pero con dudas. Repasá: ACL estándar para filtrar por origen, wildcard 0.0.0.255 para una /24, y deny implícito al final.",
      fracaso: "El diagnóstico no fue efectivo. Recordá: las ACL filtran por origen (estándar) o por origen y destino (extendida), y siempre terminan en deny implícito."
    }
  }
];

export default escenarios;
