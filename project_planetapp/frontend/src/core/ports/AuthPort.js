/**
 * Puerto (interfaz): Autenticación
 * Define qué necesita el dominio/aplicación, sin implementación.
 */

/**
 * @typedef {Object} LoginResult
 * @property {boolean} success
 * @property {import('../../domain/User.js').User} [user]
 * @property {string} [message]
 */

/**
 * @typedef {Object} RegisterResult
 * @property {boolean} success
 * @property {import('../../domain/User.js').User} [user]
 * @property {string} [message]
 */

/**
 * Interfaz del puerto de autenticación
 * @interface
 */
export class AuthPort {
  /**
   * @param {string} email
   * @param {string} password
   * @returns {Promise<LoginResult>}
   */
  async login(email, password) {
    throw new Error('AuthPort.login() must be implemented');
  }

  /**
   * @param {string} nombre
   * @param {string} email
   * @param {string} password
   * @param {string} rol
   * @returns {Promise<RegisterResult>}
   */
  async register(nombre, email, password, rol) {
    throw new Error('AuthPort.register() must be implemented');
  }

  /**
   * Cierra sesión (limpia almacenamiento y redirige si aplica).
   * @returns {void}
   */
  logout() {
    throw new Error('AuthPort.logout() must be implemented');
  }

  /**
   * @returns {boolean} true si hay sesión válida
   */
  checkAuth() {
    throw new Error('AuthPort.checkAuth() must be implemented');
  }

  /**
   * @returns {import('../../domain/User.js').User | null}
   */
  getCurrentUser() {
    throw new Error('AuthPort.getCurrentUser() must be implemented');
  }
}
