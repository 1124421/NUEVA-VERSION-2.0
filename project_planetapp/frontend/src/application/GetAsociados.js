/**
 * Caso de uso: Listar asociados
 */

import { Asociado } from '../core/domain/Asociado.js';

/**
 * @param {import('../core/ports/AsociadosPort.js').AsociadosPort} asociadosPort
 * @returns {Promise<Asociado[]>}
 */
export async function GetAsociados(asociadosPort) {
  return asociadosPort.list();
}
