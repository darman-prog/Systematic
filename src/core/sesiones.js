// Armado de sesiones de práctica: barajado, priorización y preparación de ítems.
// Funciones puras parametrizadas por `rng` (Math.random por defecto) para poder testearlas.
import { esDebil, vencida } from "./progreso.js";

export function shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ordenarPrioridad(lista, obtenerP, rng = Math.random) {
  const grupos = [[], [], []];
  lista.forEach(q => {
    const p = obtenerP(q.id);
    const g = esDebil(p) ? 0 : vencida(p) ? 1 : 2;
    grupos[g].push(q);
  });
  return grupos.reduce((acc, g) => acc.concat(shuffle(g, rng)), []);
}

export function prepararItem(item, barajar = true, rng = Math.random) {
  const copia = Object.assign({}, item);
  if (item.tipo === "dragdrop") {
    copia.piezasRuntime = barajar
      ? shuffle(item.piezas.map((text, i) => ({ pid: item.id + "-p" + i, text })), rng)
      : item.piezas.map((text, i) => ({ pid: item.id + "-p" + i, text }));
  } else if (item.tipo === "ordenar") {
    let barajados = item.bloques.slice();
    if (barajar) {
      barajados = shuffle(item.bloques, rng);
      let intentos = 0;
      while (barajados.join("|") === item.bloques.join("|") && intentos < 5) {
        barajados = shuffle(item.bloques, rng);
        intentos++;
      }
    }
    copia.bloquesRuntime = barajados;
  } else if (item.tipo === "relacionar") {
    const paresIdx = item.pares.map((p, i) => ({ idx: i, texto: p[1] }));
    copia.derecha = barajar ? shuffle(paresIdx, rng) : paresIdx;
  } else if (item.tipo === "multi") {
    copia.correctos = item.correctos.slice();
    if (barajar) {
      const textosCorrectos = item.correctos.map(i => item.options[i]);
      copia.options = shuffle(item.options, rng);
      copia.correctos = textosCorrectos.map(t => copia.options.indexOf(t)).sort((a, b) => a - b);
    }
  } else if (item.tipo === "diagrama") {
    // El lienzo se monta desde los datos originales: sin copia transformada.
  } else if (item.tipo !== "desarrollo") {
    if (barajar) {
      const textoCorrecto = item.options[item.correct];
      copia.options = shuffle(item.options, rng);
      copia.correct = copia.options.indexOf(textoCorrecto);
    }
  }
  return copia;
}

export function respuestaCorrecta(item) {
  if (item.tipo === "dragdrop") return item.respuestas.join(" / ");
  if (item.tipo === "ordenar") return item.bloques.join(" → ");
  if (item.tipo === "relacionar") return item.pares.map(p => p[0] + " → " + p[1]).join(" | ");
  if (item.tipo === "desarrollo") return item.solucion;
  if (item.tipo === "multi") return item.correctos.map(i => item.options[i]).join(" · ");
  if (item.tipo === "diagrama") return resumenDiagrama(item);
  return item.options[item.correct];
}

function resumenDiagrama(item) {
  const partes = ["Diagrama " + (item.subtipo || "ER")];
  if (Array.isArray(item.relacionesEsperadas) && item.relacionesEsperadas.length) {
    partes.push("Relaciones: " + item.relacionesEsperadas.map(r => r.de + " " + r.tipo + " " + r.a).join(" · "));
  }
  if (Array.isArray(item.miembrosPool) && item.miembrosPool.length) {
    partes.push("Miembros: " + item.miembrosPool.map(m => m.de + ": " + m.texto).join(" · "));
  }
  return partes.join(" | ");
}
