 INGENIERÍA DE SISTEMAS
UNAB – febrero 2021 © versión 6

EMPAQUETAMIENTO Y COMPRESION DE ARCHIVOS

EMPAQUETAR: Es agrupar en un solo archivo varios archivos o directorios. El comando utilizado es tar.

TAR: Empaqueta, es decir, almacena un conjunto de archivos en uno solo. Sus opciones son:

f — indica a tar que el siguiente argumento es el nombre del fichero.tar.
t — muestra la lista de archivos en el archivo tar.

•  c — crea un nuevo archivo.
•
•
•  v — muestra el progreso de los archivos que están siendo archivados.
•  x — extrae los archivos desde un archivo.
•  z — comprime el archivo tar con gzip.
•
j — comprime el archivo tar con bzip2

✓  EMPAQUETAR: Su sintaxis es: tar cvf archivo_destino.tar archivo_a_empaquetar

Paso 1: Crear un directorio llamado mischecheres en /root, y en el crear tres  archivos, mibasurita.txt,
miscositas.txt y miscosas.txt

# mkdir mischecheres
# touch mibasurita.txt miscositas.txt miscosas.txt
# ls
# ls mischecheres/

Paso 2: empaquetar mischecheres en el contenedor mischecheres.tar

# tar cvf mischecheres.tar mischecheres
# ls

✓  VISUALIZAR: Su sintaxis es: tar tvf archivo.tar

Paso 3: visualizar el contenido del contenedor mischecheres.tar

# tar tvf mischecheres.tar

✓  DESEMPAQUETAR: Su sintaxis es: tar xvf archivo.tar

Paso 4: desempaquetar el contenido de mischecheres.tar, antes elimine el directorio mischecheres

# rm –r –f -v mischecheres
# ls

# tar xvf mischecheres.tar

 INGENIERÍA DE SISTEMAS
UNAB – febrero 2021 © versión 6

EMPAQUETADO Y COMPRESION: Para comprimir varios ficheros y empaquetarlos en un solo archivo hay que
combinar el tar y el gzip o el bzip2 de la siguiente manera:

TAR.GZ: Es el resultado de utilizar tar mas el formato de compresión gzip, este proceso va a empaquetar ficheros
y a la vez lo va a comprimir.

✓  EMPAQUETAR Y COMPRIMIR: Su sintaxis es: tar czvf directorio.tar.gz directorio

✓  VISUALIZAR: Su sintaxis es: tar tzvf directorio.tar.gz

✓  DESEMPAQUETAR Y DESCOMPRIMIR: Su sintaxis es: tar xzvf directorio.tar.gz

TAR.BZ2:  Es el resultado  de utilizar  tar  mas el formato  de  compresión  bzip,2  este proceso  va  a  empaquetar
ficheros y a la vez lo va a comprimir.

✓  EMPAQUETAR Y COMPRIMIR: Su sintaxis es: tar jcvf directorio.tar.bz2 directorio

                                                        Otra forma: tar -c directorio | bzip2 > directorio.tar.bz2

✓  VISUALIZAR: Su sintaxis es: : tar jtvf directorio.tar.bz2 directorio

Otra forma:bzip2 -dc directorio.tar.bz2 | tar -t

✓  DESEMPAQUETAR Y DESCOMPRIMIR: Su sintaxis es: tar jxvf directorio.tar.bz2
                                                                              Otra forma: bzip2 -dc directorio.tar.bz2 | tar -xv

COMPRIMIR: Comprimir significa aplicar un algoritmo que harán que el archivo ocupe menos espacio en el disco
duro.

ZIP

✓  COMPRIMIR: Su sintaxis es: zip -r directorio.zip directorio
✓  COMPRIMIR UN ARCHIVO CON CONTRASEÑA:
✓  echo “ejemplo de zip con clave en archivos” > archivito
✓  Su sintaxis es: zip -e archivoconclave.zip archivito

✓  VISUALIZAR: Su sintaxis es: unzip -v archivo.zip
✓  DESCOMPRIMIR: Su sintaxis es: unzip directorio.zip

GZIP: Solo comprime archivos no directorios

✓  COMPRIMIR: Su sintaxis es: gzip -q archivo

✓  DESCOMPRIMIR: Su sintaxis es: gzip -d fichero.gz

 INGENIERÍA DE SISTEMAS
UNAB – febrero 2021 © versión 6

BZIP2: Solo comprime archivos no directorios.

✓  COMPRIMIR: Su sintaxis es: bzip2  archivo

✓  DESCOMPRIMIR: Su sintaxis es: bzip2 -d fichero.bz2

