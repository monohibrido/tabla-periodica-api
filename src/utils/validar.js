// Convierte un texto a entero y valida que esté en el rango [min, max].
// Devuelve el número, o null si no es válido.
function enteroEnRango(valor, min, max) {
  if (!/^\d+$/.test(String(valor))) return null;
  const n = Number(valor);
  return n >= min && n <= max ? n : null;
}

// Error con código HTTP, para responder 400/404 de forma ordenada.
class ErrorHttp extends Error {
  constructor(status, mensaje) {
    super(mensaje);
    this.status = status;
  }
}

module.exports = { enteroEnRango, ErrorHttp };
