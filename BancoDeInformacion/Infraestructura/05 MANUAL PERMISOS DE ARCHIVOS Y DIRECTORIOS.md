INGENIERIA DE SISTEMAS
UNAB – febrero 2021 © versión 4
PERMISOS DE ARCHIVOS Y DIRECTORIOS
En Linux, todo archivo y directorio tiene tres niveles de permisos de acceso:
1. los que se aplican al propietario del archivo
2. los que se aplican al grupo que tiene el archivo y
3. los que se aplican a todos los usuarios del sistema.
Paso 1: Para ver los permisos se lista un directorio con el comando siguiente
# ls –l
El significado, tomando como ejemplo la primera línea de cada campo es el siguiente:
✓ La primera columna –rw-r—r-- es el tipo de archivo y sus permisos
El primer carácter al extremo izquierdo, representa el tipo de archivo, los posibles valores para
esta posición son los siguientes:
▪ - un guion representa un archivo común (de texto, html, mp3, jpg, etc.)
▪ d representa un directorio
▪ l link, es decir un enlace o acceso directo
▪ b binario, un archivo generalmente ejecutable
▪ c Archivo de caracteres especiales (Dispositivo tty, impresora…)
▪ p Archivo especial de cauce (pipe o tubería)
Los siguientes 9 campos restantes, representan los permisos del archivo y deben verse en grupos
de 3. Donde:
▪ Las tres primeros representan los permisos para el propietario del archivo
▪ Los tres siguientes son los permisos para el grupo del archivo y
▪ Los tres últimos son los permisos para el resto del mundo u otros.
rwx rwx rwx
usuario grupo otros
El significado de las letras, es el siguiente:
▪ – Sin permiso
▪ r read - lectura
▪ w write - escritura (en archivos: permiso de modificar, en directorios: permiso de crear
archivos en el dir.)
▪ x execution – ejecución

INGENIERIA DE SISTEMAS
UNAB – febrero 2021 © versión 4
✓ En la siguiente columna el número (1) corresponde a los enlaces al archivo
✓ En la tercera columna root representa al propietario del archivo
✓ En la cuarta columna root representa al grupo al que pertenece al archivo
✓ Las siguientes representan el tamaño, la fecha y hora de última modificación y
✓ En la última se tiene el nombre del archivo o directorio.
1. PERMISO DE LECTURA
Cuando un usuario tiene permiso de lectura de un archivo significa que puede leerlo o visualizarlo, bien
sea con una aplicación o mediante comandos. El permiso de lectura se simboliza con la letra 'r' del
inglés 'read'.
Ejemplos:
✓ Si se tiene activo el permiso de lectura sobre el archivo miarchivito.txt, esto significa que se puede
ver el contenido del archivo. Si el usuario no tiene permiso de lectura, no podrá ver el contenido del
archivo.
✓ Si se tiene permiso de lectura sobre un directorio, significa que se puede visualizar su contenido, es
decir, se pueden ver los archivos y directorios internos que este contiene. Si el usuario no tiene
permiso de lectura sobre la carpeta, no podrá ver lo que contiene.
2. PERMISO DE ESCRITURA
Cuando un usuario tiene permiso de escritura sobre un archivo significa que puede modificar su
contenido, e incluso borrarlo. Además, también tiene privilegios para cambiar los permisos del archivo,
así como cambiar su propietario y el grupo propietario. Si el usuario no tiene permiso de escritura, no
podrá modificar el contenido del archivo. El permiso de escritura se simboliza con la letra 'w' del inglés
'write'.

INGENIERIA DE SISTEMAS
UNAB – febrero 2021 © versión 4
Ejemplos:
✓ Si se tiene activo el permiso de escritura sobre el archivo miarchivito.txt, esto significa que se puede
modificar su contenido, incluso borrarlo. Si el usuario no tiene permiso de escritura, no podrá
modificar el contenido del archivo.
✓ Si se tiene permiso de escritura sobre un directorio, significa que puede modificar su contenido, es
decir, se pueden crear y eliminar archivos y otros directorios dentro. Si el usuario no tiene permiso
de escritura, no podrá crear ni eliminar archivos ni directorios dentro del mismo.
3. PERMISO DE EJECUCIÓN
Cuando un usuario tiene permiso de ejecución de un archivo significa que puede ejecutarlo. Si el usuario
no dispone de permiso de ejecución, no podrá ejecutarlo, aunque sea una aplicación. Los únicos
archivos ejecutables son las aplicaciones y los archivos de comandos (scripts). Si se trata de ejecutar un
archivo que no sea ejecutable, se generaran errores. El permiso de ejecución se simboliza con la letra
'x' del inglés 'eXecute'.
Ejemplo:
✓ Si se tiene activo el permiso de ejecución sobre un directorio, significa que puede entrar en el, bien
sea con el comando 'cd' o con un explorador de archivos. Si no dispone del permiso de ejecución
significa que no puede ingresar al mismo.

