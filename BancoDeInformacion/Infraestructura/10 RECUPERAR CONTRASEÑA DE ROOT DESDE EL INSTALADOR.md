CAMBIAR CONTRASEÑA DE ROOT DESDE EL ISO DE INSTALACIÓN

El objetivo de este manual es poder cambiar la contraseña del usuario administrador root cuando por
algún motivo se olvida y no se tiene ningún otro usuario para iniciar sesión en el sistema. Este caso
ocurre frecuentemente con las primeras instalaciones en consola. A continuación, se muestra paso a
paso el proceso para la recuperación:

1.  Para iniciar el proceso del cambio de contraseña se debe reiniciar el sistema e ingresar a través

del ISO de instalación de fedora y arrancar por la opción Troubleshooting:

2.  Luego se selecciona la opción Rescue a Fedora System:

3.  Una vez cargado el sistema de recuperación de fedora se selecciona la opción1 escriba 1 y de

Enter para aceptar y luego nuevamente Enter para ingresar al shell.

4.  Con el proceso se inicia la consola de recuperación:

5.  Luego se digita  el comando chroot /mnt/sysroot y damos enter para montar en la partición

/mnt el archivo sysroot que permitirá cambiar la contraseña de root.

6.  Ahora se digita el comando passwd  para asignar la nueva contraseña. Se digita la contraseña
y se da Enter, y se digita nuevamente para confirmar y se da Enter,. Si todo es correcto saldrá
un aviso de que todos los tokens de autenticación fueron actualizados correctamente.

7.  Luego se escribe exit

8.  Y se escribe el comando reboot para reiniciar el sistema.

9.  Se debe quitar el ISO de instalación parea que el sistema reinicie normalmente, el proceso de

inicio puede tardar unos minutos mientras se actualiza la información modificada.

