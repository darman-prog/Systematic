// Controlador de ajustes del track: exportar/importar JSON, borrar historial y reiniciar
// progreso. Conserva los diálogos nativos de import/export (decisión del plan) y delega la
// serialización/validación en student/exportacion.js.
import {
  construirExportacion, nombreArchivo, parsearImportacion, aplicarMateria, aplicarCompetencia
} from "../student/exportacion.js";

export function crearAjustes({
  $, persistencia, track, avance, confirm,
  renderStats, renderHistory, irHome, refrescarLenguaje,
  preguntar = mensaje => window.confirm(mensaje),
  avisar = mensaje => alert(mensaje),
  descargar = (datos, nombre) => {
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}) {
  function clearHistory() {
    confirm.pedirConfirmacion({
      titulo: "¿Borrar el historial?",
      mensaje: "Se borran los intentos de esta materia. No se puede deshacer.",
      textoConfirmar: "Borrar historial"
    }).then(ok => {
      if (!ok) return;
      if (!track.materia || !track.materia.id) return;
      avance.borrarHistorial();
      renderHistory();
      renderStats();
    });
  }

  function resetProgreso() {
    confirm.pedirConfirmacion({
      titulo: "¿Reiniciar el progreso?",
      mensaje: "Se eliminan aciertos, fallos, marcas, racha, historial y misiones. Tu XP y logros globales se conservan.",
      textoConfirmar: "Reiniciar todo"
    }).then(ok => {
      if (!ok) return;
      if (!track.materia || !track.materia.id) return;
      avance.reiniciar();
      renderStats();
      renderHistory();
    });
  }

  function exportarDatos() {
    const datos = construirExportacion({ track, avance, persistencia });
    if (!datos) return;
    descargar(datos, nombreArchivo(track));
  }

  function importarDatos(input) {
    const archivo = input.files && input.files[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => {
      try {
        const { tipo, datos } = parsearImportacion(lector.result);

        if (tipo === "competencia") {
          if (!track.lenguaje) {
            avisar("Este archivo es de un lenguaje. Entra al lenguaje para importarlo.");
            return;
          }
          if (datos.lenguaje && datos.lenguaje !== track.lenguaje.id &&
              !preguntar("El archivo es de otro lenguaje («" + datos.lenguaje + "»). ¿Importarlo igual en «" + track.lenguaje.nombre + "»?")) return;
          if (!preguntar("Se reemplazará tu competencia actual con la del archivo. ¿Continuar?")) return;
          aplicarCompetencia({ datos, track, persistencia });
          refrescarLenguaje();
          avisar("Competencia importada correctamente.");
          return;
        }

        // Import de materia: no se permite estando dentro de un lenguaje (claves distintas).
        if (track.lenguaje) {
          avisar("Este archivo es de una materia. Entra a la materia para importarlo.");
          return;
        }
        if (datos.materia && datos.materia !== track.materia.id &&
            !preguntar("El archivo es de otra materia («" + datos.materia + "»). ¿Importarlo igual en «" + track.materia.nombre + "»?")) return;
        if (!preguntar("Se reemplazará tu progreso actual con el del archivo. ¿Continuar?")) return;
        aplicarMateria({ datos, track, persistencia, avance });
        irHome();
        avisar("Progreso importado correctamente.");
      } catch {
        avisar("El archivo no es válido. Debe ser un JSON exportado desde esta app.");
      } finally {
        input.value = "";
      }
    };
    lector.readAsText(archivo);
  }

  return {
    clearHistory,
    resetProgreso,
    exportarDatos,
    importarDatos,
    acciones: {
      clearHistory: () => clearHistory(),
      resetProgreso: () => resetProgreso(),
      exportarDatos: () => exportarDatos(),
      importarArchivo: () => $("import-file").click()
    }
  };
}
