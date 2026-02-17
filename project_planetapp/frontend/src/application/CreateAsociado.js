/**
 * Caso de uso: Crear asociado
 */

import { Asociado } from '../core/domain/Asociado.js';

/**
 * @param {import('../core/ports/AsociadosPort.js').AsociadosPort} asociadosPort
 * @param {Object} data
 * @returns {Promise<Asociado>}
 */
export async function CreateAsociado(asociadosPort, data) {
  const asociado = new Asociado(data);
  return asociadosPort.create(asociado);
}
