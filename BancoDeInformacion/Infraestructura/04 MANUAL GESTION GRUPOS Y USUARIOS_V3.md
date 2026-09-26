INGENIERIA DE SISTEMAS
UNAB – Febrero 2021 © versión 4
ADMINISTRACIÓN DE USUARIOS Y GRUPOS
GNU/Linux es un sistema operativo multiusuario, y los usuarios pueden pertenecer a uno o varios grupos. La
existencia de grupos hace más sencilla la administración del sistema, pues permite garantizar permisos y demás
a grupos en lugar de tener que hacerlo usuario por usuario.
Cuando se crea un usuario en GNU/Linux este se agrega a un determinado grupo, en algunas distribuciones es
el grupo users, y en otras a un grupo con el mismo nombre del usuario. Así, el usuario mycatedra estará en el
grupo mycatedra por defecto.
Si para efectos de administración se requiere que determinados usuarios estén en un grupo específico, es
necesario agregarlos al mismo. Existen tres formas básicas de hacer esto.
• Agregar al usuario a varios grupos al momento de crearlo
• Agregar al usuario a un grupo, cuando ya existe
• Cambiar a un usuario existente de un grupo a otro
1. CREACION DE USUARIOS
El comando useradd permite añadir un usuario indicando como parámetros la información particular para crear
el usuario en la misma línea de comandos. La sintaxis es:
useradd -g <grupoprincipal> -d <carpetahomedeusuario> -m -s <interpretedecomandos>
<nombredeusuario>
donde:
• -g: Grupo principal al que se quiere pertenezca el usuario (debe existir previamente)
• -d: Carpeta home del usuario. Es la carpeta personal del ususrio, generalmente /home/nombreusuario
• -m: Crear carpeta home (si no existe).
• -s: Intérprete de comandos (shell del usuario). Generalmente: /bin/bash
2. CREACION DE GRUPOS
El comando groupadd permite añadir un grupo indicando como parámetro el nombre del grupo. La sintaxis es:
groupadd nombre-grupo
Paso 1: Crear el grupo mycatedra:
# groupadd mycatedra
Paso 2: Crear 2 usuarios uno sunombre y otro suapellido cuyo grupo principal sea 'mycatedra', cuya carpeta
home sea /home/mycarpetasunombre y /home/mycarpetasuapellido y para ambos el intérprete de comandos
/bin/bash.
Para crear los grupos ejecute los siguientes comandos:
# useradd -g mycatedra -d /home/mycarpetasunombre -m -s /bin/bash sunombre
# useradd -g mycatedra -d /home/mycarpetasuapellido -m -s /bin/bash suapellido
Nota: Si no se usa la opción -m, no se creará la carpeta home del usuario; en tal caso se tendrá que crear
manualmente.
Nota: Se recomienda que el nombre de usuario sea en minúsculas, aunque además de letras también puede
contener números y algún signo como guiones normales y guiones bajos. Debemos recordar que linux distingue
entre mayúsculas y minúsculas, es decir, Profe es distinto de profe.

INGENIERIA DE SISTEMAS
UNAB – Febrero 2021 © versión 4
3. ESTABLECER LA CONTRASEÑA DEL USUARIO
Paso 3: Establecer la contraseña de los usuarios creados para eso use el comando passwd nombre-usuario,
de la siguiente manera:
# passwd sunombre
El sistema preguntará la contraseña que se desea asignar a sunombre, digítela dos veces
# passwd suapellido
El sistema preguntará la contraseña que se desea asignar a suapellido, digítela dos veces
Nota: para cambiar el la contraseña de root se hace de la siguiente manera
# passwd
El sistema preguntará la contraseña que se desea asignar a root, digítela dos veces
4. INGRESAR COMO USUARIO
Paso 4: Después de creados los usuarios se pueden comprobar usando el comando su de la siguiente manera:
# su sunombre
# pwd
# ls
# exit
//comando para salir de la sesión del usuario root
# su suapellido
# pwd
# ls
# exit
Nota: Para salir del root se da exit nuevamente y asi se regresa al login para iniciar la nueva sesión.
5. DONDE SE GUARDAN LOS USUARIOS
Linux contiene un archivo importante el cual contiene toda la información relacionada con los usuarios del
sistema, ese archivo se llama passwd y se ubica en /etc: /etc/passwd
Paso 5: verifique el contenido del archivo passwd con el siguiente comando:
# more /etc/passwd
Allí se identifican diversos campos y que están separados por el símbolo de dos puntos: de la siguiente manera:

 INGENIERIA DE SISTEMAS
