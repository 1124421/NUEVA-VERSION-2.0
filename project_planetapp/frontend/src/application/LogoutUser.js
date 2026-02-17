/**
 * Caso de uso: Cerrar sesión
 */

/**
 * @param {import('../core/ports/AuthPort.js').AuthPort} authPort
 */
export function LogoutUser(authPort) {
  authPort.logout();
}
