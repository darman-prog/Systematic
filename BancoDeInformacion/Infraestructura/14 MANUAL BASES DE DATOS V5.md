MANUAL INSTALACION Y CONFIGURACION BASES DE DATOS

¿QUÉ ES UN SERVIDOR DE BASE DE DATOS?

Un servidor de bases de datos se utiliza para almacenar, recuperar y administrar los datos de una base
de datos. El servidor gestiona las actualizaciones de datos, permite el acceso simultáneo de muchos
servidores o usuarios web y garantiza la seguridad y la integridad de los datos. Y cuando hablamos de
datos, podemos estar hablando sobre millones de elementos a los que acceden al mismo tiempo miles
de usuarios.

Así como sus funciones básicas, el software de servidores de bases de datos ofrece herramientas para
facilitar y acelerar la administración de bases de datos. Algunas funciones son la exportación de datos,
la configuración del acceso de los usuarios y el respaldo de datos.

¿CÓMO SE USAN LAS BASES DE DATOS?

Las bases de datos tienen todo tipo de usos, como gestión de documentos, gestión de registros, índices
de motores de búsqueda, para servidores de correo electrónico y para brindar contenido dinámico de
páginas web. Una persona, aplicación o script de página web puede consultar la base de datos con el
lenguaje SQL.

Los servidores de bases de datos se usan en el alojamiento de páginas web para insertar contenido en
páginas web dinámicas. Las páginas dinámicas utilizan diseños de tipo estándar que son llenadas con
información en función de la dirección URL de la página, o de otras variables como las credenciales de
usuario o las acciones que se realicen en la página. Algunos ejemplos de páginas dinámicas que utilizan
bases de datos son los siguientes:

•  Contenido en publicaciones de blogs o páginas de categoría de blogs
•  Anuncios clasificados de empleos o sitios web de clasificados
•
Información de directorios web y mapas
•  El contenido de su actividad en Facebook
•  Resultados de Google y otras búsquedas
•  Secciones de contenido administrable en sitios web
•  Listas de productos de sitios de comercio electrónico y detalles de procesos de compra
•  Detalles y configuración de la cuenta cuando inició sesión en un sitio web

¿CUÁLES SON LOS SERVIDORES DE BASES DE DATOS MÁS CONOCIDOS?

Los cinco servidores de base de datos de empresas más conocidos son:

•  Oracle

•  SQL Server

•  Postgres SQL

•  Sybase

•  MySQL

CONFIGURACION Y PRÁCTICA

1.  Primero vamos a proceder a instalar el paquete de bases de datos en este caso vamos a realizar
la instalación y configuración del motor de bases de datos llamado postgreSQL, para instalarlo
vamos a ejecutar la siguiente línea de comandos:

dnf –y install postgresql postgresql-libs postgresql-contrib postgresql-server postgresql-
docs

2.  Ahora después de instalar el motor de bases de datos procedemos a habilitar el servicio de base
de datos, para eso ejecutamos la siguiente línea de comandos así como lo muestra la imagen:

postgresql-setup --initdb

3.  Ahora iniciamos el servicio de postgresql a través de la siguiente línea de comando, después
hacemos un status para ver si inicio correctamente el servicio tal como lo muestra la imagen:

Iniciar el servicio

systemctl start postgresql.service

Verificar el estado del servicio

systemctl status postgresql.service

luego ctrl + c

4.  Ahora vamos a cambiar la contraseña del usuario postgres que se crea en el sistema al momento
de instalar el servicio de bases de datos, lo hacemos a través de la siguiente línea de comandos:

passwd postgres

Le asignaremos la siguiente contraseña pg.admserver (cuando la este digitando no se ve lo
que se esta ingresando)

5.  Ahora vamos iniciar el motor de base de datos con el usuario postgres, utilizando la siguiente

línea de comandos:

su postgres

Aparecerá una consola de la siguiente manera:

 “bash-5.0$” tal como lo muestra la imagen:

6.   Una vez estando en la consola iniciamos el motor de base de datos utilizando el siguiente

comando así tal como lo muestra la imagen:

psql

7.  Ahora una vez dentro del motor vamos a proceder a cambiar la contraseña del usuario
postgres también para asignarle la misma contraseña anterior pg.admserver, para esto
utilizaremos la siguiente línea de comandos:

ALTER USER postgres WITH PASSWORD ‘pg.admserver’;

Así tal como lo muestra la imagen:

Ahora salimos de la consola utilizando el siguiente comando \q, después el comando exit y
con esto volvemos a la consola de fedora.

8.  Ahora vamos a configurar el puerto el cual utiliza postgresql para esto debemos abrir el archivo
de  configuración  y  realizar  las  siguientes  modificaciones,  el  archivo  de  configuración  se
encuentra en la siguiente ubicación:

nano /var/lib/pgsql/data/postgresql.conf

Hacemos lo siguiente:

En la línea que dice #listen_addresses = ‘localhost’ lo cambiamos por listen_addresses = ‘*’

Ahora en la line que dice #port = 5432 lo cambiamos por port = 5432

Así tal como lo muestra la imagen:

Guardamos el archivo y reiniciamos el servicio de postgres para que surta efecto los cambios en el
archivo de configuración, para esto lo hacemos con la siguiente línea de comandos:

