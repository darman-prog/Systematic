// Estado explícito que reciben los módulos de src/ui/. Los getters son necesarios porque
// track y sesión se reasignan al cambiar de materia o de ronda.
export function crearContexto({ sesiones, track }) {
  return {
    get session() { return sesiones.sesion; },
    get banco() { return track.banco; },
    get glosario() { return track.glosario; },
    get materia() { return track.materia; }
  };
}
