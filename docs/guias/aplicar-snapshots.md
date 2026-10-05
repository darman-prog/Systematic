# Guía: respaldo y restauración de snapshots

Referencia del flujo de cuenta y nube (ADR 008) ya implementado. Leela antes de tocar
`src/student/{firebase,cuenta,nube,aplicar}.js`, `src/core/nube/snapshot.js` o las acciones de
cuenta de `src/app.js`.

## 1. Qué es un snapshot

Un snapshot es una copia completa y serializable del estado del estudiante, con formato
`nube-1`. Se construye con `construirSnapshot()` (`src/core/nube/snapshot.js`) al subir y se
valida con `validarSnapshot()` al bajar (`src/student/nube.js` ya lo hace por vos).

```js
{
  app: "systematic",
  formato: "nube-1",
  exportado: "2026-01-02T03:04:05.000Z",   // fecha ISO del respaldo
  nombre: "Ana",
  global: { xp, xpEventos, logros, escenarios, casos, onboarding },
  materias: { bd2: { progreso, historial, actividad, meta, misiones }, ... },
  lenguajes: { "lenguaje-ts": { competencia: { etapaId: { aprobado, version } } }, ... }
}
```

En Firestore el documento `estudiantes/{uid}` guarda ese snapshot como **texto JSON**:

```js
{ datos: "{\"app\":\"systematic\",...}", version: 1, actualizadoEn: <serverTimestamp> }
```

Así se evitan restricciones de campos de Firestore y el esquema puede evolucionar sin tocar el
documento. El tope es 900 kB en bytes UTF-8 (el documento admite 1 MiB).

## 2. Flujo completo

```
Subir:   estado local → construirSnapshot() → nube.subir(uid) → estudiantes/{uid}
Bajar:   estudiantes/{uid} → nube.bajar(uid) → validarSnapshot() → confirm(fecha)
         → aplicarSnapshot() → location.reload()
```

Reglas de oro (ADR 008):

- **Nunca apliques datos crudos de la red**: `nube.bajar()` ya devuelve validado; si algún día
  aplicás desde otra fuente, pasala antes por `validarSnapshot()`.
- **Siempre preguntá al usuario** antes de pisar (`confirm` con la fecha de `fechaSnapshot`).
- **Recargá la página** después de aplicar: el estado en memoria (`progreso`, perfil, track)
  está repartido entre módulos y `location.reload()` lo re-lee desde `localStorage`.

## 3. Mapa campo → método de persistencia

`aplicarSnapshot(datos, persistencia)` recibe la fachada de `src/student/persistencia.js`.
No hay que tocar `localStorage` a mano: usá estos métodos.

| Campo del snapshot | Método |
|---|---|
| `datos.nombre` | `persistencia.guardarNombre(valor)` |
| `datos.global.xp` | `persistencia.guardarXp(valor)` |
| `datos.global.xpEventos` | `persistencia.guardarXpEventos(valor)` |
| `datos.global.logros` | `persistencia.guardarLogros(valor)` |
| `datos.global.escenarios` | `persistencia.guardarEscenarios(valor)` |
| `datos.global.casos` | `persistencia.guardarCasos(valor)` |
| `datos.global.onboarding === true` | `persistencia.guardarOnboardingHecho()` |
| `datos.materias[id].progreso` | `persistencia.guardarProgreso(id, valor)` |
| `datos.materias[id].historial` | `persistencia.guardarHistorial(id, valor)` |
| `datos.materias[id].actividad` | `persistencia.guardarActividad(id, valor)` |
| `datos.materias[id].meta` | `persistencia.guardarMeta(id, valor)` |
| `datos.materias[id].misiones` | `persistencia.guardarMisiones(id, valor)` |
| `datos.lenguajes[id].competencia` | `persistencia.guardarCompetencia(id, valor)` |

## 4. Errores comunes (y cómo los evita el código actual)

| Error | Qué pasa | Prevención implementada |
|---|---|---|
| Aplicar sin `validarSnapshot` | Podés pisar todo con basura | `nube.bajar()` valida; el historial además exige `{ date, score, total, modo }` |
| No confirmar al usuario | Se pierde el progreso local sin aviso | `confirm` con la fecha del respaldo en `restaurarNube` |
| Olvidar `location.reload()` | La UI sigue mostrando el estado viejo | La acción recarga; `aplicarSnapshot` no recarga (así se testea) |
| Llamar `guardarOnboardingHecho()` siempre | El flag queda encendido aunque el respaldo no lo traiga | Solo si `datos.global.onboarding` |
| Pasar del tope de Firestore | El documento se rechaza | Cliente corta en 900 kB (bytes) antes de escribir; las reglas acotan además la longitud |

## 5. Cómo probarlo

1. Unit: `npx vitest run` (incluye `aplicar.test.js`, `snapshot.test.js`, `nube.test.js`,
   `firebase.test.js`, `cuenta.test.js` y la UI de acceso con jsdom).
2. Prueba manual en dos dispositivos/navegadores: en A subí el progreso; en B iniciá sesión,
   restaurá y verificá que se recargue con los datos de A. Después comprobá que Exportar /
   Importar sigan funcionando.

## 6. Contrato de UI (implementado)

- Pantalla: `index.html#screen-cuenta` con `#cuenta-anon` (adentro `#auth-root`, que renderiza
  `src/ui/cuenta/autenticacion.js`) y `#cuenta-sesion` + `#cuenta-aviso`.
- Acciones de `app.js`: `irCuenta`, `salirCuenta`, `subirNube`, `restaurarNube`.
- Los callbacks de `crearAuth` reciben `{ correo, contrasena, nombre }` y rechazan con
  `{ mensaje, campo?, cancelado? }`; `app.js` traduce los resultados de `cuenta.js` con
  `pedirCuenta`.
- Arranque (ADR 008): sin claves → onboarding local o home; con claves y sin sesión → acceso
  (`auth.renderLogin()`) con "Continuar sin cuenta"; con sesión → `entrarConCuenta`, que ofrece
  restaurar si hay respaldo y entra al home.
- `subirNube` / `restaurarNube` usan `cuenta.estado().uid`.

## Referencias

- [ADR 008](../adr/008-cuenta-y-sincronizacion-firestore.md) — decisión completa y limitaciones.
- `src/core/nube/snapshot.js` — formato y validación.
- `src/student/nube.js` — `subir` / `bajar`.
- `src/student/cuenta.js` — sesión y errores en español.
- `src/student/firebase.js` — adaptador, tope y claves `VITE_FIREBASE_*` (`.env.example`).
