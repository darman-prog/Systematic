MANUAL INSTALACION Y CONFIGURACION SERVICIO HTTP

Los servidores web son aquellos cuya tarea es alojar sitios y/o aplicaciones, las cuales son accedidas
por los clientes utilizando un navegador que se comunica con el servidor utilizando el protocolo HTTP
(hypertext markup language).

Básicamente un servidor WEB consta de un intérprete HTTP el cual se mantiene a la espera de peticiones
de clientes y le responde con el contenido según sea solicitado. El cliente, una vez recibido el código,
lo interpreta y lo muestra en pantalla.

¿QUÉ ES APACHE?

El  servidor  HTTP  Apache  es  un  servidor  web  HTTP  de  código  abierto  para  plataformas  Unix  (BSD,
GNU/Linux, etc.), Windows, Macintosh y otras, que implementa el protocolo HTTP/1.1 y la noción de
sitio virtual.

El  servidor  Apache  se  desarrolla  dentro  del  proyecto  HTTP  Server  (httpd)  de  la  Apache  Software
Foundation.

Apache es altamente configurable, admite bases de datos de autenticación y negociado de contenido,
aunque carece de una interfaz gráfica que ayude en su configuración.

Apache es una aplicación que permite montar un servidor web en cualquier equipo y casi cualquier
sistema  operativo.  Al  contrario  que  IIS  (Internet  Information  Server)  que  sólo  funciona  en  sistemas
operativos de Microsoft.

Apache  soporta  PHP  como  lenguaje  de  programación.  Con  los  módulos  adecuados,  Apache  puede
soportar también ASP.

CONFIGURACION E INSTALACION SERVICIO HTTP

1.  Lo primeros que vamos a hacer es instalar el paquete para poder utilizar el servicio para esto

ejecutaremos la siguiente línea de comandos así tal como lo muestra la imagen:

dnf install httpd php php-common

2.  Una  vez  instalado  el  servicio  correctamente  vamos  al  archivo  de  configuración  para  mirar  en
donde podemos cambiar el puerto que utiliza el servicio por defecto es el puerto 80, pero suele
suceder que en algunos servidores ese puerto ese ocupado y toque cambiarlo por algún puerto
http  alternativo  para  verificar  esto  vamos  al  siguiente  archivo  de  configuración  tal  como  lo
muestra la imagen:

nano /etc/httpd/conf/httpd.conf

3.  Salimos del archivo de configuración e iniciamos el servicio httpd con la siguiente línea de

comandos:

systemctl start httpd.service

4.  Luego verificamos que el servicio este corriendo correctamente con la siguiente línea de

comandos tal como lo muestra la imagen:

systemctl status httpd.service

5.  Ahora vamos a instalar el módulo de php para que nuestro servidor web trabaje aplicaciones en

lenguaje php y lo hacemos con la siguiente línea de comandos:

dnf install php-pear php-pdo php-mysqlnd php-pgsql php-pecl-memcache php-gd php-
mbstring php-mcrypt php-xml php-json

6.  Una vez instalado el módulo de php correctamente reiniciamos el servicio httpd con la siguiente

línea de comandos para que tome los cambios efectuados:

systemctl restart httpd.service

7.  Ahora debemos conocer cuál es el directorio donde debemos alojar nuestros sitios web para la

correcta publicación el directorio es el siguiente:

/var/www/html

8.   ahora vamos a desactivar el servicio de selinux el cual permite mostrar y advertirnos de

errores en archivos de configuración en servidores, por esta razón lo vamos a desactivar para
que no interfiera en el buen funcionamiento del servicio ftp el archivo se encuentra en la
siguiente ruta y debe quedar configurado tal como lo muestra la imagen:

nano /etc/selinux/config

9.   Ahora vamos a desactivar el firewall o corta fuegos de los dos sistemas operativos tal como lo

muestran las imágenes:

Desactivar firewall

systemctl stop firewalld.service

Verificar el estado del servicio

systemctl status firewalld.service

10. Una vez realizadas estas configuraciones procederemos a crear el siguiente archivo con el editor
nano para probar desde la maquina cliente la de Windows xp si el servidor está funcionando
correctamente:

nano /var/www/html/phpinfo.php

Debe llevar las siguientes líneas tal como lo muestra la imagen:

11. Ahora nos queda probar en la maquina cliente a través del navegador si funciona el servicio que
acabamos  de  configurar  para  esto  debemos  saber  la  dirección  ip  del  servidor  de  fedora  y  lo
probaremos tal como lo muestra la imagen:

PROBANDO SERVICIO HTTPD

AHORA PROBANDO MODULO DE PHP

Con esto hemos concluido la configuración del servidor web listo para utilizar en nuestras aplicaciones.

Puede editar el archivo para que muestre su nombre, por ejemplo;

<?php
date_default_timezone_set('America/Bogota');

$script_tz = date_default_timezone_get();

if (strcmp($script_tz, ini_get('date.timezone'))){
echo 'La zona horaria del script DIFIERE  de la zona horaria de la configuracion ini.';
} else {
echo 'La zona horaria del script y la zona horaria de la configuracion ini COINCIDEN.';
}
?>