systemctl restart postgresql.service

9.  El  procedimiento anterior que se realizo fue habilitar el puerto de conexión que utiliza portgresql
para su funcionamiento normal, además habilitamos todas las conexiones entrantes no solo las
locales, ahora lo que vamos a realizar es habilitar las conexiones remotas al servidor con el fin
de que las maquinas clientes se puedan conectar al servicio de base de datos para esto debemos
ubicar y editar el siguiente archivo:

nano /var/lib/pgsql/data/pg_hba.conf

Este es el archivo original:

10. Ubicamos las líneas donde se declaran las conexiones ipv4 y justo allí procedemos a declarar las

conexiones permitidas y rechazadas.

La sección ipv4 consta de 5 parámetros para la declaración de conexiones.
1. El tipo de conexión, el cual puede ser local o host para indicar que es remoto.
2.  DATABASE,  que  permite  definir  la  base  de  datos  a  la  cual  tendrá  acceso  el  usuario  de  la
conexión.
3. USER, define los usuarios que quiero sean afectados por dicha regla.
4 ADDRESS, permite definir la ip o las ip  desde las cuales se va a permitir la conexión.

5. METHOD, permite definir qué tipo de método usara el usuario para conectar con nuestra base
de datos.

Así como lo muestra la imagen:

Los parámetros 2, 3 y 4 pueden ser definidos por medio de all, esto para indicar que el usuario
se puede conectar a cualquier base de datos, cualquier usuario puede realizar la conexión y esta
se puede hacer desde cualquier dirección IP.

11. Agregamos  una  línea  para  indicar  que  se  puedan  establecer  conexiones  desde  cualquier  IP
(0.0.0.0/0),  por  cualquier  usuario  y  a  cualquier  base  de  datos.  Vale  destacar  que  aunque  se
permita el acceso a cualquier base de datos estos deben estar definidos en el motor propio de
la  base  de  datos,  de  lo  contrario  solo  se  permitirá  el  acceso  de  acuerdo  a  los  privilegios  del
usuario.

El archivo debe quedar así tal como lo muestra la imagen:

12.  Una  vez  modificado  el  archivo  y  adicionada  la  línea  tal  como  lo  muestra  la  imagen  anterior
guardamos el archivo y reiniciamos el servicio de postgresql con la siguiente línea de comandos:

systemctl restart postgresql.service

13. ahora vamos a desactivar el servicio de selinux el cual permite mostrar y advertirnos de errores
en archivos de configuración en servidores, por esta razón lo vamos a desactivar para que no
interfiera en el buen funcionamiento del servicio ftp el archivo se encuentra en la siguiente ruta
y debe quedar configurado tal como lo muestra la imagen:

nano /etc/selinux/config

14.  Ahora vamos a desactivar el firewall o corta fuegos de los dos sistemas operativos tal como lo

muestran las imágenes:

PARA FEDORA

Desactivar firewall

systemctl stop firewalld.service

Verificar el estado del servicio

systemctl status firewalld.service

✓  CREAR BASE DE DATOS

CREATE DATABASE nombre_base_datos;

✓  CREAR UNA TABLA

CREATE TABLE factura (codfactura varchar(20));

✓  VER DESCRIPCION DE LA TABLA

\d

✓  VER BASE DE DATOS EXISTENTES

\l

✓  CREAR USUARIO

CREATE USER nombre_ usuario WITH PASSWORD ‘contraseña’;

✓  ASIGNAR USUARIO A LA BASE DE DATOS CON PERMISOS TOTALES

GRANT ALL PRIVILEGES ON DATABASE nombre_base_datos to nombre_usuario;

Salimos de postgres para comprobar lo que se hizo \q y después exit

PROCEDIMIENTO PARA AGREGAR UN USUARIO A LA BASE DE DATOS POSTGRESQL

1.  AÑADIMOS UN NUEVO USUARIO A FEDORA

Agregaremos de la siguiente manera el usuario llamado user1

useradd user1(asignamos la contraseña 123456)

2.  AGREGAR CONTRASEÑA AL USUARIO

passwd user1

3.  INICIAMOS CON EL USUARIO POSTGRES

 su postgres

4.  AHORA NOS CONECTAMOS A LA BASE DE DATOS POSTGRESQL

psql

5.  AHORA CREAMOS EL USUARIO user1 EN POSTGRESQL CON LA MISMA CONTRASEÑA

QUE SE CREO
CREATE USER user1 WITH PASSWORD '123456';

6.  AHORA CREAMOS UNA BASE DE DATOS LLAMADA bd_inventarios

CREATE DATABASE bd_inventarios;

7.  AHORA ASIGNAMOS EL USUARIO user1  A LA BASE DE DATOS bd_inventarios CON

PRIVILEGIOS TOTALES
GRANT ALL PRIVILEGES ON DATABASE bd_inventarios to user1;

8.  AHORA SALIMOS DE POSTGRESQL

\q
Exit

9.  AHORA INGRESAMOS DESDE LA CONSOLA CON EL usuario1

su user1

10. AHORA INGRESAMOS A POSTGRES CON LA BASE DE DATOS bd_inventarios Y EL

USUARIO user1
psql -d bd_inventarios -U user1

