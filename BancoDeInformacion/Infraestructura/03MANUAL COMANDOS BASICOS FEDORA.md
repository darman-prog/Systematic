COMANDOS BASICOS FEDORA
INFORMACIÓN DEL SISTEMA
| COMANDO  |     | DESCRIPCION  | EJEMPLO EN CONSOLA  |     |
| -------- | --- | ------------ | ------------------- | --- |
arch  Muestra el tipo de arquitectura del procesador 64 bits o 32 bits.  arch
uname -r  Muestra la versión del kernel usado en el sistema.  uname -r
dmidecode -q  Muestra los componentes hardware del sistema.  dmidecode -q
cat /proc/cpuinfo  Muestra información del procesador.  cat /proc/cpuinfo
cat /proc/meminfo  Muestra información de la memoria RAM del equipo.  cat /proc/meminfo:
Ifconfig  Muestra información de los adaptadores de red del sistema.  ifconfig
lsusb -tv  Muestra información de los dispositivos USB.  lsusb -tv
| date                    | Muestra la fecha del sistema.  |     |                         | date  |
| ----------------------- | ------------------------------ | --- | ----------------------- | ----- |
| date –set=”día mes año  |                                |     | date –set=”21 DEC 2014  |       |
Cambia la fecha del sistema.
| hora”  |     |     |     | 18:00:00”  |
| ------ | --- | --- | --- | ---------- |
cal año  Muestra el almanaque del año especificado.  cal 2014
cal mes año  Muestra el almanaque del mes y año especificado.  cal 12 2014
man comando  Muestra el menú de ayuda sobre el comando especificado.  man rm
| clock –w  | Guarda los cambios de fecha en la BIOS.      |     |     | clock –w  |
| --------- | -------------------------------------------- | --- | --- | --------- |
| who –u    | Muestra los usuarios conectados al sistema.  |     |     | who –u    |
fdisk –l  Muestra la estructura y el tipo de particiones del disco duro.  fdisk –l
df –h  Muestra las unidades de disco el tamaño y el espacio libre.  df –h
du nom  Muestra  el  tamaño  de  todos  los  subdirectorios  el  directorio
du /home -h
| orio –h  | especificado.  |     |     |     |
| -------- | -------------- | --- | --- | --- |
Muestra todos los procesos en ejecución y el identificador del proceso
| ps -A  |     |     |     | ps -A  |
| ------ | --- | --- | --- | ------ |
(PID).
kill -9 número del proceso  Cierra el proceso especificado por el PID.  kill -9 345
| free     | Muestra el espacio libre en memoria.  |     |     | free     |
| -------- | ------------------------------------- | --- | --- | -------- |
| history  | Listado de los comandos utilizados.   |     |     | history  |

APAGAR (REINICIAR SISTEMA O CERRAR SESIÓN)
| init 0  | Apagar el sistema.  |     |     | init 0  |
| ------- | ------------------- | --- | --- | ------- |

| shutdown -h now  | Apagar el sistema.  | shutdown -h now  |
| ---------------- | ------------------- | ---------------- |

| telinit 0  | Apagar el sistema.     | telinit 0:  |
| ---------- | ---------------------- | ----------- |
| halt       | Apagar el sistema.     | half        |
| init 6     | Reiniciar el sistema.  | init 6      |
| reboot     | Reiniciar el sistema.  | reboot      |
| logout     | Cerrar sesión.         | logout      |

ARCHIVOS Y DIRECTORIOS
| cd     | Ingresa a un directorio especificado.        | cd /home  |
| ------ | -------------------------------------------- | --------- |
| cd ..  | Retrocede un nivel o sale de un directorio.  | cd ..     |
cd ../..  Retroceden dos niveles o sale de dos directorios.  cd ../..
cd  Vuelve al directorio raíz.  cd
| pwd  | Muestra el directorio actual de trabajo.  | pwd  |
| ---- | ----------------------------------------- | ---- |
ls  Lista los ficheros de un directorio.  ls
ls –l  Muestra los detalles de ficheros y carpetas de un directorio.  ls -l
ls –a  Muestra los ficheros ocultos de un directorio.  ls –a
Muestra los ficheros y carpetas en forma de árbol empezando por la
| tree  |     | tree  |
| ----- | --- | ----- |
raíz.
mkdir nombredirectorio  Crea una carpeta o directorio.  mkdir carpeta1
mkdir nombredirectorio1
Crea dos carpetas o directorios simultáneamente.  mkdir cp1 cp2
nombredirectorio2
rmdir nombredirectorio  Elimina un directorio pero debe de estar vacío.  rmdir cp1
Elimina un directorio especificado y todo su contenido.

-r elimina recursivamente carpetas y subcarpetas.
rm –r –f –v  -f no pide confirmación al eliminar  rm –r –f –v cp1
-v  muestra el nombre de los directorios eliminados.

Los directorios eliminados se pueden recuperar.
shared – u nombre fichero  Elimina un fichero de forma segura ya no podrá ser recuperado.  shared – u cp1

mv directoriooriginal
Renombra un directorio. mv cp1 carpeta1
directoriorenombrado
mv directoriooriginal ruta de
Mueve un directorio a otro directorio. mv cp1 /uts_serverfiles
destino
cp nombredirectorio cp cp1 cp1.copia
nombredirectorio.copia
Copia un directorio en la misma ubicación o en otra ubicación.
cp /uts_serverfiles/cp1
cp rutaorigen ruta destino /uts_serverfiles/cp1.copia
ENCONTRAR ARCHIVOS
find –size +500000 Muestra los ficheros de tamaño superiores a 500MB. find –size +500000
find . -type f -name *php find . -type f -name *php
Encuentra todos los archivos terminados en .php
find directorio1 directorio2 -
find dir1/ dir2/ -name *php
name *php Encuentra todos los archivos terminados en .php en multiples rutas.
find -name
Encuentra un directorio especificado pero debe de estar situado en la find -name cp1
nombredefichero
posible ubicación del mismo.
find –size -500000 Muestra los ficheros de tamaño inferiores a 500MB. find –size -500000
ACTUALIZADOR DE PAQUETES YUM
yum -y install nombre
Descarga e instala un paquete. yum -y install gimp
paquete
yum -y update nombre
Actualiza un paquete. yum -y update gimp
paquete
yum -y remove nombre
Remueve un paquete instalado en el sistema. yum -y remove gimp
paquete
yum list Lista todos los paquetes instalados en el sistema. yum list
yum search nombre
Encuentra un paquete entre los repositorios para instalar. yum search gimp
paquete
yum clean all Elimina el cache de todos los paquetes. yum clean all

yum clean packages Limpiar un caché rpm borrando los paquetes descargados. yum clean packages
VER EL CONTENIDO DE UN FICHERO
cat nombrearchivo Ver los contenidos de un fichero comenzando desde la primera hilera. cat archivo1.txt