INGENIERIA DE SISTEMAS
UNAB – febrero 2021 © versión 4
4. ¿A quién se puede otorgar permisos?
Los permisos solamente pueden ser otorgados a tres tipos o grupos de usuarios:
✓ Al usuario propietario del archivo
✓ Al grupo propietario del archivo
✓ Al resto de usuarios del sistema (todos menos el propietario)
Se pueden dar permisos de lectura, escritura, ejecución o combinación de ambos al usuario propietario
del archivo, al grupo propietario del archivo o al resto de usuarios del sistema. En linux no existe la
posibilidad de asignar permisos a usuarios concretos ni a grupos concretos, tan solo se puede asignar
permisos al usuario propietario, al grupo propietario o al resto de usuarios.
Ejemplo:
Se dispone de un archivo llamado 'miarchivito.txt' cuyo propietario es el usuario 'profe' y cuyo grupo
propietario es 'mycatedra'. La siguiente figura representa los permisos de 'miarchivito.txt'
Esto significa que se pueden otorgar permisos de lectura, escritura, ejecución o una combinación de
ambos al usuario, al grupo y al resto de usuarios; pero no se pueden otorgar permisos a otros usuarios
distintos de profe, ni a otros grupos diferentes de mycatedra ya que el esquema de Unix no lo permite
5. PERMISOS EN FORMATO OCTAL
La combinación de valores de cada grupo de los usuarios rwx forma un número de tres bits que se
representa en el sistema de numeración octal, es decir que para la posición --x el valor en octal es 1,
ya que solo se tiene un bit de 1 en la posición de x, para la posición de -w- el valor en octal es 2, ya
que solo se tiene un bit de 1 en la posición de w, y para la posición de r-- el valor en octal es 4, ya que
solo se tiene un bit de 1 en la posición de r:
r = 4, w = 2, x = 1
La combinación de bits en cada una de las tres posiciones del grupo da como resultado ocho posibles
combinaciones de valores, es decir la suma de los pesos de los bits que estén en 1:

 INGENIERIA DE SISTEMAS
UNAB – febrero 2021 © versión 4

| Posición r w x  |        |     | Binario  | Octal  |     |                                    | Característica  |
| --------------- | ------ | --- | -------- | ------ | --- | ---------------------------------- | --------------- |
|                 | - - -  |     | 000      | 0      |     | no se tiene ningún permiso         |                 |
|                 | - - x  |     | 001      | 1      |     | solo permiso de ejecución          |                 |
|                 | - w -  |     | 010      | 2      |     | solo permiso de escritura          |                 |
|                 | - w x  |     | 011      | 3      |     | permisos de escritura y ejecución  |                 |
|                 | r - -  |     | 100      | 4      |     | solo permiso de lectura            |                 |
|                 | r - x  |     | 101      | 5      |     | permisos de lectura y ejecución    |                 |
|                 | r w -  |     | 110      | 6      |     | permisos de lectura y escritura    |                 |
|                 | r w x  |     | 111      | 7      |     | todos los permisos establecidos    |                 |

Ejemplos:

| PERMISOS  |     | VALOR  |     |     | DESCRIPCIÓN  |     |     |
| --------- | --- | ------ | --- | --- | ------------ | --- | --- |
rw-------  600  El propietario tiene permisos de lectura y escritura.
rwx--x--x  711  El propietario lectura, escritura y ejecución, el grupo y otros solo ejecución.
rwxr-xr-x  755  El propietario lectura, escritura y ejecución, el grupo y otros pueden leer y
ejecutar el archivo.
rwxrwxrwx  777  El archivo puede ser leído, escrito y ejecutado por quien sea.
r--------  400  Solo el propietario puede leer el archivo, pero ni el mismo puede
modificarlo o ejecutarlo y por supuesto ni el grupo ni otros pueden hacer
nada en él.
rw-r-----  640  El usuario propietario puede leer y escribir, el grupo puede leer el archivo y
otros no pueden hacer nada.

