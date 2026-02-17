/**
 * Caso de uso: Verificar si el usuario está autenticado
 */

/**
 * @param {import('../core/ports/AuthPort.js').AuthPort} authPort
 * @returns {boolean}
 */
export function CheckAuth(authPort) {
  return authPort.checkAuth();
}
