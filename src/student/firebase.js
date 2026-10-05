// Adaptador de Firebase (Auth + Firestore) cargado bajo demanda y activado por entorno.
// Sin las claves VITE_FIREBASE_* la app sigue funcionando solo en local: devuelve null y la
// pantalla de cuenta se oculta. El SDK entra con import() dinámico para no pesar en el chunk
// principal (mismo patrón que la carga de contenido por track).
// Las claves web de Firebase son públicas por diseño; la seguridad real vive en firestore.rules.

// Campos mínimos para inicializar el SDK web; el resto (storageBucket, messagingSenderId) no
// se usa en esta app.
const CAMPOS = ["apiKey", "authDomain", "projectId", "appId"];

// Colección de un documento por usuario (ADR 008): ahí vive el snapshot completo.
export const COLECCION = "estudiantes";

// El snapshot viaja como texto JSON dentro del documento. Así se evitan restricciones de
// campos de Firestore y el esquema del progreso puede cambiar sin tocar el documento.
// Tope medido en bytes UTF-8 (un documento admite 1 MiB): las reglas de firestore.rules
// además acotan la longitud en caracteres.
export const MAX_BYTES = 900000;
export const VERSION_RESPALDO = 1;

export function leerConfig(env) {
  if (!env) return null;
  const config = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    appId: env.VITE_FIREBASE_APP_ID
  };
  // Si falta cualquier campo mínimo no se inicializa a medias: la cuenta queda deshabilitada.
  return CAMPOS.every(campo => config[campo]) ? config : null;
}

// Normaliza el usuario de Firebase al contrato de los servicios (sin tipos del SDK).
function normalizarUsuario(user) {
  if (!user) return null;
  return { uid: user.uid, email: user.email || "", nombre: user.displayName || "" };
}

async function cargarModulosReales() {
  const [app, auth, firestore] = await Promise.all([
    import("firebase/app"),
    import("firebase/auth"),
    import("firebase/firestore")
  ]);
  return { ...app, ...auth, ...firestore };
}

// Crea el adaptador con las operaciones que consumen cuenta/nube. `cargarModulos` se inyecta
// para poder testear el cableado sin cargar el SDK real.
export async function crearAdaptador({ env = import.meta.env, cargarModulos = cargarModulosReales } = {}) {
  const config = leerConfig(env);
  if (!config) return null;
  const api = await cargarModulos();
  const app = api.initializeApp(config);
  const auth = api.getAuth(app);
  const db = api.getFirestore(app);
  return {
    auth: {
      registrar: async (email, pass) =>
        normalizarUsuario((await api.createUserWithEmailAndPassword(auth, email, pass)).user),
      ingresar: async (email, pass) =>
        normalizarUsuario((await api.signInWithEmailAndPassword(auth, email, pass)).user),
      ingresarConGoogle: async () =>
        normalizarUsuario((await api.signInWithPopup(auth, new api.GoogleAuthProvider())).user),
      salir: () => api.signOut(auth),
      enviarReset: email => api.sendPasswordResetEmail(auth, email),
      observar: alCambiar => api.onAuthStateChanged(auth, user => alCambiar(normalizarUsuario(user))),
      actual: () => normalizarUsuario(auth.currentUser)
    },
    store: {
      leer: async uid => {
        const snap = await api.getDoc(api.doc(db, COLECCION, uid));
        if (!snap.exists()) return null;
        return JSON.parse(snap.data().datos);
      },
      escribir: async (uid, datos) => {
        const texto = JSON.stringify(datos);
        // El límite real de Firestore es en bytes: 900 kB deja margen bajo el 1 MiB.
        if (new TextEncoder().encode(texto).length > MAX_BYTES) throw { code: "respaldo-grande" };
        // `actualizadoEn` es serverTimestamp: lo sella el servidor, no el reloj del dispositivo.
        await api.setDoc(api.doc(db, COLECCION, uid), {
          datos: texto,
          version: VERSION_RESPALDO,
          actualizadoEn: api.serverTimestamp()
        });
      }
    }
  };
}

let adaptador = null;

// Singleton perezoso: se crea una sola vez, en la primera acción que necesita la nube.
export function cargarFirebase(env = import.meta.env) {
  if (!adaptador) adaptador = crearAdaptador({ env });
  return adaptador;
}
