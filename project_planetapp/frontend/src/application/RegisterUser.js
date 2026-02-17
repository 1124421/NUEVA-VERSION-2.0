/**
 * Caso de uso: Registro de usuario
 */

import { User } from '../core/domain/User.js';

/**
 * @param {import('../core/ports/AuthPort.js').AuthPort} authPort
 * @param {string} nombre
 * @param {string} email
 * @param {string} password
 * @param {string} rol
 * @returns {Promise<{ success: boolean, user?: User, message?: string }>}
 */
export async function RegisterUser(authPort, nombre, email, password, rol) {
  const result = await authPort.register(nombre, email, password, rol);
  return result;
}