6.  ESTABLECIENDO PERMISOS CON EL COMANDO CHMOD

Para cambiar o establecer permisos se usa el comando chmod. La sintaxis es la siguiente:
chmod [opciones] permisos archivo[s]

Actividad practica:

Paso 2: Crear dos usuarios llamados de la siguiente manera sunombre y suapellido

# useradd sunombre
# useradd suapellido

Paso 3: Establecer la contraseña mycatedra12345 a cada usuario de la siguiente manera:

# passwd sunombre
# passwd suapellido

INGENIERIA DE SISTEMAS
UNAB – febrero 2021 © versión 4
Paso 4: Iniciar sesión con el usuario sunombre, para esto cierre sesión con el comando exit e ingrese
con este usuario.
# exit
Paso 5: Una vez iniciada la sesión con el usuario sunombre verifique en que directorio de trabajo está
ubicado con el comando pwd
$ pwd
El directorio de trabajo para ese usuario debe ser /home/sunombre, es importante saberlo para ver en
donde queda guardada la información que se desea crear.
Paso 6: Crear un archivo llamado conmipermiso.txt
$ echo “practica de asignación de permisos con chmod” > conmipermiso.txt
Paso 7: Listar el directorio /home/sunombre para mirar los permisos que tiene el archivo que se acabó
de crear
$ ls –l
Comente que sucedió:
________________________________________________________________________________________
________________________________________________________________________________________
Describa que permisos aparecen y quien tiene permisos
________________________________________________________________________________________
________________________________________________________________________________________
Paso 8: cierre la sesión usando el comando exit
$ exit
nuevamente ingrese pero esta vez con el usuario suapellido, verifique en que directorio de trabajo está
ubicado
$ pwd
Use los siguientes comandos y compruebe su funcionamiento
$ ls /home/sunombre
$ cd /home/sunombre

INGENIERIA DE SISTEMAS
UNAB – febrero 2021 © versión 4
$ touch /home/sunombre/ejemplito
$ mkdir /home/sunombre/carpetica
Puede ingresar a /home/sunombre, puede listar, puede crear archivos o directorios, Comente que sucedió en
cada caso:
________________________________________________________________________________________
________________________________________________________________________________________
Paso 9: cierre la sesión usando el comando exit
$ exit
nuevamente ingrese pero esta vez con el usuario sunombre
Paso 10: Cambie los permisos del archivo para que el usuario suapellido pueda acceder y modificar
este archivo. Antes se deben asignar permisos al directorio /home/sunombre, porque estos se
encuentran limitados el acceso para otros usuarios del sistema.
$ ls –l /home/
$ chmod 777 /home/sunombre
$ ls –l /home/
Comente que sucedió:
________________________________________________________________________________________
________________________________________________________________________________________
$ ls –l /home/sunombre
$ chmod 667 conmipermiso.txt
$ ls –l /home/sunombre
Comente que sucedió:
________________________________________________________________________________________
________________________________________________________________________________________
Paso 11: ahora inicia nuevamente sesión con el usuario suapellido y use los siguientes comandos y
compruebe su funcionamiento
$ ls /home/sunombre
$ cd /home/sunombre
$ touch /home/sunombre/ejemplito
$ mkdir /home/sunombre/carpetica
Paso 12: edite el archivo conmipermiso.txt
$ cd /home/sunombre
$ nano conmipermiso.txt
Cambie el texto y de ctrl x, y enter
Paso 13: cambie el nombre del archivo conmipermiso.txt
$ mv conmipermiso.txt consupermiso.txt

