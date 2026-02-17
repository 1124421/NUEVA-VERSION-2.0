/**
 * Caso de uso: Obtener usuario actual
 */

import { User } from '../core/domain/User.js';

/**
 * @param {import('../core/ports/AuthPort.js').AuthPort} authPort
 * @returns {User | null}
 */
export function GetCurrentUser(authPort) {
  return authPort.getCurrentUser();
}
