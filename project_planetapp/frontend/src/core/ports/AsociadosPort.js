/**
 * Puerto (interfaz): Asociados
 * Define operaciones CRUD sin implementación.
 */

import { Asociado } from '../domain/Asociado.js';

/**
 * @interface
 */
export class AsociadosPort {
  /**
   * @returns {Promise<Asociado[]>}
   */
  async list() {
    throw new Error('AsociadosPort.list() must be implemented');
  }

  /**
   * @param {Asociado} asociado
   * @returns {Promise<Asociado>}
   */
  async create(asociado) {
    throw new Error('AsociadosPort.create() must be implemented');
  }

  /**
   * @param {number|string} id
   * @param {Asociado} asociado
   * @returns {Promise<Asociado>}
   */
  async update(id, asociado) {
    throw new Error('AsociadosPort.update() must be implemented');
  }

  /**
   * @param {number|string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    throw new Error('AsociadosPort.delete() must be implemented');
  }
}