UNAB – Febrero 2021 © versión 4

sunombre : x : 500 : 501 : sunombre: /home/micarpeticaasunombre : /bin/bash
El significado de cada campo es el siguiente:

|     | sunombre:  | Nombre de la cuenta  |     |     |
| --- | ---------- | -------------------- | --- | --- |
x:  Campo de la clave (en las nuevas versiones de
linux se guardan en el archivo shadow)
500:  UID identificador del usuario
501:  GID identificador del grupo al que pertenece el
usuario
|     | sunombre:  | Nombre del usuario  |     |     |
| --- | ---------- | ------------------- | --- | --- |
/home/micarpeticaasunombre:  Directorio de trabajo de usuario1
|     | /bin/bash:  | Interprete de comando (shell) de usuario pepito  |     |     |
| --- | ----------- | ------------------------------------------------ | --- | --- |

El UID 0 pertenece al administrador (root)
Los UID por debajo de 1000 están reservados para el sistema
Los UID por encima de 1000 identifican los usuarios del sistema
(Nota: la frontera del 1000 puede variar dependiendo del sistema operativo linux).

Paso 6: verifique los campos anteriores para los usuarios sunombre y suapellido:
| Opciones                  |     | sunombre  |     | suapellido  |
| ------------------------- | --- | --------- | --- | ----------- |
| Nombre de la cuenta       |     |           |     |             |
| Clave cifrada (password)  |     |           |     |             |
| UID                       |     |           |     |             |
| GID                       |     |           |     |             |
| Nombre de usuario         |     |           |     |             |
| Directorio de trabajo     |     |           |     |             |
| Interprete de comandos    |     |           |     |             |
(shell)

6.  DONDE SE GUARDAN LAS CONTRASEÑAS CIFRADAS

Linux contiene un archivo importante el cual contiene toda la información relacionada con las contraseñas
cifradas de los usuarios del sistema, ese archivo se llama shadow y se ubica en /etc: /etc/shadow

Paso 7: verifique el contenido del archivo  con el siguiente comando:

# more /etc/shadow

|     |     |     |     |     |
| --- | --- | --- | --- | --- |

INGENIERIA DE SISTEMAS
UNAB – Febrero 2021 © versión 4
7. DONDE SE GUARDAN LOS GRUPOS
Linux contiene un archivo en el cual se guarda la información relacionada con los grupos a los cuales pertenecen
los usuarios del sistema, ese archivo se llama group y se ubica en /etc: /etc/group
Paso 8: verifique el contenido del archivo con el siguiente comando:
# more /etc/group
Allí se identifican diversos campos separados por el símbolo de dos puntos:
mycatedra: x : 1003
• Nombre del grupo. El nombre del grupo.
• ID del grupo (GID). El identificador del nombre del grupo.
8. QUE ES EL INTÉRPRETE DE COMANDOS
El intérprete de comandos es la interfaz entre el usuario y el sistema operativo, se le da el nombre de "shell",
que significa "caparazón".
El intérprete de comandos, Shell actúa como un intermediario entre el sistema operativo y el usuario gracias a
líneas de comando que este último introduce. Su función es la de leer la línea de comandos, interpretar su
significado, llevar a cabo el comando y después arrojar el resultado por medio de las salidas.
9. MODIFICACION DE USUARIOS
Para modificar usuarios se utiliza el comando usermod, el cual permite cambiar: nombre del usuario, carpeta
home de usuario, intérprete de comandos, y los grupos a los que pertenece. La Sintaxis es:
usermod [opciones] nombredeusuario
Paso 9: para cambiar el grupo del usuario sunombre que es mycatedra, verifique el GID, luego cree un nuevo
grupo llamado sistemas. Verifique el archivo passwd para observar los datos actuales del usuario sunombre,
de la siguiente manera:
# cat /etc/passwd
# groupadd sistemas
# usermod –g sistemas sunombre
# cat /etc/passwd
Comente que sucedió:
________________________________________________________________________________________
________________________________________________________________________________________

