PROTOCOLO SSH

SSH™  (o  Secure  SHell)  es  un  protocolo  que  facilita  las  comunicaciones  seguras  entre  dos
sistemas usando una arquitectura cliente/servidor y que permite a los usuarios conectarse a un
host  remotamente.  A  diferencia  de  otros  protocolos de comunicación  remota tales como  FTP  o
Telnet,  SSH  encripta  la  sesión  de  conexión,  haciendo  imposible  que  alguien  pueda  obtener
contraseñas no encriptadas.

CARACTERÍSTICAS DE SSH

El protocolo SSH proporciona los siguientes tipos de protección:

•  Después de la conexión inicial, el cliente puede verificar que se está conectando al mismo

•  Todos  los  datos  enviados  y  recibidos  durante  la  sesión  se  transfieren  por  medio  de

encriptación de 128 bits, lo cual los hacen extremamente difícil de descifrar y leer.

INSTALACIÓN Y CONFIGURACIÓ SSH

1.  Instalar el servicio SSH

# dnf –y install openssh-server

2.  Verificar el archivo de configuración que está ubicado en la ruta:

# nano /etc/ssh/sshd_config

la información debe con:

•  PermitRootLogin yes ------> quitar el comentario editar, y poner yes

3.  Iniciar el servicio ssh

systemctl start sshd.service

4.  Activar el servicio ssh

systemctl enable sshd.service

5.  Activar el puerto de conexión

netstat -ant | grep 22

6.  probar el servicio con el localhost

# ssh localhost
(escriba yes, escriba la clave de root y haga exit)

7.  Poner adaptador de Fedora y el cliente Windows en red interna asignándoles una ip

8.  Desactivar el servicio firewalld en Fedora, igualmente en el cliente windows

9.  Desactivar el servicio selinux en el servidor Fedora

11. Instalar en el cliente Windows el programa putty; con el cual vamos a probar la conexión
cliente-servidor.

12. ejecutarlo y en la casilla de host, digitar la ip del servidor Fedora y dar la opción de conectar

13. En la terminal que se dispone nos autenticamos con la clave de acceso del servidor Fedora

