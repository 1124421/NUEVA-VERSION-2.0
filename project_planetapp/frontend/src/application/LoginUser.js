/**
 * Caso de uso: Iniciar sesión
 */

import { User } from '../core/domain/User.js';

/**
 * @param {import('../core/ports/AuthPort.js').AuthPort} authPort
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ success: boolean, user?: User, message?: string }>}
 */
export async function LoginUser(authPort, email, password) {
  const result = await authPort.login(email, password);
  return result;
}