INGENIERIA DE SISTEMAS
UNAB – Febrero 2021 © versión 4
Paso 10: Modificar la carpeta home, /home/micarpeticasunombre (verifíquela con ls), por /home/micarpetica de
la siguiente manera:
# ls /home/
# usermod –d /home/lacarpeticasuya -m sunombre
# cat /etc/passwd
# ls /home/
Comente que sucedió:
________________________________________________________________________________________
________________________________________________________________________________________
Paso 11: para cambiar el nombre del usuario, se usa el comando usermod seguido del nuevo nombre del usuario, y el
antiguo nombre.
# usermod -l nombredeuncompañero sunombre
# cat /etc/passwd
Comente que sucedió:
________________________________________________________________________________________
________________________________________________________________________________________
Paso 12: para cambiar el gid del usuario, se usa el comando usermod seguido del nuevo gid del usuario, y el nombre de
usuario
# usermod -u 2020 sunombre
# cat /etc/passwd
# id sunombre
Comente que sucedió:
________________________________________________________________________________________
________________________________________________________________________________________
10. ELIMINACION DE USUARIOS
Se realiza con el comando userdel seguido del nombre del usuario. Con la opción -r eliminará también su
carpeta home. La Sintaxis es:
userdel [opciones] nombre-usuario
Paso 13: elimine el usuario nombredeuncompañero
# userdel -r nombredeuncompañero
Elimine el usuario suapellido
# userdel suapellido
Verifique con los comandos
# cat /etc/passwd
# ls /home/

INGENIERIA DE SISTEMAS
UNAB – Febrero 2021 © versión 4
Comente que sucedió:
________________________________________________________________________________________
________________________________________________________________________________________
11. MODIFICACION DE GRUPOS
El comando groupmod permite modificar el nombre de un grupo o su GID. La Sintaxis es:
groupmod [-g nuevo-gid] nombre-grupo:
Paso 14: Cambiar el GID del grupo mycatedra
# groupmod -g 2021 mycatedra
Verifique con el comando
# cat /etc/group
Comente que sucedió:
________________________________________________________________________________________
________________________________________________________________________________________
Paso 15: para cambiar del nombre del grupo se hace de la siguiente manera:
# groupmod -n servidores sistemas
Verifique con el comando
# cat /etc/group
Comente que sucedió:
________________________________________________________________________________________
________________________________________________________________________________________
12. ELIMINACIÓN DE GRUPOS
Se realiza con el comando groupdel seguido del nombre del grupo. La Sintaxis es:
groupdel nombre-grupo
Paso 16: cree un grupo y elimínelo, con los siguientes comandos. La opción –r nos permite eliminar el grupo
con todo y su directorio del sistema.
# groupadd miprofe
# cat /etc/group
# groupdel miprofe
# groupdel -r mycatedra
Comente que sucedió:
________________________________________________________________________________________
________________________________________________________________________________________

INGENIERIA DE SISTEMAS
UNAB – Febrero 2021 © versión 4
Nota: Si algún usuario tuviera dicho grupo como grupo primario, el comando groupdel no eliminará el grupo para
eliminarlo primero es necesario cambiar el grupo de usuario.