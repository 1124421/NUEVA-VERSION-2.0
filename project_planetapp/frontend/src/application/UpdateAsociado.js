/**
 * Caso de uso: Actualizar asociado
 */

import { Asociado } from '../core/domain/Asociado.js';

/**
 * @param {import('../core/ports/AsociadosPort.js').AsociadosPort} asociadosPort
 * @param {number|string} id
 * @param {Object} data
 * @returns {Promise<Asociado>}
 */
export async function UpdateAsociado(asociadosPort, id, data) {
  const asociado = new Asociado(data);
  return asociadosPort.update(id, asociado);
}