INGENIERIA DE SISTEMAS
UNAB – febrero 2021 © versión 4
Paso 14: Ahora ingrese como el usuario root y cree un archivo llamado miarchivito.txt en el directorio
/mycatedraserverfiles o /unabserverfiles (depende como lo haya llamado durante la instalación)
# cd /mycatedraserverfiles
# echo “julieta donde estas que no te veo” > archivoderomeo.txt
Paso 15: verifique los permisos con el comando
# ls -l
Paso 16: Cambiar los permisos para que solo el usuario root lo pueda leer y escribir
# chmod 600 archivoderomeo.txt
# ls –l
Comente que sucedió:
________________________________________________________________________________________
________________________________________________________________________________________
Paso 17: cambie nuevamente los permisos, pero esta vez para que todos tengan permiso de
ejecución y solamente el usuario dueño tenga lectura escritura y ejecución:
# chmod 711 miarchivito.txt
# ls –l
Comente que sucedió:
________________________________________________________________________________________
________________________________________________________________________________________
Paso 18: cambie nuevamente los permisos:
# chmod 722 miarchivito.txt
# ls –l
Comente que sucedió:
________________________________________________________________________________________
________________________________________________________________________________________

INGENIERIA DE SISTEMAS
UNAB – febrero 2021 © versión 4
7. CAMBIAR USUARIO PROPIETARIO Y GRUPO PROPIETARIO
Para poder cambiar el usuario propietario y el grupo propietario de un archivo o directorio se utilizan
los comandos:
✓ chown para los usuarios y
✓ chgrp para el grupo
La sintaxis de los comandos es:
chown nuevousuario nombrearchivo
chgrp nuevogrupo nombrearchivo
Nota: Para ejecutar estas opciones se debe disponer de permisos de escritura sobre el archivo o
directorio.
Paso 19: compruebe los permisos, usuario y grupo del archivo 'consupermiso.txt'
# ls –l /home/sunombre
Paso 20: cambie propietario del archivo del archivo 'consupermiso.txt'
# chown suapellido /home/sunombre/consupermiso.txt
# ls –l /home/sunombre
Paso 21: cambie el grupo del archivo del archivo 'consupermiso.txt'
# chgrp suapellido /home/sunombre/consupermiso.txt
# ls –l /home/sunombre
De esta manera se realizan los cambios de propietario y grupo con el fin de que el archivo herede los
permisos del nuevo usuario y del nuevo grupo.
Paso 22: ingrese con cada uno de los usuarios sunombre y suapellido y verifique los permisos de
'consupermiso.txt'

INGENIERIA DE SISTEMAS
UNAB – febrero 2021 © versión 4
8. OTRA FORMA DE ASIGNAR O CAMBIAR PERMISOS
Recirdemos que el comando chmod («change mode») permite quitar o eliminar derechos a cada tipo
de usuarios. Donde los tipos de usuarios se pueden especificar como u g o:
u – dueño: Dueño del archivo o directorio
g – grupo: Grupo al que pertenece el archivo
o – otros: Todos los demás usuarios que no son el dueño ni del grupo
Si no se especifica el tipo de usuario al realizar la operación se afectan todos los usuarios
simultáneamente. A continuación, se muestran algunos ejemplos:
Paso 23: Dar permiso de ejecución al dueño:
# chmod u+x miarchivito.txt
# ls –l
Paso 24: Quitar permiso de ejecución a todos los usuarios:
# chmod -x miarchivito.txt
# ls –l
Paso 25: Dar permiso de lectura y escritura a los demás usuarios:
# chmod o+r+w miarchivito.txt
# ls –l
Paso 26: Dejar solo permiso de lectura al grupo al que pertenece el archivo:
# chmod g+r-w-x miarchivito.txt
# ls –l
Comente que sucedió:
________________________________________________________________________________________
________________________________________________________________________________________
Paso 27: Compruebe que sucede con los siguientes comandos:
# chmod g+w miarchivito.txt
# ls –l
# chmod o-rx miarchivito.txt
# ls –l
# chmod u+x miarchivito.txt
# ls –l
# chmod a+x miarchivito.txt

INGENIERIA DE SISTEMAS
UNAB – febrero 2021 © versión 4
# ls –l
# chmod -rwx miarchivito.txt
# ls –l
# chmod +rwx miarchivito.txt
# ls –l
# chmod =r miarchivito.txt
# ls –l
# chmod g-x,o-x miarchivito.txt
# ls –l
# chmod u-x+w miarchivito.txt
# ls –l
# chmod =r miarchivito.txt
# ls –l
Paso 28: Consulte de que se tratan los permisos y haga un ejemplo de:
- El bit de permisos SUID (Set User ID)
- El bit de permisos SGID (Set Group ID) y
- El bit de permisos de persistencia (sticky bit).