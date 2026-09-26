CREAR UNA MAQUINA VIRTUAL

Antes de realizar este proceso se debe tener en cuenta lo siguiente, si  se desea instalar fedora para
procesadores  con  arquitectura  x64  se  debe  verificar  que  en  la  BIOS  se  tenga  activada  la  opción  de
virtualización para nuestro procesador.

1.  Inicialmente  se  va  a  crear  una  nueva  máquina  virtual  siguiendo  los  pasos  como  lo  muestran  las

imágenes a continuación:

2.  Se asigna el nombre de la máquina, el tipo y la versión de sistema operativo dando clic en Next:

3.  Se  configura  el  tamaño  de  memoria RAM  para la  nueva  máquina  virtual, en  este  caso  se  asigna
1024MB, que es un valor suficiente para la instalación minina y sin entorno gráfico a realizar. (Es
importante que  el tamaño de RAM de la maquina anfitrión sea lo  suficientemente  grande como
para permitir el correcto funcionamiento tanto de la maquina real como la virtual). Haga clic en Next
para asignar la RAM deseada.

4.  Para crear el disco duro virtual que soportara la instalación del Sistema operativo, se selecciona la

opción de crear un disco nuevo y se hace clic en Crear:

5.  El tipo de disco duro Virtual es VDI, se selecciona y se da clic en Next:

6.  El disco duro puede tener un tamaño fijo o irse ajustando dinámicamente durante el proceso de

instalación, para este caso se selecciona la opción dinámica y se da clic en Next:

7.  Para asignar el tamaño del disco duro se mueve el cursor o se escribe el valor del tamaño deseado,
en este caso se asignará un tamaño de 80GB que es suficiente para el requerimiento de instalación
de la mayoría de Sistemas Operativos. Una vez asignado el tamaño se da clic en Crear:

En este punto ya se creó la nueva máquina virtual y está lista para el proceso de arranque o instalación
de  un  Sistema  operativo.  Sin  embargo,  se  deben  configurar  primero  algunas  características  para  un
optimo procedimiento.

8.  Para  optimizar  la  nueva  máquina  virtual  se  deben  configurar  algunas  características  importantes
tales como: numero de procesadores, memoria de video, prioridad de arranque y la tarjeta de red,
para esto se selecciona la maquina deseada y se ingresa a la opción configuración:

9.  Una vez dentro del menú de configuración se da clic en la opción sistema y se busca la pestaña
procesadora, en este caso se asignan 2 procesadores para que la máquina virtual sea un poco más
eficiente:

10. Luego se da clic en la opción pantalla y se asigna 128MB en la Memoria de video para optimizar el

manejo de pantalla:

11. Luego  se  selecciona  el  menú  almacenamiento  para  configurar  el  orden  de  arranque  del  ISO  de
instalación, en este caso se configura la unidad de DVD como prioridad de arranque para instalar el
sistema  operativo.  En  la  opción  de  controlador  IDE  y  se  selecciona  el  disco  vacío  para  que  se
habiliten las opciones de arranque.

Se da clic en las opciones seleccionando la opción de archivo de disco. Se debe habilitar la opción
CD/DVD Vivo, para que al bootear se dé prioridad al DVD de instalación:

Una vez seleccionada la opción se ubica la imagen ISO del disco de instalación y se da clic en Abrir:

Una vez seleccionada la ISO se da Aceptar:

12. Por ultimo se configura la opción de la tarjeta de red dando clic en el menú red. La opción NAT
permite  un  direccionamiento  IP  diferente  al  de  la  maquina  real  generando  una  IP  en  un  rango
diferente de manera dinámica (DHCP), en este caso se deja en modo NAT y se da clic en aceptar.

13. Una  vez  terminado  el  proceso  de  configuración  se  da  clic  en  el  botón  iniciar  para  encender  la

máquina virtual e instalar el sistema operativo fedora:

