# ADR 008: Cuenta y sincronización con Firestore

## Contexto

La app es un sitio estático en Vercel sin backend: todo el progreso vive en `localStorage`
con namespace `sys.*` (spec 006) y está centralizado en la fachada `crearPersistencia(storage)`
(`src/student/persistencia.js`). Los usuarios piden crear cuenta e iniciar sesión para llevar
su progreso entre dispositivos.

Restricciones vigentes: sin CDN en runtime, sin backend propio, offline-first (la app debe
funcionar sin conexión y sin cuenta), free tier. El import/export JSON v2 ya existe
(`src/app.js`) y define la forma serializable del estado.

## Decisión

- **Firebase Auth + Firestore** como única dependencia externa: registro e ingreso con
  email/contraseña y Google, y un documento por usuario `estudiantes/{uid}` que contiene un
  snapshot completo del estado local (formato `nube-1`).
- **localStorage sigue siendo la fuente de verdad en runtime**; la nube es un espejo. La
  sincronización es explícita (subir / restaurar) y, si hay datos locales y remotos, se
  pregunta al usuario cuál conservar (nunca auto-merge).
- **SDK cargado bajo demanda** con `import()` dinámico y activado por las variables
  `VITE_FIREBASE_*`. Sin claves configuradas, la cuenta se deshabilita y la app sigue 100%
  local (mismo patrón que la carga de contenido por track).
- **Reglas de seguridad en `firestore.rules`**: solo el dueño autenticado puede leer o
  escribir su documento. Las claves web de Firebase son identificadores públicos; la
  seguridad real vive en las reglas.
- Módulos: `src/student/firebase.js` (adaptador), `src/student/cuenta.js` (sesión),
  `src/student/nube.js` (sync) y `src/core/nube/snapshot.js` (dominio puro del snapshot).

## Consecuencias

- Positivas: cuenta y respaldo sin backend propio ni servidor que mantener; la app sigue
  funcionando sin cuenta; el cambio es reversible (los servicios son inyectables y los tests
  usan fakes, sin red).
- Negativas y mitigaciones:
  - Se agrega la dependencia `firebase` (chunk lazy, no entra al bundle principal) y un
    `overrides` de `@grpc/grpc-js` parcheado para no arrastrar CVEs del árbol del SDK.
  - Vendor lock-in moderado en Google; migrar después implica cambiar el adaptador, no los
    servicios.
  - Datos personales: solo email, nombre (opcional) y datos de estudio; sin datos sensibles.
  - La sincronización es manual en el MVP; el auto-sync queda como fase posterior.

## Alternativas descartadas

- **Supabase (Postgres)**: el proyecto free se pausa tras ~7 días sin uso, justo cuando el
  estudiante vuelve después de un parón.
- **SQLite serverless (Turso/D1) + backend propio**: exige construir autenticación (hash,
  tokens, reset por email, rate limiting) y suma superficie de seguridad; la app no tiene
  backend.
- **Backend propio en Vercel + Postgres**: más trabajo y mantenimiento que el valor que
  aporta en esta fase.
- **Auto-merge por última escritura**: podía pisar trabajo reciente sin avisar; se eligió
  preguntar al usuario.

## Actualización de implementación (2026-10-05)

- El documento en Firestore guarda el snapshot como **texto JSON** (campo `datos`) más `version`
  y `actualizadoEn` (serverTimestamp). El cliente corta en 900 kB medidos en bytes UTF-8 y las
  reglas además exigen `datos` string, `< 900000` caracteres y `version` entera.
- La sesión usa la persistencia por defecto del SDK (IndexedDB) y se restaura con
  `onAuthStateChanged` al arrancar; cerrar sesión solo repinta la UI (el progreso local queda).
- Arranque: con claves configuradas, el primer contacto en un navegador nuevo es la pantalla de
  acceso (login/registro) con la puerta "Continuar sin cuenta" hacia el onboarding local; al
  iniciar sesión con un respaldo disponible se ofrece restaurarlo. Sin claves, la app queda
  100% local como siempre.
- Google exige configuración en la consola: proveedor habilitado en *Sign-in method* y el
  dominio en *Authorized domains* (`systematicx.vercel.app` y `localhost` para desarrollo);
  sin eso el SDK falla con `auth/unauthorized-domain`. Si el navegador bloquea el popup, el
  adaptador reintenta con `signInWithRedirect` y la sesión se resuelve al volver por
  `onAuthStateChanged`.
- Limitaciones conocidas:
  - En un navegador compartido, el progreso local no está aislado por cuenta: una segunda cuenta
    ve el progreso anterior y podría subirlo. Mitigación futura: guardar el último `uid` y
    ofrecer limpiar/restaurar al detectar cambio de cuenta.
  - La enumeración de correos en el registro (`auth/email-already-in-use`) depende de la
    configuración de Firebase: conviene activar "Email Enumeration Protection" en la consola.
  - El sitio todavía no define una CSP propia.
- Despliegue de reglas manual: pegar `firestore.rules` en la consola de Firebase (no hay
  `firebase.json`). La guía operativa está en [docs/guias/aplicar-snapshots.md](../guias/aplicar-snapshots.md).
