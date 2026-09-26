MANUAL INSTALACION FEDORA

Para realizar la instalación del sistema operativo Fedora Server inicialmente se necesita el ISO de instalación del
sistema operativo, el cual se debe descargar de la página web oficial: https://getfedora.org/es/server/download/

Una  vez  creada  la  máquina  y  descargado  el  ISO del  sistema  operativo  se  da  inicio  a los  pasos de instalación
siguientes:

1.

Iniciar la máquina virtual para que bootee con el ISO de instalación de Fedora.

2.  Una vez en el menú de instalación se debe seleccionar usando las flechas del teclado la opción Install

Fedora.

3.  Se  selecciona  el  idioma  de instalación  y se da clic en continuar.

4.  A continuación, se despliega el menú con las opciones para la puesta a punto de la máquina y la instalación
del Sistema Operativo, como son: Selección de Software, Destino de Instalación, Red y Nombre de equipo,
entre otras.

5.  Para seleccionar las opciones de instalación del sistema operativo se da clic en selección de software en
esta opción se puede escoger el entorno base y los complementos a instalar. Para este caso seleccionar el
modo personalizado y escoger los complementos estándar y administración sin gráficos, que corresponden
a una instalación mínima. Para guardar los cambios y volver a las opciones de instalación se da clic en Hecho.

6.  Para seleccionar el modo de particionamiento y el sistema de archivos se selecciona el menú destino de la
instalación, en este menú se seleccionar el disco duro donde se desean realizar las particiones requeridas
para la instalación.  En este caso se realizarán de forma avanzada para lo cual se debe seleccionar la opción
personalizada y se da clic en Hecho.

7.  A continuación, se selecciona el tipo de partición, en este caso se selecciona la opción estándar. (esta opción
se escoge dependiendo del tipo de esquema de particionado que se desee utilizar. Luego para crear los
nuevos puntos de montaje se da clic en el botón + (agregar un nuevo punto de montaje).

8.  La primera partición que se creara se llama /boot y se le asignara un tamaño de 1024 MB y un sistema
de archivos ext4, esta partición es la que contiene el kernel del sistema operativo (el cual permite a su
sistema arrancar Fedora) junto con archivos utilizados durante el proceso de arranque por cuanto
no necesita un tamaño muy grande y con 512MB o 1024MB es suficiente . Para crearla se da
clic en el botón agregar un punto de montaje.

9.  La segunda partición que se creara corresponde a la raíz del sistema e archivos de UNIX que es la partición principal y
se simboliza con un / a esta partición se le asigna generalmente la mitad del tamaño total del disco duro, para
este caso se le da un tamaño de 40 GB y un sistema de archivos ext4. La raíz es la partición raíz donde se
instalará todo el  sistema  operativo y  las  futuras aplicaciones. Para crearla se da clic  en  el  botón
agregar un punto de montaje.

10. La tercera partición se llama swap y se le asignara un tamaño generalmente del doble del tamaño de la
memoria RAM de la maquina creada; sin embargo, si se tiene espacio suficiente en disco se puede crear
hasta de 8GB y sistema de archivos swap. El swap se encarga del intercambio de memoria cuando la
memoria RAM del sistema este ocupada, utilizando este espacio para expandirla. Para crearla se da
clic en el botón agregar un punto de montaje.

La cuarta y última partición corresponde a la partición de trabajo y en este caso se llamará /unabserverfiles,
no se le asignara ningún tamaño para que tome el espacio restante en disco con el sistema de archivos ext4, Esta
partición reemplazara la típica partición /home, y en ella se alojan todos los archivos necesarios para
las configuraciones del fedora server. Para crearla se da clic en el botón agregar un punto de montaje.

Una vez terminado el proceso de creación de los puntos de montaje y particiones, se verifica que todas se hayan
creado correctamente y que el sistema de archivos corresponda a ext4, para finalizar se da clic en el botón Hecho.

A continuación, se despliega la ventana resumen de cambios donde se muestra el resumen de las particiones que
se van a crear, para confirmar se da clic al botón aceptar cambios.

11. De regreso en el menú de  configuración se escoge la opción Red y nombre del equipo, para cambiar el
nombre del host y del dominio local y para configurar la red si fuera necesario (hostname / localdomain).
En este caso solo se cambiará el hostname. Para volver a la configuración y aceptar cambios se da clic en
Hecho.

12. Ingrese a la opción de activación de la contraseña de root para asignar la contraseña al usuario administrador
(root). Ingrese el password al root quien tiene permisos de administrador en el sistema. La contraseña que
se asignará para este caso es unabserver2021, la cual se digita y confirma en ambos espacios y se asigna
dando clic en el botón Hecho.

13. El menú de configuración debe aparecer sin ningún símbolo de advertencia lo cual quiere  decir que  ya se

procede a iniciar la instalación de Fedora  dando clic en el botón Empezar instalación.

Una  vez  termine  el  proceso  de  instalación  se  debe  reiniciar  la  maquina  teniendo  en  cuenta  quitar  el  ISO  de
instalación.

Cuando  inicie  el  sistema  operativo  pedirá  iniciar  sesión  por  medio  de  un  login  y  password.  El  usuario
administrador por defecto es root y el password  unabserver2021

Una vez realizado el proceso de inicio de sesión correctamente aparecerá el Shell que mediante un símbolo #
muestra que el usuario tiene permisos de administrador, si por el contrario aparece el símbolo $ significa que el
usuario es limitado a ciertas funciones en el sistema.

Para finalizer se comprueba la red usando el commando ifconfig y un ping a la direccion url www.oogle.com o
a la IP 8.8.8.8 para verificar que hay navegación a internet usando el commando:

ping ww.google.com
ping 8.8.8.8

Para parar el ping se da la combinacion de teclas ctrl + c

